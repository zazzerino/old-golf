import React, { Dispatch, SetStateAction } from 'react';
import { CardLocation, Event, Player, StateType } from '../types';
import { animateFrom } from '../util';
import { sendTakeFromTable } from '../websocket';
import { Card, CARD_WIDTH } from './Card';
import { handCoord, heldCardCoord, TABLE_CARD_COORD } from './coords';

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
  players: Player[];
  playerTurn: number;
  playableCards: CardLocation[];
  events: Event[];
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
}

export function TableCard(props: TableCardProps) {
  const { userId, gameId, width, height, tableCards, stateType, players, playerTurn, playableCards, events, hoverCard, setHoverCard } = props;
  const ref = React.useRef<SVGImageElement>(null);
  const className = 'TableCard';
  const name = tableCards[0];
  const { x, y } = TABLE_CARD_COORD;
  const highlight = shouldHighlight({ userId, playerTurn, playableCards, hoverCard });
  const onMouseOver = () => setHoverCard('TABLE');
  const onMouseOut = () => setHoverCard(null);
  const onClick = () => tableCardClicked({ userId, gameId, playerTurn, stateType });
  const [animating, setAnimating] = React.useState(false);

  React.useLayoutEffect(() => {
    const img = ref.current;
    const event = events.slice(-1).pop();

    if (img && event) {
      // draw the second card in the deck, so it looks like it's underneath the first card while it's animating
      const pid = event.playerId;
      const player = players.find(p => p.id === pid)!;
      const pos = player.handPosition;

      if (event.type === 'DISCARD') {
        setAnimating(true);
        let { x, y } = heldCardCoord(width, height, pos);
        x -= CARD_WIDTH / 2;
        animateFrom(img, { x, y });
      } else if (event.type === 'SWAP_CARD') {
        setAnimating(true);
        let { x, y } = handCoord(width, height, pos);
        x -= CARD_WIDTH / 2;
        animateFrom(img, { x, y });
      } else if (animating) {
        setAnimating(false);
      }
    }
  }, [width, height, events]);

  if (name == null) {
    return null;
  }

  const secondCard = tableCards[1];

  return (
    <>
      {animating && secondCard && <Card {...{ name: secondCard, x, y }} />}
      <Card {...{ className, ref, name, x, y, highlight, onClick, onMouseOver, onMouseOut }} />
    </>
  );
}
