<template>
  <div>
    <div class="dac-wrap" :class="{ 'dac-wrap--pie': chart.TYPE === 'pie' }">
      <canvas ref="canvasRef"></canvas>
    </div>
    <p v-if="view.note" class="dac-note">{{ view.note }}</p>
  </div>
</template>

<script setup>
/**
 * AI 매출 도우미 결과 그래프 (chart.js)
 * chart: { TYPE: line|bar|pie, LABEL_KEY, VALUE_KEY, VALUE_TITLE, PREV_KEY, PREV_TITLE }
 */
import { computed, defineProps, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
  chart: { type: Object, required: true },
  rows: { type: Array, required: true },
  // 표 머리글 (막대를 줄일 때 표가 무엇 순으로 정렬됐는지 찾는 데 쓴다)
  columns: { type: Array, default: () => [] },
});

/** 막대 그래프는 최대 15개만 그린다 (2026-11-25 요청). 표·엑셀은 전체 */
const MAX_BARS = 15;
// 원그래프 조각 수: 상위 7개 + 기타 = 8 (조각 색 8개, 마지막 회색이 기타)
const PIE_TOP = 7;

/** 행이 이 열 기준으로 정렬돼 있으면 'desc' / 'asc', 아니면 '' */
function sortDirection(rows, key) {
  let desc = true;
  let asc = true;
  for (let i = 1; i < rows.length; i++) {
    const a = num(rows[i - 1][key]);
    const b = num(rows[i][key]);
    if (b > a) desc = false;
    if (b < a) asc = false;
    if (!desc && !asc) return "";
  }
  if (desc && asc) return ""; // 값이 모두 같으면 기준으로 보지 않는다
  return desc ? "desc" : "asc";
}

/**
 * 그릴 행과 안내 문장
 *  - 막대가 15개를 넘으면 표의 정렬 기준(그래프 값 열 → 나머지 숫자 열 순으로 찾음)을 그대로 따라 앞 15개만 그린다
 *  - 정렬 기준을 찾지 못하면(시간대·요일처럼 순서가 의미인 목록) 자르지 않는다
 */
const view = computed(() => {
  const c = props.chart || {};
  const rows = props.rows || [];
  // 원그래프: 조각이 많으면 값 큰 순 상위 PIE_TOP 개 + 나머지를 '기타' 한 조각으로 (2026-11-27 원그래프 요청)
  if (c.TYPE === "pie" && rows.length > PIE_TOP + 1 && c.VALUE_KEY) {
    const sorted = [...rows].sort((a, b) => num(b[c.VALUE_KEY]) - num(a[c.VALUE_KEY]));
    const rest = sorted.slice(PIE_TOP);
    const etc = { [c.LABEL_KEY]: `기타 ${rest.length}개`, [c.VALUE_KEY]: rest.reduce((s, r) => s + num(r[c.VALUE_KEY]), 0) };
    return {
      rows: [...sorted.slice(0, PIE_TOP), etc],
      note: `원그래프는 상위 ${PIE_TOP}개와 나머지 ${rest.length}개(기타)입니다. 전체는 표·엑셀에서 볼 수 있습니다.`,
    };
  }
  if (c.TYPE !== "bar" || rows.length <= MAX_BARS) return { rows, note: "" };

  const candidates = [];
  if (c.VALUE_KEY) candidates.push({ KEY: c.VALUE_KEY, TITLE: c.VALUE_TITLE });
  for (const col of props.columns) {
    if (col.KEY !== c.VALUE_KEY && col.TYPE !== "text") candidates.push(col);
  }
  for (const col of candidates) {
    const dir = sortDirection(rows, col.KEY);
    if (dir) {
      const title = col.TITLE || "값";
      return {
        rows: rows.slice(0, MAX_BARS),
        note: `그래프는 ${title} ${dir === "desc" ? "상위" : "하위"} ${MAX_BARS}개입니다. 전체 ${rows.length}개는 표·엑셀에서 볼 수 있습니다.`,
      };
    }
  }
  return { rows, note: "" };
});

const canvasRef = ref(null);
let instance = null;

/** 막대·선은 연한 색 + 진한 테두리, 수치 글자는 진하게 (2026-11-25 요청: 그래프 연하게, 텍스트 진하게)
 *  이번 기간 = 연한 파랑, 비교 기간 = 연한 회색. 원형은 뜻 구분 없는 나열이라 연한 여러 색 */
const MAIN_FILL = "#bfdbfe";
const MAIN_LINE = "#3b82f6";
const PREV_FILL = "#e2e8f0";
const PREV_LINE = "#94a3b8";
const LABEL_COLOR = "#0f172a";
const PIE_COLORS = ["#bfdbfe", "#fed7aa", "#bbf7d0", "#fef08a", "#ddd6fe", "#fecaca", "#a5f3fc", "#e2e8f0"];
const PIE_BORDERS = ["#3b82f6", "#f97316", "#22c55e", "#eab308", "#8b5cf6", "#ef4444", "#06b6d4", "#64748b"];

