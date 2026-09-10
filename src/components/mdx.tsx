import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import { CodePlayground } from "@/components/CodePlayground";
import { StepPractice } from "@/components/StepPractice";
import { QuizChallenge } from "@/components/QuizChallenge";

/**
 * MDX 本文から使えるカスタムコンポーネント。
 * 記事内に <Callout> や <CodePlayground> を直接書けるようにする。
 */
function Callout({
  children,
  type = "tip",
}: {
  children: React.ReactNode;
  type?: "tip" | "warn";
}) {
  const styles =
    type === "warn"
      ? "border-red-300 bg-red-50 text-red-900"
      : "border-accent/40 bg-accent/5 text-foreground";
  return (
    <div className={`not-prose my-5 rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles}`}>
      {children}
    </div>
  );
}

export const mdxComponents: MDXRemoteProps["components"] = {
  CodePlayground,
  StepPractice,
  QuizChallenge,
  Callout,
};
