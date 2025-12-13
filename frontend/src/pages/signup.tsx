import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

export default function Signup(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Sign Up - ${siteConfig.title}`}
      description="Sign up for RoboLearn - Interactive platform for learning Physical AI and robotics">
      <Head>
        <title>Sign Up - RoboLearn</title>
        <meta name="description" content="Sign up for RoboLearn - Interactive platform for learning Physical AI and robotics" />
      </Head>

      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <div className="padding--lg text--center">
              <h1 className="text--center">Create Your Account</h1>
              <p className="text--center padding-bottom--sm">
                Join our community of robotics enthusiasts and start your journey in Physical AI.
              </p>
              
              <div className="margin-vert--lg">
                <form>
                  <div className="form-group margin-bottom--sm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      required
                    />
                  </div>
                  <div className="form-group margin-bottom--sm">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="form-group margin-bottom--sm">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="form-group margin-bottom--sm">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                  <div className="form-group margin-bottom--md">
                    <button type="submit" className="button button--primary button--lg">
                      Create Account
                    </button>
                  </div>
                </form>
                
                <p>
                  Already have an account? <Link to="/profile">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}