# 训练与评测

## 环境安装

```bash
pip install -r requirements.txt
python -m pytest tests/ -v       # 验证环境
```

## 训练

```bash
python TrainingDemo/train_basic.py --config easy --timesteps 100000
python TrainingDemo/train_basic.py --config medium --timesteps 200000
python TrainingDemo/train_basic.py --config TrainingDemo/configs/medium.yaml --timesteps 200000
```

## 评测

```bash
python TrainingDemo/evaluate.py --model models/ppo_thuai9_best --config medium --episodes 50
```

## MaskablePPO

```python
from sb3_contrib import MaskablePPO
from sb3_contrib.common.wrappers import ActionMasker

env = ActionMasker(env, lambda e: e.unwrapped.action_masks())
model = MaskablePPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=100000)
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

## 建议方向

- `action_masks()` 过滤无效动作；BFS/A* 路径规划
- 建模 OU 价格随机游走，利用观测 sin/cos 相位辅助时序判断
- 生产链：食品（1s）快周转，半导体（40–120）高利润
- 优先占领算力中心 → efficiency(×0.5) 或 marketing(×1.1)
- 课程学习 easy→medium→hard；Recurrent Policy 捕捉价格趋势
