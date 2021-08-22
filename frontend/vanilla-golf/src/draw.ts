import { deckCardClicked, handCardClicked, heldCardClicked, onMouseOut, onMouseOver, tableCardClicked } from "./event";
import { CardLocation, Game, HAND_SIZE } from "./game";

export interface Coord {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

type HandPosition = 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT';

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

interface DrawCardOpts {
  svg: SVGSVGElement;
  card: string;
  coord: Coord;
  highlight?: boolean;
}

function drawCard(opts: DrawCardOpts): SVGImageElement {
  const { svg, card, coord } = opts;
  const image = createCardImage(card, coord);

  if (opts.highlight) {
    const hlRect = makeRect(coord, CARD_SIZE);
    svg.appendChild(hlRect);
  }

  svg.appendChild(image);
  return image;
}

interface DrawDeckOpts {
  svg: SVGSVGElement;
  size: Size;
  userId: number;
  game: Game;
  playableCards?: CardLocation[];
  hoverCard: CardLocation | null;
}

function drawDeck(opts: DrawDeckOpts) {
  const { svg, size, userId, game, playableCards, hoverCard } = opts;
  let x = size.width / 2 - CARD_SIZE.width / 2 - HAND_PADDING;
  const y = size.height / 2 - CARD_SIZE.height / 2;

  if (game.hasStarted) {
    x -= CARD_SIZE.width / 2;
  }

  const deckIsPlayable = playableCards && playableCards.includes('DECK');
  const highlight = deckIsPlayable && hoverCard === 'DECK';
  const card = '2B';
  const coord = { x, y };
  const cardImage = drawCard({ svg, card, coord, highlight });

  cardImage.onclick = () => deckCardClicked(game, userId);
  cardImage.addEventListener('mouseover', () => onMouseOver('DECK', hoverCard));
  cardImage.addEventListener('mouseout', () => onMouseOut('DECK', hoverCard));

  return cardImage;
}

interface DrawTableOpts {
  svg: SVGSVGElement;
  size: Size;
  userId: number;
  game: Game;
  card: string;
  playableCards?: CardLocation[];
  hoverCard: CardLocation | null;
}

function drawTableCard(opts: DrawTableOpts) {
  const { svg, size, userId, game, card, hoverCard } = opts;
  const playableCards = opts.playableCards || [];
  const x = size.width / 2 + HAND_PADDING;
  const y = size.height / 2 - CARD_SIZE.height / 2;
  const highlight = playableCards.includes('TABLE') && hoverCard === 'TABLE';

  const cardImage = drawCard({ svg, card, coord: { x, y }, highlight });
  cardImage.onclick = () => tableCardClicked(game, userId);
  cardImage.onmouseover = () => onMouseOver('TABLE', hoverCard);
  cardImage.onmouseout = () => onMouseOut('TABLE', hoverCard);

  return cardImage;
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

interface CreateHandOpts {
  userId: number;
  game: Game;
  cards: string[];
  uncovered: number[];
  playableCards: CardLocation[];
  hoverCard: CardLocation | null;
}

function createHand(opts: CreateHandOpts) {
  const { userId, game, cards, uncovered, playableCards, hoverCard } = opts;
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
      const rect = makeRect({ x, y }, CARD_SIZE);
      group.appendChild(rect);
    }

    const card = uncovered.includes(i) ? cards[i] : '2B';
    const image = createCardImage(card, { x, y });
    image.onclick = () => handCardClicked(game, userId, i);
    image.onmouseover = () => onMouseOver(location, hoverCard);
    image.onmouseout = () => onMouseOut(location, hoverCard);

    group.appendChild(image);
  }

  return group;
}

interface DrawHandOpts {
  svg: SVGSVGElement;
  size: Size;
  userId: number;
  game: Game;
  cards: string[];
  position: HandPosition;
  uncovered: number[];
  playableCards: CardLocation[];
  hoverCard: CardLocation | null;
}

