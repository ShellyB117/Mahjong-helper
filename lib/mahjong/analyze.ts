import { Riichi } from "riichi-ts";
import syanten from "syanten";
import {
  parseSyantenKey,
  tileIdToRiichi,
  tilesToHai,
  windToRiichi,
} from "./convert";
import type { TileCounts } from "./visible";
import { countVisibleTiles, remainingFromVisible, selfMeldCount } from "./visible";
import type { GameState, Meld, TileId } from "./types";

export type WaitTile = {
  tile: TileId;
  copiesLeft: number;
  structuralCount: number;
};

export type DiscardOption = {
  discard: TileId;
  waits: WaitTile[];
  effectiveTiles: number;
};

export type ShapePath = {
  name: "standard" | "chiitoitsu" | "kokushi";
  shanten: number;
};

export type YakuWait = {
  tile: TileId;
  copiesLeft: number;
  isAgari: boolean;
  han: number;
  fu: number;
  yaku: Record<string, number>;
  yakuman: number;
  text: string;
};

export type HandAnalysis = {
  valid: boolean;
  invalidReason?: string;
  shanten: number | null;
  shapes: ShapePath[];
  isTenpai: boolean;
  isAgari: boolean;
  isKaraten: boolean;
  improvementTiles: WaitTile[];
  waits: WaitTile[];
  discardOptions: DiscardOption[];
  bestDiscard: DiscardOption | null;
  yakuWaits: YakuWait[];
  totalUnseen: number;
};

type HairiResult = {
  now?: number;
  wait?: Record<string, number>;
  [key: string]: unknown;
};

function parseWaitMap(
  map: Record<string, number> | undefined,
  remaining: TileCounts,
): WaitTile[] {
  if (!map) return [];
  const out: WaitTile[] = [];
  for (const [key, structuralCount] of Object.entries(map)) {
    const tile = parseSyantenKey(key);
    if (!tile) continue;
    out.push({
      tile,
      copiesLeft: remaining[tile],
      structuralCount,
    });
  }
  return out.sort((a, b) => b.copiesLeft - a.copiesLeft || a.tile.localeCompare(b.tile));
}

function filterEffective(waits: WaitTile[]): WaitTile[] {
  return waits.filter((w) => w.copiesLeft > 0);
}

function effectiveSum(waits: WaitTile[]): number {
  return waits.reduce((s, w) => s + w.copiesLeft, 0);
}

function meldsToRiichiOpen(melds: Meld[]): Array<{ open: boolean; tiles: number[] }> {
  return melds.map((m) => ({
    open: m.open,
    tiles: m.tiles.map(tileIdToRiichi),
  }));
}

function calcYakuForWait(
  state: GameState,
  concealed: TileId[],
  waitTile: TileId,
  openMelds: Meld[],
): YakuWait {
  const closed = concealed.map(tileIdToRiichi);
  const waitNum = tileIdToRiichi(waitTile);
  const closedWithWait = [...closed, waitNum];

  const hand = new Riichi(
    closedWithWait,
    meldsToRiichiOpen(openMelds),
    {
      bakaze: windToRiichi(state.roundWind),
      jikaze: windToRiichi(state.seatWind),
      dora: state.doraIndicators.map(tileIdToRiichi),
    },
    waitNum,
    false,
    false,
    false,
    false,
    false,
    false,
    0,
    false,
    true,
    false,
  );
  hand.disableHairi();
  const result = hand.calc();
  const remaining = remainingFromVisible(countVisibleTiles(state));

  return {
    tile: waitTile,
    copiesLeft: remaining[waitTile],
    isAgari: result.isAgari,
    han: result.han,
    fu: result.fu,
    yaku: result.yaku ?? {},
    yakuman: result.yakuman ?? 0,
    text: result.text || (result.isAgari ? "" : "no yaku"),
  };
}

