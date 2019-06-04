import { Link, navigate } from 'gatsby';
import React, { useState, useEffect } from 'react';

const Header = ({ siteTitle, setUser }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) setLoggedIn(true);
  }, []);

  const signOut = () => {
    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    fetch('http://localhost:3333/signout', fetchOptions)
      .then(res => res.json())
      .then(res => {
        localStorage.removeItem('user');
        setLoggedIn(false);
        if (setUser) {
          setUser(null);
        }
        navigate('/');
      });
  };

  const buttonStyle = {
    border: '1px solid lightgray',
    background: 'lightgray',
    borderRadius: '.2em',
  };
  const textStyle = {
    margin: 0,
    textDecoration: 'none',
    color: 'black',
  };
  return (
    <header
      style={{
        background: `rebeccapurple`,
        marginBottom: `1.45rem`,
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
        {loggedIn ? (
          <button style={buttonStyle} type="button" onClick={signOut}>
            <h3 style={textStyle}>Sign Out</h3>
          </button>
        ) : (
          <button style={buttonStyle} type="button">
            <h3 style={textStyle}>
              <Link to="/signin" style={textStyle}>
                Sign In
              </Link>
            </h3>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
