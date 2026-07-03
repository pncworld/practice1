/*--############################################################################
# Filename : SYS49_016INS.vue                                                  
# Description : 시스템관리 > 사용자 관리 > 사용자 비밀번호변경                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="flex items-start justify-center min-h-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <div class="w-full max-w-md">

      <!-- 카드 -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

        <!-- 상단 헤더 배너 -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 flex items-center gap-4">
          <div class="bg-white/20 rounded-full p-2.5 shrink-0">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-white">비밀번호 변경</h1>
            <p class="text-blue-100 text-base">계정 보안을 위해 주기적으로 변경해 주세요</p>
          </div>
        </div>

        <!-- 안내 문구 -->
        <div class="px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p class="text-sm text-blue-600">
            (주)피앤시월드에서는 고객님의 개인정보 보호와 안전한 서비스 이용을 위해 항상 노력하고 있습니다.
          </p>
        </div>

        <!-- 비밀번호 규칙 -->
        <div class="px-6 py-4 border-b border-gray-100">
          <p class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2.5">비밀번호 규칙</p>
          <ul class="space-y-1.5">
            <li v-for="rule in passwordRules" :key="rule.text"
              class="flex items-center gap-2 text-base transition-colors"
              :class="rule.met ? 'text-green-600' : 'text-gray-500'">
              <svg class="w-4 h-4 shrink-0 transition-colors" fill="currentColor" viewBox="0 0 20 20"
                :class="rule.met ? 'text-green-500' : 'text-gray-300'">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd" />
              </svg>
              {{ rule.text }}
            </li>
          </ul>
        </div>

        <!-- 입력 폼 -->
        <div class="px-6 py-5 space-y-4">
          <!-- 브라우저 autofill 흡수용 더미 필드 (화면에 표시되지 않음) -->
          <input type="text" autocomplete="username" aria-hidden="true"
            style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;tab-index:-1" />

          <!-- 현재 비밀번호 -->
          <div>
            <label class="block text-base font-medium text-gray-700 mb-1.5">현재 비밀번호</label>
            <div class="relative">
              <input
                :type="showCurrent ? 'text' : 'password'"
                v-model="currentPassWord"
                autocomplete="off"
                placeholder="현재 비밀번호를 입력하세요"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                :class="currentPassWord ? 'pr-10' : ''" />
              <button v-if="currentPassWord" type="button" tabindex="-1" @click="showCurrent = !showCurrent"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="!showCurrent" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 새 비밀번호 -->
          <div>
            <label class="block text-base font-medium text-gray-700 mb-1.5">새 비밀번호</label>
            <div class="relative">
              <input
                :type="showNew ? 'text' : 'password'"
                v-model="newPassWord"
                autocomplete="new-password"
                placeholder="새 비밀번호를 입력하세요"
                class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition" />
              <button type="button" tabindex="-1" @click="showNew = !showNew"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="!showNew" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <!-- 강도 바 -->
            <div v-if="newPassWord" class="mt-2 flex items-center gap-2">
              <div class="flex gap-1 flex-1">
                <div v-for="i in 4" :key="i"
                  class="h-1.5 flex-1 rounded-full transition-colors"
                  :class="i <= passwordStrength ? strengthBarColor : 'bg-gray-200'"></div>
              </div>
              <span class="text-sm" :class="strengthTextColor">{{ strengthLabel }}</span>
            </div>
          </div>

          <!-- 새 비밀번호 확인 -->
          <div>
            <label class="block text-base font-medium text-gray-700 mb-1.5">새 비밀번호 확인</label>
            <div class="relative">
              <input
                :type="showConfirm ? 'text' : 'password'"
                v-model="newPassWordVali"
                autocomplete="new-password"
                placeholder="새 비밀번호를 다시 입력하세요"
                class="w-full border rounded-lg px-4 py-2.5 text-base pr-10 focus:outline-none focus:ring-2 focus:border-transparent transition"
                :class="newPassWordVali && newPassWord !== newPassWordVali
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'" />
              <button type="button" tabindex="-1" @click="showConfirm = !showConfirm"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg v-if="!showConfirm" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="newPassWordVali && newPassWord !== newPassWordVali"
              class="mt-1 text-sm text-red-500 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
              비밀번호가 일치하지 않습니다.
            </p>
          </div>

          <!-- 저장 버튼 -->
          <button
            @click="saveButton"
            class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition-colors mt-1 flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            비밀번호 변경
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { savePassWord, validatePassWord } from "@/api/system";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";

const currentPassWord = ref("");
const newPassWord = ref("");
const newPassWordVali = ref("");

const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const store = useStore();
const userSequence = ref("");
const userlngGroup = ref("");

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  userSequence.value = store.state.userData.lngSequence;
  userlngGroup.value = store.state.userData.lngStoreGroup;
});

// 자주 쓰이는 취약 비밀번호 목록
const COMMON_PASSWORDS = [
  "12345678", "123456789", "1234567890", "password", "password1",
  "qwerty123", "qwerty1", "iloveyou", "admin123", "letmein",
  "welcome1", "monkey123", "dragon123", "master123", "abc12345",
  "111111111", "1q2w3e4r", "1q2w3e4r5t", "pass1234", "p@ssw0rd",
];

// 연속된 문자/숫자 4자리 이상 체크 (KISA 기준)
function hasSequentialChars(pw) {
  const lower = pw.toLowerCase();
  for (let i = 0; i < lower.length - 3; i++) {
    const a = lower.charCodeAt(i);
    const b = lower.charCodeAt(i + 1);
    const c = lower.charCodeAt(i + 2);
    const d = lower.charCodeAt(i + 3);
    if (b === a + 1 && c === b + 1 && d === c + 1) return true; // 오름차순
    if (b === a - 1 && c === b - 1 && d === c - 1) return true; // 내림차순
  }
  return false;
}

// 동일 문자 4회 이상 연속 체크 (KISA 기준)
function hasRepeatedChars(pw) {
  return /(.)\1{3,}/.test(pw);
}

// 특수문자 포함 여부
function hasSpecialChar(pw) {
  return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw);
}

// 비밀번호 규칙 실시간 체크 (KISA + NIST SP 800-63B 기반)
const passwordRules = computed(() => {
  const pw = newPassWord.value;
  const loginId = store.state.userData?.loginID ?? "";
  return [
    {
      text: "8자리 이상 20자리 이하",
      met: pw.length >= 8 && pw.length <= 20,
    },
    {
      text: "영문자·숫자·특수문자 중 2종류 이상 조합",
      met:
        [/[a-zA-Z]/.test(pw), /[0-9]/.test(pw), hasSpecialChar(pw)].filter(Boolean).length >= 2,
    },
    {
      text: "아이디와 동일한 비밀번호 사용 불가",
      met: pw.length > 0 && loginId.length > 0 && !pw.toLowerCase().includes(loginId.toLowerCase()),
    },
    {
      text: "동일 문자 4회 이상 연속 사용 불가 (예: aaaa)",
      met: pw.length > 0 && !hasRepeatedChars(pw),
    },
    {
      text: "연속된 문자·숫자 4자리 이상 불가 (예: abcd, 1234)",
      met: pw.length > 0 && !hasSequentialChars(pw),
    },
    {
      text: "자주 사용되는 비밀번호 사용 불가",
      met: pw.length > 0 && !COMMON_PASSWORDS.includes(pw.toLowerCase()),
    },
  ];
});

// 비밀번호 강도 (0~4): 8자 미만이면 무조건 취약(1)
const passwordStrength = computed(() => {
  const pw = newPassWord.value;
  if (!pw) return 0;
  if (pw.length < 8) return 1;
  const met = passwordRules.value.filter((r) => r.met).length;
  if (met <= 2) return 1;
  if (met <= 3) return 2;
  if (met <= 4) return 3;
  return 4;
});

const strengthBarColor = computed(() => {
  if (passwordStrength.value <= 1) return "bg-red-400";
  if (passwordStrength.value <= 2) return "bg-yellow-400";
  if (passwordStrength.value <= 3) return "bg-blue-400";
  return "bg-green-500";
});

const strengthTextColor = computed(() => {
  if (passwordStrength.value <= 1) return "text-red-500";
  if (passwordStrength.value <= 2) return "text-yellow-500";
  if (passwordStrength.value <= 3) return "text-blue-500";
  return "text-green-600";
});

const strengthLabel = computed(() => {
  if (passwordStrength.value <= 1) return "취약";
  if (passwordStrength.value <= 2) return "보통";
  if (passwordStrength.value <= 3) return "양호";
  return "강함";
});

const saveButton = () => {
  if (newPassWord.value !== newPassWordVali.value) {
    Swal.fire({
      icon: "error",
      title: "신규 비밀번호 오류",
      text: "신규 비밀번호와 확인할 비밀번호가 일치하지 않습니다.",
    });
    return;
  }
  const failedRules = passwordRules.value.filter((r) => !r.met);
  if (failedRules.length > 0) {
    Swal.fire({
      icon: "error",
      title: "비밀번호 규칙 미충족",
      html: failedRules.map((r) => `• ${r.text}`).join("<br>"),
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
        const res = await validatePassWord(userSequence.value, currentPassWord.value);
        if (res.data.List[0].value == "1") {
          const res2 = await savePassWord(
            userlngGroup.value,
            userSequence.value,
            newPassWord.value
          );
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
            title: "비밀번호 오류",
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
