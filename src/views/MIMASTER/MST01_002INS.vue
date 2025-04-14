<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <div class="flex justify-start w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">매장정보등록</h1>
      </div>
    </div>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search">조회</button>
      <button @click="saveButton" class="button save">저장</button>
      <button @click="exportToExcel" class="button excel">엑셀</button>
    </div>
  </div>
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg h-16 items-center mt-3">
    <PickStore
      :defaultStoreNm="'전체'"
      @update:storeGroup="handleGroupCd"
      @update:storeCd="handleStoreCd">
    </PickStore>
    <input
      type="text"
      v-model="searchStoreName"
      class="rounded-lg h-[53%] items-center border border-black"
      :disabled="allstrore"
      @keydown.enter="searchButton" />
  </div>

  <div class="h-[54%] w-full">
    <div class="flex justify-end gap-1 mt-1">
      <button @click="addButton" class="whitebutton">추가</button>
      <button @click="deleteButton" class="whitebutton">삭제</button>
    </div>
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'MST01_002INS_VUE'"
      :progid="1"
      :rowData="rowData"
      @clickedRowData="clickedRowData3"
      @selcetedrowData="selcetedrowData"
      :selectionStyle="'singleRow'"
      :initFocus="initFocus"
      :labelingColumns="'lngSupervisor,lngSaleType,lngMultiPriceGroupCode,lngJoinType,lngSubLease,lngStoreAttr,lngStoreArea'"
      @updatedRowData="updatedRowData"
      :valuesData="valuesData"
      :labelsData="labelsData"
      :deleteRow="deleted"
      :changeColid="changeColid"
      :changeRow="changeRow"
      :changeValue2="changeValue"
      :changeNow2="changeNow"
      @selectedIndex2="selectedIndex2"
      :useCheckboxfordelete="true"
      :addRow4="addRow4"
      :addrowDefault="addrowDefault"
      :addrowProp="addrowProp"
      :addField="'new'"
      :rowStateeditable="false"
      :exporttoExcel="exExcel"
      :ExcelNm="exExcelNm"></Realgrid>
  </div>
  <div class="relative left-0 top-4 mt-5">
    <div class="absolute grid grid-cols-6 grid-rows-10 gap-0 w-full">
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg rounded-ss-xl bg-gray-100 text-blue-500">
        *매장코드
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-full pl-2 h-7 disabled:bg-gray-300"
          v-model="lngStoreCode"
          :disabled="disableStoreCode"
          name="lngStoreCode"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *매장명
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-full pl-2 h-7"
          v-model="strName"
          name="strName"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        사업자번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center rounded-se-xl">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-full pl-2 h-7"
          v-model="strRegistNo"
          name="strRegistNo"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *가맹유형
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <select
          class="border rounded-md w-full h-7 pl-1"
          v-model="lngJoinType"
          name="lngJoinType"
          @change="updateGridValue">
          <option value="-1" class="text-sm">선택</option>
          <option
            v-for="item in lngJoinTypes"
            :key="item.lngCode"
            :value="item.lngCode"
            class="text-sm">
            {{ item.strName }}
          </option>
        </select>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *멀티단가 그룹
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <select
          class="text-sm border rounded-md w-full h-7 pl-1"
          v-model="lngMultiPriceGroupCode"
          name="lngMultiPriceGroupCode"
          @change="updateGridValue">
          <option value="-1" class="text-sm">선택</option>
          <option
            v-for="item in lngMultiPriceGroupCodes"
            :key="item.lngMultiPriceGroupCode"
            :value="item.lngMultiPriceGroupCode"
            class="text-sm">
            {{ item.strMultiPriceGroupName }}
          </option>
        </select>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center"></div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="hidden"
          id="storeCode"
          class="text-sm border rounded-md w-full h-7 pl-1" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *매장구분
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <select
          id="storeCode"
          class="border rounded-md w-full h-7 pl-1"
          v-model="lngStoreAttr"
          name="lngStoreAttr"
          @change="updateGridValue">
          <option value="-1" class="text-sm">선택</option>
          <option
            v-for="item in lngStoreAttrs"
            :key="item.lngStoreAttr"
            :value="item.lngStoreAttr"
            class="text-sm">
            {{ item.strName }}
          </option>
        </select>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *매장유형
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <select
          id="storeCode"
          class="text-sm border rounded-md w-full h-7 pl-1"
          v-model="lngSubLease"
          name="lngSubLease"
          @change="updateGridValue">
          <option value="-1" class="text-sm">선택</option>
          <option
            v-for="item in lngSubLeases"
            :key="item.lngCode"
            :value="item.lngCode"
            class="text-sm">
            {{ item.strName }}
          </option>
        </select>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 text-blue-500">
        *지역
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <select
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-full h-7 pl-1"
          v-model="lngStoreArea"
          name="lngStoreArea"
          @change="updateGridValue">
          <option value="-1" class="text-sm">선택</option>
          <option
            v-for="item in lngStoreAreas"
            :key="item.lngStoreArea"
            :value="item.lngStoreArea"
            class="text-sm">
            {{ item.strName }}
          </option>
        </select>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        대표자명
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-full pl-2 h-7"
          v-model="strDirector"
          name="strDirector"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        업종
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="text-sm border rounded-md w-full pl-2 h-7"
          v-model="strDealType"
          name="strDealType"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        업태
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border rounded-md w-full h-7 pl-2"
          v-model="strDealKind"
          name="strDealKind"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        오픈일자
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="date"
          v-model="dtmOpenDate"
          max="9999-12-31"
          name="dtmOpenDate"
          @input="updateGridValue"
          class="border p-2 rounded h-full w-full" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        폐점일자
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="date"
          v-model="dtmStop"
          name="dtmStop"
          @input="updateGridValue"
          max="9999-12-31"
          class="border p-2 rounded h-full w-full" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        변환코드
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full p-2 h-7 pl-2"
          v-model="strConvCode"
          name="strConvCode"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        우편번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full p-2 h-7 pl-2"
          v-model="strZipCode"
          name="strZipCode"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        주소
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center w-[200%]">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full h-7 p-2 pl-2"
          v-model="strAddress"
          name="strAddress"
          @input="updateGridValue" />
      </div>
      <div class="h-0 w-0"></div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="strAddressEtc"
          name="strAddressEtc"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        전화번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="strTel"
          name="strTel"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        휴대폰번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="strPhone"
          name="strPhone"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        팩스번호
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="strFax"
          name="strFax"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        평수
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="number"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="lngFloorSpace"
          name="lngFloorSpace"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        임차조건
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="number"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="lngLease"
          name="lngLease"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        BEP
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="number"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="lngBEP"
          name="lngBEP"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        상권
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <select
          id="storeCode"
          class="text-sm border rounded-md w-full pl-1 h-7"
          v-model="lngSaleType"
          name="lngSaleType"
          @change="updateGridValue">
          <option value="-1" class="text-sm">선택</option>
          <option value="0" class="text-sm">없음</option>
          <option
            v-for="item in lngSaleTypes"
            :key="item.lngSaleType"
            :value="item.lngSaleType"
            class="text-sm">
            {{ item.strSaleType }}
          </option>
        </select>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        담당 S/C
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <select
          id="storeCode"
          class="text-sm border rounded-md w-full pl-1 h-7"
          v-model="lngSupervisor"
          name="lngSupervisor"
          @change="updateGridValue">
          <option value="-1" class="text-sm">선택</option>
          <option
            v-for="item in lngSupervisors"
            :key="item.lngSupervisor"
            :value="item.lngSupervisor"
            class="text-sm">
            {{ item.strName }}
          </option>
        </select>
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        배송기사명
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="strDev1"
          name="strDev1"
          @input="updateGridValue" />
      </div>

      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100 rounded-es-xl">
        좌석수
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center">
        <input
          type="number"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="lngTable"
          name="lngTable"
          @input="updateGridValue" />
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center bg-gray-100">
        매장이력
      </div>
      <div
        class="border flex h-7 items-center text-sm font-semibold justify-center rounded-ee-xl w-[300%]">
        <input
          type="text"
          id="storeCode"
          class="border text-sm rounded-md w-full pl-2 h-7"
          v-model="strStoreHistory"
          name="strStoreHistory"
          @input="updateGridValue" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { getGridInfoList } from "@/api/common";
