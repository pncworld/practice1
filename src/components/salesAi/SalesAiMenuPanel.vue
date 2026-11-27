<!--
  PnC# AI 도우미 창 안의 메뉴 관리 칸 (2026-11-26)
  - 메뉴 등록·조회·수정·다국어·메뉴키·시간대 메뉴 판매·분류 안내는 모바일 AI 메뉴관리(MobileAiMenu.vue, 웹 MST01_003INS AI 와 같은 로직)를
    embedded 로 그대로 쓴다. 다른 화면으로 옮기지 않는다
  - 메뉴 목록·분류·권한·매장 결정은 모바일 메뉴 화면(menuManage.vue)과 같은 방법으로 불러온다
  - 도우미 창에서 받은 질문(question)을 첫 문장으로 넘겨 처음부터 다시 묻지 않는다
-->
<template>
  <div ref="rootRef" class="sam">
    <div v-if="state === 'loading'" class="sam-note">메뉴 정보를 불러오는 중입니다…</div>
    <div v-else-if="state === 'denied'" class="sam-note sam-note--warn">
      {{ deniedText }}
      <button type="button" class="sam-close" @click="emit('close')">닫기</button>
    </div>
    <template v-else>
      <!-- 본사 계정 + 매장별 메뉴 브랜드: 메뉴를 관리할 매장을 먼저 고른다 -->
      <div v-if="needsStorePick" class="sam-store">
        <label class="sam-store-label" for="sam-store-select">메뉴 관리 매장</label>
        <select id="sam-store-select" v-model="pickedStoreCd" class="sam-store-select" @change="onStoreChange">
          <option value="">매장을 선택해 주세요</option>
          <option v-for="s in stores" :key="s.code" :value="s.code">{{ s.name }}</option>
        </select>
      </div>
      <div v-if="needsStorePick && !pickedStoreCd" class="sam-note">
        메뉴를 관리할 매장을 고르면 입력하신 내용으로 바로 이어서 진행합니다.
      </div>
      <div v-else-if="loading" class="sam-note">메뉴 목록을 불러오는 중입니다…</div>
      <MobileAiMenu
        v-else-if="loaded"
        ref="menuRef"
        :key="menuStoreCd"
        :open="true"
        :embedded="true"
        :bare="true"
        :focus-in-list="mobile"
        :initial-text="question"
        :initial-key="questionKey"
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
        :read-only-text="readOnlyText"
        @close="emit('close')"
        @saved="onSaved"
        @menu-state="onMenuState"
        @screen-only="(t) => emit('screen-only', t)"
        @initial-sent="(k) => emit('sent', k)"
        @focus-menu="onFocusMenu" />
    </template>
  </div>
</template>

<script setup>
import { computed, defineEmits, defineExpose, defineProps, onBeforeUnmount, onMounted, ref } from "vue";
import store from "@/store";
import { getMenuCodeEnroll, getMenuList } from "@/api/master";
import { normalizeMenuListSoldOutYn } from "@/customFunc/customFunc";
import MobileAiMenu from "@/views/MOBILE/master/MobileAiMenu.vue";
import {
  isAiEnabledGroup,
  isCommonMenuUser,
  isStoreAccountUser,
  loadMenuAccess,
  loadStoreList,
} from "@/views/MOBILE/master/mobileMenuAccess";

defineProps({
  // 도우미 창에서 받은 질문 (메뉴 관리 칸의 첫 문장)
  question: { type: String, default: "" },
  // 같은 질문을 다시 보내도 새로 처리하도록 바뀌는 값
  questionKey: { type: [String, Number], default: "" },
  // 등록·수정을 막는 이유 (서버 안내: I-FRESH 에서 등록 등). 있으면 조회·매출만
  readOnlyText: { type: String, default: "" },
  // 모바일 통합 AI 화면 안: 메뉴를 누르면 모바일 메뉴 목록으로 간다 (안내 문구용, 2026-11-27)
  mobile: { type: Boolean, default: false },
});
// sent: 첫 문장을 메뉴 관리 도우미에 넘겼다 (questionKey)
// menu-state: 도우미 창 입력창이 쓸 상태 { ready, busy, placeholder, count } (2026-11-27 입력창 하나로)
// screen-only: 메뉴 관리 도우미로 못 하는 요청 (대상 메뉴 표시 문자열) → 도우미 창이 화면 경로·열기 버튼을 붙인다
// focus-menu: 결과에서 메뉴를 누름 → 메뉴코드등록 화면에서 그 메뉴 보기 { code, name, storeCd, storeNm } (2026-11-27)
// snapshot: 칸이 닫힐 때 그때까지의 대화 화면(html). 도우미 창이 대화 기록에 남긴다 (2026-11-27)
const emit = defineEmits(["close", "saved", "sent", "menu-state", "screen-only", "focus-menu", "snapshot"]);
const rootRef = ref(null);
onBeforeUnmount(() => {
  const log = rootRef.value?.querySelector(".mst003-chat-log");
  if (!log) return;
  // 답을 기다리는 표시(…작성 중)는 남기지 않는다
  const copy = log.cloneNode(true);
  copy.querySelectorAll(".mst003-chat-avatar--typing").forEach((el) => el.closest(".mst003-chat-row")?.remove());
  if (copy.querySelector(".mst003-chat-row")) emit("snapshot", copy.outerHTML);
});

