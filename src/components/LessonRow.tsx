"use client";

import Link from "next/link";
import { Check, ChevronRight, Clock } from "lucide-react";
import { useClearedIds } from "@/hooks/useProgress";
import { levelTone } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface LessonRowData {
  /** 進捗 ID（"web/button-click" 形式）。 */
  id: string;
  href: string;
  title: string;
  emoji?: string;
  /** 表示用の難易度ラベル（"入門" など）。 */
  difficulty: string;
  /** 難易度スラッグ（配色用。"intro" など）。 */
  levelSlug: string;
  minutes?: number;
  /** コース内の通し番号（任意）。 */
  step?: number;
}

/**
 * 一覧の1行。アイコン + タイトル + 難易度色 + 所要時間 + クリア印。
 * 行全体がリンク。paiza / Progate のレッスン一覧に近い密度。
 */
export function LessonRow({
  id,
  href,
  title,
  emoji,
  difficulty,
  levelSlug,
  minutes,
  step,
}: LessonRowData) {
  const cleared = useClearedIds();
  const done = cleared.includes(id);
  const tone = levelTone(levelSlug);

  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-border/70 bg-surface px-3 py-2.5 transition-colors hover:border-accent/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:px-3.5"
    >
      {/* 状態アイコン */}
      <span
        className={cn(
          "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg",
          done
            ? "bg-emerald-100 dark:bg-emerald-400/15"
            : "bg-muted",
        )}
        aria-hidden
      >
        {done ? (
          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <span>{emoji ?? "📝"}</span>
        )}
      </span>

      {/* タイトル（＋モバイル用の難易度ドット） */}
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {typeof step === "number" && (
          <span className="hidden shrink-0 tabular-nums text-xs font-medium text-muted-foreground/70 sm:inline">
            {String(step).padStart(2, "0")}
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-foreground">
            {title}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground sm:hidden">
            <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
            {difficulty}
            {minutes != null && <span>・約{minutes}分</span>}
            {done && <span className="text-emerald-600 dark:text-emerald-400">・クリア済み</span>}
          </span>
        </span>
      </span>

      {/* 右側メタ（sm+） */}
      <span
        className={cn(
          "hidden shrink-0 rounded-full px-2 py-0.5 text-xs font-medium sm:inline-block",
          tone.chip,
        )}
      >
        {difficulty}
      </span>
      {minutes != null && (
        <span className="hidden shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
          <Clock className="h-3.5 w-3.5" />
          {minutes}分
        </span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}
