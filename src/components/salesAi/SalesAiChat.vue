<template>
  <!-- AI 매출 도우미 대화 영역 (팝업·대시보드 AI 창 공용). 대화 상태는 useSalesAi 공유 -->
  <div class="sac-root">
    <div v-if="state.testMode" class="sac-test">테스트 모드: AI를 호출하지 않고 이번 달 합계로 조회한 결과입니다.</div>

    <div ref="logRef" class="sac-log">
      <!-- 첫 화면: 대시보드는 KPI·표(slot), 팝업은 안내 문구 -->
      <slot name="intro">
        <div v-if="state.messages.length === 0" class="sac-guide">
          <p>매출을 말로 물어보세요. 표·그래프로 보여 드리고 엑셀로 받을 수 있습니다. 고객 개인 정보는 다루지 않습니다.</p>
          <p class="sac-guide-sub">
            기간: 매출·결제수단·할인·카드사 최대 6개월(월별 12개월), 시간대·메뉴·매출취소 최대 31일
          </p>
        </div>
      </slot>

      <div v-if="state.messages.length === 0" class="sac-chips">
        <!-- 매출 조회 = 파란 서브 버튼, 고객(CRM) 조회 = 보라 버튼, 등록 = 연두 버튼 (등록 연두·조회 파랑 규칙) -->
        <button
          v-for="ex in examples"
          :key="ex.text"
          type="button"
          class="pnc-sub-btn"
          :class="{ 'sac-reg-btn': ex.kind === 'menu', 'sac-crm-btn': ex.kind === 'crm' }"
          :disabled="state.loading"
          @click="send(ex.text)">
          {{ ex.text }}
        </button>
      </div>

      <div
        v-for="(msg, idx) in state.messages"
        :key="idx"
        class="sac-row"
        :class="msg.role === 'user' ? 'sac-row--user' : 'sac-row--ai'">
        <div class="sac-bubble" :class="{ 'sac-bubble--error': msg.error, 'sac-bubble--wide': hasResult(msg) }">
          <div class="sac-text">{{ msg.text }}</div>

          <!-- 메뉴 등록: 받은 값 확인 카드 -->
          <div v-if="msg.menuDraft" class="sac-menu-card">
            <div v-if="msg.menuDraft.STORE_NM" class="sac-menu-row"><span>매장</span><b>{{ msg.menuDraft.STORE_NM }}</b></div>
            <div class="sac-menu-row"><span>메뉴명</span><b>{{ msg.menuDraft.NAME || "-" }}</b></div>
            <div class="sac-menu-row"><span>판매가</span><b>{{ fmt(msg.menuDraft.PRICE) }}원</b></div>
            <div class="sac-menu-row">
              <span>분류</span><b>{{ msg.menuDraft.MAIN_NM || "-" }} &gt; {{ msg.menuDraft.SUB_NM || "-" }}</b>
            </div>
            <div class="sac-menu-row"><span>과세구분</span><b>{{ msg.menuDraft.TAX === "2" ? "면세" : "과세" }}</b></div>
            <button
              v-if="msg.menuReady"
              type="button"
              class="pnc-sub-btn sac-reg-btn sac-menu-go"
              @click="goMenuScreen(msg.menuDraft)">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              메뉴코드등록 화면에서 이어서 등록
            </button>
          </div>

          <!-- 선택지 (마지막 답에만 누를 수 있게). 메뉴 등록 진행 중 선택지라 등록 색(연두) -->
          <div v-if="msg.choices && msg.choices.length" class="sac-choices">
            <button
              v-for="c in msg.choices"
              :key="c"
              type="button"
              class="pnc-sub-btn sac-reg-btn"
              :disabled="state.loading || idx !== state.messages.length - 1 || !state.menu"
              @click="send(c)">
              {{ c }}
            </button>
          </div>

          <template v-if="hasResult(msg)">
            <div class="sac-cond">{{ conditionText(msg.condition) }}</div>

            <!-- 일일정산레포트처럼 영역이 여러 개인 결과: 영역마다 제목 + 표 -->
            <template v-if="msg.sections && msg.sections.length">
              <div class="sac-tools">
                <button type="button" class="pnc-sub-btn sac-excel" @click="downloadSectionsExcel(msg)">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M12 4v11M7 10l5 5 5-5M5 19h14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  엑셀
                </button>
              </div>
              <div v-for="(sec, sIdx) in msg.sections" :key="sIdx" class="sac-section">
                <div class="sac-sec-title">{{ sec.TITLE }}</div>
                <div v-if="!sec.ROWS || sec.ROWS.length === 0" class="sac-sec-empty">자료 없음</div>
                <div v-else class="sac-table-wrap sac-table-wrap--sec">
                  <table class="sac-table">
                    <thead>
                      <tr>
                        <th v-for="col in sec.COLUMNS" :key="col.KEY">{{ col.TITLE }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, rIdx) in sec.ROWS" :key="rIdx">
                        <td v-for="col in sec.COLUMNS" :key="col.KEY" :class="col.TYPE === 'text' ? 'sac-td-text' : ''">
                          {{ cellText(col, row) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

            <!-- 합계만 있는 결과: 숫자 카드 -->
            <div v-else-if="isKpiResult(msg)" class="sac-kpis">
              <div v-for="col in valueColumns(msg)" :key="col.KEY" class="sac-kpi">
                <span>{{ col.TITLE }}</span>
                <b>{{ cellText(col, msg.total) }}</b>
              </div>
              <div v-if="msg.prevTotal && msg.total.DIFF_RATE !== undefined" class="sac-kpi">
                <span>비교 기간 대비</span>
                <b :class="rateClass(msg.total.DIFF_RATE)">{{ rateText(msg.total.DIFF_RATE) }}</b>
              </div>
            </div>

            <template v-else>
              <div class="sac-tools">
                <div v-if="msg.chart" class="sac-tabs" role="tablist">
                  <button
                    type="button"
                    class="sac-tab"
                    :class="{ 'sac-tab--on': msg.view !== 'table' }"
                    @click="msg.view = 'chart'">
                    그래프
                  </button>
                  <button
                    type="button"
                    class="sac-tab"
                    :class="{ 'sac-tab--on': msg.view === 'table' }"
                    @click="msg.view = 'table'">
                    표
                  </button>
                </div>
                <button type="button" class="pnc-sub-btn sac-excel" @click="downloadExcel(msg)">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d="M12 4v11M7 10l5 5 5-5M5 19h14"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg>
                  엑셀
                </button>
                <!-- 고객 목록: 가린 휴대폰·카드번호 원본은 신청번호를 받아 담당자에게 신청 (고객 조회 = 보라) -->
                <button
                  v-if="msg.exportKey"
                  type="button"
                  class="pnc-sub-btn sac-crm-btn"
                  :disabled="exportBusy"
                  @click="askCustomerExport(msg)">
                  <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  원본 신청
                </button>
              </div>

              <DashboardAiChart v-if="msg.chart && msg.view !== 'table'" :chart="msg.chart" :rows="msg.rows" :columns="msg.columns" />

              <div v-else class="sac-table-wrap">
                <table class="sac-table">
                  <thead>
                    <tr>
                      <th v-for="col in msg.columns" :key="col.KEY">{{ col.TITLE }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rIdx) in msg.rows" :key="rIdx">
                      <td
                        v-for="col in msg.columns"
                        :key="col.KEY"
                        :class="[col.TYPE === 'text' ? 'sac-td-text' : '', col.KEY === 'DIFF_RATE' ? rateClass(row[col.KEY]) : '']">
                        {{ cellText(col, row) }}
                      </td>
                    </tr>
                  </tbody>
                  <tfoot v-if="msg.total && msg.rows.length > 1">
                    <tr>
                      <td
                        v-for="(col, cIdx) in msg.columns"
                        :key="col.KEY"
                        :class="[col.TYPE === 'text' ? 'sac-td-text' : '', col.KEY === 'DIFF_RATE' ? rateClass(msg.total[col.KEY]) : '']">
                        {{ cIdx === 0 ? totalLabel(msg) : totalCellText(col, msg.total) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </template>
          </template>
        </div>
      </div>

      <div v-if="state.loading" class="sac-row sac-row--ai">
        <div class="sac-bubble sac-bubble--loading">
          <span class="sac-dots" aria-hidden="true"><i></i><i></i><i></i></span>
          {{ state.loadingKind === "customer" ? "고객 정보를 조회하고 있습니다" : "조회하고 있습니다" }}
          <span class="sac-elapsed">{{ loadingSec }}초</span>
          <div class="sac-loading-sub">
            {{ state.loadingKind === "customer" ? "고객 정보 조회는 시간이 조금 더 걸립니다(약 20~30초)." : "분석 질문은 30초 정도 걸릴 수 있습니다." }}
          </div>
        </div>
      </div>
    </div>

    <!-- 메뉴 등록 진행 중 표시 -->
    <div v-if="state.menu" class="sac-menu-bar">
      <span>메뉴 등록 진행 중 · 순서대로 안내해 드립니다</span>
      <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" :disabled="state.loading" @click="cancelMenu">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" stroke-width="2" />
          <path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        등록 취소
      </button>
    </div>

    <div class="sac-input">
      <textarea
        ref="inputRef"
        v-model="inputText"
        class="sac-textarea"
        rows="2"
        maxlength="500"
        placeholder="예: 지난달 매장별 매출 TOP 5 (Enter 보내기, Shift+Enter 줄바꿈)"
        :disabled="state.loading"
        @keydown="onKeydown"></textarea>
      <button
        type="button"
        class="pnc-sub-btn sac-send"
        :disabled="state.loading || !inputText.trim()"
        @click="send(inputText)">
        <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        보내기
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineExpose, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { utils, writeFile } from "xlsx-js-style";
import Swal from "sweetalert2";
import DashboardAiChart from "@/components/DashboardAiChart.vue";
import { requestCustomerExport } from "@/api/dashboardAi";
import { SALES_AI_TOPIC_TEXT, salesAiConditionText, useSalesAi } from "@/components/salesAi/useSalesAi";

const { state, examples, sendText, cancelMenu, handoffMenu } = useSalesAi();

/** 확인이 끝난 메뉴를 메뉴코드등록 화면으로 넘긴다 */
function goMenuScreen(draft) {
  if (!handoffMenu(draft)) {
    state.messages.push({
      role: "ai",
      text: "메뉴코드등록 화면을 열 수 없습니다. 왼쪽 메뉴에서 메뉴코드등록 화면 권한을 확인해 주세요.",
      error: true,
    });
  }
}

const inputText = ref("");
const logRef = ref(null);
const inputRef = ref(null);

function scrollToBottom() {
  nextTick(() => {
    const el = logRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

/**
 * 고객 원본 신청: 먼저 신청번호를 받을지 묻고, 받으면 대화창에 번호와 신청 방법을 남긴다 (2026-11-25)
 * 원본 자료(가리지 않은 휴대폰·카드번호)는 화면으로 내려오지 않는다. 담당자가 신청번호로 따로 추출한다
 */
const exportBusy = ref(false);
async function askCustomerExport(msg) {
  if (!msg.exportKey || exportBusy.value) return;
  const ok = await Swal.fire({
    title: "원본 자료 신청",
    text: "가린 휴대폰·카드번호가 들어간 원본 자료가 필요하신가요? 신청번호를 발급해 드립니다. 신청번호로 담당자에게 메일로 신청해 주세요. (신청번호는 24시간 동안 유효합니다)",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "신청번호 받기",
    cancelButtonText: "취소",
  });
  if (!ok.isConfirmed) return;
  exportBusy.value = true;
  try {
    const res = await requestCustomerExport(msg.exportKey);
    const data = res?.data || {};
    if (data.RESULT_CD !== "00" || !data.REQ_NO) {
      state.messages.push({ role: "ai", text: data.RESULT_NM || "원본 자료 신청 중 오류가 발생했습니다.", error: true });
      return;
    }
    state.messages.push({
      role: "ai",
      text:
        `신청번호: ${data.REQ_NO}\n` +
        `이 번호로 담당자에게 메일로 원본 자료를 신청해 주세요.\n` +
        `신청번호는 24시간 동안 유효합니다${data.EXPIRE_DT ? ` (${data.EXPIRE_DT} 까지)` : ""}.`,
    });
  } catch (e) {
    console.error("[salesAi] export", e);
    state.messages.push({ role: "ai", text: "서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.", error: true });
  } finally {
    exportBusy.value = false;
    scrollToBottom();
  }
}

/** 로딩 중 경과 초 (진행 중인지 알 수 있게 1초마다 올린다) */
const loadingSec = ref(0);
let loadingTimer = null;
function stopLoadingTimer() {
  if (loadingTimer) clearInterval(loadingTimer);
  loadingTimer = null;
}
watch(
  () => state.loading,
  (on) => {
    stopLoadingTimer();
    loadingSec.value = 0;
    if (on) loadingTimer = setInterval(() => (loadingSec.value += 1), 1000);
  },
  { immediate: true }
);
onBeforeUnmount(stopLoadingTimer);

/** 다른 화면(팝업↔대시보드)에서 대화가 늘어도 아래로 */
watch(
  () => [state.messages.length, state.loading],
  () => scrollToBottom()
);

async function send(text) {
  const q = String(text || "").trim();
  if (!q || state.loading) return;
  inputText.value = "";
  scrollToBottom();
  await sendText(q);
  scrollToBottom();
  nextTick(() => inputRef.value?.focus());
}

function onKeydown(e) {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    send(inputText.value);
  }
}

function focusInput() {
  nextTick(() => inputRef.value?.focus());
}

defineExpose({ focusInput, scrollToBottom });

// ===== 결과 표시 =====

const conditionText = salesAiConditionText;

function hasResult(msg) {
  if (msg.role !== "ai" || !msg.condition) return false;
  if (Array.isArray(msg.sections) && msg.sections.length > 0) return true;
  return Array.isArray(msg.columns) && msg.columns.length > 0;
}

/** 합계(TOTAL) 1행 결과는 표 대신 숫자 카드 */
function isKpiResult(msg) {
  return msg.condition && msg.condition.GROUP_BY === "TOTAL" && msg.condition.TOPIC !== "ANALYZE";
}

function valueColumns(msg) {
  return msg.columns.filter((c) => c.TYPE !== "text" && c.KEY !== "SHARE" && !c.KEY.startsWith("PREV_") && c.KEY !== "DIFF_RATE");
}

function totalLabel(msg) {
  const all = Number(msg.condition?.ROW_TOTAL_CNT) || 0;
  const shown = msg.rows ? msg.rows.length : 0;
  if (all > shown) {
    return msg.condition?.GROUP_BY === "STORE" ? "전체 " + all + "곳 합계" : "전체 " + all + "건 합계";
  }
  return "합계";
}

function fmt(v) {
  if (v === "" || v == null) return "-";
  const n = Number(v);
  return Number.isFinite(n) ? n.toLocaleString("ko-KR") : String(v);
}

function rateText(v) {
  if (v === "" || v == null) return "-";
  const n = Number(v);
  if (!Number.isFinite(n)) return "-";
  return (n > 0 ? "+" : "") + n.toFixed(1) + "%";
}

function cellText(col, row) {
  const v = row ? row[col.KEY] : "";
  if (col.TYPE === "text") return v == null || v === "" ? "-" : v;
  if (col.TYPE === "num") return v === "" || v == null ? "-" : fmt(v);
  if (col.TYPE === "rate") return col.KEY === "SHARE" ? (v === "" || v == null ? "-" : Number(v).toFixed(1) + "%") : rateText(v);
  return fmt(v);
}

/** 합계 행: 글자 열·비중은 비우고 숫자·비교만 */
function totalCellText(col, total) {
  if (col.TYPE === "text" || col.KEY === "SHARE") return "";
  if (total[col.KEY] === undefined) return "";
  return cellText(col, total);
}

/** 증가 = 빨강, 감소 = 파랑 (국내 매출 표기 관례) */
function rateClass(v) {
  const n = Number(v);
  if (v === "" || v == null || !Number.isFinite(n) || n === 0) return "";
  return n > 0 ? "sac-up" : "sac-down";
}

// ===== 엑셀 =====

const EXCEL_BORDER = {
  top: { style: "thin", color: { rgb: "CBD5E1" } },
  bottom: { style: "thin", color: { rgb: "CBD5E1" } },
  left: { style: "thin", color: { rgb: "CBD5E1" } },
  right: { style: "thin", color: { rgb: "CBD5E1" } },
};

/** 영역이 여러 개인 결과(일일정산레포트): 한 시트에 영역 제목·머리글·행을 차례로 쌓는다 */
function downloadSectionsExcel(msg) {
  const aoa = [];
  const styles = []; // [rowIndex, kind, colCount, cols]
  aoa.push(["PnC# AI 도우미 · " + state.groupNm]);
  aoa.push(["조회 조건", conditionText(msg.condition)]);
  let maxCols = 2;
  msg.sections.forEach((sec) => {
    aoa.push([]);
    aoa.push(["■ " + sec.TITLE]);
    styles.push([aoa.length - 1, "title", 1, sec.COLUMNS]);
    aoa.push(sec.COLUMNS.map((c) => c.TITLE));
    styles.push([aoa.length - 1, "head", sec.COLUMNS.length, sec.COLUMNS]);
    maxCols = Math.max(maxCols, sec.COLUMNS.length);
    if (!sec.ROWS || sec.ROWS.length === 0) {
      aoa.push(["자료 없음"]);
      return;
    }
    sec.ROWS.forEach((r) => {
      aoa.push(sec.COLUMNS.map((c) => excelValue(c, r)));
      styles.push([aoa.length - 1, "body", sec.COLUMNS.length, sec.COLUMNS]);
    });
  });

  const ws = utils.aoa_to_sheet(aoa);
  styles.forEach(([r, kind, n, cols]) => {
    for (let c = 0; c < n; c++) {
      const cell = ws[utils.encode_cell({ r, c })];
      if (!cell) continue;
      if (kind === "title") {
        cell.s = { font: { bold: true, sz: 12 } };
      } else if (kind === "head") {
        cell.s = { border: EXCEL_BORDER, fill: { fgColor: { rgb: "F1F5F9" } }, font: { bold: true }, alignment: { horizontal: "center" } };
      } else {
        cell.s = { border: EXCEL_BORDER };
        if (typeof cell.v === "number") cell.z = cols[c].TYPE === "num" ? "#,##0.##" : "#,##0";
      }
    }
  });
  ws["!cols"] = Array.from({ length: maxCols }, (_, i) => ({ wch: i === 0 ? 18 : 13 }));

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "일일정산");
  const c = msg.condition || {};
  const name = `AI매출_일일정산_${c.STORE_TEXT || ""}_${c.FROM_DT || ""}_${c.TO_DT || ""}.xlsx`.replace(/[\\/:*?"<>|]/g, "");
  writeFile(wb, name);
}

function excelValue(col, row) {
  const v = row ? row[col.KEY] : "";
  if (col.TYPE === "text") return v ?? "";
  if (v === "" || v == null) return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : v;
}

function downloadExcel(msg) {
  const cols = msg.columns;
  const aoa = [];
  aoa.push(["PnC# AI 도우미 · " + state.groupNm]);
  aoa.push(["조회 조건", conditionText(msg.condition)]);
  aoa.push([]);
  aoa.push(cols.map((c) => c.TITLE));
  msg.rows.forEach((r) => aoa.push(cols.map((c) => excelValue(c, r))));
  if (msg.total && msg.rows.length > 1) {
    aoa.push(cols.map((c, i) => (i === 0 ? totalLabel(msg) : c.TYPE === "text" || c.KEY === "SHARE" ? "" : excelValue(c, msg.total))));
  }

  const ws = utils.aoa_to_sheet(aoa);
  const headerRow = 3;
  for (let r = headerRow; r < aoa.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const ref = utils.encode_cell({ r, c });
      const cell = ws[ref];
      if (!cell) continue;
      cell.s = {
        border: {
          top: { style: "thin", color: { rgb: "CBD5E1" } },
          bottom: { style: "thin", color: { rgb: "CBD5E1" } },
          left: { style: "thin", color: { rgb: "CBD5E1" } },
          right: { style: "thin", color: { rgb: "CBD5E1" } },
        },
      };
      if (r === headerRow) {
        cell.s.fill = { fgColor: { rgb: "F1F5F9" } };
        cell.s.font = { bold: true };
        cell.s.alignment = { horizontal: "center" };
      } else if (typeof cell.v === "number") {
        cell.z = cols[c].TYPE === "rate" ? "0.0" : "#,##0";
      }
    }
  }
  ws["!cols"] = cols.map((c) => ({ wch: c.TYPE === "text" ? 22 : 14 }));

  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "AI 매출");
  const c = msg.condition || {};
  const name = `AI매출_${SALES_AI_TOPIC_TEXT[c.TOPIC] || "조회"}_${c.FROM_DT || ""}_${c.TO_DT || ""}.xlsx`.replace(/[\\/:*?"<>|]/g, "");
  writeFile(wb, name);
}
</script>

<style scoped>
.sac-root {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.sac-test {
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  color: #9a3412;
  background: #fff7ed;
  border-bottom: 1px solid #fed7aa;
}

.sac-log {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  padding: 1rem;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sac-guide {
  color: #334155;
  font-size: 0.875rem;
  line-height: 1.5;
}

.sac-guide-sub {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #64748b;
}

.sac-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.sac-row {
  display: flex;
}

.sac-row--user {
  justify-content: flex-end;
}

.sac-row--ai {
  justify-content: flex-start;
}

.sac-bubble {
  max-width: 100%;
  min-width: 0;
  padding: 0.6rem 0.8rem;
  border-radius: 0.6rem;
  font-size: 0.875rem;
  line-height: 1.55;
}

.sac-bubble--wide {
  width: 100%;
}

.sac-row--user .sac-bubble {
  max-width: 80%;
  background: #fff7ed;
  border: 1px solid #fdba74;
  color: #7c2d12;
}

.sac-row--ai .sac-bubble {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #0f172a;
}

.sac-bubble--error {
  border-color: #fecaca !important;
  background: #fef2f2 !important;
  color: #991b1b !important;
}

.sac-bubble--loading {
  color: #334155 !important;
}

.sac-loading-sub {
  margin-top: 0.2rem;
  font-size: 0.75rem;
  color: #64748b;
}

.sac-elapsed {
  margin-left: 0.35rem;
  font-variant-numeric: tabular-nums;
  color: #ea580c;
  font-weight: 600;
}

/* 진행 중 표시: 점 3개가 차례로 움직인다 */
.sac-dots {
  display: inline-flex;
  gap: 3px;
  margin-right: 0.4rem;
  vertical-align: middle;
}

.sac-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f97316;
  animation: sac-dot 1s infinite ease-in-out;
}

.sac-dots i:nth-child(2) {
  animation-delay: 0.15s;
}

.sac-dots i:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes sac-dot {
  0%,
  80%,
  100% {
    opacity: 0.25;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-3px);
  }
}

.sac-text {
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: anywhere;
  line-height: 1.7;
}

.sac-cond {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: #64748b;
}

.sac-tools {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.sac-tabs {
  display: inline-flex;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  overflow: hidden;
}

.sac-tab {
  height: 1.75rem;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  color: #475569;
  background: #ffffff;
  cursor: pointer;
}

.sac-tab + .sac-tab {
  border-left: 1px solid #cbd5e1;
}

/* 선택 = 주황 (화면이 파랑 위주라 선택 표시는 주황) */
.sac-tab--on {
  background: #fff7ed;
  color: #c2410c;
  font-weight: 700;
}

.sac-excel {
  margin-left: auto;
}

/* 메뉴 등록 */
.sac-choices {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.55rem;
}

/* 등록 계열 = 연두 (조회 = 파랑과 구분). 공통 pnc-sub-btn 의 색만 이 화면에서 바꾼다 */
.pnc-sub-btn.sac-reg-btn {
  color: #3f6212;
  border-color: #a3e635;
  background-color: #f7fee7;
  box-shadow: 0 1px 2px 0 rgb(101 163 13 / 0.12);
}

.pnc-sub-btn.sac-reg-btn:hover:not(:disabled) {
  background-color: #ecfccb;
  border-color: #84cc16;
}

/* 고객(CRM) 예시: 매출 조회(파랑)·등록(연두)·선택(주황)과 구분되는 보라 (2026-11-25 요청) */
.pnc-sub-btn.sac-crm-btn {
  color: #6d28d9;
  border-color: #c4b5fd;
  background-color: #f5f3ff;
  box-shadow: 0 1px 2px 0 rgb(124 58 237 / 0.12);
}

.pnc-sub-btn.sac-crm-btn:hover:not(:disabled) {
  background-color: #ede9fe;
  border-color: #a78bfa;
}

.sac-menu-card {
  margin-top: 0.55rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #bef264;
  border-radius: 0.5rem;
  background: #f7fee7;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sac-menu-row {
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.sac-menu-row span {
  width: 4.5rem;
  flex-shrink: 0;
  color: #64748b;
}

.sac-menu-row b {
  color: #0f172a;
}

.sac-menu-go {
  align-self: flex-start;
  margin-top: 0.4rem;
}

.sac-menu-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #3f6212;
  background: #f7fee7;
  border-top: 1px solid #d9f99d;
}

.sac-section + .sac-section {
  margin-top: 0.75rem;
}

/* 영역 제목: 왼쪽 파란 세로 바 (section-title-bar 규칙) */
.sac-sec-title {
  position: relative;
  margin-top: 0.6rem;
  padding-left: 0.55rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
}

.sac-sec-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.15rem;
  bottom: 0.15rem;
  width: 3px;
  border-radius: 2px;
  background: #2563eb;
}

.sac-sec-empty {
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #94a3b8;
}

.sac-table-wrap--sec {
  max-height: 16rem;
}

.sac-table-wrap {
  margin-top: 0.5rem;
  max-height: 20rem;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.sac-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
}

.sac-table th,
.sac-table td {
  padding: 0.35rem 0.55rem;
  border-bottom: 1px solid #f1f5f9;
  text-align: right;
  white-space: nowrap;
}

.sac-table th {
  position: sticky;
  top: 0;
  background: #f1f5f9;
  color: #334155;
  font-weight: 600;
  text-align: center;
}

.sac-table .sac-td-text {
  text-align: left;
}

.sac-table tfoot td {
  position: sticky;
  bottom: 0;
  background: #f8fafc;
  font-weight: 700;
  border-top: 1px solid #cbd5e1;
}

.sac-kpis {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.sac-kpi {
  display: flex;
  flex-direction: column;
  min-width: 7rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: #f8fafc;
}

.sac-kpi span {
  font-size: 0.75rem;
  color: #64748b;
}

.sac-kpi b {
  font-size: 0.95rem;
  color: #0f172a;
}

.sac-up {
  color: #dc2626 !important;
}

.sac-down {
  color: #2563eb !important;
}

/* 보내기 버튼은 질문창과 같은 높이 (공통 pnc-sub-btn 의 2rem 고정 높이를 이 화면에서만 풀어 준다) */
.sac-input .sac-send {
  height: auto;
  min-height: 0;
  align-self: stretch;
  padding: 0 1rem;
  border-width: 2px;
  border-radius: 0.5rem;
}

.sac-input {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

/* 질문창: 안내 문구와 같은 주황 계열 두꺼운 테두리로 눈에 띄게, 입력 중에는 은은한 빛 */
.sac-textarea {
  flex: 1 1 auto;
  min-width: 0;
  resize: none;
  padding: 0.5rem 0.7rem;
  border: 2px solid #fb923c;
  border-radius: 0.5rem;
  background: #fffaf5;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #0f172a;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.sac-textarea::placeholder {
  color: #9a6b4b;
}

.sac-textarea:focus {
  outline: none;
  border-color: #ea580c;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgb(251 146 60 / 0.25);
}

.sac-textarea:disabled {
  border-color: #fed7aa;
}
</style>
