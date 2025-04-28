
# cpp接口一览

本文档详细介绍THUAI8游戏中的两个主要角色控制接口：ICharacterAPI和ITeamAPI，以及它们从IAPI继承的所有方法。

## 接口继承关系

```ascii
                IAPI (基础接口)
                   ↑
          ┌────────┴────────┐
          │                 │
ICharacterAPI (角色控制接口)  ITeamAPI (团队控制接口)
```

- **ICharacterAPI**：用于控制普通角色（玩家ID: 1-5），提供了角色移动、攻击、建造等功能
- **ITeamAPI**：用于控制主角/团队（玩家ID: 0），提供了团队管理、装备安装、角色创建等功能

## 接口使用说明

由于ICharacterAPI和ITeamAPI都继承自IAPI基础接口，因此在使用这两个接口时，既可以调用它们自身特有的方法，也可以调用从IAPI继承的通用方法。

- **ICharacterAPI**：可以调用角色移动、攻击、建造等特有方法，以及从IAPI继承的消息通信、游戏控制和信息获取等通用方法。
- **ITeamAPI**：可以调用团队管理、装备安装、角色创建等特有方法，以及从IAPI继承的通用方法。

## 基础接口（IAPI）方法

以下方法由ICharacterAPI和ITeamAPI共同继承自IAPI基础接口：

### 消息通信

```cpp
std::future<bool> SendTextMessage(int32_t toPlayerID, std::string message)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `toPlayerID`：接收消息的角色ID
  - `message`：文本消息内容

向指定角色发送文本消息，返回发送是否成功的future对象。

```cpp
std::future<bool> SendBinaryMessage(int32_t toPlayerID, std::string message)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `toPlayerID`：接收消息的角色ID
  - `message`：二进制消息内容

向指定角色发送二进制消息，返回发送是否成功的future对象。

```cpp
bool HaveMessage()
```

- **返回类型：** `bool`

检查是否有未读消息，有则返回true，否则返回false。

```cpp
std::pair<int32_t, std::string> GetMessage()
```

- **返回类型：** `std::pair<int32_t, std::string>`

获取一条消息，返回发送者ID和消息内容的pair。如果没有消息，返回(-1, "")。

### 游戏控制

```cpp
int32_t GetFrameCount() const
```

- **返回类型：** `int32_t`

获取当前游戏帧数，可用于同步和计时。

```cpp
bool Wait()
```

- **返回类型：** `bool`

等待下一帧，返回等待是否成功。

```cpp
std::future<bool> EndAllAction()
```

- **返回类型：** `std::future<bool>`

结束角色当前所有正在进行的动作，返回操作是否成功的future对象。

### 游戏信息获取

```cpp
std::vector<std::shared_ptr<const THUAI8::Character>> GetCharacters() const
```

- **返回类型：** `std::vector<std::shared_ptr<const THUAI8::Character>>`

获取所有可见的己方角色信息，返回角色对象的智能指针数组。

```cpp
std::vector<std::shared_ptr<const THUAI8::Character>> GetEnemyCharacters() const
```

- **返回类型：** `std::vector<std::shared_ptr<const THUAI8::Character>>`

获取所有可见的敌方角色信息，返回角色对象的智能指针数组。

```cpp
std::vector<std::vector<THUAI8::PlaceType>> GetFullMap() const
```

- **返回类型：** `std::vector<std::vector<THUAI8::PlaceType>>`

获取完整地图信息，返回二维数组表示的地图格子类型。

```cpp
std::shared_ptr<const THUAI8::GameInfo> GetGameInfo() const
```

- **返回类型：** `std::shared_ptr<const THUAI8::GameInfo>`

获取当前游戏信息，包括游戏状态、时间等。

```cpp
THUAI8::PlaceType GetPlaceType(int32_t cellX, int32_t cellY) const
```

- **返回类型：** `THUAI8::PlaceType`
- **参数：**
  - `cellX`：格子X坐标
  - `cellY`：格子Y坐标

获取指定格子的类型，如障碍、空地等。

```cpp
std::optional<THUAI8::EconomyResourceState> GetEnconomyResourceState(int32_t cellX, int32_t cellY) const
```

- **返回类型：** `std::optional<THUAI8::EconomyResourceState>`
- **参数：**
  - `cellX`：格子X坐标
  - `cellY`：格子Y坐标

获取指定格子的经济资源状态，如果该格子没有经济资源则返回空。

```cpp
std::optional<std::pair<int32_t, int32_t>> GetAdditionResourceState(int32_t cellX, int32_t cellY) const
```

- **返回类型：** `std::optional<std::pair<int32_t, int32_t>>`
- **参数：**
  - `cellX`：格子X坐标
  - `cellY`：格子Y坐标

获取指定格子的加成资源状态，如果该格子没有加成资源则返回空。

```cpp
std::vector<int64_t> GetPlayerGUIDs() const
```

- **返回类型：** `std::vector<int64_t>`

获取所有玩家的全局唯一标识符，返回ID数组。

```cpp
int32_t GetEnergy() const
```

- **返回类型：** `int32_t`

获取当前角色或队伍的能量值。

```cpp
int32_t GetScore() const
```

- **返回类型：** `int32_t`

获取当前角色或队伍的得分。

### 辅助功能

```cpp
static inline int32_t CellToGrid(int32_t cell) noexcept
```

- **返回类型：** `int32_t`
- **参数：**
  - `cell`：格子坐标

将格子坐标转换为网格坐标，这是一个静态方法。

