<!-- /*--############################################################################
# Filename : HR06_002INS.vue
# Description : 인사관리 > 마감관리 > 출퇴근 마감
# Date :2025-09-12
# Author : 권지안
################################################################################*/ -->
<template>
  <!-- 기본버튼 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButtonMagam" class="button search md:w-34 whitespace-nowrap">마감내역 조회</button>
      <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
      <button @click="saveButton" class="button save w-auto">저장</button>
    </div>
  </div>
  <br />
  <!-- 조회조건 -->
  <div class="flex space-x-96 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <div class="flex items-center justify-center space-x-5">
      <div class="text-base font-semibold text-nowrap ml-12">년도</div>
        <div>
          <v-select
            class="custom-select8 w-32 bg-white"
            :placeholder="'선택'"
            v-model="selectedYear"
            :options="yearsArray">
            <!-- <option :value="i" v-for="i in yearsArray">{{ i }}</option> -->
          </v-select>
        </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
  <div class="flex justify-center w-[97%] h-[60vh] gap-5 ml-5">
    <Realgrid
      class="w-full h-full mt-2"
      :progname="'HR06_002INS_VUE'"
      :progid="1"
      :rowData="rowData"
      :changeNow2="changeNow"
      @selectedIndex="selectedIndex"
      :changeRow="changeRow"
      :changeColid="'strNote'"
      :changeValue2="changeValue2"
      @updatedRowData2="updatedRowData"
      @updatedRowData="updatedRowData"
      @checkedRowData="checkedRowData"
      @allStateRows="allStateRows"
      @clickedRowData="clickedRowData"
      :headerCheckBar="'lngFlag'"
      :documentTitle="'HR06_002INS'"
      :editableColId="'strNote'"
      :rowStateeditable="false"
      :checkRenderEditable="true"
      :selectionStyle="'block'"
      >
    </Realgrid>
  </div>
  <div v-show="searchButtonMagam2" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-4/5 h-4/5 overflow-auto">
    <!-- 1줄째: 제목 + 버튼 -->
    <div class="flex justify-between items-center">
      <!-- 왼쪽 제목 -->
      <span class="text-2xl font-semibold">월별 마감 현황 조회</span>
      <!-- 오른쪽 버튼들 -->
      <div class="flex space-x-2">
        <button @click="searchButtonPopup" class="button search md:w-auto w-14">조회</button>
        <button @click="excelButton" class="button excel w-auto">엑셀</button>
      </div>
    </div>
    <br/>
    <!-- 2줄째: 조회 월 + 매장 선택 -->
    <div class="flex justify-between items-center bg-gray-200 p-3 rounded">
    <!-- 왼쪽: 조회 월 + 마감여부 -->
    <div class="flex flex-col space-y-2">
      <!-- 조회 월 -->
      <div class="flex items-center space-x-2">
        <div class="text-base font-semibold whitespace-nowrap ml-3">조회 월</div>
          <v-select
            class="custom-select8 w-32 bg-white"
            :placeholder="'선택'"
            v-model="selectedPopupYear"
            :options="popupyearsArray">
          </v-select>
          <v-select
            class="custom-select8 w-32 bg-white"
            :placeholder="'선택'"
            v-model="selectedPopupMonth"
            :options="popupMonthsArray">
          </v-select>
      </div>
      <!-- 마감여부 -->
      <div class="flex items-center space-x-2">
        <div class="text-base font-semibold whitespace-nowrap ml-1">마감여부</div>
        <v-select
            v-model="selectedCloseStatus"
            :options="closeStatusItems"
            :placeholder="'전체'"
            label="label"
            :reduce="option => option.value"
            class="custom-select8 w-32 bg-white"
        />
      </div>
    </div>
      <!-- 오른쪽 끝: 매장 선택 -->
      <div class="flex items-center mr-14">
        <PickStoreRenew3
          @lngStoreCode="lngStoreCodes"
          @lngStoreGroup="lngStoreGroup"
          @excelStore="excelStore"
          @lngStoreAttrs="lngStoreAttrs"
          @lngStoreTeam="lngStoreTeam"
          @lngSupervisor="lngSupervisor"
          :resetFlag="resetFlag"
        />
      </div>
    </div>
    <br/>
    <!-- 그리드 영역 -->
    <div class="flex justify-center w-[100%] h-[50vh] gap-5">
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'HR06_002INS_VUE'"
        :progid="2"
        :rowData="rowData2"
        @clickedRowData="clickedRowData"
        @allStateRows="allStateRows"
        :documentTitle="'HR06_002INS'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel"
        :editableColId="'strNote'"
        :rowStateeditable="false"
        :selectionStyle="'block'">
      </Realgrid>
    </div>
    <!-- 하단 닫기 버튼 -->
    <div class="flex justify-center mt-10">
      <button @click="closePopup" class="p-2 bg-blue-500 text-white rounded">
        닫기
      </button>
    </div>
  </div>
