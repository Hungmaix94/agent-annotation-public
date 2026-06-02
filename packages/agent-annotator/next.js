function withAgentAnnotator(nextConfig = {}) {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.isServer) {
        config.module.rules.push({
          test: /\.(tsx|jsx)$/,
          exclude: /node_modules/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: require.resolve('./webpack-loader.js')
            }
          ]
        });
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      return config;
    }
  });
}

module.exports = { withAgentAnnotator };
