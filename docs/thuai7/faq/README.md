# 常见问题

## 简单问题

> Q: Windows找不到文件：`\CAPI\cpp\x64\Debug\APl.exe`？
>
> A: 应该是还没有编译，打开 `CAPI\cpp` 目录，在里面打开 `CAPI.sln`，然后点击生成，对代码进行编译。

> Q: 为什么 `CAPI.sln` 打开后会找不到项目？
> ![zip](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/zip.png)
>
> A: 要先解压。

> Q: 怎么修改 `.cmd` 参数？
>
> A: 见选手包中的使用文档部分。

> Q: 卡死在第一帧不动？
>
> A: 大概率是你的代码死循环了。

> Q:
> ![wrongType](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/wrongType.png)
>
> A:命令行参数的 `type` 设置有误。

## C++

> Q: 显示API项目已卸载？
> ![Nocplus](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/Nocplus.png)
>
> A: 可能是没有安装C++。

> Q: `CAPI.sln` 编译不通过(第一种)？
>
> 情况1：
> ![std_find_trivial](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/std_find_trivial.jpg)
> 情况2：
> ![LNK1000](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/LNK1000.png)
>
> A:
> 1. 应该是没使用 VS 2022；
> 2. 对于 VS 2022 依旧报错，先考虑是否版本过旧（应当在 17.5.x 版本）：
>    用 Visual Studio Installer（在开始菜单搜索）更新；
>    ![VsUpdate](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/VSUpdate.png)
> 3. ![项目属性](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/项目属性.png)
>    确保上图项目属性中平台工具集在 v143，C++17 标准。

> Q: CAPI编译不通过（第二种）？
> ![lib](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/lib.png)
>
> A: 查看 `.\win\CAPI\cpp\` 文件夹下是否有 `lib` 文件夹，没有则 https://cloud.tsinghua.edu.cn/d/6972138f641d4e81a446/ 下载并复制粘贴。

> Q: 编译好慢啊？
>
> A:
> 1. 尽量不要改其他文件，甚至连点下保存都别点；
> 2. 不要点重新生成，要点生成；
> 3. 开启下图选项。
> ![CompileFaster](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/CompileFaster.png)

> Q: 这是什么错误啊？
> ![vector](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/vector.png)
>
> A: 调用了容量为 0 的 `vector`。

## Python

### grpc版本更新失败

> Q: 运行 `GeneratePythonProto.cmd` 报错？
> ![grpcUpdate](https://raw.githubusercontent.com/shangfengh/THUAI6/new/resource/grpc.png)
>
> A: 可能措施：
> 1. 首先保证 Python 版本在 3.9 及以上；
> 2. 更换为国内镜像源：在终端输入 `pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple`；
> 3. 更新 pip：`python -m pip install --upgrade pip` （pip 版本最好为23.1）。

## 游戏引擎/机制

> Q: 咱们这边 play 函数调用机制究竟是怎么样的？如果50ms内没有执行完当前程序，是在下一帧不会重新调用 play 吗？还是只有 move 这样的明确有时间为参量的才会有上面那个机制？
>
> A:
> - 调用任何主动指令都不会占用你 play 函数多少时间，你可以把它想成一个信号，告诉游戏引擎你想做什么；
> - 50ms内没有执行完当前程序，是指你的play函数例如求最短路之类的操作会占用的时间；
> - 准确地说，50ms 内没有执行完当前程序，在下一帧一般会重新调用 play；
> - 比如说，你第一次调用花了 70ms，那么下一次调用会在这次之后立刻开始。如果你三次都 70ms，就会 4 帧 3 次 play 了；
> - 当然第一次调用花了 110ms，第二帧自然不调用了。

## 比赛相关

> Q: 职业数值会修改吗？
>
> A: 初赛结束会调数值及机制

> Q: 初赛后会修改什么呢？
>
> A: 可能的修改：