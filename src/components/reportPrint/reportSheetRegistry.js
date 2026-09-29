/**
 * 레포트 시트 등록부 — 이후 CRPrint 이전 시 reportId → 시트 컴포넌트 매핑
 * 1차: 발주서는 화면에서 PurchaseOrderPrintSheet 를 직접 slot 연결
 */
export const REPORT_IDS = Object.freeze({
  PUR_ORDER_PART: "PUR_ORDER_PART",
  PUR_ORDER: "PUR_ORDER",
  STK05_013: "STK05_013",
});

/** @type {Record<string, import('vue').Component>} */
const registry = Object.create(null);

export function registerReportSheet(reportId, component) {
  if (!reportId || !component) return;
  registry[reportId] = component;
}

export function getReportSheet(reportId) {
  return registry[reportId] ?? null;
}
