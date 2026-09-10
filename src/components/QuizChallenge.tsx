"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CheckCircle2, Lightbulb, Loader2, Play, Stamp } from "lucide-react";
import { WebPreview } from "@/components/WebPreview";
import { ConsoleOutput } from "@/components/ConsoleOutput";
import { Button } from "@/components/ui/button";
import { runOnPiston, type PistonResult } from "@/lib/piston";
import { isCleared, markCleared } from "@/lib/progress";
import { cn } from "@/lib/utils";
import type { ExecutionKind, Quiz, RecipeLanguage } from "@/types/recipe";

const PLACEHOLDER = "___CHOICE___";

interface QuizChallengeProps {
  /** "web/button-click" 形式のレシピ ID */
  recipeId: string;
  /** レシピタイトル（スタンプ文言に使う） */
  title: string;
  language: RecipeLanguage;
  kind: ExecutionKind;
  quiz: Quiz;
  editorHeight?: number;
}

/** 文字列を決定的にシャッフルする（SSR とクライアントで同じ順序になる）。 */
function stableShuffle<T>(items: T[], seed: string): T[] {
  const hash = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i += 1) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  return items
    .map((value, index) => ({ value, key: hash(`${seed}:${index}:${String(value)}`) }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.value);
}

/** コード片を `___CHOICE___` で分割する。parts.length - 1 が穴の数。 */
function splitSnippet(snippet: string): string[] {
  return snippet.split(PLACEHOLDER);
}

/** 選択値でコードを組み立てる（未選択は `???`）。 */
function assemble(parts: string[], values: (string | null)[]): string {
  let out = parts[0] ?? "";
  for (let i = 0; i < values.length; i += 1) {
    out += (values[i] ?? "???") + (parts[i + 1] ?? "");
  }
  return out;
}

/**
 * 機能②：選択式・穴埋めチャレンジ。
 * コード内の `___CHOICE___` をドロップダウンで埋め、「テスト実行」で判定する。
 * 正解でカフェ風スタンプ + 紙吹雪、LocalStorage にクリアを保存。
 */
