<template>
  <Layout>
    <template #doc-footer-before>
      <div
        style="
          margin-top: 40px;
          padding: 2em 0;
          text-align: center;
          border-top: 1px solid #e2e2e2;
        "
      >
        <table style="margin: 0 auto">
          <tbody>
            <tr>
              <td align="center" style="width: 260px">
                <img
                  src="https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/images/qrcode-for-doocs.png"
                  style="width: 200px"
                /><br />
              </td>
              <td align="center" style="width: 260px">
                <img
                  src="https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/images/qrcode-for-yanglbme.png"
                  style="width: 200px"
                /><br />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme';
const { Layout } = DefaultTheme;
</script>
