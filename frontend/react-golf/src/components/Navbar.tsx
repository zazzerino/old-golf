import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  return (
    <nav className="Navbar">
      <ul>
        <li>
          <Link to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/game">
            Game
          </Link>
        </li>
      </ul>
    </nav>
  );
}
