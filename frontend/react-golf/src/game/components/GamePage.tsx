import React from 'react';
import { useAppSelector } from '../../hooks';
import { selectGameId, selectUserId } from '../../store/select';
import { CreateGameButton } from './CreateGameButton';
import { StartGameButton } from './StartGameButton';
import GameCanvas from './GameCanvas';
import './GamePage.css';

export function GamePage() {
  const userId = useAppSelector(selectUserId);
  const gameId = useAppSelector(selectGameId);

  return (
    <div className="GamePage">
      <h2>Game</h2>
      <GameCanvas />
      <CreateGameButton userId={userId} />
      <StartGameButton gameId={gameId} userId={userId} />
    </div>
  );
}
