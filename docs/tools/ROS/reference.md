---
title: Reference
---

## More examples

### Node

``` js
    gmapping    /slam_gmapping
    map_server  /map_saver
    map_server  /map_server
    amcl        /amcl
    move_base   /move_base
```

### Topic

``` js
    tf                      (tf/tfMessage)
        -- Publisher:   amcl        /amcl               发布从 odom 到 map 的转换
        -- Subscriber:  gmapping    /slam_gmapping      用于雷达、底盘与里程计之间的坐标变换消息
                        amcl        /amcl               坐标变换消息
    scan                    (sensor_msgs/LaserScan)
        -- Subscriber:  gmapping    /slam_gmapping      SLAM所需的雷达信息
                        amcl        /amcl               激光雷达数据
    map_metadata            (nav_msgs/MapMetaData)
        -- Publisher:   gmapping    /slam_gmapping      地图元数据，包括地图的宽度、高度、分辨率等，该消息会固定更新
                        map_server  /map_server         发布地图元数据
    map                     (nav_msgs/OccupancyGrid)
        -- Publisher:   gmapping    /slam_gmapping      地图栅格数据，一般会在rviz中以图形化的方式显示
                        map_server  /map_server         地图数据
        -- Subscriber:  map_server  /map_saver          订阅此话题用于生成地图文件
                        amcl        /amcl               获取地图数据
    cmd_vel                 (geometry_msgs/Twist)
        -- Publisher:   move_base   /move_base          输出到机器人底盘的运动控制消息
    initialpose             (geometry_msgs/PoseWithCovarianceStamped)
        -- Subscriber:  amcl        /amcl               用来初始化粒子滤波器的均值和协方差
    amcl_pose               (geometry_msgs/PoseWithCovarianceStamped)
        -- Publisher:   amcl        /amcl               机器人在地图中的位姿估计
    particlecloud           (geometry_msgs/PoseArray)
        -- Publisher:   amcl        /amcl               位姿估计集合，rviz中可以被 PoseArray 订阅然后图形化显示机器人的位姿估计集合
    move_base/goal          (move_base_msgs/MoveBaseActionGoal)
        -- Subscriber:  move_base   /move_base         move_base 的运动规划目标
    move_base/cancel        (actionlib_msgs/GoalID)
        -- Subscriber:  move_base   /move_base         取消目标
    move_base/feedback      (move_base_msgs/MoveBaseActionFeedback)
        -- Publisher:   move_base   /move_base          连续反馈的信息，包含机器人底盘坐标 
    move_base/status        (actionlib_msgs/GoalStatusArray)
        -- Publisher:   move_base   /move_base          发送到move_base的目标状态信息
    move_base/result        (move_base_msgs/MoveBaseActionResult)
        -- Publisher:   move_base   /move_base          操作结果
    move_base_simple/goal   (geometry_msgs/PoseStamped)
        -- Subscriber:   move_base   /move_base         运动规划目标(与action相比，没有连续反馈，无法追踪机器人执行状态)
```

### Service

``` js
    dynamic_map             (nav_msgs/GetMap)
        -- Server:      gmapping    /slam_gmapping      用于获取地图数据
    static_map              (nav_msgs/GetMap)
        -- Server:      map_server  /map_server         通过此服务获取地图     
        -- Caller:      amcl        /amcl               调用此服务获取地图数据
    global_localization     (std_srvs/Empty)
        -- Server:      amcl        /amcl               初始化全局定位的服务
    request_nomotion_update (std_srvs/Empty)
        -- Server:      amcl        /amcl               手动执行更新和发布更新的粒子的服务
    set_map                 (nav_msgs/SetMap)
        -- Server:      amcl        /amcl               手动设置新地图和姿态的服务
    ~make_plan              (nav_msgs/GetPlan)
        -- Server:      move_base   /move_base          请求该服务，可以获取给定目标的规划路径，但是并不执行该路径规划
    ~clear_unknown_space    (std_srvs/Empty)
        -- Server:      move_base   /move_base          允许用户直接清除机器人周围的未知空间
    ~clear_costmaps         (std_srvs/Empty)
        -- Server:      move_base   /move_base          允许清除代价地图中的障碍物，可能会导致机器人与障碍物碰撞，请慎用
```

## More to learn

### Package

https://wiki.ros.org/ros_control/

-- 机器人仿真与控制相关功能包

https://wiki.ros.org/gmapping/

https://wiki.ros.org/hector_slam/

-- 即时定位与地图建模相关功能包

https://moveit.ros.org/

-- 机械臂避障抓取等相关功能包

### Lesson


https://www.bilibili.com/video/BV16s411q7o7/

-- Stanford公开课，机器人学，英文，清晰度不高

https://www.bilibili.com/video/BV1ZL4y1h7R9/

-- 台湾交通大学公开课，机器人学，中文

### Practice

http://www.doc.ic.ac.uk/~ajd/Robotics/index.html/

-- Andrew Davison的机器人学讲座课程

http://www.rsl.ethz.ch/education-students/lectures.html​/

-- ETH - Robotic Systems Lab

https://cloud.tencent.com/developer/article/1990502/

-- 有趣免费的开源机器人课程实践指北

### Book

《Introduction to Robotics -- Mechanics and Control》
《ROS机器人开发实践》

### Website

https://www.ros.org/
    
https://wiki.ros.org/
    
https://roscon.ros.org/
    
https://robots.ros.org/
    
https://wiki.ubuntu.org.cn/

### Other

https://www.google.com.hk/

https://github.com/

https://www.youtube.com/

https://www.bilibili.com/
