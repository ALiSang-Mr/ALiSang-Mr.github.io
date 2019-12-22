# 关键字:volatile详解

> 相比Synchronized(重量级锁，对系统性能影响较大)，volatile提供了另一种解决可见性和有序性问题的方案。

[[TOC]]

## 带着问题理解

::: danger
- volatile关键字的作用是什么？
- volatile能保证原子性吗?
- 之前32位机器上共享的long和double变量的为什么要用volatile？现在64位机器上是否也要设置呢？
- i++为什么不能保证原子性？
- volatile是如何实现可见性的？ 内存屏障。
- volatile是如何实现有序性的？ happens-before等
- 说下volatile的应用场景？
:::
