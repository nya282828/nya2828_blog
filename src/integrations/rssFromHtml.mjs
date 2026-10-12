import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import { getRssString } from '@astrojs/rss';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { buildRssContent } from '../utils/rssContent.mjs';

// ビルド後の記事HTMLを解析してrss.xmlを生成する
export default function rssFromHtml() {
  let site;

  return {
    name: 'rss-from-html',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = config.site;
      },
      'astro:build:done': async ({ dir, logger }) => {
        const blogDir = new URL('blog/', dir);
        const entries = await readdir(blogDir, { withFileTypes: true });

        const items = [];
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          const slug = entry.name;
          const html = await readFile(new URL(`${slug}/index.html`, blogDir), 'utf-8').catch(() => null);
          if (!html) continue;

          const $ = cheerio.load(html);
          // draft記事はRSSに含めない
          if ($('article.c-blog[data-draft]').length) continue;

          const link = `/blog/${slug}/`;
          const pageUrl = new URL(link, site).href;
          // 1つ目のtimeが公開日、2つ目は更新日
          const datetime = $('.c-blog__head__date time.t-time').first().attr('datetime');

          items.push({
            title: $('h1.c-blog__title').first().text().trim(),
            description: $('meta[name="description"]').attr('content'),
            pubDate: datetime ? new Date(datetime) : undefined,
            link,
            content: buildRssContent($, { site, pageUrl }),
          });
        }

        items.sort((a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0));

        const xml = await getRssString({
          title: SITE_TITLE,
          description: SITE_DESCRIPTION,
          site,
          items,
          customData: `<language>ja-jp</language>`,
        });

        await writeFile(new URL('rss.xml', dir), xml);
        logger.info(`rss.xml generated (${items.length} items) -> ${fileURLToPath(new URL('rss.xml', dir))}`);
      },
    },
  };
}
