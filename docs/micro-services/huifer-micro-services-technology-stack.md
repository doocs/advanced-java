# 微服务技术栈

- Author: [HuiFer](https://github.com/huifer)
- Description: 该文简单介绍微服务技术栈有哪些分别用来做什么。

## 技术栈

### 微服务开发

作用：快速开发服务。

- Spring
- Spring MVC
- Spring Boot

[Spring](https://spring.io/) 目前是 JavaWeb 开发人员必不可少的一个框架，SpringBoot 简化了 Spring 开发的配置目前也是业内主流开发框架。

### 微服务注册发现

作用：发现服务，注册服务，集中管理服务。

#### Eureka

- Eureka Server : 提供服务注册服务, 各个节点启动后，会在 Eureka Server 中进行注册。
- Eureka Client : 简化与 Eureka Server 的交互操作。
- Spring Cloud Netflix : [GitHub](https://github.com/spring-cloud/spring-cloud-netflix)，[文档](https://cloud.spring.io/spring-cloud-netflix/reference/html/)

#### Zookeeper

> ZooKeeper is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.

[Zookeeper](https://github.com/apache/zookeeper) 是一个集中的服务, 用于维护配置信息、命名、提供分布式同步和提供组服务。

#### Zookeeper 和 Eureka 区别

Zookeeper 保证 CP，Eureka 保证 AP：

- C：数据一致性；
- A：服务可用性；
- P：服务对网络分区故障的容错性，这三个特性在任何分布式系统中不能同时满足，最多同时满足两个。

### 微服务配置管理

作用：统一管理一个或多个服务的配置信息, 集中管理。

#### [Disconf](https://github.com/knightliao/disconf)

Distributed Configuration Management Platform(分布式配置管理平台) , 它是专注于各种分布式系统配置管理 的通用组件/通用平台, 提供统一的配置管理服务, 是一套完整的基于 zookeeper 的分布式配置统一解决方案。

#### [SpringCloudConfig](https://github.com/spring-cloud/spring-cloud-config)

#### [Apollo](https://github.com/ctripcorp/apollo)

Apollo（阿波罗）是携程框架部门研发的分布式配置中心，能够集中化管理应用不同环境、不同集群的配置，配置修改后能够实时推送到应用端，并且具备规范的权限、流程治理等特性，用于微服务配置管理场景。

### 权限认证

作用：根据系统设置的安全规则或者安全策略, 用户可以访问而且只能访问自己被授权的资源，不多不少。

#### [Spring Security](https://spring.io/projects/spring-security)

#### [Apache Shiro](http://shiro.apache.org/)

> Apache Shiro™ is a powerful and easy-to-use Java security framework that performs authentication, authorization, cryptography, and session management. With Shiro’s easy-to-understand API, you can quickly and easily secure any application – from the smallest mobile applications to the largest web and enterprise applications.

### 批处理

作用: 批量处理同类型数据或事物

#### [Spring Batch](https://spring.io/projects/spring-batch)

### 定时任务

> 作用: 定时做什么。

#### [Quartz](http://www.quartz-scheduler.org/)

### 微服务调用 (协议)

> 通讯协议

#### Rest

- 通过 HTTP/HTTPS 发送 Rest 请求进行数据交互

#### RPC

- Remote Procedure Call
- 它是一种通过网络从远程计算机程序上请求服务，而不需要了解底层网络技术的协议。RPC 不依赖于具体的网络传输协议，tcp、udp 等都可以。

#### [gRPC](https://www.grpc.io/)

> A high-performance, open-source universal RPC framework

所谓 RPC(remote procedure call 远程过程调用) 框架实际是提供了一套机制，使得应用程序之间可以进行通信，而且也遵从 server/client 模型。使用的时候客户端调用 server 端提供的接口就像是调用本地的函数一样。

#### RMI

- Remote Method Invocation
- 纯 Java 调用

### 服务接口调用

> 作用：多个服务之间的通讯

#### [Feign(HTTP)](https://github.com/OpenFeign/feign)

Spring Cloud Netflix 的微服务都是以 HTTP 接口的形式暴露的，所以可以用 Apache 的 HttpClient 或 Spring 的 RestTemplate 去调用，而 Feign 是一个使用起来更加方便的 HTTP 客戶端，使用起来就像是调用自身工程的方法，而感觉不到是调用远程方法。

### 服务熔断

> 作用: 当请求到达一定阈值时不让请求继续.

#### [Hystrix](https://github.com/Netflix/Hystrix)

> Hystrix is a latency and fault tolerance library designed to isolate points of access to remote systems, services and 3rd party libraries, stop cascading failure and enable resilience in complex distributed systems where failure is inevitable.

#### [Sentinel](https://github.com/alibaba/Sentinel)

> A lightweight powerful flow control component enabling reliability and monitoring for microservices. (轻量级的流量控制、熔断降级 Java 库)

### 服务的负载均衡

> 作用：降低服务压力, 增加吞吐量

#### [Ribbon](https://github.com/Netflix/ribbon)

> Spring Cloud Ribbon 是一个基于 HTTP 和 TCP 的客户端负载均衡工具, 它基于 Netflix Ribbon 实现

#### [Nginx](https://github.com/nginx/nginx)

Nginx (engine x) 是一个高性能的 HTTP 和反向代理 web 服务器, 同时也提供了 IMAP/POP3/SMTP 服务

#### Nginx 与 Ribbon 区别

Nginx 属于服务端负载均衡，Ribbon 属于客户端负载均衡。Nginx 作用与 Tomcat，Ribbon 作用与各个服务之间的调用 (RPC)。

### 消息队列

> 作用: 解耦业务, 异步化处理数据

#### [Kafka](http://kafka.apache.org/)

#### [RabbitMQ](https://www.rabbitmq.com/)

#### [RocketMQ](http://rocketmq.apache.org/)

#### [activeMQ](http://activemq.apache.org/)

### 日志采集 (elk)

> 作用: 收集各服务日志提供日志分析、用户画像等

#### [Elasticsearch](https://github.com/elastic/elasticsearch)

#### [Logstash](https://github.com/elastic/logstash)

#### [Kibana](https://github.com/elastic/kibana)

### API 网关

> 作用: 外部请求通过 API 网关进行拦截处理, 再转发到真正的服务

#### [Zuul](https://github.com/Netflix/zuul)

> Zuul is a gateway service that provides dynamic routing, monitoring, resiliency, security, and more.

### 服务监控

> 作用: 以可视化或非可视化的形式展示出各个服务的运行情况 (CPU、内存、访问量等)

#### [Zabbix](https://github.com/jjmartres/Zabbix)

#### [Nagios](https://www.nagios.org/)

#### [Metrics](https://metrics.dropwizard.io)

### 服务链路追踪

> 作用: 明确服务之间的调用关系

#### [Zipkin](https://github.com/openzipkin/zipkin)

#### [Brave](https://github.com/openzipkin/brave)

### 数据存储

> 作用: 存储数据

#### 关系型数据库

##### [MySql](https://www.mysql.com/)

##### [Oracle](https://www.oracle.com/index.html)

##### [MsSQL](https://docs.microsoft.com/zh-cn/sql/?view=sql-server-ver15)

##### [PostgreSql](https://www.postgresql.org/)

#### 非关系型数据库

##### [Mongodb](https://www.mongodb.com/)

##### [Elasticsearch](https://github.com/elastic/elasticsearch)

### 缓存

> 作用: 存储数据

#### [redis](https://redis.io/)

### 分库分表

> 作用: 数据库分库分表方案.

#### [ShardingSphere](http://shardingsphere.apache.org/)

#### [Mycat](http://www.mycat.io/)

### 服务部署

> 作用: 将项目快速部署、上线、持续集成.

#### [Docker](http://www.docker.com/)

#### [Jenkins](https://jenkins.io/zh/)

#### [Kubernetes(K8s)](https://kubernetes.io/)

#### [Mesos](http://mesos.apache.org/)
