/**
 * Refatoração Visual - Realismo e Proporção (Quinzena 7)
 */
export const YOTE_THEME = {
  // Tabuleiro expandido com max-w-[800px] e gradiente de madeira
  boardContainer: 'bg-gradient-to-b from-amber-900 to-amber-950 border-[6px] border-amber-800 shadow-2xl rounded-2xl p-4 sm:p-6 w-full max-w-[800px] mx-auto',
  boardGrid: 'grid grid-cols-6 grid-rows-5 gap-2 sm:gap-3 aspect-[6/5] w-full',
  
  // Casas (Buracos) com profundidade interna
  cellBase: 'relative aspect-square rounded-full sm:rounded-2xl flex items-center justify-center transition-all duration-200 select-none cursor-pointer',
  cellEmpty: 'bg-amber-950/80 hover:bg-amber-900 shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] border border-amber-950/50',
  cellSelected: 'ring-4 ring-yellow-400 bg-amber-800 scale-[1.05] shadow-[0_0_15px_rgba(250,204,21,0.5)]',
  
  // Peças 3D (Sementes/Pedras)
  pieceWhite: 'bg-gradient-to-br from-stone-100 via-stone-300 to-stone-400 text-stone-900 border border-stone-100 shadow-[0_6px_10px_rgba(0,0,0,0.5),inset_0_-4px_6px_rgba(0,0,0,0.2)]',
  pieceBlack: 'bg-gradient-to-br from-stone-600 via-stone-800 to-stone-950 text-amber-100 border border-stone-600 shadow-[0_6px_10px_rgba(0,0,0,0.7),inset_0_-4px_6px_rgba(0,0,0,0.4)]',
  
  // Container do Placar contido
  scoreContainer: 'w-full max-w-[600px] mx-auto flex justify-between items-center bg-stone-100 p-3 rounded-2xl shadow-md border-2 border-stone-200 mb-4',
  
  bonusBanner: 'bg-red-900/90 border-2 border-yellow-400 text-yellow-100 px-4 py-3 rounded-xl font-semibold animate-pulse',
} as const;