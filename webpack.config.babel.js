import { join } from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import Webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const config = (env = {}) => {
  const clientBundle = {
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

  const serverBundle = {
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
              ['env', {
                targets: {
                  browsers: '> 1% in GB',
                  uglify: true,
                },
                useBuiltIns: true,
              }],
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
      new ManifestPlugin({
        fileName: './dist/manifest.json',
        publicPath: env.dev ? 'http://localhost:8080/' : '/',
        writeToFileEmit: true,
      }),
      new ExtractTextPlugin('[name].[contenthash].css'),
      new Webpack.optimize.UglifyJsPlugin(),
    ],
    output: {
      filename: '[name].[chunkhash].js',
    },
  };

  if (env.dev) {
    serverBundle.devServer = {
      contentBase: join(__dirname, 'res'),
      proxy: {
        '!/img/**': 'http://localhost:3000',
      },
    };
    serverBundle.output.publicPath = 'http://localhost:8080/';
  }

  return [serverBundle, clientBundle];
};

export default config;
