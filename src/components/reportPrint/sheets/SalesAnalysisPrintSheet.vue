<template>
  <article class="sa-dash-sheet">
    <template v-if="showHeader">
      <div class="sa-dash-sheet__title-box">
        <h1 class="sa-dash-sheet__title">매출 분석</h1>
      </div>
      <div class="sa-dash-sheet__meta">
        <div class="sa-dash-sheet__meta-item">
          <span class="sa-dash-sheet__meta-k">조회기간</span>
          <span>{{ page.periodText }}</span>
        </div>
        <div class="sa-dash-sheet__meta-item">
          <span class="sa-dash-sheet__meta-k">조회일시</span>
          <span>{{ page.searchAtText || "—" }}</span>
        </div>
      </div>
    </template>

    <section
      v-for="(sec, idx) in page.sections || []"
      :key="`${sec.id}-${idx}-${sec.continued ? 'c' : 'f'}`"
      class="sa-dash-sheet__sec">
      <h3 class="sa-dash-sheet__sec-title">
        {{ sec.title }}
        <span v-if="sec.continued" class="sa-dash-sheet__cont">(계속)</span>
      </h3>
      <table class="sa-dash-sheet__table">
        <thead>
          <!-- 2026-11-11 2단 헤더(groupHeader)가 있을 때만 위쪽 줄 -->
          <tr v-if="sec.groupHeader && sec.groupHeader.length">
            <th
              v-for="(g, gIdx) in sec.groupHeader"
              :key="`g-${gIdx}`"
              :colspan="g.span">
              {{ g.text }}
            </th>
          </tr>
          <tr>
            <th v-for="col in sec.columns" :key="col.fieldName">
              {{ col.headerText || col.fieldName }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!(sec.rows && sec.rows.length)">
            <td :colspan="sec.columns.length" class="is-center">자료 없음</td>
          </tr>
          <tr
            v-for="(row, rIdx) in sec.rows || []"
            :key="rIdx"
            :class="{ 'is-total': isTotalRow(row, sec.totalHighlight) }">
            <td
              v-for="col in sec.columns"
              :key="col.fieldName"
              :class="tdClass(col)"
              :style="signColorStyle(row, col)">
              {{ formatCell(row, col) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  page: {
    type: Object,
    default: () => ({}),
  },
});

const showHeader = computed(() => {
  const p = props.page || {};
  if (typeof p.showDocHeader === "boolean") return p.showDocHeader;
  return !!p.isFirstPage;
});

function tdClass(col) {
  const a = col.bodyAlign;
  if (a === "far" || a === "right" || col.fieldDataType === "number") return "is-num";
  if (a === "near" || a === "left") return "is-left";
  return "is-center";
}

function formatCell(row, col) {
  const v = row?.[col.fieldName];
  if (v == null || v === "") return "";
  if (col.fieldDataType !== "number") return String(v);
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v);
  const fmt = String(col.numberFormat || "#,##0");
  if (fmt.includes(".00")) {
    return n.toLocaleString("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (fmt.includes(".0")) {
    return n.toLocaleString("ko-KR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  }
  return n.toLocaleString("ko-KR");
}

/** 2026-11-11 opt-in: 열 정의 signColor 가 있을 때만 양수 빨강·음수 파랑 (없으면 기존과 동일) */
function signColorStyle(row, col) {
  if (col?.signColor !== true) return undefined;
  const v = row?.[col.fieldName];
  if (v == null || v === "") return undefined;
  const n = Number(v);
  if (!Number.isFinite(n) || n === 0) return undefined;
  return { color: n > 0 ? "#dc2626" : "#2563eb" };
}

function isTotalRow(row, totalHighlight) {
  if (!totalHighlight?.field || !Array.isArray(totalHighlight.values)) return false;
  const v = String(row?.[totalHighlight.field] ?? "").trim();
  return totalHighlight.values.map((x) => String(x).trim()).includes(v);
}
</script>
