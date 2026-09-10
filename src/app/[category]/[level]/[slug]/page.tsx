import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAdjacentRecipes,
  getAllRecipeParams,
  getCategory,
  getLevel,
  getRecipe,
  recipeHref,
  recipeId,
  recipeLevelSlug,
} from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx";
import { StepPractice } from "@/components/StepPractice";
import { LessonNav } from "@/components/LessonNav";
import { NextStepCard } from "@/components/NextStepCard";
import { ArticleFooter } from "@/components/ArticleFooter";
import { SponsoredPlaceholder } from "@/components/SponsoredPlaceholder";
import { resolveNextStep } from "@/lib/site";

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
  const { prev, next } = getAdjacentRecipes(params.category, params.slug);
  const nextStep = resolveNextStep(frontmatter.nextStep);

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

      {/* 【仮】広告の位置イメージ・候補A：解説の直後 */}
      <SponsoredPlaceholder
        variant="banner"
        note="候補A：記事（解説）を読み終えた直後。「次のメニュー」の上"
        className="mt-8"
      />

      {/* 学習の続き（次のメニュー等） */}
      <LessonNav
        currentId={recipeId(recipe)}
        prev={
          prev
            ? { href: recipeHref(prev), title: prev.frontmatter.title }
            : undefined
        }
        next={
          next
            ? { href: recipeHref(next), title: next.frontmatter.title }
            : undefined
        }
        isLast={!next}
        levelHref={`/${category.slug}/${level.slug}/`}
        levelLabel={level.label}
        menuHref={`/${category.slug}/`}
        categoryLabel={category.shortLabel}
      />

      {/* 読み終えた人にだけ静かに見える、本命ブログへの案内 */}
      <div className="mt-12 space-y-4 border-t border-border/60 pt-8">
        <NextStepCard
          title={nextStep.title}
          description={nextStep.description}
          linkLabel={nextStep.linkLabel}
          href={nextStep.href}
        />
        <ArticleFooter />

        {/* 【仮】広告の位置イメージ・候補B：フッター（ブログ案内・プロフィール）の下 */}
        <SponsoredPlaceholder
          variant="banner"
          note="候補B：ページ最下部。ブログ案内・運営者プロフィールの下"
        />
      </div>
    </article>
  );
}
