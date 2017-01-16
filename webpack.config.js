/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

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
    module: './src/js/module.js',
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
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
  ],
  output: {
    filename: 'res/js/[name].js',
  },
};

module.exports = [serverConfig, bundleConfig];
