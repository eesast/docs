# THUAI8 Python API 接口文档

## 简介

本文档详细说明 Python 版 THUAI8 游戏中的接口 `IAPI`、`ICharacterAPI` 和 `ITeamAPI`，涵盖所有选手可调用的方法。

## 接口继承关系

```ascii
                IAPI (基础接口)
                   ↑
          ┌────────┴────────┐
          │                 │
ICharacterAPI (角色控制接口)  ITeamAPI (团队控制接口)
```

- **ICharacterAPI**: 用于控制普通角色（玩家ID: 1-6），提供角色移动、攻击、建造等功能
- **ITeamAPI**: 用于控制团队（玩家ID: 0），提供装备安装、角色创建等功能

## 基础接口（IAPI）方法

### 消息通信

#### SendMessage
```python
def SendMessage(self, toPlayerID: int, message: Union[str, bytes]) -> Future[bool]
```
- **参数**
  - `toPlayerID`: 接收消息的玩家ID（0为团队，1-6为普通角色）
  - `message`: 消息内容，支持 str 或 bytes 类型
- **返回值**: `Future[bool]`，通过 `.result()` 获取发送是否成功

#### HaveMessage
```python
def HaveMessage(self) -> bool
```
- **返回值**: 是否有未读消息

#### GetMessage
```python
def GetMessage(self) -> Tuple[int, Union[str, bytes]]
```
- **返回值**: 元组 (发送者ID, 消息内容)。若无消息，发送者ID为 -1

### 游戏控制

#### Wait
```python
def Wait(self) -> Future[bool]
```
- **返回值**: `Future[bool]`，通过 `.result()` 获取等待下一帧是否成功

#### EndAllAction
```python
def EndAllAction(self) -> Future[bool]
```
- **返回值**: `Future[bool]`，通过 `.result()` 获取是否成功停止当前所有动作

### 游戏信息获取

#### GetCharacters
```python
def GetCharacters(self) -> List[THUAI8.Character]
```
- **返回值**: 所有可见己方角色的信息列表

#### GetEnemyCharacters
```python
def GetEnemyCharacters(self) -> List[THUAI8.Character]
```
- **返回值**: 所有可见敌方角色的信息列表

#### GetFullMap
```python
def GetFullMap(self) -> List[List[THUAI8.PlaceType]]
```
- **返回值**: 二维数组表示的地图格子类型

#### GetGameInfo
```python
def GetGameInfo(self) -> THUAI8.GameInfo
```
- **返回值**: 当前游戏信息（状态、时间等）

#### GetPlaceType
```python
def GetPlaceType(self, cellX: int, cellY: int) -> THUAI8.PlaceType
```
- **参数**:
  - `cellX`: 格子X坐标
  - `cellY`: 格子Y坐标
- **返回值**: 指定格子的类型（如障碍、资源点等）

#### GetEconomyResourceState
```python
def GetEconomyResourceState(self, cellX: int, cellY: int) -> THUAI8.EconomyResource
```
- **参数**:
  - `cellX`: 格子X坐标
  - `cellY`: 格子Y坐标
- **返回值**: `EconomyResource` 结构体，包含以下字段：
  ```python
  class EconomyResource:
      def __init__(
          self,
          id: int = 0,
          process: int = 0,
          type: EconomyResourceType = EconomyResourceType.NullEconomyResourceType
      ):
          self.economyResourceType = type 
          self.process = process
          self.id = id 
  ```
- **说明**: 
  - 若指定位置无经济资源，返回默认值（所有字段为0或Null）
- **示例**:
  ```python
  economy_resource = api.GetEconomyResourceState(0, 0).result()
  if economy_resource:
      print(f"资源类型: {economy_resource.economyResourceType}")
      print(f"采集进度: {economy_resource.process}")
      if economy_resource.process > 0:
          api.Produce().result()
  else:
      print("该位置没有经济资源")
  ```



