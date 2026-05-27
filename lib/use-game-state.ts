"use client";

import { useCallback, useMemo } from "react";
import {
  defaultGameState,
  parseGameState,
  serializeGameState,
  STORAGE_KEY,
} from "@/lib/mahjong/game-state";
import type { GameState } from "@/lib/mahjong/types";
import { useLocalStorage } from "@/lib/use-local-storage";

export function useGameState(): [
  GameState,
  (updater: GameState | ((prev: GameState) => GameState)) => void,
  () => void,
] {
  const [raw, setRaw] = useLocalStorage(STORAGE_KEY);

  const state = useMemo(() => parseGameState(raw), [raw]);

  const setState = useCallback(
    (updater: GameState | ((prev: GameState) => GameState)) => {
      const next =
        typeof updater === "function"
          ? updater(parseGameState(raw))
          : updater;
      setRaw(serializeGameState(next));
    },
    [raw, setRaw],
  );

  const reset = useCallback(() => {
    setRaw(serializeGameState(defaultGameState()));
  }, [setRaw]);

  return [state, setState, reset];
}
