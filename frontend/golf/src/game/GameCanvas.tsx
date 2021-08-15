import React from 'react';
import { useAppSelector } from '../app/hooks';
import { store } from '../app/store';
import { cardClicked, ClickedCard, selectClickedCard, selectCurrentGame, selectHeldCard, selectPlayerHand, selectPlayerScore, selectShowDeckCard } from './gameSlice';
import { images } from './images';
import { Game, Hand } from './logic';
import { selectUserId } from '../user';
import { sendDiscard, sendSwapCard, sendTakeFromDeck, sendTakeFromTable, sendUncover } from '../websocket/message';

interface Coord {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface HandOpts {
  clickedCard: ClickedCard | null;
  onClick: (index: ClickedCard) => void;
}

interface DrawCardOpts {
  highlight?: boolean;
  onClick?: (card: ClickedCard) => void;
}

type Position = 'bottom' | 'left' | 'top' | 'right';

interface Context {
  playerId: number;
  svg: SVGElement;
  size: Size;
  game: Game;
  showDeckCard: boolean;
  clickedCard: ClickedCard | null;
  playerHand: Hand | undefined;
  heldCard: string | undefined;
  playerScore: number | undefined;
}

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

const cardScale = '10%';
const cardSize: Size = { width: 60, height: 84 };

// const hlPadding = 1; // how far highlight rect extends past card
const handPadding = 2;

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

function isHandCard(card: ClickedCard): boolean {
  return Number.isFinite(card);
}

function handleClick(context: Context, card: ClickedCard) {
  const { game, playerId } = context;
  const stateType = game.stateType;

  console.log('clicked: ' + card);

  if (game.hasStarted) {
    store.dispatch(cardClicked(card)); // TODO: change this to a thunk

    switch (stateType) {
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

    // if (state === 'PICKUP') {
    //   if (card === 'deck') {
    //     sendTakeFromDeck(game.id, playerId);
    //   } else if (card === 'table') {
    //     sendTakeFromTable(game.id, playerId);
    //   }
    // } else if (state === 'DISCARD') {
    //   if (card === 'held') {
    //     sendDiscard(game.id, playerId);
    //   } else if (isHandCard(card)) {
    //     sendSwapCard(game.id, playerId, card as number);
    //   }
    // } else if (state === 'UNCOVER' || state === 'UNCOVER_TWO') {
    //   if (isHandCard(card)) {
    //     sendUncover(game.id, playerId, card as number);
    //   }
    // }
  }
}

function makeRect(coord: Coord, size: Size, color = '#44ff00') {
  const rect = document.createElementNS(svgNS, 'rect');

  rect.setAttribute('x', coord.x.toString());
  rect.setAttribute('y', coord.y.toString());
  rect.setAttribute('width', size.width.toString());
  rect.setAttribute('height', size.height.toString());
  rect.setAttribute('fill', color);

  return rect;
}

function makeCard(card: string, coord: Coord, onClick?: (card: ClickedCard) => void) {
  const img = document.createElementNS(svgNS, 'image');

  img.setAttribute('width', cardScale);
  img.setAttribute('x', coord.x.toString());
  img.setAttribute('y', coord.y.toString());
  img.setAttributeNS(xlinkNS, 'xlink:href', images[card]);

  if (onClick) {
    img.onclick = () => onClick(card as ClickedCard);
  }

  return img;
}

// function makeHighlight(coord: Coord) {
//   const x = coord.x - hlPadding;
//   const y = coord.y - hlPadding;
//   const hlCoord = { x, y };

//   const width = cardSize.width + hlPadding * 2;
//   const height = cardSize.height + hlPadding * 2;
//   const hlSize = { width, height };

//   return makeRect(hlCoord, hlSize);
// }

function drawCard(svg: SVGElement, card: string, coord: Coord, opts: DrawCardOpts = {}) {
  const { onClick, highlight } = opts;
  const img = makeCard(card, coord, onClick);

  // if (highlight === true) {
  //   const rect = makeHighlight(coord);
  //   svg.appendChild(rect);
  // }

  svg.appendChild(img);
}

function deckCoord(size: Size, hasStarted: boolean): Coord {
  const x = hasStarted
    ? size.width / 2 - cardSize.width
    : size.width / 2 - cardSize.width / 2;

  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawDeck(context: Context) {
  const { svg, size, game, clickedCard, showDeckCard} = context;
  const { deckCard, hasStarted } = game;

  const coord = deckCoord(size, hasStarted);
  const cardToDraw = showDeckCard && deckCard ? deckCard : '2B';

  const highlight = clickedCard === 'deck';
  const onClick = () => handleClick(context, 'deck');
  const opts = { highlight, onClick };

  drawCard(svg, cardToDraw, coord, opts);
}

function tableCardCoord(size: Size): Coord {
  const x = size.width / 2;
  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawTableCard(context: Context) {
  const { svg, size, clickedCard, game } = context;
  const tableCard = game.tableCard;
  const coord = tableCardCoord(size);

  const highlight = clickedCard === 'table';
  const onClick = () => handleClick(context, 'table');
  const opts = { highlight, onClick }

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
  const onClick = () => handleClick(context, 'held');

  if (heldCard) {
    drawCard(svg, heldCard, coord, { onClick });
  }
}

function makeHand(cards: string[], uncoveredCards: number[], opts: HandOpts) {
  const { clickedCard, onClick } = opts;
  const group = document.createElementNS(svgNS, 'g');

  for (let i = 0; i < 6; i++) {
    const offset = i % 3;

    const x = cardSize.width * offset + handPadding * offset;
    const y = i < 3 ? 0 : cardSize.height + handPadding;
    const coord = { x, y };
    const card = uncoveredCards.includes(i) ? cards[i]: '2B';

    const cardElem = makeCard(card, coord, onClick);

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

function drawHand(svg: SVGElement, hand: Hand, pos: Position, opts: HandOpts) {
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
  const { svg, clickedCard, playerHand } = context;
  const onClick = (i: ClickedCard) => handleClick(context, i);

  if (playerHand) {
    drawHand(svg, playerHand, 'bottom', { clickedCard, onClick });
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
  const text = 'score: ' + score;
  const elem = makeText(coord, text);

  svg.appendChild(elem);
}

function drawGame(context: Context) {
  const { game, heldCard, svg, playerScore } = context;
  const tableCard = game.tableCard;

  drawDeck(context);

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

export function GameCanvas() {
  const className = 'GameCanvas';

  const svgRef = React.useRef<SVGSVGElement>(null);
  const size: Size = { width: 600, height: 500 };

  const game = useAppSelector(selectCurrentGame);

  const playerId = useAppSelector(selectUserId);
  const playerHand = useAppSelector(selectPlayerHand);
  const playerScore = useAppSelector(selectPlayerScore);

  const heldCard = useAppSelector(selectHeldCard);
  const clickedCard = useAppSelector(selectClickedCard);
  const showDeckCard = useAppSelector(selectShowDeckCard);

  React.useEffect(() => {
    const svg = svgRef.current;

    if (svg && game && playerId) {
      const context: Context = { playerId, game, svg, size, clickedCard, showDeckCard, playerHand, heldCard, playerScore };
      drawGame(context);
    }

    return () => {
      if (svg) {
        empty(svg);
      }
    }
  });

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${size.width} ${size.height}`}
        width={size.width}
        height={size.height}
        style={{ backgroundColor: 'aliceblue' }}
      />
    </div>
  );
}
