/*--############################################################################
# Filename : SLS02_033RPT.vue
# Description : 매출관리 > 당일 매출 조회 > 미결제 테이블 주문 조회
#   - fosTableOrder / fosTableOrder_Detail = POS 현재 미결제 테이블 현황 (결제 완료 시 POS가 지움)
#   - 보기 방식: 기본(병합 없음) / 셀병합(기본값, 매장명·테이블명·미결제금액·입장시각·고객수·메인메뉴순번 병합) / 트리(펼치기·접기)
# Date : 2026-11-17
################################################################################*/
<template>
  <div class="flex h-full min-h-0 flex-col">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="sls0233-search-panel z-10 mt-3 w-full min-h-0 shrink-0 overflow-visible rounded-lg bg-gray-200"
      :style="{
        '--sls0233-control-border': sls0233ControlBorder,
        '--sls0233-label-col': sls0233LabelCol,
        '--psp-label-w': sls0233LabelCol,
        '--psp-radio-w': '4.75rem',
        '--psp-col-gap': '0.5rem',
      }">
      <div class="sls0233-search-layout min-w-0">
        <!-- 좌측: 매장명 -->
        <div class="sls0233-store min-w-0 overflow-visible">
          <PickStorePlural
            fluid-width
            @lngStoreCodes="lngStoreCodes"
            @lngStoreGroup="lngStoreGroup"
            @lngSupervisor="lngSupervisor"
            @lngStoreTeam="lngStoreTeam"
            @lngStoreAttrs="lngStoreAttrs"
            @excelStore="excelStore" />
        </div>
      </div>
    </div>

    <!-- 보기 방식: 조회 조건이 아니라 결과 표시 방식이므로 그리드 바로 위 -->
    <div
      class="sls0233-view-bar shrink-0"
      :style="{
        '--sls0233-control-border': sls0233ControlBorder,
        '--sls0233-label-col': sls0233LabelCol,
      }">
      <div class="sls0233-row">
        <span class="sls0233-lbl sls0233-lbl--bar shrink-0">보기방식</span>
        <div class="sls0233-checks flex shrink-0 flex-nowrap items-center gap-x-4">
          <label class="sls0233-check-label" for="sls0233-view-basic">
            <input
              id="sls0233-view-basic"
              v-model="viewMode"
              type="radio"
              name="sls0233-view"
              value="basic"
              class="sls0233-check" />
            기본
          </label>
          <label class="sls0233-check-label" for="sls0233-view-merge">
            <input
              id="sls0233-view-merge"
              v-model="viewMode"
              type="radio"
              name="sls0233-view"
              value="merge"
              class="sls0233-check" />
            셀병합
          </label>
          <label class="sls0233-check-label" for="sls0233-view-layout">
            <input
              id="sls0233-view-layout"
              v-model="viewMode"
              type="radio"
              name="sls0233-view"
              value="layout"
              class="sls0233-check" />
            배치도
          </label>
          <label class="sls0233-check-label" for="sls0233-view-tree">
            <input
              id="sls0233-view-tree"
              v-model="viewMode"
              type="radio"
              name="sls0233-view"
              value="tree"
              class="sls0233-check" />
            트리
          </label>
          <button
            v-if="viewMode === 'tree'"
            type="button"
            class="sls0233-tree-all"
            :title="treeAllOpen ? '모두 접기' : '모두 펼치기'"
            :aria-label="treeAllOpen ? '모두 접기' : '모두 펼치기'"
            @click="toggleTreeExpandAll">
            <img
              :src="treeAllOpen ? '/icon/folder-collapse.svg?v=6' : '/icon/folder-expand.svg?v=6'"
              alt="" />
            {{ treeAllOpen ? "모두 접기" : "모두 펼치기" }}
          </button>
        </div>
      </div>
      <!-- 금액 안내: 미결제 테이블에는 할인 정보가 없어 결제 전 참고 값임 -->
      <p class="sls0233-amt-notice">
        <!-- 강조 안내 아이콘 (MST01_003INS 초간단 범위 안내와 같은 모양) -->
        <svg
          class="sls0233-amt-notice__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false">
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path
            d="M12 10.5v6M12 7.2v.3"
            fill="none"
            stroke="#fff"
            stroke-width="2.2"
            stroke-linecap="round" />
        </svg>
        <span>메뉴 단가 기준 금액이며, 선할인이 있을 경우 미반영된 금액입니다.</span>
      </p>
    </div>

    <div class="mt-1 flex min-h-0 min-w-0 flex-1 flex-col">
      <div class="sls0233-grid-host relative min-h-0 w-full flex-1">
        <!-- 기본 보기 (병합 없이 한 행 = 메뉴 1개) -->
        <Realgrid
          v-if="viewMode === 'basic'"
          key="sls0233-basic"
          :progname="'SLS02_033RPT_VUE'"
          :progid="1"
          :rowData="mergeRows"
          :reload="reload"
          :setStateBar="false"
          :rowStateeditable="false"
          :useAlternateRowStyle="false"
          :rowClassList="tableBandClasses"
          :documentTitle="'SLS02_033RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel" />
        <!-- 셀병합 보기 -->
        <Realgrid
          v-else-if="viewMode === 'merge'"
          key="sls0233-merge"
          :progname="'SLS02_033RPT_VUE'"
          :progid="1"
          :rowData="mergeRows"
          :reload="reload"
          :setStateBar="false"
          :rowStateeditable="false"
          :useAlternateRowStyle="false"
          :rowClassList="tableBandClasses"
          :setRowGroupSpan="'strStoreName'"
          :setRowGroupSpan2="sls0233MergeCols"
          :mergeMask="'strTableKey'"
          :documentTitle="'SLS02_033RPT'"
          :documentSubTitle="documentSubTitle"
          :exporttoExcel="exportExcel" />
        <!-- 배치도 보기 (POS 1번 테이블 화면 기준) -->
        <div v-else-if="viewMode === 'layout'" class="sls0233-lay">
          <div v-if="layoutLoading" class="sls0233-lay-empty">배치도를 불러오는 중입니다…</div>
          <div v-else-if="!searchedTime" class="sls0233-lay-empty">
            조회 버튼을 누르면 POS 1번 테이블 화면 배치대로 미결제 테이블을 보여 줍니다.
          </div>
          <div v-else-if="layoutError" class="sls0233-lay-empty sls0233-lay-empty--err">
            {{ layoutError }}
          </div>
          <div v-else-if="layoutStores.length === 0" class="sls0233-lay-empty">
            선택한 매장에 POS 1번 테이블 화면 배치가 없습니다.
          </div>
          <template v-else>
            <!-- 매장 선택 (미결제 테이블 수) -->
            <div class="sls0233-lay-stores">
              <button
                v-for="s in layoutStores"
                :key="s.code"
                type="button"
                class="sls0233-lay-chip"
                :class="{
                  'is-active': s.code === layoutStoreCode,
                  'has-unpaid': s.unpaidCnt > 0,
                }"
                @click="selectLayoutStore(s.code)">
                {{ s.name }}
                <span v-if="s.unpaidCnt > 0" class="sls0233-lay-chip__cnt">{{ s.unpaidCnt }}</span>
              </button>
            </div>

            <!-- 화면(층) 탭 + 요약 -->
            <div class="sls0233-lay-head">
              <div class="sls0233-lay-tabs">
                <button
                  v-for="sc in layoutScreens"
                  :key="sc.no"
                  type="button"
                  class="sls0233-lay-tab"
                  :class="{ 'is-active': sc.no === layoutScreenNo }"
                  @click="layoutScreenNo = sc.no">
                  {{ sc.name || "화면 " + sc.no }}
                  <span v-if="sc.unpaidCnt > 0" class="sls0233-lay-tab__cnt">{{ sc.unpaidCnt }}</span>
                </button>
              </div>
              <div class="sls0233-lay-sum">
                <span class="sls0233-lay-legend sls0233-lay-legend--on"></span>미결제
                {{ layoutStoreSummary.tableCnt }}테이블 · 고객 {{ layoutStoreSummary.custCnt }}명 ·
                <b>{{ layoutStoreSummary.orderAmt.toLocaleString() }}원</b>
                <span class="sls0233-lay-legend sls0233-lay-legend--off"></span>빈 테이블
              </div>
            </div>

            <!-- 배치 (한 화면 맞춤, 작아서 읽기 어려우면 크게 + 미니맵) -->
            <div class="sls0233-lay-canvas-wrap">
            <div
              ref="layoutCanvasRef"
              class="sls0233-lay-canvas"
              :class="{ 'is-zoomed': layoutNeedsMinimap }"
              @scroll="onLayoutCanvasScroll">
              <div
                class="sls0233-lay-stage"
                :style="{
                  width: layoutStage.w + 'px',
                  height: layoutStage.h + 'px',
                }">
                <template v-for="k in layoutKeys" :key="k.id">
                  <!-- 화면 이동 키 -->
                  <button
                    v-if="k.keyNo === 1"
                    type="button"
                    class="sls0233-lay-move"
                    :style="k.style"
                    :title="k.name + ' 화면으로 이동'"
                    @click="moveLayoutScreen(k.target)">
                    {{ k.name }}
                  </button>
                  <!-- 테이블 키 -->
                  <div
                    v-else
                    class="sls0233-lay-table"
                    :class="[
                      'shape-' + k.shape,
                      k.order ? 'is-unpaid' : 'is-idle',
                      k.compact ? 'is-compact' : '',
                    ]"
                    :style="{ ...k.style, '--key-color': k.color }"
                    @mouseenter="k.order && showLayoutHover($event, k.order)"
                    @mousemove="k.order && moveLayoutHover($event)"
                    @mouseleave="hideLayoutHover">
                    <div class="sls0233-lay-table__name">{{ k.name }}</div>
                    <template v-if="k.order">
                      <div class="sls0233-lay-table__amt">
                        {{ k.order.orderAmt.toLocaleString() }}<small>원</small>
                      </div>
                      <div v-if="!k.compact" class="sls0233-lay-table__meta">
                        {{ k.order.inTimeShort }} · {{ k.order.elapsedText }}
                        <template v-if="k.order.custCnt > 0"> · {{ k.order.custCnt }}명</template>
                      </div>
                      <button
                        type="button"
                        class="sls0233-lay-table__zoom"
                        title="주문 메뉴 크게 보기"
                        aria-label="주문 메뉴 크게 보기"
                        @click.stop="openLayoutDetail(k.order, $event)">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path
                            d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round" />
                        </svg>
                      </button>
                    </template>
                  </div>
                </template>
              </div>
            </div>

            <!-- 보기 크기 전환 + 미니맵 (오른쪽 아래) -->
            <div class="sls0233-lay-zoombar">
              <button
                type="button"
                class="sls0233-lay-zoombtn"
                :class="{ 'is-active': !layoutNeedsMinimap }"
                @click="setLayoutZoom('fit')">
                <svg class="sls0233-lay-zoomicon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
                  <path d="M15.5 15.5L20 20M7.5 10.5h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                전체 보기
              </button>
              <button
                type="button"
                class="sls0233-lay-zoombtn"
                :class="{ 'is-active': layoutNeedsMinimap }"
                :disabled="!layoutCanEnlarge"
                @click="setLayoutZoom('large')">
                <svg class="sls0233-lay-zoomicon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
                  <path d="M15.5 15.5L20 20M7.5 10.5h6M10.5 7.5v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                크게 보기
              </button>
            </div>
            <div
              v-if="layoutNeedsMinimap"
              class="sls0233-lay-minimap"
              :style="{ width: layoutMinimap.w + 'px', height: layoutMinimap.h + 'px' }"
              title="눌러서 이동"
              @pointerdown="onMinimapDown"
              @pointermove="onMinimapMove"
              @pointerup="onMinimapUp"
              @pointercancel="onMinimapUp">
              <span
                v-for="m in layoutMinimap.keys"
                :key="m.id"
                class="sls0233-lay-minimap__key"
                :class="m.cls"
                :style="m.style"></span>
              <span class="sls0233-lay-minimap__view" :style="layoutMinimap.view"></span>
            </div>
            </div>

            <!-- 배치도에 없는 미결제 테이블 (POS 1번 화면에 키가 없는 테이블) -->
            <div v-if="layoutOrphans.length > 0" class="sls0233-lay-orphans">
              <span class="sls0233-lay-orphans__title">배치도에 없는 미결제 테이블</span>
              <button
                v-for="o in layoutOrphans"
                :key="o.key"
                type="button"
                class="sls0233-lay-chip has-unpaid"
                @mouseenter="showLayoutHover($event, o)"
                @mousemove="moveLayoutHover($event)"
                @mouseleave="hideLayoutHover"
                @click="openLayoutDetail(o, $event)">
                {{ o.tableName }} · {{ o.orderAmt.toLocaleString() }}원
              </button>
            </div>
          </template>
        </div>
        <!-- 트리 보기 -->
        <Realgrid
          v-else
          ref="treeGridRef"
          key="sls0233-tree"
          :progname="'SLS02_033RPT_VUE'"
          :progid="2"
          :rowData="treeRows"
          :reload="reload"
          :setTreeView="true"
          :grid-row-height="23"
          :tree-square-expander="true"
          :tree-icon-images="['folder-close.svg?v=6', 'folder-open.svg?v=6']"
          :setFooter="true"
          :footer-sum-root-only="true"
          :footer-label-on-first-visible="true"
          :footer-use-cell-number-format="true"
          :setFooterColID="sls0233TreeSumCols"
          :setFooterExpressions="sls0233TreeSumExprs"
          :setFooterCustomText="['합계']"
          :setStateBar="false"
          :rowStateeditable="false"
          :checkRenderEditable="false"
          :checkRowAuto="false"
          :documentTitle="'SLS02_033RPT'"
          :documentSubTitle="documentSubTitle"
          :export-show-progress="false"
          :exporttoExcel="exportExcel" />
      </div>
    </div>

    <!-- 배치도: 마우스 올리면 주문 메뉴 미리보기 -->
    <Teleport to="body">
      <div
        v-if="layoutHover"
        class="sls0233-pop"
        :style="{ left: layoutHover.x + 'px', top: layoutHover.y + 'px' }">
        <div class="sls0233-pop__head">
          <b>{{ layoutHover.order.storeName }} · 테이블 {{ layoutHover.order.tableName }}</b>
          <span>{{ layoutHover.order.orderAmt.toLocaleString() }}원</span>
        </div>
        <div class="sls0233-pop__meta">
          입장 {{ layoutHover.order.inTimeShort }} ({{ layoutHover.order.elapsedText }})
          <template v-if="layoutHover.order.custCnt > 0">
            · 고객 {{ layoutHover.order.custCnt }}명
          </template>
        </div>
        <ul v-if="layoutHover.order.menus.length > 0" class="sls0233-menu-list">
          <li v-for="m in layoutHover.order.menus.slice(0, 8)" :key="m.seq">
            <div class="sls0233-menu-list__main">
              <span>{{ m.name }}</span>
              <span>× {{ m.count }}</span>
            </div>
            <div v-for="s in m.subs" :key="s.seq" class="sls0233-menu-list__sub">
              └ {{ s.name }}<template v-if="s.count > 1"> × {{ s.count }}</template>
            </div>
          </li>
          <li v-if="layoutHover.order.menus.length > 8" class="sls0233-menu-list__more">
            외 {{ layoutHover.order.menus.length - 8 }}개 메뉴 — 확대 버튼으로 전체 보기
          </li>
        </ul>
        <div v-else class="sls0233-pop__none">메뉴 상세가 들어오지 않은 테이블입니다.</div>
      </div>
    </Teleport>

    <!-- 배치도: 확대 버튼 — 주문 메뉴 전체 팝업 -->
    <Teleport to="body">
      <!-- 맥 스타일: 누른 확대 버튼 위치에서 커지며 열리고, 닫으면 그 자리로 줄어든다 -->
      <Transition name="sls0233-macpop" :duration="{ enter: 750, leave: 600 }">
      <div
        v-if="layoutDetail"
        class="sls0233-modal-dim"
        :style="{
          '--from-x': layoutDetailOrigin.dx + 'px',
          '--from-y': layoutDetailOrigin.dy + 'px',
        }"
        @click.self="layoutDetail = null">
        <!-- 바깥: 위치·높이 / 안쪽: 폭 — 따로 움직여 지니(빨려 나옴) 모양을 만든다 -->
        <div class="sls0233-genie">
        <div class="sls0233-modal" role="dialog" aria-modal="true">
          <div class="sls0233-modal__head">
            <div>
              <div class="sls0233-modal__title">
                {{ layoutDetail.storeName }} · 테이블 {{ layoutDetail.tableName }}
              </div>
              <div class="sls0233-modal__meta">
                입장 {{ layoutDetail.inTime }} ({{ layoutDetail.elapsedText }})
                <template v-if="layoutDetail.custCnt > 0"> · 고객 {{ layoutDetail.custCnt }}명</template>
              </div>
            </div>
            <div class="sls0233-modal__amt">
              {{ layoutDetail.orderAmt.toLocaleString() }}<small>원</small>
            </div>
          </div>
          <div class="sls0233-modal__body">
            <table v-if="layoutDetail.menus.length > 0" class="sls0233-modal-table">
              <thead>
                <tr>
                  <th>메뉴명</th>
                  <th>수량</th>
                  <th>기준단가</th>
                  <th>기준금액</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="m in layoutDetail.menus" :key="m.seq">
                  <tr class="is-main">
                    <td>{{ m.name }}</td>
                    <td>{{ m.count }}</td>
                    <td>{{ m.price.toLocaleString() }}</td>
                    <td>{{ m.amt.toLocaleString() }}</td>
                  </tr>
                  <tr v-for="s in m.subs" :key="s.seq" class="is-sub">
                    <td>└ {{ s.name }}</td>
                    <td>{{ s.count }}</td>
                    <td>{{ s.price ? s.price.toLocaleString() : "" }}</td>
                    <td>{{ s.amt ? s.amt.toLocaleString() : "" }}</td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div v-else class="sls0233-pop__none">
              메뉴 상세가 들어오지 않은 테이블입니다. (POS가 테이블 합계만 보냄)
            </div>
            <p class="sls0233-modal__note">
              메뉴 단가 기준 금액이며, 선할인이 있을 경우 미반영된 금액입니다.
            </p>
          </div>
          <div class="sls0233-modal__foot">
            <button
              type="button"
              class="pnc-sub-btn pnc-sub-btn--gray"
              @click="layoutDetail = null">
              <svg
                class="sls0233-btn-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round" />
              </svg>
              닫기
            </button>
          </div>
        </div>
        </div>
      </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { getUnpaidTableLayout, getUnpaidTableOrder } from "@/api/misales";
