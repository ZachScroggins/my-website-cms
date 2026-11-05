import {syncTagInvalidateEventHandler} from '@sanity/functions'

/**
 * Runs when published content changes and is queryable. It sends the stale sync tags to the site's
 * /api/revalidate-tags route (my-website/app/api/revalidate-tags/route.ts), which expires the
 * matching Next.js cache entries. Then `done` releases the change to the site's
 * `<SanityLive waitFor="function">`, which refreshes open pages.
 *
 * Env: SITE_URL (set in sanity.blueprint.ts) and SANITY_REVALIDATE_SECRET
 * (`npx sanity functions env add invalidate-tags SANITY_REVALIDATE_SECRET <value>`).
 * `sanity functions test` runs against LOCAL_SITE_URL (default http://localhost:3000) instead.
 */
export const handler = syncTagInvalidateEventHandler(async ({context, event, done}) => {
  const {syncTags} = event.data
  const {SANITY_REVALIDATE_SECRET} = process.env
  const SITE_URL = context.local
    ? process.env.LOCAL_SITE_URL || 'http://localhost:3000'
    : process.env.SITE_URL

  try {
    if (!SITE_URL || !SANITY_REVALIDATE_SECRET) {
      throw new Error('SITE_URL and SANITY_REVALIDATE_SECRET must be set')
    }
    const response = await fetch(new URL('/api/revalidate-tags', SITE_URL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SANITY_REVALIDATE_SECRET}`,
      },
      body: JSON.stringify({tags: syncTags}),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) {
      throw new Error(`${response.status} ${(await response.text()).slice(0, 200)}`)
    }
    console.log(`Revalidated ${syncTags.length} tags on ${SITE_URL}`)
  } catch (error) {
    // Log and carry on: the page cache still expires on its own (cacheLife), and live clients
    // must not be left waiting.
    console.error('Revalidation failed:', error)
  } finally {
    // Always call done. Until it resolves, clients using waitFor="function" hold the update back.
    try {
      await done(syncTags)
    } catch (error) {
      console.error('Calling done failed:', error)
    }
  }
})
