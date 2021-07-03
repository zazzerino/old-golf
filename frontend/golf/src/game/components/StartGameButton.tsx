import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { sendStartGame } from '../../websocket/message';
import { selectGameId } from '../game';

export function StartGameButton() {
  const gameId = useAppSelector(selectGameId);

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
