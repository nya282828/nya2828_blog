import { z, defineCollection, reference } from 'astro:content';

// コンテンツタイプblog記事のコンテンツスキーマ
const blog = defineCollection({
	// Type-check frontmatter using a schema
	type: 'content',
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: image().optional(),
		// heroImage: z.string().optional(),
		heroAlt: z.string().optional(),
		// heroImage: z.object({
    //   src: z.string(),
    //   alt: z.string(),
    // }).optional(),
		tags: z.array(
			z.string()
		).optional(),
		footnote: z.string().optional(),
		draft: z.boolean(),
	}),
});

export const collections = {
	'blog': blog,
};
