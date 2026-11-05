import {CaseIcon} from '@sanity/icons/Case'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const company = defineType({
  name: 'company',
  type: 'document',
  icon: CaseIcon,
  description: 'A company Zach worked at. Shown in the Portfolio section of the home page.',
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'url', title: 'Website URL', type: 'url'}),
    defineField({
      name: 'logo',
      type: 'image',
      description: 'SVG preferred.',
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences about what the company does.',
    }),
    defineField({
      name: 'roles',
      type: 'array',
      description:
        'Roles held at this company, in the order shown on the home page (drag to reorder).',
      of: [defineArrayMember({type: 'reference', to: [{type: 'role'}]})],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'url', media: 'logo'}},
})
