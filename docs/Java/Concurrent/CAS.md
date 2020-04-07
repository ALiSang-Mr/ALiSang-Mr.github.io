JUC原子类: CAS, Unsafe和原子类详解

>JUC中多数类是通过volatile和CAS来实现的，CAS本质上提供的是一种无锁方案，而Synchronized和Lock是互斥锁方案;
>java原子类本质上使用的是CAS，而CAS底层是通过Unsafe类实现的。

[[TOC]]

::: warning 带着问题理解
- 线程安全的实现方法有哪些? 
- 什么是CAS? CAS使用示例，结合AtomicInteger给出示例? 
- CAS会有哪些问题? 针对这这些问题，Java提供了哪几个解决的? 
- AtomicInteger底层实现? CAS+volatile 
- 请阐述你对Unsafe类的理解? 
- 说说你对Java原子类的理解? 包含13个，4组分类，说说作用和使用场景。 
- AtomicStampedReference是什么? A
- tomicStampedReference是怎么解决ABA的? 内部使用Pair来存储元素值及其版本号
- java中还有哪些类可以解决ABA的问题? AtomicMarkableReference
:::

## CAS

线程安全的实现方法包含: 

- 互斥同步: synchronized 和 ReentrantLock 
- 非阻塞同步: CAS, AtomicXXXX 
- 无同步方案: 栈封闭，Thread Local，可重入代码

具体可查看:[线程安全的实现方法](../Concurrent/Basis.md)

### 什么是CAS

CAS的全称为Compare-And-Swap，直译就是对比交换。是一条CPU的原子指令，其作用是让CPU先进行比较两个值是否相等，
然后原子地更新某个位置的值，经过调查发现，其实现方式是基于硬件平台的汇编指令，就是说CAS是靠硬件实现的，J
VM只是封装了汇编调用，那些AtomicInteger类便是使用了这些封装后的接口。
 
简单解释：CAS操作需要输入两个数值，一个旧值(期望操作前的值)和一个新值，在操作期间先比较下在旧值有没有发生变化，
如果没有发生变化，才交换成新值，发生了变化则不交换。

CAS操作是原子性的，所以多线程并发使用CAS更新数据时，可以不使用锁。JDK中大量使用了CAS来更新数据而防止加锁(synchronized 重量级锁)来保持原子更新。

相信sql大家都熟悉，类似sql中的条件更新一样：update set id=3 from table where id=2。因为单条sql执行具有原子性，如果有多个线程同时执行此sql语句，只有一条能更新成功。
 