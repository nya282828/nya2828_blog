// import rss, {
// 	pagesGlobToRssItems
// } from '@astrojs/rss';
import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

const postImportResult = import.meta.glob('../content/blog/**/*.{md,mdx}', { eager: true });
const posts = Object.values(postImportResult);

export const get = () => rss({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  site: import.meta.env.SITE,
  items: posts.map((post) => ({
    link: post.url,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate,
  }))
});

// export async function get(context) {
// 	const posts = await getCollection('blog');
// 	return rss({
// 		title: SITE_TITLE,
// 		description: SITE_DESCRIPTION,
// 		site: context.site,
// 		items: await pagesGlobToRssItems(
//       import.meta.glob('./blog/*.{md,mdx}'),
//     ),
// 	});
// }
