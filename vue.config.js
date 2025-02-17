const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  configureWebpack: {
  devtool: 'source-map',
}});

// {
//   transpileDependencies: true,
//   lintOnSave: false,
//   devServer: {
//     proxy: {
//       '^/api': {
//         target: 'http://www.pncoffice.com:8085', // 실제 API URL
//         changeOrigin: true, // CORS 문제 해결
//         pathRewrite: { '^/api': '/'}
//       }
//     }
//   }
// }

//vue add proxy
