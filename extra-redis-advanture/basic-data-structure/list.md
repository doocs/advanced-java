# **Redis 基础数据结构**

## **list (列表)**

- Redis 的列表相当于 Java 语言里面的 LinkedList，注意它是**链表**而不是数组。
- list 的**插入和删除操作非常快**，时间复杂度为 O(1)，但是**索引定位很慢**，时间复杂度为 O(n)。
- 当列表弹出了最后一个元素之后，该数据结构**自动被删除，内存被回收**。
- Redis 的列表结构常用来做**异步队列**使用。将需要延后处理的任务结构体**序列化成字符串**塞进 Redis 的列表，另一个线程从这个列表中轮询数据进行处理。

### **右边进左边出:队列**
```bash
> rpush books python java golang (integer) 3
> llen books
(integer) 3
> lpop books "python"
> lpop books "java"
> lpop books "golang"
> lpop books (nil)
```

### **右边进右边出:栈**
```bash
> rpush books python java golang (integer) 3
> rpop books
"golang"
> rpop books "java"
> rpop books "python"
> rpop books
(nil)
```

### **慢操作**
- lindex 相当于 Java 链表的 **get(int index)** 方法，它需要对链表进行遍历，性能随着参数 index 增大而变差。
- ltrim 跟两个参数 **start_index** 和 **end_index** 定义一个区间，区间内的值保留，区间之外砍掉。可以通过 ltrim 实现定长链表。
- index 可以为负数，index=-1 表示倒数第一个元素。

```bash
> rpush books python java golang 
(integer) 3
> lindex books 1 # O(n) 慎用 
"java"
>
> lrange books 0 -1 # 获取所有元素，O(n) 慎用 
1) "python"
2) "java"
3) "golang"
>
> ltrim books 1 -1 # O(n) 慎用 
OK
> lrange books 0 -1
1) "java"
2) "golang"
>
> ltrim books 1 0 # 这其实是清空了整个列表，因为区间范围长度为负 
OK
> llen books
(integer) 0
```

### **快速列表**
- Redis 底层存储的不是一个简单的 linkedlist，而是称之为快速链表 **quicklist** 的一个结构。
- 在列表元素较少的情况下会使用一块**连续的内存**存储，这个结构是 **ziplist**，也即是压缩列表。它将所有的元素紧挨着一起存储，分配的是一块连续的内存。
- 当数据量比较多的时候才会改成 quicklist。

> **redis 列表的内部实现**：[列表的内部实现](../ziplist-and-quicklist.md)
