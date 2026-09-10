import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, LayoutList } from "lucide-react";
import {
  getAllLevelParams,
  getCategory,
  getCategoryOutline,
  getLevel,
  getRecipesByCategoryAndLevel,
  recipeId,
  toLessonRow,
} from "@/lib/mdx";
import { LessonRow } from "@/components/LessonRow";
import { LevelSwitcher } from "@/components/LevelSwitcher";
import { Progress } from "@/components/Progress";
import { levelTone } from "@/lib/catalog";
import { cn } from "@/lib/utils";

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
  return {
    title: `${category.shortLabel} ${level.label}`,
    description: `${category.shortLabel} の${level.label}メニュー一覧。${level.blurb}`,
  };
}

export default function LevelListPage({ params }: PageProps) {
  const category = getCategory(params.category);
  const level = getLevel(params.level);
  if (!category || !level) notFound();

  const recipes = getRecipesByCategoryAndLevel(params.category, params.level);
  if (recipes.length === 0) notFound();

  const outline = getCategoryOutline(params.category);
  const available = new Set(outline?.levels.map((b) => b.level.slug) ?? []);
  const tone = levelTone(level.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <Link
        href={`/${category.slug}/`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {category.shortLabel} のメニュー表
      </Link>

      <header className="mt-5 sm:mt-6">
        <p className="text-sm text-muted-foreground">
          {category.emoji} {category.shortLabel}
        </p>
        <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-foreground sm:text-3xl">
          <span className={cn("h-6 w-1.5 rounded-full", tone.bar)} aria-hidden />
          <span aria-hidden>{level.emoji}</span>
          {level.label}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {level.blurb}
        </p>
      </header>

      <div className="mt-5">
        <LevelSwitcher
          categorySlug={category.slug}
          activeSlug={level.slug}
          available={available}
        />
      </div>

      <Progress
        ids={recipes.map(recipeId)}
        className="mt-5 max-w-xs"
        showLabel
      />

      <ul className="mt-5 space-y-1.5">
        {recipes.map((recipe, i) => (
          <li key={recipe.slug}>
            <LessonRow {...toLessonRow(recipe, i + 1)} />
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-border/60 pt-6">
        <Link
          href={`/${category.slug}/`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          <LayoutList className="h-4 w-4" />
          {category.shortLabel} のメニュー表をすべて見る
        </Link>
      </div>
    </div>
  );
}
