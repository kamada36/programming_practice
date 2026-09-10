import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Coffee } from "lucide-react";
import {
  LEVELS,
  getCatalog,
  getAllRecipes,
  recipeId,
  toLessonRow,
} from "@/lib/mdx";
import { CategoryCard } from "@/components/CategoryCard";
import { LessonGroup } from "@/components/LessonGroup";
import { StampCard } from "@/components/StampCard";

export default function HomePage() {
  const catalog = getCatalog();

  const stampRecipes = getAllRecipes().map((r) => ({
    id: recipeId(r),
    title: r.frontmatter.title,
    emoji: r.frontmatter.emoji,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* ヒーロー */}
      <section className="py-10 text-center sm:py-14">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <Coffee className="h-3.5 w-3.5" />
          環境構築ゼロ・完全無料
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-2xl font-bold leading-tight text-foreground sm:mt-5 sm:text-4xl">
          コードは、
          <span className="text-accent">読むより動かす</span>
          方が早い。
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
          ブラウザだけで完結する、実用レシピ集。
          スマホでも、気になったレシピをその場で書き換えて試せます。
        </p>

        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:mt-7 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-accent" />
            1分で実行
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            書き換えて試せる
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Coffee className="h-4 w-4 text-accent" />
            インストール不要
          </span>
        </div>
      </section>

      {/* 言語を選ぶ */}
      <section className="pb-4">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            言語を選ぶ
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            全 {stampRecipes.length} レシピ
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {catalog.map(({ category, recipes, levels }) => (
            <CategoryCard
              key={category.slug}
              category={category}
              recipeIds={recipes.map(recipeId)}
              levelCounts={levels.map(({ level, recipes: rs }) => ({
                slug: level.slug,
                label: level.difficulty,
                emoji: level.emoji,
                count: rs.length,
              }))}
            />
          ))}
        </div>
      </section>

      {/* スタンプカード（進捗） */}
      <div className="py-6">
        <StampCard recipes={stampRecipes} />
      </div>

      {/* カテゴリ別カリキュラム */}
      {catalog.map(({ category, levels }) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-24 border-t border-border/60 py-8 sm:py-10"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
                <span className="text-2xl" aria-hidden>
                  {category.emoji}
                </span>
                {category.shortLabel}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
            </div>
            <Link
              href={`/${category.slug}/`}
              className="mt-1 inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:text-sm"
            >
              コース
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-6">
            {levels.map(({ level, recipes: levelRecipes }) => (
              <LessonGroup
                key={level.slug}
                level={level}
                lessons={levelRecipes.map((r, i) => toLessonRow(r, i + 1))}
              />
            ))}
          </div>
        </section>
      ))}

      {/* レベルの説明 */}
      <section className="border-t border-border/60 py-8 sm:py-10">
        <h2 className="text-lg font-semibold text-foreground sm:text-xl">
          4つのレベル
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          どの言語も同じ4段階。今の自分に合うところから始められます。
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {LEVELS.map((level) => (
            <div
              key={level.slug}
              className="rounded-xl border border-border/70 bg-surface p-4"
            >
              <dt className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <span aria-hidden>{level.emoji}</span>
                {level.label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {level.blurb}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