export function analyzeHand(state: GameState): HandAnalysis {
  const visible = countVisibleTiles(state);
  const remaining = remainingFromVisible(visible);
  const totalUnseen = 136 - Object.values(visible).reduce((a, b) => a + b, 0);
  const meldCount = selfMeldCount(state);
  const len = state.concealed.length;
  const selfMelds = state.melds.find((m) => m.seat === "self")?.melds ?? [];

  const empty: HandAnalysis = {
    valid: false,
    shanten: null,
    shapes: [],
    isTenpai: false,
    isAgari: false,
    isKaraten: false,
    improvementTiles: [],
    waits: [],
    discardOptions: [],
    bestDiscard: null,
    yakuWaits: [],
    totalUnseen,
  };

  if (len === 0) {
    return { ...empty, valid: true };
  }

  const validLengths = [14, 13, 11, 10, 8, 7, 5, 4, 2, 1];
  if (!validLengths.includes(len)) {
    return {
      ...empty,
      invalidReason: `Hand has ${len} tiles; with ${meldCount} open meld(s) use ${validLengths.join(", ")} concealed tiles.`,
    };
  }

  const hai = tilesToHai(state.concealed);
  const std = syanten.syanten(hai);
  const chi = syanten.syanten7(hai);
  const koku = syanten.syanten13(hai);
  const best = syanten(hai);

  const shapes: ShapePath[] = (
    [
      { name: "standard" as const, shanten: std },
      { name: "chiitoitsu" as const, shanten: chi },
      { name: "kokushi" as const, shanten: koku },
    ] satisfies ShapePath[]
  ).sort((a, b) => a.shanten - b.shanten);

  const isAgari = best === -1;
  const isTenpai = best === 0;
  let improvementTiles: WaitTile[] = [];
  let waits: WaitTile[] = [];
  const discardOptions: DiscardOption[] = [];

  const hairiStd = syanten.hairi(hai) as HairiResult;
  const hairiAlt = syanten.hairi(hai, true) as HairiResult;

  if (len === 13 || [11, 10, 8, 7, 5, 4, 2, 1].includes(len)) {
    const waitMap =
      (hairiStd.wait as Record<string, number> | undefined) ??
      (hairiAlt.wait as Record<string, number> | undefined);
    const raw = parseWaitMap(waitMap, remaining);
    if (isTenpai) {
      waits = raw;
    } else {
      improvementTiles = filterEffective(raw);
    }
  }

  if (len === 14 || len === 10 || len === 7 || len === 4) {
    for (const [key, value] of Object.entries(hairiStd)) {
      if (key === "now" || key === "wait") continue;
      const discard = parseSyantenKey(key);
      if (!discard || typeof value !== "object" || value === null) continue;
      const waitMap = value as Record<string, number>;
      const parsed = parseWaitMap(waitMap, remaining);
      discardOptions.push({
        discard,
        waits: parsed,
        effectiveTiles: effectiveSum(filterEffective(parsed)),
      });
    }
    discardOptions.sort((a, b) => b.effectiveTiles - a.effectiveTiles);
  }

  const bestDiscard = discardOptions[0] ?? null;

  if (isTenpai && len === 13) {
    waits = parseWaitMap(hairiStd.wait as Record<string, number>, remaining);
  }

  const effectiveWaits = filterEffective(waits);
  const isKaraten = isTenpai && waits.length > 0 && effectiveWaits.length === 0;

  let yakuWaits: YakuWait[] = [];
  if (isTenpai && len === 13) {
    const waitTiles = [...new Set(waits.map((w) => w.tile))];
    yakuWaits = waitTiles.map((t) =>
      calcYakuForWait(state, state.concealed, t, selfMelds),
    );
  }

  return {
    valid: true,
    shanten: best,
    shapes,
    isTenpai,
    isAgari,
    isKaraten,
    improvementTiles,
    waits: effectiveWaits,
    discardOptions,
    bestDiscard,
    yakuWaits,
    totalUnseen,
  };
}
