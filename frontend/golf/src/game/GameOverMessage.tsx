import React from 'react';

export function GameOverMessage(props: { width: number, height: number }) {
  const { width, height } = props;
  const x = width / 2;
  const y = height / 2;
  const rw = width / 2;
  const rh = height / 4;
  const rx = x - rw / 2;
  const ry = y - rh / 2;

  return (
    <g className="GameOverMessage">
      <rect x={rx} y={ry} width={rw} height={rh} />
      <text x={x} y={y} dominantBaseline="middle">
        Game Over
      </text>
    </g>
  );
}
