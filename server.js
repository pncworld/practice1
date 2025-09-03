const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "dist")));
// 로고 폴더 서비스
app.use(
  "/image",
  createProxyMiddleware({
    target: "http://www.pncoffice.net/",
    changeOrigin: true,
    secure: false,
  })
);

app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const options = {
  key: fs.readFileSync("/home/pncworld/pncoffice/ssl/www.pncoffice.co.kr.key"),
  cert: fs.readFileSync("/home/pncworld/pncoffice/ssl/www.pncoffice.co.kr.crt"),
};

https.createServer(options, app).listen(443, () => {
  console.log("✅ Vue 앱 HTTPS 실행 중 → https://localhost");
});
