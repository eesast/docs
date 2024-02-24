---
title: Gazebo
---

## Arbotix

### Introduction

Arbotix 是一款控制电机、舵机的控制板，并提供相应的 ros 功能包

这个功能包的功能不仅可以驱动真实的 Arbotix 控制板，它还提供一个差速控制器，通过接受速度控制指令更新机器人的 joint 状态，从而帮助我们实现机器人在 rviz 中的运动

这个差速控制器在 arbotix_python 程序包中，完整的 arbotix 程序包还包括多种控制器，分别对应 dynamixel 电机、多关节机械臂以及不同形状的夹持器

### Code

``` yaml
# ! control.yaml

# 该文件是控制器配置,一个机器人模型可能有多个控制器，比如: 底盘、机械臂、夹持器(机械手)....
# 因此，根 name 是 controller
controllers: {
  # 单控制器设置
  base_controller: {
    #类型: 差速控制器
    type: diff_controller,
    #参考坐标
    base_frame_id: base_footprint, 
    #两个轮子之间的间距
    base_width: 0.2,
    #控制频率
    ticks_meter: 2000, 
    #PID控制参数，使机器人车轮快速达到预期速度
    Kp: 12, 
    Kd: 12, 
    Ki: 0, 
    Ko: 50, 
    #加速限制
    accel_limit: 1.0 
  }
}
```

``` xml
<!-- ! control.launch -->

<launch>
    <include file="$(find learning_xacro)/launch/my_base_camera_laser2.launch"/>
    <node name="arbotix" pkg="arbotix_python" type="arbotix_driver" output="screen">
        <!-- arbotix 驱动机器人运行时，需要获取机器人信息，可以通过 file 加载配置文件 -->
            <!-- <node> 调用了 arbotix_python 功能包下的 arbotix_driver 节点 -->
            <!-- <rosparam> arbotix 驱动机器人运行时，需要获取机器人信息，可以通过 file 加载配置文件 -->
            <!-- <param> 在仿真环境下，需要配置 sim 为 true -->
        <rosparam file="$(find learning_xacro)/config/control.yaml" command="load" />
        <param name="sim" value="true" />
    </node>
</launch>
```

### Config {#config}

``` lua
    Add -> RobotModel/TF/Odometry
    Odometry.Topic -> /Odom
    GlobalOption.FixedFrame -> Odom
```

### Test

``` lua
    rostopic pub -r 10 /cmd_vel geometry_msgs/Twist '{linear: {x: 0.2, y: 0, z: 0}, angular: {x: 0, y: 0, z: 0.5}}'
```

## URDF & GAZEBO

Dependence: urdf/xacro/gazebo_ros/gazebo_ros_control/gazebo_plugins

### Grammar

当 URDF 需要与 Gazebo 集成时，和 Rviz 有明显区别:

-- 必须使用 collision 标签，因为既然是仿真环境，那么必然涉及到碰撞检测，collision 提供碰撞检测的依据

-- 必须使用 inertial 标签，此标签标注了当前机器人某个刚体部分的惯性矩阵，用于一些力学相关的仿真计算

-- 颜色设置，也需要重新使用 gazebo 标签标注，因为之前的颜色设置为了方便调试包含透明度，仿真环境下没有此选项

### Example

#### Code

``` xml
<!-- ! my_head.urdf.xacro -->

<!-- 封装球体/圆柱体/长方体惯性矩阵算法的 xacro 文件 -->
<!-- 原则上，除了 base_footprint 外，机器人的每个刚体部分都需要设置惯性矩阵，且惯性矩阵必须经计算得出，如果随意定义刚体部分的惯性矩阵，那么可能会导致机器人在 Gazebo 中出现抖动，移动等现象 -->

<robot name="base" xmlns:xacro="http://wiki.ros.org/xacro">
    <!-- Macro for inertia matrix -->
    <xacro:macro name="sphere_inertial_matrix" params="m r">
        <inertial>
            <mass value="${m}" />
            <inertia ixx="${2*m*r*r/5}" ixy="0" ixz="0"
                iyy="${2*m*r*r/5}" iyz="0" 
                izz="${2*m*r*r/5}" />
        </inertial>
    </xacro:macro>

    <xacro:macro name="cylinder_inertial_matrix" params="m r h">
        <inertial>
            <mass value="${m}" />
            <inertia ixx="${m*(3*r*r+h*h)/12}" ixy = "0" ixz = "0"
                iyy="${m*(3*r*r+h*h)/12}" iyz = "0"
                izz="${m*r*r/2}" /> 
        </inertial>
    </xacro:macro>

    <xacro:macro name="Box_inertial_matrix" params="m l w h">
       <inertial>
               <mass value="${m}" />
               <inertia ixx="${m*(h*h + l*l)/12}" ixy = "0" ixz = "0"
                   iyy="${m*(w*w + l*l)/12}" iyz= "0"
                   izz="${m*(w*w + h*h)/12}" />
       </inertial>
   </xacro:macro>
</robot>
```

