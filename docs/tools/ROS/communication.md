---
title: Communication
---

## ROSTOPIC

Dependence: std_msgs/geometry_msgs/rospy/roscpp/turtlesim

### Publisher

#### Cpp

##### Code

``` cpp
// ! velocity_publisher.cpp

## include <ros/ros.h>
## include <geometry_msgs/Twist.h>

int main(int argc,char ** argv){

    // 初始化ROS节点，节点名为velocity_publisher
    ros::init(argc,argv,"velocity_publisher");
    // 创建节点句柄，是用于与ROS系统进行交互的一个对象，可视为一个ROS节点与ROS系统之间的接口
    ros::NodeHandle n;
    // 创建话题发布者，发布名为turtle1/cmd_vel的话题，消息类型为geometry_msgs::Twist
    // 此处话题名称不能改变，因为需要被ros自带的turtlesim_node订阅，发布/订阅双方需要共同话题
    ros::Publisher turtle_vel_pub = n.advertise<geometry_msgs::Twist>("/turtle1/cmd_vel",10);
    // 设置循环发布的频率
    ros::Rate loop_rate(10);

    int count = 0;
    while(ros::ok()){
        // 创建消息
        geometry_msgs::Twist vel_msg;
        vel_msg.linear.x = 0.5;
        vel_msg.angular.z = 0.2;
        // 发布消息
        turtle_vel_pub.publish(vel_msg);
        // 打一些log
        ROS_INFO("Publish turtle velocity command [%0.2f m/s, %0.2f rad/s]", vel_msg.linear.x, vel_msg.angular.z);
        // 按照循环频率延时
        loop_rate.sleep();
    }
    
    return 0;
}
```

##### Config CMakeLists.txt

```lua
    add_executable(velocity_publisher src/velocity_publisher.cpp)
        -- 添加可执行文件
        -- add_executable(<name> <source>)
        -- 将<source>编译成名为<name>的可执行文件
    target_link_libraries(velocity_publisher ${catkin_LIBRARIES})
        -- target_link_libraries(<name> ${catkin_LIBRARIES})
        -- 链接所需的库到可执行文件中
```

##### Compile and Run

```lua
    cd <path>/<ws_n>/
    catkin_make
    source ./devel/setup.bash
    roscore
    rosrun turtlesim turtlesim_node
    rosrun <pkg_n> velocity_publisher
```

#### Python

```lua
    chmod +x velocity_publisher.py
        -- 注意要添加可执行权限
```

##### Code

``` python
## ! velocity_publisher.py

import rospy
from geometry_msgs.msg import Twist

def velocity_publisher():
    ## 初始化ROS节点，节点名为velocity_publisher
    ## anonymous=True参数使节点名称唯一化，以避免与其他具有相同名称的节点冲突
    rospy.init_node("velocity_publisher", anonymous=True)
    ## 创建话题发布者，发布名为turtle1/cmd_vel的话题，消息类型为geometry_msgs::Twist
    turtle_vel_pub = rospy.Publisher('/turtle1/cmd_vel', Twist, queue_size=10)
    ## 设置循环发布的频率
    rate = rospy.Rate(10)

    while not rospy.is_shutdown():
        ## 创建消息
        vel_msg = Twist()
        vel_msg.linear.x=0.5
        vel_msg.angular.z=0.2
        ## 发布消息
        turtle_vel_pub.publish(vel_msg)
        ## 打一些log
        rospy.loginfo("Publish turtle velocity command [%0.2f m/s, %0.2f rad/s]", vel_msg.linear.x, vel_msg.angular.z)
        ## 按照循环频率延时
        rate.sleep()

if __name__ == '__main__':
    try:
        velocity_publisher()
    except rospy.ROSInterruptException:
        pass
```

##### Config CMakeLists.txt

```lua
    catkin_install_python(PROGRAMS scripts/velocity_publisher.py DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION})
        -- 添加python文件
        -- catkin_install_python(PROGRAMS <scripts> DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION})
```

##### Run

```lua
    cd <path>/<ws_n>/
    catkin_make
    source ./devel/setup.bash
    roscore
    rosrun turtlesim turtlesim_node
    rosrun <pkg_n> velocity_publisher.py
```

### Subscriber

#### Cpp

