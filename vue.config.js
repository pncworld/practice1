const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { defineConfig } = require("@vue/cli-service");
const { PNC_IMAGE_DEV_MIRROR_ORIGIN } = require("./config/pncHosts");

const appTitle =
  process.env.NODE_ENV === "production" ? "PnC Office" : "DEV PnC Office";

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // 탭 제목: serve=DEV_… / build=운영 (package.json name "sam" 기본값 덮어씀)
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      title: appTitle,
    },
  },
  chainWebpack(config) {
    // pages.index 사용 시 플러그인명: html-index
    const htmlPlugin = config.plugins.has("html-index")
      ? "html-index"
      : "html";
    config.plugin(htmlPlugin).tap((args) => {
      args[0].title = appTitle;
      return args;
    });
  },
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
