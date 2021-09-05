import React from 'react';

export function LoginPage() {
  const [name, setName] = React.useState('');

  return (
    <div className="LoginPage">
      <h2>Login</h2>
      <input
        placeholder="Type a username"
        value={name}
        onChange={event => setName(event.target.value)}
      />
    </div>
  );
}
