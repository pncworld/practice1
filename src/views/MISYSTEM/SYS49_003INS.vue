<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">비밀번호 변경.</h1>
      </div>
    </div>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save md:w-auto w-14">
        저장
      </button>
    </div>
  </div>
  <div
    class="grid grid-rows-1 grid-cols-3 justify-between bg-gray-200 rounded-lg h-12 items-center z-10">
    <div class="flex items-center space-x-5">
      <div class="text-base font-semibold ml-5">매장명 :</div>
      <v-select
        v-model="selectedStoreCd"
        :options="storeList"
        :disabled="lngPositionType == 0"
        label="strName"
        :placeholder="'전체'"
        class="custom-select9 bg-white w-80 h-10 disabled:bg-gray-100"
        @click="resetArea" />
    </div>
    <div class="flex justify-center items-center">
      <div class="text-base font-semibold">사용자명 :</div>
      <input
        type="text"
        v-model="condition1"
        class="border rounded-lg pl-1 h-10 !w-36" />
    </div>
    <div class="text-base font-semibold w-[90%] ml-10 z-10">
      사용자ID:
      <input
        type="text"
        class="border rounded-lg pl-1 h-10 !w-36 z-30"
        v-model="condition2" />
    </div>
  </div>

  <div class="grid grid-rows-1 grid-cols-[1fr,1fr] h-[85%] w-[90%]">
    <div>
      <div class="text-xl font-semibold flex justify-start ml-10 mt-2">
        사용자 정보
      </div>
      <Realgrid
        :progname="'SYS49_003INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :documentTitle="'SYS49_003INS'"
        class="mt-2"
        :selectionStyle="'singleRow'"
        @clickedRowData="clickedRowData"
        :initSelect="true"
        :moveFocusbyIndex="moveFocusbyIndex"
        :exporttoExcel="exceloutput"
        :changeNow="changeNow"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeValue2="changeValue2"
        :documentSubTitle="documentSubTitle">
      </Realgrid>
    </div>
    <div class="grid grid-rows-[1fr,10fr] grid-cols-1 h-[85%] w-[110%]">
      <div class="text-xl font-semibold flex justify-between ml-10 mt-2">
        <div>상세 정보</div>
      </div>
      <div
        class="grid grid-rows-[repeat(10,minmax(0,1fr))_6fr] grid-cols-[1fr,4fr] h-[100%] ml-10 -mt-5">
        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100">
          매장
        </div>
        <div class="border border-gray-500 p-1 flex space-x-3">
          <input
            type="text"
            v-model="value1"
            disabled
            class="border border-gray-500" /><input
            type="text"
            disabled
            class="border border-gray-500 w-64"
            v-model="value2" />
        </div>
        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100">
          사용자명
        </div>
        <div class="border border-gray-500 p-1 flex space-x-3">
          <input
            type="text"
            v-model="value4"
            @input="setValue4"
            class="border border-gray-500 w-64"
            :disabled="true" />
        </div>
        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100">
          사용자ID
        </div>
        <div class="border border-gray-500 p-1 flex space-x-3">
          <input
            type="text"
            v-model="value3"
            @input="setValue3"
            :disabled="true"
            class="border border-gray-500" />
        </div>

        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
          *비밀번호
        </div>
        <div class="border border-gray-500 p-1 flex space-x-3">
          <input
            type="password"
            v-model="value7"
            @input="setValue7"
            class="border border-gray-500 w-64"
            :disabled="clickedOrNot" />
        </div>
        <div
          class="border border-gray-500 p-2 flex h-auto items-center text-sm font-semibold justify-center bg-gray-100">
          보안분류
        </div>
        <div class="border border-gray-500 p-1 flex">
          <input
            type="text"
            v-model="value8"
            :disabled="true"
            class="border border-gray-500 p-1 flex" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getSecureList,
  getStoreListforUserEnroll,
  getUserPassWordEnroll,
  saveUserPassWordEnroll,
} from "@/api/system";
import Realgrid from "@/components/realgrid.vue";
import Swal from "sweetalert2";
import { onMounted, ref, watch } from "vue";

import { useStore } from "vuex";
const selectedDate = ref();

