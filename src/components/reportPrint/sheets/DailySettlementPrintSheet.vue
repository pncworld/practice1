<template>
  <article class="sls0217-sheet">
    <template v-if="showHeader">
      <div class="sls0217-sheet__title-box">
        <h1 class="sls0217-sheet__title">일일 정산 레포트</h1>
      </div>
      <div class="sls0217-sheet__meta">
        <div class="sls0217-sheet__meta-item">
          <span class="sls0217-sheet__meta-k">조회기간</span>
          <span>{{ page.periodText }}</span>
        </div>
        <div class="sls0217-sheet__meta-item">
          <span class="sls0217-sheet__meta-k">조회일시</span>
          <span>{{ page.searchAtText || "—" }}</span>
        </div>
        <div class="sls0217-sheet__meta-item">
          <span class="sls0217-sheet__meta-k">매장</span>
          <span>{{ page.storeText }}</span>
        </div>
      </div>
    </template>

    <section
      v-for="(sec, idx) in page.sections || []"
      :key="`${sec.id}-${idx}-${sec.continued ? 'c' : 'f'}`"
      class="sls0217-sheet__sec">
      <h3 class="sls0217-sheet__sec-title">
        {{ sec.title }}
        <span v-if="sec.continued" class="sls0217-sheet__cont">(계속)</span>
      </h3>
      <table class="sls0217-sheet__table">
        <thead>
          <tr>
            <th v-for="col in sec.columns" :key="col.label">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!(sec.rows && sec.rows.length)">
            <td :colspan="sec.columns.length" class="is-center">자료 없음</td>
          </tr>
          <tr v-for="(row, rIdx) in sec.rows || []" :key="rIdx">
            <td
              v-for="col in sec.columns"
              :key="col.label"
              :class="tdClass(col)">
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

function pick(row, keys) {
  if (!row || typeof row !== "object") return "";
  for (const k of keys || []) {
    if (row[k] != null && row[k] !== "") return row[k];
  }
  return "";
}

function fmtNum(v, { rate = false } = {}) {
  if (v == null || v === "") return "";
  if (typeof v === "string" && /[^\d.\-]/.test(v)) {
    const n = Number(String(v).replace(/,/g, ""));
    if (!Number.isFinite(n)) return String(v);
    return rate
      ? n.toLocaleString("ko-KR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : n.toLocaleString("ko-KR");
  }
  const n = Number(v);
  if (!Number.isFinite(n)) return String(v ?? "");
  if (rate) {
    return n.toLocaleString("ko-KR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return n.toLocaleString("ko-KR");
}

function formatCell(row, col) {
  const raw = pick(row, col.keys);
  if (col.rate) return fmtNum(raw, { rate: true });
  if (col.num) return fmtNum(raw);
  return raw == null ? "" : String(raw);
}

function tdClass(col) {
  if (col.num || col.rate) return "is-num";
  if (col.align === "center") return "is-center";
  return "is-left";
}
</script>
