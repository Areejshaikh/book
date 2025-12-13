import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HeroSection from '@site/src/components/Homepage/HeroSection';
import ModulesSection from '@site/src/components/Homepage/ModulesSection';
import WhyThisMattersSection from '@site/src/components/Homepage/WhyThisMattersSection';
import StartWhereYouAreSection from '@site/src/components/Homepage/StartWhereYouAreSection';
import FinalCTASection from '@site/src/components/Homepage/FinalCTASection';
import { JSX } from 'react/jsx-runtime';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Interactive platform for learning Physical AI and robotics">
      <Head>
        <title>RoboLearn - Physical AI & Humanoid Robotics</title>
        <meta name="description" content="Interactive platform for learning Physical AI and robotics" />
      </Head>

      <main>
        <HeroSection />
        <ModulesSection />
        <WhyThisMattersSection />
        <StartWhereYouAreSection />
        <FinalCTASection />
      </main>
    </Layout>
  );
}