---
title: Visualization
---

## Rqt

### Function

rqt（ROS Qt工具集）是一个灵活的图形化界面工具，用于进行ROS开发和调试

它提供了各种插件，可用于可视化传感器数据、控制机器人、查看状态信息等

可用于创建和管理ROS节点、发布和订阅ROS主题，还可以与其他ROS工具无缝集成

### Command

```lua
    rqt_graph
        -- 计算图可视化工具
    rqt_console
        -- 日志输出工具
    rqt_plot
        -- 数据绘图工具
    rqt_image_view
        -- 图像渲染工具
        -- 需配合仿真摄像头使用
    rqt
        -- 集成了所有rqt工具
```

## Rviz

### Function

rviz（ROS Visualization）是ROS中的三维可视化工具，用于显示和调试机器人的模型、传感器数据、运动规划等

它允许你在一个交互式的3D环境中查看机器人模型，并可视化传感器数据、机器人状态等，从而帮助你在开发和调试过程中进行可视化分析和验证

可用于显示机器人模型/坐标/点云/图像/路径规划/导航等

### Command

```lua
    roscore
    rosrun rviz rviz
```

## Gazebo

### Function

gazebo是一个功能强大的仿真引擎，专门用于模拟机器人和环境

它可以模拟物理特性、传感器、运动学、碰撞检测等，以实现真实世界的机器人行为

gazebo提供了一个交互式的3D仿真环境，你可以在其中运行ROS节点和控制机器人的行为，以测试和验证算法、路径规划等

### Command

```lua
    roslaunch gazebo_ros empty_world.launch
```

# URDF & RVIZ 

Dependence: urdf/xacro

## Urdf

### Grammar 

#### Structure 

``` xml
<!-- ! note_simple.urdf -->

<robot name="robot_name">
    <link name="link_name">
        <inertial>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
            <mass value="0.0"/>
            <inertia ixx="0.0" ixy="0.0" ixz="0.0" iyy="0.0" iyz="0.0" izz="0.0"/>
        </inertial>
        <visual name="">
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
            <geometry>
                <box size="0.0 0.0 0.0"/>
            </geometry>
            <material name="">
                <color rgba="0.0 0.0 0.0 1.0"/>
                <texture filename=""/>
            </material>
        </visual>
        <collision>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
            <geometry>
                <box size="0.0 0.0 0.0"/>
            </geometry>
        </collision>
    </link>

    <joint name="joint_name" type="fixed">
        <parent link="parent_link"/>
        <child link="child_link"/>
        <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
        <axis xyz="0.0 0.0 0.0"/>
        <limit lower="0.0" upper="0.0" effort="0.0" velocity="0.0"/>
        <calibration rising=""/>
        <dynamics damping="0.0" friction="0.0"/>
        <safety_controller k_position="100" k_velocity="1.5" soft_lower_limit="-2.857" soft_upper_limit="2.857"/>
    </joint>

    <sensor name="sensor_name" type="|camera,ray,imu,magnetometer,gps,force_torque,contact,sonar,rfidtag,rfid|" update_rate="">
        <parent link="parent_link"/>
        <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
        <!-- Sensor |camera,ray,imu,magnetometer,gps,force_torque,contact,sonar,rfidtag,rfid| -->
    </sensor>

    <camera>
        <image width="640" height="480" hfov="1.5708" format="RGB8" near="0.01" far="50.0"/>
    </camera>

    <transmission name="transmission_name">
        <type>transmission_interface/SimpleTransmission</type>
        <joint name="joint_name">
            <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
        </joint>
        <actuator name="actuator_name">
            <mechanicalReduction>1.0</mechanicalReduction>
            <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
        </actuator>
    </transmission>
    
</robot>
```

#### Detail

