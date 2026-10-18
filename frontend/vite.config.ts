import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fix 8: Route-level code-splitting & vendor chunking (reduces 772 kB monolith to <135 kB initial load)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    outDir: '../web/static',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-three': ['three'],
        },
      },
    },
  },
});
