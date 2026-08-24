require("dotenv").config();

const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { PNC_IMAGE_PROXY_TARGET } = require("./config/pncHosts");

// 네이버 스마트플레이스 연동 라우트
const naverOnboardingRouter = require("./naverPlacePlus/routes/naverOnboarding");
const naverLoginRouter = require("./naverPlacePlus/routes/naverLogin");
const naverTermsRouter = require("./naverPlacePlus/routes/naverTerms");
const naverPlacesRouter = require("./naverPlacePlus/routes/naverPlaces");

const app = express();

app.use(express.json());

// ===== 네이버 스마트플레이스 연동 라우트 (catch-all보다 반드시 위) =====
app.use("/naver/start", naverOnboardingRouter);
app.use("/naver/login", naverLoginRouter);
app.use("/naver/terms", naverTermsRouter);
app.use("/naver/places", naverPlacesRouter);
// =====================================================================

// 로고·정적 이미지 — SPA static/catch-all 보다 먼저 연결해야 /image 가 index.html 로 안 떨어짐.
// Express mount(/image)가 path 를 떼므로, 원본 서버의 /image/Logo/... 경로를 다시 붙인다.
function restorePncImagePath(pathWithQuery) {
  const q = pathWithQuery.indexOf("?");
  const pathname = q === -1 ? pathWithQuery : pathWithQuery.slice(0, q);
  const search = q === -1 ? "" : pathWithQuery.slice(q);
  const rest = pathname.replace(/^\/image/i, "");
  const normalizedRest = rest.startsWith("/") ? rest : `/${rest}`;
  return `/image${normalizedRest}${search}`;
}

const imageProxy = createProxyMiddleware({
  target: PNC_IMAGE_PROXY_TARGET,
  changeOrigin: true,
  secure: false,
  pathRewrite: restorePncImagePath,
});
app.use("/image", imageProxy);
app.use("/Image", imageProxy);

app.use(express.static(path.join(__dirname, "dist")));

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
