<template>
  <article class="po-sheet">
    <template v-if="isFirst">
      <div class="po-sheet__title-box">
        <h1 class="po-sheet__title">발 주 서</h1>
      </div>

      <div class="po-sheet__top-meta">
        <div class="po-sheet__top-item">
          <span class="po-sheet__k"><span class="po-sheet__mark">◆</span> 전표번호</span>
          <span class="po-sheet__v">{{ page.orderNo }}</span>
        </div>
        <div class="po-sheet__top-item">
          <span class="po-sheet__k"><span class="po-sheet__mark">◆</span> 납기일자</span>
          <span class="po-sheet__v">{{ formatDate(page.expectedDate) }}</span>
        </div>
        <div class="po-sheet__top-item">
          <span class="po-sheet__k"><span class="po-sheet__mark">◆</span> 발주일자</span>
          <span class="po-sheet__v">{{ formatDate(page.orderDate) }}</span>
        </div>
      </div>
    </template>

    <!-- Crystal: 016=기본(상호·성명) / 037=파트별 -->
    <table class="po-sheet__party-table">
      <colgroup>
        <col class="po-party-lbl" />
        <col class="po-party-val" />
        <col class="po-party-lbl" />
        <col class="po-party-val" />
        <col class="po-party-lbl" />
        <col class="po-party-val" />
        <col class="po-party-lbl" />
        <col class="po-party-val" />
      </colgroup>
      <thead>
        <tr>
          <th colspan="4" class="po-party-hd">수 신 처</th>
          <th colspan="4" class="po-party-hd">발 주 처</th>
        </tr>
      </thead>
      <tbody v-if="isPartLayout">
        <tr>
          <th>사업자번호</th>
          <td><span class="po-party-cell">{{ page.recvRegistNo }}</span></td>
          <th>성명</th>
          <td><span class="po-party-cell">{{ page.recvDirector }}</span></td>
          <th>사업자번호</th>
          <td colspan="3"><span class="po-party-cell">{{ page.suppRegistNo }}</span></td>
        </tr>
        <tr>
          <th>상호</th>
          <td><span class="po-party-cell">{{ page.storeName }}</span></td>
          <th>파트</th>
          <td><span class="po-party-cell">{{ page.partName }}</span></td>
          <th>상호</th>
          <td><span class="po-party-cell">{{ page.supplierName }}</span></td>
          <th>성명</th>
          <td><span class="po-party-cell">{{ page.suppDirector }}</span></td>
        </tr>
        <tr>
          <th>전화번호</th>
          <td colspan="3"><span class="po-party-cell">{{ page.recvTel }}</span></td>
          <th>팩스번호</th>
          <td><span class="po-party-cell">{{ page.suppFax }}</span></td>
          <th>담당</th>
          <td><span class="po-party-cell">{{ page.suppManager }}</span></td>
        </tr>
        <tr>
          <th>주소</th>
          <td colspan="3"><span class="po-party-cell">{{ page.recvAddress }}</span></td>
          <th>주소</th>
          <td colspan="3"><span class="po-party-cell">{{ page.suppAddress }}</span></td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <th>사업자번호</th>
          <td colspan="3"><span class="po-party-cell">{{ page.recvRegistNo }}</span></td>
          <th>사업자번호</th>
          <td colspan="3"><span class="po-party-cell">{{ page.suppRegistNo }}</span></td>
        </tr>
        <tr>
          <th>상호</th>
          <td><span class="po-party-cell">{{ page.storeName }}</span></td>
          <th>성명</th>
          <td><span class="po-party-cell">{{ page.recvDirector }}</span></td>
          <th>상호</th>
          <td><span class="po-party-cell">{{ page.supplierName }}</span></td>
          <th>성명</th>
          <td><span class="po-party-cell">{{ page.suppDirector }}</span></td>
        </tr>
        <tr>
          <th>전화번호</th>
          <td colspan="3"><span class="po-party-cell">{{ page.recvTel }}</span></td>
          <th>팩스번호</th>
          <td><span class="po-party-cell">{{ page.suppFax }}</span></td>
          <th>담당</th>
          <td><span class="po-party-cell">{{ page.suppManager }}</span></td>
        </tr>
        <tr>
          <th>주소</th>
          <td colspan="3"><span class="po-party-cell">{{ page.recvAddress }}</span></td>
          <th>주소</th>
          <td colspan="3"><span class="po-party-cell">{{ page.suppAddress }}</span></td>
        </tr>
      </tbody>
    </table>

    <table class="po-sheet__table">
      <colgroup>
        <col class="po-col-code" />
        <col class="po-col-name" />
        <col class="po-col-unit" />
        <col class="po-col-qty" />
        <col class="po-col-price" />
        <col class="po-col-price" />
        <col class="po-col-price" />
        <col class="po-col-amt" />
      </colgroup>
      <thead>
        <tr>
          <th class="po-col-code">자재코드</th>
          <th class="po-col-name">자재명</th>
          <th class="po-col-unit">단위</th>
          <th class="po-col-qty">수량</th>
          <th class="po-col-price">단가</th>
          <th class="po-col-price">공급가</th>
          <th class="po-col-price">부가세</th>
          <th class="po-col-amt">금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(line, idx) in page.lines" :key="`${line.stockId}-${idx}`">
          <td class="po-col-code">{{ line.stockId }}</td>
          <td class="po-col-name">
            <span class="po-name-text">{{ line.stockName }}</span>
          </td>
          <td class="po-col-unit">{{ line.unitName }}</td>
          <td class="po-col-qty">{{ formatQty(line.qty) }}</td>
          <td class="po-col-price">{{ formatAmt(line.unitPrice) }}</td>
          <td class="po-col-price">{{ formatAmt(line.supply) }}</td>
          <td class="po-col-price">{{ formatAmt(line.tax) }}</td>
          <td class="po-col-amt">{{ formatAmt(line.total) }}</td>
        </tr>
        <tr v-if="!page.lines.length">
          <td colspan="8" class="po-sheet__empty-line">상세 품목이 없습니다.</td>
        </tr>
      </tbody>
      <tfoot v-if="isLast">
        <tr>
          <td colspan="5" class="po-sheet__sum-label">합계</td>
          <td class="po-col-price">{{ formatAmt(page.sumSupply) }}</td>
          <td class="po-col-price">{{ formatAmt(page.sumTax) }}</td>
          <td class="po-col-amt">{{ formatAmt(page.sumTotal) }}</td>
        </tr>
      </tfoot>
    </table>

    <div v-if="isLast" class="po-sheet__comments">
      <div class="po-sheet__comments-hd">◎ Order Comments ◎</div>
      <div class="po-sheet__comments-bd">{{ page.comments || "" }}</div>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { PO_SHEET_CSS } from "../poSheetStyles";

