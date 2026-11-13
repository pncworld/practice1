/**
 * 매장 컨텍스트 헬퍼
 *
 * POS 연동 세션(services/posSession.js)이 있으면 그 값만 쓴다.
 *   - 주소의 storeId / naverUniqueId 는 무시한다 (주소만 바꿔 다른 매장으로 진행하는 것 방지)
 *   - storeId 는 "매장그룹-매장코드"
 *   - naverUniqueId 는 이번에 로그인한 계정 → 없으면 우리 DB 에 저장된 계정
 *
 * POS 세션이 없으면(데모·QA 접속) 기존처럼 주소 → 쿠키 → 데모 기본값 순서로 쓴다.
 * refreshToken 은 .env 의 단일 값을 사용한다 (매장별 토큰은 DB 저장 후 교체).
 */
const { readNaverSession } = require("./npSession");
const { getPosSession } = require("./posSession");

function getDemoStoreContext(req) {
  const pos = getPosSession(req);
  if (pos) {
    return {
      storeId: `${pos.storeGroup}-${pos.storeCode}`,
      refreshToken: process.env.DEMO_REFRESH_TOKEN,
      naverUniqueId: pos.loginUniqueId || pos.dbUniqueId || "",
      pos,
    };
  }

  const session = readNaverSession(req);
  return {
    storeId: req.query.storeId || session.storeId || "demo-store-1",
    refreshToken: process.env.DEMO_REFRESH_TOKEN,
    naverUniqueId: req.query.naverUniqueId || session.naverUniqueId || "DEMO_NAVER_UNIQUE_ID",
    pos: null,
  };
}

module.exports = { getDemoStoreContext };