``` xml
<!-- ! my_base.urdf.xacro -->

<robot name="my_base" xmlns:xacro="http://www.ros.org/wiki/xacro">
    <!-- PI 值设置精度需要高一些，否则后续车轮翻转量计算时，可能会出现肉眼不能察觉的车轮倾斜，从而导致模型抖动 -->
    <xacro:property name="PI" value="3.1415926"/>
    <!-- 宏:黑色设置 -->
    <material name="black">
        <color rgba="0.0 0.0 0.0 1.0" />
    </material>
    <!-- 底盘属性 -->
    <xacro:property name="base_footprint_radius" value="0.001" /> 
    <xacro:property name="base_link_radius" value="0.1" /> 
    <xacro:property name="base_link_length" value="0.08" /> 
    <xacro:property name="earth_space" value="0.015" /> 
    <xacro:property name="base_link_m" value="0.5" /> 

    <!-- 底盘 -->
    <link name="base_footprint">
      <visual>
        <geometry>
          <sphere radius="${base_footprint_radius}" />
        </geometry>
      </visual>
    </link>

    <link name="base_link">
      <visual>
        <geometry>
          <cylinder radius="${base_link_radius}" length="${base_link_length}" />
        </geometry>
        <origin xyz="0 0 0" rpy="0 0 0" />
        <material name="yellow">
          <color rgba="0.5 0.3 0.0 0.5" />
        </material>
      </visual>
      <!-- collision: 如果机器人link是标准的几何体形状，和link的 visual 属性设置一致即可 -->
      <collision>
        <geometry>
          <cylinder radius="${base_link_radius}" length="${base_link_length}" />
        </geometry>
        <origin xyz="0 0 0" rpy="0 0 0" />
      </collision>
      <xacro:cylinder_inertial_matrix m="${base_link_m}" r="${base_link_radius}" h="${base_link_length}" />

    </link>


    <joint name="base_link2base_footprint" type="fixed">
      <parent link="base_footprint" />
      <child link="base_link" />
      <origin xyz="0 0 ${earth_space + base_link_length / 2 }" />
    </joint>

    <!-- 在 gazebo 中显示 link 的颜色，必须要使用指定的标签 -->
    <!-- material 标签中，设置的值区分大小写，颜色可以设置为 Red Blue Green Black ..... -->
    <gazebo reference="base_link">
        <material>Gazebo/Yellow</material>
    </gazebo>

    <!-- 驱动轮 -->
    <!-- 驱动轮属性 -->
    <xacro:property name="wheel_radius" value="0.0325" />
    <xacro:property name="wheel_length" value="0.015" />
    <xacro:property name="wheel_m" value="0.05" /> 

    <!-- 驱动轮宏实现 -->
    <xacro:macro name="add_wheels" params="name flag">
      <link name="${name}_wheel">
        <visual>
          <geometry>
            <cylinder radius="${wheel_radius}" length="${wheel_length}" />
          </geometry>
          <origin xyz="0.0 0.0 0.0" rpy="${PI / 2} 0.0 0.0" />
          <material name="black" />
        </visual>
        <collision>
          <geometry>
            <cylinder radius="${wheel_radius}" length="${wheel_length}" />
          </geometry>
          <origin xyz="0.0 0.0 0.0" rpy="${PI / 2} 0.0 0.0" />
        </collision>
        <xacro:cylinder_inertial_matrix m="${wheel_m}" r="${wheel_radius}" h="${wheel_length}" />

      </link>

      <joint name="${name}_wheel2base_link" type="continuous">
        <parent link="base_link" />
        <child link="${name}_wheel" />
        <origin xyz="0 ${flag * base_link_radius} ${-(earth_space + base_link_length / 2 - wheel_radius) }" />
        <axis xyz="0 1 0" />
      </joint>

      <gazebo reference="${name}_wheel">
        <material>Gazebo/Red</material>
      </gazebo>

    </xacro:macro>
    <xacro:add_wheels name="left" flag="1" />
    <xacro:add_wheels name="right" flag="-1" />
    <!-- 支撑轮 -->
    <!-- 支撑轮属性 -->
    <xacro:property name="support_wheel_radius" value="0.0075" /> 
    <xacro:property name="support_wheel_m" value="0.03" /> 

    <!-- 支撑轮宏 -->
    <xacro:macro name="add_support_wheel" params="name flag" >
      <link name="${name}_wheel">
        <visual>
            <geometry>
                <sphere radius="${support_wheel_radius}" />
            </geometry>
            <origin xyz="0 0 0" rpy="0 0 0" />
            <material name="black" />
        </visual>
        <collision>
            <geometry>
                <sphere radius="${support_wheel_radius}" />
            </geometry>
            <origin xyz="0 0 0" rpy="0 0 0" />
        </collision>
        <xacro:sphere_inertial_matrix m="${support_wheel_m}" r="${support_wheel_radius}" />
      </link>

      <joint name="${name}_wheel2base_link" type="continuous">
          <parent link="base_link" />
          <child link="${name}_wheel" />
          <origin xyz="${flag * (base_link_radius - support_wheel_radius)} 0 ${-(base_link_length / 2 + earth_space / 2)}" />
          <axis xyz="1 1 1" />
      </joint>
      <gazebo reference="${name}_wheel">
        <material>Gazebo/Red</material>
      </gazebo>
    </xacro:macro>

    <xacro:add_support_wheel name="front" flag="1" />
    <xacro:add_support_wheel name="back" flag="-1" />

</robot>
```

``` xml
<!-- ! my_camera.urdf.xacro -->

<!-- 摄像头相关的 xacro 文件 -->
<robot name="my_camera" xmlns:xacro="http://wiki.ros.org/xacro">
    <!-- 摄像头属性 -->
    <xacro:property name="camera_length" value="0.01" /> 
    <xacro:property name="camera_width" value="0.025" /> 
    <xacro:property name="camera_height" value="0.025" /> 
    <xacro:property name="camera_x" value="0.08" /> 
    <xacro:property name="camera_y" value="0.0" /> 
    <xacro:property name="camera_z" value="${base_link_length / 2 + camera_height / 2}" /> 
    <xacro:property name="camera_m" value="0.01" /> 

    <!-- 摄像头关节以及link -->
    <link name="camera">
        <visual>
            <geometry>
                <box size="${camera_length} ${camera_width} ${camera_height}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
            <material name="black" />
        </visual>
        <collision>
            <geometry>
                <box size="${camera_length} ${camera_width} ${camera_height}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
        </collision>
        <xacro:Box_inertial_matrix m="${camera_m}" l="${camera_length}" w="${camera_width}" h="${camera_height}" />
    </link>

    <joint name="camera2base_link" type="fixed">
        <parent link="base_link" />
        <child link="camera" />
        <origin xyz="${camera_x} ${camera_y} ${camera_z}" />
    </joint>
    <gazebo reference="camera">
        <material>Gazebo/Blue</material>
    </gazebo>
</robot>
```

