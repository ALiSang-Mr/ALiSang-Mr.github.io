# BigDecimal详解和问题
>和BigInteger类似，BigDecimal可以表示一个任意大小且精度完全准确的浮点数。

[[TOC]]

## 背景

在实际开发中，对于 **不需要任何准确计算精度的属性可以直接使用float或double**，但是如果需要精确计算结果，则必须使用BigDecimal，例如价格、质量。

为什么这么说，主要有两点

1. **double计算会有精度丢失问题**

2. **在除法运算时，BigDecimal提供了丰富的取舍规则。(double虽然可以通过NumberFormat进行四舍五入，但是NumberFormat是线程不安全的)**

对于精度问题我们可以看下实际的例子
``` java
public static void main(String[] args) {
    //正常 3.3
    System.out.println("加法结果："+(1.1+2.2));
    //正常 -7.9
    System.out.println("减法结果："+(2.2-10.1));
    //正常 2.42
    System.out.println("乘法结果："+(1.1*2.2));
    //正常 0.44
    System.out.println("除法结果："+(4.4/10));
}
```
**控制台实际输出**
``` java
加法结果：3.3000000000000003
减法结果：-7.8999999999999995
乘法结果：2.4200000000000004
除法结果：0.44000000000000006
```
`为什么会是这样？`

**在于我们的计算机是二进制的。浮点数没有办法是用二进制进行精确表示**。我们的CPU表示浮点数由两个部分组成：`指数和尾数`,这样的表示方法一般都会                                                              
失去一定的精确度，有些浮点数运算也会产生一定的误差。如：2.4的二进制表示并非就是精确的2.4。反而最为接近的二进制表示是 2.3999999999999999。                                                               
浮点数的值实际上是由一个特定的数学公式计算得到的。

## BigDecimal构造函数 
### 1、四种构造函数
``` java
BigDecimal(int)     //创建一个具有参数所指定整数值的对象。
BigDecimal(double)  //创建一个具有参数所指定双精度值的对象。
BigDecimal(long)    //创建一个具有参数所指定长整数值的对象。
BigDecimal(String)  //创建一个具有参数所指定以字符串表示的数值的对象。
```
这几个都是常用的构造器，他们返回的对象都是BigDecimal对象。换而言之，将BigDecimal对象转换为其他类型的对象，我们通过以下几种。
``` java
toString()          //将BigDecimal对象的数值转换成字符串。
doubleValue()       //将BigDecimal对象中的值以双精度数返回。
floatValue()        //将BigDecimal对象中的值以单精度数返回。
longValue()         //将BigDecimal对象中的值以长整数返回。
intValue()          //将BigDecimal对象中的值以整数返回。
```
::: warning 注意
这里需要非常注意BigDecimal(double)的构造函数，也是会存在精度丢失的问题,其它的不会，这里也可以举例说明
``` java
    BigDecimal intDecimal = new BigDecimal(10);
    BigDecimal doubleDecimal = new BigDecimal(4.3);
    BigDecimal longDecimal = new BigDecimal(10L);
    BigDecimal stringDecimal = new BigDecimal("4.3");
    System.out.println("intDecimal=" + intDecimal);
    System.out.println("doubleDecimal=" + doubleDecimal);
    System.out.println("longDecimal=" + longDecimal);
    System.out.println("stringDecimal=" + stringDecimal);
```
**控制台实际输出**
``` java
intDecimal=10
doubleDecimal=4.29999999999999982236431605997495353221893310546875
longDecimal=10
stringDecimal=4.3
```
:::
从图中很明显可以看出，**对于double的构造函数是会存在精度丢失的可能的**。

### 2、为什么会出现这种情况
这个在new BigDecimal(double)类型的构造函数上的注解有解释说明。

这个构造函数的结果可能有些不可预测。 可以假设在Java中写入new BigDecimal(0.1)创建一个BigDecimal ，它完全等于0.1（非标尺值为1，比例为1），但实际上等于
0.1000000000000000055511151231257827021181583404541015625。 这是因为0.1不能像double （或者作为任何有限长度的二进制分数）精确地表示。
因此，正在被传递给构造的值不是正好等于0.1。

### 3、如何解决
有两种常用的解决办法。
1. 是将double 通过Double.toString(double)先转为String，然后放入BigDecimal的String构造函数中。

