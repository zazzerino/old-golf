import React from 'react';
import { CARD_HEIGHT } from './Card';

export function ScoreDisplay(props: { width: number, height: number, score?: number }) {
  const { width, height, score } = props;
  const x = width / 7;
  const y = height - CARD_HEIGHT;

  if (score == null) {
    return null;
  }

  return (
    <text className="ScoreDisplay" x={x} y={y}>
      Score: {score}
    </text>
  );
}
