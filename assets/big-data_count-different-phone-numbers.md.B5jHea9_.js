import{_ as e,c as t,o as r,ai as n}from"./chunks/framework.TS84ywiI.js";const u=JSON.parse('{"title":"如何统计不同电话号码的个数？","description":"","frontmatter":{},"headers":[],"relativePath":"big-data/count-different-phone-numbers.md","filePath":"big-data/count-different-phone-numbers.md"}'),o={name:"big-data/count-different-phone-numbers.md"};function i(s,a,d,p,h,c){return r(),t("div",null,a[0]||(a[0]=[n('<h1 id="如何统计不同电话号码的个数" tabindex="-1">如何统计不同电话号码的个数？ <a class="header-anchor" href="#如何统计不同电话号码的个数" aria-label="Permalink to &quot;如何统计不同电话号码的个数？&quot;">​</a></h1><h2 id="题目描述" tabindex="-1">题目描述 <a class="header-anchor" href="#题目描述" aria-label="Permalink to &quot;题目描述&quot;">​</a></h2><p>已知某个文件内包含一些电话号码，每个号码为 8 位数字，统计不同号码的个数。</p><h2 id="解答思路" tabindex="-1">解答思路 <a class="header-anchor" href="#解答思路" aria-label="Permalink to &quot;解答思路&quot;">​</a></h2><p>这道题本质还是求解<strong>数据重复</strong>的问题，对于这类问题，一般首先考虑位图法。</p><p>对于本题，8 位电话号码可以表示的号码个数为 10<sup>8</sup> 个，即 1 亿个。我们每个号码用一个 bit 来表示，则总共需要 1 亿个 bit，内存占用约 12M。</p><p><strong>思路如下</strong>：</p><p>申请一个位图数组，长度为 1 亿，初始化为 0。然后遍历所有电话号码，把号码对应的位图中的位置置为 1。遍历完成后，如果 bit 为 1，则表示这个电话号码在文件中存在，否则不存在。bit 值为 1 的数量即为 不同电话号码的个数。</p><h2 id="方法总结" tabindex="-1">方法总结 <a class="header-anchor" href="#方法总结" aria-label="Permalink to &quot;方法总结&quot;">​</a></h2><p>求解数据重复问题，记得考虑位图法。</p>',10)]))}const _=e(o,[["render",i]]);export{u as __pageData,_ as default};
