/**
 * 登録不要の学習進捗ストア。
 * LocalStorage に「クリアしたレシピ ID（"web/button-click" 形式）」の配列を保存する。
 * サーバー処理は持たず、ブラウザ内で完結する。
 */

const STORAGE_KEY = "code-kitchen:cleared:v1";
/** 進捗が変わったことを同一タブ内へ知らせるカスタムイベント名。 */
const PROGRESS_EVENT = "code-kitchen:progress";

/** スタンプが貯まると獲得できる称号バッジ。 */
export interface Badge {
  /** 獲得に必要なクリア数 */
  threshold: number;
  /** 称号名 */
  label: string;
  /** 表示絵文字 */
  emoji: string;
}

export const BADGES: Badge[] = [
  { threshold: 1, label: "はじめの一歩", emoji: "🌱" },
  { threshold: 3, label: "ビギナーマスター", emoji: "🥉" },
  { threshold: 5, label: "レシピ職人", emoji: "🥈" },
  { threshold: 10, label: "キッチンマスター", emoji: "🏆" },
];

/** 現在のクリア数で獲得済みの、最上位バッジを返す。 */
export function earnedBadge(count: number): Badge | null {
  let earned: Badge | null = null;
  for (const b of BADGES) {
    if (count >= b.threshold) earned = b;
  }
  return earned;
}

/** 次に狙えるバッジを返す（すべて獲得済みなら null）。 */
export function nextBadge(count: number): Badge | null {
  for (const b of BADGES) {
    if (count < b.threshold) return b;
  }
  return null;
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
