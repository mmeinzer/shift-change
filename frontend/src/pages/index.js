import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => {
  const [err, updateErr] = useState(null);
  const [shifts, updateShifts] = useState([]);
  useEffect(() => {
    const fetchOptions = {
      credentials: 'include',
    };
    fetch('http://localhost:3333/shifts', fetchOptions)
      .then(res => res.json())
      .then(({ res, err }) => {
        if (err) {
          updateErr(err);
          return;
        }
        updateErr(null);
        updateShifts(res.shifts);
      })
      .catch(err => updateErr(err.message));
  }, []);

  return (
    <Layout>
      <SEO title="Home" />
      <h1>View Shifts</h1>
      {err && <p>{err}</p>}
      {shifts.map(({ startTime, firstName, lastName }) => (
        <div>
          <div>{new Date(startTime).toLocaleString()}</div>
          <div>{`${firstName} ${lastName}`}</div>
        </div>
      ))}
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }} />
      <div>
        <Link to="/add/">Add a shift</Link>
      </div>
      <div>
        <Link to="/signin/">Log in</Link>
      </div>
    </Layout>
  );
};

export default IndexPage;