</div>
  <!-- 그리드 영역 -->
</template>

<script setup>

import { getCommuteDeadline, setCommuteDeadline, getMonthlyMagamStatus} from "@/api/mihr";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";

/**
 *  매장 선택 컴포넌트
 *  */

import PickStoreRenew3 from "@/components/pickStoreRenew.vue";

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import { compareByFieldSpecs } from "@fullcalendar/core/internal";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/*
  년도 콤보박스 
 */
const selectedYear = ref(new Date().getFullYear());
const Years = new Date().getFullYear();
const yearsArray = Array.from({ length: 11 }, (_, i) => Years - 10 + i).sort(
  (a, b) => b - a
);

// selectedYear 변경 감지
watch(selectedYear, (newVal, oldVal) => {
  // console.log("년도 변경됨:", oldVal, "→", newVal);
  rowData.value = [];   // 데이터 초기화
});

/*
  년도 팝업 콤보박스 
 */
const selectedPopupYear = ref(new Date().getFullYear());
const popupYears = new Date().getFullYear();
const popupyearsArray = Array.from({ length: 11 }, (_, i) => popupYears - 10 + i).sort(
  (a, b) => b - a
);

/*
  월 팝업 콤보박스
*/
const selectedPopupMonth = ref(new Date().getMonth()); 
const popupMonthsArray = Array.from({ length: 12 }, (_, i) => i+1); 

/**
 * 그리드1 초기화
 */

const initGrid = () => {
  if (rowData.value.length != 0) {
    rowData.value = [];
  }
};

/**
 * 그리드2 초기화
 */

const initGrid2 = () => {
  if (rowData2.value.length != 0) {
    rowData2.value = [];
  }
};

/*
  마감여부 팝업 콤보박스
*/

const selectedCloseStatus = ref(0);  // 기본값 ""
// const closeStatusItems = ['전체', '마감', '미마감'];

const closeStatusItems = [
  { label: "전체", value: 0 },
  { label: "마감", value: 1 },
  { label: "미마감", value: 2 },
];

const groupCd = ref("");  // 기본값 ""
const storeCd = ref("");  // 기본값 ""
const attrCd = ref("");  // 기본값 ""

/**
 * 선택한 매장 코드 호출 함수
 */
const lngStoreGroup = (e) => {
  groupCd.value = e;
};

/**
 * 선택한 매장 그룹 코드 호출 함수
 */
const lngStoreAttrs = (e) => {
  attrCd.value = e;
  initGrid2();
};

/**
 * 선택한 매장 코드 호출 함수
 */
const lngStoreCodes = (e) => {
  storeCd.value = e;
  initGrid2();
};


/**
 * 	화면 Load시 실행 스크립트
 */
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const searchButtonMagam2 = ref(false);

const searchButtonMagam = () => {
  searchButtonMagam2.value = true;
};

const resetFlag = ref(false);

const closePopup = () => {
  searchButtonMagam2.value = false;

  // ✅ 닫을 때만 데이터 초기화
  initGrid2();
  rowData2.value = [];
  storeCd.value  = "";  // 기본값 ""
  selectedPopupYear.value   = new Date().getFullYear();  // 기본값 ""
  selectedPopupMonth.value  = new Date().getMonth();  // 기본값 ""
  selectedCloseStatus.value = "";  // 기본값 ""

  resetFlag.value = !resetFlag.value; // 토글 → 자식에서 watch됨
  // console.log("resetFlag 토글됨:", resetFlag.value);  // ← 값이 변하는지 확인

};

