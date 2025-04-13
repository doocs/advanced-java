import { defineConfig } from "vitepress";

export default defineConfig({
  title: "advanced-java",
  ignoreDeadLinks: true,
  themeConfig: {
    search: {
      provider: 'local'
    },
    footer: {
      message: 'Released under the CC-BY-SA-4.0 license.',
      copyright: `Copyright © 2018-${new Date().getFullYear()} <a href="https://github.com/doocs">Doocs</a>`
    },
    logo: '/icon.png',
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    editLink: {
      pattern: 'https://github.com/doocs/advanced-java/edit/main/docs/:path',
      text: '在 GitHub 编辑'
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "高并发架构", link: "/high-concurrency/mq-interview.md" },
      {
        text: "分布式系统",
        link: "/distributed-system/distributed-system-interview.md",
      },
      {
        text: "高可用架构",
        link: "/high-availability/hystrix-introduction.md",
      },
      {
        text: "微服务架构",
        link: "/micro-services/microservices-introduction.md",
      },
      { text: "海量数据处理", link: "/big-data/find-common-urls.md" },
    ],

    sidebar: [
      {
        text: "高并发架构",
        collapsed: true,
        items: [
          {
            text: "消息队列",
            link: "/high-concurrency/mq-interview.md",
            collapsed: true,
            items: [
              {
                text: "为什么使用消息队列？",
                link: "/high-concurrency/why-mq.md",
              },
              {
                text: "如何保证消息队列的高可用？",
                link: "/high-concurrency/how-to-ensure-high-availability-of-message-queues.md",
              },
              {
                text: "如何保证消息不被重复消费？",
                link: "/high-concurrency/how-to-ensure-that-messages-are-not-repeatedly-consumed.md",
              },
              {
                text: "如何保证消息的可靠性传输？",
                link: "/high-concurrency/how-to-ensure-the-reliable-transmission-of-messages.md",
              },
              {
                text: "如何保证消息的顺序性？",
                link: "/high-concurrency/how-to-ensure-the-order-of-messages.md",
              },
              {
                text: "如何解决消息队列的延时及过期问题？",
                link: "/high-concurrency/mq-time-delay-and-expired-failure.md",
              },
              {
                text: "如何设计一个消息队列？",
                link: "/high-concurrency/mq-design.md",
              },
            ],
          },
          {
            text: "搜索引擎",
            collapsed: true,
            link: "/high-concurrency/es-introduction.md",
            items: [
              {
                text: "ES 的分布式架构原理",
                link: "/high-concurrency/es-architecture.md",
              },
              {
                text: "ES 写入数据原理",
                link: "/high-concurrency/es-write-query-search.md",
              },
              {
                text: "ES 查询性能优化",
                link: "/high-concurrency/es-optimizing-query-performance.md",
              },
              {
                text: "ES 生产集群架构",
                link: "/high-concurrency/es-production-cluster.md",
              },
            ],
          },
          {
            text: "缓存",
            collapsed: true,
            items: [
              {
                text: "缓存的使用方式",
                link: "/high-concurrency/why-cache.md",
              },
              {
                text: "Redis 和 Memcached 区别",
                link: "/high-concurrency/redis-single-thread-model.md",
              },
              {
                text: "Redis 数据类型和场景",
                link: "/high-concurrency/redis-data-types.md",
              },
              {
                text: "Redis 过期策略",
                link: "/high-concurrency/redis-expiration-policies-and-lru.md",
              },
              {
                text: "Redis 高并发与高可用",
                link: "/high-concurrency/how-to-ensure-high-concurrency-and-high-availability-of-redis.md",
              },
              {
                text: "Redis 主从架构",
                link: "/high-concurrency/redis-master-slave.md",
              },
              {
                text: "Redis 持久化机制",
                link: "/high-concurrency/redis-persistence.md",
              },
              {
                text: "哨兵集群实现高可用",
                link: "/high-concurrency/redis-sentinel.md",
              },
              {
                text: "Redis 集群模式原理",
                link: "/high-concurrency/redis-cluster.md",
              },
              {
                text: "缓存雪崩穿透击穿",
                link: "/high-concurrency/redis-caching-avalanche-and-caching-penetration.md",
              },
              {
                text: "缓存与数据库一致性",
                link: "/high-concurrency/redis-consistence.md",
              },
              {
                text: "Redis 并发竞争问题",
                link: "/high-concurrency/redis-cas.md",
              },
              {
                text: "Redis 生产部署方案",
                link: "/high-concurrency/redis-production-environment.md",
              },
            ],
          },
          {
            text: "分库分表",
            collapsed: true,
            items: [
              {
                text: "为什么要分库分表？",
                link: "/high-concurrency/database-shard.md",
              },
              {
                text: "分库分表如何平滑过渡？",
                link: "/high-concurrency/database-shard-method.md",
              },
              {
                text: "动态扩缩容方案",
                link: "/high-concurrency/database-shard-dynamic-expand.md",
              },
              {
                text: "主键 ID 如何处理？",
                link: "/high-concurrency/database-shard-global-id-generate.md",
              },
            ],
          },
          {
            text: "读写分离",
            items: [
              {
                text: "如何实现读写分离？",
                link: "/high-concurrency/mysql-read-write-separation.md",
              },
            ],
          },
          {
            text: "高并发系统",
            items: [
              {
                text: "如何设计一个高并发系统？",
                link: "/high-concurrency/high-concurrency-design.md",
              },
            ],
          },
          {
            text: "限流",
            items: [
              {
                text: "限流实现方式",
                link: "/high-concurrency/how-to-limit-current.md",
              },
            ],
          },
        ],
      },
      {
        text: "分布式系统",
        collapsed: true,
        items: [
          {
            text: "面试连环炮",
            link: "/distributed-system/distributed-system-interview.md",
          },
          {
            text: "系统拆分",
            items: [
              {
                text: "为什么要拆分系统？",
                link: "/distributed-system/why-dubbo.md",
              },
            ],
          },
          {
            text: "分布式服务框架",
            collapsed: true,
            items: [
              {
                text: "Dubbo 工作原理",
                link: "/distributed-system/dubbo-operating-principle.md",
              },
              {
                text: "Dubbo 序列化协议",
                link: "/distributed-system/dubbo-serialization-protocol.md",
              },
              {
                text: "Dubbo 负载与容错策略",
                link: "/distributed-system/dubbo-load-balancing.md",
              },
              {
                text: "Dubbo 的 SPI 思想",
                link: "/distributed-system/dubbo-spi.md",
              },
              {
                text: "服务治理方案",
                link: "/distributed-system/dubbo-service-management.md",
              },
              {
                text: "接口幂等性设计",
                link: "/distributed-system/distributed-system-idempotency.md",
              },
              {
                text: "接口顺序性设计",
                link: "/distributed-system/distributed-system-request-sequence.md",
              },
              {
                text: "设计 Dubbo 类似的 RPC 框架",
                link: "/distributed-system/dubbo-rpc-design.md",
              },
              {
                text: "CAP 定理中的 P 是什么？",
                link: "/distributed-system/distributed-system-cap.md",
              },
            ],
          },
          {
            text: "分布式锁",
            collapsed: true,
            items: [
              {
                text: "Zookeeper 应用场景",
                link: "/distributed-system/zookeeper-application-scenarios.md",
              },
              {
                text: "Redis vs Zookeeper 实现分布式锁",
                link: "/distributed-system/distributed-lock-redis-vs-zookeeper.md",
              },
            ],
          },
          {
            text: "分布式事务",
            items: [
              {
                text: "分布式事务原理",
                link: "/distributed-system/distributed-transaction.md",
              },
            ],
          },
          {
            text: "分布式会话",
            items: [
              {
                text: "如何实现分布式 Session？",
                link: "/distributed-system/distributed-session.md",
              },
            ],
          },
        ],
      },
      {
        text: "高可用架构",
        collapsed: true,
        items: [
          {
            text: "Hystrix 高可用",
            collapsed: true,
            items: [
              {
                text: "Hystrix 介绍",
                link: "/high-availability/hystrix-introduction.md",
              },
              {
                text: "详情页架构设计",
                link: "/high-availability/e-commerce-website-detail-page-architecture.md",
              },
              {
                text: "线程池隔离",
                link: "/high-availability/hystrix-thread-pool-isolation.md",
              },
              {
                text: "信号量隔离",
                link: "/high-availability/hystrix-semphore-isolation.md",
              },
              {
                text: "细粒度隔离策略",
                link: "/high-availability/hystrix-execution-isolation.md",
              },
              {
                text: "执行原理",
                link: "/high-availability/hystrix-process.md",
              },
              {
                text: "Request Cache 缓存",
                link: "/high-availability/hystrix-request-cache.md",
              },
              {
                text: "本地降级缓存",
                link: "/high-availability/hystrix-fallback.md",
              },
              {
                text: "断路器原理",
                link: "/high-availability/hystrix-circuit-breaker.md",
              },
              {
                text: "限流与线程池隔离",
                link: "/high-availability/hystrix-thread-pool-current-limiting.md",
              },
              {
                text: "Timeout 保护机制",
                link: "/high-availability/hystrix-timeout.md",
              },
            ],
          },
          {
            text: "熔断与降级",
            items: [
              {
                text: "Sentinel vs Hystrix",
                link: "/high-availability/sentinel-vs-hystrix.md",
              },
            ],
          },
        ],
      },
      {
        text: "微服务架构",
        collapsed: true,
        items: [
          {
            text: "微服务概念",
            collapsed: true,
            items: [
              {
                text: "微服务架构描述",
                link: "/micro-services/microservices-introduction.md",
              },
              {
                text: "从单体到微服务",
                link: "/micro-services/migrating-from-a-monolithic-architecture-to-a-microservices-architecture.md",
              },
              {
                text: "事件驱动数据管理",
                link: "/micro-services/event-driven-data-management-for-microservices.md",
              },
              {
                text: "选择部署策略",
                link: "/micro-services/choose-microservice-deployment-strategy.md",
              },
            ],
          },
          {
            text: "Spring Cloud 架构",
            collapsed: true,
            items: [
              {
                text: "微服务间通信机制",
                link: "/micro-services/what's-microservice-how-to-communicate.md",
              },
              {
                text: "微服务技术栈",
                link: "/micro-services/micro-services-technology-stack.md",
              },
              {
                text: "微服务治理策略",
                link: "/micro-services/micro-service-governance.md",
              },
              {
                text: "Eureka 服务注册发现",
                link: "/micro-services/how-eureka-enable-service-discovery-and-service-registration.md",
              },
            ],
          },
        ],
      },
      {
        text: "海量数据处理",
        collapsed: true,
        items: [
          { text: "查找相同 URL", link: "/big-data/find-common-urls.md" },
          { text: "查找高频词", link: "/big-data/find-top-100-words.md" },
          { text: "找出最多访问 IP", link: "/big-data/find-top-1-ip.md" },
          {
            text: "找出不重复整数",
            link: "/big-data/find-no-repeat-number.md",
          },
          {
            text: "判断数是否存在",
            link: "/big-data/find-a-number-if-exists.md",
          },
          {
            text: "查询最热门查询串",
            link: "/big-data/find-hotest-query-string.md",
          },
          {
            text: "统计不同手机号",
            link: "/big-data/count-different-phone-numbers.md",
          },
          {
            text: "找出中位数",
            link: "/big-data/find-mid-value-in-500-millions.md",
          },
          {
            text: "根据频率排序查询串",
            link: "/big-data/sort-the-query-strings-by-counts.md",
          },
          {
            text: "找出前 500 个数",
            link: "/big-data/find-rank-top-500-numbers.md",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/doocs/advanced-java" },
    ],
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png' }],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-GWYHFTEDNE' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-GWYHFTEDNE');`
    ]
  ],
  cleanUrls: true,
  sitemap: {
    hostname: 'https://java.doocs.org'
  }
});
