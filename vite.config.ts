import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'spa-fallback-200',
      closeBundle() {
        const distDir = path.resolve(__dirname, 'dist');
        const indexPath = path.join(distDir, 'index.html');
        const fallbackPath = path.join(distDir, '200.html');
        const redirectsPath = path.join(distDir, '_redirects');

        // Eliminar _redirects si el caché de Cloudflare lo restauró (previene error 100324)
        if (fs.existsSync(redirectsPath)) {
          fs.unlinkSync(redirectsPath);
          console.log('[spa-fallback-200] Removed cached dist/_redirects to prevent Cloudflare error 100324');
        }

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, fallbackPath);
          console.log('[spa-fallback-200] Successfully generated dist/200.html for Cloudflare Pages SPA routing');
        }
      },
    },
  ],
  build: {
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
