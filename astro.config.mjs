import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import remarkUnwrapImgae from 'remark-unwrap-images';
import sitemap from '@astrojs/sitemap';
import preact from "@astrojs/preact";
import rehypeRailWrapper from './src/plugins/rehypeRailWrapper.mjs';
import rssFromHtml from './src/integrations/rssFromHtml.mjs';


// https://astro.build/config
export default defineConfig({
  site: 'https://nya2828.com/',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkUnwrapImgae],
      rehypePlugins: [rehypeRailWrapper],
    }),
  },
  integrations: [mdx({
    syntaxHighlight: 'prism',
    extendMarkdownConfig: false,
    smartypants: true,
    gfm: true,
  }), sitemap(), preact(), rssFromHtml()],
  vite: {
    css: {
      devSourcemap: true,
    },
  }
});