``` xml
<!-- ! my_laser.urdf.xacro -->

<!-- 小车底盘添加雷达 -->
<robot name="my_laser" xmlns:xacro="http://wiki.ros.org/xacro">
    <!-- 雷达支架 -->
    <xacro:property name="support_length" value="0.15" /> 
    <xacro:property name="support_radius" value="0.01" /> 
    <xacro:property name="support_x" value="0.0" /> 
    <xacro:property name="support_y" value="0.0" /> 
    <xacro:property name="support_z" value="${base_link_length / 2 + support_length / 2}" /> 
    <xacro:property name="support_m" value="0.02" /> 

    <link name="support">
        <visual>
            <geometry>
                <cylinder radius="${support_radius}" length="${support_length}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
            <material name="red">
                <color rgba="0.8 0.2 0.0 0.8" />
            </material>
        </visual>

        <collision>
            <geometry>
                <cylinder radius="${support_radius}" length="${support_length}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
        </collision>

        <xacro:cylinder_inertial_matrix m="${support_m}" r="${support_radius}" h="${support_length}" />

    </link>

    <joint name="support2base_link" type="fixed">
        <parent link="base_link" />
        <child link="support" />
        <origin xyz="${support_x} ${support_y} ${support_z}" />
    </joint>

    <gazebo reference="support">
        <material>Gazebo/White</material>
    </gazebo>

    <!-- 雷达属性 -->
    <xacro:property name="laser_length" value="0.05" /> 
    <xacro:property name="laser_radius" value="0.03" /> 
    <xacro:property name="laser_x" value="0.0" /> 
    <xacro:property name="laser_y" value="0.0" /> 
    <xacro:property name="laser_z" value="${support_length / 2 + laser_length / 2}" /> 
    <xacro:property name="laser_m" value="0.1" /> 

    <!-- 雷达关节以及link -->
    <link name="laser">
        <visual>
            <geometry>
                <cylinder radius="${laser_radius}" length="${laser_length}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
            <material name="black" />
        </visual>
        <collision>
            <geometry>
                <cylinder radius="${laser_radius}" length="${laser_length}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
        </collision>
        <xacro:cylinder_inertial_matrix m="${laser_m}" r="${laser_radius}" h="${laser_length}" />
    </link>

    <joint name="laser2support" type="fixed">
        <parent link="support" />
        <child link="laser" />
        <origin xyz="${laser_x} ${laser_y} ${laser_z}" />
    </joint>
    <gazebo reference="laser">
        <material>Gazebo/Black</material>
    </gazebo>
    
</robot>
```

``` xml
<!-- ! my_base_camera_laser.urdf.xacro -->

<!-- 组合小车底盘与摄像头 -->
<robot name="my_car_camera" xmlns:xacro="http://wiki.ros.org/xacro">
    <xacro:include filename="my_head.urdf.xacro" />
    <xacro:include filename="my_base.urdf.xacro" />
    <xacro:include filename="my_camera.urdf.xacro" />
    <xacro:include filename="my_laser.urdf.xacro" />
</robot>
```

``` xml
<!-- ! my_base_camera_laser.launch -->

<launch>
    <param name="robot_description" command="$(find xacro)/xacro $(find learning_gazebo)/urdf/my_base_camera_laser.urdf.xacro" />
    <include file="$(find gazebo_ros)/launch/empty_world.launch" />
    <node pkg="gazebo_ros" type="spawn_model" name="model" args="-urdf -model mycar -param robot_description"  />
        <!-- -urdf：表示使用URDF格式加载模型 -->
        <!-- -model mycar：指定要生成的模型名称为"mycar" -->
        <!-- -param robot_description：指定从ROS参数服务器中读取机器人描述的参数名称为"robot_description" -->
</launch>
```

### Simulation environment

#### Create

直接添加内置组件创建仿真环境 -- Insert / 手动绘制仿真环境 -- Edit.Building_Editor

#### Save

File.Save_World_as 选择保存路径(默认功能包下: worlds 目录)，文件名自定义，后缀名设置为 .world

#### Launch

``` xml
<!-- ! new_world.launch -->

<launch>
    <include file="$(find gazebo_ros)/launch/empty_world.launch">
        <!-- 启动 empty_world 后，再根据arg加载自定义的仿真环境 -->
        <arg name="world_name" value="$(find learning_gazebo)/worlds/my_base_camera_laser.world" />
    </include>
</launch>
```


## Ros control

### Introdution

ros_control 是一组软件包，它包含了控制器接口，控制器管理器，传输和硬件接口

可视为是一套机器人控制的中间件，是一套规范，不同的机器人平台只要按照这套规范实现，那么就可以保证与 ROS 程序兼容

gazebo 已经实现了 ros_control 的相关接口，如果需要在 gazebo 中控制机器人运动，直接调用相关接口即可

### Grammar 

