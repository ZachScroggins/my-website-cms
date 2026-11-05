import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'e3qg8tui',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  /**
   * The site lives in the sibling repo ../my-website. TypeGen reads its GROQ queries
   * and writes the generated types into that repo (committed there).
   */
  typegen: {
    path: '../my-website/{app,components,lib,sanity}/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../my-website/sanity/types.ts',
  },
})
