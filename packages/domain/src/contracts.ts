/**
 * What every adapter of a port must do, as tests. Exported apart from the
 * rules, so that nothing at runtime imports them (ADR 0012).
 */
export * from './ports/authentication.contract'
export * from './ports/project-files.contract'
