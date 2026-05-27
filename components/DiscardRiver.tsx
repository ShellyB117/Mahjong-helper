"use client";

import type { Seat, TileId } from "@/lib/mahjong/types";
import { Tile } from "./Tile";

const SEAT_LABELS: Record<Seat, string> = {
  self: "You",
  right: "Right",
  across: "Across",
  left: "Left",
};

type DiscardRiverProps = {
  seat: Seat;
  tiles: TileId[];
  active: boolean;
  onActivate: () => void;
  onRemoveLast: () => void;
};

export function DiscardRiver({
  seat,
  tiles,
  active,
  onActivate,
  onRemoveLast,
}: DiscardRiverProps) {
  return (
    <div
      className={`rounded border p-2 transition-colors ${
        active
          ? "border-mj-accent bg-mj-accent/10"
          : "border-mj-border bg-mj-panel/50"
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <button
          type="button"
          onClick={onActivate}
          className="text-xs font-medium hover:text-mj-accent"
        >
          {SEAT_LABELS[seat]}
          {active && (seat === "self" ? " ← click hand tile" : " ← hand or palette")}
        </button>
        {tiles.length > 0 && (
          <button
            type="button"
            onClick={onRemoveLast}
            className="text-[10px] text-[var(--muted)] hover:text-white"
          >
            Undo
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-0.5 min-h-[1.5rem]">
        {tiles.length === 0 ? (
          <span className="text-[10px] text-[var(--muted)]">—</span>
        ) : (
          tiles.map((id, i) => (
            <Tile key={`${id}-${i}`} id={id} small />
          ))
        )}
      </div>
    </div>
  );
}
