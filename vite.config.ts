import path from 'node:path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './src',
  plugins: [
    react(),
  ],
  resolve: {
    alias: [{
      find: '~',
      replacement: path.resolve('./src/'),
    }],
  },
  server: {
    open: true,
  },
});
