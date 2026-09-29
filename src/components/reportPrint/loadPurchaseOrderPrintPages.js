import { getOrderInfoDetail, getPurchaseOrderPrint } from "@/api/mipur";
import { splitVoucherByMeasure } from "./splitVoucherByMeasure";

function toNum(v) {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function pick(row, keys, fallback = "") {
  if (!row || typeof row !== "object") return fallback;
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== "") {
      return row[k];
    }
  }
  return fallback;
}

function isTruncatedStockName(name) {
  return /(?:\.\.\.|…)\s*$/.test(String(name || ""));
}

/** 잘린 이름보다 긴·온전한 자재명 우선 */
function preferStockName(candidate, current) {
  const a = String(candidate || "").trim();
  const b = String(current || "").trim();
  if (!a) return false;
  if (!b) return true;
  const aTrunc = isTruncatedStockName(a);
  const bTrunc = isTruncatedStockName(b);
  if (!aTrunc && bTrunc) return true;
  if (aTrunc && !bTrunc) return false;
  return a.length > b.length;
}

/**
 * 인쇄 SP가 Crystal용으로 자재명을 ... 잘라 주는 경우가 있음.
 * 전표 상세(getOrderInfoDetail)의 전체 자재명으로 보강.
 */
async function enrichVoucherStockNames(groupCd, voucher) {
  const lines = Array.isArray(voucher?.lines) ? voucher.lines : [];
  if (!lines.length) return voucher;
  if (!lines.some((l) => isTruncatedStockName(l.stockName))) return voucher;

  try {
    const res = await getOrderInfoDetail(
      groupCd,
      voucher.storeCd,
      voucher.orderNo,
    );
    const list = res?.data?.List ?? res?.data?.list ?? [];
    if (!Array.isArray(list) || !list.length) return voucher;

    const byId = new Map();
    const bySeq = new Map();
    for (const r of list) {
      const id = String(pick(r, ["lngStockID", "lngStockId"], "")).trim();
      const seq = String(pick(r, ["lngOrderSeq", "lngSeq"], "")).trim();
      const name = String(
        pick(r, ["strStockName", "strItemName", "strStockNm"], ""),
      ).trim();
      if (!name) continue;
      if (id && preferStockName(name, byId.get(id))) byId.set(id, name);
      if (seq && preferStockName(name, bySeq.get(seq))) bySeq.set(seq, name);
    }

    const nextLines = lines.map((l, idx) => {
      const fromId = byId.get(l.stockId);
      const fromSeq = l.orderSeq ? bySeq.get(String(l.orderSeq)) : "";
      const fromIdx = list[idx]
        ? String(
            pick(list[idx], ["strStockName", "strItemName", "strStockNm"], ""),
          ).trim()
        : "";
      let best = l.stockName;
      for (const c of [fromId, fromSeq, fromIdx]) {
        if (preferStockName(c, best)) best = c;
      }
      return best !== l.stockName ? { ...l, stockName: best } : l;
    });

    return { ...voucher, lines: nextLines };
  } catch (e) {
    console.warn("[enrichVoucherStockNames]", e);
    return voucher;
  }
}

/**
 * 선택 행 중복 제거 — (매장코드 + 전표번호)
 * @param {object[]} checkedRows
 */
export function uniquePurchaseOrderSelections(checkedRows) {
  const list = Array.isArray(checkedRows) ? checkedRows : [];
  const map = new Map();
  for (const row of list) {
    const storeCd = String(pick(row, ["lngStoreCode", "STORE_CD"], "")).trim();
    const orderNo = String(pick(row, ["strOrderNo", "ORDER_NO"], "")).trim();
    if (!storeCd || !orderNo) continue;
    const key = `${storeCd}__${orderNo}`;
    if (map.has(key)) continue;
    map.set(key, {
      key,
      storeCd,
      orderNo,
      storeName: String(pick(row, ["strStoreName", "strName"], "")).trim(),
      supplierName: String(pick(row, ["strSupplierName"], "")).trim(),
      partName: String(pick(row, ["strPartName"], "")).trim(),
      comments: String(pick(row, ["strComments", "orderComments"], "")).trim(),
    });
  }
  return [...map.values()];
}

