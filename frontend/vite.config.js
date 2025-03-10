import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import frappeui from 'frappe-ui/vite'

export default defineConfig({
  plugins: [
    frappeui(),
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },
  server: {
    fs: {
      strict: false,
    },
    allowedHosts: true
  },
  build: {
    outDir: `../${path.basename(path.resolve('..'))}/public/sales-portal`,
    emptyOutDir: true,
    commonjsOptions: {
      include: [/tailwind.config.js/, /node_modules/],
    },
    target: 'es2021',
    sourcemap: true,
  },
  optimizeDeps: {
    include: [
      'feather-icons',
      'showdown',
      'tailwind.config.js',
      'engine.io-client',
      'prosemirror-state',
      'highlight.js/lib/core',
    ],
  },
})
