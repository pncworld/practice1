<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="rp-shell"
      role="dialog"
      aria-modal="true"
      :aria-label="title || '인쇄 미리보기'">
      <div class="rp-shell__panel">
        <header class="rp-shell__hd rp-no-print">
          <h2 class="rp-shell__title">{{ title || "인쇄 미리보기" }}</h2>
          <div class="rp-shell__actions">
            <button
              type="button"
              class="rp-shell__btn rp-shell__btn--primary"
              :disabled="loading || !pages.length"
              @click="onPrint">
              <font-awesome-icon :icon="['fas', 'print']" class="rp-shell__btn-ico" />
              인쇄
            </button>
            <button type="button" class="rp-shell__btn" @click="onClose">
              <font-awesome-icon :icon="['fas', 'xmark']" class="rp-shell__btn-ico" />
              닫기
            </button>
          </div>
        </header>
        <div ref="bodyEl" class="rp-shell__body">
          <div v-if="loading" class="rp-shell__loading">출력 데이터를 불러오는 중…</div>
          <div v-else-if="!pages.length" class="rp-shell__empty">출력할 페이지가 없습니다.</div>
          <template v-else>
            <section
              v-for="page in pages"
              :key="page.key"
              class="rp-page">
              <slot
                name="page"
                :page="page"
                :page-index="page.voucherPage || 1"
                :page-count="page.voucherPageCount || 1"
                :printed-at="printedAt" />
              <footer class="rp-page__footer">
                <div class="rp-page__footer-meta">
                  <span>인쇄일자 {{ printDateText }}</span>
                  <span>인쇄시간 {{ printTimeText }}</span>
                </div>
                <div class="rp-page__footer-page">
                  {{ voucherPageNo(page) }} / {{ voucherPageCount(page) }}
                </div>
              </footer>
            </section>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import "./reportPrint.css";
import { printReportContent } from "./printReportContent";
import { PO_SHEET_CSS } from "./poSheetStyles";

function ensurePoSheetStyles() {
  if (typeof document === "undefined") return;
  let el = document.getElementById("po-sheet-styles");
  if (!el) {
    el = document.createElement("style");
    el.id = "po-sheet-styles";
    document.head.appendChild(el);
  }
  /* 캡처에 ... 잔존 방지 — 항상 최신 공통 CSS로 갱신 */
  el.textContent = PO_SHEET_CSS;
}

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: "인쇄 미리보기" },
  pages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(["update:open", "close"]);

const bodyEl = ref(null);

/** 미리보기 연 시각 — Crystal 인쇄일자/시간과 동일 역할 */
const printedAt = ref(new Date());

const printDateText = computed(() => {
  const d = printedAt.value;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
});

const printTimeText = computed(() => {
  const d = printedAt.value;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
});

function voucherPageNo(page) {
  const n = Number(page?.voucherPage ?? page?.pageNo);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function voucherPageCount(page) {
  const n = Number(page?.voucherPageCount ?? page?.pageCount);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function onClose() {
  emit("update:open", false);
  emit("close");
}

async function onPrint() {
  if (typeof window === "undefined") return;
  printedAt.value = new Date();
  await nextTick();
  printReportContent(bodyEl.value);
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      ensurePoSheetStyles();
      printedAt.value = new Date();
    }
  }
);
</script>
