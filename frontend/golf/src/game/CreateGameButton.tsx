import React from 'react';
import { sendCreateGame } from '../websocket';

export function CreateGameButton(props: { userId: number }) {
  return (
    <button
      className="CreateGameButton"
      onClick={() => sendCreateGame(props.userId)}
    >
      Create Game
    </button>
  );
}