import React from 'react';
import { CARD_HEIGHT, CARD_WIDTH } from './Card';

export function ScoreDisplay(props: { height: number, score?: number }) {
  const { height, score } = props;
  const x = -CARD_WIDTH * 3;
  const y = height / 2 - CARD_HEIGHT / 2;

  if (score == null) {
    return null;
  }

  return (
    <text className="ScoreDisplay" x={x} y={y}>
      Score: {score}
    </text>
  );
}