export function QuizChallenge({
  recipeId,
  title,
  language,
  kind,
  quiz,
  editorHeight = 300,
}: QuizChallengeProps) {
  const parts = useMemo(() => splitSnippet(quiz.codeSnippet), [quiz.codeSnippet]);
  const blankCount = Math.max(parts.length - 1, 0);

  const shuffledOptions = useMemo(
    () => stableShuffle(quiz.options, quiz.question),
    [quiz.options, quiz.question],
  );

  /** 各穴の 1-indexed 行番号（ヒント表示用）。 */
  const placeholderLines = useMemo(() => {
    const lines: number[] = [];
    let from = 0;
    while (true) {
      const at = quiz.codeSnippet.indexOf(PLACEHOLDER, from);
      if (at === -1) break;
      lines.push(quiz.codeSnippet.slice(0, at).split("\n").length);
      from = at + PLACEHOLDER.length;
    }
    return lines;
  }, [quiz.codeSnippet]);

  const [selected, setSelected] = useState<(string | null)[]>(() =>
    Array.from({ length: blankCount }, () => null),
  );
  const [checked, setChecked] = useState(false);
  const [running, setRunning] = useState(false);
  const [pistonResult, setPistonResult] = useState<PistonResult | null>(null);
  const [alreadyCleared, setAlreadyCleared] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  useEffect(() => {
    setAlreadyCleared(isCleared(recipeId));
  }, [recipeId]);

  const isWeb = kind === "web";
  const assembled = useMemo(() => assemble(parts, selected), [parts, selected]);

  const labelIsCorrect = useCallback(
    (label: string | null) =>
      !!label && quiz.options.some((o) => o.label === label && o.isCorrect),
    [quiz.options],
  );

  const allFilled = selected.every((v) => v !== null);
  const allCorrect = allFilled && selected.every((v) => labelIsCorrect(v));

  const firstBadIndex = selected.findIndex((v) => !labelIsCorrect(v));
  const hintLine =
    placeholderLines[firstBadIndex >= 0 ? firstBadIndex : 0] ?? 1;

  const handleSelect = useCallback((index: number, value: string) => {
    setSelected((prev) => {
      const next = [...prev];
      next[index] = value || null;
      return next;
    });
    setChecked(false);
    setPistonResult(null);
  }, []);

  const fireConfetti = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 90,
        spread: 72,
        startVelocity: 42,
        origin: { y: 0.75 },
        colors: ["#D97706", "#6B4423", "#F59E0B", "#FDFBF7", "#B45309"],
        scalar: 0.9,
      });
    } catch {
      /* 紙吹雪が出せなくても致命的ではない */
    }
  }, []);

  const handleTest = useCallback(async () => {
    if (!isWeb) {
      setRunning(true);
      setPistonResult(null);
      const r = await runOnPiston(language, assembled, "");
      setPistonResult(r);
      setRunning(false);
    } else {
      setPreviewKey((k) => k + 1);
    }
    setChecked(true);

    if (allCorrect) {
      markCleared(recipeId);
      setAlreadyCleared(true);
      setCelebrate(true);
      void fireConfetti();
      window.setTimeout(() => setCelebrate(false), 2600);
    }
  }, [isWeb, language, assembled, allCorrect, recipeId, fireConfetti]);

  const passed = checked && allCorrect;

  return (
    <section className="not-prose relative my-8 rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/15 text-accent">
          <Stamp className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-foreground">
          穴埋めチャレンジ
        </h3>
        {alreadyCleared && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            <CheckCircle2 className="h-3.5 w-3.5" />
            クリア済み
          </span>
        )}
      </div>

      <p className="mb-4 text-sm leading-relaxed text-foreground">
        {quiz.question}
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <pre className="overflow-x-auto rounded-xl border border-border bg-[#1E1E1E] p-3 text-[13px] leading-relaxed text-stone-100">
            <code className="font-mono whitespace-pre">
              {parts.map((part, i) => (
                <Fragment key={i}>
                  {part}
                  {i < blankCount && (
                    <select
                      aria-label={`穴埋め ${i + 1}`}
                      value={selected[i] ?? ""}
                      onChange={(e) => handleSelect(i, e.target.value)}
                      className={cn(
                        "mx-1 rounded-md border px-1.5 py-0.5 align-middle font-mono text-[13px] outline-none",
                        selected[i] == null
                          ? "border-amber-400 bg-amber-400/15 text-amber-300"
                          : checked && !labelIsCorrect(selected[i])
                            ? "border-red-400 bg-red-400/15 text-red-300"
                            : "border-accent bg-accent/20 text-amber-200",
                      )}
                    >
                      <option value="" disabled>
                        ???
                      </option>
                      {shuffledOptions.map((o) => (
                        <option key={o.label} value={o.label}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Fragment>
              ))}
            </code>
          </pre>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleTest} disabled={running || !allFilled}>
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              テスト実行
            </Button>
            {!allFilled && (
              <span className="text-xs text-muted-foreground">
                すべての「???」を選ぼう
              </span>
            )}
          </div>

          {checked && passed && (
            <div className="rounded-xl border border-green-300 bg-green-50 px-3 py-2.5 text-sm text-green-900">
              <p className="flex items-center gap-1.5 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                正解！「{title}」をマスターしました！
              </p>
              <p className="mt-1 leading-relaxed text-green-800">
                {quiz.explanation}
              </p>
            </div>
          )}

          {checked && !passed && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
              <p className="flex items-center gap-1.5 font-semibold">
                <Lightbulb className="h-4 w-4" />
                おしい！コードの {hintLine} 行目を見直してみよう。
              </p>
              <p className="mt-1 leading-relaxed text-amber-800">
                選んだ値でコードがどう動くか、右のプレビューでも確かめてみてね。
              </p>
            </div>
          )}
        </div>

        <div>
          {isWeb ? (
            <WebPreview
              html={assembled}
              reloadKey={previewKey}
              height={editorHeight}
            />
          ) : (
            <ConsoleOutput
              result={pistonResult}
              loading={running}
              height={editorHeight}
            />
          )}
        </div>
      </div>

      {celebrate && (
        <div
          className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
          aria-hidden
        >
          <div className="stamp-pop select-none rounded-2xl border-4 border-accent bg-surface/95 px-6 py-4 text-center shadow-card">
            <p className="text-xs font-bold uppercase tracking-widest text-accent">
              CLEAR
            </p>
            <p className="mt-1 text-lg font-extrabold text-primary">
              {title}
            </p>
            <p className="text-sm font-semibold text-accent">マスター！</p>
          </div>
        </div>
      )}
    </section>
  );
}