``` xml
<!-- ! note.urdf -->

<!-- 根元素 -->
<robot name="robot_name">
    <!-- 描述机器人某个部件(也即刚体部分)的外观和物理属性 -->
    <link name="link_name">
        <!-- 描述连杆的惯性特性 -->
        <inertial>
            <!-- 定义相对于连杆坐标系的惯性系参考坐标，此坐标原点须为连杆重心，坐标轴可与惯性主轴不平行 -->
                <!-- xyz：表示 x , y , z 方向的偏置，单位为米，默认零向量 -->
                <!-- rpy：表示坐标轴在RPY方向的偏置，单位为弧度 -->
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
            <!-- 定义连杆的质量属性 -->
            <mass value="0.0"/>
            <!-- 表示一个3*3旋转惯性矩阵 -->
            <inertia ixx="0.0" ixy="0.0" ixz="0.0" iyy="0.0" iyz="0.0" izz="0.0"/>
        </inertial>

        <!-- 连杆的可视化特性，用于指定连杆显示的形状 -->
        <visual name="">
            <!-- 相对于连杆坐标系的几何形状坐标系（子元素同上） -->
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
            <!-- 可视化对象的形状 -->
            <geometry>
                <!-- box：长方体，元素包含长、宽、高，原点在中心 -->
                <!-- cylinder：圆柱体，元素包含半径、长度，原点在中心 -->
                <!-- sphere：球体，元素包含半径，原点在球心 -->
                <!-- mesh：网格，由本地文件决定，同时提高scale界定边界 -->
                <box size="0.0 0.0 0.0"/>
            </geometry>
            <!-- 可视化组件的材料，可在link标签外定义（引用名称即可） -->
            <material name="">
                <!-- color：颜色，rgba属性 -->
                <color rgba="0.0 0.0 0.0 1.0"/>
                <!-- texture：材料属性，由文件决定 -->
                <texture filename=""/>
            </material>
        </visual>

        <!-- 连杆的碰撞特性，由其定义的几何图形集构成，常用于简化计算 -->
        <collision>
            <!-- 相对于连杆坐标系的碰撞组件坐标系（子元素同上） -->
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
            <!-- 可视化对象的形状（子元素同上） -->
            <geometry>
                <box size="0.0 0.0 0.0"/>
            </geometry>
        </collision>
    </link>

    <!-- 用于描述机器人关节的运动学和动力学属性，指定关节运动的安全极限，不同的关节有不同的运动形式 -->
    <!-- type：关节运动形式，具体如下： -->
        <!-- continuous: 旋转关节，可以绕单轴无限旋转 -->
        <!-- revolute:   旋转关节，类似于 continues，但是有旋转角度限制 -->
        <!-- prismatic:  滑动关节，沿某一轴线移动的关节，有位置极限 -->
        <!-- planer:     平面关节，允许在平面正交方向上平移或旋转 -->
        <!-- floating:   浮动关节，允许进行平移、旋转运动 -->
        <!-- fixed:      固定关节，不允许运动的特殊关节 -->
    <joint name="joint_name" type="fixed">
        <!-- 强制属性，parent link的名字，是这个link在机器人结构树中的名字 -->
        <parent link="parent_link"/>
        <!-- 强制属性，child link的名字，是这个link在机器人结构树中的名字 -->
        <child link="child_link"/>
        <!-- 表示从parent link到child link的变换，joint位于child link的原点，修改参数可调整连杆位置（子元素同上） -->
        <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
        <!-- prismatic joint移动的轴，是planar joint的标准平面。这个轴在joint坐标系中被指定。修改该参数可以调整关节的旋转所绕着的轴，常用于调整旋转方向，若模型旋向与实际相反，只需乘-1即可 -->
            <!-- xyz：代表轴向量的x , y , z分量，为标准化的向量 -->
        <axis xyz="0.0 0.0 0.0"/>
        <!-- 关节运动学约束 -->
            <!-- lower：指定关节运动范围下界的属性，默认为0 -->
            <!-- upper：指定关节运动范围上界的属性，默认为0 -->
            <!-- effort：指定关节运行时的最大力 -->
            <!-- velocity：指定关节运行最大速度 -->
        <limit lower="0.0" upper="0.0" effort="0.0" velocity="0.0"/>
        <!-- 参考点，用于矫正joint绝对位置 -->
            <!-- rising：正向运动时触发上升沿 -->
            <!-- falling：正向运动时触发下降沿 -->
        <calibration rising=""/>
        <!-- 指定物理、建模性能，仿真时重要 -->
            <!-- damping：阻尼值，默认为0 -->
            <!-- friction：摩擦力值，默认为0 -->
        <dynamics damping="0.0" friction="0.0"/>
        <!-- 安全控制限制 -->
            <!-- soft_lower_limit：指定安全控制边界的下界，为安全控制的起始限制点 -->
            <!-- soft_upper_limit：指定安全控制边界的上界，为安全控制的起始限制点 -->
            <!-- k_position：指定位置与速度之间的关系 -->
            <!-- k_velocity：指定力与速度之间的关系 -->
        <safety_controller k_position="100" k_velocity="1.5" soft_lower_limit="-2.857" soft_upper_limit="2.857"/>
    </joint>

    <!-- 用于描述传感器等 -->
    <!-- 具体用法参见 "URDF & GAZEBO & Rviz" 部分 -->
    <sensor name="sensor_name" type="|camera,ray,imu,magnetometer,gps,force_torque,contact,sonar,rfidtag,rfid|" update_rate="">
        <parent link="parent_link"/>
        <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
        <!-- Sensor |camera,ray,imu,magnetometer,gps,force_torque,contact,sonar,rfidtag,rfid| -->
    </sensor>
    <!-- 用于描述摄像头 -->
    <!-- 从略 -->
    <camera>
        <image width="640" height="480" hfov="1.5708" format="RGB8" near="0.01" far="50.0"/>
    </camera>
    <!-- 用于描述关节与驱动器之间的关系 -->
    <!-- 具体用法参见 "URDF & GAZEBO & Rviz" 部分 -->
    <transmission name="transmission_name">
        <type>transmission_interface/SimpleTransmission</type>
        <joint name="joint_name">
            <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
        </joint>
        <actuator name="actuator_name">
            <mechanicalReduction>1.0</mechanicalReduction>
            <hardwareInterface>hardware_interface/PositionJointInterface</hardwareInterface>
        </actuator>
    </transmission>
    
</robot>
```

