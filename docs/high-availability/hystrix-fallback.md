## 基于本地缓存的 fallback 降级机制
Hystrix 出现以下四种情况，都会去调用 fallback 降级机制：

- 断路器处于打开的状态。
- 资源池已满（线程池+队列 / 信号量）。
- Hystrix 调用各种接口，或者访问外部依赖，比如 MySQL、Redis、Zookeeper、Kafka 等等，出现了任何异常的情况。
- 访问外部依赖的时候，访问时间过长，报了 TimeoutException 异常。

### 两种最经典的降级机制

- 纯内存数据<br>
在降级逻辑中，你可以在内存中维护一个 ehcache，作为一个纯内存的基于 LRU 自动清理的缓存，让数据放在缓存内。如果说外部依赖有异常，fallback 这里直接尝试从 ehcache 中获取数据。

- 默认值<br>
fallback 降级逻辑中，也可以直接返回一个默认值。

在 `HystrixCommand`，降级逻辑的书写，是通过实现 getFallback() 接口；而在 `HystrixObservableCommand` 中，则是实现 resumeWithFallback() 方法。


现在，我们用一个简单的栗子，来演示 fallback 降级是怎么做的。

比如，有这么个**场景**。我们现在有个包含 brandId 的商品数据，假设正常的逻辑是这样：拿到一个商品数据，根据 brandId 去调用品牌服务的接口，获取品牌的最新名称 brandName。

假如说，品牌服务接口挂掉了，那么我们可以尝试从本地内存中，获取一份稍过期的数据，先凑合着用。

### 步骤一：本地缓存获取数据
本地获取品牌名称的代码大致如下。

```java
/**
 * 品牌名称本地缓存
 *
 */

public class BrandCache {

    private static Map<Long, String> brandMap = new HashMap<>();

    static {
        brandMap.put(1L, "Nike");
    }

    /**
     * brandId 获取 brandName
     *
     * @param brandId 品牌id
     * @return 品牌名
     */
    public static String getBrandName(Long brandId) {
        return brandMap.get(brandId);
    }
```

### 步骤二：实现 GetBrandNameCommand
在 GetBrandNameCommand 中，run() 方法的正常逻辑是去调用品牌服务的接口获取到品牌名称，如果调用失败，报错了，那么就会去调用 fallback 降级机制。

这里，我们直接**模拟接口调用报错**，给它抛出个异常。

而在 getFallback() 方法中，就是我们的**降级逻辑**，我们直接从本地的缓存中，**获取到品牌名称**的数据。

```java
/**
 * 获取品牌名称的command
 *
 */

public class GetBrandNameCommand extends HystrixCommand<String> {

    private Long brandId;

    public GetBrandNameCommand(Long brandId) {
        super(Setter.withGroupKey(HystrixCommandGroupKey.Factory.asKey("BrandService"))
                .andCommandKey(HystrixCommandKey.Factory.asKey("GetBrandNameCommand"))
                .andCommandPropertiesDefaults(HystrixCommandProperties.Setter()
                        // 设置降级机制最大并发请求数
                        .withFallbackIsolationSemaphoreMaxConcurrentRequests(15)));
        this.brandId = brandId;
    }

    @Override
    protected String run() throws Exception {
        // 这里正常的逻辑应该是去调用一个品牌服务的接口获取名称
        // 如果调用失败，报错了，那么就会去调用fallback降级机制

        // 这里我们直接模拟调用报错，抛出异常
        throw new Exception();
    }

    @Override
    protected String getFallback() {
        return BrandCache.getBrandName(brandId);
    }
}
```

`FallbackIsolationSemaphoreMaxConcurrentRequests` 用于设置 fallback 最大允许的并发请求量，默认值是 10，是通过 semaphore 信号量的机制去限流的。如果超出了这个最大值，那么直接 reject。

### 步骤三：CacheController 调用接口
在 CacheController 中，我们通过 productInfo 获取 brandId，然后创建 GetBrandNameCommand 并执行，去尝试获取 brandName。这里执行会报错，因为我们在 run() 方法中直接抛出异常，Hystrix 就会去调用 getFallback() 方法走降级逻辑。

```java
@Controller
public class CacheController {

    @RequestMapping("/getProductInfo")
    @ResponseBody
    public String getProductInfo(Long productId) {
        HystrixCommand<ProductInfo> getProductInfoCommand = new GetProductInfoCommand(productId);

        ProductInfo productInfo = getProductInfoCommand.execute();
        Long brandId = productInfo.getBrandId();

        HystrixCommand<String> getBrandNameCommand = new GetBrandNameCommand(brandId);

        // 执行会抛异常报错，然后走降级
        String brandName = getBrandNameCommand.execute();
        productInfo.setBrandName(brandName);

        System.out.println(productInfo);
        return "success";
    }
}
```

关于降级逻辑的演示，基本上就结束了。