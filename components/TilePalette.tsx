"use client";

import { ALL_TILES, SUIT_SECTIONS, TILE_LEGEND, suitLegendClass } from "@/lib/mahjong/tiles";
import type { TileId } from "@/lib/mahjong/types";
import { Tile } from "./Tile";

type TilePaletteProps = {
  selected: TileId | null;
  onSelect: (tile: TileId) => void;
  remaining: Record<TileId, number>;
};

export function TilePalette({
  selected,
  onSelect,
  remaining,
}: TilePaletteProps) {
  const suits = SUIT_SECTIONS.map(({ suit, label, hint }) => ({
    label,
    hint,
    suit,
    tiles: ALL_TILES.filter((t) => t.endsWith(suit)),
  }));

  return (
    <div className="space-y-3 rounded-lg border border-mj-border bg-mj-panel p-3">
      <p className="text-xs text-[var(--muted)]">
        Tap a tile to select, then add to hand, discard river, or meld. Numbers show
        copies left in the wall. {TILE_LEGEND}
      </p>
      {suits.map(({ label, hint, suit, tiles }) => (
        <div key={label}>
          <span
            className={`text-xs font-semibold mr-2 ${suitLegendClass(suit)}`}
          >
            {label}
          </span>
          <span className="text-[10px] text-[var(--muted)]">{hint}</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {tiles.map((id) => {
              const left = remaining[id];
              const disabled = left <= 0;
              return (
                <div key={id} className="relative">
                  <Tile
                    id={id}
                    small
                    selected={selected === id}
                    onClick={disabled ? undefined : () => onSelect(id)}
                  />
                  <span
                    className={`absolute -top-1 -right-1 text-[10px] rounded-full px-1 min-w-[14px] text-center ${
                      disabled
                        ? "bg-red-900/80 text-red-200"
                        : "bg-mj-bg/90 text-[var(--muted)]"
                    }`}
                  >
                    {left}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
