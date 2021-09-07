import React, { Dispatch, SetStateAction } from 'react';
import { Event, HandPosition, StateType } from '../types';
import { animateFrom } from '../util';
import { sendDiscard } from '../websocket';
import { Card, CARD_WIDTH } from './Card';
import { heldCardCoord } from './coords';

export function heldCardClicked(context: { userId: number, gameId: number, playerTurn: number, stateType: StateType }) {
  const { userId, gameId, playerTurn, stateType } = context;

  const isPlayable = userId === playerTurn
    && ['DISCARD', 'FINAL_DISCARD'].includes(stateType);

  if (isPlayable) {
    sendDiscard(gameId, userId);
  }
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

function distanceFromDeck(pos: HandPosition) {
  let x: number;
  let y: number;

  switch (pos) {
    case 'BOTTOM':
      x = -122;
      y = -158;
      break;
    case 'TOP':
      x = 122 - CARD_WIDTH;
      y = 158;
      break;
    case 'LEFT':
      x = 240 - CARD_WIDTH;
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
  events: Event[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function HeldCard(props: HeldCardProps) {
  const { userId, gameId, width, height, pos, playerId, playerTurn, stateType, events, hoverCard, setHoverCard } = props;
  const className = 'HeldCard ' + pos.toLowerCase();
  const name = pos === 'BOTTOM' ? props.name : '2B'; // only show the card face to the player holding it
  const { x, y, rotate } = heldCardCoord(width, height, pos);
  const highlight = userId === playerId && hoverCard === 'HELD';
  const onMouseOver = () => setHoverCard('HELD');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => heldCardClicked({ userId, gameId, playerTurn, stateType });
  const ref = React.useRef<SVGImageElement>(null);

  React.useLayoutEffect(() => {
    const img = ref.current;

    if (img) {
      const lastEvent = events.slice(-1).pop();

      if (lastEvent?.type === 'TAKE_FROM_DECK') {
        const coord = distanceFromDeck(pos);
        animateFrom(img, coord);
      } else if (lastEvent?.type === 'TAKE_FROM_TABLE') {
        const coord = distanceFromTableCard(pos);
        animateFrom(img, coord);
      }
    }
  }, [name, pos, events]);

  return (
    <Card {...{ ref, className, x, y, rotate, name, highlight, onClick, onMouseOver, onMouseOut }} />
  );
}
