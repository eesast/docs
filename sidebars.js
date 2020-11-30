module.exports = {
  intro: {
    intro: [
      "intro/README",
      "intro/style_guide",
      "intro/mdx",
      "intro/structure",
      "intro/contributors",
    ],
  },
  languages: [
    "languages/README",
    {
      "C/C++": ["languages/STL"],
    },
    {
      "C#": ["languages/CSharp_1_basic", "languages/CSharp_2_multithread"],
    },
    "languages/Html",
    {
      "JS/TS": [
        "languages/JavaScript",
        "languages/TypeScript",
        "languages/Nodejs",
        "languages/npm",
        "languages/yarn",
      ],
    },
  ],
  tools: [
    "tools/README",
    "tools/docker",
    "tools/git",
    "tools/os",
    "tools/shell",
    "tools/git_instance"
  ],
  game: ["game/README", "game/unity"],
  web: [
    "web/README",
    {
      react: [
        "web/react",
        "web/react_1_init",
        "web/react_2_antd",
        "web/react_3_game",
        "web/react_4_history",
      ],
    },
    {
      后端: ["web/express", "web/graphql"],
    },
    {
      部署: ["web/CI&CD"],
    },
  ],
};
