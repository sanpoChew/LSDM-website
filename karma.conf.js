module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      'src/client/index.js',
      'src/client/**/*.spec.js',
    ],
    preprocessors: {
      'src/client/index.js': ['webpack'],
      'src/client/**/*.spec.js': ['webpack'],
    },
    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
          },
        ],
      },
      resolve: {
        modules: ['src', 'node_modules'],
      },
    },
    reporters: ['mocha', 'coverage'],
    browsers: ['PhantomJS'],
  });
};
