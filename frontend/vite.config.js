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
  optimizeDeps: {
    include: ['frappe-ui > feather-icons', 'showdown', 'engine.io-client'],
  },
  build: {
    outDir: `../${path.basename(path.resolve('..'))}/public/frontend`,
    emptyOutDir: true,
    commonjsOptions: {
      include: [/tailwind.config.js/, /node_modules/],
    },
    target: 'es2021',
    sourcemap: true,
  },
})