``` xml
<!-- ! note_sport_control.urdf.xacro -->

<!-- 传动装置（transmission）在机器人系统中起到将控制信号从控制器(gazebo.plugin)传递给执行器(robot.joint)的作用 -->
<transmission name="transmission_name">

    <!-- 定义一个传动装置（transmission），该装置类型为transmission_interface/SimpleTransmission，用于连接关节和控制器 -->
    <!-- 常用内置装置类型： -->
        <!-- SimpleTransmission：       简单传动装置，用于连接关节和控制器。将控制器的输出转换为关节的运动 -->
        <!-- DifferentialTransmission： 差分传动装置，常用于汽车底盘驱动系统。通过两个驱动轮的旋转速度差异来实现转弯和行驶 -->
        <!-- PR2Transmission：          PR2机器人专用传动装置，支持多个关节的控制 -->
        <!-- ScrewTransmission：        螺旋传动装置，用于将旋转运动转换为线性运动 -->
        <!-- JointTransmission：        关节传动装置，用于将控制信号传递到关节上，可以控制关节的位置、速度或力矩 -->
    <type>transmission_interface/SimpleTransmission</type>

    <!-- 控制的关节名称 -->
    <joint name="joint_name">
        <!-- 指定了关节所使用的硬件接口类型为hardware_interface/VelocityJointInterface，表示该关节接收速度控制指令 -->
        <!-- 常用内置接口类型： -->
            <!-- PositionJointInterface：位置关节接口，用于对关节的位置进行控制 -->
            <!-- VelocityJointInterface：速度关节接口，用于对关节的速度进行控制 -->
            <!-- EffortJointInterface：力矩关节接口，用于对关节施加力矩进行控制 -->
            <!-- PositionVelocityJointInterface：位置和速度关节接口，可以同时对关节的位置和速度进行控制 -->
            <!-- VelocityEffortJointInterface：速度和力矩关节接口，可以同时对关节的速度和力矩进行控制 -->
        <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
    </joint>

    <!-- 指定了作用在关节上的执行器（actuator）的名称 -->
    <actuator name="actuator_name">
        <!-- 指定机械减速比（机械系统中输入轴与输出轴转速之间的比值），用于改变系统的力矩输出能力与所需的电机功率 -->
        <mechanicalReduction>1.0</mechanicalReduction>
        <!-- 指定了执行器所使用的硬件接口类型为hardware_interface/VelocityJointInterface，表示该执行器可以通过速度控制命令驱动关节运动 -->
        <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
    </actuator>
</transmission>

<gazebo>
    <!-- 定义一个Gazebo插件，该插件名为differential_drive_controller，使用文件libgazebo_ros_diff_drive.so -->
    <!-- gazebo 的其它插件可通过 find /opt/ros/<ros_version>/lib -name "libgazebo_ros_*.so" 命令查找， -->
    <plugin name="differential_drive_controller" filename="libgazebo_ros_diff_drive.so">
        <!-- ROS调试级别，可选值为Debug、Info、Warn、Error或Fatal，用于设置ROS节点的日志输出级别 -->
        <rosDebugLevel>Debug</rosDebugLevel>
        <!-- 布尔值，可选项为true或false，设置是否发布车轮的TF变换信息 -->
        <publishWheelTF>true</publishWheelTF>
        <!-- 字符串，表示机器人的ROS命名空间；可以使用根命名空间/或自定义的命名空间 -->
        <robotNamespace>/</robotNamespace>
        <!-- 整数，可选项为1或0，设置是否在Gazebo中发布TF信息 -->
        <publishTf>1</publishTf>
        <!-- 布尔值，可选项为true或false，设置是否发布车轮的关节状态信息 -->
        <publishWheelJointState>true</publishWheelJointState>
        <!-- 布尔值，可选项为true或false，设置插件是否一直保持运行，即始终处于活动状态 -->
        <alwaysOn>true</alwaysOn>
        <!-- 整数，表示控制器的更新频率，单位为Hz -->
        <updateRate>100.0</updateRate>
        <!-- 布尔值，可选项为true或false，设置是否使用旧版本模式 -->
        <legacyMode>true</legacyMode>
        <!-- 字符串，分别指定左驱动轮和右驱动轮的关节名称 -->
        <leftJoint>left_wheel2base_link</leftJoint> <!-- 左轮 -->
        <rightJoint>right_wheel2base_link</rightJoint> <!-- 右轮 -->
        <!-- 定义车轮之间的距离，可以是具体的数值，也可以是变量 -->
        <wheelSeparation>${base_link_radius * 2}</wheelSeparation> <!-- 车轮间距 -->
        <!-- 定义车轮直径，可以是具体的数值，也可以是变量 -->
        <wheelDiameter>${wheel_radius * 2}</wheelDiameter> <!-- 车轮直径 -->
        <!-- 整数，可选项为1或0，设置是否广播机器人的TF变换信息 -->
        <broadcastTF>1</broadcastTF>
        <!-- 指定车轮的扭矩 -->
        <wheelTorque>30</wheelTorque>
        <!-- 指定车轮的加速度 -->
        <wheelAcceleration>1.8</wheelAcceleration>
        <!-- 字符串，指定用于运动控制的话题名称 -->
        <commandTopic>cmd_vel</commandTopic> <!-- 运动控制话题 -->
        <!-- 字符串，定义里程计（odometry）的坐标系 -->
        <!-- 里程计可通过使用传感器（如编码器、陀螺仪或惯性测量单元）来监测车轮转动或车身姿态的变化，并根据这些变化计算出机器人在三维空间中的位移和旋转 -->
        <odometryFrame>odom</odometryFrame> 
        <!-- 字符串，指定里程计（odometry）的话题名称 -->
        <odometryTopic>odom</odometryTopic> <!-- 里程计话题 -->
        <!-- 字符串，设置机器人的基准坐标系 -->
        <robotBaseFrame>base_footprint</robotBaseFrame> <!-- 根坐标系 -->
    </plugin>
</gazebo>
```

