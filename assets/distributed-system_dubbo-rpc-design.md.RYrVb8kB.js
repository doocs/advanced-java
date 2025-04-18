import{_ as a,c as i,o as t,ai as r}from"./chunks/framework.TS84ywiI.js";const c=JSON.parse('{"title":"设计一个类似 Dubbo 的 RPC 框架","description":"","frontmatter":{},"headers":[],"relativePath":"distributed-system/dubbo-rpc-design.md","filePath":"distributed-system/dubbo-rpc-design.md"}'),o={name:"distributed-system/dubbo-rpc-design.md"};function l(d,e,s,b,n,p){return t(),i("div",null,e[0]||(e[0]=[r('<h1 id="设计一个类似-dubbo-的-rpc-框架" tabindex="-1">设计一个类似 Dubbo 的 RPC 框架 <a class="header-anchor" href="#设计一个类似-dubbo-的-rpc-框架" aria-label="Permalink to &quot;设计一个类似 Dubbo 的 RPC 框架&quot;">​</a></h1><h2 id="面试题" tabindex="-1">面试题 <a class="header-anchor" href="#面试题" aria-label="Permalink to &quot;面试题&quot;">​</a></h2><p>如何自己设计一个类似 Dubbo 的 RPC 框架？</p><h2 id="面试官心理分析" tabindex="-1">面试官心理分析 <a class="header-anchor" href="#面试官心理分析" aria-label="Permalink to &quot;面试官心理分析&quot;">​</a></h2><p>说实话，就这问题，其实就跟问你如何自己设计一个 MQ 一样的道理，就考两个：</p><ul><li>你有没有对某个 rpc 框架原理有非常深入的理解。</li><li>你能不能从整体上来思考一下，如何设计一个 rpc 框架，考考你的系统设计能力。</li></ul><h2 id="面试题剖析" tabindex="-1">面试题剖析 <a class="header-anchor" href="#面试题剖析" aria-label="Permalink to &quot;面试题剖析&quot;">​</a></h2><p>其实问到你这问题，你起码不能认怂，因为是知识的扫盲，那我不可能给你深入讲解什么 kafka 源码剖析，dubbo 源码剖析，何况我就算讲了，你要真的消化理解和吸收，起码个把月以后了。</p><p>所以我给大家一个建议，遇到这类问题，起码从你了解的类似框架的原理入手，自己说说参照 dubbo 的原理，你来设计一下，举个例子，dubbo 不是有那么多分层么？而且每个分层是干啥的，你大概是不是知道？那就按照这个思路大致说一下吧，起码你不能懵逼，要比那些上来就懵，啥也说不出来的人要好一些。</p><p>举个栗子，我给大家说个最简单的回答思路：</p><ul><li>上来你的服务就得去注册中心注册吧，你是不是得有个注册中心，保留各个服务的信息，可以用 zookeeper 来做，对吧。</li><li>然后你的消费者需要去注册中心拿对应的服务信息吧，对吧，而且每个服务可能会存在于多台机器上。</li><li>接着你就该发起一次请求了，咋发起？当然是基于动态代理了，你面向接口获取到一个动态代理，这个动态代理就是接口在本地的一个代理，然后这个代理会找到服务对应的机器地址。</li><li>然后找哪个机器发送请求？那肯定得有个负载均衡算法了，比如最简单的可以随机轮询是不是。</li><li>接着找到一台机器，就可以跟它发送请求了，第一个问题咋发送？你可以说用 netty 了，nio 方式；第二个问题发送啥格式数据？你可以说用 hessian 序列化协议了，或者是别的，对吧。然后请求过去了。</li><li>服务器那边一样的，需要针对你自己的服务生成一个动态代理，监听某个网络端口了，然后代理你本地的服务代码。接收到请求的时候，就调用对应的服务代码，对吧。</li></ul><p>这就是一个最最基本的 rpc 框架的思路，先不说你有多牛逼的技术功底，哪怕这个最简单的思路你先给出来行不行？</p>',12)]))}const h=a(o,[["render",l]]);export{c as __pageData,h as default};
