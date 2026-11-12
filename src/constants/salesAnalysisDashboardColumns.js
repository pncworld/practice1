/**
 * 홈 「매출 분석」대시보드 — Realgrid 컬럼 정의 (fieldName = 행 객체 키)
 * headerText / width / bodyAlign(near|center|far) / headerBg·headerFg 선택
 * fieldDataType: "number" | "text" — LocalDataProvider 필드 타입
 * numberFormat: RealGrid 표시용 (금액은 "#,##0", 비율 등은 "#,##0.00")
 */

export const COL_WEEKLY = [
  { fieldName: "label", headerText: "구분", width: 80, bodyAlign: "center", fieldDataType: "text" },
  {
    fieldName: "target",
    headerText: "목표",
    width: 96,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "actual",
    headerText: "실적",
    width: 96,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "rate",
    headerText: "달성률",
    width: 68,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "wow",
    headerText: "전주비(%)",
    width: 68,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "mom",
    headerText: "전월비(%)",
    width: 68,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "yoy",
    headerText: "전년비(%)",
    width: 68,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
];

export const COL_CUSTOMER = [
  { fieldName: "store", headerText: "매장", width: 88, bodyAlign: "center", fieldDataType: "text" },
  {
    fieldName: "custCount",
    headerText: "고객수",
    width: 71,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "custWow",
    headerText: "전주비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "custMom",
    headerText: "전월비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "custYoy",
    headerText: "전년비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "price",
    headerText: "단가",
    width: 71,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "priceWow",
    headerText: "전주비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "priceMom",
    headerText: "전월비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "priceYoy",
    headerText: "전년비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
];

/** 객수/객단가 — 2단 헤더용 `setColumnLayout` (COL_CUSTOMER 와 함께 사용) */
export const COL_CUSTOMER_LAYOUT = [
  {
    name: "sa_g_div",
    direction: "horizontal",
    header: { visible: true, text: "구분" },
    items: ["store"],
  },
  {
    name: "sa_g_cust",
    direction: "horizontal",
    header: { visible: true, text: "객수" },
    items: ["custCount", "custWow", "custMom", "custYoy"],
  },
  {
    name: "sa_g_unit",
    direction: "horizontal",
    header: { visible: true, text: "객단가" },
    items: ["price", "priceWow", "priceMom", "priceYoy"],
  },
];

export const COL_STORE_SALES = [
  { fieldName: "store", headerText: "매장", width: 88, bodyAlign: "center", fieldDataType: "text" },
  {
    fieldName: "target",
    headerText: "목표",
    width: 88,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "actual",
    headerText: "매출",
    width: 88,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "rate",
    headerText: "달성률",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "wow",
    headerText: "전주비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "mom",
    headerText: "전월비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "yoy",
    headerText: "전년비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  // 2026-11-11 멤버십: 조회 기간 가입 수 (고객 가입 현황 CRM01_010RPT 총가입고객 기준)
  {
    fieldName: "member",
    headerText: "멤버십",
    width: 60,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
];

/**
 * 재료비(원가) — `usp_VUE_saGetMaterialCostByStore` (2026-11-11 요청서 양식)
 * 목표원가율 · 매입원가율 · 차이(%) · X월 원가 · 전월비 · 전년비
 * - 차이(%) = 목표원가율 − 매입원가율, 양수 빨강·음수 파랑 (`signColor`)
 * - X월 = 오늘(서울) 기준 전월. 프로시저도 같은 기준(GETDATE 전월)
 * - 전월비·전년비 = 매입원가율 ÷ 비교 기간 매입원가율 × 100
 */
function getMaterialXMonthNumber() {
  try {
    const m = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Seoul", month: "numeric" }).format(
        new Date()
      )
    );
    if (Number.isFinite(m) && m >= 1 && m <= 12) return m === 1 ? 12 : m - 1;
  } catch (_) {
    void 0;
  }
  const m = new Date().getMonth() + 1;
  return m === 1 ? 12 : m - 1;
}

export const COL_MATERIAL = [
  { fieldName: "store", headerText: "매장", width: 88, bodyAlign: "center", fieldDataType: "text" },
  {
    fieldName: "targetRate",
    headerText: "목표원가율",
    width: 70,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "actualRate",
    headerText: "매입원가율",
    width: 70,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "rateDiff",
    headerText: "차이(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
    signColor: true,
    tooltip: (row) => getMaterialBlankReason(row, "rateDiff"),
  },
  {
    fieldName: "xRate",
    headerText: `${getMaterialXMonthNumber()}월 원가(%)`,
    width: 69,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
    tooltip: (row) => getMaterialBlankReason(row, "xRate"),
  },
  {
    fieldName: "mom",
    headerText: "전월비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
    tooltip: (row) => getMaterialBlankReason(row, "mom"),
  },
  {
    fieldName: "yoy",
    headerText: "전년비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
    tooltip: (row) => getMaterialBlankReason(row, "yoy"),
  },
];

/**
 * 예약현황 — `usp_VUE_saGetReservationByStore` / `getReservationByStore`
 * 컬럼: store, rsv, mom, yoy, grp, grp_yoy
 */
/** 예약현황 — 2026-11-11 전주비·단체 전주비·단체 전월비 추가 (조회 기간 기준, 미래 날짜 조회 가능) */
export const COL_RESERVATION = [
  { fieldName: "store", headerText: "매장", width: 88, bodyAlign: "center", fieldDataType: "text" },
  {
    fieldName: "rsv",
    headerText: "예약인원",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "wow",
    headerText: "전주비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.0",
  },
  {
    fieldName: "mom",
    headerText: "전월비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.0",
  },
  {
    fieldName: "yoy",
    headerText: "전년비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.0",
  },
  {
    fieldName: "grp",
    headerText: "단체건수",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "grp_wow",
    headerText: "전주비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.0",
  },
  {
    fieldName: "grp_mom",
    headerText: "단체 전월비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.0",
  },
  {
    fieldName: "grp_yoy",
    headerText: "단체 전년비(%)",
    width: 65,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.0",
  },
];

/** @deprecated 예약현황으로 교체 — COL_RESERVATION 사용 */
export const COL_LABOR = COL_RESERVATION;

/**
 * 2단 헤더(`columnLayout`)의 위쪽 줄 — 출력·엑셀용. 열 순서대로 `{ text, span }`.
 * 레이아웃이 없거나 열 개수가 맞지 않으면 `null` (1단 헤더 그대로)
 * @param {{ fieldName: string }[]} columns
 * @param {Array<{ header?: { text?: string }; items?: string[] }> | null | undefined} layout
 * @returns {{ text: string; span: number }[] | null}
 */
export function getDashGroupHeaderCells(columns, layout) {
  if (!Array.isArray(layout) || !layout.length || !Array.isArray(columns)) return null;
  const order = columns.map((c) => c.fieldName);
  const cells = [];
  let pos = 0;
  for (const g of layout) {
    const items = Array.isArray(g?.items) ? g.items : [];
    if (!items.length) return null;
    for (const it of items) {
      if (order[pos] !== it) return null;
      pos += 1;
    }
    cells.push({ text: String(g?.header?.text ?? ""), span: items.length });
  }
  return pos === order.length ? cells : null;
}

/**
 * 재료비 빈칸 사유 (마우스오버 tooltip) — 값이 있으면 `""`
 * @param {Record<string, unknown>} row
 * @param {string} fieldName
 */
export function getMaterialBlankReason(row, fieldName) {
  if (!row || row[fieldName] != null) return "";
  const target = Number(row.targetRate) || 0;
  const actual = Number(row.actualRate) || 0;
  if (fieldName === "rateDiff") {
    const why = [];
    if (target === 0) why.push("목표원가율 미입력");
    if (actual === 0) why.push("조회 기간 매입 없음");
    return why.join(", ");
  }
  if (fieldName === "xRate") {
    const x = getMaterialXMonthNumber();
    return `${x}월 자재 월마감 전 (또는 ${x}월 매출 없음)`;
  }
  if (fieldName === "mom" || fieldName === "yoy") {
    if (actual === 0) return "조회 기간 매입 없음";
    return fieldName === "mom" ? "한 달 전 같은 기간 매입 없음" : "1년 전 같은 기간 매입 없음";
  }
  return "";
}
