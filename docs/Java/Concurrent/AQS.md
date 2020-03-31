# JUC锁: 锁核心类AQS详解
 
>AbstractQueuedSynchronizer抽象类是核心，需要重点掌握。它提供了一个基于FIFO队列，可以用于构建锁或者其他相关同步装置的基础框架。

::: warning
- 什么是AQS? 为什么它是核心? 

- AQS的核心思想是什么? 它是怎么实现的? 底层数据结构等 

- AQS有哪些核心的方法? 

- AQS定义什么样的资源获取方式? AQS定义了两种资源获取方式：**独占**(只有一个线程能访问执行，又根据是否**按队列**的顺序分为**公平锁**和**非公平锁**，
如**ReentrantLock**) 和**共享**(多个线程可同时访问执行，如**Semaphore**、**CountDownLatch**、 **CyclicBarrier** )。
ReentrantReadWriteLock可以看成是组合式，允许多个线程同时对某一资源进行读。

- AQS底层使用了什么样的设计模式? **模板** 

- AQS的应用示例?
:::


## AbstractQueuedSynchronizer简介(就是个同步器)

类如其名，抽象的队列式的同步器

AQS是一个用来构建锁和同步器的框架，使用AQS能简单且高效地构造出应用广泛的大量的同步器，比如我们提到的**ReentrantLock**，**Semaphore**，
其他的诸如**ReentrantReadWriteLock**，**SynchronousQueue**，**FutureTask**等等皆是基于AQS的。当然，我们自己也能利用AQS非常轻松容易地构造出符合我们自己需求的同步器。

## AQS 核心思想

AQS核心思想：

如果被请求的**共享资源空闲**，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。

如果被请求的**共享资源被占用**，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制AQS是用**CLH队列锁**实现的，即将**暂时获取不到锁的线程加入到队列**中。

>CLH(Craig,Landin,and Hagersten)队列是一个虚拟的双向队列(虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系)。

![资源分配过程](../img/aqs_001.png "资源分配过程")

>AQS是将每条请求共享资源的线程封装成一个CLH线程等待锁队列(多线程争用资源被阻塞时会进入此队列)的一个结点(Node)来实现锁的分配。

AQS使用一个int成员变量来表示同步状态(**代表共享资源**)，通过内置的FIFO队列来完成获取资源线程的排队工作。AQS使用CAS对该同步状态进行原子操作实现对其值的修改。

``` java
private volatile int state;//共享变量，使用volatile修饰保证线程可见性
```
state 的访问方式：状态信息通过protected类型的getState，setState，compareAndSetState进行操作

``` java
//返回同步状态的当前值
protected final int getState() {  
        return state;
}
 // 设置同步状态的值
protected final void setState(int newState) { 
        state = newState;
}
//原子地(CAS操作)将同步状态值设置为给定值update如果当前同步状态的值等于expect(期望值)
protected final boolean compareAndSetState(int expect, int update) {
        return unsafe.compareAndSwapInt(this, stateOffset, expect, update);
}
```

##  AQS 对资源的共享方式

AQS定义两种资源共享方式:

- Exclusive(独占)：只有一个线程能执行，如ReentrantLock。又可分为公平锁和非公平锁： 

**公平锁**：按照线程在队列中的排队顺序，先到者先拿到锁
    
**非公平锁**：当线程要获取锁时，无视队列顺序直接去抢锁，谁抢到就是谁的
 
- Share(共享)：多个线程可同时执行，如Semaphore/CountDownLatch。Semaphore、CountDownLatCh、 CyclicBarrier、ReadWriteLock 我们都会在后面讲到。

ReentrantReadWriteLock 可以看成是组合式，因为ReentrantReadWriteLock也就是**读写锁**允许多个线程同时对某一资源进行读。

不同的自定义同步器争用共享资源的方式也不同。**自定义同步器在实现时只需要实现共享资源state的获取与释放方式即可**，
至于具体线程等待队列的维护（如获取资源失败入队/唤醒出队等），AQS已经在顶层实现好了。

## AQS底层使用了模板方法模式

>同步器的设计是基于模板方法模式的，如果需要自定义同步器一般的方式是这样(模板方法模式很经典的一个应用)：

**自定义同步器**

使用者继承AbstractQueuedSynchronizer并重写指定的方法。(这些重写方法很简单，无非是对于共享资源state的获取和释放)
将AQS组合在自定义同步组件的实现中，并调用其模板方法，而这些模板方法会调用使用者重写的方法。

这和我们以往通过实现接口的方式有很大区别，模板方法模式请参看：设计模式行为型 - 模板方法(Template Method)详解

AQS使用了模板方法模式，自定义同步器时需要重写下面几个AQS提供的模板方法：

``` java
isHeldExclusively()//该线程是否正在独占资源。只有用到condition才需要去实现它。
tryAcquire(int)//独占方式。尝试获取资源，成功则返回true，失败则返回false。
tryRelease(int)//独占方式。尝试释放资源，成功则返回true，失败则返回false。
tryAcquireShared(int)//共享方式。尝试获取资源。负数表示失败；0表示成功，但没有剩余可用资源；正数表示成功，且有剩余资源。
tryReleaseShared(int)//共享方式。尝试释放资源，成功则返回true，失败则返回false。
```

默认情况下，每个方法都抛出 UnsupportedOperationException。 这些方法的实现必须是内部线程安全的，并且通常应该简短而不是阻塞。
AQS类中的其他方法都是final ，所以无法被其他类使用，只有这几个方法可以被其他类使用。

以ReentrantLock为例，state初始化为0，表示未锁定状态。A线程lock()时，会调用tryAcquire()独占该锁并将state+1。此后，其他线程再tryAcquire()时就会失败，
直到A线程unlock()到state=0(即释放锁)为止，其它线程才有机会获取该锁。当然，释放锁之前，A线程自己是可以重复获取此锁的(state会累加)，这就是可重入的概念。
但要注意，获取多少次就要释放多么次，这样才能保证state是能回到零态的。

再以CountDownLatch以例，任务分为N个子线程去执行，state也初始化为N（注意N要与线程个数一致）。这N个子线程是并行执行的，每个子线程执行完后countDown()一次，
state会CAS减1。等到所有子线程都执行完后(即state=0)，会unpark()主调用线程，然后主调用线程就会从await()函数返回，继续后余动作。

一般来说，自定义同步器要么是独占方法，要么是共享方式，他们也只需实现tryAcquire-tryRelease、tryAcquireShared-tryReleaseShared中的一种即可。

但AQS也支持自定义同步器同时实现独占和共享两种方式，如ReentrantReadWriteLock。

