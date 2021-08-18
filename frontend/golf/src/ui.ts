import { getGame, getUser } from "./state";
import { sendCreateGame, sendStartGame } from "./websocket";

function createButton(parent: HTMLElement, text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;
  parent.appendChild(button);

  return button;
}

export function createGameButton(parent: HTMLElement, id = 'create-game-button'): HTMLButtonElement {
  const button = createButton(parent, 'Create Game');
  button.id = id;

  button.onclick = (_ev) => {
    console.log('creating game...');
    const user = getUser();
    if (user) {
      sendCreateGame(user.id);
    }
  }

  return button;
}

export function startGameButton(parent: HTMLElement, id = 'start-game-button'): HTMLButtonElement {
  const button = createButton(parent, 'Start Game');
  button.id = id;

  button.onclick = (_ev) => {
    console.log('starting game...');
    const user = getUser();
    const game = getGame();

    if (user && game) {
      sendStartGame(game.id, user.id);
    }
  }

  return button;
}
