/**
 * 홈 「매출 분석」대시보드 — 5개 그리드용 API 경로.
 * 호출은 `src/api/common.js`의 `api2` 기준 상대경로입니다.
 *
 * **공통 요청 바디**(5개 전부 동일): `GROUP_CD`, `STORE_CD`, `SEQUENCE`, `FROM_DT`, `TO_DT` (`yyyy-mm-dd` 권장)
 * — `buildSalesAnalysisDashBody` / `getWeeklyKeyIndicators` 등은 `src/api/common.js` 참고.
 *
 * **vewStoreSales 매출**: 5개 그리드·프로시저는 동일 의미로 **`lngActAmt`(실매출)** 집계를 권장합니다.
 * (`lngSalAmt`와 혼용하면 주간 합계·매장 매출 합계·객단가가 서로 맞지 않을 수 있습니다.)
 *
 * 예) api2.post(SALES_ANALYSIS_DASHBOARD_API.weeklyKeyIndicators, { … })
 *
 * 백엔드 asmx·메서드명은 프로젝트 규칙에 맞게 수정하면 됩니다.
 * (기존 `salesDash5001.asmx` 등 → `MISALES/SLS00_001DASH.asmx` 로 맞추거나 경로만 이 상수와 통일)
 */

/**
 * 상세 페이지 탭 열기 — 메뉴의 `lngProgramID`·XML 경로와 일치해야 합니다.
 * @type {{ strUrl: string; lngProgramID: number; strTitle: string }}
 */
export const SALES_ANALYSIS_DASHBOARD_DETAIL_TAB = {
  strUrl: "MISALE::SLS14_032RPT.xml",
  lngProgramID: 0,
  strTitle: "매출 분석 상세",
};

/**
 * 홈 매출 분석 —「매출목표 등록」버튼 → `MISALES/SLS01_001INS.xml`
 * - `minorCategory`에서 `SLS01_001INS.xml` 조회 후 `moveOtherTab`(좌측 메뉴와 동일 탭)으로 열림.
 * - 메뉴에 없으면 `lngProgramID`·strUrl 폴백 사용, 0이면 라우터 직접 이동.
 * @type {{ strUrl: string; lngProgramID: number; strTitle: string }}
 */
export const SALES_GOAL_REGISTRATION_TAB = {
  strUrl: "MISALE::SLS01_001INS.xml",
  lngProgramID: 0,
  strTitle: "매출목표 등록",
};

/**
 * 홈에서 매출 분석 대시보드 카드를 띄울 (그룹, `lngUserAdminID`) 규칙.
 * - 5001: 92만
 * - 1871: 30, 120 (60은 기존 홈 대시보드 유지)
 * - 3015: 110
 * 신규 대시보드 5개 API 호출 여부는 `SalesAnalysisDashboard`의 `shouldSkipSalesAnalysisDashApis`만 따르며, 홈에 카드를 띄울지와는 별개(컴포넌트가 마운트될 때만 해당 API 실행).
 * (제거 시 `homePage2`·`SalesAnalysisDashboard` 분기 함께 정리)
 * @type {readonly { lngStoreGroup: string; lngUserAdminIDs: readonly number[] }[]}
 */
export const SALES_ANALYSIS_HOME_TEMP_BYPASS_RULES = Object.freeze([
  Object.freeze({
    lngStoreGroup: "5001",
    lngUserAdminIDs: Object.freeze([92]),
  }),
  Object.freeze({
    lngStoreGroup: "1871",
    lngUserAdminIDs: Object.freeze([30, 120]),
  }),
  Object.freeze({
    lngStoreGroup: "3015",
    lngUserAdminIDs: Object.freeze([110]),
  }),
]);

/**
 * 세션이 위 임시 규칙 중 하나와 일치하는지
 * @param {Record<string, unknown>|unknown} u userData
 */
export function matchesSalesAnalysisHomeTempBypass(u) {
  if (!u || typeof u !== "object" || Array.isArray(u)) return false;
  const grp = String(/** @type {{ lngStoreGroup?: unknown }} */ (u).lngStoreGroup ?? "");
  const aid = Number(/** @type {{ lngUserAdminID?: unknown }} */ (u).lngUserAdminID);
  if (!Number.isFinite(aid)) return false;
  return SALES_ANALYSIS_HOME_TEMP_BYPASS_RULES.some(
    (r) => r.lngStoreGroup === grp && r.lngUserAdminIDs.includes(aid)
  );
}

export const SALES_ANALYSIS_DASHBOARD_API = {
  /** 1. 주간 핵심 지표 — Body: GROUP_CD, STORE_CD, SEQUENCE, FROM_DT, TO_DT */
  weeklyKeyIndicators: "/MISALES/SLS00_001DASH.asmx/getWeeklyKeyIndicators",

  /**
   * 2. 객수 / 객단가 — 매장별
   * Body: GROUP_CD, STORE_CD(본사 0), SEQUENCE, FROM_DT, TO_DT (`yyyy-mm-dd` 권장)
   */
  customerAndUnitPriceByStore:
    "/MISALES/SLS00_001DASH.asmx/getCustomerAndUnitPriceByStore",

  /** 3. 매장 매출 — 매장별 (동일 Body) */
  storeSalesByStore: "/MISALES/SLS00_001DASH.asmx/getStoreSalesByStore",

  /** 4. 재료비 — 매장별 (동일 Body) */
  materialCostByStore: "/MISALES/SLS00_001DASH.asmx/getMaterialCostByStore",

  /** 5. 인건비 — 매장별 (동일 Body) */
  laborCostByStore: "/MISALES/SLS00_001DASH.asmx/getLaborCostByStore",
};
