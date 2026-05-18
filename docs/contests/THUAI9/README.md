---
title: THUAI9
slug: ./
---
## 赛事名称

AI 工厂模拟（THUAI9）

## 赛道

|          | PVP                        | PVE                        |
| :------- | :------------------------- | :------------------------- |
| 模式     | 多队伍实时对抗             | 单人经济 RL 环境           |
| 编程语言 | C++                        | Python                     |
| 交互方式 | gRPC 连接服务器            | Gymnasium 本地环境         |
| 控制对象 | 1 Team + 3 Character       | 1 个单位                   |
| 动作     | 连续移动 + 多种操作        | 28 个离散动作              |
| 得分机制 | 售卖 + 战斗 + 摧毁工厂     | 售卖 × 10（SELL成功时）   |
| 市场定价 | 乘数 + 衰减               | OU 随机游走，禁止原地套利  |
| 文档入口 | [`pvp/`](pvp/intro/rule.md) | [`pve/`](pve/intro/rule.md) |

## PVP 概要

2~4 支队伍在同一地图对抗。每队拥有 1 座工厂和最多 3 个角色（Drone / Robot / AutonomousCar），通过采集资源、生产产品、占领算力中心、市场售卖、攻击敌方来获取分数。游戏时长 10 分钟，得分高者获胜。

## PVE 概要

强化学习竞技环境。选手训练智能体在地图上移动、低买高卖、采集资源，在有限时间内最大化累计得分。提供 easy / medium / hard 三级难度，支持 MaskablePPO 训练。比赛以多 seed 平均得分排名。

---

## 选手包使用说明

### PVP 赛道（C++）

详细的使用说明参照选手包里的 docs\THUAI9_CPP选手运行说明.md

---

### PVE 赛道（Python）

不熟悉强化学习的可以访问https://github.com/konpoku/THUAI9-RL  ，在小项目中学习一下

详细的使用说明参照选手包里的logic\pve\docs\CONTESTANT_GUIDE.md

---

## 相关链接

+ THUAI9 GitHub 仓库：[https://github.com/lch24/THUAI9](https://github.com/lch24/THUAI9)
