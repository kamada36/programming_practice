import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Coffee } from "lucide-react";
import { LEVELS, getCatalog, levelTone, recipeId, toLessonRow } from "@/lib/mdx";
import { CategoryCard } from "@/components/CategoryCard";
import { LessonGroup } from "@/components/LessonGroup";
import { StampCard } from "@/components/StampCard";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const catalog = getCatalog();

  const stampGroups = catalog.map(({ category, recipes }) => ({
    slug: category.slug,
    label: category.shortLabel,
    emoji: category.emoji,
    recipeIds: recipes.map(recipeId),
  }));
  const totalMenus = stampGroups.reduce((n, g) => n + g.recipeIds.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* ヒーロー */}
      <section className="py-10 text-center sm:py-14">
        <span className="hero-rise hero-float relative inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="relative">
            <Coffee className="h-3.5 w-3.5" />
            <span
              className="hero-steam pointer-events-none absolute -top-2 left-1/2 flex -translate-x-1/2 gap-[3px]"
              aria-hidden
            >
              <i />
              <i />
              <i />
            </span>
          </span>
          環境構築ゼロ・完全無料
        </span>
        <h1
          className="hero-rise mx-auto mt-4 max-w-2xl text-2xl font-bold leading-tight text-foreground sm:mt-5 sm:text-4xl"
          style={{ animationDelay: "0.25s" }}
        >
          ゆっくり一杯、
          <span className="hero-accent text-accent">コードの練習</span>。
        </h1>
        <p
          className="hero-rise mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base"
          style={{ animationDelay: "0.5s" }}
        >
          ブラウザだけで動く、プログラミングの小さな練習帳。
          気になったコードを選んで、書き換えて、その場で試せます。
        </p>

        <div
          className="hero-rise mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:mt-7 sm:text-sm"
          style={{ animationDelay: "0.75s" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-accent" />
            1分で動く
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-accent" />
            自由に書き換え
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Coffee className="h-4 w-4 text-accent" />
            登録・インストール不要
          </span>
        </div>
      </section>

      {/* レベルの目安（小さく） */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 border-y border-border/50 py-2.5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/60">レベルの目安</span>
        {LEVELS.map((level) => (
          <span key={level.slug} className="inline-flex items-center gap-1">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                levelTone(level.slug).dot,
              )}
              aria-hidden
            />
            <span aria-hidden>{level.emoji}</span>
            {level.difficulty}
            <span className="text-muted-foreground/60">／{level.tag}</span>
          </span>
        ))}
      </div>

      {/* 言語 */}
      <section className="pb-4">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            言語
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            全 {totalMenus} 品
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

      {/* スタンプカード（おまけ・控えめ） */}
      <div className="mt-3">
        <StampCard groups={stampGroups} />
      </div>

      {/* 言語ごとのメニュー */}
      {catalog.map(({ category, levels }) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-24 border-t border-border/60 py-8 sm:py-10"
        >
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
            <span className="text-2xl" aria-hidden>
              {category.emoji}
            </span>
            {category.shortLabel}
          </h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>

          <div className="mt-5 space-y-6">
            {levels.map(({ level, recipes: levelRecipes }) => (
              <LessonGroup
                key={level.slug}
                level={level}
                lessons={levelRecipes.map((r, i) => toLessonRow(r, i + 1))}
              />
            ))}
          </div>

          <Link
            href={`/${category.slug}/`}
            className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
          >
            {category.shortLabel} のメニューをすべて見る
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      ))}

    </div>
  );
}
