// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    outDir: 'dist', // where the build files will go
  },
  server: {
    port: 5173, // dev server port
  },
});