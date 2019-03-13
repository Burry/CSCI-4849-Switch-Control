require('dotenv');

const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');

const stylesheetLoaders = ['style-loader', 'css-loader', 'postcss-loader'];

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: 'src',
        watchContentBase: true,
        hot: true,
        open: true,
        port: process.env.PORT || 8080,
        host: process.env.HOST || 'localhost'
    },
    module: {
        rules: [
            {
                // Load CSS stylesheets
                test: /\.css$/,
                use: stylesheetLoaders
            },
            {
                // Load Sass stylesheets
                test: /\.(sass|scss)$/,
                use: [...stylesheetLoaders, 'sass-loader']
            }
        ]
    },
    plugins: [new webpack.HotModuleReplacementPlugin()]
});
