import { drawGame } from './draw';
import { createGamePage, createGamesTable } from './ui';
import { initWebSocket } from './websocket';
import { store } from './store';
import { getGames, getUserId } from './select';
import { emptyElem } from './util';

const root = document.getElementById('root');

if (root == null) { 
  throw new Error('root elem is null'); 
}

initWebSocket();

const [gamePage, svg] = createGamePage();
root.appendChild(gamePage);

let gamesTable: HTMLTableElement;

store.subscribe(state => {
  emptyElem(svg);
  drawGame({ svg, state });

  const games = getGames(state);
  const userId = getUserId(state);

  if (state.games.length > 0 && userId != null) {
    gamesTable && gamesTable.remove();
    gamesTable = createGamesTable(games, userId);
    root.appendChild(gamesTable);
  }
});
