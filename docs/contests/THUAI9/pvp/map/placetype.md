# 区域类型（PVP）

地图每个格子有对应的 `PlaceType`：

| 类型 | 值 | 说明 |
|------|:--:|------|
| `NULL_PLACE_TYPE` | 0 | 无效 |
| `FACTORY` | 1 | 工厂（队伍基地） |
| `SPACE` | 2 | 空地 |
| `BARRIER` | 3 | 障碍物 |
| `BUSH` | 4 | 草丛 |
| `RESOURCE` | 5 | 资源点 |
| `COMPUTE_CENTER` | 6 | 算力中心 |
| `MARKET` | 7 | 市场 |

## 通行性

**只有 `SPACE` 和 `BUSH` 可以通行**。所有其他类型（Factory、Barrier、Resource、ComputeCenter、Market）格子上均有碰撞物体，角色无法穿过。

## 各类型说明

**空地 `SPACE`**：自由通行，无特殊效果。

**草丛 `BUSH`**：自由通行。中心在草丛中的角色对草丛外敌方不可见，发起攻击后破隐。

**障碍物 `BARRIER`**：不可通行，阻挡视野。

**工厂 `FACTORY`**：队伍的出生基地，不可通行。详见 [工厂](factory.md)。

**资源 `RESOURCE`**：可采集（需在九宫格内），不可通行。详见 [资源](resource.md)。

**算力中心 `COMPUTE_CENTER`**：可占领（需在九宫格内，仅 Drone/Robot），不可通行。详见 [算力中心](compute_center.md)。

**市场 `MARKET`**：可买卖（需在九宫格内），不可通行。详见 [市场](market.md)。

## 九宫格交互距离

角色执行采集、占领、装载、买卖操作时，需要处于目标格子的**九宫格内**（`ApproachToInteract`，即 Chebyshev 距离 ≤ 1 个 cell）：

```cpp
abs(cellX_self - cellX_target) <= 1 && abs(cellY_self - cellY_target) <= 1
```
