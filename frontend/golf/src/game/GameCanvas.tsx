import React from 'react';
import { useAppSelector } from '../app/hooks';
import { store } from '../app/store';
import { cardClicked, ClickedCard, selectClickedCard, selectCurrentGame, selectHeldCard, selectPlayerHand, selectShowDeckCard } from './gameSlice';
import { images } from './images';
import { Game } from './logic';
import { selectUserId } from '../user';
import { sendDiscard, sendTakeFromDeck, sendTakeFromTable } from '../websocket/message';

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

type HandPos = 'bottom' | 'left' | 'top' | 'right';

interface Context {
  playerId: number;
  svg: SVGElement;
  size: Size;
  game: Game;
  showDeckCard: boolean;
  clickedCard: ClickedCard | null;
  playerHand: string[] | null;
  heldCard: string | undefined;
}

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

const cardScale = '10%';
const cardSize: Size = { width: 60, height: 84 };

const hlPadding = 1; // how far highlight rect extends past card
const handPadding = 2;

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

function handleClick(context: Context, card: ClickedCard) {
  const { game, playerId } = context;

  console.log('clicked: ' + card);

  if (game.hasStarted) {
    store.dispatch(cardClicked(card));

    if (card === 'deck') {
      sendTakeFromDeck(game.id, playerId);
    } else if (card === 'table') {
      if (game.state === 'PICKUP') {
        sendTakeFromTable(game.id, playerId);
      }
    } else if (card === 'held') {
      if (game.state === 'DISCARD') {
        console.log('discarding...');
        sendDiscard(game.id, playerId);
      }
    } else {
      console.log('hand clicked: ' + card);
    }
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

function makeHighlight(coord: Coord) {
  const x = coord.x - hlPadding;
  const y = coord.y - hlPadding;
  const hlCoord = { x, y };

  const width = cardSize.width + hlPadding * 2;
  const height = cardSize.height + hlPadding * 2;
  const hlSize = { width, height };

  return makeRect(hlCoord, hlSize);
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
    ? size.width / 2 - cardSize.width
    : size.width / 2 - cardSize.width / 2;

  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawDeck(context: Context) {
  const { svg, size, game, clickedCard, showDeckCard} = context;
  const { deckCard, hasStarted } = game;

  const coord = deckCoord(size, hasStarted);
  const highlight = clickedCard === 'deck';
  const onClick = () => handleClick(context, 'deck');
  const opts = { highlight, onClick };
  const cardToDraw = showDeckCard && deckCard ? deckCard : '2B';

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

function makeHand(cards: string[], opts: HandOpts) {
  const { clickedCard, onClick } = opts;
  const group = document.createElementNS(svgNS, 'g');

  for (let i = 0; i < 6; i++) {
    const offset = i % 3;

    const x = cardSize.width * offset + handPadding * offset;
    const y = i < 3 ? 0 : cardSize.height + handPadding;
    const coord = { x, y };

    const card = makeCard(cards[i], coord, onClick);

    if (i === clickedCard) {
      const hlRect = makeHighlight(coord);
      group.appendChild(hlRect);
    }

    if (onClick) {
      card.onclick = () => onClick(i as ClickedCard);
    }

    group.appendChild(card);
  }

  return group;
}

function drawHand(svg: SVGElement, cards: string[], pos: HandPos, opts: HandOpts) {
  const boundingRect = svg.getBoundingClientRect();
  const canvasWidth = boundingRect.width;
  const canvasHeight = boundingRect.height;

  const midX = canvasWidth / 2 - cardSize.width * 1.5;
  const bottomY = canvasHeight - cardSize.height * 2 - handPadding * 2;

  const hand = makeHand(cards, opts);

  let x: number;
  let y: number;

  switch (pos) {
    case 'bottom':
      hand.setAttribute('transform', `translate(${midX}, ${bottomY})`);
      break;
    case 'top':
      x = midX + cardSize.width * 3 + handPadding * 2;
      y = cardSize.height * 2 + handPadding * 2;
      hand.setAttribute('transform', `translate(${x}, ${y}), rotate(180)`);
      break;
  }

  svg.appendChild(hand);
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

function drawGame(context: Context) {
  const { game, heldCard } = context;
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
  }
}

export function GameCanvas() {
  const className = 'GameCanvas';

  const svgRef = React.useRef<SVGSVGElement>(null);
  const size: Size = { width: 600, height: 500 };

  const game = useAppSelector(selectCurrentGame);
  const playerId = useAppSelector(selectUserId);
  const playerHand = useAppSelector(selectPlayerHand);
  const heldCard = useAppSelector(selectHeldCard);
  const clickedCard = useAppSelector(selectClickedCard);
  const showDeckCard = useAppSelector(selectShowDeckCard);

  React.useEffect(() => {
    const svg = svgRef.current;

    if (svg && game && playerId) {
      const context: Context = { playerId, game, svg, size, clickedCard, showDeckCard, playerHand, heldCard };
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
