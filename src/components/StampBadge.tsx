"use client";

import Link from "next/link";
import { useClearedIds } from "@/hooks/useProgress";

/**
 * ヘッダーに置くごく小さな進捗インジケータ。
 * クリックでトップページのスタンプカードへ移動する。
 */
export function StampBadge({ total }: { total: number }) {
  const count = useClearedIds().length;

  return (
    <Link
      href="/#stamp"
      aria-label={`スタンプ ${count} / ${total} 個`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <span aria-hidden>🎫</span>
      <span className="tabular-nums">
        {count}
        <span className="text-muted-foreground/60"> / {total}</span>
      </span>
    </Link>
  );
}