### Example

#### Code

``` xml
<!-- ! urdf_sample.urdf -->

<robot name="urdf_sample">
    <link name="base_link">
        <visual>
            <origin xyz="0.0 0.0 1.5" rpy="0.0 0.0 0.0"/>
            <geometry>
                <box size="4 4 3"/>
            </geometry>
            <material name="red">
                <color rgba="1.0 0.0 0.0 0.8"/>
            </material>
        </visual>
    </link>

    <link name="wheel1">
        <visual>
            <!-- 相对关节的坐标 -->
            <origin xyz="0.25 0.0 0" rpy="0.0 1.57 0.0"/>
            <geometry>
                <cylinder radius="1" length="0.5"/> 
            </geometry>
            <material name="blue">
                <color rgba="0.0 0.0 1.0 0.8"/>
            </material>
        </visual>
    </link>
    
    <joint name="base_link2wheel1" type="continuous">
        <!-- 相对世界的坐标 -->
        <origin xyz="2.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
        <parent link="base_link"/>
        <child link="wheel1"/>
        <axis xyz="1.0 0.0 0.0"/>
    </joint>

    <link name="wheel2">
        <visual>
            <!-- 相对关节的坐标 -->
            <origin xyz="-0.25 0.0 0" rpy="0.0 -1.57 0.0"/>
            <geometry>
                <cylinder radius="1" length="0.5"/> 
            </geometry>
            <material name="blue">
                <color rgba="0.0 0.0 1.0 0.8"/>
            </material>
        </visual>
    </link>
    
    <joint name="base_link2wheel2" type="continuous">
        <!-- 相对世界的坐标 -->
        <origin xyz="-2.0 0.0 0.0" rpy="0.0 0.0 0.0"/>
        <parent link="base_link"/>
        <child link="wheel2"/>
        <axis xyz="-1.0 0.0 0.0"/>
    </joint>
</robot>
```

``` xml
<!-- ! urdf_sample.launch -->

<launch>
    <!-- 如何导入 urdf 文件? 在 ROS 中，可以将 urdf 文件的路径设置到参数服务器，使用的参数名是:robot_description -->
    <param name="robot_description" textfile="$(find learning_xacro)/urdf/urdf_sample.urdf" />

    <!-- 启动 rviz -->
    <node name="rviz" pkg="rviz" type="rviz"/>
    <!-- 注： -->
        <!-- 重复启动launch文件时，Rviz 之前的组件配置信息不会自动保存；为了方便使用，可以在rviz的file选项卡中将当前配置保存进config目录，并为 Rviz 的启动配置添加参数 -->
        <!-- <node name="rviz" pkg="rviz" type="rviz" args="-d $(find learning_xacro)/config/rviz/urdf_sample.rviz"/> -->
    
    <!-- 添加机器人状态发布节点 -->
    <node pkg="robot_state_publisher" type="robot_state_publisher" name="robot_state_publisher" />
    <!-- 添加关节状态发布节点 -->
    <node pkg="joint_state_publisher" type="joint_state_publisher" name="joint_state_publisher" />

    <!-- 可选:用于控制关节运动的节点 -->
    <!-- 生成关节控制的UI，用于测试关节运动是否正常 -->
    <node pkg="joint_state_publisher_gui" type="joint_state_publisher_gui" name="joint_state_publisher_gui" />
</launch>
```

### Config

``` lua
    Add -> RobotModel
        --  在 Rviz 中，添加机器人显示组件，在 Rviz 中显示机器人模型
```

