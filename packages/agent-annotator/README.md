# Agent Annotator Integrations

This package automatically integrates your Next.js or Vite React project with the [Agent Context Annotator](https://github.com/Hungmaix94/agent-annotation) Chrome Extension.

It injects absolute file paths into the HTML DOM so the AI Agent can precisely locate and modify your Source Code components directly from the browser!

## 🚀 Quick Setup (Recommended)

Run the CLI directly in the root directory of your Next.js or Vite project:

```bash
npx agent-annotator init
```

The CLI will automatically:
- Detect your configuration file (`next.config.js` or `vite.config.ts`)
- Install necessary Babel core dependencies
- Print out the simple 3-line code snippet you need to add to your config.

---

## 🛠️ Manual Installation

If you prefer to configure it manually:

### 1. Install the package
```bash
yarn add -D agent-annotator @babel/core @babel/preset-typescript
```

### 2. Configure your bundler

**For Next.js (`next.config.js` or `next.config.mjs`)**:
```javascript
const { withAgentAnnotator } = require('agent-annotator');

/** @type {import('next').NextConfig} */
const nextConfig = { ... };

module.exports = withAgentAnnotator(nextConfig);
```

**For Vite (`vite.config.ts` or `vite.config.js`)**:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { agentAnnotator } from 'agent-annotator';

export default defineConfig({
  plugins: [
    react(),
    agentAnnotator()
  ]
});
```

## 🎯 How it works
This package uses a Babel Plugin to automatically inject `data-component-source` and `data-component-name` attributes into every React Component. The Chrome Extension reads these attributes to map the rendered HTML elements directly back to their absolute file paths on your local machine.

*Note: This is designed for Local/Development use alongside the Local MCP Server. It does not affect production builds if you conditionally disable it.*