import { showModalAlert } from "@/utils/modalAlert";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */
import PageName from "@/components/pageName.vue";
/**
 * 	다중 매장 선택 컴포넌트
 */
import PickStorePlural from "@/components/pickStorePlural.vue";
/**
 * 	그리드 생성
 */
import Realgrid from "@/components/realgrid.vue";
/*
 * 공통 커스텀 Function ( 페이지 로그 , 시간 포맷)
 */
import { formatTime, insertPageLog } from "@/customFunc/customFunc";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { useStore } from "vuex";

const store = useStore();

/** 조회 AREA 레이아웃 값 (SLS02_030RPT 와 같은 패턴) */
const sls0233ControlBorder = "#cbd5e1";
const sls0233LabelCol = "5.5rem";

/** 셀병합 보기 — 테이블 키(strTableKey) 안에서 같은 값끼리 병합 */
const sls0233MergeCols =
  "strTableName,lngOrderAmt,dtmInTime,lngCustCount,lngMainNo";
/** 트리 보기 합계 — 최상위(매장) 줄만 합산 */
const sls0233TreeSumCols = ["lngOrderAmt", "lngCustCount", "lngAmt"];
const sls0233TreeSumExprs = ["sum", "sum", "sum"];

onMounted(async () => {
  await insertPageLog(store.state.activeTab2);
});