const selectedStoreCd = ref(null);
const clickedOrNot = ref(true);
const receiptNo = ref();
const store = useStore();
const secureList = ref([]);
const LockList = ref([]);
const superVisorList = ref([]);
const selectedStoreNm = ref("");
const selectedUserSequence = ref("0");
const selectedUserChargerCode = ref("");
const storeList = ref([]);
const forupdateDisabled = ref(true);
// const lngStoreCode = (e) => {
//     selectedStoreCd.value = e
//     console.log(e)
// }
const moveFocusbyIndex = ref("");
const deleteRow2 = ref(false);
const selectedBlnHQ = ref("0");
const addRow4 = ref(false);
watch(selectedStoreCd, () => {
  if (selectedStoreCd.value == null) {
    selectedStoreNm.value = "전체";
    selectedBlnHQ.value = "0";
  } else {
    selectedStoreNm.value = storeList.value.filter(
      (item) => item.lngStoreCode == selectedStoreCd.value.lngStoreCode
    )[0].strName;
    selectedBlnHQ.value = storeList.value.filter(
      (item) => item.lngStoreCode == selectedStoreCd.value.lngStoreCode
    )[0].blnHQ;
  }
  initGrid();
});
const condition1 = ref("");
const condition2 = ref("");
const disabledLock = ref(false);
const afterSearch = ref(false);
const disableSupervisor = ref(false);
const value1 = ref("");
const value2 = ref("");
const value3 = ref("");
const value4 = ref("");
const value5 = ref("");
const value6 = ref("");
const value7 = ref("");
const value8 = ref("");
const value9 = ref("");
const value10 = ref("");
const value11 = ref(false);
const value12 = ref(false);
const value13 = ref("");
const value14 = ref(false);
const addrowDefault = ref("");
const addrowProp = ref(
  "lngPosition,strStoreName,lngLanguage,strLockType,strChargerName,strUserID,strUserAdminID,lngSupplierID,strIdNo,strPassword,lngUserAdminID,chkSupplierID,blnSupervisor,blnCompanyAdmin,lngSuperAttrCd,lngSequence,lngChargerCode"
);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStoreListforUserEnroll(
    store.state.userData.lngStoreGroup
  );
  storeList.value = res.data.List;

  groupCd.value = store.state.userData.lngStoreGroup;
  const res2 = await getSecureList(groupCd.value);
  secureList.value = res2.data.List;
  console.log(secureList.value);
  let storecd;
  if (
    store.state.userData.blnBrandAdmin == "True" ||
    store.state.userData.lngPositionType == "1"
  ) {
    storecd = 0;
  } else {
    storecd = store.state.userData.lngPosition;
  }
});
const rowData2 = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    let storecd;
    if (selectedStoreCd.value == null) {
      storecd = 0;
    } else {
      storecd = selectedStoreCd.value.lngStoreCode;
    }

    const res = await getUserPassWordEnroll(
      groupCd.value,
      storecd,
      condition1.value,
      condition2.value
    );
    console.log(res);

    rowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    clickedOrNot.value = true;
    store.state.loading = false;
    disabledLock.value = false;
    initFocus.value = !initFocus.value;
    currentAddState.value = false;
    prevRowState.value = [];
    prevIndex.value = [];
    prevSequence.value = [];
    selectedUserSequence.value = "0";
  }
};
const initFocus = ref(false);
const groupCd = ref();
const storeCd = ref();
const selectedExcelStore = ref();
const selectedExcelDate = ref();
const selectedStoreAreaCode = ref();
const init = ref(false);
const documentSubTitle = ref("");

const rowData = ref([]);

const currentOriPassWord = ref("");

const selectedPosNo = ref();

const disCountCd = ref("");
const disCountNm = ref("");

const payCd = ref("");
const selectedRowState = ref("");
const sendRowState = (e) => {
  selectedRowState.value = e;
  console.log(e);
  if (e == "none") {
    blnCheckDupli.value = true;
  }
};

const prevRowState = ref([]);
const prevIndex = ref([]);
const prevSequence = ref([]);

const clickedRowData = async (e) => {
  selectedUserSequence.value = e[6];
  console.log(e);
  value1.value = e[5];
  value2.value = e[0];
  value3.value = e[1];
  value4.value = e[2];
  value7.value = e[4];
  value8.value = e[3];
  clickedOrNot.value = false;
};

const exceloutput = ref(false);

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
  value1.value = "";
  value2.value = "";
  value3.value = "";
  value4.value = "";
  value7.value = "";
  value8.value = "";
  clickedOrNot.value = true;
};

const selectedStoreAttr = ref();
const blnCheckDupli = ref(false);

const currentAddState = ref(false);

const saveButton = async () => {
  if (afterSearch.value == "0") {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (
    rowData.value.filter(
      (item) =>
        item.lngSequence == selectedUserSequence.value &&
        item.strPassWord == value7.value
    ).length > 0 ||
    selectedUserSequence.value == "0"
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (value7.value == "") {
    Swal.fire({
      title: "경고",
      text: "비밀번호를 입력하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (value7.value.length <= 5 || value7.value.length >= 21) {
    Swal.fire({
      title: "경고",
      text: "비밀번호는 6자리 이상 20자리 이하로 입력하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;

      const res = await saveUserPassWordEnroll(
        selectedUserSequence.value,
        value7.value
      );

      if (res.data.RESULT_CD == "00") {
        Swal.fire({
          title: "성공",
          text: "저장하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        searchButton();

        blnCheckDupli.value = false;
        currentAddState.value = false;
        return;
      } else {
        Swal.fire({
          title: "실패",
          text: "저장에 실패하였습니다.",
          icon: "warning",
          confirmButtonText: "확인",
        });
        blnCheckDupli.value = false;
        store.state.loading = false;
        return;
      }
    }
  });
};

const deleteRowSequences = ref([]);
const updateRowData = ref([]);
const updatedRowData = (e) => {
  let convertArray = e.map(({ deleted, lngSupplierID, ...rest }) => ({
    ...rest,
    lngSupplierID: lngSupplierID ? "1" : "0",
  }));

  updateRowData.value = convertArray;
  console.log(updateRowData.value);
};

const selectedindex = ref("");
const selectedIndexArray = ref([]);
const selectedIndex = (e) => {
  selectedindex.value = e;
  console.log(e);
  selectedIndexArray.value.push(e);
};
const changeRow = ref("");
const changeColid = ref("");
const changeValue2 = ref("");
const changeNow = ref(false);
</script>
