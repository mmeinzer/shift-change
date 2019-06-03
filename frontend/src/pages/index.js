import React, { useEffect, useState } from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => {
  const [err, updateErr] = useState(null);
  const [shifts, updateShifts] = useState([]);
  useEffect(() => {
    console.log('test');
    fetch('http://localhost:3333/shifts')
      .then(res => res.json())
      .then(({ res, err }) => {
        if (err) {
          updateErr(err);
          return;
        }
        updateErr(null);
        updateShifts(res.shifts);
      })
      .catch(console.log);
  }, []);

  return (
    <Layout>
      <SEO title="Home" />
      <h1>View Shifts</h1>
      {err && <p>{err}</p>}
      {shifts.map(shift => (
        <div>{shift.startTime}</div>
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