const viewMode = ref("merge");
const reload = ref(false);
const searchedTime = ref("");
/** 저장 프로시저 원본 행 (한 행 = 주문 메뉴 1개, 상세 없는 테이블은 테이블 1행) */
const sourceRows = ref([]);

const toNum = (v) => {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const toNumOrBlank = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
};

/** 셀병합 보기 행 */
/**
 * 기본·셀병합 보기 행
 * 순번은 메인 메뉴 묶음마다 1부터 다시 매긴다 (메인 1, 그 아래 하위 2·3…)
 */
const mergeRows = computed(() => {
  let groupKey = null;
  let seqInGroup = 0;
  return sourceRows.value.map((r) => {
    const hasMenu = !(r.lngMenuSeq === "" || r.lngMenuSeq == null);
    const key = r.strTableKey + "_" + r.lngMainNo;
    if (hasMenu) {
      seqInGroup = key === groupKey ? seqInGroup + 1 : 1;
      groupKey = key;
    }
    return {
    strStoreName: r.strStoreName,
    strTableName: r.strTableName,
    strTableKey: r.strTableKey,
    lngOrderAmt: toNum(r.lngOrderAmt),
    dtmInTime: r.dtmInTime,
    lngCustCount: toNum(r.lngCustCount),
    lngMainNo: toNumOrBlank(r.lngMainNo),
    lngMenuSeq: hasMenu ? seqInGroup : "",
    strMenuType: r.strMenuType,
    lngMenuCode: r.lngMenuCode,
    strMenuName:
      r.strMenuType === "하위" ? "　└ " + r.strMenuName : r.strMenuName,
    lngMenuCount: toNumOrBlank(r.lngMenuCount),
    lngPrice: toNumOrBlank(r.lngPrice),
    lngAmt: toNumOrBlank(r.lngAmt),
    };
  });
});

/**
 * 트리 보기 행 — 매장 > 테이블 > 메인 메뉴 > 하위 메뉴
 * TreeNum 은 단계마다 3자리 고정(부모 번호 + 자기 번호)이라 10번째 이후 행도 부모가 섞이지 않는다
 */
/**
 * 테이블 기준 줄 색 — 홀짝 줄 대신, 테이블이 바뀔 때마다 연한 파랑 ↔ 연한 살구를 교대 (mergeRows 와 같은 순서)
 * 공통 그리드 opt-in 옵션 rowClassList 로 넘긴다
 */
const tableBandClasses = computed(() => {
  let prevKey = null;
  let band = 1;
  return mergeRows.value.map((r) => {
    if (r.strTableKey !== prevKey) {
      band = 1 - band;
      prevKey = r.strTableKey;
    }
    return band === 1 ? "sls0233-band-b" : "sls0233-band-a";
  });
});

const treeRows = computed(() => {
  const pad = (n) => String(n).padStart(3, "0");
  const rows = [];
  let storeKey = null;
  let tableKey = null;
  let mainNo = null;
  let storeIdx = 0;
  let tableIdx = 0;
  let storeRow = null;
  let tableRow = null;
  let mainTreeNum = "";

  for (const r of sourceRows.value) {
    if (r.lngStoreCode !== storeKey) {
      storeKey = r.lngStoreCode;
      storeIdx += 1;
      tableIdx = 0;
      tableKey = null;
      storeRow = {
        TreeNum: pad(storeIdx),
        strName: r.strStoreName,
        lngOrderAmt: 0,
        dtmInTime: "",
        lngCustCount: 0,
        lngMenuCode: "",
        lngMenuCount: "",
        lngPrice: "",
        lngAmt: 0,
      };
      rows.push(storeRow);
    }
    if (r.strTableKey !== tableKey) {
      tableKey = r.strTableKey;
      tableIdx += 1;
      mainNo = null;
      tableRow = {
        TreeNum: storeRow.TreeNum + pad(tableIdx),
        strName: "테이블 " + r.strTableName,
        lngOrderAmt: toNum(r.lngOrderAmt),
        dtmInTime: r.dtmInTime,
        lngCustCount: toNum(r.lngCustCount),
        lngMenuCode: "",
        lngMenuCount: "",
        lngPrice: "",
        lngAmt: 0,
      };
      rows.push(tableRow);
      storeRow.lngOrderAmt += tableRow.lngOrderAmt;
      storeRow.lngCustCount += tableRow.lngCustCount;
    }
    if (r.lngMenuSeq === "" || r.lngMenuSeq == null) continue;

    const amt = toNum(r.lngAmt);
    tableRow.lngAmt += amt;
    storeRow.lngAmt += amt;
    const menuRow = {
      strName: r.strMenuName,
      lngOrderAmt: "",
      dtmInTime: "",
      lngCustCount: "",
      lngMenuCode: r.lngMenuCode,
      lngMenuCount: toNumOrBlank(r.lngMenuCount),
      lngPrice: toNumOrBlank(r.lngPrice),
      lngAmt: amt,
    };
    if (r.lngMainNo !== mainNo) {
      // 메인 메뉴 (메인 앞에 하위가 먼저 온 경우도 묶음의 첫 줄을 부모로 둔다)
      mainNo = r.lngMainNo;
      mainTreeNum = tableRow.TreeNum + pad(toNum(r.lngMainNo));
      menuRow.TreeNum = mainTreeNum;
    } else {
      menuRow.TreeNum = mainTreeNum + pad(toNum(r.lngMenuSeq));
    }
    rows.push(menuRow);
  }
  return rows;
});

