import React, { Dispatch, SetStateAction } from 'react';
import { CardLocation, Event, HandPosition, StateType } from '../types';
import { sendSwapCard, sendUncover } from '../websocket';
import { Card, CARD_HEIGHT, CARD_WIDTH } from './Card';
import { handCoord } from './coords';

export const HAND_PADDING = 2;

function handTransform(width: number, height: number, pos: HandPosition) {
  const { x, y, rotate }= handCoord(width, height, pos);
  return `translate(${x}, ${y}), rotate(${rotate})`;
}

function shouldHighlight(
  context: { userId: number, playerId: number, stateType: StateType, playerTurn: number, playableCards: CardLocation[], uncoveredCards: number[], hoverCard: string | null, pos: HandPosition, key: number }
) {
  const { userId, playerId, pos, key, stateType, playableCards, uncoveredCards, playerTurn, hoverCard } = context;

  if (userId !== playerId) {
    return false;
  }

  const location = 'H' + key as CardLocation;
  const name = pos + '-' + location; // e.g. 'LEFT-H5'
  const isHovered = hoverCard === name;
  const isPlayable = playableCards.includes(location);
  const isCoveredOrDiscard = !uncoveredCards?.includes(key) || stateType === 'DISCARD';
  const isPlayersTurn = playerTurn === userId || stateType === 'UNCOVER_TWO';

  return isHovered && isPlayable && isCoveredOrDiscard && isPlayersTurn;
}

export function handClicked(context: { userId: number, gameId: number, playerId: number, stateType: StateType, playerTurn: number, key: number }) {
  const { userId, gameId, playerId, stateType, playerTurn, key } = context;

  if (userId !== playerId) return; // this prevents a user from clicking another player's cards

  if (stateType === 'UNCOVER_TWO') {
    sendUncover(gameId, userId, key);
  } else if (playerTurn === userId) {
    switch (stateType) {
      case 'UNCOVER':
        sendUncover(gameId, userId, key);
        break;
      case 'DISCARD':
      case 'FINAL_DISCARD':
        sendSwapCard(gameId, userId, key);
        break;
    }
  }
}

interface HandProps {
  userId: number;
  gameId: number;
  playerId: number;
  width: number;
  height: number;
  pos: HandPosition;
  cards: string[];
  uncoveredCards: number[];
  stateType: StateType;
  playerTurn: number;
  playableCards: CardLocation[];
  events: Event[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
  setHoverPos: Dispatch<SetStateAction<HandPosition | null>>;
}

export function Hand(props: HandProps) {
  const { userId, gameId, playerId, pos, cards, width, height, stateType, playerTurn, uncoveredCards, playableCards, hoverCard, setHoverCard, setHoverPos } = props;
  const transform = handTransform(width, height, pos);
  const shouldOutline = playerId === playerTurn || (stateType === 'UNCOVER_TWO' && uncoveredCards.length < 2);
  const onMouseOver = () => setHoverPos(pos);
  const onMouseOut = () => setHoverPos(null);

  let className = 'Hand';
  if (shouldOutline) {
    className += ' outline';
  }

  // the rect is needed to capture mouse events in between the cards
  const rectWidth = CARD_WIDTH * 3 + HAND_PADDING * 2;
  const rectHeight = CARD_HEIGHT * 2 + HAND_PADDING;
  const rectX = -rectWidth / 2 + 2;
  const rectY = -rectHeight / 2 + 2;
  const onRectOver = () => setHoverPos(pos);
  const onRectOut = () => setHoverPos(null);

  return (
    <g {...{ className, transform, onMouseOver, onMouseOut }}>
      <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} onMouseOver={onRectOver} onMouseOut={onRectOut} />
      {cards.map((card, key) => {
        const location = `${pos}-H${key}`; // e.g. 'BOTTOM-H0' (the 1st card in the bottom hand)
        const className = location + ' fade-in';
        const name = uncoveredCards.includes(key) ? card : '2B';
        const xOffset = key % 3; // the x coords of cards 0-2 are the same as cards 3-5
        const x = CARD_WIDTH * xOffset + HAND_PADDING * xOffset - CARD_WIDTH;
        const y = (key < 3 ? 0 : CARD_HEIGHT + HAND_PADDING) - CARD_HEIGHT / 2;
        const highlight = shouldHighlight({ userId, playerId, stateType, uncoveredCards, playerTurn, key, pos, playableCards, hoverCard });
        const onMouseOver = () => setHoverCard(location);
        const onMouseOut = () => setHoverCard(null);
        const onClick = () => handClicked({ userId, gameId, playerId, stateType, playerTurn, key });

        return <Card {...{ key, className, name, x, y, highlight, onMouseOver, onMouseOut, onClick }} />;
      })}
    </g>
  );
}
