import { createSvgElement, drawGame, Size } from './draw';
import { getGame } from './state';
import { createCreateGameButton } from './ui';
import { initWebSocket } from './websocket';

const svgSize: Size = { width: 600, height: 400 };
const svgElem = createSvgElement(svgSize);

const rootElem = document.getElementById('root');
rootElem.appendChild(svgElem);

const game = getGame();

initWebSocket();
drawGame(svgElem, game);
createCreateGameButton(rootElem);