### Example

#### Code

``` xml
<!-- ! move.urdf.xacro -->

<robot name="my_car_move" xmlns:xacro="http://wiki.ros.org/xacro">

    <!-- 传动实现:用于连接控制器与关节 -->
    <xacro:macro name="joint_trans" params="joint_name">
        <!-- Transmission is important to link the joints and the controller -->
        <transmission name="${joint_name}_trans">
            <type>transmission_interface/SimpleTransmission</type>
            <joint name="${joint_name}">
                <hardwareInterface>hardware_interface/VelocityJointInterface</hardwareInterface>
            </joint>
            <actuator name="${joint_name}_motor">
                <hardwareInterface>hardware_interface/VelocityJointInterface</hardwareInterface>
                <mechanicalReduction>1</mechanicalReduction>
            </actuator>
        </transmission>
    </xacro:macro>

    <!-- 每一个驱动轮都需要配置传动装置 -->
    <xacro:joint_trans joint_name="left_wheel2base_link" />
    <xacro:joint_trans joint_name="right_wheel2base_link" />

    <!-- 控制器 -->
    <gazebo>
        <plugin name="differential_drive_controller" filename="libgazebo_ros_diff_drive.so">
            <rosDebugLevel>Debug</rosDebugLevel>
            <publishWheelTF>true</publishWheelTF>
            <robotNamespace>/</robotNamespace>
            <publishTf>1</publishTf>
            <publishWheelJointState>true</publishWheelJointState>
            <alwaysOn>true</alwaysOn>
            <updateRate>100.0</updateRate>
            <legacyMode>true</legacyMode>
            <leftJoint>left_wheel2base_link</leftJoint> <!-- 左轮 -->
            <rightJoint>right_wheel2base_link</rightJoint> <!-- 右轮 -->
            <wheelSeparation>${base_link_radius * 2}</wheelSeparation> <!-- 车轮间距 -->
            <wheelDiameter>${wheel_radius * 2}</wheelDiameter> <!-- 车轮直径 -->
            <broadcastTF>1</broadcastTF>
            <wheelTorque>30</wheelTorque>
            <wheelAcceleration>1.8</wheelAcceleration>
            <commandTopic>cmd_vel</commandTopic> <!-- 运动控制话题 -->
            <odometryFrame>odom</odometryFrame> 
            <odometryTopic>odom</odometryTopic> <!-- 里程计话题 -->
            <robotBaseFrame>base_footprint</robotBaseFrame> <!-- 根坐标系 -->
        </plugin>
    </gazebo>

</robot>
```

``` xml
<!-- ! my_base_camera_laser_move.urdf.xacro -->

<robot name="my_car_camera" xmlns:xacro="http://wiki.ros.org/xacro">
    <xacro:include filename="my_base_camera_laser.urdf.xacro" />
    <!-- 包含控制器以及传动配置的 xacro 文件 -->
    <xacro:include filename="move.urdf.xacro" />
</robot>
```

``` xml
<!-- ! move.launch -->

<launch>
    <param name="robot_description" command="$(find xacro)/xacro $(find learning_gazebo)/urdf/my_base_camera_laser_move.urdf.xacro" />
    <include file="$(find gazebo_ros)/launch/empty_world.launch" />
    <node pkg="gazebo_ros" type="spawn_model" name="model" args="-urdf -model mycar -param robot_description"  />
</launch>
```

##### Test

``` lua
    rostopic pub -r 10 /cmd_vel geometry_msgs/Twist '{linear: {x: 0.2, y: 0, z: 0}, angular: {x: 0, y: 0, z: 0.5}}'
```

## Odometer

### Introduction

在 Gazebo 的仿真环境中，机器人的里程计信息以及运动朝向等信息是无法获取的，可以通过 Rviz 显示机器人的里程计信息以及运动朝向

### Code 

``` xml
<!-- ! odometer.launch -->

<launch>
    <!-- 启动 rviz -->
    <node pkg="rviz" type="rviz" name="rviz"  args="-d $(find learning_xacro)/config/rviz/arbotix.rviz"/>
    <!-- 关节以及机器人状态发布节点 -->
    <node name="joint_state_publisher" pkg="joint_state_publisher" type="joint_state_publisher" />
    <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher" />

</launch>
```

#### Run 

启动 rviz 后若出现大片黄色区域，将 Obometry.Covariance 取消勾选即可

## Radar

### Introduction

通过 Gazebo 模拟激光雷达传感器，并在 Rviz 中显示激光数据

### Grammar

