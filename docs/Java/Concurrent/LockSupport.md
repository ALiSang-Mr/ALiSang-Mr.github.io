# JUC锁: LockSupport详解

>LockSupport是锁中的基础，是一个提供锁机制的工具类，所以先对其进行分析

::: warning

- 为什么LockSupport也是核心基础类? AQS框架借助于两个类：Unsafe(提供CAS操作)和LockSupport(提供park/unpark操作)

- 写出分别通过wait/notify和LockSupport的park/unpark实现同步?

- LockSupport.park()会释放锁资源吗? 那么Condition.await()呢?

- Thread.sleep()、Object.wait()、Condition.await()、LockSupport.park()的区别? 重点

- 如果在wait()之前执行了notify()会怎样?

- 如果在park()之前执行了unpark()会怎样?

:::

## LockSupport简介

LockSupport用来创建锁和其他同步类的基本线程阻塞原语。简而言之，

当调用LockSupport.park时，表示当前线程将会等待，直至获得许可，

当调用LockSupport.unpark时，必须把等待获得许可的线程作为参数进行传递，好让此线程继续运行。
