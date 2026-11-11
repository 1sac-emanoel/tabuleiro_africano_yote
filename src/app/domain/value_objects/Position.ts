import { YOTE_CONSTANTS } from './PieceColor';

export interface IPosition {
  readonly row: number;
  readonly col: number;
}

/**
 * Value Object imutável que representa uma coordenada (linha, coluna) dentro da matriz 5x6 do tabuleiro de Yoté
**/
export class Position implements IPosition {
  public readonly row: number;
  public readonly col: number;

  constructor(row: number, col: number) {
    if (!Position.isValid(row, col)) {
      throw new Error(
        `Coordenada inválida [${row}, ${col}]. O tabuleiro de Yoté possui dimensões ${YOTE_CONSTANTS.ROWS}x${YOTE_CONSTANTS.COLS} (linhas 0-4, colunas 0-5).`
      );
    }
    this.row = row;
    this.col = col;
  }

  /**
   * Verifica se a coordenada está dentro dos limites da matriz 5x6.
   */
  public static isValid(row: number, col: number): boolean {
    return (
      Number.isInteger(row) &&
      Number.isInteger(col) &&
      row >= 0 &&
      row < YOTE_CONSTANTS.ROWS &&
      col >= 0 &&
      col < YOTE_CONSTANTS.COLS
    );
  }

  /**
   * Calcula a distância ortogonal entre duas casas: |x1 - x2| + |y1 - y2|.
   * usado para garantir que movimentos na diagonal nao sejam permitidos
   */
  public manhattanDistanceTo(other: IPosition): number {
    return Math.abs(this.row - other.row) + Math.abs(this.col - other.col);
  }

  public equals(other: IPosition | null | undefined): boolean {
    if (!other) return false;
    return this.row === other.row && this.col === other.col;
  }
}