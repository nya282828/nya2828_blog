import type { ImageMetadata } from 'astro';

const allImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/blog/**/*.{jpg,jpeg,JPG,JPEG,png,PNG,webp,WEBP,gif,GIF}',
  { eager: true }
);

export function getPostImages(slug: string): Record<string, ImageMetadata> {
  const prefix = `/src/assets/blog/${slug}/`;
  const result: Record<string, ImageMetadata> = {};
  for (const [path, mod] of Object.entries(allImages)) {
    if (path.startsWith(prefix)) {
      result[path.slice(prefix.length)] = mod.default;
    }
  }
  return result;
}
