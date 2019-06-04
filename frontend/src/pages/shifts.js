import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ShiftsDisplay from '../components/ShiftsDisplay';

const ShiftsPage = () => {
  const buttonStyle = {
    border: '1px solid rebeccapurple',
    background: 'rebeccapurple',
    minWidth: '6em',
    minHeight: '2em',
    borderRadius: '.2em',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: '1.6em',
    textDecoration: 'none',
  };
  return (
    <Layout>
      <SEO title="Shifts" />
      <h1>Shifts</h1>
      <ShiftsDisplay />
      <div style={{ display: 'flex' }}>
        <Link to="/add" style={{ margin: 'auto' }}>
          <button type="button" style={buttonStyle}>
            Add a Shift
          </button>
        </Link>
      </div>
    </Layout>
  );
};

export default ShiftsPage;
