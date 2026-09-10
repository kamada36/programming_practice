/**
 * カタログ定義（カテゴリ・難易度・配色）。
 * ここは `node:fs` に依存しない純粋なデータ／ヘルパーのみ。
 * サーバー専用の MDX 読み込みは `src/lib/mdx.ts` にある。
 * クライアントコンポーネントからはこのファイルだけを import すること。
 */
import type { CategoryMeta, Difficulty, LevelMeta } from "@/types/recipe";

/** サイトで扱うカテゴリの定義（表示順）。 */
export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "web",
    label: "HTML / CSS / JavaScript",
    shortLabel: "Web",
    emoji: "🌐",
    description:
      "ボタン、アニメーション、ミニアプリ。ブラウザの中でそのまま動きます。",
  },
  {
    slug: "python",
    label: "Python",
    shortLabel: "Python",
    emoji: "🐍",
    description: "データ処理や自動化の入り口。書いてすぐ結果を確認できます。",
  },
  {
    slug: "ruby",
    label: "Ruby",
    shortLabel: "Ruby",
    emoji: "💎",
    description: "読みやすくて、書くのが楽しい言語。短い題材で手を動かします。",
  },
];

/** 難易度（〜編）の定義（表示順）。 */
export const LEVELS: LevelMeta[] = [
  {
    slug: "intro",
    label: "入門編",
    difficulty: "入門",
    emoji: "🌱",
    blurb: "はじめの一歩。写して動かすところから。",
    tag: "写して動かす",
  },
  {
    slug: "basic",
    label: "初級編",
    difficulty: "初級",
    emoji: "☕",
    blurb: "基本の文法。小さな部品を組み立てる。",
    tag: "基本の文法",
  },
  {
    slug: "intermediate",
    label: "中級編",
    difficulty: "中級",
    emoji: "🔥",
    blurb: "いくつかの部品を組み合わせて、動くものにする。",
    tag: "組み合わせる",
  },
  {
    slug: "advanced",
    label: "上級編",
    difficulty: "上級",
    emoji: "🏆",
    blurb: "実用的なミニアプリに挑戦する。",
    tag: "ミニアプリ",
  },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.slug, c]));
const LEVEL_MAP = new Map(LEVELS.map((l) => [l.slug, l]));
const LEVEL_BY_DIFFICULTY = new Map(LEVELS.map((l) => [l.difficulty, l]));

/** スラッグからカテゴリのメタ情報を取得する。 */
export function getCategory(slug: string): CategoryMeta | undefined {
  return CATEGORY_MAP.get(slug);
}

/** スラッグから難易度のメタ情報を取得する。 */
export function getLevel(slug: string): LevelMeta | undefined {
  return LEVEL_MAP.get(slug);
}

/** difficulty 値（"入門" など）から難易度のメタ情報を取得する。 */
export function getLevelByDifficulty(
  difficulty: Difficulty | string,
): LevelMeta | undefined {
  return LEVEL_BY_DIFFICULTY.get(difficulty as Difficulty);
}

/** difficulty 値から難易度スラッグ（"intro" など）を得る。 */
export function levelSlugForDifficulty(difficulty: Difficulty | string): string {
  return getLevelByDifficulty(difficulty)?.slug ?? "intro";
}

/**
 * 難易度ごとの配色（Tailwind の組み込みパレット）。
 * 一覧・行・チップで「どのレベルか」をひと目で分かるようにする。
 * ここはキーがそのままクラス名になるので、動的生成せず静的な文字列で持つ。
 */
export interface LevelTone {
  /** 難易度チップ（バッジ）。 */
  chip: string;
  /** ドット・進捗バーなどの塗り。 */
  dot: string;
  /** テキスト強調色。 */
  text: string;
  /** 縦のアクセントライン（左端）。 */
  bar: string;
}

export const LEVEL_TONE: Record<string, LevelTone> = {
  intro: {
    chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    bar: "bg-emerald-400",
  },
  basic: {
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    bar: "bg-amber-400",
  },
  intermediate: {
    chip: "bg-orange-100 text-orange-800 dark:bg-orange-400/15 dark:text-orange-300",
    dot: "bg-orange-500",
    text: "text-orange-700 dark:text-orange-400",
    bar: "bg-orange-400",
  },
  advanced: {
    chip: "bg-rose-100 text-rose-900 dark:bg-rose-400/15 dark:text-rose-300",
    dot: "bg-rose-600",
    text: "text-rose-800 dark:text-rose-300",
    bar: "bg-rose-500",
  },
};

/** 難易度スラッグの配色を取得する（未知なら intro 相当）。 */
export function levelTone(slug: string): LevelTone {
  return LEVEL_TONE[slug] ?? LEVEL_TONE.intro;
}
