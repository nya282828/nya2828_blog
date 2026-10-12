import sanitizeHtml from 'sanitize-html';
import * as cheerio from 'cheerio';

// ビルド済み記事HTMLから、RSSリーダー向けに整形した本文HTMLを作る
export function buildRssContent($, { site, pageUrl }) {
  const body = $('.c-blog__body').first();
  if (body.length === 0) return '';

  const toAbsolute = (url) => {
    if (!url) return url;
    if (url.startsWith('#')) return pageUrl + url;
    try {
      return new URL(url, pageUrl).href;
    } catch {
      return url;
    }
  };

  // ヒーロー画像を先頭に追加（低解像度のダミー画像は除外）
  const hero = $('.c-blog__head__hero img.c-image__body').first();
  if (hero.length) {
    body.prepend(`<figure>${$.html(hero)}</figure>`);
  }

  // Ai2htmlはscriptで描画されるため、script内のHTMLから画像を取り出して置き換える
  body.find('div[id^="ai2html-"]').each((_, el) => {
    const container = $(el);
    const alt = container.attr('aria-label') ?? '';
    const script = container.next('script').text();
    const match = script.match(/const html = ("(?:[^"\\]|\\.)*");/);
    let src;
    if (match) {
      try {
        const $inner = cheerio.load(JSON.parse(match[1]));
        src = $inner('.g-artboard img').first().attr('src');
      } catch {
        src = undefined;
      }
    }
    if (src) {
      container.replaceWith($('<img>').attr({ src, alt }));
    } else {
      container.replaceWith($('<p>').text(alt));
    }
  });

  // 表示に関係しない要素を削除
  body.find('script, style, noscript, template, img.c-image__lazy, [aria-hidden="true"]').remove();

  // レイアウト用のラッパーを外す
  body.find('div.l-rail, div.c-image-grid, div.c-image, div.c-chart, div.c-movie').each((_, el) => {
    $(el).replaceWith($(el).contents());
  });

  // 画像は単一のsrcに統一し、絶対URLにする
  body.find('img').each((_, el) => {
    const img = $(el);
    img.attr('src', toAbsolute(img.attr('src')));
    img.removeAttr('srcset sizes loading decoding');
  });

  body.find('a[href]').each((_, el) => {
    const a = $(el);
    a.attr('href', toAbsolute(a.attr('href')));
  });

  return sanitizeHtml(body.html(), {
    allowedTags: [
      'p', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'figure', 'figcaption',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'em', 'strong', 'del', 's',
      'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'sup', 'sub', 'section',
    ],
    allowedAttributes: {
      a: ['href'],
      img: ['src', 'alt', 'width', 'height'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    // 中身のない段落・キャプション・figureを除去
    exclusiveFilter: (frame) =>
      ['p', 'figcaption', 'figure'].includes(frame.tag) &&
      !frame.text.trim() &&
      frame.mediaChildren.length === 0,
  }).trim();
}
