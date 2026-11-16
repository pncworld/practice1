/**
 * 매출 레포트 객수 런치·디너 열 붙이기 — 2026-11-13
 *
 * - 서버(usp_VUE_slsGetCustLunchByStoreDate)는 매장·일자별 런치 객수만 준다.
 *   디너 시각(예약타임테이블)이 있는 매장만 결과에 나오고, 매출이 없는 매장은 dtmDate 빈 행 1개로 나온다.
 * - 화면 행마다: 런치 = 그 행의 매장(·일자)에 해당하는 런치 합, 디너 = 그 행의 객수 − 런치.
 *   디너 시각이 없는 매장 행은 런치·디너 null(빈칸).
 * - 기준은 매출 분석 대시보드 객수 런치·디너와 같다.
 */

/** 런치·디너 열을 보여 줄 매장 그룹 (마키노차야) */
export const CUST_LUNCH_DINNER_GROUPS = Object.freeze(["1871"]);

/** 런치·디너 열 필드명 */
export const CUST_LUNCH_DINNER_FIELDS = Object.freeze(["custLunch", "custDinner"]);

/**
 * 런치·디너 열 적용 그룹인지
 * @param {unknown} group lngStoreGroup
 */
export function isCustLunchDinnerGroup(group) {
  return CUST_LUNCH_DINNER_GROUPS.includes(String(group ?? "").trim());
}

/**
 * 날짜 문자열에서 yyyy-mm-dd 만 뽑는다. ("2026-11-01 (토)", "2026-11-01 오전 12:00:00" 등)
 * @param {unknown} v
 * @returns {string}
 */
export function toYmd(v) {
  const m = String(v ?? "").match(/(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
  if (!m) return "";
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

function toNum(v) {
  const n = Number(String(v ?? "").replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/**
 * 조회 결과 행에 custLunch / custDinner 를 붙인 새 배열을 돌려준다.
 * @param {Array<Record<string, unknown>>} rows 화면 조회 결과
 * @param {Array<{ lngStoreCode?: unknown; strStoreName?: unknown; dtmDate?: unknown; custLunch?: unknown }>} lunchList 서버 런치 목록
 * @param {{ storeKey: string; matchBy: "code" | "name"; dateKey?: string; countKey?: string }} opt
 *  - storeKey: 행의 매장 필드 (예: lngStoreCode, strStore)
 *  - matchBy: 서버 목록의 매장코드(code) / 매장명(name) 중 무엇으로 맞출지
 *  - dateKey: 행의 일자 필드. 없거나 값이 비면 조회 기간 전체 합
 *  - countKey: 행의 객수 필드 (기본 lngCustCnt)
 */
export function attachCustLunchDinner(rows, lunchList, opt) {
  if (!Array.isArray(rows)) return rows;
  const countKey = opt.countKey || "lngCustCnt";

  /** @type {Map<string, Map<string, number>>} */
  const byStore = new Map();
  for (const it of Array.isArray(lunchList) ? lunchList : []) {
    const sk = String(opt.matchBy === "name" ? it.strStoreName ?? "" : it.lngStoreCode ?? "").trim();
    if (!sk) continue;
    if (!byStore.has(sk)) byStore.set(sk, new Map());
    const ymd = toYmd(it.dtmDate);
    if (ymd) {
      const dates = byStore.get(sk);
      dates.set(ymd, (dates.get(ymd) || 0) + toNum(it.custLunch));
    }
  }

  return rows.map((row) => {
    if (!row || typeof row !== "object") return row;
    const sk = String(row[opt.storeKey] ?? "").trim();
    const dates = byStore.get(sk);
    if (!dates) return { ...row, custLunch: null, custDinner: null };

    let lunch = 0;
    const ymd = opt.dateKey ? toYmd(row[opt.dateKey]) : "";
    if (ymd) {
      lunch = dates.get(ymd) || 0;
    } else {
      for (const v of dates.values()) lunch += v;
    }
    const dinner = Math.max(0, toNum(row[countKey]) - lunch);
    return { ...row, custLunch: lunch, custDinner: dinner };
  });
}
