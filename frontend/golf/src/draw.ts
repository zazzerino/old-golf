import { deckCardClicked, handCardClicked, heldCardClicked, HoverEventContext, mouseOut, mouseOver, tableCardClicked } from "./event";
import { CardLocation, Game, handIndexes, HAND_SIZE } from "./game";

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
  const { width, height } = size;
  const elem = document.createElementNS(SVG_NS, 'svg');

  elem.setAttribute('width', width.toString());
  elem.setAttribute('height', height.toString());
  elem.style.backgroundColor = backgroundColor;

  return elem;
}

function createCardImage(card: string, coord: Coord): SVGImageElement {
  const { x, y } = coord;
  const image = document.createElementNS(SVG_NS, 'image');

  image.setAttribute('width', CARD_SCALE);
  image.setAttribute('x', x.toString());
  image.setAttribute('y', y.toString());
  image.setAttributeNS(XLINK_NS, 'href', cardPath(card));

  return image;
}

function createText(coord: Coord, text: string, color = 'gray') {
  const elem = document.createElementNS(SVG_NS, 'text');

  elem.textContent = text;
  elem.setAttribute('x', coord.x.toString());
  elem.setAttribute('y', coord.y.toString());
  elem.setAttribute('fill', color);

  return elem;
}

interface CreateRectOpts {
  coord: Coord;
  size: Size;
  color?: string;
  fill?: boolean;
}

function createRect(opts: CreateRectOpts): SVGRectElement {
  const rectDefaults = { color: '#44ff00', fill: false };
  opts = { ...rectDefaults, ...opts };
  const { coord, size, color, fill } = opts;
  const { x, y } = coord;
  const { width, height } = size;

  const rect = document.createElementNS(SVG_NS, 'rect');

  rect.setAttribute('x', x.toString());
  rect.setAttribute('y', y.toString());
  rect.setAttribute('width', width.toString());
  rect.setAttribute('height', height.toString());
  rect.setAttribute('stroke', color!);
  rect.setAttribute('stroke-width', HL_PADDING.toString());

  if (fill) {
    rect.setAttribute('fill', color!);
  } else {
    rect.setAttribute('fill-opacity', '0');
  }

  return rect;
}

interface CreateCardOpts {
  card: string;
  coord: Coord;
  highlight: boolean;
}

function createCard(opts: CreateCardOpts): SVGImageElement | SVGGElement {
  const { card, coord, highlight } = opts;
  const image = createCardImage(card, coord);

  if (highlight) {
    const g = document.createElementNS(SVG_NS, 'g');
    const rect = createRect({ coord, size: CARD_SIZE });
    g.appendChild(rect);
    g.appendChild(image);
    return g;
  }

  return image;
}

interface DrawContext {
  size: Size;
  userId: number;
  game: Game;
  hoverCard: CardLocation | null;
}

function createDeck(context: DrawContext): SVGImageElement | SVGGElement {
  const { size, game, userId, hoverCard } = context;
  const playableCards = game.playableCards[userId];
  
  const x = size.width / 2 - CARD_SIZE.width / 2 - HAND_PADDING - (game.hasStarted ? CARD_SIZE.width / 2 : 0);
  const y = size.height / 2 - CARD_SIZE.height / 2;

  const isPlayable = playableCards.includes('DECK');
  const highlight = isPlayable && hoverCard === 'DECK';
  const card = '2B';
  const coord = { x, y };
  const cardImage = createCard({ card, coord, highlight });

  const eventContext: HoverEventContext = {
    game,
    userId,
    hoverCard,
    location: 'DECK',
  };

  cardImage.onclick = () => deckCardClicked(game, userId);
  cardImage.addEventListener('mouseover', () => mouseOver(eventContext));
  cardImage.addEventListener('mouseout', () => mouseOut(eventContext));

  return cardImage;
}

export function createTableCard(context: DrawContext) {
  const { size, userId, game, hoverCard } = context;
  const playableCards = game.playableCards[userId];
  const card = game.tableCard;

  const x = size.width / 2 + HAND_PADDING;
  const y = size.height / 2 - CARD_SIZE.height / 2;
  const coord = { x, y };
  const highlight = playableCards.includes('TABLE') && hoverCard === 'TABLE';
  const cardElem = createCard({ card, coord, highlight });

  const eventContext: HoverEventContext = {
    game,
    userId,
    hoverCard,
    location: 'TABLE',
  };

  cardElem.onclick = () => tableCardClicked(game, userId);
  cardElem.onmouseover = () => mouseOver(eventContext);
  cardElem.onmouseout = () => mouseOver(eventContext);

  return cardElem;
}

function handTransform(size: Size, pos: HandPosition): { coord: Coord, rotate: number } {
  let x: number;
  let y: number;
  let rotate: number;

  switch (pos) {
    case 'BOTTOM':
      x = size.width / 2 - CARD_SIZE.width * 1.5;
      y = size.height - CARD_SIZE.height * 2 - HAND_PADDING * 2;
      rotate = 0;
      break;
    case 'LEFT':
      x = CARD_SIZE.height * 2 + HAND_PADDING * 2;
      y = size.height / 2 - CARD_SIZE.height;
      rotate = 90;
      break;
    case 'TOP':
      x = size.width / 2 + CARD_SIZE.width * 1.5;
      y = CARD_SIZE.height * 2 + HAND_PADDING * 2;
      rotate = 180;
      break;
    case 'RIGHT':
      x = size.width - CARD_SIZE.height * 2 - HAND_PADDING * 2;
      y = size.height / 2 + CARD_SIZE.height;
      rotate = 270;
      break;
  }

  const coord = { x, y };
  return { coord, rotate };
}

