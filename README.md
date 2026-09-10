# コード・カフェ（programming_practice）

環境構築なしで、ブラウザだけでコードを試せる初心者向けの学習サイト。
「メニューを選んで、その場で試して、動きを味わう」カフェのコンセプト。
既存ブログ [resilient-cer.com](https://resilient-cer.com) の「カフェ」風デザインを踏襲。

> リポジトリ名・URL は `programming_practice` のまま。表示名／メタ情報のみ「コード・カフェ」。
> コンテンツ1件のユーザー向け呼称は「メニュー」（コード上の型名 `Recipe` などは据え置き）。

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
| ホスティング | 静的ホスティング（本番: Netlify / 開発中: Vercel、いずれも `out` を配信・関数なし） |

## デプロイ

`output: 'export'` による純粋な静的サイトなので、Netlify / Vercel どちらでもそのまま配信できる。
ビルドコマンド・公開ディレクトリ（`out`）は各サービスの管理画面で設定する。

| 項目 | Netlify | Vercel |
| --- | --- | --- |
| 設定ファイル | `netlify.toml` | `vercel.json` |
| セキュリティヘッダー | `[[headers]]` | `headers` |
| 404 | `/404.html` へのリダイレクト設定 | `404.html` を自動配信 |
| Next ランタイム無効化 | `NETLIFY_NEXT_PLUGIN_SKIP=true` | `output: 'export'` で自動的に静的配信 |

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
content/<category>/<NN>-<slug>.mdx   メニュー（チュートリアル記事）
src/app/                             ルーティング
  page.tsx                             トップ（言語カード + カリキュラム一覧）
  [category]/page.tsx                  言語コース（難易度別のレッスン行一覧）
  [category]/[level]/page.tsx          難易度別の一覧
  [category]/[level]/[slug]/page.tsx   メニュー詳細（3ステップ学習）
src/components/                      Header, Footer, CategoryCard, LessonRow, Progress ほか
src/lib/catalog.ts                   カテゴリ・難易度・配色の定義（node:fs 非依存 / クライアント可）
src/lib/mdx.ts                       MDX 解析・一覧取得（サーバー専用）
src/lib/piston.ts                    Piston API 呼び出し
src/types/recipe.ts                  型定義
```

一覧・トップの「1レッスン＝1行」表示は `LessonRow`（アイコン + タイトル + 難易度色 +
所要時間 + クリア印）。難易度ごとの配色は `src/lib/catalog.ts` の `LEVEL_TONE`。

## メニューの追加方法

1. `content/<category>/` に `NN-slug.mdx` を作成（`NN` は表示順の連番、`slug` は URL）。
2. Frontmatter に必須項目を記述：

```yaml
---
title: タイトル
description: 一覧・OGP 用の短い説明
language: python        # html | javascript | python | ruby | java | cpp
kind: console           # web（iframe）| console（Piston）
difficulty: 入門         # 入門 | 初級 | 中級 | 上級
emoji: 🐍
order: 1
minutes: 2
starterCode: |
  print("ここにエディタの初期コード")
---

本文（解説）。<Callout> と <CodePlayground> が使えます。
```

3. 新しいカテゴリを足す場合は `src/lib/catalog.ts` の `CATEGORIES` に追記。

## Piston 実行対応言語

`javascript` / `python` / `ruby` / `java` / `cpp`。バージョンは `src/lib/piston.ts` の
`PISTON_LANG` で固定。公開インスタンス（emkc.org）はレート制限があるため、
429 応答時はユーザーに再試行を促すメッセージを表示する。