``` cpp
// ! pose_subscriber.cpp

## include <ros/ros.h>
## include <turtlesim/Pose.h>

// 回调函数，类似于嵌入式开发中的中断函数，具有固定的格式
// turtlesim::Pose是消息类型，与发布话题"/turtle1/pose"的消息类型需一致
// ConstPtr 是一个常指针
void poseCallBack(const turtlesim::Pose::ConstPtr& msg){
    ROS_INFO("Turtle pose: x:%0.6f, y:%0.6f", msg->x, msg->y);
}

int main(int argc, char** argv){
    
    ros::init(argc, argv, "pose_subscriber");
    ros::NodeHandle n;

    // Subscriber注册了回调函数poseCallBack
    ros::Subscriber pose_sub = n.subscribe("/turtle1/pose", 10, poseCallBack);
    // 循环等待回调函数
    ros::spin();

    return 0;
}
```

#### Python

``` python
## ! pose_subscriber.py

import rospy
from turtlesim.msg import Pose

## 与Cpp类似
def poseCallBack(msg):
    rospy.loginfo("Turtle pose: x:%0.6f, y:%0.6f", msg.x, msg.y)

def pose_subscriber():
    rospy.init_node("pose_subscriber", anonymous=True)
    rospy.Subscriber("/turtle1/pose", Pose, poseCallBack, queue_size=10)
    rospy.spin()

if __name__ == '__main__':
    pose_subscriber()
```

### Message Type

#### Create a custom message

##### Add .msg file

```go
// ! Person.msg

string name
uint8 sex
uint8 age

uint8 unknown = 0
uint8 male = 1
uint8 female = 2
```

##### Config package.xml

添加依赖：

```xml
    <build_depend>message_generation</build_depend>
    <exec_depend>message_runtime</exec_depend>
```

##### Config CMakeLists.txt

添加依赖：

```lua
    find_package( ... message_generation)
        -- 定位并加载 message_generation 包
        -- 在ROS中，消息是使用 .msg 文件定义的，而 message_generation 包提供了生成这些消息文件代码所需的工具
        -- 与 package.xml 的编译依赖需一致
    add_message_files(FILES Person.msg)
        -- 向 ROS 软件包添加消息文件
    generate_messages(DEPENDENCIES std_msgs)
        -- 生成与消息文件相关的代码
    catkin_package( ... CATKIN_DEPENDS ... message_runtime)
        -- 配置ROS软件包的构建参数和依赖项
```

#### Test

##### Cpp

``` cpp
// ! person_publisher.cpp

## include <ros/ros.h>
## include "learning_topic/Person.h"

int main(int argc,char ** argv){
    
    ros::init(argc, argv, "person_publisher");
    ros::NodeHandle n;
    ros::Publisher person_info_pub = n.advertise<learning_topic::Person>("/person_info", 10);
    ros::Rate loop_rate(1);

    int count = 0;
    while(ros::ok()){
        learning_topic::Person person_msg;
        person_msg.name = "Name";
        person_msg.age = 99;
        person_msg.sex = learning_topic::Person::female;
        person_info_pub.publish(person_msg);
        ROS_INFO("Publish Person info: name:%s age:%d sex:%d", person_msg.name.c_str(), person_msg.age, person_msg.sex);
        loop_rate.sleep();
    }
    return 0;
}
```

``` cpp
// ! person_subscriber.cpp

## include <ros/ros.h>
## include "learning_topic/Person.h"

void personInfoCallBack(const learning_topic::Person::ConstPtr& msg){
    ROS_INFO("Publish Person info: name:%s age:%d sex:%d", msg->name.c_str(), msg->age, msg->sex);
}

int main(int argc, char** argv){
    
    ros::init(argc, argv, "person_subscriber");
    ros::NodeHandle n;
    ros::Subscriber info_sub = n.subscribe("/person_info", 10, personInfoCallBack);
    ros::spin();

    return 0;
}
```

##### Config CMakeLists.txt: 

```lua
    add_executable(person_publisher src/person_publisher.cpp)
    add_executable(person_subscriber src/person_subscriber.cpp)
    add_dependencies(person_publisher ${PROJECT_NAME}_generate_messages_cpp)
    add_dependencies(person_subscriber ${PROJECT_NAME}_generate_messages_cpp)
        -- 设置ROS节点的依赖关系
        -- 告诉CMake系统在构建person_publisher/person_subscriber之前先构建依赖目标${PROJECT_NAME}_generate_messages_cpp
        -- 确保了所有相关的目标都已成功构建，以便person_publisher/person_subscriber可以正常运行
    target_link_libraries(person_publisher ${catkin_LIBRARIES})
    target_link_libraries(person_subscriber ${catkin_LIBRARIES})
```

##### Python: 