#### GetAdditionResourceState
```python
def GetAdditionResourceState(self, cellX: int, cellY: int) -> THUAI8.AdditionResource
```
- **参数**:
  - `cellX`: 格子X坐标
  - `cellY`: 格子Y坐标
- **返回值**: `AdditionResource` 结构体，包含以下字段：
  ```python
  class AdditionResource:
      def __init__(
          self,
          id: int = 0,
          hp: int = 0,
          type: AdditionResourceType = AdditionResourceType.NullAdditionResourceType
      ):
          self.additionResourceType = type
          self.hp = hp
          self.id = id
  ```
- **说明**: 
  - 若指定位置无加成资源，返回默认值（所有字段为0或Null）
- **示例**:
  ```python
  addition_resource = api.GetAdditionResourceState(0, 0).result()
  if addition_resource:
      print(f"资源生命值: {addition_resource.hp}")
  else:
      print("该位置没有加成资源")
  ```

#### GetTrapState
```python
def GetTrapState(self, cellX: int, cellY: int) -> THUAI8.Trap
```
- **参数**:
  - `cellX`: 格子X坐标
  - `cellY`: 格子Y坐标
- **返回值**: `Trap` 结构体，包含以下字段：
  ```python
  class Trap:
      def __init__(
              self,
              trapType: TrapType = TrapType.NullTrapType,
              teamID: int = 0,
              trapValid: bool = False,
          ):
          self.trapType = trapType
          self.teamID = teamID
          self.trapValid = trapValid
  ```
- **说明**: 
  - 若指定位置无陷阱，返回默认值（所有字段为0或Null）

#### GetConstructionState
```python
def GetConstructionState(self, cellX: int, cellY: int) -> THUAI8.ConstructionState
```
- **参数**:
  - `cellX`: 格子X坐标
  - `cellY`: 格子Y坐标
- **返回值**: `ConstructionState` 结构体，包含以下字段：
  ```python
  class ConstructionState:
      def __init__(
          self,
          teamID: int = 0,
          HP: int = 0,
          type: ConstructionType = ConstructionType.NullConstructionType
      ):
          self.teamID = teamID 
          self.hp = HP 
          self.constructionType = type 
  ```
- **说明**: 
  - 若指定位置无建筑，返回默认值（所有字段为0或Null）

#### GetEnergy
```python
def GetEnergy(self) -> int
```
- **返回值**: 当前角色/团队的能量值

#### GetScore
```python
def GetScore(self) -> int
```
- **返回值**: 当前角色/团队的得分

#### GetPlayerGUIDs
```python
def GetPlayerGUIDs(self) -> List[int]
```
- **返回值**: 本队所有角色的全局唯一标识符列表

### 调试功能

#### Print
```python
def Print(self, string: str) -> None
```
- **参数**:
  - `string`: 要打印的调试信息字符串
- **说明**: 仅在调试模式下有效

#### PrintCharacter
```python
def PrintCharacter(self) -> None
```
- **说明**: 打印当前可见角色的详细信息

#### PrintSelfInfo
```python
def PrintSelfInfo(self) -> None
```
- **说明**: 打印当前角色/团队的详细信息

## ICharacterAPI 特有方法

### 移动控制

#### Move
```python
def Move(self, timeInMilliseconds: int, angleInRadian: float) -> Future[bool]
```
- **参数**:
  - `timeInMilliseconds`: 移动持续时间（毫秒）
  - `angleInRadian`: 移动方向（弧度，向下为x轴正方向，向右为y轴正方向）
- **返回值**: `Future[bool]`，表示移动指令是否成功发送

#### 方向移动快捷方法
```python
def MoveRight(self, timeInMilliseconds: int) -> Future[bool]
def MoveUp(self, timeInMilliseconds: int) -> Future[bool]
def MoveLeft(self, timeInMilliseconds: int) -> Future[bool]
def MoveDown(self, timeInMilliseconds: int) -> Future[bool]
```
- **参数**:
  - `timeInMilliseconds`: 移动持续时间（毫秒）
