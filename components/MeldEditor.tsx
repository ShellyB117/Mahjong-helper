"use client";

import { sortTiles, tileAbbrev } from "@/lib/mahjong/tiles";
import type { Meld, MeldType, TileId } from "@/lib/mahjong/types";
import { Tile } from "./Tile";

type MeldEditorProps = {
  melds: Meld[];
  pendingTiles: TileId[];
  meldType: MeldType;
  onMeldTypeChange: (t: MeldType) => void;
  onClearPending: () => void;
  onSaveMeld: () => void;
  onRemoveMeld: (index: number) => void;
};

const MELD_SIZE: Record<MeldType, number> = {
  chi: 3,
  pon: 3,
  kan: 4,
};

export function MeldEditor({
  melds,
  pendingTiles,
  meldType,
  onMeldTypeChange,
  onClearPending,
  onSaveMeld,
  onRemoveMeld,
}: MeldEditorProps) {
  const need = MELD_SIZE[meldType];

  return (
    <div className="rounded-lg border border-mj-border bg-mj-panel p-3">
      <h2 className="text-sm font-semibold mb-2">Your open melds</h2>

      <div className="flex flex-wrap gap-2 mb-3">
        {(["chi", "pon", "kan"] as MeldType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onMeldTypeChange(t)}
            className={`text-xs px-2 py-1 rounded border ${
              meldType === t
                ? "border-mj-accent text-mj-accent"
                : "border-mj-border text-[var(--muted)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1 mb-2 min-h-[2rem]">
        {pendingTiles.map((id, i) => (
          <Tile key={`${id}-${i}`} id={id} small />
        ))}
        {pendingTiles.length < need && (
          <span className="text-xs text-[var(--muted)] self-center">
            Add {need - pendingTiles.length} tile(s) for {meldType}
          </span>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <button
          type="button"
          disabled={pendingTiles.length !== need}
          onClick={onSaveMeld}
          className="text-xs px-3 py-1 rounded bg-mj-accent/20 text-mj-accent border border-mj-accent/40 disabled:opacity-40"
        >
          Save meld
        </button>
        <button
          type="button"
          onClick={onClearPending}
          className="text-xs text-[var(--muted)] hover:text-white"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {melds.length === 0 ? (
          <p className="text-xs text-[var(--muted)]">No open melds yet.</p>
        ) : (
          melds.map((meld, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs border border-mj-border rounded p-1"
            >
              <span className="text-[var(--muted)] uppercase w-8">{meld.type}</span>
              <span>{sortTiles(meld.tiles).map(tileAbbrev).join(" ")}</span>
              <button
                type="button"
                onClick={() => onRemoveMeld(i)}
                className="ml-auto text-[var(--muted)] hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      <p className="text-[10px] text-[var(--muted)] mt-2">
        Choose &quot;Meld builder&quot;, then tap tiles in the palette once each to
        fill this row.
      </p>
    </div>
  );
}

// Export helper for parent to push pending tiles
export { MELD_SIZE };
