import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  CATEGORIES,
  getCategoryOutline,
  recipeHref,
  recipeId,
  toLessonRow,
} from "@/lib/mdx";
import { LessonGroup } from "@/components/LessonGroup";
import { LevelSwitcher } from "@/components/LevelSwitcher";
import { Progress } from "@/components/Progress";
import { ResumeButton } from "@/components/ResumeButton";
import { NextStepCard } from "@/components/NextStepCard";
import { ArticleFooter } from "@/components/ArticleFooter";
import { SponsoredPlaceholder } from "@/components/SponsoredPlaceholder";
import { resolveNextStep } from "@/lib/site";

interface PageProps {
  params: { category: string };
}

/** SSG: レシピが1件以上あるカテゴリ。 */
export function generateStaticParams() {
  return CATEGORIES.filter(
    (c) => (getCategoryOutline(c.slug)?.recipes.length ?? 0) > 0,
  ).map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const outline = getCategoryOutline(params.category);
  if (!outline) return {};
  const { category } = outline;
  return {
    title: `${category.shortLabel} のメニュー`,
    description: `${category.label} のメニュー（全${outline.recipes.length}品）。${category.description}`,
  };
}

export default function CategoryPage({ params }: PageProps) {
  const outline = getCategoryOutline(params.category);
  if (!outline || outline.recipes.length === 0) notFound();

  const { category, recipes, levels } = outline;
  const available = new Set(levels.map((b) => b.level.slug));

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        トップへ
      </Link>

      <header className="mt-5 sm:mt-6">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-muted text-2xl">
            {category.emoji}
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              {category.shortLabel}
            </h1>
            {category.shortLabel !== category.label && (
              <p className="text-sm text-muted-foreground">{category.label}</p>
            )}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {category.description}
        </p>
        <Progress
          ids={recipes.map(recipeId)}
          className="mt-4 max-w-xs"
        />
        <div className="mt-4">
          <ResumeButton
            recipes={levels
              .flatMap((b) => b.recipes)
              .map((r) => ({
                id: recipeId(r),
                href: recipeHref(r),
                title: r.frontmatter.title,
              }))}
          />
        </div>
      </header>

      <div className="mt-7">
        <h2 className="text-sm font-bold text-foreground">メニュー</h2>
        <div className="mt-2">
          <LevelSwitcher
            categorySlug={category.slug}
            available={available}
            asAnchors
          />
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {levels.map(({ level, recipes: rs }) => (
          <LessonGroup
            key={level.slug}
            id={level.slug}
            level={level}
            lessons={rs.map((r, i) => toLessonRow(r, i + 1))}
          />
        ))}
      </div>

      <div className="mt-12 space-y-4 border-t border-border/60 pt-8">
        <NextStepCard
          {...resolveNextStep()}
        />
        <ArticleFooter />
        <SponsoredPlaceholder
          variant="banner"
          note="候補：言語メニュー一覧の最下部"
        />
      </div>
    </div>
  );
}
