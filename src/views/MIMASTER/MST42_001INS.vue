/*--############################################################################
# Filename : MST42_001INS.vue                                                  
# Description : 마스터관리 > 거래처 마스터 > 거래처 등록                       
# Date :2025-05-27                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 부분 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search">조회</button>
      <button @click="addButton" class="button primary">신규</button>
      <button @click="saveButton" class="button save">저장</button>
      <button @click="exportToExcel" class="button excel">엑셀</button>
      <button @click="deleteButton" class="button delete">삭제</button>
    </div>
  </div>
  <div
    class="flex justify-start space-x-44 bg-gray-200 rounded-lg h-16 items-center mt-3 pr-10">
    <div class="text-nowrap flex justify-start ml-12">
      <div class="text-base font-semibold">거래처코드</div>
      <input type="number" v-model="cond1" class="pl-1 ml-5" />
    </div>
    <div class="text-nowrap flex justify-end">
      <div class="text-base font-semibold">거래처명</div>
      <input type="text" v-model="cond2" class="pl-1 ml-5" />
    </div>
  </div>
  <!-- 조회 부분 -->
  <!-- 그리드 부분 -->
  <div class="h-[42vh] w-full">
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'MST42_001INS_VUE'"
      :progid="1"
      :rowData="rowData"
      :rowStateeditable="false"
      :changeNow="changeNow"
      :changeRow="changeRow"
      :changeColid="changeColid"
      :changeValue2="changeValue2"
      :labelingColumns="'lngAccType'"
      :valuesData="[['', '1', '2']]"
      :labelsData="[['', '현금', '어음']]"
      :addRow4="addRow"
      :addrowProp="'lngStoreGroup,lngSupplierID,strSupplierName,strRegistNo,strDirector,strDealType,strDealKind,strAddress,strZipCode,strTelNo,strFaxNo,strManager,strManagerTelNo,strHPNo,strEmail,lngAccType,strConvCode,lngSupplierType'"
      :addrowDefault="addrowDefault"
      :exporttoExcel="exExcel"
      :documentTitle="'MST42_001INS'"
      :documentSubTitle="documentSubTitle"
      :deleteRow6="deleted"
      @sendRowState="sendRowState"
      @allStateRows="allStateRows"
      @clickedRowData="clickedRowData"
      @updatedRowData="updatedRowData"
      @selectedIndex="selectedIndex"></Realgrid>
  </div>
  <!-- 그리드 부분 -->
  <!-- 데이터 부분 -->
  <div class="relative left-0 top-4">
    <div class="grid grid-row-7 grid-cols-[2fr,3fr,2fr,6fr]">
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-orange-100">
        <span class="text-red-500 flex justify-center items-center">*</span
        >거래처코드
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="number"
          :disabled="disable"
          name="lngSupplierID"
          @input="changeVal"
          v-model="gridvalue1"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-orange-100">
        <span class="text-red-500 flex justify-center items-center">*</span>
        거래처명
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          v-model="gridvalue2"
          name="strSupplierName"
          @input="changeVal"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        사업자번호
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strRegistNo"
          @input="changeVal"
          v-model="gridvalue3"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        대표자명
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strDirector"
          @input="changeVal"
          v-model="gridvalue4"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        업종
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strDealType"
          @input="changeVal"
          v-model="gridvalue5"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        업태
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strDealKind"
          @input="changeVal"
          v-model="gridvalue6"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        우편번호
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strZipCode"
          @input="changeVal"
          v-model="gridvalue7"
          class="border w-[50%] h-[80%] border-black mr-3" /><button
          class="button primary !h-6"
          @click="getPostAddress">
          주소 찾기
        </button>
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        주소
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strAddress"
          v-model="gridvalue8"
          @input="changeVal"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        전화번호
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strTelNo"
          v-model="gridvalue9"
          @input="changeVal"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        팩스번호
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strFaxNo"
          v-model="gridvalue10"
          @input="changeVal"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        담당자명
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strManager"
          v-model="gridvalue11"
          @input="changeVal"
          class="border w-[50%] h-[80%] border-black" />
      </div>
      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        담당자TEL
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strManagerTelNo"
          v-model="gridvalue12"
          @input="changeVal"
          class="border w-[25%] h-[80%] border-black" />

        <div
          class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100 w-60 ml-20 h-full">
          담당자H.P
        </div>
        <div class="border-l border-t items-center flex justify-start pl-5">
          <input
            type="text"
            v-model="gridvalue13"
            name="strHPNo"
            @input="changeVal"
            class="border w-[80%] h-[80%] border-black" />
        </div>
      </div>

      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100 border-b">
        전자우편주소
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <input
          type="text"
          name="strEmail"
          v-model="gridvalue14"
          @input="changeVal"
          class="border w-[50%] h-[80%] border-black" />
      </div>

      <div
        class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100">
        결제유형
      </div>
      <div class="border-l border-t items-center flex justify-start pl-5">
        <!-- <input
          type="text"
          class="border w-[25%] h-[80%] border-black"
          name="lngAccType"
          @input="changeVal"
          v-model="gridvalue15" /> -->

        <select
          name="lngAccType"
          id="lngAccType"
          class="border w-[25%] h-[80%] border-black"
          @change="changeVal"
          v-model="gridvalue15">
          <option value="">선택</option>
          <option value="1">현금</option>
          <option value="2">어음</option>
        </select>
        <div
          class="border-l border-t text-base font-semibold flex justify-center items-center bg-gray-100 w-60 ml-20 h-full">
          본사전송코드
        </div>
        <div class="border-l border-t items-center flex justify-start pl-5">
          <input
            type="text"
            name="strConvCode"
            v-model="gridvalue16"
            @input="changeVal"
            class="border w-[80%] h-[80%] border-black" />
        </div>
      </div>
    </div>
  </div>
  <GetZipCode
    v-if="openPopUp"
    @closePopUp="closePopUp"
    @zipAndAddress="zipAndAddress">
  </GetZipCode>
  <!-- 데이터 부분 -->
</template>

<script setup>
import { deleteClientInfo, getClientList, saveClientInfo } from "@/api/master";
import GetZipCode from "@/components/getZipCode.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
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

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const cond1 = ref("");
const cond2 = ref("");
const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const gridvalue9 = ref("");
const gridvalue10 = ref("");
const gridvalue11 = ref("");
const gridvalue12 = ref("");
const gridvalue13 = ref("");
const gridvalue14 = ref("");
const gridvalue15 = ref("");
const gridvalue16 = ref("");
const store = useStore();

/**
 * 추가 버튼 함수
 */

