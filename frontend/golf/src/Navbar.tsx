import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <ul className="Navbar">
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
  );
}