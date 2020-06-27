# Java基础 - 知识点

> 本文主要对Java基础知识点进行总结。

#### Java 基础-知识点

[[TOC]]

## 数据类型(#title1)

### 包装类型

八个基本数据类型：

- boolean /1字节

- char /16字节

- byte /8字节

- short /16字节

- int /32字节

- long /64字节

- float /32字节

- double /64字节


基本类型都有对应的包装类型，基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成。

```java        
    Integer x = 2;     // 装箱
    
    int y = x;         // 拆箱
```
### 缓存池
new Integer(123) 与 Integer.valueOf(123) 的区别在于:

- new Integer(123) 每次都会新建一个对象
- Integer.valueOf(123) 会使用缓存池中的对象，多次调用会取得同一个对象的引用。

``` java
Integer x = new Integer(123);
Integer y = new Integer(123);
System.out.println(x == y);    // false
Integer z = Integer.valueOf(123);
Integer k = Integer.valueOf(123);
System.out.println(z == k);   // true
```
valueOf() 方法的实现比较简单，就是先判断值是否在缓存池中，如果在的话就直接返回缓存池的内容。
``` java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high)
        return IntegerCache.cache[i + (-IntegerCache.low)];
    return new Integer(i);
}
```
在 Java 8 中，Integer 缓存池的大小默认为 -128~127。
``` java
static final int low = -128;
static final int high;
static final Integer cache[];

static {
    // high value may be configured by property
    int h = 127;
    String integerCacheHighPropValue =
        sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
    if (integerCacheHighPropValue != null) {
        try {
            int i = parseInt(integerCacheHighPropValue);
            i = Math.max(i, 127);
            // Maximum array size is Integer.MAX_VALUE
            h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
        } catch( NumberFormatException nfe) {
            // If the property cannot be parsed into an int, ignore it.
        }
    }
    high = h;

    cache = new Integer[(high - low) + 1];
    int j = low;
    for(int k = 0; k < cache.length; k++)
        cache[k] = new Integer(j++);

    // range [-128, 127] must be interned (JLS7 5.1.7)
    assert IntegerCache.high >= 127;
}
```
编译器会在自动装箱过程调用 valueOf() 方法，因此多个 Integer 实例使用自动装箱来创建并且值相同，那么就会引用相同的对象。
``` java
Integer m = 123;
Integer n = 123;
System.out.println(m == n); // true
```
基本类型对应的缓冲池如下:
- boolean values true and false 
- all byte values 
- short values between -128 and 127 
- int values between -128 and 127 
- char in the range \u0000 to \u007F

## String
### 概览
String 被声明为 final，因此它不可被继承。

内部使用 char 数组存储数据，该数组被声明为 final，这意味着 value 数组初始化之后就不能再引用其它数组。
并且 String 内部没有改变 value 数组的方法，因此可以保证 String 不可变。
``` java
public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence {
    /** The value is used for character storage. */
    private final char value[];
```

### 不可变的好处
1. 可以缓存 hash 值
因为 String 的 hash 值经常被使用，例如 String 用做 HashMap 的 key。不可变的特性可以使得 hash 值也不可变，因此只需要进行一次计算。

2. String Pool (字符串常量池)的需要
如果一个 String 对象已经被创建过了，那么就会从 String Pool 中取得引用。只有 String 是不可变的，才可能使用 String Pool。

3. 安全性
String 经常作为参数，String 不可变性可以保证参数不可变。例如在作为网络连接参数的情况下如果 String 是可变的，
那么在网络连接过程中，String 被改变，改变 String 对象的那一方以为现在连接的是其它主机，而实际情况却不一定是。

4. 线程安全
String 不可变性天生具备线程安全，可以在多个线程中安全地使用。

### String, StringBuffer and StringBuilder
1. 可变性
- String 不可变
- StringBuffer 和 StringBuilder 可变

