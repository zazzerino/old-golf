import React, { Dispatch, SetStateAction } from 'react';
import { HandPosition, StateType } from '../types';
import { animateFrom } from '../util';
import { sendDiscard } from '../websocket';
import { Card, CARD_HEIGHT, CARD_WIDTH } from './Card';
import { HAND_PADDING } from './Hand';

export function heldCardClicked(context: { userId: number, gameId: number, playerTurn: number, stateType: StateType }) {
  const { userId, gameId, playerTurn, stateType } = context;

  const isPlayable = userId === playerTurn
    && ['DISCARD', 'FINAL_DISCARD'].includes(stateType);

  if (isPlayable) {
    sendDiscard(gameId, userId);
  }
}

function heldCardCoord(pos: HandPosition, width: number, height: number) {
  let x: number;
  let y: number;
  let rotate = 0;

  switch (pos) {
    case 'BOTTOM':
      x = CARD_WIDTH * 1.5;
      y = height / 2 - CARD_HEIGHT - HAND_PADDING * 4;
      break;
    case 'LEFT':
      x = -width / 2 + CARD_HEIGHT + HAND_PADDING * 4;
      y = CARD_WIDTH * 1.5 + HAND_PADDING * 4;
      rotate = 90;
      break;
    case 'TOP':
      x = -CARD_WIDTH * 1.5;
      y = -height / 2 + CARD_HEIGHT + HAND_PADDING * 4;
      break;
    case 'RIGHT':
      x = width / 2 - CARD_HEIGHT - HAND_PADDING * 4;
      y = -CARD_WIDTH * 1.5 - HAND_PADDING * 4;
      rotate = 90;
      break;
  }

  return { x, y, rotate };
}

function distanceFromTableCard(pos: HandPosition) {
  let x: number;
  let y: number;

  switch (pos) {
    case 'BOTTOM':
      x = -58;
      y = -156;
      break;
    case 'TOP':
      x = 58 + CARD_WIDTH;
      y = 156;
      break;
    case 'LEFT':
      x = 240;
      y = -98;
      break;
    case 'RIGHT':
      x = -240;
      y = 98;
  }

  return { x, y };
}

interface HeldCardProps {
  userId: number;
  gameId: number;
  name: string;
  width: number;
  height: number;
  pos: HandPosition;
  playerId: number;
  playerTurn: number;
  stateType: StateType;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function HeldCard(props: HeldCardProps) {
  const { userId, gameId, width, height, pos, playerId, playerTurn, stateType, hoverCard, setHoverCard } = props;
  const className = 'HeldCard ' + pos.toLowerCase();
  const name = pos === 'BOTTOM' ? props.name : '2B'; // only show the card face to the player holding it
  const { x, y, rotate } = heldCardCoord(pos, width, height);
  const highlight = userId === playerId && hoverCard === 'HELD';
  const onMouseOver = () => setHoverCard('HELD');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => heldCardClicked({ userId, gameId, playerTurn, stateType });
  const ref = React.useRef<SVGImageElement>(null);

  React.useLayoutEffect(() => {
    const img = ref.current;

    if (img) {
      const { x, y } = distanceFromTableCard(pos);
      animateFrom(img, { x, y });
    }
  }, [name, pos]);

  return (
    <Card {...{ ref, className, x, y, rotate, name, highlight, onClick, onMouseOver, onMouseOut }} />
  );
}
