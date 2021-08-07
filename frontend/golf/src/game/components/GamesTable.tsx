import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectGames } from '../gameSlice';
import { JoinGameButton } from './JoinGameButton';

export function GamesTable() {
  const games = useAppSelector(selectGames);

  return (
    <div className="GamesTable">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Click To Join</th>
          </tr>
        </thead>
        <tbody>
          {games?.map(game => {
            return <tr key={game.id}>
              <td>{game.id}</td>
              <td><JoinGameButton /></td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
}
