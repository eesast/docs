# 奖励与得分

## 得分（Score）

最终排名依据的指标。只在 **SELL 动作成功**时增加：

```
score += revenue × score_factor（默认 × 10）
```

## 单步奖励（RL Reward）

训练时的辅助信号，由以下部分叠加（`mode = "standard"`）：

| 来源 | 默认值 | 说明 |
|------|:--:|------|
| 现金变化 Δmoney | × 0.02 | 正负均有 |
| 卖出得分 Δscore | × 0.001 | 仅卖出时为正 |
| 时间惩罚（每步） | −0.001 | 鼓励高效路径 |
| 采集奖励（每单位） | +0.0 | 默认关闭，可通过 RewardConfig 开启 |
| 算力中心解锁（每个） | +1.0 | 进度奖励 |
| 科技购买（每个） | +1.0 | 进度奖励 |
| 无效动作惩罚 | −0.02 | 每步 |
| 破产惩罚（terminated 时） | −10.0 | 终端惩罚 |

> 奖励是训练辅助信号。**最终排名以 `info["score"]` 为准**，不是累计奖励。

`RewardConfig` 支持两种模式：
- `"standard"`（默认）：密集可学习信号，适用于 PPO/DQN 训练
- `"adversarial"`：收割陷阱模式，仅使用采集奖励 + 终端得分

### 技术细节

`RewardCalculator.compute()` 在 `game_env.py` 的 `step()` 中调用，计算奖励时先评估终止条件，再结算奖励（确保 terminal bonus 正确触发）。

## `step()` 返回的 info 字典

| 字段 | 类型 | 含义 |
|------|------|------|
| `step` | `int` | 当前步数 |
| `time` | `float` | 游戏时间（秒） |
| `money` | `float` | 当前现金 |
| `score` | `float` | 当前累计得分 |
| `compute` | `float` | 当前算力 |
| `action_valid` | `bool` | 上一步动作是否有效 |
