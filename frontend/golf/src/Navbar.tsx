import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function NavbarLink(props: { path: string, text: string }) {
  return (
    <Link to={props.path}>
      {props.text}
    </Link>
  );
}

export function Navbar() {
  return (
    <div className="Navbar">
      <ul>
        <li>
          <NavbarLink path="/" text="Home" />
        </li>
        <li>
          <NavbarLink path="/game" text="Game" />
        </li>
      </ul>
    </div>
  );
}
