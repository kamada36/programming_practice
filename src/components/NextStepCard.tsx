import { ArrowRight } from "lucide-react";

interface NextStepCardProps {
  /** 控えめな見出し */
  title: string;
  /** 簡潔な説明 */
  description: string;
  /** リンクテキスト */
  linkLabel: string;
  /** 遷移先 URL（resilient-cer.com） */
  href: string;
}

/**
 * この題材に関連するブログ記事を、記事の最下部でそっと紹介するカード。
 * 「次にやること」ではなく、あくまで関連する読み物の案内。
 * 広告バナーではなく、カフェのショップカードのように風景へ溶け込ませる。
 * 割り込みなし・プル型（スクロールした人の目にだけ入る）。
 */
export function NextStepCard({
  title,
  description,
  linkLabel,
  href,
}: NextStepCardProps) {
  return (
    <aside className="rounded-2xl border border-[#E6DFD5] bg-[#F9F6F0] p-5 dark:border-border dark:bg-surface">
      <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
        このテーマの関連記事
      </p>
      <h2 className="mt-1.5 text-base font-bold leading-snug text-foreground">
        {title}
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent transition-colors hover:text-accent/80"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </a>
    </aside>
  );
}
