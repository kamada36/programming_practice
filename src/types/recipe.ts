/**
 * レシピ（チュートリアル記事）とMDXの型定義。
 */

/** 実行方式。web は iframe レンダリング、console は Piston API 実行。 */
export type ExecutionKind = "web" | "console";

/** 対応言語。 */
export type RecipeLanguage =
  | "html"
  | "javascript"
  | "python"
  | "ruby"
  | "java"
  | "cpp";

/** 難易度ラベル。 */
export type Difficulty = "入門" | "初級" | "中級";

/** MDX ファイルの Frontmatter。 */
export interface RecipeFrontmatter {
  /** 記事タイトル */
  title: string;
  /** 一覧・OGP 用の短い説明 */
  description: string;
  /** カテゴリスラッグ（ディレクトリ名と一致。例: "web", "python"） */
  category: string;
  /** エディタの言語モード */
  language: RecipeLanguage;
  /** 実行方式 */
  kind: ExecutionKind;
  /** 難易度 */
  difficulty: Difficulty;
  /** カード等に表示する絵文字アイコン */
  emoji?: string;
  /** 一覧の並び順（小さいほど前） */
  order?: number;
  /** 想定所要時間（分） */
  minutes?: number;
  /** エディタに最初から入っているコード */
  starterCode: string;
  /** console 実行時に stdin へ渡す内容（任意） */
  stdin?: string;
}

/** 一覧・詳細で扱うレシピ。 */
export interface Recipe {
  /** 記事スラッグ（ファイル名から拡張子と連番を除いたもの） */
  slug: string;
  /** カテゴリスラッグ */
  category: string;
  /** Frontmatter */
  frontmatter: RecipeFrontmatter;
  /** MDX 本文（解説部分） */
  content: string;
}

/** カテゴリのメタ情報。 */
export interface CategoryMeta {
  slug: string;
  label: string;
  emoji: string;
  description: string;
}
