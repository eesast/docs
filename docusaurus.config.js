const math = require("remark-math");
const katex = require("rehype-katex");

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
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css",
      type: "text/css",
      integrity:
        "sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X",
      crossorigin: "anonymous",
    },
  ],
  themeConfig: {
    docs: {
      sidebar: {
        hideable: true,
      },
    },
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
          items: [
            {
              label: "About",
              to: "docs/",
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
            {
              label: "Machine Learning",
              to: "docs/machine_learning",
            },
          ],
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
            {
              label: "Machine Learning",
              to: "docs/machine_learning",
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
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        sitemap: {
          changefreq: "weekly",
          priority: 0.5,
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
