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
# action: int, 0-27
# obs: np.ndarray, shape (58,), dtype float32
# reward: float
# terminated: bool  (money < 0，破产)
# truncated: bool   (步数耗尽，正常结束)
# info: dict
```

### `action_masks()`

```python
mask = env.action_masks()  # np.ndarray[bool], shape (28,)
```

返回当前有效的动作掩码。

## 观测向量（58 维 float32）

### 单位状态（[0–9]）

| 索引 | 含义 | 归一化 |
|:----:|------|--------|
| 0–1 | 单位位置 (x, y) | / (H, W) |
| 2 | 单位 HP | / max_hp |
| 3 | 原材料背包 | raw_inv / capacity |
| 4 | 半导体背包 | prod_inv[0] / capacity |
| 5 | 药品背包 | prod_inv[1] / capacity |
| 6 | 小商品背包 | prod_inv[2] / capacity |
| 7 | 服饰背包 | prod_inv[3] / capacity |
| 8 | 食品背包 | prod_inv[4] / capacity |
| 9 | busy 倒计时 | / 10，截断到 1 |

### 经济状态（[10–14]）

| 索引 | 含义 | 归一化 |
|:----:|------|--------|
| 10 | 现金（对数） | log10(money+1) / 5 |
| 11 | 算力 | / 100，截断到 2 |
| 12 | 游戏进度 | time / max_game_time |
| 13 | 价格相位 sin | sin(2π·t / market_period) |
| 14 | 价格相位 cos | cos(2π·t / market_period) |

### 工厂状态（[15–21]）

| 索引 | 含义 | 归一化 |
|:----:|------|--------|
| 15 | 工厂原材料库存 | / storage_cap |
| 16 | 工厂半导体库存 | / storage_cap |
| 17 | 工厂药品库存 | / storage_cap |
| 18 | 工厂小商品库存 | / storage_cap |
| 19 | 工厂服饰库存 | / storage_cap |
| 20 | 工厂食品库存 | / storage_cap |
| 21 | 生产队列长度 | / 10，截断到 1 |

### 资源点（[22–27]）

| 索引 | 含义 | 归一化 |
|:----:|------|--------|
| 22–23 | 资源点 0 相对位置 (dx, dy) | / (H, W) |
| 24 | 资源点 0 库存比例 | stock / max_stock |
| 25–26 | 资源点 1 相对位置 (dx, dy) | / (H, W) |
| 27 | 资源点 1 库存比例 | stock / max_stock |

### 算力中心（[28–35]）

| 索引 | 含义 | 归一化 |
|:----:|------|--------|
| 28–29 | 算力中心 0 相对位置 (dx, dy) | / (H, W) |
| 30 | 算力中心 0 是否开放 | 0 或 1 |
| 31 | 算力中心 0 占领进度 | / unit_occupy_time |
| 32–33 | 算力中心 1 相对位置 (dx, dy) | / (H, W) |
| 34 | 算力中心 1 是否开放 | 0 或 1 |
| 35 | 算力中心 1 占领进度 | / unit_occupy_time |

### 市场（[36–49]）

| 索引 | 含义 | 归一化 |
|:----:|------|--------|
| 36–37 | 市场 0 相对位置 (dx, dy) | / (H, W) |
| 38 | 市场 0 半导体价格 | 按 val_range 归一化 |
| 39 | 市场 0 药品价格 | 同上 |
| 40 | 市场 0 小商品价格 | 同上 |
| 41 | 市场 0 服饰价格 | 同上 |
| 42 | 市场 0 食品价格 | 同上 |
| 43–44 | 市场 1 相对位置 (dx, dy) | / (H, W) |
| 45 | 市场 1 半导体价格 | 按 val_range 归一化 |
| 46 | 市场 1 药品价格 | 同上 |
| 47 | 市场 1 小商品价格 | 同上 |
| 48 | 市场 1 服饰价格 | 同上 |
| 49 | 市场 1 食品价格 | 同上 |

### 科技状态（[50–57]）

| 索引 | 含义 |
|:----:|------|
| 50 | 是否已购买 cost_reduction |
| 51 | 是否已购买 efficiency |
| 52 | 是否已购买 marketing |
| 53 | 是否已购买 durability |
| 54 | 是否已购买 multi_line |
| 55 | 是否已购买 path_optimization |
| 56 | 是否已购买 market_analysis（可重复） |
| 57 | 是否已购买 compute_expansion |

> 如果实体数量不足（如只有 1 个市场），多余索引保持 0。

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
        action = 11  # HARVEST
    obs, reward, terminated, truncated, info = env.step(action)
    if terminated or truncated:
        break
```
