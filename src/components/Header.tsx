import Link from "next/link";
import { Coffee } from "lucide-react";
import { CATEGORIES, getAllRecipes } from "@/lib/mdx";
import { StampBadge } from "@/components/StampBadge";

/** カフェ風のブランドヘッダー。ロゴ + カテゴリナビゲーション + 進捗。 */
export function Header() {
  const totalRecipes = getAllRecipes().length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:h-16">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground sm:h-9 sm:w-9">
            <Coffee className="h-4 w-4 sm:h-5 sm:w-5" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-semibold text-foreground sm:text-base">
              コード・カフェ
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              選んで、試して、味わう
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <nav className="hidden items-center gap-0.5 md:flex">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}/`}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <span aria-hidden>{c.emoji}</span> {c.shortLabel}
              </Link>
            ))}
          </nav>
          <StampBadge total={totalRecipes} />
        </div>
      </div>
    </header>
  );
}
