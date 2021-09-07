import React, { Dispatch, SetStateAction } from 'react';
import { CardLocation, StateType } from '../types';
import { animateFrom } from '../util';
import { sendTakeFromDeck } from '../websocket';
import { Card, CARD_WIDTH } from './Card';

function deckCardClicked(context: { gameId: number, userId: number, playerTurn: number, stateType: StateType }) {
  const { userId, gameId, playerTurn, stateType } = context;

  const isPlayable = playerTurn === userId
    && ['TAKE', 'FINAL_TAKE'].includes(stateType);

  if (isPlayable) {
    sendTakeFromDeck(gameId, userId);
  }
}

function shouldHighlight(
  context: { userId: number, playableCards: CardLocation[], playerTurn: number, hoverCard: string | null }
): boolean {
  const { userId, hoverCard, playableCards, playerTurn } = context;

  const isHovered = hoverCard === 'DECK';
  const isPlayable = playableCards.includes('DECK');
  const isPlayersTurn = playerTurn === userId;

  return isHovered && isPlayable && isPlayersTurn;
}

interface DeckProps {
  userId: number;
  gameId: number;
  width: number;
  height: number;
  stateType: StateType;
  playableCards: CardLocation[];
  playerTurn: number;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function Deck(props: DeckProps) {
  const { gameId, userId, height, stateType, playableCards, playerTurn, hoverCard, setHoverCard } = props;
  const className = 'Deck';
  const name = '2B';
  const x = stateType === 'INIT' ? 0 : -CARD_WIDTH / 2 - 2;
  const y = 0;
  const highlight = shouldHighlight({ userId, playableCards, playerTurn, hoverCard });
  const onMouseOver = () => setHoverCard('DECK');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => deckCardClicked({ userId, gameId, playerTurn, stateType});
  const ref = React.useRef<SVGImageElement>(null);

  React.useLayoutEffect(() => {
    const img = ref.current;

    if (img && stateType === 'INIT') {
      animateFrom(img, { y: -height/2 });
    }
  }, [height, stateType, gameId]);

  return <Card {...{ ref, className, name, x, y, highlight, onMouseOver, onMouseOut, onClick }} />;
}
