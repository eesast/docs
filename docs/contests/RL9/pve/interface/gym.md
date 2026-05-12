# 公开接口

PVE 算法**只能**通过标准 Gymnasium 接口与环境交互。不得直接访问内部对象。

## 环境初始化

```python
from GameLogic import GameEnvironment, GameConfig

# 内置难度
env = GameEnvironment(cfg=GameConfig.easy())
env = GameEnvironment(cfg=GameConfig.medium())
env = GameEnvironment(cfg=GameConfig.hard())

# 自定义配置
env = GameEnvironment(cfg=GameConfig.from_dict({
    "map_width": 8, "map_height": 8,
    "num_markets": 4, "initial_money": 100.0,
}))
```

## 接口方法

### `reset()`

```python
obs, info = env.reset(seed=0)
```

重置环境，返回初始观测和 info。

### `step()`

```python
obs, reward, terminated, truncated, info = env.step(action)
# action: int, 0-7
# obs: np.ndarray, shape (32,), dtype float32
# reward: float
# terminated: bool  (money < 0，破产)
# truncated: bool   (步数耗尽，正常结束)
# info: dict
```

### `action_masks()`

```python
mask = env.action_masks()  # np.ndarray[bool], shape (8,)
```

返回当前有效的动作掩码。

## 观测向量（32 维 float32）

| 索引 | 含义 | 归一化 |
|:----:|------|--------|
| 0–1 | 单位位置 (x, y) | / (H, W) |
| 2 | 单位 HP | / max_hp |
| 3 | 原材料背包占比 | raw_inv / capacity |
| 4 | 成品背包占比 | prod_inv / capacity |
| 5 | busy 倒计时 | / 10，截断到 1 |
| 6 | 现金 | log10(money+1) / 5 |
| 7 | 算力 | / 100，截断到 2 |
| 8 | 游戏进度 | time / max_time |
| 9 | 价格相位 sin | sin(2π·t / period) |
| 10 | 价格相位 cos | cos(2π·t / period) |
| 11 | 工厂原料库存 | / storage_cap |
| 12 | 工厂成品库存 | / storage_cap |
| 13 | 生产队列长度 | / 10，截断到 1 |
| 14–16 | 资源点 0 | 相对位置 (dx/H, dy/W) + 库存比 |
| 17–19 | 资源点 1 | 同上 |
| 20–22 | 算力中心 0 | 相对位置 (dx/H, dy/W) + is_open |
| 23–25 | 算力中心 1 | 同上 |
| 26–28 | 市场 0 | 相对位置 (dx/H, dy/W) + best_price |
| 29–31 | 市场 1 | 同上 |

> 如果实体数量不足（如只有 2 个市场），多余索引保持 0。

## 禁止访问的对象

以下为内部实现，选手算法**不得依赖**：

- `env.unit`（Unit 内部字段）
- `env.factory`（Factory 内部字段）
- `env.board`（Board / 地图内部字段）
- `env.markets`（Market 列表）
- `env.money`、`env.compute`、`env.score`（通过 `info` 获取）
- 任何以下划线开头的方法或属性

> 评测机只会暴露 `reset`、`step`、`action_masks` 三个公开接口。

## 编写规则型策略

如果不需要 RL 训练，可以直接读取 `info` 字典做规则决策：

```python
obs, info = env.reset()
while True:
    # 规则策略基于 info 做决策
    if info["money"] > 50:
        action = 5  # BUY
    else:
        action = 7  # HARVEST
    obs, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        break
```
