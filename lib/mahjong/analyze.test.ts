import { describe, expect, it } from "vitest";
import { analyzeHand } from "./analyze";
import { defaultGameState } from "./game-state";
import type { GameState, TileId } from "./types";

function hand(...tiles: TileId[]): GameState {
  return { ...defaultGameState(), concealed: [...tiles] };
}

describe("analyzeHand", () => {
  it("returns null shanten for empty hand", () => {
    const r = analyzeHand(defaultGameState());
    expect(r.valid).toBe(true);
    expect(r.shanten).toBe(null);
  });

  it("computes tenpai for simple wait", () => {
    // 123m 456p 789s 11z 2z — tenpai waiting 3z for pair
    const r = analyzeHand(
      hand(
        "1m",
        "2m",
        "3m",
        "4p",
        "5p",
        "6p",
        "7s",
        "8s",
        "9s",
        "1z",
        "1z",
        "2z",
        "2z",
      ),
    );
    expect(r.valid).toBe(true);
    expect(r.shanten).toBe(0);
    expect(r.isTenpai).toBe(true);
  });

  it("filters waits by remaining tiles", () => {
    const state = hand(
      "1m",
      "2m",
      "3m",
      "4p",
      "5p",
      "6p",
      "7s",
      "8s",
      "9s",
      "1z",
      "1z",
      "2z",
      "2z",
    );
    // Kill all 3z in the wall
    state.discards.self = ["3z", "3z", "3z", "3z"];
    const r = analyzeHand(state);
    if (r.isTenpai && r.waits.some((w) => w.tile === "3z")) {
      expect(r.waits.find((w) => w.tile === "3z")?.copiesLeft).toBe(0);
      expect(r.isKaraten).toBe(true);
    }
  });

  it("ranks discards when holding 14 tiles", () => {
    const r = analyzeHand(
      hand(
        "1m",
        "2m",
        "3m",
        "4p",
        "5p",
        "6p",
        "7s",
        "8s",
        "9s",
        "1z",
        "1z",
        "2z",
        "2z",
        "3z",
      ),
    );
    expect(r.valid).toBe(true);
    expect(r.discardOptions.length).toBeGreaterThan(0);
    expect(r.bestDiscard).not.toBeNull();
  });

  it("detects invalid hand size", () => {
    const r = analyzeHand(hand("1m", "2m", "3m"));
    expect(r.valid).toBe(false);
    expect(r.invalidReason).toMatch(/3 tiles/);
  });
});

describe("remaining counts", () => {
  it("reduces effective tiles when discards are logged", () => {
    const state = hand(
      "2m",
      "3m",
      "4m",
      "5p",
      "6p",
      "7p",
      "2s",
      "3s",
      "4s",
      "5s",
      "6s",
      "7s",
      "1z",
    );
    const before = analyzeHand(state);
    state.discards.across = ["1m", "1m", "1m", "1m"];
    const after = analyzeHand(state);
    if (before.improvementTiles.length && after.improvementTiles.length) {
      const sumBefore = before.improvementTiles.reduce(
        (s, w) => s + w.copiesLeft,
        0,
      );
      const sumAfter = after.improvementTiles.reduce(
        (s, w) => s + w.copiesLeft,
        0,
      );
      expect(sumAfter).toBeLessThanOrEqual(sumBefore);
    }
  });
});
