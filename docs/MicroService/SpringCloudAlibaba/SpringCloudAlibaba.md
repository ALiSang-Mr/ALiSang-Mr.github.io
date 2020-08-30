# SpringCloud Alibaba简介

阿里18年开发的微服务一站式解决方案。https://github.com/alibaba/spring-cloud-alibaba/blob/master/README-zh.md

[[TOC]]

## SpringCloud的几大痛点
- SpringCloud 部分组件停止维护和更新，给开发带来不便，比如eureka、Hystrix
- SpringCloud 部分环境搭建复杂，没有完善的可视化界面，我们需要大量的二次开发和定制
- SpringCloud 配置复杂，难以上手，部分配置差别难以区分和合理应用

## SpringCloud Alibaba优势
阿里使用过的组件经历的考验，性能强悍，设计合理，

成套的产品搭配完善的可视化界面给开发运维带来了极大的便利

搭建简单，学习曲线低

结合SpringCloud Alibaba 最终的技术搭配方案：
SpringCloud Alibaba - Nacos:注册中心(服务发现/注册)
SpringCloud Alibaba - Nacos:配置中心(动态配置管理)
SpringCloud Ribbon: 负载均衡
SpringCloud - Feign:声明式HTTP客户端(调用远程服务)
SpringCloud Alibaba - Sentinel:服务容错(限流、降级、熔断)
SpringCloud - Gateway: API 网关(webflux编程模式)
SpringCloud - Sleuth: 调用链监控
SpringCloud Alibaba - Seata:原fescar,即分布式事务解决方案
 