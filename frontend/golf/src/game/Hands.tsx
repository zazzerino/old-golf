import React, { Dispatch, SetStateAction } from 'react';
import { CardLocation, HandPosition, Player, StateType } from '../types';
import { Hand } from './Hand';

interface HandsProps {
  userId: number;
  gameId: number;
  width: number;
  height: number;
  stateType: StateType;
  players: Player[];
  playerTurn: number;
  playableCards: CardLocation[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
  hoverPos: HandPosition | null;
  setHoverPos: Dispatch<SetStateAction<HandPosition | null>>;
}

export function Hands(props: HandsProps) {
  return (
    <>
      {props.players.map((player, key) => {
        const { id: playerId, handPosition: pos, cards, uncoveredCards } = player;
        return <Hand {...{ ...props, key, playerId, pos, cards, uncoveredCards }} />
      })}
    </>
  );
}
