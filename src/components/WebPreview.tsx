"use client";

import { useEffect, useRef, useState } from "react";

interface WebPreviewProps {
  /** iframe に流し込む完全な HTML ドキュメント（`<style>` / `<script>` を含んでよい） */
  html: string;
  height?: number;
}

/**
 * HTML / CSS / JavaScript を iframe 内でリアルタイムレンダリングするパーツ。
 * `sandbox` でスクリプト実行のみ許可し、同一オリジンアクセスは遮断する。
 */
export function WebPreview({ html, height = 340 }: WebPreviewProps) {
  const [srcDoc, setSrcDoc] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // 入力のたびに再描画しないよう 300ms デバウンス
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSrcDoc(html), 300);
    return () => clearTimeout(timer.current);
  }, [html]);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-muted-foreground">プレビュー</span>
      </div>
      <iframe
        title="プレビュー"
        className="w-full bg-white"
        style={{ height }}
        sandbox="allow-scripts allow-modals allow-popups"
        srcDoc={srcDoc}
      />
    </div>
  );
}