## Xacro

### Grammar

``` xml
<!-- ! note.xacro -->

<!-- 属性与算术运算： -->
<xacro:property name="" value="" />
    <!-- 作用：封装URDF中的字段，例如小车尺寸、轮子半径等 -->
    <!-- 属性调用：${property_name} -->
    <!-- 算术运算：${property_name1+property_name2...} -->

<!-- 宏： -->
<xacro:macro name="" params="param1 param2 ...">
    <!-- 作用：函数实现，提高代码复用率，优化代码结构，提高安全性 -->
    <!-- 宏调用：<xacro:macro_name param1=xxx param2=xxx/> -->

<!-- 文件包含集成： -->
<robot name="" xmlns:xacro="http://wiki.ros.org/xacro">
      <xacro:include filename="file1.xacro" />
      <xacro:include filename="file2.xacro" />
      <xacro:include filename="file3.xacro" />
      ....
</robot>
    <!-- 作用：将机器人的不同部件封装为单独的xacro文件，将文件集成组成为完整机器人，可以使用文件包含实现 -->
```

### Example 

#### Code 

``` xml
<!-- ! my_base.urdf.xacro -->

<!--
    小车底盘实现：
        1.将一些常量、变量封装为 xacro:property，比如:PI 值、小车底盘半径、离地间距、车轮半径、宽度 ....
        2.使用 宏 封装驱动轮以及支撑轮实现，调用相关宏生成驱动轮与支撑轮
-->

<robot name="my_base" xmlns:xacro="http://www.ros.org/wiki/xacro">
    <!-- 封装变量、常量 -->
    <xacro:property name="PI" value="3.141"/>
    <!-- 宏:黑色设置 -->
    <material name="black">
        <color rgba="0.0 0.0 0.0 1.0" />
    </material>
    <!-- 底盘属性 -->
    <xacro:property name="base_footprint_radius" value="0.001" /> <!-- base_footprint 半径  -->
    <xacro:property name="base_link_radius" value="0.1" /> <!-- base_link 半径 -->
    <xacro:property name="base_link_length" value="0.08" /> <!-- base_link 长 -->
    <xacro:property name="earth_space" value="0.015" /> <!-- 离地间距 -->

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
    </link>

    <joint name="base_link2base_footprint" type="fixed">
      <parent link="base_footprint" />
      <child link="base_link" />
      <origin xyz="0 0 ${earth_space + base_link_length / 2 }" />
    </joint>

    <!-- 驱动轮 -->
    <!-- 驱动轮属性 -->
    <xacro:property name="wheel_radius" value="0.0325" /><!-- 半径 -->
    <xacro:property name="wheel_length" value="0.015" /><!-- 宽度 -->
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
      </link>

      <joint name="${name}_wheel2base_link" type="continuous">
        <parent link="base_link" />
        <child link="${name}_wheel" />
        <origin xyz="0 ${flag * base_link_radius} ${-(earth_space + base_link_length / 2 - wheel_radius) }" />
        <axis xyz="0 1 0" />
      </joint>
    </xacro:macro>
    <xacro:add_wheels name="left" flag="1" />
    <xacro:add_wheels name="right" flag="-1" />
    <!-- 支撑轮 -->
    <!-- 支撑轮属性 -->
    <xacro:property name="support_wheel_radius" value="0.0075" /> <!-- 支撑轮半径 -->

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
      </link>

      <joint name="${name}_wheel2base_link" type="continuous">
          <parent link="base_link" />
          <child link="${name}_wheel" />
          <origin xyz="${flag * (base_link_radius - support_wheel_radius)} 0 ${-(base_link_length / 2 + earth_space / 2)}" />
          <axis xyz="1 1 1" />
      </joint>
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
    <xacro:property name="camera_length" value="0.01" /> <!-- 摄像头长度(x) -->
    <xacro:property name="camera_width" value="0.025" /> <!-- 摄像头宽度(y) -->
    <xacro:property name="camera_height" value="0.025" /> <!-- 摄像头高度(z) -->
    <xacro:property name="camera_x" value="0.08" /> <!-- 摄像头安装的x坐标 -->
    <xacro:property name="camera_y" value="0.0" /> <!-- 摄像头安装的y坐标 -->
    <xacro:property name="camera_z" value="${base_link_length / 2 + camera_height / 2}" /> <!-- 摄像头安装的z坐标:底盘高度 / 2 + 摄像头高度 / 2  -->

    <!-- 摄像头关节以及link -->
    <link name="camera">
        <visual>
            <geometry>
                <box size="${camera_length} ${camera_width} ${camera_height}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
            <material name="black" />
        </visual>
    </link>

    <joint name="camera2base_link" type="fixed">
        <parent link="base_link" />
        <child link="camera" />
        <origin xyz="${camera_x} ${camera_y} ${camera_z}" />
    </joint>
</robot>
```

