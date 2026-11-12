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
  public winner: GameStateSnapshot['winner'];
  public winReason: WinReason;
  public turnCount: number;

  constructor(snapshot?: GameStateSnapshot) {
    if (snapshot) {
      this.board = snapshot.board;
      this.currentTurn = snapshot.currentTurn;
      this.phase = snapshot.phase;
      this.whiteReserve = snapshot.whiteReserve;
      this.blackReserve = snapshot.blackReserve;
      this.whiteCaptured = snapshot.whiteCaptured;
      this.blackCaptured = snapshot.blackCaptured;
      this.winner = snapshot.winner;
      this.winReason = snapshot.winReason;
      this.turnCount = snapshot.turnCount;
    } else {
      this.board = Array(YOTE_CONSTANTS.ROWS).fill(null).map(() => Array(YOTE_CONSTANTS.COLS).fill(null));
      this.currentTurn = 'WHITE'; // Brancas começam
      this.phase = 'NORMAL_TURN';
      this.whiteReserve = YOTE_CONSTANTS.INITIAL_PIECES_PER_PLAYER;
      this.blackReserve = YOTE_CONSTANTS.INITIAL_PIECES_PER_PLAYER;
      this.whiteCaptured = 0;
      this.blackCaptured = 0;
      this.winner = null;
      this.winReason = null;
      this.turnCount = 1;
    }
  }

  public getCell(pos: Position): SerializedCell | null {
    return this.board[pos.row][pos.col];
  }

  public isCellEmpty(pos: Position): boolean {
    return this.getCell(pos) === null;
  }

  /**
   * Executa o movimento na matriz 5x6 depois das regras aprovarem
   * O cerebro altera o tabuleiro e passa a vez
   */
  public executarMovimento(from: Position, to: Position): void {
    const piece = this.getCell(from);
    
    // 1. Remove a peça da casa de origem
    this.board[from.row][from.col] = null;
    
    // 2. Coloca a peça na casa de destino
    this.board[to.row][to.col] = piece;

    // 3. Verifica se foi um salto (distância 2) para processar a captura
    const isSalto = from.manhattanDistanceTo(to) === 2;
    
    if (isSalto) {
      const midRow = (from.row + to.row) / 2;
      const midCol = (from.col + to.col) / 2;
      
      // Captura a peça do meio (inimiga)
      this.board[midRow][midCol] = null;
      
      if (this.currentTurn === 'WHITE') {
        this.whiteCaptured += 1;
      } else {
        this.blackCaptured += 1;
      }

      // Ativa a fase de Captura Dupla!
      this.phase = 'SELECT_BONUS_CAPTURE';
    } else {
      // Se foi movimento normal, passa a vez
      this.currentTurn = this.currentTurn === 'WHITE' ? 'BLACK' : 'WHITE';
    }
  }

  /**
   * Converte a entidade rica de volta para um Snapshot "burro"
   * para o Raí mandar para a tela e a Glenda salvar no banco.
   */
  public toSnapshot(id: string): GameStateSnapshot {
    return {
      id,
      board: this.board,
      currentTurn: this.currentTurn,
      phase: this.phase,
      whiteReserve: this.whiteReserve,
      blackReserve: this.blackReserve,
      whiteCaptured: this.whiteCaptured,
      blackCaptured: this.blackCaptured,
      winner: this.winner,
      winReason: this.winReason,
      turnCount: this.turnCount,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Remove uma peça da reserva e a insere no tabuleiro.
  */
  public inserirPeca(pos: Position): void {
    // 1. Coloca a peça na matriz
    this.board[pos.row][pos.col] = {
      color: this.currentTurn,
      row: pos.row,
      col: pos.col,
    };
    
    // 2. Desconta da reserva do jogador atual
    if (this.currentTurn === 'WHITE') {
      this.whiteReserve -= 1;
    } else {
      this.blackReserve -= 1;
    }
    
    // 3. Passa a vez
    this.currentTurn = this.currentTurn === 'WHITE' ? 'BLACK' : 'WHITE';
  }
  
  /**
   * remove a peça bonus escolhida do tabuleiro e checa Fim de Jogo[cite: 1, 2]
   */
  public removerPecaBonus(pos: Position): void {
    this.board[pos.row][pos.col] = null;
    
    if (this.currentTurn === 'WHITE') {
      this.whiteCaptured += 1;
    } else {
      this.blackCaptured += 1;
    }

    // Checa Condição de Vitória por Eliminação (12 peças capturadas)[cite: 1]
    if (this.whiteCaptured === 12) {
      this.phase = 'GAME_OVER';
      this.winner = 'WHITE';
      this.winReason = 'ELIMINATION';
    } else if (this.blackCaptured === 12) {
      this.phase = 'GAME_OVER';
      this.winner = 'BLACK';
      this.winReason = 'ELIMINATION';
    } else {
      // Se o jogo não acabou, passa o turno normalmente!
      this.phase = 'NORMAL_TURN';
      this.currentTurn = this.currentTurn === 'WHITE' ? 'BLACK' : 'WHITE';
      this.turnCount += 1;
    }
  }
}