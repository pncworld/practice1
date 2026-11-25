<template>
  <div class="dac-wrap" :class="{ 'dac-wrap--pie': chart.TYPE === 'pie' }">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
/**
 * AI 매출 도우미 결과 그래프 (chart.js)
 * chart: { TYPE: line|bar|pie, LABEL_KEY, VALUE_KEY, VALUE_TITLE, PREV_KEY, PREV_TITLE }
 */
import { defineProps, onBeforeUnmount, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const props = defineProps({
  chart: { type: Object, required: true },
  rows: { type: Array, required: true },
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
  if (!canvasRef.value || !c || !props.rows.length) return;

  const labels = props.rows.map((r) => r[c.LABEL_KEY] ?? "");
  const datasets = [];
  if (c.TYPE === "pie") {
    datasets.push({
      label: c.VALUE_TITLE,
      data: props.rows.map((r) => num(r[c.VALUE_KEY])),
      backgroundColor: PIE_COLORS,
      borderColor: PIE_BORDERS,
      borderWidth: 1,
    });
  } else {
    datasets.push({
      label: c.VALUE_TITLE,
      data: props.rows.map((r) => num(r[c.VALUE_KEY])),
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
        data: props.rows.map((r) => num(r[c.PREV_KEY])),
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
    (c.TYPE === "bar" && props.rows.length <= 24 && !c.PREV_KEY) ||
    (c.TYPE === "line" && props.rows.length <= 15 && !c.PREV_KEY);

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
          formatter: (v) => (num(v) === 0 ? "" : fmtNum(v)),
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
watch(() => [props.chart, props.rows], render, { deep: true });
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
</style>
