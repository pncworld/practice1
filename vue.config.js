const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true ,
  lintOnSave: false ,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://www.pncoffice.com:8085', // 실제 API URL
        changeOrigin: true, // 원본을 변경하여 CORS 문제 해결
        pathRewrite: {
          '^/api': ''
      }
      },
    },
  },
})
