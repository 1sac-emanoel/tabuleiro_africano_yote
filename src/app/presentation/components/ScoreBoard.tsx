import React from 'react';
import type { GameViewModelDto } from '../../application/dtos/GameDtos';

interface ScoreBoardProps {
  gameState: GameViewModelDto;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const isWhiteTurn = gameState.turnoAtual === 'WHITE';

  return (
    // Card principal agora é max-w-lg, com p-2 para ficar compacto
    <div className="w-full max-w-lg mx-auto flex justify-between items-center bg-stone-100 p-2 rounded-xl shadow-sm border border-stone-300 mb-4">
      
      {/* Brancas */}
      <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${isWhiteTurn ? 'bg-amber-200 ring-2 ring-amber-500 scale-105' : 'opacity-70'}`}>
        <h3 className="font-bold text-stone-800 uppercase tracking-wider text-xs">Brancas</h3>
        <div className="flex space-x-3 mt-1 text-xs">
          <div className="flex flex-col items-center">
            <span className="text-lg">⚪</span>
            <span className="font-semibold text-stone-600">Mão: {gameState.reservaBrancas}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg">🏆</span>
            <span className="font-semibold text-stone-600">Caps: {gameState.capturasBrancas}</span>
          </div>
        </div>
      </div>

      {/* Indicador Central Menor */}
      <div className="flex flex-col items-center text-center px-2">
        <span className="text-[10px] font-bold text-stone-500 uppercase">Turno {gameState.contagemTurnos}</span>
        <h2 className="text-sm font-black text-stone-800 mt-1">
          {gameState.faseTurno === 'SELECT_BONUS_CAPTURE' 
            ? '🔥 BÔNUS!' 
            : `Vez das ${isWhiteTurn ? 'Brancas' : 'Pretas'}`}
        </h2>
      </div>

      {/* Pretas */}
      <div className={`flex flex-col items-center p-2 rounded-lg transition-all ${!isWhiteTurn ? 'bg-stone-800 ring-2 ring-stone-900 scale-105 text-stone-100' : 'opacity-70'}`}>
        <h3 className="font-bold uppercase tracking-wider text-xs">Pretas</h3>
        <div className="flex space-x-3 mt-1 text-xs">
          <div className="flex flex-col items-center">
            <span className="text-lg">⚫</span>
            <span className="font-semibold text-stone-400">Mão: {gameState.reservaPretas}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg">🏆</span>
            <span className="font-semibold text-stone-400">Caps: {gameState.capturasPretas}</span>
          </div>
        </div>
      </div>

    </div>
  );
};