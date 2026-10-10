import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { mockSignInFiles } from '@claree/mock-adapters'
import { productName } from './src/product'

/**
 * The adapters are chosen when the application is built, not when it starts:
 * built with `CLAREE_ADAPTERS=mock`, it runs the server in the browser with the
 * mocks only; built without, it calls the server it is served from (ADR 0012, 0016).
 */
const mock = process.env.CLAREE_ADAPTERS === 'mock'

/** GitHub's sign-in pages as the mock imitates them, served beside the application (ADR 0016). */
const mockSignInPages = (): Plugin => {
  const pages = mockSignInFiles(productName)
  return {
    name: 'sign-in-pages',
    configureServer(server) {
      server.middlewares.use(`${server.config.base}github`, (request, response, next) => {
        const page = pages[(request.url ?? '').split('?')[0]?.slice(1) ?? '']
        if (page === undefined) return next()
        response.setHeader('content-type', 'text/html; charset=utf-8')
        response.end(page)
      })
    },
    generateBundle() {
      for (const [name, source] of Object.entries(pages))
        this.emitFile({ type: 'asset', fileName: `github/${name}`, source })
    },
  }
}

export default defineConfig({
  /** Where the application is served from: a sketch or a prototype, under its branch's path. */
  base: process.env.CLAREE_BASE ?? '/',
  plugins: [react(), tailwindcss(), ...(mock ? [mockSignInPages()] : [])],
  resolve: {
    alias: [
      { find: /^@\/adapters$/, replacement: path.join(import.meta.dirname, `src/adapters/${mock ? 'mock' : 'real'}.ts`) },
      { find: /^@\//, replacement: `${path.join(import.meta.dirname, 'src')}/` },
    ],
  },
  server: { port: 3000, proxy: mock ? undefined : { '/api': 'http://localhost:3001' } },
})
