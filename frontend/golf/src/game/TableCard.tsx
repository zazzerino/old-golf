import React, { Dispatch, SetStateAction } from 'react';
import { CardLocation, Event, StateType } from '../types';
import { animateFrom } from '../util';
import { sendTakeFromTable } from '../websocket';
import { Card, CARD_WIDTH } from './Card';
import { heldCardCoord, TABLE_CARD_COORD } from './coords';

export function tableCardClicked(context: { userId: number, gameId: number, playerTurn: number, stateType: StateType }) {
  const { userId, gameId, stateType, playerTurn } = context;

  const isPlayable = playerTurn === userId
    && ['TAKE', 'FINAL_TAKE'].includes(stateType);

  if (isPlayable) {
    sendTakeFromTable(gameId, userId);
  }
}

function shouldHighlight(
  context: { userId: number, playerTurn: number, playableCards: CardLocation[], hoverCard: string | null }
): boolean {
  const { userId, playableCards, playerTurn, hoverCard } = context;

  const isHovered = hoverCard === 'TABLE';
  const isPlayable = playableCards.includes('TABLE');
  const isUsersTurn = userId === playerTurn;

  return isHovered && isPlayable && isUsersTurn;
}

interface TableCardProps {
  userId: number;
  gameId: number;
  width: number;
  height: number;
  tableCards: string[];
  stateType: StateType;
  playerTurn: number;
  playableCards: CardLocation[];
  events: Event[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function TableCard(props: TableCardProps) {
  const { userId, gameId, width, height, tableCards, stateType, playerTurn, playableCards, events, hoverCard, setHoverCard } = props;
  const ref = React.useRef<SVGImageElement>(null);
  const className = 'TableCard';
  const name = tableCards[0];
  const { x, y } = TABLE_CARD_COORD;
  const highlight = shouldHighlight({ userId, playerTurn, playableCards, hoverCard });
  const onMouseOver = () => setHoverCard('TABLE');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => tableCardClicked({ userId, gameId, playerTurn, stateType });

  React.useLayoutEffect(() => {
    const img = ref.current;

    if (img) {
      const lastEvent = events.slice(-1).pop();
      if (lastEvent?.type === 'DISCARD') {
        let { x, y } = heldCardCoord(width, height, 'BOTTOM');
        x -= CARD_WIDTH / 2;
        animateFrom(img, { x, y });
      }
    }
  }, [width, height, events]);

  if (name == null) {
    return null;
  }

  return (
    <Card {...{ className, ref, name, x, y, highlight, onClick, onMouseOver, onMouseOut }} />
  );
}
