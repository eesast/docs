module.exports = {
  title: "EESΛST Docs",
  tagline: "Docs powered by EESΛST",
  url: "https://eesast.github.io",
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "eesast",
  projectName: "docs",
  themes: ["@docusaurus/theme-live-codeblock"],
  themeConfig: {
    navbar: {
      title: "EESΛST",
      logo: {
        alt: "EESΛST Logo",
        src: "img/favicon.ico",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/eesast/docs",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "About",
              to: "docs",
            },
            {
              label: "Tools",
              to: "docs/tools",
            },
            {
              label: "Web",
              to: "docs/web",
            },
            {
              label: "Languages",
              to: "docs/languages",
            },
          ],
        },
        {
          title: "EESΛST",
          items: [
            {
              label: "Home",
              href: "https://eesast.com",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/eesast/docs",
            },
          ],
        },
      ],
      logo: {
        alt: "EESΛST Logo",
        src: "img/favicon.ico",
        href: "https://eesast.com",
      },
      copyright: `Copyright © ${new Date().getFullYear()} EESΛST Docs, EESΛST. Built with Docusaurus.`,
    },
    hideableSidebar: true,
    prism: {
      // additionalLanguages: ["tsx"],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/eesast/docs",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/eesast/docs",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
