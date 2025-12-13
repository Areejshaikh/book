import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Textbook Chapters',
      link: {
        type: 'generated-index',
        description: 'Complete textbook on Physical AI & Humanoid Robotics',
      },
      items: [
        'chapters/intro',
        'chapters/foundations-of-physical-ai',
        'chapters/humanoid-robot-design-principles',
        'chapters/locomotion-and-bipedal-walking',
        'chapters/manipulation-and-grasping',
        'chapters/perception-and-sensing',
        'chapters/planning-and-decision-making',
        'chapters/control-systems-and-dynamics',
        'chapters/learning-and-adaptation',
        'chapters/human-robot-interaction',
        'chapters/applications-and-use-cases',
        'chapters/ethics-and-society',
        'chapters/future-directions-and-conclusions',
      ],
    }
  ],
};

export default sidebars;
