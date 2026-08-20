/**
 * 스마트플레이스 프론트엔드(사용자가 직접 보는 화면) 호스트
 *
 * 약관동의(/embed/terms), 업체찾기(/bizes/lookup), 리뷰관리(/embed/bizes/...)처럼
 * 네이버가 제공하는 페이지로 리다이렉트할 때 씁니다.
 * PLACE_API_HOST / AUTH_API_HOST와 마찬가지로 PLACE_API_ENV 값에 따라
 * 테스트/운영 도메인을 구분합니다 (가이드 슬라이드 37 "API 및 FE 도메인" 참고).
 */
const FRONT_HOST =
  process.env.PLACE_API_ENV === "production"
    ? process.env.SMARTPLACE_FRONT_HOST_PROD
    : process.env.SMARTPLACE_FRONT_HOST_TEST;

module.exports = { FRONT_HOST };
