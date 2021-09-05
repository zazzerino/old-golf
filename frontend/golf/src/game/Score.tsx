import React from 'react';
import { HandPosition } from '../types';
import { CARD_HEIGHT, CARD_WIDTH } from './Card';
import { HAND_PADDING } from './Hand';

function scoreCoord(width: number, height: number, pos: HandPosition) {
  let x = 0;
  let y = 0;

  switch (pos) {
    case 'BOTTOM':
      x = -CARD_WIDTH * 3;
      y = height / 2 - CARD_HEIGHT - HAND_PADDING * 4;
      break;
    case 'LEFT':
      x = -(width / 2) + CARD_HEIGHT + HAND_PADDING * 4;
      y = -CARD_WIDTH * 2.4;
      break;
    case 'TOP':
      x = CARD_WIDTH * 3;
      y = -height / 2 + CARD_HEIGHT + HAND_PADDING * 4;
      break;
    case 'RIGHT':
      x = width / 2 - CARD_HEIGHT - HAND_PADDING * 4;
      y = -CARD_WIDTH * 2.4;
      break;
  }

  return { x, y };
}

interface ScoreProps {
  width: number;
  height: number;
  score: number;
  pos: HandPosition;
  playerName: string;
  hoverPos: HandPosition | null;
}

export function Score(props: ScoreProps) {
  const { width, height, score, pos, playerName, hoverPos } = props;
  const { x, y } = scoreCoord(width, height, pos);
  const rw = width * 0.25;
  const rh = height * 0.15;
  const rx = x - rw / 2;
  const ry = y - rh / 2;
  const display = pos === hoverPos ? 'block' : 'none';

  if (score == null) {
    return null;
  }

  return (
    <g className="ScoreDisplay" style={{display}}>
      <rect x={rx} y={ry} width={rw} height={rh} />
      <text x={x} y={y - 10} dominantBaseline="middle">
        Name: {playerName}
      </text>
      <text x={x} y={y + 12} dominantBaseline="middle">
        Score: {score}
      </text>
    </g>
  );
}
