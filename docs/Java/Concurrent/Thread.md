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

### 实现Callable接口(#a)

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

### 实现接口 VS 继承Thread类 ?

实现接口会更好一些，因为:

Java 不支持多重继承，因此继承了 Thread 类就无法继承其它类，但是可以实现多个接口；

类可能只要求可执行就行，继承整个 Thread 类开销过大。

## 基础线程机制

### Executor(线程池)

Executor 管理多个异步任务的执行，而无需程序员显式地管理线程的生命周期。
这里的异步是指多个任务的执行互不干扰，不需要进行同步操作。

[AAA](ExecutorPool.md)

### Daemon

守护线程是程序运行时在后台提供服务的线程，不属于程序中不可或缺的部分。

当所有非守护线程结束时，程序也就终止，同时会杀死所有守护线程。

main() 属于非守护线程。

使用 setDaemon() 方法将一个线程设置为守护线程。

``` java
    public static void main(String[] args) {
        Thread thread = new Thread(new MyRunnable());
        thread.setDaemon(true);
    }
```

### sleep()
Thread.sleep(millisec) 方法会休眠当前正在执行的线程，millisec 单位为毫秒。 

sleep() 可能会抛出 InterruptedException，因为异常不能跨线程传播回 main() 中，
因此必须在本地进行处理。线程中抛出的其它异常也同样需要在本地进行处理。

``` java
    public void run() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
```
### yield()

对静态方法 Thread.yield() 的调用声明了当前线程已经完成了生命周期中最重要的部分，可以切换给其它线程来执行。
该方法只是对线程调度器的一个建议，而且也只是建议具有相同优先级的其它线程可以运行。

``` java
    public void run() {
        Thread.yield();
    }
```

## 线程中断

一个线程执行完毕之后会自动结束，如果在运行过程中发生异常也会提前结束。

### InterruptedException

如何中断一个线程？

**通过调用一个线程的 interrupt() 来中断该线程，**

条件是什么？

如果该线程处于**阻塞**、**限期等待**或者**无限期等待**状态，那么就会抛出 InterruptedException，从而提前结束该线程。

::: danger
但是不能中断 I/O 阻塞和 synchronized 锁阻塞。
:::

对于以下代码，在 main() 中启动一个线程之后再中断它，由于线程中调用了 Thread.sleep() 方法，
因此会抛出一个 InterruptedException，从而提前结束线程，不执行之后的语句。

``` java
    public class InterruptExample {
    
        private static class MyThread1 extends Thread {
            @Override
            public void run() {
                try {
                    Thread.sleep(2000);
                    System.out.println("Thread run");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
```
``` java
    public static void main(String[] args) throws InterruptedException {
        Thread thread1 = new MyThread1();
        thread1.start();
        thread1.interrupt();
        System.out.println("Main run");
    }
```

### interrupted()

如果一个线程的 run() 方法执行一个无限循环，并且没有执行 sleep() 等会抛出 InterruptedException 的操作，那么调用线程的 interrupt() 方法就无法使线程提前结束。

但是调用 interrupt() 方法会设置线程的**中断标记**，此时调用 interrupted() 方法会返回 true。因此可以在循环体中
<U>使用 interrupted() 方法来判断线程是否处于中断状态，从而提前结束线程。</u>

``` java
    public class InterruptExample {
    
        private static class MyThread2 extends Thread {
            @Override
            public void run() {
                while (!interrupted()) {
                    // ..
                }
                System.out.println("Thread end");
            }
        }
    }
```
``` java
    public static void main(String[] args) throws InterruptedException {
        Thread thread2 = new MyThread2();
        thread2.start();
        thread2.interrupt();
    }
```
``` java
   Thread end   //interrupted()方法判断此线程没有被中断 所以执行了之后的方法
```

## Executor 线程池的中断操作

调用 Executor 的 **shutdown()** 方法会等待线程都执行完毕之后再关闭，

但是如果调用的是 **shutdownNow()** 方法，则相当于调用每个线程的 interrupt() 方法。 

以下使用 Lambda 创建线程，相当于创建了一个匿名内部线程。

``` java
   public static void main(String[] args) {
       ExecutorService executorService = Executors.newCachedThreadPool();
       executorService.execute(() -> {
           try {
               Thread.sleep(2000);
               System.out.println("Thread run");
           } catch (InterruptedException e) {
               e.printStackTrace();
           }
       });
       executorService.shutdownNow();
       System.out.println("Main run");
   }
```
``` java
    Main run
    java.lang.InterruptedException: sleep interrupted
        at java.lang.Thread.sleep(Native Method)
        at ExecutorInterruptExample.lambda$main$0(ExecutorInterruptExample.java:9)
        at ExecutorInterruptExample$$Lambda$1/1160460865.run(Unknown Source)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
        at java.lang.Thread.run(Thread.java:745)
```

如果只想中断 Executor 中的一个线程，可以通过使用 submit() 方法来提交一个线程，它会返回一个 Future<?> 对象，通过调用该对象的 cancel(true) 方法就可以中断线程。

``` java
    Future<?> future = executorService.submit(() -> {
        // ..
    });
    future.cancel(true);
```

## 线程互斥同步

Java 提供了两种锁机制来控制多个线程对共享资源的互斥访问，

- 第一个是 JVM 实现的 synchronized，

- 而另一个是 JDK 实现的 ReentrantLock。

### synchronized

1. 同步一个代码块

``` java
    public void func() {
        synchronized (this) {
            // ...
        }
    }
```
它只作用于同一个对象，如果调用两个对象上的同步代码块，就不会进行同步。

对于以下代码，使用 ExecutorService 执行了两个线程，由于调用的是同一个对象的同步代码块，因此这两个线程会进行同步，当一个线程进入同步语句块时，另一个线程就必须等待。

2. 同步一个方法

3. 同步一个类