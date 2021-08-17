import { store } from "../app/store";
import { cardClicked, ClickedCard } from "./gameSlice";
import { CardLocation, Game, Hand } from "./logic";
import { 
  sendDiscard, sendSwapCard, sendTakeFromDeck, sendTakeFromTable, sendUncover 
} from "../websocket/message";

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

const cardSize: Size = { width: 60, height: 84 };
const cardScale = '10%';

const handPadding = 2;
const hlPadding = 2; // how far highlight rect extends past card

export interface Coord {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

type HandPosition = 'bottom' | 'left' | 'top' | 'right';

export interface Context {
  playerId: number;
  svg: SVGElement;
  size: Size;
  game: Game;
  showDeckCard: boolean;
  clickedCard: ClickedCard | null;
  playerHand: Hand | undefined;
  heldCard: string | undefined;
  playerScore: number | undefined;
  // playableCards: CardLocation[] | undefined;
}

function cardPath(cardName: string) {
  console.assert(cardName.length === 2);
  return `img/cards/${cardName}.svg`;
}

export function makeRect(coord: Coord, size: Size, color = '#44ff00'): SVGRectElement {
  const rect = document.createElementNS(svgNS, 'rect');

  rect.setAttribute('x', coord.x.toString());
  rect.setAttribute('y', coord.y.toString());
  rect.setAttribute('width', size.width.toString());
  rect.setAttribute('height', size.height.toString());
  rect.setAttribute('stroke', color);
  rect.setAttribute('stroke-width', hlPadding.toString());

  return rect;
}

function makeCard(card: string, coord: Coord, onClick?: (card: ClickedCard) => void): SVGImageElement {
  const img = document.createElementNS(svgNS, 'image');

  img.setAttribute('width', cardScale);
  img.setAttribute('x', coord.x.toString());
  img.setAttribute('y', coord.y.toString());
  img.setAttributeNS(xlinkNS, 'xlink:href', cardPath(card));

  if (onClick) {
    img.onclick = () => onClick(card as ClickedCard);
  }

  return img;
}

function isHandCard(card: ClickedCard): boolean {
  return Number.isFinite(card);
}

function handleClick(context: Context, card: ClickedCard) {
  const { game, playerId } = context;

  console.log('clicked: ' + card);

  if (game.hasStarted) {
    store.dispatch(cardClicked(card)); // TODO: change this to a thunk

    switch (game.stateType) {
      case 'UNCOVER':
      case 'UNCOVER_TWO':
        if (isHandCard(card)) {
          sendUncover(game.id, playerId, card as number);
        }
        break;

      case 'TAKE':
        if (card === 'deck') {
          sendTakeFromDeck(game.id, playerId);
        } else if (card === 'table') {
          sendTakeFromTable(game.id, playerId);
        }
        break;

      case 'DISCARD':
        if (card === 'held') {
          sendDiscard(game.id, playerId);
        } else if (isHandCard(card)) {
          sendSwapCard(game.id, playerId, card as number);
        }
        break;
    }
  }
}

function makeHighlight(coord: Coord) {
  const x = coord.x;
  const y = coord.y;
  const hlCoord = { x, y };
  const width = cardSize.width;
  const height = cardSize.height;
  const hlSize = { width, height };

  return makeRect(hlCoord, hlSize);
}

interface DrawCardOpts {
  highlight?: boolean;
  onClick?: (card: ClickedCard) => void;
}

function drawCard(svg: SVGElement, card: string, coord: Coord, opts: DrawCardOpts = {}) {
  const { onClick, highlight } = opts;
  const img = makeCard(card, coord, onClick);

  if (highlight === true) {
    const rect = makeHighlight(coord);
    svg.appendChild(rect);
  }

  svg.appendChild(img);
}

function deckCoord(size: Size, hasStarted: boolean): Coord {
  const x = hasStarted
    ? size.width / 2 - cardSize.width - handPadding
    : size.width / 2 - cardSize.width / 2 - handPadding;

  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawDeck(context: Context) {
  const { svg, size, game, showDeckCard } = context;
  const { deckCard, hasStarted } = game;

  const coord = deckCoord(size, hasStarted);
  const cardToDraw = showDeckCard && deckCard ? deckCard : '2B';

  // const highlight = playableCards && playableCards.includes('DECK');
  const onClick = () => handleClick(context, 'deck');
  const opts = { onClick };

  drawCard(svg, cardToDraw, coord, opts);
}

function tableCardCoord(size: Size): Coord {
  const x = size.width / 2 + handPadding;
  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawTableCard(context: Context) {
  const { svg, size, game } = context;
  const tableCard = game.tableCard;
  const coord = tableCardCoord(size);

  // const highlight = playableCards && playableCards.includes('TABLE');
  const onClick = () => handleClick(context, 'table');
  const opts = { onClick }

  if (tableCard) {
    drawCard(svg, tableCard, coord, opts);
  } else { 
    throw new Error('table card is null');
  }
}

function heldCardCoord(size: Size): Coord {
  const x = size.width * 0.75;
  const y = size.height - cardSize.height * 1.5;

  return { x, y };
}

function drawHeldCard(context: Context) {
  const { svg, size, heldCard } = context;
  const coord = heldCardCoord(size);
  const highlight = true;
  const onClick = () => handleClick(context, 'held');

  if (heldCard) {
    drawCard(svg, heldCard, coord, { onClick, highlight });
  }
}

interface DrawHandOpts {
  onClick: (index: ClickedCard) => void;
  // playableCards: CardLocation[];
}

function getCardLocation(n: number): CardLocation | undefined {
  switch (n) {
    case 0: return 'HAND0';
    case 1: return 'HAND1';
    case 2: return 'HAND2';
    case 3: return 'HAND3';
    case 4: return 'HAND4';
    case 5: return 'HAND5';
  }
}

function makeHand(cards: string[], uncoveredCards: number[], opts: DrawHandOpts) {
  const { onClick } = opts;
  const group = document.createElementNS(svgNS, 'g');

  for (let i = 0; i < 6; i++) {
    const offset = i % 3;

    const x = cardSize.width * offset + handPadding * offset;
    const y = i < 3 ? 0 : cardSize.height + handPadding;
    const coord = { x, y };
    const card = uncoveredCards.includes(i) ? cards[i]: '2B';

    const cardElem = makeCard(card, coord, onClick);

    // if (Number.isFinite(i)) {
    //   const location = getCardLocation(i);
    //   if (location && opts.playableCards.includes(location)) {
    //     const highlightRect = makeHighlight(coord);
    //     group.appendChild(highlightRect);
    //   }
    // }

    // if (i === clickedCard) {
    //   const hlRect = makeHighlight(coord);
    //   group.appendChild(hlRect);
    // }

    if (onClick) {
      cardElem.onclick = () => onClick(i as ClickedCard);
    }

    group.appendChild(cardElem);
  }

  return group;
}

function drawHand(svg: SVGElement, hand: Hand, pos: HandPosition, opts: DrawHandOpts) {
  const boundingRect = svg.getBoundingClientRect();
  const canvasWidth = boundingRect.width;
  const canvasHeight = boundingRect.height;

  const midX = canvasWidth / 2 - cardSize.width * 1.5;
  const bottomY = canvasHeight - cardSize.height * 2 - handPadding * 2;

  const handElem = makeHand(hand.cards, hand.uncoveredIndices, opts);

  let x: number;
  let y: number;

  switch (pos) {
    case 'bottom':
      handElem.setAttribute('transform', `translate(${midX}, ${bottomY})`);
      break;
    case 'top':
      x = midX + cardSize.width * 3 + handPadding * 2;
      y = cardSize.height * 2 + handPadding * 2;
      handElem.setAttribute('transform', `translate(${x}, ${y}), rotate(180)`);
      break;
  }

  svg.appendChild(handElem);
}

function drawPlayerHand(context: Context) {
  const { svg, playerHand } = context;
  const onClick = (i: ClickedCard) => handleClick(context, i);

  // const cards = playableCards || [];
  const opts: DrawHandOpts = { onClick };

  if (playerHand) {
    drawHand(svg, playerHand, 'bottom', opts);
  } else {
    throw new Error('player hand is null');
  }
}

function makeText(coord: Coord, text: string, color = 'gray') {
  const elem = document.createElementNS(svgNS, 'text');
  
  elem.textContent = text;
  elem.setAttribute('x', coord.x.toString());
  elem.setAttribute('y', coord.y.toString());
  elem.setAttribute('fill', color);

  return elem;
}

function scoreCoord(size: Size): Coord {
  const x = size.width / 7;
  const y = size.height - cardSize.height * 1;

  return { x, y }
}

function drawScore(svg: SVGElement, size: Size, score: number) {
  const coord = scoreCoord(size);
  const text = 'Score: ' + score;
  const elem = makeText(coord, text);

  svg.appendChild(elem);
}

export function drawGame(context: Context) {
  const { game, heldCard, svg, playerScore } = context;
  const tableCard = game.tableCard;

  drawDeck(context);

  const turnCoord = { x: 20, y: 30 };
  const turnText = makeText(turnCoord, 'PLAYER ' + game.playerTurn.toString());
  svg.appendChild(turnText);

  const stateCoord = { x: 20, y: 50 };
  const stateText = game.stateType === 'DISCARD' ? 'DISCARD/SWAP' : game.stateType;
  const stateTextElem = makeText(stateCoord, stateText);
  svg.appendChild(stateTextElem);

  if (game.hasStarted) {
    drawPlayerHand(context);
    if (tableCard) {
      drawTableCard(context);
    }
    if (heldCard) {
      drawHeldCard(context);
    }
    if (playerScore != null) {
      drawScore(svg, context.size, playerScore);
    }
  }
}