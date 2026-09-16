/**
 * 네이버 업체 이미지(phinf) 프록시.
 * POS/사내망에서 beta.ssl.phinf.net 이 안 열리면 깨진 이미지로 보인다.
 * 브라우저가 우리 도메인만 치게 하고, 서버가 네이버 CDN을 가져온다.
 */
const express = require("express");
const axios = require("axios");

const router = express.Router();
const ALLOWED_HOST = /(^|\.)phinf\.net$/i;

router.get("/", async (req, res) => {
  const raw = String(req.query.u || "");
  let target;
  try {
    target = new URL(raw);
  } catch {
    return res.status(400).end();
  }
  if (target.protocol !== "https:" || !ALLOWED_HOST.test(target.hostname)) {
    return res.status(400).end();
  }

  try {
    const upstream = await axios.get(target.toString(), {
      responseType: "stream",
      timeout: 10000,
      headers: {
        Referer: "https://new.smartplace.naver.com/",
        "User-Agent": "Mozilla/5.0",
      },
      maxRedirects: 3,
    });
    const contentType = upstream.headers["content-type"] || "image/jpeg";
    if (!String(contentType).startsWith("image/")) {
      return res.status(502).end();
    }
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    upstream.data.pipe(res);
  } catch {
    res.status(502).end();
  }
});

module.exports = router;