import { getstoreInfo, saveStoreInfo } from "@/api/master";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import Swal from "sweetalert2";
import { ref, watch } from "vue";
import { useStore } from "vuex";

const result = ref([]);
const store = useStore();
const groupCd = ref();
const searchStoreName = ref("");
const disableStoreCode = ref(true);
const addRow4 = ref(false);
const labelsData = ref([]);
const valuesData = ref([]);
const afterSearch = ref(false);
const storeType = ref("0");
const storeCd = ref("0");
const allstrore = ref(false);
const handleStoreCd = (newValue) => {
  storeCd.value = newValue;
  console.log(newValue);
  if (storeCd.value == 0) {
    allstrore.value = false;
  } else {
    allstrore.value = true;
    searchstore.value = "";
  }
};
const inputValue = ref("");

const handleGroupCd = (newValue) => {
  console.log(newValue);
  groupCd.value = newValue;
};
const exExcel = ref(false);
const exExcelNm = ref("매장정보등록");
const exportToExcel = () => {
  exExcel.value = !exExcel.value;
};
const searchstore = ref("");

const gridApi = ref();
const GridInfo_PROG_ID = "MST01_002INS_VUE";
const GridInfo_GRID_ID = "1";
// API 호출 (설정값 호출)
const tabInitSetArray = ref([]);
(async () => {
  try {
    const result = await getGridInfoList(GridInfo_PROG_ID, GridInfo_GRID_ID);
    tabInitSetArray.value = result;
  } catch (error) {
    console.error("Failed to fetch data:", error); // 오류 로그 출력
  } finally {
  }
})();
const colDefs2 = ref([]);

