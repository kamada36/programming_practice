"use client";

import { AlertTriangle, TerminalSquare } from "lucide-react";
import type { PistonResult } from "@/lib/piston";

interface ConsoleOutputProps {
  result: PistonResult | null;
  loading: boolean;
  height?: number;
}

/** Piston API の実行結果を表示するコンソール風パーツ。 */
export function ConsoleOutput({
  result,
  loading,
  height = 340,
}: ConsoleOutputProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#1E1E1E]">
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-stone-400">
        <TerminalSquare className="h-3.5 w-3.5" />
        出力
        {result?.code != null && !loading && (
          <span
            className={
              result.code === 0 ? "text-green-400" : "text-red-400"
            }
          >
            (exit {result.code})
          </span>
        )}
      </div>

      <div
        className="overflow-auto p-3 font-mono text-[13px] leading-relaxed"
        style={{ height }}
      >
        {loading && (
          <span className="text-stone-400">実行中…</span>
        )}

        {!loading && !result && (
          <span className="text-stone-500">
            「実行」ボタンを押すと、ここに結果が表示されます。
          </span>
        )}

        {!loading && result?.error && (
          <div className="flex items-start gap-2 text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="whitespace-pre-wrap">{result.error}</span>
          </div>
        )}

        {!loading && result && !result.error && (
          <pre className="whitespace-pre-wrap break-words text-stone-100">
            {result.output}
          </pre>
        )}
      </div>
    </div>
  );
}
