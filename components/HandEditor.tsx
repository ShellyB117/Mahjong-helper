"use client";

import type { Seat, TileId } from "@/lib/mahjong/types";
import { Tile } from "./Tile";

const SEAT_DISCARD_LABEL: Record<Seat, string> = {
  self: "your discard river",
  right: "right player's discards",
  across: "across player's discards",
  left: "left player's discards",
};

type HandEditorProps = {
  tiles: TileId[];
  discardTarget: Seat | null;
  onTileClick: (tile: TileId, index: number) => void;
  onClear: () => void;
};

export function HandEditor({
  tiles,
  discardTarget,
  onTileClick,
  onClear,
}: HandEditorProps) {
  const indexed = tiles
    .map((id, index) => ({ id, index }))
    .sort((a, b) => {
      const order = (id: TileId) => {
        const suit = id.slice(-1);
        const num = Number(id.slice(0, -1));
        const suitOrder = suit === "m" ? 0 : suit === "p" ? 1 : suit === "s" ? 2 : 3;
        return suitOrder * 10 + num;
      };
      return order(a.id) - order(b.id);
    });

  return (
    <div
      className={`rounded-lg border bg-mj-panel p-3 ${
        discardTarget
          ? "border-mj-accent ring-1 ring-mj-accent/30"
          : "border-mj-border"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold">
          Your hand <span className="text-[var(--muted)] font-normal">({tiles.length})</span>
        </h2>
        {tiles.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[var(--muted)] hover:text-white"
          >
            Clear hand
          </button>
        )}
      </div>
      {discardTarget && (
        <p className="text-xs text-mj-accent mb-2">
          Click a hand tile to discard to {SEAT_DISCARD_LABEL[discardTarget]}.
        </p>
      )}
      <div className="flex flex-wrap gap-1 min-h-[2.5rem]">
        {indexed.length === 0 ? (
          <p className="text-sm text-[var(--muted)]">
            {discardTarget
              ? "Add tiles to your hand first (palette → Hand)."
              : "Select tiles from the palette below."}
          </p>
        ) : (
          indexed.map(({ id, index }) => (
          <Tile
            key={`${id}-${index}`}
            id={id}
            onClick={() => onTileClick(id, index)}
            title={
              discardTarget
                ? `Discard to ${SEAT_DISCARD_LABEL[discardTarget]}`
                : "Remove from hand"
            }
          />
          ))
        )}
      </div>
    </div>
  );
}