- **返回值**: `Future[bool]`，表示移动指令是否成功发送

### 攻击操作

#### Skill_Attack
```python
def Skill_Attack(self, angleInRadian: float) -> Future[bool]
```
- **参数**:
  - `angleInRadian`: 技能攻击方向（弧度）
- **返回值**: `Future[bool]`，表示技能攻击指令是否成功发送

#### Common_Attack
```python
def Common_Attack(self, ATKplayerID: int) -> Future[bool]
```
- **参数**:
  - `ATKplayerID`: 目标玩家ID
- **返回值**: `Future[bool]`，表示普通攻击指令是否成功发送

#### AttackConstruction
```python
def AttackConstruction(self) -> Future[bool]
```
- **返回值**: `Future[bool]`，表示攻击附近建筑指令是否成功发送

#### AttackAdditionResource
```python
def AttackAdditionResource(self) -> Future[bool]
```
- **返回值**: `Future[bool]`，表示攻击附加资源指令是否成功发送
- **说明**: 
  - 需要在附加资源附近使用
  - 通过 `.result()` 获取实际执行结果

### 资源操作

#### Produce
```python
def Produce(self) -> Future[bool]
```
- **返回值**: `Future[bool]`，表示生产指令是否成功发送
- **说明**: 需要在资源点附近使用

#### Recover
```python
def Recover(self, recover: int) -> Future[bool]
```
- **参数**:
  - `recover`: 恢复的生命值量
- **返回值**: `Future[bool]`，表示恢复指令是否成功发送
- **说明**: 需要在泉水附近使用

### 建筑操作

#### Construct
```python
def Construct(self, constructionType: THUAI8.ConstructionType) -> Future[bool]
```
- **参数**:
  - `constructionType`: 建筑类型
- **返回值**: `Future[bool]`，表示建造指令是否成功发送
- **说明**: 在可建造位置新建建筑

#### ConstructTrap
```python
def ConstructTrap(self, trapType: THUAI8.TrapType) -> Future[bool]
```
- **参数**:
  - `trapType`: 陷阱类型
- **返回值**: `Future[bool]`，表示建造陷阱指令是否成功发送
- **说明**: 通过 `.result()` 获取实际执行结果

#### Rebuild
```python
def Rebuild(self, constructionType: THUAI8.ConstructionType) -> Future[bool]
```
- **参数**:
  - `constructionType`: 建筑类型
- **返回值**: `Future[bool]`，表示重建指令是否成功发送
- **说明**: 重建损坏的建筑

### 信息与视野

#### GetSelfInfo
```python
def GetSelfInfo(self) -> THUAI8.Character
```
- **返回值**: 当前角色的详细信息

#### HaveView
```python
def HaveView(self, gridX: int, gridY: int) -> bool
```
- **参数**:
  - `gridX`: 目标位置的网格X坐标
  - `gridY`: 目标位置的网格Y坐标
- **返回值**: 目标位置是否在视野范围内

## ITeamAPI 特有方法

### 团队管理

#### GetSelfInfo
```python
def GetSelfInfo(self) -> THUAI8.Team
```
- **返回值**: 当前团队的详细信息

#### InstallEquipment
```python
def InstallEquipment(self, playerID: int, equipmentType: THUAI8.EquipmentType) -> Future[bool]
```
- **参数**:
  - `playerID`: 目标角色ID（1-5）
  - `equipmentType`: 装备类型
- **返回值**: `Future[bool]`，表示安装装备指令是否成功发送

#### BuildCharacter
```python
def BuildCharacter(self, characterType: THUAI8.CharacterType, birthIndex: int) -> Future[bool]
```
- **参数**:
  - `characterType`: 角色类型
  - `birthIndex`: 出生点索引
- **返回值**: `Future[bool]`，表示创建角色指令是否成功发送

