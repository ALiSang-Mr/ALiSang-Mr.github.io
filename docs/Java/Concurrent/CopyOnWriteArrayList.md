# JUC集合: CopyOnWriteArrayList详解

>CopyOnWriteArrayList是ArrayList 的一个线程安全的变体，其中所有可变操作(add、set 等等)都是通过对底层数组进行一次新的拷贝来实现的。COW模式的体现。

[[TOC]]

::: warning 带着问题理解
- 请先说说非并发集合中Fail-fast机制?
- 再为什么说ArrayList查询快而增删慢?
- 比ArrayList说说CopyOnWriteArrayList的增删改查实现原理? COW基于拷贝
- 再说下弱一致性的迭代器原理是怎么样的? COWIterator<E>
- CopyOnWriteArrayList为什么并发安全且性能比Vector好?
- CopyOnWriteArrayList有何缺陷，说说其应用场景?
:::

## CopyOnWriteArrayList源码分析

### 类的继承关系

CopyOnWriteArrayList实现了List接口，List接口定义了对列表的基本操作；同时实现了RandomAccess接口，表示可以随机访问(数组具有随机访问的特性)；
同时实现了Cloneable接口，表示可克隆；同时也实现了Serializable接口，表示可被序列化。

``` java
public class CopyOnWriteArrayList<E> implements List<E>, RandomAccess, Cloneable, java.io.Serializable {}
```
### 类的内部类

- COWIterator类

COWIterator表示迭代器，其也有一个Object类型的数组作为CopyOnWriteArrayList数组的快照，这种快照风格的迭代器方法在创建迭代器时使用了对当时数组状态的引用。
此数组在迭代器的生存期内不会更改，因此不可能发生冲突，并且迭代器保证不会抛出 ConcurrentModificationException。创建迭代器以后，迭代器就不会反映列表的添加、移除或者更改。
在迭代器上进行的元素更改操作(remove、set 和 add)不受支持。这些方法将抛出 UnsupportedOperationException。

### 类的属性

属性中有一个可重入锁，用来保证线程安全访问，还有一个Object类型的数组，用来存放具体的元素。当然，也使用到了反射机制和CAS来保证原子性的修改lock域。

### 类的构造函数

- 默认构造函数
``` java
public CopyOnWriteArrayList() {
    // 设置数组
    setArray(new Object[0]);
}
```
- CopyOnWriteArrayList(Collection<? extends E>)型构造函数　该构造函数用于创建一个按 collection 的迭代器返回元素的顺序包含指定 collection 元素的列表。

该构造函数的处理流程如下

- 判断传入的集合c的类型是否为CopyOnWriteArrayList类型，若是，则获取该集合类型的底层数组(Object[])，并且设置当前CopyOnWriteArrayList的数组(Object[]数组)，进入步骤③；否则，进入步骤②
- 将传入的集合转化为数组elements，判断elements的类型是否为Object[]类型(toArray方法可能不会返回Object类型的数组)，若不是，则将elements转化为Object类型的数组。进入步骤③
- 设置当前CopyOnWriteArrayList的Object[]为elements。
- **CopyOnWriteArrayList(E[])型**构造函数

该构造函数用于创建一个保存给定数组的副本的列表。
``` java
public CopyOnWriteArrayList(E[] toCopyIn) {
    // 将toCopyIn转化为Object[]类型数组，然后设置当前数组
    setArray(Arrays.copyOf(toCopyIn, toCopyIn.length, Object[].class));
}
```
### 核心函数分析

对于CopyOnWriteArrayList的函数分析，主要明白Arrays.copyOf方法即可理解CopyOnWriteArrayList其他函数的意义。

#### copyOf函数

该函数用于复制指定的数组，截取或用 null 填充(如有必要)，以使副本具有指定的长度。

``` java
public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
    @SuppressWarnings("unchecked")
    // 确定copy的类型(将newType转化为Object类型，将Object[].class转化为Object类型，判断两者是否相等，若相等，则生成指定长度的Object数组
    // 否则,生成指定长度的新类型的数组)
    T[] copy = ((Object)newType == (Object)Object[].class)
        ? (T[]) new Object[newLength]
        : (T[]) Array.newInstance(newType.getComponentType(), newLength);
    // 将original数组从下标0开始，复制长度为(original.length和newLength的较小者),复制到copy数组中(也从下标0开始)
    System.arraycopy(original, 0, copy, 0,
                        Math.min(original.length, newLength));
    return copy;
}
```

## 更深入理解

### CopyOnWriteArrayList的缺陷和使用场景

CopyOnWriteArrayList 有几个缺点：
- 由于写操作的时候，需要拷贝数组，会消耗内存，如果原数组的内容比较多的情况下，可能导致young gc或者full gc
- 不能用于实时读的场景，像拷贝数组、新增元素都需要时间，所以调用一个set操作后，读取到数据可能还是旧的,虽然CopyOnWriteArrayList 能做到最终一致性,但是还是没法满足实时性要求；

### CopyOnWriteArrayList 合适读多写少的场景，不过这类慎用

因为谁也没法保证CopyOnWriteArrayList 到底要放置多少数据，万一数据稍微有点多，每次add/set都要重新复制数组，这个代价实在太高昂了。在高性能的互联网应用中，这种操作分分钟引起故障

### CopyOnWriteArrayList为什么并发安全且性能比Vector好?

Vector对单独的add，remove等方法都是在方法上加了synchronized; 并且如果一个线程A调用size时，另一个线程B 执行了remove，然后size的值就不是最新的，
然后线程A调用remove就会越界(这时就需要再加一个Synchronized)。这样就导致有了双重锁，效率大大降低，何必呢。于是vector废弃了，要用就用CopyOnWriteArrayList 吧。
