import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const role = defineType({
  name: 'role',
  type: 'document',
  icon: UserIcon,
  description: 'A job title held at a company. Add it to the company to show it on the home page.',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'For example "Senior Software Engineer".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'accomplishments',
      type: 'array',
      description:
        'Portfolio articles shown under this role on the home page, in this order (drag to reorder). Each shows its accomplishment line and tags.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'post'}],
          options: {filter: 'kind == "portfolio-article"'},
        }),
      ],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {title: 'title', count: 'accomplishments.length'},
    prepare({title, count}) {
      return {title, subtitle: `${count ?? 0} accomplishments`}
    },
  },
})
