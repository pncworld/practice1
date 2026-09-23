/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="side">
    <div class="side-logo">
      <img src="../../../assets/pnc_mobile_logo.png" alt="PNC Office" />
    </div>
    <div class="side-store">{{ StoreName }}</div>
    <button type="button" class="side-link" @click="showHome">
      <font-awesome-icon icon="house" />
      <span>홈</span>
    </button>
    <button type="button" class="side-link" @click="showNotice">
      <font-awesome-icon :icon="['far', 'bell']" />
      <span>공지사항</span>
    </button>

    <div class="side-scroll">
      <div v-for="(i, index) in menuItems" :key="index" class="side-group">
        <button type="button" class="side-link" @click="toggleSubMenu(index)">
          <font-awesome-icon
            :icon="['far', 'calendar-days']"
            v-if="i.mainCode == 20" />
          <font-awesome-icon
            :icon="['fas', 'cart-shopping']"
            v-if="i.mainCode == 30" />
          <img
            v-if="i.mainCode == 50"
            src="../../../assets/tablet-screen-button-solid.svg"
            alt=""
            class="side-img" />
          <span>{{ i.title }}</span>
          <font-awesome-icon
            class="side-chevron"
            :icon="['fas', i.isOpen ? 'chevron-up' : 'chevron-down']" />
        </button>
        <div v-if="i.isOpen" class="side-sub">
          <button
            v-for="(subItem, subIndex) in i.children"
            :key="subIndex"
            type="button"
            class="side-sub-btn"
            @click="moveProgram(subItem.code, subItem.name)">
            {{ subItem.name }}
          </button>
        </div>
      </div>
    </div>

    <div class="side-foot">
      <div class="side-foot-btn">
        <font-awesome-icon :icon="['fas', 'gear']" />
        설정
      </div>
      <button type="button" class="side-foot-btn side-foot-out" @click="logout">
        <font-awesome-icon :icon="['fas', 'arrow-right-from-bracket']" />
        로그아웃
      </button>
    </div>
  </div>
</template>

<script setup>
import { insertMobilePageLog } from "@/customFunc/customFunc";
import router from "@/router";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
const menuItems = ref([
  //   {
  //     title: "공지사항",
  //     isOpen: false,
  //     children: [
  //       { code: 10001, name: "공지사항 목록" },
  //       { code: 10002, name: "공지사항 조회" },
  //     ],
  //   },
  {
    title: "매출조회",
    mainCode: 20,
    isOpen: false,
    children: [
      { code: 20001, name: "정산내역" },
      { code: 20002, name: "매출세부내역" },
      { code: 20003, name: "메뉴그룹별 내역" },
      { code: 20004, name: "메뉴별 매출내역" },
      { code: 20005, name: "신용카드별 매출내역" },
      { code: 20006, name: "시간대별 매출내역" },
      { code: 20007, name: "매장별 매출현황" },
      { code: 20008, name: "실시간 매출현황" },
      { code: 20009, name: "일자별 매출내역2" },
      { code: 20010, name: "매출취소현황" },
      { code: 20011, name: "개점/마감정보" },
      { code: 20012, name: "부가세신고참고자료" },
      { code: 20013, name: "좌석정보현황" },
      { code: 20014, name: "코너별 매출현황" },
      { code: 20015, name: "코너별 메뉴 매출현황" },
    ],
  },
  {
    title: "발주관리",
    mainCode: 30,
    isOpen: false,
    children: [
      { code: 30001, name: "주문조회" },
      { code: 30002, name: "주문등록" },
      { code: 30003, name: "매입입고조회" },
      { code: 30004, name: "매입확정" },
      { code: 30005, name: "반품조회" },
      { code: 30006, name: "반품등록" },
      { code: 30011, name: "청구 등록" },
      { code: 30500, name: "주문수정" },
      { code: 30501, name: "반품삭제" },
    ],
  },
  {
    title: "TablePos",
    mainCode: 50,
    isOpen: false,
    children: [{ code: 50001, name: "카테고리관리" }],
  },
]);

const menuItems2 = ref([
  //   {
  //     title: "공지사항",
  //     isOpen: false,
  //     children: [
  //       { code: 10001, name: "공지사항 목록" },
  //       { code: 10002, name: "공지사항 조회" },
  //     ],
  //   },
  {
    title: "매출조회",
    mainCode: 20,
    isOpen: false,
    children: [
      { code: 20001, name: "정산내역" },
      { code: 20002, name: "매출세부내역" },
      { code: 20003, name: "메뉴그룹별 내역" },
      { code: 20004, name: "메뉴별 매출내역" },
      { code: 20005, name: "신용카드별 매출내역" },
      { code: 20006, name: "시간대별 매출내역" },
      { code: 20007, name: "매장별 매출현황" },
      { code: 20008, name: "실시간 매출현황" },
      { code: 20009, name: "일자별 매출내역2" },
      { code: 20010, name: "매출취소현황" },
      { code: 20011, name: "개점/마감정보" },
      { code: 20012, name: "부가세신고참고자료" },
      { code: 20013, name: "좌석정보현황" },
      { code: 20014, name: "코너별 매출현황" },
      { code: 20015, name: "코너별 메뉴 매출현황" },
    ],
  },
  {
    title: "발주관리",
    mainCode: 30,
    isOpen: false,
    children: [
      { code: 30001, name: "주문조회" },
      { code: 30002, name: "주문등록" },
      { code: 30003, name: "매입입고조회" },
      { code: 30004, name: "매입확정" },
      { code: 30005, name: "반품조회" },
      { code: 30006, name: "반품등록" },
      { code: 30011, name: "청구 등록" },
      { code: 30500, name: "주문수정" },
      { code: 30501, name: "반품삭제" },
    ],
  },
  {
    title: "TablePos",
    mainCode: 50,
    isOpen: false,
    children: [{ code: 50001, name: "카테고리관리" }],
  },
]);
const store = useStore();
const StoreName = ref("");
const toggleHeight = ref(false);
const toggleSubMenu = (e) => {
  menuItems.value[e].isOpen = !menuItems.value[e].isOpen;
  toggleHeight.value = !toggleHeight.value;
};

