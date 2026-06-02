module.exports = function(babel) {
  const { types: t } = babel;
  return {
    visitor: {
      JSXOpeningElement(astPath, state) {
        if (t.isJSXFragment(astPath.node.name) || !astPath.node.name || !astPath.node.name.name) return;
        
        const line = astPath.node.loc ? astPath.node.loc.start.line : 1;
        const resourcePath = state.filename || "UnknownFile";
        
        let compName = "ServerComponent";
        const functionParent = astPath.getFunctionParent();
        if (functionParent) {
          if (functionParent.node.id && functionParent.node.id.name) {
            compName = functionParent.node.id.name;
          } else if (functionParent.parentPath && functionParent.parentPath.isVariableDeclarator() && functionParent.parentPath.node.id.name) {
            compName = functionParent.parentPath.node.id.name;
          }
        }
        
        astPath.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier("data-component-source"), t.stringLiteral(`${resourcePath}:${line}`))
        );
        
        astPath.node.attributes.push(
          t.jsxAttribute(t.jsxIdentifier("data-component-name"), t.stringLiteral(compName))
        );
      }
    }
  };
};
