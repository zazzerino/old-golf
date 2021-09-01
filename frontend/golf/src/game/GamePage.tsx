import React, { Dispatch } from 'react';
import { Action } from '../reducer';
import { Game, User } from '../types';
import { CreateGameButton } from './CreateGameButton';
import { GameCanvas } from './GameCanvas';
import { StartGameButton } from './StartGameButton';

interface GamePageProps {
  user: User;
  game?: Game;
  dispatch: Dispatch<Action>;
}

export function GamePage(props: GamePageProps) {
  const { user, game } = props;

  return (
    <div className="GamePage">
      <GameCanvas {...props} />
      <div className="game-buttons">
        <CreateGameButton userId={user.id} />
        {game && <StartGameButton userId={user.id} gameId={game.id} />}
      </div>
    </div>
  );
}
