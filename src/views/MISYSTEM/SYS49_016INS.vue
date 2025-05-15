/*--############################################################################
# Filename : MST01_033INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <img
    src="../../assets/resetPassword.jpg"
    alt=""
    class="opacity-30 w-[87%] h-[88%] absolute" />
  <div
    class="text-base text-left w-[45%] grid grid-cols-1 grid-rows-10 items-start justify-end relative opacity-100 mt-10 ml-[30%]">
    <div class="text-base font-bold opacity-100">
      (주)피앤시월드에서는 고객님의 개인정보 보호와 안전한 서비스 이용을 위해
      항상 노력하고 있습니다.
    </div>

    <div class="font-semibold bg-blue-400">1.비밀번호를 변경하여 주세요</div>
    <div class="text-base font-bold">
      고객님께서는 오랫동안 비밀번호를 변경하지 않고 계십니다.
    </div>
    <div class="text-base font-bold">
      고객님의 소중한 정보를 보호하기 위하여 비밀번호를 변경하여 주시기
      바랍니다.
    </div>
    <div class="font-semibold bg-blue-400">2.비밀번호 변경시 유의해 주세요</div>
    <div class="text-base font-bold">
      비밀번호는 6자리 이상 20자리 이하로 입력하십시오
    </div>
    <div class="text-base font-bold">
      비밀번호는 반드시 알파벳과 숫자를 하나 이상 포함해야 합니다.
    </div>
    <div class="text-base font-bold">
      [ABCDEF]처럼 연속된 문자는 사용할 수가 없습니다
    </div>
    <div class="text-base font-bold">공백은 입력할 수 없습니다</div>
    <div class="text-base font-bold">
      비밀번호는 같은 문자만 연속해서 입력할 수 없습니다
    </div>

    <div class="flex flex-col justify-start mt-10">
      <div
        class="grid grid-cols-2 grid-rows-3 w-[50%] items-center justify-center">
        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100">
          비밀번호
        </div>
        <input
          type="password"
          v-model="currentPassWord"
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center" />

        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100">
          신규비밀번호
        </div>
        <input
          type="password"
          v-model="newPassWord"
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center" />

        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100">
          신규비밀번호 확인
        </div>
        <input
          type="password"
          v-model="newPassWordVali"
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center" />
      </div>
      <div class="flex justify-start ml-36 mt-5">
        <button class="button save" @click="saveButton">저장</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { savePassWord, validatePassWord } from "@/api/system";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const currentPassWord = ref("");
const newPassWord = ref("");
const newPassWordVali = ref("");

const store = useStore();
const userSequence = ref("");
const userlngGroup = ref("");
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  userSequence.value = store.state.userData.lngSequence;
  userlngGroup.value = store.state.userData.lngStoreGroup;
  //comsole.log(userSequence.value);
});
/**
 *  저장 버튼 함수
 */

const saveButton = (e) => {
  if (newPassWord.value != newPassWordVali.value) {
    Swal.fire({
      icon: "error",
      title: "신규 비밀번호 오류",
      text: "신규 비밀번호와 확인할 비밀번호가 일치하지 않습니다.",
    });
    return;
  }
  if (newPassWord.value.length <= 5 || newPassWord.value.length >= 21) {
    Swal.fire({
      icon: "error",
      title: "비밀번호 오류",
      text: "비밀번호는 6자리 이상 20자리 이하로 입력하세요.",
    });
    return;
  }
  Swal.fire({
    title: "변경",
    text: "비밀번호를 변경하시겠습니까?",
    showCancelButton: true,
    confirmButtonText: "변경",
    cancelButtonText: "취소",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        const res = await validatePassWord(
          userSequence.value,
          currentPassWord.value
        );
        //comsole.log(res);
        if (res.data.List[0].value == "1") {
          const res2 = await savePassWord(
            userlngGroup.value,
            userSequence.value,
            newPassWord.value
          );
          //comsole.log(res2);
          if (res2.data.RESULT_CD == "00") {
            Swal.fire({
              icon: "success",
              title: "변경 성공",
              text: "비밀번호가 성공적으로 변경되었습니다.",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: " 비밀번호 오류",
            text: "기존 비밀번호가 일치하지 않습니다.",
          });
          return;
        }
      } catch (error) {
      } finally {
        store.state.loading = false;
        newPassWordVali.value = "";
        newPassWord.value = "";
        currentPassWord.value = "";
      }
    }
  });
};
</script>
