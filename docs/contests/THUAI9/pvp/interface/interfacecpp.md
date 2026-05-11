# C++ API 接口文档（PVP）

选手实现 `IAI` 接口的 `play()` 方法，通过 `api` 参数调用以下所有函数。

---

## 1. 角色移动 `ICharacterAPI`

```cpp
std::future<bool> Move(int64_t timeMs, double angle)
```
指挥角色向 `angle` 方向（弧度）移动 `timeMs` 毫秒。
- `timeMs`：移动持续时间，单位毫秒。典型值 200。
- `angle`：移动方向。**0 = 正下方（+x 方向），π/2 = 正右方（+y 方向）**。公式：`atan2(toY - fromY, toX - fromX)`
- 服务端实现：`XY(angle, length)` 计算 `x = cos(angle)×length, y = sin(angle)×length`
- 新的 Move 指令自动中断旧移动。

```cpp
std::future<bool> MoveRight(int64_t timeMs)   // angle = π/2
std::future<bool> MoveUp(int64_t timeMs)      // angle = π
std::future<bool> MoveLeft(int64_t timeMs)    // angle = 3π/2
std::future<bool> MoveDown(int64_t timeMs)    // angle = 0
```
四个方向快捷方法，内部等价于 `Move(timeMs, angle)`。

---

## 2. 角色操作 `ICharacterAPI`

```cpp
std::future<bool> Common_Attack(int64_t attackedPlayerID)
```
普通攻击指定 PlayerID 的敌方角色。需要敌方在**攻击范围内且视野可见**。返回的 `future<bool>` 表示攻击指令是否被服务端接受。

```cpp
std::future<bool> Harvest()
```
采集当前位置附近的资源。要求：(1) 角色须在资源格子的**九宫格内**（`abs(cellX1-cellX2)≤1 && abs(cellY1-cellY2)≤1`）；(2) 资源须处于可采集状态（`Harvestable` 或 `BeingHarvested`）；(3) 角色状态须为 `IDLE`。采集的原料自动存入己方**工厂 Source**，可通过 `GetMaterial()` 查看。

```cpp
std::future<bool> Occupy()
```
占领当前位置附近的算力中心。要求：(1) **仅 Drone 和 Robot 可占领**；(2) 角色须在算力中心格子的九宫格内；(3) 角色状态须为 `IDLE`。占领耗时 10s（受 Efficiency 科技加速）。占领后为工厂提供 **+2 算力/秒**。

```cpp
std::future<bool> Load(THUAI9::GoodsType goodsType, int32_t amount)
```
从当前位置附近的**己方工厂**装载商品到角色背包。要求：(1) 须在工厂格子的九宫格内；(2) 工厂必须有足够的该商品库存。角色有负载上限 `carryCapacity`。

```cpp
std::future<bool> Buy(THUAI9::GoodsType goodsType, int32_t amount)
```
从当前位置附近的市场购买商品，消耗队伍分数。要求：(1) 须在市场格子的九宫格内；(2) 队伍分数充足（`当前分数 ≥ 市场价 × 数量`）。商品存入角色背包。

```cpp
std::future<bool> Sell(THUAI9::GoodsType goodsType, int32_t amount)
```
向当前位置附近的市场售出角色背包中的商品，获得分数。要求：(1) 须在市场格子的九宫格内；(2) 角色背包中有足够该商品。所得分数 = 当前市场价 × 数量 × (1 + Price科技等级 × 0.1)。

```cpp
std::future<bool> Recover(int64_t recover)
```
回复角色血量。

---

## 3. 团队操作 `ITeamAPI`

```cpp
std::future<bool> BuildCharacter(THUAI9::CharacterType characterType, int32_t playerID)
```
消耗 50 算力招募一名角色。`playerID` 取值 1/2/3。`characterType` 取值：`Drone`、`Robot`、`AutonomousCar`。每队最多 3 个角色。

```cpp
std::future<bool> ProduceGoods(THUAI9::GoodsType goodsType, int32_t maxProduceNum)
```
消耗 Source（工厂原料）生产指定类型和数量的商品。生产耗时依商品类型不同（1s~6s）。生产完成后商品存入工厂库存（`Factory::productInventory`）。

```cpp
std::future<bool> UplevelTech(THUAI9::TechType techType)
```
消耗算力升级指定科技。最高 2 级。

---

## 4. 信息获取 `IAPI`（ICharacterAPI 与 ITeamAPI 共用）

### 自身信息