/** 트리 모두 펼치기/접기 */
const treeGridRef = ref(null);
const treeAllOpen = ref(false);
const toggleTreeExpandAll = () => {
  const grid = treeGridRef.value;
  if (!grid) return;
  if (treeAllOpen.value) {
    grid.collapseAllTree();
    treeAllOpen.value = false;
  } else {
    grid.expandAllTree();
    treeAllOpen.value = true;
  }
};
/* 다시 조회하면 트리는 새 데이터로 접힌 상태가 되므로 버튼 상태도 「모두 펼치기」로 맞춘다 */
watch(sourceRows, () => {
  treeAllOpen.value = false;
});
watch(viewMode, (mode) => {
  treeAllOpen.value = false;
  hideLayoutHover();
  if (mode === "layout") {
    loadLayout();
  }
});

/* ───────────────────────── 배치도 보기 ───────────────────────── */
/** 배치 원본 (getTableLayout) — 조회할 때마다 비우고 배치도 보기에서 처음 1번 불러온다 */
const layoutRows = ref([]);
const layoutLoadedFor = ref("");
const layoutLoading = ref(false);
const layoutError = ref("");
const layoutStoreCode = ref("");
const layoutScreenNo = ref("");
const layoutCanvasRef = ref(null);
const layoutCanvasSize = ref({ w: 0, h: 0 });
const layoutHover = ref(null);
const layoutDetail = ref(null);
const nowTick = ref(Date.now());

const loadLayout = async () => {
  if (!searchedTime.value) return;
  const key = String(selectedGroup.value) + "|" + String(selectedStores.value) + "|" + searchedTime.value;
  if (layoutLoadedFor.value === key) {
    await nextTick();
    observeLayoutCanvas();
    return;
  }
  layoutLoading.value = true;
  layoutError.value = "";
  try {
    const res = await getUnpaidTableLayout(selectedGroup.value, selectedStores.value);
    if (res.data.RESULT_CD !== "00") {
      throw new Error(res.data.RESULT_NM);
    }
    layoutRows.value = Array.isArray(res.data.List) ? res.data.List : [];
    layoutLoadedFor.value = key;
    pickDefaultLayoutStore();
  } catch (error) {
    layoutRows.value = [];
    layoutError.value = "배치도를 불러오지 못했습니다. " + (error?.message || "");
  } finally {
    layoutLoading.value = false;
  }
  await nextTick();
  observeLayoutCanvas();
};

/** 시각 표시용 */
const pad2 = (n) => String(n).padStart(2, "0");
const parseInTime = (s) => {
  if (!s) return null;
  const d = new Date(String(s).replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
};
const elapsedText = (d) => {
  if (!d) return "";
  const min = Math.max(0, Math.floor((nowTick.value - d.getTime()) / 60000));
  if (min < 60) return min + "분 경과";
  return Math.floor(min / 60) + "시간 " + (min % 60) + "분 경과";
};

/** 미결제 주문 — 매장코드_테이블번호 → 테이블 정보 + 메뉴(메인 > 하위) */
const unpaidOrders = computed(() => {
  const map = new Map();
  for (const r of sourceRows.value) {
    const key = r.strTableKey;
    let o = map.get(key);
    if (!o) {
      const d = parseInTime(r.dtmInTime);
      o = {
        key,
        storeCode: String(r.lngStoreCode),
        storeName: r.strStoreName,
        tableId: String(r.lngTableID),
        tableName: r.strTableName,
        orderAmt: toNum(r.lngOrderAmt),
        custCnt: toNum(r.lngCustCount),
        inTime: r.dtmInTime,
        inTimeShort: d ? pad2(d.getHours()) + ":" + pad2(d.getMinutes()) : "",
        inDate: d,
        menus: [],
        _mainNo: null,
      };
      map.set(key, o);
    }
    if (r.lngMenuSeq === "" || r.lngMenuSeq == null) continue;
    const item = {
      seq: toNum(r.lngMenuSeq),
      name: r.strMenuName,
      count: toNum(r.lngMenuCount),
      price: toNum(r.lngPrice),
      amt: toNum(r.lngAmt),
      subs: [],
    };
    if (r.lngMainNo !== o._mainNo || o.menus.length === 0) {
      o._mainNo = r.lngMainNo;
      o.menus.push(item);
    } else {
      o.menus[o.menus.length - 1].subs.push(item);
    }
  }
  return map;
});
/** 경과 시간은 1분마다 다시 계산 */
const withElapsed = (o) =>
  o ? { ...o, elapsedText: elapsedText(o.inDate) } : null;

/** 매장 목록 (배치가 있는 매장) + 미결제 테이블 수 */
const layoutStores = computed(() => {
  const names = new Map();
  for (const r of layoutRows.value) {
    if (!names.has(String(r.lngStoreCode))) {
      names.set(String(r.lngStoreCode), r.strStoreName);
    }
  }
  const cnt = new Map();
  for (const o of unpaidOrders.value.values()) {
    cnt.set(o.storeCode, (cnt.get(o.storeCode) || 0) + 1);
  }
  /* 미결제가 있는 매장 먼저, 같은 그룹 안에서는 매장명 가나다순 */
  return [...names.entries()]
    .map(([code, name]) => ({
      code,
      name,
      unpaidCnt: cnt.get(code) || 0,
    }))
    .sort(
      (a, b) =>
        (b.unpaidCnt > 0) - (a.unpaidCnt > 0) ||
        String(a.name).localeCompare(String(b.name), "ko")
    );
});

const pickDefaultLayoutStore = () => {
  const list = layoutStores.value;
  if (list.length === 0) {
    layoutStoreCode.value = "";
    layoutScreenNo.value = "";
    return;
  }
  if (!list.some((s) => s.code === layoutStoreCode.value)) {
    const first = list.find((s) => s.unpaidCnt > 0) || list[0];
    layoutStoreCode.value = first.code;
  }
  pickDefaultLayoutScreen();
};
const selectLayoutStore = (code) => {
  hideLayoutHover();
  layoutStoreCode.value = code;
  layoutScreenNo.value = "";
  pickDefaultLayoutScreen();
};

/** 선택 매장의 키 (화면별) */
const storeLayoutRows = computed(() =>
  layoutRows.value.filter((r) => String(r.lngStoreCode) === layoutStoreCode.value)
);
const orderOfTable = (tableId) =>
  unpaidOrders.value.get(layoutStoreCode.value + "_" + String(tableId)) || null;

const layoutScreens = computed(() => {
  const map = new Map();
  for (const r of storeLayoutRows.value) {
    const no = String(r.intScreenNo);
    if (!map.has(no)) {
      map.set(no, {
        no,
        name: r.strScreenName,
        seq: toNum(r.intScreenKeySeq),
        unpaidCnt: 0,
      });
    }
    if (String(r.intKeyNo) === "13" && orderOfTable(r.lngKeyscrNo)) {
      map.get(no).unpaidCnt += 1;
    }
  }
  return [...map.values()].sort((a, b) => a.seq - b.seq || toNum(a.no) - toNum(b.no));
});
const pickDefaultLayoutScreen = () => {
  const list = layoutScreens.value;
  if (list.some((s) => s.no === layoutScreenNo.value)) return;
  const first = list.find((s) => s.unpaidCnt > 0) || list[0];
  layoutScreenNo.value = first ? first.no : "";
};
const moveLayoutScreen = (target) => {
  const no = String(target);
  if (layoutScreens.value.some((s) => s.no === no)) {
    hideLayoutHover();
    layoutScreenNo.value = no;
  }
};

/** POS 색(10진수 RGB) → #RRGGBB */
const decimalToHex = (dec) => {
  const n = toNum(dec);
  if (!n) return "#94a3b8";
  return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v.toString(16).padStart(2, "0")).join("");
};

