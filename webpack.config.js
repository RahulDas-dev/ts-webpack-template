'use strict'
const fs = require('fs')
const path = require('path')
const {DefinePlugin} = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const InterpolateHtmlPlugin = require('interpolate-html-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const {WebpackManifestPlugin} = require('webpack-manifest-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

//const ESLintPlugin = require("eslint-webpack-plugin");

process.on('unhandledRejection', (error) => {
  throw error
})

const config = require('./scripts/app.config')
const getClientEnvironment = require('./scripts/env')
const checkRequiredFiles = require('./scripts/checkRequiredFiles')

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true'

if (!checkRequiredFiles([config.appHtml, config.appIndexJs])) {
  process.exit(1)
}

const env = getClientEnvironment(config.publicUrlOrPath.slice(0, -1))

module.exports = {
  mode: isProduction ? 'production' : isDevelopment && 'development',
  devtool: isProduction ? (shouldUseSourceMap ? 'source-map' : false) : isDevelopment && 'cheap-module-source-map',
  entry: config.appIndexJs,
  output: {
    path: config.appBuild,
    filename: isProduction ? 'js/[name].[contenthash:8].js' : isDevelopment && 'js/bundle.js',
    assetModuleFilename: isProduction ? 'media/[name].[hash][ext]' : isDevelopment && 'media/[name].[ext]',
    publicPath: config.publicUrlOrPath,
  },
  infrastructureLogging: {
    appendOnly: true,
    level: 'log',
    stream: process.stderr,
  },
  stats: {
    colors: true,
    version: true,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
  },
  module: {
    rules: [
      {
        test: /(?!test\.)\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript', '@babel/preset-env'],
              babelrc: false,
              configFile: false,
              compact: isProduction,
            },
          },
        ],
        include: [config.appSrc],
        exclude: [config.appTest, config.appNodeModules],
      },
      {
        test: /\.scss$/,
        use: [
          isDevelopment
            ? require.resolve('style-loader')
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {publicPath: '../..'},
              },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 3,
              sourceMap: isProduction ? shouldUseSourceMap : isDevelopment,
              modules: {
                mode: 'icss',
              },
            },
          },
          isProduction && {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  ['postcss-flexbugs-fixes', {}],
                  [
                    'postcss-preset-env',
                    {
                      autoprefixer: {
                        flexbox: 'no-2009',
                      },
                      stage: 3,
                    },
                  ],
                  'postcss-normalize',
                ],
              },
              sourceMap: isProduction ? shouldUseSourceMap : isDevelopment,
            },
          },
          {loader: 'sass-loader', options: {sourceMap: isProduction ? shouldUseSourceMap : isDevelopment}},
        ].filter(Boolean),
      },
      {
        test: [/\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1000,
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{removeViewBox: false}],
              },
              titleProp: true,
              ref: true,
            },
          },
          {
            loader: require.resolve('file-loader'),
            options: {
              name: 'media/[name].[hash].[ext]',
            },
          },
        ],
        issuer: {
          and: [/\.(js|mjs|ts)$/],
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: config.appHtml,
    }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    //new ESLintPlugin({ extensions: ["ts"] }),
    new InterpolateHtmlPlugin(env.raw),
    new DefinePlugin(env.stringified),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: fs
        .readdirSync(config.appPublic)
        .filter((file) => path.join(config.appPublic, file) !== config.appHtml)
        .map((file) => {
          return {
            from: path.join(config.appPublic, file),
            to: config.appBuild,
          }
        }),
    }),
    isProduction &&
      new WebpackManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: config.publicUrlOrPath,
        generate: (seed, files, entrypoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            manifest[file.name] = file.path
            return manifest
          }, seed)
          const entrypointFiles = entrypoints.main.filter((fileName) => !fileName.endsWith('.map'))

          return {
            files: manifestFiles,
            entrypoints: entrypointFiles,
          }
        },
      }),
    new ESLintPlugin({
      extensions: ['ts'],
      eslintPath: require.resolve('eslint'),
      failOnError: isProduction,
      context: config.appSrc,
      cwd: config.appPath,
    }),
  ].filter(Boolean),
  devServer: {
    port: 3000,
    host: 'localhost',
    hot: true,
  },
}