function mapDetailLines(list) {
  const rows = Array.isArray(list) ? list : [];
  return rows.map((r) => ({
    stockId: String(pick(r, ["lngStockID", "lngStockId"], "")).trim(),
    orderSeq: String(pick(r, ["lngOrderSeq", "lngSeq"], "")).trim(),
    stockName: String(
      pick(r, ["strStockName", "strItemName", "strStockNm"], ""),
    ).trim(),
    unitName: String(pick(r, ["strUnitName"], "")).trim(),
    qty: toNum(pick(r, ["dblOrderQty"], 0)),
    unitPrice: toNum(pick(r, ["curUnitPrice"], 0)),
    supply: toNum(pick(r, ["curSupply"], 0)),
    tax: toNum(pick(r, ["curTax"], 0)),
    total: toNum(pick(r, ["curTotal"], 0)),
    barcode: String(pick(r, ["strBarcode"], "")).trim(),
  }));
}

/** 자재명 출력은 한 줄(+...) — 장 분할도 행당 1슬롯 */
function lineSlotCost() {
  return 1;
}
/** 1장 */
const SLOTS_FIRST_PAGE = 38;
/** 2장~ */
const SLOTS_CONT_PAGE = 48;
/** 마지막 장 */
const SLOTS_LAST_PAGE = 36;

/**
 * 1장 / 계속장 / 마지막장 슬롯을 다르게 적용
 * @param {object[]} lines
 * @param {number} firstSlots
 * @param {number} contSlots
 * @param {number} lastSlots
 */
function chunkLinesBySlots(lines, firstSlots, contSlots, lastSlots) {
  if (!lines.length) return [[]];

  const slotsOf = (arr) => arr.reduce((a, l) => a + lineSlotCost(l), 0);
  if (slotsOf(lines) <= lastSlots) return [lines];

  /** @type {typeof lines[]} */
  const chunks = [];
  let i = 0;
  let pageIndex = 0;

  while (i < lines.length) {
    const rest = lines.slice(i);
    if (slotsOf(rest) <= lastSlots) {
      chunks.push(rest);
      break;
    }

    const budget = pageIndex === 0 ? firstSlots : contSlots;
    const buf = [];
    let used = 0;
    while (i < lines.length) {
      const afterThisPage = lines.slice(i);
      if (buf.length > 0 && slotsOf(afterThisPage) <= lastSlots) {
        break;
      }
      const cost = lineSlotCost(lines[i]);
      if (buf.length > 0 && used + cost > budget) {
        break;
      }
      buf.push(lines[i]);
      used += cost;
      i += 1;
    }
    if (!buf.length) {
      buf.push(lines[i]);
      i += 1;
    }
    chunks.push(buf);
    pageIndex += 1;
  }

  return chunks.length ? chunks : [[]];
}

/**
 * 전표 1건 → 품목·자재명 줄바꿈을 반영해 여러 장 분할 (전표 기준 1/N … N/N)
 * @param {object} base
 * @param {{ linesPerPage?: number, linesPerLastPage?: number, linesPerFirstPage?: number }} [opts]
 */
export function splitVoucherIntoSheets(base, opts = {}) {
  const firstSlots = Math.max(
    1,
    Number(opts.linesPerFirstPage) || Number(opts.linesPerPage) || SLOTS_FIRST_PAGE,
  );
  const contSlots = Math.max(1, Number(opts.linesPerPage) || SLOTS_CONT_PAGE);
  const lastSlots = Math.max(1, Number(opts.linesPerLastPage) || SLOTS_LAST_PAGE);
  const lines = Array.isArray(base.lines) ? base.lines : [];
  const chunks = chunkLinesBySlots(lines, firstSlots, contSlots, lastSlots);

  const voucherPageCount = chunks.length;
  return chunks.map((chunk, i) => {
    const voucherPage = i + 1;
    const isFirstPage = voucherPage === 1;
    const isLastPage = voucherPage === voucherPageCount;
    return {
      ...base,
      key: `${base.key}__p${voucherPage}`,
      voucherPage,
      voucherPageCount,
      isFirstPage,
      isLastPage,
      lines: chunk,
    };
  });
}

