import React from 'react';
import { useAppSelector } from '../app/hooks';
import { store } from '../app/store';
import { cardClicked, ClickedCard, selectClickedCard, selectCurrentGame } from './gameSlice';
import { images } from './images';
import { Game } from './logic';

interface Coord {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface HandOpts {
  clickedCard?: ClickedCard;
  onClick?: (index: number) => void;
}

interface DrawCardOpts {
  highlight?: boolean;
  onClick?: (card: string) => void;
}

type HandPos = 'bottom' | 'left' | 'top' | 'right';

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

function makeRect(coord: Coord, size: Size, color = '#44ff00') {
  const rect = document.createElementNS(svgNS, 'rect');

  rect.setAttribute('x', coord.x.toString());
  rect.setAttribute('y', coord.y.toString());
  rect.setAttribute('width', size.width.toString());
  rect.setAttribute('height', size.height.toString());
  rect.setAttribute('fill', color);

  return rect;
}

function makeCard(card: string, coord: Coord, onClick = (card: string) => {}) {
  const img = document.createElementNS(svgNS, 'image');

  img.setAttribute('width', cardScale);
  img.setAttribute('x', coord.x.toString());
  img.setAttribute('y', coord.y.toString());
  img.setAttributeNS(xlinkNS, 'xlink:href', images[card]);

  img.onclick = () => onClick(card);

  return img;
}

function makeHighlight(coord: Coord) {
  const x = coord.x - hlPadding;
  const y = coord.y - hlPadding;
  const hlCoord = { x, y };

  const width = cardSize.width + hlPadding * 2;
  const height = cardSize.height + hlPadding * 2;
  const hlSize = { width, height };

  const rect = makeRect(hlCoord, hlSize);
  return rect;
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

function deckCoord(size: Size): Coord {
  const x = size.width / 2 - cardSize.width;
  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawDeck(svg: SVGElement, size: Size) {
  const coord = deckCoord(size);
  drawCard(svg, '2B', coord);
}

function tableCardCoord(size: Size): Coord {
  const x = size.width / 2;
  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function tableCardClicked() {
  store.dispatch(cardClicked('table'));
}

function drawTableCard(svg: SVGElement, size: Size, card: string, clickedCard: ClickedCard) {
  const coord = tableCardCoord(size);
  const highlight = clickedCard === 'table';
  const opts = { highlight, onClick: tableCardClicked }

  drawCard(svg, card, coord, opts);
}

function makeHand(cards: string[], opts: HandOpts) {
  const { clickedCard, onClick } = opts;
  const group = document.createElementNS(svgNS, 'g');

  for (let i = 0; i < cards.length; i++) {
    const inTopRow = i < 3;
    const offset = inTopRow ? i : i - 3;
    const x = cardSize.width * offset + handPadding * offset;
    const y = inTopRow ? 0 : cardSize.height + handPadding;
    const coord = { x, y };

    const card = makeCard(cards[i], coord);

    if (clickedCard === i) {
      const hlRect = makeHighlight(coord);
      group.appendChild(hlRect);
    }

    if (onClick) {
      card.onclick = () => onClick(i);
    }

    group.appendChild(card);
  }

  return group;
}

function drawHand(svg: SVGElement, cards: string[], pos: HandPos, opts: HandOpts = {}) {
  const boundingRect = svg.getBoundingClientRect();
  const canvasWidth = boundingRect.width;
  const canvasHeight = boundingRect.height;

  const midX = canvasWidth / 2 - cardSize.width * 1.5;
  const bottomY = canvasHeight - cardSize.height * 2 - handPadding * 2;

  const hand = makeHand(cards, opts);

  switch (pos) {
    case 'bottom':
      hand.setAttribute('transform', `translate(${midX}, ${bottomY})`);
      break;
    case 'top':
      hand.setAttribute('transform', `translate(${midX + cardSize.width * 3 + handPadding * 2}, ${cardSize.height * 2 + handPadding * 2}), rotate(180)`);
      break;
  }

  svg.appendChild(hand);
}

function playerHandClicked(index: ClickedCard) {
  store.dispatch(cardClicked(index));
}

function drawPlayerHand(svg: SVGElement, cards: string[], clickedCard: ClickedCard = null) {
  const onClick = (i: number) => playerHandClicked(i as ClickedCard);
  drawHand(svg, cards, 'bottom', { clickedCard, onClick });
}

function drawGame(svg: SVGElement, size: Size, game: Game, clickedCard: ClickedCard) {
  drawDeck(svg, size);

  if (game.tableCard) {
    drawTableCard(svg, size, game.tableCard, clickedCard);
  }

  drawPlayerHand(svg, ['AC', '2C', '3C', '4H', '5H', '6H'], clickedCard);
  drawHand(svg, ['AC', '2C', '3C', '4H', '5H', '6H'], 'top');
}

export function GameCanvas() {
  const className = 'GameCanvas';

  const svgRef = React.useRef<SVGSVGElement>(null);
  const size: Size = { width: 600, height: 500 };

  const game = useAppSelector(selectCurrentGame);
  const clickedCard = useAppSelector(selectClickedCard);

  React.useEffect(() => {
    const elem = svgRef.current;

    if (elem && game) {
      drawGame(elem, size, game, clickedCard);
    }

    return () => {
      if (elem) {
        empty(elem);
      }
    }
  });

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        width={size.width}
        height={size.height}
        style={{ backgroundColor: 'aliceblue' }}
      />
    </div>
  );
}
