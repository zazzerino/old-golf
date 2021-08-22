import React from 'react';
import { sendJoinGame } from '../../websocket';

export function JoinGameButton(props: { gameId: number, userId?: number }) {
  const { gameId, userId } = props;

  return (
    <button
      onClick={() => {
        if (userId != null) {
          sendJoinGame(props.gameId, userId)
        }
      }}
    >
      Join Game
    </button>
  );
}