function drawHand(opts: DrawHandOpts) {
  const { svg, size, position } = opts;
  const group = createHand(opts);

  switch (position) {
    case 'BOTTOM':
      const bottomX = size.width / 2 - CARD_SIZE.width * 1.5;
      const bottomY = size.height - CARD_SIZE.height * 2 - HAND_PADDING * 2;
      group.setAttribute('transform', `translate(${bottomX}, ${bottomY})`);
      break;
    case 'LEFT':
      const leftX = CARD_SIZE.height * 2 + HAND_PADDING * 2;
      const leftY = size.height / 2 - CARD_SIZE.height;
      group.setAttribute('transform', `translate(${leftX}, ${leftY}), rotate(90)`);
      break;
    case 'TOP':
      const topX = size.width / 2 + CARD_SIZE.width * 1.5;
      const topY = CARD_SIZE.height * 2 + HAND_PADDING * 2;
      group.setAttribute('transform', `translate(${topX}, ${topY}), rotate(180)`);
      break;
    case 'RIGHT':
      const rightX = size.width - CARD_SIZE.height * 2 - HAND_PADDING * 2;
      const rightY = size.height / 2 + CARD_SIZE.height;
      group.setAttribute('transform', `translate(${rightX}, ${rightY}), rotate(270)`)
      break;
  }

  svg.appendChild(group);
  return group;
}

function playerHandPositions(playerCount: number): HandPosition[] {
  switch (playerCount) {
    case 1: return ['BOTTOM'];
    case 2: return ['BOTTOM', 'TOP'];
    case 3: return ['BOTTOM', 'LEFT', 'RIGHT'];
    case 4: return ['BOTTOM', 'LEFT', 'TOP', 'RIGHT'];
    default: return [];
  }
}

interface DrawHandsOpts {
  svg: SVGSVGElement;
  size: Size;
  userId: number;
  game: Game;
  playableCards: CardLocation[];
  hoverCard: CardLocation | null;
}

function drawHands(opts: DrawHandsOpts) {
  const { svg, size, userId, game, playableCards, hoverCard } = opts;
  const players = game.players;
  const order = game.playerOrders[userId]
  const positions = playerHandPositions(players.length);

  for (let i = 0; i < players.length; i++) {
    const id = order[i];
    const player = players.find(p => p.id === id);
    const cards = player?.hand.cards;
    const position = positions[i];
    const uncovered = player?.hand.uncoveredCards;

    if (cards == null) {
      throw new Error("cards is null");
    }

    if (uncovered == null) {
      throw new Error("uncovered is null");
    }

    drawHand({ svg, size, userId, game, cards, position, uncovered, playableCards, hoverCard });
  }
}

interface DrawHeldCardOpts {
  svg: SVGSVGElement;
  size: Size;
  userId: number;
  game: Game;
  card: string;
  playableCards?: CardLocation[];
  hoverCard: CardLocation | null;
}

function drawHeldCard(opts: DrawHeldCardOpts): SVGImageElement {
  const { svg, size, userId, game, card, hoverCard } = opts;
  const playableCards = opts.playableCards || [];

  const x = size.width * 0.75;
  const y = size.height - CARD_SIZE.height * 1.5;
  const highlight = playableCards.includes('HELD') && hoverCard === 'HELD';

  const cardImage = drawCard({ svg, card, coord: { x, y }, highlight });
  cardImage.onclick = () => heldCardClicked(game, userId);
  cardImage.onmouseover = () => onMouseOver('HELD', hoverCard);
  cardImage.onmouseout = () => onMouseOut('HELD', hoverCard);
  
  return cardImage;
}

function createText(coord: Coord, text: string, color = 'gray') {
  const elem = document.createElementNS(SVG_NS, 'text');
  elem.textContent = text;
  elem.setAttribute('x', coord.x.toString());
  elem.setAttribute('y', coord.y.toString());
  elem.setAttribute('fill', color);
  return elem;
}

function drawScore(svg: SVGElement, size: Size, score: number) {
  const x = size.width / 7;
  const y = size.height - CARD_SIZE.height * 1;
  const text = 'Score: ' + score;
  const elem = createText({ x, y }, text);
  svg.appendChild(elem);
  return elem;
}

interface DrawGameOpts {
  svg: SVGSVGElement;
  size: Size;
  userId: number;
  game: Game;
  hoverCard: CardLocation | null;
}

export function drawGame(opts: DrawGameOpts) {
  const { svg, size, game, userId, hoverCard } = opts;
  const playableCards = game.playableCards[userId];
  const player = game.players.find(p => p.id === userId);
  const heldCard = player?.heldCard;
  const score = player?.hand.visibleScore;

  drawDeck({ svg, size, userId, game, hoverCard, playableCards });

  if (game.hasStarted) {
    if (game.tableCard) {
      drawTableCard({ svg, size, userId, game, card: game.tableCard, playableCards, hoverCard });
    }

    drawHands({ svg, size, userId, game, playableCards, hoverCard });

    if (heldCard != null) {
      drawHeldCard({ svg, size, userId, game, card: heldCard, playableCards, hoverCard });
    }

    if (score != null) {
      drawScore(svg, size, score);
    }
  }
}
