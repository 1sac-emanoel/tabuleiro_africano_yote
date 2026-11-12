import React from 'react';
import { YoteBoard } from '../components/YoteBoard';
import { ScoreBoard } from '../components/ScoreBoard';
import { useGame } from '../../application/state/GameContext';
import { AlertCircle } from 'lucide-react';

export const GameView: React.FC = () => {
  const { gameState, handleCellClick } = useGame();

  return (
    <div className="min-h-screen bg-stone-200 flex flex-col items-center py-8 px-4 font-sans">
      
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-black text-amber-900 tracking-tighter">YOTÉ DIGITAL</h1>
        <p className="text-stone-600 font-medium">Tradição e Estratégia da África Ocidental</p>
      </div>

      <ScoreBoard gameState={gameState} />

      {/* Correção: max-w-[600px] alinha o erro com o tamanho do placar */}
      {gameState.erroAtual && (
        <div className="mb-4 flex items-center bg-red-100 border-l-4 border-red-600 text-red-800 p-3 rounded-md shadow-sm max-w-[600px] w-full animate-bounce">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="font-semibold text-sm">{gameState.erroAtual}</span>
        </div>
      )}

      {/* O Tabuleiro agora recebe o gameState completo conforme nossa atualização da Q6 */}
      <YoteBoard 
        gameState={gameState}
        onCellClick={handleCellClick}
      />
    </div>
  );
};