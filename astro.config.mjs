import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkUnwrapImgae from 'remark-unwrap-images';
import sitemap from '@astrojs/sitemap';
import preact from "@astrojs/preact";
import rehypeRailWrapper from './src/plugins/rehypeRailWrapper.mjs';


// https://astro.build/config
export default defineConfig({
  site: 'https://nya2828.com/',
  integrations: [mdx({
    syntaxHighlight: 'prism',
    extendMarkdownConfig: false,
    smartypants: true,
    remarkPlugins: [remarkUnwrapImgae],
    rehypePlugins: [rehypeRailWrapper],
    gfm: true,
  }), sitemap(), preact()],
  vite: {
    css: {
      devSourcemap: true,
    },
  }
});