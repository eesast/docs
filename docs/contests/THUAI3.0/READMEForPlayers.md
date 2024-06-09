---
title: THUAI3.0 净土保卫战
sidebar_label: 给选手的 README
---

## 运行说明

- 先运行 runServer.bat ，然后运行 runAgent.bat ，再运行客户端，客户端的运行方式有三种，一是运行 Client 中的InteractionFinal.exe（Unity界面）；二是运行 runClientConsole.bat （Winform界面）；三是运行选手的AI代码。
- 每次运行游戏可以指定队伍数目，最少1队最多4队，更改方法为修改 runServer.bat 中的 --agent 后的数字。
- 可以指定每个队伍里的玩家数目，最少1人最多2人，更改方法为修改 runServer.bat 和 runServer.bat 中的 --playerCount 后的数字（必须两个都修改并保持一致！）。
- 每个Agent对应一支队伍，因此runAgent的次数要与队伍数目相等。例如：游戏中指定队伍数目为2，则运行runServer.bat后还要运行2次runAgent.bat
- 如果运行了多个Agent，则Agent两两之间的监听端口不能相同，否则会引发冲突，修改runAgent.bat中的--port后的数字可以更改Agent的监听端口。
- Client的参数中必须指定要连接到的Agent。例如：游戏中指定2支队伍，两个Agent的监听端口分别为30000和30001，那么第一支队伍的两个玩家在运行Client的时候就要在参数中指定端口为30000，第二支队伍的两个玩家在运行Client的时候就要在参数中指定端口为30001。

## 选手代码

- 选手要写的代码在CAPI文件夹下，用Visual Studio 2019（注意：只能为2019版）打开AI.sln即可在player.cpp里编写代码。
- player.cpp里的play函数被主函数死循环无限执行，选手可以在这个函数里编写自己的AI
- 运行程序: 需事先将windows_only中dll目录下文件放入Debug目录下。
- Debug的时候注意修改调试参数，AI.exe共有2个运行参数，第一个为Agent的IP地址，第二个为Agent的监听端口。

## runClientConsole 用法

- Q W E A D Z X C 分别向八个方向的走路（输入一次连续走1.6格）
- F 捡拾物品或抓取食物产生点/灶台的食材
- R、T 扔东西，然后要再输入一个数字（对应put的distance），按下回车，再输入第二个数字（对应put的angle），按下回车。R丢弃菜肴（Dish） ，T丢弃工具（Tool）
- U 使用物品，然后要再输入一个数字（对应use的parameter1），按下回车，再输入第二个数字（对应use的parameter2），按下回车。
- I 与墙体互动，使用工作台或提交物品
- : 向队友发消息，然后要再输入一句话，按下回车。
- 上帝模式：
  - 在runServer的Console窗口中键入`(~下面那个)则进入上帝模式
  - 输入“Add <物品类型> <物品代码> <X坐标> <Y坐标>”即可生成物品
  - 例："Add Dish 3 15.5 7.5"在(15.5,7.5)的位置生成马铃薯
  - <物品类型>可以为Dish、Tool、Trigger。<物品代码>在MessageToClient.proto中
  - 输入“Move <物品类型> <原X坐标（int型）> <原Y坐标（int型）> <X坐标> <Y坐标>” 即可把物品由原坐标移动到（X坐标，Y坐标）
  - 例："Move Player 3 2 4.8 6.5" 把(3, 2)这个格子内的Player移动到(4.8 6.5)
  - <物品类型>可以为Dish、Tool、Trigger、Player。
- 地图方块：中央深红色为任务提交点，绿色为垃圾桶，黄色为桌子，橙黄色为灶台，白色为墙壁
