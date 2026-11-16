/**
 * 객단가·조단가 순매출(부가세 제외) 기준 재계산 — 2026-11-13
 *
 * - 대상 그룹(NET_UNIT_PRICE_GROUPS)일 때만 화면에서 다시 계산한다. 그 외 그룹은 받은 값 그대로.
 * - 계산식: 실매출 ÷ 1.1 ÷ 객수(조수). 매출 분석 대시보드 객단가와 같은 기준.
 * - 프로시저·ASMX는 바꾸지 않는다. 각 화면이 조회 결과를 rowData에 넣기 전에 opt-in으로 호출한다.
 */

/** 순매출 기준 객단가·조단가를 적용할 매장 그룹 (마키노차야) */
export const NET_UNIT_PRICE_GROUPS = Object.freeze(["1871"]);

/** 실매출 → 순매출 환산 (부가세 10%) */
export const NET_UNIT_PRICE_VAT_DIVISOR = 1.1;

/**
 * 순매출 기준 적용 그룹인지
 * @param {unknown} group lngStoreGroup
 */
export function isNetUnitPriceGroup(group) {
  return NET_UNIT_PRICE_GROUPS.includes(String(group ?? "").trim());
}

function toNum(v) {
  if (v === null || v === undefined || v === "") return NaN;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function roundBy(v, digits, floor) {
  const p = 10 ** (digits || 0);
  return (floor ? Math.floor(v * p) : Math.round(v * p)) / p;
}

/**
 * 한 행의 단가 값을 순매출 기준으로 계산
 * @param {Record<string, unknown>} row
 * @param {{ target: string; amount?: string; amounts?: string[]; count?: string; counts?: string[]; digits?: number; floor?: boolean }} spec
 *  - amount(s)·count(s) 있으면: Σ실매출 ÷ 1.1 ÷ Σ개수 (개수 0이면 원래 값 유지)
 *  - amount 없으면: 받은 단가 ÷ 1.1
 * @returns {number|undefined} 계산할 수 없으면 undefined
 */
function calcNetPrice(row, spec) {
  const amountKeys = spec.amounts || (spec.amount ? [spec.amount] : []);
  const countKeys = spec.counts || (spec.count ? [spec.count] : []);
  if (amountKeys.length && countKeys.length) {
    let amount = 0;
    let count = 0;
    for (const k of amountKeys) {
      const n = toNum(row[k]);
      if (Number.isNaN(n)) return undefined;
      amount += n;
    }
    for (const k of countKeys) {
      const n = toNum(row[k]);
      if (Number.isNaN(n)) return undefined;
      count += n;
    }
    if (count === 0) return undefined;
    return roundBy(amount / NET_UNIT_PRICE_VAT_DIVISOR / Math.abs(count), spec.digits, spec.floor);
  }
  const cur = toNum(row[spec.target]);
  if (Number.isNaN(cur)) return undefined;
  return roundBy(cur / NET_UNIT_PRICE_VAT_DIVISOR, spec.digits, spec.floor);
}

/**
 * 조회 결과 행 배열의 객단가·조단가를 순매출 기준으로 바꾼 새 배열을 돌려준다.
 * 대상 그룹이 아니거나 배열이 아니면 받은 rows를 그대로 돌려준다.
 * @template T
 * @param {T[]|unknown} rows
 * @param {unknown} group lngStoreGroup
 * @param {Array<{ target: string; amount?: string; amounts?: string[]; count?: string; counts?: string[]; digits?: number; floor?: boolean }>} specs
 * @param {(row: Record<string, unknown>) => void} [after] 행별 후처리(차이 열 재계산 등)
 * @returns {T[]|unknown}
 */
export function applyNetUnitPrice(rows, group, specs, after) {
  if (!Array.isArray(rows) || !isNetUnitPriceGroup(group)) return rows;
  return rows.map((row) => {
    if (!row || typeof row !== "object") return row;
    const next = { ...row };
    for (const spec of specs) {
      if (!(spec.target in next)) continue;
      const v = calcNetPrice(row, spec);
      if (v !== undefined) next[spec.target] = v;
    }
    if (typeof after === "function") after(next);
    return next;
  });
}
