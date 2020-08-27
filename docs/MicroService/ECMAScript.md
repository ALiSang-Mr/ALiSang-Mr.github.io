# ES6
>ECMAScript6.0（以下简称ES6，ECMAScript是一种由Ecma国际通过ECMA-262标准化的脚本），是JavaScript语言的下一代标准，
>2015年6月正式发布，从ES6开始的版本号采用年号，如ES2015，就是ES6。ES2016就是ES7。

[[TOC]]

## 什么是ECMAScript？

ECMAScript是浏览器脚本语言的**规范**，而各种我们熟知的js语言，如**JavaScript则是规范的具体实现**

## ES6 新特性

### 1. let var const

新建：打开VSCode—打开文件夹—新建es6文件夹—新建文件1、let.html—shift+!+Enter生成模板。填入下面内容后，右键open with live server

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    

    <script>
    // var 声明的变量往往会越域
    // let 声明的变量有严格局部作用域

            // {
            //     var a = 1;
            //     let b = 2;
            // }
            // console.log(a); // 1
            // console.log(b); // ReferenceError: b is not defined

    // var 可以声明多次
    // let 只能声明一次
            // var m = 1
            // var m = 2
            // let n = 3
            // let n = 4
            // console.log(m)  // 2
            // console.log(n)  // Identifier 'n' has already been declared

    // var 会变量提升
    // let 不存在变量提升
            // console.log(x);  // undefined
            // var x = 10;
            // console.log(y);   //ReferenceError: y is not defined
            // let y = 20;

    // 1. const声明之后不允许改变
    // 2. 一但声明必须初始化，否则会报错
        const a = 1;
        a = 3; //Uncaught TypeError: Assignment to constant variable.
    </script>

</body>
</html>
```
::: tip 总结
- var在{}之外也起作用
- let在{}不起作用
- var多次声明同一变量不会报错，let多次声明会报错，只能声明一次。
- var 会变量提升（打印和定义可以顺序反）。let 不存在变量提升（顺序不能反）
- let的const声明之后不允许改变
:::

### 2.解构表达式
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <script>
        //数组解构
        // let arr = [1,2,3];
        // let a = arr[0];
        // let b = arr[1];
        // let c = arr[2];

        // // let [a,b,c] = arr; //这个就是解构表达式
        // console.log(a,b,c)


        const person = {
            name: "jack",
            age: 21,
            language: ['java', 'js', 'css']
        }

        // const name = person.name;
        // const age = person.age;
        // const language = person.language;

    //对象解构
        const {name:abc,age,language} = person;
        console.log(abc,age,language);//这里把abc赋值给name

        //4、字符串扩展
        let str = "hello.vue";
        console.log(str.startsWith("hello"));//true
        console.log(str.endsWith(".vue"));//true
        console.log(str.includes("e"));//true
        console.log(str.includes("hello"));//true

        //字符串模板
        let ss = `<div>
                    <span>hello world<span>
                </div>`;
        console.log(ss);

        // 2、字符串插入变量和表达式。变量名写在 ${} 中，${} 中可以放入 JavaScript 表达式。

        function fun() {
            return "这是一个函数"
        }

        let info = `我是${abc}，今年${age + 10}了, 我想说： ${fun()}`;
        console.log(info);
    </script>
    
</body>
</html>
```
::: tip 总结
- 支持**let arr = [1,2,3]; let [a,b,c] = arr**;这种语法
- 支持对象解析：**const { name: abc, age, language } = person**; 冒号代表改名
- 字符串函数
- 支持一个字符串为多行
- 占位符功能 ${}
:::