2. 不通过BigDecimal的构造函数，而是通过它的静态方法BigDecimal.valueOf(double),也同样不会丢失精度。
==示例==
<font color=#00ffff size=3>null</font>
``` java
public static void main(String[] args) {
    String string = Double.toString(4.3);
    BigDecimal stringBigDecimal = new BigDecimal(string);
    BigDecimal bigDecimal = BigDecimal.valueOf(4.3);
    System.out.println("stringBigDecimal = " + stringBigDecimal);
    System.out.println("bigDecimal = " + bigDecimal);
}
```
**控制台实际输出**
``` java
stringBigDecimal = 4.3
bigDecimal = 4.3
```
这样也能保证，对与double而言，转BigDecimal不会出现精度丢失的情况。

## 常用方法
### 1. 常用方法
``` java
public static void main(String[] args) {
        BigDecimal a = new BigDecimal("4.5");
        BigDecimal b = new BigDecimal("1.5");
        BigDecimal c = new BigDecimal("-10.5");

        BigDecimal add_result = a.add(b);
        BigDecimal subtract_result = a.subtract(b);
        BigDecimal multiply_result = a.multiply(b);
        BigDecimal divide_result = a.divide(b);
        BigDecimal remainder_result = a.remainder(b);
        BigDecimal max_result = a.max(b);
        BigDecimal min_result = a.min(b);
        BigDecimal abs_result = c.abs();
        BigDecimal negate_result = a.negate();

        System.out.println("4.5+1.5=" + add_result);
        System.out.println("4.5-1.5=" + subtract_result);
        System.out.println("4.5*1.5=" + multiply_result);
        System.out.println("4.5/1.5=" + divide_result);
        System.out.println("4.5/1.5余数=" + remainder_result);
        System.out.println("4.5和1.5最大数=" + max_result);
        System.out.println("4.5和1.5最小数=" + min_result);
        System.out.println("-10.5的绝对值=" + abs_result);
        System.out.println("4.5的相反数=" + negate_result);
    }
```
**控制台实际输出**
``` java
4.5+1.5=6.0
4.5-1.5=3.0
4.5*1.5=6.75
4.5/1.5=3
4.5/1.5余数=0.0
4.5和1.5最大数=4.5
4.5和1.5最小数=1.5
-10.5的绝对值=10.5
4.5的相反数=-4.5
```
这里把`除法`单独再讲一下,因为除法操作的时候会有除不尽的情况，，比如 3,5/3，这时会报错java.lang.ArithmeticException: Non-terminating decimal expansion;
no exact representable decimal result。所以这里要考虑除不尽的情况下，保留几位小数,取舍规则。（除法如果可能存在除不进，那就用下面方法）

``` java
BigDecimal divide(BigDecimal divisor, int scale, int roundingMode) //第一参数表示除数，第二个参数表示小数点后保留位数，第三个参数表示取舍规则。
```
### scale()
BigDecimal用scale()表示小数的位数，例如：
``` java
BigDecimal d1 = new BigDecimal("123.45");
BigDecimal d2 = new BigDecimal("123.4500");
BigDecimal d3 = new BigDecimal("1234500");
System.out.println(d1.scale()); // 2,两位小数
System.out.println(d2.scale()); // 4
System.out.println(d3.scale()); // 0
```
**控制台实际输出**
``` java
2
4
0
```
如果一个`BigDecimal`的`scale()`返回负数，例如，-2，表示这个数是个整数，并且末尾有2个0。
可以对一个`BigDecimal`设置它的`scale`，如果精度比原始值低，那么按照指定的方法进行四舍五入或者直接截断：
``` java
BigDecimal d1 = new BigDecimal("123.456789");
BigDecimal d2 = d1.setScale(4, RoundingMode.HALF_UP); // 四舍五入，123.4568
BigDecimal d3 = d1.setScale(4, RoundingMode.DOWN); // 直接截断，123.4567
System.out.println(d2);
System.out.println(d3);
```

### stripTrailingZeros()
``` java
BigDecimal d1 = new BigDecimal("123.4500");
BigDecimal d2 = d1.stripTrailingZeros();
System.out.println(d1.scale()); // 4
System.out.println(d2.scale()); // 2,因为去掉了00
```
**控制台实际输出**
``` java
4
2
```
### divideAndRemainder()
还可以对BigDecimal做除法的同时求余数：
``` java
BigDecimal n = new BigDecimal("12.345");
BigDecimal m = new BigDecimal("0.12");
BigDecimal[] dr = n.divideAndRemainder(m);
System.out.println(dr[0]); // 102
System.out.println(dr[1]); // 0.105
```
调用divideAndRemainder()方法时，返回的数组包含两个BigDecimal，分别是商和余数，其中商总是整数，余数不会大于除数。
我们可以利用这个方法判断两个BigDecimal是否是整数倍数

