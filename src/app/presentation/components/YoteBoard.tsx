import React from 'react';
import { BoardCell } from './BoardCell';
import { YOTE_THEME } from './themeTokens';
import type { GameViewModelDto } from '../../application/dtos/GameDtos';

interface YoteBoardProps {
  board: GameViewModelDto['tabuleiro'];
  selectedPos: GameViewModelDto['casaSelecionada'];
  onCellClick: (row: number, col: number) => void;
}

export const YoteBoard: React.FC<YoteBoardProps> = ({
  board,
  selectedPos,
  onCellClick,
}) => (
  <div className={YOTE_THEME.boardContainer}>
    <div className={YOTE_THEME.boardGrid}>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <BoardCell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            pieceColor={cell?.color ?? null}
            isSelected={
              selectedPos?.row === rowIndex && selectedPos?.col === colIndex
            }
            onCellClick={onCellClick}
          />
        )),
      )}
    </div>
  </div>
);
