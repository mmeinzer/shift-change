import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPasword] = useState('');
  const [error, setError] = useState('');
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
      .then(({ res, err }) => {
        if (err) return setError(err);
        console.log(res);
        localStorage.setItem('user', JSON.stringify(res.user));
        navigate('/');
      });
  }
  const inputStyle = {
    border: '1px solid',
    borderRadius: '.2em',
    padding: '.1em .2em',
    display: 'block',
    marginTop: '.3em',
  };
  return (
    <form onSubmit={submitForm} style={{ fontFamily: 'Roboto' }}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        value={password}
        onChange={e => setPasword(e.target.value)}
        style={inputStyle}
      />
      <button
        type="submit"
        style={{
          marginTop: '.8em',
          border: 'none',
          padding: '.2em .8em',
          background: 'rebeccapurple',
          color: 'white',
          borderRadius: '.2em',
          fontSize: '1.1em',
        }}
      >
        Log In
      </button>
      {error ? (
        <p
          style={{
            color: 'red',
            margin: '1em 0em',
          }}
        >
          {error}
        </p>
      ) : null}
    </form>
  );
};

export default Login;
