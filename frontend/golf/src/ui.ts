import { getGame } from "./state";
import { sendCreateGame, sendStartGame } from "./websocket";

function createButton(parent: HTMLElement, text: string, onClick?: () => any): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;

  if (onClick) {
    button.onclick = onClick;
  }

  parent.appendChild(button);
  return button;
}

export function createGameButton(parent: HTMLElement, id = 'create-game-button'): HTMLButtonElement {
  const button = createButton(parent, 'Create Game');
  button.id = id;

  button.onclick = (_ev) => {
    console.log('creating game...');
    // sendCreateGame();
  }

  return button;
}

export function startGameButton(parent: HTMLElement, id = 'start-game-button'): HTMLButtonElement {
  const button = createButton(parent, 'Start Game');
  button.id = id;

  button.onclick = (_ev) => {
    console.log('starting game...');
    const game = getGame();
    // sendStartGame();
  }

  return button;
}
