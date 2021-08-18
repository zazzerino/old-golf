import { Game, HAND_SIZE } from "./game";
import { getUserHand, getUserHeldCard } from "./state";

export interface Coord {
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

const handPadding = 2;

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

function cardPath(card: string): string {
  return `img/cards/${card}.svg`;
}

export function createSvgElement(size: Size, backgroundColor = 'aliceblue'): SVGSVGElement {
  const elem = document.createElementNS(SVG_NS, 'svg');

  elem.setAttribute('width', size.width.toString());
  elem.setAttribute('height', size.height.toString());
  elem.style.backgroundColor = backgroundColor;

  return elem;
}

function createCardImage(card: string, coord: Coord): SVGImageElement {
  const image = document.createElementNS(SVG_NS, 'image');

  image.setAttribute('width', CARD_SCALE);
  image.setAttribute('x', coord.x.toString());
  image.setAttribute('y', coord.y.toString());
  image.setAttributeNS(XLINK_NS, 'href', cardPath(card));

  return image;
}

function drawCard(svg: SVGSVGElement, card: string, coord: Coord): SVGImageElement {
  const image = createCardImage(card, coord);
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

function drawTableCard(svg: SVGSVGElement, card: string): SVGImageElement {
  const rect = svg.getBoundingClientRect();
  const x = rect.width / 2;
  const y = rect.height / 2 - CARD_SIZE.height / 2;

  return drawCard(svg, card, { x, y });
}

function svgSize(elem: SVGElement): Size {
  const rect = elem.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  return { width, height };
}

export type HandPosition = 'bottom' | 'left' | 'top' | 'right';

export function drawHand(svg: SVGSVGElement, cards: string[], pos: HandPosition): SVGGElement {
  const group = document.createElementNS(SVG_NS, 'g');

  for (let i = 0; i < HAND_SIZE; i++) {
    const offset = i % 3;
    const x = CARD_SIZE.width * offset + handPadding * offset;
    const y = i < 3 ? 0 : CARD_SIZE.height + handPadding;

    console.log('creating card: ' + i + ', ' + cards[i]);
    const card = createCardImage(cards[i], { x, y });
    group.appendChild(card);
  }

  const size = svgSize(svg);

  const midX = size.width / 2 - CARD_SIZE.width * 1.5;
  const bottomY = size.height - CARD_SIZE.height * 2 - handPadding * 2;
  let x: number;
  let y: number;

  switch (pos) {
    case 'bottom':
      group.setAttribute('transform', `translate(${midX}, ${bottomY})`);
      break;
    case 'top':
      x = midX + CARD_SIZE.width * 3 + handPadding * 2;
      y = CARD_SIZE.height * 2 + handPadding * 2;
      group.setAttribute('transform', `translate(${x}, ${y}), rotate(180)`);
      break;
  }

  svg.appendChild(group);
  return group;
}

function drawHeldCard(svg: SVGSVGElement, card: string): SVGImageElement {
  const size = svgSize(svg);
  const x = size.width * 0.75;
  const y = size.height - CARD_SIZE.height * 1.5;

  return drawCard(svg, card, { x, y });
}

export function drawGame(svgElem: SVGSVGElement, game: Game) {
  empty(svgElem);

  if (game) {
    const hasStarted = game.hasStarted;
    drawDeck(svgElem, hasStarted);
    if (hasStarted) {
      drawTableCard(svgElem, game.tableCard);
      drawHeldCard(svgElem, getUserHeldCard());
      drawHand(svgElem, getUserHand(), 'bottom');
    }
  }
}
