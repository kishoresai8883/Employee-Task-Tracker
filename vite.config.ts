import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Employee-Task-Tracker/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
