import React, { Dispatch, SetStateAction } from 'react';
import { Game, User } from '../types';
import { sendDiscard } from '../websocket';
import { Card, CARD_HEIGHT, CARD_WIDTH } from './Card';
import { HandPosition, HAND_PADDING } from './Hand';

export function heldCardClicked(user: User, game: Game) {
  const isPlayable = user.id === game.playerTurn
    && ['DISCARD', 'FINAL_DISCARD'].includes(game.stateType);

  if (isPlayable) {
    sendDiscard(game.id, user.id);
  }
}

function heldCardCoord(pos: HandPosition, width: number, height: number) {
  let x: number;
  let y: number;
  let rotate = 0;

  switch (pos) {
    case 'BOTTOM':
      x = width * 0.6;
      y = height - CARD_HEIGHT * 1.5 - HAND_PADDING * 5;
      break;
    case 'LEFT':
      x = CARD_HEIGHT * 1.5 + HAND_PADDING * 6;
      y = CARD_HEIGHT * 3 + CARD_WIDTH;
      rotate = 90;
      break;
    case 'TOP':
      x = width * 0.4 - CARD_WIDTH;
      y = CARD_WIDTH - HAND_PADDING * 5;
      break;
    case 'RIGHT':
      x = width - CARD_WIDTH + HAND_PADDING * 4;
      y = CARD_HEIGHT * 2 - CARD_WIDTH / 1.5;
      rotate = 90;
      break;
  }

  return `translate(${x},${y}), rotate(${rotate})`;
}

interface HeldCardProps {
  user: User;
  game: Game;
  name: string;
  width: number;
  height: number;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
  pos: HandPosition;
  playerId: number;
}

export function HeldCard(props: HeldCardProps) {
  const { user, game, width, height, hoverCard, setHoverCard, pos, playerId } = props;
  const className = 'HeldCard ' + pos.toLowerCase();
  const name = pos === 'BOTTOM' ? props.name : '2B'; // only show the card face to the player holding it
  const transform = heldCardCoord(pos, width, height);
  const highlight = user.id === playerId && hoverCard === 'HELD';
  const onMouseOver = () => setHoverCard('HELD');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => heldCardClicked(user, game);

  return (
    <Card {...{ className, transform, name, highlight, onClick, onMouseOver, onMouseOut }} />
  );
}
