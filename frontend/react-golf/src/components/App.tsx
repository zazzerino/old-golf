import React from 'react';
import './App.css';
import { HomePage } from './HomePage';
import { GamePage } from '../game/components/GamePage';
import { initWebSocket } from '../websocket';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Navbar } from './Navbar';

export function App() {
  React.useEffect(() => {
    initWebSocket();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/game">
          <GamePage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
      </BrowserRouter>
    </div>
  );
}
