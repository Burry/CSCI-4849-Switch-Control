const glob = require('glob');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const generateHTMLPlugins = () =>
    glob.sync('./src/**/*.html').map(
        dir =>
            new HTMLWebpackPlugin({
                filename: path.basename(dir), // Output
                template: dir // Input
            })
    );

module.exports = {
    node: {
        fs: 'empty'
    },
    entry: ['./src/calculator.js', './src/style.scss'],
    output: {
        path: path.resolve(__dirname, '..', 'build'),
        filename: 'app.[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    },
    plugins: [...generateHTMLPlugins()],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
