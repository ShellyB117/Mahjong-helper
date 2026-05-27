import syanten from "syanten";
import type { TileId, Wind } from "./types";
import { ALL_TILES } from "./tiles";

export type HaiArr = syanten.HaiArr;

export function tilesToHai(tiles: TileId[]): HaiArr {
  const hai: HaiArr = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  for (const id of tiles) {
    const suit = id.slice(-1);
    const num = Number(id.slice(0, -1)) - 1;
    if (suit === "m") hai[0][num]++;
    else if (suit === "p") hai[1][num]++;
    else if (suit === "s") hai[2][num]++;
    else hai[3][num]++;
  }

  return hai;
}

/** syanten notation: 1m, 9p, 3s, 1z */
export function parseSyantenKey(key: string): TileId | null {
  const m = key.match(/^(\d)([mps])$/);
  if (m) {
    const id = `${m[1]}${m[2]}` as TileId;
    return ALL_TILES.includes(id) ? id : null;
  }
  const z = key.match(/^(\d)z$/);
  if (z) {
    const id = `${z[1]}z` as TileId;
    return ALL_TILES.includes(id) ? id : null;
  }
  return null;
}

/** riichi-ts tile index: 0–8 man, 9–17 pin, 18–26 sou, 27–33 honors */
export function tileIdToRiichi(id: TileId): number {
  const suit = id.slice(-1);
  const num = Number(id.slice(0, -1)) - 1;
  if (suit === "m") return num;
  if (suit === "p") return 9 + num;
  if (suit === "s") return 18 + num;
  return 27 + num;
}

export function riichiToTileId(n: number): TileId | null {
  if (n >= 0 && n <= 8) return `${n + 1}m` as TileId;
  if (n >= 9 && n <= 17) return `${(n - 9) + 1}p` as TileId;
  if (n >= 18 && n <= 26) return `${(n - 18) + 1}s` as TileId;
  if (n >= 27 && n <= 33) return `${n - 26}z` as TileId;
  return null;
}

const WIND_TO_RIICHI: Record<Wind, number> = {
  east: 27,
  south: 28,
  west: 29,
  north: 30,
};

export function windToRiichi(wind: Wind): number {
  return WIND_TO_RIICHI[wind];
}
