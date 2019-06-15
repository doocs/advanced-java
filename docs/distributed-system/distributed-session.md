## 面试题
集群部署时的分布式 session 如何实现？

## 面试官心理分析
面试官问了你一堆 dubbo 是怎么玩儿的，你会玩儿 dubbo 就可以把单块系统弄成分布式系统，然后分布式之后接踵而来的就是一堆问题，最大的问题就是**分布式事务**、**接口幂等性**、**分布式锁**，还有最后一个就是**分布式 session**。

当然了，分布式系统中的问题何止这么一点，非常之多，复杂度很高，这里只是说一下常见的几个问题，也是面试的时候常问的几个。

## 面试题剖析
session 是啥？浏览器有个 cookie，在一段时间内这个 cookie 都存在，然后每次发请求过来都带上一个特殊的 `jsessionid cookie`，就根据这个东西，在服务端可以维护一个对应的 session 域，里面可以放点数据。

一般的话只要你没关掉浏览器，cookie 还在，那么对应的那个 session 就在，但是如果 cookie 没了，session 也就没了。常见于什么购物车之类的东西，还有登录状态保存之类的。

这个不多说了，懂 Java 的都该知道这个。

单块系统的时候这么玩儿 session 没问题，但是你要是分布式系统呢，那么多的服务，session 状态在哪儿维护啊？

其实方法很多，但是常见常用的是以下几种：

### 完全不用 session
使用 JWT Token 储存用户身份，然后再从数据库或者 cache 中获取其他的信息。这样无论请求分配到哪个服务器都无所谓。

### tomcat + redis
这个其实还挺方便的，就是使用 session 的代码，跟以前一样，还是基于 tomcat 原生的 session 支持即可，然后就是用一个叫做 `Tomcat  RedisSessionManager` 的东西，让所有我们部署的 tomcat 都将 session 数据存储到 redis 即可。

在 tomcat 的配置文件中配置：

```xml
<Valve className="com.orangefunction.tomcat.redissessions.RedisSessionHandlerValve" />

<Manager className="com.orangefunction.tomcat.redissessions.RedisSessionManager"
         host="{redis.host}"
         port="{redis.port}"
         database="{redis.dbnum}"
         maxInactiveInterval="60"/>
```         

然后指定 redis 的 host 和 port 就 ok 了。

```xml
<Valve className="com.orangefunction.tomcat.redissessions.RedisSessionHandlerValve" />
<Manager className="com.orangefunction.tomcat.redissessions.RedisSessionManager"
	 sentinelMaster="mymaster"
	 sentinels="<sentinel1-ip>:26379,<sentinel2-ip>:26379,<sentinel3-ip>:26379"
	 maxInactiveInterval="60"/>
```

还可以用上面这种方式基于 redis 哨兵支持的 redis 高可用集群来保存 session 数据，都是 ok 的。

### spring session + redis
上面所说的第二种方式会与 tomcat 容器重耦合，如果我要将 web 容器迁移成 jetty，难道还要重新把 jetty 都配置一遍？

因为上面那种 tomcat + redis 的方式好用，但是会**严重依赖于web容器**，不好将代码移植到其他 web 容器上去，尤其是你要是换了技术栈咋整？比如换成了 spring cloud 或者是 spring boot 之类的呢？

所以现在比较好的还是基于 Java 一站式解决方案，也就是 spring。人家 spring 基本上承包了大部分我们需要使用的框架，spirng cloud 做微服务，spring boot 做脚手架，所以用 sping session 是一个很好的选择。

在 pom.xml 中配置：
```xml
<dependency>
  <groupId>org.springframework.session</groupId>
  <artifactId>spring-session-data-redis</artifactId>
  <version>1.2.1.RELEASE</version>
</dependency>
<dependency>
  <groupId>redis.clients</groupId>
  <artifactId>jedis</artifactId>
  <version>2.8.1</version>
</dependency>
```

在 spring 配置文件中配置：
```xml
<bean id="redisHttpSessionConfiguration"
     class="org.springframework.session.data.redis.config.annotation.web.http.RedisHttpSessionConfiguration">
    <property name="maxInactiveIntervalInSeconds" value="600"/>
</bean>

<bean id="jedisPoolConfig" class="redis.clients.jedis.JedisPoolConfig">
    <property name="maxTotal" value="100" />
    <property name="maxIdle" value="10" />
</bean>

<bean id="jedisConnectionFactory"
      class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory" destroy-method="destroy">
    <property name="hostName" value="${redis_hostname}"/>
    <property name="port" value="${redis_port}"/>
    <property name="password" value="${redis_pwd}" />
    <property name="timeout" value="3000"/>
    <property name="usePool" value="true"/>
    <property name="poolConfig" ref="jedisPoolConfig"/>
</bean>
```

在 web.xml 中配置：
```xml
<filter>
    <filter-name>springSessionRepositoryFilter</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>
<filter-mapping>
    <filter-name>springSessionRepositoryFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

示例代码：
```java
@RestController
@RequestMapping("/test")
public class TestController {

    @RequestMapping("/putIntoSession")
    public String putIntoSession(HttpServletRequest request, String username) {
        request.getSession().setAttribute("name",  "leo");
        return "ok";
    }

    @RequestMapping("/getFromSession")
    public String getFromSession(HttpServletRequest request, Model model){
        String name = request.getSession().getAttribute("name");
        return name;
    }
}
```


上面的代码就是 ok 的，给 sping session 配置基于 redis 来存储 session 数据，然后配置了一个 spring session 的过滤器，这样的话，session 相关操作都会交给 spring session 来管了。接着在代码中，就用原生的 session 操作，就是直接基于 spring sesion 从 redis 中获取数据了。

实现分布式的会话有很多种方式，我说的只不过是比较常见的几种方式，tomcat + redis 早期比较常用，但是会重耦合到 tomcat 中；近些年，通过 spring session 来实现。