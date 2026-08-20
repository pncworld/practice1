/**
 * 플레이스 연동 API 클라이언트
 *
 * 모든 API 호출 시 공통 헤더 (가이드 슬라이드 15 "[공통] 연동 API 호출 방법" +
 * 슬라이드 19):
 *   - Content-Type           : application/json
 *   - Authorization          : Bearer {ACCESS_TOKEN}  (Bearer 문구 누락 주의)
 *   - X-Naver-Unique-Id      : 조회하고자 하는 네아로 UniqueID
 *   - X-Naver-Client-Id      : 네아로 애플리케이션 정보 (Client ID)
 *   - X-Naver-Client-Secret  : 네아로 애플리케이션 정보 (Client Secret)
 */

const axios = require("axios");

const PLACE_HOST =
  process.env.PLACE_API_ENV === "production"
    ? process.env.PLACE_API_HOST_PROD
    : process.env.PLACE_API_HOST_TEST;

/**
 * @param {object} params
 * @param {string} params.accessToken
 * @param {string} params.naverUniqueId  네이버 프로필 조회 API의 response.id 값
 */
function buildHeaders({ accessToken, naverUniqueId }) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "X-Naver-Unique-Id": naverUniqueId,
    "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
  };
}

/**
 * 약관 동의 / 정보제공 동의 여부를 조회합니다.
 * (가이드 슬라이드 22: GET /v1/pbp-owner-member/agency-target-summary)
 *
 * projections에 아래 값을 넣어 원하는 항목만 조회 가능:
 *   - AGREED_PLACE_PRIVACY_AGREEMENTS : 동의한 약관 목록 배열
 *   - MY_BIZ_AGREEMENT                : 마이비즈 동의 여부(boolean|null)
 */
async function getAgreementSummary({ accessToken, naverUniqueId }) {
  const url = `${PLACE_HOST}/v1/pbp-owner-member/agency-target-summary`;

  const { data } = await axios.get(url, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
    params: {
      projections: "AGREED_PLACE_PRIVACY_AGREEMENTS,MY_BIZ_AGREEMENT",
    },
  });

  return data;
  // 응답 예시:
  // {
  //   "ownerMemberStatus": "REGULAR",
  //   "isJoinedMember": true,
  //   "isWithdrawing": false,
  //   "agreedPlacePrivacyAgreementTypes": [
  //     "PROMOTION_RECEIVE",
  //     "SMARTPLACE_BUSINESS_TERMS",
  //     "SMARTPLACE_INTEGRATED_TERMS",
  //     "AGENCY_BUSINESS_DATA_PROVISION"
  //   ],
  //   "isMyBizAgreed": true
  // }
}

/**
 * 필수 약관(통합약관 + 비즈니스약관 + 사업자정보제공동의)이
 * 모두 동의되어 있는지 판별하는 헬퍼.
 */
function hasAllRequiredAgreements(summary) {
  const REQUIRED = [
    "SMARTPLACE_INTEGRATED_TERMS", // 스마트플레이스 통합 이용약관
    "SMARTPLACE_BUSINESS_TERMS", // 스마트플레이스 비즈니스 이용약관 (booking 파라미터로 노출됨)
    "AGENCY_BUSINESS_DATA_PROVISION", // 사업자 등록 정보 제공 동의
  ];

  const agreed = summary.agreedPlacePrivacyAgreementTypes || [];
  return REQUIRED.every((type) => agreed.includes(type));
}

/**
 * 주인권한을 보유한 업체 목록을 조회합니다.
 * (가이드 슬라이드 23: GET /v1/custom/pos/place-businesses)
 */
async function getPlaceBusinesses({ accessToken, naverUniqueId, page = 0 }) {
  const url = `${PLACE_HOST}/v1/custom/pos/place-businesses`;

  const response = await axios.get(url, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
    params: { page },
  });

  const totalCount = Number(response.headers["x-total-count"] || 0);

  return {
    items: response.data,
    totalCount,
    page,
  };
}

/**
 * 선택한 업체(placeId)에 연동을 추가합니다.
 * (가이드 슬라이드 24: POST /v1/custom/pos/place-businesses/place-id/{placeId}/agency-mappings)
 */
