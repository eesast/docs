---
title: C/C++ Windows编程
---

## 目录

在接下来的文章中，你将看到以下内容：
> 一、看前必读  
> 二、背景介绍  
> 三、计算机与C语言补充知识  
> 四、C语言Windows API窗体程序  
> 五、C++对窗口的类封装  
> 六、结语  

## 一、看前必读

如果您点开了这篇文章，我很高兴能够得到您的垂爱，不过在您阅读这篇文章之前，我还是有一些事情要提前进行说明。

1. 本文章阅读所需时间从半个小时到半年以上不等，因人而异；
2. 本文是一篇不具有时效性、不具有现代性、不具有实用性、不具有可操作性的文章。本文主要面向对Windows系统感兴趣，尤其是对历史沿革与对文物古迹感兴趣的业余程序员。如果您对这方面并不感兴趣，或者您指望通过这篇文章来了解在大厂工作的面试技能亦或是未来的工作技能，那么您将浪费您宝贵的数个小时到数个月的时间；
3. 即使您对这篇文章非常感兴趣，也不要指望能看完一次之后就能够看懂这篇文章。熟练掌握这篇文章的内容可能需要长达几十到几百个小时的练习时间；
4. 如果您看完了前面这三点并且仍然对阅读这篇文章有强烈的渴望，那，开启您的阅读之旅吧！

## 二、背景介绍

### （二：一）什么是Windows API

Windows API，这个名字由两部分组成：一是Windows，代表Windows操作系统；二是API，是英文Application Programming Interface的缩写，中文译为“应用程序编程接口”。因此，它是微软公司为了让程序员直接使用代码与Windows系统实现交互而留出的编程接口。这个接口一般来说是由C语言编写的，但是可以由C++、C#等多种语言来调用。鉴于C#等语言不是很贴近底层，调用API并不能直观地了解到Windows API内部的结构，而且C#有.NET与UWP作为支撑，使用Windows API的意义不大，因此本文主要就C语言和C++语言展开。  

Windows API的前身WIN16 API起源于16位操作系统MS-DOS，在当时Windows尚不是一个操作系统，仅仅是运行在MS-DOS上的一个图形界面程序。后来，当Windows进入了32位时代，便脱离了MS-DOS。但为了与WIN16 API的程序保持兼容，以防止大量的WIN16代码作废，微软隆重推出了WIN32 API，也就是现在我们看到了Windows API。而由于64位的Windows API与WIN32 API相差无几，因此即使是64位的Windows接口，我们也习惯上称之为WIN32 API。在后面的文章中，在不引起歧义的情况下，Windows API与WIN32 API两个词将不加区别地混合使用，而16位的接口将特别指出为WIN16 API。  

### （二：二）Windows API有什么用

首先，Windows API可以帮助我们用C/C++开发Windows系统的图形界面程序。一提起C++图形界面程序，大家可能会想到近年来十分流行的Qt。确实，Qt可以帮助我们十分便捷地开发C++图形界面程序，而且用Windows API编写的图形界面程序相比Qt来说十分困难、繁杂与丑陋。而且，Qt编写的代码可以在多个操作系统上编译通过，但Windows API编写的代码只能在Windows系统上编译通过。相比之下，Windows API的图形界面程序是不是一无是处呢？答案是几乎处处肯定的——作为现代的程序员，几乎很少有用Windows API编写图形界面程序的了。不过“几乎处处”代表Windows API还是在一个零测集上有优势的。首先，Qt在Windows系统上本质是对Windows API的封装，因此执行效率上肯定是较慢的。而且，Qt编写的程序依赖于Qt自己的dll库，如果要把一个Qt程序发给客户使用，那么就需要把Qt的一系列DLL一同发给客户——这是因为DLL作为动态链接库是程序运行时链接的；而作为Windows API，其运行库在Windows系统中早已存在，因此只需要发给客户CRT（C语言运行时库）即可，或者使用静态编译（MSVC开启`/MT`或`/MTd`选项，而gcc/g++开启`-static`选项）把C/C++库链接到可执行文件里即可，不过这样会增大可执行文件的体积。  

第二，Windows API可以实现一些直接Windows系统进行交互的操作，例如修改注册表、键鼠钩子~~以及编写计算机病毒~~等，这些是Qt实现不了的，需要借助Windows API。 

但是，由于Windows API代码封装性差、代码风格古老脱离时代、编写过于困难、资源泄露现象严重、微软独创的匈牙利命名法等，微软一直在开发诸如 .NET、UWP等意图替代掉Windows API，相信在很久的未来，Windows API也不会成为历史（手动狗头）。  

## 三、计算机与C语言补充知识

要学习Windows API，我们还需要一些计算机方面与C语言方面的补充知识。

### （三：一）字、双字、四字

我们知道，计算机以二进制比特(bit)存储数据，一个字节(Byte)=8bit。那么字节以上的单位是什么呢？

Word，中文称作“字”，1word = 2Byte；Double Word，简称dword，双字，1dword = 2word = 4Byte；Quad Word，简称qword，四字，1qword = 4word = 8Byte。

### （三：二）字符集与字符编码

