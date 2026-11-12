import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];

if (!slug || !/^[\w-]+$/.test(slug)) {
  console.error('Usage: pnpm new <slug>  (英数字・_・- のみ)');
  process.exit(1);
}

const postPath = join(root, 'src/content/blog', `${slug}.mdx`);
const assetDir = join(root, 'src/assets/blog', slug);

if (existsSync(postPath)) {
  console.error(`既に存在します: ${postPath}`);
  process.exit(1);
}

const now = new Date();
const date = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
].join('/');

const template = readFileSync(join(root, 'templates/post.mdx'), 'utf8');
writeFileSync(postPath, template.replaceAll('{{slug}}', slug).replaceAll('{{date}}', date));

mkdirSync(assetDir, { recursive: true });
const gitkeep = join(assetDir, '.gitkeep');
if (!existsSync(gitkeep)) writeFileSync(gitkeep, '');

console.log(`created: src/content/blog/${slug}.mdx`);
console.log(`created: src/assets/blog/${slug}/`);
