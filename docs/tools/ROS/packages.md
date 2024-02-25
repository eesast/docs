---
title: Packages
---

## Slam

### Introduction 

gmapping 是ROS开源社区中较为常用且比较成熟的SLAM算法之一，gmapping可以根据移动机器人里程计数据和激光雷达数据来绘制二维的栅格地图

### Grammar 

``` xml
<!-- ! note_gmapping.launch -->

<!-- 设置一个参数，名为use_sim_time，值为true。这个参数用于告诉ROS使用仿真时间（simulated time）而不是真实时间 -->
<param name="use_sim_time" value="true"/>
<!-- 启动一个名为slam_gmapping的节点，这个节点属于gmapping软件包，它执行SLAM建图算法；output="screen"表示将节点的输出信息显示在屏幕上 -->
<node pkg="gmapping" type="slam_gmapping" name="slam_gmapping" output="screen">
    <!-- 将scan话题重映射为scan话题。这意味着slam_gmapping节点将接收名为scan的传感器数据 -->
    <remap from="scan" to="scan"/>
    <!-- 指定底盘坐标系的名称，即机器人底部的参考坐标系 -->
    <param name="base_frame" value="base_footprint"/>
    <!-- 指定里程计坐标系的名称，即机器人的里程计数据所使用的坐标系 -->
    <param name="odom_frame" value="odom"/> 
    <!-- 地图更新的时间间隔，单位是秒 -->
    <param name="map_update_interval" value="5.0"/>
    <!-- 传感器的最大检测范围，单位是米 -->
    <param name="maxUrange" value="16.0"/>
    <!-- 地图栅格的标准偏差 -->
    <param name="sigma" value="0.05"/>
    <!-- 地图卷积核的大小 -->
    <param name="kernelSize" value="1"/>
    <!-- 地图线性步长 -->
    <param name="lstep" value="0.05"/>
    <!-- 地图角度步长 -->
    <param name="astep" value="0.05"/>
    <!-- 迭代次数，用于优化算法的性能 -->
    <param name="iterations" value="5"/>
    <!-- 里程计信息的标准偏差 -->
    <param name="lsigma" value="0.075"/>
    <!-- 用于调整地图的增益，影响建图质量 -->
    <param name="ogain" value="3.0"/>
    <!-- 里程计跳过的步数 -->
    <param name="lskip" value="0"/>
    <!-- 定义运动模型的噪声，分别表示旋转与旋转、旋转与平移、平移与旋转、平移与平移之间的噪声 -->
    <param name="srr" value="0.1"/>
    <param name="srt" value="0.2"/>
    <param name="str" value="0.1"/>
    <param name="stt" value="0.2"/>
    <!-- 线性更新的阈值，当机器人移动超过这个阈值时，进行地图的线性更新 -->
    <param name="linearUpdate" value="1.0"/>
    <!-- 角度更新的阈值，当机器人旋转超过这个阈值时，进行地图的角度更新 -->
    <param name="angularUpdate" value="0.5"/>
    <!-- 时间更新的阈值，即当时间流逝超过这个阈值时，进行地图的时间更新 -->
    <param name="temporalUpdate" value="3.0"/>
    <!-- 重采样的阈值，用于控制粒子滤波器中粒子的更新与重采样 -->
    <param name="resampleThreshold" value="0.5"/>
    <!-- 粒子滤波器中的粒子数量 -->
    <param name="particles" value="30"/>
    <!-- 地图的边界范围，即地图的最小x坐标、最小y坐标、最大x坐标、最大y坐标 -->
    <param name="xmin" value="-50.0"/>
    <param name="ymin" value="-50.0"/>
    <param name="xmax" value="50.0"/>
    <param name="ymax" value="50.0"/>
    <!-- 地图的栅格分辨率 -->
    <param name="delta" value="0.05"/>
    <!-- 激光扫描的采样范围和步长，用于优化建图算法的性能 -->
    <param name="llsamplerange" value="0.01"/>
    <param name="llsamplestep" value="0.01"/>
    <param name="lasamplerange" value="0.005"/>
    <param name="lasamplestep" value="0.005"/>
</node>
```

