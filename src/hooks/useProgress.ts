"use client";

import { useSyncExternalStore } from "react";
import {
  getClearedSnapshot,
  getServerSnapshot,
  subscribeProgress,
} from "@/lib/progress";

/**
 * クリア済みレシピ ID の配列を返すフック。
 * LocalStorage の変化（同一タブ・別タブ）に追従して再レンダリングする。
 */
export function useClearedIds(): string[] {
  return useSyncExternalStore(
    subscribeProgress,
    getClearedSnapshot,
    getServerSnapshot,
  );
}
