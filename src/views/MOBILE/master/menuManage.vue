<!--
  모바일 메뉴 조회 (조회 전용)
  - 웹 메뉴코드등록(MST01_003INS)과 같은 메뉴 목록(getMenuCodeEnroll)·분류(getMenuList)를 보여 주고, 카드를 누르면 상세가 펼쳐진다(한 번에 하나)
  - 메뉴 등록은 이 화면에서 직접 하지 않고 AI 페이지(초간단 메뉴등록)에서만 한다
  - 수정은 상세의 메뉴명·판매가만 「수정」 버튼으로 한다 (웹과 같은 saveMenuCode, 다른 값은 조회한 그대로 저장)
  - 사용 조건은 웹과 같다 (mobileMenuAccess.js): 메뉴코드등록 메뉴가 있는 계정, 매장 계정 + 공통 메뉴는 조회만, 그룹 3015 는 AI 사용 안 함
  - 모바일 홈 「메뉴 관리」 버튼으로 들어오면 목록이 바로 보이고, 초간단 메뉴등록은 위쪽 버튼으로 연다
-->
<template>
  <div class="mm">
    <div v-if="accessState === 'loading'" class="mm-empty">불러오는 중입니다...</div>
    <div v-else-if="accessState === 'denied'" class="mm-empty">
      메뉴코드등록 메뉴 권한이 없는 계정입니다.<br />웹 피앤시오피스 메뉴 권한을 확인해 주세요.
    </div>

    <template v-else>
      <!-- 매장 · 등록 버튼 -->
      <div class="mm-card mm-top">
        <div class="mm-top-row">
          <span class="mm-top-label">매장</span>
          <select
            v-if="needsStorePick"
            v-model="pickedStoreCd"
            class="mm-select"
            @change="onStoreChange">
            <option value="">매장을 선택해 주세요</option>
            <option v-for="s in stores" :key="s.code" :value="s.code">{{ s.name }}</option>
          </select>
          <span v-else class="mm-top-store">{{ menuStoreName }}</span>
          <button type="button" class="mm-home" aria-label="홈으로" @click="goHome">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5H9v5.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z"
                fill="currentColor" />
            </svg>
          </button>
        </div>
        <div v-if="readOnly" class="mm-note">
          브랜드 공통 메뉴는 매장 계정에서 조회만 할 수 있습니다. 메뉴 등록·수정은 본사에 요청해 주세요.
        </div>
        <!-- 메뉴 등록·관리는 AI 페이지에서: 초간단 메뉴등록 / AI 메뉴관리 (하나만 보이면 한 줄 전체) -->
        <div v-if="canQuick || canAi" class="mm-tools" :class="{ 'is-single': !(canQuick && canAi) }">
          <button
            v-if="canQuick"
            type="button"
            class="mm-tool is-quick"
            :disabled="!loaded"
            @click="openQuick">
            <span class="mm-tool-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false">
                <path
                  d="M13.2 2.5 5.6 13.1c-.3.4 0 1 .5 1h4.6l-1.3 7.2c-.1.6.6.9 1 .4l7.6-10.6c.3-.4 0-1-.5-1h-4.6l1.3-7.2c.1-.6-.6-.9-1-.4Z"
                  fill="currentColor" />
              </svg>
            </span>
            <span class="mm-tool-text">
              <span class="mm-tool-title">초간단 메뉴등록</span>
              <span class="mm-tool-sub">메뉴명·판매가로 바로 등록</span>
            </span>
          </button>
          <button
            v-if="canAi"
            type="button"
            class="mm-tool is-ai"
            :disabled="!loaded"
            @click="openAi">
            <span class="mm-tool-icon" aria-hidden="true">
              <!-- AI 로봇 얼굴 (웹 메뉴코드등록과 같은 모양) -->
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M12 2.8v2.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <circle cx="12" cy="2.6" r="1.2" fill="currentColor" />
                <circle cx="12" cy="13.6" r="8.2" fill="none" stroke="currentColor" stroke-width="1.8" />
                <circle cx="9" cy="12.6" r="1.4" fill="currentColor" />
                <circle cx="15" cy="12.6" r="1.4" fill="currentColor" />
                <path d="M9.3 16.3c1.6 1.3 3.8 1.3 5.4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
              </svg>
            </span>
            <span class="mm-tool-text">
              <span class="mm-tool-title">AI 메뉴관리</span>
              <span class="mm-tool-sub">{{ readOnly ? "대화로 조회·매출" : "대화로 등록·조회·수정" }}</span>
            </span>
          </button>
        </div>
      </div>

      <template v-if="menuStoreCd !== ''">
        <!-- 검색 · 대분류 -->
        <div class="mm-search">
          <svg class="mm-search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
            <path d="M16 16l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <!-- v-model 은 한글 조합 중(ㅇㅈ 등)에는 값을 늦게 넘겨 초성 검색이 안 되므로 input 이벤트로 바로 반영 -->
          <input
            :value="keyword"
            type="search"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            placeholder="메뉴명·초성·메뉴코드 검색"
            @input="keyword = $event.target.value" />
        </div>
        <div class="mm-chips">
          <button
            type="button"
            class="mm-chip"
            :class="{ 'is-on': selectedMain === '' }"
            @click="selectedMain = ''">
            전체 {{ rows.length }}
          </button>
          <button
            v-for="g in mainChips"
            :key="g.code"
            type="button"
            class="mm-chip"
            :class="{ 'is-on': selectedMain === g.code }"
            @click="selectedMain = g.code">
            {{ g.name }} {{ g.count }}
          </button>
        </div>

        <div v-if="loading" class="mm-empty">메뉴를 불러오는 중입니다...</div>
        <div v-else-if="filteredRows.length === 0" class="mm-empty">
          {{ rows.length === 0 ? "등록된 메뉴가 없습니다." : "조건에 맞는 메뉴가 없습니다." }}
        </div>

        <!-- 메뉴 목록: 누르면 상세가 펼쳐지고 다시 누르면 닫힌다 -->
        <div v-else class="mm-list">
          <div
            v-for="r in visibleRows"
            :key="r.lngCode"
            :ref="(el) => setItemRef(r.lngCode, el)"
            class="mm-card mm-item"
            :class="{ 'is-open': openCode === String(r.lngCode), 'is-new': highlightCode === String(r.lngCode) }">
            <button type="button" class="mm-item-head" @click="toggle(r.lngCode)">
              <span class="mm-item-main">
                <span class="mm-item-name">{{ r.strName || "(이름 없음)" }}</span>
                <span class="mm-item-meta">{{ r.lngCode }} · {{ subName(r) }}</span>
              </span>
              <span class="mm-item-side">
                <span class="mm-item-price">{{ formatPrice(r.lngPrice) }}원</span>
                <span class="mm-badges">
                  <span v-if="highlightCode === String(r.lngCode)" class="mm-badge is-new">신규</span>
                  <span v-if="String(r.blnInactive) === '1'" class="mm-badge is-off">미사용</span>
                  <!-- 품절 표시는 품절 작업 때 다시 넣는다 -->
                </span>
              </span>
              <svg class="mm-item-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <div v-if="openCode === String(r.lngCode)" class="mm-detail">
              <template v-for="f in detailFields(r)" :key="f.label">
              <!-- 분류 수정 중에는 소분류 줄을 숨기고 대분류 줄에서 대분류·소분류를 함께 고른다 -->
              <div v-if="!(f.hideWhileEditing && isEditing(r, f.edit))" class="mm-field">
                <span class="mm-field-label">{{ f.label }}</span>
                <!-- 분류(대분류·소분류)·메뉴명·판매가만 수정 가능 (조회 전용 계정은 버튼 없음) -->
                <form
                  v-if="f.edit === 'group' && f.editForm && isEditing(r, 'group')"
                  class="mm-edit mm-edit-group"
                  @submit.prevent="saveEdit(r)">
                  <select v-model="editing.main" class="mm-edit-select" :disabled="saving" @change="onEditMainChange">
                    <option v-for="g in mainGroups" :key="g.GroupCd" :value="String(g.GroupCd)">
                      {{ g.majorGroupNm }}
                    </option>
                  </select>
                  <select v-model="editing.sub" class="mm-edit-select" :disabled="saving">
                    <option value="">소분류 선택</option>
                    <option v-for="g in editSubOptions" :key="g.GroupCd" :value="String(g.GroupCd)">
                      {{ g.subGroupNm }}
                    </option>
                  </select>
                  <span class="mm-edit-actions">
                    <button type="submit" class="mm-edit-btn is-save" :disabled="saving">저장</button>
                    <button type="button" class="mm-edit-btn" :disabled="saving" @click="cancelEdit">취소</button>
                  </span>
                </form>
                <form
                  v-else-if="f.edit && f.edit !== 'group' && isEditing(r, f.edit)"
                  class="mm-edit"
                  @submit.prevent="saveEdit(r)">
                  <input
                    :ref="setEditInput"
                    v-model="editing.value"
                    :type="f.edit === 'lngPrice' ? 'tel' : 'text'"
                    :inputmode="f.edit === 'lngPrice' ? 'numeric' : 'text'"
                    :maxlength="f.edit === 'lngPrice' ? 9 : 50"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    :disabled="saving"
                    @input="onEditInput" />
                  <span class="mm-edit-actions">
                    <button type="submit" class="mm-edit-btn is-save" :disabled="saving">저장</button>
                    <button type="button" class="mm-edit-btn" :disabled="saving" @click="cancelEdit">취소</button>
                  </span>
                </form>
                <!-- 사용여부: 켜고 끄는 스위치 (조회 전용 계정은 표시만) -->
                <template v-else-if="f.toggleUse">
                  <span class="mm-field-value">{{ f.value }}</span>
                  <button
                    type="button"
                    role="switch"
                    class="mm-switch"
                    :class="{ 'is-on': String(r.blnInactive) !== '1' }"
                    :aria-checked="String(r.blnInactive) !== '1'"
                    :disabled="!canEdit || saving"
                    @click="toggleUse(r)">
                    <span class="mm-switch-knob"></span>
                  </button>
                </template>
                <template v-else>
                  <span class="mm-field-value">{{ f.value }}</span>
                  <button
                    v-if="f.edit && canEdit"
                    type="button"
                    class="mm-edit-open"
                    :disabled="saving"
                    @click="startEdit(r, f.edit)">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path
                        d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        stroke-linejoin="round" />
                    </svg>
                    수정
                  </button>
                </template>
              </div>
              </template>
              <button type="button" class="mm-more" @click="showMore = !showMore">
                {{ showMore ? "접기" : "더보기" }}
              </button>
              <template v-if="showMore">
                <div v-for="f in moreFields(r)" :key="f.label" class="mm-field">
                  <span class="mm-field-label">{{ f.label }}</span>
                  <span class="mm-field-value">{{ f.value }}</span>
                </div>
              </template>
            </div>
          </div>
          <button v-if="filteredRows.length > visibleRows.length" type="button" class="mm-load-more" @click="pageSize += PAGE_STEP">
            더 보기 ({{ visibleRows.length }} / {{ filteredRows.length }})
          </button>
        </div>
      </template>
      <div v-else class="mm-empty">위에서 매장을 선택해 주세요.</div>
    </template>

    <MobileQuickMenu
      v-if="quickOpen"
      :group-cd="groupCd"
      :store-cd="menuStoreCd"
      :store-name="menuStoreName"
      :main-groups="mainGroups"
      :sub-groups="subGroups"
      :menu-rows="rows"
      :key-store-list="keyStoreList"
      @registered="onRegistered"
      @close="closeQuick" />
    <!-- AI 메뉴관리: 한 번 열면 닫아도 대화가 남아 있다가 다시 열면 이어진다 (웹과 같음). 매장을 바꾸면 새로 시작 -->
    <MobileAiMenu
      v-if="aiMounted"
      :open="aiOpen"
      :group-cd="groupCd"
      :store-cd="menuStoreCd"
      :store-name="menuStoreName"
      :menu-rows="rows"
      :main-groups="mainGroups"
      :sub-groups="subGroups"
      :option-groups="optionGroups"
      :store-list="stores"
      :is-common-menu="isCommonMenu"
      :is-store-account="isStoreAccount"
      :user-position="userPosition"
      @close="aiOpen = false"
      @saved="onAiSaved"
      @focus-menu="onAiFocusMenu" />
    <!-- 모바일 전용 확인 시트·완료 알림 (웹 화면 알림창은 그대로) -->
    <MobileDialog />
    <!-- 맨 위로: 메뉴 화면에서 항상 떠 있다 -->
    <Transition name="mm-top-fade">
      <button v-if="accessState === 'ok'" type="button" class="mm-to-top" aria-label="맨 위로" @click="scrollToTop">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { getMenuCodeEnroll, getMenuList, getMenuSnapshot, writeMenuChangeLog } from "@/api/master";
