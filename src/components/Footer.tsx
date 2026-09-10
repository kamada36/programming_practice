import Link from "next/link";
import { ExternalLink } from "lucide-react";

/** フッター。メインサイト（resilient-cer.com）への導線を含む。 */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-semibold text-foreground">
              コード・カフェ
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              環境構築なし。ブラウザだけでコードを試せる、
              初心者向けのサイトです。
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span className="font-semibold text-foreground">リンク</span>
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              メニュー一覧
            </Link>
            <a
              href="https://resilient-cer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              ブログ（resilient-cer.com）
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} コード・カフェ / resilient-cer.com
        </p>
      </div>
    </footer>
  );
}
