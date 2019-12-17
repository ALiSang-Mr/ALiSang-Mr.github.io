# 关键字:synchronized详解

> 在C程序代码中我们可以利用操作系统提供的互斥锁来实现同步块的互斥访问及线程的阻塞及唤醒等工作。
在Java中除了提供Lock API外还在语法层面上提供了synchronized关键字来实现互斥同步原语, 本文将对synchronized关键字详细分析

[[TOC]]

## 带着问题理解

::: danger
- Synchronized可以作用在哪里？分别通过对象锁和类锁进行举例。
- Synchronized本质上是通过什么保证线程安全的？分三个方面回答：加锁和释放锁的原理，可重入原理，保证可见性原理。
- Synchronized由什么样的缺陷？ Java Lock是怎么弥补这些缺陷的。
- Synchronized和Lock的对比，和选择？
- Synchronized在使用时有何注意事项？
- Synchronized修饰的方法在抛出异常时,会释放锁吗？
- 多个线程等待同一个synchronized锁的时候，JVM如何选择下一个获取锁的线程？
- Synchronized使得同时只有一个线程可以执行，性能比较差，有什么提升的方法？
- 我想更加灵活地控制锁的释放和获取(现在释放锁和获取锁的时机都被规定死了)，怎么办？
- 什么是锁的升级和降级？什么是JVM里的偏斜锁、轻量级锁、重量级锁
- 不同的JDK中对Synchronized有何优化？
:::

## Synchronized的使用

在应用Synchronized关键字时需要把握如下注意点：

- 一把锁只能同时被一个线程获取，没有获得锁的线程只能等待； 

- 每个实例都对应有自己的一把锁(this),不同实例之间互不影响；例外：锁对象是*.class以及synchronized修饰的是static方法的时候，
所有对象公用同一把锁 

- synchronized修饰的方法，无论方法正常执行完毕还是抛出异常，jvm都会释放锁(使用synchronized加锁的好处)

Synchronized这个同步锁就分为两种：一种是对象锁,一种是类锁。

而这个对象锁有两种表现形式:一个是方法锁的形式(默认是当前对象作为锁的对象),一个是代码块形式(手动指定锁定对象，也可是是this,也可以是自定义的锁)

类锁:修饰静态方法的和指定锁对象为Class对象的。

对象锁是用来控制实例方法之间的同步，而类锁是用来控制静态方法（或者静态变量互斥体）之间的同步的。