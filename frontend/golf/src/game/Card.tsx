import React from 'react';

export const CARD_WIDTH = 60;
export const CARD_HEIGHT = 84;

function cardPath(name: string): string {
  return `img/cards/${name}.svg`;
}

interface CardProps {
  name: string;
  x?: number;
  y?: number;
  id?: string;
  className?: string;
  scale?: string;
  highlight?: boolean;
  onMouseOver?: () => any;
  onMouseOut?: () => any;
  onClick?: () => any;
  transform?: string;
}

export function Card(props: CardProps) {
  const { id, name, x, y, highlight, onMouseOver, onMouseOut, onClick, transform } = props;
  const className = 'Card' + (highlight ? ' highlight' : '') + (props.className ? ' ' + props.className : '');
  const href = cardPath(name);
  const width = props.scale || '10%';

  if (name == null) {
    return null;
  }

  return (
    <image {...{ id, className, href, x, y, width, onMouseOver, onMouseOut, onClick, transform }} />
  );
}