``` xml
<!-- ! note_radar.urdf.xacro -->

<!-- 雷达 -->
<!-- reference 用于指定传感器所参考的参考点或参考物体 -->
<gazebo reference="laser">
    <!-- 定义一个传感器，传感器类型为 "ray"，即雷达传感器，用于检测周围环境中的物体并测量距离 -->
    <sensor type="ray" name="rplidar">
        <!-- 定义了传感器的位置和方向 -->
        <pose>0 0 0 0 0 0</pose>
        <!-- 标签设置为 "true"，代表在Gazebo仿真环境中可见 -->
        <visualize>true</visualize>
        <!-- 定义了传感器的更新频率 -->
        <update_rate>5.5</update_rate>
        <!-- 在 <ray> 标签内部定义了雷达传感器的扫描参数 -->
        <ray>
            <!-- <scan> 标签定义扫描的水平范围和分辨率 -->
            <scan>
                <!-- 设置扫描参数 -->
                <!-- <horizontal>：定义激光扫描传感器的水平参数 -->
                <!-- <vertical>：定义激光扫描传感器的垂直参数 -->
                <horizontal>
                    <!-- 扫描的样本数（360度） -->
                    <!-- 意味着激光扫描传感器在一次扫描中将获得 360 个测量值 -->
                    <samples>360</samples>
                    <!-- 扫描的角度步长 -->
                    <resolution>1</resolution>
                    <!-- 扫描的最小和最大角度 -->
                    <min_angle>-3</min_angle>
                    <max_angle>3</max_angle>
                </horizontal>
            </scan>
            <!-- <range> 标签定义雷达传感器的测量范围和分辨率 -->
            <range>
                <!-- 最小和最大测量距离 -->
                <min>0.10</min>
                <max>30.0</max>
                <!-- 测量距离的分辨率 -->
                <resolution>0.01</resolution>
            </range>
            <!-- <noise> 标签用于定义传感器的噪声模型，以模拟真实世界中传感器测量的不确定性 -->
            <noise>
                <!-- 指定了噪声类型为高斯噪声（gaussian），表示噪声呈正态分布 -->
                <type>gaussian</type>
                <!-- 指定了高斯噪声的均值和标准差 -->
                <mean>0.0</mean>
                <stddev>0.01</stddev>
            </noise>
        </ray>
        <!-- 在 <plugin> 标签内定义一个用于在Gazebo中运行雷达传感器的插件 -->
        <plugin name="gazebo_rplidar" filename="libgazebo_ros_laser.so">
            <!-- 指定ROS消息发布的主题名称 -->
            <topicName>/scan</topicName>
            <!-- 指定传感器的坐标系名称 -->
            <frameName>laser</frameName>
        </plugin>
    </sensor>
</gazebo>
```

### Example 

#### Code

``` xml
<!-- ! radar.urdf.xacro -->

<robot name="my_sensors" xmlns:xacro="http://wiki.ros.org/xacro">

  <!-- 雷达 -->
  <!-- 参考点位名为laser的link -->
  <gazebo reference="laser">
    <sensor type="ray" name="rplidar">
      <pose>0 0 0 0 0 0</pose>
      <visualize>true</visualize>
      <update_rate>5.5</update_rate>
      <ray>
        <scan>
          <horizontal>
            <samples>360</samples>
            <resolution>1</resolution>
            <min_angle>-3</min_angle>
            <max_angle>3</max_angle>
          </horizontal>
        </scan>
        <range>
          <min>0.10</min>
          <max>30.0</max>
          <resolution>0.01</resolution>
        </range>
        <noise>
          <type>gaussian</type>
          <mean>0.0</mean>
          <stddev>0.01</stddev>
        </noise>
      </ray>
      <plugin name="gazebo_rplidar" filename="libgazebo_ros_laser.so">
        <topicName>/scan</topicName>
        <frameName>laser</frameName>
      </plugin>
    </sensor>
  </gazebo>

</robot>
```

``` xml
<!-- ! my_base_camera_laser_radar.urdf.xacro -->

<robot name="my_car_camera" xmlns:xacro="http://wiki.ros.org/xacro">
    <xacro:include filename="my_base_camera_laser_move.urdf.xacro" />
    <!-- 包含控制器以及传动配置的 xacro 文件 -->
    <xacro:include filename="radar.urdf.xacro" />
</robot>
```

``` xml
<!-- ! radar.launch -->

<launch>
    <param name="robot_description" command="$(find xacro)/xacro $(find learning_gazebo)/urdf/my_base_camera_laser_radar.urdf.xacro" />
    <!-- 启动 gazebo -->
    <include file="$(find gazebo_ros)/launch/empty_world.launch" />
    <node pkg="gazebo_ros" type="spawn_model" name="model" args="-urdf -model mycar -param robot_description"  />
</launch>
```

#### Test 

``` lua

    启动 Rviz
    Add -> LaserScan
    LaserScan.Topic -> /scan
        -- 需要 gazebo 环境非空才会有明显的效果
```

## Camera

### Introduction 

通过 Gazebo 模拟摄像头传感器，并在 Rviz 中显示摄像头数据

### Grammar

``` xml
<!-- ! note_camera.urdf.xacro -->

<!-- camera -->
<!-- reference 用于指定传感器所参考的参考点或参考物体 -->
<gazebo reference="camera">
  <!-- 类型设置为 camara -->
  <sensor type="camera" name="camera_node">
    <!-- 设置传感器的更新频率为 30 Hz -->
    <update_rate>30.0</update_rate> 
    <!-- 摄像头基本信息设置 -->
    <camera name="head">
      <!-- 设置相机的水平视场角为 1.3962634 弧度 -->
      <horizontal_fov>1.3962634</horizontal_fov>
      <!-- 指定相机图像的属性，包括宽度为 1280 像素、高度为 720 像素和格式为 R8G8B8（每个像素用 3 字节表示） -->
      <image>
        <width>1280</width>
        <height>720</height>
        <format>R8G8B8</format>
      </image>
      <!-- 定义相机的剪裁范围，包括近剪裁面和远剪裁面 -->
      <!-- 在给定的剪裁范围内，物体将被渲染为图像 -->
      <clip>
        <near>0.02</near>
        <far>300</far>
      </clip>
      <!-- 定义相机图像的噪声模型，以高斯分布为例，包括均值和标准差 -->
      <noise>
        <type>gaussian</type>
        <mean>0.0</mean>
        <stddev>0.007</stddev>
      </noise>
    </camera>
    <!-- 核心插件 -->
    <plugin name="gazebo_camera" filename="libgazebo_ros_camera.so">
      <!-- 将插件设置为始终处于开启状态 -->
      <alwaysOn>true</alwaysOn>
      <!-- 设置插件的更新频率为 0 Hz（使用相机自己的更新频率） -->
      <updateRate>0.0</updateRate>
      <!-- 指定相机的名称为 "/camera" -->
      <cameraName>/camera</cameraName>
      <!-- 设定图像话题的名称为 "image_raw" -->
      <imageTopicName>image_raw</imageTopicName>
      <!-- 设定相机信息话题的名称为 "camera_info" -->
      <cameraInfoTopicName>camera_info</cameraInfoTopicName>
      <!-- 设置相机的坐标系名称为 "camera" -->
      <frameName>camera</frameName>
      <!-- 设置相机基线的值为 0.07，这个值是相机双目系统中两个相机之间的距离 -->
      <!-- 相机基线是双目视觉中的重要参数，用于计算物体的深度信息 -->
      <hackBaseline>0.07</hackBaseline>
      <!-- 设置图像畸变的参数 -->
      <!-- 用于模拟相机镜头畸变效应，典型的相机镜头畸变有径向畸变和切向畸变 -->
      <!-- 径向畸变是由于镜头形状引起的，会使得图像中离相机中心越远的部分产生畸变效应 -->
      <!-- 切向畸变是由于相机镜头安装不完全平行于图像平面而引起的，会导致图像中的物体出现沿着水平和垂直方向的偏移 -->
      <distortionK1>0.0</distortionK1>
      <distortionK2>0.0</distortionK2>
      <distortionK3>0.0</distortionK3>
      <distortionT1>0.0</distortionT1>
      <distortionT2>0.0</distortionT2>
    </plugin>
  </sensor>
</gazebo>
```

