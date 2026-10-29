/**
 * 플레이스+ 프론트엔드(사용자가 직접 보는 화면) 호스트
 *
 * 약관동의(/embed/terms), 업체찾기(/bizes/lookup)로 리다이렉트할 때 씁니다.
 * PLACE_API_ENV=test 이면 개발 화면, production 이면 운영 화면입니다.
 */
const PROD_FRONT =
  process.env.SMARTPLACE_FRONT_HOST_PROD || "https://new.smartplace.naver.com";
const TEST_FRONT =
  process.env.SMARTPLACE_FRONT_HOST_TEST || "https://test-new.smartplace.naver.com";

const FRONT_HOST =
  process.env.PLACE_API_ENV === "production" ? PROD_FRONT : TEST_FRONT;

module.exports = { FRONT_HOST };
