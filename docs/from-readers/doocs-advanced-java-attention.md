# 提交注意事项
## 关于文件命名
为了让文件名具备唯一性，文件请以 “`GitHub ID` + 主题” 命名。

文章主题统一采用英文命名，请勿使用中文或者中式英语，文件类型统一 `.md`。

比如，我的 GitHub ID 是 yanglbme，想分享一篇关于 Kafka 实践相关的文章，文件名可以是 `yanglbme-kafka-in-action.md`。

**文件命名不规范的文章将不予采纳**。

## 关于文章内容
请分享与此项目主题相关的文章，比如：高并发、分布式、高可用、微服务等相关领域的内容。**其它主题的文章将不会被采纳**。

## 关于文章排版
请注意文章排版的美观性。中英文之间、中文与数字之间用空格隔开是最基本的。图片统一使用 `![](/images/icon.png)` 进行相对引用，并同时存放于根目录 `images` 和本专区目录 `from-readers/images` **两个位置**（这是为了在 GitHub 和 GitHub Page 都能正常显示图片）。具体文章书写规范请参考《[中文技术文档的写作规范](https://github.com/ruanyf/document-style-guide)》

## 关于 Git 提交信息
Git 提交信息统一使用英文，本项目遵从 Angular JS Git 提交规范。e.g.

```bash
git commit -m "docs(from-readers): add an article about Kafka"
```

Git 提交不规范的文章将不予采纳。