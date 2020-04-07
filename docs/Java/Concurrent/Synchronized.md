# 关键字:synchronized详解

> 在C程序代码中我们可以利用操作系统提供的互斥锁来实现同步块的互斥访问及线程的阻塞及唤醒等工作。
在Java中除了提供Lock API外还在语法层面上提供了synchronized关键字来实现互斥同步原语, 本文将对synchronized关键字详细分析

[[TOC]]

::: warning 带着问题理解
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

- synchronized修饰的方法，**无论方法正常执行完毕还是抛出异常**，jvm都会释放锁(使用synchronized加锁的好处)



Synchronized这个**同步锁**就分为两种：

一种是**对象锁**,一种是**类锁**。

**什么样的是对象锁？**

1. synchronized **修饰普通方法** 被成为方法锁，此时的锁是当前对象

2. synchronized 代码块  此时锁可以是this，也可以自定义锁

**什么样的是类锁？**

1.**修饰静态方法(就是static修饰的)的**

2.指定锁是.class对象

### 对象锁

包括方法锁(默认锁对象为this,当前实例对象)和同步代码块锁(自己指定锁对象)

**代码块形式：手动指定锁定对象，也可是是this,也可以是自定义的锁**

``` java
public class SynchronizedObjectLock implements Runnable {
    static SynchronizedObjectLock instence = new SynchronizedObjectLock();

    @Override
    public void run() {
        // 同步代码块形式——锁为this,两个线程使用的锁是一样的,线程1必须要等到线程0释放了该锁后，才能执行
        synchronized (this) {
            System.out.println("我是线程" + Thread.currentThread().getName());
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "结束");
        }
    }

    public static void main(String[] args) {
        Thread t1 = new Thread(instence);
        Thread t2 = new Thread(instence);
        t1.start();
        t2.start();
    }
}
```
输出结果：
``` java
我是线程Thread-0
Thread-0结束
我是线程Thread-1
Thread-1结束
```
示例2：
``` java
著作权归https://www.pdai.tech所有。
链接：https://www.pdai.tech/md/java/thread/java-thread-x-key-synchronized.html

public class SynchronizedObjectLock implements Runnable {
    static SynchronizedObjectLock instence = new SynchronizedObjectLock();
    // 创建2把锁
    Object block1 = new Object();
    Object block2 = new Object();

    @Override
    public void run() {
        // 这个代码块使用的是第一把锁，当他释放后，后面的代码块由于使用的是第二把锁，因此可以马上执行
        synchronized (block1) {
            System.out.println("block1锁,我是线程" + Thread.currentThread().getName());
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("block1锁,"+Thread.currentThread().getName() + "结束");
        }

        synchronized (block2) {
            System.out.println("block2锁,我是线程" + Thread.currentThread().getName());
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("block2锁,"+Thread.currentThread().getName() + "结束");
        }
    }

    public static void main(String[] args) {
        Thread t1 = new Thread(instence);
        Thread t2 = new Thread(instence);
        t1.start();
        t2.start();
    }
}
```
输出结果：
``` java
block1锁,我是线程Thread-0
block1锁,Thread-0结束
block2锁,我是线程Thread-0　　// 可以看到当第一个线程在执行完第一段同步代码块之后，第二个同步代码块可以马上得到执行，因为他们使用的锁不是同一把
block1锁,我是线程Thread-1
block2锁,Thread-0结束
block1锁,Thread-1结束
block2锁,我是线程Thread-1
block2锁,Thread-1结束
```

**方法锁形式：synchronized修饰普通方法，锁对象默认为this**

``` java
public class SynchronizedObjectLock implements Runnable {
    static SynchronizedObjectLock instence = new SynchronizedObjectLock();

    @Override
    public void run() {
        method();
    }

    public synchronized void method() {
        System.out.println("我是线程" + Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + "结束");
    }

    public static void main(String[] args) {
        Thread t1 = new Thread(instence);
        Thread t2 = new Thread(instence);
        t1.start();
        t2.start();
    }
}
```
输出结果：
``` java
我是线程Thread-0
Thread-0结束
我是线程Thread-1
Thread-1结束
```

### 类锁

指synchronize修饰静态的方法或指定锁对象为Class对象

**synchronize修饰静态方法**

``` java
public class SynchronizedObjectLock implements Runnable {
    static SynchronizedObjectLock instence1 = new SynchronizedObjectLock();
    static SynchronizedObjectLock instence2 = new SynchronizedObjectLock();

    @Override
    public void run() {
        method();
    }

    // synchronized用在静态方法上，默认的锁就是当前所在的Class类，所以无论是哪个线程访问它，需要的锁都只有一把
    public static synchronized void method() {
        System.out.println("我是线程" + Thread.currentThread().getName());
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName() + "结束");
    }

    public static void main(String[] args) {
        Thread t1 = new Thread(instence1);
        Thread t2 = new Thread(instence2);
        t1.start();
        t2.start();
    }
}
```
输出结果：
``` java
我是线程Thread-0
Thread-0结束
我是线程Thread-1
Thread-1结束
```

**synchronized指定锁对象为Class对象**

``` java
public class SynchronizedObjectLock implements Runnable {
    static SynchronizedObjectLock instence1 = new SynchronizedObjectLock();
    static SynchronizedObjectLock instence2 = new SynchronizedObjectLock();

    @Override
    public void run() {
        // 所有线程需要的锁都是同一把
        synchronized(SynchronizedObjectLock.class){
            System.out.println("我是线程" + Thread.currentThread().getName());
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "结束");
        }
    }

    public static void main(String[] args) {
        Thread t1 = new Thread(instence1);
        Thread t2 = new Thread(instence2);
        t1.start();
        t2.start();
    }
}
```
输出结果：
``` java
我是线程Thread-0
Thread-0结束
我是线程Thread-1
Thread-1结束
```