const addRow = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);
const afterSearch = ref(false);

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 페이지 매장 그룹 세팅
 */

const exExcel = ref(false);
const documentSubTitle = ref("");
const exExcelNm = ref("매장정보등록");
/**
 * 엑셀 Export 버튼
 */

const exportToExcel = () => {
  documentSubTitle.value =
    "거래처코드 : " + cond1.value + "\n" + "거래처명 :" + cond2.value;
  exExcel.value = !exExcel.value;
};
const searchstore = ref("");

// API 호출 (설정값 호출)

const rowData = ref([]);
const lngMultiPriceGroupCodes = ref([]);

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    const res = await getClientList(
      store.state.userData.lngStoreGroup,
      cond1.value == "" ? 0 : cond1.value,
      cond2.value
    );

    //console.log(res);

    rowData.value = res.data.List;
    updateRowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const deleted = ref(false);

/**
 * 삭제 버튼
 */

const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (afterClick.value == false) {
    return;
  }
  deleted.value = !deleted.value;
};
const addrowDefault = ref("");
const addrowProp = ref("");
/**
 *  추가 버튼
 */

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addrowDefault.value =
    store.state.userData.lngStoreGroup + ", , , , , , , , , , , , , , , , ,1";
  addRow.value = !addRow.value;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (deleterows.value.length + statesrows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    if (statesrows.value.length > 0) {
      const storeGroups = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngStoreGroup);
      const supplierid = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngSupplierID);
      const suppliernm = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strSupplierName);
      const registno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strRegistNo);
      const strdirector = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strDirector);
      const dealtype = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strDealType);
      const dealkind = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strDealKind);
      const straddress = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strAddress);
      const strzipcode = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strZipCode);
      const strtelno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strTelNo);
      const strfaxno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strFaxNo);
      const strmanager = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strManager);
      const strmanagertelno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strManagerTelNo);
      const strhpno = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strHPNo);
      const stremail = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strEmail);
      const lngacctype = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngAccType);
      const convcode = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.strConvCode);
      const suppliertype = updateRowData.value
        .filter((item, index) => statesrows.value.includes(index))
        .map((item) => item.lngSupplierType);
      const res = await saveClientInfo(
        storeGroups.join("\u200b"),
        supplierid.join("\u200b"),
        suppliernm.join("\u200b"),
        registno.join("\u200b"),
        strdirector.join("\u200b"),
        dealtype.join("\u200b"),
        dealkind.join("\u200b"),
        straddress.join("\u200b"),
        strzipcode.join("\u200b"),
        strtelno.join("\u200b"),
        strfaxno.join("\u200b"),
        strmanager.join("\u200b"),
        strmanagertelno.join("\u200b"),
        strhpno.join("\u200b"),
        stremail.join("\u200b"),
        lngacctype.join("\u200b"),
        convcode.join("\u200b"),
        suppliertype.join("\u200b")
      );
    }
    if (deleterows.value.length > 0) {
      const groups = updateRowData.value
        .filter((item, index) => deleterows.value.includes(index))
        .map((item) => item.lngStoreGroup)
        .join("\u200b");
      const supplierid = updateRowData.value
        .filter((item, index) => deleterows.value.includes(index))
        .map((item) => item.lngSupplierID)
        .join("\u200b");
      const suppliertype = updateRowData.value
        .filter((item, index) => deleterows.value.includes(index))
        .map((item) => item.lngSupplierType)
        .join("\u200b");
      const res = await deleteClientInfo(groups, supplierid, suppliertype);

      //console.log(res);
    }
    Swal.fire({
      title: "성공",
      text: "저장을 완료하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
    //console.log(error);
  } finally {
    store.state.loading = false;
    searchButton();
  }
  //comsole.log(updateRowData.value);
};

