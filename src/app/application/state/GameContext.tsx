import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { GameViewModelDto } from '../dtos/GameDtos';
import { YOTE_CONSTANTS } from '../../domain/value_objects/PieceColor';

// Mock Inicial: Um tabuleiro vazio para a tela da Rebeca renderizar
const initialMockState: GameViewModelDto = {
  partidaId: 'teste-123',
  tabuleiro: Array(YOTE_CONSTANTS.ROWS).fill(null).map(() => Array(YOTE_CONSTANTS.COLS).fill(null)),
  turnoAtual: 'WHITE',
  faseTurno: 'NORMAL_TURN',
  casaSelecionada: null,
  reservaBrancas: 12,
  reservaPretas: 12,
  capturasBrancas: 0,
  capturasPretas: 0,
  vencedor: null,
  motivoVitoria: null,
  contagemTurnos: 1,
  erroAtual: null,
  sincronizadoComBanco: false,
};

interface GameContextProps {
  gameState: GameViewModelDto;
  handleCellClick: (row: number, col: number) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameViewModelDto>(initialMockState);

  // Rai intercepta o clique da Rebeca aqui!
  const handleCellClick = (row: number, col: number) => {
    console.log(`Maestro ouviu: Jogador clicou na linha ${row}, coluna ${col}`);
    
    // Simulação visual de seleção (apenas para a Quinzena 2)
    setGameState((prev) => ({
      ...prev,
      casaSelecionada: { row, col }
    }));
  };

  return (
    <GameContext.Provider value={{ gameState, handleCellClick }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame deve ser usado dentro de um GameProvider');
  return context;
};