import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllRecipeParams,
  getCategory,
  getRecipe,
} from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx";
import { StepPractice } from "@/components/StepPractice";

interface PageProps {
  params: { category: string; slug: string };
}

/** SSG: 全レシピのパスを生成する。 */
export function generateStaticParams() {
  return getAllRecipeParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const recipe = getRecipe(params.category, params.slug);
  if (!recipe) return {};
  return {
    title: recipe.frontmatter.title,
    description: recipe.frontmatter.description,
    openGraph: {
      title: recipe.frontmatter.title,
      description: recipe.frontmatter.description,
    },
  };
}

export default function RecipePage({ params }: PageProps) {
  const recipe = getRecipe(params.category, params.slug);
  const category = getCategory(params.category);

  if (!recipe || !category) notFound();

  const { frontmatter, content } = recipe;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        レシピ一覧へ
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium">
            {category.emoji} {category.label}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium">
            {frontmatter.difficulty}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            約{frontmatter.minutes ?? 3}分
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {frontmatter.emoji} {frontmatter.title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {frontmatter.description}
        </p>
      </header>

      {/* 3ステップ式 段階学習（見る → 少し変える → 挑戦する） */}
      <StepPractice
        recipeId={`${recipe.category}/${recipe.slug}`}
        title={frontmatter.title}
        language={frontmatter.language}
        kind={frontmatter.kind}
        initialCode={frontmatter.starterCode}
        stdin={frontmatter.stdin}
        practiceHint={frontmatter.practiceHint}
        quiz={frontmatter.quiz}
      />

      {/* 解説 */}
      <div className="prose prose-stone max-w-none">
        <MDXRemote source={content} components={mdxComponents} />
      </div>
    </article>
  );
}
