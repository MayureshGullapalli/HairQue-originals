import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'stores',
  title: 'Stores',
  type: 'document',
  fields: [
    {
      name: "name",
      type: "string",
      title: "Store name",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "image",
      type: "image",
      title: "Store image",
    },
    {
      name: "time",
      type: "string",
      title: "Store time",
    },
    // {
    //   name: "background",
    //   type: "image",
    //   title: "Store background image",
    // },
  ],
})
