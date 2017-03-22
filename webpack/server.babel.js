import nodeExternals from 'webpack-node-externals';

const serverConfig = (env = 'dev') => (
  {
    entry: './src/server/index.js',
    target: 'node',
    externals: [nodeExternals()],
    watch: env === 'dev',
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
  }
);

export default serverConfig;
