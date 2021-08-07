import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { sendStartGame } from '../../websocket/message';
import { selectCurrentGameId } from '../gameSlice';

export function StartGameButton() {
  const gameId = useAppSelector(selectCurrentGameId);

  const onClick = () => {
    if (gameId != null) {
      sendStartGame(gameId);
    }
  }

  return (
    <button
      className="StartGameButton"
      onClick={onClick}
    >
      Start Game
    </button>
  );
}