/** 화면 크기에 맞춰 POS 좌표를 줄이거나 늘린다 */
const layoutBounds = computed(() => {
  let maxX = 0;
  let maxY = 0;
  for (const r of storeLayoutRows.value) {
    if (String(r.intScreenNo) !== layoutScreenNo.value || r.intKeyNo === "") continue;
    maxX = Math.max(maxX, toNum(r.lngX) + toNum(r.lngWidth));
    maxY = Math.max(maxY, toNum(r.lngY) + toNum(r.lngHeight));
  }
  return { maxX: maxX || 1, maxY: maxY || 1 };
});
/** 전체 보기 배율 — 배치 전체가 한 화면에 들어가게 */
const LAYOUT_PAD = 16;
const layoutFitScale = computed(() => {
  const { w, h } = layoutCanvasSize.value;
  const { maxX, maxY } = layoutBounds.value;
  if (!w || !h) return 0.05;
  return Math.max(
    0.01,
    Math.min((w - LAYOUT_PAD * 2) / maxX, (h - LAYOUT_PAD * 2) / maxY)
  );
});
/** 크게 보기 배율 — 가장 낮은 테이블 키가 64px 높이가 되게 (글자가 읽히는 크기) */
const LAYOUT_READABLE_H = 64;
const LAYOUT_MIN_H = 56;
const layoutReadableScale = computed(() => {
  let minH = 0;
  for (const r of storeLayoutRows.value) {
    if (String(r.intScreenNo) !== layoutScreenNo.value || String(r.intKeyNo) !== "13") continue;
    const h = toNum(r.lngHeight);
    if (h > 0 && (minH === 0 || h < minH)) minH = h;
  }
  return minH ? LAYOUT_READABLE_H / minH : layoutFitScale.value;
});
/**
 * 배율 선택: auto = 전체 보기로 읽을 수 있으면 전체 보기, 너무 작으면 크게 보기(+미니맵)
 * fit / large = 사용자가 버튼으로 고른 값 (매장·화면을 바꾸면 auto 로 돌아감)
 */
const layoutZoom = ref("auto");
const layoutFitTooSmall = computed(
  () => layoutFitScale.value * (LAYOUT_READABLE_H / layoutReadableScale.value) < LAYOUT_MIN_H
);
const layoutScale = computed(() => {
  const fit = layoutFitScale.value;
  /* 크게 보기는 읽히는 크기 이상, 그리고 전체 보기의 최소 1.6배 (눌렀을 때 확실히 커지게) */
  const large = Math.max(fit * 1.6, layoutReadableScale.value);
  if (layoutZoom.value === "fit") return fit;
  if (layoutZoom.value === "large") return large;
  return layoutFitTooSmall.value ? large : fit;
});
/** 크게 보기 버튼 사용 가능 (배치가 있을 때) */
const layoutCanEnlarge = computed(() => layoutKeys.value.length > 0);
/** 배치가 캔버스보다 커서 미니맵이 필요한지 */
const layoutNeedsMinimap = computed(() => layoutScale.value > layoutFitScale.value * 1.05);
const setLayoutZoom = async (mode) => {
  layoutZoom.value = mode;
  await nextTick();
  scrollLayoutToFirstUnpaid();
};
const layoutStage = computed(() => ({
  w: Math.round(layoutBounds.value.maxX * layoutScale.value),
  h: Math.round(layoutBounds.value.maxY * layoutScale.value),
}));
const layoutKeys = computed(() => {
  const sc = layoutScale.value;
  return storeLayoutRows.value
    .filter((r) => String(r.intScreenNo) === layoutScreenNo.value && r.intKeyNo !== "")
    .map((r) => {
      const keyNo = toNum(r.intKeyNo);
      const w = Math.max(12, toNum(r.lngWidth) * sc);
      const h = Math.max(12, toNum(r.lngHeight) * sc);
      return {
        id: r.intScreenNo + "_" + r.intKeySeq,
        keyNo,
        name: r.strKeyName,
        target: r.lngKeyscrNo,
        shape: toNum(r.lngShape),
        color: decimalToHex(r.lngKeyColor),
        compact: w < 96 || h < 72,
        order: keyNo === 13 ? withElapsed(orderOfTable(r.lngKeyscrNo)) : null,
        style: {
          left: Math.round(toNum(r.lngX) * sc) + "px",
          top: Math.round(toNum(r.lngY) * sc) + "px",
          width: Math.round(w) + "px",
          height: Math.round(h) + "px",
          fontSize: Math.max(11, Math.min(15, Math.round(h / 6))) + "px",
        },
      };
    });
});

/* ───── 미니맵 ───── */
const layoutScroll = ref({ left: 0, top: 0, w: 0, h: 0 });
const onLayoutCanvasScroll = (e) => {
  const el = e.target;
  layoutScroll.value = {
    left: el.scrollLeft,
    top: el.scrollTop,
    w: el.clientWidth,
    h: el.clientHeight,
  };
};
const syncLayoutScroll = () => {
  const el = layoutCanvasRef.value;
  if (el) onLayoutCanvasScroll({ target: el });
};
/** 미니맵 크기: 가로 200px 기준, 세로 140px 넘으면 세로 기준 */
const layoutMinimap = computed(() => {
  const { maxX, maxY } = layoutBounds.value;
  let w = 200;
  let h = (w * maxY) / maxX;
  if (h > 140) {
    h = 140;
    w = (h * maxX) / maxY;
  }
  const k = w / maxX;
  const keys = storeLayoutRows.value
    .filter((r) => String(r.intScreenNo) === layoutScreenNo.value && r.intKeyNo !== "")
    .map((r) => {
      const isTable = String(r.intKeyNo) === "13";
      return {
        id: r.intScreenNo + "_" + r.intKeySeq,
        cls: !isTable ? "is-move" : orderOfTable(r.lngKeyscrNo) ? "is-unpaid" : "is-idle",
        style: {
          left: toNum(r.lngX) * k + "px",
          top: toNum(r.lngY) * k + "px",
          width: Math.max(2, toNum(r.lngWidth) * k) + "px",
          height: Math.max(2, toNum(r.lngHeight) * k) + "px",
        },
      };
    });
  /* 지금 보이는 범위 (캔버스 스크롤 → POS 좌표 → 미니맵 좌표). 배치 판은 캔버스 안에서 16px 떨어져 있음 */
  const sc = layoutScale.value;
  const s = layoutScroll.value;
  const vx = Math.max(0, (s.left - LAYOUT_PAD) / sc) * k;
  const vy = Math.max(0, (s.top - LAYOUT_PAD) / sc) * k;
  const vw = Math.min(w, (s.w / sc) * k);
  const vh = Math.min(h, (s.h / sc) * k);
  return {
    w: Math.round(w),
    h: Math.round(h),
    k,
    keys,
    view: {
      left: Math.min(vx, w - vw) + "px",
      top: Math.min(vy, h - vh) + "px",
      width: vw + "px",
      height: vh + "px",
    },
  };
});
/** 미니맵에서 누른 곳이 화면 가운데에 오게 이동 */
const moveLayoutTo = (e) => {
  const el = layoutCanvasRef.value;
  if (!el) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const mm = layoutMinimap.value;
  const sc = layoutScale.value;
  const inner = 6; /* 미니맵 안쪽 여백 0.375rem */
  const posX = (e.clientX - rect.left - inner) / mm.k;
  const posY = (e.clientY - rect.top - inner) / mm.k;
  el.scrollTo({
    left: posX * sc + LAYOUT_PAD - el.clientWidth / 2,
    top: posY * sc + LAYOUT_PAD - el.clientHeight / 2,
  });
};
let minimapDragging = false;
const onMinimapDown = (e) => {
  minimapDragging = true;
  e.currentTarget.setPointerCapture?.(e.pointerId);
  moveLayoutTo(e);
};
const onMinimapMove = (e) => {
  if (minimapDragging) moveLayoutTo(e);
};
const onMinimapUp = () => {
  minimapDragging = false;
};
/** 크게 보기로 열릴 때 첫 미결제 테이블이 보이게 */
const scrollLayoutToFirstUnpaid = () => {
  const el = layoutCanvasRef.value;
  if (!el) return;
  if (!layoutNeedsMinimap.value) {
    el.scrollTo({ left: 0, top: 0 });
    syncLayoutScroll();
    return;
  }
  const target = layoutKeys.value.find((k) => k.order);
  if (target) {
    const x = parseFloat(target.style.left) + LAYOUT_PAD;
    const y = parseFloat(target.style.top) + LAYOUT_PAD;
    el.scrollTo({ left: x - el.clientWidth / 3, top: y - el.clientHeight / 3 });
  } else {
    el.scrollTo({ left: 0, top: 0 });
  }
  syncLayoutScroll();
};
/** 매장·화면을 바꾸면 auto 로 돌리고 첫 미결제 테이블 위치로 */
watch([layoutStoreCode, layoutScreenNo], async () => {
  layoutZoom.value = "auto";
  await nextTick();
  scrollLayoutToFirstUnpaid();
});
watch(layoutCanvasSize, () => syncLayoutScroll());

