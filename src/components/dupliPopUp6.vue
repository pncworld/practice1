<template>
  <div
    v-if="isVisible"
    class="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-[90] justify-center items-center">
    <div class="bg-white w-[30%] h-[80%] shadow-lg rounded-lg flex flex-col">
      <header class="popup-header flex justify-between pl-12 pt-5">
        <h1 class="font-bold text-2xl">{{ naming2 }} 복사</h1>
        <button
          class="border border-gray-300 button primary rounded-md mr-12"
          @click="dupliStore">
          복사
        </button>
      </header>
      <main class="popup-body flex-grow">
        <div class="flex justify-start font-bold text-xl ml-12">기준매장</div>
        <div
          class="grid grid-rows-2 grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[25vw] ml-12 h-[8vh] rounded-lg">
          <div
            class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">
            기준매장
          </div>
          <div
            class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center">
            <input
              type="text"
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md bg-gray-200"
              :value="'[' + storeCd + ']' + storeNm"
              disabled />
          </div>
          <div
            class="border-[1px] border-gray-400 rounded-tl-md flex justify-center items-center">
            포스번호
          </div>
          <div
            class="w-full border border-gray-400 rounded-tr-md flex justify-center items-center">
            <input
              type="text"
              class="w-[90%] h-[90%] border-[1px] border-gray-400 rounded-md bg-gray-200"
              :value="posNo"
              disabled />
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
          class="grid grid-cols-[1fr,4fr] border-[1px] border-gray-400 w-[25vw] ml-12 h-10 mt-5 rounded-lg">
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
      <footer class="flex justify-end p-5 mt-auto">
        <div class="border border-gray-300 rounded-md w-[5vw] h-[4vh] mr-7">
          <button @click="close" class="w-full h-full">닫기</button>
        </div>
      </footer>
    </div>
  </div>
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
  //comsole.log(progname);
  //comsole.log(progid);
  //comsole.log(storeCd);
  //comsole.log(posNo);
  try {
    res = await api[poskiosk](groupCd.value, storeCd, areaCd, posNo);
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
          } catch (error) {
            //console.log(error);
          } finally {
            store.state.loading = false;
          }

          //console.log(res3);
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
</style>