``` python
## ! person_publisher.py

import rospy
from learning_topic.msg import Person

def velocity_publisher():
    rospy.init_node('person_publisher', anonymous=True)

    person_info_pub = rospy.Publisher('/person_info', Person, queue_size=10)
    rate = rospy.Rate(10) 

    while not rospy.is_shutdown():
        person_msg = Person()
        person_msg.name = "Tom"
        person_msg.age  = 18
        person_msg.sex  = Person.male

        person_info_pub.publish(person_msg)
        rospy.loginfo("Publsh person message[%s, %d, %d]", person_msg.name, person_msg.age, person_msg.sex)
        rate.sleep()

if __name__ == '__main__':
    try:
        velocity_publisher()
    except rospy.ROSInterruptException:
        pass
```

``` python
## ! person_subscriber.py

import rospy
from learning_topic.msg import Person

def personInfoCallback(msg):
    rospy.loginfo("Subcribe Person Info: name:%s  age:%d  sex:%d", msg.name, msg.age, msg.sex)

def person_subscriber():
    rospy.init_node('person_subscriber', anonymous=True)

    rospy.Subscriber("/person_info", Person, personInfoCallback)
    rospy.spin()

if __name__ == '__main__':
    person_subscriber()
```

## ROSSERVICE

Dependence：std_msgs/geometry_msgs/rospy/roscpp/turtlesim

### Client

#### Cpp

``` cpp
// ! turtle_spawn.cpp

## include <ros/ros.h>
## include <turtlesim/Spawn.h>

int main(int argc, char** argv){

    ros::init(argc, argv, "turtle_spawn");
    ros::NodeHandle n;

    // 发现/spawn服务后，创建一个服务客户端，连接名为/spawn的服务
    ros::service::waitForService("/spawn");
    ros::ServiceClient add_turtle = n.serviceClient<turtlesim::Spawn>("/spawn");

    // 初始化turtlesim::Spawn类型的请求数据
    turtlesim::Spawn srv;
    srv.request.x = 2.0;
    srv.request.y = 2.0;
    srv.request.name = "turtle2";

    // 请求服务调用
    ROS_INFO("Call service to spawn turtle [x:%0.6f y:%0.6f name:%s]", 
        srv.request.x, srv.request.y, srv.request.name.c_str());
    add_turtle.call(srv);
    // 显示调用结果
    ROS_INFO("Spawn turtle successfully [name:%s]", srv.response.name.c_str());

    return 0;
}
```

#### Python

``` python
## ! turtle_spawn.py

import rospy
from turtlesim.srv import Spawn

def turtle_spawn():
    rospy.init_node("turtle_spawn", anonymous=True)
    rospy.wait_for_service("/spawn")

    try:
        add_turtle = rospy.ServiceProxy("/spawn", Spawn)
        reponse = add_turtle(2.0, 2.0, 0.0, 'turtle2')
        return reponse.name
    except rospy.ServiceException as e:
        print("Service call failed: %s", e)

if __name__ == "__main__":
    print("Spawn turtle successfully [name:%s]", turtle_spawn())
```

### Server

#### Cpp

``` cpp
// ! turtle_command_server.cpp

## include <ros/ros.h>
## include <geometry_msgs/Twist.h>
## include <std_srvs/Trigger.h>

// 同时实现一个service和一个topic，server控制小海龟是否能够行动，publisher控制小海龟的行动轨迹
bool pubCommand = false;

// 回调函数，client向server发送请求时，server调用
bool commandCallBack(std_srvs::Trigger::Request& req, std_srvs::Trigger::Response& res){
    pubCommand = !pubCommand; 
    // 显示请求数据
    ROS_INFO("Publish turtle velocity command [%s]", pubCommand ? "Yes" : "No");
    // 设置反馈数据
    res.success = true;
    res.message = "Change turtle command state!";
    return true;
}
int main(int argc, char** argv){
    ros::init(argc, argv, "turtle_command_server");
    ros::NodeHandle n;
    ros::ServiceServer command_service = n.advertiseService("/turtle_command", commandCallBack);
    ros::Publisher turtle_vel_pub = n.advertise<geometry_msgs::Twist>("turtle1/cmd_vel", 10); 
    ROS_INFO("Ready to receive turtle command");
    ros::Rate loop_rate(10);

    while(ros::ok()){
        // server: 查看一次回调函数序列
        ros::spinOnce();
        // publisher: 如果标志为true，发布速度指令
        if(pubCommand){
            geometry_msgs::Twist vel_msg;
            vel_msg.linear.x = 0.5;
            vel_msg.angular.z = 0.2;
            turtle_vel_pub.publish(vel_msg);
        }
        loop_rate.sleep();
    }
}
```

