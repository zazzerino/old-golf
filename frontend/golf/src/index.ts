import { createSvgElement, drawGame, Size } from './draw';
import { getGame } from './state';
import { createGameButton, startGameButton } from './ui';
import { initWebSocket } from './websocket';

const svgSize: Size = { width: 600, height: 500 };
export const svgElem = createSvgElement(svgSize);

export const rootElem = document.getElementById('root');
rootElem.appendChild(svgElem);

const game = getGame();

initWebSocket();
drawGame(svgElem, game);
createGameButton(rootElem);
startGameButton(rootElem);
