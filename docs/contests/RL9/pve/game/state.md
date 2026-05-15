# 游戏状态

## 时间系统

| 参数 | 值 |
|:----:|:--:|
| 每 tick 时长 | 0.25s |
| easy/medium 总时长 | 300s（1200 ticks） |
| hard 总时长 | 500s（2000 ticks） |

## 单位属性

| 属性 | 值 |
|:----:|:--:|
| 血量 | 300 |
| 背包容量 | 30 |
| 采集速率 | 10/s |
| 算力中心占领时间 | 10s |

- 背包分为**原材料**（`raw_inv`）和**成品**（`prod_inv[pid]`）两部分
- `busy_ticks > 0` 时单位忙碌，仅 WAIT 有效
- 移动默认消耗 1 busy_tick（购买 path_optimization 科技后变为 0）
- BUY/SELL/LOAD 消耗 `int(0.25 / time_step)` 个 busy_tick

## 工厂

| 属性 | 值 |
|:----:|:--:|
| 位置 | (0, 0) |
| 仓储上限 | 300 |
| 初始生产线数 | 3 |

### 生产系统

工厂将原材料加工为成品。生产队列最大长度 = `生产线数 × 5`。

生产流程：
1. 采集原材料（HARVEST）
2. 存入工厂（DEPOSIT）
3. 排队生产（PRODUCE_pid）——消耗原材料，加入生产队列
4. 等待工厂 tick 推进完成
5. 装载成品（LOAD）

生产时间受 efficiency 科技影响（×0.5）。

## 商品

| ID | 名称 | 购买成本 | 原材料消耗 | 市场价格范围 | 生产时间 |
|:--:|:----:|:--------:|:----------:|:------------:|:--------:|
| 0 | 半导体 | 10 | 5 | 40–120 | 5.0s |
| 1 | 药品 | 5 | 3 | 20–60 | 4.0s |
| 2 | 小商品 | 1 | 1 | 4–12 | 2.0s |
| 3 | 服饰 | 8 | 4 | 32–96 | 6.0s |
| 4 | 食品 | 3 | 2 | 12–24 | 1.0s |

- 购买成本受 cost_reduction 科技影响（−2，最低为 0）
- 生产时间受 efficiency 科技影响（×0.5）

## 市场定价

每个市场对每种商品有独立的正弦价格函数：

```
price(t) = base + amplitude × (1 + sin(2π·t / period + phase)) / 2
```

- 不同市场的价格**相位随机不同步**，套利窗口随时间移动
- `price_volatility` 控制波动幅度（easy=0.3, medium=1.0, hard=2.0）
- 卖价受 marketing 科技影响（×1.1）

## 算力系统

- **基础产出**：每个已开放算力中心产出 **1 算力/秒**
- 购买 compute_expansion 科技后：+30% 算力速率
- 可消耗算力招募新单位（40 算力/个，最多 5 个单位）——Phase 2

### 算力中心

- 占领方式：在相邻格执行 OCCUPY，每次 tick 推进 0.25s 进度
- 进度达到 `unit_occupy_time`（10s）后开放
- 开放后持续产出算力

## 科技树

| 键名 | 效果 | 消耗 | 前置 | 持久 |
|:-----|------|:----:|:----:|:----:|
| cost_reduction | 商品购买成本 −2 | 50 | — | ✓ |
| efficiency | 生产时间 ×0.5 | 40 | — | ✓ |
| marketing | 卖价 ×1.1 | 80 | — | ✓ |
| durability | 单位 max HP +50% | 30 | — | ✓ |
| multi_line | 工厂 +1 生产线 | 60 | — | ✓ |
| path_optimization | 移动不产生 busy_tick | 50 | efficiency | ✓ |
| market_analysis | 观测中标记已购买 | 40 | — | ✗ |
| compute_expansion | 算力速率 +30% | 70 | — | ✓ |

- 持久科技每种只能购买一次
- market_analysis 可重复购买
- 科技在工厂格执行

## 资源再生

资源点库存会随时间缓慢再生：

```
regen(t) = rate × (1 + sin(2π·t / period)) / 2
```

- 再生倍率：easy=2.0, medium=1.0, hard=0.5
- 资源耗尽（累计采集量 ≥ max_stock）后停止再生
- 最大库存为初始库存的 2 倍

## 得分与终止

- **得分**：`score += revenue × score_factor`（默认 ×10），仅在 SELL 成功时增加
- **terminated**：`money < 0`（破产）
- **truncated**：`step >= max_steps`（时间耗尽）
- 最终排名以多 seed 下的 `info["score"]` 平均为准
