/**
 * 데모용 매장 컨텍스트 헬퍼
 *
 * 실서비스에서는 로그인 세션에서 storeId를 가져오고, storeId로 DB에서
 * refreshToken / naverUniqueId를 조회해야 합니다.
 * 지금은 쿼리 파라미터로 storeId/naverUniqueId를 임시로 받고,
 * refreshToken은 .env의 단일 값을 사용합니다 (데모 전용).
 */
function getDemoStoreContext(req) {
  return {
    storeId: req.query.storeId || "demo-store-1",
    refreshToken: process.env.DEMO_REFRESH_TOKEN,
    // naverUniqueId는 로그인(네이버 프로필 조회 API) 시점에 이미 확보되어
    // 세션이나 DB에 저장되어 있어야 하는 값입니다. 데모에서는 쿼리로 흉내냅니다.
    naverUniqueId: req.query.naverUniqueId || "DEMO_NAVER_UNIQUE_ID",
  };
}

module.exports = { getDemoStoreContext };
