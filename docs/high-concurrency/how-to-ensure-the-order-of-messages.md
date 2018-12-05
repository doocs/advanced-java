## 面试题
如何保证消息的顺序性？

## 面试官心理分析
其实这个也是用 MQ 的时候必问的话题，第一看看你了不了解顺序这个事儿？第二看看你有没有办法保证消息是有顺序的？这是生产系统中常见的问题。

## 面试题剖析
我举个例子，我们以前做过一个 mysql `binlog` 同步的系统，压力还是非常大的，日同步数据要达到上亿。mysql -> mysql，常见的一点在于说大数据 team，就需要同步一个 mysql 库过来，对公司的业务系统的数据做各种复杂的操作。

你在 mysql 里增删改一条数据，对应出来了增删改 3 条 `binlog`，接着这三条 `binlog` 发送到 MQ 里面，到消费出来依次执行，起码得保证人家是按照顺序来的吧？不然本来是：增加、修改、删除；你楞是换了顺序给执行成删除、修改、增加，不全错了么。

本来这个数据同步过来，应该最后这个数据被删除了；结果你搞错了这个顺序，最后这个数据保留下来了，数据同步就出错了。

先看看顺序会错乱的俩场景：
- RabbitMQ：一个 queue，多个 consumer，这不明显乱了；

![rabbitmq-order-1](/img/rabbitmq-order-1.png)

- kafka：一个 topic，一个 partition，一个 consumer，内部多线程，这不也明显乱了。

![kafka-order-1](/img/kafka-order-1.png)

### 解决方案
#### RabbitMQ
拆分多个 queue，每个 queue 一个 consumer，就是多一些 queue 而已，确实是麻烦点；或者就一个 queue 但是对应一个 consumer，然后这个 consumer 内部用内存队列做排队，然后分发给底层不同的 worker 来处理。
![rabbitmq-order-2](/img/rabbitmq-order-2.png)

#### kafka
一个 topic，一个 partition，一个 consumer，内部单线程消费；写 N 个内存 queue，然后对于 N 个线程，每个线程分别消费一个内存 queue 即可。
![kafka-order-2](/img/kafka-order-2.png)