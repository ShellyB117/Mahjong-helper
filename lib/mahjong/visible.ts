import { ALL_TILES } from "./tiles";
import type { GameState, Seat, TileId } from "./types";

export type TileCounts = Record<TileId, number>;

export function emptyCounts(): TileCounts {
  return Object.fromEntries(ALL_TILES.map((t) => [t, 0])) as TileCounts;
}

export function countVisibleTiles(state: GameState): TileCounts {
  const visible = emptyCounts();

  const add = (tiles: TileId[]) => {
    for (const t of tiles) {
      visible[t]++;
    }
  };

  add(state.concealed);
  for (const seat of Object.keys(state.discards) as Seat[]) {
    add(state.discards[seat]);
  }
  add(state.doraIndicators);
  for (const { melds } of state.melds) {
    for (const meld of melds) {
      add(meld.tiles);
    }
  }

  return visible;
}

export function remainingFromVisible(visible: TileCounts): TileCounts {
  const remaining = emptyCounts();
  for (const t of ALL_TILES) {
    remaining[t] = Math.max(0, 4 - visible[t]);
  }
  return remaining;
}

export function totalVisible(visible: TileCounts): number {
  return ALL_TILES.reduce((sum, t) => sum + visible[t], 0);
}

export function selfMeldCount(state: GameState): number {
  const self = state.melds.find((m) => m.seat === "self");
  return self?.melds.length ?? 0;
}

/** Valid concealed lengths for syanten given open meld count */
export function validConcealedLengths(meldCount: number): number[] {
  const base = [14, 13, 11, 10, 8, 7, 5, 4, 2, 1];
  const allowed = new Set<number>();
  for (let m = 0; m <= 4; m++) {
    if (m === meldCount) {
      for (const n of base) {
        const openTiles = m * 3;
        if (n + openTiles === 14 || n + openTiles === 13) allowed.add(n);
      }
    }
  }
  return [...allowed].sort((a, b) => b - a);
}

export function isValidConcealedSize(state: GameState): boolean {
  const melds = selfMeldCount(state);
  const len = state.concealed.length;
  return validConcealedLengths(melds).includes(len);
}
