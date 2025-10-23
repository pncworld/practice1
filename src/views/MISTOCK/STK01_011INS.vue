<!-- /*--############################################################################
# Filename : STK01_011INS.vue                                                  
# Description : 자재관리 > 청구 관리 > 청구 등록               
# Date :2025-09-25                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button
          @click="addButton"
          class="button new md:w-auto w-14 disabled:bg-opacity-50"
          :disabled="limitStore == '2'">
          신규
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-14 items-start z-10">
      <div class="flex space-x-5 items-center">
        <Datepicker2
          :mainName="'청구일자'"
          :initToday="1"
          @endDate="endDate"
          @startDate="startDate"></Datepicker2>
      </div>
      <div class="flex space-x-5 mt-2 items-center">
        <div class="text-base font-semibold">청구매장</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black w-48 h-7"
            v-model="cond">
            <option :value="i.lngStoreCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'STK01_011INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :documentTitle="'STK01_011INS'"
        @updatedRowData="updatedRowData"
        @clickedButtonCol="clickedButtonCol"
        @dblclickedRowData="dblclickedRowData"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'Selected'"
        :checkAbleExpressionCol="'Selected'"
        :checkAbleExpressionCol2="'lngStatus'"
        :checkAbleExpressionVal="'02,07,06,05,04'"
        :checkAbleExpressionCol3="'lngStatus'"
        :checkAbleExpressionVal2="'01'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>

  <div
    class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    v-if="open">
    <!-- 팝업 내용 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[900px] h-[700px]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">청구 등록 팝업</h2>
        <div class="flex space-x-3">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            :disabled="limitStore == '2'"
            @click="saveButton">
            저장
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            @click="excelButton2">
            엑셀
          </button>
          <button
            class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-blue-600"
            @click="open = false">
            닫기
          </button>
        </div>
      </div>
      <div class="grid grid-rows-1 grid-cols-3 border border-black mt-1">
        <div class="flex">
          <div
            class="text-base font-semibold bg-gray-100 border-r border-black w-[40%] flex items-center justify-center">
            청구일자
          </div>
          <div class="border-r border-black flex justify-center items-center">
            <input
              type="date"
              class="border border-black"
              v-model="scond"
              @change="searchButton2"
              :disabled="disabled" />
          </div>
        </div>
        <div class="flex">
          <div
            class="text-base font-semibold bg-gray-100 border-r border-l border-black w-[40%] flex items-center justify-center">
            청구매장
          </div>
          <div
            class="border-r border-black flex justify-center items-center w-full">
            <select
              name=""
              id=""
              disabled
              v-model="scond2"
              class="w-[60%] h-[80%] border border-black disabled:bg-gray-200">
              <option :value="i.lngStoreCode" v-for="i in optionList">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex">
          <div
            class="text-base font-semibold bg-gray-100 border-r border-l border-black w-[40%] flex items-center justify-center">
            청구번호
          </div>
          <div class="border-r border-black flex justify-center items-center">
            <input
              type="text"
              class="border border-black"
              v-model="scond3"
              disabled />
          </div>
        </div>
      </div>
      <div class="h-[75%] w-full mt-2">
        <Realgrid
          :progname="'STK01_011INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :documentTitle="'STK01_011INS'"
          :rowStateeditable="false"
          :editableColId="editableColId"
          @updatedRowData="updatedRowData2"
          :editableColByCondition="true"
          :CalculateTaxColId4="'curTax'"
          :CalculateSumColId2="'curSupply'"
          :documentSubTitle="documentSubTitle2"
          :exporttoExcel="exporttoExcel2"
          :setStateBar="false"></Realgrid>
      </div>

      <div class="flex flex-col">
        <div class="border border-black text-base font-semibold w-[10%]">
          코멘트
        </div>
        <textarea
          name=""
          id=""
          v-model="scond4"
          :disabled="disabled2"
          class="border border-black w-full h-full"></textarea>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteDemandMaster,
  getCheckAbility,
  getDemandStoreList,
  getDemCloseTime,
  getStockDemandList2,
  getStockDetail2,
  InsertDemandMasterDetail,
  updateDemandMaster,
} from "@/api/mistock";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import {
  formatLocalDate,
  insertPageLog,
  formatDateTime2,
} from "@/customFunc/customFunc";
import { onMounted, ref } from "vue";

import Datepicker2 from "@/components/Datepicker2.vue";
import Swal from "sweetalert2";
import { useStore } from "vuex";

const optionList = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

/**
 * 선택한 매출 시작일자
 */

