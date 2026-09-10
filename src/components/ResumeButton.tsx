"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useClearedIds } from "@/hooks/useProgress";

interface ResumeItem {
  id: string;
  href: string;
  title: string;
}

/**
 * カテゴリの「続きから」ボタン。
 * 進捗を見て、最初の未クリアのメニューへ誘導する。
 */
export function ResumeButton({ recipes }: { recipes: ResumeItem[] }) {
  const cleared = new Set(useClearedIds());
  if (recipes.length === 0) return null;

  const firstUndone = recipes.find((r) => !cleared.has(r.id));
  const allDone = !firstUndone;
  const someDone = recipes.some((r) => cleared.has(r.id));

  const target = firstUndone ?? recipes[0];
  const label = allDone
    ? "もう一度はじめから"
    : someDone
      ? "続きからはじめる"
      : "はじめから進める";

  return (
    <Link
      href={target.href}
      className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      {allDone ? (
        <RotateCcw className="h-4 w-4" />
      ) : (
        <ArrowRight className="h-4 w-4" />
      )}
      <span>
        {label}
        {!allDone && someDone && (
          <span className="ml-1.5 font-normal text-primary-foreground/75">
            {target.title}
          </span>
        )}
      </span>
    </Link>
  );
}
