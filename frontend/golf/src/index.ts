import { createSvgElement, drawGame, Size } from './draw';
import { createGameButton, startGameButton } from './ui';
import { initWebSocket } from './websocket';
import { getGame, store } from './store';

const svgSize: Size = { width: 600, height: 500 };
export const svgElem = createSvgElement(svgSize);

console.log('initial store: ' + JSON.stringify(store));

export const rootElem = document.getElementById('root');

if (rootElem == null) {
  throw new Error('root elem is null');
}

rootElem.appendChild(svgElem);

initWebSocket();
createGameButton(rootElem);
startGameButton(rootElem);

store.subscribe((state) => {
  drawGame(svgElem, state);
});
