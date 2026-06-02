#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Bắt đầu cài đặt Agent Annotator cho Next.js...');

const projectRoot = process.cwd();

// 1. Kiểm tra project Next.js
const hasPackageJson = fs.existsSync(path.join(projectRoot, 'package.json'));
if (!hasPackageJson) {
  console.error('❌ Không tìm thấy package.json. Vui lòng chạy lệnh này ở thư mục gốc của project Next.js.');
  process.exit(1);
}

// 2. Tạo file inject-source-loader.js
const loaderContent = `const babel = require('@babel/core');

module.exports = function (source) {
  const resourcePath = this.resourcePath;
  if (!resourcePath.match(/\\.(tsx|jsx)$/) || resourcePath.includes('node_modules')) return source;

  try {
    const result = babel.transformSync(source, {
      filename: resourcePath,
      presets: [["@babel/preset-typescript", { isTSX: true, allExtensions: true }]],
      plugins: [
        "@babel/plugin-syntax-jsx",
        function({ types: t }) {
          return {
            visitor: {
              JSXOpeningElement(astPath) {
                if (t.isJSXFragment(astPath.node.name) || !astPath.node.name || !astPath.node.name.name) return;
                
                const line = astPath.node.loc ? astPath.node.loc.start.line : 1;
                
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
                  t.jsxAttribute(t.jsxIdentifier("data-component-source"), t.stringLiteral(\`\${resourcePath}:\${line}\`))
                );
                
                astPath.node.attributes.push(
                  t.jsxAttribute(t.jsxIdentifier("data-component-name"), t.stringLiteral(compName))
                );
              }
            }
          };
        }
      ],
      sourceMaps: false,
    });
    return result.code;
  } catch (err) {
    return source;
  }
};
`;

const loaderPath = path.join(projectRoot, 'inject-source-loader.js');
fs.writeFileSync(loaderPath, loaderContent);
console.log('✅ Đã tạo file inject-source-loader.js');

// 3. Sửa next.config
let nextConfigPath = null;
const configFiles = ['next.config.mjs', 'next.config.js', 'next.config.ts'];
for (const file of configFiles) {
  if (fs.existsSync(path.join(projectRoot, file))) {
    nextConfigPath = path.join(projectRoot, file);
    break;
  }
}

if (!nextConfigPath) {
  console.log('⚠️ Không tìm thấy next.config. Vui lòng tự thêm cấu hình webpack.');
} else {
  const configContent = fs.readFileSync(nextConfigPath, 'utf8');
  if (configContent.includes('inject-source-loader.js')) {
    console.log('✅ next.config đã chứa cấu hình loader.');
  } else {
    console.log('⚠️ Đang thêm cấu hình webpack vào next.config...');
    // Phân tích đơn giản bằng Regex để chèn webpack config
    // Cách an toàn hơn: Tạo một file wrapper hoặc in ra hướng dẫn
    const webpackSnippet = `
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\\.(tsx|jsx)$/,
      exclude: /node_modules/,
      use: [
        options.defaultLoaders.babel,
        { loader: require('path').resolve('./inject-source-loader.js') }
      ]
    });
    return config;
  },`;

    let newContent = configContent;
    if (newContent.includes('const nextConfig = {')) {
      newContent = newContent.replace('const nextConfig = {', `const nextConfig = {${webpackSnippet}`);
    } else if (newContent.includes('export default {')) {
      newContent = newContent.replace('export default {', `export default {${webpackSnippet}`);
    } else if (newContent.includes('module.exports = {')) {
      newContent = newContent.replace('module.exports = {', `module.exports = {${webpackSnippet}`);
    } else {
      console.log('❌ Không thể tự động chèn vào next.config. Vui lòng tự chèn cấu hình webpack.');
    }
    
    if (newContent !== configContent) {
      fs.writeFileSync(nextConfigPath, newContent);
      console.log('✅ Đã cập nhật', path.basename(nextConfigPath));
    }
  }
}

// 4. Cài đặt dependency
console.log('📦 Đang cài đặt thư viện babel...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json')));
  const isYarn = fs.existsSync(path.join(projectRoot, 'yarn.lock'));
  const isPnpm = fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'));
  
  const cmd = isPnpm ? 'pnpm add -D @babel/core @babel/preset-typescript' : 
              isYarn ? 'yarn add -D @babel/core @babel/preset-typescript' : 
              'npm install -D @babel/core @babel/preset-typescript';
              
  execSync(cmd, { stdio: 'inherit' });
  console.log('✅ Đã cài đặt xong các thư viện cần thiết.');
} catch (e) {
  console.error('❌ Cài đặt package thất bại:', e.message);
}

console.log('🎉 Cài đặt Agent Annotator thành công! Vui lòng khởi động lại server Next.js.');
