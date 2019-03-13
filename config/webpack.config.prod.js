const cssnano = require('cssnano');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin')
    .default;
const HtmlMinifierPlugin = require('html-minifier-webpack-plugin');

const common = require('./webpack.config.common.js');

const stylesheetLoaders = [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader'
];

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimize: true
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
            },
            {
                // Load all images as base64 encoding if they are smaller than 8192 bytes
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // On development we want to see where the file is coming from, hence we preserve the [path]
                            name: '[path][name].[ext]?hash=[hash:20]',
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano,
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new HTMLInlineCSSWebpackPlugin(),
        new HtmlMinifierPlugin({
            collapseWhitespace: true
        })
    ]
});
