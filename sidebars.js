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
    "tools/git",
    "tools/git_instance",
    "tools/os",
    "tools/linux&shell",
    "tools/wsl",
    "tools/document",
    "tools/tdd",
    "tools/process_management",
    "tools/wsa",
    {
      ROS: [
        "tools/ROS/basic",
        "tools/ROS/communication",
        "tools/ROS/visualization",
        "tools/ROS/gazebo",
        "tools/ROS/packages",
        "tools/ROS/reference",
      ],
    }
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
    {
      云原生: [
        "web/cloud_native/README",
        "web/cloud_native/docker",
        {
          通信: ["web/cloud_native/communication/Protobuf", "web/cloud_native/communication/gRPC"],
        },
      ],
    },
  ],
  "machine-learning": ["machine_learning/README"],
  Contests: [
    "contests/README",
    {
      "AIChallenge2": [
        "contests/AIChallenge2/README",
        "contests/AIChallenge2/introduction",
        "contests/AIChallenge2/RuleMan"
      ]
    },
    {
      "THUAI3.0": [
        "contests/THUAI3.0/README",
        "contests/THUAI3.0/READMEForPlayers",
        "contests/THUAI3.0/API"
      ]
    },
    {
      "THUAI4": [
        "contests/THUAI4/README",
        "contests/THUAI4/READMEForPlayers",
        "contests/THUAI4/Introduction",
        "contests/THUAI4/API",
        "contests/THUAI4/UpdateInfo"
      ]
    },
    {
      "THUAI5": [
        "contests/THUAI5/README",
        "contests/THUAI5/GameRules",
        "contests/THUAI5/CAPI",
        "contests/THUAI5/Tool_tutorial"
      ]
    },
    {
      "THUAI6": [
        "contests/THUAI6/README",
        "contests/THUAI6/GameRules",
        "contests/THUAI6/usage",
        "contests/THUAI6/Tool_tutorial",
        "contests/THUAI6/capi_cpp",
        "contests/THUAI6/capi_python",
        "contests/THUAI6/GameUpdate",
        "contests/THUAI6/QandA",
        "contests/THUAI6/VersionUpdate"
      ]
    },
    {
      "THUAI7": [
        "contests/THUAI7/README",
        {
          "引入": [
            "contests/THUAI7/intro/README",
            "contests/THUAI7/intro/rule",
            "contests/THUAI7/intro/guide",
            "contests/THUAI7/intro/programming",
          ],
        },
        {
          "地图": [
            "contests/THUAI7/map/map",
            "contests/THUAI7/map/placetype",
            "contests/THUAI7/map/home",
            "contests/THUAI7/map/wormhole",
          ],
        },
        {
          "舰船": [
            "contests/THUAI7/ship/ship",
            "contests/THUAI7/ship/civilship",
            "contests/THUAI7/ship/warship",
            "contests/THUAI7/ship/flagship",
            "contests/THUAI7/ship/base",
          ],
        },
        {
          "机制": [
            "contests/THUAI7/mechanics/mechanics",
            "contests/THUAI7/mechanics/construction",
            "contests/THUAI7/mechanics/module",
            "contests/THUAI7/mechanics/view",
            "contests/THUAI7/mechanics/attack",
            "contests/THUAI7/mechanics/score",
          ],
        },
        {
          "接口": [
            "contests/THUAI7/interface/interface",
            "contests/THUAI7/interface/cpp",
            "contests/THUAI7/interface/python",
          ],
        },
        {
          "常见问题": [
            "contests/THUAI7/faq/README",
            "contests/THUAI7/faq/cpptips",
          ]
        },
      ]
    }
  ]
};