### Example 

#### Code 

``` xml
<!-- ! camera.urdf.xacro -->

<robot name="my_sensors" xmlns:xacro="http://wiki.ros.org/xacro">
  <gazebo reference="camera">
    <sensor type="camera" name="camera_node">
      <update_rate>30.0</update_rate> 

      <camera name="head">
        <horizontal_fov>1.3962634</horizontal_fov>
        <image>
          <width>1280</width>
          <height>720</height>
          <format>R8G8B8</format>
        </image>
        <clip>
          <near>0.02</near>
          <far>300</far>
        </clip>
        <noise>
          <type>gaussian</type>
          <mean>0.0</mean>
          <stddev>0.007</stddev>
        </noise>
      </camera>

      <plugin name="gazebo_camera" filename="libgazebo_ros_camera.so">
        <alwaysOn>true</alwaysOn>
        <updateRate>0.0</updateRate>
        <cameraName>/camera</cameraName>
        <imageTopicName>image_raw</imageTopicName>
        <cameraInfoTopicName>camera_info</cameraInfoTopicName>
        <frameName>camera</frameName>
        <hackBaseline>0.07</hackBaseline>
        <distortionK1>0.0</distortionK1>
        <distortionK2>0.0</distortionK2>
        <distortionK3>0.0</distortionK3>
        <distortionT1>0.0</distortionT1>
        <distortionT2>0.0</distortionT2>
      </plugin>
    </sensor>
  </gazebo>
</robot>
```

``` xml
<!-- ! my_base_camera_laser_camera.urdf.xacro -->

<robot name="my_car_camera" xmlns:xacro="http://wiki.ros.org/xacro">
    <xacro:include filename="my_base_camera_laser_move.urdf.xacro" />
    <xacro:include filename="camera.urdf.xacro" />
</robot>
```

``` xml
<!-- ! camera.launch -->

<launch>
    <param name="robot_description" command="$(find xacro)/xacro $(find learning_gazebo)/urdf/my_base_camera_laser_camera.urdf.xacro" />
    <include file="$(find gazebo_ros)/launch/empty_world.launch" />
    <node pkg="gazebo_ros" type="spawn_model" name="model" args="-urdf -model mycar -param robot_description"  />
</launch>
```

#### Test 

``` lua
    启动 Rviz
    Add -> Camera
    Camera.Image_Topic -> /camera/image_raw
```

## Kinect

### Introduction 

通过 Gazebo 模拟kinect摄像头，并在 Rviz 中显示深度摄像头数据

### Grammar 

