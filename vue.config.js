const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { defineConfig } = require("@vue/cli-service");
const { PNC_IMAGE_DEV_MIRROR_ORIGIN } = require("./config/pncHosts");

const appTitle =
  process.env.NODE_ENV === "production" ? "PnC Office" : "DEV PnC Office";

/**
 * 새 버전 알림(src/components/VersionNoticeBar.vue)용 빌드 버전
 *  · 운영 빌드: 빌드 시각(YYYYMMDDHHmmss) → 화면 코드(VUE_APP_BUILD_VERSION)와 dist/version.json 에 같은 값
 *  · 개발 서버: "dev" (알림 기능 꺼짐)
 */
const pad2 = (n) => String(n).padStart(2, "0");
const now = new Date();
const BUILD_VERSION =
  process.env.NODE_ENV === "production"
    ? `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}` +
      `${pad2(now.getHours())}${pad2(now.getMinutes())}${pad2(now.getSeconds())}`
    : "dev";
process.env.VUE_APP_BUILD_VERSION = BUILD_VERSION;

/** 운영 빌드 결과에 version.json 을 추가 (server.js 가 dist 를 그대로 서비스) */
class EmitVersionJsonPlugin {
  apply(compiler) {
    const { Compilation, sources } = compiler.webpack;
    compiler.hooks.thisCompilation.tap("EmitVersionJsonPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "EmitVersionJsonPlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          compilation.emitAsset(
            "version.json",
            new sources.RawSource(JSON.stringify({ version: BUILD_VERSION }))
          );
        }
      );
    });
  }
}

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
    // 운영 빌드에만 version.json 생성 (개발 서버에는 영향 없음)
    config.when(process.env.NODE_ENV === "production", (c) => {
      c.plugin("emit-version-json").use(EmitVersionJsonPlugin);
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
