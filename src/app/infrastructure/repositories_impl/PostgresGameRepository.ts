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
    // 1. Salva no fallback local imediatamente
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
    // 1. Prioriza buscar da Nuvem (PostgreSQL) se estiver online
    if (isPostgresConfigured() && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('partidas_ativas')
        .select('*')
        .order('atualizado_em', { ascending: false })
        .limit(1)
        .single();
        
      if (!error && data) {
        return this.mapRowToSnapshot(data);
      }
    }

    //Se estiver sem internet ou o banco falhar, busca do cache local
    const localData = localStorage.getItem(this.LOCAL_STORAGE_KEY);
    if (localData) return JSON.parse(localData) as GameStateSnapshot;
    
    return null;
  }

  async carregarPartida(id: string): Promise<GameStateSnapshot | null> {
    if (isPostgresConfigured() && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('partidas_ativas')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        return this.mapRowToSnapshot(data);
      }
    }
    return null;
  }

  // metodo auxiliar privado para converter as colunas do SQL para o DTO do Isac
  private mapRowToSnapshot(row: any): GameStateSnapshot {
    return {
      id: row.id,
      currentTurn: row.turno_atual,
      phase: row.fase_turno,
      whiteReserve: row.reserva_brancas,
      blackReserve: row.reserva_pretas,
      whiteCaptured: row.capturas_brancas,
      blackCaptured: row.capturas_pretas,
      board: JsonbBoardSerializer.fromJsonb(row.estado_tabuleiro),
      winner: row.vencedor,
      winReason: row.motivo_vitoria,
      turnCount: row.contagem_turnos,
      updatedAt: row.atualizado_em,
    };
  }

  async deletarPartidaAtiva(id: string): Promise<void> { localStorage.removeItem(this.LOCAL_STORAGE_KEY); }

  async registrarHistorico(registro: MatchHistoryRecord): Promise<void> {
    if (isPostgresConfigured() && supabaseClient) {
      const { error } = await supabaseClient
        .from('historico_partidas')
        .insert({
          vencedor: registro.winner,
          motivo_vitoria: registro.winReason,
          total_turnos: registro.totalTurns,
          finalizado_em: new Date().toISOString()
        });
        
      if (error) console.error('Erro ao registrar histórico no PostgreSQL:', error);
    }
    
    // Limpa a partida atual do LocalStorage pois o jogo acabou
    localStorage.removeItem(this.LOCAL_STORAGE_KEY);
  }

  async listarHistorico(): Promise<MatchHistoryRecord[]> { return []; }
}