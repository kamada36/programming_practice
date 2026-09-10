"use client";

import { useMemo } from "react";
import { useClearedIds } from "@/hooks/useProgress";
import { stampMilestone } from "@/lib/progress";
import { cn } from "@/lib/utils";

/** 1言語分のスタンプ対象。 */
export interface StampGroup {
  slug: string;
  /** 表示名（"Web" など） */
  label: string;
  emoji: string;
  /** その言語のメニューの進捗 ID 一覧 */
  recipeIds: string[];
}

/**
 * カフェのポイントカード風スタンプ。おまけ要素なので控えめに。
 * 言語ごとに「何杯クリアしたか」をドットで表示する。
 */
export function StampCard({ groups }: { groups: StampGroup[] }) {
  const cleared = useClearedIds();
  const clearedSet = useMemo(() => new Set(cleared), [cleared]);

  const total = groups.reduce((n, g) => n + g.recipeIds.length, 0);
  const done = groups.reduce(
    (n, g) => n + g.recipeIds.filter((id) => clearedSet.has(id)).length,
    0,
  );

  return (
    <section
      id="stamp"
      className="scroll-mt-24 rounded-xl border border-border/70 bg-surface px-4 py-3"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-semibold text-muted-foreground">
          スタンプカード
        </h2>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          <span className="font-semibold text-foreground">{done}</span> / {total}
        </span>
      </div>

      <ul className="mt-2 divide-y divide-border/50">
        {groups.map((g) => {
          const gDone = g.recipeIds.filter((id) => clearedSet.has(id)).length;
          const gTotal = g.recipeIds.length;
          const milestone = stampMilestone(gDone, gTotal);
          return (
            <li key={g.slug} className="flex items-center gap-3 py-1.5">
              <span className="flex w-24 shrink-0 items-center gap-1.5 text-xs font-medium text-foreground">
                <span aria-hidden>{g.emoji}</span>
                {g.label}
              </span>
              <span className="flex flex-1 flex-wrap gap-1" aria-hidden>
                {g.recipeIds.map((id) => (
                  <span
                    key={id}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      clearedSet.has(id) ? "bg-accent" : "bg-muted",
                    )}
                  />
                ))}
              </span>
              <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
                {gDone}/{gTotal}
                <span className="w-4 text-center" title={milestone?.label}>
                  {milestone?.emoji ?? ""}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
