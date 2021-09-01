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
          return (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td><JoinGameButton userId={user.id} gameId={game.id} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
