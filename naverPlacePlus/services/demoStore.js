/**
 * 데모용 매장 컨텍스트 헬퍼
 *
 * 실서비스에서는 로그인 세션에서 storeId를 가져오고, storeId로 DB에서
 * refreshToken / naverUniqueId를 조회해야 합니다.
 * 지금은 쿼리 파라미터를 우선하고, 없으면 이 브라우저에 남겨 둔 쿠키를 씁니다.
 * refreshToken은 .env의 단일 값을 사용합니다 (데모 전용).
 */
const { readNaverSession } = require("./npSession");

function getDemoStoreContext(req) {
  const session = readNaverSession(req);
  return {
    storeId: req.query.storeId || session.storeId || "demo-store-1",
    refreshToken: process.env.DEMO_REFRESH_TOKEN,
    naverUniqueId: req.query.naverUniqueId || session.naverUniqueId || "DEMO_NAVER_UNIQUE_ID",
  };
}

module.exports = { getDemoStoreContext };
