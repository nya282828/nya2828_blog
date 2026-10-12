# nya2828 blog
nya2828のブログを構築する

node v24

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


# Rail コンポーネント

`src/components/Rail.astro` は記事本文の横幅・位置を制御するレイアウト用ラッパー（`<div class="l-rail ...">`）。
スタイルは `src/styles/_components/_rail-custom.scss` にある。

## Props

| Prop    | 型        | デフォルト | 説明                                                                 |
|---------|-----------|-----------|----------------------------------------------------------------------|
| `size`  | `string`  | —         | 幅の修飾クラス（`l-rail--<size>`）。現状 `m` のみ定義（最大幅を本文幅の約1.5倍に制限） |
| `space` | `boolean` | `true`    | `false` にすると `l-rail--full--<size>` になり、左余白を詰めて広く使う  |

## 使い方

**1. 明示的に指定する（幅を変えたい箇所のみ）**

```mdx
import Rail from '../../components/Rail.astro';

<Rail size="m">
  本文より広めの幅で表示したい内容
</Rail>

<Rail size="m" space={false}>
  左余白を詰めて表示したい内容
</Rail>
```

**2. MDX では省略できる**

`src/plugins/rehypeRailWrapper.mjs`（`astro.config.mjs` の `rehypePlugins` に登録済み）が、
MDX のトップレベルの要素を自動で `<div class="l-rail">` にまとめてラップする。
そのため通常の段落・見出し・リスト・Markdown 画像などは `<Rail>` を書かなくてよい。

自動ラップされず、グループの区切りになるもの:
- `import` / `export`
- 明示的に書いた `<Rail>`
- コードブロック（`pre`）
- `---`（`hr`）

`<Rail>` を明示するのは、`size` / `space` で幅を変えたい箇所だけでよい。

# ImgGrid コンポーネント

`src/components/ImgGrid.astro` は子要素（主に `<Media>`）をグリッド状に並べる画像グリッド（`<div class="c-image-grid">`）。
`repeat(auto-fit, minmax(..., 1fr))` で幅に応じて列数が自動調整され、間隔は `1em`。
スタイルは `src/styles/_components/_img-grid.scss` にある。Props はなく、中身は `<slot />` のみ。

## 使い方

`Rail` の中に `ImgGrid` を置き、その中に `Media` を並べる。画像は `getPostImages(slug)` で取得する（上の assetImages ユーティリティ参照）。

```mdx
import Rail from '../../components/Rail.astro';
import ImgGrid from '../../components/ImgGrid.astro';
import Media from '../../components/Media.astro';
import { getPostImages } from '../../utils/assetImages';
export const images = getPostImages('20240210');

<Rail size="m">
  <ImgGrid>
    <Media src={images['R0000430.jpg']} alt="自転車で信号待ちする青年" caption=""/>

    <Media src={images['R0001061.jpg']} alt="PAの電灯" caption=""/>

    <Media src={images['R0004795.JPG']} alt="夕焼けの重機" caption="キャプション"/>
  </ImgGrid>
</Rail>
```

- `ImgGrid` 内の `Media`（`.c-media`）は margin が 0 になる
- `Media` の props は上の Media コンポーネントの節を参照
