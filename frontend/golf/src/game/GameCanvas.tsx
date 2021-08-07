import React from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentGame } from './gameSlice';
import { app, draw } from './pixi';

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

export function GameCanvas() {
  const className = 'GameCanvas';
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const game = useAppSelector(selectCurrentGame);

  React.useEffect(() => {
    const elem = canvasRef.current;

    if (elem && game) {
      app.loader.load(() => draw(game, elem, app));
    }

    return () => {
      if (elem) {
        empty(elem);
      }
    }
  });

  return (
    <div className={className}>
      <div ref={canvasRef} />
    </div>
  );
}
