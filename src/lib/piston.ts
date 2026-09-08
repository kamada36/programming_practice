import type { RecipeLanguage } from "@/types/recipe";

/**
 * Piston API（公開インスタンス）へのクライアントサイド実行ユーティリティ。
 * サーバーサイド処理を持たないため、ブラウザから直接呼び出す。
 */
const PISTON_ENDPOINT = "https://emkc.org/api/v2/piston/execute";

/** エディタ言語 → Piston の language / version / ファイル名。 */
const PISTON_LANG: Record<
  Exclude<RecipeLanguage, "html">,
  { language: string; version: string; fileName: string }
> = {
  javascript: { language: "javascript", version: "18.15.0", fileName: "main.js" },
  python: { language: "python", version: "3.10.0", fileName: "main.py" },
  ruby: { language: "ruby", version: "3.0.1", fileName: "main.rb" },
  java: { language: "java", version: "15.0.2", fileName: "Main.java" },
  cpp: { language: "c++", version: "10.2.0", fileName: "main.cpp" },
};

export interface PistonResult {
  /** stdout + stderr を結合した表示用テキスト */
  output: string;
  /** stdout のみ */
  stdout: string;
  /** stderr のみ（コンパイルエラー含む） */
  stderr: string;
  /** 終了コード（null の場合あり） */
  code: number | null;
  /** 実行または通信に失敗した場合のメッセージ */
  error?: string;
}

interface PistonStage {
  stdout: string;
  stderr: string;
  output: string;
  code: number | null;
  signal: string | null;
}

interface PistonApiResponse {
  run?: PistonStage;
  compile?: PistonStage;
  message?: string;
}

/** Piston で対応している言語か。 */
export function isPistonLanguage(
  lang: RecipeLanguage,
): lang is Exclude<RecipeLanguage, "html"> {
  return lang !== "html" && lang in PISTON_LANG;
}

/**
 * コードを Piston API で実行する。
 * @param language エディタ言語
 * @param code 実行するソースコード
 * @param stdin 標準入力（任意）
 */
export async function runOnPiston(
  language: RecipeLanguage,
  code: string,
  stdin = "",
): Promise<PistonResult> {
  if (!isPistonLanguage(language)) {
    return {
      output: "",
      stdout: "",
      stderr: "",
      code: null,
      error: `この言語（${language}）はコンソール実行に対応していません。`,
    };
  }

  const conf = PISTON_LANG[language];

  try {
    const res = await fetch(PISTON_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: conf.language,
        version: conf.version,
        files: [{ name: conf.fileName, content: code }],
        stdin,
        compile_timeout: 10000,
        run_timeout: 8000,
      }),
    });

    if (res.status === 429) {
      return {
        output: "",
        stdout: "",
        stderr: "",
        code: null,
        error:
          "実行リクエストが混み合っています（レート制限）。少し待ってからもう一度お試しください。",
      };
    }

    if (!res.ok) {
      return {
        output: "",
        stdout: "",
        stderr: "",
        code: null,
        error: `実行サーバーからエラーが返されました（HTTP ${res.status}）。`,
      };
    }

    const data = (await res.json()) as PistonApiResponse;

    if (data.message) {
      return {
        output: "",
        stdout: "",
        stderr: "",
        code: null,
        error: data.message,
      };
    }

    const compile = data.compile;
    const run = data.run;

    // コンパイルエラーがあれば優先して表示
    if (compile && compile.code !== 0 && compile.stderr) {
      return {
        output: compile.stderr,
        stdout: "",
        stderr: compile.stderr,
        code: compile.code,
      };
    }

    const stdout = run?.stdout ?? "";
    const stderr = run?.stderr ?? "";
    const combined = [stdout, stderr].filter(Boolean).join("\n").trimEnd();

    return {
      output: combined || "(出力はありません)",
      stdout,
      stderr,
      code: run?.code ?? null,
    };
  } catch (e) {
    return {
      output: "",
      stdout: "",
      stderr: "",
      code: null,
      error:
        "実行サーバーに接続できませんでした。ネットワーク接続を確認してください。",
    };
  }
}
