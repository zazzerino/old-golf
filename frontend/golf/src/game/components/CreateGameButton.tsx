import React from 'react';
import { sendCreateGame } from '../../websocket/message';

export function CreateGameButton() {
  return (
    <button
      className="CreateGameButton"
      onClick={() => sendCreateGame()}
    >
      Create Game
    </button>
  );
}
