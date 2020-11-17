module.exports = {
  title: "EESΛST Docs",
  tagline: "Docs powered by EESΛST",
  url: "https://docs.eesast.com",
  baseUrl: "/",
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
              label: "Languages",
              to: "docs/languages",
            },
            {
              label: "Tools",
              to: "docs/tools",
            },
            {
              label: "Game",
              to: "docs/game",
            },
            {
              label: "Web",
              to: "docs/web",
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
      additionalLanguages: ["csharp"],
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/eesast/docs/edit/master",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          cacheTime: 600 * 1000, // 600 sec - cache purge period
          changefreq: "weekly",
          priority: 0.5,
          trailingSlash: false,
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        language: ["en", "zh"],
      },
    ],
  ],
};