const menuRef = ref(null);
const onFocusMenu = (code) => {
  const row = rows.value.find((r) => String(r.lngCode) === String(code));
  emit("focus-menu", {
    code: String(code),
    name: row?.strName || "",
    storeCd: menuStoreCd.value,
    storeNm: menuStoreName.value,
  });
};
const onMenuState = (s) => {
  emit("menu-state", { ready: true, ...s });
};
// 메뉴 관리 도우미가 아직 준비되지 않았으면(매장 선택 전·불러오는 중) 보내지 않고 false
const sendText = async (text) => {
  if (!menuRef.value) return false;
  return menuRef.value.sendText(text);
};
// 선택지 단계에서 n번째(0부터) 선택지를 누른 것과 같게 (음성 '2번', 2026-11-27)
const pickChoice = async (index) => {
  if (!menuRef.value || !menuRef.value.pickChoice) return false;
  return menuRef.value.pickChoice(index);
};
defineExpose({ sendText, pickChoice });

const state = ref("loading"); // loading / denied / ok
const deniedText = ref("");
const user = ref(null);
const stores = ref([]);
const pickedStoreCd = ref("");
const PICKED_STORE_KEY = "salesAiMenu.pickedStore";

const groupCd = computed(() => String(user.value?.lngStoreGroup ?? ""));
const isCommonMenu = computed(() => isCommonMenuUser(user.value));
const isStoreAccount = computed(() => isStoreAccountUser(user.value));
const userPosition = computed(() => String(user.value?.lngPosition ?? ""));
// 본사 계정 + 매장별 메뉴 브랜드만 매장을 고른다 (모바일 menuManage.vue 와 같음)
const needsStorePick = computed(() => !!user.value && !isCommonMenu.value && !isStoreAccount.value);
// 메뉴를 조회·저장하는 매장코드: 공통 메뉴 0 / 매장 계정 본인 매장 / 본사 계정 고른 매장
const menuStoreCd = computed(() => {
  const u = user.value;
  if (!u) return "";
  if (isCommonMenu.value) return "0";
  if (isStoreAccount.value) return String(u.lngPosition ?? "");
  return pickedStoreCd.value;
});
const menuStoreName = computed(() => {
  const u = user.value;
  if (!u) return "";
  if (isCommonMenu.value) return `${u.strStoreGroupName || ""} 공통 메뉴`.trim();
  const found = stores.value.find((s) => s.code === menuStoreCd.value);
  return found?.name || u.strStoreName || "";
});

const rows = ref([]);
const mainGroups = ref([]);
const subGroups = ref([]);
const optionGroups = ref([]);
const loading = ref(false);
const loaded = ref(false);

const loadMenus = async () => {
  if (!groupCd.value || menuStoreCd.value === "") {
    rows.value = [];
    loaded.value = false;
    return;
  }
  loading.value = true;
  try {
    const [res, res2] = await Promise.all([
      getMenuCodeEnroll(groupCd.value, menuStoreCd.value),
      getMenuList(groupCd.value, menuStoreCd.value),
    ]);
    rows.value = normalizeMenuListSoldOutYn(res?.data?.MENULIST || []).filter((r) => String(r.lngCode ?? "") !== "");
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
  loaded.value = false;
  loadMenus();
};

// 저장(등록·수정) 뒤 메뉴 목록을 다시 받아 다음 질문에 바로 반영한다
// (목록을 다시 받는 동안 대화 칸을 내리지 않도록 loaded 는 그대로 둔다)
const onSaved = async (code) => {
  emit("saved", code);
  try {
    const res = await getMenuCodeEnroll(groupCd.value, menuStoreCd.value);
    rows.value = normalizeMenuListSoldOutYn(res?.data?.MENULIST || []).filter((r) => String(r.lngCode ?? "") !== "");
  } catch (error) {
    // 다시 받지 못하면 이전 목록으로 계속한다
  }
};

// 첫 문장을 보냈다는 알림(sent)은 메뉴 관리 도우미가 실제로 받아 처리했을 때(initial-sent)만 보낸다 (2026-11-27)
//  예전에는 화면에 나타나면 바로 보냈다고 처리해, 도우미가 받지 못한 문장이 지워져 두 번 입력해야 했다

onMounted(async () => {
  const access = await loadMenuAccess(store.state.StoreToken);
  if (!access.user || !access.menu) {
    deniedText.value = "메뉴코드등록 메뉴 권한이 없어 메뉴 관리를 할 수 없습니다. 관리자에게 권한을 요청해 주세요.";
    state.value = "denied";
    return;
  }
  if (!isAiEnabledGroup(access.user)) {
    deniedText.value = "이 브랜드는 AI 메뉴 관리를 사용하지 않습니다.";
    state.value = "denied";
    return;
  }
  user.value = access.user;
  if (!needsStorePick.value) {
    state.value = "ok";
    loadStoreList(access.user).then((list) => {
      stores.value = list;
    });
    await loadMenus();
    return;
  }
  stores.value = await loadStoreList(access.user);
  try {
    const saved = String(localStorage.getItem(PICKED_STORE_KEY) || "");
    const [g, s] = saved.split("|");
    if (g === groupCd.value && stores.value.some((x) => x.code === s)) pickedStoreCd.value = s;
  } catch (error) {
    // 저장된 매장이 없으면 고르게 한다
  }
  state.value = "ok";
  await loadMenus();
});
</script>

<style scoped>
.sam {
  margin: 0.5rem 0;
}

.sam-note {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd6fe;
  border-radius: 0.6rem;
  background: #f5f3ff;
  color: #4c1d95;
  font-size: 0.85rem;
}

.sam-note--warn {
  border-color: #fed7aa;
  background: #fff7ed;
  color: #9a3412;
}

.sam-store {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.sam-store-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

.sam-store-select {
  flex: 1;
  min-width: 0;
  height: 2rem;
  padding: 0 0.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.85rem;
}

.sam-close {
  margin-left: auto;
  height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.8rem;
  color: #334155;
  white-space: nowrap;
}
</style>
