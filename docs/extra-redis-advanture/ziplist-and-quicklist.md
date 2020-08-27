# **「压缩列表」内部**

## **I. 基本结构**

Redis 为了节约内存空间使用，zset 和 hash 容器对象在元素个数较少的时候，采用**压缩列表 (ziplist)** 进行存储。压缩列表是一块**连续的内存空间**，元素之间紧挨着存储，没有任何冗余空隙。

```bash
> zadd programmings 1.0 go 2.0 python 3.0 java
(integer) 3
> debug object programmings
Value at:0x7fec2de00020 refcount:1 encoding:ziplist serializedlength:36 lru:6022374 lru_seconds_idle:6 
>
> hmset books go fast python slow java fast
OK
> debug object books
Value at:0x7fec2de000c0 refcount:1 encoding:ziplist serializedlength:48 lru:6022478 lru_seconds_idle:1
```

这里，注意观察 debug object 输出的 encoding 字段都是 ziplist，这就表示内部采用压缩列表结构进行存储。

## **II. 查找过程**

设想如果跳跃列表只有一层会怎样?插入删除操作需要定位到相应的位置节点 (定位到 最后一个比「我」小的元素，也就是第一个比「我」大的元素的前一个)，定位的效率肯定比 较差，复杂度将会是 O(n)，因为需要挨个遍历。跳跃列表有了多层结构之后，这个定位的算法复杂度将会降到O(lg(n))。

## **III. 随机层数**

对于每一个新插入的节点，都需要调用一个随机算法给它分配一个合理的层数。
[redis interview 随机层数](../../extra-redis-interview/redis-interview.md)

## **IV. 插入过程**

首先我们在搜索合适插入点的过程中将「搜索路径」摸出来了，然后就可以开始创建新 节点了，创建的时候需要给这个节点随机分配一个层数，再将搜索路径上的节点和这个新节 点通过前向后向指针串起来。如果分配的新节点的高度高于当前跳跃列表的最大高度，就需 要更新一下跳跃列表的最大高度。

```C
// 源码
/* Insert a new node in the skiplist. Assumes the element does not already 
 * exist (up to the caller to enforce that). The skiplist takes ownership 
 * of the passed SDS string 'ele'. */
zskiplistNode *zslInsert(zskiplist *zsl, double score, sds ele) {
    // 存储搜索路径
    zskiplistNode *update[ZSKIPLIST_MAXLEVEL], *x;
    // 存储经过的节点跨度
    unsigned int rank[ZSKIPLIST_MAXLEVEL]; 
    int i, level;

    serverAssert(!isnan(score));
    x = zsl->header;
    // 逐步降级寻找目标节点，得到「搜索路径」 
    for (i = zsl->level-1; i >= 0; i--) {
        /* store rank that is crossed to reach the insert position */
        rank[i] = i == (zsl->level-1) ? 0 : rank[i+1];
        // 如果 score 相等，还需要比较 value
        while (x->level[i].forward && (x->level[i].forward->score < score ||
                (x->level[i].forward->score == score && sdscmp(x->level[i].forward->ele,ele) < 0)))
        {
            rank[i] += x->level[i].span;
            x = x->level[i].forward; 
        }
        update[i] = x; 
    }
    // 正式进入插入过程
    /* we assume the element is not already inside, since we allow duplicated
     * scores, reinserting the same element should never happen since the
     * caller of zslInsert() should test in the hash table if the element is 
     * already inside or not. */
    // 随机一个层数
    level = zslRandomLevel();
    // 填充跨度
    if (level > zsl->level) {
        for (i = zsl->level; i < level; i++) {
            rank[i] = 0;
            update[i] = zsl->header; 
            update[i]->level[i].span = zsl->length;
        }
        // 更新跳跃列表的层高
        zsl->level = level; 
    }
    // 创建新节点
    x = zslCreateNode(level,score,ele);
    // 重排一下前向指针
    for (i = 0; i < level; i++) {
        x->level[i].forward = update[i]->level[i].forward; 
        update[i]->level[i].forward = x;

        /* update span covered by update[i] as x is inserted here */
        x->level[i].span = update[i]->level[i].span - (rank[0] - rank[i]); 
        update[i]->level[i].span = (rank[0] - rank[i]) + 1;
    }

    /* increment span for untouched levels */
    for (i = level; i < zsl->level; i++) { 
        update[i]->level[i].span++;
    }
    // 重排一下后向指针
    x->backward = (update[0] == zsl->header) ? NULL : update[0]; 
    if (x->level[0].forward)
        x->level[0].forward->backward = x; 
    else
        zsl->tail = x; 
    zsl->length++;
    return x; 
}
```

## **V. 删除过程**

删除过程和插入过程类似，都需先把这个「搜索路径」找出来。然后对于每个层的相关 节点都重排一下前向后向指针就可以了。同时还要注意更新一下最高层数 maxLevel。

## **更新过程**

当我们调用 zadd 方法时，如果对应的 value 不存在，那就是插入过程。如果这个 value 已经存在了，只是调整一下 score 的值，那就需要走一个更新的流程。假设这个新的 score 值不会带来排序位置上的改变，那么就不需要调整位置，直接修改元素的 score 值就可以了。但是如果排序位置改变了，那就要调整位置。

```C
/* Remove and re-insert when score changes. */
    if (score != curscore) {
        zskiplistNode *node; 
        serverAssert(zslDelete(zs->zsl,curscore,ele,&node));
        znode = zslInsert(zs->zsl,score,node->ele);
        /* We reused the node->ele SDS string, free the node now 
         * since zslInsert created a new one. */
        node->ele = NULL;
        zslFreeNode(node);
        /* Note that we did not removed the original element from 
         * the hash table representing the sorted set, so we just 
         * update the score. */
        dictGetVal(de) = &znode->score; /* Update score ptr. */
        *flags |= ZADD_UPDATED;
    }
    return 1;
```

一个简单的策略就是先删除这个元素，再插入这个元素，需要经过两次路径搜索。Redis 就是这么干的。 不过 Redis 遇到 score 值改变了就直接删除再插入，不会去判断位置是否需要调整，从这点看，Redis 的 zadd 的代码似乎还有优化空间。