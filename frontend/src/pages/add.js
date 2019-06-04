import React, { useEffect, useState } from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import CreateShift from '../components/CreateShift';

const AddShiftPage = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);
  return (
    <Layout>
      <SEO title="Add Shift" />
      <h1>Add a shift</h1>
      {user && user.isManager ? (
        <CreateShift />
      ) : (
        <h3>You must be a manager to add a shift</h3>
      )}
    </Layout>
  );
};

export default AddShiftPage;
