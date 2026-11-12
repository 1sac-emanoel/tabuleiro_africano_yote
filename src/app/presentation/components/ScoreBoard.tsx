import React from 'react';
import type { GameViewModelDto } from '../../application/dtos/GameDtos';
import { YOTE_THEME } from './themeTokens';

interface ScoreBoardProps {
  gameState: GameViewModelDto;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const isWhiteTurn = gameState.turnoAtual === 'WHITE';

  return (
    <div className={YOTE_THEME.scoreContainer}>
      
      {/* Brancas - Box Menor e Estilizado */}
      <div className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${isWhiteTurn ? 'bg-amber-200 ring-2 ring-amber-500 scale-105 shadow-md' : 'opacity-60 bg-stone-200'}`}>
        <h3 className="font-extrabold text-stone-800 uppercase tracking-widest text-[10px]">Brancas</h3>
        <div className="flex space-x-4 mt-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xl drop-shadow-md">⚪</span>
            <span className="font-bold text-stone-700 text-xs">Mão: {gameState.reservaBrancas}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl drop-shadow-md">🏆</span>
            <span className="font-bold text-stone-700 text-xs">Caps: {gameState.capturasBrancas}</span>
          </div>
        </div>
      </div>

      {/* Indicador Central Limpo */}
      <div className="flex flex-col items-center text-center px-4 flex-1">
        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Turno {gameState.contagemTurnos}</span>
        <h2 className={`text-base font-black mt-1 ${gameState.faseTurno === 'SELECT_BONUS_CAPTURE' ? 'text-red-600 animate-pulse' : 'text-stone-800'}`}>
          {gameState.faseTurno === 'SELECT_BONUS_CAPTURE' 
            ? '🔥 BÔNUS!' 
            : `Vez das ${isWhiteTurn ? 'Brancas' : 'Pretas'}`}
        </h2>
      </div>

      {/* Pretas - Box Menor e Estilizado */}
      <div className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${!isWhiteTurn ? 'bg-stone-800 ring-2 ring-stone-900 scale-105 shadow-md text-stone-100' : 'opacity-60 bg-stone-200'}`}>
        <h3 className="font-extrabold uppercase tracking-widest text-[10px] text-stone-400">Pretas</h3>
        <div className="flex space-x-4 mt-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-xl drop-shadow-md">⚫</span>
            <span className="font-bold text-stone-300 text-xs">Mão: {gameState.reservaPretas}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl drop-shadow-md">🏆</span>
            <span className="font-bold text-stone-300 text-xs">Caps: {gameState.capturasPretas}</span>
          </div>
        </div>
      </div>

    </div>
  );
};