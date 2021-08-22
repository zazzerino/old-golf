import React from 'react';
import { useAppSelector } from '../hooks';
import { selectGameId, selectUserId } from '../select';
import { CreateGameButton } from './components/CreateGameButton';
import { StartGameButton } from './components/StartGameButton';
import GameCanvas from './GameCanvas';
import './GamePage.css';

function GamePage() {
  const userId = useAppSelector(selectUserId);
  const gameId = useAppSelector(selectGameId);

  return (
    <div className="GamePage">
      <GameCanvas />
      <CreateGameButton userId={userId} />
      <StartGameButton gameId={gameId} userId={userId} />
    </div>
  );
}

export default GamePage;