const rowData = ref([]);
const lngMultiPriceGroupCodes = ref([]);
const lngStoreAttrs = ref([]);
const initlngStoreAttr = ref(-1);
const lngJoinTypes = ref([]);
const initlngJoinType = ref(-1);
const lngSubLeases = ref([]);
const initlngSubLease = ref(-1);
const lngStoreAreas = ref([]);
const initlngStoreArea = ref(-1);
const lngSaleTypes = ref([]);
const initlngSaleType = ref(-1);
const lngSupervisors = ref([]);
const initlngSupervisor = ref(-1);
const initlngMultiPriceGroupCode = ref(-1);

const searchButton = async () => {
  lngMultiPriceGroupCodes.value = [];
  lngStoreAttrs.value = [];
  lngJoinTypes.value = [];
  lngSubLeases.value = [];
  lngStoreAreas.value = [];
  lngSaleTypes.value = [];
  lngSupervisors.value = [];
  valuesData.value = [];
  labelsData.value = [];

  lngStoreCode.value = "";
  strName.value = "";
  strRegistNo.value = "";
  strDirector.value = "";
  strDealType.value = "";
  strDealKind.value = "";
  lngJoinType.value = "-1";
  lngSubLease.value = "-1";
  lngStoreAttr.value = "-1";
  lngStoreArea.value = "-1";
  dtmOpenDate.value = new Date().toISOString().split("T")[0];
  strTel.value = "";
  strFax.value = "";
  strZipCode.value = "";
  strAddress.value = "";
  strAddressEtc.value = "";
  strConvCode.value = "";
  strPhone.value = "";
  lngBEP.value = "";
  lngFloorSpace.value = "";
  lngLease.value = "";
  lngSupervisor.value = "-1";
  lngSaleType.value = "-1";
  dtmStop.value = "9999-12-31";
  strDev1.value = "";
  lngTable.value = "";
  lngMultiPriceGroupCode.value = "-1";
  strStoreHistory.value = "";

  store.dispatch("convertLoading", true);

  console.log(groupCd.value);
  console.log(storeType.value);
  console.log(storeCd.value);
  console.log(searchStoreName.value);
  const res = await getstoreInfo(
    groupCd.value,
    storeType.value,
    storeCd.value,
    searchStoreName.value
  );

  console.log(res);
  lngJoinTypes.value = res.data.JOINTYPE;
  lngMultiPriceGroupCodes.value = res.data.STOREMULTI;
  lngStoreAttrs.value = res.data.STOREATTR;
  lngSubLeases.value = res.data.STORETYPE;
  lngStoreAreas.value = res.data.STOREAREA;
  lngSaleTypes.value = res.data.SALETYPE;
  lngSupervisors.value = res.data.SUPERVISOR;

  if (lngJoinTypes.value.length > 0) {
    lngJoinType.value = lngJoinTypes.value[0].lngCode;
    initlngJoinType.value = lngJoinTypes.value[0].lngCode;
  }
  if (lngMultiPriceGroupCodes.value.length > 0) {
    lngMultiPriceGroupCode.value =
      lngMultiPriceGroupCodes.value[0].lngMultiPriceGroupCode;
    initlngMultiPriceGroupCode.value =
      lngMultiPriceGroupCodes.value[0].lngMultiPriceGroupCode;
  }
  if (lngStoreAttrs.value.length > 0) {
    lngStoreAttr.value = lngStoreAttrs.value[0].lngStoreAttr;
    initlngStoreAttr.value = lngStoreAttrs.value[0].lngStoreAttr;
  }

  if (lngSubLeases.value.length > 0) {
    lngSubLease.value = lngSubLeases.value[0].lngCode;
    initlngSubLease.value = lngSubLeases.value[0].lngCode;
  }

  if (lngStoreAreas.value.length > 0) {
    lngStoreArea.value = lngStoreAreas.value[0].lngStoreArea;
    initlngStoreArea.value = lngStoreAreas.value[0].lngStoreArea;
  }

  // if(lngSaleTypes.value.length >0){
  //   lngSaleType.value = lngSaleTypes.value[0].lngSaleType

  // }
  // if(lngSupervisors.value.length >0){
  //   lngSupervisor.value = lngSupervisors.value[0].lngSupervisor

  // }

  // labelsData.value.push()
  // valuesData
  console.log(lngSupervisors.value);
  console.log(lngSaleTypes.value);
  console.log(lngMultiPriceGroupCodes.value);
  let sublabelarr = [];
  let subvaluearr = [];
  for (var i = 0; i < lngSupervisors.value.length; i++) {
    sublabelarr.push(lngSupervisors.value[i].strName);
    subvaluearr.push(lngSupervisors.value[i].lngSupervisor);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);
  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngSaleTypes.value.length; i++) {
    sublabelarr.push(lngSaleTypes.value[i].strSaleType);
    subvaluearr.push(lngSaleTypes.value[i].lngSaleType);
  }
  sublabelarr.push("없음");
  subvaluearr.push(0);
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);
  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngMultiPriceGroupCodes.value.length; i++) {
    sublabelarr.push(lngMultiPriceGroupCodes.value[i].strMultiPriceGroupName);
    subvaluearr.push(lngMultiPriceGroupCodes.value[i].lngMultiPriceGroupCode);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngJoinTypes.value.length; i++) {
    sublabelarr.push(lngJoinTypes.value[i].strName);
    subvaluearr.push(lngJoinTypes.value[i].lngCode);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngSubLeases.value.length; i++) {
    sublabelarr.push(lngSubLeases.value[i].strName);
    subvaluearr.push(lngSubLeases.value[i].lngCode);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngStoreAttrs.value.length; i++) {
    sublabelarr.push(lngStoreAttrs.value[i].strName);
    subvaluearr.push(lngStoreAttrs.value[i].lngStoreAttr);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  sublabelarr = [];
  subvaluearr = [];
  for (var i = 0; i < lngStoreAreas.value.length; i++) {
    sublabelarr.push(lngStoreAreas.value[i].strName);
    subvaluearr.push(lngStoreAreas.value[i].lngStoreArea);
  }
  sublabelarr.push(" ");
  subvaluearr.push(-1);
  sublabelarr.push(" ");
  subvaluearr.push(0);
  labelsData.value.push(sublabelarr);
  valuesData.value.push(subvaluearr);

  console.log(labelsData.value);
  console.log(valuesData.value);
  rowData.value = res.data.store;
  updateRowData.value = JSON.parse(JSON.stringify(rowData.value));
  store.dispatch("convertLoading", false);
  afterSearch.value = true;
  console.log(lngStoreArea.value);
};