#### Python 

``` python
## ! turtle_command_server.py

import time
import threading
import rospy
from geometry_msgs.msg import Twist
from std_srvs.srv import Trigger
from std_srvs.srv import TriggerResponse

pubCommand = True

## 由于rospy中未提供spinOnce函数，所以只能用spin，而spin与while True都是死循环，为了同时运行service和publisher，需要开一个新线程
def command_thread():
    turtle_vel_pub = rospy.Publisher('/turtle1/cmd_vel', Twist, queue_size=10)
    while True:
        if pubCommand:
            vel_msg = Twist()
            vel_msg.linear.x = 0.5
            vel_msg.angular.z = 0.2
            turtle_vel_pub.publish(vel_msg)
        time.sleep(0.1)

def commandCallBack(req):
    global pubCommand
    pubCommand = not pubCommand
    rospy.loginfo("Publish turtle velocity command [%d]", pubCommand)
    return TriggerResponse(1, "Change turtle command state!")

def turtle_command_server():
    rospy.init_node("turtle_command_server", anonymous=True)
    s = rospy.Service('/turtle_command', Trigger, commandCallBack)
    rospy.loginfo("Ready to receive turtle command")
    threading.Thread(target=command_thread).start()
    rospy.spin()

if __name__ == '__main__':
    turtle_command_server()
```

### Service Type

##### Add Person.srv 

``` go
// ! Person.srv

string name
uint8 sex
uint8 age

uint8 unknown = 0
uint8 male = 1
uint8 female = 2

// request与response以“---”分割
---
string result
```

##### Config package.xml

添加依赖：
```xml
    <build_depend>message_generation</build_depend>
    <exec_depend>message_runtime</exec_depend>
```

##### Config CMakeLists.txt

添加依赖：
```lua
    find_package( ... message_generation)
        -- 定位并加载 message_generation 包
        -- 在ROS中，消息是使用 .msg 文件定义的，而 message_generation 包提供了生成这些消息文件代码所需的工具
        -- 与 package.xml 的编译依赖需一致
    add_service_files(FILES Person.srv)
        -- 向 ROS 软件包添加消息文件
    generate_messages(DEPENDENCIES std_msgs)
        -- 生成与消息文件相关的代码
    catkin_package( ... CATKIN_DEPENDS ... message_runtime)
        -- 配置ROS软件包的构建参数和依赖项
```

#### Test

##### Cpp

``` cpp
// ! person_server.cpp
 
#include <ros/ros.h>
#include "learning_service/Person.h"

bool personCallback(learning_service::Person::Request& req, learning_service::Person::Response& res){
    ROS_INFO("Person: name:%s  age:%d  sex:%d", req.name.c_str(), req.age, req.sex);
	res.result = "OK";
    return true;
}

int main(int argc, char **argv)
{
    ros::init(argc, argv, "person_server");
    ros::NodeHandle n;
    ros::ServiceServer person_service = n.advertiseService("/show_person", personCallback);
    ROS_INFO("Ready to show person informtion.");
    ros::spin();

    return 0;
}
```

``` cpp
// ! person_client.cpp

#include <ros/ros.h>
#include "learning_service/Person.h"

int main(int argc, char** argv)
{
	ros::init(argc, argv, "person_client");
	ros::NodeHandle node;
	ros::service::waitForService("/show_person");
	ros::ServiceClient person_client = node.serviceClient<learning_service::Person>("/show_person");

	learning_service::Person srv;
	srv.request.name = "Tom";
	srv.request.age  = 20;
	srv.request.sex  = learning_service::Person::Request::male;
	ROS_INFO("Call service to show person[name:%s, age:%d, sex:%d]", srv.request.name.c_str(), srv.request.age, srv.request.sex);

	person_client.call(srv);
	ROS_INFO("Show person result : %s", srv.response.result.c_str());

	return 0;
};
```

##### Python

``` python
## ! person_server.py

import rospy
from learning_service.srv import Person, PersonResponse

def personCallback(req):
    rospy.loginfo("Person:  name:%s  age:%d  sex:%d", req.name, req.age, req.sex)
    return PersonResponse("OK")

def person_server():
    rospy.init_node('person_server')
    s = rospy.Service('/show_person', Person, personCallback)
    print("Ready to show person informtion")
    rospy.spin()

if __name__ == "__main__":
    person_server()
```

