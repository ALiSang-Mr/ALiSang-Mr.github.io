# JVM 核心问题

[[TOC]]

::: tip 请谈谈你对JVM的理解？Java8的虚拟机有什么更新？

Java虚拟机（JVM）是运行 Java 字节码的虚拟机。JVM有针对不同系统的特定实现（Windows，Linux，macOS），目的是使用相同的字节码，它们都会给出相同的结果。

:::

## 说一下 JVM 的主要组成部分？及其作用？

::: tip 说一下 JVM 的主要组成部分？及其作用？
 ![JVM 组成](../img/question_001.jpg "JVM 组成")
 
 类加载器（ClassLoader）
 
 运行时数据区（Runtime Data Area） 
 
 执行引擎（Execution Engine） 
 
 本地库接口（Native Interface） 
 
 组件的作用：首先通过类加载器（ClassLoader）会把 Java 代码转换成字节码，运行时数据区（Runtime Data Area）再把字节码加载到内存中，
 而字节码文件只是 JVM 的一套指令集规范，并不能直接交给底层操作系统去执行，因此需要特定的命令解析器执行引擎（Execution Engine），
 将字节码翻译成底层系统指令，再交由 CPU 去执行，而这个过程中需要调用其他语言的本地库接口（Native Interface）来实现整个程序的功能。

:::

::: tip 说一下 JVM 运行时数据区？
[Java内存结构](Memory.md)
:::

::: tip 说一下堆栈的区别？

功能方面：堆是用来存放对象的，栈是用来执行程序的。

共享性：堆是线程共享的，栈是线程私有的。

空间大小：堆大小远远大于栈。

:::

::: tip 队列和栈是什么？有什么区别？

队列和栈是一种数据结构

队列和栈都是被用来预存储数据的。

队列是先进先出 类似水流经过水管

栈是后进先出 类似水杯

:::

::: tip 什么是OOM?什么是StackOverflowError?有哪些方法分析？

:::

::: tip JVM的常用参数调优你知道哪些？

:::

::: tip 谈谈JVM中，对类加载器你的认识？

:::