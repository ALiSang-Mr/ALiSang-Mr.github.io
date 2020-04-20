# JUC工具类: CyclicBarrier同步屏障详解

>CyclicBarrier底层是基于ReentrantLock和AbstractQueuedSynchronizer来实现的, 在理解的时候最好和CountDownLatch放在一起理解

[[TOC]]

::: warning 带着问题理解
- 什么是CyclicBarrier? 
- CyclicBarrier底层实现原理? 
- CountDownLatch和CyclicBarrier对比? 
- CyclicBarrier的核心函数有哪些? 
- CyclicBarrier适用于什么场景?
:::

## CyclicBarrier简介

发音:C克利克拜瑞儿

CyclicBarrier 的字面意思是可循环使用（Cyclic）的屏障（Barrier）

它要做的事情是，让一组线程到达一个屏障（也可以叫同步点）时被阻塞，直到最后一个线程到达屏障时，屏障才会开门，所有被屏障拦截的线程才会继续干活。
CyclicBarrier默认的构造方法是CyclicBarrier(int parties)，其参数表示屏障拦截的线程数量，每个线程调用await方法告诉CyclicBarrier我已经到达了屏障，然后当前线程被阻塞。

## 示例

``` java
public class CyclicBarrierDemo {

    public static void main(String[] args) {
        //CyclicBarrier(int parties, Runnable barrierAction)
        CyclicBarrier cyclicBarrier = new CyclicBarrier(7,()->System.out.println("收集完毕，召唤神龙！"));
        for (int i = 1; i <=7 ; i++) {
            final int tempInt = i;
            new Thread(()->{
                System.out.println(Thread.currentThread().getName() + "\t 收集到第"+ tempInt + "颗龙珠");
                try {
                    cyclicBarrier.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
            },String.valueOf(i)).start();
        }
    }
}
```

## CyclicBarrier的应用场景

**CyclicBarrier可以用于多线程计算数据，最后合并计算结果的应用场景**。比如我们用一个Excel保存了用户所有银行流水，每个Sheet保存一个帐户近一年的每笔银行流水，
现在需要统计用户的日均银行流水，先用多线程处理每个sheet里的银行流水，都执行完之后，得到每个sheet的日均银行流水，最后，再用barrierAction用这些线程的计算结果，
计算出整个Excel的日均银行流水。

## CyclicBarrier源码分析
  
### 类的继承关系

CyclicBarrier没有显示继承哪个父类或者实现哪个父接口, 所有AQS和重入锁不是通过继承实现的，而是通过组合实现的。

``` java
public class CyclicBarrier {}
```　　

### 类的内部类

CyclicBarrier类存在一个内部类Generation，每一次使用的CycBarrier可以当成Generation的实例，其源代码如下

```java
private static class Generation {
    boolean broken = false;
}
```
说明: Generation类有一个属性broken，用来表示当前屏障是否被损坏。

### 类的属性

```` java
public class CyclicBarrier {
    
    /** The lock for guarding barrier entry */
    // 可重入锁
    private final ReentrantLock lock = new ReentrantLock();
    /** Condition to wait on until tripped */
    // 条件队列
    private final Condition trip = lock.newCondition();
    /** The number of parties */
    // 参与的线程数量
    private final int parties;
    /* The command to run when tripped */
    // 由最后一个进入 barrier 的线程执行的操作
    private final Runnable barrierCommand;
    /** The current generation */
    // 当前代
    private Generation generation = new Generation();
    // 正在等待进入屏障的线程数量
    private int count;
}
````
说明: 该属性有一个为ReentrantLock对象，有一个为Condition对象，而Condition对象又是基于AQS的，所以，归根到底，底层还是由AQS提供支持

### 类的构造函数

- CyclicBarrier(int, Runnable)型构造函数
``` java
public CyclicBarrier(int parties, Runnable barrierAction) {
    // 参与的线程数量小于等于0，抛出异常
    if (parties <= 0) throw new IllegalArgumentException();
    // 设置parties
    this.parties = parties;
    // 设置count
    this.count = parties;
    // 设置barrierCommand
    this.barrierCommand = barrierAction;
}
```
说明: 该构造函数可以指定关联该CyclicBarrier的线程数量，并且可以指定在所有线程都进入屏障后的执行动作，该执行动作由最后一个进行屏障的线程执行。
用于在线程到达屏障时，优先执行barrierAction，方便处理更复杂的业务场景
- CyclicBarrier(int)型构造函数

``` java
public CyclicBarrier(int parties) {
    // 调用含有两个参数的构造函数
    this(parties, null);
}
```
说明: 该构造函数仅仅执行了关联该CyclicBarrier的线程数量，没有设置执行动作


## 和CountDonwLatch再对比 

- CountDownLatch减计数，CyclicBarrier加计数。 
- CountDownLatch是一次性的，CyclicBarrier可以重用。 
- CountDownLatch和CyclicBarrier都有让多个线程等待同步然后再开始下一步动作的意思，但是CountDownLatch的下一步的动作实施者是主线程，具有不可重复性；
而CyclicBarrier的下一步动作实施者还是“其他线程”本身，具有往复多次实施动作的特点。



