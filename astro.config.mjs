import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import preact from "@astrojs/preact";
import image from '@astrojs/image';


// https://astro.build/config
export default defineConfig({
  site: 'https://nya2828.com/',
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    extendMarkdownConfig: false,
    smartypants: true,
    gfm: true
  }), sitemap(), preact(), image()]
});