async function addAgencyMapping({ accessToken, naverUniqueId, placeId }) {
  const url = `${PLACE_HOST}/v1/custom/pos/place-businesses/place-id/${placeId}/agency-mappings`;

  const { data } = await axios.post(
    url,
    {},
    { headers: buildHeaders({ accessToken, naverUniqueId }) }
  );

  return data;
  // 성공 응답 예시: { "placeId": "20498491710", "regDateTime": "2025-05-13T13:47:46.737+09:00" }
  // 오류 응답:
  //   401 -> { "errorCode": "Unauthorized" }
  //   404 -> { "errorCode": "PlaceBusinessNotFound", ... }
}

/**
 * 연동 여부를 조회합니다. (연동 추가 API와 동일한 URL, GET)
 * 연동돼 있지 않으면 404(PlaceBusinessNotFound) 또는 409
 * (PlaceBusinessAgencyMappingNotFound)가 발생합니다 — 호출부에서 "미연동"으로 처리하세요.
 */
async function getAgencyMapping({ accessToken, naverUniqueId, placeId }) {
  const url = `${PLACE_HOST}/v1/custom/pos/place-businesses/place-id/${placeId}/agency-mappings`;

  const { data } = await axios.get(url, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
  });

  return data; // { placeId, regDateTime }
}

/**
 * 연동을 해지합니다. (204 No Content 성공)
 */
async function deleteAgencyMapping({ accessToken, naverUniqueId, placeId }) {
  const url = `${PLACE_HOST}/v1/custom/pos/place-businesses/place-id/${placeId}/agency-mappings`;

  await axios.delete(url, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
  });
}

/**
 * 스마트플레이스 업종을 조회합니다. 업체 등록/수정 시 categoryId가 필요합니다.
 */
async function getCategories({
  accessToken,
  naverUniqueId,
  search,
  categoryIds,
  brandCategoryIds,
}) {
  const url = `${PLACE_HOST}/v1/custom/pos/categories`;

  const { data } = await axios.get(url, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
    params: { search, categoryIds, brandCategoryIds },
  });

  return data;
}

/**
 * 업체 중복 여부를 체크합니다. (businessName + address) 또는 registrationNumber가 필요합니다.
 * 신규 업체 등록 전에 먼저 호출해서 이미 존재하는 업체인지 확인하는 용도입니다.
 */
async function checkDuplicateBusiness({ accessToken, naverUniqueId, business }) {
  const url = `${PLACE_HOST}/v1/custom/pos/duplicate-check`;

  const { data } = await axios.post(url, business, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
  });

  return data;
}

/**
 * placeId 기준 업체 단건 상세 정보를 조회합니다.
 */
async function getPlaceBusinessDetail({ accessToken, naverUniqueId, placeId }) {
  const url = `${PLACE_HOST}/v1/custom/pos/place-businesses/place-id/${placeId}`;

  const { data } = await axios.get(url, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
  });

  return data;
}

/**
 * 업체를 신규 등록하거나(placeId 없을 때) 기존 업체를 수정합니다(placeId 있을 때).
 * 201 Created(신규) 또는 204 No Content(수정)를 응답합니다.
 * 호출한 naverUniqueId가 해당 업체의 주인권한을 갖게 됩니다.
 */
async function upsertPlaceBusiness({ accessToken, naverUniqueId, business }) {
  const url = `${PLACE_HOST}/v1/custom/pos/integration`;

  const response = await axios.post(url, business, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
  });

  return { status: response.status, data: response.data };
}

/**
 * 공휴일 정보를 조회합니다. 업체 등록/수정 시 bizDays.closedDays.holiday.dateIds에
 * 사용할 공휴일 id를 이 API로 먼저 조회해야 합니다.
 */
async function getHolidays({ accessToken, naverUniqueId, startDate, endDate }) {
  const url = `${PLACE_HOST}/v1/holidays`;

  const { data } = await axios.get(url, {
    headers: buildHeaders({ accessToken, naverUniqueId }),
    params: { startDate, endDate },
  });

  return data;
}

module.exports = {
  getAgreementSummary,
  hasAllRequiredAgreements,
  getPlaceBusinesses,
  addAgencyMapping,
  getAgencyMapping,
  deleteAgencyMapping,
  getCategories,
  checkDuplicateBusiness,
  getPlaceBusinessDetail,
  upsertPlaceBusiness,
  getHolidays,
};
