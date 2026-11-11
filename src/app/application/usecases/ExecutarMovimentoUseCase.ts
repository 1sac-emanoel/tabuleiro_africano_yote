import { GameState } from '../../domain/entities/GameState';
import { Position } from '../../domain/value_objects/Position';
import { YoteMoveValidator } from '../../domain/rules/YoteMoveValidator';
import type { IGameRepository } from '../../domain/repositories/IGameRepository';
import type { UseCaseResultDto, GameViewModelDto } from '../dtos/GameDtos';

export class ExecutarMovimentoUseCase {
  
  constructor(private gameRepository: IGameRepository) {}

  /**
   * Orquestra a tentativa de mover uma peça no tabuleiro.
   */
  public async execute(
    estadoAtual: GameState, 
    fromRow: number, fromCol: number, 
    toRow: number, toCol: number
  ): Promise<UseCaseResultDto> {
    
    try {
      const from = new Position(fromRow, fromCol);
      const to = new Position(toRow, toCol);

      // 1. O Maestro chama o Cérebro (Isac) para validar a matemática!
      YoteMoveValidator.validateStandardMove(estadoAtual, from, to, estadoAtual.currentTurn);

      // 2. Se não deu erro acima, o Maestro aplica o movimento na memória
      // (Na Quinzena 4 nós finalizaremos o método moverPeca no GameState)
      
      // 3. Salva no Banco de Dados (Glenda) em segundo plano
      // await this.gameRepository.salvarPartida(snapshotAtualizado);

      return {
        sucesso: true,
        // estadoAtualizado: novoViewModel
      };

    } catch (error: any) {
      // O Maestro captura o erro do Isac e converte em alerta amigável pra tela da Rebeca!
      return {
        sucesso: false,
        mensagemErro: error.message || 'Movimento inválido.',
      };
    }
  }
}