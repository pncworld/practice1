<template>
  <div class="flex flex-col h-full bg-slate-100">
    <div class="flex items-center justify-center h-full bg-slate-100 pt-20">
      <loading></loading>
      <!-- <div><img class="mr-20 size-4/5" src="../assets/login_visual.png" alt=""></div> -->
      <div class="flex">
        <img
          src="../assets/cashier.png"
          class="hidden sm:block mr-40 w-60 h-auto animate-rise"
          alt="" />
        <img
          src="../assets/swipe.png"
          class="hidden sm:block mr-40 w-60 h-auto animate-fall"
          alt="" />
      </div>
      <div
        class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full border border-gray-500">
        <h1
          class="text-2xl font-bold text-center mb-6 text-blue-600 flex justify-center">
          PNC Office
        </h1>

        <form @submit.prevent="login2">
          <div class="mb-4">
            <label for="username" class="block text-gray-700 font-medium mb-2"
              >아이디</label
            >
            <input
              type="text"
              id="username"
              v-model="username"
              placeholder="아이디를 입력하세요"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="login2" />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-gray-700 font-medium mb-2"
              >비밀번호</label
            >
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keyup.enter="login2" />
          </div>

          <button
            type="submit"
            class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            로그인
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600">{{ message }}</p>
      </div>
    </div>
    <div class="bg-green-700 h-24 rounded-lg">
      <p class="text-white break-normal">
        개인정보취급방침 | 이메일무단수집거부 | 사이트맵 | CONTACT US
        <br />
        (주)피앤시월드 | 사업자등록번호 : 211-86-21837 서울시 송파구 송파대로
        <br />
        167(문정동)문정역 테라타워 B동 1323호 | 1588-7443 | 02)2023-6848
        <br />
        대표자명 : 권종택 | 개인정보관리 책임자 : 서성우 | customer@pncworld.com
        Copyright(c)1997 PnCworld ALL RIGHT RESERVED. admin
      </p>
    </div>
  </div>
</template>

<script setup>
import loading from "@/components/loading.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  alreadyLogined,
  get_store_list,
  get_sys_list,
  getFavoriteList,
  login,
} from "../api/common";

const store = useStore(); // Vuex 스토어 가져오기
const router = useRouter(); // Vue Router 가져오기

const username = ref(""); // 사용자 ID
const password = ref(""); // 사용자 비밀번호
const message = ref(""); // 상태 메시지
const userData = store.state.userData;
store.dispatch("convertLoading", false);
const login2 = async () => {
  store.dispatch("convertLoading", true);
  store.state.selectedCategoryId = null;
  try {
    const response = await login(username.value, password.value);
    console.log(response);
    const loginStatus = response.data.loginSession[0].strUserID;

    if (!isNaN(Number(loginStatus))) {
      store.dispatch("updateUserData", response.data.loginSession[0]);
      store.dispatch("setToken", response.data.loginSession[0].SessionToken);
      console.log(response.data.loginSession[0]);
      message.value = "로그인 성공";
      const readPrograms = async () => {
        const response = await get_sys_list(
          store.state.userData.lngStoreGroup,
          store.state.userData.lngUserAdminID,
          store.state.userData.strLanguage
        );

        const result = response.data.sysMenu;
        console.log(result);
        const mainCategoryData = result.filter(
          (item) => Number(item.strMenuLevel) == 1
        ); // 숫자
        const subCategoryData = result.filter(
          (item) => Number(item.strMenuLevel) == 2
        );
        const minorCategoryData = result.filter(
          (item) => Number(item.strMenuLevel) == 3
        );

        store.dispatch("mainCategory", mainCategoryData);
        store.dispatch("selectCategory", mainCategoryData[0].lngCode);
        store.dispatch("subCategory", subCategoryData);
        store.dispatch("minorCategory", minorCategoryData);
      };
      await readPrograms();
      const readsales = async () => {
        const response = await get_store_list(
          store.state.userData.lngStoreGroup,
          store.state.userData.lngPositionType,
          store.state.userData.blnBrandAdmin == "False" ? 0 : 1,
          store.state.userData.lngPosition,
          store.state.userData.lngJoinType,
          store.state.userData.lngTeamCode,
          store.state.userData.lngSupervisor
        );

        console.log(response);
        const result0 = response.data.storeGroup;
        const result1 = response.data.storeAttr;
        const result2 = response.data.store;
        const result3 = response.data.storeSupervisorTeam;
        const result4 = response.data.storeSupervisor;
        const result5 = response.data.storeArea;

        store.dispatch("StoreGroup", result0);
        store.dispatch("StoreType", result1);
        store.dispatch("StoreCd", result2);
        store.dispatch("StoreTeamCode", result3);
        store.dispatch("StoreSupervisor", result4);
        store.dispatch("StoreAreaCd", result5);
      };
      await readsales();
      const res4 = await getFavoriteList(username.value);
      console.log(res4);
      store.dispatch(
        "setFavoriteList",
        res4.data.List.map((item) => Number(item.lngProgramID))
      );
      router.push("/homepage");
    } else {
      throw new Error("로그인 실패");
    }
  } catch (error) {
    console.error(error);
    message.value = "오류 발생";
  } finally {
    store.dispatch("convertLoading", false);
  }
};

