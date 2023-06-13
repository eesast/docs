module.exports = {
  intro: {
    Intro: [
      "intro/README",
      "intro/style_guide",
      "intro/mdx",
      "intro/math",
      "intro/structure",
      "intro/contributors",
    ],
  },
  languages: [
    "languages/README",
    {
      "C/C++": [
        "languages/C&C++/compile",
        "languages/C&C++/makefile&cmake",
        "languages/C&C++/modern_cpp",
        "languages/C&C++/STL",
        "languages/C&C++/multi-file_programming",
        "languages/C&C++/c_cpp_windows",
        "languages/C&C++/macos_cpp",
        "languages/C&C++/OOP",
      ],
    },
    {
      "C#": [
        "languages/CSharp/CSharp_1_basic",
        "languages/CSharp/CSharp_2_multithread",
        "languages/CSharp/Winform",
        "languages/CSharp/WPF",
      ],
    },
    "languages/HTML&CSS",
    {
      "JS/TS": [
        "languages/JS&TS/JavaScript",
        "languages/JS&TS/TypeScript",
        "languages/JS&TS/Nodejs",
        "languages/JS&TS/npm",
        "languages/JS&TS/yarn",
      ],
    },
  ],
  tools: [
    "tools/README",
    "tools/docker",
    "tools/git",
    "tools/git_instance",
    "tools/os",
    "tools/linux&shell",
    "tools/wsl",
    "tools/document",
    "tools/tdd",
    "tools/process_management",
    "tools/wsa",
  ],
  game: [
    "game/README",
    "game/unity",
    {
      Minecraft: [
        {
          红石: [
            {
              官方红石教程: [
                "game/minecraft/redstone/redstone_testing/README",
                "game/minecraft/redstone/redstone_testing/redstone_basic1",
              ],
            },
          ],
        },
      ],
    },
    {
      通信: ["game/communication/Protobuf", "game/communication/gRPC"],
    },
  ],
  web: [
    "web/README",
    {
      前端: [
        "web/frontend/react_practical",
        "web/frontend/react_detailed",
        "web/frontend/webpack",
      ],
    },
    {
      后端: [
        "web/backend/backend",
        "web/backend/express",
        "web/backend/MongoDB",
        "web/backend/graphql",
        "web/backend/OSS_CDN",
      ],
    },
    {
      部署: ["web/deployment/CI&CD", "web/deployment/nginx"],
    },
  ],
  "machine-learning": ["machine_learning/README"],
};
