import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { useAppSelector } from './app/hooks';
import { Navbar } from './Navbar';
import { Game } from './pages/Game';
import { Home } from './pages/Home';
import { selectUser } from './user';
import { selectGame } from './game/gameSlice';

function Footer() {
  const user = useAppSelector(selectUser);
  const game = useAppSelector(selectGame);

  return (
    <div className="Footer">
      {user && <p>user: {JSON.stringify(user)}</p>}
      {game && <p>game: {JSON.stringify(game)}</p>}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Switch>
          <Route path="/game">
            <Game />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
