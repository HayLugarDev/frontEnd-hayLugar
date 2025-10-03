import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  define: { 'process.env': process.env },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['haylugar.com.ar'],
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <-- backend
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      'fast-deep-equal': 'fast-deep-equal/es6',
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
  },
});