/**
 * 수정용 데이터 행 설정
 */

/**
 * 데이터셋 상세정보 셋팅
 */

const disable = ref(false);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const sendRowState = (e) => {
  if (e == "created") {
    disable.value = false;
  } else {
    disable.value = true;
  }
};
const statesrows = ref([]);
const deleterows = ref([]);
const allStateRows = (e) => {
  //console.log(e);
  statesrows.value = [...e.updated, ...e.created];
  deleterows.value = e.deleted;
  //console.log(statesrows.value);
};
const afterClick = ref(false);
const clickedRowData = (e) => {
  //console.log(e);
  afterClick.value = true;
  gridvalue1.value = e[1];
  gridvalue2.value = e[2];
  gridvalue3.value = e[3];
  gridvalue4.value = e[4];
  gridvalue5.value = e[5];
  gridvalue6.value = e[6];
  gridvalue8.value = e[7];
  gridvalue7.value = e[8];
  gridvalue9.value = e[9];
  gridvalue10.value = e[10];
  gridvalue11.value = e[11];
  gridvalue12.value = e[12];
  gridvalue13.value = e[13];
  gridvalue14.value = e[14];
  gridvalue15.value = e[15];
  gridvalue16.value = e[16];
};

const openPopUp = ref(false);
const getPostAddress = () => {
  if (afterClick.value == false) {
    return;
  }
  openPopUp.value = true;
};

const closePopUp = (e) => {
  openPopUp.value = e;
};
const changeVal = (e) => {
  if (afterClick.value == false) {
    return;
  }
  const nm = e.target.name;
  const vl = e.target.value;

  changeColid.value = nm;
  changeValue2.value = vl;

  changeNow.value = !changeNow.value;
};

const zipAndAddress = async (e) => {
  const a = e.split(",")[0];
  const b = e.split(",")[1];

  changeColid.value = "strZipCode";
  changeValue2.value = a;
  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strAddress";
  changeValue2.value = b;
  changeNow.value = !changeNow.value;

  await nextTick();
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 페이지 매장 분류 세팅
 */

const changeValue2 = ref();
const changeRow = ref();
const changeColid = ref();
const changeNow = ref(false);
const changeNow2 = ref(false);
const updatedRowData = (e) => {
  //console.log(e);
  updateRowData.value = e;
};
const updateRowData = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */

const initGrid = () => {
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
};
</script>

<style>
.ag-theme-alpine {
  height: 100%;
  width: 100%;
  --ag-row-height: 20px !important;
}

.ag-header-cell-label {
  justify-content: left !important;
  margin-right: -5px !important;
}

.custom-grid {
  --ag-header-background-color: #545876 !important;
  --ag-header-foreground-color: white !important;
  --ag-font-size: 11px !important;
}
</style>
