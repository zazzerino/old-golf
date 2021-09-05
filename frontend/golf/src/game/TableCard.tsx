import React, { Dispatch, SetStateAction } from 'react';
import { PlayableCards, StateType } from '../types';
import { sendTakeFromTable } from '../websocket';
import { Card, CARD_WIDTH } from './Card';

export const TABLE_CARD_COORD = {
  x: CARD_WIDTH / 2 + 2,
  y: 0
};

export function tableCardClicked(context: { userId: number, gameId: number, playerTurn: number, stateType: StateType }) {
  const { userId, gameId, stateType, playerTurn } = context;

  const isPlayable = playerTurn === userId
    && ['TAKE', 'FINAL_TAKE'].includes(stateType);

  if (isPlayable) {
    sendTakeFromTable(gameId, userId);
  }
}

function shouldHighlight(context: { userId: number, playerTurn: number, playableCards: PlayableCards, hoverCard: string | null }): boolean {
  const { userId, playableCards, playerTurn, hoverCard } = context;
  const cards = playableCards[userId];

  const isHovered = hoverCard === 'TABLE';
  const isPlayable = cards.includes('TABLE');
  const isUsersTurn = userId === playerTurn;

  return isHovered && isPlayable && isUsersTurn;
}

interface TableCardProps {
  userId: number;
  gameId: number;
  tableCard: string;
  stateType: StateType;
  playerTurn: number;
  playableCards: PlayableCards;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function TableCard(props: TableCardProps) {
  const { userId, gameId, tableCard, stateType, playerTurn, playableCards, hoverCard, setHoverCard } = props;

  if (tableCard == null) {
    return null;
  }

  const className = 'TableCard';
  const { x, y } = TABLE_CARD_COORD;
  const highlight = shouldHighlight({ userId, playerTurn, playableCards, hoverCard });
  const onMouseOver = () => setHoverCard('TABLE');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => tableCardClicked({ userId, gameId, playerTurn, stateType });

  return (
    <Card {...{ className, name: tableCard, x, y, highlight, onClick, onMouseOver, onMouseOut }} />
  );
}
