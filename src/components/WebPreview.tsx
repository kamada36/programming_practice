"use client";

interface WebPreviewProps {
  /** iframe に流し込む完全な HTML ドキュメント（`<style>` / `<script>` を含んでよい） */
  html: string;
  /**
   * 値が変わるたびに iframe を作り直す。
   * コードが同じでも「実行」でスクリプトを走らせ直したいときに使う。
   */
  reloadKey?: number;
  height?: number;
}

/**
 * HTML / CSS / JavaScript を iframe 内でレンダリングするパーツ。
 * `sandbox` でスクリプト実行のみ許可し、同一オリジンアクセスは遮断する。
 * デバウンスや「実行」のタイミング制御は呼び出し側（CodePlayground）が担当する。
 */
export function WebPreview({ html, reloadKey = 0, height = 340 }: WebPreviewProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-muted-foreground">プレビュー</span>
      </div>
      <iframe
        key={reloadKey}
        title="プレビュー"
        className="w-full bg-white"
        style={{ height }}
        sandbox="allow-scripts allow-modals allow-popups"
        srcDoc={html}
      />
    </div>
  );
}
