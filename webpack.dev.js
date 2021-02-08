const path = require('path')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')

const PORT = 8081

module.exports = merge (common, {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ 
                    'style-loader', 
                    'css-loader',  
                    'sass-loader'
                ],
            },
            {
                test: /\.(svg|png|PNG|jpeg|jpg)$/i,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images'
                    }
                }
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '',
    },
    devServer: {
        port: PORT,
        host: 'localhost',
        hot: true,
    },
    
})