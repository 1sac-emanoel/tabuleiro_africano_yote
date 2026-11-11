import type { SerializedCell } from '../../domain/repositories/IGameRepository';
import { YOTE_CONSTANTS } from '../../domain/value_objects/PieceColor';

/**
 * servico responsavel por validar e serializar/desserializar a matriz 5x6
 * para a coluna JSONB do PostgreSQL com segurança de tipos
 */
export class JsonbBoardSerializer {
  public static toJsonb(board: (SerializedCell | null)[][]): string {
    return JSON.stringify(board);
  }

  public static fromJsonb(rawJson: unknown): (SerializedCell | null)[][] {
    const parsed = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;

    if (
      !Array.isArray(parsed) ||
      parsed.length !== YOTE_CONSTANTS.ROWS ||
      !Array.isArray(parsed[0]) ||
      parsed[0].length !== YOTE_CONSTANTS.COLS
    ) {
      throw new Error('Falha de integridade: O JSONB retornado pelo banco não corresponde a uma matriz 5x6 válida.');
    }

    return parsed as (SerializedCell | null)[][];
  }
}