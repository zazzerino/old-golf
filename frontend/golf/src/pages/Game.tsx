import React from 'react';
import { StartGameButton } from '../game/components/StartGameButton';
import { GameCanvas } from '../game/GameCanvas';

export function Game() {
  return (
    <div className="Game">
      <h2>Game</h2>
      <GameCanvas />
      <StartGameButton />
    </div>
  );
}
