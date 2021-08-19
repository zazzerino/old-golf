import { getGame, getUser, store } from "./store";
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
    const user = getUser(store.state);
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
    const user = getUser(store.state);
    const game = getGame(store.state);

    if (user && game) {
      sendStartGame(game.id, user.id);
    }
  }

  return button;
}

export function createUiElements(parent: HTMLElement) {
  createGameButton(parent);
  startGameButton(parent);
}
