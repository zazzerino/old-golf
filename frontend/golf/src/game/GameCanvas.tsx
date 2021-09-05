import React, { useState } from 'react';
import { Deck } from './Deck';
import { TableCard } from './TableCard';
import { Game, HandPosition, User } from '../types';
import { GameOverMessage } from './GameOverMessage';
import { ScoreDisplay } from './ScoreDisplay';
import { Hands } from './Hands';
import { HeldCards } from './HeldCards';

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

  // if there's no game, return an empty svg
  if (game == null) {
    return <svg {...{ className, viewBox, width, height }} />
  }

  const userId = user.id;
  const gameId = game.id;
  const { hasStarted, tableCard, players, stateType, playableCards, playerTurn, events } = game;
  const order = game.playerOrders[user.id];
  const positions = handPositions(players.length);
  const player = players.find(p => p.id === user.id);
  const score = player?.hand.visibleScore;
  const isOver = game.stateType === 'GAME_OVER';

  return (
    <svg {...{ className, viewBox, width, height }}>
      <Deck {...{ userId, gameId, width, height, playableCards, playerTurn, stateType, hoverCard, setHoverCard }} />
      {hasStarted &&
        <>
          <TableCard {...{ tableCard, userId, gameId, width, height, stateType, playerTurn, playableCards, hoverCard, setHoverCard }} />
          <Hands {...{ userId, gameId, width, height, stateType, order, positions, players, playerTurn, playableCards, hoverCard, setHoverCard }} />
          <HeldCards {...{ userId, gameId, width, height, players, playerTurn, events, stateType, order, positions, hoverCard, setHoverCard }} />
          <ScoreDisplay {...{ width, height, score }} />
          {isOver && <GameOverMessage {...{ width, height }} />}
        </>
      }
    </svg>
  );
}
