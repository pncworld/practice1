/**
 * PNC 호스트 구분
 *
 * 로고 표시 (로컬·운영 공통 img src: /image/...)
 * ┌─────────┬──────────────────────────┬─────────────────────────────┐
 * │         │ 프록시                    │ 실제 이미지 원본             │
 * ├─────────┼──────────────────────────┼─────────────────────────────┤
 * │ 로컬    │ devServer proxy.config   │ pncoffice.net (미러)         │
 * │ 운영    │ server.js /image         │ pncoffice.net (미러)         │
 * └─────────┴──────────────────────────┴─────────────────────────────┘
 * pncapi.kr:88 은 브라우저 직접 접근은 되지만, 운영 Node 프록시(HTTPS :88)가
 * 실패해 로고가 깨지므로 프록시 대상은 동일 파일이 있는 pncoffice.net 을 사용.
 * API(commonUrl2) = pncapi.kr — 이미지 서버와 별도
 */
const PNC_API_ORIGIN = "https://pncapi.kr";
const PNC_IMAGE_SERVER_ORIGIN = "https://www.pncapi.kr:88";
const PNC_IMAGE_DEV_MIRROR_ORIGIN = "http://www.pncoffice.net";
/** server.js /image 프록시 target (로컬·운영 동일) */
const PNC_IMAGE_PROXY_TARGET = PNC_IMAGE_DEV_MIRROR_ORIGIN;
module.exports = {
  PNC_API_ORIGIN,
  PNC_IMAGE_SERVER_ORIGIN,
  PNC_IMAGE_DEV_MIRROR_ORIGIN,
  PNC_IMAGE_PROXY_TARGET,
};
