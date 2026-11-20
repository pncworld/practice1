<template>
  <!-- 기존 모양 (newDesign 미지정 화면은 모두 이 모양 그대로) -->
  <div
    v-if="isVisible && !newDesign"
    class="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 justify-center items-center">
    <div class="bg-white w-[30%] h-[80%] shadow-lg rounded-lg flex flex-col">
      <header class="popup-header flex justify-between pl-12 pt-5">
        <h1 class="font-bold text-2xl">{{ naming2 }} 복사</h1>
        <button
          class="border border-gray-300 button primary rounded-md mr-12"
          @click="dupliStore">
          복사
        </button>
      </header>
      <main class="popup-body flex-grow h-[80vh]">
        <div class="flex justify-start font-bold text-xl ml-12">기준매장</div>
        <div
          class="grid grid-rows-2 grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[25vw] ml-12 h-[8vh] rounded-lg">
          <div
            class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">
            기준매장
          </div>
          <div
            class="border border-gray-400 rounded-tr-md flex justify-center items-center">
            <input
              type="text"
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md bg-gray-200"
              :value="'[' + storeCd + ']' + storeNm"
              disabled />
          </div>
          <div
            class="border-[1px] border-gray-400 rounded-bl-md flex justify-center items-center">
            {{ naming }}
          </div>
          <div
            class="w-full border border-gray-400 rounded-br-md flex justify-center items-center">
            <input
              type="text"
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md bg-gray-200"
              :value="posNo"
              disabled />
          </div>
        </div>
        <div class="flex justify-center mt-4">
          <img src="../assets/masterCopy-ArrowDown.png" alt="" />
        </div>
        <div class="flex justify-between font-bold text-xl ml-12">
          <div>대상 매장 선택</div>
          <div>
            <button class="whitebutton mr-12" @click="showStoreList">
              조회
            </button>
          </div>
        </div>
        <div
          class="grid grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[25vw] h-[5vh] ml-12 mt-5 rounded-lg">
          <div
            class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">
            매장코드/명
          </div>
          <div
            class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center">
            <input
              type="text"
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md"
              @input="handleKeyup" />
          </div>
        </div>
        <div class="w-[25vw] h-[35vh] ml-12 flex justify-center">
          <realgrid
            :progname="progname"
            :progid="progid"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="true"
            @checkedRowData="selcetedrowData"></realgrid>
        </div>
      </main>
      <footer class="flex justify-end p-5 -mt-9">
        <div class="border border-gray-300 rounded-md w-[4vw] h-[5vh] mr-7">
          <button @click="close" class="w-full h-full">닫기</button>
        </div>
      </footer>
    </div>
  </div>
  <!-- 새 모양 (newDesign 을 켠 화면만) — 기능·함수는 위와 같은 것을 그대로 사용 -->
  <Teleport to="body">
    <div v-if="isVisible && newDesign" class="dp-mask">
      <div class="dp-pop" role="dialog" aria-modal="true">
        <div class="dp-head">
          <h2 class="dp-title">{{ naming2 }} 복사</h2>
          <p class="dp-desc">기준 매장의 내용을 아래에서 체크한 매장에 복사합니다.</p>
        </div>
        <div class="dp-body">
          <div class="dp-section-title">기준 매장</div>
          <div class="dp-fields">
            <span class="dp-label">기준매장</span>
            <input
              type="text"
              class="dp-input"
              :value="'[' + storeCd + ']' + storeNm"
              disabled />
            <span class="dp-label">{{ naming }}</span>
            <input type="text" class="dp-input" :value="posNo" disabled />
          </div>
          <div class="dp-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </div>
          <div class="dp-section-title">대상 매장 선택</div>
          <div class="dp-search">
            <span class="dp-label">매장코드/명</span>
            <input
              type="text"
              class="dp-input"
              placeholder="입력 후 [조회]"
              @input="handleKeyup"
              @keyup.enter="showStoreList" />
            <button type="button" class="pnc-sub-btn" @click="showStoreList">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="2" /><path d="M16 16l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
              조회
            </button>
          </div>
          <div class="dp-grid">
            <realgrid
              :progname="progname"
              :progid="progid"
              :rowData="rowData"
              :showGrid="showGrid"
              :showCheckBar="true"
              @checkedRowData="selcetedrowData"></realgrid>
          </div>
        </div>
        <div class="dp-foot">
          <span class="dp-hint">대상 매장을 체크한 뒤 [복사]를 누르세요.</span>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--rose" @click="dupliStore">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.9" /><path d="M5 15V6a1 1 0 0 1 1-1h9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" /></svg>
            복사
          </button>
          <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="close">
            <svg class="pnc-sub-btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
            닫기
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import style from "../customStyle/style.css";
import realgrid from "./realgrid.vue";
import * as api from "@/api/common";
import * as api2 from "@/api/master";
import { useStore } from "vuex";
import Swal from "sweetalert2";
const {
  isVisible,
  storeCd,
  storeNm,
  posNo,
  areaCd,
  progname,
  progid,
  dupliapiname,
  poskiosk,
  naming,
  naming2,
  summary,
  blnBrandAdmin,
  newDesign,
} = defineProps({
  isVisible: { type: Boolean, default: false }, // 팝업 가시성 관리
  storeCd: { type: String, default: "" },
  storeNm: { type: String, default: "" },
  posNo: { type: Number, default: "" },
  areaCd: { type: Number, default: "" },
  progname: { type: String },
  progid: { type: Number },
  dupliapiname: { type: String },
  poskiosk: { type: String },
  naming: { type: String },
  naming2: { type: String, default: "메뉴키" },
  summary: {
    type: String,
    default:
      "선택하신 POS의 메뉴배치정보 및 화면정보가 모두 삭제 후 복사됩니다. 계속 진행하시겠습니까?",
  },
  blnBrandAdmin: { type: Boolean, default: false }, // 브랜드 관리자 여부 (조회 파라미터)
  // 새 팝업 모양 사용 여부 (기본 false = 기존 모양). 켜는 화면: 메뉴키 설정 kiosk·테이블포스·(#)
  newDesign: { type: Boolean, default: false },
});
const store = useStore(); // vuex store
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const searchWord = ref("");
const checked = ref(false);
const emit = defineEmits(["close"]);

