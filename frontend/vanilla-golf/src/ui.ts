import { State } from "./store";
import { getGame, getGames, getHoverCard, getUserId } from "./select";
import { sendCreateGame, sendJoinGame, sendStartGame } from "./websocket";
import { createSvgElement, drawGame } from "./draw";
import { Game } from "./game";
import { emptyElement } from "./util";
import { navigate, Link, LINKS, routes } from "./route";

interface CreateButtonOpts {
  text?: string; 
  className?: string;
  onClick?: () => any;
}

function createButton(opts: CreateButtonOpts = {}): HTMLButtonElement {
  const { text, className, onClick } = opts;
  const button = document.createElement('button');

  if (text) {
    button.innerHTML = text;
  }

  if (className) {
    button.className += className;
  }

  if (onClick) {
    button.onclick = onClick;
  }

  return button;
}

function createCreateGameButton(userId: number): HTMLButtonElement {
  const opts = {
    text: 'Create Game',
    className: 'create-game-button',
    onClick: () => sendCreateGame(userId)
  };

  return createButton(opts);
}

function createStartGameButton(gameId: number, userId: number): HTMLButtonElement {
  const opts = { 
    text: 'Start Game', 
    className: 'start-game-button',
    onClick: () => sendStartGame(gameId, userId),
  };

  return createButton(opts);
}

function createJoinGameButton(gameId: number, userId: number): HTMLButtonElement {
  const opts = { 
    text: 'Click To Join',
    className: 'join-game-button',
    onClick: () => sendJoinGame(gameId, userId),
  };

  return createButton(opts);
}

function createGamesTable(games: Game[], userId: number): HTMLTableElement {
  const table = document.createElement('table');
  table.className += 'games-table';
  table.caption = table.createCaption();
  table.caption.innerHTML = 'Games';

  const head = table.createTHead();
  const headRow = head.insertRow();

  const headId = headRow.insertCell();
  headId.appendChild(document.createTextNode('Game Id'));

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

function createNavbar(links: Link[]) {
  const div = document.createElement('div');
  div.className += 'navbar';

  const ul = document.createElement('ul');

  links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.text = link.text;
    a.href = '#';

    a.onclick = () => {
      navigate(link.route);
      return false;
    };

    li.appendChild(a);
    ul.appendChild(li);
  });

  div.appendChild(ul);
  return div;
}

export function homePage(state: State) {
  const games = getGames(state);
  const userId = getUserId(state);

  const div = document.createElement('div');
  div.className += 'home-page';

  const navbar = createNavbar(LINKS);
  div.appendChild(navbar);

  const heading = document.createElement('h2');
  heading.innerText = 'Home';
  div.appendChild(heading);


  if (userId != null) {
    const gamesTable = createGamesTable(games, userId);
    div.appendChild(gamesTable);
  }

  return div;
};

export function gamePage(state: State) {
  const { size } = state;
  const userId = getUserId(state);
  const game = getGame(state);
  const hoverCard = getHoverCard(state);

  const div = document.createElement('div');
  div.className += 'game-page';

  const navbar = createNavbar(LINKS);
  div.appendChild(navbar);

  const h2 = document.createElement('h2');
  h2.innerText = 'Game';
  div.appendChild(h2);

  const svg = createSvgElement(size);
  div.appendChild(svg);

  const buttonDiv = document.createElement('div');
  buttonDiv.className += 'game-buttons';

  if (userId != null) {
    const createGameButton = createCreateGameButton(userId);
    buttonDiv.appendChild(createGameButton);

    if (game) {
      drawGame({ size, userId, game, hoverCard }, svg);

      const startGameButton = createStartGameButton(game.id, userId);
      buttonDiv.appendChild(startGameButton);
    }
  }

  div.appendChild(buttonDiv);
  return div;
}

function createPage(state: State): HTMLElement {
  // return routes['/game'](state);
  return routes[state.route](state);
}

export function render(root: HTMLElement, state: State) {
  emptyElement(root);
  const page = createPage(state);
  root.appendChild(page);
}