``` xml
<!-- ! note_kinect.urdf.xacro -->

<gazebo reference="support">  
  <!-- 把雷达支架视为深度相机 -->
  <!-- 定义了一个类型为深度相机的传感器，并将其命名为 "camera" -->
  <sensor type="depth" name="camera">
    <!-- 设置深度相机传感器一直处于开启状态 -->
    <always_on>true</always_on>
    <!-- 设置深度相机传感器的更新频率为 20 Hz -->
    <update_rate>20.0</update_rate>

    <camera>
      <!-- 设置相机的水平视场角（FOV）为 60 度，单位为弧度 -->
      <horizontal_fov>${60.0*PI/180.0}</horizontal_fov>
      <!-- 定义了深度相机传感器的图像配置参数 -->
      <image>
        <!-- 设置图像格式为 R8G8B8（每个像素使用 3 字节表示 -->
        <format>R8G8B8</format>
        <!-- 设置图像的宽度和高度分别为 640 像素和 480 像素 -->
        <width>640</width>
        <height>480</height>
      </image>
      <!-- 定义了相机的剪裁范围 -->
      <clip>
        <near>0.05</near>
        <far>8.0</far>
      </clip>
    </camera>

    <plugin name="kinect_camera_controller" filename="libgazebo_ros_openni_kinect.so">
      <!-- 指定相机的名称为 "camera" -->
      <cameraName>camera</cameraName>
      <!-- 设置相机插件一直处于开启状态 -->
      <alwaysOn>true</alwaysOn>
      <!-- 设置相机插件的更新频率为 10 Hz -->
      <!-- 插件的更新频率可以与传感器的更新频率不一致 -->
      <updateRate>10</updateRate>
      <!-- 设置相机图像的 ROS 话题名称为 "rgb/image_raw" -->
      <imageTopicName>rgb/image_raw</imageTopicName>
      <!-- 设置深度图像的 ROS 话题名称为 "depth/image_raw" -->
      <depthImageTopicName>depth/image_raw</depthImageTopicName>
      <!-- 设置点云数据的 ROS 话题名称为 "depth/points" -->
      <pointCloudTopicName>depth/points</pointCloudTopicName>
      <!-- 设置相机信息的 ROS 话题名称为 "rgb/camera_info" -->
      <cameraInfoTopicName>rgb/camera_info</cameraInfoTopicName>
      <!-- 设置深度图像信息的 ROS 话题名称为 "depth/camera_info" -->
      <depthImageCameraInfoTopicName>depth/camera_info</depthImageCameraInfoTopicName>
      <!-- 设置相机链接的名称为 "support_depth" -->
      <!-- 该名称会在发布新设置的坐标系到kinect连杆的坐标变换关系时用到，以处理kinect点云坐标错位的问题 -->
      <frameName>support_depth</frameName>
      <!-- 设置相机的基线（baseline）为 0.1 -->
      <baseline>0.1</baseline>
      <!-- 设置径向畸变的参数为 0.0 -->
      <distortion_k1>0.0</distortion_k1>
      <distortion_k2>0.0</distortion_k2>
      <distortion_k3>0.0</distortion_k3>
      <!-- 设置切向畸变的参数为 0.0 -->
      <distortion_t1>0.0</distortion_t1>
      <distortion_t2>0.0</distortion_t2>
      <!-- 设置点云数据的截断距离为 0.4 -->
      <!-- 生成的点云数据将在距离相机 0.4 米之外被截断，超过这个距离的点将不会包含在点云中 -->
      <pointCloudCutoff>0.4</pointCloudCutoff>
    </plugin>
  </sensor>
</gazebo>
```

### Example 

#### Code 

``` xml
<!-- ! kinect.urdf.xacro -->

<robot name="my_sensors" xmlns:xacro="http://wiki.ros.org/xacro">
    <gazebo reference="support">  
      <sensor type="depth" name="camera">
        <always_on>true</always_on>
        <update_rate>20.0</update_rate>
        <camera>
          <horizontal_fov>${60.0*PI/180.0}</horizontal_fov>
          <image>
            <format>R8G8B8</format>
            <width>640</width>
            <height>480</height>
          </image>
          <clip>
            <near>0.05</near>
            <far>8.0</far>
          </clip>
        </camera>
        <plugin name="kinect_camera_controller" filename="libgazebo_ros_openni_kinect.so">
          <cameraName>camera</cameraName>
          <alwaysOn>true</alwaysOn>
          <updateRate>10</updateRate>
          <imageTopicName>rgb/image_raw</imageTopicName>
          <depthImageTopicName>depth/image_raw</depthImageTopicName>
          <pointCloudTopicName>depth/points</pointCloudTopicName>
          <cameraInfoTopicName>rgb/camera_info</cameraInfoTopicName>
          <depthImageCameraInfoTopicName>depth/camera_info</depthImageCameraInfoTopicName>
          <frameName>support_depth</frameName>
          <baseline>0.1</baseline>
          <distortion_k1>0.0</distortion_k1>
          <distortion_k2>0.0</distortion_k2>
          <distortion_k3>0.0</distortion_k3>
          <distortion_t1>0.0</distortion_t1>
          <distortion_t2>0.0</distortion_t2>
          <pointCloudCutoff>0.4</pointCloudCutoff>
        </plugin>
      </sensor>
    </gazebo>
</robot>
```

``` xml
<!-- ! my_base_camera_laser_kinect.urdf.xacro -->

<robot name="my_car_camera" xmlns:xacro="http://wiki.ros.org/xacro">
    <xacro:include filename="my_base_camera_laser_move.urdf.xacro" />
    <xacro:include filename="kinect.urdf.xacro" />
</robot>
```

``` xml
<!-- ! kinect.launch -->

<launch>
    <param name="robot_description" command="$(find xacro)/xacro $(find learning_gazebo)/urdf/my_base_camera_laser_kinect.urdf.xacro" />
    <include file="$(find gazebo_ros)/launch/empty_world.launch" />
    <node pkg="gazebo_ros" type="spawn_model" name="model" args="-urdf -model mycar -param robot_description"  />
</launch>
```

#### Test 

``` lua
    Add -> Camera
    Camera.Image_Topic -> /camera/depth/image_raw
    Camera.Image_Topic -> /camera/rgb/image_raw
    Add -> PointCloud2
    PointCloud2.Topic -> /camera/depth/points
        -- 由于在kinect中图像数据与点云数据使用了两套坐标系统，且两套坐标系统位姿并不一致，在rviz中显示点云会错位
        -- 解决方法：
```

``` xml
<!-- ! odometer.launch -->

<launch>
    <node pkg="rviz" type="rviz" name="rviz"  args="-d $(find learning_xacro)/config/rviz/arbotix.rviz"/>
    <!-- 发布新设置的坐标系到kinect连杆的坐标变换关系 -->
    <!-- 用于处理kinect点云坐标错位的问题 -->
    <node pkg="tf2_ros" type="static_transform_publisher" name="static_transform_publisher" args="0 0 0 -1.57 0 -1.57 /support /support_depth" />

    <node name="joint_state_publisher" pkg="joint_state_publisher" type="joint_state_publisher" />
    <node name="robot_state_publisher" pkg="robot_state_publisher" type="robot_state_publisher" />
</launch>
```
