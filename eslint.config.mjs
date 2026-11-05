import studio from '@sanity/eslint-config-studio'

export default [
  // Build output: `sanity build` (dist) and `sanity blueprints plan/deploy` (functions/**/.build).
  {ignores: ['dist/', 'functions/**/.build/']},
  ...studio,
]
