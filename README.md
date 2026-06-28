# nya2828 blog
nya2828のブログを構築する

node v24.18.0

# Dev
``` bush
$ pnpm install
$ pnpm run start
```

# assetImages ユーティリティ

`src/utils/assetImages.ts` は、記事ごとの画像を一括取得するユーティリティ。

**`getPostImages(slug)`** — 指定スラッグのディレクトリ (`src/assets/blog/<slug>/`) 以下の画像を `Record<ファイル名, ImageMetadata>` で返す。

```astro
---
import { getPostImages } from '../../utils/assetImages';
import { Image } from 'astro:assets';

const images = getPostImages('202405keyboard');
// images['photo01.jpg'] → ImageMetadata
---
<Image src={images['photo01.jpg']} alt="..." />
```

**ファイル配置ルール:**
- 画像は `src/assets/blog/<記事スラッグ>/` に置く
- スラッグは MDX ファイル名（拡張子なし）と一致させる

# Media コンポーネント

`src/components/Media.astro` は画像・HTML・チャート・動画を `<figure>` でラップするコンポーネント。
画像は Astro の `Image` コンポーネントで最適化・レスポンシブ対応される。

## Props

| Prop      | 型                                    | デフォルト | 説明                          |
|-----------|---------------------------------------|-----------|-------------------------------|
| `type`    | `'img' \| 'html' \| 'chart' \| 'video'` | `'img'` | メディア種別                  |
| `src`     | `string \| ImageMetadata`             | —         | 画像 URL または import した画像 |
| `alt`     | `string`                              | `''`      | alt テキスト                  |
| `caption` | `string`                              | —         | キャプション（優先）          |
| `title`   | `string`                              | —         | キャプション（caption がない場合）|

## 使い方

**1. Markdown 画像を自動変換（推奨）**

`[...slug].astro` で `components={{ img: Media }}` を設定済みなので、
MDX 内の通常の Markdown 記法が自動的に `<Media>` に変換される。

```mdx
![代替テキスト](../../assets/blog/202405keyboard/photo01.jpg "キャプション")
```

**2. 直接インポートして使う**

```mdx
import Media from '../../components/Media.astro';
import photo from '../../assets/blog/202405keyboard/photo01.jpg';

<Media src={photo} alt="代替テキスト" caption="キャプション" />
```

**3. 動画・チャートの埋め込み**

```mdx
import Media from '../../components/Media.astro';

<Media type="video" alt="デモ動画" caption="キャプション">
  <iframe src="..." />
</Media>

<Media type="chart" alt="代替テキスト" caption="グラフ">
  <!-- SVG や HTML チャートなど -->
</Media>
```

**`Img.astro` ラッパー:** `<Media type="img">` の薄いラッパー。単純な画像には `<Img src={...} alt="..." />` でも使える。
