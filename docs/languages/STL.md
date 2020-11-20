# STL概览

## 0. 目录

0. 目录
1. 前言
2. 空间配置器 Allocators
3. 迭代器 Iterators
4. 容器 Containers
5. 算法 Algorithms
6. 仿函数 Functors
7. 配接器 Adapters
8. 总结

## 1. 前言

### 1.1 历史 

**标准模板库**（**S**tandard **T**emplate **L**ibrary）是基于C++的模板特性设计的一个软件库，内置了诸如输入/输出、数学计算、常用数据结构和算法等功能，使得C++编程语言在有了同Java一样强大的类库的同时，保有了更大的可扩展性。

STL 最初由惠普实验室开发，于 1998 年被定为国际标准，正式成为 C++ 程序库的重要组成部分。自 1998 年 ANSI/ISO C++ 标准正式定案，C++ STL规范版本正式通过以后，由于其是开源的，各个 C++ 编译器厂商在此标准的基础上，实现了满足自己需求的 C++ STL 泛型库，主要包括 HP STL、SGI STL、STL port、PJ STL、Rouge Wave STL 等。GCC采用的即为**SGI STL**。

### 1.2 基本组成

通常认为，STL是由空间配置器、迭代器、容器、算法、仿函数（又叫函数对象 Functional Object）、适配器六部分组成，其中前两部分是为后四部分服务的。它们的关系简要如下图所示：

