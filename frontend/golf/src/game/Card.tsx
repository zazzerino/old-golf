import React from 'react';

export const CARD_WIDTH = 60;
export const CARD_HEIGHT = 84;

const HL_WIDTH = 2;

function cardPath(name: string): string {
  return `img/cards/${name}.svg`;
}

interface CardProps {
  id?: string;
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
  const { id, name, x, y, highlight, onMouseOver, onMouseOut, onClick } = props;
  const className = 'Card' + (highlight ? ' highlight' : '');
  const href = cardPath(name);
  const width = props.scale || '10%';
  const color = props.color || 'lime';

  return (
    <image {...{ id, className, href, x, y, width, onMouseOver, onMouseOut, onClick }} />
  );
}