import { normalizeMenuListSoldOutYn } from "@/customFunc/customFunc";
import MobileDialog from "./MobileDialog.vue";
import { mobileAlert, mobileConfirm, mobileToast } from "./mobileDialog";
import { saveMenuRow } from "./mobileMenuSave";
import { matchNameWithChoseong } from "@/utils/choseongFilter";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import MobileQuickMenu from "./MobileQuickMenu.vue";
import MobileAiMenu from "./MobileAiMenu.vue";
import {
  canUseQuickMenu,
  isAiEnabledGroup,
  isCommonMenuReadOnly,
  isCommonMenuUser,
  isStoreAccountUser,
  loadMenuAccess,
  loadStoreList,
} from "./mobileMenuAccess";

const store = useStore();
const router = useRouter();
const route = useRoute();
// 매장 이름 옆 홈 아이콘: 모바일 홈으로
const goHome = () => {
  if (saving.value) return;
  router.push("/m/homepage");
};
const PICKED_STORE_KEY = "mobileMenuManage.pickedStore";
const PAGE_STEP = 50;

const accessState = ref("loading"); // loading / denied / ok
const user = ref(null);
const accessMenu = ref(null);
const stores = ref([]);
const groupCd = computed(() => String(user.value?.lngStoreGroup ?? ""));
const readOnly = computed(() => isCommonMenuReadOnly(user.value));
const canQuick = computed(() => canUseQuickMenu(user.value, accessMenu.value) && menuStoreCd.value !== "");
// AI 메뉴관리: 메뉴코드등록 메뉴 + AI 사용 그룹 (조회 전용 계정도 조회·매출·질문은 된다 — 웹과 같음)
const canAi = computed(
  () => !!user.value && !!accessMenu.value && isAiEnabledGroup(user.value) && menuStoreCd.value !== ""
);
const isCommonMenu = computed(() => isCommonMenuUser(user.value));
const isStoreAccount = computed(() => isStoreAccountUser(user.value));
const userPosition = computed(() => String(user.value?.lngPosition ?? ""));
// 본사 계정 + 매장별 메뉴 브랜드만 매장을 고른다 (웹 aiNeedsStorePick)
const needsStorePick = computed(
  () => !!user.value && !isCommonMenuUser(user.value) && !isStoreAccountUser(user.value)
);
const pickedStoreCd = ref("");
// 메뉴를 조회·저장하는 매장코드: 공통 메뉴 0 / 매장 계정 본인 매장 / 본사 계정 고른 매장
const menuStoreCd = computed(() => {
  const u = user.value;
  if (!u) return "";
  if (isCommonMenuUser(u)) return "0";
  if (isStoreAccountUser(u)) return String(u.lngPosition ?? "");
  return pickedStoreCd.value;
});
const menuStoreName = computed(() => {
  const u = user.value;
  if (!u) return "";
  if (isCommonMenuUser(u)) return `${u.strStoreGroupName || ""} 공통 메뉴`.trim();
  const found = stores.value.find((s) => s.code === menuStoreCd.value);
  return found?.name || u.strStoreName || "";
});
// 메뉴키 배치 매장: 매장별 메뉴는 그 매장만, 공통 메뉴는 매장 목록에서 고른다 (웹 getAiChatKeyStoreList)
const keyStoreList = computed(() => {
  if (menuStoreCd.value !== "" && menuStoreCd.value !== "0") {
    const own = stores.value.find((s) => s.code === menuStoreCd.value);
    return [own || { code: menuStoreCd.value, name: menuStoreName.value || menuStoreCd.value }];
  }
  return stores.value;
});