/** 선택 매장 요약 */
const layoutStoreSummary = computed(() => {
  let tableCnt = 0;
  let custCnt = 0;
  let orderAmt = 0;
  for (const o of unpaidOrders.value.values()) {
    if (o.storeCode !== layoutStoreCode.value) continue;
    tableCnt += 1;
    custCnt += o.custCnt;
    orderAmt += o.orderAmt;
  }
  return { tableCnt, custCnt, orderAmt };
});

/** 배치도에 키가 없는 미결제 테이블 (선택 매장) */
const layoutOrphans = computed(() => {
  const placed = new Set(
    storeLayoutRows.value
      .filter((r) => String(r.intKeyNo) === "13")
      .map((r) => String(r.lngKeyscrNo))
  );
  return [...unpaidOrders.value.values()]
    .filter((o) => o.storeCode === layoutStoreCode.value && !placed.has(o.tableId))
    .map(withElapsed);
});

/** 캔버스 크기 추적 */
let layoutResizeObserver = null;
const observeLayoutCanvas = () => {
  const el = layoutCanvasRef.value;
  if (!el) return;
  if (!layoutResizeObserver) {
    /* 같은 프레임에서 크기를 바꾸면 "ResizeObserver loop" 경고가 나므로 다음 프레임에 1번만, 바뀐 경우만 반영 */
    let raf = 0;
    layoutResizeObserver = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      const next = { w: Math.floor(r.width), h: Math.floor(r.height) };
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cur = layoutCanvasSize.value;
        if (cur.w !== next.w || cur.h !== next.h) {
          layoutCanvasSize.value = next;
        }
      });
    });
  }
  layoutResizeObserver.disconnect();
  layoutResizeObserver.observe(el);
};
watch(layoutCanvasRef, () => observeLayoutCanvas());

/** 마우스 오버 미리보기 */
const placeHover = (e) => {
  const popW = 300;
  const x = e.clientX + 16 + popW > window.innerWidth ? e.clientX - popW - 12 : e.clientX + 16;
  const y = Math.min(e.clientY + 12, window.innerHeight - 280);
  return { x: Math.max(8, x), y: Math.max(8, y) };
};
const showLayoutHover = (e, order) => {
  layoutHover.value = { order: withElapsed(order), ...placeHover(e) };
};
const moveLayoutHover = (e) => {
  if (layoutHover.value) {
    layoutHover.value = { ...layoutHover.value, ...placeHover(e) };
  }
};
const hideLayoutHover = () => {
  layoutHover.value = null;
};
/** 팝업이 커져 나올 출발점 (누른 버튼 가운데 - 화면 가운데) */
const layoutDetailOrigin = ref({ dx: 0, dy: 0 });
const openLayoutDetail = (order, e) => {
  hideLayoutHover();
  const el = e?.currentTarget;
  if (el && el.getBoundingClientRect) {
    const r = el.getBoundingClientRect();
    layoutDetailOrigin.value = {
      dx: Math.round(r.left + r.width / 2 - window.innerWidth / 2),
      dy: Math.round(r.top + r.height / 2 - window.innerHeight / 2),
    };
  } else {
    layoutDetailOrigin.value = { dx: 0, dy: 0 };
  }
  layoutDetail.value = withElapsed(order);
};

const tickTimer = setInterval(() => {
  nowTick.value = Date.now();
}, 60000);
onBeforeUnmount(() => {
  clearInterval(tickTimer);
  if (layoutResizeObserver) layoutResizeObserver.disconnect();
});

/**
 *  조회 함수
 */
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();
    const res = await getUnpaidTableOrder(
      selectedGroup.value,
      selectedStores.value
    );
    if (res.data.RESULT_CD !== "00") {
      throw new Error(res.data.RESULT_NM);
    }
    sourceRows.value = Array.isArray(res.data.List) ? res.data.List : [];
    searchedTime.value = formatTime(new Date());
    nowTick.value = Date.now();
    treeAllOpen.value = false;
    reload.value = !reload.value;
    if (viewMode.value === "layout") {
      await loadLayout();
    }
  } catch (error) {
    searchedTime.value = "";
  } finally {
    store.state.loading = false;
  }
};

const selectedGroup = ref();
const selectedStores = ref();
/**
 * 페이지 매장 그룹 세팅
 */
const lngStoreGroup = (e) => {
  selectedGroup.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */
const lngStoreCodes = (e) => {
  selectedStores.value = e;
};
/** 매장 분류·슈퍼바이저·팀 변경 시 그리드 초기화 */
const lngStoreAttrs = () => {
  initGrid();
};
const lngSupervisor = () => {
  initGrid();
};
const lngStoreTeam = () => {
  initGrid();
};

/**
 * 그리드 초기화
 */
const initGrid = () => {
  if (sourceRows.value.length > 0) {
    sourceRows.value = [];
  }
  searchedTime.value = "";
  hideLayoutHover();
};

const exportExcel = ref(false);
const documentSubTitle = ref("");
/**
 * 엑셀 내보내기 함수
 */
const excelButton = () => {
  if (viewMode.value === "layout") {
    showModalAlert(
      "warning",
      "안내",
      "배치도 보기는 엑셀 내보내기를 지원하지 않습니다. 기본·셀병합·트리 보기에서 내보내 주세요.",
      true,
      false,
      false
    );
    return;
  }
  documentSubTitle.value =
    (searchedTime.value ? "조회시각 : " + searchedTime.value + "\n" : "") +
    selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */
const excelStore = (e) => {
  selectedExcelStore.value = e;
};
</script>

<style scoped>
.sls0233-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  /*
   * 앞 공백 = --sls0233-edge (패널 → 「매장명」 글자)
   * - 5.5rem 칸 가운데 정렬이라 3글자 앞에 1.4375rem 숨은 여백이 있어 그만큼 뺀다
   * - 매장 콤보 크기는 그대로(최대 44rem) 두므로 넓은 화면에서는 오른쪽이 남는다
   */
  --sls0233-edge: 4.625rem;
  padding-left: calc(var(--sls0233-edge) - 1.4375rem);
  padding-right: var(--sls0233-edge);
}

.sls0233-search-layout {
  display: grid;
  /* 49rem = 기존 44rem + 가운데 열(직가맹 1개·팀/SC 2개 콤보) 확대분 5rem */
  grid-template-columns: minmax(0, var(--sls0233-store-max-w, 49rem));
  align-items: start;
  min-width: 0;
}

/* 테이블 기준 줄 색 (공통 그리드 rowClassList 로 붙는 클래스) — 서로 대비되는 연한 두 색을 테이블마다 교대 */
.sls0233-grid-host :deep(.sls0233-band-a) {
  background: #eef5ff; /* 연한 파랑 */
}

.sls0233-grid-host :deep(.sls0233-band-b) {
  background: #fff6ea; /* 연한 살구 */
}

/* 보기 방식 줄 — 그리드 바로 위. 항목명 칸이 조회 AREA 「매장명」 칸과 같은 세로선 */
.sls0233-view-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  /* 그리드 제목 줄: 파란 바 시작 = 그리드 왼쪽 끝, 안내 문구 끝 = 그리드 오른쪽 끝 */
  padding-left: 0;
  padding-right: 0;
  min-width: 0;
}

