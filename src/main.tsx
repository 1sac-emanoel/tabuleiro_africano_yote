import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Onde está o Tailwind
import { GameProvider } from './app/application/state/GameContext';
import { GameView } from './app/presentation/views/GameView';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* O Maestro abraça a aplicação inteira para fornecer os dados */}
    <GameProvider>
      <GameView />
    </GameProvider>
  </React.StrictMode>
);