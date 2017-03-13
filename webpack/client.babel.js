import { join } from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';

const clientConfig = (env = 'dev') => (
  {
    entry: ['babel-polyfill', 'whatwg-fetch', './src/client/index.js'],
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
      new CleanWebpackPlugin(['dist'], {
        root: join(__dirname, '../'),
      }),
      new ManifestPlugin({
        fileName: './dist/manifest.json',
        publicPath: env === 'dev' ? 'http://localhost:8080/' : '/',
        writeToFileEmit: true,
      }),
      new ExtractTextPlugin(env === 'dev' ? 'bundle.[contenthash].css' : './dist/bundle.[contenthash].css'),
    ],
    devServer: {
      contentBase: join(__dirname, '../res'),
      proxy: {
        '!/img/**': 'http://localhost:3000',
      },
    },
    output: {
      publicPath: env === 'dev' ? 'http://localhost:8080/' : '',
      filename: env === 'dev' ? 'bundle.[chunkhash].js' : './dist/bundle.[chunkhash].js',
    },
  }
);

export default clientConfig;
