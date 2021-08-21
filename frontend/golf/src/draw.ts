import { deckCardClicked, handCardClicked, heldCardClicked, tableCardClicked } from "./event";
import { CardLocation, HAND_SIZE } from "./game";
import { State, store } from "./store";
import { getGame, getHand, getHeldCard, getHoverCard, getPlayableCards, getScore, getUncoveredCards } from "./select";

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

interface DrawDeckOpts {
  svg: SVGSVGElement;
  hasStarted?: boolean;
  playableCards?: CardLocation[];
  hoverCard?: CardLocation;
}

function drawDeck(opts: DrawDeckOpts) {
  const { svg, playableCards, hoverCard } = opts;
  const hasStarted = opts.hasStarted || false;

  const rect = svg.getBoundingClientRect();
  let x = rect.width / 2 - CARD_SIZE.width / 2 - HAND_PADDING;
  const y = rect.height / 2 - CARD_SIZE.height / 2;

  if (hasStarted) {
    x -= CARD_SIZE.width / 2;
  }

  const highlight = playableCards && playableCards.includes('DECK') && hoverCard === 'DECK';
  const card = drawCard(svg, '2B', { x, y }, highlight);
  card.onclick = () => deckCardClicked();

  const mouseOver = () => {
    if (hoverCard !== 'DECK') {
      store.dispatch('SET_HOVER', 'DECK');
    }
  }

  const mouseOut = () => {
    if (hoverCard === 'DECK') {
      store.dispatch('UNSET_HOVER', null);
    }
  }

  card.addEventListener('mouseover', mouseOver);
  card.addEventListener('mouseout', mouseOut);

  return card;
}

function drawTableCard(svg: SVGSVGElement, cardName: string, playableCards: CardLocation[] = [], hoverCard?: CardLocation): SVGImageElement {
  const rect = svg.getBoundingClientRect();
  const x = rect.width / 2 + HAND_PADDING;
  const y = rect.height / 2 - CARD_SIZE.height / 2;

  const highlight = playableCards.includes('TABLE') && hoverCard === 'TABLE';
  const card = drawCard(svg, cardName, { x, y }, highlight);
  card.onclick = () => tableCardClicked();

  const mouseOver = () => {
    if (hoverCard !== 'TABLE') {
      store.dispatch('SET_HOVER', 'TABLE');
    }
  }

  const mouseOut = () => {
    if (hoverCard === 'TABLE') {
      store.dispatch('UNSET_HOVER', null);
    }
  }

  card.addEventListener('mouseover', mouseOver);
  card.addEventListener('mouseout', mouseOut);

  return card;
}

function svgSize(elem: SVGElement): Size {
  const rect = elem.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  return { width, height };
}

type HandPosition = 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT';

function createHandCard(coord: Coord, i: number, cards: string[], uncovered: number[]) {
  const card = uncovered.includes(i) ? cards[i] : '2B';

  const image = createCardImage(card, coord);
  image.onclick = () => handCardClicked(i);

  return image;
}

function handIndex(cardLoc: CardLocation) {
  const vals: Record<string, number> = {
    'H0': 0,
    'H1': 1,
    'H2': 2,
    'H3': 3,
    'H4': 4,
    'H5': 5,
  };

  return vals[cardLoc];
}

function handIndexes(locations: CardLocation[]): number[] {
  return locations.map(loc => handIndex(loc));
}

function drawHand(svg: SVGSVGElement, cards: string[], pos: HandPosition, uncovered: number[] = [], playableCards: CardLocation[] = [], hoverCard?: CardLocation): SVGGElement {
  const group = document.createElementNS(SVG_NS, 'g');

  for (let i = 0; i < HAND_SIZE; i++) {
    const offset = i % 3;
    const x = CARD_SIZE.width * offset + HAND_PADDING * offset;
    const y = i < 3 ? 0 : CARD_SIZE.height + HAND_PADDING;
    const location = `H${i}` as CardLocation;

    const highlight = hoverCard === location
      && handIndexes(playableCards).includes(i)
      && !(uncovered.includes(i));

    if (highlight) {
      const rect = createCardHighlight({ x, y });
      group.appendChild(rect);
    }

    const image = createHandCard({ x, y }, i, cards, uncovered);

    const mouseOver = () => {
      if (hoverCard !== location) {
        store.dispatch('SET_HOVER', location);
      }
    }

    const mouseOut = () => {
      if (hoverCard === location) {
        store.dispatch('UNSET_HOVER', null);
      }
    }

    image.addEventListener('mouseover', mouseOver);
    image.addEventListener('mouseout', mouseOut);

    group.appendChild(image);
  }

  const size = svgSize(svg);
  const midX = size.width / 2 - CARD_SIZE.width * 1.5;
  const bottomY = size.height - CARD_SIZE.height * 2 - HAND_PADDING * 2;

  let x: number;
  let y: number;

  switch (pos) {
    case 'BOTTOM':
      group.setAttribute('transform', `translate(${midX}, ${bottomY})`);
      break;
    case 'TOP':
      x = midX + CARD_SIZE.width * 3 + HAND_PADDING * 2;
      y = CARD_SIZE.height * 2 + HAND_PADDING * 2;
      group.setAttribute('transform', `translate(${x}, ${y}), rotate(180)`);
      break;
  }

  svg.appendChild(group);
  return group;
}

function drawHeldCard(svg: SVGSVGElement, cardName: string, playableCards: CardLocation[] = [], hoverCard?: CardLocation): SVGImageElement {
  const size = svgSize(svg);
  const x = size.width * 0.75;
  const y = size.height - CARD_SIZE.height * 1.5;
  const highlight = playableCards.includes('HELD') && hoverCard === 'HELD';

  const card = drawCard(svg, cardName, { x, y }, highlight);
  card.onclick = () => heldCardClicked();

  const mouseOver = () => {
    if (hoverCard !== 'HELD') {
      store.dispatch('SET_HOVER', 'HELD');
    }
  }

  const mouseOut = () => {
    if (hoverCard === 'HELD') {
      store.dispatch('UNSET_HOVER', null);
    }
  }

  card.addEventListener('mouseover', mouseOver);
  card.addEventListener('mouseout', mouseOut);

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
  const game = getGame(state);
  if (game == null) { return; }

  const playableCards = getPlayableCards(state);
  const hoverCard = getHoverCard(state);

  drawDeck({ svg, hasStarted: game.hasStarted, playableCards, hoverCard });

  if (game.hasStarted) {
    drawTableCard(svg, game.tableCard, playableCards, hoverCard);

    const hand = getHand(state);
    const uncoveredCards = getUncoveredCards(state);
    if (hand != null && uncoveredCards != null) { 
      drawHand(svg, hand, 'BOTTOM', uncoveredCards, playableCards, hoverCard);
    }

    const heldCard = getHeldCard(state);
    if (heldCard) { 
      drawHeldCard(svg, heldCard, playableCards, hoverCard); 
    }

    const score = getScore(state);
    if (score != null) { 
      drawScore(svg, score); 
    }
  }
}
