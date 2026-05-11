# 动作空间

PVE 使用 **8 个离散动作**：

| 编号 | 动作 | 含义 | 有效性条件 |
|:----:|:----:|------|------------|
| 0 | `WAIT` | 等待一个 tick | 始终有效 |
| 1 | `MOVE_UP` | 向上移动 (x−1) | 目标格可通行，单位不 busy |
| 2 | `MOVE_DOWN` | 向下移动 (x+1) | 同上 |
| 3 | `MOVE_LEFT` | 向左移动 (y−1) | 同上 |
| 4 | `MOVE_RIGHT` | 向右移动 (y+1) | 同上 |
| 5 | `BUY` | 在相邻市场买最便宜的可负担商品 | Manhattan ≤1 有市场，背包有空间，现金充足 |
| 6 | `SELL` | 在相邻市场卖出背包内所有商品 | Manhattan ≤1 有市场，背包有商品 |
| 7 | `HARVEST` | 从附近资源点采集原材料 | Manhattan ≤2 有未耗尽资源，背包有空间 |

- **BUY**：自动购买当前市场价格最低的可负担商品
- **SELL**：一次性卖出背包中所有商品，获得当前市场价
- **HARVEST**：采集范围 2 格（Manhattan 距离）
- 执行无效动作不会报错，但受到 **-0.05 分惩罚**并浪费步数

## 动作掩码

环境提供 `action_masks()` 方法，返回 `(8,)` 布尔数组，`True` 表示该动作当前有效。使用 `MaskablePPO` 可以自动过滤无效动作：

```python
from sb3_contrib import MaskablePPO
from sb3_contrib.common.wrappers import ActionMasker

def mask_fn(env):
    return env.unwrapped.action_masks()

masked_env = ActionMasker(env, mask_fn)
model = MaskablePPO("MlpPolicy", masked_env)
```

建议所有策略先查询 `action_masks()` 再决定动作。
