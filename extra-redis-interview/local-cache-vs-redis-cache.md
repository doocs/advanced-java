# **进程内缓存与分布式缓存的比较**

> 参考: http://gocwind.com/blog/2015/04/08/in-processes-vs-distributed-caching/  
> 参考: https://dzone.com/articles/process-caching-vs-distributed

首先来看一下二者的定义。顾名思义，**进程内缓存是与应用程序在相同地址空间的缓存**。Google Guava 是一个提供了简单进程内缓存 API 的很好的例子。另一方面，**分布式缓存是应用程序的外部扩展**，通常部署在多个节点上，共同构成一个大的逻辑缓存。Memcached 是一个流行的分布式缓存。Terracotta 公司的 Ehcache 则是一个通过配置可以以任一种方式使用的缓存产品。

## **I. 一致性**
### **进程内缓存**
当使用进程内缓存时，**缓存元素是特定应用程序实例本地的**。然而，许多中到大型应用通常会做负载均衡，从而不存在一个作为整体的独立应用。在这种情况下，很可能会构建出一个**有多少应用实例就有多少缓存**的解决方案，每个缓存都有各自的状态，这就导致了**不一致性**。随着缓存元素的过期或被逐出，所有缓存实例间可能达到最终一致性。

### **分布式缓存**
分布式缓存，虽然部署在由**多个节点构成的集群上**，会提供一个**单一缓存的逻辑视图（以及状态）**。多数情况下，分布式缓存中的对象将会存在于集群中的单个节点。通过哈希算法，缓存引擎总是可以判断出某个键值对位于哪个特定节点。**由于整个集群总是会有一个特定状态，所以从来不会存在不一致的情况**。

### **备注**
如果你需要**缓存不变的对象**，一致性将不是一个问题。在这种情况下，进程内缓存是一个更好的解决方案，因为它没有分布式缓存的典型管理开销。如果你的应用部署在多个节点上，想要**缓存可变的对象**同时需要**每次读都是一致**的而不仅仅满足最终一致性，则应当采用分布式缓存。

## **II. 开销**
### **进程内缓存**
进程内缓存可能会影响垃圾回收进而影响系统性能。而这将会由**缓存大小以及对象逐出和过期的频率**决定。

### **分布式缓存**
分布式缓存有两大主要开销会导致其慢于进程内缓存（但优于无缓存方案）：**网络延迟和对象序列化**。

### **备注**
正如之前所提到的，如果你试图寻求**一个多节点部署情况下的强一致性缓存解决方案**，采用分布式缓存。

## **III. 可靠性**
### **进程内缓存**
进程内缓存使用与应用程序相同的堆空间，因此必须非常小心地决定缓存所能**使用的内存大小上限**。如果应用程序用光了内存，**想要试图恢复并不容易**。

### **分布式缓存**
分布式缓存作为多个节点的独立进程运行，因此单点故障并不会导致缓存失效。丢失的缓存元素将会在下一次缓存未命中时进入存活的节点。分布式缓存情况下，缓存整体失效的最坏后果是降低系统性能，而不是导致系统整体故障。

### **备注**
进程内缓存适用于**较小且频率可预见的访问场景**，尤其适用于不变对象。对于**较大且不可预见的规模的访问**，最好采用分布式缓存。

## **IV. 建议**
对于不变对象的较小规模的、可预见次数的访问，进程内缓存是一个理想解决方案，性能上它优于分布式缓存。然而，对于**要缓存的对象数量是未知的并且较大的情况下**，同时要求读一致性，分布式缓存是一个更好的解决方案，尽管它可能具备与进程内缓存相同的性能。自不用说，**应用程序可以同时应用两种类型的缓存**，取决于最适用的应用场景。

> ## **Recommendation**  
> For a ***small, predictable number of preferably immutable objects*** that have to be read multiple times, an in-process cache is a good solution because it will perform better than a distributed cache. However, for cases in which the number of objects that can be or should be cached is ***unpredictable and large, and consistency of reads is a must-have***, a distributed cache is perhaps a better solution even though it may not bring the same performance benefits as an in-process cache. It goes without saying that your application ***can use both schemes for different types of objects*** depending on what suits the scenario best.