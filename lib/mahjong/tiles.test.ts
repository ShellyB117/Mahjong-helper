import { describe, expect, it } from "vitest";
import { tileAbbrev, tileFullName } from "./tiles";
import type { TileId } from "./types";

describe("tile naming", () => {
  it("uses English abbreviations on tiles", () => {
    expect(tileAbbrev("1m" as TileId)).toBe("1m");
    expect(tileAbbrev("5p" as TileId)).toBe("5p");
    expect(tileAbbrev("9s" as TileId)).toBe("9s");
    expect(tileAbbrev("1z" as TileId)).toBe("E");
    expect(tileAbbrev("4z" as TileId)).toBe("N");
    expect(tileAbbrev("5z" as TileId)).toBe("Wh");
    expect(tileAbbrev("6z" as TileId)).toBe("G");
    expect(tileAbbrev("7z" as TileId)).toBe("R");
  });

  it("uses full English names for tooltips", () => {
    expect(tileFullName("3m" as TileId)).toBe("3 Characters");
    expect(tileFullName("2p" as TileId)).toBe("2 Circles");
    expect(tileFullName("8s" as TileId)).toBe("8 Bamboo");
    expect(tileFullName("2z" as TileId)).toBe("South");
    expect(tileFullName("7z" as TileId)).toBe("Red dragon");
  });
});
