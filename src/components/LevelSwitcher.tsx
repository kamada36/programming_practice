import Link from "next/link";
import { LEVELS, levelTone } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface LevelSwitcherProps {
  categorySlug: string;
  /** 現在表示中の難易度スラッグ（一覧ページ）。無指定ならアンカーリンクとして使う。 */
  activeSlug?: string;
  /** レシピが1件以上ある難易度スラッグの集合。 */
  available: Set<string>;
  /** true なら同一ページ内アンカー（#slug）へのリンクにする。 */
  asAnchors?: boolean;
}

/** 難易度の切り替えピル。一覧ページの上部やコースページの目次に使う。 */
export function LevelSwitcher({
  categorySlug,
  activeSlug,
  available,
  asAnchors = false,
}: LevelSwitcherProps) {
  const items = LEVELS.filter((l) => available.has(l.slug));
  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="難易度の切り替え"
      className="flex flex-wrap gap-1.5"
    >
      {items.map((l) => {
        const active = l.slug === activeSlug;
        const tone = levelTone(l.slug);
        return (
          <Link
            key={l.slug}
            href={
              asAnchors
                ? `#${l.slug}`
                : `/${categorySlug}/${l.slug}/`
            }
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                active ? "bg-primary-foreground" : tone.dot,
              )}
              aria-hidden
            />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