### Example

#### Code

``` xml
<!-- ! gmapping.launch -->

<launch>
    <param name="use_sim_time" value="true"/>
    <node pkg="gmapping" type="slam_gmapping" name="slam_gmapping" output="screen">
      <remap from="scan" to="scan"/>
      <param name="base_frame" value="base_footprint"/><!--底盘坐标系-->
      <param name="odom_frame" value="odom"/> <!--里程计坐标系-->
      <param name="map_update_interval" value="5.0"/>
      <param name="maxUrange" value="16.0"/>
      <param name="sigma" value="0.05"/>
      <param name="kernelSize" value="1"/>
      <param name="lstep" value="0.05"/>
      <param name="astep" value="0.05"/>
      <param name="iterations" value="5"/>
      <param name="lsigma" value="0.075"/>
      <param name="ogain" value="3.0"/>
      <param name="lskip" value="0"/>
      <param name="srr" value="0.1"/>
      <param name="srt" value="0.2"/>
      <param name="str" value="0.1"/>
      <param name="stt" value="0.2"/>
      <param name="linearUpdate" value="1.0"/>
      <param name="angularUpdate" value="0.5"/>
      <param name="temporalUpdate" value="3.0"/>
      <param name="resampleThreshold" value="0.5"/>
      <param name="particles" value="30"/>
      <param name="xmin" value="-50.0"/>
      <param name="ymin" value="-50.0"/>
      <param name="xmax" value="50.0"/>
      <param name="ymax" value="50.0"/>
      <param name="delta" value="0.05"/>
      <param name="llsamplerange" value="0.01"/>
      <param name="llsamplestep" value="0.01"/>
      <param name="lasamplerange" value="0.005"/>
      <param name="lasamplestep" value="0.005"/>
    </node>

    <node pkg="joint_state_publisher" name="joint_state_publisher" type="joint_state_publisher" />
    <node pkg="robot_state_publisher" name="robot_state_publisher" type="robot_state_publisher" />

    <node pkg="rviz" type="rviz" name="rviz" />
    <!-- 可以保存 rviz 配置并后期直接使用-->
    <!-- <node pkg="rviz" type="rviz" name="rviz" args="-d $(find learning_navigation)/rviz/gmapping.rviz"/> -->
</launch>
```

#### Test 

``` lua
    roslaunch learning_gazebo radar.launch
        -- 启动 Gazebo 仿真环境及雷达组件
    roslaunch learning_navigation gmapping.launch
        -- 启动地图绘制
    rosrun teleop_twist_keyboard teleop_twist_keyboard.py
        -- 启动键盘键盘控制节点，用于控制机器人运动建图
    Add -> Map
    Map.Topic -> /map
    Add -> RobotModel
    Add -> LaserScan
    LaserScan.Topic -> /scan
```

## Map_server

### Introduction 

需要将栅格地图序列化到的磁盘以持久化存储，后期通过反序列化读取磁盘的地图数据再执行后续操作

在ROS中，地图数据的序列化与反序列化可以通过 map_server 功能包实现

### Saver

#### Code 

``` xml
<!-- ! map_server_saver.launch -->

<launch>
    <!-- 地图的保存路径以及保存的文件名称 -->
    <arg name="filename" value="$(find learning_navigation)/map/nav" />
    <node name="map_save" pkg="map_server" type="map_saver" args="-f $(arg filename)" />
</launch>
```

#### Result

``` yaml
# ! nav.yaml

# 被描述的图片资源路径，可以是绝对路径也可以是相对路径
image: /home/zzdhyb/demo03/src/learning_navigation/map/nav.pgm
# 图片分片率(单位: m/像素)
resolution: 0.050000
# 地图中左下像素的二维姿势，为（x，y，偏航），偏航为逆时针旋转（偏航= 0表示无旋转）
origin: [-50.000000, -50.000000, 0.000000]
# 是否应该颠倒白色/黑色自由/占用的语义
negate: 0
# 占用概率大于此阈值的像素被视为完全占用
occupied_thresh: 0.65
# 占用率小于此阈值的像素被视为完全空闲
free_thresh: 0.196
```

