# JUC集合: ConcurrentLinkedQueue详解

>ConcurrentLinkedQueue一个基于链接节点的**无界线程安全队列**。此队列按照 FIFO(先进先出)原则对元素进行排序。队列的头部是队列中时间最长的元素。
>队列的尾部 是队列中时间最短的元素。新的元素插入到队列的尾部，队列获取操作从队列头部获得元素。当多个线程共享访问一个公共 collection 时，
>ConcurrentLinkedQueue是一个恰当的选择。此队列不允许使用null元素。

[[TOC]]

::: warning 带着问题理解
- 要想用线程安全的队列有哪些选择?  Vector，**Collections.synchronizedList(List<T> list),** **ConcurrentLinkedQueue**等
- ConcurrentLinkedQueue实现的数据结构?
- ConcurrentLinkedQueue底层原理? 全程无锁(CAS)
- ConcurrentLinkedQueue的核心方法有哪些? offer()，poll()，peek()，isEmpty()等队列常用方法
- 说说ConcurrentLinkedQueue的HOPS(延迟更新的策略)的设计?
- ConcurrentLinkedQueue适合什么样的使用场景?
:::

## ConcurrentLinkedQueue数据结构

通过源码分析可知，ConcurrentLinkedQueue的数据结构与LinkedBlockingQueue的数据结构相同，都是使用的链表结构。ConcurrentLinkedQueue的数据结构如下:

![ConcurrentLinkedQueue的数据结构](../img/concurrentLinkedQueue_001.png "ConcurrentLinkedQueue的数据结构")

说明: ConcurrentLinkedQueue采用的链表结构，并且包含有一个头结点和一个尾结点。

## ConcurrentLinkedQueue源码分析

### 类的继承关系
``` java
public class ConcurrentLinkedQueue<E> extends AbstractQueue<E>
        implements Queue<E>, java.io.Serializable {}
```

说明: ConcurrentLinkedQueue继承了抽象类AbstractQueue，AbstractQueue定义了对队列的基本操作；同时实现了Queue接口，Queue定义了对队列的基本操作，
同时，还实现了Serializable接口，表示可以被序列化。 

### 类的内部类