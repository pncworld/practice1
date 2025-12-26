/*--############################################################################
# Filename : LoginView.vue                                                  
# Description : 로그인 화면(퍼블리싱 버젼)
# Date : 2025-12-19                                                             
# Author : 권지안                     
################################################################################*/
<template>
  <div class="page-login">
    <loading></loading>
    <div class="login-wrap">
      <div class="login-center">
        <div class="login-card">
          <div class="login-inner">
            <!-- Logo -->
            <div class="login-logo">
              <img src="@/assets/images/pncoffice_logo.png" alt="PNC Office">
            </div>

            <!-- Form -->
            <div class="login-form">
              <form @submit.prevent="login2">
                <div class="input-warp">
                  <input
                    type="text"
                    id="username"
                    class="input"
                    v-model="username"
                    placeholder="아이디를 입력해주세요."
                    required
                  />
                  <div class="input-password">
                    <input
                      :type="passwordVisible ? 'text' : 'password'"
                      id="password"
                      class="input js-password"
                      v-model="password"
                      placeholder="비밀번호를 입력해주세요."
                      required
                    />
                    <button
                      type="button"
                      class="btn-eye js-toggle-password"
                      @click="showPassword"
                    ></button>
                  </div>
                </div>

                <label class="chk">
                  <input
                    type="checkbox"
                    id="saveid"
                    @change="setSaveId"
                    v-model="checkid"
                  />
                  <span></span>아이디 저장
                </label>

                <div class="btn-warp">
                  <button type="submit" class="btn btn-login">로그인</button>
                  <button type="button" class="btn btn-order" @click="goToOrder">소모품 발주</button>
                </div>
              </form>
              <br/>
              <p v-if="message" class="message-text" style="text-align: center;">{{ message }}</p>
            </div>
          </div>

          <!-- Info -->
          <div class="login-info">
            <ul class="info-text">
              <li>· 문의 : 1588-7443</li>
              <li>· 메일 : customer@pncworld.com</li>
              <li>· 영업시간 : 연중 무휴 09:00~21:00</li>
            </ul>
            <button class="f15 btn-kakao" @click="goToKakao">
              <img src="@/assets/images/kakao_channel_talk.svg" alt="카카오 채널톡">
              카카오 채널톡 상담
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="login-footer">
        <div class="f15 text">
          본 시스템은 Chrome, Windows Edge 브라우저에 최적화 되어있습니다. <br />
          Internet Explorer 8 이하 버전의 경우 정상 작동하지 않을 수 있습니다.
        </div>
        <div class="f14 copyright">Copyright©1997 PnCworld ALL RIGHT RESERVED.</div>
      </div>
    </div>
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

const goToOrder = () => {
  window.open("https://sopumzip.shop/main/index", "_blank");
};

const goToKakao = () => {
  window.open("https://pf.kakao.com/_Ztrxks", "_blank");
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
