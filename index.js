// Zaladuj odpowiednie moduly / zaleznosci
const express = require( 'express' );
const http = require( 'http' );
const socketIo = require( 'socket.io' );

// Stworz aplikacje express
const app = express();

// Stworz serwer HTTP na podstawie aplikacji express
const server = http.createServer( app );

// Podepnij socket.io do utworzonego uprzednio serwera
const io = socketIo( server );
const UsersService = require( './UsersService' );
const usersService = new UsersService();

// Ustaw w aplikacji express miejsce "/public" z ktorego beda serwowowane pliki
app.use( express.static( `${ __dirname }/public` ) );

// Skonfiguruj routing ktory bedzie nasluchiwal na "/" a w odpowiedzi odsylal plik index.html
app.get( '/', ( req, res ) => {
    res.sendFile( `${ __dirname }/index.html` );
});

io.on( 'connection', ( socket ) => {
    socket.on( 'join', ( name ) => {
        usersService.addUser ({
            if: socket.id,
            name
        });

        io.emit( 'update', {
            users: usersService.getAllUsers()
        });
    });
});

io.on( 'connection', ( socket ) => {
    socket.on( 'disconnect', () => {
        usersService.removeUser( socket.id );
        socket.broadcast.emit( 'update', {
            users: usersService.getAllUsers()
        });
    });
});

io.on( 'connection', ( socket ) => {
    socket.on( 'message', ( message ) => {
        const { name } = usersService.getUserById( socket.id );
        socket.broadcast.emit( 'message', {
            text: message.text,
            from: name
        });
    });
})

// Uruchom serwer i nasluchuj na zapytania przychodzace od klientow
server.listen( 3000, () => {
    console.log( 'listening on *:3000' );
});