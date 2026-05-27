"use client";

import { useCallback, useMemo, useState } from "react";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { DiscardRiver } from "@/components/DiscardRiver";
import { HandEditor } from "@/components/HandEditor";
import { MeldEditor } from "@/components/MeldEditor";
import { TableSummary } from "@/components/TableSummary";
import { TilePalette } from "@/components/TilePalette";
import { WindSelector } from "@/components/WindSelector";
import { analyzeHand } from "@/lib/mahjong/analyze";
import {
  addDiscard,
  addToConcealed,
  canAddToHand,
  isDiscardMode,
  moveHandToDiscard,
  removeFromConcealed,
  removeLastDiscard,
} from "@/lib/mahjong/game-state";
import type { Meld, MeldType, Seat, TileId } from "@/lib/mahjong/types";
import { SEATS } from "@/lib/mahjong/types";
import {
  countVisibleTiles,
  remainingFromVisible,
} from "@/lib/mahjong/visible";
import { useGameState } from "@/lib/use-game-state";

type AddMode = "hand" | Seat | "meld" | "dora";

export default function HomePage() {
  const [state, setState, resetAll] = useGameState();
  const [selectedTile, setSelectedTile] = useState<TileId | null>(null);
  const [addMode, setAddMode] = useState<AddMode>("hand");
  const [meldType, setMeldType] = useState<MeldType>("pon");
  const [pendingMeld, setPendingMeld] = useState<TileId[]>([]);

  const remaining = useMemo(
    () => remainingFromVisible(countVisibleTiles(state)),
    [state],
  );

  const analysis = useMemo(() => analyzeHand(state), [state]);

  const selfMelds = state.melds.find((m) => m.seat === "self")?.melds ?? [];

  const placeTile = useCallback(
    (tile: TileId) => {
      if (!canAddToHand(state, tile)) return;

      if (addMode === "hand") {
        setState((s) => addToConcealed(s, tile));
      } else if (addMode === "meld") {
        const need =
          meldType === "kan" ? 4 : 3;
        if (pendingMeld.length < need) {
          setPendingMeld((p) => [...p, tile]);
        }
      } else if (addMode === "dora") {
        setState((s) => ({
          ...s,
          doraIndicators: [...s.doraIndicators, tile],
        }));
      } else {
        setState((s) => addDiscard(s, addMode as Seat, tile));
      }
      setSelectedTile(null);
    },
    [addMode, meldType, pendingMeld.length, setState, state],
  );

  const onPaletteSelect = useCallback(
    (tile: TileId) => {
      if (isDiscardMode(addMode)) {
        placeTile(tile);
        return;
      }
      if (selectedTile === tile) {
        placeTile(tile);
      } else {
        setSelectedTile(tile);
      }
    },
    [addMode, placeTile, selectedTile],
  );

  const onHandTileClick = useCallback(
    (tile: TileId, index: number) => {
      if (isDiscardMode(addMode)) {
        setState((s) => moveHandToDiscard(s, addMode, index));
        return;
      }
      setState((s) => removeFromConcealed(s, tile, index));
    },
    [addMode, setState],
  );

  const discardTarget = isDiscardMode(addMode) ? addMode : null;

  const saveMeld = useCallback(() => {
    const need = meldType === "kan" ? 4 : 3;
    if (pendingMeld.length !== need) return;
    const meld: Meld = {
      type: meldType,
      tiles: [...pendingMeld],
      open: true,
    };
    setState((s) => {
      const melds = s.melds.map((sm) =>
        sm.seat === "self"
          ? { ...sm, melds: [...sm.melds, meld] }
          : sm,
      );
      return { ...s, melds };
    });
    setPendingMeld([]);
    setAddMode("hand");
  }, [meldType, pendingMeld, setState]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <WindSelector
          roundWind={state.roundWind}
          seatWind={state.seatWind}
          onRoundWind={(roundWind) => setState((s) => ({ ...s, roundWind }))}
          onSeatWind={(seatWind) => setState((s) => ({ ...s, seatWind }))}
          doraCount={state.doraIndicators.length}
          onAddDora={() => setAddMode("dora")}
          onClearDora={() =>
            setState((s) => ({ ...s, doraIndicators: [] }))
          }
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetAll}
            className="text-xs px-3 py-1.5 border border-mj-border rounded hover:border-red-400/50 text-[var(--muted)]"
          >
            Reset table
          </button>
        </div>
      </div>

      {state.doraIndicators.length > 0 && (
        <div className="text-xs flex flex-wrap gap-1 items-center">
          <span className="text-[var(--muted)]">Dora:</span>
          {state.doraIndicators.map((t, i) => (
            <span key={`${t}-${i}`} className="font-mono">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <DiscardRiver
            seat="across"
            tiles={state.discards.across}
            active={addMode === "across"}
            onActivate={() => setAddMode("across")}
            onRemoveLast={() =>
              setState((s) => removeLastDiscard(s, "across"))
            }
          />

          <div className="grid grid-cols-[1fr_2fr_1fr] gap-2 items-start">
            <DiscardRiver
              seat="left"
              tiles={state.discards.left}
              active={addMode === "left"}
              onActivate={() => setAddMode("left")}
              onRemoveLast={() =>
                setState((s) => removeLastDiscard(s, "left"))
              }
            />
            <div className="space-y-3">
              <HandEditor
                tiles={state.concealed}
                discardTarget={discardTarget}
                onTileClick={onHandTileClick}
                onClear={() => setState((s) => ({ ...s, concealed: [] }))}
              />
              <MeldEditor
                melds={selfMelds}
                pendingTiles={pendingMeld}
                meldType={meldType}
                onMeldTypeChange={setMeldType}
                onClearPending={() => setPendingMeld([])}
                onSaveMeld={saveMeld}
                onRemoveMeld={(index) =>
                  setState((s) => ({
                    ...s,
                    melds: s.melds.map((sm) =>
                      sm.seat === "self"
                        ? {
                            ...sm,
                            melds: sm.melds.filter((_, i) => i !== index),
                          }
                        : sm,
                    ),
                  }))
                }
              />
            </div>
            <DiscardRiver
              seat="right"
              tiles={state.discards.right}
              active={addMode === "right"}
              onActivate={() => setAddMode("right")}
              onRemoveLast={() =>
                setState((s) => removeLastDiscard(s, "right"))
              }
            />
          </div>

          <DiscardRiver
            seat="self"
            tiles={state.discards.self}
            active={addMode === "self"}
            onActivate={() => setAddMode("self")}
            onRemoveLast={() => setState((s) => removeLastDiscard(s, "self"))}
          />

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-[var(--muted)]">Add to:</span>
            {(
              [
                ["hand", "Hand"],
                ["self", "Your discards"],
                ["meld", "Meld builder"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setAddMode(mode)}
                className={`px-2 py-1 rounded border ${
                  addMode === mode
                    ? "border-mj-accent text-mj-accent"
                    : "border-mj-border text-[var(--muted)]"
                }`}
              >
                {label}
              </button>
            ))}
            {SEATS.filter((s) => s !== "self" && s !== "across").map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAddMode(s)}
                className={`px-2 py-1 rounded border ${
                  addMode === s
                    ? "border-mj-accent text-mj-accent"
                    : "border-mj-border text-[var(--muted)]"
                }`}
              >
                {s} discards
              </button>
            ))}
            <button
              type="button"
              onClick={() => setAddMode("dora")}
              className={`px-2 py-1 rounded border ${
                addMode === "dora"
                  ? "border-mj-accent text-mj-accent"
                  : "border-mj-border text-[var(--muted)]"
              }`}
            >
              Dora
            </button>
          </div>

          <TilePalette
            selected={selectedTile}
            onSelect={onPaletteSelect}
            remaining={remaining}
          />

          <p className="text-xs text-[var(--muted)]">
            <strong className="text-[var(--text)]">Discards:</strong> choose a
            discard river, then click a tile in your hand (one click). For tiles
            not in your hand, use the palette once.{" "}
            <strong className="text-[var(--text)]">Hand / meld / dora:</strong>{" "}
            tap a palette tile twice to add.
          </p>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <AnalysisPanel analysis={analysis} />
          <TableSummary remaining={remaining} />
        </div>
      </div>
    </div>
  );
}
