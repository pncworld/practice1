/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="h-screen top-0 fixed w-64 z-[60] bg-white overflow-y-auto overflow-x-hidden">
    <div class="flex justify-center items-center mr-5 mt-[5%]">
      <img src="../../../assets/pnc_mobile_logo.png" alt="" />
    </div>
    <div class="grid grid-rows-3 h-60 border w-full mt-[5%]">
      <div
        class="bg-blue-500 text-white text-2xl flex justify-center items-center h-auto">
        {{ StoreName }}
      </div>
      <div class="h-full w-full border border-gray-200">
        <button
          class="h-full w-full flex justify-start items-center ml-[10%]"
          @click="showHome">
          <font-awesome-icon icon="house" class="size-8" />
          <div class="text-xl mt-1 ml-4">홈</div>
        </button>
      </div>
      <div class="h-full w-full border border-gray-200">
        <button
          class="h-full w-full flex justify-start items-center ml-[10%]"
          @click="showNotice">
          <font-awesome-icon :icon="['far', 'bell']" class="size-8" />
          <div class="text-xl mt-1 ml-4">공지사항</div>
        </button>
      </div>
    </div>
    <div
      class="w-64 bg-white rounded-lg overflow-y-auto mb-14"
      style="max-height: 80vh">
      <ul
        v-for="(i, index) in menuItems"
        :key="index"
        class="border-b-2 border-l-2 border-r-2 border-gray-200">
        <li>
          <button
            class="w-full flex justify-start pl-6 items-center py-4 px-3 h-20"
            @click="toggleSubMenu(index)">
            <font-awesome-icon
              :icon="['far', 'calendar-days']"
              class="size-8"
              v-if="index == 0" />
            <font-awesome-icon
              :icon="['fas', 'truck']"
              class="size-8"
              v-if="index == 1" />
            <div class="text-xl ml-4">{{ i.title }}</div>
          </button>

          <ul
            v-if="i.isOpen"
            class="ml-8 mb-2 bg-white p-2 rounded-md transition-all duration-300">
            <li v-for="(subItem, subIndex) in i.children" :key="subIndex">
              <button
                class="w-full text-lg px-4 py-2 bg-white rounded-md hover:bg-gray-100 flex justify-start text-nowrap"
                @click="moveProgram(subItem.code, subItem.name)">
                {{ subItem.name }}
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="fixed bottom-0 w-64 justify-between flex">
      <div
        class="w-1/2 bg-gray-200 text-gray-600 h-14 flex justify-center items-center">
        <font-awesome-icon :icon="['fas', 'gear']" />설정
      </div>
      <div
        class="w-1/2 bg-gray-200 text-gray-600 h-14 flex justify-center items-center"
        @click="logout">
        <font-awesome-icon
          :icon="['fas', 'arrow-right-from-bracket']" />로그아웃
      </div>
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
      { code: 30500, name: "주문수정" },
      { code: 30501, name: "반품삭제" },
    ],
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
      { code: 30500, name: "주문수정" },
      { code: 30501, name: "반품삭제" },
    ],
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

const emit = defineEmits(["MenuState", "SalesMenus", "showNotice"]);
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
    if (menuItems.value[0]) {
      emit("SalesMenus", menuItems.value[0].children);
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

<style lang="scss" scoped></style>
