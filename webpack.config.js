const path = require( 'path' );
const htmlWebpackPlugin = require( 'html-webpack-plugin' );

// webpack.config.js
module.exports = ( env ) => {
    return {
        mode: env || 'production',
        entry: './client/index.js',
        plugins: [new htmlWebpackPlugin({
            template: './client/index.html',
            filename: 'index.html',
            inject: 'body'
        })],
        output: {
            path: path.resolve( __dirname, 'build' ),
            filename: 'app.bundle.js'
        },
        // entry: './client.index.js',
        output: {
            path: path.resolve( __dirname, 'public' ),
            filename: 'app.bundle.js'
        },
        devServer: {
            proxy: {
                'socket.io': {
                    target: 'http://localhost:3000',
                    ws: true
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    options: {
                        plugins: env !== 'production' ? ["react-hot-loader/babel"] : []
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: 'style-loader' },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true
                            }
                        }
                    ]
                }
            ]
        },
        
    }
};