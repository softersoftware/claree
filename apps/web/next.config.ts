import path from 'node:path'
import type { NextConfig } from 'next'

/** A prototype is built with the mock adapters only, and nothing else (ADR 0006). */
const adapters = './src/adapters/mock.ts'

const nextConfig: NextConfig = {
  /** A self-contained server, so the platform runs from its Docker image alone. */
  output: 'standalone',
  /** The monorepo root, so the workspace packages are traced into that server. */
  outputFileTracingRoot: path.join(__dirname, '../..'),
  turbopack: { resolveAlias: { '@/adapters': adapters } },
}

export default nextConfig
