import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  CategoryMeta,
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

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.slug, c]));

/** スラッグからカテゴリのメタ情報を取得する。 */
export function getCategory(slug: string): CategoryMeta | undefined {
  return CATEGORY_MAP.get(slug);
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

/** category / slug からレシピを1件取得する。 */
export function getRecipe(
  category: string,
  slug: string,
): Recipe | undefined {
  return listRecipeFiles(category)
    .map((f) => readRecipeFile(category, f))
    .find((r) => r.slug === slug);
}

/** 静的生成用の全 [category]/[slug] 組み合わせ。 */
export function getAllRecipeParams(): { category: string; slug: string }[] {
  return getAllRecipes().map((r) => ({
    category: r.category,
    slug: r.slug,
  }));
}
