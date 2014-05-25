module.exports = function(config) {
  config.set({
    basePath: '../',
    autoWatch: false,
    port: 9876,
    colors: true,
    captureTimeout: 60000,
    singleRun: true,
    logLevel: config.LOG_INFO,
    frameworks: ['mocha'],
    reporters: ['progress'],
    files: [
      'build/build.js',
      'test/specs/**/*.js'
    ],
    browsers: [
      'Chrome',
      'Firefox',
      'Safari'
    ]
  });
};