``` python
## ! person_client.py

import rospy
from learning_service.srv import Person, PersonRequest

def person_client():
    rospy.init_node('person_client')
    rospy.wait_for_service('/show_person')
    try:
        person_client = rospy.ServiceProxy('/show_person', Person)
        response = person_client("Tom", 20, PersonRequest.male)
        return response.result
    except rospy.ServiceException as e:
        print("Service call failed: %s", e)

if __name__ == "__main__":
    print("Show person result : %s", person_client())
```

## PARAMETER

Dependence: std_srvs/rospy/roscpp

#### Test

##### Cpp

``` cpp
// ! parameter_config.cpp

#include <string>
#include <ros/ros.h>
#include <std_srvs/Empty.h>

int main(int argc, char **argv)
{
	int red, green, blue;
    ros::init(argc, argv, "parameter_config");
    ros::NodeHandle node;
    
    // 读写param均有两种等价的方式
    // 读取背景颜色参数
	// 不同版本的参数名称可能有所区别，可通过命令行工具查看具体名称
	node.getParam("/turtlesim/background_r", red);
	node.getParam("/turtlesim/background_g", green);
	node.getParam("/turtlesim/background_b", blue);
	ROS_INFO("Get Backgroud Color[%d, %d, %d]", red, green, blue);
	// 设置背景颜色参数
	node.setParam("/turtlesim/background_r", 255);
	node.setParam("/turtlesim/background_g", 255);
	ros::param::set("/turtlesim/background_b", 255);
	ROS_INFO("Set Backgroud Color[255, 255, 255]");
    // 读取背景颜色参数
	ros::param::get("/turtlesim/background_r", red);
	ros::param::get("/turtlesim/background_g", green);
	ros::param::get("/turtlesim/background_b", blue);
	ROS_INFO("Re-get Backgroud Color[%d, %d, %d]", red, green, blue);
	// 调用服务，刷新背景颜色
	ros::service::waitForService("/clear");
	ros::ServiceClient clear_background = node.serviceClient<std_srvs::Empty>("/clear");
	std_srvs::Empty srv;
	clear_background.call(srv);
	sleep(1);

    return 0;
}
```

##### Python

``` python
## ! parameter_config.py

import rospy
from std_srvs.srv import Empty

def parameter_config():
    rospy.init_node('parameter_config', anonymous=True)

    red   = rospy.get_param('/turtlesim/background_r')
    green = rospy.get_param('/turtlesim/background_g')
    blue  = rospy.get_param('/turtlesim/background_b')
    rospy.loginfo("Get Backgroud Color[%d, %d, %d]", red, green, blue)

    rospy.set_param("/turtlesim/background_r", 255)
    rospy.set_param("/turtlesim/background_g", 255)
    rospy.set_param("/turtlesim/background_b", 255)
    rospy.loginfo("Set Backgroud Color[255, 255, 255]")

    red   = rospy.get_param('/turtlesim/background_r')
    green = rospy.get_param('/turtlesim/background_g')
    blue  = rospy.get_param('/turtlesim/background_b')
    rospy.loginfo("Get Backgroud Color[%d, %d, %d]", red, green, blue)

    rospy.wait_for_service('/clear')
    try:
        rospy.ServiceProxy('/clear', Empty)()
    except rospy.ServiceException as e:
        print("Service call failed: %s", e)

if __name__ == "__main__":
    parameter_config()
```

## TF

Dependence: rospy/roscpp/tf/turtlesim

### Installation

```lua
    sudo apt-get install ros-<vesion>-turtle-tf
        -- <version>为ROS版本名称，如 roetic
```

### Usage

```lua
    roslaunch turtle_tf2 turtle_tf2_demo_cpp.launch
        -- 不同版本的package和launch文件名可能有所区别，可通过Tab键提示尝试运行
    rosrun turtlesim turtle_teleop_key
    rosrun tf2_tools view_frames.py
        -- 保存当前TF_Tree为PDF文件
        -- 不同版本可能有所区别，可通过Tab键提示尝试运行
    rosrun tf2_tools echo.py turtle1 turtle2
        -- 查看具体的坐标关系
        -- 不同版本可能有所区别，可通过Tab键提示尝试运行
    rosrun rviz rviz -d `rospack find turtle_tf2` /rviz/turtle_rviz.rviz
        -- 利用rviz工具可视化坐标关系
        -- 需修改：Fixed Frame -> world; Add -> TF
```

#### Cpp

##### Code