```cpp
static inline int32_t GridToCell(int32_t grid) noexcept
```

- **返回类型：** `int32_t`
- **参数：**
  - `grid`：网格坐标

将网格坐标转换为格子坐标，这是一个静态方法。

```cpp
void Print(std::string str) const
```

- **参数：**
  - `str`：要打印的字符串

将指定字符串输出到控制台，用于调试。

```cpp
void PrintCharacter() const
```

将所有可见角色的详细信息输出到控制台，用于调试。

```cpp
void PrintSelfInfo() const
```

将当前角色的详细信息输出到控制台，用于调试。

## ICharacterAPI特有方法

### 角色移动

```cpp
std::future<bool> Move(int32_t moveTimeInMilliseconds, double angle)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `moveTimeInMilliseconds`：移动持续时间，单位为毫秒
  - `angle`：移动方向，单位为弧度，使用极坐标（竖直向下方向为x轴，水平向右方向为y轴）

控制角色向指定方向移动指定的时间，返回操作是否成功的future对象。

```cpp
std::future<bool> MoveRight(int64_t timeInMilliseconds)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `timeInMilliseconds`：移动持续时间，单位为毫秒

控制角色向右指定的时间，返回操作是否成功的future对象。

```cpp
std::future<bool> MoveUp(int64_t timeInMilliseconds)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `timeInMilliseconds`：移动持续时间，单位为毫秒

控制角色向上指定的时间，返回操作是否成功的future对象。

```cpp
std::future<bool> MoveLeft(int64_t timeInMilliseconds)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `timeInMilliseconds`：移动持续时间，单位为毫秒

控制角色向左指定的时间，返回操作是否成功的future对象。

```cpp
std::future<bool> MoveDown(int64_t timeInMilliseconds)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `timeInMilliseconds`：移动持续时间，单位为毫秒

控制角色向下指定的时间，返回操作是否成功的future对象。

### 角色攻击

```cpp
std::future<bool> Skill_Attack(int64_t TeamID, int64_t PlayerID, double angle)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `TeamID`：队伍ID
  - `PlayerID`：角色ID
  - `angle`：攻击方向，单位为弧度

角色向指定方向使用技能攻击，返回操作是否成功的future对象。

```cpp
std::future<bool> Common_Attack(int64_t teamID, int64_t PlayerID, int64_t attackedTeamID, int64_t attackedPlayerID)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `teamID`：攻击者队伍ID
  - `PlayerID`：攻击者角色ID
  - `attackedTeamID`：被攻击者队伍ID
  - `attackedPlayerID`：被攻击者角色ID

角色对指定目标进行普通攻击，返回操作是否成功的future对象。

### 角色恢复与生产

```cpp
std::future<bool> Recover(int64_t recover)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `recover`：恢复量

角色进行生命值恢复，返回操作是否成功的future对象。

```cpp
std::future<bool> Produce(int64_t playerID, int64_t teamID)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `playerID`：角色ID
  - `teamID`：队伍ID

角色进行资源生产，返回操作是否成功的future对象。

### 建造功能

```cpp
std::future<bool> Construct(THUAI8::ConstructionType constructionType)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `constructionType`：建筑类型

角色建造指定类型的建筑，返回操作是否成功的future对象。

### 角色信息获取

```cpp
std::shared_ptr<const THUAI8::Character> GetSelfInfo() const
```

- **返回类型：** `std::shared_ptr<const THUAI8::Character>`

获取当前角色的详细信息，包含角色的状态、位置、属性等。

### 视野检测

```cpp
bool HaveView(int32_t x, int32_t y, int32_t newX, int32_t newY, int32_t viewRange, std::vector<std::vector<THUAI8::PlaceType>>& map) const
```

- **返回类型：** `bool`
- **参数：**
  - `x`：起始位置X坐标
  - `y`：起始位置Y坐标
  - `newX`：目标位置X坐标
  - `newY`：目标位置Y坐标
  - `viewRange`：视野范围
  - `map`：地图信息

判断从起始位置到目标位置是否在视野范围内，如果可见则返回true，否则返回false。

## ITeamAPI特有方法

### 团队信息获取

```cpp
std::shared_ptr<const THUAI8::Team> GetSelfInfo() const
```

- **返回类型：** `std::shared_ptr<const THUAI8::Team>`

获取当前团队的详细信息，包含团队的状态、资源等。

### 装备管理

```cpp
std::future<bool> InstallEquipment(int32_t playerID, THUAI8::EquipmentType equipmenttype)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `playerID`：角色ID
  - `equipmenttype`：装备类型

为指定角色安装指定类型的装备，返回操作是否成功的future对象。

### 角色创建

```cpp
std::future<bool> BuildCharacter(THUAI8::CharacterType CharacterType, int32_t birthIndex)
```

- **返回类型：** `std::future<bool>`
- **参数：**
  - `CharacterType`：角色类型
  - `birthIndex`：出生点索引

在指定出生点创建指定类型的角色，返回操作是否成功的future对象。

## 调试API使用说明

调试版API（CharacterDebugAPI和TeamDebugAPI）提供了详细的日志记录功能，可以帮助开发者跟踪API调用和游戏状态。使用调试版API时，日志会记录以下信息：

1. API调用的时间戳
2. API调用的参数
3. API调用的结果（成功/失败）
4. 游戏状态变化

调试API的日志文件保存在"logs/api-{teamID}-{playerID}-log.txt"，其中teamID是团队ID，playerID是角色ID。日志记录了API调用的时间、参数和结果，便于开发者调试和分析游戏运行情况。
