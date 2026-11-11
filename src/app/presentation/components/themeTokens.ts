/**
 * paleta visual e tokens de UI inspirados nos elementos naturais da África Ocidental
 * (Madeira Acácia, Areia do Sahel, Sementes de Baobá e Ébano), garantindo alto contraste 
 */
export const YOTE_THEME = {
  boardContainer: 'bg-amber-950 border-4 border-amber-800 shadow-2xl rounded-2xl p-3 sm:p-5',
  boardGrid: 'grid grid-cols-6 grid-rows-5 gap-2 sm:gap-3 aspect-[6/5] w-full max-w-2xl mx-auto',
  cellBase: 'relative aspect-square rounded-xl flex items-center justify-center transition-all duration-200 select-none cursor-pointer',
  cellEmpty: 'bg-amber-900/80 hover:bg-amber-800/90 shadow-inner border border-amber-700/40',
  cellSelected: 'ring-4 ring-yellow-400 bg-amber-800 scale-[1.03]',
  pieceWhite: 'bg-stone-100 text-stone-900 border-2 border-amber-200 shadow-md',
  pieceBlack: 'bg-stone-900 text-amber-100 border-2 border-stone-600 shadow-md',
  bonusBanner: 'bg-red-900/90 border-2 border-yellow-400 text-yellow-100 px-4 py-3 rounded-xl font-semibold animate-pulse',
} as const;