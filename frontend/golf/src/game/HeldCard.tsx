import React, { Dispatch, SetStateAction } from 'react';
import { Game, User } from '../types';
import { sendDiscard } from '../websocket';
import { Card, CARD_HEIGHT } from './Card';

export function heldCardClicked(user: User, game: Game) {
  const isPlayable = game.playerTurn === user.id
    && (game.stateType === 'DISCARD' || game.stateType === 'FINAL_DISCARD');

  if (isPlayable) {
    sendDiscard(game.id, user.id);
  }
}

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
  const y = height - CARD_HEIGHT * 1.5 - 8;
  const highlight = hoverCard === 'HELD';
  const onMouseOver = () => setHoverCard('HELD');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => heldCardClicked(user, game);

  return (
    <Card {...{x, y, name, highlight, onClick, onMouseOver, onMouseOut}} />
  );
}
