import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, Plugin} from 'vite';

function photoUploadPlugin(): Plugin {
  return {
    name: 'photo-upload-handler',
    configureServer(server) {
      server.middlewares.use('/api/upload-hero-photo', (req, res, next) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            try {
              const body = Buffer.concat(chunks).toString();
              const json = JSON.parse(body);
              if (json && json.imageBase64) {
                const base64Data = json.imageBase64.replace(/^data:image\/[^;]+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const targetPath = path.resolve(import.meta.dirname, 'src/assets/images/aman_exact_portrait_1790980182818.jpg');
                const backupPath = path.resolve(import.meta.dirname, 'src/assets/images/aman_uploaded_photo.jpg');
                fs.writeFileSync(targetPath, buffer);
                fs.writeFileSync(backupPath, buffer);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Photo saved permanently to disk' }));
                return;
              }
            } catch (err: any) {
              console.error('Error saving photo:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err.message }));
              return;
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
          });
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), photoUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
