<template>
  <div class="flex items-center justify-center h-screen bg-slate-100">
    <loading></loading>
    <!-- <div><img class="mr-20 size-4/5" src="../assets/login_visual.png" alt=""></div> -->
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
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
            :type="passwordVisible ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @keyup.enter="login2" />
          <button
            type="button"
            class="absolute right-14 mt-2"
            @click="showPassword">
            {{ passwordVisible ? "숨기기" : "보기" }}
          </button>
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          로그인
        </button>
      </form>
      <div class="flex justify-start items-center space-x-2 mt-3">
        <input
          type="checkbox"
          id="saveId"
          v-model="saveID"
          class="form-checkbox h-6 w-6 text-blue-500 rounded-full" />

        <label for="saveId" class="cursor-pointer text-gray-700"
          >아이디 저장</label
        >
        <div><button @click="showCustomorCenter">| 고객센터</button></div>
      </div>
      <p class="mt-4 text-center text-gray-600">{{ message }}</p>
    </div>
  </div>

  <div
    class="absolute z-50 top-[30%] left-[5%] w-[90%] h-[70%]"
    v-if="showPopUp">
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
      <h1
        class="text-2xl font-bold text-center mb-6 text-blue-600 flex justify-center">
        고객센터
      </h1>
      <div class="text-xl">
        비밀번호 찾기 및 기타 문의사항은 <br />아래 고객센터로 문의해 주시기
        바랍니다.
      </div>

      <div class="text-sm mt-3">
        대표 번호 : 02-1588-7443 <br />대표 메일 : customer@pncworld.com
      </div>
      <div class="text-sm mt-3">연중 무휴 09:00 ~ 21:00</div>
      <div class="flex justify-center items-center space-x-2 mt-3">
        <button
          @click="
            showPopUp = false;
            disableBg();
          ">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMobileProgList, mobileLogin } from "@/api/mobile";
import loading from "@/components/loading.vue";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore(); // Vuex 스토어 가져오기
const router = useRouter(); // Vue Router 가져오기
const passwordVisible = ref(false);

const saveID = ref(false);
const showPassword = () => {
  passwordVisible.value = !passwordVisible.value;
};

const username = ref(""); // 사용자 ID
const password = ref(""); // 사용자 비밀번호
const message = ref(""); // 상태 메시지
const userData = store.state.userData;
store.dispatch("convertLoading", false);
const login2 = async () => {
  store.dispatch("convertLoading", true);

  console.log(saveID.value);
  if (saveID.value) {
    localStorage.setItem("username", username.value);
    localStorage.setItem("saveID", saveID.value.toString()); // boolean 값 그대로 저장
  } else {
    // 체크가 해제되었을 경우 로컬 스토리지에서 제거하는 것이 좋을 수 있습니다.
    localStorage.removeItem("username");
    localStorage.removeItem("saveID");
  }

  store.state.selectedCategoryId = null;
  try {
    const response = await mobileLogin(username.value, password.value);
    console.log(response);

    if (response.data.RESULT_CD == "00") {
      // store.state.userData = response.data.loginSession[0];
      // console.log(store.state.userData);
      store.dispatch("updateUserData", response.data.loginSession[0]);
      store.dispatch("setToken", response.data.loginSession[0].SessionToken);
      console.log(response.data.loginSession[0]);
      message.value = "로그인 성공";
      const readPrograms = async () => {
        const response = await getMobileProgList(
          store.state.userData.GROUP_CD,
          store.state.userData.STORE_CD,
          store.state.userData.USER_NO
        );

        const result = response.data.List.filter(
          (item) => item.USE_YN == "Y"
        ).map((item) => ({
          CATEGORY_ID: item.CATEGORY_ID,
          CATEGORY_NM: item.CATEGORY_NM,
          PROGID: item.PROGRAM_ID,
          PROGNM: item.PROGRAM_NM,
        }));
        console.log(result);

        const result3 = response.data.List3;
        console.log(result3);
        store.state.mobileCategory = [...result];
        //store.dispatch("setmobileCategory", result);
        console.log(store.state.mobileCategory);
        store.dispatch("saveMobileFunction", result3);
      };
      await readPrograms();
      // const readsales = async () => {
      //   const response = await get_store_list(
      //     store.state.userData.lngStoreGroup,
      //     store.state.userData.lngPositionType,
      //     store.state.userData.blnBrandAdmin == "False" ? 0 : 1,
      //     store.state.userData.lngPosition,
      //     store.state.userData.lngJoinType,
      //     store.state.userData.lngTeamCode,
      //     store.state.userData.lngSupervisor
      //   );

      //   console.log(response);
      //   const result0 = response.data.storeGroup;
      //   const result1 = response.data.storeAttr;
      //   const result2 = response.data.store;
      //   const result3 = response.data.storeSupervisorTeam;
      //   const result4 = response.data.storeSupervisor;
      //   const result5 = response.data.storeArea;
      //   const result6 = response.data.SessionToken;
      //   store.dispatch("StoreGroup", result0);
      //   store.dispatch("StoreType", result1);
      //   store.dispatch("StoreCd", result2);
      //   store.dispatch("StoreTeamCode", result3);
      //   store.dispatch("StoreSupervisor", result4);
      //   store.dispatch("StoreAreaCd", result5);
      //   store.dispatch("setToken", result6);
      // };
      // await readsales();

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

onMounted(() => {
  store.state.inActiveBackGround = false;
  console.log(localStorage.getItem("saveID"));
  if (localStorage.getItem("saveID") === "true") {
    console.log(localStorage.getItem("username"));
    saveID.value = true;
    username.value = localStorage.getItem("username");
  }

  if (store.state.userData?.[0]?.[0]?.STATUS_CD === "0000") {
    router.push("/dashboard");
  }
});

const showPopUp = ref(false);
const showCustomorCenter = () => {
  store.state.inActiveBackGround = true;
  showPopUp.value = true;
};

const disableBg = () => {
  store.state.inActiveBackGround = false;
};
</script>

<style>
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 50%;
  border: 2px solid #ccc;
  width: 24px;
  height: 24px;
  background-color: white;
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
}

input[type="checkbox"]:checked {
  background-color: #4a90e2;
  border-color: #4a90e2;
}

input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 6px;
  top: 6px;
  width: 12px;
  height: 12px;
  background-color: white;
  border-radius: 50%;
}
</style>
