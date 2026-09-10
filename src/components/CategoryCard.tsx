import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { levelTone } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { CategoryMeta } from "@/types/recipe";
import { Progress } from "@/components/Progress";

export interface CategoryLevelCount {
  slug: string;
  /** "入門" などの短いラベル。 */
  label: string;
  emoji: string;
  count: number;
}

interface CategoryCardProps {
  category: CategoryMeta;
  levelCounts: CategoryLevelCount[];
  /** このカテゴリ全レシピの進捗 ID。 */
  recipeIds: string[];
}

/**
 * トップの「言語を選ぶ」カード。
 * 言語名・説明・難易度別の本数・進捗をまとめて見せ、コースページへ誘導する。
 */
export function CategoryCard({
  category,
  levelCounts,
  recipeIds,
}: CategoryCardProps) {
  return (
    <Link
      href={`/${category.slug}/`}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-muted text-2xl">
          {category.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">
            {category.shortLabel}
          </h3>
          {category.shortLabel !== category.label && (
            <p className="truncate text-xs text-muted-foreground">
              {category.label}
            </p>
          )}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {levelCounts.map((l) => (
          <span
            key={l.slug}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              levelTone(l.slug).chip,
            )}
          >
            <span aria-hidden>{l.emoji}</span>
            {l.label}
            <span className="tabular-nums opacity-60">{l.count}</span>
          </span>
        ))}
      </div>

      <Progress
        ids={recipeIds}
        size="sm"
        className="mt-4 border-t border-border/60 pt-3"
      />
    </Link>
  );
}
