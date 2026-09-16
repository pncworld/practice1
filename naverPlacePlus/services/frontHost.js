/**
 * 스마트플레이스 프론트엔드(사용자가 직접 보는 화면) 호스트
 *
 * 약관동의(/embed/terms), 업체찾기(/bizes/lookup), 리뷰관리(/embed/bizes/...)처럼
 * 네이버가 제공하는 페이지로 리다이렉트할 때 씁니다.
 *
 * 테스트 FE(test-new.smartplace.naver.com)는 브라우저에서 열리지 않는다.
 * API는 PLACE_API_ENV=test 를 유지하고, 사람이 보는 화면만 운영 FE를 쓴다.
 */
const PROD_FRONT =
  process.env.SMARTPLACE_FRONT_HOST_PROD || "https://new.smartplace.naver.com";
const TEST_FRONT = process.env.SMARTPLACE_FRONT_HOST_TEST || "";
const TEST_FRONT_UNUSABLE = TEST_FRONT.includes("test-new.smartplace.naver.com");

const FRONT_HOST =
  process.env.PLACE_API_ENV === "production" || !TEST_FRONT || TEST_FRONT_UNUSABLE
    ? PROD_FRONT
    : TEST_FRONT;

module.exports = { FRONT_HOST };
