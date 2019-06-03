import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Login from '../components/Login';

const SignIn = () => (
  <Layout>
    <SEO title="Sign In" />
    <h1>Sign In</h1>
    <Login />
    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default SignIn;
