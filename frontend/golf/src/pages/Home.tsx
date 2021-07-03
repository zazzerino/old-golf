import React from 'react';
import { CreateGameButton } from '../game/components/CreateGameButton';
import { StartGameButton } from '../game/components/StartGameButton';

export function Home() {
  return (
    <div className="Home">
      <h2>Home</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <CreateGameButton />
        <StartGameButton />
      </div>
    </div>
  );
}
