<template>
  <!-- 기존 모양 (newDesign 미지정 시 이 모양 그대로) -->
  <div
    v-if="isVisible && !newDesign"
    class="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 justify-center items-center">
    <div class="bg-white w-[30%] h-[80%] shadow-lg rounded-lg flex flex-col">
      <header class="popup-header flex justify-between pl-12 pt-5">
        <h1 class="font-bold text-2xl">결제키 복사</h1>
        <button
          class="border border-gray-300 button primary rounded-md mr-12"
          @click="dupliStore">
          복사
        </button>
      </header>
      <main class="popup-body flex-grow">
        <div class="flex justify-start font-bold text-xl ml-12">기준매장</div>
        <div
          class="grid grid-rows-3 grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[25vw] ml-12 h-[10vh] rounded-lg">
          <div
            class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">
            기준매장
          </div>
          <div
            class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center">
            <input
              type="text"
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md pl-1 bg-gray-200"
              :value="'[' + storeCd + ']' + storeNm"
              disabled />
          </div>
          <div
            class="border-[1px] border-gray-400 rounded-bl-md flex justify-center items-center">
            POS번호
          </div>
          <div
            class="w-full border border-gray-400 rounded-br-md flex justify-center items-center">
            <input
              type="text"
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md pl-1 bg-gray-200"
              :value="posNo"
              disabled />
          </div>
          <div
            class="border-[1px] border-gray-400 rounded-bl-md flex justify-center items-center">
            원본화면
          </div>
          <div
            class="w-full border border-gray-400 rounded-br-md flex justify-center items-center">
            <select
              name=""
              id=""
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md pl-1"
              v-model="selectedScreen">
              <option value="0">전체</option>
              <option :value="i.intScreenNo" v-for="i in screenList">
                [{{ i.intScreenNo }}]{{ i.strScreenName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-center mt-3">
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
          class="grid grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[25vw] ml-12 h-[4vh] mt-3 rounded-lg">
          <div
            class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">
            매장코드/명
          </div>
          <div
            class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center">
            <input
              type="text"
              class="w-full h-full border-[1px] border-gray-400 rounded-md"
              @input="handleKeyup" />
          </div>
        </div>
        <div class="w-[25vw] h-[30vh] ml-12 flex justify-center">
          <realgrid
            :progname="progname"
            :progid="progid"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="true"
            @checkedRowData="selcetedrowData"></realgrid>
        </div>
        <div class="text-sm text-gray-800 mt-2">
          ※ 결제키 복사시 결제키 설정 페이지에서 추가해야 결제키 화면에
          나타납니다.
        </div>
      </main>
      <footer class="flex justify-end p-5 mt-1">
        <div
          class="border border-gray-300 rounded-md w-[5vw] h-[4vh] mr-7 -mt-8">
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
          <h2 class="dp-title">결제키 복사</h2>
          <p class="dp-desc">기준 매장의 결제키를 아래에서 체크한 매장에 복사합니다.</p>
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
            <span class="dp-label">POS번호</span>
            <input type="text" class="dp-input" :value="posNo" disabled />
            <span class="dp-label">원본화면</span>
            <select class="dp-input" v-model="selectedScreen">
              <option value="0">전체</option>
              <option
                :value="i.intScreenNo"
                v-for="i in screenList"
                :key="i.intScreenNo">
                [{{ i.intScreenNo }}]{{ i.strScreenName }}
              </option>
            </select>
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
          <div class="dp-note">
            ※ 결제키 복사시 결제키 설정 페이지에서 추가해야 결제키 화면에 나타납니다.
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
const props = defineProps({
  isVisible: { type: Boolean, default: false }, // 팝업 가시성 관리
  storeCd: { type: String, default: "" },
  storeNm: { type: String, default: "" },
  posNo: { type: Number, default: "" },
  areaCd: { type: Number, default: "" },
  progname: { type: String },
  progid: { type: Number },
  dupliapiname: { type: String },
  nowscreenNo: { type: Number },
  poskiosk: { type: String },
  screenList: { type: Array },
  screenType: { type: Number },
  // 새 팝업 모양 사용 여부 (기본 false = 기존 모양). 켜는 화면: 결제키 설정(#)
  newDesign: { type: Boolean, default: false },
});
const store = useStore(); // vuex store
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const searchWord = ref("");
const targetScreenNo = ref("0");
const checked = ref(false);
const selectedScreen = ref("0");
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
  //comsole.log(progname);
  //comsole.log(progid);
  try {
    //comsole.log(poskiosk);
    res = await api[props.poskiosk](groupCd.value);
    //comsole.log(res);
  } catch (error) {
    //comsole.log(error);
  } finally {
    showGrid.value = true;
    if (searchWord.value == "") {
      rowData.value = res.data.store;
    } else {
      rowData.value = res.data.store.filter(
        (item) =>
          item.strName.includes(searchWord.value) ||
          item.lngStoreCode.toString().includes(searchWord.value)
      );
    }

    //comsole.log(rowData.value);
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

const dupliStore = async () => {
  let storeCd2 = [];

  for (var i = 0; i < selectedRows.value.length; i++) {
    storeCd2.push(selectedRows.value[i].lngStoreCode);
  }
  try {
    store.state.loading = true;

    if (checked.value == false) {
      Swal.fire({
        title: "경고",
        text: "복사할 대상이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "확인",
        text: "선택하신 POS의 메뉴배치정보 및 화면정보가 모두 삭제 후 복사됩니다. 계속 진행하시겠습니다?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "복사",
        cancelButtonText: "취소",
      }).then(async (result) => {
        if (!result.isConfirmed) {
          return;
        }
        store.state.loading = true;
        try {
          const res3 = await api2[props.dupliapiname](
            groupCd.value,
            props.storeCd,
            props.areaCd,
            props.posNo,
            selectedScreen.value || "0",
            props.screenType,
            storeCd2.join(",")
          );
          if (res3.data.RESULT_CD == "00") {
            Swal.fire({
              title: "복사 성공",
              text: "복사가 완료되었습니다.",
              icon: "success",
              confirmButtonText: "확인",
            }).then((done) => {
              if (done.isConfirmed) {
                close();
              }
            });
          } else {
            Swal.fire({
              title: "복사 실패",
              text: res3.data.RESULT_NM || "복사에 실패했습니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "복사 실패",
            text: "복사 요청이 서버에서 거절되었습니다.",
            icon: "error",
            confirmButtonText: "확인",
          });
        } finally {
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
.dp-note {
  font-size: 0.8125rem;
  color: #64748b;
}
</style>
