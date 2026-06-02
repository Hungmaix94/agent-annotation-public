#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Agent Annotator Installer');

const args = process.argv.slice(2);
if (args[0] !== 'init') {
  console.log('Usage: agent-annotator init');
  process.exit(0);
}

const projectRoot = process.cwd();
if (!fs.existsSync(path.join(projectRoot, 'package.json'))) {
  console.error('❌ Không tìm thấy package.json. Vui lòng chạy lệnh này ở thư mục gốc của project.');
  process.exit(1);
}

console.log('📦 Cài đặt thư viện: agent-annotator, @babel/core, @babel/preset-typescript...');
try {
  const isYarn = fs.existsSync(path.join(projectRoot, 'yarn.lock'));
  const isPnpm = fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'));
  
  const cmd = isPnpm ? 'pnpm add -D agent-annotator @babel/core @babel/preset-typescript' : 
              isYarn ? 'yarn add -D agent-annotator @babel/core @babel/preset-typescript' : 
              'npm install -D agent-annotator @babel/core @babel/preset-typescript';
              
  execSync(cmd, { stdio: 'inherit' });
  console.log('✅ Đã cài đặt xong!');
} catch (e) {
  console.error('❌ Cài đặt thất bại:', e.message);
  process.exit(1);
}

const isNext = fs.existsSync(path.join(projectRoot, 'next.config.js')) || fs.existsSync(path.join(projectRoot, 'next.config.mjs'));
const isVite = fs.existsSync(path.join(projectRoot, 'vite.config.ts')) || fs.existsSync(path.join(projectRoot, 'vite.config.js'));

console.log('\n======================================================');
console.log('🎉 Cài đặt thành công! Bước cuối cùng: Cập nhật file config.');

if (isNext) {
  console.log('Mở file next.config.js (hoặc .mjs) và bọc config bằng withAgentAnnotator:');
  console.log(`
  const { withAgentAnnotator } = require('agent-annotator');
  
  /** @type {import('next').NextConfig} */
  const nextConfig = { ... }
  
  module.exports = withAgentAnnotator(nextConfig);
  `);
} else if (isVite) {
  console.log('Mở file vite.config.ts (hoặc .js) và chèn plugin agentAnnotator:');
  console.log(`
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import { agentAnnotator } from 'agent-annotator';
  
  export default defineConfig({
    plugins: [
      react(),
      agentAnnotator()
    ],
  });
  `);
} else {
  console.log('Vui lòng thêm loader hoặc plugin vào webpack/vite config của bạn!');
}
console.log('======================================================\n');
