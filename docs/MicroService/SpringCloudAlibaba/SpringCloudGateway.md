# SpringCloudGateway 网关



## 简介
发送请求需要知道商品服务的地址，如果商品服务器有123服务器，1号掉线后，还得改，所以需要网关动态地管理，
他能从注册中心中实时地感知某个服务上线还是下线。

请求也要加上询问权限，看用户有没有权限访问这个请求，也需要网关。

所以我们使用spring cloud的gateway组件做网关功能。

网关是请求浏览的入口，常用功能包括路由转发，权限校验，限流控制等。SpringCloud Gateway取代了Zuul网关。

官方文档[https://cloud.spring.io/spring-cloud-gateway/2.2.x/reference/html/](https://cloud.spring.io/spring-cloud-gateway/2.2.x/reference/html/)

## 三大核心概念：

- **Route**: 
>The basic building block of the gateway. It is defined by an ID, a destination URI, a collection of predicates断言, and a collection of filters. A route is matched if the aggregate predicate is true.

发一个请求给网关，网关要将请求路由到指定的服务。路由有id，目的地uri，断言的集合，匹配了断言就能到达指定位置，

- **Predicate断言**: 
>This is a Java 8 Function Predicate. The input type is a Spring Framework ServerWebExchange. This lets you match on anything from the HTTP request, such as headers or parameters.

就是java里的断言函数，匹配请求里的任何信息，包括请求头等

- **Filter**: 
>These are instances of Spring Framework GatewayFilter that have been constructed with a specific factory. Here, you can modify requests and responses before or after sending the downstream request.

过滤器请求和响应都可以被修改。

客户端发请求给服务端。中间有网关。先交给映射器，如果能处理就交给handler处理，然后交给一系列filer，然后给指定的服务，再返回回来给客户端。

![网关工作原理](../SpringCloudAlibaba/img/spring_cloud_gateway_001.png "网关工作原理")

有很多断言。

``` yaml
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: https://example.org
        predicates:
        - Cookie=mycookie,mycookievalue
```
"-" 代表数组。只有断言成功了，才路由到指定的地址。
``` yaml
spring:
  cloud:
    gateway:
      routes:
      - id: after_route
        uri: https://example.org
        predicates:
        - name: Cookie
          args:
            name: mycookie
            regexp: mycookievalue
```

创建module，使用initilizer，Group：com.atguigu.gulimall，Artifact： gulimall-gateway，package：com.atguigu.gulimall.gateway。 搜索gateway选中。

开启注册服务发现@EnableDiscoveryClient

配置nacos注册中心地址applicaion.properties
``` properties
spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
spring.application.name=gulimall-gateway
server.port=88
```

bootstrap.properties 填写配置中心地址
``` properties
spring.application.name=gulimall-gateway

spring.cloud.nacos.config.server-addr=127.0.0.1:8848
spring.cloud.nacos.config.namespace=bfa85f10-1a9a-460c-a7dc-efa961b45cc1
```
nacos里创建命名空间gateway，然后在命名空间里创建文件guilmall-gateway.yml
``` yaml
spring:
    application:
        name: gulimall-gateway
```
在项目里创建application.yml
``` yaml
spring:
  cloud:
    gateway:
      routes:
        - id: test_route
          uri: https://www.baidu.com
          predicates:
            - Query=url,baidu

        - id: qq_route
          uri: https://www.qq.com
          predicates:
            - Query=url,qq

        - id: product_route
          uri: lb://gulimall-product
          predicates:
            - Path=/api/product/**
          filters:
            - RewritePath=/api/(?<segment>.*),/$\{segment}

        - id: third_party_route
          uri: lb://gulimall-third-party
          predicates:
            - Path=/api/thirdparty/**
          filters:
            - RewritePath=/api/thirdparty/(?<segment>.*),/$\{segment}

        - id: member_route
          uri: lb://gulimall-member
          predicates:
            - Path=/api/member/**
          filters:
            - RewritePath=/api/(?<segment>.*),/$\{segment}

        - id: ware_route
          uri: lb://gulimall-ware
          predicates:
            - Path=/api/ware/**
          filters:
            - RewritePath=/api/(?<segment>.*),/$\{segment}

        - id: admin_route
          uri: lb://renren-fast
          predicates:
            - Path=/api/**
          filters:
            - RewritePath=/api/(?<segment>.*),/renren-fast/$\{segment}



  ## 前端项目，/api
## http://localhost:88/api/captcha.jpg   http://localhost:8080/renren-fast/captcha.jpg
## http://localhost:88/api/product/category/list/tree http://localhost:10000/product/category/list/tree
```
测试 localhost:8080/hello?url=baidu