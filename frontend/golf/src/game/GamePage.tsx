import React, { Dispatch } from 'react';
import { Chat } from '../Chat';
import { Action } from '../reducer';
import { ChatMessage, Game, User } from '../types';
import { CreateGameButton } from './CreateGameButton';
import { GameCanvas } from './GameCanvas';
import { StartGameButton } from './StartGameButton';

interface GamePageProps {
  user: User;
  game?: Game;
  messages: ChatMessage[];
  dispatch: Dispatch<Action>;
}

export function GamePage(props: GamePageProps) {
  const { user, game, messages } = props;
  const userIsHost = user.id === game?.hostId;
  const gameHasStarted = game?.stateType !== 'INIT';
  const showStartGame = userIsHost && !gameHasStarted;

  return (
    <div className="GamePage">
      <GameCanvas {...props} />
      <div className="game-buttons">
        <CreateGameButton userId={user.id} />
        {game && showStartGame && <StartGameButton userId={user.id} gameId={game.id} />}
        {user && game && <Chat user={user} gameId={game.id} messages={messages} />}
      </div>
    </div>
  );
}