const groupMenu = ref([]);

const emit = defineEmits(["MenuState", "SalesMenus", "OrderMenus", "showNotice"]);
watch(
  () => store.state.mobileCategory,
  () => {
    //comsole.log(store.state.mobileSelectProgName);
    menuItems.value = menuItems2.value.filter(
      (item) =>
        store.state.mobileFunction.some(
          (func) => func.CATEGORY_ID == item.mainCode.toString()
        ) // mobileFunction 배열 내에 CATEGORY_ID item.mainCode와 일치하는 항목이 있는지 확인
    );
    //comsole.log(menuItems.value);
    menuItems.value = menuItems.value.map((item) => ({
      ...item,
      children: store.state.mobileCategory
        .filter((item2) => item.mainCode == Number(item2.CATEGORY_ID)) // mainCode와 CATEGORY_ID가 같은 것만 남김
        .map((item2) => ({
          code: item2.PROGID,
          name: item2.PROGNM,
        })),
    }));

    //comsole.log(menuItems.value);
    const salesItem = menuItems.value.find((item) => item.mainCode == 20);
    const orderItem = menuItems.value.find((item) => item.mainCode == 30);
    if (salesItem) {
      emit("SalesMenus", salesItem.children);
    } else if (menuItems.value[0]) {
      emit("SalesMenus", menuItems.value[0].children);
    }
    if (orderItem) {
      emit("OrderMenus", orderItem.children);
    }
  },
  { immediate: true } // 새로고침할때 반응해주게 하는 설정
);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(() => {
  StoreName.value = store.state.userData.USER_NM;
});

const route = useRoute();
watch(route, () => {
  if (route.path != "/") {
    StoreName.value = store.state.userData.USER_NM;
  }
});

const moveProgram = async (e1, e2) => {
  //comsole.log(store.state.userData);
  const checkSession = await insertMobilePageLog({
    strUrl: e2,
    lngProgramID: e1,
  });

  //comsole.log(e1, e2);
  //store.state.mobileSelectProgName = e2;
  store.dispatch("saveMobileProgName", e2);
  router.push(`/m/${e1}`);

  emit("MenuState", false);
  store.state.inActiveBackGround = false;
};

const showHome = () => {
  router.push(`/m/homepage`);
  store.state.mobileSelectProgName = "";
  emit("MenuState", false);
  store.state.inActiveBackGround = false;
};
const showNotice = () => {
  store.state.mobileSelectProgName = "공지사항";
  emit("MenuState", false);
  store.state.inActiveBackGround = false;
  emit("showNotice", true);
};

const logout = () => {
  store.commit("clearSession");
  //localStorage.clear();
  // sessionStorage.clear();
  window.location.href = "/";
};
</script>

<style scoped>
.side {
  position: fixed;
  top: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  width: 17rem;
  height: 100%;
  overflow: hidden;
  background: #fff;
  box-shadow: 8px 0 24px rgba(15, 23, 42, 0.12);
}

.side-logo {
  display: flex;
  justify-content: center;
  padding: 1.25rem 1rem 0.75rem;
}

.side-logo img {
  max-width: 9rem;
}

.side-store {
  margin: 0 0.85rem 0.5rem;
  padding: 0.85rem 0.5rem;
  border-radius: 1rem;
  background: #3b82f6;
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  text-align: center;
}

.side-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 4.5rem;
}

.side-group {
  border-top: 1px solid #f1f5f9;
}

.side-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.95rem 1.1rem;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
}

.side-link svg,
.side-img {
  width: 1.15rem;
  color: #3b82f6;
}

.side-chevron {
  margin-left: auto;
  width: 0.7rem !important;
  color: #94a3b8 !important;
}

.side-sub {
  padding: 0 0.75rem 0.6rem 2.4rem;
}

.side-sub-btn {
  display: block;
  width: 100%;
  padding: 0.55rem 0.7rem;
  border-radius: 0.7rem;
  color: #475569;
  font-size: 0.9rem;
  text-align: left;
}

.side-sub-btn:active {
  background: #eff6ff;
  color: #2563eb;
}

.side-foot {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  border-top: 1px solid #eef2f6;
  background: #fff;
}

.side-foot-btn {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: 3.25rem;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
}

.side-foot-out {
  color: #ef4444;
}
</style>