### 3.函数优化
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <script>
    //1）、函数参数默认值

        //在ES6以前，我们无法给一个函数参数设置默认值，只能采用变通写法：
        function add(a, b) {
            // 判断b是否为空，为空就给默认值1
            b = b || 1;
            return a + b;
        }
        // 传一个参数
        console.log(add(10));


        //现在可以这么写：直接给参数写上默认值，没传就会自动使用默认值
        function add2(a, b = 1) {
            return a + b;
        }
        console.log(add2(20));


    //2）、不定参数
        function fun(...values) {
        console.log(values.length)
        }
        fun(1, 2)      //2
        fun(1, 2, 3, 4)  //4




    //3）、箭头函数
        //以前声明一个方法
        // var print = function (obj) {
        //     console.log(obj);
        // }

        var print = obj => console.log(obj);
        print("hello");


        var sum = function (a, b) {
            c = a + b;
            return a + c;
        }

        var sum2 = (a, b) => a + b;
        console.log(sum2(11, 12));

        var sum3 = (a, b) => {
            c = a + b;
            return a + c;
        }
        console.log(sum3(10, 20))


        
        const person = {
            name: "jack",
            age: 21,
            language: ['java', 'js', 'css']
        }

        function hello(person) {
            console.log("hello," + person.name)
        }

        //箭头函数+解构
        var hello2 = ({name}) => console.log("hello," +name);
        hello2(person);

    </script>
</body>
</html>
```
::: tip 总结
- 原来想要函数默认值得这么写b = b || 1; 现在可以直接写了function add2(a, b = 1) {
- 函数不定参数function fun(...values) {
- 支持箭头函数（lambda表达式），还支持使用{}结构传入对象的成员
:::

### 4.对象优化
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <script>
    //Object API
        const person = {
            name: "jack",
            age: 21,
            language: ['java', 'js', 'css']
        }

        console.log(Object.keys(person));//["name", "age", "language"]
        console.log(Object.values(person));//["jack", 21, Array(3)]
        console.log(Object.entries(person));//[Array(2), Array(2), Array(2)]


        const target = { a: 1 };
        const source1 = { b: 2 };
        const source2 = { c: 3 };

        //{a:1,b:2,c:3}
        Object.assign(target, source1, source2);

        console.log(target);//["name", "age", "language"]

    //2）、声明对象简写
        const age = 23
        const name = "张三"
        const person1 = { age: age, name: name }

        const person2 = { age, name }//声明对象简写
        console.log(person2);

    //3）、对象的函数属性简写
         let person3 = {
            name: "jack",
            // 以前：
            eat: function (food) {
                console.log(this.name + "在吃" + food);
            },
            //箭头函数this不能使用，对象.属性
            eat2: food => console.log(person3.name + "在吃" + food),
            eat3(food) {
                console.log(this.name + "在吃" + food);
            }
        }

        person3.eat("香蕉");
        person3.eat2("苹果")
        person3.eat3("橘子");

    //4）、对象拓展运算符

        // 1、拷贝对象（深拷贝）
        let p1 = { name: "Amy", age: 15 }
        let someone = { ...p1 }
        console.log(someone)  //{name: "Amy", age: 15}

        // 2、合并对象
        let age1 = { age: 15 }
        let name1 = { name: "Amy" }
        let p2 = {name:"zhangsan"}
        p2 = { ...age1, ...name1 } 
        console.log(p2)
    </script>
    
</body>
</html>
```
::: tip 总结
- 可以获取map的键值对等Object.keys()、values、entries
- Object.assign(target,source1,source2) 合并
- const person2 = { age, name }//声明对象简写
- …代表取出该对象所有属性拷贝到当前对象。let someone = { …p1 }
:::

### 5.map和reduce
``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <script>
    //数组中新增了map和reduce方法。
        //map()：接收一个函数，将原数组中的所有元素用这个函数处理后放入新数组返回。
        let arr = ['1', '20', '-5', '3'];

        //  arr = arr.map((item)=>{
        //     return item*2
        //  });
        arr = arr.map(item=> item*2);

        console.log(arr);

    //reduce() 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，
        //[2, 40, -10, 6]
        //reduce语法:  arr.reduce(callback,[initialValue])
    /**
    1、previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
    2、currentValue （数组中当前被处理的元素）
    3、index （当前元素在数组中的索引）
    4、array （调用 reduce 的数组）*/

    let result = arr.reduce((a,b)=>{
            console.log("上一次处理后："+a);
            console.log("当前正在处理："+b);
            return a + b;
        },100);
        console.log(result)

    </script>