const rows = ref([]);
const mainGroups = ref([]);
const subGroups = ref([]);
const optionGroups = ref([]);
const loading = ref(false);
const loaded = ref(false);
const keyword = ref("");
const selectedMain = ref("");
const openCode = ref("");
const showMore = ref(false);
const highlightCode = ref("");
const pageSize = ref(PAGE_STEP);
const quickOpen = ref(false);

const mainName = (r) =>
  mainGroups.value.find((g) => String(g.GroupCd) === String(r.lngMainGroup))?.majorGroupNm || String(r.lngMainGroup ?? "");
const subName = (r) =>
  subGroups.value.find(
    (g) => String(g.GroupCd) === String(r.lngSubGroup) && String(g.sublngMajor) === String(r.lngMainGroup)
  )?.subGroupNm || String(r.lngSubGroup ?? "");
const formatPrice = (v) => String(Number(v) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const yesNo = (v) => (String(v) === "1" ? "예" : "아니오");
const dateText = (v) => String(v || "").slice(0, 10);

const mainChips = computed(() =>
  mainGroups.value
    .map((g) => ({
      code: String(g.GroupCd),
      name: g.majorGroupNm,
      count: rows.value.filter((r) => String(r.lngMainGroup) === String(g.GroupCd)).length,
    }))
    .filter((g) => g.count > 0)
);
const filteredRows = computed(() => {
  const word = keyword.value.trim();
  return rows.value.filter((r) => {
    if (selectedMain.value !== "" && String(r.lngMainGroup) !== selectedMain.value) return false;
    if (!word) return true;
    return matchNameWithChoseong(r.strName || "", word) || String(r.lngCode).startsWith(word);
  });
});
const visibleRows = computed(() => filteredRows.value.slice(0, pageSize.value));
watch([keyword, selectedMain], () => {
  pageSize.value = PAGE_STEP;
});

const detailFields = (r) => [
  { label: "대분류", value: mainName(r), edit: "group", editForm: true },
  { label: "소분류", value: subName(r), edit: "group", hideWhileEditing: true },
  { label: "메뉴코드", value: String(r.lngCode) },
  { label: "메뉴명", value: r.strName || "-", edit: "strName" },
  { label: "메뉴명(영문)", value: r.strNameE || "-" },
  { label: "판매가", value: `${formatPrice(r.lngPrice)}원`, edit: "lngPrice" },
  { label: "정상단가", value: `${formatPrice(r.lngDCPrice)}원` },
  { label: "과세구분", value: String(r.lngTax) === "2" ? "면세" : "과세" },
  { label: "사용여부", value: String(r.blnInactive) === "1" ? "미사용" : "사용", toggleUse: true },
  { label: "할인허용", value: yesNo(r.discountYN) },
  // 주방출력(lngKPG): 1~20 출력, 0·90번대·그 밖의 값은 미출력
  { label: "주방출력", value: Number(r.lngKPG) >= 1 && Number(r.lngKPG) <= 20 ? "출력" : "미출력" },
  { label: "적용기간", value: `${dateText(r.dtmFromDate)} ~ ${dateText(r.dtmToDate)}` },
];
const moreFields = (r) => [
  { label: "메뉴당객수", value: String(r.intCustCount ?? 0) },
  { label: "주문정렬순위", value: String(r.lngOrder ?? 0) },
  { label: "바코드", value: r.strBarCode || "-" },
  { label: "영수증출력제외", value: yesNo(r.blnReceipt) },
  { label: "시세가적용", value: yesNo(r.blnOpen) },
  { label: "비고", value: r.strBigo || "-" },
];

const itemRefs = new Map();
const setItemRef = (code, el) => {
  if (el) itemRefs.set(String(code), el);
  else itemRefs.delete(String(code));
};
const toggle = (code) => {
  if (saving.value) return;
  const c = String(code);
  showMore.value = false;
  editing.value = null;
  openCode.value = openCode.value === c ? "" : c;
};

/* ---------- 분류·메뉴명·판매가 수정 (웹과 같은 saveMenuCode, 나머지 값은 조회한 그대로) ---------- */
// 매장 계정 + 공통 메뉴는 조회만 (웹 isCommonMenuReadOnly)
const canEdit = computed(() => !readOnly.value && loaded.value);
// { code, field: 'strName'|'lngPrice', value } 또는 { code, field: 'group', main, sub }
const editing = ref(null);
const isEditing = (r, field) =>
  !!editing.value && editing.value.code === String(r.lngCode) && editing.value.field === field;
// 고른 대분류의 소분류만
const editSubOptions = computed(() =>
  editing.value?.field === "group"
    ? subGroups.value.filter((g) => String(g.sublngMajor) === String(editing.value.main))
    : []
);
const onEditMainChange = () => {
  editing.value.sub = editSubOptions.value.length > 0 ? String(editSubOptions.value[0].GroupCd) : "";
};
const saving = ref(false);
const editInputRef = ref(null);
const setEditInput = (el) => {
  editInputRef.value = el || null;
};
const startEdit = async (r, field) => {
  if (!canEdit.value || saving.value) return;
  if (field === "group") {
    editing.value = {
      code: String(r.lngCode),
      field,
      main: String(r.lngMainGroup ?? ""),
      sub: String(r.lngSubGroup ?? ""),
    };
    return;
  }
  editing.value = {
    code: String(r.lngCode),
    field,
    value: field === "lngPrice" ? String(Number(r.lngPrice) || 0) : String(r.strName || ""),
  };
  await nextTick();
  editInputRef.value?.focus();
};
const cancelEdit = () => {
  if (!saving.value) editing.value = null;
};
const onEditInput = () => {
  if (editing.value?.field === "lngPrice") {
    editing.value.value = String(editing.value.value).replace(/[^0-9]/g, "");
  }
};
const saveEdit = async (r) => {
  const ed = editing.value;
  if (!ed || saving.value || !canEdit.value) return;
  let label;
  let fromText;
  let toText;
  let changes;
  if (ed.field === "group") {
    // 분류: 대분류·소분류를 함께 바꾼다
    if (!ed.main || !ed.sub) {
      mobileAlert({ title: "분류를 선택해 주세요", message: "대분류와 소분류를 모두 선택해 주세요." });
      return;
    }
    if (ed.main === String(r.lngMainGroup) && ed.sub === String(r.lngSubGroup)) {
      editing.value = null;
      return;
    }
    label = "분류";
    fromText = `${mainName(r)} > ${subName(r)}`;
    toText = `${mainName({ lngMainGroup: ed.main })} > ${subName({ lngMainGroup: ed.main, lngSubGroup: ed.sub })}`;
    changes = { lngMainGroup: ed.main, lngSubGroup: ed.sub };
  } else {
    const isPrice = ed.field === "lngPrice";
    const newValue = isPrice ? String(ed.value).replace(/[^0-9]/g, "") : String(ed.value).trim();
    const oldValue = isPrice ? String(Number(r.lngPrice) || 0) : String(r.strName || "");
    if (newValue === "") {
      mobileAlert({ title: isPrice ? "판매가를 입력해 주세요" : "메뉴명을 입력해 주세요" });
      return;
    }
    if (newValue === oldValue) {
      editing.value = null;
      return;
    }
    label = isPrice ? "판매가" : "메뉴명";
    fromText = isPrice ? `${formatPrice(oldValue)}원` : oldValue;
    toText = isPrice ? `${formatPrice(newValue)}원` : newValue;
    changes = { [ed.field]: newValue };
  }
  await confirmAndSave(r, changes, label, fromText, toText);
};

// 사용여부 스위치: 사용(blnInactive 0) ↔ 미사용(1)
const toggleUse = (r) => {
  if (!canEdit.value || saving.value) return;
  const nowUse = String(r.blnInactive) !== "1";
  confirmAndSave(
    r,
    { blnInactive: nowUse ? "1" : "0" },
    "사용여부",
    nowUse ? "사용" : "미사용",
    nowUse ? "미사용" : "사용"
  );
};

// 확인창 → 수정 전 값(로그) → 저장 → 수정 로그 → 목록 다시 조회
const confirmAndSave = async (r, changes, label, fromText, toText) => {
  const ok = await mobileConfirm({
    title: `${label} 수정`,
    message: `'${r.strName}' 메뉴의 ${label}을(를) 바꿀까요?`,
    from: fromText,
    to: toText,
    confirmText: "저장",
  });
  if (!ok) return;
  saving.value = true;
  const code = String(r.lngCode);
  try {
    // 수정 전 값(로그용). 못 받으면 빈 값으로 두고 저장은 진행한다
    let beforeJson = "";
    try {
      const snap = await getMenuSnapshot(groupCd.value, menuStoreCd.value, code);
      beforeJson = snap?.data?.RESULT_CD === "00" ? snap.data.MENU_JSON || "" : "";
    } catch (error) {
      beforeJson = "";
    }
    await saveMenuRow(groupCd.value, menuStoreCd.value, { ...r, ...changes });
    try {
      await writeMenuChangeLog(groupCd.value, menuStoreCd.value, "UPDATE", code, beforeJson, `모바일 ${label} 수정`);
    } catch (error) {
      // 로그 기록 실패는 저장 결과에 영향 없음
    }
    editing.value = null;
    await loadMenus();
    openCode.value = code;
    mobileToast(`${label}을(를) ${toText}(으)로 바꿨습니다.`);
  } catch (error) {
    mobileAlert({ title: "저장하지 못했습니다", message: error?.message || "잠시 후 다시 시도해 주세요.", tone: "error" });
  } finally {
    saving.value = false;
  }
};

const loadMenus = async () => {
  if (!groupCd.value || menuStoreCd.value === "") {
    rows.value = [];
    return;
  }
  loading.value = true;
  try {
    const [res, res2] = await Promise.all([
      getMenuCodeEnroll(groupCd.value, menuStoreCd.value),
      getMenuList(groupCd.value, menuStoreCd.value),
    ]);
    rows.value = normalizeMenuListSoldOutYn(res?.data?.MENULIST || []).filter(
      (r) => String(r.lngCode ?? "") !== ""
    );
    mainGroups.value = res2?.data?.menuGroup || [];
    subGroups.value = res2?.data?.submenuGroup || [];
    optionGroups.value = res?.data?.OPTIONGROUP || [];
    loaded.value = true;
  } catch (error) {
    rows.value = [];
    loaded.value = false;
  } finally {
    loading.value = false;
  }
};

const onStoreChange = () => {
  try {
    localStorage.setItem(PICKED_STORE_KEY, `${groupCd.value}|${pickedStoreCd.value}`);
  } catch (error) {
    // 저장소를 못 쓰면 다음에 다시 고른다
  }
  openCode.value = "";
  highlightCode.value = "";
  loaded.value = false;
  // 매장이 바뀌면 AI 대화는 새로 시작한다 (웹도 다른 매장으로 조회하면 대화를 새로 시작)
  aiOpen.value = false;
  aiMounted.value = false;
  loadMenus();
};

/* ---------- AI 메뉴관리 ---------- */
const aiMounted = ref(false);
const aiOpen = ref(false);
let aiLastSavedCode = "";
const openAi = () => {
  if (!canAi.value || !loaded.value) return;
  aiMounted.value = true;
  aiOpen.value = true;
};
// AI로 등록·수정하면 목록을 다시 불러와 AI 조회에도 바로 반영한다 (대화창은 그대로)
const onAiSaved = async (code) => {
  aiLastSavedCode = String(code);
  await loadMenus();
};
// 목록 카드 펼치기: 검색·분류 조건을 풀고 그 메뉴를 펼쳐 화면 가운데로
const revealMenu = async (code, isNew) => {
  keyword.value = "";
  selectedMain.value = "";
  highlightCode.value = isNew ? code : highlightCode.value;
  openCode.value = code;
  showMore.value = false;
  editing.value = null;
  const index = filteredRows.value.findIndex((r) => String(r.lngCode) === code);
  if (index >= pageSize.value) pageSize.value = index + 1;
  await nextTick();
  itemRefs.get(code)?.scrollIntoView({ behavior: "smooth", block: "center" });
};
// AI 조회 결과에서 메뉴를 누르면 대화창을 닫고 목록에서 그 메뉴를 펼친다 (다시 열면 대화가 이어짐)
const onAiFocusMenu = (code) => {
  aiOpen.value = false;
  revealMenu(String(code), false);
};
// AI 대화창을 닫을 때 방금 등록·수정한 메뉴가 있으면 펼쳐 보여 준다
watch(aiOpen, (v) => {
  if (v || !aiLastSavedCode) return;
  const code = aiLastSavedCode;
  aiLastSavedCode = "";
  revealMenu(code, true);
});

const openQuick = () => {
  if (!canQuick.value || !loaded.value) return;
  quickOpen.value = true;
};
const lastRegistered = ref("");
const onRegistered = (code) => {
  lastRegistered.value = String(code);
};
// 닫으면 목록을 다시 불러오고, 방금 등록한 메뉴를 강조하고 펼친다
const closeQuick = async () => {
  quickOpen.value = false;
  if (!lastRegistered.value) return;
  const code = lastRegistered.value;
  lastRegistered.value = "";
  keyword.value = "";
  selectedMain.value = "";
  await loadMenus();
  highlightCode.value = code;
  openCode.value = code;
  showMore.value = false;
  const index = filteredRows.value.findIndex((r) => String(r.lngCode) === code);
  if (index >= pageSize.value) pageSize.value = index + 1;
  await nextTick();
  itemRefs.get(code)?.scrollIntoView({ behavior: "smooth", block: "center" });
};

/* ---------- 휴대폰 뒤로가기: 대화창만 닫고 메뉴 관리 화면에 남는다 ---------- */
// 대화창은 화면 위에 띄운 창이라 그대로면 뒤로가기가 메뉴 관리 화면 자체를 떠난다(대시보드로 나감).
// 대화창을 열 때 주소에 ?chat=quick|ai 를 붙여 방문 기록을 하나 쌓고, 뒤로가기로 그 표시가 빠지면 대화창을 닫는다.
// 닫기 버튼 등으로 닫으면 쌓아 둔 기록을 되돌려(router.back) 다음 뒤로가기는 원래대로 동작하게 한다
const openChat = computed(() => (quickOpen.value ? "quick" : aiOpen.value ? "ai" : ""));
// 주소 변경은 차례대로 처리한다 (열자마자 닫히는 경우에도 push 가 끝난 뒤 back 하도록)
let chatNav = Promise.resolve();
const waitChatQueryChange = () =>
  new Promise((resolve) => {
    const stop = watch(
      () => route.query.chat,
      () => {
        stop();
        resolve();
      }
    );
    setTimeout(() => {
      stop();
      resolve();
    }, 800);
  });
watch(openChat, () => {
  chatNav = chatNav.then(async () => {
    const now = openChat.value;
    const inUrl = String(route.query.chat || "");
    if (now && inUrl !== now) {
      await router.push({ query: { ...route.query, chat: now } });
    } else if (!now && inUrl) {
      const done = waitChatQueryChange();
      router.back();
      await done;
    }
  });
});
watch(
  () => route.query.chat,
  (v) => {
    if (v) return;
    if (quickOpen.value) closeQuick();
    if (aiOpen.value) aiOpen.value = false;
  }
);
// 대화창이 열린 주소로 새로 들어온 경우(새로고침 등)는 표시를 지운다
onMounted(() => {
  if (route.query.chat) {
    const query = { ...route.query };
    delete query.chat;
    router.replace({ query });
  }
});

/* ---------- 맨 위로 ---------- */
// 모바일 화면은 레이아웃 안쪽 영역이 스크롤되므로, 실제로 스크롤된 영역을 기억해 두고 그 영역을 맨 위로 올린다
let scrollEl = null;
const onAnyScroll = (e) => {
  const el = e.target === document ? document.scrollingElement : e.target;
  if (!el || typeof el.scrollTop !== "number") return;
  // 대화창 안 스크롤은 무시
  if (el.closest && el.closest(".mst003-chat-popup, .mq-sheet, .md-sheet")) return;
  scrollEl = el;
};
const scrollToTop = () => {
  if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
  window.scrollTo({ top: 0, behavior: "smooth" });
};
onMounted(() => document.addEventListener("scroll", onAnyScroll, true));
onBeforeUnmount(() => document.removeEventListener("scroll", onAnyScroll, true));

onMounted(async () => {
  store.state.loading2 = false;
  store.state.mobileSelectProgName = "메뉴 관리";
  const access = await loadMenuAccess(store.state.StoreToken);
  if (!access.user || !access.menu) {
    accessState.value = "denied";
    return;
  }
  user.value = access.user;
  accessMenu.value = access.menu;
  // 매장을 고를 필요가 없으면 매장 목록(메뉴키 배치용)을 기다리지 않고 메뉴 목록부터 바로 보여 준다
  if (!needsStorePick.value) {
    accessState.value = "ok";
    loadStoreList(access.user).then((list) => {
      stores.value = list;
    });
    await loadMenus();
    return;
  }
  // 본사 계정 + 매장별 메뉴: 마지막에 고른 매장을 다시 고른다
  stores.value = await loadStoreList(access.user);
  try {
    const saved = String(localStorage.getItem(PICKED_STORE_KEY) || "");
    const [g, s] = saved.split("|");
    if (g === groupCd.value && stores.value.some((x) => x.code === s)) pickedStoreCd.value = s;
  } catch (error) {
    // 저장된 매장이 없으면 고르게 한다
  }
  accessState.value = "ok";
  await loadMenus();
});
</script>

<style scoped>
.mm {
  min-height: 100%;
  padding: 4.2rem 0.75rem 5.5rem;
  background: #f8fafc;
}

.mm-card {
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
}

.mm-empty {
  padding: 2.5rem 1rem;
  text-align: center;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #94a3b8;
}

.mm-top {
  padding: 0.85rem;
}

.mm-top-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.mm-top-label {
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
}

.mm-top-store {
  min-width: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  word-break: keep-all;
}

.mm-top-store {
  flex: 1;
}

.mm-home {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.3rem;
  height: 2.3rem;
  margin-left: auto;
  border: 1px solid #dbeafe;
  border-radius: 0.75rem;
  background: #eff6ff;
  color: #2563eb;
}

.mm-home svg {
  width: 1.2rem;
  height: 1.2rem;
}

.mm-home:active {
  transform: scale(0.94);
}

.mm-select {
  flex: 1;
  min-width: 0;
  height: 2.4rem;
  padding: 0 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.6rem;
  background: #fff;
  font-size: 1rem;
  color: #0f172a;
}

.mm-note {
  margin-top: 0.6rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.6rem;
  background: #f1f5f9;
  font-size: 0.7rem;
  line-height: 1.45;
  color: #475569;
}

/* 초간단 메뉴등록 · AI 메뉴관리 버튼: 둘이면 반반, 하나면 한 줄 전체 */
.mm-tools {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.45rem;
  margin-top: 0.75rem;
}

.mm-tools.is-single {
  grid-template-columns: minmax(0, 1fr);
}

.mm-tool {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  padding: 0.65rem 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.85rem;
  text-align: left;
}

.mm-tool.is-quick {
  border-color: #fed7aa;
  background: linear-gradient(135deg, #fff7ed, #fffbeb);
}

.mm-tool.is-ai {
  border-color: #c7d2fe;
  background: linear-gradient(135deg, #eef2ff, #eff6ff);
}

.mm-tool:disabled {
  opacity: 0.5;
}

.mm-tool:active {
  transform: scale(0.98);
}

.mm-tool-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.75rem;
  color: #fff;
}

.is-quick .mm-tool-icon {
  background: linear-gradient(135deg, #fbbf24, #f97316);
  box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
}

.is-ai .mm-tool-icon {
  background: linear-gradient(135deg, #818cf8, #4f46e5);
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
}

.mm-tool-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.mm-tool-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mm-tool-title {
  font-size: 0.8rem;
  font-weight: 800;
  word-break: keep-all;
}

.is-quick .mm-tool-title {
  color: #9a3412;
}

.is-ai .mm-tool-title {
  color: #3730a3;
}

.mm-tool-sub {
  margin-top: 0.1rem;
  font-size: 0.62rem;
  line-height: 1.3;
  color: #64748b;
  word-break: keep-all;
}

.mm-search {
  position: relative;
  margin-top: 0.65rem;
}

.mm-search-icon {
  position: absolute;
  top: 50%;
  left: 0.8rem;
  width: 1.1rem;
  height: 1.1rem;
  color: #94a3b8;
  transform: translateY(-50%);
}

.mm-search input {
  width: 100%;
  height: 2.6rem;
  padding: 0 0.85rem 0 2.4rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  font-size: 1rem;
  outline: none;
}

.mm-search input:focus {
  border-color: #3b82f6;
}

.mm-chips {
  display: flex;
  gap: 0.4rem;
  margin: 0.6rem -0.75rem 0;
  padding: 0 0.75rem 0.15rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.mm-chips::-webkit-scrollbar {
  display: none;
}

.mm-chip {
  flex-shrink: 0;
  padding: 0.35rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

.mm-chip.is-on {
  border-color: #0f172a;
  background: #0f172a;
  color: #fff;
}

.mm-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.65rem;
}

.mm-item {
  overflow: hidden;
  transition: border-color 0.15s ease;
}

.mm-item.is-open {
  border-color: #93c5fd;
}

.mm-item.is-new {
  border-color: #fb923c;
  box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.25);
}

.mm-item-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 0.8rem;
  text-align: left;
}

.mm-item-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.mm-item-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.mm-item-meta {
  margin-top: 0.15rem;
  font-size: 0.66rem;
  color: #94a3b8;
}

.mm-item-side {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.mm-item-price {
  font-size: 0.82rem;
  font-weight: 800;
  color: #3b82f6;
}

.mm-badges {
  display: flex;
  gap: 0.2rem;
}

.mm-badge {
  padding: 0.05rem 0.35rem;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 700;
}

.mm-badge.is-off {
  background: #f1f5f9;
  color: #64748b;
}

.mm-badge.is-sold {
  background: #fee2e2;
  color: #dc2626;
}

.mm-badge.is-new {
  background: #ffedd5;
  color: #c2410c;
}

.mm-item-arrow {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  color: #94a3b8;
  transition: transform 0.15s ease;
}

.mm-item.is-open .mm-item-arrow {
  transform: rotate(180deg);
}

.mm-detail {
  padding: 0.2rem 0.8rem 0.75rem;
  border-top: 1px dashed #e2e8f0;
}

.mm-field {
  display: flex;
  gap: 0.6rem;
  padding: 0.38rem 0;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.74rem;
}

.mm-field-label {
  flex-shrink: 0;
  width: 5.5rem;
  color: #94a3b8;
}

.mm-field-value {
  min-width: 0;
  font-weight: 600;
  color: #1e293b;
  overflow-wrap: anywhere;
}

.mm-field {
  align-items: center;
}

.mm-field .mm-field-value {
  flex: 1;
}

.mm-edit-open {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 0.2rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #eff6ff;
  font-size: 0.66rem;
  font-weight: 700;
  color: #2563eb;
}

.mm-edit-open svg {
  width: 0.8rem;
  height: 0.8rem;
}

.mm-edit-open:disabled {
  opacity: 0.5;
}

.mm-edit {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 0.35rem;
  min-width: 0;
}

.mm-edit input {
  flex: 1 1 8rem;
  min-width: 0;
  height: 2.2rem;
  padding: 0 0.6rem;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
}

.mm-switch {
  position: relative;
  flex-shrink: 0;
  width: 2.6rem;
  height: 1.5rem;
  border-radius: 999px;
  background: #cbd5e1;
  transition: background 0.15s ease;
}

.mm-switch.is-on {
  background: #22c55e;
}

.mm-switch:disabled {
  opacity: 0.55;
}

.mm-switch-knob {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
  transition: transform 0.15s ease;
}

.mm-switch.is-on .mm-switch-knob {
  transform: translateX(1.1rem);
}

.mm-edit-group {
  flex-direction: column;
}

.mm-edit-select {
  width: 100%;
  height: 2.2rem;
  padding: 0 0.5rem;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  background: #fff;
  font-size: 1rem;
  color: #0f172a;
}

.mm-edit-group .mm-edit-actions {
  justify-content: flex-end;
}

.mm-edit-actions {
  display: flex;
  gap: 0.3rem;
}

.mm-edit-btn {
  height: 2.2rem;
  padding: 0 0.7rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  background: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
}

.mm-edit-btn.is-save {
  border-color: #3b82f6;
  background: #3b82f6;
  color: #fff;
}

.mm-edit-btn:disabled {
  opacity: 0.5;
}

.mm-more {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.4rem;
  border-radius: 0.6rem;
  background: #f8fafc;
  font-size: 0.72rem;
  font-weight: 700;
  color: #475569;
}

.mm-to-top {
  position: fixed;
  right: 1rem;
  bottom: calc(5.2rem + env(safe-area-inset-bottom));
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border: 2px solid #fff;
  border-radius: 999px;
  background: linear-gradient(135deg, #fb923c, #ea580c);
  box-shadow: 0 6px 16px rgba(234, 88, 12, 0.4);
  color: #fff;
}

.mm-to-top svg {
  width: 1.1rem;
  height: 1.1rem;
}

.mm-to-top:active {
  transform: scale(0.94);
}

.mm-top-fade-enter-active,
.mm-top-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.mm-top-fade-enter-from,
.mm-top-fade-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

.mm-load-more {
  padding: 0.65rem;
  border: 1px dashed #cbd5e1;
  border-radius: 0.85rem;
  background: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
}
</style>
