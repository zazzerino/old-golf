import React from 'react';
import { sendStartGame } from '../websocket';

export function StartGameButton(props: { userId: number, gameId: number }) {
  const { userId, gameId } = props;

  return (
    <button
      className="StartGameButton"
      onClick={() => sendStartGame(gameId, userId)}
    >
      Start Game
    </button>
  );
}