const props = defineProps({
  page: { type: Object, required: true },
  /** 'part' = 037(파트) / 'basic' = 016 Crystal 기본 */
  partyLayout: { type: String, default: "part" },
});

const isFirst = computed(() => props.page?.isFirstPage !== false);
const isLast = computed(() => props.page?.isLastPage !== false);
const isPartLayout = computed(() => {
  const layout = props.page?.partyLayout || props.partyLayout || "part";
  return layout === "part";
});

onMounted(() => {
  if (typeof document === "undefined") return;
  let el = document.getElementById("po-sheet-styles");
  if (!el) {
    el = document.createElement("style");
    el.id = "po-sheet-styles";
    document.head.appendChild(el);
  }
  el.textContent = PO_SHEET_CSS;
});

function toNum(v) {
  if (v === null || v === undefined || v === "") return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(String(v).replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function formatAmt(v) {
  return toNum(v).toLocaleString("ko-KR");
}

function formatQty(v) {
  const n = toNum(v);
  if (Number.isInteger(n)) return n.toLocaleString("ko-KR");
  return n.toLocaleString("ko-KR", { maximumFractionDigits: 3 });
}

function formatDate(v) {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  if (s.length >= 10 && s[4] === "-" && s[7] === "-") return s.slice(0, 10);
  return s;
}
</script>