onMounted(async () => {
  store.state.loading = true;
  try {
    const token = store.state.StoreToken;
    const res = await alreadyLogined(token);
    console.log(token);
    console.log(res);
    if (res.data.RESULT == true) {
      store.dispatch("updateUserData", res.data.List[0]);
      store.dispatch("setToken", res.data.List[0].SessionToken);

      const response = await get_sys_list(
        res.data.List[0].lngStoreGroup,
        res.data.List[0].lngUserAdminID,
        res.data.List[0].strLanguage
      );

      const result = response.data.sysMenu;
      console.log(result);
      const mainCategoryData = result.filter(
        (item) => Number(item.strMenuLevel) == 1
      ); // 숫자
      const subCategoryData = result.filter(
        (item) => Number(item.strMenuLevel) == 2
      );
      const minorCategoryData = result.filter(
        (item) => Number(item.strMenuLevel) == 3
      );

      store.dispatch("mainCategory", mainCategoryData);
      store.dispatch("selectCategory", mainCategoryData[0].lngCode);
      store.dispatch("subCategory", subCategoryData);
      store.dispatch("minorCategory", minorCategoryData);

      const response2 = await get_store_list(
        res.data.List[0].lngStoreGroup,
        res.data.List[0].lngPositionType,
        res.data.List[0].blnBrandAdmin == "False" ? 0 : 1,
        res.data.List[0].lngPosition,
        res.data.List[0].lngJoinType,
        res.data.List[0].lngTeamCode,
        res.data.List[0].lngSupervisor
      );

      const result0 = response2.data.storeGroup;
      const result1 = response2.data.storeAttr;
      const result2 = response2.data.store;
      const result3 = response2.data.storeSupervisorTeam;
      const result4 = response2.data.storeSupervisor;
      const result5 = response2.data.storeArea;

      store.dispatch("StoreGroup", result0);
      store.dispatch("StoreType", result1);
      store.dispatch("StoreCd", result2);
      store.dispatch("StoreTeamCode", result3);
      store.dispatch("StoreSupervisor", result4);
      store.dispatch("StoreAreaCd", result5);

      console.log(res.data.List[0]);
      const res4 = await getFavoriteList(res.data.List[0].loginID);
      store.dispatch(
        "setFavoriteList",
        res4.data.List.map((item) => Number(item.lngProgramID))
      );
      router.push("/homepage");
      return;
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
  }

  store.state.inActiveBackGround = false;
  console.log(localStorage.getItem("saveID"));
  if (localStorage.getItem("saveID") === "true") {
    console.log(localStorage.getItem("username"));
    saveID.value = true;
    username.value = localStorage.getItem("username");
  }
  store.state.loading2 = false;
});
</script>

<style>
@keyframes fall {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes rise {
  0% {
    transform: translateY(100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fall {
  animation: fall 1s ease-out forwards;
}

.animate-rise {
  animation: rise 1s ease-out forwards;
}
</style>
