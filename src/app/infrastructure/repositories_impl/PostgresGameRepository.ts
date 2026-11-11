import type { IGameRepository, GameStateSnapshot, MatchHistoryRecord } from '../../domain/repositories/IGameRepository';
import { supabaseClient, isPostgresConfigured } from '../database/supabaseClient';
import { JsonbBoardSerializer } from '../services/JsonbBoardSerializer';

/**
 * implementacao do bd aqui
 * pera  "Offline-First"
 * configurado, salva no LocalStorage para o jogo nao travar
 */
export class PostgresGameRepository implements IGameRepository {
  private readonly LOCAL_STORAGE_KEY = 'yote_partida_ativa';

  async criarPartida(estadoInicial: GameStateSnapshot): Promise<void> {
    await this.salvarPartida(estadoInicial);
  }

  async salvarPartida(estado: GameStateSnapshot): Promise<void> {
    // 1. Salva no fallback local imediatamente (Garante resiliência)
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(estado));

    // 2. Tenta salvar no PostgreSQL via Supabase (JSONB)
    if (isPostgresConfigured() && supabaseClient) {
      const { error } = await supabaseClient
        .from('partidas_ativas')
        .upsert({
          id: estado.id,
          turno_atual: estado.currentTurn,
          fase_turno: estado.phase,
          reserva_brancas: estado.whiteReserve,
          reserva_pretas: estado.blackReserve,
          capturas_brancas: estado.whiteCaptured,
          capturas_pretas: estado.blackCaptured,
          estado_tabuleiro: JsonbBoardSerializer.toJsonb(estado.board), // JSONB aqui!
          vencedor: estado.winner,
          motivo_vitoria: estado.winReason,
          contagem_turnos: estado.turnCount,
          atualizado_em: new Date().toISOString(),
        });
      
      if (error) console.error('Erro ao sincronizar com PostgreSQL:', error);
    }
  }

  async carregarUltimaPartidaAtiva(): Promise<GameStateSnapshot | null> {
    const localData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (localData) return JSON.parse(localData) as GameStateSnapshot;
    return null; // Na Q3 faremos o SELECT no Supabase caso o local esteja limpo
  }

  async carregarPartida(id: string): Promise<GameStateSnapshot | null> { return null; }
  async deletarPartidaAtiva(id: string): Promise<void> { localStorage.removeItem(this.LOCAL_STORAGE_KEY); }
  async registrarHistorico(registro: MatchHistoryRecord): Promise<void> {}
  async listarHistorico(): Promise<MatchHistoryRecord[]> { return []; }
}