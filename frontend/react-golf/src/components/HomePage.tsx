import React from 'react';
import { GamesTable } from '../game/components/GamesTable';
import { useAppSelector } from '../hooks';
import { selectGames, selectUserId } from '../store/select';
import './HomePage.css';

export function HomePage() {
  const games = useAppSelector(selectGames);
  const userId = useAppSelector(selectUserId);

  return (
    <div className="HomePage">
      <h2>Home</h2>
      <GamesTable games={games} userId={userId} />
    </div>
  );
}
