import type { CSSProperties } from "react";
import type { TileId } from "./types";

const MAN = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const PIN = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const SOU = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const HONOR = [1, 2, 3, 4, 5, 6, 7] as const;

export const ALL_TILES: TileId[] = [
  ...MAN.map((n) => `${n}m` as TileId),
  ...PIN.map((n) => `${n}p` as TileId),
  ...SOU.map((n) => `${n}s` as TileId),
  ...HONOR.map((n) => `${n}z` as TileId),
];

const WIND_ABBREV = ["E", "S", "W", "N"] as const;
const WIND_NAMES = ["East", "South", "West", "North"] as const;
const DRAGON_ABBREV = ["Wh", "G", "R"] as const;
const DRAGON_NAMES = ["White dragon", "Green dragon", "Red dragon"] as const;

const SUIT_NAMES = {
  m: "Characters",
  p: "Circles",
  s: "Bamboo",
} as const;

/** Short label on tile buttons: 1m, 5p, E, Wh, … */
export function tileAbbrev(id: TileId): string {
  const suit = id.slice(-1);
  const num = Number(id.slice(0, -1));
  if (suit === "z") {
    if (num <= 4) return WIND_ABBREV[num - 1];
    return DRAGON_ABBREV[num - 5];
  }
  return id;
}

/** Full English name for tooltips and analysis text */
export function tileFullName(id: TileId): string {
  const suit = id.slice(-1);
  const num = Number(id.slice(0, -1));
  if (suit === "z") {
    if (num <= 4) return WIND_NAMES[num - 1];
    return DRAGON_NAMES[num - 5];
  }
  return `${num} ${SUIT_NAMES[suit as "m" | "p" | "s"]}`;
}

/** @deprecated use tileAbbrev or tileFullName */
export function tileLabel(id: TileId): string {
  return tileFullName(id);
}

export const SUIT_SECTIONS: {
  suit: "m" | "p" | "s" | "z";
  label: string;
  hint: string;
}[] = [
  { suit: "m", label: "Characters", hint: "1m–9m" },
  { suit: "p", label: "Circles", hint: "1p–9p" },
  { suit: "s", label: "Bamboo", hint: "1s–9s" },
  {
    suit: "z",
    label: "Honors",
    hint: "E S W N · Wh G R",
  },
];

export const TILE_LEGEND =
  "m = characters, p = circles, s = bamboo · E/S/W/N = winds · Wh/G/R = dragons";

export type TileFaceStyle = {
  className: string;
  style: CSSProperties;
};

const TILE_FACES: Record<string, TileFaceStyle> = {
  man: {
    className: "tile-man",
    style: {
      background: "linear-gradient(165deg, #fff9f2 0%, #f2ddd0 48%, #e8c9b8 100%)",
      borderColor: "#c94a3a",
      color: "#9f1239",
    },
  },
  pin: {
    className: "tile-pin",
    style: {
      background: "linear-gradient(165deg, #f4f9ff 0%, #dce9f8 48%, #c5daf0 100%)",
      borderColor: "#2563eb",
      color: "#1d4ed8",
    },
  },
  sou: {
    className: "tile-sou",
    style: {
      background: "linear-gradient(165deg, #f3fcf6 0%, #d8eedc 48%, #bdd9c4 100%)",
      borderColor: "#15803d",
      color: "#166534",
    },
  },
  wind: {
    className: "tile-wind",
    style: {
      background: "linear-gradient(165deg, #f5f3ff 0%, #e4dff5 48%, #d0c8ea 100%)",
      borderColor: "#6d28d9",
      color: "#5b21b6",
    },
  },
  "dragon-white": {
    className: "tile-dragon-white",
    style: {
      background: "linear-gradient(165deg, #fafafa 0%, #e8e8e8 48%, #d4d4d4 100%)",
      borderColor: "#737373",
      color: "#404040",
    },
  },
  "dragon-green": {
    className: "tile-dragon-green",
    style: {
      background: "linear-gradient(165deg, #ecfdf5 0%, #bbf7d0 48%, #86efac 100%)",
      borderColor: "#059669",
      color: "#047857",
    },
  },
  "dragon-red": {
    className: "tile-dragon-red",
    style: {
      background: "linear-gradient(165deg, #fff1f2 0%, #fecdd3 48%, #fda4af 100%)",
      borderColor: "#dc2626",
      color: "#b91c1c",
    },
  },
};

function tileFaceKey(id: TileId): keyof typeof TILE_FACES {
  const suit = id.slice(-1);
  const num = Number(id.slice(0, -1));
  if (suit === "m") return "man";
  if (suit === "p") return "pin";
  if (suit === "s") return "sou";
  if (num <= 4) return "wind";
  if (num === 5) return "dragon-white";
  if (num === 6) return "dragon-green";
  return "dragon-red";
}

export function getTileFace(id: TileId): TileFaceStyle {
  return TILE_FACES[tileFaceKey(id)];
}

/** CSS class for tile face (see globals.css `.tile-*`) */
export function tileStyleClass(id: TileId): string {
  return getTileFace(id).className;
}

export function suitLegendClass(suit: "m" | "p" | "s" | "z"): string {
  if (suit === "m") return "text-tile-man-label";
  if (suit === "p") return "text-tile-pin-label";
  if (suit === "s") return "text-tile-sou-label";
  return "text-tile-honor-label";
}

export function sortTiles(tiles: TileId[]): TileId[] {
  const order = (id: TileId) => {
    const suit = id.slice(-1);
    const num = Number(id.slice(0, -1));
    const suitOrder = suit === "m" ? 0 : suit === "p" ? 1 : suit === "s" ? 2 : 3;
    return suitOrder * 10 + num;
  };
  return [...tiles].sort((a, b) => order(a) - order(b));
}

export function isTileId(value: string): value is TileId {
  return /^[1-9][mps]$/.test(value) || /^[1-7]z$/.test(value);
}

export function countTiles(tiles: TileId[]): Record<TileId, number> {
  const counts = Object.fromEntries(ALL_TILES.map((t) => [t, 0])) as Record<
    TileId,
    number
  >;
  for (const t of tiles) {
    if (counts[t] !== undefined) counts[t]++;
  }
  return counts;
}
