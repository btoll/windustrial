const path = require('path');
// Will create an index.html file and put it in `dist` with a link to the bundled js.
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // `babel-polyfill` is needed for the generator in config.js and MUST be first in the array!
    entry: [
        '@babel/polyfill',
        './client/index.js'
    ],

    // TODO: Make sure we're code splitting.
    // https://reactjs.org/docs/code-splitting.html
    // https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bft.js',
        publicPath: '/'
    },

    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader' },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            { test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader', {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true, // webpack@1.x
                            disable: true, // webpack@2.x and newer
                        },
                    }
                ]
            }]
    },

    // Needed for refreshing the page.
    // This tells webpack to get the assets from the publicPath, and then react-router kicks in and
    // loads the /popular assets or wherever you were when the refresh occurred.
    devServer: {
        historyApiFallback: true,
        port: 4000
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html'
        })
    ]
};

