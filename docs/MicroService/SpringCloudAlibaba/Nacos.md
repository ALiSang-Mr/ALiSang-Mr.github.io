# Nacos
>一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。
>[官方中文文档](https://nacos.io/zh-cn/docs/quick-start.html)

[[TOC]]

## 微服务注册中心

### 安装&启动&配置

[注册中心接入Demo文档](https://github.com/alibaba/spring-cloud-alibaba/blob/master/spring-cloud-alibaba-examples/nacos-example/nacos-discovery-example/readme-zh.md)

::: tip 如何接入
>在启动示例进行演示之前，我们先了解一下 Spring Cloud 应用如何接入 Nacos Discovery。 **注意 本章节只是为了便于您理解接入方式，
>本示例代码中已经完成接入工作，您无需再进行修改**。
>1. 首先，修改 pom.xml 文件，引入 Nacos Discovery Starter。
``` xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```
>在应用的 /src/main/resources/application.properties 配置文件中配置 Nacos Server 地址（或在yaml中按格式配置）
``` yaml
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
```
>我们要配置nacos服务器的地址，也就是注册中心地址，但是我们还没有nacos服务器，所以我们先在下面按照"启动nacos server"创建nacos服务器

>使用` @EnableDiscoveryClient `注解开启服务注册与发现功能
> **启动 Nacos Server：**
> 1. 首先需要获取 Nacos Server，支持直接下载和源码构建两种方式。
> - 直接下载：[Nacos Server 下载页](https://github.com/alibaba/nacos/releases)。解压zip，双击bin里的startup.cmd就启动了。
> - 源码构建：进入 [Nacos Github 项目页面](https://github.com/alibaba/nacos)，将代码 git clone 到本地自行编译打包，[参考此文档](https://nacos.io/zh-cn/docs/quick-start.html)。推荐使用源码构建方式以获取最新版本
> 2. 启动 Server:进入解压后文件夹或编译打包好的文件夹，找到如下相对文件夹 nacos/bin，并对照操作系统实际情况之下如下命令。
> - Linux/Unix/Mac 操作系统，执行命令 `sh startup.sh -m standalone`
> - Windows 操作系统，执行命令 `cmd startup.cmd`
><h3>**应用启动**</h3>
> 1. 增加配置，在 nacos-discovery-provider-example 项目的 /src/main/resources/application.properties 中添加基本配置信息
``` yaml
 spring.application.name=service-provider
 server.port=18082
 ```
> 2.启动应用，支持 IDE 直接启动和编译打包后启动。
> - IDE直接启动：找到 nacos-discovery-provider-example 项目的主类` ProviderApplication`，执行 main 方法启动应用。
> - 打包编译后启动：在 nacos-discovery-provider-example 项目中执行` mvn clean package` 将工程编译打包，然后执行 `java -jar nacos-discovery-provider-example.jar`启动应用。
><h3>**验证**</h3>
>**查询服务**
>在浏览器输入此地址` http://127.0.0.1:8848/nacos/v1/ns/catalog/instances?serviceName=service-provider&clusterName=DEFAULT&pageSize=10&pageNo=1&namespaceId=`，
>并点击跳转，可以看到服务节点已经成功注册到 Nacos Server。
:::

在coupon的gulimallCouponApplication.java加上@EnableDiscoveryClient，导入包，然后重开项目。

http://127.0.0.1:8848/nacos/ 账号名：nacos 密码：nacos

最后application.yml内容，配置了服务中心名和当前模块名字
``` yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://192.168.56.10:3306/gulimall-sms?useUnicode=true&characterEncoding=UTF-8&useSSL=false&serverTimezone=Asia/Shanghai
    driver-class-name: com.mysql.cj.jdbc.Driver
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
  application:
    name: gulimall-coupon


mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto
      logic-delete-value: 1
      logic-not-delete-value: 0

server:
  port: 7000
```
然后依次给member、配置上面的yaml，改下name就行。再给每个项目配置类上加上注解@EnableDiscoveryClient

### 测试member和coupon的远程调用

想要获取当前会员领取到的所有优惠券。先去注册中心找优惠券服务，注册中心调一台优惠券服务器给会员，会员服务器发送请求给这台优惠券服务器，
然后对方响应。

### Feign与注册中心

声明式远程调用

feign是一个声明式的HTTP客户端，他的目的就是让远程调用更加简单。给远程服务发的是HTTP请求。

会员服务想要远程调用优惠券服务，只需要给会员服务里引入openfeign依赖，他就有了远程调用其他服务的能力。

``` xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```
在coupon中修改如下的内容
``` java
@RequestMapping("coupon/coupon")
public class CouponController {
    @Autowired
    private CouponService couponService;

    @RequestMapping("/member/list")
    public R membercoupons(){    //全系统的所有返回都返回R
        // 应该去数据库查用户对于的优惠券，但这个我们简化了，不去数据库查了，构造了一个优惠券给他返回
        CouponEntity couponEntity = new CouponEntity();
        couponEntity.setCouponName("满100-10");//优惠券的名字
        return R.ok().put("coupons",Arrays.asList(couponEntity));
    }
```
这样我们准备好了优惠券的调用内容

在member的配置类上加注解@EnableDiscoveryClient，告诉member是一个远程调用客户端，member要调用东西的
``` java
package com.atguigu.gulimall.member;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/*
* 想要远程调用的步骤：
* 1 引入openfeign
* 2 编写一个接口，接口告诉springcloud这个接口需要调用远程服务
* 	2.1 在接口里声明@FeignClient("gulimall-coupon")他是一个远程调用客户端且要调用coupon服务
* 	2.2 要调用coupon服务的/coupon/coupon/member/list方法
* 3 开启远程调用功能 @EnableFeignClients，要指定远程调用功能放的基础包
* */
@EnableFeignClients(basePackages="com.atguigu.gulimall.member.feign")
@EnableDiscoveryClient
@SpringBootApplication
public class gulimallMemberApplication {

	public static void main(String[] args) {
		SpringApplication.run(gulimallMemberApplication.class, args);
	}
}
```
那么要调用什么东西呢？就是我们刚才写的优惠券的功能，复制函数部分，在member的com.atguigu.gulimall.member.feign包下新建类：
``` java
package com.atguigu.gulimall.member.feign;

import com.atguigu.common.utils.R;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestMapping;

@FeignClient("gulimall-coupon") //告诉spring cloud这个接口是一个远程客户端，要调用coupon服务，再去调用coupon服务/coupon/coupon/member/list对应的方法
public interface CouponFeignService {
    @RequestMapping("/coupon/coupon/member/list")//注意写全优惠券类上还有映射//注意我们这个地方不熟控制层，所以这个请求映射请求的不是我们服务器上的东西，而是nacos注册中心的
    public R membercoupons();//得到一个R对象
}
```
然后我们在member的控制层写一个测试请求
``` java
@RestController
@RequestMapping("member/member")
public class MemberController {
    @Autowired
    private MemberService memberService;

    @Autowired
    CouponFeignService couponFeignService;

    @RequestMapping("/coupons")
    public R test(){
        MemberEntity memberEntity = new MemberEntity();
        memberEntity.setNickname("会员昵称张三");
        R membercoupons = couponFeignService.membercoupons();//假设张三去数据库查了后返回了张三的优惠券信息

        //打印会员和优惠券信息
        return R.ok().put("member",memberEntity).put("coupons",membercoupons.get("coupons"));
    }
```
重新启动服务

`http://localhost:8000/member/member/coupons`
``` markdown
{"msg":"success","code":0,"coupons":[{"id":null,"couponType":null,"couponImg":null,"couponName":"满100-10","num":null,"amount":null,"perLimit":null,"minPoint":null,"startTime":null,"endTime":null,"useType":null,"note":null,"publishCount":null,"useCount":null,"receiveCount":null,"enableStartTime":null,"enableEndTime":null,"code":null,"memberLevel":null,"publish":null}],"member":{"id":null,"levelId":null,"username":null,"password":null,"nickname":"会员昵称张三","mobile":null,"email":null,"header":null,"gender":null,"birth":null,"city":null,"job":null,"sign":null,"sourceType":null,"integration":null,"growth":null,"status":null,"createTime":null}}
```
coupon里的R.ok()是什么
``` java
public class R extends HashMap<String, Object> {//R继承了HashMap
    // ok是个静态方法，new了一个R对象，并且
    public static R ok(String msg) {
        R r = new R();
        r.put("msg", msg);//调用了super.put(key, value);，即hashmap的put
        return r;
    }
}
```
coupon里的控制层就是new了个couponEntity然后放到HashMap(R)里而已。

### 配置中心
我们还可以用nacos作为配置中心。配置中心的意思是不在application.properties等文件中配置了，而是放到nacos配置中心公用，这样无需每台机器都改。

引入配置中心依赖，放到common中
``` xml
<dependency>
     <groupId>com.alibaba.cloud</groupId>
     <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
 </dependency>
```
在coupons项目中创建/src/main/resources/bootstrap.properties ，这个文件是springboot里规定的，他优先级别application.properties高
``` properties
# 改名字，对应nacos里的配置文件名
spring.application.name=gulimall-coupon
spring.cloud.nacos.config.server-addr=127.0.0.1:8848
```
原来的方式：
``` java
@RestController
@RequestMapping("coupon/coupon")
public class CouponController {
    @Autowired
    private CouponService couponService;

    @Value("${coupon.user.name}")//从application.properties中获取//不要写user.name，他是环境里的变量
    private String name;
    @Value("${coupon.user.age}")
    private Integer age;
    @RequestMapping("/test")
    public R test(){

        return R.ok().put("name",name).put("age",age);
    }
```
浏览器去nacos里的配置列表，点击＋号，数据集data ID(配置文件的名字)：`gulimall-coupon.properties`，配置

![data ID(配置文件的名字)](../SpringCloudAlibaba/img/nacos_001.jpg "data ID(配置文件的名字)")

``` properties
# gulimall-coupon.properties
coupon.user.name="配置中心"      
coupon.user.age=12
```

然后点击发布。重启coupon，`http://localhost:7000/coupon/coupon/test`
``` markdown
{"msg":"success","code":0,"name":"配置中心","age":12}
```
但是修改怎么办？实际生产中不能重启应用。在coupon的控制层上加@RefreshScope
``` java
@RefreshScope
@RestController
@RequestMapping("coupon/coupon")
public class CouponController {
    @Autowired
    private CouponService couponService;

    @Value("${coupon.user.name}")//从application.properties中获取//不要写user.name，他是环境里的变量
    private String name;
    @Value("${coupon.user.age}")
    private Integer age;
    @RequestMapping("/test")
    public R test(){

        return R.ok().put("name",name).put("age",age);
    }
```

重启后，在nacos浏览器里修改配置，修改就可以观察到能动态修改了

nacos的配置内容优先于项目本地的配置内容。

**使用动态刷新配置注解@RefreshScope**

**动态获取配置@Value**

### 配置中心进阶

在nacos浏览器中还可以配置：

1. 命名空间：用作配置隔离。（一般每个微服务一个命名空间）
- 默认public。默认新增的配置都在public空间下
- 开发、测试、开发可以用命名空间分割。properties每个空间有一份。
- 在bootstrap.properties里配置（测试完去掉，学习不需要）
- **也可以为每个微服务配置一个命名空间，微服务互相隔离**
``` properties
# 可以选择对应的命名空间 # 写上对应环境的命名空间ID
spring.cloud.nacos.config.namespace=b176a68a-6800-4648-833b-be10be8bab00
```

2. 配置集：一组相关或不相关配置项的集合。

3. 配置集ID：类似于配置文件名，即Data ID

4. 配置分组：默认所有的配置集都属于DEFAULT_GROUP。双十一，618，双十二

最终方案：每个微服务创建自己的命名空间，然后使用配置分组区分环境（dev/test/prod）
### 加载多配置集

我们要把原来application.yml里的内容都分文件抽离出去。我们在nacos里创建好后，在coupons里指定要导入的配置即可。

bootstrap.properties
``` properties
spring.application.name=gulimall-coupon

spring.cloud.nacos.config.server-addr=127.0.0.1:8848
# 可以选择对应的命名空间 # 写上对应环境的命名空间ID
spring.cloud.nacos.config.namespace=b176a68a-6800-4648-833b-be10be8bab00
# 更改配置分组
spring.cloud.nacos.config.group=dev

#新版本不建议用下面的了
#spring.cloud.nacos.config.ext-config[0].data-id=datasource.yml
#spring.cloud.nacos.config.ext-config[0].group=dev
#spring.cloud.nacos.config.ext-config[0].refresh=true
#spring.cloud.nacos.config.ext-config[1].data-id=mybatis.yml
#spring.cloud.nacos.config.ext-config[1].group=dev
#spring.cloud.nacos.config.ext-config[1].refresh=true
#spring.cloud.nacos.config.ext-config[2].data-id=other.yml
#spring.cloud.nacos.config.ext-config[2].group=dev
#spring.cloud.nacos.config.ext-config[2].refresh=true

spring.cloud.nacos.config.extension-configs[0].data-id=datasource.yml
spring.cloud.nacos.config.extension-configs[0].group=dev
spring.cloud.nacos.config.extension-configs[0].refresh=true

spring.cloud.nacos.config.extension-configs[1].data-id=mybatis.yml
spring.cloud.nacos.config.extension-configs[1].group=dev
spring.cloud.nacos.config.extension-configs[1].refresh=true

spring.cloud.nacos.config.extension-configs[2].data-id=other.yml
spring.cloud.nacos.config.extension-configs[2].group=dev
spring.cloud.nacos.config.extension-configs[2].refresh=true
```
输出内容有
``` markdown
2020-06-25 00:04:13.677  WARN 17936 --- [           main] c.a.c.n.c.NacosPropertySourceBuilder     : Ignore the empty nacos configuration and get it based on dataId[gulimall-coupon] & group[dev]

2020-06-25 00:04:13.681  INFO 17936 --- [           main] b.c.PropertySourceBootstrapConfiguration :
Located property source: [
BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon.properties,dev'}, 
BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon,dev'}, 
BootstrapPropertySource {name='bootstrapProperties-other.yml,dev'}, 
BootstrapPropertySource {name='bootstrapProperties-mybatis.yml,dev'}, 
BootstrapPropertySource {name='bootstrapProperties-datasource.yml,dev'}]
```

