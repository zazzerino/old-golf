import React from 'react';
import { HandPosition, Player } from '../types';
import { Score } from './Score';

interface ScoresProps {
  width: number;
  height: number;
  positions: HandPosition[];
  order: number[];
  players: Player[];
  hoverPos: HandPosition | null;
}

export function Scores(props: ScoresProps) {
  const { width, height, players, positions, order, hoverPos } = props;

  return (
    <>
      {positions.map((pos, key) => {
        const playerId = order[key];
        const player = players.find(p => p.id === playerId);

        if (player == null) {
          return null;
        }

        const score = player.hand.visibleScore;
        const playerName = player.name;
        return <Score {...{ key, width, height, pos, score, playerName, hoverPos }} />
      })}
    </>
  );
}
