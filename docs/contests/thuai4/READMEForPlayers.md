---
title: README
sidebar_label: 给选手的 README
---



文档已经更新，更新详情请参看 [UpdateInfo.md](./UpdateInfo.md)。



## 游戏规则



游戏规则参见 [Introduction.md](./Introduction.md)



## 清彩无限游戏启动



### 1. 本地试玩版

仅为 Windows 选手提供。进入 win 内的 Game 文件夹，阅读 README.txt 游戏说明，运行 LocalUI.exe 进行体验试玩。此版本为稳定版本，但仅用于本地机体验，与比赛无关。  



### 2. 联机测试版

#### runServer、runAgent

同时为 Windows 选手与 linux 选手提供。用记事本分别打开 runServer、runAgent 进行编辑：

+ runServer.cmd

   `--port` 指定 Server 的通信端口，确保此端口是空闲的。

  `--teamCount` 指定队伍的数目，不超过 4，若不指定则默认是 1

  `--playerCount` 指定每支队伍的人数，不超过 4，但总人数不超过 8，若不指定则默认是 1

  `--gameTimeInSecond` 指定游戏时间，以秒为单位，若不指定则默认是 10 分钟

+ runAgent.cmd

   `-s` 后接 Server 的地址和端口，例如`127.0.0.1:20000` 中，`127.0.0.1` 代表 Server 位于本地机，端口号是 `20000`，此端口号必须与 runServer 中的端口号保持一致。`-p` 后接 Agent 自己的端口号，需确保端口是空闲的。


一个可能的 Windows 上的样例（linux 上的是类似的）：

```cmd
:: runServer.cmd
@echo off
exe\Logic.Server.exe --port=20000 --teamCount=1 --playerCount=1
pause

:: runAgent.cmd
@echo off
exe\Agent.exe -s 127.0.0.1:20000 -p 7777
pause
```



#### runServerForDebug

同时为 linux 和 Windows 选手提供。作用与 runServer 完全相同。区别是，runServerForDebug 会在游戏过程中实时输出游戏状态，例如人物走动、子弹爆炸，等等。但是这会拖慢 Server 的运行速度，正式比赛时不使用。



#### runClient.cmd

简易的图形化操作界面，仅为 Windows 选手提供。点击进入游戏，进入选角色界面，可以选择自己的队伍、ID，以及职业。其中队伍号不可超过 Server 中指定的队伍总数，ID 为玩家在队伍中的位置，不得超过 Server 中指定的每队玩家数。  

如果指定的参数不符合要求，会弹出一个写有“Inalid player”的对话框，然后需要重新选择。

Client 操作方式：**采用鼠标键盘结合操作。鼠标右键点击地图时会把鼠标落点作为目的地进行移动。鼠标左键点击某游戏对象时会在右侧窗口显示该游戏对象的信息（显示的信息是点击时的信息而非实时信息，因此若要刷新，则需再次点击）。按下 Q 键将会以鼠标光标所在位置为方向发射彩弹。按下 E 键将会捡起与自己处于同一 cell 的道具，按下 W 键将会使用手中的道具，按下 R 键将会丢弃手中的道具（此客户端接口暂不支持将道具丢到任意位置，选手 C++ 接口将会支持）。游戏中按 A 键将会直接退出 Client。

> runClient.cmd 中可以指定命令行参数而不必手动选择，例如：
>
> ```cmd
> exe\Logic.Client.exe --port=7777 --playerID=0 --teamID=0 --job=0
> ```
>
> `--port` 代表**本机上** Agent 的端口，`teamID` 代表要加入的队伍的序号，`teamID=0`表示第一组，`teamDI=1`表示第二组……；`playerID` 指定本队的第几号队员，例如 `playerID=0` 代表第一个队员……；`job` 指定了角色的序号。
>
> 提供的默认 batch 脚本使用了 `::` 将命令行参数注释掉，想要指定参数的选手需要删除该注释符。



#### 运行方式

编辑完成后先在运行 runServer.cmd，待出现“Server begins to listen!”字样后运行 runAgent.cmd，待出现“Agent starts listening.”字样后可以开始运行 runClient.cmd 开启客户端。只有当各个队伍均满员，即连接到 Server 的客户端数目达到 runServer.cmd 的预设值时 Server 才会开始游戏。对于没有 runClient.cmd 的 linux 用户只能用 CAPI 进行游戏，并依靠手动输出信息以及 runServerForDebug 进行调试。

需要注意 Client 只能和同一台电脑上的 Agent 相连，而 Agent 是可以和同一局域网上的任意一台 Server 连接的。一场游戏当中，Server 有且仅有一个。  



