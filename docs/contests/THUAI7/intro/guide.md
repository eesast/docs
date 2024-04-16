# 指南

你可能对 THUAI7 一头雾水，不知道何从下手。本文档将会带你一步步了解 THUAI7 的各个部分。

## 什么是 THUAI7？

[**THUAI7**](https://github.com/eesast/THUAI7) 是一个由 [**EESΛST**](https://eesast.com/) 软件部带来的一个将即时战略、团队合作对抗、多人射击巧妙~~缝合~~结合的新型游戏。

与一般的游戏不同的是，它并不需要各位选手亲手操作，而是通过 C++、Python 等编程语言，编写程序，让你的程序代替你进行游戏。

## 如何开始进行游戏？

你可以在电子系科协网站 [试玩](https://eesast.com/login#/contest/playground?contest=b4e3f620-49f7-4883-ba0f-81cbfdcf6196)，大致体验本次赛事的基本玩法。

随后，你可以打开 `installer.exe`，下载选手开发包。下载完成后，进行进一步开发：

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="cpp" label="C++" default>


用最新版Visual Studio打开 `CAPI/cpp/CAPI.sln`，然后选择源代码/`AI.cpp`，修改 `void AI::play(IShipAPI& api)` 和 `void AI::play(ITeamAPI& api)` 两个函数，进行自己的开发，开发结束后不要忘记进行编译

</TabItem>
<TabItem value="python" label="Python">

运行 `CAPI/python/generate_proto.cmd`，然后在 `CAPI/python/PyAPI/AI.py` 中修改 `def ShipPlay(self, api: IShipAPI) -> None:` 与 `def TeamPlay(self, api: ITeamAPI) -> None:` 两个函数，进行自己的开发

</TabItem>
</Tabs>

设计完自己的策略后，在启动器上方选择 `Launch`，选中自己使用的语言，点击保存-启动即可。
