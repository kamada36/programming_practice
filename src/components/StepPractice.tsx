"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, Pencil, Trophy } from "lucide-react";
import { CodePlayground } from "@/components/CodePlayground";
import { QuizChallenge } from "@/components/QuizChallenge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ExecutionKind, Quiz, RecipeLanguage } from "@/types/recipe";

interface StepPracticeProps {
  recipeId: string;
  title: string;
  language: RecipeLanguage;
  kind: ExecutionKind;
  /** Step 1 の完成見本コード */
  initialCode: string;
  stdin?: string;
  /** Step 2 のお題文 */
  practiceHint?: string;
  /** Step 3 のクイズ */
  quiz?: Quiz;
}

const STEP_META = [
  { id: 1, label: "見本", icon: Eye },
  { id: 2, label: "書き換え", icon: Pencil },
  { id: 3, label: "挑戦", icon: Trophy },
] as const;

/** 各ステップ下部の「戻る / 次へ」ナビゲーション。 */
function StepNav({
  back,
  next,
}: {
  back?: { label: string; onClick: () => void };
  next?: { label: string; onClick: () => void };
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-2">
      {back ? (
        <Button variant="secondary" onClick={back.onClick}>
          <ArrowLeft className="h-4 w-4" />
          {back.label}
        </Button>
      ) : (
        <span />
      )}
      {next ? (
        <Button onClick={next.onClick}>
          {next.label}
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <span />
      )}
    </div>
  );
}

/** ステップ見出し（STEP n / タイトル / 補足）。 */
function StepHeading({
  n,
  title,
  desc,
}: {
  n: number;
  title: string;
  desc?: string;
}) {
  return (
    <div className="mb-3">
      <span className="text-xs font-bold tracking-widest text-accent">
        STEP {n}
      </span>
      <h3 className="text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h3>
      {desc && (
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      )}
    </div>
  );
}

/**
 * 機能①：1ページ内「3ステップ式 段階学習」UI。
 * 見本 → 書き換え → 挑戦。上部タブと各ステップ下部の「戻る / 次へ」で行き来できる。
 */
export function StepPractice({
  recipeId,
  title,
  language,
  kind,
  initialCode,
  stdin,
  practiceHint,
  quiz,
}: StepPracticeProps) {
  const steps = STEP_META.filter((s) => s.id !== 3 || quiz);
  const [active, setActive] = useState<number>(1);

  return (
    <div className="not-prose my-6 sm:my-8">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        3ステップで、試して味わう
      </p>

      {/* ステップ切り替えタブ（セグメントコントロール風） */}
      <div
        role="tablist"
        aria-label="学習ステップ"
        className="flex gap-1 rounded-xl border border-border bg-muted p-1"
      >
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = active === step.id;
          return (
            <button
              key={step.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(step.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-border text-muted-foreground",
                )}
              >
                {step.id}
              </span>
              <Icon className="hidden h-4 w-4 shrink-0 sm:block" />
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Step 1: 見本 */}
      <div
        className={cn("mt-5", active === 1 ? "" : "hidden")}
        role="tabpanel"
      >
        <StepHeading
          n={1}
          title="まず見本を動かす"
          desc={
            kind === "web"
              ? "完成したコードです。「実行」を押して、どう動くか見てみよう。"
              : "完成したコードです。「実行」を押して、出力を見てみよう。"
          }
        />
        <CodePlayground
          language={language}
          kind={kind}
          starterCode={initialCode}
          stdin={stdin}
        />
        <StepNav
          next={{ label: "書き換えへ", onClick: () => setActive(2) }}
        />
      </div>

      {/* Step 2: 書き換え */}
      <div
        className={cn("mt-5", active === 2 ? "" : "hidden")}
        role="tabpanel"
      >
        <StepHeading
          n={2}
          title="1か所だけ書き換える"
          desc="コードを1か所いじって、結果がどう変わるか試してみよう。"
        />
        <div className="mb-3 rounded-xl border border-accent/40 bg-accent/5 px-4 py-3 text-sm leading-relaxed text-foreground">
          <span className="font-semibold text-accent">アレンジ：</span>
          {practiceHint ??
            "コードの数値や文字を1か所だけ書き換えて、結果がどう変わるか試してみよう。"}
        </div>
        <CodePlayground
          language={language}
          kind={kind}
          starterCode={initialCode}
          stdin={stdin}
        />
        <StepNav
          back={{ label: "見本へ", onClick: () => setActive(1) }}
          next={
            quiz ? { label: "挑戦へ", onClick: () => setActive(3) } : undefined
          }
        />
      </div>

      {/* Step 3: 挑戦 */}
      {quiz && (
        <div
          className={cn("mt-5", active === 3 ? "" : "hidden")}
          role="tabpanel"
        >
          <StepHeading
            n={3}
            title="穴埋めに挑戦"
            desc="選択肢から正しいコードを選んで、テスト実行で確かめよう。"
          />
          <QuizChallenge
            recipeId={recipeId}
            title={title}
            language={language}
            kind={kind}
            quiz={quiz}
          />
          <StepNav
            back={{ label: "書き換えへ", onClick: () => setActive(2) }}
          />
        </div>
      )}
    </div>
  );
}
