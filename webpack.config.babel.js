import { resolve } from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import Webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const config = () => ([
  {
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
  },
  {
    entry: {
      bundle: ['babel-polyfill', 'whatwg-fetch', './src/client/index.js'],
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: [
              ['env', { browsers: '> 1% in GB', useBuiltIns: true }],
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
      new CleanWebpackPlugin(['dist']),
      new ManifestPlugin(),
      new ExtractTextPlugin('[name].[contenthash].css'),
      new Webpack.optimize.UglifyJsPlugin(),
    ],
    output: {
      path: resolve('./dist'),
      filename: '[name].[chunkhash].js',
    },
  },
]);

export default config;
