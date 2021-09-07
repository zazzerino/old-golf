import React, { Dispatch, SetStateAction } from 'react';
import { Event, Player, StateType } from '../types';
import { HeldCard } from './HeldCard';

interface HeldCardsProps {
  userId: number;
  gameId: number;
  width: number;
  height: number;
  players: Player[]
  playerTurn: number;
  stateType: StateType;
  events: Event[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function HeldCards(props: HeldCardsProps) {
  return (
    <>
      {props.players.map((player, key) => {
        const playerId = player.id;
        const pos = player.handPosition;
        const name = player.heldCard;

        if (name == null) {
          return null;
        }

        return <HeldCard {...{ ...props, key, playerId, name, pos }} />
      })}
    </>
  );
}
