import React, { Dispatch, SetStateAction } from 'react';
import { Game, User } from '../types';
import { sendTakeFromDeck } from '../websocket';
import { Card, CARD_WIDTH, CARD_HEIGHT } from './Card';

function deckCardClicked(user: User, game: Game) {
  const isPlayable = game.playerTurn === user.id
    && ['TAKE', 'FINAL_TAKE'].includes(game.stateType);

  if (isPlayable) {
    sendTakeFromDeck(game.id, user.id);
  }
}

function shouldHighlight(user: User, game: Game, hoverCard: string | null): boolean {
  const playableCards = game.playableCards[user.id];
  const isHovered = hoverCard === 'DECK';
  const isPlayable = playableCards.includes('DECK');
  const isPlayersTurn = game.playerTurn === user.id;;

  return isHovered && isPlayable && isPlayersTurn;
}

interface DeckProps {
  user: User;
  game: Game;
  width: number;
  height: number;
  hasStarted: boolean;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function Deck(props: DeckProps) {
  const { game, user, width, height, hasStarted, hoverCard, setHoverCard } = props;
  const className = 'Deck' + (game.stateType === 'INIT' ? ' slide-in' : '');
  const name = '2B';
  const offset = hasStarted ? CARD_WIDTH : CARD_WIDTH / 2;
  const x = width / 2 - offset - 2;
  const y = height / 2 - CARD_HEIGHT / 2;
  const highlight = shouldHighlight(user, game, hoverCard);
  const onMouseOver = () => setHoverCard('DECK');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => deckCardClicked(user, game);

  return <Card {...{ className, name, x, y, highlight, onMouseOver, onMouseOut, onClick }} />;
}
