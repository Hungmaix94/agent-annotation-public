const babel = require('@babel/core');
const babelPlugin = require('./babel-plugin');

function agentAnnotator() {
  return {
    name: 'agent-annotator',
    enforce: 'pre',
    transform(code, id) {
      if (!id.match(/\.(tsx|jsx)$/) || id.includes('node_modules')) return;

      try {
        const result = babel.transformSync(code, {
          filename: id,
          presets: [["@babel/preset-typescript", { isTSX: true, allExtensions: true }]],
          plugins: [
            "@babel/plugin-syntax-jsx",
            babelPlugin
          ],
          sourceMaps: true,
        });
        return { code: result.code, map: result.map };
      } catch (err) {
        return;
      }
    }
  };
}

module.exports = { agentAnnotator };
