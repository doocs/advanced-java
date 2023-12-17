const giscusTheme = () =>
    localStorage.getItem('DARK_LIGHT_THEME') === 'dark' ? 'noborder_dark' : 'light';

window.$docsify = {
    name: 'advanced-java',
    repo: 'doocs/advanced-java',
    maxLevel: 3,
    auto2top: true,
    coverpage: true,
    coverpage: 'docs/extra-page/cover.md',
    loadSidebar: 'summary.md',
    alias: {
        '/.*/.*/summary': 'summary.md',
        '/.*/summary.md': 'summary.md',
    },
    lastModifiedText: '最近更新时间：',
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
                const gitee = `[Gitee](${url.replace('github', 'gitee')})`;

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
    <td align="center" style="width: 260px;">
      <img src="https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/images/qrcode-for-doocs.png" style="width: 400px;"><br>
    </td>
    <td align="center" style="width: 260px;">
      <img src="https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/images/qrcode-for-yanglbme.png" style="width: 400px;"><br>
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
            hook.doneEach(() => {
                const giscusScript = document.createElement('script');
                giscusScript.type = 'text/javascript';
                giscusScript.async = true;
                giscusScript.setAttribute('src', 'https://giscus.app/client.js');
                giscusScript.setAttribute('data-repo', 'doocs/advanced-java');
                giscusScript.setAttribute('data-repo-id', 'MDEwOlJlcG9zaXRvcnkxNTE4MzQwNjI=');
                giscusScript.setAttribute('data-mapping', 'number');
                giscusScript.setAttribute('data-reactions-enabled', '1');
                giscusScript.setAttribute('data-strict', '1');
                giscusScript.setAttribute('data-emit-metadata', '0');
                giscusScript.setAttribute('data-input-position', 'top');
                giscusScript.setAttribute('crossorigin', 'anonymous');
                giscusScript.setAttribute('data-term', '9');
                giscusScript.setAttribute('data-lang', 'zh-CN');
                giscusScript.setAttribute('data-theme', giscusTheme());

                document
                    .getElementById('main')
                    .insertBefore(giscusScript, document.getElementById('main').lastChild);

                document.getElementById('docsify-darklight-theme').addEventListener('click', () => {
                    const frame = document.querySelector('.giscus-frame');
                    frame.contentWindow.postMessage(
                        { giscus: { setConfig: { theme: giscusTheme() } } },
                        'https://giscus.app',
                    );
                });
            })
        },
    ],
};