我们在学习C/C++的时候，`char`类型一般都储存着一个字符的ASCII码，范围是0\~127；而对于其他范围的字符，则使用ANSI扩展码，每两个字节（要求第一个字节>127，或者说<0）会显示成一个字符，例如中文的汉字。但是，不同的国家对这部分的字符使用的字符集是不同的，例如我们国家常使用GB2312字符集来编码汉字，繁体中文Windows系统常采用Big5编码繁体汉字，日文Windows操作系统采用JIS编码假名和汉字，等等。这就导致了同样的二进制码在不同的地域、不同版本的操作系统上可能有不同的显示结果。为了解决这个矛盾，Unicode字符集出现在了历史舞台上。在Unicode字符集中，每个字符用两个字节来存储，65536个码位几乎可以容纳世界上的所有字符了。而且在0\~127范围内Unicode码的低字节就是ASCII码，且高字节为零，对其完美兼容。  

值得指出的是，字符编码与字符集是不同的。为了储存Unicode码，人们还设计出utf-8、utf-16等多种变长编码，想了解的同学可以尝试做一下力扣的第393题[https://leetcode-cn.com/problems/utf-8-validation/](https://leetcode-cn.com/problems/utf-8-validation/)来初步了解什么是utf-8。

不过储存Unicode等字符集的编码，使用`char`类型是肯定不够的。对此，C/C++有相应的类型`wchar_t`来存储（我们姑且不考虑C11和C++11推出的`char8_t`、`char16_t`等存储utf系列编码的类型，因为Windows API出现的那个年代还没有这些东西，即使是现在0202年了这些类型相应的标准库也没有完善）。`wchar_t`称作“宽字符（wide character）”类型，其大小不定，以2个和4个字节居多。相应地，宽字符常量是在我们熟悉的单引号引起来的字符常量前加上字母`L`，例如`'a'`表示一个字符常量，而`L'a'`表示一个宽字符常量；宽字符串字面量同理，`L"eesast"`表示一个宽字符串字面量（wide string literal）“eesast”。

### （三：三）函数的调用约定

在**Windows系统**上，对于一个C语言程序，函数的调用约定有四种：cdecl、stdcall、fastcall、vectorcall，C++语言程序除此之外新增一个thiscall。需要注意的是，**具有不同调用约定的函数是不同的函数类型**。其中对我们有用的有两个：cdecl和stdcall。cdecl函数的参数从右向左入栈，最后栈的清理（即栈指针的移动）由调用者完成；而stdcall的参数从右向左入栈，而栈的清理是由被调用的函数完成的。由此可知，像`printf`这样的变参函数，其调用约定一定是cdecl的，因为被调用者并不知道参数个数，因此无法清栈。

### （三：四）回调函数

回调函数（callback function）的概念比较抽象。具体来说就是把一个函数的地址作为参数传递给他人，当某种条件发生时，回调函数会自动被调用。回调函数的调用约定必须是stdcall的。  

### （三：五）匈牙利命名法

匈牙利命名法是一个微软程序员发明的命名法，它会在每个变量前加上一些前缀（prefix）来表示它的类型，比如i-代表整形、p-代表指针、lp-代表长指针、sz-代表字符串等等。例如要定义一个字符串变量叫做`name`，按照匈牙利命名法就是`szName`。

### （三：六）远指针、近指针与巨指针

我们说过Windows API起源于16位系统，在里面我们不可避免地看到16位系统的东西。例如上一段所说的“长指针（long pointer）”问题。16位8086体系采用段式访问，因此指针大小不同，近指针（near pointer）为2个字节，只能在本段内寻址，而远指针（far pointer）和巨指针（huge pointer）为4个字节，可以跨段寻址。上面说的“长指针”通常指32位的指针。但是32位处理器以后，便不再有段式寻址了，三种指针也合三为一，统一变成了现在我们看到的指针。但是，我们将会看到，作为历史的遗迹，Win32 API却留下了当年的影子。

## 四、C语言Windows API窗体程序

说了这么多预备知识，我们终于可以进入正题了！从上面巨多的预备知识可以看出，这块硬骨头是有多么难啃。  

Windows API的绝大多数接口的声明都已经被各大Windows平台的C/C++编译器在`windows.h`头文件中写好了，我们只需要去包含这个头文件即可。但是，由于里面内容过多，有很多是我们不需要的或极少用的，编译它们会耗费过多的时间，需要用的时候单独拿出来即可（例如gdiplus、mmsystem相关的头文件）。因此我们在包含这个头文件之前定义`WIN32_LEAN_AND_MEAN`可以避免它们被编译，即我们应该写：  

```c
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
```

对于从此处往下的文章，正确的食用方式是：看完前几段会觉得什么也看不懂，这是很正常的，因为只有后面的文章熟练了才能深入理解前面部分的内容；而只有前面部分看会了，才能看懂后面的部分。你可能会觉得这是永远学不会的意思 ~~，就好像期末考试前一天才开始复习的我们~~。 但实际上不是的，以下的文章应该前后交替反复递归地看，并且动手操作 ~~，并遇到足够多的BUG~~，才能真正理解。  

**值得指出的是，我们下面的文章主要针对平台：VS2019搭载MSVC v142来进行叙述。**  

### （四：一）Win32 API数据类型

Win32 API中有很多自定义的数据类型，例如：`WORD`（字）、`DWORD`（双字）、`INT`（32位有符号整数）、`UINT`（32位无符号整数）、`LONG`（32位有符号整数）、`ULONG`（32位无符号整数）、`INT8`（8位有符号整数）、`BOOL`（32位布尔型变量）、`BOOLEAN`（8位布尔型变量）、`CHAR`（8位字符型变量）、`WCHAR`（16位Unicode字符类型）、`VOID`（空类型）、`LPSTR`（字符串类型）、`LPWSTR`（Unicode字符串）、`LPCSTR`（常量字符串）等等。值得注意的是，它们都预先被`typedef`好了，我们不需要管它是用什么基本数据类型实现的，它们与基本数据类型也不是一一对应的关系。此外，它们前面加上`P`或`LP`就成为了对应得指针类型。例如`LPVOID`等价于`VOID*`。

### （四：二）字符与宽字符的统一化

如果我们每次都要统一地判断字符与宽字符，那未免太麻烦了，而且程序通用性极差——如果我们有一天要支持不同的环境，需要不同的字符集，那不是每一处都要修改吗？为了解决这个问题，Windows平台的编译器一般会提供一个头文件“tchar.h”，里面定义了`TCHAR`、`LPTSTR`等一系列通用的字符（串）类型，以及相应的字符串处理函数。而且，在“Windows.h”里的所有函数的普通字符和Unicode字符的两个版本也都定义了通用的宏。具体是如何实现的呢？我们可以打开头文件tchar.h来看一看。以`TCHAR`和`_tcslen`为例：  

```c
#ifdef UNICODE
typedef WCHAR TCHAR
#else
typedef CHAR TCHAR
#endif
```
8
```c
#ifdef _UNICODE
#define _tcslen strlen
#else
#define _tcslen wcslen
#endif
```

其中`strlen`是大家熟悉的求字符串长度函数，而`wcslen`是求宽字符串长度的函数。  
由上面的代码可以看出，只要我们定义了`UNICODE`和`_UNICODE`两个宏，我们就是在使用宽字符（串）；而没有定义这两个宏，就是在使用传统的窄字符（串）。对于MSVC来说，只要在项目属性页中勾选“使用Unicode字符集”而不是“使用多字节字符集”就可以办到；而对于gcc/g++，我们需要手动加上`-D`选项来预定义这两个宏。值得注意的是，这两个宏必须同时定义才不致引起混乱。

此外，对于字符串字面量，我们也有统一的方法：`_T`、`__T`、`TEXT`、`__TEXT`这四个宏用来做通用字符串字面量的转换。例如一个通用的"eesast"字面量可以表示为：`TEXT("eesast")`，其余三个宏同理。

在tchar.h中，`main`函数也有相应的宏`_tmain`，来通用地表示`main`与宽字符的`wmain`。  

### （四、三）Windows应用程序的基础概念

Windows应用程序有一些基础概念我们是要知道的。  
对于一个可执行文件，我们可以执行它多次，每一次执行称作这个应用程序的一个**实例（instance）**，每一个实例都有指向它的一个**句柄（handle）**，C语言通常用指针来实现句柄。一个窗体程序，自然有它的一个**窗口（window）**，而窗口分为普通的窗口和**对话框（dialog）**，相信读者在平时使用Windows的时候对普通的窗口和对话框都有很清楚的了解。而每一个窗口也有指向它本身的一个**句柄**。实际上，Windows系统中“句柄”的概念非常宽泛，它还可以指向一个线程、一个进程、一个资源、一个控件，等等，这些都是用句柄来标识的。Win32 API里几乎所有的句柄都直接或间接地`typedef`自`HANDLE`类型（如果你学过OOP，`HANDLE`类似于基类，其他的句柄类似于它的派生类），而`HANDLE`在C语言中也是由指针实现的。

### （四、四）第一个窗体程序

建立一个对话框比建立一个普通的窗口要简洁地多，但是我们要从建立普通窗口而不是对话框开始，因为对话框是一种shortcut，直接学习如何创建对话框是很难理解的。

在VS2019上编写Windows窗体程序，我们当然可以建立一个“Win32项目”或“Windows桌面应用程序”一气呵成，但是这样建立的项目里面有很多自动生成的东西，其中有很多是我们不需要的，而且对于初学来说，我们并不希望它给我们生成太多东西。所以我们可以选择建立“Windows桌面向导”，进而选择桌面应用程序，但是我们需要取消预编译标头，而选择“空项目”。这样我们就可以从头开始了。  

对于一个窗体程序而非控制台程序，我们要写的主函数可以不是`main`了，而是改成了`WinMain`函数：  

```c
int __stdcall WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow);
```

相应地我们有兼容宽字符函数`wWinMain`的通用版本：  

```c
int __stdcall _tWinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPTSTR lpCmdLine, int nCmdShow);
```

读者可能会问，C语言的入口函数是`main`，为什么到了这里变成了`WinMain`呢？事实上，微软官方的解释很清楚：一旦以`WinMain`作为主函数，那么MSVC会自动生成一个`main`函数，在`main`函数里调用`WinMain`。但是，我们直接使用`main`作为主函数是否可以呢？微软官方声称，MSVC会在调用`WinMain`前做一些初始化的工作，用`main`作为主函数可能会产生不可预料的结果。~~但事实上，我个人目前还没有遇到什么不可预料的结果。~~

下面该介绍一下这个`WinMain`的各个参数了：`hInstance`是当前实例句柄，指向当前的实例；`hPrevInstance`就非常有趣，它是Win16 API中用来指向此应用程序的上一个实例的句柄，用来告知当前实例当前是否有其他的实例正在运行，但是，Win32 API引入了Mutex（互斥锁）之后，就可以用Mutex来达到这一目的，`hPrevInstance`再无存在的意义，因此Win32程序中这个参数永远是`NULL`，它只作为Win16的遗迹而存在；`lpCmdLine`顾名思义是程序运行时接收到的命令行参数，不过与控制台程序不一样的是，这个命令行参数是最原始的输入，shell并没有把这个命令行参数以空格分隔成多个字符串，这个过程需要程序自己手动解析；`nCmdShow`是操作系统建议程序的窗口的显示样式，我们在后面会用到它。  

我们要建立一个窗口，我们要做些什么呢？一个窗口有，首先你需要思考建立一个什么样的窗口：背景颜色是什么样的？有没有菜单？图标长什么样？是哪个实例的窗口？等等。这个“样子”就称作窗口所属的“类”。如果你学过OOP，应该了解“类”的概念。一个类可以实例化出多个对象，同样一个窗口类可以实例化出多个窗口。如果没学过OOP也没有关系。你可以这样理解：桃子有多种，有久保桃、毛桃、油桃 ~~，以及我们经常想的桃子~~ 。每一种桃都有很多个具体的能吃的桃子。一个窗口类就好比一种桃子，一个窗口就好比一个具体的桃子。我们首先要告诉操作系统我们要建立什么样的窗口，这个过程就叫做“窗口类的注册”。注册窗口类的函数有如下两个：

```c
ATOM RegisterClassA(const WNDCLASSA *Arg1);
ATOM RegisterClassExA(const WNDCLASSEXA *Arg1);
```

其中`RegisterClassExA`中的“Ex”是“extended（扩展）”的缩写，代表它蕴含着更多的信息。即它可以指定更多中窗口样式，而`RegisterClassA`中相比之下少指定的样式被设置成默认样式。其中，参数`WNDCLASSA`与`WNDCLASSEXA`都是结构体类型，我们需要自己给结构体的各个成员赋值来指定窗口类的样式，以`WNDCLASSEXA`为例：  

```c
typedef struct tagWNDCLASSEXA {
  UINT      cbSize;         //tagWNDCLASSEXA结构体所占字节数
  UINT      style;          //窗口样式
  WNDPROC   lpfnWndProc;    //窗口所用的消息处理函数
  int       cbClsExtra;     //通常置为0
  int       cbWndExtra;     //通常置为0
  HINSTANCE hInstance;      //当前实例句柄
  HICON     hIcon;          //窗口图标句柄
  HCURSOR   hCursor;        //窗口的鼠标光标句柄
  HBRUSH    hbrBackground;  //背景画刷（即指定背景颜色）
  LPCSTR    lpszMenuName;   //窗口菜单
  LPCSTR    lpszClassName;  //窗口类名
  HICON     hIconSm;        //窗口小图标句柄
} WNDCLASSEXA, *PWNDCLASSEXA, *NPWNDCLASSEXA, *LPWNDCLASSEXA;
```

可以看到里面全部使用匈牙利命名法，`h`代表句柄（handle），lpsz代表长指针字符串……读者可以网上查询匈牙利命名法来了解其他的前缀代表什么。其中的`lpszClassName`是窗口类的名字，以后创建窗口时需要指定它属于哪一个窗口类，就会用到这个名字。  

值得提一句，`RegisterClassExA`中的“A”是“ANSI”的首字母，代表窄字符版本，相应地还有它的宽字符版本`RegisterClassExW`，它所有关于字符（串）的部分全是宽字符。为了将它们统一起来，windows.h中定义了宏`RegisterClassEx`，作为它们的统一版本。实际上，几乎所有的Win32 API接口函数都带有后缀-A或-W，并以去掉后缀后剩下的部分作为把它们统一起来的通用宏的名字。  

注册完窗口之后，我们需要对创建窗口了。创建一个窗口需要用到函数`CreateWindowExA`，其中"A"的含义与上面完全一样，不再赘述，但不同的是`CreateWindowA`不是一个函数，而是一个宏，作为`CreateWindowExA`的简化版本。这个函数是Windows API里著名的超长函数，它的声明是这样的：  

```c
HWND CreateWindowExA(
    DWORD     dwExStyle,        //窗口扩展样式
    LPCSTR    lpClassName,      //窗口类名
    LPCSTR    lpWindowName,     //窗口标题
    DWORD     dwStyle,          //窗口样式
    int       X,                //窗口左上角X坐标
    int       Y,                //窗口左上角Y坐标
    int       nWidth,           //窗口宽度
    int       nHeight,          //窗口高度
    HWND      hWndParent,       //父窗口句柄，若无则为NULL
    HMENU     hMenu,            //菜单句柄，通常为NULL
    HINSTANCE hInstance,        //当前实例句柄
    LPVOID    lpParam           //窗口参数，暂时可以为NULL
);
```

有一点需要说明，在Win32 API中，我们使用的坐标都是x轴水平向右，y轴水平向下，以左上角为坐标原点的笛卡尔左手坐标系，一个单位长度通常为一个像素。这个函数返回值是指向所创建的窗口的句柄，如果创建失败则返回`NULL`。我们最好把返回的句柄储存在一个`HWND`类型的变量`hWnd`中，此处也采用了匈牙利命名法，Wnd是Window的缩写，h代表句柄，合起来表示窗口句柄。  

看到这里，我知道你可能什么也没有看懂。没有关系，因为没有较高的熟练度与足够多的练习，以及没有更深入的学习其他的内容是不可能看懂这里的。我在最开始就说过，不要试图去背诵这些东西，我本人在编写程序的时候也需要看这些函数的代码补全 ~~，事实上是一次写好了以后都复制粘贴~~ ，即使我在写这篇文章的时候，这些声明也是从微软的官方文档那里复制过来的（微软的官方文档我在文章最后会给出）。现在只需要大致看一遍有一个印象就可以了。  

创建完了之后，我们就要让窗口显示在屏幕上，就要用到`ShowWindow`和`UpdateWindow`函数。顾名思义，`ShowWindow`是要显示窗口，而`UpdateWindow`是要刷新窗口的，它可以引导窗口进行第一次的界面绘制。在`BOOL ShowWindow(HWND hWnd, int nCmdShow);`函数中，我们是要让`hWnd`指向的窗口以`nCmdShow`的方式显示，这个`nCmdShow`就可以采用`WinMain`函数的第四个参数了。至于如果不用第四个参数会怎样，我个人也不知道会有什么后果，大概是会有显示失败的风险吧，至少个人还没有遇到过失败的情况。而`BOOL UpdateWindow(HWND hWnd);`是要让`hWnd`指向的窗口进行第一次绘制。  

到了这里，还需要做什么呢？我们知道，窗口是会对你的动作进行响应的，例如鼠标点击、键盘敲击、窗口拉伸、退出程序，等等。这些都被Windows操作系统处理为“消息”。当你对窗口进行某些操作时，窗口就会接收到消息，我们就可以针对不同的消息进行响应。通常，我们给窗口发送的“消息”会先保存在这个程序的“消息队列”当中，每次产生一个消息，这个消息都会先进入消息队列等待程序处理。我们编写的程序需要每次都从队列头去获取消息并发送给窗口进行处理，而新进入队列的消息总是会排在队列尾。这就像我们在购买商品结算时，后到达收银台的总是排在队伍的尾部等待结算。  

一个消息分为三个部分：消息类型（message）、字参数（word parameter）、长字参数（long parameter）。其中message的数据类型是`UINT`，字参数的类型是`WPARAM`，长字参数的类型是`LPARAM`。为什么叫这两个名字呢？这还要从Win16说起。Win16中，一个消息有两个参数，其中一个参数只有两个字节，即“字参数”，但是有时需要传递更多的信息，就再外加一个四个字节的参数，即“长字参数”，长字参数通常用来传递较大的指针类型。但是，在Win32中，传递4字节的数据更为高效、划算，因此`WPARAM`在Win32 API中也被提升为了4个字节，因此Win32中`WPARAM`与`LPARAM`是一样大的。  

那么窗口如何进行消息处理呢？消息处理需要一个函数，而且一定是回调函数，因为我们目的是，一旦接收到一个消息，就调用这个函数，因此符合回调函数的定义。既然是回调函数，它的调用约定就是stdcall的。在MSVC上，指定调用约定的方式是在调用约定前加上一个或两个下划线。即`_stdcall`或`__stdcall`。我们经常把窗口的消息处理函数命名为`WndProc`：

```c
LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
    case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            // TODO: 在此处添加使用 hdc 的任何绘图代码...
            EndPaint(hWnd, &ps);
        }
        break;
    case WM_DESTROY:
        PostQuitMessage(0);
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}
```

其中，`CALLBACK`是一个宏，代表回调函数的调用约定，通常是`__stdcall`。`WM_DESTROY`是销毁窗口的消息，比如我们平时点击窗口右上角的红叉，就会向窗口发送一条`WM_CLOSE`消息，如果你不对这条消息进行处理，那么这条消息就被送到`DefWindowProc`函数中进行默认处理，即销毁窗口，并同时向窗口发送一条`WM_DESTROY`消息。窗口接收到这条消息，就可以对其做出反应，通常是做一些清理内存的操作后调用`PostQuitMessage`函数来向窗口发送一条`WM_QUIT`消息（这个消息的作用将会在下文中提到）。`WM_PAINT`是绘图消息，窗口在接收到这条消息后必须进行窗口上图形的绘制，之前所说的`UpdateWindow`函数正是向窗口第一次发送`WN_PAINT`消息。  

那么，如何将窗口与消息处理函数关联起来呢？细心的读者可能发现了，在注册窗口类的时候，`WNDCLASSEX`结构体正好有一个成员是消息处理函数的指针！我们只需要在这里把窗口类结构体的成员设置成`WndProc`就可以了！  

在一切准备就绪之后，我们要做的就是循环地获取消息队列中的消息，然后发送给相应的窗口了。这个过程我们要循环地调用`GetMessage`函数：  

```c
BOOL GetMessage(
  LPMSG lpMsg,
  HWND  hWnd,
  UINT  wMsgFilterMin,  //通常为0
  UINT  wMsgFilterMax   //通常为0
);
```

这个函数中第一个参数是一个指向`MSG`结构体的指针，函数将会把接收到的消息保存到`lpMsg`指向的结构体当中；第二个参数是指定了取哪个窗口的消息，需要注意的是，对于程序的主窗口，在没有特殊情况的情况下，这个参数都要指定为`NULL`，来指定获取所有窗口的消息，否则在程序运行的时候，电脑将会几乎做不了其他的事情。关于它的返回值，当它接收到的消息是`WM_QUIT`消息（正如上文所提到的）的时候，就会返回`FALSE`（`FALSE`是一个宏，被定义为0，而`TRUE`被定义为1），这时候我们就可以结束程序了。  

获取完消息以后，我们就要发送给窗口了，但是在发送之前，Windows系统要我们做一件别的事情：调用`TranslateMessage`函数。这个函数是把一些特定的字符键和组合键的按键消息翻译成相应的字符消息。这里你可以不用明白，它的作用需要到练习足够多以后才能体会到。然后我们就可以把消息发送给相应的窗口了，只需要一个`DispatchMessage`函数就可以了！

到这里，我们就应该能够创建一个空白窗口了！创建空白窗口的完整代码如下：  

```c

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <tchar.h>

#define MAX_LOADSTRING 100

HINSTANCE hInst;            // 当前实例
HWND hMainWnd;              //主窗口句柄

// 此代码模块中包含的函数的前向声明:
ATOM                MyRegisterClass(HINSTANCE hInstance);
BOOL                InitInstance(HINSTANCE, int);
LRESULT CALLBACK    WndProc(HWND, UINT, WPARAM, LPARAM);

int APIENTRY _tWinMain(HINSTANCE hInstance,
                    HINSTANCE hPrevInstance,
                    LPTSTR lpCmdLine,
                    int nCmdShow)
{
    UNREFERENCED_PARAMETER(hPrevInstance);
    UNREFERENCED_PARAMETER(lpCmdLine);

    // TODO: 在此处放置代码。

    // 初始化全局字符串

    if (!MyRegisterClass(hInstance)) 
    {
        MessageBox(NULL, TEXT("Register failed!"), TEXT("error"), MB_OK | MB_ICONERROR);
    }

    // 执行应用程序初始化:
    if (!InitInstance (hInstance, nCmdShow))
    {
        MessageBox(NULL, TEXT("Failed!"), TEXT("ERROR"), MB_OK | MB_ICONERROR);
        return FALSE;
    }


    MSG msg;

    // 主消息循环:
    while (GetMessage(&msg, NULL, 0, 0))
    {
            TranslateMessage(&msg);
            DispatchMessage(&msg);
    }

    return (int) msg.wParam;
}



//
//  函数: MyRegisterClass()
//
//  目标: 注册窗口类。
//
ATOM MyRegisterClass(HINSTANCE hInstance)
{
    WNDCLASSEX wcex;

    wcex.cbSize = sizeof(WNDCLASSEX);

    wcex.style          = CS_HREDRAW | CS_VREDRAW;
    wcex.lpfnWndProc    = WndProc;
    wcex.cbClsExtra     = 0;
    wcex.cbWndExtra     = 0;
    wcex.hInstance      = hInstance;
    wcex.hIcon          = LoadIcon(NULL, IDI_APPLICATION);
    wcex.hCursor        = LoadCursor(NULL, IDC_ARROW);
    wcex.hbrBackground  = (HBRUSH)(COLOR_WINDOW+1);
    wcex.lpszMenuName   = NULL;
    wcex.lpszClassName  = TEXT("WindowClass");
    wcex.hIconSm        = LoadIcon(NULL, IDI_APPLICATION);

    return RegisterClassEx(&wcex);
}

//
//   函数: InitInstance(HINSTANCE, int)
//
//   目标: 保存实例句柄并创建主窗口
//
//   注释:
//
//        在此函数中，我们在全局变量中保存实例句柄并
//        创建和显示主程序窗口。
//
BOOL InitInstance(HINSTANCE hInstance, int nCmdShow)
{
   hInst = hInstance; // 将实例句柄存储在全局变量中

   HWND hWnd = CreateWindow(TEXT("WindowClass"), TEXT("First"), WS_VISIBLE | WS_OVERLAPPEDWINDOW,
      CW_USEDEFAULT, 0, CW_USEDEFAULT, 0, NULL, NULL, hInstance, NULL);

   if (!hWnd)
   {
      return FALSE;
   }

   hMainWnd = hWnd;

   ShowWindow(hWnd, nCmdShow);
   UpdateWindow(hWnd);

   return TRUE;
}


LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message)
    {
    case WM_PAINT:
        {
            PAINTSTRUCT ps;
            HDC hdc = BeginPaint(hWnd, &ps);
            // TODO: 在此处添加使用 hdc 的任何绘图代码...
            EndPaint(hWnd, &ps);
        }
        break;
    case WM_DESTROY:
        PostQuitMessage(0);
        break;
    default:
        return DefWindowProc(hWnd, message, wParam, lParam);
    }
    return 0;
}
```

至此，你已经能够创建一个空白的窗口了，恭喜你已经迈出了Win32编程的第一步！

## 五、C++对窗口的类封装

现在又面临着一个严峻的问题：Win32 API主要针对C语言面向过程而设计，而C++语言是一门支持面向对象编程的语言。如果你足够了解面向对象编程的思想，就能感觉到这么裸露和丑陋的API，和面向对象的封装性格格不入！所以我们需要对API进行封装。我们需要设计C++意义上窗口类，让API提供的抽象的窗口类真正地成为一个“类”来让它适应面向对象。  

但是，对Win API的封装是一个庞大的工程，封装好了Win32 API就能使你的C++程序更加优雅 ~~，甚至能自己开发一个Qt库~~。但是，这么庞大的工程不可能在这么短的文章里介绍完毕，因此我这里仅仅介绍如何对窗口进行浅封装，介绍封装的核心思路和手段，让封装后的窗口能够适应面向对象的环境，不破坏面向对象的思路即可。读者可以自己试着利用我提供的核心手段进行更深层次的封装。  

进行窗口的封装，最核心的问题是什么？是消息处理函数！因为我们每个窗口类要有自己的消息处理函数，这意味着消息处理函数要处理成类的成员函数。但是，Win32 API给我们提供的消息处理函数的格式有且只有四个参数：`HWND, UINT, WPARAM, LPARAM`，而我们知道类的成员函数的第一个参数永远是`this`指针，显然不满足消息处理函数的要求。那怎么办呢？我们想到的策略，就是用类的静态成员函数作为提供给API的消息处理函数，这是因为静态成员函数本质上是全局函数，不传递`this`指针。然后再在这个通用的静态成员函数中调用各个对象自己的消息处理成员函数。这个难点在哪里呢？难点在于，当消息被传递给这个静态成员函数的时候，它如何知道这个消息是哪个窗口对象接收的？如何获取这个对象的指针？这本来需要用`this`指针来完成，但是静态成员函数恰恰没有`this`指针！这就是窗口封装的难点所在。因为我们需要一个标记，来唯一地标记每个窗口对象，并且根据这个标记能够得到窗口对象的指针，来调用这个对象自己的消息处理成员函数——当然最好的办法就是这个标记就是指针本身。关键在于这个标记应该标记在哪里！  

不知道读者是否还记得，前文在介绍`CreateWindowExA`函数的时候，最后一个参数为窗口参数，当时是说“暂时置为`NULL`”的，现在它就派上用场了！这个窗口参数的作用是什么呢？在`CreateWindow`所代表的函数的执行过程中，窗口会接收到一条`WM_CREATE`消息，而查阅文档我们可以知道，这条消息的长字参数就是`CreateWindow`所传的最后一个参数。我们可以通过这个参数，来把本窗口对象的指针传给静态消息处理函数。但是，另一个问题又出现了：这个指针仅能在接收到`WM_CREATE`消息时存在。我们如何用这个指针永久地标记这个窗口呢？提供Win32 API的人非常贴心，恰恰给我们预备了一个好的特性：每一个窗口都可以由用户（即程序员）自己设置一个用户参数，这个用户参数将永久地伴随这个窗口，直到用户下一次重设它。我们可以通过`SetWindowLongPtrA`来设置这个参数，用`GetWindowLongPtrA`来获取这个用户参数。关于这两个函数，需要指明的是，在最初的Win32 API中，这两个函数并不存在，只存在两个名字为`SetWindowLongA`和`GetWindowLongA`的两个函数设置4字节的用户参数，自从Win64出现以后，为了能够传递8字节的数据，就在后面加上“Ptr”三个字母提供了这两个新的函数来设置8字节的用户参数。而为了Win32与Win64兼容，就在新的Win32 API中也加入了这两个函数，且在Win32中这两个函数与不带“Ptr”的两个函数完全相同，都是只能设置4字节的用户参数，而在Win64中则是8字节。这两个函数声明如下：  

```c
LONG_PTR SetWindowLongPtrA(HWND hWnd, int nIndex, LONG_PTR dwNewLong);
LONG_PTR GetWindowLongPtrA(HWND hWnd, int nIndex);
```

其中参数`nIndex`表明了咱们要设置或获取的参数类型，咱们需要获取和设置的都是用户参数，因此`nIndex`的实参都应该是宏`GWLP_USERDATA`。

一个窗口类的浅封装示例如下：

```cpp

//
// file: BasicWindow.h
//

#ifndef BASIC_WINDOW_H
#define BASIC_WINDOW_H

#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <tchar.h>

//错误提示

static LPCTSTR c_lpszError = TEXT("Error"); //错误

//窗口抽象类
class BasicWindow
{

protected: 

	//关于窗口

	HINSTANCE m_hInst;					//当前实例
	HWND m_hWnd = NULL;				    //主窗口句柄

	//创建窗口
	BOOL Init
	(
		HINSTANCE hInstance, int nCmdShow,
		int x, int y, int cx, int cy, DWORD dwStyle,
		LPCTSTR c_lpszWndTitle, WNDCLASSEX wcex
	); 

	//处理了消息返回true，没有处理则返回false
	virtual bool MessageProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam) = 0;

private: 

	BOOL InitInstance(HINSTANCE hInstance, int nCmdShow, int x, int y, int cx, int cy, DWORD dwStyle, LPCTSTR c_lpszWndClassName, LPCTSTR c_c_lpszWndTitle);
	static LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam);

};

#endif //!BASIC_WINDOW_H

```

```cpp

//
// file: BasicWindow.cpp
//

#include "BasicWindow.h"

BOOL BasicWindow::Init
(
    HINSTANCE hInstance, int nCmdShow,
    int x, int y, int cx, int cy, DWORD dwStyle,
    LPCTSTR c_lpszWndTitle, WNDCLASSEX wcex
)
{
    wcex.lpfnWndProc = WndProc; 
    if (!RegisterClassEx(&wcex))
    {
        MessageBox(NULL, TEXT("Register failed!"), c_lpszError, MB_OK | MB_ICONERROR);
        return FALSE;
    }

    // 执行应用程序初始化:
    if (!InitInstance(hInstance, nCmdShow, x, y, cx, cy, dwStyle, wcex.lpszClassName, c_lpszWndTitle))
    {
        MessageBox(NULL, TEXT("Window creating failed!"), c_lpszError, MB_OK | MB_ICONERROR);
        return FALSE;
    }

	return TRUE; 
}


//
//   函数: InitInstance(HINSTANCE, int)
//
//   目标: 保存实例句柄、主窗口句柄并创建主窗口
//

BOOL BasicWindow::InitInstance(HINSTANCE hInstance, int nCmdShow, int x, int y, int cx, int cy, DWORD dwStyle, LPCTSTR c_lpszWndClassName, LPCTSTR c_lpszWndTitle)
{
    m_hInst = hInstance;  //将实例句柄存储在成员变量中

    HWND hWnd = CreateWindow(c_lpszWndClassName, c_lpszWndTitle, dwStyle,
        x, y, cx, cy, NULL, NULL, hInstance, this);

    if (!hWnd)
    {
        return FALSE;
    }

    m_hWnd = hWnd;    //将主窗口句柄存储在成员变量中

    ShowWindow(hWnd, nCmdShow);
    UpdateWindow(hWnd);

    return TRUE;
}

LRESULT CALLBACK BasicWindow::WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    BasicWindow* thisWnd = NULL;
    if (message == WM_CREATE)
    {
        thisWnd = (BasicWindow*)(((LPCREATESTRUCT)lParam)->lpCreateParams);     //获取窗口对象指针
        SetWindowLongPtr(hWnd, GWLP_USERDATA, (LONG)thisWnd);
    }
    else thisWnd = (BasicWindow*)GetWindowLongPtr(hWnd, GWLP_USERDATA); 
    if (thisWnd == NULL) return DefWindowProc(hWnd, message, wParam, lParam); 
    if (!thisWnd->MessageProc(hWnd, message, wParam, lParam))
    {
        if (message == WM_DESTROY)
        {
            thisWnd->m_hWnd = NULL;
            PostQuitMessage(0);
            return 0;
        }
        else return DefWindowProc(hWnd, message, wParam, lParam); 
    }
    if (message == WM_DESTROY) thisWnd->m_hWnd = NULL; 
    return 0;
}

```

在我们想要创建一个新的窗口类的时候，我们只需要继承`BasicWindow`类，并覆盖（overwrite）纯虚函数`MessageProc`即可。  

不过，由于篇幅所限，这个窗口基类的实现只是一个浅封装的示例，只是提供了封装窗口类的手段与思路，读者可以根据自己的需要对其进行完善，使其封装性更好。  

## 六、结语

非常感谢你有足够的耐心和兴趣看到了这里。现在不妨假设你已经学会了C/C++建立空白窗口的过程（虽然我知道理解它是一个极其艰难的过程，需要反复练习）。如果想要做出声情并茂的Win32程序，还需要了解很多知识，例如GDI绘图、键鼠消息处理、键鼠钩子、菜单与加速键的使用、位图、图标与光标的使用、gdiplus绘图、按钮等控件的创建……值得一提的是，按钮、文本框这样的控件本质上也是一个窗口，也是用`CreateWindow`函数来创建的。此外，感兴趣的读者也可以学习对话框的建立，使得你的程序能够更简单地与使用者进行交互，甚至以对话框作为主界面和用户进行交互。学会这些都是一个极其漫长且艰难的过程。如果你真的像我一样对这些古老又无用的东西感兴趣，那就去学吧！不过在学习的过程中离不开微软的官方文档：Microsoft Docs，网址：[https://docs.microsoft.com/zh-cn/](https://docs.microsoft.com/zh-cn/)。国内很多人把它称之为“MSDN”，但实际上“Microsoft Docs”、“MSDN”和“MSDN，我告诉你”是三个不同的东西，有很多人都把它们混淆了。有兴趣的读者也可以自己翻阅资料了解一下。  

最后再推荐一些讲解Win32 API的书籍吧：《Windows程序设计（第5版）》、《Windows高级编程》，等等。不过，这些书都不是用来看的，是遇到哪里不会就来查阅的。但是就现在而言，最好的书籍只有两个：一个是Microsoft Docs，另一个就是百度！查阅这两本网络神书远比纸质书籍快捷得多。
