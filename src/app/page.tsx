import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Coffee } from "lucide-react";
import {
  CATEGORIES,
  LEVELS,
  getAllRecipes,
  getRecipesByCategoryAndLevel,
} from "@/lib/mdx";
import { RecipeCard } from "@/components/RecipeCard";
import { StampCard } from "@/components/StampCard";

/** トップに並べる 1 レベル分のブロック（見出し + 一覧リンク + 最大4件）。 */
const PREVIEW_COUNT = 4;

export default function HomePage() {
  const stampRecipes = getAllRecipes().map((r) => ({
    id: `${r.category}/${r.slug}`,
    title: r.frontmatter.title,
    emoji: r.frontmatter.emoji,
  }));

  const categoryBlocks = CATEGORIES.map((category) => ({
    category,
    levels: LEVELS.map((level) => ({
      level,
      recipes: getRecipesByCategoryAndLevel(category.slug, level.slug),
    })).filter((l) => l.recipes.length > 0),
  })).filter((c) => c.levels.length > 0);

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* ヒーロー */}
      <section className="py-10 text-center sm:py-16">
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

        <div className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:mt-8 sm:text-sm">
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

      {/* スタンプカード（進捗） */}
      <StampCard recipes={stampRecipes} />

      {/* カテゴリ × 難易度 */}
      {categoryBlocks.map(({ category, levels }) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-20 py-8 sm:py-10"
        >
          <div className="mb-4 sm:mb-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground sm:text-xl">
              <span className="text-2xl">{category.emoji}</span>
              {category.label}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>

          <div className="space-y-8">
            {levels.map(({ level, recipes }) => (
              <div key={level.slug}>
                <div className="mb-3 flex items-end justify-between gap-3">
                  <div>
                    <h3 className="flex items-center gap-1.5 text-base font-semibold text-foreground">
                      <span>{level.emoji}</span>
                      {level.label}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                      {level.blurb}
                    </p>
                  </div>
                  <Link
                    href={`/${category.slug}/${level.slug}/`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:text-sm"
                  >
                    一覧へ
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
                  {recipes.slice(0, PREVIEW_COUNT).map((recipe) => (
                    <RecipeCard
                      key={`${recipe.category}/${recipe.slug}`}
                      recipe={recipe}
                    />
                  ))}
                </div>

                {recipes.length > PREVIEW_COUNT && (
                  <Link
                    href={`/${category.slug}/${level.slug}/`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80"
                  >
                    他 {recipes.length - PREVIEW_COUNT} 件を見る
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
