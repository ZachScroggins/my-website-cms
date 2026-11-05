import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const POST_KINDS = [
  {title: 'Post', value: 'post'},
  {title: 'Portfolio article', value: 'portfolio-article'},
] as const

const isPortfolioArticle = (document: unknown) =>
  (document as {kind?: string} | undefined)?.kind === 'portfolio-article'

export const post = defineType({
  name: 'post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'portfolio', title: 'Portfolio'},
  ],
  fields: [
    defineField({
      name: 'kind',
      type: 'string',
      group: ['content', 'portfolio'],
      description:
        'A portfolio article is about one accomplishment in the Portfolio section of the home page. Link it from a role to show it there.',
      options: {list: [...POST_KINDS], layout: 'radio', direction: 'horizontal'},
      initialValue: 'post',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Summary shown in post lists and used for SEO.',
      validation: (rule) => [
        rule.required(),
        rule.max(200).warning('Keep it under 200 characters for search results.'),
      ],
    }),
    defineField({
      name: 'accomplishment',
      type: 'text',
      rows: 3,
      group: 'portfolio',
      description: 'The line shown under the role on the home page. It links to this article.',
      hidden: ({document}) => !isPortfolioArticle(document),
      validation: (rule) =>
        rule.custom((value, {document}) =>
          isPortfolioArticle(document) && !value
            ? 'Portfolio articles need an accomplishment'
            : true,
        ),
    }),
    defineField({
      name: 'tags',
      type: 'array',
      group: ['content', 'portfolio'],
      of: [defineArrayMember({type: 'reference', to: [{type: 'tag'}]})],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'content',
      description: 'Optional cover image.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, {parent}) =>
              (parent as {asset?: unknown})?.asset && !alt ? 'Describe the image' : true,
            ),
        }),
      ],
    }),
    defineField({
      name: 'body',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({name: 'caption', type: 'string'}),
          ],
        }),
        defineArrayMember({
          type: 'code',
          options: {
            withFilename: true,
            languageAlternatives: [
              {title: 'TypeScript', value: 'typescript'},
              {title: 'TSX', value: 'tsx'},
              {title: 'JavaScript', value: 'javascript'},
              {title: 'JSX', value: 'jsx'},
              {title: 'JSON', value: 'json'},
              {title: 'HTML', value: 'html'},
              {title: 'CSS', value: 'css'},
              {title: 'Shell', value: 'sh'},
              {title: 'Python', value: 'python'},
              {title: 'SQL', value: 'sql'},
              {title: 'YAML', value: 'yaml'},
              {title: 'Markdown', value: 'markdown'},
            ],
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Published, newest first',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', kind: 'kind', publishedAt: 'publishedAt', media: 'image'},
    prepare({title, kind, publishedAt, media}) {
      const kindTitle = POST_KINDS.find((k) => k.value === kind)?.title ?? 'Post'
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Unpublished'
      return {title, subtitle: `${kindTitle} · ${date}`, media}
    },
  },
})
