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
export type Difficulty = "入門" | "初級" | "中級" | "上級";

/** 穴埋めクイズの選択肢。 */
export interface QuizOption {
  /** 選択肢のラベル（コードに挿入される文字列） */
  label: string;
  /** 正解かどうか */
  isCorrect: boolean;
}

/** Step 3 の「選択式・穴埋めチャレンジ」データ。 */
export interface Quiz {
  /** 出題文 */
  question: string;
  /** 穴埋め箇所を `___CHOICE___` で表したコード片（1つ以上） */
  codeSnippet: string;
  /** 選択肢（1つ以上に isCorrect: true を付ける） */
  options: QuizOption[];
  /** 正解時に表示する解説 */
  explanation: string;
}

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
  /** エディタに最初から入っているコード（= Step 1 の完成見本）。`initialCode` でも可。 */
  starterCode: string;
  /** `starterCode` の別名。どちらか一方を書けばよい。 */
  initialCode?: string;
  /** console 実行時に stdin へ渡す内容（任意） */
  stdin?: string;
  /** Step 2「少し変えてみよう」のお題文（任意） */
  practiceHint?: string;
  /** Step 3 の穴埋めクイズ（任意） */
  quiz?: Quiz;
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
  /** 正式名称（例: "HTML / CSS / JavaScript"） */
  label: string;
  /** ナビ・見出し用の短い名前（例: "Web"） */
  shortLabel: string;
  emoji: string;
  description: string;
}

/** 難易度（〜編）のメタ情報。 */
export interface LevelMeta {
  /** URL スラッグ（例: "intro"） */
  slug: string;
  /** 表示名（例: "入門編"） */
  label: string;
  /** frontmatter.difficulty の対応値 */
  difficulty: Difficulty;
  /** アイコン絵文字 */
  emoji: string;
  /** 一覧・詳細で表示する短い説明（1文） */
  blurb: string;
  /** トップの目安表示に使うごく短いラベル（数語） */
  tag: string;
}
