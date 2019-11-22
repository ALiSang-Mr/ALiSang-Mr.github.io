# Java并发 - 线程基础

> 本文主要概要性的介绍线程的基础，为后面的章节深入介绍Java并发的知识提供基础



[[TOC]]

## 线程状态转换

![线程状态转换](../img/thread_001.jpg "线程状态")

### 新建(New)

线程创建后尚未启动

### 可运行(Runnable)

可能正在运行，也可能正在等待CPU时间片

包含了操作系统线程状态中的Running和Ready

### 阻塞(Blocking)

等待获取一个排它锁，如果其线程释放了锁就会结束此状态。

### 无限期等待(Waiting)

等待其它线程显式地唤醒，否则不会被分配 CPU 时间片。

进入方法|退出方法|
--|:--:|
没有设置 Timeout 参数的 Object.wait() 方法|Object.notify() / Object.notifyAll()|
没有设置 Timeout 参数的 Thread.join() 方法|被调用的线程执行完毕|
LockSupport.park() 方法|-|

### 限期等待(Timed Waiting)

无需等待其它线程显式地唤醒，在一定时间之后会被系统自动唤醒。

调用 Thread.sleep() 方法使线程进入限期等待状态时，常常用“使一个线程睡眠”进行描述

调用 Object.wait() 方法使线程进入限期等待或者无限期等待时，常常用“挂起一个线程”进行描述。

睡眠和挂起是用来描述行为，而阻塞和等待用来描述状态。

阻塞和等待的区别在于，阻塞是被动的，它是在等待获取一个排它锁。而等待是主动的，通过调用 Thread.sleep() 和 Object.wait() 等方法进入。

进入方法|退出方法|
--|:--:|
Thread.sleep() 方法|时间结束|
设置了 Timeout 参数的 Object.wait() 方法|时间结束 / Object.notify() / Object.notifyAll()|
设置了 Timeout 参数的 Thread.join() 方法|时间结束 / 被调用的线程执行完毕|
LockSupport.parkNanos() 方法|-|
LockSupport.parkUntil() 方法|-|

### 死亡(Terminated)

可以是线程结束任务之后自己结束，或者产生了异常而结束。

---

## 线程使用方式

有三种使用线程的方法: 

- 实现 Runnable 接口； 

- 实现 Callable 接口； 

- 继承 Thread 类。 

实现 Runnable 和 Callable 接口的类只能当做一个可以在线程中运行的任务，不是真正意义上的线程，

因此最后还需要通过 Thread 来调用。可以说任务是通过线程驱动从而执行的。

### 实现Runnable接口

需要实现 run() 方法。

通过 Thread 调用 start() 方法来启动线程。

``` java
       public class MyRunnable implements Runnable {
           public void run() {
            // ...
           }
       }
```
``` java
       public static void main(String[] args) {
           MyRunnable instance = new MyRunnable();
           Thread thread = new Thread(instance);
           thread.start();
       }

```
### 继承Thread类

 同样也是需要实现 run() 方法，因为 Thread 类也实现了 Runable 接口。 
 
 当调用 start() 方法启动一个线程时，虚拟机会将该线程放入就绪队列中等待被调度，当一个线程被调度时会执行该线程的 run() 方法。

``` java
    public class MyThread extends Thread {
        public void run() {
            // ...
        }
    }
```
``` java
    public static void main(String[] args) {
        MyThread mt = new MyThread();
        mt.start();
    }
```

### 实现Callable接口

与 Runnable 相比，Callable 可以有**返回值**，返回值通过 FutureTask 进行封装。

``` java
    public class MyCallable implements Callable<Integer> {
        public Integer call() {
            return 123;
        }
    }
```
``` java
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        MyCallable mc = new MyCallable();
        FutureTask<Integer> ft = new FutureTask<>(mc);
        Thread thread = new Thread(ft);
        thread.start();
        System.out.println(ft.get());
    }
```

### 实现接口VS继承Thread类



