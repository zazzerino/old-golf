import React from 'react';
import { Game } from '../game';
import { JoinGameButton } from './JoinGameButton';
import './GamesTable.css';

export function GamesTable(props: { games: Game[], userId?: number }) {
  return (
    <table className="GamesTable">
      <caption>Games</caption>
      <thead>
        <tr>Id</tr>
      </thead>
      <tbody>
        {props.games.map(game => {
          return (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td><JoinGameButton gameId={game.id} userId={props.userId} /></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
