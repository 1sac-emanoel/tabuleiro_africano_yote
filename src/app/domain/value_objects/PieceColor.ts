/**
 * Representa as cores oficiais dos dois jogadores no Yoté.
 * (ex: Sementes Claras/Conchas vs. Pedras Escuras/Gravetos).
**/
export type PieceColor = 'WHITE' | 'BLACK';

export const YOTE_CONSTANTS = {
  ROWS: 5,
  COLS: 6,
  TOTAL_CELLS: 30,
  INITIAL_PIECES_PER_PLAYER: 12,
  DRAW_PIECE_THRESHOLD: 3,
} as const;