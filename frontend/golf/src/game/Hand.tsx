import React, { Dispatch, SetStateAction, useRef } from 'react';
import { CardLocation, HandPosition, PlayableCards, StateType } from '../types';
import { sendSwapCard, sendUncover } from '../websocket';
import { Card, CARD_HEIGHT, CARD_WIDTH } from './Card';

export const HAND_PADDING = 2;

function handTransform(width: number, height: number, pos: HandPosition): string {
  let x: number;
  let y: number;
  let rotate: number;

  switch (pos) {
    case 'BOTTOM':
      x = 0
      y = height / 2 - CARD_HEIGHT - HAND_PADDING * 4;
      rotate = 0;
      break;
    case 'LEFT':
      x = -(width / 2) + CARD_HEIGHT + HAND_PADDING * 4;
      y = 0;
      rotate = 90;
      break;
    case 'TOP':
      x = 0;
      y = -(height / 2) + CARD_HEIGHT + HAND_PADDING * 4;
      rotate = 180;
      break;
    case 'RIGHT':
      x = width / 2 - CARD_HEIGHT - HAND_PADDING * 4;
      y = 0;
      rotate = 270;
      break;
  }

  return `translate(${x},${y}), rotate(${rotate})`;
}

function shouldHighlight(context: { userId: number, playerId: number, stateType: StateType, playerTurn: number, playableCards: PlayableCards, uncoveredCards: number[], hoverCard: string | null, pos: HandPosition, key: number }) {
  const { userId, playerId, pos, key: index, stateType, uncoveredCards, playerTurn, hoverCard } = context;
  if (userId !== playerId) {
    return false;
  }

  const location = 'H' + index as CardLocation;
  const name = pos + '-' + location; // e.g. 'LEFT-H5'
  const cards = context.playableCards[userId];

  const isHovered = hoverCard === name;
  const isPlayable = cards.includes(location);
  const isCoveredOrDiscard = !uncoveredCards?.includes(index) || stateType === 'DISCARD';
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
  playableCards: PlayableCards;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function Hand(props: HandProps) {
  const { userId, gameId, playerId, pos, cards, width, height, stateType, playerTurn, uncoveredCards, playableCards, hoverCard, setHoverCard } = props;
  const transform = handTransform(width, height, pos);
  const ref = useRef<SVGGElement>(null);
  
  let className = 'Hand';
  if (playerId === playerTurn) {
    className += ' outline';
  }

  return (
    <g className={className} ref={ref} transform={transform}>
      {cards.map((card, key) => {
        const className = `${pos}-H${key}`;
        const name = uncoveredCards.includes(key) ? card : '2B';
        const xOffset = key % 3; // the x coords of cards 0-2 are the same as cards 3-5
        const x = CARD_WIDTH * xOffset + HAND_PADDING * xOffset - CARD_WIDTH;
        const y = (key < 3 ? 0 : CARD_HEIGHT + HAND_PADDING) - CARD_HEIGHT / 2;
        const highlight = shouldHighlight({ userId, playerId, stateType, uncoveredCards, playerTurn, key, pos, playableCards, hoverCard });
        const location = `${pos}-H${key}`; // e.g. 'BOTTOM-H0' (the 1st card in the bottom hand)
        const onMouseOver = () => setHoverCard(location);
        const onMouseOut = () => setHoverCard(null);
        const onClick = () => handClicked({ userId, gameId, playerId, stateType, playerTurn, key });
        return <Card {...{ key, className, name, x, y, highlight, onMouseOver, onMouseOut, onClick }} />;
      })}
    </g>
  );
}