![avatar](https://cloud.tsinghua.edu.cn/f/aaf12bbd732347afac32/?dl=1)

其中，allocators负责管理空间；iterators为各种容器的访问提供了统一的接口；containers提供了各种容器类数据结构，包括序列容器和关联容器；algorithms提供了常用的基本数值/非数值算法；functors提供了一些常用的函数对象；adapter用来修饰functors、containers和iterators的接口，以通过已有的代码实现另一功能。

在STL的实现源代码文件中，无后缀(.h)的为STL标准头文件，如vector, deque, functional等；STL的真正实现（SGI STL内部文件）为带后缀(.h)的文件，如stl_vector.h, stl_deque.h, stl_function.h ...（ps: HP规范的头文件，如vector.h, deque.h, function.h等通常不推荐使用）。

下面，我们逐一对这些部分做简要介绍。

## 2. 空间配置器 Allocators

### 2.1 概览

Allocators是STL的重要组成，一般用户很少关注它的存在和实现。它隐藏在所有容器身后，默默完成**内存配置与释放，对象构造和析构的工作**。

虽然我们在使用STL时无需关注allocators，但了解它有助于我们更好地理解stl的实现原理，学习stl中蕴含的程序设计艺术之美。

### 2.2  简述

​	以大家熟悉的vector为例，我们通常这样使用vector：

``` c++
#include <vector>
int main()
{
    std::vector<int> v;
    // Do something;
    return 0;
}
```

实际上，vector类还有第二个模板参数，默认为allocator<int>。vector类内部会实例化一个allocator<int>来管理内存，负责对象的构造和析构。如果我们按照STL要求的接口实现自己的allocators，那么也可以指定它为vector分配空间。

### 2.3 接口

STL是一个标准，只对接口进行规范，接口背后的实现可以有不同版本，SGI STL是最流行的版本，我们主要关注SGI STL的allocator实现。

这是STL标准要求的allocator必要接口：

```c++
allocator::value_type
allocator::pointer
allocator::const_pointer
allocator::reference
allocator::const_reference
allocator::size_type
allocator::difference

// 一个嵌套的(nested)class template，class rebind<U>拥有唯一成员other，那是一个typedef，代表allocator<U>
allocator::rebind

allocator::allocator() // 默认构造函数
allocator::allocator(const allocator&) // 拷贝构造函数
template <class U>allocator::allocator(const allocator<U>&) // 泛化的拷贝构造函数
allocator::~allocator() // 析构函数

// 返回某个对象的地址，a.address(x)等同于&x
pointer allocator::address(reference x) const
// 返回某个const对象的地址，a.address(x)等同于&x
const_pointer allocator::address(const_reference x) const

// 配置空间，足以存储n个T对象。第二个参数是个提示。实现上可能会利用它来增进区域性(locality)，或完全忽略之
pointer allocator::allocate(size_type n, const void* = 0)
// 释放先前配置的空间
void allocator::deallocate(pointer p, size_type n)

// 返回可成功配置的最大量
size_type allocator:maxsize() const

// 调用对象的构造函数，等同于 new((void*)p) T(x)
void allocator::construct(pointer p, const T& x)
// 调用对象的析构函数，等同于 p->~T()
void allocator::destroy(pointer p)
```

上面的接口中，最重要的、也是我们需要关注的，只有allocate、deallocate、construct和destroy函数。它们从功能上可以简单理解为C++的`::operator new`和`::operator delete`，构造函数和析构函数。事实上，最简单的allocator也可以直接对`new`、`delete`进行包装来实现。

### 2.4 实现

下面，我们给出一个符合STL标准的最简单的allocator的实现。

``` c++
#ifndef _MYALLOC_
#define _MYALLOC_

#include <new>
#include <cstddef>
#include <cstdlib>
#include <climits>
#include <iostream>

namespace my_alloc
{
    // allocate的实际实现，简单封装new，当无法获得内存时，报错并退出
    template <class T>
    inline T* _allocate(ptrdiff_t size, T*) {
        set_new_handler(0);
        T* tmp = (T*)(::operator new((size_t)(size * sizeof(T))));
        if (tmp == 0) {
            cerr << "out of memory" << endl;
            exit(1);
        }
        return tmp;
    }

    // deallocate的实际实现，简单封装delete
    template <class T>
    inline void _deallocate(T* buffer) { ::operator delete(buffer); }

    // construct的实际实现，直接调用对象的构造函数
    template <class T1, class T2>
    inline void _construct(T1* p, const T2& value) { new(p) T1(value); }

    // destroy的实际实现，直接调用对象的析构函数
    template <class T>
    inline void _destroy(T* ptr) { ptr->~T(); }

    template <class T>
    class allocator {
    public:
        typedef T           value_type;
        typedef T*          pointer;
        typedef const T*    const_pointer;
        typedef T&          reference;
        typedef const T&    const_reference;
        typedef size_t      size_type;
        typedef ptrdiff_t   difference_type;

        // 构造函数
        allocator(){ return; }
        template <class U>
        allocator(const allocator<U>& c){}

        // rebind allocator of type U
        template <class U>
        struct rebind { typedef allocator<U> other; };

        // allocate，deallocate，construct和destroy函数均调用上面的实际实现
        pointer allocate(size_type n, const void* hint = 0) {
            return _allocate((difference_type)n, (pointer)0);
        }
        void deallocate(pointer p, size_type n) { _deallocate(p); }
        void construct(pointer p, const T& value) { _construct(p, value); }
        void destroy(pointer p) { _destroy(p); }

        pointer address(reference x) { return (pointer)&x; }
        const_pointer const_address(const_reference x) { return (const_pointer)&x; }

        size_type max_size() const { return size_type(UINT_MAX / sizeof(T)); }   
    };
}

#endif // _MYALLOC_
```

这样，你就可以用自己实现的my_alloc来为vector分配内存了。

```cpp
std::vector<int, my_alloc::allocator<int> > v;
```

### 2.5 拓展

实际上，这只是对allocators做了一个初步的认识。实际的allocator包括第一级配置器、第二级配置器、内存池等。第一级是直接调用`malloc`分配空间，调用`free`释放空间；但由于malloc和free在申请小内存的效率较低，实际常常使用第二级配置器。它建立了一个内存池，小于128字节的申请都直接在内存池进行，不直接调用`malloc`和`free`。对它们的实现感兴趣的同学可以自行查阅相关资料。

## 3. 迭代器 Iterators

 ### 3.1 概览

 迭代器是将算法和容器两个独立的泛型进行调和的一个接口，提供一种方法顺序访问一个聚合对象中各个元素。使用迭代器的意义是，使我们无需关注容器内部数据存储的细节，而通过统一的接口对数据进行访问，从而提升代码的可复用性，使同样的算法代码可以用于不同的容器所存储的数据。

具体来说，迭代器是一个变量，指向容器中的某个元素，通过迭代器就可以读写它指向的元素。从这一点上看，迭代器的行为和指针类似。因此，迭代器最重要的工作就是，针对对`operator *`和`operator ->`进行重载。这样，在访问不同容器的数据时，只需统一对它们的迭代器进行操作。

根据移动特性与实施操作，迭代器可以分为五类：

+ input iterator：只读，支持`operator ++`；

+ output iterator：只写，支持`operator ++`；
+ forward iterator：读写，允许”写入型“算法，支持`operator ++`；
+ bidirectional iterator：可双向移动，包括逆向移动，支持`operator ++`和`operator --`；
+ random access iterator：随机访问，支持多种运算，包括`i + n, i - n, i[n], i1 - i2, i1 < i2`。

### 3.2 接口

同样以vector为例，一个基本的迭代器需要支持的操作如下。大多数情况下，迭代器的行为都与指针类似，且比指针更易操作。

```c++
#include <vector>
using namespace std;
int main(){
    vector<int> v(100);
    vector<int>::iterator iter; //定义vector的迭代器iter
    iter = v.begin(); //将迭代器指向vector的起始位置
    int a = *iter; //取iter指向的元素
    ++iter; //指向下一个位置
    --iter; //指向上一个位置
    for(auto& v_iter: v) //使用range_based loop对容器进行遍历，利用v_iter访问元素
        v = 1;
}
```

除此之外，STL的<iterator>头文件中还定义有以下函数 

```c++
void advance (Iterator& it, Distance n); //将迭代器向后移动n个元素
size_t distance (Iterator first, Iterator last); 
//返回last与first间隔元素的个数

Iterator next((Iterator it, difference_type n = 1); 
//返回距离it后n个位置的元素的迭代器
                     
Iterator prev((Iterator it, difference_type n = 1); 
//返回距离it前n个位置的元素的迭代器                    
```

### 3.3 实现

由于iterator直接服务于各种容器和算法，因此不同的iterator实现方法各异，只要对外暴露的接口一致即可，此处不再赘述。注意根据对应的数据集合不同，在对数据集合进行修改后，原有的迭代器可能**失效**（不再指向本应指向的元素），具体可以查阅相关资料。

实现iterator后，我们就有了统一对容器元素进行访问的工具了，可以将“在数据上执行的操作”与“要执行操作的数据”分离开来。下面对于stl其他部分的介绍，我们忽略allocator和iterator所做的工作，将重点放在程序的功能及其实现上。

### 3.4 拓展

事实上，迭代器是一种**智能指针**（smart pointer）。它实现了对动态内存管理的封装，能够实现引用计数功能，防止出现内存泄漏。STL对智能指针的实现为**shared_pointer**，这其中也使用了allocator进行内存管理。

另外，由于iterator需要自动推导不同类型的参数，而仅使用template的参数推导机制无法推导函数的返回值类型。这时候需要利用**traits**技巧进行“特性萃取”。感兴趣的同学可以自行查阅相关资料。

## 4. 容器 Containers

### 4.1 概览与分类

容器可能是大多数人对STL的第一（**唯一**）印象。STL的容器将应用最广泛的一些数据结构实现了出来，大量简化了程序员的工作。

STL的容器分为**序列式容器**（sequential containers）和**关联式容器**（associative containers）。

![avatar](https://cloud.tsinghua.edu.cn/f/086d4e611d66414fb06b/?dl=1)

下面仅对这些容器做简单介绍。这些容器、以及后面要介绍的algorithms的基本思想，大多都会在《数据与算法》课程中进行学习，而不同的容器和算法种类纷繁多样，具体的实现细节极为复杂，因此不再赘述。

### 4.2 序列式容器

所谓**序列式容器**，即指其中的元素都**可序**（ordered），但未必**有序**（sorted）。

+ pair：是最简单的容器。它由两个单独数据组成。
  + 支持通过first、second两个成员变量获取数据。
+ tuple：对pair的扩展，由若干成员组成，可以用于多返回值的传递。
  + 其下标需要在编译时确定：不能设定运行时可变的长度，不能当做数组。
+ vector：可变长数组。vector会分配比初始大小大两倍的空间（默认为10个元素），当数据增长超出当前空间时，会再次申请两倍大小的空间，并将这些元素转移到新申请的空间。为了支持随机访问，vector存储数据的空间必须是连续的。
  + 允许以下标访问，支持在末尾添加/删除（高速）、在中间添加/删除（使用迭代器，低速）
+ list：链表。
  + 不支持随机访问，支持插入/删除数据。
  + 另有slist（双向链表），但其实现远比list复杂得多。
+ deque：双向队列。STL的stack和queue都是基于deque套上配接器（adapters）实现的。它是一类双向开口的连续线性空间。
  + 支持在头部、尾部插入、删除元素。提供了随机访问迭代器，但效率较低。
  + 为了维护“连续线性空间”的“假象”，deque用来维护空间的代码比vector、list等复杂得多，甚至还需要专门的“中控器”来管理。
+ heap：堆。用来实现priority_queue。实际以算法而非容器的形式呈现，包括push_heap()、pop_heap()、sort_heap()、make_heap()几部分。

### 4.3 关联式容器

所谓**关联式容器**，观念上类似关联式数据库：每个数据（元素）都有一个键值（key）和实值（value），当元素被插入关联式容器中时，容器内部结构就按照键值大小，以某种规则将这个元素放置于特定位置。关联式容器没有所谓头尾（只有最大元素和最小元素），因此不会有`push_back()`、`begin()`之类的行为。

一般而言，关联式容器内部结构是一棵**平衡二叉树**（balanced binary tree）。STL的关联式容器，大多都是通过RB-tree或hash_table加装adapter实现的。

+ map：映射。由RB-tree实现。所有元素均为std::pair，会根据value自动排序。不允许重复value。
  + 支持插入、查找、删除。
  + 允许修改value，不允许修改key。
  + map对`operator[]`进行了重载，因此可以通过key使用下标直接访问元素。key值可以为任意数据类型。
+ set：集合。由RB-tree实现。与map不同，set的key就是value，即每个元素只有一个值。不允许重复value。
  + 支持插入、查找、删除。
  + 不允许直接修改元素的值。不支持下标访问。
+ multiset/multimap：允许重复key的set/map。
+ hash_set/hash_map：以hash_table实现的set/map。

## 5. 算法 Algorithms

### 5.1 概览

STL提供了大量极具复用价值的数值/非数值算法，如排序、复制、删除、比较、组合、运算等。大家可能对他们不太熟悉，但熟练运用这些函数，可以有效降低编码工作量。

值得注意的是，这些算法单独使用可能并不会与手写方便多少，但它们的优势在于，提供了一套统一的数据批量进行操作的方法，尤其是统一使用迭代器进行数据访问的时候。对于应用于不同数据集合的代码的复用、实现程序的泛型有重要帮助。事实上，stl内部的实现大量调用了这些看起来并不“高级”的算法函数。

stl提供的算法极为繁杂，下面仅对一些常见算法分类做简单介绍。

### 5.2 数值算法<stl_numeric.h>

+ accumulate()：累加迭代器first到last区间（下同）的元素。
+ adjacent_difference()：求区间的差分。
+ partial_sum()：求区间的前缀和。
+ inner_product()：求两个区间元素的内积。
+ power()：计算某数的n幂次方。
+ iota()：将区间内填充顺序递增的元素

### 5.3 基本算法<stl_algobase.h>

STL标准中并没有区分所谓基本或复杂算法，但SGI却把一些基本算法中定义于<stl_algobase.h>中，其他定义在<stl_algo.h>中。

+ equal()：比较两个序列在区间内是否相等。
+ fill()：将区间内所有元素改填新值
+ iter_swap()：将两个ForwardIterators所指的对象对调。
+ max()/min()：取两个对象的较大值/较小值。
+ mismatch()：比较两个序列，找出第一个不匹配点。
+ swap()：交换两个对象的内容。
+ copy()：将一个区间的元素复制到另一个区间。
  + 该函数应用范围极广。为了高效地实现不同数据类型的元素的内存成块复制，copy()的内部实现极为复杂，几乎是“无所不用其极”地强化执行效率。

### 5.4 其他算法

+ set相关

  + set_union()：构造并集。
  + set_intersection()：构造交集。
  + set_difference()：构造差集。
  + set_symmetric_difference()：构造对称差集。

+ heap相关

+ 单纯的数据处理

  + 包括adjacent_find()、count()、count_if()、find()、find_if()、includes()、merge()、max_element()、remove()、remove_if()、replace()、rotate()、search()、transform()等等大量对数据集合进行简单处理的函数。

    它们都接受迭代器作为参数，对数据集合的区间进行遍历。

+ 二分查找

  + lower_bound()：试图在有序区间中寻找某个元素value，返回第一个“不小于value”的元素。
  + upper_bound()：试图在有序区间中寻找某个元素value，返回最后一个“不大于value”的元素。
  + binary_search()：试图在有序区间中寻找某个元素value，返回true/false。

+ 排列组合

  + next_permutation()：取得序列的下一个排列。
  + prev_permutation()：取得序列的前一个排列。
    + 关于排列如何定义“上一个”“下一个”，以及如何获得全排列，可以自行查阅相关资料。
  + random_shuffle()：对区间的元素随机重排。
  + sort()：对区间元素排序。
    + stl实现的sort()会自动根据数据规模大小决定使用quick sort、insertion sort甚至或是heap sort。
  + nth_element()：重新排列区间，保证nth之前的元素都小于nth，之后的元素都大于nth。

## 6. 仿函数 Functors

### 6.1 概览

又叫函数对象（function objects）。具体来说，仿函数即为一种具有函数特性的对象，该对象重载了`operator()`，使其行为与真正的函数如出一辙。

仿函数存在的意义是，将某种**操作**当做算法的参数，实现模板算法代码的复用。例如，stl中提供的sort()函数默认将元素升序排列。如果在sort的实现中，将用于比较大小的函数作为参数，那么就可以通过传入不同的参数来实现不同规则的排序了。

STL的仿函数，根据操作数（operand）个数可以分为一元仿函数（unary_function）和二元仿函数（binary_function）；根据功能可以分为算术运算、关系运算和逻辑运算。

### 6.2 实现

我们以比较大小的关系运算为例，介绍仿函数的实现。

二元仿函数的基类定义如下，十分简单。STL规定，每个adaptable binary function都应该继承此类。

```c++	
template <class Arg1, class Arg2, class Result>
struct binary_function{
    typedef Arg1 first_argument_type;
    typedef Arg2 second_argument_type;
    typedef Result result_type;
};
```

继承了该基类的greater<>()、less<>()实现如下。

```c++	
template <class T>
struct greater : binary_function<T, T, bool>{
    bool operator()(const T& x, const T& y) const { return x > y; }
}
template <class T>
struct less : binary_function<T, T, bool>{
    bool operator()(const T& x, const T& y) const { return x < y; }
}
```

这样，我们就可以在自己实现的函数中调用函数对象了。

```c++	
template<class Iterator, class Compare>
void sort(Iterator first, Iterator last, Compare cmp){
    //implementation of your sort algorithm
    //你可以直接如同函数一般使用cmp，例如
    if( cmp(*first, *(first+1)) )
        //do something 
}
int main(){
    std::vector<int> v = {1, 4, 2, 5};
    sort(v.begin(), v.end(), greater<int>());
}
```

最后一行代码中的实参`greater<int>()`，就地实例化了一个模板类型参数为`int`的greater对象。

### 6.3 STL的仿函数

STL提供的许多方法都支持传入仿函数作为算法执行的参数。<stl_functional.h>头文件中定义的常用仿函数如下。

+ 算术类仿函数：如plus<T>, minus<T>, multiplies<T>, divides<T>, modulus<T>, negate<T>；
+ 关系运算类仿函数：如equal_to<T>, not_equal_to<T>, greater<T>, less<T>, greater_equal<T>, less_equal<T>；
+ 逻辑运算类仿函数：如logical_and<T>, logical_or<T>, logical_not<T>等；

### 6.4 拓展

几乎不会有人单纯为了使用而使用这些功能极其简单的仿函数。他们的主要用途是为了搭配STL算法，扮演一种“**策略**”的角色，让STL更加灵活多变，实现代码的复用和程序的多态。

## 7. 配接器 Adapters

### 7.1 概览

配接器在STL组建的灵活组合运用功能上，扮演着轴承、转换器的角色。事实上，adapter这个概念是一种**设计模式**（design pattern），《Design Pattern》一书对adapter pattern定义如下：

> 将一个class的接口转换成另一个class的接口，使原本因接口不兼容而不能合作的classes可以一起运作。

STL提供的各种配接器，分为function adapter、container adapter、iterator adapter。可以看出，adapter就是为了将stl中已有的接口转换为新的接口而存在的。

### 7.2 容器配接器

STL提供的queue和stack，其实都只不过是一种配接器。它们通过修饰deque的接口来实现。此处不再赘述。

### 7.3 迭代器配接器

STL提供了许多应用在迭代器身上的配接器，包括insert iterators, reserve iterators, iostream iterstors等。

+ insert iterators：可以将一般迭代器的赋值操作变为插入操作。
+ reverse iterators：可以将一般迭代器的行进方向逆转，例如将operator++变为后退操作，将operator--变为前进操作。在用于实现在“从尾端开始进行”的算法上有很大的方便性。
+ iostream iterators：可以将迭代器绑定到某个iostream对象上。将这种迭代器用于屏幕输出会非常方便，稍加修改便可适用于任何输入或输出装置上。

### 7.4 仿函数配接器

function adapters是所有配接器中数量最庞大的一种，可以不断套娃实现各种灵活的操作。这些操作包括系结（bind）、否定（negate）、组合（compose），以及对一般函数或成员函数的修饰（使其成为一个仿函数）。



## 总结

本文对STL这一软件设计上的经典做了极为简略的介绍，旨在帮助大家对STL有一个整体的认识。熟练运用STL提供的软件库可以帮助我们写出更优美的代码。篇幅所限，STL的很多重要部分，包括iostream、string、regex等无法一一介绍。感兴趣的同学可以进一步查阅相关资料学习，以及参考侯捷老师的《STL源码剖析》一书。
