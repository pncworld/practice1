/**
 * "동의 및 시작" 첫 화면 — 우리 서비스가 직접 만드는 랜딩/동의안내 페이지
 *
 * 아임유 가이드(PDF) 3페이지 기준 ①번 화면입니다.
 * ②(네이버 로그인) ③(네이버 서비스 약관동의)는 네이버가 제공하는 페이지라서
 * 우리가 만들 수 없지만, ①번 "동의하고 시작" 화면은 POS사가 직접 만들어서
 * 자사 브랜딩 + 개인정보 제3자 제공 안내 문구를 보여준 뒤 네이버 약관동의
 * 페이지(/naver/terms/start)로 넘겨주는 역할을 합니다.
 *
 * 실서비스에서는 로그인한 사장님 계정(storeId)을 세션에서 가져와야 합니다.
 * 데모에서는 쿼리 파라미터로 storeId를 받습니다.
 */

const express = require("express");
const router = express.Router();

const COMPANY_NAME = process.env.COMPANY_NAME || "우리 회사";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

router.get("/", (req, res) => {
  const storeId = req.query.storeId || "demo-store-1";
  // "동의하고 시작"을 누르면 먼저 네이버 아이디 로그인(naverUniqueId 확보)부터
  // 진행하고, 그다음 약관동의 페이지로 넘어갑니다.
  const startUrl = `/naver/login/start?storeId=${encodeURIComponent(storeId)}`;

  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>네이버 스마트플레이스 연동</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f2f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
      color: #222;
      padding: 24px;
    }
    .card {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 20px 24px 0;
    }
    .brand .company {
      font-weight: 700;
      font-size: 15px;
      color: #111;
    }
    .brand .dot { color: #ccc; }
    .brand .naver {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      font-size: 15px;
      color: #03c75a;
    }
    .brand .naver .badge {
      background: #03c75a;
      color: #fff;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 6px;
    }
    .body { padding: 20px 24px 24px; }
    h1 { font-size: 19px; margin: 4px 0 4px; }
    .subtitle { color: #666; font-size: 14px; margin: 0 0 20px; line-height: 1.5; }
    .notice {
      background: #f7f8fa;
      border-radius: 10px;
      padding: 16px;
      font-size: 13px;
      color: #555;
      line-height: 1.6;
    }
    .notice .notice-title {
      font-weight: 700;
      font-size: 13px;
      color: #222;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 10px;
    }
    .notice .required {
      background: #ffefe9;
      color: #ff5722;
      font-size: 11px;
      font-weight: 700;
      border-radius: 4px;
      padding: 2px 6px;
    }
    .notice dl { margin: 0; }
    .notice dt { font-weight: 600; color: #333; margin-top: 8px; }
    .notice dt:first-child { margin-top: 0; }
    .notice dd { margin: 2px 0 0; }
    .agree {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 16px 2px 20px;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
    }
    .agree input { width: 18px; height: 18px; accent-color: #2f6bff; cursor: pointer; }
    .actions { display: flex; gap: 8px; }
    button, .btn {
      flex: 1;
      border: none;
      border-radius: 10px;
      padding: 14px 0;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      display: inline-block;
    }
    #agreeBtn {
      background: #d9dee6;
      color: #fff;
      transition: background 0.15s;
    }
    #agreeBtn:not(:disabled) { background: #2f6bff; }
    #agreeBtn:disabled { cursor: not-allowed; }
    .btn.secondary { background: #f2f4f6; color: #666; flex: 0 0 96px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">
      <span class="company">${escapeHtml(COMPANY_NAME)}</span>
      <span class="dot">·</span>
      <span class="naver"><span class="badge">N</span> SmartPlace</span>
    </div>
    <div class="body">
      <h1>네이버 스마트플레이스 연동</h1>
      <p class="subtitle">${escapeHtml(COMPANY_NAME)} 포스에서 연동하여 관리하세요.</p>

      <div class="notice">
        <div class="notice-title">개인(신용)정보 제3자 제공 동의 <span class="required">필수</span></div>
        <dl>
          <dt>제공받는 자</dt>
          <dd>네이버 주식회사 (스마트플레이스)</dd>
          <dt>제공 목적</dt>
          <dd>네이버 스마트플레이스 연동 서비스 이용을 위한 매장 확인 및 POS 연동</dd>
          <dt>제공 항목</dt>
          <dd>사업자 등록 정보, 매장 정보 등 (세부 항목은 다음 화면에서 다시 확인합니다)</dd>
          <dt>보유 및 이용 기간</dt>
          <dd>연동 해지 시까지</dd>
        </dl>
      </div>

      <label class="agree">
        <input type="checkbox" id="agreeCheckbox" />
        위 내용에 동의합니다.
      </label>

      <div class="actions">
        <a class="btn secondary" href="/naver/start">취소</a>
        <button id="agreeBtn" disabled onclick="location.href='${escapeHtml(startUrl)}'">동의하고 시작</button>
      </div>
    </div>
  </div>

  <script>
    const checkbox = document.getElementById('agreeCheckbox');
    const button = document.getElementById('agreeBtn');
    checkbox.addEventListener('change', () => {
      button.disabled = !checkbox.checked;
    });
  </script>
</body>
</html>`);
});

module.exports = router;
