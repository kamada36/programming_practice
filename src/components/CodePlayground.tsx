"use client";

import { useCallback, useMemo, useState } from "react";
import { Play, RotateCcw, Loader2 } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { WebPreview } from "@/components/WebPreview";
import { ConsoleOutput } from "@/components/ConsoleOutput";
import { Button } from "@/components/ui/button";
import { runOnPiston, type PistonResult } from "@/lib/piston";
import type { ExecutionKind, RecipeLanguage } from "@/types/recipe";

interface CodePlaygroundProps {
  language: RecipeLanguage;
  kind: ExecutionKind;
  starterCode: string;
  stdin?: string;
  editorHeight?: number;
}

/**
 * エディタと実行結果を統括するメインコンポーネント。
 * - web: iframe でリアルタイムプレビュー
 * - console: Piston API でクライアントサイド実行
 */
export function CodePlayground({
  language,
  kind,
  starterCode,
  stdin = "",
  editorHeight = 340,
}: CodePlaygroundProps) {
  const initial = useMemo(() => starterCode.replace(/\s+$/, "") + "\n", [
    starterCode,
  ]);
  const [code, setCode] = useState(initial);
  const [result, setResult] = useState<PistonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const isWeb = kind === "web";

  const handleRun = useCallback(async () => {
    setLoading(true);
    setResult(null);
    const r = await runOnPiston(language, code, stdin);
    setResult(r);
    setLoading(false);
  }, [language, code, stdin]);

  const handleReset = useCallback(() => {
    setCode(initial);
    setResult(null);
  }, [initial]);

  return (
    <div className="not-prose my-8 rounded-2xl border border-border bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {language}
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            aria-label="コードをリセット"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </Button>

          {!isWeb && (
            <Button size="sm" onClick={handleRun} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              実行
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <CodeEditor
          value={code}
          language={language}
          onChange={setCode}
          height={editorHeight}
        />

        {isWeb ? (
          <WebPreview html={code} height={editorHeight} />
        ) : (
          <ConsoleOutput
            result={result}
            loading={loading}
            height={editorHeight}
          />
        )}
      </div>

      {isWeb && (
        <p className="mt-3 text-xs text-muted-foreground">
          コードを書き換えると、右側のプレビューに自動で反映されます。
        </p>
      )}
      {!isWeb && (
        <p className="mt-3 text-xs text-muted-foreground">
          「実行」を押すと Piston
          の公開サーバーでコードが実行されます（結果が返るまで数秒かかることがあります）。
        </p>
      )}
    </div>
  );
}