``` xml
<!-- ! my_laser.urdf.xacro -->

<!-- 小车底盘添加雷达 -->

<robot name="my_laser" xmlns:xacro="http://wiki.ros.org/xacro">

    <!-- 雷达支架 -->
    <xacro:property name="support_length" value="0.15" /> <!-- 支架长度 -->
    <xacro:property name="support_radius" value="0.01" /> <!-- 支架半径 -->
    <xacro:property name="support_x" value="0.0" /> <!-- 支架安装的x坐标 -->
    <xacro:property name="support_y" value="0.0" /> <!-- 支架安装的y坐标 -->
    <xacro:property name="support_z" value="${base_link_length / 2 + support_length / 2}" /> <!-- 支架安装的z坐标:底盘高度 / 2 + 支架高度 / 2  -->

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
    </link>

    <joint name="support2base_link" type="fixed">
        <parent link="base_link" />
        <child link="support" />
        <origin xyz="${support_x} ${support_y} ${support_z}" />
    </joint>


    <!-- 雷达属性 -->
    <xacro:property name="laser_length" value="0.05" /> <!-- 雷达长度 -->
    <xacro:property name="laser_radius" value="0.03" /> <!-- 雷达半径 -->
    <xacro:property name="laser_x" value="0.0" /> <!-- 雷达安装的x坐标 -->
    <xacro:property name="laser_y" value="0.0" /> <!-- 雷达安装的y坐标 -->
    <xacro:property name="laser_z" value="${support_length / 2 + laser_length / 2}" /> <!-- 雷达安装的z坐标:支架高度 / 2 + 雷达高度 / 2  -->

    <!-- 雷达关节以及link -->
    <link name="laser">
        <visual>
            <geometry>
                <cylinder radius="${laser_radius}" length="${laser_length}" />
            </geometry>
            <origin xyz="0.0 0.0 0.0" rpy="0.0 0.0 0.0" />
            <material name="black" />
        </visual>
    </link>

    <joint name="laser2support" type="fixed">
        <parent link="support" />
        <child link="laser" />
        <origin xyz="${laser_x} ${laser_y} ${laser_z}" />
    </joint>
</robot>
```

``` xml
<!-- ! my_base_camera_laser.urdf.xacro -->

<!-- 组合小车底盘与摄像头与雷达 -->
<robot name="my_car_camera" xmlns:xacro="http://wiki.ros.org/xacro">
    <xacro:include filename="my_base.urdf.xacro" />
    <xacro:include filename="my_camera.urdf.xacro" />
    <xacro:include filename="my_laser.urdf.xacro" />
</robot>
```

``` xml
<!-- ! my_base_camera_laser1.launch -->

<!-- 需先运行：rosrun xacro xacro xxx.xacro > xxx.urdf -->

<launch>
   <param name="robot_description" textfile="$(find learning_xacro)/xacro/my_base_camera_laser.urdf" />
   <node pkg="rviz" type="rviz" name="rviz" />
   <node pkg="joint_state_publisher" type="joint_state_publisher" name="joint_state_publisher" output="screen" />
   <node pkg="robot_state_publisher" type="robot_state_publisher" name="robot_state_publisher" output="screen" />
   <node pkg="joint_state_publisher_gui" type="joint_state_publisher_gui" name="joint_state_publisher_gui" output="screen" />
</launch>
```

``` xml
<!-- ! my_base_camera_laser2.launch -->

<!-- 直接运行即可 -->

<launch>
    <param name="robot_description" command="$(find xacro)/xacro $(find learning_xacro)/xacro/my_base_camera_laser.urdf.xacro" />
    <node pkg="rviz" type="rviz" name="rviz" />
    <node pkg="joint_state_publisher" type="joint_state_publisher" name="joint_state_publisher" output="screen" />
    <node pkg="robot_state_publisher" type="robot_state_publisher" name="robot_state_publisher" output="screen" />
    <node pkg="joint_state_publisher_gui" type="joint_state_publisher_gui" name="joint_state_publisher_gui" output="screen" />
</launch>
```

#### Analysis

``` lua
    urdf_to_graphiz xxx.urdf
        -- 检查模型整体结构
    evince xxx.pdf
        -- 查看生成的pdf文件
```
