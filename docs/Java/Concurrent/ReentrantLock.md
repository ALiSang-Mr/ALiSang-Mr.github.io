# JUC锁: ReentrantLock详解
 
>可重入锁ReentrantLock的底层是通过AbstractQueuedSynchronizer实现，所以先要学习上一章节AbstractQueuedSynchronizer详解。

[[TOC]]

::: warning

- 什么是可重入，什么是可重入锁? 它用来解决什么问题? 

- ReentrantLock的核心是AQS，那么它怎么来实现的，继承吗? 说说其类内部结构关系。

- ReentrantLock是如何实现公平锁的?
 
- ReentrantLock是如何实现非公平锁的? 

- ReentrantLock默认实现的是公平还是非公平锁? 使用ReentrantLock实现公平和非公平锁的示例? 

- ReentrantLock和Synchronized的对比? 

:::

## ReentrantLock源码分析

### 类的继承关系

**ReentrantLock实现了Lock接口**，Lock接口中定义了lock与unlock相关操作，并且还存在newCondition方法，表示生成一个条件。

``` java
public class ReentrantLock implements Lock, java.io.Serializable
```
### 类的内部类

**ReentrantLock总共有三个内部类**，并且三个内部类是紧密相关的，下面先看三个类的关系。

![三个类的关系](../img/reentrantLock_001.png "三个类的关系")

说明: ReentrantLock类内部总共存在Sync、NonfairSync、FairSync三个类，NonfairSync与FairSync类继承自Sync类，Sync类继承自AbstractQueuedSynchronizer抽象类。下面逐个进行分析。
