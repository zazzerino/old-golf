import React from 'react';
import { useHistory } from 'react-router-dom';
import { sendJoinGame } from '../websocket';

export function JoinGameButton(props: { userId: number, gameId: number }) {
  const { userId, gameId } = props;
  const history = useHistory();

  return (
    <button
      className="JoinGameButton"
      onClick={() => {
        sendJoinGame(gameId, userId);
        history.push("/game");
      }}
    >
      Join Game
    </button>
  );
}
