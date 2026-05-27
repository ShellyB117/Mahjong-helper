"use client";

import type { HandAnalysis } from "@/lib/mahjong/analyze";
import { tileFullName } from "@/lib/mahjong/tiles";
import { Tile } from "./Tile";

type AnalysisPanelProps = {
  analysis: HandAnalysis;
};

function shantenLabel(n: number | null): string {
  if (n === null) return "—";
  if (n === -1) return "Agari (winning)";
  if (n === 0) return "Tenpai (ready)";
  return `${n}-shanten`;
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const { shanten, shapes, invalidReason } = analysis;

  return (
    <div className="rounded-lg border border-mj-border bg-mj-panel p-4 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-mj-accent">Analysis</h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          Tiles unseen in wall: {analysis.totalUnseen} / 136
        </p>
      </div>

      {invalidReason && (
        <p className="text-sm text-amber-400/90">{invalidReason}</p>
      )}

      {analysis.valid && shanten !== null && (
        <div className="text-2xl font-bold">{shantenLabel(shanten)}</div>
      )}

      {shapes.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--muted)] uppercase mb-1">
            Shape paths
          </h3>
          <ul className="text-sm space-y-0.5">
            {shapes.map((s) => (
              <li key={s.name}>
                {s.name}: {shantenLabel(s.shanten)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.isKaraten && (
        <p className="text-sm text-red-400 font-medium">
          Karaten — tenpai but every wait tile is dead (0 left).
        </p>
      )}

      {analysis.improvementTiles.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--muted)] uppercase mb-1">
            Tiles that improve your hand
          </h3>
          <ul className="flex flex-wrap gap-2 items-center">
            {analysis.improvementTiles.map((w) => (
              <li key={w.tile} className="flex items-center gap-1">
                <Tile id={w.tile} small />
                <span className="text-xs text-[var(--muted)]">×{w.copiesLeft}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.waits.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--muted)] uppercase mb-1">
            Winning tiles (waits)
          </h3>
          <ul className="flex flex-wrap gap-2 items-center">
            {analysis.waits.map((w) => (
              <li key={w.tile} className="flex items-center gap-1">
                <Tile id={w.tile} small />
                <span className="text-xs text-[var(--muted)]">×{w.copiesLeft}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.bestDiscard && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--muted)] uppercase mb-1">
            Best discard
          </h3>
          <p className="text-sm flex flex-wrap items-center gap-2">
            Discard <Tile id={analysis.bestDiscard.discard} small /> —{" "}
            {analysis.bestDiscard.effectiveTiles} effective tiles in wall
          </p>
          {analysis.discardOptions.length > 1 && (
            <ul className="text-xs mt-2 space-y-1 max-h-32 overflow-y-auto">
              {analysis.discardOptions.slice(0, 8).map((d) => (
                <li key={d.discard} className="flex items-center gap-2 text-[var(--muted)]">
                  <Tile id={d.discard} small />
                  <span>{d.effectiveTiles} effective</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {analysis.yakuWaits.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-[var(--muted)] uppercase mb-1">
            Yaku by wait (tenpai)
          </h3>
          <ul className="text-sm space-y-2">
            {analysis.yakuWaits.map((y) => (
              <li key={y.tile} className="border border-mj-border rounded p-2">
                <div className="flex items-center gap-2">
                  <Tile id={y.tile} small />
                  <span className="font-medium">{tileFullName(y.tile)}</span>
                </div>
                {y.copiesLeft > 0 && (
                  <span className="text-[var(--muted)]"> ×{y.copiesLeft}</span>
                )}
                {y.isAgari ? (
                  <div className="text-xs mt-1 text-[var(--muted)]">
                    {y.yakuman > 0 && (
                      <span className="text-mj-accent">Yakuman </span>
                    )}
                    {Object.keys(y.yaku).length > 0
                      ? Object.entries(y.yaku)
                          .map(([k, v]) => `${k} (${v})`)
                          .join(", ")
                      : y.text || "—"}
                    {" · "}
                    {y.han} han, {y.fu} fu
                  </div>
                ) : (
                  <div className="text-xs text-amber-400/80 mt-1">{y.text}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-[var(--muted)] border-t border-mj-border pt-3">
        MVP limits: no red fives (aka-dora), no riichi/furiten tracking. Yaku uses
        riichi-ts with default options.
      </p>
    </div>
  );
}
