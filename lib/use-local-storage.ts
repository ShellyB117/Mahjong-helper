"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(key: string, onStoreChange: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === key || e.key === null) onStoreChange();
  };
  window.addEventListener("storage", handler);
  window.addEventListener("riichi-helper-storage", onStoreChange);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("riichi-helper-storage", onStoreChange);
  };
}

function getSnapshot(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useLocalStorage(
  key: string,
): [string | null, (value: string | null) => void] {
  const value = useSyncExternalStore(
    (onChange) => subscribe(key, onChange),
    () => getSnapshot(key),
    () => null,
  );

  const setValue = useCallback(
    (next: string | null) => {
      try {
        if (next === null) localStorage.removeItem(key);
        else localStorage.setItem(key, next);
        window.dispatchEvent(new Event("riichi-helper-storage"));
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return [value, setValue];
}
