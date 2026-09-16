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
      wide: true,
      body: `
        <div class="notice-box">
          <div class="notice-title">개인(신용)정보 제3자 제공 동의 <span class="required">필수</span></div>
          <p class="notice-lead">
            「개인정보 보호법」 제17조 및 「신용정보의 이용 및 보호에 관한 법률」에 따라,
            네이버 스마트플레이스 연동을 위해 아래와 같이 개인(신용)정보를 제3자에게 제공합니다.
            아래 내용을 확인하신 후 동의 여부를 결정해 주시기 바랍니다.
          </p>
          <dl>
            <dt>개인(신용)정보를 제공받는 자</dt>
            <dd>네이버 주식회사 (스마트플레이스)</dd>
            <dt>제공받는 자의 이용 목적</dt>
            <dd>
              네이버 스마트플레이스 연동 서비스 제공, 매장(사업장) 확인 및 식별,
              POS와 스마트플레이스 간 매장 연동·연동 유지 및 해지 처리
            </dd>
            <dt>제공하는 개인(신용)정보의 항목</dt>
            <dd>
              사업자등록번호, 상호, 대표자 성명, 사업장 주소, 업태·종목,
              매장명, 매장 연락처, 영업시간 등 매장·사업자 정보,
              네이버 아이디로 로그인 시 수집되는 식별정보(네이버 Unique ID)
            </dd>
            <dt>제공받는 자의 보유 및 이용 기간</dt>
            <dd>
              연동 목적 달성 시까지(연동 해지 시까지).
              다만 관련 법령에 따라 보존이 필요한 경우 해당 법령에서 정한 기간까지 보유합니다.
            </dd>
            <dt>제공 방법</dt>
            <dd>정보통신망을 통한 전송</dd>
            <dt>동의 거부 권리 및 거부 시 불이익</dt>
            <dd>
              귀하는 위 제3자 제공에 대한 동의를 거부할 수 있습니다.
              다만 본 동의는 네이버 스마트플레이스 연동에 필수이므로,
              동의하지 않으실 경우 해당 연동 서비스를 이용하실 수 없습니다.
            </dd>
          </dl>
          <p class="notice-refuse">
            동의한 이후에도 연동을 해지하면 제공 목적이 종료되며, 이후 네이버 스마트플레이스에서 요구하는
            약관 및 정보 제공 동의는 다음 화면에서 별도로 진행됩니다.
          </p>
        </div>

        <label class="agree">
          <input type="checkbox" id="agreeCheckbox" />
          위 개인(신용)정보 제3자 제공에 동의합니다. (필수)
        </label>

        <div class="btn-row">
          <a class="btn btn-ghost" href="/naver/start">취소</a>
          <button class="btn btn-primary is-disabled" id="agreeBtn" disabled type="button">동의하고 시작</button>
        </div>
      `,
      extraScript: `
        <script>
          try {
            if (sessionStorage.getItem("np_close_naver_logout")) {
              sessionStorage.removeItem("np_close_naver_logout");
              var npLogoutWin = window.open("", "np_naver_logout");
              if (npLogoutWin && !npLogoutWin.closed) npLogoutWin.close();
            }
          } catch (e) {}
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
