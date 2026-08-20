const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { defineConfig } = require("@vue/cli-service");
const { PNC_IMAGE_DEV_MIRROR_ORIGIN } = require("./config/pncHosts");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    allowedHosts: "all",
    port: 80,
    setupMiddlewares(middlewares, devServer) {
      if (devServer && devServer.app) {
        const { attachNaverRoutes } = require("./naverPlacePlus/attachRoutes");
        attachNaverRoutes(devServer.app);
      }
      return middlewares;
    },
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
      "/image": {
        target: PNC_IMAGE_DEV_MIRROR_ORIGIN,
        changeOrigin: true,
        secure: false,
      },
      "/Image": {
        target: PNC_IMAGE_DEV_MIRROR_ORIGIN,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

//vue add proxy
