import React, { forwardRef } from 'react';

export const CARD_WIDTH = 60;
export const CARD_HEIGHT = 84;

function cardPath(name: string): string {
  return `img/cards/${name}.svg`;
}

interface CardProps {
  name: string;
  x: number;
  y: number;
  id?: string;
  className?: string;
  rotate?: number;
  scale?: string;
  highlight?: boolean;
  onMouseOver?: () => any;
  onMouseOut?: () => any;
  onClick?: () => any;
}

export const Card = forwardRef<SVGImageElement, CardProps>((props, ref) => {
  const { id, name, highlight, onMouseOver, onMouseOut, onClick } = props;
  const className = 'Card' + (highlight ? ' highlight' : '') + (props.className ? ' ' + props.className : '');
  const href = cardPath(name);
  const width = props.scale || '10%';
  const x = props.x - CARD_WIDTH / 2;
  const y = props.y - CARD_HEIGHT / 2;
  const rotate = props.rotate || 0;
  const transform = `rotate(${rotate})`;

  if (name == null) {
    return null;
  }

  return <image {...{ ref, id, className, href, x, y, width, onMouseOver, onMouseOut, onClick, transform }} />;
});
