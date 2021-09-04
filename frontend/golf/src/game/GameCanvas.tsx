import React, { Dispatch, SetStateAction, useState } from 'react';
import { Hand, HandPosition } from './Hand';
import { Deck } from './Deck';
import { TableCard } from './TableCard';
import { Game, Player, User } from '../types';
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

interface HandsProps {
  user: User;
  game: Game;
  width: number;
  height: number;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
  positions: HandPosition[],
  order: number[],
  players: Player[]
}

function Hands(props: HandsProps) {
  const { user, game, width, height, hoverCard, setHoverCard, positions, order, players } = props;

  return (
    <>
      {positions.map((pos, key) => {
        const playerId = order[key];
        const player = players.find(p => p.id === playerId);

        if (player == null) {
          console.error(`player ${playerId} not found...`);
          return null;
        }

        const { cards, uncoveredCards } = player.hand;
        return <Hand {...{ key, user, game, playerId, width, height, pos, cards, uncoveredCards, hoverCard, setHoverCard }} />;
      })}
    </>
  );
}

interface HeldCardsProps {
  user: User;
  game: Game;
  width: number;
  height: number;
  hoverCard: string | null;
  setHoverCard: Dispatch<SetStateAction<string | null>>;
  positions: HandPosition[],
  order: number[],
  players: Player[]
}

function HeldCards(props: HeldCardsProps) {
  const { positions, order, players, user, game, width, height, hoverCard, setHoverCard } = props;

  return (
    <>
      {positions.map((pos, key) => {
        const playerId = order[key];
        const player = players.find(p => p.id === playerId);

        if (player == null) {
          console.error(`player ${playerId} not found...`);
          return null;
        }

        const heldCard = player.heldCard;

        if (heldCard == null) {
          return null;
        }

        return <HeldCard {...{ key, pos, user, game, name: heldCard, width, height, playerId, hoverCard, setHoverCard }} />
      })}
    </>
  );
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
  const [hoverCard, setHoverCard] = useState<string | null>(null);

  // if there's no game, return an empty svg
  if (game == null) {
    return <svg {...{ className, width, height }} />
  }

  const { hasStarted, tableCard, players } = game;
  const order = game.playerOrders[user.id];
  const positions = handPositions(players.length);
  const player = players.find(p => p.id === user.id);
  const score = player?.hand.visibleScore;
  const isOver = game.stateType === 'GAME_OVER';

  return (
    <svg {...{ className, width, height }}>
      <Deck {...{ user, game, width, height, hasStarted, hoverCard, setHoverCard }} />
      {hasStarted &&
        <>
          <TableCard {...{ user, game, width, height, name: tableCard, hoverCard, setHoverCard }} />
          <Hands {...{ user, game, width, height, players, order, positions, hoverCard, setHoverCard }} />
          <HeldCards {...{ user, game, width, height, players, order, positions, hoverCard, setHoverCard }} />
          <ScoreDisplay {...{ width, height, score }} />
          {isOver && <GameOverMessage {...{ width, height }} />}
        </>
      }
    </svg>
  );
}
