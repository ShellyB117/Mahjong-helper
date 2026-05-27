"use client";

import { getTileFace, tileAbbrev, tileFullName } from "@/lib/mahjong/tiles";
import type { TileId } from "@/lib/mahjong/types";

type TileProps = {
  id: TileId;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  selected?: boolean;
  small?: boolean;
  title?: string;
};

export function Tile({
  id,
  onClick,
  onContextMenu,
  selected,
  small,
  title,
}: TileProps) {
  const face = getTileFace(id);
  const base =
    "inline-flex items-center justify-center rounded-md font-bold transition-all select-none border-2";
  const size = small ? "h-9 min-w-[2.25rem] px-1 text-xs" : "h-11 min-w-[2.75rem] px-1.5 text-sm";

  return (
    <button
      type="button"
      style={{
        ...face.style,
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.35) inset, 0 2px 4px rgba(0,0,0,0.35)",
      }}
      className={`${base} ${size} ${face.className} ${
        selected
          ? "ring-2 ring-mj-accent ring-offset-2 ring-offset-[var(--bg)] scale-105 z-10"
          : ""
      } ${onClick ? "hover:brightness-105 hover:scale-[1.03] cursor-pointer active:scale-95" : "cursor-default"}`}
      onClick={onClick}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu?.(e);
      }}
      title={title ?? tileFullName(id)}
    >
      {tileAbbrev(id)}
    </button>
  );
}