2. 线程安全
- String 不可变，因此是线程安全的
- StringBuilder 不是线程安全的
- StringBuffer 是线程安全的，内部使用 synchronized 进行同步

### String.intern()
使用 String.intern() 可以保证相同内容的字符串变量引用同一个内存对象。

如果常量池中存在当前字符串, 就会直接返回当前字符串. 如果常量池中没有此字符串, 会将此字符串放入常量池中后, 再返回

下面示例中，s1 和 s2 采用 new String() 的方式新建了两个不同对象，而 s3 是通过 s1.intern() 方法取得一个对象引用。
intern() 首先把 s1 引用的对象放到 String Pool(字符串常量池)中，然后返回这个对象引用。因此 s3 和 s1 引用的是同一个字符串常量池的对象。
``` java
String s1 = new String("aaa");
String s2 = new String("aaa");
System.out.println(s1 == s2);           // false
String s3 = s1.intern();
System.out.println(s1.intern() == s3);  // true
```
如果是采用 "bbb" 这种使用双引号的形式创建字符串实例，会自动地将新建的对象放入 String Pool 中。
``` java
String s4 = "bbb";
String s5 = "bbb";
System.out.println(s4 == s5);  // true
```
[深入理解String](https://tech.meituan.com/2014/03/06/in-depth-understanding-string-intern.html)

 ## 运算
 ### 参数传递
 
 **Java 的参数是以值传递的形式传入方法中，而不是引用传递。**
 
以下代码中 Dog dog 的 dog 是一个指针，存储的是对象的地址。在将一个参数传入一个方法时，本质上是将对象的地址以值的方式传递到形参中。
因此在方法中改变指针引用的对象，那么这两个指针此时指向的是完全不同的对象，一方改变其所指向对象的内容对另一方没有影响。
``` java
public class Dog {
    String name;

    Dog(String name) {
        this.name = name;
    }

    String getName() {
        return this.name;
    }

    void setName(String name) {
        this.name = name;
    }

    String getObjectAddress() {
        return super.toString();
    }
}
```
``` java
public class PassByValueExample {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        func(dog);
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        System.out.println(dog.getName());          // A
    }

    private static void func(Dog dog) {
        System.out.println(dog.getObjectAddress()); // Dog@4554617c
        dog = new Dog("B");
        System.out.println(dog.getObjectAddress()); // Dog@74a14482
        System.out.println(dog.getName());          // B
    }
```
但是如果在方法中改变对象的字段值会改变原对象该字段值，因为改变的是同一个地址指向的内容。
``` java
class PassByValueExample {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        func(dog);
        System.out.println(dog.getName());          // B
    }

    private static void func(Dog dog) {
        dog.setName("B");
    }
}
```
::: tip 结论
1.就 Java 语言本身来说，只有值传递，没有引用传递。

2.根据 值传递，引用传递的定义来说：
- Java 中的基本类型，属于值传递。   
- Java 中的引用类型，属于引用传递。
- Java 中的 String 及包装类，属于特殊群体，作为形参时，由于每次赋值都相当于重新创建了对象，因此看起来像值传递，
但是其特性已经破坏了，值传递、引用传递的定义。因此他们属于引用传递的定义，却表现为值传递。
:::

### float 与 double
字面量属于 double 类型，不能直接将 1.1 直接赋值给 float 变量，因为这是向下转型。Java 不能隐式执行向下转型，因为这会使得精度降低。
``` java
// float f = 1.1;
```
字面量才是 float 类型。
``` java
float f = 1.1f;
```

### 隐式类型转换
因为字面量 1 是 int 类型，它比 short 类型精度要高，因此不能隐式地将 int 类型下转型为 short 类型。
``` java
short s1 = 1;
// s1 = s1 + 1;
```
但是使用 `+=` 运算符可以执行隐式类型转换。
``` java
s1 += 1;
```
上面的语句相当于将 s1 + 1 的计算结果进行了向下转型:
``` java
s1 = (short) (s1 + 1);
```
### switch
从 Java 7 开始，可以在 switch 条件判断语句中使用 String 对象。
``` java
String s = "a";
switch (s) {
    case "a":
        System.out.println("aaa");
        break;
    case "b":
        System.out.println("bbb");
        break;
}
```
::: tip Switch case 语句执行顺序
一个case语句的表达式常量成为标记，代表一个case语句的入口。执行switch语句的流程是：

1.执行switch 括号内的表达式，表达式的值，只能为int，short，byte，char，enum类型的。

2.将表达式的值与case 语句后的表达式常量进行匹配。如果匹配成功，进入case 子句分支执行，break语句用来结束操作，跳出switch结构。

3.如果匹配不成功，查看是否有default子句，如果没有，直接结束switch结构，如果有default子句，执行default子句。

4.default语句位置可以随意放，但是执行顺序永远分支最后。

switch表达式的值决定选择哪个case分支，如果找不到相应的分支，就直接从"default"开始输出。
:::

switch 不支持 long，是因为 switch 的设计初衷是对那些只有少数的几个值进行等值判断，如果值过于复杂，那么还是用 if 比较合适。

Switch case 语句可以用来处理int，short，byte，char，（任何能转换成整型的类型）以及enum枚举类型 ，不能处理long，string类型。
``` java
// long x = 111;
// switch (x) { // Incompatible types. Found: 'long', required: 'char, byte, short, int, Character, Byte, Short, Integer, String, or an enum'
//     case 111:
//         System.out.println(111);
//         break;
//     case 222:
//         System.out.println(222);
//         break;
// }
```
## 继承
### 访问权限
>访问权限控制： 指的是本类及本类内部的成员（成员变量、成员方法、内部类）对其他类的可见性，即这些内容是否允许其他类访问。

Java 中一共有四种访问权限控制，其权限控制的大小情况是这样的：**public > protected > default(包访问权限) > private**,具体的权限控制看下面表格，
列所指定的类是否有权限允许访问行的权限控制下的内容：
访问权限|本类|本包的类|子类|非子类的外包类
---|:--:|---:|---:|---:|
public|是|是|是|是|
protected|是|是|是|否|
default|是|是|否|否|
private|是|否|否|否|

1.**public**： 所修饰的类、变量、方法，在内外包均具有访问权限；

2.**protected**： 这种权限是为继承而设计的，protected所修饰的成员，对所有子类是可访问的，但只对同包的类是可访问的，
对外包的非子类是不可以访问；

3.包访问权限（**default**）： 只对同包的类具有访问的权限，外包的所有类都不能访问；

4.**private**:私有的权限，只对本类的方法可以使用；

### 抽象类与接口
#### 1. 抽象类
抽象类和抽象方法都使用 abstract 关键字进行声明。抽象类一般会包含抽象方法，抽象方法一定位于抽象类中。

抽象类和普通类最大的区别是，抽象类不能被实例化，需要继承抽象类才能实例化其子类。
``` java
public abstract class AbstractClassExample {

    protected int x;
    private int y;

    public abstract void func1();

    public void func2() {
        System.out.println("func2");
    }
}
```
``` java
public class AbstractExtendClassExample extends AbstractClassExample {
    @Override
    public void func1() {
        System.out.println("func1");
    }
}
```
``` java
// AbstractClassExample ac1 = new AbstractClassExample(); // 'AbstractClassExample' is abstract; cannot be instantiated
AbstractClassExample ac2 = new AbstractExtendClassExample();
ac2.func1();
```
2.接口
接口是抽象类的延伸，在 Java 8 之前，它可以看成是一个完全抽象的类，也就是说它不能有任何的方法实现。

从 Java 8 开始，接口也可以拥有默认的方法实现，这是因为不支持默认方法的接口的维护成本太高了。在 Java 8 之前，如果一个接口想要添加新的方法，那么要修改所有实现了该接口的类。

接口的成员(字段 + 方法)默认都是 public 的，并且不允许定义为 private 或者 protected。

接口的字段默认都是 static 和 final 的。

3. 比较
- 抽象类和接口的对比
抽象类是用来捕捉子类的通用特性的。接口是抽象方法的集合。

从设计层面来说，抽象类是对类的抽象，是一种模板设计，接口是行为的抽象，是一种行为的规范。

- 相同点
接口和抽象类都不能实例化

都位于继承的顶端，用于被其他实现或继承

都包含抽象方法，其子类都必须覆写这些抽象方法

- 不同点

参数|抽象类|接口|
---|:--:|---:|
声明|抽象类使用abstract关键字声明|接口使用interface关键字声明|
实现|子类使用extends关键字来继承抽象类。如果子类不是抽象类的话，它需要提供抽象类中所有声明的方法的实现|子类使用implements关键字来实现接口。它需要提供接口中所有声明的方法的实现|
构造器|抽象类可以有构造器|接口不能有构造器|
访问修饰符|	抽象类中的方法可以是任意访问修饰符|接口方法默认修饰符是abstract的；可以是public的，也可以是friendly的。并且不允许定义为 private 或者 protected|
多继承|一个类最多只能继承一个抽象类|一个类可以实现多个接口|
字段声明|抽象类的字段声明可以是任意的|接口的字段默认都是 static 和 final 的|

接口和抽象类各有优缺点，在接口和抽象类的选择上，必须遵守这样一个原则：

    行为模型应该总是通过接口而不是抽象类定义，所以通常是优先选用接口，尽量少用抽象类。
    选择抽象类的时候通常是如下情况：需要定义子类的行为，又要为子类提供通用的功能。

4.使用选择

**使用接口**:
- 需要让不相关的类都实现一个方法，例如不相关的类都可以实现 Comparable 接口中的 compareTo() 方法；

- 需要使用多重继承。

**使用抽象类**:
- 需要在几个相关的类中共享代码。

- 需要能控制继承来的成员的访问权限，而不是都为 public。

- 需要继承非静态和非常量字段。

在很多情况下，接口优先于抽象类，因为接口没有抽象类严格的类层次结构要求，可以灵活地为一个类添加行为。并且从 Java 8 开始，
接口也可以有默认的方法实现，使得修改接口的成本也变的很低。

### super
- 访问父类的构造函数: 可以使用 super() 函数访问父类的构造函数，从而委托父类完成一些初始化的工作。
- 访问父类的成员: 如果子类重写了父类的中某个方法的实现，可以通过使用 super 关键字来引用父类的方法实现。
``` java
public class SuperExample {
    protected int x;
    protected int y;

    public SuperExample(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public void func() {
        System.out.println("SuperExample.func()");
    }
}
```
``` java
public class SuperExtendExample extends SuperExample {
    private int z;

    public SuperExtendExample(int x, int y, int z) {
        super(x, y);
        this.z = z;
    }

    @Override
    public void func() {
        super.func();
        System.out.println("SuperExtendExample.func()");
    }
}
```
``` java
SuperExample e = new SuperExtendExample(1, 2, 3);
e.func();
```
``` java
SuperExample.func()
SuperExtendExample.func()
```
## 重写与重载
### 1. 重写(Override)
存在于继承体系中，指子类实现了一个与父类在方法声明上完全相同的一个方法。

为了满足里式替换原则，重写也有以下两个限制:
- 子类方法的访问权限必须大于等于父类方法
- 子类方法的返回类型必须是父类方法返回类型或为其子类型。

使用 @Override 注解，可以让编译器帮忙检查是否满足上面的两个限制条件。

### 2. 重载(Overload)

存在于同一个类中，指一个方法与已经存在的方法名称上相同，但是参数类型、个数、顺序至少有一个不同。

应该注意的是，返回值不同，其它都相同不算是重载。

::: warning 比较
方法的重载和重写都是实现多态的方式，区别在于前者实现的是编译时的多态性，而后者实现的是运行时的多态性。

重载：发生在同一个类中，方法名相同参数列表不同（参数类型不同、个数不同、顺序不同），与方法返回值和访问修饰符无关，
即重载的方法不能根据返回类型进行区分

重写：发生在父子类中，方法名、参数列表必须相同，返回值小于等于父类，抛出的异常小于等于父类，访问修饰符大于等于父类（里氏代换原则）；
如果父类方法访问修饰符为private则子类中就不能重写。
:::

## Object 通用方法

### 概览
``` java
public final native Class<?> getClass()

public native int hashCode()

public boolean equals(Object obj)

protected native Object clone() throws CloneNotSupportedException

public String toString()

public final native void notify()

public final native void notifyAll()

public final native void wait(long timeout) throws InterruptedException

public final void wait(long timeout, int nanos) throws InterruptedException

public final void wait() throws InterruptedException

protected void finalize() throws Throwable {}
```
### equals()
(一)自反性
``` java
x.equals(x); // true
```
(二)对称性
``` java
x.equals(y) == y.equals(x); // true
```
(三)传递性
``` java
if (x.equals(y) && y.equals(z))
    x.equals(z); // true;
```
(四)一致性
多次调用 equals() 方法结果不变
``` java
x.equals(y) == x.equals(y); // true
```
(五)与 null 的比较
对任何是 null 的对象 x 调用 x.equals(null) 结果都为 false
``` java
x.equals(null); // false;
```
2. equals() 与 ==
- 对于基本类型，== 判断两个值是否相等，基本类型没有 equals() 方法。
- 对于引用类型，== 判断两个变量是否引用同一个对象，而 equals() 判断引用的对象是否等价。引用数据类型 == 比较的是内存地址
``` java
public class test1 {
    public static void main(String[] args) {
        String a = new String("ab"); // a 为一个引用
        String b = new String("ab"); // b为另一个引用,对象的内容一样
        String aa = "ab"; // 放在常量池中
        String bb = "ab"; // 从常量池中查找
        if (aa == bb) // true
            System.out.println("aa==bb");
        if (a == b) // false，非同一对象
            System.out.println("a==b");
        if (a.equals(b)) // true
            System.out.println("aEQb");
        if (42 == 42.0) { // true
            System.out.println("true");
        }
    }
}
```
**说明**：
- String中的equals方法是被重写过的，因为object的equals方法是比较的对象的内存地址，而String的equals方法比较的是对象的值。

- 当创建String类型的对象时，虚拟机会在常量池中查找有没有已经存在的值和要创建的值相同的对象，如果有就把它赋给当前引用。
如果没有就在常量池中重新创建一个String对象。

### 3. 实现
- 检查是否为同一个对象的引用，如果是直接返回 true；
- 检查是否是同一个类型，如果不是，直接返回 false；
- 将 Object 对象进行转型；
- 判断每个关键域是否相等。
``` java
public class EqualExample {
    private int x;
    private int y;
    private int z;

    public EqualExample(int x, int y, int z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EqualExample that = (EqualExample) o;

        if (x != that.x) return false;
        if (y != that.y) return false;
        return z == that.z;
    }
}
```
### hashCode()
HashSet如何检查重复

`两个对象的 hashCode() 相同，则 equals() 也一定为 true，对吗？`

hashCode和equals方法的关系

`面试官可能会问你：“你重写过 hashcode 和 equals 么，为什么重写equals时必须重写hashCode方法？”`

**hashCode()介绍**
每个对象都有hashcode，对象的hashcode怎么得来的呢？

首先一个对象肯定有物理地址，在别的博文中会hashcode说成是代表对象的地址，这里肯定会让读者形成误区，对象的物理地址跟这个hashcode地址不一样，
**hashcode代表对象的地址说的是对象在hash表中的位置，物理地址说的对象存放在内存中的地址**，那么对象如何得到hashcode呢？

通过对象的内部地址(也就是物理地址)转换成一个整数，然后该整数通过hash函数的算法就得到了hashcode。
**所以，hashcode是什么呢？就是在hash表中对应的位置。**

::: tip hashCode() 的作用
**HashCode的存在主要是为了查找的快捷性，HashCode是用来在散列存储结构中确定对象的存储地址的(后半句说的用hashcode来代表对象就是在hash表中的位置)**

为什么hashcode就查找的更快，比如：我们有一个能存放1000个数这样大的内存中，在其中要存放1000个不一样的数字，用最笨的方法，
就是存一个数字，就遍历一遍，看有没有相同得数，当存了900个数字，开始存901个数字的时候，就需要跟900个数字进行对比，这样就很麻烦，
很是消耗时间，用hashcode来记录对象的位置，来看一下。

hash表中有1、2、3、4、5、6、7、8个位置，存第一个数，hashcode为1，该数就放在hash表中1的位置，存到100个数字，hash表中8个位置会有很多数字了，
1中可能有20个数字，存101个数字时，他先查hashcode值对应的位置，假设为1，那么就有20个数字和他的hashcode相同，他只需要跟这20个数字相比较(equals)，
如果每一个相同，那么就放在1这个位置，这样比较的次数就少了很多，实际上hash表中有很多位置，这里只是举例只有8个，所以比较的次数会让你觉得也挺多的，
实际上，如果hash表很大，那么比较的次数就很少很少了。

:::
hashCode() 的作用是获取哈希码，也称为散列码；它实际上是返回一个int整数。这个哈希码的作用是确定该对象在哈希表中的索引位置。hashCode() 定义在JDK的Object.java中，
这就意味着Java中的任何类都包含有hashCode()函数。

散列表存储的是键值对(key-value)，它的特点是：能根据“键”快速的检索出对应的“值”。这其中就利用到了散列码！（可以快速找到所需要的对象）

::: tip equals方法和hashcode的关系
通过前面这个例子，大概可以知道，先通过hashcode来比较，如果hashcode相等，那么就用equals方法来比较两个对象是否相等。

用个例子说明：上面说的hash表中的8个位置，就好比8个桶，每个桶里能装很多的对象，对象A通过hash函数算法得到将它放到1号桶中，当然肯定有别的对象也会放到1号桶中，
如果对象B也通过算法分到了1号桶，那么它如何识别桶中其他对象是否和它一样呢，这时候就需要equals方法来进行筛选了。

- **如果两个对象equals相等，那么这两个对象的HashCode一定也相同**

- **如果两个对象的HashCode相同，不代表两个对象就相同，只能说明这两个对象在散列存储结构中，存放于同一个位置**
:::
为什么要有 hashCode

我们以“HashSet 如何检查重复”为例子来说明为什么要有 hashCode：

当你把对象加入 HashSet 时，HashSet 会先计算对象的 hashcode 值来判断对象加入的位置，同时也会与其他已经加入的对象的 hashcode 值作比较，
如果没有相符的hashcode，HashSet会假设对象没有重复出现。但是如果发现有相同 hashcode 值的对象，这时会调用 equals()方法来检查 hashcode 
相等的对象是否真的相同。如果两者相同，HashSet 就不会让其加入操作成功。如果不同的话，就会重新散列到其他位置。
（摘自我的Java启蒙书《Head first java》第二版）。这样我们就大大减少了 equals 的次数，相应就大大提高了执行速度。

hashCode()与equals()的相关规定

如果两个对象相等，则hashcode一定也是相同的

两个对象相等，对两个对象分别调用equals方法都返回true

两个对象有相同的hashcode值，它们也不一定是相等的

因此，equals 方法被覆盖过，则 hashCode 方法也必须被覆盖

hashCode() 的默认行为是对堆上的对象产生独特值。如果没有重写 hashCode()，则该 class 的两个对象无论如何都不会相等（即使这两个对象指向相同的数据）

