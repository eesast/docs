# 训练与评测

## 环境安装

```bash
pip install -r requirements.txt
```

## 单元测试

验证环境正常：

```bash
python -m pytest tests/ -v
```

## 基础训练

```bash
# easy 难度，10 万步
python TrainingDemo/train_basic.py --config easy --timesteps 100000

# medium 难度，20 万步
python TrainingDemo/train_basic.py --config medium --timesteps 200000

# 自定义 YAML 配置
python TrainingDemo/train_basic.py --config TrainingDemo/configs/medium.yaml --timesteps 200000
```

## 评测模型

```bash
python TrainingDemo/evaluate.py --model models/ppo_thuai9_best --config medium --episodes 50
```

输出多 seed 下的平均得分和方差。

## MaskablePPO

使用 `sb3-contrib` 的 `MaskablePPO` 可以自动利用动作掩码：

```python
from sb3_contrib import MaskablePPO
from sb3_contrib.common.wrappers import ActionMasker

def mask_fn(env):
    return env.unwrapped.action_masks()

env = ActionMasker(env, mask_fn)
model = MaskablePPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=100000)
model.save("ppo_thuai9")
```

## 难度对比

| 参数 | easy | medium | hard |
|------|:----:|:------:|:----:|
| 地图 | 5×5 | 10×10 | 15×15 |
| 市场数 | 3 | 3 | 4 |
| 资源点数 | 2 | 2 | 4 |
| 算力中心数 | 1 | 2 | 3 |
| 初始资金 | 200 | 50 | 30 |
| 初始算力 | 60 | 30 | 20 |
| 价格波动 | 0.3x | 1.0x | 2.0x |
| 资源再生 | 2.0x | 1.0x | 0.5x |
| 初始资源 | 200 | 100 | 50 |
| 游戏时长 | 300s | 300s | 500s |

## 项目结构

```
logic/pve/
├── GameLogic/           # 游戏规则与状态管理（算法不可直接修改）
│   ├── config.py        # 全局配置（难度参数化）
│   ├── board.py         # 地图、资源点、算力中心
│   ├── character.py     # 单位（HP、背包、状态机）
│   ├── market.py        # 市场动态价格函数
│   ├── action_space.py  # 动作空间与动作掩码
│   ├── reward_calculator.py  # 奖励计算
│   └── game_env.py      # 主环境（Gymnasium 接口）
├── RLInterfaces/        # RL 算法接口层
│   ├── base_agent.py    # 抽象基类
│   ├── ppo_agent.py     # PPO 实现（支持 MaskablePPO）
│   └── training_loop.py # 训练循环
├── TrainingDemo/        # 训练与评测脚本
│   ├── train_basic.py   # 训练入口
│   ├── evaluate.py      # 评测脚本
│   ├── visualization.py # ASCII 渲染 + 奖励曲线
│   └── configs/         # YAML 配置
├── tests/               # 单元测试
└── docs/                # 选手/开发者文档
```

## 建议方向

- 使用 `action_masks()` 过滤无效动作
- BFS / A* 路径规划，找最优路线
- 建模市场价格正弦周期（利用观测中的 sin/cos 相位）
- 选择高利润商品（半导体 40–120、服饰 32–96）
- 规则策略 + RL 混合（Hybrid Policy）
- 课程学习（easy → medium → hard）
- Recurrent Policy 识别价格周期
