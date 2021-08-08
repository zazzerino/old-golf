import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentGame } from './gameSlice';

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

const images: Record<string, string> = {
  '1B': 'img/cards/1B.svg', 
  '2B': 'img/cards/2B.svg',
  'AC': 'img/cards/AC.svg', 
  '2C': 'img/cards/2C.svg',
  '3C': 'img/cards/3C.svg', 
  '4C': 'img/cards/4C.svg',
  '5C': 'img/cards/5C.svg', 
  '6C': 'img/cards/6C.svg',
  '7C': 'img/cards/7C.svg', 
  '8C': 'img/cards/8C.svg', 
  '9C': 'img/cards/9C.svg', 
  'TC': 'img/cards/TC.svg', 
  'JC': 'img/cards/JC.svg',
  'QC': 'img/cards/QC.svg',
  'KC': 'img/cards/KC.svg', 
  'AD': 'img/cards/AD.svg', 
  '2D': 'img/cards/2D.svg',
  '3D': 'img/cards/3D.svg', 
  '4D': 'img/cards/4D.svg', 
  '5D': 'img/cards/5D.svg', 
  '6D': 'img/cards/6D.svg',
  '7D': 'img/cards/7D.svg',
  '8D': 'img/cards/8D.svg', 
  '9D': 'img/cards/9D.svg', 
  'TD': 'img/cards/TD.svg',
  'JD': 'img/cards/JD.svg',
  'QD': 'img/cards/QD.svg', 
  'KD': 'img/cards/KD.svg', 
  'AH': 'img/cards/AH.svg',
  '2H': 'img/cards/2H.svg',
  '3H': 'img/cards/3H.svg', 
  '4H': 'img/cards/4H.svg', 
  '5H': 'img/cards/5H.svg', 
  '6H': 'img/cards/6H.svg',
  '7H': 'img/cards/7H.svg', 
  '8H': 'img/cards/8H.svg',
  '9H': 'img/cards/9H.svg', 
  'TH': 'img/cards/TH.svg', 
  'JH': 'img/cards/JH.svg', 
  'QH': 'img/cards/QH.svg', 
  'KH': 'img/cards/KH.svg', 
  'AS': 'img/cards/AS.svg',
  '2S': 'img/cards/2S.svg',
  '3S': 'img/cards/3S.svg', 
  '4S': 'img/cards/4S.svg', 
  '5S': 'img/cards/5S.svg', 
  '6S': 'img/cards/6S.svg',
  '7S': 'img/cards/7S.svg', 
  '8S': 'img/cards/8S.svg', 
  '9S': 'img/cards/9S.svg', 
  'TS': 'img/cards/TS.svg', 
  'JS': 'img/cards/JS.svg',
  'QS': 'img/cards/QS.svg', 
  'KS': 'img/cards/KS.svg', 
  '1J': 'img/cards/1J.svg', 
  '2J': 'img/cards/2J.svg', 
};

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

function drawRect(svg: SVGElement, coord: Coord, size: Size, color = '#44ff00') {
  const rect = document.createElementNS(svgNS, 'rect');
  rect.setAttribute('x', coord.x.toString());
  rect.setAttribute('y', coord.y.toString());
  rect.setAttribute('width', size.width.toString());
  rect.setAttribute('height', size.height.toString());
  rect.setAttribute('fill', color);

  svg.appendChild(rect);
}

function drawCard(svg: SVGElement, card: string, coord: Coord, highlight = false) {
  const img = document.createElementNS(svgNS, 'image');
  img.setAttribute('width', cardScale);
  img.setAttribute('x', coord.x.toString());
  img.setAttribute('y', coord.y.toString());
  img.setAttributeNS(xlinkNS, 'xlink:href', images[card]);

  if (highlight === true) {
    const padding = 2;
    const x = (coord.x - padding);
    const y = (coord.y - padding);
    const width = cardSize.width + padding * 2;
    const height = cardSize.height + padding * 2;
    drawRect(svg, { x, y }, { width, height });
  }

  svg.appendChild(img);
}

function deckCoord(size: Size): Coord {
  const x = size.width / 2 - cardSize.width / 2;
  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawDeck(svg: SVGElement, size: Size) {
  const coord = deckCoord(size);
  drawCard(svg, '2B', coord);
}

function tableCardCoord(size: Size): Coord {
  const x = size.width / 2 + cardSize.width / 2;
  const y = size.height / 2 - cardSize.height / 2;

  return { x, y };
}

function drawTableCard(svg: SVGElement, size: Size, card: string) {
  const coord = tableCardCoord(size);
  drawCard(svg, card, coord);
}

function drawGame(svg: SVGElement, size: Size) {
  drawDeck(svg, size);
  drawTableCard(svg, size, 'KC');
}

export function GameCanvas() {
  const className = 'GameCanvas';
  const svgRef = React.useRef<SVGSVGElement>(null);
  const game = useAppSelector(selectCurrentGame);
  const size: Size = { width: 600, height: 400 };

  React.useEffect(() => {
    const elem = svgRef.current;

    if (elem && game) {
      drawGame(elem, size);
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
