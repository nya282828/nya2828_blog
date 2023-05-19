// import rss, {
// 	pagesGlobToRssItems
// } from '@astrojs/rss';
import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function get(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: await pagesGlobToRssItems(
      import.meta.glob('./blog/*.{md,mdx}'),
    ),
	});
}

// export async function get() {
//   return rss({
//     title: SITE_TITLE,
//     description: SITE_DESCRIPTION,
//     site: context.site,
//     items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
//     customData: `<language>en-us</language>`,
//   });
// }