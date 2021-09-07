import React from 'react';
import { useHistory } from 'react-router-dom';
import { User } from './types';
import { sendLogin } from './websocket';

export function LoginPage(props: { user: User }) {
  const userId = props.user.id;
  const [name, setName] = React.useState('');
  const history = useHistory();

  const handleLogin = (name: string) => {
    sendLogin(userId, name);
    history.push('/game');
  }

  const onClick = () => name && userId != null && handleLogin(name)

  return (
    <div className="LoginPage">
      <h2>Login</h2>
      <input
        placeholder="Type a username"
        value={name}
        onChange={event => {
          setName(event.target.value);
        }}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            handleLogin(name);
          }
        }}
      />
      <button onClick={onClick}>
        Login
      </button>
    </div>
  );
}
