import React, { useEffect, useReducer } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { GamePage } from './game/GamePage';
import { HomePage } from './HomePage';
import { LoginPage } from './LoginPage';
import { Navbar } from './Navbar';
import { initialState, reducer } from './reducer';
import { initWebSocket } from './websocket';
import './App.css';

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, games, game } = state;

  useEffect(() => {
    initWebSocket(dispatch);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar user={user} />
        <Switch>
          <Route path="/game">
            <GamePage {...{user, game, dispatch}} />
          </Route>
          <Route path="/login">
            <LoginPage user={user} />
          </Route>
          <Route path="/">
            <HomePage {...{user, games}} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
