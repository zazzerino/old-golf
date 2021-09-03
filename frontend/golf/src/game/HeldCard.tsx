import React, { Dispatch, SetStateAction } from 'react';
import { Game, User } from '../types';
import { sendDiscard } from '../websocket';
import { Card, CARD_HEIGHT } from './Card';

export function heldCardClicked(user: User, game: Game) {
  const isPlayable = user.id === game.playerTurn
    && ['DISCARD', 'FINAL_DISCARD'].includes(game.stateType);

  if (isPlayable) {
    sendDiscard(game.id, user.id);
  }
}

const RIGHT_OFFSET = 8;

interface HeldCardProps {
  user: User;
  game: Game;
  name: string;
  width: number;
  height: number;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function HeldCard(props: HeldCardProps) {
  const { user, game, width, height, name, hoverCard, setHoverCard } = props;
  const x = width * 0.75;
  const y = height - CARD_HEIGHT * 1.5 - RIGHT_OFFSET;
  const highlight = hoverCard === 'HELD';
  const onMouseOver = () => setHoverCard('HELD');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => heldCardClicked(user, game);

  return (
    <Card {...{x, y, name, highlight, onClick, onMouseOver, onMouseOut}} />
  );
}
