# 公开接口

PVE 算法只通过标准 Gymnasium 接口与环境交互，禁止访问内部对象。

## 环境初始化

```python
from GameLogic import GameEnvironment, GameConfig

env = GameEnvironment(cfg=GameConfig.easy())   # medium / hard / from_dict({...})
```

## 接口

```python
obs, info = env.reset(seed=0)
obs, reward, terminated, truncated, info = env.step(action)  # action: int 0–27
mask = env.action_masks()  # (28,) bool, True=有效
```

| 返回 | 类型 | 含义 |
|------|------|------|
| `obs` | `(58,) float32` | 观测向量 |
| `reward` | `float` | 单步奖励 |
| `terminated` | `bool` | money<0 破产 |
| `truncated` | `bool` | 步数耗尽 |
| `info` | `dict` | step/time/money/score/compute/action_valid |

## 观测向量（58 维 float32）

| 索引 | 内容 |
|:----:|------|
| 0–1 | 单位坐标 / (H,W) |
| 2 | HP / max_hp |
| 3 | raw_inv / capacity |
| 4–8 | prod_inv[0–4] / capacity |
| 9 | busy_ticks / 10 |
| 10 | log10(money+1) / 5 |
| 11 | compute / 100 |
| 12 | time / max_time |
| 13–14 | sin/cos(2π·t / market_period) |
| 15 | 工厂 raw_stock / storage_cap |
| 16–20 | 工厂 products[0–4] / storage_cap |
| 21 | 生产队列长度 / 10 |
| 22–24 | 资源0: dx/H, dy/W, stock/max |
| 25–27 | 资源1: 同上 |
| 28–31 | 算力中心0: dx/H, dy/W, is_open, progress |
| 32–35 | 算力中心1: 同上 |
| 36–42 | 市场0: dx/H, dy/W, 5种商品价格(val_range归一化) |
| 43–49 | 市场1: 同上 |
| 50–57 | 科技 one-hot（8槽对应 TECH_0~7 顺序） |

不足实体数量的索引保持 0。

## 禁止访问

`env.unit`、`env.factory`、`env.board`、`env.markets`、`env.money` 等内部对象均禁止。评测机只暴露 `reset/step/action_masks`。
