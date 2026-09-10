"use client";

import { useMemo } from "react";
import { Coffee } from "lucide-react";
import { useClearedIds } from "@/hooks/useProgress";
import { BADGES, earnedBadge, nextBadge } from "@/lib/progress";
import { cn } from "@/lib/utils";

export interface StampRecipe {
  /** "web/button-click" 形式の ID */
  id: string;
  title: string;
  emoji?: string;
}

/**
 * 機能③：カフェ風スタンプカード。
 * LocalStorage のクリア実績を読み、スタンプと称号バッジを表示する。
 */
export function StampCard({ recipes }: { recipes: StampRecipe[] }) {
  const cleared = useClearedIds();
  const clearedSet = useMemo(() => new Set(cleared), [cleared]);

  const total = recipes.length;
  const count = recipes.filter((r) => clearedSet.has(r.id)).length;
  const badge = earnedBadge(count);
  const upcoming = nextBadge(count);

  return (
    <section
      id="stamp"
      className="scroll-mt-20 rounded-2xl border border-border bg-surface p-5 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Coffee className="h-4 w-4" />
          </span>
          スタンプカード
        </h2>
        <p className="text-sm text-muted-foreground">
          全 {total} メニュー中{" "}
          <span className="font-bold text-accent">{count}</span> 個クリア
        </p>
      </div>

      {/* スタンプ枠 */}
      <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">
        {recipes.map((r) => {
          const done = clearedSet.has(r.id);
          return (
            <div
              key={r.id}
              title={done ? `${r.title}（クリア済み）` : r.title}
              className={cn(
                "grid aspect-square place-items-center rounded-full border-2 text-lg transition-colors",
                done
                  ? "stamp-in border-accent bg-accent/10 text-accent"
                  : "border-dashed border-border text-muted-foreground/40",
              )}
            >
              {done ? r.emoji ?? "☕" : ""}
            </div>
          );
        })}
      </div>

      {/* 称号バッジ */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {BADGES.map((b) => {
          const owned = count >= b.threshold;
          return (
            <span
              key={b.label}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                owned
                  ? "border-accent/50 bg-accent/10 text-accent"
                  : "border-border bg-muted text-muted-foreground/60",
              )}
            >
              <span>{b.emoji}</span>
              {b.label}
            </span>
          );
        })}
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {badge ? (
          <>
            現在の称号：
            <span className="font-semibold text-accent">
              {badge.emoji} {badge.label}
            </span>
          </>
        ) : (
          "最初のメニューをクリアすると、スタンプが押されます。"
        )}
        {upcoming && (
          <>
            {" "}
            あと {upcoming.threshold - count} 個で「{upcoming.label}」獲得！
          </>
        )}
      </p>
    </section>
  );
}
