import React from 'react';
import { BoardCell } from './BoardCell';
import { YOTE_THEME } from '../components/themeTokens';
import type { GameViewModelDto } from '../../application/dtos/GameDtos';

interface YoteBoardProps {
  gameState: GameViewModelDto; // Agora recebemos o estado inteiro para saber a fase
  onCellClick: (row: number, col: number) => void;
}

export const YoteBoard: React.FC<YoteBoardProps> = ({ gameState, onCellClick }) => {
  const { tabuleiro, casaSelecionada, faseTurno, turnoAtual } = gameState;

  return (
    <div className={YOTE_THEME.boardContainer}>
      <div className={YOTE_THEME.boardGrid}>
        {tabuleiro.map((rowArr, rowIndex) =>
          rowArr.map((cell, colIndex) => {
            const isSelected = casaSelecionada?.row === rowIndex && casaSelecionada?.col === colIndex;
            
            // Lógica de UI: Se é fase de Bônus, a peça inimiga fica "Vulnerável"
            const isEnemyPiece = cell !== null && cell.color !== turnoAtual;
            const isVulnerable = faseTurno === 'SELECT_BONUS_CAPTURE' && isEnemyPiece;

            return (
              <BoardCell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                pieceColor={cell ? cell.color : null}
                isSelected={isSelected}
                isVulnerable={isVulnerable} // Passamos a prop nova
                onCellClick={onCellClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};