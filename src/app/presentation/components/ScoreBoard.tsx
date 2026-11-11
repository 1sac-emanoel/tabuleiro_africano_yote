import React from 'react';
import { type GameViewModelDto } from '../../application/dtos/GameDtos';

interface ScoreBoardProps {
  gameState: GameViewModelDto;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState }) => {
  const isWhiteTurn = gameState.turnoAtual === 'WHITE';

  return (
    <div className="w-full max-w-2xl mx-auto flex justify-between items-center bg-stone-100 p-4 rounded-xl shadow-md border-2 border-stone-300 mb-6">
      
      {/* Jogador Branco (Madeira Clara / Conchas) */}
      <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${isWhiteTurn ? 'bg-amber-200 ring-2 ring-amber-500 scale-105' : 'opacity-70'}`}>
        <h3 className="font-bold text-stone-800 uppercase tracking-wider text-sm">Brancas</h3>
        <div className="flex space-x-4 mt-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-2xl">⚪</span>
            <span className="font-semibold text-stone-600">Mão: {gameState.reservaBrancas}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl">🏆</span>
            <span className="font-semibold text-stone-600">Capturas: {gameState.capturasBrancas}</span>
          </div>
        </div>
      </div>

      {/* Indicador de Status Central */}
      <div className="flex flex-col items-center text-center px-4">
        <span className="text-xs font-bold text-stone-500 uppercase">Turno {gameState.contagemTurnos}</span>
        <h2 className="text-lg font-black text-stone-800 mt-1">
          {gameState.faseTurno === 'SELECT_BONUS_CAPTURE' 
            ? '🔥 SELECIONE O BÔNUS!' 
            : `Vez das ${isWhiteTurn ? 'Brancas' : 'Pretas'}`}
        </h2>
      </div>

      {/* Jogador Preto (Madeira Escura / Pedras) */}
      <div className={`flex flex-col items-center p-3 rounded-lg transition-all ${!isWhiteTurn ? 'bg-stone-800 ring-2 ring-stone-900 scale-105 text-stone-100' : 'opacity-70'}`}>
        <h3 className="font-bold uppercase tracking-wider text-sm">Pretas</h3>
        <div className="flex space-x-4 mt-2 text-sm">
          <div className="flex flex-col items-center">
            <span className="text-2xl">⚫</span>
            <span className="font-semibold text-stone-400">Mão: {gameState.reservaPretas}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl">🏆</span>
            <span className="font-semibold text-stone-400">Capturas: {gameState.capturasPretas}</span>
          </div>
        </div>
      </div>

    </div>
  );
};