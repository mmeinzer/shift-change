import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);
  const buttonStyle = {
    border: '1px solid rebeccapurple',
    background: 'rebeccapurple',
    minWidth: '8em',
    minHeight: '6em',
    borderRadius: '.2em',
    margin: '1em 2em',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: '1.6em',
    textDecoration: 'none',
  };

  return (
    <Layout setUser={setUser}>
      <SEO title="Home" />
      {user ? (
        <h1>Hey, {user.firstName}</h1>
      ) : (
        <h1>Welcome - please sign in</h1>
      )}
      {user ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link to="/shifts">
            <button type="button" style={buttonStyle}>
              View Shifts
            </button>
          </Link>
          {user.isManager ? (
            <Link to="/add">
              <button type="button" style={buttonStyle}>
                Add a Shift
              </button>
            </Link>
          ) : null}
        </div>
      ) : null}
    </Layout>
  );
};

export default IndexPage;
