import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
    updatedDate: z.string().optional().transform((str) => (str ? new Date(str) : undefined)),
    heroImage: image().optional(),
    heroAlt: z.string().optional(),
    tags: z.array(z.string()).optional(),
    footnote: z.string().optional(),
    draft: z.boolean(),
  }),
});

export const collections = { blog };
