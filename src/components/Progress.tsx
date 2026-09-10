"use client";

import { useMemo } from "react";
import { useClearedIds } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

interface ProgressProps {
  /** 対象レシピの進捗 ID（"web/button-click" 形式）一覧。 */
  ids: string[];
  className?: string;
  /** "3 / 6 クリア" の表記を出すか。 */
  showLabel?: boolean;
  /** バーの高さ。 */
  size?: "sm" | "md";
}

/**
 * LocalStorage のクリア実績から、渡されたレシピ群の達成率バーを描画する。
 * サーバー側は 0% で描画し、マウント後に実値へアニメーションする。
 */
export function Progress({
  ids,
  className,
  showLabel = true,
  size = "md",
}: ProgressProps) {
  const cleared = useClearedIds();
  const done = useMemo(() => {
    const set = new Set(cleared);
    return ids.filter((id) => set.has(id)).length;
  }, [cleared, ids]);

  const total = ids.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  return (
    <div className={className}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {complete ? "すべてクリア！" : "進捗"}
          </span>
          <span className="font-semibold tabular-nums text-foreground">
            {done}
            <span className="font-normal text-muted-foreground"> / {total}</span>
          </span>
        </div>
      )}
      <div
        className={cn(
          "overflow-hidden rounded-full bg-muted",
          size === "sm" ? "h-1.5" : "h-2",
        )}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            complete ? "bg-emerald-500" : "bg-accent",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