```cpp
std::shared_ptr<const THUAI9::Character> GetSelfInfo() const     // ICharacterAPI
std::shared_ptr<const THUAI9::Team>     GetSelfInfo() const     // ITeamAPI
```
获取当前角色/队伍的完整信息。

### Character 结构体字段

| 字段 | 类型 | 含义 |
|------|------|------|
| `guid` | `int64_t` | 全局唯一 ID |
| `teamID` | `int64_t` | 所属队伍 ID（1~4） |
| `playerID` | `int64_t` | 角色编号（1/2/3） |
| `characterType` | `CharacterType` | Drone=1, Robot=2, AutonomousCar=3 |
| `characterActiveState` | `CharacterState` | 当前主动状态 |
| `x`, `y` | `int32_t` | 当前网格坐标（不是 cell 坐标） |
| `speed` | `int32_t` | 移动速度 |
| `viewRange` | `int32_t` | 视野范围 |
| `commonAttack` | `int32_t` | 攻击力 |
| `commonAttackRange` | `int32_t` | 攻击范围 |
| `commonAttackCD` | `int64_t` | 攻击冷却剩余时间 |
| `hp` | `int32_t` | 当前血量 |
| `carryCapacity` | `int32_t` | 负载上限（商品数量） |
| `currentLoad` | `int32_t` | 当前负载 |
| `harvestRatePerSec` | `int32_t` | 每秒采集量 |

### Team 结构体字段

| 字段 | 类型 | 含义 |
|------|------|------|
| `teamID` | `int64_t` | 队伍 ID |
| `score` | `int64_t` | 当前得分 |
| `material` | `int64_t` | 工厂当前资源量（Source） |
| `computePower` | `int64_t` | 当前算力 |
| `factoryHP` | `int64_t` | 工厂当前血量 |

### 队伍/角色列表

```cpp
std::vector<std::shared_ptr<const THUAI9::Character>> GetCharacters() const
```
获取**己方所有可见角色**的信息列表（含自身）。

```cpp
std::vector<std::shared_ptr<const THUAI9::Character>> GetEnemyCharacters() const
```
获取**视野内所有敌方角色**的信息列表。

```cpp
std::vector<int64_t> GetPlayerGUIDs() const
```
获取己方所有角色的 GUID 列表，可用于遍历己方单位。

### 地图

```cpp
std::vector<std::vector<THUAI9::PlaceType>> GetFullMap() const
```
获取 50×50 完整地图。返回 `vector<vector<PlaceType>>`，**访问方式为 `map[cellY][cellX]`**（外层是行/row=Y，内层是列/col=X）。

```cpp
THUAI9::PlaceType GetPlaceType(int32_t cellX, int32_t cellY) const
```
获取指定 cell 坐标的 PlaceType。

### 建筑/资源状态

```cpp
std::optional<THUAI9::Resource>       GetResourceState(int32_t cellX, int32_t cellY) const
std::optional<THUAI9::ComputeCenter>  GetComputeCenterState(int32_t cellX, int32_t cellY) const
std::optional<THUAI9::Market>         GetMarketState(int32_t cellX, int32_t cellY) const
std::optional<THUAI9::Factory>        GetFactoryState(int32_t cellX, int32_t cellY) const
```
查询指定 cell 坐标上的建筑/资源信息。无该类型对象时返回 `std::nullopt`。
- **Resource**：`x`, `y`（网格坐标，非 cell）, `resourceType`（Small=1/Medium=2/Large=3）, `state`（Harvestable=1/BeingHarvested=2/Harvested=3）
- **ComputeCenter**：`ownerTeamID`（0=无人占领）, `occupyProgress`, `state`
- **Market**：`marketType`（Small=1/Medium=2/Large=3）, `priceList`（`map<GoodsType, MarketGoodsInfo>`，含 `price` 和 `tradedQuantity`）
- **Factory**：`teamID`, `hp`, `robust`, `storage`, `efficiency`, `source`, `computingPower`, `canProduce`, `canRecruit`, `productInventory`（`map<GoodsType, int32>`）

### 游戏状态

```cpp
std::shared_ptr<const THUAI9::GameInfo> GetGameInfo() const
```
获取全局游戏信息。`GameInfo` 含 `gameTime`（游戏经过的时间）和 `teams`（`vector<TeamGameInfo>`，每队的 score/material/computePower/factoryHP）。

```cpp
int32_t GetFrameCount() const
```
获取当前帧数（自游戏开始起的帧计数，每 50ms 一帧）。

