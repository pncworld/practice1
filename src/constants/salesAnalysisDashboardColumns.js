/**
 * 홈 「매출 분석」대시보드 — Realgrid 컬럼 정의 (fieldName = 행 객체 키)
 * headerText / width / bodyAlign(near|center|far) / headerBg·headerFg 선택
 * fieldDataType: "number" | "text" — LocalDataProvider 필드 타입
 * numberFormat: RealGrid 표시용 (금액은 "#,##0", 비율 등은 "#,##0.00")
 */

export const COL_WEEKLY = [
  { fieldName: "label", headerText: "구분", width: 100, bodyAlign: "center", fieldDataType: "text" },
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
    headerText: "매출",
    width: 96,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "rate",
    headerText: "달성률",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "wow",
    headerText: "전주대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "yoy",
    headerText: "전년대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
];

export const COL_CUSTOMER = [
  { fieldName: "store", headerText: "매장", width: 72, bodyAlign: "center", fieldDataType: "text" },
  {
    fieldName: "custCount",
    headerText: "고객수",
    width: 92,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "custWow",
    headerText: "전주대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "custYoy",
    headerText: "전년대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "price",
    headerText: "단가",
    width: 92,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "priceWow",
    headerText: "전주대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "priceYoy",
    headerText: "전년대비",
    width: 84,
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
    items: ["custCount", "custWow", "custYoy"],
  },
  {
    name: "sa_g_unit",
    direction: "horizontal",
    header: { visible: true, text: "객단가" },
    items: ["price", "priceWow", "priceYoy"],
  },
];

export const COL_STORE_SALES = [
  { fieldName: "store", headerText: "매장", width: 80, bodyAlign: "center", fieldDataType: "text" },
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
    headerText: "매출",
    width: 96,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0",
  },
  {
    fieldName: "rate",
    headerText: "달성률",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "wow",
    headerText: "전주대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "yoy",
    headerText: "전년대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
];

export const COL_MATERIAL = [
  { fieldName: "store", headerText: "매장", width: 80, bodyAlign: "center", fieldDataType: "text" },
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
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "wow",
    headerText: "전주대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "yoy",
    headerText: "전년대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
];

export const COL_LABOR = [
  { fieldName: "store", headerText: "매장", width: 80, bodyAlign: "center", fieldDataType: "text" },
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
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "wow",
    headerText: "전주대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
  {
    fieldName: "yoy",
    headerText: "전년대비",
    width: 84,
    bodyAlign: "far",
    fieldDataType: "number",
    numberFormat: "#,##0.00",
  },
];
