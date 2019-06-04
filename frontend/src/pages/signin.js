import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';
import Login from '../components/Login';

const SignInPage = () => (
  <Layout>
    <SEO title="Sign In" />
    <h1>Sign In</h1>
    <Login />
  </Layout>
);

export default SignInPage;
