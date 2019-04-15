# 提交注意事项
项目需要有一个统一的内容提交规范，没有规范的项目将会是一团乱麻，维护起来也会很费劲儿。以下列出了几个小点，看似很多，实际上都非常容易做到，供朋友们参考。

> 如果你有好的 idea，欢迎 issues 交流。

## 关于提交形式
本项目**不希望以外链的形式引入内容**。如果你有好的内容推荐，请在此项目基础上创建新的文件，完善内容后再提交。

## 关于文件命名与存放位置
文件请以 “`GitHub ID` + 文章主题” 命名，确保每位朋友的提交内容不会冲突。文章主题统一采用**英文**命名，请勿使用中文或者汉语拼音，文件类型统一选择 `.md`。

给个示例。某位朋友的 GitHub ID 是 [SnailClimb](https://github.com/snailclimb)，想分享一篇关于 Kafka 实践相关的文章，那么文件名可以是 `snailclimb-kafka-in-action.md`。

最终文件存放于 `docs/from-readers/` 目录下，即与[本文件](/docs/from-readers/doocs-advanced-java-attention.md)处于同一级别。**文件命名、存放位置不规范的文章将不予采纳**。

## 关于文章内容
仅收录与此项目主题相关的优质文章，可以是[高并发](https://github.com/doocs/advanced-java#高并发架构)、[分布式](https://github.com/doocs/advanced-java#分布式系统)、[高可用](https://github.com/doocs/advanced-java#高可用架构)、[微服务](https://github.com/doocs/advanced-java#高并发架构微服务架构)等相关领域的内容。**其它主题的文章将不会被采纳**。

## 关于文章排版
文章排版保持整洁美观。中英文之间、中文与数字之间用空格隔开是最基本的。

> 有研究显示，打字的时候不喜欢在中文和英文之间加空格的人，感情路都走得很辛苦，有七成的比例会在 34 岁的时候跟自己不爱的人结婚，而其余三成的人最后只能把遗产留给自己的猫。毕竟爱情跟书写都需要适时地留白。

图片统一使用 `![](/images/xxx.png)` 进行相对路径的引用，并同时存放于根目录 `images/` 和本专区目录 `docs/from-readers/images/` **两个位置**之下（这是为了确保在 GitHub 和 GitHub Page 都能正常显示图片；图片并不限定 `.png` 格式），作图推荐使用在线工具 [ProcessOn](https://www.processon.com/i/594a16f7e4b0e1bb14fe2fac)。具体文章书写规范请参考《[中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)》。

以下是文章基本的结构，供朋友们参考。

```markdown
# 这是文章标题
- Author: [GitHub ID](https://github.com/your-github-id)
- Description: 文章的简单描述信息。
- ...

## 这是一级索引
...
### 这是二级索引
...

## 这是一级索引
...
### 这是二级索引
...
```

## 关于 Git 提交信息
Git 提交信息统一使用英文，本项目遵从 [Angular JS Git 提交规范](https://github.com/angular/angular.js/commits/master)。e.g.

```bash
git commit -m "docs(from-readers): add an article about Kafka"
```

Git 提交信息不规范的 PR 将不予合并。