/**
 *  그리드 검색어 세팅
 */
const store = useStore();

/**
 * 조회 초기화
 */

const allstaterows = ref([]);
const rowData = ref([]);
const rowData2 = ref([]);

const allStateRows = (e) => {
  //console.log(e);
  allstaterows.value = e.updated;
};

/**
 *  조회 함수
 */

const searchButton = async () => {

  // console.log( selectedYear.value);

  try {
    const res = await getCommuteDeadline(
      store.state.userData.lngStoreGroup,
      selectedYear.value,
    );

    // console.log(res);

    rowData.value = res.data.List;
  } catch (error) {}
};

/**
 *  조회 함수
 */

const searchButtonPopup = async () => {

  // console.log(selectedCloseStatus.value);

  try {
    const res = await getMonthlyMagamStatus(
      groupCd.value,
      attrCd.value,
      storeCd.value,
      selectedPopupYear.value,
      selectedPopupMonth.value,
      selectedCloseStatus.value,
    );

    // console.log(res);

    rowData2.value = res.data.List2;

  } catch (error) {}
};

/**
 * 데이터셋 상세정보 셋팅
 */

const changeRow = ref(0)
const selectedIndex = (e) => {
//  console.log(e)
 changeRow.value = e;
}
const changeValue2 = ref('')

const changeNow = ref(false)
const clickedrowData = ref([]);
const clickedRowData = (newValue) => {
  // console.log(newValue);
  clickedrowData.value = newValue;

  if(clickedrowData.value[2]== true ){    
   const now = new Date();
   const year = now.getFullYear();
   const month = String(now.getMonth() + 1).padStart(2, "0");
   const day = String(now.getDate()).padStart(2, "0");
   changeValue2.value = `${year}-${month}-${day} 마감, ` + '완료상태(' + clickedrowData.value[1] + ')';
   changeNow.value = !changeNow.value;

  } else if(clickedrowData.value[2]== false ) {
   changeValue2.value = '';
   changeNow.value = !changeNow.value;
  }
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedrowdata = ref([]);

/**
 * 입력창 수정 데이터 갱신
 */
const updatedRowData = (newValue) => {
  console.log(newValue);
  updatedrowdata.value = newValue;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (allstaterows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",

      confirmButtonText: "확인",
    });
  }
  try {
    await Swal.fire({
      title: "확인",
      text: "저장하시겠습니까?",
      icon: "warning", // 'success', 'error', 'warning', 'info', 'question'
      showCancelButton: true, // 취소 버튼 표시
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then(async (result) => {
      if (result.isConfirmed) {
        store.state.loading = true;

        // console.log(updatedrowdata.value);

        const dtmMonths = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.dtmMonth)
          .join("\u200b");
        const strNotes = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => item.strNote)
          .join("\u200b");
        const lngFlags = updatedrowdata.value
          .filter((_, index) => allstaterows.value.includes(index))
          .map((item) => (item.lngFlag == true ? 1 : 0))
          .join("\u200b");

        // console.log(dtmMonths);
        // console.log(strNotes);
        // console.log(lngFlags);

        const res = await setCommuteDeadline(
          store.state.userData.lngStoreGroup,
          dtmMonths,
          strNotes,
          lngFlags,
        );
        store.state.loading = false;

        console.log(res);

        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "성공",
            text: "저장에 성공하였습니다.",
            icon: "success", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        } else {
          Swal.fire({
            title: "실패",
            text: "저장에 실패하였습니다.",
            icon: "error", // 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: "확인",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    });
  } catch (error) {
  } finally {
    searchButton();
  }
};

const exportExcel = ref(false);
const selectedExcelStore = ref("");
const selectedExcelDate = ref("");
const documentSubTitle = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
};

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
      "조회 월 : " + selectedPopupYear.value + "년 " + selectedPopupMonth.value + "월"
    + selectedExcelDate.value + "\n" + selectedExcelStore.value;
  exportExcel.value = !exportExcel.value;
};

</script>

<style></style>