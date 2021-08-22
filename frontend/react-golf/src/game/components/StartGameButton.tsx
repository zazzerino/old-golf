import React from 'react';
import { sendStartGame } from '../../websocket';

export function StartGameButton(props: { gameId?: number, userId?: number }) {
  const { gameId, userId } = props;

  return (
    <button
      className="StartGameButton"
      onClick={() => {
        if (gameId != null && userId != null)
          sendStartGame(gameId, userId)
      }}
    >
      Start Game
    </button>
  );
}