``` cpp
// ! turtle_tf_broadcaster.cpp 

#include <ros/ros.h>
#include <tf/transform_broadcaster.h>
#include <turtlesim/Pose.h>

std::string turtle_name;

void poseCallback(const turtlesim::PoseConstPtr& msg){
	// 创建tf的广播器
	static tf::TransformBroadcaster br;
	// 初始化tf数据
	tf::Transform transform;
	transform.setOrigin( tf::Vector3(msg->x, msg->y, 0.0) );
	tf::Quaternion q;
	q.setRPY(0, 0, msg->theta);
	transform.setRotation(q);
	// 广播world与海龟坐标系之间的tf数据
	br.sendTransform(tf::StampedTransform(transform, ros::Time::now(), "world", turtle_name));
}

int main(int argc, char** argv){
	ros::init(argc, argv, "my_tf_broadcaster");
	// 输入参数作为海龟的名字
	if (argc != 2){
		ROS_ERROR("need turtle name as argument"); 
		return -1;
	}
	turtle_name = argv[1];
	// 订阅海龟坐标
	ros::NodeHandle node;
	ros::Subscriber sub = node.subscribe("/" + turtle_name + "/pose", 10, &poseCallback);
	ros::spin();

	return 0;
};
```

``` cpp
// ! turtle_tf_listener.cpp

#include <ros/ros.h>
#include <tf/transform_listener.h>
#include <geometry_msgs/Twist.h>
#include <turtlesim/Spawn.h>

int main(int argc, char** argv)
{
	ros::init(argc, argv, "my_tf_listener");
	ros::NodeHandle node;
	// 请求产生turtle2
	ros::service::waitForService("/spawn");
	ros::ServiceClient add_turtle = node.serviceClient<turtlesim::Spawn>("/spawn");
	turtlesim::Spawn srv;
	add_turtle.call(srv);
	// 创建发布turtle2速度控制指令的发布者
	ros::Publisher turtle_vel = node.advertise<geometry_msgs::Twist>("/turtle2/cmd_vel", 10);
	// 创建tf的监听器
	tf::TransformListener listener;
	ros::Rate rate(10.0);

	while (node.ok()){
		// 获取turtle1与turtle2坐标系之间的tf数据
		tf::StampedTransform transform;
		try{
            // 等待并确保两个指定坐标系之间的变换信息可用后再继续执行代码
            // 因为广播的是海龟相对于世界坐标的信息，需要判断提供的信息是否足以计算出两者的相对坐标
            // bool waitForTransform(
            //     const std::string& target_frame,
            //     // -- 目标坐标系的名称
            //     const std::string& source_frame,
            //     // -- 源坐标系的名称
            //     const ros::Time& time,
            //     // -- 所需变换的时间戳
            //     const ros::Duration& timeout,
            //     // -- 等待超时时间，如果超过此时间仍未获取到变换信息，则函数返回 false
            //     const ros::Duration& polling_sleep_duration = ros::Duration(0.01)
            //     // -- 轮询睡眠间隔，即每次轮询之间的等待时间
            // );
			listener.waitForTransform("/turtle2", "/turtle1", ros::Time(0), ros::Duration(3.0));
            // 获取两个坐标系之间的变换信息
			listener.lookupTransform("/turtle2", "/turtle1", ros::Time(0), transform);
		}
		catch (tf::TransformException &ex) {
			ROS_ERROR("%s",ex.what());
			ros::Duration(1.0).sleep();
			continue;
		}

		// 根据turtle1与turtle2坐标系之间的位置关系，发布turtle2的速度控制指令
        // 注意vel_msg发布速度所参考的坐标系是海龟自身的
		geometry_msgs::Twist vel_msg;
		vel_msg.angular.z = 4.0 * atan2(transform.getOrigin().y(), transform.getOrigin().x());
		vel_msg.linear.x = 0.5 * sqrt(pow(transform.getOrigin().x(), 2) + pow(transform.getOrigin().y(), 2));
		turtle_vel.publish(vel_msg);
		rate.sleep();
	}
	return 0;
};
```

##### Run

```lua
    roscore
    rosrun turtlesim turtlesim_node
    rosrun learning_tf turtle_tf_broadcaster __name:=turtle1_tf_broadcaster turtle1
    rosrun learning_tf turtle_tf_broadcaster __name:=turtle2_tf_broadcaster turtle2
        -- 利用重定向机制为node重命名，否则会出现命名冲突
        -- 这样可以提高代码的利用率
    rosrun learning_tf turtle_tf_listener
```

#### Python

##### Code

