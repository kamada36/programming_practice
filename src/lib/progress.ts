/**
 * 登録不要の学習進捗ストア。
 * LocalStorage に「クリアしたレシピ ID（"web/button-click" 形式）」の配列を保存する。
 * サーバー処理は持たず、ブラウザ内で完結する。
 */

const STORAGE_KEY = "code-kitchen:cleared:v1";
/** 進捗が変わったことを同一タブ内へ知らせるカスタムイベント名。 */
const PROGRESS_EVENT = "code-kitchen:progress";

/** 1言語分のスタンプ達成メモ（おまけ表示用の控えめなバッジ）。 */
export interface StampMilestone {
  /** 表示絵文字 */
  emoji: string;
  /** ツールチップ等に使うラベル */
  label: string;
}

/**
 * その言語で「何杯クリアしたか」に応じた控えめなバッジを返す。
 * 言語ごとにメニュー数が違う（4〜6品）ため、割合で判定する。
 */
export function stampMilestone(
  done: number,
  total: number,
): StampMilestone | null {
  if (total === 0 || done === 0) return null;
  if (done >= total) return { emoji: "🏆", label: "コンプリート" };
  if (done * 2 >= total) return { emoji: "☕", label: "折り返し" };
  return { emoji: "🌱", label: "スタート" };
}

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

/** クリア済みレシピ ID の一覧を取得する。 */
export function getClearedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/** 指定レシピがクリア済みか。 */
export function isCleared(id: string): boolean {
  return getClearedIds().includes(id);
}

/** レシピをクリア済みとして記録する（すでに記録済みなら何もしない）。 */
export function markCleared(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const ids = getClearedIds();
    if (ids.includes(id)) return;
    ids.push(id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    /* LocalStorage が使えない環境では黙って無視する */
  }
}

/** すべての進捗をリセットする。 */
export function resetProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(PROGRESS_EVENT));
  } catch {
    /* noop */
  }
}

/* --- useSyncExternalStore 用のスナップショット / 購読 --- */

const EMPTY: string[] = [];
let cachedRaw: string | null = null;
let cachedValue: string[] = EMPTY;

/** 参照が安定したクライアント側スナップショット。 */
export function getClearedSnapshot(): string[] {
  if (typeof window === "undefined") return EMPTY;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parse(raw);
  }
  return cachedValue;
}

/** サーバー側スナップショット（常に空）。 */
export function getServerSnapshot(): string[] {
  return EMPTY;
}

/** 進捗の変化を購読する。返り値で解除。 */
export function subscribeProgress(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(PROGRESS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
