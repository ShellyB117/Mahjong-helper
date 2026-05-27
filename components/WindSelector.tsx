"use client";

import type { Wind } from "@/lib/mahjong/types";
import { WINDS } from "@/lib/mahjong/types";

type WindSelectorProps = {
  roundWind: Wind;
  seatWind: Wind;
  onRoundWind: (w: Wind) => void;
  onSeatWind: (w: Wind) => void;
  doraCount: number;
  onAddDora: () => void;
  onClearDora: () => void;
};

const LABELS: Record<Wind, string> = {
  east: "East",
  south: "South",
  west: "West",
  north: "North",
};

export function WindSelector({
  roundWind,
  seatWind,
  onRoundWind,
  onSeatWind,
  doraCount,
  onAddDora,
  onClearDora,
}: WindSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end text-sm">
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[var(--muted)]">Round wind</span>
        <select
          value={roundWind}
          onChange={(e) => onRoundWind(e.target.value as Wind)}
          className="bg-mj-bg border border-mj-border rounded px-2 py-1"
        >
          {WINDS.map((w) => (
            <option key={w} value={w}>
              {LABELS[w]}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-xs text-[var(--muted)]">Seat wind</span>
        <select
          value={seatWind}
          onChange={(e) => onSeatWind(e.target.value as Wind)}
          className="bg-mj-bg border border-mj-border rounded px-2 py-1"
        >
          {WINDS.map((w) => (
            <option key={w} value={w}>
              {LABELS[w]}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-[var(--muted)]">Dora ({doraCount})</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onAddDora}
            className="text-xs px-2 py-1 border border-mj-border rounded hover:border-mj-accent"
          >
            + indicator
          </button>
          <button
            type="button"
            onClick={onClearDora}
            className="text-xs text-[var(--muted)] hover:text-white"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
