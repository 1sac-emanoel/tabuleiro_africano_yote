-- ============================================================================
-- PROJETO YOTÉ DIGITAL - SCRIPT DE ARQUITETURA DE DADOS (QUINZENA 1)
-- SGBD: PostgreSQL (Compatível com Supabase PostgreSQL)
-- ============================================================================

-- A tabela de partidas ativas, estado em tempo real com matriz 5x6 em JSONB
CREATE TABLE IF NOT EXISTS partidas_ativas (
    id UUID PRIMARY KEY,
    turno_atual VARCHAR(10) NOT NULL CHECK (turno_atual IN ('WHITE', 'BLACK')),
    fase_turno VARCHAR(30) NOT NULL DEFAULT 'NORMAL_TURN',
    reserva_brancas SMALLINT NOT NULL DEFAULT 12 CHECK (reserva_brancas BETWEEN 0 AND 12),
    reserva_pretas SMALLINT NOT NULL DEFAULT 12 CHECK (reserva_pretas BETWEEN 0 AND 12),
    capturas_brancas SMALLINT NOT NULL DEFAULT 0 CHECK (capturas_brancas BETWEEN 0 AND 12),
    capturas_pretas SMALLINT NOT NULL DEFAULT 0 CHECK (capturas_pretas BETWEEN 0 AND 12),
    estado_tabuleiro JSONB NOT NULL, -- Matriz 5x6 serializada sem necessidade de 30 joins
    vencedor VARCHAR(10) NULL,
    motivo_vitoria VARCHAR(20) NULL,
    contagem_turnos INTEGER NOT NULL DEFAULT 1,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A tabela de histórico de partidas placar geral e estatísticas
CREATE TABLE IF NOT EXISTS historico_partidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vencedor VARCHAR(10) NOT NULL CHECK (vencedor IN ('WHITE', 'BLACK', 'DRAW')),
    motivo_vitoria VARCHAR(20) NOT NULL CHECK (motivo_vitoria IN ('ELIMINATION', 'BLOCKADE', 'DRAW')),
    total_turnos INTEGER NOT NULL CHECK (total_turnos > 0),
    finalizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- os indices para otimizar busca da ultima partida ativa e do ranking
CREATE INDEX IF NOT EXISTS idx_partidas_ativas_atualizado_em ON partidas_ativas (atualizado_em DESC);
CREATE INDEX IF NOT EXISTS idx_historico_finalizado_em ON historico_partidas (finalizado_em DESC);