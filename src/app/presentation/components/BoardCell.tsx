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
  isVulnerable?: boolean;
  onCellClick: (row: number, col: number) => void;
}

export const BoardCell: React.FC<BoardCellProps> = ({ row, col, pieceColor, isSelected, isVulnerable, onCellClick }) => {
  return (
    <div 
      className={cn(
        YOTE_THEME.cellBase, 
        YOTE_THEME.cellEmpty, 
        isSelected && YOTE_THEME.cellSelected,
        isVulnerable && "ring-4 ring-red-500 bg-red-900/60 animate-pulse"
      )}
      onClick={() => onCellClick(row, col)}
    >
      {pieceColor && (
        <div className={cn(
          "w-[80%] h-[80%] rounded-full flex items-center justify-center transition-all transform hover:scale-105",
          pieceColor === 'WHITE' ? YOTE_THEME.pieceWhite : YOTE_THEME.pieceBlack
        )}>
          {/* Efeito de brilho curvo para volume esférico */}
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[20%] bg-white rounded-full opacity-30 blur-[1px] rotate-[-20deg]" />
          
          {/* Textura central orgânica */}
          <div className="w-[30%] h-[30%] rounded-full opacity-20 bg-black blur-[1px]" />
        </div>
      )}
    </div>
  );
};