import type { PieceColor } from '../value_objects/PieceColor';

export type TurnPhase = 
  | 'NORMAL_TURN' 
  | 'SELECT_BONUS_CAPTURE' 
  | 'GAME_OVER';

export type WinReason = 'ELIMINATION' | 'BLOCKADE' | 'DRAW' | null;

export interface SerializedCell {
  color: PieceColor;
  row: number;
  col: number;
}

export interface GameStateSnapshot {
  id: string;
  board: (SerializedCell | null)[][];
  currentTurn: PieceColor;
  phase: TurnPhase;
  whiteReserve: number;
  blackReserve: number;
  whiteCaptured: number;
  blackCaptured: number;
  winner: PieceColor | 'DRAW' | null;
  winReason: WinReason;
  turnCount: number;
  updatedAt: string;
}

export interface MatchHistoryRecord {
  id?: string;
  winner: PieceColor | 'DRAW';
  winReason: Exclude<WinReason, null>;
  totalTurns: number;
  finishedAt: string;
}

/**
 * Contrato oficial (Interface) estabelecido pelo Integrante 1-Domínio
 * que deve ser cumprido pela Integrante 2 - Infraestrutura PostgreSQL
 */
export interface IGameRepository {
  criarPartida(estadoInicial: GameStateSnapshot): Promise<void>;
  salvarPartida(estadoAtual: GameStateSnapshot): Promise<void>;
  carregarPartida(id: string): Promise<GameStateSnapshot | null>;
  carregarUltimaPartidaAtiva(): Promise<GameStateSnapshot | null>;
  deletarPartidaAtiva(id: string): Promise<void>;
  registrarHistorico(registro: MatchHistoryRecord): Promise<void>;
  listarHistorico(): Promise<MatchHistoryRecord[]>;
}