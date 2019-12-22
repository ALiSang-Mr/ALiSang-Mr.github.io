# 按照一定规则过滤集合中的元素

> 在JDK1.8中，Collection以及其子类新加入了**removeIf**方法，作用是按照一定规则过滤集合中的元素。

## Collection的removeIf方法过滤

首先设想一个场景，你是公司某个岗位的HR，收到了大量的简历，为了节约时间，现需按照一点规则过滤一下这些简历。
比如这个岗位是低端岗位，只招30岁以下的求职者。

``` java
//求职者的实体类
public class Person {
    private String name;//姓名
    private Integer age;//年龄
    private String gender;//性别

    ...
    //省略构造方法和getter、setter方法
    ...

    //重写toString，方便观看结果
    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                '}';
    }
}
```

该Person类只有三个成员属性，分别是姓名name，年龄age和性别gender。现要过滤age大于等于30的求职者。
下面是不用removeIf，而是使用Iterator的传统写法：

``` java
Collection<Person> collection = new ArrayList();
collection.add(new Person("张三", 22, "男"));
collection.add(new Person("李四", 19, "女"));
collection.add(new Person("王五", 34, "男"));
collection.add(new Person("赵六", 30, "男"));
collection.add(new Person("田七", 25, "女"));
//过滤30岁以上的求职者
Iterator<Person> iterator = collection.iterator();
while (iterator.hasNext()) {
    Person person = iterator.next();
    if (person.getAge() >= 30)
        iterator.remove();
}
System.out.println(collection.toString());//查看结果
```
下面再看看使用removeIf的写法：
``` java
Collection<Person> collection = new ArrayList();
collection.add(new Person("张三", 22, "男"));
collection.add(new Person("李四", 19, "女"));
collection.add(new Person("王五", 34, "男"));
collection.add(new Person("赵六", 30, "男"));
collection.add(new Person("田七", 25, "女"));


collection.removeIf(
    person -> person.getAge() >= 30
);//过滤30岁以上的求职者

System.out.println(collection.toString());//查看结果
```
通过removeIf和lambda表达式改写，原本6行的代码瞬间变成了一行！
运行结果：
``` markdown
[Person{name=’张三’, age=22, gender=’男’}, Person{name=’李四’, age=19, gender=’女’}, Person{name=’田七’, age=25, gender=’女’}]
Process finished with exit code 0
```
30岁以上的王五和赵六都被过滤掉了。

当然，如果对lambda表达式不熟悉的话，也可以使用不用lambda的removeIf，代码如下：

``` java
Collection<Person> collection = new ArrayList();
collection.add(new Person("张三", 22, "男"));
collection.add(new Person("李四", 19, "女"));
collection.add(new Person("王五", 34, "男"));
collection.add(new Person("赵六", 30, "男"));
collection.add(new Person("田七", 25, "女"));

collection.removeIf(new Predicate<Person>() {
    @Override
    public boolean test(Person person) {
        return person.getAge()>=30;//过滤30岁以上的求职者
    }
});

System.out.println(collection.toString());//查看结果
```
效果和用lambda一样，只不过代码量多了一些。

## Stream类filter方法过滤

使用Stream的filter进行过滤，只保留男性的操作：

``` java
Collection<Person> collection = new ArrayList();
collection.add(new Person("张三", 22, "男"));
collection.add(new Person("李四", 19, "女"));
collection.add(new Person("王五", 34, "男"));
collection.add(new Person("赵六", 30, "男"));
collection.add(new Person("田七", 25, "女"));

Stream<Person> personStream = collection.stream().filter(new Predicate<Person>() {
    @Override
    public boolean test(Person person) {
         return "男".equals(person.getGender());//只保留男性
    }
});

collection = personStream.collect(Collectors.toList());//将Stream转化为List
System.out.println(collection.toString());//查看结果
```
运行结果如下：

``` markdown
[Person{name=’张三’, age=22, gender=’男’}, Person{name=’王五’, age=34, gender=’男’}, Person{name=’赵六’, age=30, gender=’男’}]
Process finished with exit code 0
```

上面的demo没有使用lambda表达式，下面的demo使用lambda来进一步精简代码：

``` java
Collection<Person> collection = new ArrayList();
collection.add(new Person("张三", 22, "男"));
collection.add(new Person("李四", 19, "女"));
collection.add(new Person("王五", 34, "男"));
collection.add(new Person("赵六", 30, "男"));
collection.add(new Person("田七", 25, "女"));

Stream<Person> personStream = collection.stream().filter(
        person -> "男".equals(person.getGender())//只保留男性
);

collection = personStream.collect(Collectors.toList());//将Stream转化为List
System.out.println(collection.toString());//查看结果
```
效果和不用lambda是一样的。

::: danger
不过在使用filter时不要和removeIf弄混淆了:

- removeIf中的test方法返回true代表当前元素会被过滤掉;

- filter中的test方法返回true代表当前元素会保留下来。
:::