import Link from "next/link";
import { Coffee } from "lucide-react";
import { CATEGORIES } from "@/lib/mdx";

/** カフェ風のブランドヘッダー。ロゴ + カテゴリナビゲーション。 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-foreground">
              コード・キッチン
            </span>
            <span className="text-xs text-muted-foreground">
              1分で動かす、実用レシピ
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/#${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {c.emoji} {c.slug === "web" ? "Web" : c.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
