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
 * `sandbox` はスクリプト・フォーム・モーダル等のみ許可し、`allow-same-origin` は
 * 付けない（srcDoc は不透明オリジンなので、親ページや Cookie には触れられない）。
 * `allow-forms` が無いと Chrome がサンドボックス内のフォーム送信を丸ごとブロックし、
 * ToDo リストのような form の submit ハンドラが動かなくなるため必須。
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
        sandbox="allow-scripts allow-forms allow-modals allow-popups"
        srcDoc={html}
      />
    </div>
  );
}
