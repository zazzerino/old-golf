import React, { Dispatch, SetStateAction } from 'react';
import { Game, User } from '../types';
import { sendTakeFromTable } from '../websocket';
import { Card, CARD_HEIGHT } from './Card';

export function tableCardClicked(user: User, game: Game) {
  const isPlayable = game.playerTurn === user.id
    && (game.stateType === 'TAKE' || game.stateType === 'FINAL_TAKE');

  if (isPlayable) {
    sendTakeFromTable(game.id, user.id);
  }
}

function shouldHighlight(user: User, game: Game, hoverCard: string | null): boolean {
  const playableCards = game.playableCards[user.id];

  return hoverCard === 'TABLE' &&
    playableCards.includes('TABLE') &&
    game.playerTurn === user.id;
}

interface TableCardProps {
  user: User;
  game: Game;
  name: string;
  width: number;
  height: number;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function TableCard(props: TableCardProps) {
  const { user, game, name, width, height, hoverCard, setHoverCard } = props;
  const x = width / 2 + 2;
  const y = height / 2 - CARD_HEIGHT / 2;
  const highlight = shouldHighlight(user, game, hoverCard);
  const onMouseOver = () => setHoverCard('TABLE');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => tableCardClicked(user, game);

  return (
    <Card {...{ name, x, y, highlight, onClick, onMouseOver, onMouseOut }} />
  );
}
