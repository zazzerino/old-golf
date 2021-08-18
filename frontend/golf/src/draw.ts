import { Game } from "./game";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const CARD_SCALE = '10%';
const CARD_SIZE: Size = { width: 60, height: 85 };

// const handPadding = 2;

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

function cardPath(card: string) {
  return `img/cards/${card}.svg`;
}

export function createSvgElement(size: Size, backgroundColor = 'aliceblue'): SVGSVGElement {
  const elem = document.createElementNS(SVG_NS, 'svg');

  elem.setAttribute('width', size.width.toString());
  elem.setAttribute('height', size.height.toString());
  elem.style.backgroundColor = backgroundColor;

  return elem;
}

function createCardImage(card: string, point: Point): SVGImageElement {
  const image = document.createElementNS(SVG_NS, 'image');

  image.setAttribute('width', CARD_SCALE);
  image.setAttribute('x', point.x.toString());
  image.setAttribute('y', point.y.toString());
  image.setAttributeNS(XLINK_NS, 'xlink:href', cardPath(card));

  return image;
}

function drawCard(svg: SVGSVGElement, card: string, point: Point): SVGImageElement {
  const image = createCardImage(card, point);
  svg.appendChild(image);

  return image;
}

function drawDeck(svg: SVGSVGElement, hasStarted: boolean): SVGImageElement {
  const rect = svg.getBoundingClientRect();
  const y = rect.height / 2 - CARD_SIZE.height / 2;
  
  let x = rect.width / 2 - CARD_SIZE.width / 2;

  if (hasStarted) {
    x -= CARD_SIZE.width / 2;
  }

  return drawCard(svg, '2B', { x, y });
}

function drawTableCard(svg: SVGSVGElement, card: string) {
  const rect = svg.getBoundingClientRect();
  const x = rect.width / 2;
  const y = rect.height / 2 - CARD_SIZE.height / 2;

  return drawCard(svg, card, { x, y });
}

export function drawGame(svgElem: SVGSVGElement, game: Game) {
  empty(svgElem);

  if (game) {
    const hasStarted = game.hasStarted;
    drawDeck(svgElem, hasStarted);
    if (hasStarted) {
      drawTableCard(svgElem, game.tableCard);
    }
  }
}
