import React, { useState } from 'react';
import { Hand, HandPosition } from './Hand';
import { Deck } from './Deck';
import { TableCard } from './TableCard';
import { Game, User } from '../types';
import { HeldCard } from './HeldCard';
import { GameOverMessage } from './GameOverMessage';
import { ScoreDisplay } from './ScoreDisplay';

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
  const className = "GameCanvas";
  const width = 600;
  const height = 500;
  const [hoverCard, setHoverCard] = useState<string | null>(null);

  if (game == null) {
    return <svg {...{ className, width, height }} />
  }

  const { hasStarted, tableCard, players } = game;
  const order = game.playerOrders[user.id];
  const positions = handPositions(players.length);
  const player = players.find(p => p.id === user.id);
  const heldCard = player?.heldCard;
  const score = player?.hand.visibleScore;
  const isOver = game.stateType === 'GAME_OVER';

  return (
    <svg {...{ className, width, height }}>
      <Deck {...{ user, game, width, height, hasStarted, hoverCard, setHoverCard }} />

      {hasStarted &&
        <>
          <TableCard {...{ user, game, width, height, name: tableCard, hoverCard, setHoverCard }} />

          {positions.map((pos, i) => { // draw hands
            const playerId = order[i];
            const player = players.find(p => p.id === playerId);

            if (player == null) {
              console.error(`player ${playerId} not found...`);
              return null;
            }

            const cards = player.hand.cards;
            const uncoveredCards = player.hand.uncoveredCards;
            return <Hand {
              ...{ key: i, user, game, playerId, width, height, pos, cards, uncoveredCards, hoverCard, setHoverCard }
            } />
          })}

          {heldCard &&
            <HeldCard {...{ user, game, name: heldCard, width, height, hoverCard, setHoverCard }} />}

          {score != null && <ScoreDisplay {...{width, height, score}} />}

          {isOver && <GameOverMessage {...{width, height}} />}
        </>
      }
    </svg>
  );
}
