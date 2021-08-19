import { deckCardClicked, handCardClicked, heldCardClicked, tableCardClicked } from "./event";
import { CardLocation, HAND_SIZE } from "./game";
import { State } from "./store";
import { getGame, getHand, getHeldCard, getPlayableCards, getScore, getUncoveredCards } from "./select";

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

const HAND_PADDING = 2;
const HL_PADDING = 2;

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

function makeRect(coord: Coord, size: Size, color = '#44ff00'): SVGRectElement {
  const rect = document.createElementNS(SVG_NS, 'rect');

  rect.setAttribute('x', coord.x.toString());
  rect.setAttribute('y', coord.y.toString());
  rect.setAttribute('width', size.width.toString());
  rect.setAttribute('height', size.height.toString());
  rect.setAttribute('stroke', color);
  rect.setAttribute('stroke-width', HL_PADDING.toString());

  return rect;
}

function createCardHighlight(coord: Coord) {
  return makeRect(coord, CARD_SIZE);
}

function drawCard(svg: SVGSVGElement, card: string, coord: Coord, highlight = false): SVGImageElement {
  const image = createCardImage(card, coord);

  if (highlight) {
    const cardHighlight = createCardHighlight(coord);
    svg.appendChild(cardHighlight);
  }

  svg.appendChild(image);
  return image;
}

function drawDeck(svg: SVGSVGElement, hasStarted: boolean, playableCards: CardLocation[] = []): SVGImageElement {
  const rect = svg.getBoundingClientRect();
  let x = rect.width / 2 - CARD_SIZE.width / 2 - HAND_PADDING;
  const y = rect.height / 2 - CARD_SIZE.height / 2;

  if (hasStarted) {
    x -= CARD_SIZE.width / 2;
  }

  const highlight = playableCards.includes('DECK');
  const card = drawCard(svg, '2B', { x, y }, highlight);
  card.onclick = (_ev) => deckCardClicked();

  return card;
}

function drawTableCard(svg: SVGSVGElement, cardName: string, playableCards: CardLocation[] = []): SVGImageElement {
  const rect = svg.getBoundingClientRect();
  const x = rect.width / 2 + HAND_PADDING;
  const y = rect.height / 2 - CARD_SIZE.height / 2;

  const highlight = playableCards.includes('TABLE');
  const card = drawCard(svg, cardName, { x, y }, highlight);
  card.onclick = (_ev) => tableCardClicked();

  return card;
}

function svgSize(elem: SVGElement): Size {
  const rect = elem.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  return { width, height };
}

type HandPosition = 'bottom' | 'left' | 'top' | 'right';

function createHandCard(coord: Coord, i: number, cards: string[], uncovered: number[], highlight = false) {
  const card = uncovered.includes(i) ? cards[i] : '2B';

  const image = createCardImage(card, coord);
  image.onclick = (_ev) => handCardClicked(i);

  return image;
}

function handIndexes(locations: CardLocation[]): number[] {
  const indexes = [];

  for (const loc of locations) {
    switch (loc) {
      case 'H0': indexes.push(0); break;
      case 'H1': indexes.push(1); break;;
      case 'H2': indexes.push(2); break;
      case 'H3': indexes.push(3); break;
      case 'H4': indexes.push(4); break;
      case 'H5': indexes.push(5); break;
    }
  }

  return indexes;
}

function drawHand(svg: SVGSVGElement, cards: string[], pos: HandPosition, uncovered: number[] = [], playableCards: CardLocation[] = []): SVGGElement {
  const group = document.createElementNS(SVG_NS, 'g');

  for (let i = 0; i < HAND_SIZE; i++) {
    const offset = i % 3;
    const x = CARD_SIZE.width * offset + HAND_PADDING * offset;
    const y = i < 3 ? 0 : CARD_SIZE.height + HAND_PADDING;

    const highlight = handIndexes(playableCards).includes(i);
    if (highlight) {
      const rect = createCardHighlight({ x, y });
      group.appendChild(rect);

    }

    const image = createHandCard({ x, y }, i, cards, uncovered, highlight);
    group.appendChild(image);
  }

  const size = svgSize(svg);
  const midX = size.width / 2 - CARD_SIZE.width * 1.5;
  const bottomY = size.height - CARD_SIZE.height * 2 - HAND_PADDING * 2;

  let x: number;
  let y: number;

  switch (pos) {
    case 'bottom':
      group.setAttribute('transform', `translate(${midX}, ${bottomY})`);
      break;
    case 'top':
      x = midX + CARD_SIZE.width * 3 + HAND_PADDING * 2;
      y = CARD_SIZE.height * 2 + HAND_PADDING * 2;
      group.setAttribute('transform', `translate(${x}, ${y}), rotate(180)`);
      break;
  }

  svg.appendChild(group);
  return group;
}

function drawHeldCard(svg: SVGSVGElement, cardName: string, playableCards: CardLocation[] = []): SVGImageElement {
  const size = svgSize(svg);
  const x = size.width * 0.75;
  const y = size.height - CARD_SIZE.height * 1.5;
  const highlight = playableCards.includes('HELD');

  const card = drawCard(svg, cardName, { x, y }, highlight);
  card.onclick = (_ev) => heldCardClicked();

  return card;
}

function createText(coord: Coord, text: string, color = 'gray') {
  const elem = document.createElementNS(SVG_NS, 'text');
  
  elem.textContent = text;
  elem.setAttribute('x', coord.x.toString());
  elem.setAttribute('y', coord.y.toString());
  elem.setAttribute('fill', color);

  return elem;
}

function drawScore(svg: SVGElement, score: number) {
  const size = svgSize(svg);
  const x = size.width / 7;
  const y = size.height - CARD_SIZE.height * 1;
  const text = 'Score: ' + score;

  const elem = createText({ x, y }, text);
  svg.appendChild(elem);
  return elem;
}

export function drawGame(svg: SVGSVGElement, state: State) {
  empty(svg);

  const game = getGame(state);
  if (game == null) { return; }

  const playableCards = getPlayableCards(state);
  drawDeck(svg, game.hasStarted, playableCards);

  if (game.hasStarted) {
    drawTableCard(svg, game.tableCard, playableCards);

    const hand = getHand(state);
    const uncoveredCards = getUncoveredCards(state);

    if (hand != null && uncoveredCards != null) { 
      drawHand(svg, hand, 'bottom', uncoveredCards, playableCards);
    }

    const heldCard = getHeldCard(state);
    if (heldCard) { 
      drawHeldCard(svg, heldCard, playableCards); 
    }

    const score = getScore(state);
    if (score != null) { 
      drawScore(svg, score); 
    }
  }
}
