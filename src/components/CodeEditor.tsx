"use client";

import Editor from "@monaco-editor/react";
import type { RecipeLanguage } from "@/types/recipe";

/** エディタ言語 → Monaco の言語ID。 */
const MONACO_LANG: Record<RecipeLanguage, string> = {
  html: "html",
  javascript: "javascript",
  python: "python",
  ruby: "ruby",
  java: "java",
  cpp: "cpp",
};

interface CodeEditorProps {
  value: string;
  language: RecipeLanguage;
  onChange: (value: string) => void;
  /** エディタの高さ（px） */
  height?: number;
}

/** Monaco Editor のラップコンポーネント。カフェ風ダークテーマを適用。 */
export function CodeEditor({
  value,
  language,
  onChange,
  height = 340,
}: CodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#1E1E1E]">
      <Editor
        height={height}
        language={MONACO_LANG[language]}
        theme="vs-dark"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        options={{
          fontSize: 14,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 14, bottom: 14 },
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          renderLineHighlight: "line",
          scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
        }}
        loading={
          <div className="grid h-full place-items-center text-sm text-stone-400">
            エディタを読み込み中…
          </div>
        }
      />
    </div>
  );
}
