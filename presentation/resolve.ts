import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

const home = {title: 'Home page (Portfolio)', href: '/#portfolio'}

export const resolve: PresentationPluginOptions['resolve'] = {
  // Which document to open when the preview is on a given route. First match wins.
  mainDocuments: defineDocuments([
    {route: '/blog/:slug', filter: `_type == "post" && slug.current == $slug`},
    {route: '/tags/:slug', filter: `_type == "tag" && slug.current == $slug`},
  ]),
  // The "Used on" links shown on each document.
  locations: {
    post: defineLocations({
      select: {title: 'title', slug: 'slug.current', kind: 'kind'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.title || 'Untitled', href: `/blog/${doc?.slug}`},
          {title: 'Blog', href: '/blog'},
          ...(doc?.kind === 'portfolio-article' ? [home] : []),
        ],
      }),
    }),
    tag: defineLocations({
      select: {name: 'name', slug: 'slug.current'},
      resolve: (doc) => ({
        locations: [
          {title: doc?.name || 'Untitled', href: `/tags/${doc?.slug}`},
          {title: 'Tags', href: '/tags'},
        ],
      }),
    }),
    company: defineLocations({locations: [home]}),
    role: defineLocations({locations: [home]}),
  },
}
