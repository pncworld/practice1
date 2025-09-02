const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    allowedHosts: "all",
    port: 80,
    proxy: {
      "^/api": {
        target: "http://www.pncoffice.co.kr", // 실제 API URL
        changeOrigin: true, // CORS 문제 해결
        pathRewrite: { "^/api": "/" },
      },
      "/SYSTEM": {
        target: "http://www.pncoffice.com:8085",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

//vue add proxy
