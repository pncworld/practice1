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
const { renderLayout } = require("../ui/layout");

const COMPANY_NAME = process.env.COMPANY_NAME || "우리 회사";

router.get("/", (req, res) => {
  const storeId = req.query.storeId || "demo-store-1";
  const startUrl = `/naver/login/start?storeId=${encodeURIComponent(storeId)}`;

  res.send(
    renderLayout({
      title: "네이버 스마트플레이스 연동",
      heading: "네이버 스마트플레이스 연동",
      subtitle: `${COMPANY_NAME}에서 연동하여 관리하세요.`,
      body: `
        <div class="notice-box">
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

        <div class="btn-row">
          <a class="btn btn-ghost" href="/naver/start">취소</a>
          <button class="btn btn-primary is-disabled" id="agreeBtn" disabled type="button">동의하고 시작</button>
        </div>
      `,
      extraScript: `
        <script>
          const checkbox = document.getElementById("agreeCheckbox");
          const button = document.getElementById("agreeBtn");
          const startUrl = ${JSON.stringify(startUrl)};
          checkbox.addEventListener("change", () => {
            button.disabled = !checkbox.checked;
            button.classList.toggle("is-disabled", !checkbox.checked);
          });
          button.addEventListener("click", () => {
            if (!button.disabled) location.href = startUrl;
          });
        </script>
      `,
    })
  );
});

module.exports = router;
