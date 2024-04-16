# Python 接口

```python
    """
    选手可执行的操作，应当保证所有函数的返回值都应当为 `asyncio.Future`，例如下面的移动函数：\n
    指挥本角色进行移动：
    - `timeInMilliseconds` 为移动时间，单位为毫秒
    - `angleInRadian` 表示移动的方向，单位是弧度，使用极坐标——竖直向下方向为 x 轴，水平向右方向为 y 轴\n
    发送信息、接受信息，注意收消息时无消息则返回 `nullopt`
    """
    
    # 通用接口
    def SendMessage(self, toPlayerID: int, message: Union[str, bytes]) -> Future[bool]:
    def HaveMessage(self) -> bool:
    def GetMessage(self) -> Tuple[int, str]:

    # 获取游戏目前所进行的帧数
    def GetFrameCount(self) -> int:
    def Wait(self) -> Future[bool]:
    def EndAllAction(self) -> Future[bool]:
    
    def GetShips(self) -> List[THUAI7.Ship]:
    def GetEnemyShips(self) -> List[THUAI7.Ship]:
    def GetBullets(self) -> List[THUAI7.Bullet]:
    def GetFullMap(self) -> List[List[THUAI7.PlaceType]]:
    def GetGameInfo(self) -> THUAI7.GameInfo:
    def GetPlaceType(self, cellX: int, cellY: int) -> THUAI7.PlaceType:
    def GetConstructionHp(self, cellX: int, cellY: int) -> int:
    def GetWormholeHp(self, cellX: int, cellY: int) -> int:
    def GetResourceState(self, cellX: int, cellY: int) -> int:
    def GetHomeHp(self) -> int:
    def GetEnergy(self) -> int:
    def GetScore(self) -> int:
    def GetPlayerGUIDs(self) -> List[int]:

    def Print(self, cont: str) -> None:
    def PrintShip(self) -> None:
    def PrintTeam(self) -> None:
    def PrintSelfInfo(self) -> None:
    def GetSelfInfo(self) -> Union[THUAI7.Ship, THUAI7.Team]:

    # 船只接口
    def Move(self, timeInMilliseconds: int, angleInRadian: float) -> Future[bool]:
    def MoveRight(self, timeInMilliseconds: int) -> Future[bool]:
    def MoveUp(self, timeInMilliseconds: int) -> Future[bool]:
    def MoveLeft(self, timeInMilliseconds: int) -> Future[bool]:
    def MoveDown(self, timeInMilliseconds: int) -> Future[bool]:
    def Attack(self, angleInRadian: float) -> Future[bool]:
    def Recover(self) -> Future[bool]:
    def Produce(self) -> Future[bool]:
    def Rebuild(self, constructionType: THUAI7.ConstructionType) -> Future[bool]:
    def Construct(self, constructionType: THUAI7.ConstructionType) -> Future[bool]:
    def GetSelfInfo(self) -> THUAI7.Ship:
    def HaveView(self, gridX: int, gridY: int) -> bool:

    # 大本营接口
    def GetSelfInfo(self) -> THUAI7.Team:
    def InstallModule(
        self, playerID: int, moduleType: THUAI7.ModuleType
    ) -> Future[bool]:
    def Recycle(self, playerID: int) -> Future[bool]:
    def BuildShip(self, shipType: THUAI7.ShipType) -> Future[bool]:
```
