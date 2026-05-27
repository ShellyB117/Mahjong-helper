import { describe, expect, it } from "vitest";
import {
  defaultGameState,
  isDiscardMode,
  moveHandToDiscard,
} from "./game-state";
import type { TileId } from "./types";

describe("moveHandToDiscard", () => {
  it("moves tile from hand to discard river", () => {
    const state = {
      ...defaultGameState(),
      concealed: ["1m", "2m", "3m"] as TileId[],
    };
    const next = moveHandToDiscard(state, "self", 1);
    expect(next.concealed).toEqual(["1m", "3m"]);
    expect(next.discards.self).toEqual(["2m"]);
  });
});

describe("isDiscardMode", () => {
  it("recognizes seat modes", () => {
    expect(isDiscardMode("self")).toBe(true);
    expect(isDiscardMode("hand")).toBe(false);
  });
});
