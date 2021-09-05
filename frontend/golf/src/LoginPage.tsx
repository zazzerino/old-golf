import React from 'react';
import { User } from './types';
import { sendLogin } from './websocket';

export function LoginPage(props: { user: User }) {
  const userId = props.user.id;
  const [name, setName] = React.useState('');

  return (
    <div className="LoginPage">
      <h2>Login</h2>
      <input
        placeholder="Type a username"
        value={name}
        onChange={event => setName(event.target.value)}
      />
      <button onClick={() => name && userId != null && sendLogin(userId, name)}>
        Login
      </button>
    </div>
  );
}