/** chart.vue 가 전역 등록했으면 그대로, 아니면 이 그래프에만 붙인다 (두 번 그리지 않게) */
function localPlugins() {
  try {
    return Chart.registry.getPlugin("datalabels") ? [] : [ChartDataLabels];
  } catch (e) {
    return [ChartDataLabels];
  }
}

function fmtNum(v) {
  const n = num(v);
  return n.toLocaleString("ko-KR");
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function render() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
  const c = props.chart;
  const rows = view.value.rows;
  if (!canvasRef.value || !c || !rows.length) return;

  const labels = rows.map((r) => r[c.LABEL_KEY] ?? "");
  const datasets = [];
  if (c.TYPE === "pie") {
    datasets.push({
      label: c.VALUE_TITLE,
      data: rows.map((r) => num(r[c.VALUE_KEY])),
      backgroundColor: PIE_COLORS,
      borderColor: PIE_BORDERS,
      borderWidth: 1,
    });
  } else {
    datasets.push({
      label: c.VALUE_TITLE,
      data: rows.map((r) => num(r[c.VALUE_KEY])),
      backgroundColor: c.TYPE === "line" ? "rgba(191, 219, 254, 0.35)" : MAIN_FILL,
      borderColor: MAIN_LINE,
      borderWidth: c.TYPE === "line" ? 2 : 1,
      borderRadius: c.TYPE === "bar" ? 4 : 0,
      fill: c.TYPE === "line",
      tension: 0.25,
      pointRadius: 2,
    });
    if (c.PREV_KEY) {
      datasets.push({
        label: c.PREV_TITLE || "비교 기간",
        data: rows.map((r) => num(r[c.PREV_KEY])),
        backgroundColor: PREV_FILL,
        borderColor: PREV_LINE,
        borderWidth: c.TYPE === "line" ? 2 : 1,
        borderRadius: c.TYPE === "bar" ? 4 : 0,
        borderDash: c.TYPE === "line" ? [4, 4] : undefined,
        tension: 0.25,
        pointRadius: 2,
      });
    }
  }

  // 수치 표시: 막대는 막대 위, 원형은 조각 안. 항목이 많거나(선 15개 초과·막대 24개 초과) 비교 막대는 겹쳐서 숨기고 툴팁으로
  const showLabels =
    c.TYPE === "pie" ||
    (c.TYPE === "bar" && rows.length <= 24 && !c.PREV_KEY) ||
    (c.TYPE === "line" && rows.length <= 15 && !c.PREV_KEY);

  instance = new Chart(canvasRef.value, {
    type: c.TYPE === "pie" ? "doughnut" : c.TYPE,
    data: { labels, datasets },
    plugins: localPlugins(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      layout: { padding: { top: c.TYPE === "pie" ? 4 : 22 } },
      plugins: {
        legend: {
          display: c.TYPE === "pie" || datasets.length > 1,
          position: "bottom",
          labels: { color: LABEL_COLOR, font: { size: 12, weight: "600" } },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${fmtNum(ctx.raw)}`,
          },
        },
        datalabels: {
          display: showLabels ? "auto" : false,
          color: LABEL_COLOR,
          font: { size: 11, weight: "700" },
          anchor: c.TYPE === "pie" ? "center" : "end",
          align: c.TYPE === "pie" ? "center" : "end",
          offset: 2,
          clamp: true,
          // 원그래프는 비중(%)을 조각 안에, 금액은 툴팁으로
          formatter: (v, ctx) => {
            if (num(v) === 0) return "";
            if (c.TYPE !== "pie") return fmtNum(v);
            const total = ctx.dataset.data.reduce((s, x) => s + num(x), 0);
            const pct = total ? (num(v) / total) * 100 : 0;
            return pct < 3 ? "" : `${pct.toFixed(1)}%`;
          },
        },
      },
      scales:
        c.TYPE === "pie"
          ? {}
          : {
              y: {
                beginAtZero: true,
                grace: "8%",
                ticks: { color: "#334155", callback: (v) => Number(v).toLocaleString("ko-KR") },
                grid: { color: "#f1f5f9" },
              },
              x: {
                ticks: { color: "#0f172a", font: { weight: "600" }, autoSkip: true, maxRotation: 45 },
                grid: { display: false },
              },
            },
    },
  });
}

onMounted(render);
watch(() => [props.chart, props.rows, props.columns], render, { deep: true });
onBeforeUnmount(() => {
  if (instance) instance.destroy();
});
</script>

<style scoped>
.dac-wrap {
  position: relative;
  height: 15rem;
  margin-top: 0.5rem;
}

.dac-wrap--pie {
  height: 16rem;
}

/* 막대를 줄였을 때 기준 안내 */
.dac-note {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #475569;
  text-align: right;
}
</style>
