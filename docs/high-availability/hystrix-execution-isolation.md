## Hystrix 隔离策略细粒度控制
Hystrix 实现资源隔离，有两种策略：

- 线程池隔离
- 信号量隔离

对资源隔离这一块东西，其实可以做一定细粒度的一些控制。

### execution.isolation.strategy
指定了 HystrixCommand.run() 的资源隔离策略：`THREAD` or `SEMAPHORE`，一种基于线程池，一种基于信号量。

```java
// to use thread isolation
HystrixCommandProperties.Setter().withExecutionIsolationStrategy(ExecutionIsolationStrategy.THREAD)

// to use semaphore isolation
HystrixCommandProperties.Setter().withExecutionIsolationStrategy(ExecutionIsolationStrategy.SEMAPHORE)
```

线程池机制，每个 command 运行在一个线程中，限流是通过线程池的大小来控制的；信号量机制，command 是运行在调用线程中，通过信号量的容量来进行限流。

如何在线程池和信号量之间做选择？

**默认的策略**就是线程池。

**线程池**其实最大的好处就是对于网络访问请求，如果有超时的话，可以避免调用线程阻塞住。

而使用信号量的场景，通常是针对超大并发量的场景下，每个服务实例每秒都几百的 `QPS`，那么此时你用线程池的话，线程一般不会太多，可能撑不住那么高的并发，如果要撑住，可能要耗费大量的线程资源，那么就是用信号量，来进行限流保护。一般用信号量常见于那种基于纯内存的一些业务逻辑服务，而不涉及到任何网络访问请求。

### command key & command group
我们使用线程池隔离，要怎么对**依赖服务**、**依赖服务接口**、**线程池**三者做划分呢？

每一个 command，都可以设置一个自己的名称 command key，同时可以设置一个自己的组 command group。
```java
private static final Setter cachedSetter = Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("ExampleGroup"))
                                                .andCommandKey(HystrixCommandKey.Factory.asKey("HelloWorld")); 

public CommandHelloWorld(String name) {
    super(cachedSetter);
    this.name = name;
}
```

command group 是一个非常重要的概念，默认情况下，就是通过 command group 来定义一个线程池的，而且还会通过 command group 来聚合一些监控和报警信息。同一个 command group 中的请求，都会进入同一个线程池中。

### command thread pool
ThreadPoolKey 代表了一个 HystrixThreadPool，用来进行统一监控、统计、缓存。默认的 ThreadPoolKey 就是 command group 的名称。每个 command 都会跟它的 ThreadPoolKey 对应的 ThreadPool 绑定在一起。

如果不想直接用 command group，也可以手动设置 ThreadPool 的名称。
```java
private static final Setter cachedSetter = Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("ExampleGroup"))
                                                .andCommandKey(HystrixCommandKey.Factory.asKey("HelloWorld"))
                                                .andThreadPoolKey(HystrixThreadPoolKey.Factory.asKey("HelloWorldPool"));

public CommandHelloWorld(String name) {
    super(cachedSetter);
    this.name = name;
}
```

### command key & command group & command thread pool
**command key** ，代表了一类 command，一般来说，代表了底层的依赖服务的一个接口。

**command group** ，代表了某一个底层的依赖服务，这是很合理的，一个依赖服务可能会暴露出来多个接口，每个接口就是一个 command key。command group 在逻辑上去组织起来一堆 command key 的调用、统计信息、成功次数、timeout 超时次数、失败次数等，可以看到某一个服务整体的一些访问情况。一般来说，**推荐**根据一个服务区划分出一个线程池，command key 默认都是属于同一个线程池的。

比如说你以一个服务为粒度，估算出来这个服务每秒的所有接口加起来的整体 `QPS` 在 100 左右，你调用这个服务，当前这个服务部署了 10 个服务实例，每个服务实例上，其实用这个 command group 对应这个服务，给一个线程池，量大概在 10 个左右就可以了，你对整个服务的整体的访问 QPS 就大概在每秒 100 左右。

但是，如果说 command group 对应了一个服务，而这个服务暴露出来的几个接口，访问量很不一样，差异非常之大。你可能就希望在这个服务 command group 内部，包含的对应多个接口的 command key，做一些细粒度的资源隔离。就是说，对同一个服务的不同接口，使用不同的线程池。

```
command key -> command group

command key -> 自己的 thread pool key
```

逻辑上来说，多个 command key 属于一个command group，在做统计的时候，会放在一起统计。每个 command key 有自己的线程池，每个接口有自己的线程池，去做资源隔离和限流。

说白点，就是说如果你的 command key 要用自己的线程池，可以定义自己的 thread pool key，就 ok 了。

### coreSize
设置线程池的大小，默认是 10。一般来说，用这个默认的 10 个线程大小就够了。
```java
HystrixThreadPoolProperties.Setter().withCoreSize(int value);
```

### queueSizeRejectionThreshold
如果说线程池中的 10 个线程都在工作中，没有空闲的线程来做其它的事情，此时再有请求过来，会先进入队列积压。如果说队列积压满了，再有请求过来，就直接 reject，拒绝请求，执行 fallback 降级的逻辑，快速返回。

![hystrix-thread-pool-queue](/images/hystrix-thread-pool-queue.png)

控制 queue 满了之后 reject 的 threshold，因为 maxQueueSize 不允许热修改，因此提供这个参数可以热修改，控制队列的最大大小。

```java
HystrixThreadPoolProperties.Setter().withQueueSizeRejectionThreshold(int value);
```

### execution.isolation.semaphore.maxConcurrentRequests
设置使用 SEMAPHORE 隔离策略的时候允许访问的最大并发量，超过这个最大并发量，请求直接被 reject。

这个并发量的设置，跟线程池大小的设置，应该是类似的，但是基于信号量的话，性能会好很多，而且 Hystrix 框架本身的开销会小很多。

默认值是 10，尽量设置的小一些，因为一旦设置的太大，而且有延时发生，可能瞬间导致 tomcat 本身的线程资源被占满。

```java
HystrixCommandProperties.Setter().withExecutionIsolationSemaphoreMaxConcurrentRequests(int value);
```