import { resolve } from 'path';
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import nodeExternals from 'webpack-node-externals';

const config = (env = {}) => ([
  {
    entry: './src/server/index.js',
    target: 'node',
    externals: [nodeExternals()],
    watch: env.dev,
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
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
      bundle: './src/client/index.js',
    },
    watch: env.dev,
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
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
          }),
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
      new webpack.optimize.UglifyJsPlugin(),
    ],
    output: {
      path: resolve('./dist'),
      filename: '[name].[chunkhash].js',
    },
  },
]);

module.exports = config;
