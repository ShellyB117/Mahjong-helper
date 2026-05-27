export type TileId =
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}m`
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}p`
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}s`
  | `${1 | 2 | 3 | 4 | 5 | 6 | 7}z`;

export type Wind = "east" | "south" | "west" | "north";
export type Seat = "self" | "right" | "across" | "left";
export type MeldType = "chi" | "pon" | "kan";

export type Meld = {
  type: MeldType;
  tiles: TileId[];
  open: boolean;
};

export type SeatMelds = {
  seat: Seat;
  melds: Meld[];
};

export type GameState = {
  concealed: TileId[];
  melds: SeatMelds[];
  discards: Record<Seat, TileId[]>;
  doraIndicators: TileId[];
  roundWind: Wind;
  seatWind: Wind;
};

export type AddTarget = "hand" | Seat;

export const SEATS: Seat[] = ["self", "right", "across", "left"];

export const WINDS: Wind[] = ["east", "south", "west", "north"];
