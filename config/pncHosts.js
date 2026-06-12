/**
 * PNC 호스트 구분
 *
 * 로고 표시 (로컬·운영 공통 img src: /image/...)
 * ┌─────────┬──────────────────────────┬─────────────────────────────┐
 * │         │ 프록시                    │ 실제 이미지 원본             │
 * ├─────────┼──────────────────────────┼─────────────────────────────┤
 * │ 로컬    │ devServer proxy.config   │ pncoffice.net (미러)         │
 * │ 운영    │ server.js /image         │ pncapi.kr:88 (이미지 서버)   │
 * └─────────┴──────────────────────────┴─────────────────────────────┘
 * API(commonUrl2) = pncapi.kr — 이미지 서버와 별도
 */
const PNC_API_ORIGIN = "https://pncapi.kr";
const PNC_IMAGE_SERVER_ORIGIN = "https://www.pncapi.kr:88";
const PNC_IMAGE_DEV_MIRROR_ORIGIN = "http://www.pncoffice.net";
module.exports = {
  PNC_API_ORIGIN,
  PNC_IMAGE_SERVER_ORIGIN,
  PNC_IMAGE_DEV_MIRROR_ORIGIN,
};
