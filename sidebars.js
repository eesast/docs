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
      "THUAI6": [
        "contests/thuai6/README",
        "contests/thuai6/GameRules",
        "contests/thuai6/usage",
        "contests/thuai6/Tool_tutorial",
        "contests/thuai6/capi_cpp",
        "contests/thuai6/capi_python",
        "contests/thuai6/GameUpdate",
        "contests/thuai6/QandA",
        "contests/thuai6/VersionUpdate"
      ]
    },
    {
      "THUAI7": [
        "contests/thuai7/README",
        {
          "引入": [
            "contests/thuai7/intro/README",
            "contests/thuai7/intro/rule",
            "contests/thuai7/intro/guide",
            "contests/thuai7/intro/programming",
          ],
        },
        {
          "地图": [
            "contests/thuai7/map/map",
            "contests/thuai7/map/placetype",
            "contests/thuai7/map/home",
            "contests/thuai7/map/wormhole",
          ],
        },
        {
          "舰船": [
            "contests/thuai7/ship/ship",
            "contests/thuai7/ship/civilship",
            "contests/thuai7/ship/warship",
            "contests/thuai7/ship/flagship",
            "contests/thuai7/ship/team",
          ],
        },
        {
          "机制": [
            "contests/thuai7/mechanics/mechanics",
            "contests/thuai7/mechanics/construction",
            "contests/thuai7/mechanics/module",
            "contests/thuai7/mechanics/view",
            "contests/thuai7/mechanics/attack",
            "contests/thuai7/mechanics/score",
          ],
        },
        {
          "接口": [
            "contests/thuai7/interface/interface",
            "contests/thuai7/interface/cpp",
            "contests/thuai7/interface/python",
          ],
        },
        {
          "常见问题": [
            "contests/thuai7/faq/README",
            "contests/thuai7/faq/cpptips",
          ]
        }
      ]
    }
  ]
};
