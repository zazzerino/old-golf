import { store } from "./store";
import { getGame, getUser } from "./select";
import { sendCreateGame, sendJoinGame, sendStartGame } from "./websocket";
import { createSvgElement } from "./draw";
import { Game } from "./game";

function createButton(text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;
  return button;
}

function createCreateGameButton(id = 'create-game-button'): HTMLButtonElement {
  const button = createButton('Create Game');
  button.id = id;

  button.onclick = () => {
    const user = getUser(store.state);
    if (user) {
      sendCreateGame(user.id);
    }
  }

  return button;
}

function createStartGameButton(id = 'start-game-button'): HTMLButtonElement {
  const button = createButton('Start Game');
  button.id = id;

  button.onclick = () => {
    const user = getUser(store.state);
    const game = getGame(store.state);

    if (user && game) {
      sendStartGame(game.id, user.id);
    }
  }

  return button;
}

export function createJoinGameButton(gameId: number, userId?: number, id = 'join-game-button'): HTMLButtonElement {
  const button = createButton('Join Game');
  button.id = id;
  button.onclick = () => userId != null && sendJoinGame(gameId, userId);
  return button;
}

export function createGamesTable(games: Game[], userId?: number, id = 'create-games-table'): HTMLTableElement {
  const table = document.createElement('table');
  table.id = id;
  table.caption = table.createCaption();
  table.caption.innerHTML = 'Games';

  const head = table.createTHead();
  const headRow = head.insertRow();

  const headId = headRow.insertCell();
  headId.appendChild(document.createTextNode('Id'));
  const headJoin = headRow.insertCell();
  headJoin.appendChild(document.createTextNode('Join'));

  for (const game of games) {
    const body = table.createTBody();
    const bodyRow = body.insertRow();

    const bodyId = bodyRow.insertCell();
    bodyId.appendChild(document.createTextNode(game.id.toString()));
    const bodyJoin = bodyRow.insertCell();
    bodyJoin.appendChild(createJoinGameButton(game.id, userId));
  }

  return table;
}

export function createGamePage(id = 'game-page'): [HTMLDivElement, SVGSVGElement] {
  const div = document.createElement('div');
  div.id = id;

  const svg = createSvgElement({ width: 600, height: 500 });
  const createGameButton = createCreateGameButton();
  const startGameButton = createStartGameButton();

  [svg, createGameButton, startGameButton].forEach(elem => div.appendChild(elem));

  return [div, svg];
}
