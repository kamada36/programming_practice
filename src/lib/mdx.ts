import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  CategoryMeta,
  Difficulty,
  LevelMeta,
  Recipe,
  RecipeFrontmatter,
} from "@/types/recipe";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** サイトで扱うカテゴリの定義（表示順）。 */
export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "web",
    label: "HTML / CSS / JavaScript",
    emoji: "🌐",
    description:
      "ブラウザだけで動く。ボタン・アニメーション・ミニアプリを その場でプレビュー。",
  },
  {
    slug: "python",
    label: "Python",
    emoji: "🐍",
    description: "データ処理や自動化の入り口。1分でコードを実行して結果を確認。",
  },
  {
    slug: "ruby",
    label: "Ruby",
    emoji: "💎",
    description: "読みやすく書いていて楽しい言語。小さなレシピで手を動かす。",
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
  },
  {
    slug: "basic",
    label: "初級編",
    difficulty: "初級",
    emoji: "☕",
    blurb: "基本の文法。小さな部品を組み立てる。",
  },
  {
    slug: "intermediate",
    label: "中級編",
    difficulty: "中級",
    emoji: "🔥",
    blurb: "複数の要素を組み合わせて、動くものを作る。",
  },
  {
    slug: "advanced",
    label: "上級編",
    difficulty: "上級",
    emoji: "🏆",
    blurb: "実戦的なミニアプリに挑戦。",
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

/** ファイル名（"01-button-click.mdx"）からスラッグ（"button-click"）を得る。 */
function fileNameToSlug(fileName: string): string {
  return fileName
    .replace(/\.mdx?$/, "")
    .replace(/^\d+[-_]/, "");
}

function readRecipeFile(category: string, fileName: string): Recipe {
  const fullPath = path.join(CONTENT_DIR, category, fileName);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const frontmatter = {
    category,
    ...data,
  } as RecipeFrontmatter;

  // `initialCode` は `starterCode` の別名として受け付ける。
  if (!frontmatter.starterCode && frontmatter.initialCode) {
    frontmatter.starterCode = frontmatter.initialCode;
  }

  return {
    slug: fileNameToSlug(fileName),
    category,
    frontmatter,
    content,
  };
}

/** 指定カテゴリの MDX ファイル名一覧。 */
function listRecipeFiles(category: string): string[] {
  const dir = path.join(CONTENT_DIR, category);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .sort();
}

function sortRecipes(recipes: Recipe[]): Recipe[] {
  return [...recipes].sort((a, b) => {
    const oa = a.frontmatter.order ?? 999;
    const ob = b.frontmatter.order ?? 999;
    if (oa !== ob) return oa - ob;
    return a.slug.localeCompare(b.slug);
  });
}

/** 全レシピを取得する（カテゴリ表示順 → order 順）。 */
export function getAllRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  for (const category of CATEGORIES) {
    for (const fileName of listRecipeFiles(category.slug)) {
      recipes.push(readRecipeFile(category.slug, fileName));
    }
  }
  return recipes;
}

/** 指定カテゴリのレシピを order 順で取得する。 */
export function getRecipesByCategory(category: string): Recipe[] {
  return sortRecipes(
    listRecipeFiles(category).map((f) => readRecipeFile(category, f)),
  );
}

/** 指定カテゴリ・難易度のレシピを order 順で取得する。 */
export function getRecipesByCategoryAndLevel(
  category: string,
  levelSlug: string,
): Recipe[] {
  const level = getLevel(levelSlug);
  if (!level) return [];
  return getRecipesByCategory(category).filter(
    (r) => r.frontmatter.difficulty === level.difficulty,
  );
}

/** そのレシピが属する難易度スラッグ。 */
export function recipeLevelSlug(recipe: Recipe): string {
  return getLevelByDifficulty(recipe.frontmatter.difficulty)?.slug ?? "intro";
}

/** category / slug からレシピを1件取得する。 */
export function getRecipe(
  category: string,
  slug: string,
): Recipe | undefined {
  return listRecipeFiles(category)
    .map((f) => readRecipeFile(category, f))
    .find((r) => r.slug === slug);
}

/** 静的生成用の全 [category]/[level] 組み合わせ（レシピが1件以上あるもの）。 */
export function getAllLevelParams(): { category: string; level: string }[] {
  const params: { category: string; level: string }[] = [];
  for (const c of CATEGORIES) {
    for (const l of LEVELS) {
      if (getRecipesByCategoryAndLevel(c.slug, l.slug).length > 0) {
        params.push({ category: c.slug, level: l.slug });
      }
    }
  }
  return params;
}

/** 静的生成用の全 [category]/[level]/[slug] 組み合わせ。 */
export function getAllRecipeParams(): {
  category: string;
  level: string;
  slug: string;
}[] {
  return getAllRecipes().map((r) => ({
    category: r.category,
    level: recipeLevelSlug(r),
    slug: r.slug,
  }));
}
