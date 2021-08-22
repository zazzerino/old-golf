import React from 'react';
import './App.css';
import GamePage from './game/GamePage';
import { initWebSocket } from './websocket';

function App() {

  React.useEffect(() => {
    initWebSocket();
  }, []);

  return (
    <div className="App">
      <h2>Golf</h2>
      <GamePage />
    </div>
  );
}

export default App;
