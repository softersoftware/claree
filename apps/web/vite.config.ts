import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** A sketch is built with the mock adapters only, and runs entirely in the browser (ADR 0013). */
export default defineConfig({
  /** Where the sketch is served from: under its branch's path, once published. */
  base: process.env.CLAREE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: [{ find: /^@\//, replacement: `${path.join(import.meta.dirname, 'src')}/` }] },
  server: { port: 3000 },
});
