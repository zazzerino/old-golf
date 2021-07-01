import React from 'react';
import { app, draw } from './pixi';

function removeChildren(elem: Element) {
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
      if (elem?.children) {
        removeChildren(elem);
      }

      app.loader.load(() => draw(elem, app));
    }
  });

  return (
    <div className={className}>
      <div ref={canvasRef} />
    </div>
  );
}