/* 소제목 앞 파란 세로 바 (PUR03_006INS .pur306-grid-title 기준) */
.sls0233-lbl--bar {
  flex: 0 0 auto;
  width: auto;
  justify-content: flex-start;
  gap: 0.5rem;
}

.sls0233-lbl--bar::before {
  content: "";
  flex: 0 0 0.25rem;
  width: 0.25rem;
  height: 1.05em;
  border-radius: 999px;
  background: #2563eb;
}

.sls0233-amt-notice {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.375rem;
  text-align: right;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #dc2626;
}

.sls0233-amt-notice__icon {
  flex: 0 0 auto;
  width: 1.05rem;
  height: 1.05rem;
  color: #dc2626;
}

.sls0233-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  min-height: 2rem;
}

.sls0233-lbl {
  box-sizing: border-box;
  flex: 0 0 var(--sls0233-label-col, 5.5rem);
  width: var(--sls0233-label-col, 5.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
}

.sls0233-check-label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.9375rem;
  line-height: 1.25;
  font-weight: 400;
  color: #1f2937;
  white-space: nowrap;
  cursor: pointer;
}

.sls0233-check {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #2563eb;
  cursor: pointer;
}

.sls0233-tree-all {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  height: 2rem;
  padding: 0 0.625rem;
  border: 1px solid var(--sls0233-control-border, #cbd5e1);
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  color: #1f2937;
  white-space: nowrap;
  cursor: pointer;
}

.sls0233-tree-all:hover {
  border-color: #3b82f6;
}

.sls0233-tree-all img {
  width: 1rem;
  height: 1rem;
}


.sls0233-store {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: visible;
}

.sls0233-store:has(.psp-popup),
.sls0233-store:has(.psp-store-hover-list) {
  z-index: 50;
}

.sls0233-store :deep(.psp-root) {
  grid-template-columns:
    var(--psp-label-w, 5.5rem)
    minmax(var(--psp-radio-w, 4.75rem), auto)
    minmax(7rem, 1.05fr)
    minmax(12rem, 1.88fr)
    minmax(9.5rem, 1.35fr);
  column-gap: var(--psp-col-gap, 0.5rem);
  row-gap: 0.5rem;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.sls0233-store :deep(.psp-label) {
  width: var(--psp-label-w, 5.5rem);
  justify-content: center;
  padding-inline-start: 0;
  font-size: 1rem;
  font-weight: 600;
}

.sls0233-store :deep(.psp-select),
.sls0233-store :deep(.psp-store-trigger),
.sls0233-store :deep(.psp-collapse-btn) {
  height: 2rem !important;
  min-height: 2rem !important;
}

.sls0233-store :deep(.psp-collapse-btn) {
  width: 2rem !important;
}

/* 매장 영역이 왼쪽이므로 매장 선택 팝업은 왼쪽 기준으로 펼친다 */
.sls0233-store :deep(.psp-popup) {
  z-index: 60;
  left: 0;
  right: auto;
  width: min(42rem, 92vw);
  min-width: 28rem;
  max-width: min(42rem, 92vw);
}

/* ───────────── 배치도 보기 ───────────── */
.sls0233-lay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 0;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: #f8fafc;
}

.sls0233-lay-empty {
  margin: auto;
  font-size: 0.9375rem;
  color: #64748b;
}

.sls0233-lay-empty--err {
  color: #dc2626;
}

/* 매장 버튼: 한 줄, 넘치면 가로로 넘겨 보기 (배치 영역 높이 확보) */
.sls0233-lay-stores {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: nowrap;
  gap: 0.375rem;
  padding-bottom: 0.25rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.sls0233-lay-stores > .sls0233-lay-chip {
  flex: 0 0 auto;
}

.sls0233-lay-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 1.875rem;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #fff;
  font-size: 0.8125rem;
  color: #475569;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.sls0233-lay-chip:hover {
  border-color: #3b82f6;
}

.sls0233-lay-chip.has-unpaid {
  color: #1e293b;
  font-weight: 600;
}

.sls0233-lay-chip.is-active {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

.sls0233-lay-chip__cnt {
  min-width: 1.25rem;
  padding: 0 0.375rem;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.75rem;
  line-height: 1.25rem;
  text-align: center;
}

.sls0233-lay-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.sls0233-lay-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.sls0233-lay-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  height: 2rem;
  padding: 0 0.875rem;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background: transparent;
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
}

.sls0233-lay-tab:hover {
  color: #1e40af;
}

.sls0233-lay-tab.is-active {
  margin-bottom: -1px;
  border-color: #e2e8f0;
  background: #fff;
  font-weight: 700;
  color: #1e40af;
}

.sls0233-lay-tab__cnt {
  min-width: 1.125rem;
  padding: 0 0.3rem;
  border-radius: 999px;
  background: #fee2e2;
  color: #dc2626;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-align: center;
}

.sls0233-lay-sum {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding-bottom: 0.375rem;
  font-size: 0.8125rem;
  color: #475569;
}

.sls0233-lay-sum b {
  color: #dc2626;
}

.sls0233-lay-legend {
  display: inline-block;
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.5rem;
  border-radius: 0.2rem;
}

.sls0233-lay-legend--on {
  border: 2px solid #ef4444;
  background: #fff;
}

.sls0233-lay-legend--off {
  border: 1px dashed #94a3b8;
  background: #f1f5f9;
}

.sls0233-lay-canvas-wrap {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
}

.sls0233-lay-canvas {
  position: absolute;
  inset: 0;
  overflow: auto;
  scrollbar-width: thin;
  border-radius: 0.5rem;
  background:
    radial-gradient(circle, #e2e8f0 1px, transparent 1px) 0 0 / 1.25rem 1.25rem,
    #fff;
}

.sls0233-lay-stage {
  position: relative;
  margin: 1rem;
}

/* 크게 보기: 끝까지 내렸을 때 오른쪽 아래 테이블이 미니맵에 가리지 않게 아래 여유 */
.sls0233-lay-canvas.is-zoomed .sls0233-lay-stage {
  margin-bottom: 10.5rem;
}

/* 전체 보기 / 크게 보기 (오른쪽 위) */
.sls0233-lay-zoombar {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  z-index: 5;
  display: flex;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 2px 6px rgb(15 23 42 / 0.08);
}

.sls0233-lay-zoomicon {
  flex: 0 0 auto;
  width: 0.95rem;
  height: 0.95rem;
}

.sls0233-lay-zoombtn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  height: 1.75rem;
  padding: 0 0.75rem;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  color: #475569;
  cursor: pointer;
}

.sls0233-lay-zoombtn + .sls0233-lay-zoombtn {
  border-left: 1px solid #e2e8f0;
}

.sls0233-lay-zoombtn.is-active {
  background: #eff6ff;
  font-weight: 700;
  color: #1e40af;
}

.sls0233-lay-zoombtn:disabled {
  color: #cbd5e1;
  cursor: default;
}

/* 미니맵 (오른쪽 아래) — 누르거나 끌어서 이동 */
.sls0233-lay-minimap {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  z-index: 5;
  box-sizing: content-box;
  padding: 0.375rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 0.94);
  box-shadow: 0 6px 18px rgb(15 23 42 / 0.16);
  cursor: crosshair;
  touch-action: none;
  user-select: none;
}

.sls0233-lay-minimap__key {
  position: absolute;
  margin: 0.375rem;
  border-radius: 1px;
  pointer-events: none;
}

.sls0233-lay-minimap__key.is-idle {
  background: #cbd5e1;
}

.sls0233-lay-minimap__key.is-unpaid {
  background: #ef4444;
}

.sls0233-lay-minimap__key.is-move {
  background: #e2e8f0;
}

.sls0233-lay-minimap__view {
  position: absolute;
  box-sizing: border-box;
  margin: 0.375rem;
  border: 2px solid #2563eb;
  border-radius: 2px;
  background: rgb(37 99 235 / 0.08);
  pointer-events: none;
}

