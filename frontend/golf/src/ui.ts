import { store } from "./store";
import { getGame, getGames, getUser, getUserId } from "./select";
import { sendCreateGame, sendJoinGame, sendStartGame } from "./websocket";
import { createSvgElement } from "./draw";
import { Game } from "./game";

export function createButton(text: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerHTML = text;
  return button;
}

function createCreateGameButton(): HTMLButtonElement {
  const button = createButton('Create Game');
  button.className += 'create-game-button';

  button.onclick = () => {
    const user = getUser(store.state);
    if (user) {
      sendCreateGame(user.id);
    }
  }

  return button;
}

function createStartGameButton(): HTMLButtonElement {
  const button = createButton('Start Game');
  button.className += 'start-game-button';

  button.onclick = () => {
    const user = getUser(store.state);
    const game = getGame(store.state);

    if (user && game) {
      sendStartGame(game.id, user.id);
    }
  }

  return button;
}

export function createJoinGameButton(gameId: number, userId?: number): HTMLButtonElement {
  const button = createButton('Join Game');
  button.className += 'join-game-button';
  button.onclick = () => userId != null && sendJoinGame(gameId, userId);
  return button;
}

export function createGamesTable(games: Game[], userId?: number): HTMLTableElement {
  const table = document.createElement('table');
  table.className += 'games-table';
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

// export function createGamePage(): [HTMLDivElement, SVGSVGElement] {
//   const div = document.createElement('div');
//   div.className += 'game-page';

//   const svg = createSvgElement({ width: 600, height: 500 });
//   const createGameButton = createCreateGameButton();
//   const startGameButton = createStartGameButton();

//   [svg, createGameButton, startGameButton].forEach(elem => div.appendChild(elem));

//   return [div, svg];
// }

export type Route = '/' | '/game';

interface Link {
  route: Route;
  text: string;
}

const links: Link[] = [
  { route: '/', text: 'Home' },
  { route: '/game', text: 'Game' }
];

export function navigate(route: Route) {
  window.history.pushState({}, route, window.location.origin + route)
  store.publish('NAVIGATE', route);
}

function createNavbar(links: Link[]) {
  const list = document.createElement('ul');
  list.className += 'navbar';

  links.forEach(link => {
    const item = document.createElement('li');

    const a = document.createElement('a');
    a.text = link.text;
    a.href = '#';
    a.onclick = () => {
      navigate(link.route);
      return false;
    };
    item.appendChild(a);

    list.appendChild(item);
  });

  return list;
}

function homePage() {
  const games = getGames(store.state);
  const userId = getUserId(store.state);

  const div = document.createElement('div');
  div.className += 'home-page';

  const heading = document.createElement('h2');
  heading.innerText = 'Home';
  div.appendChild(heading);

  const navbar = createNavbar(links);
  div.appendChild(navbar);

  const createGameButton = createCreateGameButton();
  div.appendChild(createGameButton);

  const gamesTable = createGamesTable(games, userId);
  div.appendChild(gamesTable);

  return div;
};

// export function createGamePage(): [HTMLDivElement, SVGSVGElement] {
//   const div = document.createElement('div');
//   div.className += 'game-page';

//   const svg = createSvgElement({ width: 600, height: 500 });
//   const createGameButton = createCreateGameButton();
//   const startGameButton = createStartGameButton();

//   [svg, createGameButton, startGameButton].forEach(elem => div.appendChild(elem));

//   return [div, svg];
// }

function gamePage() {
  const div = document.createElement('div');
  div.className += 'game-page';

  const heading = document.createElement('h2');
  heading.innerText = 'Game';
  div.appendChild(heading);

  const navbar = createNavbar(links);
  div.appendChild(navbar);

  const svg = createSvgElement({ width: 600, height: 500 });
  div.appendChild(svg);

  return div;
}

const routes: Record<Route, () => HTMLElement> = {
  '/': homePage,
  '/game': gamePage,
}

export function getPage(route: Route): HTMLElement {
  return routes[route]();
}
