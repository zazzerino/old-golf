import React from 'react';

export const CARD_WIDTH = 60;
export const CARD_HEIGHT = 84;

const HL_WIDTH = 2;

function cardPath(name: string): string {
  return `img/cards/${name}.svg`;
}

interface CardProps {
  x: number;
  y: number;
  name: string;
  scale?: string;
  highlight?: boolean;
  color?: string;
  onMouseOver?: () => any;
  onMouseOut?: () => any;
  onClick?: () => any;
}

export function Card(props: CardProps) {
  const { name, x, y, highlight, onMouseOver, onMouseOut, onClick } = props;
  const className = "Card";
  const href = cardPath(name);
  const width = props.scale || '10%';
  const color = props.color || 'lime';

  return (
    <>
      {highlight ?
        <g>
          <rect x={x} y={y} width={CARD_WIDTH} height={CARD_HEIGHT} stroke={color} strokeWidth={HL_WIDTH} />
          <image {...{className, href, x, y, width, onMouseOver, onMouseOut, onClick}} />
        </g>
        :
        <image {...{className, href, x, y, width, onMouseOver, onMouseOut, onClick}} />
      }
    </>
  );
}
