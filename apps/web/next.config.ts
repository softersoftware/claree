import path from 'node:path'
import type { NextConfig } from 'next'

/**
 * The adapters are chosen when the platform is built, not when it starts: built
 * with `CLAREE_ADAPTERS=mock`, it contains no real adapter; built without, no
 * mock (ADR 0012).
 */
const adapters = process.env.CLAREE_ADAPTERS === 'mock' ? './src/adapters/mock.ts' : './src/adapters/real.ts'

const nextConfig: NextConfig = {
  /** A self-contained server, so the platform runs from its Docker image alone. */
  output: 'standalone',
  /** The monorepo root, so the workspace packages are traced into that server. */
  outputFileTracingRoot: path.join(__dirname, '../..'),
  turbopack: { resolveAlias: { '@/adapters': adapters } },
}

export default nextConfig
