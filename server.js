const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { PNC_IMAGE_SERVER_ORIGIN } = require("./config/pncHosts");

const app = express();

app.use(express.static(path.join(__dirname, "dist")));
// 로고·정적 이미지 — 이미지 전용 서버(:88, API 와 별도). 브라우저는 동일 출처 /image 만 호출
const imageProxy = createProxyMiddleware({
  target: PNC_IMAGE_SERVER_ORIGIN,
  changeOrigin: true,
  secure: false,
});
app.use("/image", imageProxy);
app.use("/Image", imageProxy);

app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const options = {
  key: fs.readFileSync("/home/pncworld/pncoffice/ssl/www.pncoffice.co.kr.key"),
  cert: fs.readFileSync("/home/pncworld/pncoffice/ssl/www.pncoffice.co.kr.crt"),
};

https.createServer(options, app).listen(443, () => {
  //console.log("✅ Vue 앱 HTTPS 실행 중 → https://localhost");
});

http
  .createServer((req, res) => {
    res.writeHead(301, { Location: "https://" + req.headers.host + req.url });
    res.end();
  })
  .listen(80, () => {
    //console.log("HTTP Server running on port 80 (redirecting to HTTPS)");
  });
