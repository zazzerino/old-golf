import React from 'react';
import { HandPosition, Player } from '../types';
import { Score } from './Score';

interface ScoresProps {
  width: number;
  height: number;
  players: Player[];
  hoverPos: HandPosition | null;
}

export function Scores(props: ScoresProps) {
  return (
    <>
      {props.players.map((player, key) => {
        const { score, name: playerName, handPosition: pos } = player;
        return <Score {...{ ...props, key, score, pos, playerName }} />
      })}
    </>
  );
}
