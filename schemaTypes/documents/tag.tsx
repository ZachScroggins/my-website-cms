import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'

export const tag = defineType({
  name: 'tag',
  type: 'document',
  icon: TagIcon,
  description: 'A technology, service or topic. Each tag has its own page at /tags/<slug>.',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'Shown on badges, exactly as written (for example "AWS Lambda@Edge").',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 4,
      description: 'What the technology is, shown on its tag page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'homepageUrl',
      title: 'Homepage URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'repoUrl',
      title: 'Repository URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'docsUrl',
      title: 'Documentation URL',
      type: 'url',
      validation: (rule) => rule.uri({scheme: ['https', 'http']}),
    }),
    defineField({
      name: 'icon',
      type: 'object',
      description: 'Small monochrome icon shown on the tag page. Never shown on the home page.',
      options: {collapsible: true, collapsed: true},
      fields: [
        defineField({
          name: 'svg',
          title: 'SVG markup',
          type: 'text',
          rows: 4,
          description:
            'Inline SVG using fill="currentColor" so it follows the site theme (for example exported from react-icons).',
          validation: (rule) =>
            rule.custom((svg) =>
              !svg || /^<svg[\s\S]*<\/svg>$/.test(svg.trim())
                ? true
                : 'Must be a single <svg> element',
            ),
        }),
        defineField({
          name: 'source',
          type: 'string',
          description:
            'Where the icon came from, for example "react-icons/si SiSvelte (Simple Icons, CC0)".',
        }),
      ],
    }),
    defineField({
      name: 'logo',
      type: 'image',
      description: 'Full-color brand logo shown on the tag page. Never shown on the home page.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
        defineField({
          name: 'source',
          type: 'url',
          description: 'Page the logo was taken from (brand kit or press page).',
        }),
        defineField({
          name: 'license',
          type: 'string',
          description:
            'License or usage terms, for example "Apache-2.0" or "Brand guidelines: allowed for referencing the product".',
        }),
      ],
    }),
  ],
  orderings: [{title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]}],
  preview: {
    select: {title: 'name', subtitle: 'slug.current', svg: 'icon.svg', logo: 'logo'},
    prepare({title, subtitle, svg, logo}) {
      return {
        title,
        subtitle,
        media:
          logo ??
          (svg ? (
            <span
              style={{display: 'grid', placeItems: 'center', width: '100%', height: '100%'}}
              dangerouslySetInnerHTML={{__html: svg}}
            />
          ) : (
            TagIcon
          )),
      }
    },
  },
})