/* 테이블 키 */
.sls0233-lay-table {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15em;
  padding: 0.35em;
  overflow: hidden;
  border-radius: 0.625rem;
  text-align: center;
  line-height: 1.2;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.sls0233-lay-table.shape-1 {
  border-radius: 50%;
}

.sls0233-lay-table.is-idle {
  border: 1px dashed color-mix(in srgb, var(--key-color) 55%, #94a3b8);
  background: color-mix(in srgb, var(--key-color) 8%, #f8fafc);
  color: #94a3b8;
}

.sls0233-lay-table.is-unpaid {
  z-index: 1;
  border: 2px solid #ef4444;
  border-top: 0.4em solid var(--key-color);
  background: #fff;
  box-shadow: 0 4px 12px rgb(239 68 68 / 0.18);
  color: #1e293b;
  cursor: default;
}

.sls0233-lay-table.is-unpaid:hover {
  z-index: 2;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgb(239 68 68 / 0.28);
}

.sls0233-lay-table__name {
  max-width: 100%;
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sls0233-lay-table__amt {
  font-size: 1.1em;
  font-weight: 800;
  color: #dc2626;
  white-space: nowrap;
}

.sls0233-lay-table__amt small {
  margin-left: 0.1em;
  font-size: 0.75em;
  font-weight: 600;
}

.sls0233-lay-table__meta {
  max-width: 100%;
  overflow: hidden;
  font-size: 0.8em;
  color: #64748b;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sls0233-lay-table.is-compact .sls0233-lay-table__amt {
  font-size: 0.95em;
}

/* 우측 상단 확대 버튼 */
.sls0233-lay-table__zoom {
  position: absolute;
  top: 0.2em;
  right: 0.2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  min-width: 18px;
  min-height: 18px;
  padding: 0;
  border: 1px solid #bfdbfe;
  border-radius: 0.35em;
  background: #eff6ff;
  color: #1e40af;
  cursor: pointer;
}

.sls0233-lay-table__zoom:hover {
  border-color: #3b82f6;
  background: #dbeafe;
}

.sls0233-lay-table__zoom svg {
  width: 70%;
  height: 70%;
}

.sls0233-lay-table.shape-1 .sls0233-lay-table__zoom {
  top: 12%;
  right: 12%;
}

/* 화면 이동 키 */
.sls0233-lay-move {
  position: absolute;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25em;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #f1f5f9;
  color: #475569;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.sls0233-lay-move:hover {
  border-color: #3b82f6;
  color: #1e40af;
}

.sls0233-lay-orphans {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
}

.sls0233-lay-orphans__title {
  margin-right: 0.25rem;
  font-weight: 700;
  color: #475569;
}

/* 마우스 오버 미리보기 (body 로 Teleport) */
.sls0233-pop {
  position: fixed;
  z-index: 10060;
  box-sizing: border-box;
  width: 300px;
  max-height: 270px;
  padding: 0.625rem 0.75rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  background: #fff;
  box-shadow: 0 12px 32px rgb(15 23 42 / 0.18);
  pointer-events: none;
  font-size: 0.8125rem;
  color: #1e293b;
}

.sls0233-pop__head {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.sls0233-pop__head span {
  font-weight: 800;
  color: #dc2626;
  white-space: nowrap;
}

.sls0233-pop__meta {
  margin: 0.125rem 0 0.375rem;
  color: #64748b;
}

.sls0233-pop__none {
  color: #94a3b8;
}

.sls0233-menu-list {
  margin: 0;
  padding: 0.375rem 0 0;
  border-top: 1px solid #f1f5f9;
  list-style: none;
}

.sls0233-menu-list li + li {
  margin-top: 0.25rem;
}

.sls0233-menu-list__main {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-weight: 600;
}

.sls0233-menu-list__sub {
  padding-left: 0.75rem;
  color: #64748b;
}

.sls0233-menu-list__more {
  color: #2563eb;
}

/* 확대 팝업 (body 로 Teleport) */
.sls0233-modal-dim {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(15 23 42 / 0.45);
}

/*
 * ── 맥 지니 스타일 열기/닫기 ──
 * 바깥(.sls0233-genie) = 위치 + 높이, 안쪽(.sls0233-modal) = 폭 을 서로 다른 속도 곡선으로 한 번에 움직인다.
 * 구간(keyframe)을 나누지 않아 속도가 끊기지 않는다. 흐림 효과는 매 프레임 다시 그려 버벅이므로 쓰지 않는다.
 * 열기 0.75초: 높이·위치가 먼저 펴지고 폭이 뒤따라 펴짐 → 버튼에서 가늘고 길게 빨려 나오는 모양
 * 닫기 0.6초: 폭이 먼저 오므라들고 위치·높이가 점점 빨라지며 버튼 속으로 빨려 들어감
 */
.sls0233-genie {
  will-change: transform, opacity;
}

.sls0233-genie .sls0233-modal {
  will-change: transform;
}

.sls0233-macpop-enter-active {
  transition: background-color 0.5s ease-out;
}

.sls0233-macpop-leave-active {
  transition: background-color 0.5s ease-in;
}

.sls0233-macpop-enter-active .sls0233-genie {
  transition:
    transform 0.75s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.3s ease-out;
}

.sls0233-macpop-enter-active .sls0233-modal {
  transition: transform 0.75s cubic-bezier(0.65, 0, 0.25, 1);
}

.sls0233-macpop-leave-active .sls0233-genie {
  transition:
    transform 0.6s cubic-bezier(0.7, 0, 0.84, 0),
    opacity 0.6s cubic-bezier(0.7, 0, 0.84, 0);
}

.sls0233-macpop-leave-active .sls0233-modal {
  transition: transform 0.6s cubic-bezier(0.3, 0, 0.15, 1);
}

.sls0233-macpop-enter-from,
.sls0233-macpop-leave-to {
  background-color: rgb(15 23 42 / 0);
}

.sls0233-macpop-enter-from .sls0233-genie,
.sls0233-macpop-leave-to .sls0233-genie {
  opacity: 0;
  transform: translate(var(--from-x, 0), var(--from-y, 0)) scaleY(0.02);
}

.sls0233-macpop-enter-from .sls0233-modal,
.sls0233-macpop-leave-to .sls0233-modal {
  transform: scaleX(0.04);
}

@media (prefers-reduced-motion: reduce) {
  .sls0233-macpop-enter-active .sls0233-genie,
  .sls0233-macpop-leave-active .sls0233-genie,
  .sls0233-macpop-enter-active .sls0233-modal,
  .sls0233-macpop-leave-active .sls0233-modal {
    transition: opacity 0.15s linear;
  }

  .sls0233-macpop-enter-from .sls0233-genie,
  .sls0233-macpop-leave-to .sls0233-genie,
  .sls0233-macpop-enter-from .sls0233-modal,
  .sls0233-macpop-leave-to .sls0233-modal {
    transform: none;
  }
}

.sls0233-modal {
  display: flex;
  flex-direction: column;
  width: min(36rem, 92vw);
  max-height: 85vh;
  overflow: hidden;
  border-radius: 0.875rem;
  background: #fff;
  box-shadow: 0 24px 48px rgb(15 23 42 / 0.3);
}

.sls0233-modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.sls0233-modal__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #0f172a;
}

.sls0233-modal__title::before {
  content: "";
  flex: 0 0 0.25rem;
  width: 0.25rem;
  height: 1.05em;
  border-radius: 999px;
  background: #2563eb;
}

.sls0233-modal__meta {
  margin-top: 0.25rem;
  font-size: 0.8125rem;
  color: #64748b;
}

.sls0233-modal__amt {
  font-size: 1.375rem;
  font-weight: 800;
  color: #dc2626;
  white-space: nowrap;
}

.sls0233-modal__amt small {
  margin-left: 0.15rem;
  font-size: 0.8125rem;
}

.sls0233-modal__body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 0.75rem 1.25rem;
  overflow: auto;
}

.sls0233-modal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.sls0233-modal-table th {
  position: sticky;
  top: 0;
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid #cbd5e1;
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
  text-align: right;
}

.sls0233-modal-table th:first-child,
.sls0233-modal-table td:first-child {
  text-align: left;
}

.sls0233-modal-table td {
  padding: 0.3rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  text-align: right;
  white-space: nowrap;
}

.sls0233-modal-table tr.is-main td {
  font-weight: 600;
  color: #0f172a;
}

.sls0233-modal-table tr.is-sub td {
  color: #64748b;
}

.sls0233-modal-table tr.is-sub td:first-child {
  padding-left: 1.25rem;
}

.sls0233-modal__note {
  margin: 0.75rem 0 0;
  font-size: 0.8125rem;
  color: #dc2626;
}

.sls0233-modal__foot {
  display: flex;
  justify-content: flex-end;
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.sls0233-btn-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.3rem;
}
</style>
