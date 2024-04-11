---
title: THUAI3.0选手API
sidebar_label: THUAI3.0选手API
---

## 玩家操作

- bool THUAI3::move(Direction direction_t, int duration)
    
    人物移动，第一个参数为移动方向，一共有8个方向，分别是右，右上，上，左上，左，左下，下，右下。
    第二个参数为移动的时间（以毫秒计算），本游戏帧率为20，选手初始移动速度为每秒4个单位，如设定移动时间为1000则会在接下来的1秒内每50毫秒移动一次，每次移动距离为0.2。

	返回值表示消息是否发送成功。

- bool THUAI3::put(double distance, double angle, bool isThrowDish);
    
    扔出物品，第一个参数为扔出的距离，物品的飞行速度是每秒10个单位。第二个参数为扔出时的绝对角度，单位为弧度制。第三个参数为是否扔出食材，若为true则扔出手中食材，若为false则扔出道具。

	返回值表示消息是否发送成功。

- bool THUAI3::use(int type, double parameter1, double parameter2)
    
    使用物品，第一个参数为使用类型，0为使用厨具或提交菜品，非0为使用手中的物品。后两个参数仅在使用传送门、锤子、弓箭时有效，parameter1为使用的距离，parameter2为使用的角度。

	返回值表示消息是否发送成功。

- bool THUAI3::pick(bool isSelfPosition, ObjType pickType, int dishOrToolType);
    
    捡起物品。第一个参数为是否捡起自身所在方格的物品，若为true，则先检索自身所在方格，否则检索自己面对方向的方格。第二个参数为捡起的物品类型，可以为Block、Dish、Tool；若为Block表示捡起食物生产点或灶台里的食物，若为Dish表示捡起食物，若为Tool表示捡起道具。第三个参数为捡起的Dish或Tool类型，如果第二个参数为Dish，则这个参数必须与有效的DishType相对应，如果第二个参数为Tool，则这个参数必须与有效的ToolType相对应。若第三个参数为-1，表示随缘瞎捡。

	返回值表示消息是否发送成功。

- bool THUAI3::speakToFriend(string speakText)
    
    向队友说话，每次最多只能发16个字符，多的截取前16个字符。

	返回值表示消息是否发送成功。

- unsigned long long THUAI3::getGameTime()

	获取目前距离游戏开始的时间，单位为毫秒。

- void PauseCommunication(); 

	暂停数据更新，用于Debug。

- void ResumeCommunication();

	继续数据更新，用于Debug。

- void wait();

	等待下一次消息更新的到来。
	

