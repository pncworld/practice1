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
        <button class="h-full w-full flex justify-start items-center ml-[10%]">
          <font-awesome-icon icon="house" class="size-8" />
          <div class="text-xl mt-1 ml-[16%]">홈</div>
        </button>
      </div>
      <div class="h-full w-full border border-gray-200">
        <button class="h-full w-full flex justify-start items-center ml-[10%]">
          <font-awesome-icon :icon="['far', 'bell']" class="size-8" />
          <div class="text-xl mt-1 ml-[16%]">공지사항</div>
        </button>
      </div>
    </div>
    <ul
      v-for="(i, index) in menuItems"
      class="w-64 bg-white h-[10vh] pr-[18vw] rounded-lg flex justify-start items-center flex-col border-b-gray-200 border border-b-1">
      <li class="h-full w-full">
        <button
          class="h-full w-full flex justify-center items-center"
          @click="toggleSubMenu(index)">
          <font-awesome-icon
            :icon="['far', 'calendar-days']"
            class="size-8"
            v-if="index == 0" />
          <font-awesome-icon
            :icon="['fas', 'truck']"
            class="size-8"
            v-if="index == 1" />
          <div class="text-xl mt-1 ml-10">{{ i.title }}</div>
        </button>

        <ul
          v-if="i.isOpen"
          class="ml-4 mt-2 w-full bg-white p-2 rounded-md transition-all duration-300 overflow-auto">
          <li v-for="(subItem, subIndex) in i.children" :key="subIndex">
            <button
              class="w-full text-lg px-4 py-2 bg-white rounded-md"
              @click="moveProgram(subItem.code, subItem.name)">
              {{ subItem.name }}
            </button>
          </li>
        </ul>
      </li>
    </ul>
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
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
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
      { code: 20009, name: "일자별 매출내역" },
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
      { code: 20009, name: "일자별 매출내역" },
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

const emit = defineEmits(["MenuState", "SalesMenus"]);
watch(
  () => store.state.mobileCategory,
  () => {
    menuItems.value = menuItems2.value.filter(
      (item) =>
        store.state.mobileFunction.some(
          (func) => func.CATEGORY_ID == item.mainCode.toString()
        ) // mobileFunction 배열 내에 CATEGORY_ID item.mainCode와 일치하는 항목이 있는지 확인
    );
    console.log(menuItems.value);
    menuItems.value = menuItems.value.map((item) => ({
      ...item,
      children: store.state.mobileCategory
        .filter((item2) => item.mainCode == Number(item2.CATEGORY_ID)) // mainCode와 CATEGORY_ID가 같은 것만 남김
        .map((item2) => ({
          code: item2.PROGID,
          name: item2.PROGNM,
        })),
    }));

    console.log(menuItems.value);
    if (menuItems.value[0]) {
      emit("SalesMenus", menuItems.value[0].children);
    }
  },
  { immediate: true } // 새로고침할때 반응해주게 하는 설정
);

onMounted(() => {});

const route = useRoute();
watch(route, () => {
  if (route.path != "/") {
    StoreName.value = store.state.userData.USER_NM;
  }
});

const moveProgram = async (e1, e2) => {
  console.log(store.state.userData);
  const checkSession = await insertMobilePageLog({
    strUrl: e2,
    lngProgramID: e1,
  });
  store.state.mobileSelectProgName = e2;
  router.push(`/m/${e1}`);

  emit("MenuState", false);
  store.state.inActiveBackGround = false;
};

const logout = () => {
  store.commit("clearSession");
  //localStorage.clear();
  // sessionStorage.clear();
  window.location.href = "/";
};
</script>

<style lang="scss" scoped></style>