``` python
## ! turtle_tf_broadcaster.py

import roslib
import rospy

import tf
import turtlesim.msg

def handle_turtle_pose(msg, turtlename):
    br = tf.TransformBroadcaster()
    br.sendTransform((msg.x, msg.y, 0),
                     tf.transformations.quaternion_from_euler(0, 0, msg.theta),
                     rospy.Time.now(),
                     turtlename,
                     "world")

if __name__ == '__main__':
    rospy.init_node('turtle_tf_broadcaster')
    ## ~turtle表示当前节点下的turtle参数，默认情况下是/turtle_tf_broadcaster/turtle
    turtlename = rospy.get_param('~turtle')
    rospy.Subscriber('/%s/pose' % turtlename, turtlesim.msg.Pose, handle_turtle_pose, turtlename)
    rospy.spin()
```

``` python
## ! turtle_tf_listener.py

import roslib
import rospy
import math
import tf
import geometry_msgs.msg
import turtlesim.srv

if __name__ == '__main__':
    rospy.init_node('turtle_tf_listener')

    listener = tf.TransformListener()

    rospy.wait_for_service('spawn')
    spawner = rospy.ServiceProxy('spawn', turtlesim.srv.Spawn)
    spawner(4, 2, 0, 'turtle2')

    turtle_vel = rospy.Publisher('turtle2/cmd_vel', geometry_msgs.msg.Twist, queue_size=1)

    rate = rospy.Rate(10.0)
    while not rospy.is_shutdown():
        try:
            (trans,rot) = listener.lookupTransform('/turtle2', '/turtle1', rospy.Time(0))
        except (tf.LookupException, tf.ConnectivityException, tf.ExtrapolationException):
            continue

        angular = 4 * math.atan2(trans[1], trans[0])
        linear = 0.5 * math.sqrt(trans[0] ** 2 + trans[1] ** 2)
        cmd = geometry_msgs.msg.Twist()
        cmd.linear.x = linear
        cmd.angular.z = angular
        turtle_vel.publish(cmd)

        rate.sleep()
```

##### Run

```lua
    roscore
    rosrun turtlesim turtlesim_node
    rosrun turtlesim turtle_teleop_key
    rosparam set /turtle1_tf_broadcaster/turtle turtle1
    rosrun learning_tf turtle_tf_broadcaster.py __name:=turtle1_tf_broadcaster
    rosparam set /turtle2_tf_broadcaster/turtle turtle2
    rosrun learning_tf turtle_tf_broadcaster.py __name:=turtle2_tf_broadcaster
    rosrun learning_tf turtle_tf_listener.py
```

## LAUNCH

Dependence: None

### Grammar

#### Structrue

``` xml
<!-- ! note_simple.launch -->

<?xml version="1.0"?>
<launch>
    <include file="$(find ros_package_name)/"/>
    <node name="node_name" pkg="ros_package" type="executable"  output="log" respawn="false" respawn_delay="0" />
    <arg name="" default=""/>
    <arg name="" value=""/>
    <param name="" value=""/>
    <rosparam command="load" file="$(find ros_package_name)/"/>
    <rosparam>
        <!-- 
        param:
            param: value
            param:
                param: value
                param: value
        -->
    </rosparam>
    <group if="$(arg arg_name)">
    </group>
    <group unless="$(arg arg_name)">
    </group>
    <remap from="" to=""/>
</launch>
```

#### Detail

