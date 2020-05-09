# 什么是微服务？微服务之间是如何独立通讯的？

* Author: [HuiFer](https://github.com/huifer)
* Description: 介绍微服务的定义以及服务间的通信。

## 什么是微服务

* 微服务架构是一个分布式系统, 按照业务进行划分成为不同的服务单元, 解决单体系统性能等不足。
* 微服务是一种架构风格，一个大型软件应用由多个服务单元组成。系统中的服务单元可以单独部署，各个服务单元之间是松耦合的。

> 微服务概念起源:  [Microservices](https://martinfowler.com/articles/microservices.html)

## 微服务之间是如何独立通讯的

### 同步

#### REST HTTP 协议

REST 请求在微服务中是最为常用的一种通讯方式, 它依赖于 HTTP\HTTPS 协议。RESTFUL 的特点是：

1\. 每一个 URI 代表 1 种资源
2\. 客户端使用 GET、POST、PUT、DELETE 4 个表示操作方式的动词对服务端资源进行操作:  GET 用来获取资源, POST 用来新建资源\(也可以用于更新资源\), PUT 用来更新资源, DELETE 用来删除资源
3\. 通过操作资源的表现形式来操作资源
4\. 资源的表现形式是 XML 或者 HTML
5\. 客户端与服务端之间的交互在请求之间是无状态的,从客户端到服务端的每个请求都必须包含理解请求所必需的信息

举个例子，有一个服务方提供了如下接口：

``` java
@RestController
@RequestMapping("/communication")
public class RestControllerDemo {
    @GetMapping("/hello")
    public String s() {
        return "hello";
    }
}
```

另外一个服务需要去调用该接口，调用方只需要根据 API 文档发送请求即可获取返回结果。

``` java
@RestController
@RequestMapping("/demo")
public class RestDemo{
    @Autowired
    RestTemplate restTemplate;

    @GetMapping("/hello2")
    public String s2() {
        String forObject = restTemplate.getForObject("http://localhost:9013/communication/hello", String.class);
        return forObject;
    }
}
```

通过这样的方式可以实现服务之间的通讯。

#### RPC TCP协议

RPC(Remote Procedure Call)远程过程调用，简单的理解是一个节点请求另一个节点提供的服务。它的工作流程是这样的：

1\. 执行客户端调用语句，传送参数
2\. 调用本地系统发送网络消息
3\. 消息传送到远程主机
4\. 服务器得到消息并取得参数
5\. 根据调用请求以及参数执行远程过程（服务）
6\. 执行过程完毕，将结果返回服务器句柄
7\. 服务器句柄返回结果，调用远程主机的系统网络服务发送结果
8\. 消息传回本地主机
9\. 客户端句柄由本地主机的网络服务接收消息
10. 客户端接收到调用语句返回的结果数据

举个例子。

首先需要一个服务端：

``` java

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.Method;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * RPC 服务端用来注册远程方法的接口和实现类
 * @Date: 2019-11-04
 */
public class RPCServer {
    private static ExecutorService executor = Executors.newFixedThreadPool(Runtime.getRuntime().availableProcessors());

    private static final ConcurrentHashMap<String, Class> serviceRegister = new ConcurrentHashMap<>();

    /**
     * 注册方法
     * @param service
     * @param impl
     */
    public void register(Class service, Class impl) {
        serviceRegister.put(service.getSimpleName(), impl);
    }

    /**
     * 启动方法
     * @param port
     */
    public void start(int port) {
        ServerSocket socket = null;
        try {
            socket = new ServerSocket();
            socket.bind(new InetSocketAddress(port));
            System.out.println("服务启动");
            System.out.println(serviceRegister);
            while (true) {
                executor.execute(new Task(socket.accept()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (socket != null) {
                try {
                    socket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private static class Task implements Runnable {
        Socket client = null;

        public Task(Socket client) {
            this.client = client;
        }

        @Override
        public void run() {
            ObjectInputStream input = null;
            ObjectOutputStream output = null;
            try {
                input = new ObjectInputStream(client.getInputStream());
                // 按照顺序读取对方写过来的内容
                String serviceName = input.readUTF();
                String methodName = input.readUTF();
                Class<?>[] parameterTypes = (Class<?>[]) input.readObject();
                Object[] arguments = (Object[]) input.readObject();
                Class serviceClass = serviceRegister.get(serviceName);
                if (serviceClass == null) {
                    throw new ClassNotFoundException(serviceName + " 没有找到!");
                }
                Method method = serviceClass.getMethod(methodName, parameterTypes);
                Object result = method.invoke(serviceClass.newInstance(), arguments);

                output = new ObjectOutputStream(client.getOutputStream());
                output.writeObject(result);
            } catch (Exception e) {
                e.printStackTrace();

            } finally {
                try {
                    // 这里就不写 output!=null才关闭这个逻辑了
                    output.close();
                    input.close();
                    client.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
        }
    }

}

```

其次需要一个客户端：

``` java

import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * RPC 客户端
 * @Date: 2019-11-04
 */
public class RPCclient<T> {
    /**
     * 通过动态代理将参数发送过去到 RPCServer ,RPCserver 返回结果这个方法处理成为正确的实体
     */
    public static <T> T getRemoteProxyObj(final Class<T> service, final InetSocketAddress addr) {

        return (T) Proxy.newProxyInstance(service.getClassLoader(), new Class<?>[]{service}, new InvocationHandler() {
            @Override
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {

                Socket socket = null;
                ObjectOutputStream out = null;
                ObjectInputStream input = null;
                try {
                    socket = new Socket();
                    socket.connect(addr);

                    // 将实体类,参数,发送给远程调用方
                    out = new ObjectOutputStream(socket.getOutputStream());
                    out.writeUTF(service.getSimpleName());
                    out.writeUTF(method.getName());
                    out.writeObject(method.getParameterTypes());
                    out.writeObject(args);

                    input = new ObjectInputStream(socket.getInputStream());
                    return input.readObject();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    out.close();
                    input.close();
                    socket.close();
                }
                return null;
            }
        });

    }

}

```

再来一个测试的远程方法。

``` java
public interface Tinterface {
    String send(String msg);
}

public class TinterfaceImpl implements Tinterface {
    @Override
    public String send(String msg) {
        return "send message " + msg;
    }
}

```

测试代码如下：

``` java

import com.huifer.admin.rpc.Tinterface;
import com.huifer.admin.rpc.TinterfaceImpl;

import java.net.InetSocketAddress;

/**
 * @Date: 2019-11-04
 */
public class RunTest {
    public static void main(String[] args) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                RPCServer rpcServer = new RPCServer();
                rpcServer.register(Tinterface.class, TinterfaceImpl.class);
                rpcServer.start(10000);
            }
        }).start();
        Tinterface tinterface = RPCclient.getRemoteProxyObj(Tinterface.class, new InetSocketAddress("localhost", 10000));
        System.out.println(tinterface.send("rpc 测试用例"));

    }
}

```

输出 `send message rpc 测试用例` 。

### 异步

#### 消息中间件

> 常见的消息中间件有 Kafka、ActiveMQ、RabbitMQ、RocketMQ , 常见的协议有AMQP、MQTTP、STOMP、XMPP. 这里不对消息队列进行拓展了, 具体如何使用还是请移步官网.
>
