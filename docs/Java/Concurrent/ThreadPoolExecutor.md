# JUC线程池: ThreadPoolExecutor详解

>线程池的内容非常重要

[[TOC]]

::: warning 带着问题理解
- 为什么要有线程池? 
- Java是实现和管理线程池有哪些方式?  请简单举例如何使用。 
- 为什么很多公司不允许使用Executors去创建线程池? 那么推荐怎么使用呢? 
- ThreadPoolExecutor有哪些核心的配置参数? 请简要说明 
- ThreadPoolExecutor可以创建哪是哪三种线程池呢? 
- 当队列满了并且worker的数量达到maxSize的时候，会怎么样?
 - 说说ThreadPoolExecutor有哪些RejectedExecutionHandler策略? 默认是什么策略? 
 - 简要说下线程池的任务执行机制? execute –> addWorker –>runworker (getTask) 
 - 线程池中任务是如何提交的? 
 - 线程池中任务是如何关闭的? 
 - 在配置线程池的时候需要考虑哪些配置因素? 
 - 如何监控线程池的状态? 
:::

## 为什么要有线程

线程池能够对线程进行统一分配，调优和监控:

- 降低资源消耗(线程无限制地创建，然后使用完毕后销毁)
- 提高响应速度(无须创建线程)
- 提高线程的可管理性

## ThreadPoolExecutor例子

Java是如何实现和管理线程池的? 从JDK 5开始，把工作单元与执行机制分离开来，工作单元包括Runnable和Callable，而执行机制由Executor框架提供。



