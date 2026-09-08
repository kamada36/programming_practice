import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Recipe } from "@/types/recipe";

/** レシピ一覧のカード。 */
export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const { frontmatter, category, slug } = recipe;

  return (
    <Link
      href={`/${category}/${slug}/`}
      className="group block focus-visible:outline-none"
    >
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg group-focus-visible:ring-2 group-focus-visible:ring-accent">
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{frontmatter.emoji ?? "📝"}</span>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {frontmatter.difficulty}
            </span>
          </div>

          <h3 className="text-base font-semibold text-foreground">
            {frontmatter.title}
          </h3>

          <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {frontmatter.description}
          </p>

          <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              約{frontmatter.minutes ?? 3}分
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-accent">
              作ってみる
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