### 3. CAPI

CAPI 内含着选手 C++ 接口，也就是选手将要编写代码的位置。

C++ 接口相应的依赖库存放在 library 文件夹中。

> THUAI4 电子系赛道的官方 Windows 开发工具是 Visual Studio 2019，没有的选手可以在微软官网 https://visualstudio.microsoft.com/zh-hans/downloads/ 进行下载。
> 对于在 Linux 上开发的选手，届时我们会提供 makefile 文件进行编译，请下载好 make，以及支持 C++17 的 g++ 编译器，例如 g++ 7.1 以上版本。
> 游戏的逻辑与通信采用 .Net Core 3.1 进行开发。如果运行 server 或 Agent 时提示缺少 .Net Core 3.1 Runtime，则需要到 https://dotnet.microsoft.com/download/dotnet 下载 .Net Core 3.1 Runtime；或者使用 VS 2019 的修改工具，安装 .net 开发，可以自动安装 .Net Core SDK。

对于 Windows 选手，library 文件夹内存在 lib 和 dll 两个文件夹。之后将 **lib 文件夹**复制到与 CAPI.vcxproj 文件相同的目录内，而对于 dll 文件夹，需要等到生成完成后，把 **dll 文件夹内的所有 .dll** 复制到 .exe 文件的相同目录。.exe 文件的位置与生成环境有关。如果选择 x86 ，则将会在 **.sln** 同目录的 Debug 和 Release 文件夹内；如果选择 x64，则会在 **.sln** 同目录的 x64 文件夹内的 Debug 或 Release 文件夹内。由于当前 Debug 和 Release 模式下提供的库均是 64 位的，因此**请在 Debug x64 或 Release x64** 两个模式下进行生成。此解决方案与项目均由 Visual Studio 2019 生成，低版本的 Visual Studio 可能存在版本兼容性问题。

对于 linux 选手，library 文件夹内存在 so 和 a 两个文件夹，需要**将这两个文件夹**放置到 CAPI 文件夹内的 makefile 文件的相同目录。在 makefile 文件夹中打开 bash，运行 `make` （需要预先安装 make），将会编译生成可执行文件 `PLAYER`，运行时运行 `PLAYER` 文件即可。可以在该目录运行 `make clean` 指令清空所有编译生成的文件。  

选手的 linux 系统需要安装支持 C++17 的 g++。

CAPI 本身作为客户端，承担**与联机测试版中的 Client 同样的角色**。CAPI 与 Client 分别都可以操控一个游戏角色进行游戏。因此，你可以用 Client 与自己的代码相互对战或作为队友进行游戏，来达到调试的目的。

选手只需要编写 CAPI/CAPI/src/player.cpp ，实现 `void AI::play(GameApi&)` 函数即可。具体编写方法参见 CAPI 内的 API.md。

**注**：虽然 `Server` 与 `Client` 都是支持相对宽泛的队伍数和每队人数的（总人数不超过 8，队伍数不能超过4），但是 CAPI 的队伍数不能超过 4，每队人数不能超过 2。



### 4. Unity界面

仅为 Windows 选手提供，位于 win 文件夹的 Unity 文件夹内。

Unity 有三种模式：

Local Game 是开发者调试时使用，与比赛无任何关系。

playback 模式目前暂未开放，敬请期待！

AI Battle 模式的地位与 CAPI 和 Client 的地位等价，即作为一个玩家的操控者。

以下讨论均为 AI Battle 模式。

Unity 界面旨在为选手提供一个观看比赛状况的工具，给选手以炫酷的视觉体验。



**操作**：

移动：WSAD

开枪：E	

（无用）捡道具：P

（无用）使用道具：L



**修改端口参数**：

编辑 `Coloring go！_Data\StreamingAssets\JobTest.txt` 中的四个数字，其中：

第一个数字为 Agent 的端口号，第二个为TeamID，第三个为PlayerID，第四个为角色编号，角色编号和规则中介绍的角色对应，从0开始。



**注意**：

电脑不接电源时界面画质会较低，人物移动也会有卡顿，可能影响体验。

移动的响应同代码接口，一个指令发出后会移动固定时间（这个时间在比赛中选手可以通过代码调整），同时上次移动完成后才能进行下一次移动，所以本质上不是实时响应。所以键盘操作会有一丝卡顿感（可能没有），是正常现象。

开枪的朝向在界面代码中固定了，无法用键盘控制。

**上述特性和最后比赛没有任何关系**

