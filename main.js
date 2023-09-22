window.$docsify = {
    name: 'advanced-java',
    repo: 'doocs/advanced-java',
    lastModifiedText: '最近更新时间：',
    maxLevel: 3,
    auto2top: true,
    coverpage: true,
    coverpage: 'docs/extra-page/cover.md',
    loadSidebar: 'summary.md',
    alias: {
        '/.*/.*/summary': 'summary.md',
        '/.*/summary.md': 'summary.md',
    },
    pagination: {
        previousText: '上一篇',
        nextText: '下一篇',
        crossChapter: true,
        crossChapterText: true,
    },
    contributors: {
        repo: 'doocs/advanced-java',
        ignores: ['/README.md'],
        image: {
            margin: '0.2em',
            isRound: true,
        },
    },
    search: {
        maxAge: 1800000,
        paths: [
            '/docs/high-concurrency/',
            '/docs/distributed-system/',
            '/docs/high-availability/',
            '/docs/micro-services/',
            '/docs/big-data/',
        ],
        depth: 3,
    },
    darklightTheme: {
        defaultTheme: 'light',
        siteFont: 'Source Sans Pro,Helvetica Neue,Arial,sans-serif',
        codeFontFamily: 'Roboto Mono, Monaco, courier, monospace',
        bodyFontSize: '15px',
        dark: {
            background: 'rgb(28,32,34)',
            highlightColor: '#e96900',
            codeBackgroundColor: 'rgb(34,39,46)',
            codeTextColor: '#b4b4b4',
        },
        light: {
            highlightColor: '#e96900',
        },
    },
    plugins: [
        function (hook, vm) {
            hook.beforeEach(function (content) {
                const { file, path } = vm.route;
                const en = file.indexOf('README_EN') > -1;
                if (/githubusercontent\.com/.test(file)) {
                    url = file
                        .replace(
                            'raw.githubusercontent.com',
                            'github.com',
                        )
                        .replace(/\/main/, '/blob/main');
                } else {
                    url = `https://github.com/doocs/advanced-java/blob/main/${file}`;
                }

                const github = `[GitHub](${url})`;
                const gitee = `[Gitee](${url.replace('github', 'gitee' )})`;

                const editHtml = en
                    ? `:memo: Edit on ${github} / ${gitee}\n`
                    : `:memo: 在 ${github} / ${gitee} 编辑\n`;

                if (path === '/') {
                    return editHtml + content;
                }
                const subscription = `---
## 公众号

[Doocs](https://github.com/doocs) 技术社区旗下唯一公众号「**Doocs**」​，欢迎扫码关注，**专注分享技术领域相关知识及业内最新资讯**。当然，也可以加我个人微信（备注：GitHub），拉你进技术交流群。

关注「**Doocs**」公众号，回复 **PDF**，即可获取本项目离线 PDF 文档，学习更加方便！

<table>
<tr>
<td align="center" style="width: 200px;">
<a href="https://github.com/doocs">
  <img src="./images/qrcode-for-doocs.jpg" style="width: 400px;"><br>
  <sub>公众平台</sub>
</a><br>
</td>
<td align="center" style="width: 200px;">
<a href="https://github.com/yanglbme">
  <img src="./images/qrcode-for-yanglbme.jpg" style="width: 400px;"><br>
  <sub>个人微信</sub>
</a><br>
</td>
</tr>
</table>`;
                return editHtml + content + `\n` + subscription;
            });

            hook.afterEach(function (html) {
                const currentYear = new Date().getFullYear();
                const footer = `<footer><span>Copyright © 2018-${currentYear} <a href="https://github.com/doocs" target="_blank">Doocs</a>. All Rights Reserved.</footer>`;
                return html + footer;
            });
        },
    ],
};