const deleted = ref(false);
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
  deleted.value = !deleted.value;
};
const addrowDefault = ref("");
const addrowProp = ref("");
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
  addrowProp.value = `lngStoreCode,strName,strRegistNo,strDirector,strDealType,strDealKind,lngJoinType,lngSubLease,lngStoreAttr,lngStoreArea,dtmOpenDate,strTel,strFax,strZipCode,strAddress,strAddressEtc,strConvCode,strPhone,lngBEP,lngFloorSpace,lngLease,lngSupervisor,lngSaleType,dtmStop,strDev1,lngTable,lngMultiPriceGroupCode,strStoreHistory`;
  const currdate = new Date().toISOString().split("T")[0];
  addrowDefault.value =
    `,,,,,,` +
    initlngJoinType.value +
    `,` +
    initlngSubLease.value +
    `,` +
    initlngStoreAttr.value +
    `,` +
    initlngStoreArea.value +
    `,` +
    currdate +
    `,,,,,,,,,,,-1,-1,9999-12-31,,,` +
    initlngMultiPriceGroupCode.value +
    `, ,`;

  addRow4.value = !addRow4.value;
};

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
  if (JSON.stringify(updateRowData.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  console.log(updateRowData.value);

  const validateRow = updateRowData.value.filter(
    (item) =>
      item.strName == "" ||
      item.strName == " " ||
      item.strName == undefined ||
      item.lngStoreCode == "" ||
      item.lngStoreCode == " " ||
      item.lngStoreCode == undefined ||
      item.lngMultiPriceGroupCode == undefined ||
      item.lngMultiPriceGroupCode == "-1" ||
      item.lngJoinType == "-1" ||
      item.lngSubLease == "-1" ||
      item.lngStoreArea == "-1"
  ).length;
  if (validateRow > 0) {
    Swal.fire({
      title: "경고",
      text: "필수값이 누락되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const validateRow2 =
    new Set(updateRowData.value.map((item) => item.lngStoreCode)).size !==
    updateRowData.value.length;
  if (validateRow2 == true) {
    Swal.fire({
      title: "경고",
      text: "이미 등록되어 있는 매장코드입니다. 다른 숫자를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        console.log(updateRowData.value);
        const deleteStore = updateRowData.value
          .filter((item) => item.checkbox == true || item.deleted == true)
          .map((item) => item.lngStoreCode);
        const updateStoreCd = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngStoreCode);
        const updateStoreNm = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strName);
        const updatestrRegistNo = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strRegistNo);
        const updatestrDirector = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strDirector);
        const updatestrDealType = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strDealType);
        const updatestrDealKind = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strDealKind);
        const updatelngJoinType = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngJoinType);
        const updatelngSubLease = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngSubLease);
        const updatelngStoreAttr = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngStoreAttr);
        const updatelngStoreArea = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngStoreArea);
        const updatedtmOpenDate = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.dtmOpenDate);
        const updatedtmStop = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.dtmStop);
        const updatestrConvCode = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strConvCode);
        const updatestrZipCode = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strZipCode);
        const updatestrAddress = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strAddress);
        const updatestrAddressETC = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strAddressEtc);
        const updatestrTel = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strTel);
        const updatestrPhone = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strPhone);
        const updatestrFax = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strFax);
        const updatelngFloorSpace = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngFloorSpace);
        const updatelngLease = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngLease);
        const updatelngBEP = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngBEP);
        const updatelngSaleType = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngSaleType);
        const updatelngSupervisor = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngSupervisor);
        const updatestrDev1 = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strDev1);
        const updatelngTable = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngTable);
        const updatestrStoreHistory = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strStoreHistory);
        const updatelngMultiPriceGroupCode = updateRowData.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngMultiPriceGroupCode);

        const insertStoreCd = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngStoreCode);
        const insertStoreNm = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strName);
        const insertstrRegistNo = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strRegistNo);
        const insertstrDirector = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strDirector);
        const insertstrDealType = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strDealType);
        const insertstrDealKind = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strDealKind);
        const insertlngJoinType = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngJoinType);
        const insertlngSubLease = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngSubLease);
        const insertlngStoreAttr = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngStoreAttr);
        const insertlngStoreArea = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngStoreArea);
        const insertedtmOpenDate = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.dtmOpenDate);
        const insertedtmStop = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.dtmStop);
        const insertstrConvCode = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strConvCode);
        const insertstrZipCode = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strZipCode);
        const insertstrAddress = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strAddress);
        const insertstrAddressETC = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strAddressEtc);
        const insertstrTel = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strTel);
        const insertstrPhone = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strPhone);
        const insertstrFax = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strFax);
        const insertlngFloorSpace = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngFloorSpace);
        const insertlngLease = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngLease);
        const insertlngBEP = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngBEP);
        const insertlngSaleType = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngSaleType);
        const insertlngSupervisor = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngSupervisor);
        const insertstrDev1 = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strDev1);
        const insertlngTable = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngTable);
        const insertstrStoreHistory = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strStoreHistory);
        const insertlngMultiPriceGroupCode = updateRowData.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngMultiPriceGroupCode);

        const id = store.state.userData.strUserID;

        console.log(updatelngLease);
        const res = await saveStoreInfo(
          id,
          groupCd.value,
          deleteStore.join(","),

          // update 변수들
          updateStoreCd.join(","),
          updateStoreNm.join(","),
          updatestrRegistNo.join(","),
          updatestrDirector.join(","),
          updatestrDealType.join(","),
          updatestrDealKind.join(","),
          updatelngJoinType.join(","),
          updatelngSubLease.join(","),
          updatelngStoreAttr.join(","),
          updatelngStoreArea.join(","),
          updatedtmOpenDate.join(","),
          updatedtmStop.join(","),
          updatestrConvCode.join(","),
          updatestrZipCode.join(","),
          updatestrAddress.join(","),
          updatestrAddressETC.join(","),
          updatestrTel.join(","),
          updatestrPhone.join(","),
          updatestrFax.join(","),
          updatelngFloorSpace.join(","),
          updatelngLease.join(","),
          updatelngBEP.join(","),
          updatelngSaleType.join(","),
          updatelngSupervisor.join(","),
          updatestrDev1.join(","),
          updatelngTable.join(","),
          updatestrStoreHistory.join(","),
          updatelngMultiPriceGroupCode.join(","),
          // insert 변수들
          insertStoreCd.join(","),
          insertStoreNm.join(","),
          insertstrRegistNo.join(","),
          insertstrDirector.join(","),
          insertstrDealType.join(","),
          insertstrDealKind.join(","),
          insertlngJoinType.join(","),
          insertlngSubLease.join(","),
          insertlngStoreAttr.join(","),
          insertlngStoreArea.join(","),
          insertedtmOpenDate.join(","),
          insertedtmStop.join(","),
          insertstrConvCode.join(","),
          insertstrZipCode.join(","),
          insertstrAddress.join(","),
          insertstrAddressETC.join(","),
          insertstrTel.join(","),
          insertstrPhone.join(","),
          insertstrFax.join(","),
          insertlngFloorSpace.join(","),
          insertlngLease.join(","),
          insertlngBEP.join(","),
          insertlngSaleType.join(","),
          insertlngSupervisor.join(","),
          insertstrDev1.join(","),
          insertlngTable.join(","),
          insertstrStoreHistory.join(","),
          insertlngMultiPriceGroupCode.join(",")
        );
        console.log(res);
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
      } catch (error) {
        Swal.fire({
          title: "저장이 실패되었습니다.",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;
        searchButton();
      }
    }
  });
};