const cond = ref("0");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("0");
const tempSeeStore = ref(false);
const reportCheckData = ref("0");
const progId = ref("1");

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/**
 *  조회 함수
 */

const cond6 = ref(true);
const checkCond = (e) => {
  cond6.value = e.target.checked;
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStore = ref(0);

/**
 * 	화면 Load시 실행 스크립트
 */

const limitStore = ref("0");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getDemandStoreList(store.state.userData.lngStoreGroup, 0);

  optionList.value = res.data.List;

  if (res.data.List.length > 0) {
    cond.value = res.data.List[0].lngStoreCode;
  }

  const res2 = await getCheckAbility(
    store.state.userData.lngStoreGroup,
    store.state.userData.lngPosition
  );
  limitStore.value = res2.data.List[0].lngChk;

  if (limitStore.value == "2") {
    await Swal.fire({
      title: "경고",
      text: "현재 매장은 청구 제한 매장입니다. 조회만 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
});

/**
 * 그리드 초기화
 */
const disabled2 = ref(false);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  const filterd =
    optionList.value.filter((item) => item.lngStoreCode == cond.value)[0]
      ?.strName || "";
  documentSubTitle.value =
    "청구일자 :" +
    sdate.value +
    "~" +
    edate.value +
    "\n" +
    "청구매장 : " +
    filterd;

  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const setStoreArea = async (e) => {
  const res2 = await getDemCloseTime(
    store.state.userData.lngStoreGroup,
    e.target.value
  );

  if (res2.data.List.length > 0) {
    cond2.value = res2.data.List[0].dtmClosehour;
    cond3.value = res2.data.List[0].dtmCloseMin;
    cond4.value = res2.data.List[0].pre_date;
  }
};

const onlyNumber = (e) => {
  if (e.target.name == "cond2") {
    cond2.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "cond3") {
    cond3.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "cond4") {
    cond4.value = e.target.value.replace(/[^0-9]/g, "");
  }
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  updatedrowdata.value = e;
};
const saveButton = async () => {
  if (disabled.value == true) {
    try {
      store.state.loading = true;

      const res = await updateDemandMaster(
        store.state.userData.lngStoreGroup,
        scond2.value,
        scond.value.replaceAll("-", ""),
        scond3.value,
        scond4.value,
        tempdtmEndDate.value + ":00"
      );

      store.state.loading = false;
      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "청구등록이 저장 되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        openPopUp.value = false;
      } else {
        await Swal.fire({
          title: "경고",
          text: `${res.data.RESULT_NM}`,
          icon: "warning",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
    } finally {
      open.value = false;
      searchButton();
    }
  } else {
    try {
      const ddate = updatedrowdata2.value
        .map((item) => item.dtmEndDate.split(" ")[0].replaceAll("-", ""))
        .join("\u200b");
      const edate = updatedrowdata2.value
        .map((item) =>
          formatLocalDate(item.dtmPreExpectedDate).replaceAll("-", "")
        )
        .join("\u200b");
      const lngstocks = updatedrowdata2.value
        .map((item) => item.lngStockID)
        .join("\u200b");
      const qtys = updatedrowdata2.value
        .map((item) => item.dblDemandQty)
        .join("\u200b");
      store.state.loading = true;

      const res = await InsertDemandMasterDetail(
        store.state.userData.lngStoreGroup,
        scond2.value,
        scond.value.replaceAll("-", ""),
        scond4.value,
        1,
        ddate,
        edate,
        lngstocks,
        qtys,
        store.state.userData.lngSequence,
        0,
        "",
        ""
      );
      console.log(res);
      store.state.loading = false;
      if (res.data.RESULT_CD == "00") {
        await Swal.fire({
          title: "성공",
          text: "신규 청구등록이 저장 되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        openPopUp.value = false;
      } else {
        await Swal.fire({
          title: "경고",
          text: "신규  청구등록 저장을 실패하였습니다.",
          icon: "warning",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      open.value = false;
      searchButton();
    }
  }
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getStockDemandList2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
      sdate.value.replaceAll("-", ""),
      edate.value.replaceAll("-", "")
    );

    console.log(res);

    store.state.loading = false;
    rowData.value = res.data.List;
    afterSearch.value = true;
  } catch (error) {}
};

const sdate = ref("");
const startDate = (e) => {
  sdate.value = e;
};
const edate = ref("");
const endDate = (e) => {
  edate.value = e;
};

const tempColID = ref("");
const clickedButtonCol = (e) => {
  tempColID.value = e;
};

const clickedrowdata = ref("");

const open = ref(false);
const disabled = ref(false);

const rowData2 = ref([]);
const scond4 = ref("");

const editableColId = ref("");
const tempdtmEndDate = ref("");
const dblclickedRowData = async (e) => {
  console.log(e);
  //   console.log(tempColID.value);

  editableColId.value = "";
  if (tempColID.value == "strStoreName" || tempColID.value == "strDemandNo") {
    disabled.value = true;
    scond.value =
      e[3].slice(0, 4) + "-" + e[3].slice(4, 6) + "-" + e[3].slice(6, 8);
    scond2.value = e[11];
    scond3.value = e[2];

    try {
      store.state.loading = true;
      const res = await getStockDetail2(
        store.state.userData.lngStoreGroup,
        e[11],
        store.state.userData.strLanguage,
        e[2],
        e[3]
      );

      console.log(res);

      store.state.loading = false;
      rowData2.value = res.data.List;
      scond4.value = res.data.List2[0].strComments;

      disabled2.value =
        new Date(formatDateTime2(new Date()).slice(0, 16)) >
        new Date(rowData2.value[0].dtmEndDate);

      tempdtmEndDate.value = rowData2.value[0].dtmEndDate;
    } catch (error) {}
    open.value = true;
  }
};

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");

const exporttoExcel2 = ref(false);
const excelButton2 = () => {
  const storeNm = optionList.value.filter(
    (item) => item.lngStoreCode == scond2.value
  )[0].strName;
  documentSubTitle2.value =
    "청구일자 :" +
    scond.value +
    "\n" +
    "매장명 :" +
    storeNm +
    "\n" +
    "청구번호 :" +
    scond3.value;

  exporttoExcel2.value = !exporttoExcel2.value;
};

const addButton = async () => {
  disabled.value = false;

  scond.value = formatLocalDate(new Date());
  scond2.value = cond.value;
  scond3.value = "";
  editableColId.value = "dblDemandQty";
  rowData2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
      "",
      formatLocalDate(new Date()).replaceAll("-", "")
    );

    //console.log(res);

    store.state.loading = false;
    rowData2.value = res.data.List;

    scond4.value = "";
  } catch (error) {}
  open.value = true;
};

const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  updatedrowdata2.value = e;
};

const searchButton2 = async (e) => {
  rowData2.value = [];

  try {
    store.state.loading = true;
    const res = await getStockDetail2(
      store.state.userData.lngStoreGroup,
      cond.value,
      store.state.userData.strLanguage,
      "",
      String(e.target.value).replaceAll("-", "")
    );

    console.log(res);

    store.state.loading = false;
    rowData2.value = res.data.List;
    scond4.value = res.data.List2[0].strComments;
  } catch (error) {}
};

const deleteButton = async () => {
  const filtered = updatedrowdata.value.filter((item) => item.Selected == true);

  if (filtered.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 청구 사항을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
  }

  try {
    const storecds = filtered.map((item) => item.lngStoreCode).join("\u200b");
    const demandnos = filtered.map((item) => item.strDemandNo).join("\u200b");
    const demanddates = filtered
      .map((item) => item.dtmDemandDate)
      .join("\u200b");

    const res = await deleteDemandMaster(
      store.state.userData.lngStoreGroup,
      storecds,
      demandnos,
      demanddates,
      store.state.userData.lngSequence
    );

    console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "청구 사항이 삭제 되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      openPopUp.value = false;
    } else {
      await Swal.fire({
        title: "경고",
        text: "청구 사항이 삭제를 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>
