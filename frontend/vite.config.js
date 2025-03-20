import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Enables proper client-side routing
  },
  build: {
    outDir: 'dist', // Ensure correct output directory
  }
});
