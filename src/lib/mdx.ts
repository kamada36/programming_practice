import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  CategoryMeta,
  LevelMeta,
  Recipe,
  RecipeFrontmatter,
} from "@/types/recipe";
import {
  CATEGORIES,
  LEVELS,
  getCategory,
  getLevel,
  levelSlugForDifficulty,
} from "./catalog";

// カタログ定義（カテゴリ・難易度・配色）は catalog.ts に集約。
// 既存の import 互換のため、ここからも再エクスポートする。
export {
  CATEGORIES,
  LEVELS,
  LEVEL_TONE,
  getCategory,
  getLevel,
  getLevelByDifficulty,
  levelSlugForDifficulty,
  levelTone,
} from "./catalog";

const CONTENT_DIR = path.join(process.cwd(), "content");

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
  return levelSlugForDifficulty(recipe.frontmatter.difficulty);
}

/** レシピの進捗 ID（"web/button-click" 形式）。 */
export function recipeId(recipe: Recipe): string {
  return `${recipe.category}/${recipe.slug}`;
}

/** レシピ詳細ページへのパス。 */
export function recipeHref(recipe: Recipe): string {
  return `/${recipe.category}/${recipeLevelSlug(recipe)}/${recipe.slug}/`;
}

/** レシピを一覧行（LessonRow）用のプレーンデータへ変換する。 */
export function toLessonRow(recipe: Recipe, step?: number) {
  const levelSlug = recipeLevelSlug(recipe);
  return {
    id: recipeId(recipe),
    href: recipeHref(recipe),
    title: recipe.frontmatter.title,
    emoji: recipe.frontmatter.emoji,
    difficulty: recipe.frontmatter.difficulty,
    levelSlug,
    minutes: recipe.frontmatter.minutes,
    step,
  };
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

/** 1難易度分のレシピ束。 */
export interface LevelBucket {
  level: LevelMeta;
  recipes: Recipe[];
}

/** 1カテゴリ分の目次（難易度別に整理したレシピ）。 */
export interface CategoryOutline {
  category: CategoryMeta;
  /** そのカテゴリの全レシピ（order 順）。 */
  recipes: Recipe[];
  /** レシピが1件以上ある難易度だけを表示順に。 */
  levels: LevelBucket[];
}

/** 指定カテゴリの目次を組み立てる。 */
export function getCategoryOutline(
  categorySlug: string,
): CategoryOutline | undefined {
  const category = getCategory(categorySlug);
  if (!category) return undefined;
  const recipes = getRecipesByCategory(categorySlug);
  const levels: LevelBucket[] = LEVELS.map((level) => ({
    level,
    recipes: recipes.filter(
      (r) => r.frontmatter.difficulty === level.difficulty,
    ),
  })).filter((bucket) => bucket.recipes.length > 0);
  return { category, recipes, levels };
}

/** 全カテゴリの目次（レシピが1件以上あるもの）を表示順で返す。 */
export function getCatalog(): CategoryOutline[] {
  return CATEGORIES.map((c) => getCategoryOutline(c.slug)).filter(
    (o): o is CategoryOutline => !!o && o.recipes.length > 0,
  );
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
