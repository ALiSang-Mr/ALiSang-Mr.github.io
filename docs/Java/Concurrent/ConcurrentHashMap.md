 # JUC集合: ConcurrentHashMap详解
 
>JDK1.7之前的ConcurrentHashMap使用分段锁机制实现，JDK1.8则使用数组+链表+红黑树数据结构和CAS原子操作实现ConcurrentHashMap；
>本文将分别介绍这两种方式的实现方案及其区别。

[[TOC]]

::: warning 带着问题理解
- 为什么HashTable慢? 它的并发度是什么? 那么ConcurrentHashMap并发度是什么? 
- ConcurrentHashMap在JDK1.7和JDK1.8中实现有什么差别? JDK1.8解決了JDK1.7中什么问题 
- ConcurrentHashMap JDK1.7实现的原理是什么? 
- 分段锁机制 ConcurrentHashMap JDK1.8实现的原理是什么? 数组+链表+红黑树，CAS 
- ConcurrentHashMap JDK1.7中Segment数(concurrencyLevel)默认值是多少? 为何一旦初始化就不可再扩容?
- ConcurrentHashMap JDK1.7说说其put的机制? 
- ConcurrentHashMap JDK1.7是如何扩容的? rehash(注：segment 数组不能扩容，扩容是 segment 数组某个位置内部的数组
 HashEntry<K,V>[] 进行扩容) 
- ConcurrentHashMap JDK1.8是如何扩容的? tryPresize 
- ConcurrentHashMap JDK1.8链表转红黑树的时机是什么? 临界值为什么是8? 
- ConcurrentHashMap JDK1.8是如何进行数据迁移的? transfer
:::

## 为什么HashTable慢

Hashtable之所以效率低下主要是因为其实现使用了synchronized关键字对put等操作进行加锁，而synchronized关键字加锁是**对整个对象进行加锁**，
也就是说在进行put等修改Hash表的操作时，**锁住了整个Hash表**，从而使得其表现的效率低下。

## ConcurrentHashMap - JDK 1.7

在JDK1.5~1.7版本，Java使用了**分段锁机制**实现ConcurrentHashMap.

## 数据结构

首先将数据分为一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据时，其他段的
数据也能被其他线程访问。

**ConcurrentHashMap 是由 Segment 数组结构和 HashEntry 数组结构组成。**

Segment 实现了 ReentrantLock,所以 Segment 是一种可重入锁，扮演锁的角色。HashEntry 用于存储键值对数
据。

![Java7 ConcurrentHashMap 结构](../img/concurrentHashMap_001.png "Java7 ConcurrentHashMap 结构")