function close() {
  rowData.value = [];
  emit("close");
  checked.value = false;
}
const rowData = ref([]);
const showGrid = ref(false);
const showStoreList = async () => {
  let res;
  
  const blnBrandAdminValue = blnBrandAdmin ? 1 : 0;

  try {
    if (poskiosk === "getStoreAndPosList3") {
      res = await api[poskiosk](
        groupCd.value,
        storeCd,
        areaCd,
        posNo,
        blnBrandAdminValue
      );
    } else {
      res = await api[poskiosk](
        groupCd.value,
        storeCd,
        posNo,
        blnBrandAdminValue
      );
    }

    // console.log(res);

  } catch (error) {
    //comsole.log(error);
  } finally {
    showGrid.value = true;
    if (searchWord.value == "") {
      rowData.value = res.data.storepos;
    } else {
      rowData.value = res.data.storepos.filter(
        (item) =>
          item.strName.includes(searchWord.value) ||
          item.lngStoreCode.toString().includes(searchWord.value)
      );
    }

    // console.log(rowData.value);

  }
};
const selectedRows = ref([]);
const selcetedrowData = (newData) => {
  if (newData.length > 0) {
    checked.value = true;
  } else {
    checked.value = false;
  }
  selectedRows.value = newData;
  //comsole.log(selectedRows.value);
};

const handleKeyup = (e) => {
  searchWord.value = e.target.value;
};
const handleKeyup2 = (e) => {};

const dupliStore = async () => {
  let groupCd2 = [];
  let storeCd2 = [];
  let areaCd2 = [];
  let posNo2 = [];

  for (var i = 0; i < selectedRows.value.length; i++) {
    groupCd2.push(groupCd.value);
    storeCd2.push(selectedRows.value[i].lngStoreCode);
    areaCd2.push(selectedRows.value[i].lngAreaCode);
    posNo2.push(selectedRows.value[i].intPosNo);
  }

  try {
    //comsole.log(checked.value);
    if (checked.value == false) {
      Swal.fire({
        title: "알림",
        text: "복사할 대상이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "복사",
        text: `${summary}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "복사",
        cancelButtonText: "취소",
      }).then(async (result) => {
        if (result.isConfirmed) {
          store.state.loading = true;

          const res3 = await api2[dupliapiname](
            groupCd.value,
            storeCd,
            areaCd,
            posNo,
            groupCd2.join(","),
            storeCd2.join(","),
            areaCd2.join(","),
            posNo2.join(",")
          );

          // console.log(res3);

          if (res3.data.RESULT_CD == "00") {
            store.state.loading = false;
            Swal.fire({
              title: "복사 성공",
              text: "복사가 완료되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            }).then((result) => {
              if (result.isConfirmed) {
                close();
              }
            });
          } else {
            store.state.loading = false;
            Swal.fire({
              title: "복사실패",
              text: "복사가 실패되었습니다.",
              icon: "warning",
              confirmButtonText: "확인",
            });
            return;
          }
        } else {
          store.state.loading = false;
        }
      });
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.popup-header {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.popup-body {
  margin-bottom: 1rem;
}
.popup-footer {
  text-align: right;
}

/* ===== 새 모양 (newDesign) — body 로 Teleport, 덮개 z-index 10050 ===== */
.dp-mask {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.45);
}
.dp-pop {
  display: flex;
  flex-direction: column;
  width: 36rem;
  max-width: 100%;
  height: min(46rem, calc(100vh - 2rem));
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
  overflow: hidden;
}
.dp-head {
  padding: 1.125rem 1.5rem 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}
.dp-head::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 1.125rem;
  margin-right: 0.5rem;
  border-radius: 2px;
  background: #2563eb;
  vertical-align: -2px;
}
.dp-title {
  display: inline;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}
.dp-desc {
  margin-top: 0.375rem;
  font-size: 0.8125rem;
  color: #64748b;
}
.dp-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
}
.dp-section-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #334155;
}
.dp-fields,
.dp-search {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.375rem 0.75rem;
}
.dp-search {
  grid-template-columns: 6.5rem minmax(0, 1fr) auto;
}
.dp-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}
.dp-input {
  height: 2rem;
  padding: 0 0.625rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
}
.dp-input:disabled {
  background: #f1f5f9;
  color: #334155;
}
.dp-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.dp-arrow {
  display: flex;
  justify-content: center;
  color: #94a3b8;
}
.dp-arrow svg {
  width: 1.5rem;
  height: 1.5rem;
}
.dp-grid {
  flex: 1 1 auto;
  min-height: 200px;
}
.dp-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}
.dp-hint {
  margin-right: auto;
  font-size: 0.8125rem;
  color: #64748b;
}
</style>
