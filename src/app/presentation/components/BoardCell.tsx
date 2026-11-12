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
  isVulnerable?: boolean; // Prop nova!
  onCellClick: (row: number, col: number) => void;
}

export const BoardCell: React.FC<BoardCellProps> = ({ row, col, pieceColor, isSelected, isVulnerable, onCellClick }) => {
  return (
    <div 
      className={cn(
        YOTE_THEME.cellBase, 
        YOTE_THEME.cellEmpty, 
        isSelected && YOTE_THEME.cellSelected,
        isVulnerable && "ring-4 ring-red-500 bg-red-900/40 animate-pulse" // O Alerta Vermelho!
      )}
      onClick={() => onCellClick(row, col)}
    >
      {/* Resto do componente igual... */}
      {pieceColor && (
        <div className={cn(
          "w-3/4 h-3/4 rounded-full flex items-center justify-center transition-all",
          pieceColor === 'WHITE' ? YOTE_THEME.pieceWhite : YOTE_THEME.pieceBlack
        )}>
          <div className="w-1/2 h-1/2 rounded-full opacity-20 bg-current" />
        </div>
      )}
    </div>
  );
};