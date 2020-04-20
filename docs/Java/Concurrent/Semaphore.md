# JUC工具类: Semaphore详解

>Semaphore底层是基于AbstractQueuedSynchronizer来实现的。
>Semaphore是一种在多线程环境下使用的设施，该设施负责协调各个线程，以保证它们能够正确、合理的使用公共资源的设施，也是操作系统中用于控制进程同步互斥的量。
>Semaphore是一种计数信号量，用于管理一组资源，内部是基于AQS的共享模式。它相当于给线程规定一个量从而控制允许活动的线程数

[[TOC]]

::: warning 带着问题理解
- 什么是Semaphore? 
- Semaphore内部原理? 
- Semaphore常用方法有哪些? 
- 如何实现线程同步和互斥的? 
- Semaphore适合用在什么场景? 
- 单独使用Semaphore是不会使用到AQS的条件队列? 
- Semaphore中申请令牌(acquire)、释放令牌(release)的实现? 
- Semaphore初始化有10个令牌，11个线程同时各调用1次acquire方法，会发生什么? 
- Semaphore初始化有10个令牌，一个线程重复调用11次acquire方法，会发生什么? 
- Semaphore初始化有1个令牌，1个线程调用一次acquire方法，然后调用两次release方法，之后另外一个线程调用acquire(2)方法，此线程能够获取到足够的令牌并继续运行吗? 
- Semaphore初始化有2个令牌，一个线程调用1次release方法，然后一次性获取3个令牌，会获取到吗?
:::

## Semaphore介绍

Semaphore 是 synchronized 的加强版，**作用是控制线程的并发数量**。就这一点而言，单纯的synchronized 关键字是实现不了的。



## 工作原理

以一个**停车场的运作**为例。为了简单起见，假设停车场只有三个车位，一开始三个车位都是空的。这时如果同时来了五辆车，看门人允许其中三辆不受阻碍的进入，然后放下车拦，
剩下的车则必须在入口等待，此后来的车也都不得不在入口处等待。这时，有一辆车离开停车场，看门人得知后，打开车拦，放入一辆，如果又离开两辆，则又可以放入两辆，如此往复。
这个停车系统中，每辆车就好比一个线程，看门人就好比一个信号量，看门人限制了可以活动的线程。假如里面依然是三个车位，但是看门人改变了规则，要求每次只能停两辆车，
那么一开始进入两辆车，后面得等到有车离开才能有车进入，但是得保证最多停两辆车。对于Semaphore类而言，就如同一个看门人，限制了可活动的线程数。

## Semaphore主要方法：
   
- Semaphore(int permits):构造方法，创建具有给定许可数的计数信号量并设置为非公平信号量。

- Semaphore(int permits,boolean fair):构造方法，当fair等于true时，创建具有给定许可数的计数信号量并设置为公平信号量。

- void acquire():从此信号量获取一个许可前线程将一直阻塞。相当于一辆车占了一个车位。

- void acquire(int n):从此信号量获取给定数目许可，在提供这些许可前一直将线程阻塞。比如n=2，就相当于一辆车占了两个车位。

- void release():释放一个许可，将其返回给信号量。就如同车开走返回一个车位。

- void release(int n):释放n个许可。

- int availablePermits()：当前可用的许可数。

## 示例

``` java
public class SemaphoreDemo {

    public static void main(String[] args) {
        ExecutorService executorService = Executors.newCachedThreadPool();

        //信号量，只允许 3个线程同时访问
        Semaphore semaphore = new Semaphore(2);

        for (int i = 0; i < 10; i++) {
            final long num = i;
            executorService.submit(new Runnable() {
                @Override
                public void run() {

                    try {
                        //获取许可
                        semaphore.acquire();
                        //执行
                        System.out.println("Accessing: " + num);
                        Thread.sleep(new Random().nextInt(5000)); // 模拟随机执行时长
                        //释放
                        semaphore.release();
                        System.out.println("Release..." + num);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });
        }

        executorService.shutdown();
    }
}
```
