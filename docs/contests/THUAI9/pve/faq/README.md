# 常见问题（PVE / Python / RL）

## 环境相关

> Q: 需要什么 Python 版本？
>
> A: Python 3.9+。依赖见 `logic/pve/requirements.txt`。

> Q: 运行 `import GameLogic` 报错？
>
> A: 确保在 `logic/pve/` 目录下运行，或将 `logic/pve/` 加入 `PYTHONPATH`。

> Q: 如何切换难度？
>
> A: `GameConfig.easy()` / `.medium()` / `.hard()` 预设，或传入 YAML 文件路径。

## 训练相关

> Q: PPO 训练不收敛？
>
> A: 尝试：(1) 使用 `MaskablePPO`；(2) 降低 `price_volatility`；(3) easy 地图上先训练。

> Q: reward 和 score 的区别？
>
> A: reward 是训练辅助信号（含塑形奖励和惩罚），score 是最终排名依据（仅卖出得分×10）。比赛看 score。

> Q: 动作掩码有什么用？
>
> A: 在训练时告诉 PPO 哪些动作当前无效，避免探索无效方向。对规则策略同样有用。

## 接口相关

> Q: 能直接读 `env.unit` 吗？
>
> A: **不能**。评测机只暴露 `reset/step/action_masks` 三个标准接口。所有信息通过 `obs` 和 `info` 获取。

> Q: 观测向量怎么理解？
>
> A: 32 维 float32，包含位置、HP、背包、现金、市场价格相位、最近资源点/市场/算力中心相对位置等。详见 [公开接口](../interface/gym.md)。

> Q: 怎么写规则策略（不用 RL）？
>
> A: 读取 `info` 字典做 if-else 或状态机决策，直接调 `env.step()`。
