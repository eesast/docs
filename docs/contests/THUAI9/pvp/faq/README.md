# 常见问题（PVP / C++）

## 编译与运行

> Q: `CAPI.sln` 编译不通过？
>
> A: 确保使用 **Visual Studio 2022**（v143 工具集），C++17 标准。检查 `CAPI\cpp\lib` 文件夹是否存在，没有则从选手包中复制。

> Q: 怎么修改命令行参数？
>
> A: 在 VS 中：项目属性 → 调试 → 命令参数，如 `-t 1 -p 1 -d`（teamID=1, playerID=1, debug 模式）。

## 游戏机制

> Q: 角色为什么站在原地不动？
>
> A: 每帧都需要发送 `Move` 指令来维持移动。另外确认移动角度计算正确：`atan2(toY - fromY, toX - fromX)`。

> Q: 为什么 BFS 寻路找到的路径走不过去？
>
> A: 只有 `SPACE` 和 `BUSH` 类型格子可以通行。`FACTORY`、`BARRIER`、`RESOURCE`、`COMPUTE_CENTER`、`MARKET` 都有碰撞体积。

> Q: 为什么占领/采集一直失败？
>
> A: 三个条件：(1) 角色在目标九宫格内（Chebyshev ≤1 格）；(2) 角色处于空闲状态（先 `EndAllAction()`）；(3) 占领只能用 Drone 或 Robot。

> Q: 召唤不了第三个角色？
>
> A: 初始 100 算力，每个角色 50。召两个后算力=0，需等待恢复（1 点/秒）或占领算力中心（每个 +2 点/秒）。约 25 秒后可召第三个。

> Q: 调用 `api.Harvest()` 返回 true 但没看到资源增加？
>
> A: 资源存入的是**工厂 Source**（通过 `GetMaterial()` 查看），不是角色背包。角色背包用于装载**产品**到市场售卖。

## 代码

> Q: `play()` 执行时间超过 50ms 怎么办？
>
> A: 下一帧会被跳过。BFS 寻路建议缓存路径，不要每帧重算。用 `std::optional` 存储当前路径，只在需要时重算。

> Q: `std::bad_optional_access` 异常？
>
> A: 对 `std::optional<T>` 调用 `.value()` 前先用 `.has_value()` 检查。
