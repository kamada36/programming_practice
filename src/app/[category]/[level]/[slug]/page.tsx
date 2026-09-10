import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllRecipeParams,
  getCategory,
  getLevel,
  getRecipe,
  recipeLevelSlug,
} from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx";
import { StepPractice } from "@/components/StepPractice";

interface PageProps {
  params: { category: string; level: string; slug: string };
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
  const level = getLevel(params.level);

  if (!recipe || !category || !level) notFound();
  // URL の難易度とレシピの難易度が食い違う場合は 404
  if (recipeLevelSlug(recipe) !== params.level) notFound();

  const { frontmatter, content } = recipe;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          トップ
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/${category.slug}/`}
          className="transition-colors hover:text-foreground"
        >
          {category.emoji} {category.shortLabel}
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/${category.slug}/${level.slug}/`}
          className="transition-colors hover:text-foreground"
        >
          {level.emoji} {level.label}
        </Link>
      </nav>

      <header className="mt-5 border-b border-border pb-5 sm:mt-6 sm:pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium">
            {category.emoji} {category.label}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-medium">
            {level.emoji} {level.label}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            約{frontmatter.minutes ?? 3}分
          </span>
        </div>

        <h1 className="mt-3 text-xl font-bold leading-tight text-foreground sm:text-3xl">
          {frontmatter.emoji} {frontmatter.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {frontmatter.description}
        </p>
      </header>

      {/* 3ステップ式 段階学習（見本 → 書き換え → 挑戦） */}
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
      <div className="prose prose-stone max-w-none prose-sm sm:prose-base">
        <MDXRemote source={content} components={mdxComponents} />
      </div>

      <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-6">
        <Link
          href={`/${category.slug}/${level.slug}/`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent/80"
        >
          <ArrowLeft className="h-4 w-4" />
          {category.shortLabel} {level.label}の一覧へ
        </Link>
        <Link
          href={`/${category.slug}/`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {category.shortLabel} のコース全体
        </Link>
      </div>
    </article>
  );
}
