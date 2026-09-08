# コード・キッチン（programming_practice）

環境構築なしで、ブラウザだけでコードを動かせる初心者向けチュートリアルサイト。
既存ブログ [resilient-cer.com](https://resilient-cer.com) の「カフェ」風デザインを踏襲。

## 技術スタック

| 領域 | 採用技術 |
| --- | --- |
| フレームワーク | Next.js 14（App Router / TypeScript） |
| 出力 | 静的HTML出力 `output: 'export'`（`out/`） |
| スタイル | Tailwind CSS 3 + `@tailwindcss/typography`（自作 UI プリミティブ） |
| アイコン | lucide-react |
| コンテンツ | MDX + Frontmatter（`gray-matter` + `next-mdx-remote/rsc`） |
| エディタ | `@monaco-editor/react`（CDN ローダー） |
| 実行 | Web: `iframe` srcDoc / コンソール言語: Piston API（クライアントから直接） |
| ホスティング | Netlify Free Plan（`netlify.toml`、`out` を配信・関数なし） |

## 開発

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ に静的サイトを生成
npx serve out    # ビルド結果のローカルプレビュー
```

> Node.js が PATH に無い環境では `C:\Program Files\nodejs` を PATH に追加してください。

## ディレクトリ

```
content/<category>/<NN>-<slug>.mdx   チュートリアル記事
src/app/                             ルーティング（一覧 / [category]/[slug]）
src/components/                      Header, Footer, CodePlayground ほか
src/lib/mdx.ts                       MDX 解析・一覧取得・カテゴリ定義
src/lib/piston.ts                    Piston API 呼び出し
src/types/recipe.ts                  型定義
```

## 記事の追加方法

1. `content/<category>/` に `NN-slug.mdx` を作成（`NN` は表示順の連番、`slug` は URL）。
2. Frontmatter に必須項目を記述：

```yaml
---
title: タイトル
description: 一覧・OGP 用の短い説明
language: python        # html | javascript | python | ruby | java | cpp
kind: console           # web（iframe）| console（Piston）
difficulty: 入門         # 入門 | 初級 | 中級
emoji: 🐍
order: 1
minutes: 2
starterCode: |
  print("ここにエディタの初期コード")
---

本文（解説）。<Callout> と <CodePlayground> が使えます。
```

3. 新しいカテゴリを足す場合は `src/lib/mdx.ts` の `CATEGORIES` に追記。

## Piston 実行対応言語

`javascript` / `python` / `ruby` / `java` / `cpp`。バージョンは `src/lib/piston.ts` の
`PISTON_LANG` で固定。公開インスタンス（emkc.org）はレート制限があるため、
429 応答時はユーザーに再試行を促すメッセージを表示する。