function createHand(context: DrawContext, playerId: number, pos: HandPosition): SVGGElement {
  const { size, game, userId, hoverCard } = context;
  const playableCards = game.playableCards[playerId];
  const indexes = handIndexes(playableCards);
  const player = game.players.find(p => p.id === playerId);

  if (player == null) {
    throw new Error('player not found');
  }

  const cards = player.hand.cards;
  const uncovered = player.hand.uncoveredCards;

  const g = document.createElementNS(SVG_NS, 'g');

  for (let i = 0; i < HAND_SIZE; i++) {
    const offset = i % 3;
    const x = CARD_SIZE.width * offset + HAND_PADDING * offset;
    const y = i < 3 ? 0 : CARD_SIZE.height + HAND_PADDING;
    const coord = { x, y };
    const location = `H${i}` as CardLocation;
    const isPlayable = indexes.includes(i);
    const isHovered = hoverCard === location;
    const highlight = isPlayable && isHovered;

    if (highlight) {
      const rect = createRect({ coord, size: CARD_SIZE });
      g.appendChild(rect);
    }

    const card = uncovered.includes(i) ? cards[i] : '2B';
    const cardElem = createCard({ card, coord, highlight });

    const eventContext: HoverEventContext = {
      game,
      userId,
      hoverCard,
      location,
    };

    cardElem.onclick = () => userId === playerId && handCardClicked(game, playerId, i);
    cardElem.onmouseover = () => userId === playerId && mouseOver(eventContext);
    cardElem.onmouseout = () => userId === playerId && mouseOut(eventContext);

    g.appendChild(cardElem);
  }

  const { coord, rotate } = handTransform(size, pos);
  g.setAttribute('transform', `translate(${coord.x}, ${coord.y}), rotate(${rotate})`);

  return g;
}

function handPositions(playerCount: number): HandPosition[] {
  switch (playerCount) {
    case 1: return ['BOTTOM'];
    case 2: return ['BOTTOM', 'TOP'];
    case 3: return ['BOTTOM', 'LEFT', 'RIGHT'];
    case 4: return ['BOTTOM', 'LEFT', 'TOP', 'RIGHT'];
    default: return [];
  }
}

function createHands(context: DrawContext): SVGGElement[] {
  const { game, userId } = context;
  const { players } = game;
  const order = game.playerOrders[userId];
  const positions = handPositions(players.length);

  const hands: SVGGElement[] = [];

  for (let i = 0; i < players.length; i++) {
    const pid = order[i];
    const player = players.find(p => p.id === pid);
    const cards = player?.hand.cards;
    const pos = positions[i];
    const uncovered = player?.hand.uncoveredCards;

    if (cards == null) {
      throw new Error('cards is null');
    }

    if (uncovered == null) {
      throw new Error('uncovered is null');
    }

    const hand = createHand(context, pid, pos);
    hands.push(hand);
  }

  return hands;
}

function createHeldCard(context: DrawContext, heldCard: string) {
  const { size, userId, game, hoverCard } = context;

  const x = size.width * 0.75;
  const y = size.height - CARD_SIZE.height * 1.5;
  const playableCards = game.playableCards[userId];
  const highlight = playableCards.includes('HELD') && hoverCard === 'HELD';

  if (heldCard == null) {
    throw new Error('heldCard is null');
  }

  const card = createCard({ card: heldCard, coord: { x, y }, highlight });

  const eventContext: HoverEventContext = {
    game,
    userId,
    hoverCard,
    location: 'HELD',
  };

  card.onclick = () => heldCardClicked(game, userId);
  card.onmouseover = () => mouseOver(eventContext);
  card.onmouseout = () => mouseOut(eventContext);
  
  return card;
}

export function createScore(size: Size, score: number) {
  const x = size.width / 7;
  const y = size.height - CARD_SIZE.height * 1;
  const text = 'Score: ' + score;
  const elem = createText({ x, y }, text);
  return elem;
}

export function createGameOver(size: Size) {
  const x = size.width / 4;
  const y = size.height / 2;
  const text = 'GAME OVER';
  const elem = createText({ x, y }, text, 'red');
  elem.style.fontSize = '50px';
  return elem;
}

export function drawGame(context: DrawContext, svg: SVGSVGElement) {
  const { userId, game, size } = context;

  const deck = createDeck(context);
  svg.appendChild(deck);

  if (game.hasStarted) {
    const tableCard = createTableCard(context);
    svg.appendChild(tableCard);

    const hands = createHands(context);
    hands.forEach(hand => svg.appendChild(hand));

    const player = game.players.find(p => p.id === userId);
    const heldCard = player?.heldCard;

    if (heldCard) {
      const heldCardElem = createHeldCard(context, heldCard);
      svg.appendChild(heldCardElem);
    }

    const score = player?.hand.visibleScore;

    if (score != null) {
      const scoreElem = createScore(size, score);
      svg.appendChild(scoreElem);
    }
  }

  if (game.stateType === 'GAME_OVER') {
    const gameOver = createGameOver(size);
    svg.appendChild(gameOver);
  }
}
