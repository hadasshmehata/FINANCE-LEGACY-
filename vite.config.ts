import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
  },
  preview: {
    port: parseInt(process.env.PORT || '4173', 10),
    host: true,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-ui': ['clsx', 'tailwind-merge', 'canvas-confetti'],
        },
      },
    },
  },
});
