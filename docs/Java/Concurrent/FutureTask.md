## JUC线程池: FutureTask详解

>Future 表示了一个任务的生命周期，是一个可取消的异步运算，可以把它看作是一个异步操作的结果的占位符，它将在未来的某个时刻完成，
>并提供对其结果的访问。在并发包中许多**异步任务类**都继承自Future，其中最典型的就是 FutureTask

[[TOC]]

::: warning 带着问题理解
- FutureTask用来解决什么问题的? 为什么会出现? 
- FutureTask类结构关系怎么样的? 
- FutureTask的线程安全是由什么保证的? 
- FutureTask结果返回机制? 
- FutureTask内部运行状态的转变? 
- FutureTask通常会怎么用? 举例说明。
:::

## FutureTask简介

FutureTask 为 Future 提供了基础实现，如获取任务执行结果(get)和取消任务(cancel)等。如果任务尚未完成，获取任务执行结果时将会阻塞。一旦执行结束，
任务就不能被重启或取消(除非使用runAndReset执行计算)。FutureTask 常用来封装 Callable 和 Runnable，也可以作为一个任务提交到线程池中执行。除了作为一个独立的类之外，
此类也提供了一些功能性函数供我们创建自定义 task 类使用。FutureTask 的线程安全由CAS来保证。

## FutureTask类关系

![FutureTask类关系](../img/futureTask_001.png "FutureTask类关系")

可以看到,FutureTask实现了RunnableFuture接口，则RunnableFuture接口继承了Runnable接口和Future接口，所以FutureTask既能当做一个Runnable直接被Thread执行，
也能作为Future用来得到Callable的计算结果。

::: tips  函数式接口 @FunctionalInterface

所谓函数式接口，当然首先是一个接口，然后就是在这个接口里面只能有一个抽象方法。

这种类型的接口也称为SAM接口，即Single Abstract Method interfaces

Runnable 和 Callable 都是函数式接口

特点：

- 接口有且仅有一个抽象方法
- 允许定义静态方法
- 允许定义默认方法
- 允许java.lang.Object中的public方法
- 该注解不是必须的，如果一个接口符合"函数式接口"定义，那么加不加该注解都没有影响。加上该注解能够更好地让编译器进行检查。如果编写的不是函数式接口，
但是加上了@FunctionInterface，那么编译器会报错

:::

## FutureTask源码解析

### Callable接口

Callable是个泛型接口，泛型V就是要call()方法返回的类型。对比Runnable接口，Runnable不会返回数据也不能抛出异常。

``` java
public interface Callable<V> {
    /**
     * Computes a result, or throws an exception if unable to do so.
     *
     * @return computed result
     * @throws Exception if unable to compute a result
     */
    V call() throws Exception;
}
```
### Future接口

Future接口代表异步计算的结果，通过Future接口提供的方法可以查看异步计算是否执行完成，或者等待执行结果并获取执行结果，
同时还可以取消执行。Future接口的定义如下:

``` java
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);
    boolean isCancelled();
    boolean isDone();
    V get() throws InterruptedException, ExecutionException;
    V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException;
}
```
**cancel()**:cancel()方法用来取消异步任务的执行。如果异步任务已经完成或者已经被取消，或者由于某些原因不能取消，
则会返回false。如果任务还没有被执行，则会返回true并且异步任务不会被执行。如果任务已经开始执行了但是还没有执行完成，
若mayInterruptIfRunning为true，则会立即中断执行任务的线程并返回true，若mayInterruptIfRunning为false，
则会返回true且不会中断任务执行线程。
**isCanceled()**:判断任务是否被取消，如果任务在结束(正常执行结束或者执行异常结束)前被取消则返回true，否则返回false。
**isDone()**:判断任务是否已经完成，如果完成则返回true，否则返回false。需要注意的是：任务执行过程中发生异常、
任务被取消也属于任务已完成，也会返回true。
**get()**:获取任务执行结果，如果任务还没完成则会阻塞等待直到任务执行完成。如果任务被取消则会抛出CancellationException异常，
如果任务执行过程发生异常则会抛出ExecutionException异常，如果阻塞等待过程中被中断则会抛出InterruptedException异常。
**get(long timeout,Timeunit unit)**:带超时时间的get()版本，如果阻塞等待过程中超时则会抛出TimeoutException异常。