const selectedIndex2 = (e) => {
  changeRow.value = e;
};
const clickedRowData3 = (newValue) => {
  console.log(newValue);
  console.log(rowData.value);
  lngStoreCode.value = newValue[0]; // 1 -> 0
  strName.value = newValue[1]; // 2 -> 1
  strRegistNo.value = newValue[2]; // 3 -> 2
  strDirector.value = newValue[3]; // 4 -> 3
  strDealType.value = newValue[4]; // 5 -> 4
  strDealKind.value = newValue[5]; // 6 -> 5
  lngJoinType.value = newValue[6]; // 7 -> 6
  lngSubLease.value = newValue[8]; // 9 -> 8
  lngStoreAttr.value = newValue[10]; // 11 -> 10
  lngStoreArea.value = newValue[12]; // 13 -> 12
  dtmOpenDate.value = newValue[14]; // 15 -> 14
  strTel.value = newValue[15]; // 16 -> 15
  strFax.value = newValue[16]; // 17 -> 16
  strZipCode.value = newValue[17]; // 18 -> 17
  strAddress.value = newValue[18]; // 19 -> 18
  strAddressEtc.value = newValue[19]; // 20 -> 19
  strConvCode.value = newValue[20]; // 21 -> 20
  strPhone.value = newValue[21]; // 22 -> 21
  lngBEP.value = newValue[22]; // 23 -> 22
  lngFloorSpace.value = newValue[23]; // 24 -> 23
  lngLease.value = newValue[24]; // 25 -> 24
  lngSupervisor.value = newValue[25]; // 26 -> 25
  lngSaleType.value = newValue[26]; // 27 -> 26
  dtmStop.value = newValue[27]; // 28 -> 27
  strDev1.value = newValue[28]; // 29 -> 28
  lngTable.value = newValue[29]; // 30 -> 29
  lngMultiPriceGroupCode.value = newValue[30]; // 31 -> 30
  strStoreHistory.value = newValue[31]; // 32 -> 31

  if (newValue[33] == true) {
    disableStoreCode.value = false;
  } else {
    disableStoreCode.value = true;
  }
};
const lngStoreCode = ref();
const strName = ref();
const strRegistNo = ref();
const strDirector = ref();
const strDealType = ref();
const strDealKind = ref();
const lngJoinType = ref();
const lngSubLease = ref(" ");
const lngStoreAttr = ref();
const lngStoreArea = ref();
const dtmOpenDate = ref(new Date().toISOString().split("T")[0]);
const strTel = ref();
const strFax = ref();
const strZipCode = ref();
const strAddress = ref();
const strAddressEtc = ref();
const strConvCode = ref();
const strPhone = ref();
const lngBEP = ref();
const lngFloorSpace = ref();
const lngLease = ref();
const lngSaleType = ref();
const lngSupervisor = ref();
const dtmStop = ref(new Date("9999-12-31").toISOString().split("T")[0]);
const strDev1 = ref();
const strStoreHistory = ref();
const lngTable = ref();
const lngMultiPriceGroupCode = ref();

const changeValue = ref();
const changeRow = ref();
const changeColid = ref();
const changeNow = ref(false);
const updateGridValue = (e) => {
  const name = e.target.name;
  const value = e.target.value;

  changeColid.value = name;
  changeValue.value = value;
  changeNow.value = !changeNow.value;
};
const updateRowData = ref([]);
const updatedRowData = (newvalue) => {
  updateRowData.value = newvalue;
  console.log(updateRowData.value);
};

watch(dtmOpenDate, () => {
  console.log(dtmOpenDate.value);
});
watch(dtmStop, () => {
  console.log(dtmStop.value);
});
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
