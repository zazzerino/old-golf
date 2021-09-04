import React, { Dispatch, SetStateAction } from 'react';
import { CardLocation, Game, User } from '../types';
import { sendSwapCard, sendUncover } from '../websocket';
import { Card, CARD_HEIGHT, CARD_WIDTH } from './Card';

export const HAND_PADDING = 2;

export type HandPosition = 'BOTTOM' | 'LEFT' | 'TOP' | 'RIGHT';

function handTransform(pos: HandPosition, width: number, height: number): string {
  let x: number;
  let y: number;
  let rotate: number;

  switch (pos) {
    case 'BOTTOM':
      x = width / 2 - CARD_WIDTH * 1.5 - HAND_PADDING * 2;
      y = height - CARD_HEIGHT * 2 - HAND_PADDING * 6;
      rotate = 0;
      break;
    case 'LEFT':
      x = CARD_HEIGHT * 2 + HAND_PADDING * 6;
      y = height / 2 - CARD_WIDTH * 1.5;
      rotate = 90;
      break;
    case 'TOP':
      x = width / 2 + CARD_WIDTH * 1.5 + HAND_PADDING * 2;
      y = CARD_HEIGHT * 2 + HAND_PADDING * 6;
      rotate = 180;
      break;
    case 'RIGHT':
      x = width - CARD_HEIGHT * 2 - HAND_PADDING * 6;
      y = height / 2 + CARD_WIDTH * 1.5;
      rotate = 270;
      break;
  }

  return `translate(${x},${y}), rotate(${rotate})`;
}

function shouldHighlight(user: User, game: Game, playerId: number, hoverCard: string | null, pos: HandPosition, i: number) {
  if (user.id !== playerId) {
    return false;
  }

  const location = 'H' + i as CardLocation;
  const name = pos + '-' + location;
  const playableCards = game.playableCards[user.id];
  const uncoveredCards = game.players.find(p => p.id === user.id)?.hand.uncoveredCards;

  const isHovered = hoverCard === name;
  const isPlayable = playableCards.includes(location);
  const isCovered = !uncoveredCards?.includes(i);
  const isPlayersTurn = game.playerTurn === user.id || game.stateType === 'UNCOVER_TWO';

  return isHovered && isPlayable && isCovered && isPlayersTurn;
}

export function handClicked(game: Game, user: User, i: number) {
  if (game.stateType === 'UNCOVER_TWO') {
    sendUncover(game.id, user.id, i);
  } else if (game.playerTurn === user.id) {
    switch (game.stateType) {
      case 'UNCOVER':
        sendUncover(game.id, user.id, i);
        break;
      case 'DISCARD':
      case 'FINAL_DISCARD':
        sendSwapCard(game.id, user.id, i);
        break;
    }
  }
}

interface HandProps {
  user: User;
  game: Game;
  playerId: number;
  width: number;
  height: number;
  pos: HandPosition;
  cards: string[];
  uncoveredCards: number[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function Hand(props: HandProps) {
  const { user, game, playerId, width, height, pos, cards, uncoveredCards, hoverCard, setHoverCard } = props;
  const isPlayersTurn = playerId === game.playerTurn || game.stateType === 'UNCOVER_TWO';
  const className = 'Hand' + (isPlayersTurn ? ' outline' : '');
  const transform = handTransform(pos, width, height);

  return (
    <g
      className={className}
      transform={transform}
    >
      {cards.map((card, i) => {
        const name = uncoveredCards.includes(i) ? card : '2B';
        const offset = i % 3;
        const x = CARD_WIDTH * offset + HAND_PADDING * offset;
        const y = i < 3 ? 0 : CARD_HEIGHT + HAND_PADDING;
        const loc = `${pos}-H${i}`; // e.g. 'BOTTOM-H2' (the 3rd card in the bottom hand)
        const highlight = shouldHighlight(user, game, playerId, hoverCard, pos, i);
        const onMouseOver = () => setHoverCard(loc);
        const onMouseOut = () => setHoverCard(null);
        const onClick = () => handClicked(game, user, i);
        return <Card {...{ key: i, name, x, y, highlight, onMouseOver, onMouseOut, onClick }} />
      })}
    </g>
  );
}
