import React from 'react';
import { GamesTable } from '../game/components/GamesTable';
import { useAppSelector } from '../hooks';
import { selectGames, selectUserId } from '../store/select';
import './HomePage.css';

export function HomePage() {
  const userId = useAppSelector(selectUserId);
  const games = useAppSelector(selectGames);

  return (
    <div className="HomePage">
      <h2>Home</h2>
      <GamesTable games={games} userId={userId} />
    </div>
  );
}
