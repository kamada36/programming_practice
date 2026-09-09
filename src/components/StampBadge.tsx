"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";
import { useClearedIds } from "@/hooks/useProgress";
import { earnedBadge } from "@/lib/progress";

/**
 * ヘッダーに置くコンパクトな進捗インジケータ。
 * クリックでトップページのスタンプカードへ移動する。
 */
export function StampBadge({ total }: { total: number }) {
  const cleared = useClearedIds();
  const count = cleared.length;
  const badge = earnedBadge(count);

  return (
    <Link
      href="/#stamp"
      aria-label={`スタンプ ${count} / ${total} 個`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Coffee className="h-3.5 w-3.5 text-accent" />
      <span className="tabular-nums">
        {count}
        <span className="text-muted-foreground/60"> / {total}</span>
      </span>
      {badge && <span aria-hidden>{badge.emoji}</span>}
    </Link>
  );
}
