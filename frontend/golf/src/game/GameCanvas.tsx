import React, { useState } from 'react';
import { Deck } from './Deck';
import { TableCard } from './TableCard';
import { Game, HandPosition, User } from '../types';
import { GameOverMessage } from './GameOverMessage';
import { Hands } from './Hands';
import { HeldCards } from './HeldCards';
import { Scores } from './Scores';

function handPositions(playerCount: number): HandPosition[] {
  switch (playerCount) {
    case 1: return ['BOTTOM'];
    case 2: return ['BOTTOM', 'TOP'];
    case 3: return ['BOTTOM', 'LEFT', 'RIGHT'];
    case 4: return ['BOTTOM', 'LEFT', 'TOP', 'RIGHT'];
    default: return [];
  }
}

interface GameCanvasProps {
  user: User;
  game?: Game;
}

export function GameCanvas(props: GameCanvasProps) {
  const { user, game } = props;
  const className = 'GameCanvas';
  const width = 600;
  const height = 500;
  const viewBox = `${-width / 2} ${-height / 2} ${width} ${height}`;
  const [hoverCard, setHoverCard] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<HandPosition | null>(null);

  // if there's no game, return an empty svg
  if (game == null) {
    return <svg {...{ className, viewBox, width, height }} />
  }

  const userId = user.id;
  const gameId = game.id;
  const players = game.players;
  const order = game.playerOrders[user.id];
  const positions = handPositions(players.length);
  const isOver = game.stateType === 'GAME_OVER';

  return (
    <svg {...{ className, viewBox, width, height }}>
      <Deck {...{ ...game, userId, gameId, width, height, hoverCard, setHoverCard }} />
      {game.hasStarted &&
        <>
          <TableCard {...{ ...game, userId, gameId, hoverCard, setHoverCard }} />
          <Hands {...{ ...game, userId, gameId, width, height, positions, order, hoverCard, setHoverCard, hoverPos, setHoverPos }} />
          <HeldCards {...{ ...game, userId, gameId, width, height, positions, order, hoverCard, setHoverCard }} />
          <Scores {...{ width, height, positions, order, players, hoverPos }} />
          {isOver && <GameOverMessage {...{ width, height }} />}
        </>
      }
    </svg>
  );
}
