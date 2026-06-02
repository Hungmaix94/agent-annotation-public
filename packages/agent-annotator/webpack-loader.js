const babel = require('@babel/core');
const babelPlugin = require('./babel-plugin');

module.exports = function (source) {
  const resourcePath = this.resourcePath;
  if (!resourcePath.match(/\.(tsx|jsx)$/) || resourcePath.includes('node_modules')) return source;

  try {
    const result = babel.transformSync(source, {
      filename: resourcePath,
      presets: [["@babel/preset-typescript", { isTSX: true, allExtensions: true }]],
      plugins: [
        "@babel/plugin-syntax-jsx",
        babelPlugin
      ],
      sourceMaps: false,
    });
    return result.code;
  } catch (err) {
    return source;
  }
};
