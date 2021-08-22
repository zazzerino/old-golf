import React, { useRef } from 'react';
import { useAppSelector } from '../../hooks';
import { selectGame, selectUserId } from '../../store/select';
import { emptyElement } from '../../util';
import { drawGame } from '../draw';

function GameCanvas() {
  const ref = useRef<SVGSVGElement>(null);
  const size = { width: 600, height: 500 };
  const game = useAppSelector(selectGame);
  const userId = useAppSelector(selectUserId);

  React.useEffect(() => {
    const svg = ref.current;

    if (svg && game && (userId != null)) {
      drawGame({ svg, size, game, userId });
    }

    return () => { svg && emptyElement(svg) };
  });

  return (
    <svg
      className="GameCanvas"
      ref={ref}
      width={size.width}
      height={size.height}
      style={{ backgroundColor: "aliceblue" }}
    />
  )
}

export default GameCanvas;
