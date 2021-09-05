import React, { Dispatch, SetStateAction } from 'react';
import { Event, HandPosition, Player, StateType } from '../types';
import { HeldCard } from './HeldCard';

interface HeldCardsProps {
  userId: number;
  gameId: number;
  width: number;
  height: number;
  positions: HandPosition[],
  order: number[],
  players: Player[]
  playerTurn: number;
  stateType: StateType;
  events: Event[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function HeldCards(props: HeldCardsProps) {
  const { positions, order, players } = props;

  return (
    <>
      {positions.map((pos, key) => {
        const playerId = order[key];
        const player = players.find(p => p.id === playerId);

        if (player == null) {
          console.error(`player ${playerId} not found...`);
          return null;
        }

        const heldCard = player.heldCard;

        if (heldCard == null) {
          return null;
        }

        return <HeldCard {...{ ...props, key, name: heldCard, pos, playerId }} />
      })}
    </>
  );
}
