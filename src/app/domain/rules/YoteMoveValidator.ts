import { Position } from '../value_objects/Position';
import type { PieceColor } from '../value_objects/PieceColor';
import { GameState } from '../entities/GameState';
import { DomainError } from './DomainError';

/**
 * focado em valirdar a matematica dos movimentos
 * Isola as regras complexas para nao inflar a entidade GameState
 */
export class YoteMoveValidator {
  
  /**
   * Valida se uma peca pode ser movida de uma casa para outra
   * Regra: Movimento apenas ortogonal (vertical/horizontal), distancia exata de 1 casa
   */
  public static validateStandardMove(state: GameState, from: Position, to: Position, player: PieceColor): void {
    if (state.currentTurn !== player) {
      throw new DomainError('Não é o seu turno.', 'WRONG_TURN');
    }

    const piece = state.getCell(from);
    if (!piece || piece.color !== player) {
      throw new DomainError('Você não possui uma peça na casa de origem.', 'INVALID_PIECE');
    }

    if (!state.isCellEmpty(to)) {
      throw new DomainError('A casa de destino já está ocupada.', 'CELL_OCCUPIED');
    }

    const distance = from.manhattanDistanceTo(to);
    
    // Distância Manhattan = 1 garante que moveu exatamente uma casa na cruz (sem diagonais)
    if (distance !== 1) {
      throw new DomainError('O movimento deve ser de exatamente 1 casa na horizontal ou vertical. Diagonais são proibidas no Yoté.', 'INVALID_DIRECTION');
    }
  }

  /**
   * Valida se um salto (captura) é matematicamente possível.
   * Regra: Distância de 2 casas, e a casa do meio deve conter uma peça inimiga.
   */
  public static validateCaptureJump(state: GameState, from: Position, to: Position, player: PieceColor): void {
    const distance = from.manhattanDistanceTo(to);
    
    // Distância Manhattan = 2 numa mesma linha ou coluna significa um salto válido
    if (distance !== 2 || (from.row !== to.row && from.col !== to.col)) {
      throw new DomainError('O salto de captura deve ser reto, pulando exatamente uma casa.', 'INVALID_JUMP');
    }

    if (!state.isCellEmpty(to)) {
      throw new DomainError('A casa de aterrissagem do salto deve estar vazia.', 'LANDING_CELL_OCCUPIED');
    }

    // Calcula a coordenada exata da casa que foi "pulada" (a casa do meio)
    const midRow = (from.row + to.row) / 2;
    const midCol = (from.col + to.col) / 2;
    const midPos = new Position(midRow, midCol);
    
    const midPiece = state.getCell(midPos);
    
    if (!midPiece || midPiece.color === player) {
      throw new DomainError('Você só pode saltar sobre uma peça do adversário.', 'INVALID_CAPTURE_TARGET');
    }
  }

  // para insercao de pecas e reserva 
  public static validateInsertion(state: GameState, to: Position, player: PieceColor): void {
    if (state.currentTurn !== player) {
      throw new DomainError('Não é o seu turno.', 'WRONG_TURN');
    }
    if (!state.isCellEmpty(to)) {
      throw new DomainError('Você só pode inserir uma peça em uma casa vazia.', 'CELL_OCCUPIED');
    }
    const reserve = player === 'WHITE' ? state.whiteReserve : state.blackReserve;
    if (reserve <= 0) {
      throw new DomainError('Você não tem mais peças na reserva para inserir.', 'NO_RESERVE');
    }
  }

  /**
   * Valida se a peça clicada pode ser confiscada como bonus da Captura Dupla
   * Regra: Tem que ser uma peca do adversario ja no tabuleiro
   */
  public static validateBonusCapture(state: GameState, target: Position, player: PieceColor): void {
    if (state.phase !== 'SELECT_BONUS_CAPTURE') {
      throw new DomainError('O jogo não está na fase de captura bônus.', 'WRONG_PHASE');
    }
    
    const piece = state.getCell(target);
    if (!piece) {
      throw new DomainError('Você precisa clicar em uma peça do adversário, não em uma casa vazia.', 'EMPTY_TARGET');
    }
    
    if (piece.color === player) {
      throw new DomainError('Você não pode confiscar sua própria peça!', 'INVALID_TARGET_COLOR');
    }
  }
}