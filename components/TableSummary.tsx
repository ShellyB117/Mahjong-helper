"use client";

import { ALL_TILES, tileAbbrev, tileFullName, tileStyleClass } from "@/lib/mahjong/tiles";
import type { TileCounts } from "@/lib/mahjong/visible";

function remainCellClass(id: (typeof ALL_TILES)[number], n: number): string {
  if (n === 0) return "remain-cell-dead";
  const style = tileStyleClass(id);
  if (style === "tile-man") return "remain-cell-man";
  if (style === "tile-pin") return "remain-cell-pin";
  if (style === "tile-sou") return "remain-cell-sou";
  return "remain-cell-honor";
}

type TableSummaryProps = {
  remaining: TileCounts;
};

export function TableSummary({ remaining }: TableSummaryProps) {
  return (
    <div className="rounded-lg border border-mj-border bg-mj-panel p-3">
      <h2 className="text-sm font-semibold mb-2">Tiles remaining in wall</h2>
      <div className="grid grid-cols-9 sm:grid-cols-17 gap-0.5">
        {ALL_TILES.map((id) => {
          const n = remaining[id];
          const heat = remainCellClass(id, n);
          return (
            <div
              key={id}
              title={tileFullName(id)}
              className={`text-[9px] sm:text-[10px] text-center py-1 rounded border border-transparent ${heat} ${
                n === 1 ? "ring-1 ring-amber-500/60" : ""
              }`}
            >
              <div className="truncate">{tileAbbrev(id)}</div>
              <div className="font-bold">{n}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
