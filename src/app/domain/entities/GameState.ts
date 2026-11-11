import { YOTE_CONSTANTS, type PieceColor } from '../value_objects/PieceColor';
import { Position } from '../value_objects/Position';
import type { SerializedCell, TurnPhase, WinReason, GameStateSnapshot } from '../repositories/IGameRepository';

/**
 * essa e a entidade raiz do jogo
 * apenas matematica e regras 
 */
export class GameState {
  private board: (SerializedCell | null)[][];
  public currentTurn: PieceColor;
  public phase: TurnPhase;
  public whiteReserve: number;
  public blackReserve: number;
  public whiteCaptured: number;
  public blackCaptured: number;

  constructor(snapshot?: GameStateSnapshot) {
    if (snapshot) {
      this.board = snapshot.board;
      this.currentTurn = snapshot.currentTurn;
      this.phase = snapshot.phase;
      this.whiteReserve = snapshot.whiteReserve;
      this.blackReserve = snapshot.blackReserve;
      this.whiteCaptured = snapshot.whiteCaptured;
      this.blackCaptured = snapshot.blackCaptured;
    } else {
      this.board = Array(YOTE_CONSTANTS.ROWS).fill(null).map(() => Array(YOTE_CONSTANTS.COLS).fill(null));
      this.currentTurn = 'WHITE'; // Brancas começam
      this.phase = 'NORMAL_TURN';
      this.whiteReserve = YOTE_CONSTANTS.INITIAL_PIECES_PER_PLAYER;
      this.blackReserve = YOTE_CONSTANTS.INITIAL_PIECES_PER_PLAYER;
      this.whiteCaptured = 0;
      this.blackCaptured = 0;
    }
  }

  public getCell(pos: Position): SerializedCell | null {
    return this.board[pos.row][pos.col];
  }

  public isCellEmpty(pos: Position): boolean {
    return this.getCell(pos) === null;
  }

  
}