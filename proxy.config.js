const {
  PNC_IMAGE_DEV_MIRROR_ORIGIN,
} = require("./config/pncHosts");

/** vue-cli-plugin-proxy 가 devServer.proxy 로 사용 (vue.config.js proxy 와 별도) */
module.exports = {
  "/api": {
    target: "http://pncoffice.com:8085",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "",
    },
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
};
