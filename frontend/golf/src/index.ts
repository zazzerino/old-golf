import { createSvgElement, drawGame } from './draw';
import { createUiElements } from './ui';
import { initWebSocket } from './websocket';
import { store } from './store';

const root = document.getElementById('root');
if (root == null) { throw new Error('root elem is null'); }

const svg = createSvgElement({ width: 600, height: 500 });
root.appendChild(svg);

initWebSocket();
createUiElements(root);

console.log('initial state: ' + JSON.stringify(store.state));

store.subscribe((state) => {
  console.log('state updated: ' + JSON.stringify({ ...state, games: [] }));
  drawGame(svg, state);
});
