# C++ 相关小知识

## `play()` 函数的调用机制

- 服务器每 **50ms** 推送一帧数据。
- 每一帧，你的 `play(ICharacterAPI& api)` 或 `play(ITeamAPI& api)` 函数会被调用**一次**。
- 如果你的 `play()` 执行时间超过 50ms，下一帧可能会被跳过。
- 所有 `api.Move()`、`api.Harvest()` 等操作都是**异步发送**到服务器的，不会阻塞 `play()` 函数。但它们返回 `std::future<bool>`，如果调用 `.get()` 会阻塞等待结果。
- 建议不要在 `play()` 中做耗时操作（如在每帧都跑完整 BFS），可以缓存路径结果。

## 坐标系统

THUAI9 的坐标系与常见的屏幕坐标系不同：

- **x 轴正方向 = 竖直向下**
- **y 轴正方向 = 水平向右**
- **角度 0 = 正下方（+x 方向）**
- **角度 π/2 = 正右方（+y 方向）**

计算移动角度时使用：`atan2(toY - fromY, toX - fromX)`

## 地图访问

地图 `GetFullMap()` 返回 `vector<vector<PlaceType>>`，访问方式为：

```cpp
auto map = api.GetFullMap();
// map[row][col] = map[cellY][cellX]
PlaceType pt = map[cellY][cellX];
```

## 常见 BFS 寻路模板

```cpp
// 只允许走空格和草丛
bool IsPassable(PlaceType pt) {
    return pt == PlaceType::Space || pt == PlaceType::Bush;
}

// BFS 寻路到最近目标类型格子
vector<pair<int32_t, int32_t>> BfsToNearest(
    const auto& map, int32_t startCellX, int32_t startCellY, PlaceType target)
{
    int32_t R = map.size(), C = map.front().size();
    // startCellX = col, startCellY = row
    // map[cy][cx] = map[row][col]
    // ... BFS 实现
}
```

## `std::optional` 判断

```cpp
auto res = api.GetResourceState(cellX, cellY);
if (res.has_value()) {
    // res->state, res->hp 等
}
```

## 智能指针

API 返回的角色/队伍信息使用 `std::shared_ptr<const T>`。直接使用 `->` 访问成员即可，不需要手动管理内存。
