import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection('blog');

  return rss({
    title: 'SITE_TITLE',
    description: 'SITE_DESCRIPTION',
    site: context.site,
    items:blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      customData: post.data.customData,
      link: `/blog/${post.slug}/`,
      content: sanitizeHtml(parser.render(post.body)),
      // enclosure: {
      //   url: post.data.heroImage,
      //   length: 0
      // } // ogpを出したい
    })),
    customData: `<language>ja-jp</language>`,
  });
}
