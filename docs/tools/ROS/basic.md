---
title: Basic
---

## COMMANDS

```lua
    rosversion -d
        -- 查看版本号

    rospack list
        -- 列出所有的功能包

    roscd <pkg_n>
        -- 前往功能包目录
        
    rosnode list
        -- 列出所有活跃的节点
    rosnode info <node_n>
        -- 列出节点的信息，如发布/订阅的话题，提供的服务

    rostopic list
        -- 列出所有可发布的话题
    rostopic pub <topic_n> <msg_n> "<msg>"
        -- 发布指定话题，并给出消息类型及其值

    rosmsg list
        -- 列出所有可用的消息
    rosmsg info/show <msg_n>
        -- 查看指定的消息

    rosservice list
        -- 列出所有可调用的服务
    rosservice call <service_n> "<service>"
        -- 调用指定服务

    rossrv list
        -- 列出所有可用的服务类型
    rossrv info/show <type_n>
        -- 查看指定的服务类型

    roscore
        -- 启动ROS主节点，帮助节点建立连接

    rosrun <package> <filename> [__name:=<node_n>] [args...]
        -- 运行可执行文件

    roslaunch [options] [package] <filename> [arg_name:=value...]
        -- 运行launch文件
        
    rosparam list
        -- 列出当前的参数
    rosparam get <param_key>
        -- 显示参数值
    rosparam set <param_key> “<param_value>”
        -- 设置参数
    rosparam delete <param_key>
        -- 删除参数
    rosparam dump <file_n>
        -- 保存参数到文件
    rosparam load <file_n>
        -- 从文件加载参数

    rosbag record -a -O <zip_n>
        -- 记录
    rosbag play <zip_n>.bag
        -- 复现记录
```

## WORKSPACE

### Structure

```lua
    src/
        -- 代码空间
    build/
        -- 编译空间
    devel/
        -- 开发空间
    install/
        -- 安装空间
```

### Create a workspace

```lua
    mkdir -p <path>/<ws_n>/src/
    cd <path>/<ws_n>/src/
    catkin_init_workspace
        -- 创建工作空间
        -- <ws_n>自定义，后文<pkg_n>同理
    cd <path>/<ws_n>/
    catkin_make install
        -- 编译工作空间
        -- 必须在工作空间目录下
        -- install是为了构建安装空间，本地测试时可省略
    source ./devel/setup.bash
    echo $ROS_PACKAGE_PATH
        -- 设置临时环境变量并检查
        -- source将setup.bash的内容加载到当前的Shell环境中
        -- setup.bash的作用是指定在运行catkin构建命令时使用的shell类型，并调用了另外一个名为setup.sh的脚本文件
        -- setup.sh指定了Python脚本文件_setup_util.py的路径
        -- 详情请自行查看文件
    [opiton] echo "source <path>/<ws_n>/devel/setup.bash" >> ~/.bashrc
    [option] source ~/.bashrc
        -- 永久添加环境变量
        -- .bashrc是Bash shell在启动时读取的配置文件之一
```

### Add a package

```lua
    cd <path>/<ws_n>/src/r
    catkin_create_pkg <pkg_n> [depend]
        -- 创建功能包并导入依赖
        -- 依赖包括std_msgs/std_srvs/geometry_msgs/rospy/roscpp/turtlesim.etc
    cd <path>/<ws_n>/
    catkin_make
    source ./devel/setup.bash
        -- 编译功能包
```
