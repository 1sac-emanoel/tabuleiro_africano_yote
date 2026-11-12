import React, { createContext, useContext, useState, type ReactNode, useEffect, useCallback } from 'react';
import type { GameViewModelDto } from '../dtos/GameDtos';
import { GameState } from '../../domain/entities/GameState';
import { ExecutarMovimentoUseCase } from '../usecases/ExecutarMovimentoUseCase';
import { gameRepository } from '../../infrastructure/DatabaseProvider';
import { Position } from '../../domain/value_objects/Position';
import { YoteMoveValidator } from '../../domain/rules/YoteMoveValidator';

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
    // Bloqueia cliques se o jogo estiver em processamento ou no fim
    if (gameState.faseTurno === 'GAME_OVER') return;

    const clickedPos = new Position(row, col);
    const clickedPiece = domainState.getCell(clickedPos);

    // ==========================================
    // CENA 0: CAPTURA BÔNUS (A Regra de Ouro!)
    // ==========================================
    if (gameState.faseTurno === 'SELECT_BONUS_CAPTURE') {
      try {
        // Valida no Isac
        YoteMoveValidator.validateBonusCapture(domainState, clickedPos, domainState.currentTurn);
        
        // Executa a remoção e passa o turno (ou decreta Vitória) no Isac
        domainState.removerPecaBonus(clickedPos);
        
        atualizaView();
        gameRepository.salvarPartida(domainState.toSnapshot('partida-padrao')).catch(console.error);

        // A Glenda salva o fim de jogo se alguém ganhou após esse confisco!
        if (domainState.phase === 'GAME_OVER' && domainState.winner && domainState.winReason) {
          gameRepository.registrarHistorico({
            winner: domainState.winner,
            winReason: domainState.winReason,
            totalTurns: domainState.turnCount,
            finishedAt: new Date().toISOString()
          }).catch(console.error);
        }

      } catch (error: any) {
        atualizaView(error.message); // Ex: "Você não pode confiscar sua própria peça"
      }
      return; // Interrompe a função aqui. Não faz mais nada neste clique!
    }
    
    // ==========================================
    // CENA 1: INSERÇÃO (Clicou em casa vazia e não há peça selecionada)
    // ==========================================
    if (!gameState.casaSelecionada && !clickedPiece) {
      try {
        YoteMoveValidator.validateInsertion(domainState, clickedPos, domainState.currentTurn);
        domainState.inserirPeca(clickedPos);
        
        atualizaView();
        gameRepository.salvarPartida(domainState.toSnapshot('partida-padrao')).catch(console.error);
      } catch (error: any) {
        atualizaView(error.message);
      }
      return;
    }

    // ==========================================
    // CENA 2: SELEÇÃO DE PEÇA
    // ==========================================
    if (!gameState.casaSelecionada && clickedPiece) {
      if (clickedPiece.color !== domainState.currentTurn) {
        atualizaView('Você só pode selecionar as suas próprias peças.');
        return;
      }
      setGameState(prev => ({ ...prev, casaSelecionada: { row, col }, erroAtual: null }));
      return;
    }

    // ==========================================
    // CENA 3: TENTATIVA DE MOVIMENTO
    // ==========================================
    if (gameState.casaSelecionada) {
      // Se clicou na própria peça de novo, ele DESELECCIONA
      if (gameState.casaSelecionada.row === row && gameState.casaSelecionada.col === col) {
        setGameState(prev => ({ ...prev, casaSelecionada: null, erroAtual: null }));
        return;
      }

      const from = gameState.casaSelecionada;
      const resultado = await executarMovimento.execute(domainState, from.row, from.col, row, col);

      if (resultado.sucesso) {
        domainState.executarMovimento(new Position(from.row, from.col), clickedPos);
        setGameState(prev => ({ ...prev, casaSelecionada: null }));
        atualizaView();
        gameRepository.salvarPartida(domainState.toSnapshot('partida-padrao')).catch(console.error);
      } else {
        setGameState(prev => ({ ...prev, casaSelecionada: null }));
        atualizaView(resultado.mensagemErro);
      }
    }
  };

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