import React, { Dispatch, SetStateAction } from 'react';
import { HandPosition, PlayableCards, Player, StateType } from '../types';
import { Hand } from './Hand';

interface HandsProps {
  userId: number;
  gameId: number;
  width: number;
  height: number;
  stateType: StateType;
  positions: HandPosition[],
  order: number[],
  players: Player[]
  playerTurn: number;
  playableCards: PlayableCards;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function Hands(props: HandsProps) {
  const { userId, gameId, width, height, hoverCard, setHoverCard, positions, order, players, playerTurn, playableCards, stateType } = props;

  return (
    <>
      {positions.map((pos, key) => {
        const playerId = order[key];
        const player = players.find(p => p.id === playerId);

        if (player == null) {
          console.error(`player ${playerId} not found...`);
          return null;
        }

        const { cards, uncoveredCards } = player.hand;
        return <Hand {...{ key, userId, gameId, playerId, width, height, stateType, pos, playableCards, playerTurn, cards, uncoveredCards, hoverCard, setHoverCard }} />;
      })}
    </>
  );
}