```cpp
int32_t GetComputingPower() const    // 己方当前算力
int32_t GetMaterial() const          // 己方工厂当前资源量（Source）
int32_t GetScore() const             // 己方当前得分
```

### 消息通信

```cpp
std::future<bool> SendTextMessage(int32_t toPlayerID, std::string message)
std::future<bool> SendBinaryMessage(int32_t toPlayerID, std::string message)
```
向指定 PlayerID 发送文本/二进制消息。同一队的角色之间可互相通信。

```cpp
bool HaveMessage()
```
是否有未读消息。

```cpp
std::pair<int32_t, std::string> GetMessage()
```
获取一条消息。返回 `{发送者PlayerID, 消息内容}`。无消息时返回 `{-1, ""}`。

### 视野检测

```cpp
bool HaveView(int32_t x, int32_t y, int32_t newX, int32_t newY, int32_t viewRange,
              std::vector<std::vector<THUAI9::PlaceType>>& map) const
```
判断从 `(x,y)` 到 `(newX,newY)` 是否在视野范围内（不被障碍物遮挡且距离不超过 viewRange）。

---

## 5. 游戏控制

```cpp
std::future<bool> EndAllAction()
```
**停止角色当前所有动作**，将角色主动状态重置为 `IDLE`。在执行采集、占领、攻击、买卖、装载之前，一般需要先调用此方法确保角色空闲。

```cpp
bool Wait()
```
等待下一帧数据到达（仅在异步模式下使用，选手一般不需要调用）。

---

## 6. 调试工具（仅 Debug 模式可用）

```cpp
void Print(std::string str) const       // 打印调试字符串
void PrintSelfInfo() const              // 打印当前角色/队伍信息
void PrintCharacter() const             // 打印所有可见角色信息
```

---

## 7. 静态辅助方法

```cpp
static inline int32_t CellToGrid(int32_t cell)   // cell * 1000 + 500
static inline int32_t GridToCell(int32_t grid)   // grid / 1000
```
格子坐标与网格中心坐标互转。cell 到 grid：`cell × 1000 + 500`；grid 到 cell：`grid / 1000`。

---

## 8. 枚举速查

```cpp
// 格子类型
enum PlaceType { Null=0, Factory=1, Space=2, Barrier=3, Bush=4, Resource=5, ComputeCenter=6, Market=7 };

// 角色类型
enum CharacterType { Null=0, Drone=1, Robot=2, AutonomousCar=3 };

// 商品类型
enum GoodsType { Null=0, Semiconductor=1, Medicine=2, Toys=3, Clothes=4, Food=5 };

// 科技类型
enum TechType { Null=0,
    IncreaseHP=1, IncreaseAttackPower=2, IncreaseAttackSize=3, IncreaseRobust=4,
    IncreaseMoveSpeed=5, IncreaseCarryCapacity=6, IncreaseEfficiency=7,
    IncreaseProduction=8, IncreaseStorage=9, IncreasePrice=10, DecreaseCost=11 };

// 角色状态
enum CharacterState { Null=0, Idle=1, Harvesting=2, Attacking=3, Ocuppying=4, Trading=5,
    Moving=6, KnockedBack=7, Deceased=8 };

// 算力中心状态
enum ComputeCenterState { Null=0, Occupyable=1, Occupied=2, Robbed=3 };

// 资源状态
enum ResourceState { Null=0, Harvestable=1, BeingHarvested=2, Harvested=3 };

// 资源规模
enum ResourceType { Null=0, SmallResource=1, MediumResource=2, LargeResource=3 };

// 市场类型
enum MarketType { Null=0, SmallMarket=1, MediumMarket=2, LargeMarket=3 };
```

---

## 9. 关键注意事项

1. **坐标系**：x 轴向下，y 轴向右。`atan2(toY - fromY, toX - fromX)` 计算移动角度。
2. **地图访问**：`map[cellY][cellX]`（外层=行/Y，内层=列/X）。
3. **通行判断**：仅 `Space`(2) 和 `Bush`(4) 可通行。其他格子类型均有碰撞体。
4. **九宫格交互**：采集/占领/买卖/装载需 `abs(cellX1-cellX2)≤1 && abs(cellY1-cellY2)≤1`。
5. **`play()` 每 50ms 调用一次**，不要在函数内做耗时操作。BFS 路径应缓存。
6. **操作前先 `EndAllAction()`** 确保角色空闲。
7. **返回值是 `std::future<bool>`**，调用 `.get()` 会阻塞等待 gRPC 返回。可直接忽略返回值。
8. **新的 Move 自动中断旧移动**，不必显式停止。
