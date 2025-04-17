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
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const currentPassWord = ref("");
const newPassWord = ref("");
const newPassWordVali = ref("");

const store = useStore();
const userSequence = ref("");
const userlngGroup = ref("");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  userSequence.value = store.state.userData.lngSequence;
  userlngGroup.value = store.state.userData.lngStoreGroup;
  console.log(userSequence.value);
});
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
        console.log(res);
        if (res.data.List[0].value == "1") {
          const res2 = await savePassWord(
            userlngGroup.value,
            userSequence.value,
            newPassWord.value
          );
          console.log(res2);
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
