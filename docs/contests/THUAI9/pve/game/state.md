# 游戏状态

## 时间系统

每 tick **0.25s**。easy/medium 300s（1200 tick），hard 500s（2000 tick）。

## 单位

| 属性 | 值 |
|:----:|:--:|
| HP | 300 |
| 背包容量 | 30 |
| 采集速率 | 10/s |
| 占领耗时 | 10s |

- 背包分原材料(`raw_inv`)和成品(`prod_inv[pid]`)；商品追踪购买来源市场(`prod_origin`)
- `busy_ticks > 0` 时仅 WAIT 有效；移动消耗 1 tick（TECH_5 后为 0）；BUY/SELL/LOAD 消耗 `0.25/dt` tick

## 工厂

| 属性 | 值 |
|:----:|:--:|
| 位置 | (0,0) |
| 仓储上限 | 300 |
| 初始产线 | 3 |

生产队列上限 = 产线数 × 5。流程：HARVEST → DEPOSIT → PRODUCE → 等待 tick 完成 → LOAD → SELL。

## 商品

| ID | 名称 | 买价 | 原料消耗 | 市价范围 | 生产时间 |
|:--:|:----:|:----:|:--------:|:--------:|:--------:|
| 0 | 半导体 | 10 | 5 | 40–120 | 5.0s |
| 1 | 药品 | 5 | 3 | 20–60 | 4.0s |
| 2 | 小商品 | 1 | 1 | 4–12 | 2.0s |
| 3 | 服饰 | 8 | 4 | 32–96 | 6.0s |
| 4 | 食品 | 3 | 2 | 12–24 | 1.0s |

买价受 TECH_0(−2)，生产时间受 TECH_1(×0.5) 影响。

## 市场

OU 随机游走价格，每 tick 更新：

```
dP = θ(μ−P)·dt + σ·√dt·N(0,1)
```

θ=0.05，σ=amplitude×0.12，价格夹在 [lo, lo+amplitude] 内。`price_volatility` 控制振幅（easy=0.3, medium=1.0, hard=2.0）。

**套利规则**：BUY 选跨市场卖价最高的可负担商品。禁止同市场原地套利（商品追踪购买来源，卖出时排除当前市场来源部分）。卖价受 TECH_2(×1.1) 影响。

## 算力

- 每个开放算力中心 +1 算力/秒；TECH_7 后 +30%
- OCCUPY 每 tick 推进 0.25s，10s 后开放
- 招募新单位：40 算力/个，上限 5

## 科技

| 键名 | 效果 | 消耗 | 前置 |
|:-----|------|:----:|:----:|
| cost_reduction | 买价 −2 | 50 | — |
| efficiency | 生产时间 ×0.5 | 40 | — |
| marketing | 卖价 ×1.1 | 80 | — |
| durability | HP +50% | 30 | — |
| multi_line | 产线 +1 | 60 | — |
| path_optimization | 移动无 busy_tick | 50 | efficiency |
| market_analysis | obs标记（可重复） | 40 | — |
| compute_expansion | 算力 +30% | 70 | — |

持久科技（除 market_analysis）限购一次。在工厂格执行。

## 资源再生

```
regen(t) = rate × (1 + sin(2π·t/period)) / 2
```

倍率：easy=2.0, medium=1.0, hard=0.5。耗尽（累计≥max_stock=2×初始）后停止。

## 得分与终止

- `score += revenue × 10`（仅 SELL 成功时）
- `money < 0` → terminated；`step ≥ max_steps` → truncated
