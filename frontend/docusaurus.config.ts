import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Get environment variables and make them available to the client
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Textbook',
  tagline: 'Interactive Learning Platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://areejshaikh.github.io',  // GitHub Pages base URL
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/book/',  // For GitHub Pages project site (https://username.github.io/repo-name/)
  // GitHub pages deployment config
  organizationName: 'areejshaikh', // Usually your GitHub org/user name.
  projectName: 'book', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'], // Added Urdu for translation feature
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'RoboLearn',
      items: [
        {to: '/', label: 'Home', position: 'left'},
        {to: '/docs/intro', label: 'Learn', position: 'left'},
        {to: '/docs/intro', label: 'Free', position: 'left'},  // Pointing to free content intro
        {to: '/docs/category/textbook-chapters', label: 'Labs', position: 'left'},  // Link to practical labs
        {to: '/profile', label: 'Personalize', position: 'left'},
        {
          type: 'search',
          position: 'right',
        },
        {
          type: 'dropdown',
          label: 'Account',
          position: 'right',
          items: [
            {
              label: 'Sign In',
              to: '/profile',
            },
            {
              label: 'Sign Up',
              to: '/signup',
            },
          ],
        },
        {
          label: 'Get Started',
          position: 'right',
          to: '/docs/intro',
          className: 'navbar-button--primary'
        },
        {
          href: 'https://github.com/areejshaikh/book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Textbook',
          items: [
            {
              label: 'Introduction',
              to: '/docs/intro',
            },
            {
              label: 'Chapters',
              to: '/docs/category/textbook-chapters',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'AI Chat',
              to: '/chat',
            },
            {
              label: 'Text Generator',
              to: '/generate',
            },
            {
              label: 'Learning Materials',
              to: '/docs/category/textbook-chapters',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Research',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/areejshaikh/book',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics Education. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  // Scripts to include in the HTML template
  scripts: [
  ],

  // Make environment variables available to the client
  clientModules: [
    require.resolve('./src/client-modules/env.js'),
  ],

  // Custom fields to bypass Docusaurus config validation
  customFields: {
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
  },

};

export default config;
