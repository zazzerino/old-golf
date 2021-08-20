import { drawGame } from './draw';
import { createGamePage } from './ui';
import { initWebSocket } from './websocket';
import { store } from './store';

const root = document.getElementById('root');

if (root == null) { 
  throw new Error('root elem is null'); 
}

initWebSocket();

const [gamePage, svg] = createGamePage();
root.appendChild(gamePage);

console.log('initial state: ' + JSON.stringify(store.state));

store.subscribe(state => {
  console.log('state updated: ' + JSON.stringify({ ...state, games: [] }));
  drawGame(svg, state);
});
