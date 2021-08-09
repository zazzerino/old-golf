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

const svgNS = 'http://www.w3.org/2000/svg';
const xlinkNS = 'http://www.w3.org/1999/xlink';

const cardScale = '10%';
const cardSize: Size = { width: 60, height: 84 };

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

function makeCardHighlight(coord: Coord) {
    const padding = 2;

    const x = coord.x - padding;
    const y = coord.y - padding;
    const hlCoord = { x, y };

    const width = cardSize.width + padding * 2;
    const height = cardSize.height + padding * 2;
    const hlSize = { width, height };

    const rect = makeRect(hlCoord, hlSize);
    return rect;
}

interface DrawCardOpts {
  onClick?: (card: string) => void;
  highlight?: boolean;
}

function drawCard(svg: SVGElement, card: string, coord: Coord, opts: DrawCardOpts = {}) {
  const { onClick, highlight } = opts;

  const img = makeCard(card, coord, onClick);

  if (highlight === true) {
    const hl = makeCardHighlight(coord);
    svg.appendChild(hl);
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
  console.log('table card clicked');
  store.dispatch(cardClicked('table'));
}

function drawTableCard(svg: SVGElement, size: Size, card: string, clickedCard: ClickedCard) {
  const coord = tableCardCoord(size);
  const highlight = clickedCard === 'table';
  const onClick = tableCardClicked;

  drawCard(svg, card, coord, { highlight, onClick });
}

function drawGame(svg: SVGElement, size: Size, game: Game, clickedCard: ClickedCard) {
  drawDeck(svg, size);

  if (game.tableCard) {
    drawTableCard(svg, size, game.tableCard, clickedCard);
  }
}

export function GameCanvas() {
  const className = 'GameCanvas';
  const svgRef = React.useRef<SVGSVGElement>(null);
  const size: Size = { width: 600, height: 400 };
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
