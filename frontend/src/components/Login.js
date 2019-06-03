import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPasword] = useState('');
  function submitForm(e) {
    e.preventDefault();
    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    };
    fetch('http://localhost:3333/signin', fetchOptions)
      .then(res => res.json())
      .then(console.log);
  }
  return (
    <form onSubmit={submitForm}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPasword(e.target.value)}
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
