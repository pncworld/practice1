/**
 * 네이버 스마트플레이스 "약관 동의" 리다이렉트 플로우
 *
 * 가이드 슬라이드 21 "스마트플레이스 사업자약관 동의 및 확인" 기준:
 *
 *   1. 별도 API로 약관 동의 UI를 직접 구현하지 않고, 네이버가 제공하는
 *      약관동의 페이지로 리다이렉트한다.
 *
 *   2. 리다이렉트 URL 형식:
 *        https://new.smartplace.naver.com/embed/terms
 *          ?service=pos_xxxx,mybiz,booking
 *          &to={redirectURL}
 *
 *      - service 파라미터 (콤마로 여러 개 지정 가능):
 *          pos_xxxx : "xxxx" 자리에 우리 회사 코드가 들어감 (필수)
 *                     → 사업자 등록 정보를 POS사에 제공하기 위한 동의
 *          booking  : 예약/주문 등 솔루션 사용 시 필요한 약관 (필수로 쓰는 경우)
 *          mybiz    : 파이낸셜 통합 사업자 서비스 동의 (선택 — 필요할 때만 추가)
 *
 *      - to 파라미터: 동의 완료 후 돌아올 콜백 URL. 반드시 URL 인코딩되어야
 *        정상 동작한다. 값이 없거나 리다이렉트가 실패하면 네이버는 스마트
 *        플레이스 메인 화면으로 이동시켜 버린다.
 *
 *   3. 동의 완료 후 콜백으로 돌아오면, 실제로 필수 약관에 모두 동의했는지는
 *      "동의여부 조회 API"(GET /v1/pbp-owner-member/agency-target-summary)로
 *      **반드시 서버에서 재검증**해야 한다. 리다이렉트로 돌아왔다는 사실 자체는
 *      동의 완료를 보장하지 않는다 (사용자가 취소했을 수도 있음).
 *
 *   4. 미동의 상태라면 다시 같은 약관동의 페이지로 보내야 한다.
 */

const express = require("express");
const router = express.Router();

const { getAccessToken } = require("../services/naverAuth");
const {
  getAgreementSummary,
  hasAllRequiredAgreements,
} = require("../services/placeApi");
const { getDemoStoreContext } = require("../services/demoStore");
const { FRONT_HOST } = require("../services/frontHost");
const { getBaseUrl } = require("../services/baseUrl");

/**
 * STEP 1. 약관 동의 시작
 *
 * 프론트엔드는 "약관 동의하러 가기" 버튼을 누르면 이 라우트로 이동시킵니다.
 * 이 라우트는 네이버 약관동의 페이지로 302 리다이렉트합니다.
 *
 * GET /naver/terms/start?storeId=xxx
 */
router.get("/start", (req, res) => {
  const { storeId, naverUniqueId } = getDemoStoreContext(req);

  const callbackUrl = new URL(
    "/naver/terms/callback",
    getBaseUrl(req)
  );
  callbackUrl.searchParams.set("storeId", storeId);
  // naverUniqueId도 함께 실어 보내야, 콜백에서 "동의여부 조회 API"를
  // 실제 로그인한 사용자 기준으로 재검증할 수 있습니다.
  callbackUrl.searchParams.set("naverUniqueId", naverUniqueId);

  const serviceCode = process.env.POS_SERVICE_CODE; // e.g. pos_xxxx
  const services = [serviceCode, "booking"].join(","); // mybiz는 필요할 때만 추가

  const termsUrl = new URL("/embed/terms", FRONT_HOST);
  termsUrl.searchParams.set("service", services);
  termsUrl.searchParams.set("to", callbackUrl.toString());

  res.redirect(termsUrl.toString());
});

/**
 * STEP 2. 약관 동의 완료 후 콜백
 *
 * 네이버가 동의 절차를 마친 뒤 사용자를 이 URL로 돌려보냅니다.
 * 반드시 동의여부 조회 API로 서버에서 재검증합니다.
 *
 * GET /naver/terms/callback?storeId=xxx
 */
router.get("/callback", async (req, res) => {
  const { storeId, refreshToken, naverUniqueId } = getDemoStoreContext(req);

  try {
    const accessToken = await getAccessToken(storeId, refreshToken);
    const summary = await getAgreementSummary({ accessToken, naverUniqueId });

    if (hasAllRequiredAgreements(summary)) {
      // 필수 약관 모두 동의됨 → 다음 단계(플레이스 목록 조회 화면)로 이동
      return res.redirect(
        `/naver/places?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}`
      );
    }

    // 미동의 항목이 남아있음 → 다시 약관동의 페이지로 보낸다 (가이드 항목 4)
    return res.redirect(
      `/naver/terms/start?storeId=${encodeURIComponent(storeId)}&naverUniqueId=${encodeURIComponent(naverUniqueId)}`
    );
  } catch (err) {
    console.error("[naver/terms/callback] 동의여부 조회 실패:", err.message);
    return res.status(502).send("동의 여부를 확인하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
  }
});

module.exports = router;