</body>
</html>
```
::: tip 总结
- map处理，arr = arr.map(item=> item*2);
- reduce。arr.reduce((原来的值,处理后的值即return的值)=>{
:::

### promise 优化异步操作

course_score_10.json 得分
``` json
{
    "id": 100,
    "score": 90
}
```
user.json 用户
``` json
{
    "id": 1,
    "name": "zhangsan",
    "password": "123456"
}
```
user_course_1.json 课程
``` json
{
    "id": 10,
    "name": "chinese"
}
```
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
</head>

<body>

    <script>
        //1、查出当前用户信息
        //2、按照当前用户的id查出他的课程
        //3、按照当前课程id查出分数
        // $.ajax({
        //     url: "mock/user.json",
        //     success(data) {
        //         console.log("查询用户：", data);
        //         $.ajax({
        //             url: `mock/user_corse_${data.id}.json`,
        //             success(data) {
        //                 console.log("查询到课程：", data);
        //                 $.ajax({
        //                     url: `mock/corse_score_${data.id}.json`,
        //                     success(data) {
        //                         console.log("查询到分数：", data);
        //                     },
        //                     error(error) {
        //                         console.log("出现异常了：" + error);
        //                     }
        //                 });
        //             },
        //             error(error) {
        //                 console.log("出现异常了：" + error);
        //             }
        //         });
        //     },
        //     error(error) {
        //         console.log("出现异常了：" + error);
        //     }
        // });

        //1、Promise可以封装异步操作
        // let p = new Promise((resolve, reject) => { //传入成功解析，失败拒绝
        //     //1、异步操作
        //     $.ajax({
        //         url: "mock/user.json",
        //         success: function (data) {
        //             console.log("查询用户成功:", data)
        //             resolve(data);
        //         },
        //         error: function (err) {
        //             reject(err);
        //         }
        //     });
        // });

        // p.then((obj) => { //成功以后做什么
        //     return new Promise((resolve, reject) => {
        //         $.ajax({
        //             url: `mock/user_corse_${obj.id}.json`,
        //             success: function (data) {
        //                 console.log("查询用户课程成功:", data)
        //                 resolve(data);
        //             },
        //             error: function (err) {
        //                 reject(err)
        //             }
        //         });
        //     })
        // }).then((data) => { //成功以后干什么
        //     console.log("上一步的结果", data)
        //     $.ajax({
        //         url: `mock/corse_score_${data.id}.json`,
        //         success: function (data) {
        //             console.log("查询课程得分成功:", data)
        //         },
        //         error: function (err) {
        //         }
        //     });
        // })

        function get(url, data) { //自己定义一个方法整合一下
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: url,
                    data: data,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (err) {
                        reject(err)
                    }
                })
            });
        }

        get("mock/user.json")
            .then((data) => {
                console.log("用户查询成功~~~:", data)
                return get(`mock/user_corse_${data.id}.json`);
            })
            .then((data) => {
                console.log("课程查询成功~~~:", data)
                return get(`mock/corse_score_${data.id}.json`);
            })
            .then((data) => {
                console.log("课程成绩查询成功~~~:", data)
            })
            .catch((err) => { //失败的话catch
                console.log("出现异常", err)
            });

    </script>
</body>
</html>
```
::: tip 总结
以前嵌套ajax的时候很繁琐。
- 把Ajax封装到Promise中，赋值给let p
- 在Ajax中成功使用resolve(data)，失败使用reject(err)
- p.then().catch()
:::

### 模块化

模块化就是把代码进行拆分，方便重复利用。类似于java中的导包，而JS换了个概念，是导模块。

模块功能主要有两个命令构成 export 和import
- export用于规定模块的对外接口
- import用于导入其他模块提供的功能

user.js
``` js
var name = "jack"
var age = 21
function add(a,b){
    return a + b;
}

export {name,age,add}
```

hello.js
``` js
// export const util = {
//     sum(a, b) {
//         return a + b;
//     }
// }

export default {
    sum(a, b) {
        return a + b;
    }
}
// export {util}

//`export`不仅可以导出对象，一切JS变量都可以导出。比如：基本类型变量、函数、数组、对象。
```

main.js
``` js
import abc from "./hello.js"
import {name,add} from "./user.js"

abc.sum(1,2);
console.log(name);
add(1,3);
```

