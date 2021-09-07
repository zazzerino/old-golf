import React, { useState } from 'react';
import { Deck } from './Deck';
import { TableCard } from './TableCard';
import { Game, HandPosition } from '../types';
import { GameOverMessage } from './GameOverMessage';
import { Hands } from './Hands';
import { HeldCards } from './HeldCards';
import { Scores } from './Scores';

interface GameCanvasProps {
  game?: Game;
}

export function GameCanvas(props: GameCanvasProps) {
  const { game } = props;
  const className = 'GameCanvas';
  const width = 600;
  const height = 500;
  const viewBox = `${-width / 2} ${-height / 2} ${width} ${height}`;
  const [hoverCard, setHoverCard] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<HandPosition | null>(null);

  // if there's no game, draw an empty svg
  if (game == null) {
    return <svg {...{ className, viewBox, width, height }} />
  }

  const { id: gameId, stateType, tableCards, players } = game;
  const tableCard = tableCards[0];
  const hasStarted = stateType !== 'INIT';
  const isOver = stateType === 'GAME_OVER';

  return (
    <svg {...{ className, viewBox, width, height }}>
      <Deck {...{ ...game, gameId, width, height, hoverCard, setHoverCard }} />
      {hasStarted &&
        <>
          <Hands {...{ ...game, gameId, width, height, hoverCard, setHoverCard, hoverPos, setHoverPos }} />
          <TableCard {...{ ...game, gameId, width, height, tableCard, hoverCard, setHoverCard }} />
          <HeldCards {...{ ...game, gameId, width, height, hoverCard, setHoverCard }} />
          <Scores {...{ width, height, hoverPos, players }} />
          {isOver && <GameOverMessage width={width} height={height} />}
        </>
      }
    </svg>
  );
}
