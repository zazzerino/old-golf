import { drawGame } from './draw';
import { createGamePage, createGamesTable } from './ui';
import { initWebSocket } from './websocket';
import { store } from './store';
import { getGames } from './select';
import { emptyElem } from './util';

const root = document.getElementById('root');

if (root == null) { 
  throw new Error('root elem is null'); 
}

initWebSocket();

const [gamePage, svg] = createGamePage();
root.appendChild(gamePage);

// let gamesTable = createGamesTable(getGames(store.state));
// root.appendChild(gamesTable);

let gamesTable: HTMLTableElement;

// console.log('initial state: ' + JSON.stringify(store.state));

store.subscribe(state => {
  // console.log('state updated: ' + JSON.stringify({ ...state, games: [] }));

  emptyElem(svg);
  drawGame(svg, state);

  if (state.games.length > 0) {
    if (gamesTable != null) {
      gamesTable.remove();
    }
    gamesTable = createGamesTable(getGames(state));
    root.appendChild(gamesTable);
  }
});
