const path = require('path');

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: require.resolve('path-browserify'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    zlib: require.resolve('browserify-zlib'),
    querystring: require.resolve('querystring-es3'),
    url: require.resolve('url/'),
    http: require.resolve('stream-http'),
    util: require.resolve('util/'),
    fs: false, // Not needed in frontend
    net: false, // Not needed in frontend
  };
  return config;
};