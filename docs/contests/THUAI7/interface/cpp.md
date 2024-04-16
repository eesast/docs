# C++ 接口

```cpp
    // 通用接口
    // 发送信息、接受信息，注意收消息时无消息则返回nullopt
    virtual std::future<bool> SendTextMessage(int32_t toPlayerID, std::string) = 0;
    virtual std::future<bool> SendBinaryMessage(int32_t toPlayerID, std::string) = 0;
    [[nodiscard]] virtual bool HaveMessage() = 0;
    [[nodiscard]] virtual std::pair<int32_t, std::string> GetMessage() = 0;

    // 获取游戏目前所进行的帧数
    [[nodiscard]] virtual int32_t GetFrameCount() const = 0;
    // 等待下一帧
    virtual bool Wait() = 0;
    virtual std::future<bool> EndAllAction() = 0;
    [[nodiscard]] virtual std::vector<std::shared_ptr<const THUAI7::Ship>> GetShips() const = 0;
    [[nodiscard]] virtual std::vector<std::shared_ptr<const THUAI7::Ship>> GetEnemyShips() const = 0;
    [[nodiscard]] virtual std::vector<std::shared_ptr<const THUAI7::Bullet>> GetBullets() const = 0;
    [[nodiscard]] virtual std::vector<std::vector<THUAI7::PlaceType>> GetFullMap() const = 0;
    [[nodiscard]] virtual std::shared_ptr<const THUAI7::GameInfo> GetGameInfo() const = 0;
    [[nodiscard]] virtual THUAI7::PlaceType GetPlaceType(int32_t cellX, int32_t cellY) const = 0;
    [[nodiscard]] virtual int32_t GetConstructionHp(int32_t cellX, int32_t cellY) const = 0;
    [[nodiscard]] virtual int32_t GetWormholeHp(int32_t cellX, int32_t cellY) const = 0;
    [[nodiscard]] virtual int32_t GetResourceState(int32_t cellX, int32_t cellY) const = 0;
    [[nodiscard]] virtual int32_t GetHomeHp() const = 0;
    [[nodiscard]] virtual int32_t GetEnergy() const = 0;
    [[nodiscard]] virtual int32_t GetScore() const = 0;
    [[nodiscard]] virtual std::vector<int64_t> GetPlayerGUIDs() const = 0;

    // 船只
    // 指挥本角色进行移动，`timeInMilliseconds` 为移动时间，单位为毫秒；`angleInRadian` 表示移动的方向，单位是弧度，使用极坐标——竖直向下方向为 x 轴，水平向右方向为 y 轴
    virtual std::future<bool> Move(int64_t timeInMilliseconds, double angleInRadian) = 0;
    // 向特定方向移动
    virtual std::future<bool> MoveRight(int64_t timeInMilliseconds) = 0;
    virtual std::future<bool> MoveUp(int64_t timeInMilliseconds) = 0;
    virtual std::future<bool> MoveLeft(int64_t timeInMilliseconds) = 0;
    virtual std::future<bool> MoveDown(int64_t timeInMilliseconds) = 0;
    virtual std::future<bool> Attack(double angleInRadian) = 0;
    virtual std::future<bool> Recover(int64_t recover) = 0;
    virtual std::future<bool> Produce() = 0;
    virtual std::future<bool> Rebuild(THUAI7::ConstructionType constructionType) = 0;
    virtual std::future<bool> Construct(THUAI7::ConstructionType constructionType) = 0;
    virtual std::shared_ptr<const THUAI7::Ship> GetSelfInfo() const = 0;
    virtual bool HaveView(int32_t targetX, int32_t targetY) const = 0;

    // 大本营
    [[nodiscard]] virtual std::shared_ptr<const THUAI7::Team> GetSelfInfo() const = 0;
    virtual std::future<bool> InstallModule(int32_t playerID, THUAI7::ModuleType moduletype) = 0;
    virtual std::future<bool> Recycle(int32_t playerID) = 0;
    virtual std::future<bool> BuildShip(THUAI7::ShipType ShipType, int32_t birthIndex) = 0;

    /*****选手可能用的辅助函数*****/

    // 获取指定格子中心的坐标
    [[nodiscard]] static inline int32_t CellToGrid(int32_t cell) noexcept
    {
        return cell * numOfGridPerCell + numOfGridPerCell / 2;
    }

    // 获取指定坐标点所位于的格子的 X 序号
    [[nodiscard]] static inline int32_t GridToCell(int32_t grid) noexcept
    {
        return grid / numOfGridPerCell;
    }

    // 用于DEBUG的输出函数，选手仅在开启Debug模式的情况下可以使用

    virtual void Print(std::string str) const = 0;
    virtual void PrintShip() const = 0;
    virtual void PrintTeam() const = 0;
    virtual void PrintSelfInfo() const = 0;
```
