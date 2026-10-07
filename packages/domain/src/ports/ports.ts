import type { ProjectFiles } from './project-files'

/**
 * Every port of the platform. The mock adapters serve all of them, and so does
 * the application with its real adapters, each port taken from whichever
 * outside service answers it (ADR 0012).
 */
export interface Ports {
  readonly projectFiles: ProjectFiles
}
