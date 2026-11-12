import React, { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import type { GameViewModelDto } from '../dtos/GameDtos';
import { GameState } from '../../domain/entities/GameState';
import { ExecutarMovimentoUseCase } from '../usecases/ExecutarMovimentoUseCase';
import { gameRepository } from '../../infrastructure/DatabaseProvider';

interface GameContextProps {
  gameState: GameViewModelDto;
  handleCellClick: (row: number, col: number) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

// Instancia o Caso de Uso injetando o Banco da Glenda!
const executarMovimento = new ExecutarMovimentoUseCase(gameRepository);

// O Estado de Domínio real rodando em memória
let domainState = new GameState(); 

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializamos a view com base na Entidade Real, e não mais no mock
  const [gameState, setGameState] = useState<GameViewModelDto>(() => ({
    partidaId: 'partida-padrao',
    tabuleiro: domainState.toSnapshot('partida-padrao').board,
    turnoAtual: domainState.currentTurn,
    faseTurno: domainState.phase,
    casaSelecionada: null,
    reservaBrancas: domainState.whiteReserve,
    reservaPretas: domainState.blackReserve,
    capturasBrancas: domainState.whiteCaptured,
    capturasPretas: domainState.blackCaptured,
    vencedor: null,
    motivoVitoria: null,
    contagemTurnos: 1,
    erroAtual: null,
    sincronizadoComBanco: false,
  }));

  const atualizaView = useCallback((erro?: string) => {
    setGameState(prev => ({
      ...prev,
      tabuleiro: domainState.toSnapshot('partida-padrao').board,
      turnoAtual: domainState.currentTurn,
      faseTurno: domainState.phase,
      reservaBrancas: domainState.whiteReserve,
      reservaPretas: domainState.blackReserve,
      capturasBrancas: domainState.whiteCaptured,
      capturasPretas: domainState.blackCaptured,
      erroAtual: erro || null,
    }));
  }, []);

  const handleCellClick = async (row: number, col: number) => {
    // Se não tem nada selecionado, seleciona a casa
    if (!gameState.casaSelecionada) {
      setGameState(prev => ({ ...prev, casaSelecionada: { row, col }, erroAtual: null }));
      return;
    }

    // Se já tinha selecionado, tenta mover!
    const from = gameState.casaSelecionada;
    
    // Chama o Caso de Uso que engloba Isac e Glenda!
    const resultado = await executarMovimento.execute(domainState, from.row, from.col, row, col);

    if (resultado.sucesso) {
      // Se validou na Quinzena 3, executamos a mutação da Quinzena 4
      domainState.executarMovimento({ row: from.row, col: from.col }, { row, col });
      
      // Limpa seleção e atualiza a tela
      setGameState(prev => ({ ...prev, casaSelecionada: null }));
      atualizaView();
      
      // Salva no PostgreSQL assincronamente (Glenda)
      gameRepository.salvarPartida(domainState.toSnapshot('partida-padrao')).catch(console.error);
    } else {
      // Deu erro de regra (ex: diagonal)? Limpa a seleção e mostra o erro!
      setGameState(prev => ({ ...prev, casaSelecionada: null }));
      atualizaView(resultado.mensagemErro);
    }
  };

  return (
    <GameContext.Provider value={{ gameState, handleCellClick }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('Erro: useGame fora do Provider.');
  return context;
};