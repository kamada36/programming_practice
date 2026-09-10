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
  /** 運営者名 */
  author: "鎌田",
  /** 記事末尾プロフィールの短い自己紹介 */
  authorBio:
    "10年の製造業からIT転職した経験をもとに、挫折しないWeb学習法をブログで配信中。",
} as const;

/** frontmatter に nextStep が無いときに表示する既定案内（ブログトップへ）。 */
export const DEFAULT_NEXT_STEP = {
  title: "☕ 次のステップへ",
  description:
    "未経験からWebエンジニアを目指すための学習の進め方や、独学でつまずかないコツをブログにまとめています。",
  href: BLOG.url,
  linkLabel: `${BLOG.name} で読む`,
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
 * frontmatter の nextStep を表示用に整える。
 * 必須項目（title / description / url）が欠けていれば既定案内にフォールバック。
 */
export function resolveNextStep(nextStep?: NextStep): ResolvedNextStep {
  if (nextStep?.title && nextStep?.description && nextStep?.url) {
    return {
      title: nextStep.title,
      description: nextStep.description,
      href: unwrapMarkdownLink(nextStep.url),
      linkLabel: nextStep.linkLabel?.trim() || `${BLOG.name} で記事を読む`,
    };
  }
  return { ...DEFAULT_NEXT_STEP };
}
