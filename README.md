# 互联网 Java 工程师进阶知识完全扫盲

[![license](https://img.shields.io/badge/license-Attribution--NonCommercial%204.0%20-brightgreen.svg)](https://github.com/doocs/advanced-java/blob/master/LICENSE)
[![original](https://img.shields.io/badge/original-%E4%B8%AD%E5%8D%8E%E7%9F%B3%E6%9D%89-blue.svg)](https://github.com/doocs/advanced-java)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg)](http://makeapullrequest.com)

本系列知识出自中华石杉，我对这部分知识做了一个系统的整理，方便学习查阅。

## [分布式系统](/docs/distributed-system/distributed-system-interview.md)

### 系统拆分
- [为什么要进行系统拆分？如何进行系统拆分？拆分后不用 Dubbo 可以吗？](/docs/distributed-system/why-dubbo.md)
- Dubbo 和 Thrift 有什么区别？

### 分布式服务框架
- [说一下 Dubbo 的工作原理？注册中心挂了可以继续通信吗？](/docs/distributed-system/dubbo-operating-principle.md)
- [Dubbo 支持哪些序列化协议？说一下 Hessian 的数据结构？PB 知道吗？为什么 PB 的效率是最高的？](/docs/distributed-system/dubbo-serialization-protocol.md)
- [Dubbo 负载均衡策略和集群容错策略都有哪些？动态代理策略呢？](/docs/distributed-system/dubbo-load-balancing.md)
- [Dubbo 的 spi 思想是什么？](/docs/distributed-system/dubbo-spi.md)
- [如何基于 Dubbo 进行服务治理、服务降级、失败重试以及超时重试？](/docs/distributed-system/dubbo-service-management.md)
- [分布式服务接口的幂等性如何设计（比如不能重复扣款）？](/docs/distributed-system/distributed-system-idempotency.md)
- 分布式服务接口请求的顺序性如何保证？
- 如何自己设计一个类似 Dubbo 的 rpc 框架？

### 分布式锁
- 使用 Redis 如何设计分布式锁？
- 使用 zk 来设计分布式锁可以吗？
- 以上两种分布式锁的实现方式哪种效率比较高？

### 分布式事务
- 分布式事务了解吗？
- 你们如何解决分布式事务问题的？
- TCC 如果出现网络连不通怎么办？
- XA 的一致性如何保证？

### 分布式会话
- 集群部署时的分布式 Session 如何实现？


## 高并发架构

### 高并发系统
- 如何设计一个高并发系统？

### [消息队列](/docs/high-concurrency/mq-interview.md)
- [为什么使用消息队列？消息队列有什么优点和缺点？Kafka、ActiveMQ、RabbitMQ、RocketMQ 都有什么优点和缺点？](/docs/high-concurrency/why-mq.md)
- [如何保证消息队列的高可用？](/docs/high-concurrency/how-to-ensure-high-availability-of-message-queues.md)
- [如何保证消息不被重复消费？（如何保证消息消费时的幂等性）](/docs/high-concurrency/how-to-ensure-that-messages-are-not-repeatedly-consumed.md)
- [如何保证消息的可靠性传输？（如何处理消息丢失的问题）](/docs/high-concurrency/how-to-ensure-the-reliable-transmission-of-messages.md)
- [如何保证消息的顺序性？](/docs/high-concurrency/how-to-ensure-the-order-of-messages.md)
- 如何解决消息队列的延时以及过期失效问题？消息队列满了以后该怎么处理？有几百万消息持续积压几小时，说说怎么解决？
- 如果让你写一个消息队列，该如何进行架构设计啊？说一下你的思路。

### 搜索引擎
- es 的分布式架构原理能说一下么（es 是如何实现分布式的啊）？
- es 写入数据的工作原理是什么啊？es 查询数据的工作原理是什么啊？底层的 lucene 介绍一下呗？倒排索引了解吗？
- es 在数据量很大的情况下（数十亿级别）如何提高查询效率啊？
- es 生产集群的部署架构是什么？每个索引的数据量大概有多少？每个索引大概有多少个分片？

### [缓存](/docs/high-concurrency/why-cache.md)
- [在项目中缓存是如何使用的？缓存如果使用不当会造成什么后果？](/docs/high-concurrency/why-cache.md)
- [Redis 和 Memcached 有什么区别？Redis 的线程模型是什么？为什么单线程的 Redis 比多线程的 Memcached 效率要高得多？](/docs/high-concurrency/redis-single-thread-model.md)
- [Redis 都有哪些数据类型？分别在哪些场景下使用比较合适？](/docs/high-concurrency/redis-data-types.md)
- [Redis 的过期策略都有哪些？手写一下 LRU 代码实现？](/docs/high-concurrency/redis-expiration-policies-and-lru.md)
- [如何保证 Redis 高并发、高可用？Redis 的主从复制原理能介绍一下么？Redis 的哨兵原理能介绍一下么？](/docs/high-concurrency/how-to-ensure-high-concurrency-and-high-availability-of-redis.md)
- [Redis 的持久化有哪几种方式？不同的持久化机制都有什么优缺点？持久化机制具体底层是如何实现的？](/docs/high-concurrency/redis-persistence.md)
- [Redis 集群模式的工作原理能说一下么？在集群模式下，Redis 的 key 是如何寻址的？分布式寻址都有哪些算法？了解一致性 hash 算法吗？如何动态增加和删除一个节点？](/docs/high-concurrency/redis-cluster.md)
- [了解什么是 Redis 的雪崩和穿透？Redis 崩溃之后会怎么样？系统该如何应对这种情况？如何处理 Redis 的穿透？](/docs/high-concurrency/redis-caching-avalanche-and-caching-penetration.md)
- [如何保证缓存与数据库的双写一致性？](/docs/high-concurrency/redis-consistence.md)
- [Redis 的并发竞争问题是什么？如何解决这个问题？了解 Redis 事务的 CAS 方案吗？](/docs/high-concurrency/redis-cas.md)
- [生产环境中的 Redis 是怎么部署的？](/docs/high-concurrency/redis-production-environment.md)

### 分库分表
- 为什么要分库分表（设计高并发系统的时候，数据库层面该如何设计）？用过哪些分库分表中间件？不同的分库分表中间件都有什么优点和缺点？你们具体是如何对数据库如何进行垂直拆分或水平拆分的？
- 现在有一个未分库分表的系统，未来要分库分表，如何设计才可以让系统从未分库分表动态切换到分库分表上？
- 如何设计可以动态扩容缩容的分库分表方案？
- 分库分表之后，id 主键如何处理？

### 读写分离
- 如何实现 MySQL 的读写分离？
- MySQL 主从复制原理是啥？
- 如何解决 MySQL 主从同步的延时问题？


## 高可用架构

### 高可用系统
- 如何设计一个高可用系统？

### 限流
- 如何限流？在工作中是怎么做的？说一下具体的实现？

### 熔断
- 如何进行熔断？
- 熔断框架都有哪些？具体实现原理知道吗？

### 降级
- 如何进行降级？