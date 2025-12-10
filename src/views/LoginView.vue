/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="flex flex-col h-full bg-slate-100">
    <div class="flex items-center justify-center h-full bg-slate-100">
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
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-gray-700 font-medium mb-2"
              >비밀번호</label
            >
            <div class="relative w-full">
              <input
                :type="passwordVisible ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="비밀번호를 입력하세요"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button
                type="button"
                class="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                @click="showPassword">
                {{ passwordVisible ? "숨기기" : "보기" }}
              </button>
            </div>
          </div>

          <div>
            <label for="saveid"
              ><input
                type="checkbox"
                id="saveid"
                @change="setSaveId"
                v-model="checkid" />아이디 저장</label
            >
          </div>

          <button
            type="submit"
            class="w-full py-2 mt-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            로그인
          </button>
        </form>

        <p class="mt-4 text-center text-gray-600">{{ message }}</p>
      </div>
    </div>
    <!-- <div class="bg-green-700 h-24 rounded-lg">
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
    </div> -->
  </div>
</template>

<script setup>
import loading from "@/components/loading.vue";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import {
  alreadyLogined,
  get_store_list,
  get_sys_list,
  getFavoriteList,
  login,
} from "../api/common";
import { insertLoginLog } from "@/customFunc/customFunc";

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

    const loginStatus = response.data.loginSession[0].strUserID;

    if (loginStatus != undefined) {
      store.dispatch("updateUserData", response.data.loginSession[0]);
      store.dispatch("setToken", response.data.loginSession[0].SessionToken);
      //comsole.log(response.data.loginSession[0]);
      //console.trace();
      const res = await insertLoginLog(
        username.value,
        password.value,
        response.data.loginSession[0].lngStoreGroup,
        response.data.loginSession[0].lngPosition
      );

      message.value = "로그인 성공";

      const readPrograms = async () => {
        const response2 = await get_sys_list(
          response.data.loginSession[0].lngStoreGroup,
          response.data.loginSession[0].lngUserAdminID,
          response.data.loginSession[0].strLanguage
        );

        const result = response2.data.sysMenu;

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

        //comsole.log(response);
        const result0 = response.data.storeGroup;
        const result1 = response.data.storeAttr;
        const result2 = response.data.store;
        const result3 = response.data.storeSupervisorTeam;
        const result4 = response.data.storeSupervisor;
        const result5 = response.data.storeArea;
        const result6 = response.data.storeSubLease;
        // //console.log(result6);
        store.dispatch("StoreGroup", result0);
        store.dispatch("StoreType", result1);
        store.dispatch("StoreCd", result2);
        store.dispatch("StoreTeamCode", result3);
        store.dispatch("StoreSupervisor", result4);
        store.dispatch("StoreAreaCd", result5);
        store.dispatch("StoreSubLease", result6);
      };
      await readsales();
      const res4 = await getFavoriteList(username.value);
      //comsole.log(res4);
      store.dispatch(
        "setFavoriteList",
        res4.data.List.map((item) => Number(item.lngProgramID))
      );

      //console.log(checkid.value);
      if (checkid.value == true) {
        localStorage.setItem("saveId", username.value);
      } else {
        localStorage.setItem("saveId", "");
      }

      await store.dispatch("convertLoading", false);
      await router.push("/homepage");

      return;
    } else {
      throw new Error("로그인 실패");
    }
  } catch (error) {
    console.log(error);
    message.value = "오류 발생";
  } finally {
    store.dispatch("convertLoading", false);
  }
};

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  store.state.loading = true;
  try {
    const token = store.state.StoreToken;
    const res = await alreadyLogined(token);
    //comsole.log(token);
    //comsole.log(res);
    if (res.data.RESULT == true) {
      store.dispatch("updateUserData", res.data.List[0]);
      store.dispatch("setToken", res.data.List[0].SessionToken);

      const response = await get_sys_list(
        res.data.List[0].lngStoreGroup,
        res.data.List[0].lngUserAdminID,
        res.data.List[0].strLanguage
      );

      const result = response.data.sysMenu;
      //comsole.log(result);
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
      const result6 = response2.data.storeSubLease;
      store.dispatch("StoreGroup", result0);
      store.dispatch("StoreType", result1);
      store.dispatch("StoreCd", result2);
      store.dispatch("StoreTeamCode", result3);
      store.dispatch("StoreSupervisor", result4);
      store.dispatch("StoreAreaCd", result5);
      store.dispatch("StoreSubLease", result6);

      //comsole.log(res.data.List[0]);
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
  //comsole.log(localStorage.getItem("saveID"));
  if (localStorage.getItem("saveId") == "") {
    //comsole.log(localStorage.getItem("username"));
    username.value = "";
    checkid.value = false;
  } else {
    username.value = localStorage.getItem("saveId");
    //console.log(username.value);
    checkid.value = true;
  }
  store.state.loading2 = false;
});

const passwordVisible = ref(false);

const showPassword = () => {
  passwordVisible.value = !passwordVisible.value;
};

const checkid = ref(false);
const setSaveId = (e) => {
  if (e.target.checked == true) {
    localStorage.setItem("saveId", username.value);
  } else {
    localStorage.setItem("saveId", "");
  }
};
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

@keyframes rise-bounce {
  0% {
    opacity: 0;
    transform: translateX(-300px) translateY(-300px);
  }
  20% {
    transform: translateX(-100px) translateY(-70px); /* 위로 살짝 튐 */
  }
  30% {
    transform: translateX(-50px) translateY(50px); /* 다시 살짝 내려옴 */
  }
  33% {
    transform: translateX(-40px) translateY(40px); /* 다시 살짝 내려옴 */
  }
  36% {
    transform: translateX(-30px) translateY(-40px); /* 다시 살짝 내려옴 */
  }
  39% {
    transform: translateX(-25px) translateY(30px); /* 다시 살짝 내려옴 */
  }
  43% {
    transform: translateX(-20px) translateY(-30px); /* 다시 살짝 내려옴 */
  }
  46% {
    transform: translateX(-15px) translateY(20px); /* 다시 살짝 내려옴 */
  }
  49% {
    transform: translateX(-10px) translateY(-20px); /* 다시 살짝 내려옴 */
  }
  53% {
    transform: translateX(-5px) translateY(10px); /* 다시 살짝 내려옴 */
  }
  56% {
    transform: translateX(-3px) translateY(-10px); /* 다시 살짝 내려옴 */
  }
  59% {
    transform: translateX(-1px) translateY(5px); /* 다시 살짝 내려옴 */
  }
  63% {
    transform: translateX(0px) translateY(-5px); /* 다시 살짝 내려옴 */
  }
  66% {
    transform: translateX(0px) translateY(1px); /* 다시 살짝 내려옴 */
  }
  69% {
    transform: translateX(0px) translateY(-1px); /* 다시 살짝 내려옴 */
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rise-rebounce {
  0% {
    opacity: 0;
    transform: translateY(500px) translateX(500px) rotate(-50deg);
  }
  60% {
    transform: translateX(-70px) rotate(50deg); /* 위로 살짝 튐 */
  }
  80% {
    transform: translateX(100px) rotate(-50deg); /* 다시 살짝 내려옴 */
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0% {
    transform: translateY(5px);
  }

  33% {
    transform: translateY(-5px);
  }

  66% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(5px);
  }
}

.animate-fall {
  animation: rise-rebounce 2s ease-out forwards;
}

.animate-rise {
  animation: rise-bounce 2s ease-in-out forwards;
}

input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear,
input[type="password"]::-webkit-textfield-decoration-container {
  display: none;
}
</style>