function buildPageFromDetail(selection, detailRows) {
  const lines = mapDetailLines(detailRows);
  const first = Array.isArray(detailRows) && detailRows.length ? detailRows[0] : null;
  const sumSupply = lines.reduce((a, l) => a + l.supply, 0);
  const sumTax = lines.reduce((a, l) => a + l.tax, 0);
  const sumTotal = lines.reduce((a, l) => a + l.total, 0);

  return {
    key: selection.key,
    storeCd: selection.storeCd,
    orderNo: selection.orderNo,
    voucherPage: 1,
    voucherPageCount: 1,
    isFirstPage: true,
    isLastPage: true,
    storeName:
      selection.storeName ||
      String(pick(first, ["strName", "strStoreName"], "")).trim(),
    supplierName:
      selection.supplierName ||
      String(pick(first, ["strSupplierName"], "")).trim(),
    partName:
      selection.partName ||
      String(pick(first, ["strPartName", "strPartNar"], "")).trim(),
    orderDate: String(pick(first, ["dtmOrderDate"], "")).trim(),
    expectedDate: String(pick(first, ["dtmExpectedDate"], "")).trim(),
    comments:
      selection.comments ||
      String(pick(first, ["orderComments1", "orderComments", "strComments"], "")).trim(),
    recvRegistNo: String(pick(first, ["strRegistNo"], "")).trim(),
    recvDirector: String(pick(first, ["strDirector", "strDirecto"], "")).trim(),
    recvTel: String(pick(first, ["strTel"], "")).trim(),
    recvFax: String(pick(first, ["strFax"], "")).trim(),
    recvAddress: String(pick(first, ["strAddress"], "")).trim(),
    suppRegistNo: String(pick(first, ["strRegistNo1"], "")).trim(),
    suppDirector: String(pick(first, ["strDirector1"], "")).trim(),
    suppFax: String(pick(first, ["strFaxNo"], "")).trim(),
    suppManager: String(pick(first, ["strManager"], "")).trim(),
    suppAddress: String(pick(first, ["strAddress1"], "")).trim(),
    lines,
    sumSupply,
    sumTax,
    sumTotal,
  };
}

/**
 * 선택 전표 → 인쇄 페이지 배열 (매장명 → 거래처명 → 전표번호 정렬)
 * Crystal CRPrint와 동일 SP 1회 조회 후 전표별 그룹 · 품목 다건 시 전표 내 장 분할
 *
 * @param {string|number} groupCd
 * @param {object[]} checkedRows
 * @param {{ storeCd?: string|number, orderDate?: string, flag?: string, linesPerPage?: number, linesPerLastPage?: number, partyLayout?: 'part'|'basic' }} [opts]
 */
export async function loadPurchaseOrderPrintPages(groupCd, checkedRows, opts = {}) {
  const selections = uniquePurchaseOrderSelections(checkedRows);
  if (!selections.length) return [];

  const storeCdList = selections.map((s) => s.storeCd).join(",");
  const orderNoList = selections.map((s) => s.orderNo).join(",");
  const orderDate = String(opts.orderDate ?? "")
    .replaceAll("-", "")
    .trim();
  const storeCd = String(opts.storeCd ?? selections[0]?.storeCd ?? "").trim();
  const flag = String(opts.flag ?? "1").trim() || "1";

  let list = [];
  try {
    const res = await getPurchaseOrderPrint(
      groupCd,
      storeCd,
      orderDate,
      storeCdList,
      orderNoList,
      flag,
    );
    if (res?.data?.RESULT_CD && res.data.RESULT_CD !== "00") {
      console.error(
        "[loadPurchaseOrderPrintPages] RESULT",
        res.data.RESULT_CD,
        res.data.RESULT_NM,
      );
    }
    list = res?.data?.List ?? res?.data?.list ?? [];
  } catch (e) {
    console.error("[loadPurchaseOrderPrintPages]", e);
    list = [];
  }

  const byKey = new Map();
  for (const row of Array.isArray(list) ? list : []) {
    const store = String(pick(row, ["lngStoreCode"], "")).trim();
    const order = String(pick(row, ["strOrderNo"], "")).trim();
    if (!store || !order) continue;
    const key = `${store}__${order}`;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(row);
  }

  const partyLayout = opts.partyLayout === "basic" ? "basic" : "part";

  const vouchersRaw = selections.map((sel) => ({
    ...buildPageFromDetail(sel, byKey.get(sel.key) || []),
    partyLayout,
  }));

  const vouchers = await Promise.all(
    vouchersRaw.map((v) => enrichVoucherStockNames(groupCd, v)),
  );

  vouchers.sort((a, b) => {
    const s = String(a.storeName).localeCompare(String(b.storeName), "ko");
    if (s !== 0) return s;
    const u = String(a.supplierName).localeCompare(String(b.supplierName), "ko");
    if (u !== 0) return u;
    return String(a.orderNo).localeCompare(String(b.orderNo), "ko");
  });

  const pages = [];
  for (const voucher of vouchers) {
    const measured = splitVoucherByMeasure(voucher, { partyLayout });
    if (measured && measured.length) {
      pages.push(...measured);
    } else {
      pages.push(
        ...splitVoucherIntoSheets(voucher, {
          linesPerPage: opts.linesPerPage,
          linesPerLastPage: opts.linesPerLastPage,
          linesPerFirstPage: opts.linesPerFirstPage,
        }).map((p) => ({ ...p, partyLayout })),
      );
    }
  }

  return pages;
}
