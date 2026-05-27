import type { GameState, Seat, TileId } from "./types";
import { SEATS } from "./types";

export const STORAGE_KEY = "riichi-helper-state";

export function defaultGameState(): GameState {
  return {
    concealed: [],
    melds: SEATS.map((seat) => ({ seat, melds: [] })),
    discards: {
      self: [],
      right: [],
      across: [],
      left: [],
    },
    doraIndicators: [],
    roundWind: "east",
    seatWind: "east",
  };
}

export function parseGameState(json: string | null): GameState {
  if (!json) return defaultGameState();
  try {
    const parsed = JSON.parse(json) as GameState;
    return {
      ...defaultGameState(),
      ...parsed,
      discards: { ...defaultGameState().discards, ...parsed.discards },
      melds: parsed.melds?.length
        ? parsed.melds
        : defaultGameState().melds,
    };
  } catch {
    return defaultGameState();
  }
}

export function serializeGameState(state: GameState): string {
  return JSON.stringify(state);
}

export function canAddToHand(state: GameState, tile: TileId): boolean {
  const visible = countTileEverywhere(state, tile);
  return visible < 4;
}

function countTileEverywhere(state: GameState, tile: TileId): number {
  let n = 0;
  for (const t of state.concealed) if (t === tile) n++;
  for (const seat of SEATS) {
    for (const t of state.discards[seat]) if (t === tile) n++;
  }
  for (const t of state.doraIndicators) if (t === tile) n++;
  for (const { melds } of state.melds) {
    for (const meld of melds) {
      for (const t of meld.tiles) if (t === tile) n++;
    }
  }
  return n;
}

export function addToConcealed(state: GameState, tile: TileId): GameState {
  if (!canAddToHand(state, tile)) return state;
  if (state.concealed.length >= 14) return state;
  return { ...state, concealed: [...state.concealed, tile] };
}

export function removeFromConcealed(
  state: GameState,
  tile: TileId,
  index?: number,
): GameState {
  const idx = index ?? state.concealed.lastIndexOf(tile);
  if (idx < 0) return state;
  const concealed = [...state.concealed];
  concealed.splice(idx, 1);
  return { ...state, concealed };
}

export function addDiscard(
  state: GameState,
  seat: Seat,
  tile: TileId,
): GameState {
  if (!canAddToHand(state, tile)) return state;
  return {
    ...state,
    discards: {
      ...state.discards,
      [seat]: [...state.discards[seat], tile],
    },
  };
}

export function removeLastDiscard(state: GameState, seat: Seat): GameState {
  const river = [...state.discards[seat]];
  river.pop();
  return { ...state, discards: { ...state.discards, [seat]: river } };
}

/** Move one tile from your concealed hand to a discard river (one click). */
export function moveHandToDiscard(
  state: GameState,
  seat: Seat,
  handIndex: number,
): GameState {
  if (handIndex < 0 || handIndex >= state.concealed.length) return state;
  const tile = state.concealed[handIndex];
  const concealed = [...state.concealed];
  concealed.splice(handIndex, 1);
  return {
    ...state,
    concealed,
    discards: {
      ...state.discards,
      [seat]: [...state.discards[seat], tile],
    },
  };
}

export function isDiscardMode(mode: string): mode is Seat {
  return SEATS.includes(mode as Seat);
}
