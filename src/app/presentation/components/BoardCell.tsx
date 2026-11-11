import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { YOTE_THEME } from './themeTokens';
import type { PieceColor } from '../../domain/value_objects/PieceColor';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BoardCellProps {
  row: number;
  col: number;
  pieceColor: PieceColor | null;
  isSelected: boolean;
  onCellClick: (row: number, col: number) => void;
}

/**
 * Componente visual da celula, apenas obedece as props
 */
export const BoardCell: React.FC<BoardCellProps> = ({ row, col, pieceColor, isSelected, onCellClick }) => {
  return (
    <div 
      className={cn(YOTE_THEME.cellBase, YOTE_THEME.cellEmpty, isSelected && YOTE_THEME.cellSelected)}
      onClick={() => onCellClick(row, col)}
    >
      {pieceColor && (
        <div className={cn(
          "w-3/4 h-3/4 rounded-full flex items-center justify-center transition-all",
          pieceColor === 'WHITE' ? YOTE_THEME.pieceWhite : YOTE_THEME.pieceBlack
        )}>
          {/* Textura interna da peça simulando entalhe */}
          <div className="w-1/2 h-1/2 rounded-full opacity-20 bg-current" />
        </div>
      )}
    </div>
  );
};