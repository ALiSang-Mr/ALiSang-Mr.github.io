# 关键字:volatile详解

> 相比Synchronized(重量级锁，对系统性能影响较大)，volatile提供了另一种解决可见性和有序性问题的方案。

[[TOC]]

## 带着问题理解

::: warning
- volatile关键字的作用是什么？
- volatile能保证原子性吗?
- 之前32位机器上共享的long和double变量的为什么要用volatile？现在64位机器上是否也要设置呢？
- i++为什么不能保证原子性？
- volatile是如何实现可见性的？ 内存屏障。
- volatile是如何实现有序性的？ happens-before等
- 说下volatile的应用场景？
:::

## volatile的作用详解

### 禁止指令重排序

我们从一个最经典的例子来分析重排序问题。大家应该都很熟悉单例模式的实现，而在并发环境下的单例实现方式，我们通常可以采用双重检查加锁(DCL)的方式来实现。其源码如下：

``` java
public class Singleton {
    public static volatile Singleton singleton;
    /**
     * 构造函数私有，禁止外部实例化
     */
    private Singleton() {};
    public static Singleton getInstance() {
        if (singleton == null) {
            synchronized (singleton) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}

```
分析修饰Singleton对象的volatile,需要了解**实例化对象**的步骤:

- 分配内存空间。

- 初始化对象。

- 将内存空间的地址赋值给对应的引用。

但是由于操作系统可以对**指令进行重排序**，所以上面的过程也可能会变成如下过程：

- 分配内存空间。

- 将内存空间的地址赋值给对应的引用。
    
- 初始化对象

在多线程环境下就可能得到没有初始化的对象引用。所以为了防止这个过程重排序，需要在变量之前用volatile修饰。

### 实现可见性

**可见性问题主要指一个线程修改了共享变量值，而另一个线程却看不到**。

引起可见性问题的**主要原因**是每个线程拥有自己的一个高速缓存区——**线程工作内存**。

而volatile关键字能有效的解决这个问题。

``` java
package JVM.jmm;

/** volatile可见性
 * @ClassName VolatileVisibilityTest
 * @Description TODO
 * @Version 1.0
 **/
public class VolatileVisibilityTest {

    private static volatile boolean initFlag = false;

    public static void main(String[] args) throws InterruptedException {
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.err.println("wait data ...");
                while (!initFlag){

                }
                System.err.println("===============success");
            }
        }).start();

        Thread.sleep(2000);

        new Thread(new Runnable() {
            @Override
            public void run() {
                prepareData();
            }
        }).start();
    }

    public static void prepareData(){
        System.err.println("prepareing data ...");
        initFlag = true;
        System.err.println("prepare data end ...");

    }
}
```
**未使用volatile**执行结果
``` java
wait data ...
prepareing data ...
prepare data end ...
```
**使用volatile**执行结果
``` java
wait data ...
prepareing data ...
prepare data end ...
===============success
```
### 保证原子性:**单次**读/写

volatile保证**单次**的读/写操作具有原子性

volatile无法保证对变量的任何操作都具有原子性

**问题1：i++为什么不能保证原子性**

对volatile变量的单次读/写操作可以保证原子性的，如long和double类型变量，但是并不能保证i++这种操作的原子性，因为本质上**i++是读、写两次操作**。

复合操作i++:

- 读取i的值。

- 对i加1。

- 将i的值写回内存

**volatile是无法保证这三个操作是具有原子性的，我们可以通过AtomicInteger或者Synchronized来保证+1操作的原子性**。

::: danger
**synchronized**保证原子性
``` java
package Volatile;

/** volatile不能保证原子性
 *  而synchronized是可以保证原子性
 * @ClassName VolatileExample
 * @Description TODO
 **/
public class VolatileExample {

    public static volatile int counter = 0;

    public static void main(String[] args) {

        for (int i = 0; i < 10; i++) {
            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
//                    synchronized (VolatileExample.class) {
                    for (int i = 0; i < 10000; i++) {
                        counter++;
//                        }
                    }
                }
            });
            thread.start();
        }
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.err.println(counter);

    }
}
```
::: 
``
::: danger

**AtomicInteger**保证原子性
``` java
package JVM.test;
import java.util.concurrent.atomic.AtomicInteger;

/**  AtomicInteger 保证原子性
 * @ClassName Test
 * @Description TODO
 **/
public class Test {
    public static AtomicInteger inc = new AtomicInteger();

    public  static void increase() {
        inc.getAndIncrement();
    }
    private static final int THREADS_CONUT = 20;

    public static void main(String[] args) throws InterruptedException {
        Thread[] threads = new Thread[THREADS_CONUT];
        for (int i = 0; i < THREADS_CONUT; i++) {
            threads[i] = new Thread(new Runnable() {
                @Override
                public void run() {
                    for (int i = 0; i < 1000; i++) {
                        increase();
                    }
                }
            });
            threads[i].start();
        }

        for (int i = 0; i < THREADS_CONUT; i++) {
            threads[i].join();
        }
        System.out.println("********count:" + inc);
    }
}
```
:::

**问题2：共享的long和double变量的为什么要用volatile?**

因为long和double两种数据类型的操作可分为高32位和低32位两部分，因此普通的long或double类型读/写可能不是原子的。

因此，鼓励大家将共享的long和double变量设置为volatile类型，这样能保证任何情况下对long和double的单次读/写操作都具有原子性。

## volatile的实现原理

#### volatile的可见性实现

>volatile 变量的内存可见性是基于内存屏障(Memory Barrier)实现:

#### volatile的有序性实现