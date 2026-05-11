---
title: THUAI9
slug: ./
---

## 赛事名称

AI 工厂模拟（THUAI9）

## 赛道

| | PVP | PVE |
|:--|:---|:---|
| 模式 | 多队伍实时对抗 | 单人经济 RL 环境 |
| 编程语言 | C++ | Python |
| 交互方式 | gRPC 连接服务器 | Gymnasium 本地环境 |
| 控制对象 | 1 Team + 3 Character | 1 个单位 |
| 动作 | 连续移动 + 多种操作 | 8 个离散动作 |
| 得分机制 | 售卖 + 战斗 + 摧毁工厂 | 售卖 × 10 |
| 文档入口 | [`pvp/`](pvp/intro/rule.md) | [`pve/`](pve/intro/rule.md) |

## PVP 概要

2~4 支队伍在同一地图对抗。每队拥有 1 座工厂和最多 3 个角色（Drone / Robot / AutonomousCar），通过采集资源、生产产品、占领算力中心、市场售卖、攻击敌方来获取分数。游戏时长 2 分钟，得分高者获胜。

## PVE 概要

强化学习竞技环境。选手训练智能体在地图上移动、低买高卖、采集资源，在有限时间内最大化累计得分。提供 easy / medium / hard 三级难度，支持 MaskablePPO 训练。比赛以多 seed 平均得分排名。

---

## 选手包使用说明

### PVP 赛道（C++）

**编写代码的位置：**

- 角色 AI（PlayerID=1,2,3）：编辑 `CAPI/cpp/API/src/AI.cpp`，实现 `AI::play(ICharacterAPI& api)` 方法
- 团队 AI（PlayerID=0）：同一个文件中的 `AI::play(ITeamAPI& api)` 方法

**编译：**

1. 用 Visual Studio 2022 打开 `CAPI/cpp/API.sln`
2. 确保项目属性：平台工具集 v143、C++17 标准
3. 菜单栏 → **生成** → **生成解决方案**（不要点"重新生成"）

**运行：**

```bash
./capi -t <teamID> -p <playerID> [-I <serverIP>] [-P <serverPort>] [-d] [-o] [-w]
```

| 参数 | 说明 |
|------|------|
| `-t <1-4>` | 队伍编号（必选） |
| `-p <0-3>` | 玩家编号（必选）0=Team 核心，1/2/3=Character |
| `-I <IP>` | 服务器 IP，默认 `127.0.0.1` |
| `-P <port>` | 服务器端口，默认 `8888` |
| `-d` | 开启文件日志（输出到 `logs/`） |
| `-o` | 开启控制台输出 |
| `-w` | 控制台仅输出警告（与 `-o` 配合） |

**调用流程：** 先启动服务器 → 再启动各客户端。每个队伍需要同时启动 4 个进程（1 个 Team + 3 个 Character），每局可容纳 2~4 支队伍。

---

### PVE 赛道（Python）

**编写代码的位置：**

- 游戏规则层：`logic/pve/GameLogic/`（地图、市场、单位、动作空间）
- RL 算法层：继承 `RLInterfaces/base_agent.py` 中的 `BaseAgent` 类，实现 `get_action()` 和 `train()` 方法
- 训练脚本：`TrainingDemo/train_basic.py`

**安装依赖：**

```bash
cd logic/pve/
pip install -r requirements.txt
```

**训练：**

```bash
# 使用内置难度预设
python TrainingDemo/train_basic.py --config easy   --timesteps 100000 --seed 42
python TrainingDemo/train_basic.py --config medium --timesteps 500000
python TrainingDemo/train_basic.py --config hard   --timesteps 500000

# 使用自定义 YAML 配置
python TrainingDemo/train_basic.py --config TrainingDemo/configs/custom.yaml --timesteps 200000
```

**评测：**

```bash
python TrainingDemo/evaluate.py --model models/ppo_thuai9_best --config medium --episodes 50
```

**项目结构速览：**

```text
logic/pve/
├── GameLogic/            # 游戏规则层（算法不可依赖内部实现）
│   ├── config.py         # 全局配置（GameConfig、PRODUCT_DEFS、TECH_TREE）
│   ├── game_env.py       # Gymnasium 环境入口
│   ├── board.py          # 地图、资源点、算力中心
│   ├── character.py      # 单位状态
│   ├── market.py         # 市场正弦价格函数
│   ├── action_space.py   # 8 个离散动作 + 动作掩码
│   └── reward_calculator.py  # 奖励计算
├── RLInterfaces/         # RL 算法接口
│   ├── base_agent.py     # 抽象基类
│   ├── ppo_agent.py      # PPO 实现（支持 MaskablePPO）
│   └── training_loop.py  # 训练循环
├── TrainingDemo/         # 训练与评测脚本
│   ├── train_basic.py    # 基础训练入口
│   ├── evaluate.py       # 多 seed 评测
│   └── configs/          # 难度 YAML 配置
├── tests/                # 单元测试
└── docs/                 # PVE 开发者/选手文档
```

---

## 相关链接

+ THUAI9 GitHub 仓库：[https://github.com/lch24/THUAI9](https://github.com/lch24/THUAI9)
