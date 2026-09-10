"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { useClearedIds } from "@/hooks/useProgress";
import { levelTone } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export interface LessonRowData {
  /** 進捗 ID（"web/button-click" 形式）。 */
  id: string;
  href: string;
  title: string;
  /** 表示用の難易度ラベル（"入門" など）。 */
  difficulty: string;
  /** 難易度スラッグ（配色用。"intro" など）。 */
  levelSlug: string;
  minutes?: number;
  /** グループ内の通し番号（任意）。 */
  step?: number;
  /** 使わなくなった項目（互換のため受け取るだけ）。 */
  emoji?: string;
}

/**
 * 一覧の1行。左端にクリア済みチェック（枠の外）、その内側に通し番号（消えない）、
 * タイトル全文、難易度色ドット。行全体がリンク。
 */
export function LessonRow({
  id,
  href,
  title,
  difficulty,
  levelSlug,
  step,
}: LessonRowData) {
  const cleared = useClearedIds();
  const done = cleared.includes(id);
  const tone = levelTone(levelSlug);

  return (
    <Link
      href={href}
      className="group flex items-center gap-2 rounded-lg border border-border/70 bg-surface py-2 pl-1 pr-2.5 transition-colors hover:border-accent/50 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* クリア済みチェック（枠の外・一番左。未クリア時は場所だけ確保） */}
      <span className="grid w-4 shrink-0 place-items-center" aria-hidden>
        {done && (
          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
        )}
      </span>

      {/* 通し番号（クリアしても消えない） */}
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded text-[11px] font-semibold tabular-nums",
          done
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300"
            : "bg-muted text-muted-foreground/70",
        )}
        aria-hidden
      >
        {typeof step === "number" ? String(step).padStart(2, "0") : ""}
      </span>

      <span className="min-w-0 flex-1 text-sm leading-snug text-foreground">
        {title}
      </span>

      <span
        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)}
        title={difficulty}
        aria-hidden
      />
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}
