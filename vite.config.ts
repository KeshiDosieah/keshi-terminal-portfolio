import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Plotly requests this exact filename relative to topojsonURL.
        // Other assets retain Vite's normal hashed filenames.
        assetFileNames: (asset) => asset.name === 'world_110m.json'
          ? 'assets/meteorites/geography/[name][extname]'
          : 'assets/[name]-[hash][extname]',
      },
    },
  },
});
