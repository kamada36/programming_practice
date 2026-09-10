import { ExternalLink } from "lucide-react";
import { BLOG } from "@/lib/site";

/**
 * 記事末尾などに置く運営者プロフィール。
 * 「誰が作っているか」を示すのが主で、ブログへは押し付けず「よかったらどうぞ」の温度。
 */
export function ArticleFooter() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface p-4">
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground"
        aria-hidden
      >
        レ
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground">
          運営者
        </p>
        <p className="mt-0.5 text-sm font-semibold text-foreground">
          {BLOG.author}
          <span className="ml-1 font-normal text-muted-foreground">
            ／ {BLOG.name}
          </span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {BLOG.authorBio}
        </p>
        <a
          href={BLOG.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent/80"
        >
          よかったら、ブログものぞいてみてください
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