### Server 

#### Code 

``` xml
<!-- ! map_server_server.launch -->

<launch>
    <!-- 设置地图的配置文件 -->
    <arg name="map" default="nav.yaml" />
    <!-- 运行地图服务器，并且加载设置的地图-->
    <node name="map_server" pkg="map_server" type="map_server" args="$(find learning_navigation)/map/$(arg map)"/>
</launch>
```

#### Test 

``` lua
    rosrun rviz rviz
    Add -> Map
    Map.Topic -> /map
```

## AMCL

### Introduction 

在ROS的导航功能包集navigation中提供了 amcl 功能包，用于实现导航中的机器人定位

AMCL(adaptive Monte Carlo Localization) 是用于2D移动机器人的概率定位系统，它实现了自适应（或KLD采样）蒙特卡洛定位方法，可以根据已有地图使用粒子滤波器推算机器人位置

### Grammar

``` xml
<!-- ! note_amcl.launch -->

<node pkg="amcl" type="amcl" name="amcl" output="screen">
    <!-- Publish scans from best pose at a max of 10 Hz -->
    <!-- 里程计模型类型，参数的值为diff，表示差分移动机器人的里程计模型 -->
    <!-- diff 适用于差分移动机器人 -->
    <!-- omni 适用于全向移动机器人 -->
    <param name="odom_model_type" value="diff"/>
    <!-- 发布图形用户界面信息的频率，以帧每秒为单位 -->
    <param name="gui_publish_rate" value="10.0"/>
    <!-- 激光扫描的最大束数量 -->
    <param name="laser_max_beams" value="30"/>
    <!-- 粒子滤波器使用的最小和最大粒子数量 -->
    <param name="min_particles" value="500"/>
    <param name="max_particles" value="5000"/>
    <!-- 用于控制自适应重采样的参数 -->
    <param name="kld_err" value="0.05"/>
    <param name="kld_z" value="0.99"/>
    <!-- 用于校准里程计测量误差的系数 -->
    <param name="odom_alpha1" value="0.2"/>
    <param name="odom_alpha2" value="0.2"/>
    <param name="odom_alpha3" value="0.8"/>
    <param name="odom_alpha4" value="0.2"/>
    <param name="odom_alpha5" value="0.1"/>
    <!-- 用于激光传感器模型中的权重计算 -->
    <param name="laser_z_hit" value="0.5"/>
    <param name="laser_z_short" value="0.05"/>
    <param name="laser_z_max" value="0.05"/>
    <param name="laser_z_rand" value="0.5"/>
    <!-- 用于激光传感器模型中的高斯权重计算 -->
    <param name="laser_sigma_hit" value="0.2"/>
    <param name="laser_lambda_short" value="0.1"/>
    <!-- 激光模型类型，可以是"likelihood_field"或"beam" -->
    <param name="laser_model_type" value="likelihood_field"/>
    <!-- 在似然场模型中用于计算似然度的最大距离 -->
    <param name="laser_likelihood_max_dist" value="2.0"/>
    <!-- 机器人移动的最小距离和最小角度，用于触发粒子滤波器更新 -->
    <param name="update_min_d" value="0.2"/>
    <param name="update_min_a" value="0.5"/>
    <!-- 里程计坐标系的名称 -->
    <param name="odom_frame_id" value="odom"/>
    <!-- 机器人基坐标系的名称 -->
    <param name="base_frame_id" value="base_footprint"/>
    <!-- 地图坐标系的名称 -->
    <param name="global_frame_id" value="map"/>
    <!-- 重采样间隔，控制何时进行重采样 -->
    <param name="resample_interval" value="1"/>
    <!-- 用于设置变换检查容差，即两个变换之间的最大容差值 -->
    <param name="transform_tolerance" value="0.1"/>
    <!-- 用于在遇到困难情况时执行自恢复行为的参数 -->
    <param name="recovery_alpha_slow" value="0.0"/>
    <param name="recovery_alpha_fast" value="0.0"/>
</node>
```

