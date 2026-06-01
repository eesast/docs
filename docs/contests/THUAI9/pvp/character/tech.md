# 科技系统（PVP）

## 决赛数值调整明细

- 角色基础数值已调整，详见[角色文档](character.md)
- **回血消耗**：由 1 算力回 1 HP → **1 算力回 2 HP**

---

在己方工厂消耗算力升级科技，科技最高 **2 级**。升级后所有已有角色立即获得加成。

## 科技列表

| 科技名称 | 内部标签 | 每级效果 | 算力消耗 |
|:--------:|:--------:|----------|:--------:|
| IncreaseHP / IncreaseRobust | `Robust` | 血量 +20%，防御 +5 | 30 |
| IncreaseAttackPower / IncreaseAttackSize | `Warrior` | 攻击力 ×1.3 | 60 |
| IncreaseMoveSpeed | `MoveSpeed` | 移速 +200 | 40 |
| IncreaseCarryCapacity | `Carry` | 负载 +10 | 50 |
| IncreaseEfficiency | `Efficiency` | 效率 +2 | 40 |
| IncreaseProduction | `Production` | 生产时间 ÷(1+级数) | 60 |
| IncreaseStorage | `Storage` | 工厂仓储 +50 | 50 |
| IncreasePrice | `Price` | 售价 ×(1+0.1×级数) | 80 |
| DecreaseCost | `Cost` | 生产成本 -2 | 50 |

> **注意**：同一内部标签下的两种科技**共享等级**（如升级 IncreaseHP 后，IncreaseRobust 也变为同级）。每个内部标签独立计算，最高均为 2 级。

## 科技效果细则

**Robust（血量+防御）**：
- 血量：`新上限 = 基础HP × (1 + 0.2 × 等级)`
- 防御：`+5 × 等级`

**Warrior（攻击）**：
- 攻击力：`增量 = 基础ATK × 0.3 × 等级`

**Efficiency（效率）**：
- 角色效率 +2/级

**Production（生产）**：
- 生产加速：`生产时间 = 基础时间 / (1 + 1 × 等级)`，最快缩短至 20%

**Storage（仓储）**：
- 工厂存储上限 +50/级

**MoveSpeed（移速）**：
- +200/级

**Carry（负载）**：
- +10/级

**Price（售价）**：
- 卖出价格 ×(1 + 0.1 × 等级)

**Cost（成本）**：
- 每件商品生产成本 -2，最低为 0