**控制台实际输出**
``` java
123.4568
123.4567
```

### 2、比较BigDecimal
在比较两个BigDecimal的值是否相等时，要特别注意，使用equals()方法不但要求两个BigDecimal的值相等，还要求它们的scale()相等：
``` java
BigDecimal d1 = new BigDecimal("123.456");
BigDecimal d2 = new BigDecimal("123.45600");
System.out.println(d1.equals(d2)); // false,因为scale不同
System.out.println(d1.equals(d2.stripTrailingZeros())); // true,因为d2去除尾部0后scale变为2
System.out.println(d1.compareTo(d2)); // 0
```
**控制台实际输出**
``` java
false // false,因为scale不同
true // true,因为d2去除尾部0后scale变为2
0
```
必须使用compareTo()方法来比较，它根据两个值的大小分别返回负数、正数和0，分别表示小于、大于和等于。
**一般使用compareTo()比较两个BigDecimal的值，不要使用equals()！**

如果查看`BigDecimal`的源码，可以发现，实际上一个`BigDecimal`是通过一个`BigInteger`和一个`scale`来表示的，即`BigInteger`表示一个完整的整数，
而`scale`表示小数位数：

``` java
public class BigDecimal extends Number implements Comparable<BigDecimal> {
    private final BigInteger intVal;
    private final int scale;
}
```
BigDecimal也是从Number继承的，也是不可变对象。

::: tips 小结
`BigDecimal`用于表示精确的小数，常用于财务计算；

比较`BigDecimal`的值是否相等，必须使用`compareTo()`而不能使用`equals()`。
:::

### 3、取舍规则
``` java
ROUND_UP          //不管保留数字后面是大是小(0除外)都会进1
ROUND_DOWN        //保留设置数字，后面所有直接去除
ROUND_HALF_UP     //常用的四舍五入 
ROUND_HALF_DOWN   //五舍六入
ROUND_CEILING     //向正无穷方向舍入
ROUND_FLOOR       //向负无穷方向舍入
ROUND_HALF_EVEN   //向（距离）最近的一边舍入，除非两边（的距离）是相等,如果是这样，如果保留位数是奇数，使用ROUND_HALF_UP，如果是偶数，使用ROUND_HALF_DOWN
ROUND_UNNECESSARY //计算结果是精确的，不需要舍入模式 
```
**`注意`** 我们最常用的应该是 ROUND_HALF_UP(四舍五入)
上面这样解释还是有点模糊,具体可以看这篇文章，示例非常清楚 [BigDecimal的四舍五入的RoundingMode 选择](https://blog.csdn.net/well386/article/details/53945796)

这里举几个常用的取舍规则
``` java
public static void main(String[] args) {
        BigDecimal a = new BigDecimal("1.15");
        BigDecimal b = new BigDecimal("1");

        //不管保留数字后面是大是小(0除外)都会进1 所以这里输出为1.2
        BigDecimal divide_1 = a.divide(b,1,BigDecimal.ROUND_UP);
        //保留设置数字，后面所有直接去除         所以这里输出为1.1
        BigDecimal divide_2 = a.divide(b,1,BigDecimal.ROUND_DOWN);
        //常用的四舍五入         所以这里输出1.2
        BigDecimal divide_3 = a.divide(b,1,BigDecimal.ROUND_HALF_UP);
        //这个可以理解成五舍六入   所以这里输出1.1
        BigDecimal divide_4 = a.divide(b,1,BigDecimal.ROUND_HALF_DOWN);
        //这里将1.15改成1.16
        BigDecimal c = new BigDecimal("1.16");
        //那么这里就符合六入了 所以输出变为1.2
        BigDecimal divide_5 = c.divide(b,1,BigDecimal.ROUND_HALF_DOWN);
        System.out.println("divide_1 = " + divide_1);
        System.out.println("divide_2 = " + divide_2);
        System.out.println("divide_3 = " + divide_3);
        System.out.println("divide_4 = " + divide_4);
        System.out.println("divide_5 = " + divide_5);
    }
```
**控制台实际输出**
``` java
divide_1 = 1.2
divide_2 = 1.1
divide_3 = 1.2
divide_4 = 1.1
divide_5 = 1.2
```
## 参考文章
- https://www.cnblogs.com/qdhxhz/p/13419493.html
- https://www.liaoxuefeng.com/wiki/1252599548343744/1279768011997217
