import React from 'react';
import { GamesTable } from './game/GamesTable';
import { Game, User } from './types';

interface HomePageProps {
  user: User;
  games: Game[];
}

export function HomePage(props: HomePageProps) {
  return (
    <div className="HomePage">
      <h2>Home</h2>
      <GamesTable {...props} />
    </div>
  );
}
