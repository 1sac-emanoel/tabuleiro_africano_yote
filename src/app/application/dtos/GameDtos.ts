import type { PieceColor } from '../../domain/value_objects/PieceColor';
import type { SerializedCell, TurnPhase, WinReason } from '../../domain/repositories/IGameRepository';

/**
 * DTO enviado pela Rebeca quando o jogador clica em uma casa do tabuleiro 5x6
 */
export interface CellClickInputDto {
  row: number;
  col: number;
}

/**
 * DTO que representa a resposta padronizada de qualquer Caso de Uso 
 * para atualizar o Estado Global do React e exibir os feedbacks visuais
 */
export interface UseCaseResultDto {
  sucesso: boolean;
  mensagemErro?: string;
  avisoSistema?: string;
  estadoAtualizado?: GameViewModelDto;
}

/**
 * ViewModel enxuto e pronto para consumo  pelos componentes React da Rebeca
 * a tela desenha o objeto e le
 */
export interface GameViewModelDto {
  partidaId: string;
  tabuleiro: (SerializedCell | null)[][];
  turnoAtual: PieceColor;
  faseTurno: TurnPhase;
  casaSelecionada: { row: number; col: number } | null;
  reservaBrancas: number;
  reservaPretas: number;
  capturasBrancas: number;
  capturasPretas: number;
  vencedor: PieceColor | 'DRAW' | null;
  motivoVitoria: WinReason;
  contagemTurnos: number;
  erroAtual: string | null;
  sincronizadoComBanco: boolean;
}