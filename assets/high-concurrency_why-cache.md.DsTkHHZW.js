import{_ as e,c as r,o as t,ai as o}from"./chunks/framework.TS84ywiI.js";const u=JSON.parse('{"title":"缓存的使用方式","description":"","frontmatter":{},"headers":[],"relativePath":"high-concurrency/why-cache.md","filePath":"high-concurrency/why-cache.md"}'),h={name:"high-concurrency/why-cache.md"};function l(i,a,c,n,s,d){return t(),r("div",null,a[0]||(a[0]=[o('<h1 id="缓存的使用方式" tabindex="-1">缓存的使用方式 <a class="header-anchor" href="#缓存的使用方式" aria-label="Permalink to &quot;缓存的使用方式&quot;">​</a></h1><h2 id="面试题" tabindex="-1">面试题 <a class="header-anchor" href="#面试题" aria-label="Permalink to &quot;面试题&quot;">​</a></h2><p>项目中缓存是如何使用的？为什么要用缓存？缓存使用不当会造成什么后果？</p><h2 id="面试官心理分析" tabindex="-1">面试官心理分析 <a class="header-anchor" href="#面试官心理分析" aria-label="Permalink to &quot;面试官心理分析&quot;">​</a></h2><p>这个问题，互联网公司必问，要是一个人连缓存都不太清楚，那确实比较尴尬。</p><p>只要问到缓存，上来第一个问题，肯定是先问问你项目哪里用了缓存？为啥要用？不用行不行？如果用了以后可能会有什么不良的后果？</p><p>这就是看看你对缓存这个东西背后有没有思考，如果你就是傻乎乎的瞎用，没法给面试官一个合理的解答，那面试官对你印象肯定不太好，觉得你平时思考太少，就知道干活儿。</p><h2 id="面试题剖析" tabindex="-1">面试题剖析 <a class="header-anchor" href="#面试题剖析" aria-label="Permalink to &quot;面试题剖析&quot;">​</a></h2><h3 id="项目中缓存是如何使用的" tabindex="-1">项目中缓存是如何使用的？ <a class="header-anchor" href="#项目中缓存是如何使用的" aria-label="Permalink to &quot;项目中缓存是如何使用的？&quot;">​</a></h3><p>这个，需要结合自己项目的业务来。</p><h3 id="为什么要用缓存" tabindex="-1">为什么要用缓存？ <a class="header-anchor" href="#为什么要用缓存" aria-label="Permalink to &quot;为什么要用缓存？&quot;">​</a></h3><p>用缓存，主要有两个用途：<strong>高性能</strong>、<strong>高并发</strong>。</p><h4 id="高性能" tabindex="-1">高性能 <a class="header-anchor" href="#高性能" aria-label="Permalink to &quot;高性能&quot;">​</a></h4><p>假设这么个场景，你有个操作，一个请求过来，吭哧吭哧你各种乱七八糟操作 mysql，半天查出来一个结果，耗时 600ms。但是这个结果可能接下来几个小时都不会变了，或者变了也可以不用立即反馈给用户。那么此时咋办？</p><p>缓存啊，折腾 600ms 查出来的结果，扔缓存里，一个 key 对应一个 value，下次再有人查，别走 mysql 折腾 600ms 了，直接从缓存里，通过一个 key 查出来一个 value，2ms 搞定。性能提升 300 倍。</p><p>就是说对于一些需要复杂操作耗时查出来的结果，且确定后面不怎么变化，但是有很多读请求，那么直接将查询出来的结果放在缓存中，后面直接读缓存就好。</p><h4 id="高并发" tabindex="-1">高并发 <a class="header-anchor" href="#高并发" aria-label="Permalink to &quot;高并发&quot;">​</a></h4><p>mysql 这么重的数据库，压根儿设计不是让你玩儿高并发的，虽然也可以玩儿，但是天然支持不好。mysql 单机支撑到 <code>2000QPS</code> 也开始容易报警了。</p><p>所以要是你有个系统，高峰期一秒钟过来的请求有 1 万，那一个 mysql 单机绝对会死掉。你这个时候就只能上缓存，把很多数据放缓存，别放 mysql。缓存功能简单，说白了就是 <code>key-value</code> 式操作，单机支撑的并发量轻松一秒几万十几万，支撑高并发 so easy。单机承载并发量是 mysql 单机的几十倍。</p><blockquote><p>缓存是走内存的，内存天然就支撑高并发。</p></blockquote><h3 id="用了缓存之后会有什么不良后果" tabindex="-1">用了缓存之后会有什么不良后果？ <a class="header-anchor" href="#用了缓存之后会有什么不良后果" aria-label="Permalink to &quot;用了缓存之后会有什么不良后果？&quot;">​</a></h3><p>常见的缓存问题有以下几个：</p><ul><li><a href="./redis-consistence">缓存与数据库双写不一致</a></li><li><a href="./redis-caching-avalanche-and-caching-penetration">缓存雪崩、缓存穿透、缓存击穿</a></li><li><a href="./redis-cas">缓存并发竞争</a></li></ul><p>点击超链接，可直接查看缓存相关问题及解决方案。</p>',24)]))}const m=e(h,[["render",l]]);export{u as __pageData,m as default};