### Example

#### Code 

``` xml
<!-- ! amcl_diff.launch -->

<launch>
  <node pkg="amcl" type="amcl" name="amcl" output="screen">
    <!-- Publish scans from best pose at a max of 10 Hz -->
    <param name="odom_model_type" value="diff"/><!-- 里程计模式为差分 -->
    <param name="gui_publish_rate" value="10.0"/>
    <param name="laser_max_beams" value="30"/>
    <param name="min_particles" value="500"/>
    <param name="max_particles" value="5000"/>
    <param name="kld_err" value="0.05"/>
    <param name="kld_z" value="0.99"/>
    <param name="odom_alpha1" value="0.2"/>
    <param name="odom_alpha2" value="0.2"/>
    <!-- translation std dev, m -->
    <param name="odom_alpha3" value="0.8"/>
    <param name="odom_alpha4" value="0.2"/>
    <param name="odom_alpha5" value="0.1"/>
    <param name="laser_z_hit" value="0.5"/>
    <param name="laser_z_short" value="0.05"/>
    <param name="laser_z_max" value="0.05"/>
    <param name="laser_z_rand" value="0.5"/>
    <param name="laser_sigma_hit" value="0.2"/>
    <param name="laser_lambda_short" value="0.1"/>
    <param name="laser_lambda_short" value="0.1"/>
    <param name="laser_model_type" value="likelihood_field"/>
    <!-- <param name="laser_model_type" value="beam"/> -->
    <param name="laser_likelihood_max_dist" value="2.0"/>
    <param name="update_min_d" value="0.2"/>
    <param name="update_min_a" value="0.5"/>
  
    <param name="odom_frame_id" value="odom"/><!-- 里程计坐标系 -->
    <param name="base_frame_id" value="base_footprint"/><!-- 添加机器人基坐标系 -->
    <param name="global_frame_id" value="map"/><!-- 添加地图坐标系 -->
  
    <param name="resample_interval" value="1"/>
    <param name="transform_tolerance" value="0.1"/>
    <param name="recovery_alpha_slow" value="0.0"/>
    <param name="recovery_alpha_fast" value="0.0"/>
  </node>
</launch>
```

``` xml
<!-- ! amcl.launch -->

<launch>
    <arg name="map" default="nav.yaml" />
    <node name="map_server" pkg="map_server" type="map_server" args="$(find learning_navigation)/map/$(arg map)"/>
    <include file="$(find learning_navigation)/launch/amcl_diff.launch" />

    <node pkg="joint_state_publisher" name="joint_state_publisher" type="joint_state_publisher" />
    <node pkg="robot_state_publisher" name="robot_state_publisher" type="robot_state_publisher" />

    <node pkg="rviz" type="rviz" name="rviz"/>
    <!-- 可以保存 rviz 配置并后期直接使用-->
    <!-- <node pkg="rviz" type="rviz" name="rviz" args="-d $(find learning_navigation)/rviz/amcl.rviz"/> -->
</launch>
```

#### Test

``` lua
    rosrun teleop_twist_keyboard teleop_twist_keyboard.py
    Add -> RobotModel
    Add -> Map
    Map.Topic -> /map
    Add -> PoseArray
    PoseArray.Topic -> /particlecloud
```

## Move_base

### Introduction 

路径规划是导航中的核心功能之一，在ROS的导航功能包集navigation中提供了 move_base 功能包，用于实现此功能

### Cost Map

代价地图有两张:global_costmap(全局代价地图) 和 local_costmap(本地代价地图)，前者用于全局路径规划，后者用于本地路径规划

两张代价地图都可以多层叠加,一般有以下层级:

-- Static Map Layer：静态地图层，SLAM构建的静态地图

-- Obstacle Map Layer：障碍地图层，传感器感知的障碍物信息

-- Inflation Layer：膨胀层，在以上两层地图上进行膨胀（向外扩张），以避免机器人的外壳会撞上障碍物

-- Other Layers：自定义costmap
    
