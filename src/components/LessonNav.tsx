"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, PartyPopper } from "lucide-react";
import { useClearedIds } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

interface Adjacent {
  href: string;
  title: string;
}

interface LessonNavProps {
  /** このメニューの進捗 ID。 */
  currentId: string;
  prev?: Adjacent;
  next?: Adjacent;
  /** このカテゴリでいちばん最後のメニューか。 */
  isLast: boolean;
  levelHref: string;
  levelLabel: string;
  menuHref: string;
  categoryLabel: string;
}

/**
 * メニュー詳細ページ末尾のナビ。
 * - クリア済みなら「次へ」を強調＋ひとこと
 * - 前後のメニュー（カテゴリの学習順）を大きめのリンクで
 * - 一覧への戻り導線も添える
 */
export function LessonNav({
  currentId,
  prev,
  next,
  isLast,
  levelHref,
  levelLabel,
  menuHref,
  categoryLabel,
}: LessonNavProps) {
  const done = useClearedIds().includes(currentId);

  return (
    <nav className="mt-10 border-t border-border pt-6">
      {done && (
        <p className="stamp-in mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300">
          <Check className="h-4 w-4" />
          クリア！{next ? "次のメニューへ進みましょう。" : "この言語はここまで。"}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-col rounded-xl border border-border bg-surface p-3 transition-colors hover:border-accent/50 hover:bg-muted/40"
          >
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              前のメニュー
            </span>
            <span className="mt-0.5 text-sm font-medium text-foreground">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span className="hidden sm:block" />
        )}

        {next ? (
          <Link
            href={next.href}
            className={cn(
              "group flex flex-col rounded-xl border p-3 text-right transition-colors",
              done
                ? "border-accent bg-accent/5 ring-1 ring-accent/40 hover:bg-accent/10"
                : "border-border bg-surface hover:border-accent/50 hover:bg-muted/40",
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-end gap-1 text-xs",
                done ? "font-semibold text-accent" : "text-muted-foreground",
              )}
            >
              次のメニュー
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <span className="mt-0.5 text-sm font-medium text-foreground">
              {next.title}
            </span>
          </Link>
        ) : (
          <Link
            href={menuHref}
            className={cn(
              "group flex flex-col items-end rounded-xl border p-3 text-right transition-colors",
              done && isLast
                ? "border-accent bg-accent/5 ring-1 ring-accent/40 hover:bg-accent/10"
                : "border-border bg-surface hover:border-accent/50 hover:bg-muted/40",
            )}
          >
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
              {done && isLast ? (
                <>
                  <PartyPopper className="h-3.5 w-3.5" />
                  {categoryLabel} コンプリート！
                </>
              ) : (
                <>
                  {categoryLabel} のメニュー一覧
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </span>
            <span className="mt-0.5 text-sm font-medium text-foreground">
              ほかのメニューを見る
            </span>
          </Link>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link
          href={levelHref}
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {levelLabel}の一覧
        </Link>
        <Link
          href={menuHref}
          className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {categoryLabel} のメニュー
        </Link>
      </div>
    </nav>
  );
}
