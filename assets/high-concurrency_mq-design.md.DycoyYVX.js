import{_ as e,c as t,o as r,ai as i}from"./chunks/framework.TS84ywiI.js";const m=JSON.parse('{"title":"如何设计一个消息队列？","description":"","frontmatter":{},"headers":[],"relativePath":"high-concurrency/mq-design.md","filePath":"high-concurrency/mq-design.md"}'),o={name:"high-concurrency/mq-design.md"};function l(n,a,p,c,s,d){return r(),t("div",null,a[0]||(a[0]=[i('<h1 id="如何设计一个消息队列" tabindex="-1">如何设计一个消息队列？ <a class="header-anchor" href="#如何设计一个消息队列" aria-label="Permalink to &quot;如何设计一个消息队列？&quot;">​</a></h1><h2 id="面试题" tabindex="-1">面试题 <a class="header-anchor" href="#面试题" aria-label="Permalink to &quot;面试题&quot;">​</a></h2><p>如果让你写一个消息队列，该如何进行架构设计？说一下你的思路。</p><h2 id="面试官心理分析" tabindex="-1">面试官心理分析 <a class="header-anchor" href="#面试官心理分析" aria-label="Permalink to &quot;面试官心理分析&quot;">​</a></h2><p>其实聊到这个问题，一般面试官要考察两块：</p><ul><li>你有没有对某一个消息队列做过较为深入的原理的了解，或者从整体了解把握住一个消息队列的架构原理。</li><li>看看你的设计能力，给你一个常见的系统，就是消息队列系统，看看你能不能从全局把握一下整体架构设计，给出一些关键点出来。</li></ul><p>说实话，问类似问题的时候，大部分人基本都会蒙，因为平时从来没有思考过类似的问题，<strong>大多数人就是平时埋头用，从来不去思考背后的一些东西</strong>。类似的问题，比如，如果让你来设计一个 Spring 框架你会怎么做？如果让你来设计一个 Dubbo 框架你会怎么做？如果让你来设计一个 MyBatis 框架你会怎么做？</p><h2 id="面试题剖析" tabindex="-1">面试题剖析 <a class="header-anchor" href="#面试题剖析" aria-label="Permalink to &quot;面试题剖析&quot;">​</a></h2><p>其实回答这类问题，说白了，不求你看过那技术的源码，起码你要大概知道那个技术的基本原理、核心组成部分、基本架构构成，然后参照一些开源的技术把一个系统设计出来的思路说一下就好。</p><p>比如说这个消息队列系统，我们从以下几个角度来考虑一下：</p><ul><li><p>首先这个 mq 得支持可伸缩性吧，就是需要的时候快速扩容，就可以增加吞吐量和容量，那怎么搞？设计个分布式的系统呗，参照一下 kafka 的设计理念，broker -&gt; topic -&gt; partition，每个 partition 放一个机器，就存一部分数据。如果现在资源不够了，简单啊，给 topic 增加 partition，然后做数据迁移，增加机器，不就可以存放更多数据，提供更高的吞吐量了？</p></li><li><p>其次你得考虑一下这个 mq 的数据要不要落地磁盘吧？那肯定要了，落磁盘才能保证别进程挂了数据就丢了。那落磁盘的时候怎么落啊？顺序写，这样就没有磁盘随机读写的寻址开销，磁盘顺序读写的性能是很高的，这就是 kafka 的思路。</p></li><li><p>其次你考虑一下你的 mq 的可用性啊？这个事儿，具体参考之前可用性那个环节讲解的 kafka 的高可用保障机制。多副本 -&gt; leader &amp; follower -&gt; broker 挂了重新选举 leader 即可对外服务。</p></li><li><p>能不能支持数据 0 丢失啊？可以的，参考我们之前说的那个 kafka 数据零丢失方案。</p></li></ul><p>mq 肯定是很复杂的，面试官问你这个问题，其实是个开放题，他就是看看你有没有从架构角度整体构思和设计的思维以及能力。确实这个问题可以刷掉一大批人，因为大部分人平时不思考这些东西。</p>',12)]))}const u=e(o,[["render",l]]);export{m as __pageData,u as default};
