<!-- /*--############################################################################
# Filename : MST44_057INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > SAF 마스터다운로드.                  #
#Date :2025-08-14                                                              #
#Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <!-- <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div> -->
    </div>
    <div
      class="grid grid-rows-1 grid-cols-1 justify-between bg-gray-200 rounded-lg h-14 items-start z-10">
      <div class="ml-12 flex">
        <!-- <PickStoreRenew3
          @lngStoreCode="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="changeStoreType"
          @excelStore="excelStore"></PickStoreRenew3> -->
        <Datepicker1 :mainName="'수신 기준일'"> </Datepicker1>
        <div class="ml-5 mt-2">
          <button class="button received !w-20" @click="receiveButton">
            수신
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-start items-center pl-12 bg-orange-100 space-x-80">
      <div class="flex items-center">
        <div class="text-base font-semibold">브랜드 선택</div>
        <div class="ml-5">
          <input type="text" class="border border-black h-7" v-model="cond" />
        </div>
        <div class="ml-5">
          <button class="button search" @click="searchButton">검색</button>
        </div>
      </div>
      <div class="text-base font-semibold">수신 항목 선택</div>
      <div class="text-base font-semibold pl-32">수신 진행 상황</div>
    </div>

    <div class="grid grid-rows-1 grid-cols-3 h-[75%] w-[95%] mt-2 space-x-5">
      <Realgrid
        :progname="'MST44_057INS_VUE'"
        :progid="1"
        :rowData="rowData"
        @checkedRowData="checkedRowData"
        :rowStateeditable="false">
      </Realgrid>
      <Realgrid
        :progname="'MST44_057INS_VUE'"
        :progid="2"
        :rowData="rowData2"
        @checkedRowData="checkedRowData2"
        :rowStateeditable="false">
      </Realgrid>
      <div class="h-[95%]">
        <div class="h-[5%] border border-black">
          <input
            type="text"
            class="h-full w-full text-red-600"
            disabled
            v-model="currentState" />
        </div>
        <Realgrid
          :progname="'MST44_057INS_VUE'"
          :progid="3"
          :rowData="rowData3"
          :rowStateeditable="false">
        </Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getSAFMasterDownload, pncInterFaceAPI } from "@/api/master";
import Datepicker1 from "@/components/Datepicker1.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장 선택 컴포넌트
 *  */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
  ////console.log(store.state.userData);

  searchButton();
});

const selectedStartDate = ref();
const selectedEndDate = ref();

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  selectedStartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectedEndDate.value = e;
};
/**
 * 페이지 매장 그룹 세팅
 */

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;
//comsole.log(store);
const cond = ref("");
const afterSearch = ref(false);
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    const res = await getSAFMasterDownload(cond.value, "SAF");
    const res2 = await getCommonList(358);
    ////console.log(res);

    rowData.value = res.data.List;
    rowData2.value = res2.data.List;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/**
 * 선택한 매장 코드 호출 함수
 */

/**
 * 선택한 매장 그룹 코드 호출 함수
 */

const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);

const selectedPosNo = ref();

const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length != 0) {
    rowData3.value = [];
  }
};

const storeType = ref("");

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

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  checkedrowdata.value = e;
};
const checkedrowdata2 = ref([]);
const checkedRowData2 = (e) => {
  checkedrowdata2.value = e;
};

const currentState = ref("");
const receiveButton = async (e) => {
  if (checkedrowdata.value.length == 0) {
    await Swal.fire({
      title: "경고",
      text: `하나 이상의 브랜드코드를 체크해주세요.`,
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }
  if (checkedrowdata2.value.length == 0) {
    await Swal.fire({
      title: "경고",
      text: `하나 이상의 수신항목을 체크해주세요.`,
      icon: "warning",

      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "알림",
    text: `정말 수신 하시겠습니까?`,
    icon: "info",
    cancelButtonText: "취소",
    showCancelButton: true,
    confirmButtonText: "확인",
  }).then(async (result) => {
    if (result.isConfirmed == true) {
      try {
        store.state.loading = true;
        rowData3.value = checkedrowdata.value.flatMap((item1) =>
          checkedrowdata2.value.map((item2) => ({
            ...item1,
            ...item2,
          }))
        );
        const date = new Date();

        const date2 = formatLocalDate(date).replaceAll("-", "");
        let sum = checkedrowdata.value.length * checkedrowdata2.value.length;
        let cur = 0;
        let res;
        // currentState.value =
        //   checkedrowdata.value[0].strName +
        //   "-" +
        //   checkedrowdata2.value[0].strDName +
        //   `수신 중 ( ${cur}/${sum} )`;

        // console.log(
        //   checkedrowdata.value[0].lngStoreGroup,
        //   checkedrowdata2.value[0].strDCode
        // );
        console.log(checkedrowdata.value);
        console.log(checkedrowdata2.value);
        for (let i = 0; i < checkedrowdata.value.length; i++) {
          for (let j = 0; j < checkedrowdata2.value.length; j++) {
            res = await pncInterFaceAPI(
              "SAFMasterInfoGetService.asmx/GET_SAF_MASTER_INFO",
              "BrandCode\u200bDeptCode\u200bLastUpdateTime\u200bMenuType",
              `${
                checkedrowdata.value[i].lngStoreGroup
              }\u200b${0}\u200b${date2}\u200b${
                checkedrowdata2.value[j].strDCode
              }`
            );
            console.log(res);
            if (res.data.List.includes("SUCCESS")) {
              cur += 1;
              currentState.value =
                checkedrowdata.value[i].strName +
                "-" +
                checkedrowdata2.value[j].strDName +
                `수신 중 ( ${cur}/${sum} )`;
              rowData3.value = rowData3.value.filter(
                (item) =>
                  !(
                    item.strDCode == checkedrowdata2.value[j].strDCode &&
                    item.lngStoreGroup == checkedrowdata.value[i].lngStoreGroup
                  )
              );
            } else {
              Swal.fire({
                title: "경고",
                text: `${checkedrowdata.value[i].strName}
                -${checkedrowdata2.value[j].strDName}에서 오류가 발생하였습니다. 확인해주세요.`,
                icon: "error",

                confirmButtonText: "확인",
              });
              return;
            }
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        store.state.loading = false;
        searchButton();
        currentState.value = "";
      }
    } else {
      return;
    }
  });
};
</script>