``` xml
<!-- ! note.launch -->

<?xml version="1.0"?>
<launch>
    <!-- include标签用于将另一个 xml 格式的 launch 文件导入到当前文件；类似C语言头文件包含 -->
    <include file="$(find ros_package_name)/"/>

    <!-- node标签用于指定 ROS 节点，是最常见的标签，需要注意的是: roslaunch 命令不能保证按照 node 的声明顺序来启动节点(节点的启动是多进程的) -->
        <!-- pkg: 节点所在的功能包名称 -->
        <!-- type: 节点的可执行文件名称 -->
        <!-- name: 节点运行时的名称 -->
        <!-- output=“log | screen” (可选)，日志发送目标，可以设置为 log 日志文件，或 screen 屏幕,默认是 log -->
        <!-- respawn=“true | false” (可选)，如果节点退出，是否自动重启 -->
        <!-- required=“true | false” (可选)，该节点是否必须，如果为 true,那么如果该节点退出，将杀死整个 roslaunch -->
        <!-- ns=“xxx” (可选)，在指定命名空间 xxx 中启动节点 -->
        <!-- machine=“机器名”，在指定机器上启动节点 -->
        <!-- args=“xxx xxx xxx” (可选)，将参数传递给节点 -->
    <node name="node_name" pkg="ros_package" type="executable"  output="log" respawn="false" respawn_delay="0" />
    
    <!-- launch内部的局部变量，仅限于launch文件使用 -->
    <!-- 使用 default 赋值的参数可以在命令行中被修改，value 则不行 -->
    <!-- 在 launch 文件中可以采用$(arg arg_name) 的形式调用参数值 -->
    <arg name="" default=""/>
    <arg name="" value=""/>

    <!-- 储存参数到参数服务器中 -->
    <param name="" value=""/>

    <!-- 加载参数文件中的多个参数 -->
    <rosparam command="load" file="$(find ros_package_name)/"/>
    <!-- 定义更复杂的参数 -->
    <rosparam>
        <!-- 
        param:
            param: value
            param:
                param: value
                param: value
        -->
    </rosparam>
    
    <!-- group标签可以将若干个节点同时划分进某个工作空间；还可以做到对node的批量管理，比如可以同时终止在同一个group中的节点 -->
    <group if="$(arg arg_name)">
        ...
    </group>
    <group unless="$(arg arg_name)">
        ...
    </group>
    
    <!-- 重映射ROS计算图资源的命名 -->
    <remap from="" to=""/>
    
</launch>
```

### Examples

#### Example 01

##### Code

``` xml
<!-- ! simple.launch -->

<launch>
    <!-- 将日志输出到屏幕 -->
    <node pkg="learning_topic" type="person_subscriber" name="talker" output="screen" />
    <node pkg="learning_topic" type="person_publisher" name="listener" output="screen" /> 
</launch>
```

##### Run

``` lua
    roslaunch learning_launch simple.launch
```

#### Example 02

##### Code

``` xml
<!-- ! turtlesim_parameter_config.launch -->

<launch>
	<param name="/turtle_number"   value="2"/>
    <node pkg="turtlesim" type="turtlesim_node" name="turtlesim_node">
    <!-- 注意参数的作用域 -->
		<param name="turtle_name1"   value="Tom"/>
		<param name="turtle_name2"   value="Jerry"/>
		<rosparam file="$(find learning_launch)/config/param.yaml" command="load"/>
	</node>
    <node pkg="turtlesim" type="turtle_teleop_key" name="turtle_teleop_key" output="screen"/>
</launch>
```

``` yaml
## ! param.yaml

A: 123
B: "hello"

group:
  C: 456
  D: "hello"
```

##### Test

``` lua
    rosparam list
```

#### Example 03

``` xml
<!-- ! start_tf_demo_c++.launch -->

 <launch>
    <node pkg="turtlesim" type="turtlesim_node" name="sim"/>
    <node pkg="turtlesim" type="turtle_teleop_key" name="teleop" output="screen"/>
    <node pkg="learning_tf" type="turtle_tf_broadcaster" args="/turtle1" name="turtle1_tf_broadcaster" />
    <node pkg="learning_tf" type="turtle_tf_broadcaster" args="/turtle2" name="turtle2_tf_broadcaster" />
    <node pkg="learning_tf" type="turtle_tf_listener" name="listener" />
  </launch>
```

``` xml
<!-- ! start_tf_demo_py.launch -->

<launch>
	<node pkg="turtlesim" type="turtlesim_node" name="sim"/>
	<node pkg="turtlesim" type="turtle_teleop_key" name="teleop" output="screen"/>
	<node name="turtle1_tf_broadcaster" pkg="learning_tf" type="turtle_tf_broadcaster.py">
	    <param name="/turtle" type="string" value="turtle1" />
	</node>
	<node name="turtle2_tf_broadcaster" pkg="learning_tf" type="turtle_tf_broadcaster.py">
	    <param name="/turtle" type="string" value="turtle2" /> 
	</node>
    <node pkg="learning_tf" type="turtle_tf_listener.py" name="listener" />
</launch>
```

#### Example 04

##### Code

``` xml
<!-- ! turtlesim_remap.launch -->

<launch>
	<include file="$(find learning_launch)/launch/simple.launch" />
    <node pkg="turtlesim" type="turtlesim_node" name="turtlesim_node">
		<remap from="/turtle1/cmd_vel" to="/cmd_vel"/>
	</node>
</launch>
```

##### Test: 

```lua
    roslaunch learning_launch turtlesim_remap.launch 
    rostopic pub /cmd_vel geometry_msgs/Twist "linear: x: 2.0 y: 0.0 z: 0.0  angular: x: 0.0 y: 0.0 z: 2.0"
```