### 核心属性

``` java
//内部持有的callable任务，运行完毕后置空
private Callable<V> callable;

//从get()中返回的结果或抛出的异常
private Object outcome; // non-volatile, protected by state reads/writes

//运行callable的线程
private volatile Thread runner;

//使用Treiber栈保存等待线程
private volatile WaitNode waiters;

//任务状态
private volatile int state;
private static final int NEW          = 0;
private static final int COMPLETING   = 1;
private static final int NORMAL       = 2;
private static final int EXCEPTIONAL  = 3;
private static final int CANCELLED    = 4;
private static final int INTERRUPTING = 5;
private static final int INTERRUPTED  = 6;
```
**其中需要注意的是state是volatile类型的，也就是说只要有任何一个线程修改了这个变量，那么其他所有的线程都会知道最新的值**。7种状态具体表示：

**NEW**:表示是个新的任务或者还没被执行完的任务。这是初始状态。
**COMPLETING**:任务已经执行完成或者执行任务的时候发生异常，但是任务执行结果或者异常原因还没有保存到outcome字段
(outcome字段用来保存任务执行结果，如果发生异常，则用来保存异常原因)的时候，状态会从NEW变更到COMPLETING。
但是这个状态会时间会比较短，属于中间状态。 
**NORMAL**:任务已经执行完成并且任务执行结果已经保存到outcome字段，状态会从COMPLETING转换到NORMAL。这是一个最终态。 
**EXCEPTIONAL**:任务执行发生异常并且异常原因已经保存到outcome字段中后，状态会从COMPLETING转换到EXCEPTIONAL。
这是一个最终态。 CANCELLED:任务还没开始执行或者已经开始执行但是还没有执行完成的时候，用户调用了cancel(false)方法
取消任务且不中断任务执行线程，这个时候状态会从NEW转化为CANCELLED状态。这是一个最终态。 
**INTERRUPTING**: 任务还没开始执行或者已经执行但是还没有执行完成的时候，用户调用了cancel(true)方法取消任务并且要中断
任务执行线程但是还没有中断任务执行线程之前，状态会从NEW转化为INTERRUPTING。这是一个中间状态。 
**INTERRUPTED**:调用interrupt()中断任务执行线程之后状态会从INTERRUPTING转换到INTERRUPTED。这是一个最终态。
有一点需要注意的是，所有值大于COMPLETING的状态都表示任务已经执行完成(任务正常执行完成，任务执行异常或者任务被取消)。 

各个状态之间的可能转换关系如下图所示:

![各个状态之间的可能转换关系](../img/futureTask_002.png "各个状态之间的可能转换关系")


## FutureTask示例

常用使用方式：

- 第一种方式:Future + ExecutorService
- 第二种方式: FutureTask + ExecutorService
- 第三种方式:FutureTask + Thread

### Future使用示例

``` java
public class MyFutureDemo {

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService pool = Executors.newCachedThreadPool();
        Future<String> future = pool.submit(new Callable<String>() {
            @Override
            public String call() throws Exception {
                System.err.println("callable execute ...");
                Thread.sleep(5000);
                return "done";
            }
        });

        System.err.println("execute something in main ...");
        Thread.sleep(1000);
        System.err.println("future is done ? {}" + future.isDone());
        System.err.println("cancle: {}" + future.cancel(true));
        System.err.println("result: {}" + future.get());
        System.err.println("future is done ? {}" + future.isDone());
        System.err.println("pool is Shutdown ? {}" + pool.isShutdown());
        pool.shutdown();

    }
}
```
### FutureTask使用示例

``` java
public class MyFutureTaskDemo {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        ExecutorService threadPool = Executors.newCachedThreadPool();
        FutureTask<String> futureTask = new FutureTask<String>(new Callable() {
            @Override
            public Object call() throws Exception {
                System.err.println("callable execute ...");
                Thread.sleep(5000);
                return "done";
            }
        });

        threadPool.submit(futureTask);
        System.err.println("execute something in main ...");
        Thread.sleep(1000);
        System.err.println("future is done ? {}" + futureTask.isDone());
        System.err.println("result: {}" + futureTask.get());
        System.err.println("future is done ? {}" + futureTask.isDone());
    }
}
```