多个layer可以按需自由搭配

代价值的计算：

-- 致命障碍:栅格值为254，此时障碍物与机器人中心重叠，必然发生碰撞

-- 内切障碍:栅格值为253，此时障碍物处于机器人的内切圆内，必然发生碰撞

-- 外切障碍:栅格值为[128,252]，此时障碍物处于其机器人的外切圆内，处于碰撞临界，不一定发生碰撞

-- 非自由空间:栅格值为(0,127]，此时机器人处于障碍物附近，属于危险警戒区，进入此区域，将来可能会发生碰撞

-- 自由区域:栅格值为0，此处机器人可以自由通过

-- 未知区域:栅格值为255，还没探明是否有障碍物

### Config

``` yaml
# ! costmap_common_params.yaml

#机器人几何参，如果机器人是圆形，设置 robot_radius,如果是其他形状设置 footprint
robot_radius: 0.12 #圆形
# footprint: [[-0.12, -0.12], [-0.12, 0.12], [0.12, 0.12], [0.12, -0.12]] #其他形状

obstacle_range: 3.0 # 用于障碍物探测，比如: 值为 3.0，意味着检测到距离小于 3 米的障碍物时，就会引入代价地图
raytrace_range: 3.5 # 用于清除障碍物，比如：值为 3.5，意味着清除代价地图中 3.5 米以外的障碍物


#膨胀半径，扩展在碰撞区域以外的代价区域，使得机器人规划路径避开障碍物
inflation_radius: 0.2
#代价比例系数，越大则代价值越小
cost_scaling_factor: 3.0
# 注意：
# 全局路径规划与本地路径规划虽然设置的参数是一样的，但是二者路径规划和避障的职能不同，可以采用不同的参数设置策略:
# 在实操中，全局代价地图可以将膨胀半径和障碍物系数设置的偏大一些；本地代价地图可以将膨胀半径和障碍物系数设置的偏小一些
# 这样，在全局路径规划时，规划的路径会尽量远离障碍物，而本地路径规划时，机器人即便偏离全局路径也会和障碍物之间保留更大的自由空间，从而避免了陷入“假死”的情形

#地图类型
map_type: costmap
#导航包所需要的传感器
observation_sources: scan
#对传感器的坐标系和数据进行配置。这个也会用于代价地图添加和清除障碍物。例如，你可以用激光雷达传感器用于在代价地图添加障碍物，再添加kinect用于导航和清除障碍物。
scan: {sensor_frame: laser, data_type: LaserScan, topic: scan, marking: true, clearing: true}
```

``` yaml
# ! global_costmap_params.yaml

global_costmap:
  global_frame: map #地图坐标系
  robot_base_frame: base_footprint #机器人坐标系
  # 以此实现坐标变换

  update_frequency: 1.0 #代价地图更新频率
  publish_frequency: 1.0 #代价地图的发布频率
  transform_tolerance: 0.5 #等待坐标变换发布信息的超时时间

  static_map: true # 是否使用一个地图或者地图服务器来初始化全局代价地图，如果不使用静态地图，这个参数为false.
```

``` yaml
# ! local_costmap_params.yaml

local_costmap:
  global_frame: odom #里程计坐标系
  robot_base_frame: base_footprint #机器人坐标系

  update_frequency: 10.0 #代价地图更新频率
  publish_frequency: 10.0 #代价地图的发布频率
  transform_tolerance: 0.5 #等待坐标变换发布信息的超时时间

  static_map: false  #不需要静态地图，可以提升导航效果
  rolling_window: true #是否使用动态窗口，默认为false，在静态的全局地图中，地图不会变化
  width: 3 # 局部地图宽度 单位是 m
  height: 3 # 局部地图高度 单位是 m
  resolution: 0.05 # 局部地图分辨率 单位是 m，一般与静态地图分辨率保持一致
```

