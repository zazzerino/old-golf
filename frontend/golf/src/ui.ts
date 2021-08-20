import { store } from "./store";
import { getGame, getUser } from "./select";
import { sendCreateGame, sendStartGame } from "./websocket";
import { createSvgElement } from "./draw";

function createButton(text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;
  return button;
}

export function makeCreateGameButton(id = 'create-game-button'): HTMLButtonElement {
  const button = createButton('Create Game');
  button.id = id;

  button.onclick = () => {
    console.log('creating game...');
    const user = getUser(store.state);
    if (user) {
      sendCreateGame(user.id);
    }
  }

  return button;
}

export function makeStartGameButton(id = 'start-game-button'): HTMLButtonElement {
  const button = createButton('Start Game');
  button.id = id;

  button.onclick = () => {
    console.log('starting game...');
    const user = getUser(store.state);
    const game = getGame(store.state);

    if (user && game) {
      sendStartGame(game.id, user.id);
    }
  }

  return button;
}

export function createGamePage(id = 'game-page'): [HTMLDivElement, SVGSVGElement] {
  const div = document.createElement('div');
  div.id = id;

  const svg = createSvgElement({ width: 600, height: 500 });
  const createGameButton = makeCreateGameButton();
  const startGameButton = makeStartGameButton();

  [svg, createGameButton, startGameButton].forEach(elem => div.appendChild(elem));

  return [div, svg];
}
