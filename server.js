const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "dist")));
// Vue dist 폴더 서비스
// app.use(
//   createProxyMiddleware({
//     target: "http://www.pncoffice.com:8085",
//     changeOrigin: true,
//     secure: false,
//   })
// );

app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const options = {
  key: fs.readFileSync("C:/PNCOFFICEAI/ssl/www.pncoffice.co.kr.key"), // 개인키 경로
  cert: fs.readFileSync("C:/PNCOFFICEAI/ssl/www.pncoffice.co.kr.crt"), // 인증서 경로
};

https.createServer(options, app).listen(443, () => {
  console.log("✅ Vue 앱 HTTPS 실행 중 → https://localhost");
});
