const path = require('path')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge (common, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 
                    {loader: 'css-loader'   },
                    {loader: 'postcss-loader',
                     options: { postcssOptions:
                        { 
                            config: path.resolve(__dirname, 'postcss.config.js')
                        }}
                    }, 
                    {loader: 'sass-loader'    } ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg|png|PNG|jpeg|jpg)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[contenthash].[ext]',
                        outputPath: 'images'
                    }
                }
            }
        ]
    },
    output: {
        filename: 'bundle.[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        publicPath: ''
    },
    plugins: [  new MiniCssExtractPlugin({filename: '[name].[contenthash].css'}),
                new CleanWebpackPlugin()
    ],
})