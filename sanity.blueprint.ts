import {defineBlueprint, defineSyncTagInvalidateFunction} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    // Revalidates the site's cache when published content changes. One per dataset.
    defineSyncTagInvalidateFunction({
      name: 'invalidate-tags',
      event: {resource: {type: 'dataset', id: 'e3qg8tui.production'}},
      env: {SITE_URL: 'https://zachscroggins.com'},
    }),
  ],
})
