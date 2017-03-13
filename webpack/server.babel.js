import nodeExternals from 'webpack-node-externals';

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

export default serverConfig;
