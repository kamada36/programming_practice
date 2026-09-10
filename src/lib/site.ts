/**
 * 本命ブログ（resilient-cer.com）まわりの定数と、記事末尾案内の解決ロジック。
 * 送客はあくまでプル型・控えめに。割り込み表示はしない。
 */
import type { NextStep } from "@/types/recipe";

export const BLOG = {
  /** ブランド名 */
  name: "Resilencer Cafe",
  /** ブログ URL */
  url: "https://resilient-cer.com",
  /** 運営者の呼び名（本名は非公表） */
  author: "レジサン",
  /** 記事末尾プロフィールの短い自己紹介 */
  authorBio:
    "10年の製造業からIT転職した経験をもとに、挫折しないWeb学習法をブログで配信中。",
} as const;

export interface ResolvedNextStep {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

/** frontmatter からコピペで混入しがちな Markdown リンク記法 `[x](y)` を URL だけに戻す。 */
function unwrapMarkdownLink(url: string): string {
  const m = url.match(/\]\((https?:\/\/[^)]+)\)/);
  return (m ? m[1] : url).trim();
}

/**
 * frontmatter の nextStep（＝この題材に関連するブログ記事）を表示用に整える。
 * 「次にやること」ではなく、あくまで関連する読み物の紹介。
 * 必須項目（title / description / url）が揃っていなければ null（カードを出さない）。
 */
export function resolveNextStep(nextStep?: NextStep): ResolvedNextStep | null {
  if (nextStep?.title && nextStep?.description && nextStep?.url) {
    return {
      title: nextStep.title,
      description: nextStep.description,
      href: unwrapMarkdownLink(nextStep.url),
      linkLabel: nextStep.linkLabel?.trim() || "ブログで読む",
    };
  }
  return null;
}
