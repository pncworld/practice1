<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="dupli6-overlay"
      @click.self="close">
      <div class="dupli6-dialog" role="dialog" aria-modal="true">
        <header class="dupli6-header">
          <h1 class="dupli6-title">{{ naming2 }} 복사</h1>
          <div class="dupli6-header-actions">
            <button type="button" class="dupli6-btn dupli6-btn--primary" @click="showStoreList">
              조회
            </button>
            <button type="button" class="dupli6-btn dupli6-btn--copy" @click="dupliStore">
              복사
            </button>
            <button type="button" class="dupli6-btn" @click="close">
              닫기
            </button>
          </div>
        </header>

        <main class="dupli6-body">
          <div class="dupli6-section-title">기준매장</div>
          <div class="dupli6-form-grid">
            <div class="dupli6-form-label">기준매장</div>
            <div class="dupli6-form-value">
              <input
                type="text"
                class="dupli6-control"
                :value="'[' + storeCd + ']' + storeNm"
                disabled />
            </div>
            <div class="dupli6-form-label">포스번호</div>
            <div class="dupli6-form-value">
              <input
                type="text"
                class="dupli6-control"
                :value="posNo"
                disabled />
            </div>
          </div>

          <div class="dupli6-arrow" aria-hidden="true">
            <img src="../assets/masterCopy-ArrowDown.png" alt="" />
          </div>

          <div class="dupli6-section-head">
            <div class="dupli6-section-title">대상 매장 선택</div>
          </div>
          <div class="dupli6-form-grid dupli6-form-grid--search">
            <div class="dupli6-form-label">매장코드/명</div>
            <div class="dupli6-form-value">
              <input
                type="text"
                class="dupli6-control"
                placeholder="검색어 입력"
                @input="handleKeyup"
                @keydown.enter.prevent="showStoreList" />
            </div>
          </div>

          <div class="dupli6-grid-wrap">
            <realgrid
              class="h-full w-full"
              :progname="progname"
              :progid="progid"
              :rowData="rowData"
              :showGrid="showGrid"
              :showCheckBar="true"
              @checkedRowData="selcetedrowData" />
          </div>
        </main>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import * as api2 from "@/api/master";
import * as api from "@/api/common";
import Swal from "sweetalert2";
import { ref } from "vue";
import { useStore } from "vuex";
import realgrid from "./realgrid.vue";
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
  blnBrandAdmin,
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
  blnBrandAdmin: { type: Boolean, default: false },
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
      res = await api[poskiosk](groupCd.value, storeCd, areaCd, posNo);
    }
  } catch (error) {
  } finally {
    showGrid.value = true;
    const rawList =
      res?.data?.storepos ?? res?.data?.store ?? [];
    if (searchWord.value == "") {
      rowData.value = rawList;
    } else {
      rowData.value = rawList.filter(
        (item) =>
          item.strName.includes(searchWord.value) ||
          item.lngStoreCode.toString().includes(searchWord.value)
      );
    }
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
        text: "선택하신 POS의 메뉴배치정보 및 화면정보가 모두 삭제 후 복사됩니다. 계속 진행하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "복사",
        cancelButtonText: "취소",
      }).then(async (result) => {
        if (result.isConfirmed) {
          store.state.loading = true;
          let res3;
          try {
            res3 = await api2[dupliapiname](
              groupCd.value,
              storeCd,
              areaCd,
              posNo,
              groupCd2.join(","),
              storeCd2.join(","),
              areaCd2.join(","),
              posNo2.join(",")
            );
            //console.log(res3);
          } catch (error) {
            ////console.log(error);
          } finally {
            store.state.loading = false;
          }

          ////console.log(res3);
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
.dupli6-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 50%);
  padding: 1rem;
}

.dupli6-dialog {
  --dupli6-label-col: 7rem;
  --dupli6-control-h: 2rem;
  --dupli6-font: 0.875rem;
  --dupli6-border: #cbd5e1;
  --dupli6-pad-x: 1.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(42rem, 96vw);
  height: min(80vh, 46rem);
  min-height: 0;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  box-shadow: 0 12px 28px rgb(15 23 42 / 18%);
  overflow: hidden;
}

.dupli6-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-shrink: 0;
  padding: 1rem var(--dupli6-pad-x);
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.dupli6-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.dupli6-header-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.dupli6-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 2rem;
  min-width: 4.5rem;
  padding: 0 0.875rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  color: #374151;
  background: #fff;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 10%);
}

.dupli6-btn--primary {
  color: #fff;
  background: #3b82f6;
  border-color: #2563eb;
}

.dupli6-btn--primary:hover {
  background: #2563eb;
}

.dupli6-btn--copy {
  color: #fff;
  background: #2563eb;
  border-color: #1d4ed8;
}

.dupli6-btn--copy:hover {
  background: #1d4ed8;
}

.dupli6-btn:hover {
  background: #f3f4f6;
}

.dupli6-btn--primary:hover,
.dupli6-btn--copy:hover {
  color: #fff;
}

.dupli6-body {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  padding: 1rem var(--dupli6-pad-x) 1.25rem;
  gap: 0.625rem;
  overflow: hidden;
}

.dupli6-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.dupli6-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.dupli6-form-grid {
  display: grid;
  grid-template-columns: var(--dupli6-label-col) minmax(0, 1fr);
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.dupli6-form-grid--search {
  grid-template-columns: var(--dupli6-label-col) minmax(0, 1fr);
}

.dupli6-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.25rem;
  padding: 0.25rem 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--dupli6-font);
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}

.dupli6-form-value {
  display: flex;
  align-items: center;
  min-width: 0;
  min-height: 2.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.dupli6-control {
  box-sizing: border-box;
  width: 100%;
  height: var(--dupli6-control-h);
  min-height: var(--dupli6-control-h);
  max-height: var(--dupli6-control-h);
  padding: 0 0.5rem;
  border: 1px solid var(--dupli6-border);
  border-radius: 0.375rem;
  background: #fff;
  font-size: var(--dupli6-font);
  line-height: 1;
  color: #111827;
}

.dupli6-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.dupli6-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.dupli6-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem 0;
}

.dupli6-arrow img {
  max-height: 1.75rem;
  width: auto;
}

.dupli6-grid-wrap {
  flex: 1 1 0;
  min-height: 12rem;
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}
</style>
