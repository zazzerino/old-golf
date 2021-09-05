import React from 'react';
import { Link } from 'react-router-dom';
import { User } from './types';

export function Navbar(props: { user: User }) {
  const { user } = props;

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
      <li>
        <Link to="/login">
          Login
        </Link>
      </li>
      {user &&
        <p className="user-info">
          logged in as:
          <span className="user-name"> {user.name}</span>
          <span className="user-id"> (id={user.id})</span>
        </p>
      }
    </ul>
  );
}