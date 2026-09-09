import { Sparkles, Zap, Coffee } from "lucide-react";
import { CATEGORIES, getAllRecipes, getRecipesByCategory } from "@/lib/mdx";
import { RecipeCard } from "@/components/RecipeCard";
import { StampCard } from "@/components/StampCard";

export default function HomePage() {
  const sections = CATEGORIES.map((category) => ({
    category,
    recipes: getRecipesByCategory(category.slug),
  })).filter((s) => s.recipes.length > 0);

  const stampRecipes = getAllRecipes().map((r) => ({
    id: `${r.category}/${r.slug}`,
    title: r.frontmatter.title,
    emoji: r.frontmatter.emoji,
  }));

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* ヒーロー */}
      <section className="py-14 text-center sm:py-20">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
          <Coffee className="h-3.5 w-3.5" />
          環境構築ゼロ・完全無料
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-bold leading-tight text-foreground sm:text-4xl">
          コードは、
          <span className="text-accent">読むより動かす</span>
          方が早い。
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          ブラウザだけで完結する、実用レシピ集。
          気になったレシピを開いて、コードを書き換えて、その場で結果を確かめよう。
        </p>

        <div className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
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

      {/* カテゴリ別レシピ一覧 */}
      {sections.map(({ category, recipes }) => (
        <section
          key={category.slug}
          id={category.slug}
          className="scroll-mt-20 py-8"
        >
          <div className="mb-5">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <span className="text-2xl">{category.emoji}</span>
              {category.label}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard
                key={`${recipe.category}/${recipe.slug}`}
                recipe={recipe}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
