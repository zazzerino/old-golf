import React from 'react';
import { app, draw } from './pixi';

function empty(elem: Element) {
  while (elem.firstChild) {
    elem.firstChild.remove();
  }
}

export function GameCanvas() {
  const className = 'GameCanvas';
  const canvasRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const elem = canvasRef.current;

    if (elem) {
      app.loader.load(() => draw(elem, app));
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
