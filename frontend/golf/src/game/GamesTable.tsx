import React from 'react';
import { Game, User } from '../types';
import { JoinGameButton } from './JoinGameButton';

export function GamesTable(props: { user: User, games: Game[] }) {
  const { user, games } = props;

  return (
    <table className="GamesTable">
      <caption>Games</caption>
      <thead>
        <tr>
          <td>Id</td>
          <td>Join</td>
        </tr>
      </thead>
      <tbody>
        {games.map(game => {
          const gameId = game.id;
          return (
            <tr key={gameId}>
              <td>{gameId}</td>
              <td><JoinGameButton userId={user.id} gameId={gameId} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