``` yaml
# ! base_local_planner_params.yaml

TrajectoryPlannerROS:

# Robot Configuration Parameters
  max_vel_x: 0.5 # X 方向最大速度
  min_vel_x: 0.1 # X 方向最小速速

  max_vel_theta:  1.0  # 可以达到的最大角速度
  min_vel_theta: -1.0  # 可以达到的最小角速度
  min_in_place_vel_theta: 1.0  # 在原地旋转时的最小角速度

  acc_lim_x: 1.0 # X 加速限制
  acc_lim_y: 0.0 # Y 加速限制
  acc_lim_theta: 0.6 # 角速度加速限制

# Goal Tolerance Parameters，目标公差
  # 表示机器人在平面上（x和y轴）达到目标位置时的容差范围，单位为米
  # 当机器人的位置与目标位置之间的距离小于等于该容差值时，即被认为到达目标位置
  xy_goal_tolerance: 0.10
  # 表示机器人在绕Z轴旋转（偏航角）达到目标方向时的容差范围，单位为弧度
  # 当机器人的偏航角与目标方向之间的差异小于等于该容差值时，即被认为达到目标方向
  yaw_goal_tolerance: 0.05

# Differential-drive robot configuration
# 是否是全向移动机器人
  holonomic_robot: false

# Forward Simulation Parameters，前进模拟参数
  # 在每个离散时间步长内的模拟时间
  sim_time: 0.8
  # 在水平方向的速度采样点数量
  vx_samples: 18
  # 在旋转方向的速度采样点数量
  vtheta_samples: 20
  # 运动模拟时的时间和空间离散度
  # 决定了机器人在每个时间步长内的运动模拟的时间和空间分辨率
  sim_granularity: 0.05
```

``` xml
<!-- ! move_base.launch -->

<launch>
    <node pkg="move_base" type="move_base" respawn="false" name="move_base" output="screen" clear_params="true">
        <!-- respawn 为 false，意味着该节点关闭后，不会被重启 -->
        <!-- clear_params 为 true，意味着每次启动该节点都要清空私有参数然后重新载入 -->
        <rosparam file="$(find learning_navigation)/param/costmap_common_params.yaml" command="load" ns="global_costmap" />
        <rosparam file="$(find learning_navigation)/param/costmap_common_params.yaml" command="load" ns="local_costmap" />
        <rosparam file="$(find learning_navigation)/param/local_costmap_params.yaml" command="load" />
        <rosparam file="$(find learning_navigation)/param/global_costmap_params.yaml" command="load" />
        <rosparam file="$(find learning_navigation)/param/base_local_planner_params.yaml" command="load" />
    </node>

</launch>
```

``` xml
<!-- ! nav.launch -->

<launch>
    <!-- 设置地图的配置文件 -->
    <arg name="map" default="nav.yaml" />
    <!-- 运行地图服务器，并且加载设置的地图-->
    <node name="map_server" pkg="map_server" type="map_server" args="$(find learning_navigation)/map/$(arg map)"/>
    <!-- 启动AMCL节点 -->
    <include file="$(find learning_navigation)/launch/amcl_diff.launch" />

    <!-- 运行move_base节点 -->
    <include file="$(find learning_navigation)/launch/move_base.launch" />
    <!-- 运行rviz -->
    <node pkg="joint_state_publisher" name="joint_state_publisher" type="joint_state_publisher" />
    <node pkg="robot_state_publisher" name="robot_state_publisher" type="robot_state_publisher" />

    <node pkg="rviz" type="rviz" name="rviz" />
    <!-- <node pkg="rviz" type="rviz" name="rviz" args="-d $(find learning_navigation)/rviz/nav.rviz" /> -->
</launch>
```

### Test 

``` lua
    Add -> RobotModel/Odometry/LaserScan/PoseArray/Map(global)/Map(local)/Path(global)/Path(local)
```

## Nav & Slam 

### Introduction 

实现机器人自主移动的SLAM建图

### Code 

``` xml
<!-- ! nav_and_slam.launch -->

<launch>
    <!-- 启动SLAM节点 -->
    <include file="$(find learning_navigation)/launch/gmapping.launch" />
    <!-- 运行move_base节点 -->
    <include file="$(find learning_navigation)/launch/move_base.launch" />
</launch>
```