## 数据结构

	enum ObjType { //可能出现在地图上的各种物品
	  People = 0;  //人
	  Block = 1;   //墙体
	  Dish = 2;    //食材
	  Tool = 3;    //道具
	  Trigger = 4; //触发器
	  ObjTypeSize = 5;
	}
	enum BlockType {  //标1的物品扔出碰到会反弹，标0的会穿过去
	  Wall = 0;       // 1
	  Table = 1;      // 0
	  FoodPoint = 2;  // 1
	  Cooker = 3;     // 0
	  RubbishBin = 4; // 0
	  TaskPoint = 5;  // 1
	  BlockTypeSize = 6;
	}
	enum DishType {
	  DishEmpty = 0;
	  //以下为食材
	  Wheat = 1;   //麦子
	  Rice = 2;    //水稻
	  Tomato = 3;  //番茄
	  Egg = 4;     //鸡蛋
	  Beef = 5;    //牛肉
	  Pork = 6;    //猪肉
	  Potato = 7;  //土豆
	  Lettuce = 8; //生菜
	  DishSize1 = 9;
	  //以下为中间产物
	  Flour = 10;   //面粉
	  Noodle = 11;  //面条
	  Bread = 12;   //面包片
	  Ketchup = 13; //番茄酱
	  //以下为菜品
	  CookedRice = 14;           //米饭
	  TomatoFriedEgg = 15;       //番茄炒蛋
	  TomatoFriedEggNoodle = 16; //西红柿鸡蛋面
	  BeefNoodle = 17;           //清青牛拉
	  OverRice = 18;             //盖浇饭
	  Barbecue = 19;             //烤肉
	  FrenchFries = 20;          //薯条
	  Hamburger = 21;            //汉堡
	  SpicedPot = 22;            //香锅
	  SpicedPot3 = 23;
	  SpicedPot4 = 24;
	  SpicedPot5 = 25;
	  SpicedPot6 = 26;
	  DishSize2 = 27;
	  //以下为垃圾
	  OverCookedDish = 28;
	  DarkDish = 29; //黑暗料理
	  DishSize3 = 30;
	}
	enum ToolType {     //道具
	  ToolEmpty = 0;    //
	  TigerShoes = 1;   //虎头鞋，穿上加速，扔掉恢复原速
	  SpeedBuff = 2;    //加速，一定时间内加速
	  StrengthBuff = 3; //加力量，一定时间内增加扔物品的距离
	  TeleScope = 4;    //望远镜，增加视野范围
	  Condiment = 5;    //调料，提交香锅时专用
	  Fertilizer = 6;   //肥料，加速做菜
	  BreastPlate = 7;  //护心镜，防止各种攻击性道具
	  SpaceGate = 8;    //传送门，瞬间传送到指定地点
	  // Eye = 9;
	  WaveGlueBottle = 9; //滔牌胶水，踩上后会减速，过一段时间自行消失
	  LandMine = 10;    //放置地雷
	  TrapTool = 11;    //放置陷阱
	  FlashBomb = 12;   //防止闪光炸弹
	  ThrowHammer = 13; //扔锤子
	  Bow = 14;         //弓箭
	  Stealer = 15;     //偷东西，可以偷食材
	  ToolSize = 16;
	}
	enum TriggerType {
	  WaveGlue = 0; //滔牌胶水，踩上后会减速，过一段时间自行消失
	  Trap = 1; //陷阱，踩上后有一段时间不能动弹，地图上不可见
	  Mine = 2; //地雷，踩上后减分数并眩晕一段时间，地图上不可见
	  Bomb = 3; //炸弹，踩上后眩晕一段时间，并掉落身上的食材和道具，地图上不可见
	  Arrow = 4; //箭，被射中后扣一定的分数并眩晕一段时间
	  Hammer = 5; //锤子，被砸中后眩晕一段时间并掉落身上的食材和道具
	  TriggerSize = 6;
	}
	enum Direction {
	  Right = 0;
	  RightUp = 1;
	  Up = 2;
	  LeftUp = 3;
	  Left = 4;
	  LeftDown = 5;
	  Down = 6;
	  RightDown = 7;
	  DirectionSize = 8;
	}
	enum Talent {
	  None = 0;
	  Runner = 1;    // 跑步加速
	  StrongMan = 2; //扔东西距离变远，扔锤子和射箭伤害更大
	  Cook = 3;      //制作食材获得分数有一定加成
	  Technician = 4; //防止地雷、陷阱、炸弹、使用传送门有一定加成
	  LuckyBoy =
	      5; //每隔一段时间在手上生成一个道具，若手上已有道具则在身边的地面生成
	  TalentSize = 6;
	}

## 玩家自身信息

	PlayerInfo
	{
	XYPosition position = XYPosition(0, 0);					//玩家自身位置
	int64_t id = -1;										//玩家自身id
	int team = 0;											//玩家所属队伍
	Direction facingDirection;								//玩家当前面朝的方向
	double moveSpeed;										//玩家当前移动速度
	int sightRange = Constant::Player::InitSightRange;		//玩家的视野半径
	Talent talent = initTalent;								//玩家的天赋
	int score = 0;											//玩家所在队伍当前的分数
	DishType dish = DishType::DishEmpty;					//玩家手上拿的食材，只能同时拿一个
	ToolType tool = ToolType::ToolEmpty; 					//玩家手上拿的道具，只能同时拿一个
	std::string recieveText; 								//玩家接受到的同一队伍的其他玩家发的消息，若另一玩家没有再次发消息，则一直保持上一次接收到的消息
	}

## 地图API

	class MapInfo
	{
	static std::list<Obj> get_mapcell(int x, int y);//获取位于(x,y)位置的地图方格的所有物品，返回一个列表。若尝试获取视野外的方块会返回一个空表
	};


	class Obj
	{
	XYPosition position;		//Obj位置
	ObjType objType;			//Obj所属类型
	BlockType blockType;		//如果objType为Block，所属的墙体类型
	DishType dish;				//如果objType为Dish，所属的食材类型；如果objType为People，拥有的食材类型
	ToolType tool;				//如果objType为Tool，所属的道具类型；如果objType为People，拥有的道具类型
	TriggerType trigger;		//如果objType为Trigger，所属的触发器类型
	Direction facingDiretion;	//如果objType为People，面朝的方向
	int team;					//如果objType为People，所属的队伍
	};

## 任务列表

	std::list<DishType> task_list;//玩家应该提交的食品。
