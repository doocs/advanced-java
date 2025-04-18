import{_ as a,c as e,o as d,ai as r}from"./chunks/framework.TS84ywiI.js";const m=JSON.parse('{"title":"动态扩缩容方案","description":"","frontmatter":{},"headers":[],"relativePath":"high-concurrency/database-shard-dynamic-expand.md","filePath":"high-concurrency/database-shard-dynamic-expand.md"}'),i={name:"high-concurrency/database-shard-dynamic-expand.md"};function l(o,t,n,p,h,s){return d(),e("div",null,t[0]||(t[0]=[r('<h1 id="动态扩缩容方案" tabindex="-1">动态扩缩容方案 <a class="header-anchor" href="#动态扩缩容方案" aria-label="Permalink to &quot;动态扩缩容方案&quot;">​</a></h1><h2 id="面试题" tabindex="-1">面试题 <a class="header-anchor" href="#面试题" aria-label="Permalink to &quot;面试题&quot;">​</a></h2><p>如何设计可以动态扩容缩容的分库分表方案？</p><h2 id="面试官心理分析" tabindex="-1">面试官心理分析 <a class="header-anchor" href="#面试官心理分析" aria-label="Permalink to &quot;面试官心理分析&quot;">​</a></h2><p>对于分库分表来说，主要是面对以下问题：</p><ul><li>选择一个数据库中间件，调研、学习、测试；</li><li>设计你的分库分表的一个方案，你要分成多少个库，每个库分成多少个表，比如 3 个库，每个库 4 个表；</li><li>基于选择好的数据库中间件，以及在测试环境建立好的分库分表的环境，然后测试一下能否正常进行分库分表的读写；</li><li>完成单库单表到分库分表的<strong>迁移</strong>，双写方案；</li><li>线上系统开始基于分库分表对外提供服务；</li><li>扩容了，扩容成 6 个库，每个库需要 12 个表，你怎么来增加更多库和表呢？</li></ul><p>这个是你必须面对的一个事儿，就是你已经弄好分库分表方案了，然后一堆库和表都建好了，基于分库分表中间件的代码开发啥的都好了，测试都 ok 了，数据能均匀分布到各个库和各个表里去，而且接着你还通过双写的方案咔嚓一下上了系统，已经直接基于分库分表方案在搞了。</p><p>那么现在问题来了，你现在这些库和表又支撑不住了，要继续扩容咋办？这个可能就是说你的每个库的容量又快满了，或者是你的表数据量又太大了，也可能是你每个库的写并发太高了，你得继续扩容。</p><p>这都是玩儿分库分表线上必须经历的事儿。</p><h2 id="面试题剖析" tabindex="-1">面试题剖析 <a class="header-anchor" href="#面试题剖析" aria-label="Permalink to &quot;面试题剖析&quot;">​</a></h2><h3 id="停机扩容-不推荐" tabindex="-1">停机扩容（不推荐） <a class="header-anchor" href="#停机扩容-不推荐" aria-label="Permalink to &quot;停机扩容（不推荐）&quot;">​</a></h3><p>这个方案就跟停机迁移一样，步骤几乎一致，唯一的一点就是那个导数的工具，是把现有库表的数据抽出来慢慢倒入到新的库和表里去。但是最好别这么玩儿，有点不太靠谱，因为既然<strong>分库分表</strong>就说明数据量实在是太大了，可能多达几亿条，甚至几十亿，你这么玩儿，可能会出问题。</p><p>从单库单表迁移到分库分表的时候，数据量并不是很大，单表最大也就两三千万。那么你写个工具，多弄几台机器并行跑，1 小时数据就导完了。这没有问题。</p><p>如果 3 个库 + 12 个表，跑了一段时间了，数据量都 1~2 亿了。光是导 2 亿数据，都要导个几个小时，6 点，刚刚导完数据，还要搞后续的修改配置，重启系统，测试验证，10 点才可以搞完。所以不能这么搞。</p><h3 id="优化后的方案" tabindex="-1">优化后的方案 <a class="header-anchor" href="#优化后的方案" aria-label="Permalink to &quot;优化后的方案&quot;">​</a></h3><p>一开始上来就是 32 个库，每个库 32 个表，那么总共是 1024 张表。</p><p>我可以告诉各位同学，这个分法，第一，基本上国内的互联网肯定都是够用了，第二，无论是并发支撑还是数据量支撑都没问题。</p><p>每个库正常承载的写入并发量是 1000，那么 32 个库就可以承载 $32 \\times 1000 = 32000$ 的写并发，如果每个库承载 1500 的写并发，总共就是 $32 \\times 1500 = 48000$ 的写并发，接近 5 万每秒的写入并发，前面再加一个 MQ，削峰，每秒写入 MQ 8 万条数据，每秒消费 5 万条数据。</p><p>有些除非是国内排名非常靠前的这些公司，他们的最核心的系统的数据库，可能会出现几百台数据库的这么一个规模，128 个库，256 个库，512 个库。</p><p>1024 张表，假设每个表放 500 万数据，在 MySQL 里可以放 50 亿条数据。</p><p>每秒 5 万的写并发，总共 50 亿条数据，对于国内大部分的互联网公司来说，其实一般来说都够了。</p><p>谈分库分表的扩容，<strong>第一次分库分表，就一次性给他分个够</strong>，32 个库，1024 张表，可能对大部分的中小型互联网公司来说，已经可以支撑好几年了。</p><p>一个实践是利用 $32 \\times 32$ 来分库分表，即分为 32 个库，每个库里一个表分为 32 张表。一共就是 1024 张表。根据某个 id 先根据 32 取模路由到库，再根据 32 取模路由到库里的表。</p><table tabindex="0"><thead><tr><th>orderId</th><th>id % 32 (库)</th><th>id / 32 % 32 (表)</th></tr></thead><tbody><tr><td>259</td><td>3</td><td>8</td></tr><tr><td>1189</td><td>5</td><td>5</td></tr><tr><td>352</td><td>0</td><td>11</td></tr><tr><td>4593</td><td>17</td><td>15</td></tr></tbody></table><p>刚开始的时候，这个库可能就是逻辑库，建在一个数据库上的，就是一个 MySQL 服务器可能建了 n 个库，比如 32 个库。后面如果要拆分，就是不断在库和 MySQL 服务器之间做迁移就可以了。然后系统配合改一下配置即可。</p><p>比如说最多可以扩展到 32 个数据库服务器，每个数据库服务器是一个库。如果还是不够？最多可以扩展到 1024 个数据库服务器，每个数据库服务器上面一个库一个表，那么最多是 1024 个表。</p><p>这么搞，是不用自己写代码做数据迁移的，都交给 DBA 来搞好了，但是 DBA 确实是需要做一些库表迁移的工作，但是总比你自己写代码，然后抽数据导数据来的效率高得多吧。</p><p>哪怕是要减少库的数量，也很简单，其实说白了就是按倍数缩容就可以了，然后修改一下路由规则。</p><p>这里对步骤做一个总结：</p><ol><li>设定好几台数据库服务器，每台服务器上几个库，每个库多少个表，推荐是 $32 库 \\times 32 表$，对于大部分公司来说，可能几年都够了。</li><li>路由的规则，orderId 模 32 = 库，orderId / 32 模 32 = 表</li><li>扩容的时候，申请增加更多的数据库服务器，装好 MySQL，呈倍数扩容，4 台服务器，扩到 8 台服务器，再到 16 台服务器。</li><li>由 DBA 负责将原先数据库服务器的库，迁移到新的数据库服务器上去，库迁移是有一些便捷的工具的。</li><li>我们这边就是修改一下配置，调整迁移的库所在数据库服务器的地址。</li><li>重新发布系统，上线，原先的路由规则变都不用变，直接可以基于 n 倍的数据库服务器的资源，继续进行线上系统的提供服务。</li></ol>',30)]))}const u=a(i,[["render",l]]);export{m as __pageData,u as default};
