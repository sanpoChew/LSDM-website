/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const serverConfig = {
  entry: './src/server/index.js',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-es2015-modules-commonjs'],
        },
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
  },
  output: {
    filename: 'index.js',
  },
};

const bundleConfig = {
  entry: {
    base: ['babel-polyfill', 'whatwg-fetch', './src/js/base.js'],
    style: './src/scss/base.scss',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            ['env', { browsers: '> 1% in GB' }],
          ],
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract([
          'css-loader', 'sass-loader',
        ]),
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
  },
  plugins: [
    new CleanWebpackPlugin(['./res/css', './res/js']),
    new ManifestPlugin({
      fileName: './res/webpack-manifest.json',
    }),
    new ExtractTextPlugin('./res/css/[name].[hash].css'),
    new webpack.optimize.UglifyJsPlugin(),
  ],
  output: {
    filename: 'res/js/[name].[hash].js',
  },
};

module.exports = [serverConfig, bundleConfig];
