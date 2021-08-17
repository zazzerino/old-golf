import { createSvgElement, drawGame, Size } from './draw';
import { initWebSocket } from './websocket';

const svgSize: Size = { width: 600, height: 400 };
const svgElem = createSvgElement(svgSize);

const rootElem = document.getElementById('root');
rootElem.appendChild(svgElem);

initWebSocket();
drawGame(svgElem);
