import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  LEVELS,
  getAllLevelParams,
  getCategory,
  getLevel,
  getRecipesByCategory,
  getRecipesByCategoryAndLevel,
} from "@/lib/mdx";
import { RecipeCard } from "@/components/RecipeCard";

interface PageProps {
  params: { category: string; level: string };
}

/** SSG: レシピが1件以上ある [category]/[level] の組み合わせ。 */
export function generateStaticParams() {
  return getAllLevelParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const category = getCategory(params.category);
  const level = getLevel(params.level);
  if (!category || !level) return {};
  const name = category.slug === "web" ? "Web" : category.label;
  return {
    title: `${name} ${level.label}`,
    description: `${name}の${level.label}レシピ一覧。${level.blurb}`,
  };
}

export default function LevelListPage({ params }: PageProps) {
  const category = getCategory(params.category);
  const level = getLevel(params.level);
  if (!category || !level) notFound();

  const recipes = getRecipesByCategoryAndLevel(params.category, params.level);
  if (recipes.length === 0) notFound();

  const name = category.slug === "web" ? "Web" : category.label;

  // 同カテゴリの他の難易度への導線
  const otherLevels = LEVELS.filter(
    (l) =>
      l.slug !== level.slug &&
      getRecipesByCategory(params.category).some(
        (r) => r.frontmatter.difficulty === l.difficulty,
      ),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        トップへ
      </Link>

      <header className="mt-5 sm:mt-6">
        <p className="text-sm text-muted-foreground">
          {category.emoji} {category.label}
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
          <span>{level.emoji}</span>
          {name} {level.label}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {level.blurb}
        </p>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard
            key={`${recipe.category}/${recipe.slug}`}
            recipe={recipe}
          />
        ))}
      </div>

      {otherLevels.length > 0 && (
        <nav className="mt-10 border-t border-border pt-6">
          <p className="text-sm font-medium text-foreground">
            {name}の他のレベル
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {otherLevels.map((l) => (
              <Link
                key={l.slug}
                href={`/${category.slug}/${l.slug}/`}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span>{l.emoji}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
