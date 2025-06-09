/*--############################################################################
# Filename : HR01_003INS.vue                                                    
# Description : 인사관리 > 마스터 관리 > 근태유형 등록.                        
# Date :2025-06-05                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="editButton" class="button primary md:w-auto w-14">
          수정
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          삭제
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[80%] grid grid-rows-1 grid-cols-[7fr,5fr] mt-5">
      <Realgrid
        :progname="'HR01_003INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :checkRowAuto="false"
        @clickedRowData="clickedRowData"
        @allStateRows="allStateRows"
        @sendRowState="sendRowState"
        @selectedIndex="selectedIndex"
        @updatedRowData="updatedRowData"
        :addRow4="addRow4"
        :addrowProp="'checkbox,strName,strTypeCls,strTimeCls,timSetTime,timApprovalTime,timIncludOT,strAlias,lngCode,lngTypeCls,lngTimeCls'"
        :addrowDefault="addrowDefault"
        :documentTitle="'HR01_003INS'"
        :changeValue2="changeValue2"
        :changeColid="changeColid"
        :changeRow="changeRow"
        :changeNow="changeNow"
        :dynamicRowHeight="true"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :checkRenderEditable="true"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import "vue3-timepicker/dist/VueTimepicker.css";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	매장 단일 선택 컴포넌트
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

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import {
  deleteAttendTypeList,
  deletePayItemList,
  getAttType,
  saveAttendType,
  saveHRPay,
  saveHRPay2,
  updateAttendType,
} from "@/api/mihr";
import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList3 = ref([]);

const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref(1);
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const addrowDefault = ref("false, , , , , , , , , , , ");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //reload.value = !reload.value;
  searchButton();
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const store = useStore();

const clickedRowData = (e) => {
  //disablegrid.value = true;
  //insertupdatedelete.value = 2;
  //console.log(e);
  gridvalue1.value = e[1];
  gridvalue2.value = e[2];

  gridvalue5.value = e[4];
  gridvalue6.value = e[5];
  gridvalue7.value = e[7];
  gridvalue8.value = e[8];
};

const updateStateRow = ref([]);
const allStateRows = (e) => {
  updateStateRow.value = e;
};
const sendRowState = (e) => {
  console.log(e);
  if (e == "created") {
    disablegrid.value = false;
  } else {
    disablegrid.value = true;
  }
};

const changeRow = ref(null);
const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeNow = ref(false);
const changeColid = ref("");
const changeValue2 = ref("");

const changeValue = (e) => {
  changeColid.value = e.target.name;
  changeValue2.value = e.target.value;

  changeNow.value = !changeNow.value;
};

const updateRow = ref([]);
const updatedRowData = (e) => {
  updateRow.value = e;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    reload.value = !reload.value;
    const res = await getAttType(store.state.userData.lngStoreGroup);
    console.log(res);
    rowData.value = res.data.List;
    updateRow.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};
const disablegrid = ref(true);
const insertupdatedelete = ref(1);
const addRow4 = ref(false);
const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "근태유형 등록(신규/수정)",
    html: `
    <div class="h-[20%] !w-[70%] flex justify-start items-center text-nowrap">
      <div class="font-semibold text-base">근태 유형명</div>
    <div class="flex justify-center items-center w-[95%] ml-10"><input type="text" id="myText" class="swal2-input !h-[70%] " placeholder="입력" ></div></div>
   <div style="display : flex ;  white-space: nowrap; align-items: center; justify-content: start ;" >
     <div style="display : flex ;  white-space: nowrap; align-items: center; justify-content: start ;" class="mt-5 font-semibold text-base">구분</div>
    <div class="ml-20 flex mt-5 space-x-4">
      <label><input type="radio" name="myRadio" value="1" checked> 휴무</label><br>
      <label><input type="radio" name="myRadio" value="2"> 근무인정</label>
    </div>
    </div>

     <div class="h-[20%] flex justify-start items-center text-nowrap" >
     <div style="display : flex ;  white-space: nowrap; align-items: center; justify-content: start ;" class="mt-5 font-semibold text-base">시간관리</div>
    <div class="ml-12 flex mt-2 space-x-4">
      <label><input type="radio" name="myRadio2" value="1" checked> 고정</label><br>
      <label><input type="radio" name="myRadio2" value="2"> 설정</label>
    </div>
    </div>

    <div class="flex justify-center items-center"><div class="font-semibold text-nowrap text-base">설정 시간</div>
    <input type="number" id="myText2" class="swal2-input !h-[70%] !w-[30%]" placeholder="입력" value="0" min='0'>
    <div class="font-semibold text-base">약칭</div>
    <input type="text" id="myText3" class="swal2-input !h-[70%] !w-[30%]" placeholder="입력">
    </div>

    <div class="flex justify-center items-center space-x-4"><div class="font-semibold text-nowrap text-sm">근무 인정 시간</div>
    <input type="number" id="myText4" class="swal2-input !h-[70%] !w-[100px]" placeholder="입력" value="0" min='0'>
    <div class="font-semibold text-nowrap text-sm">연장근무포함시간</div>
    <input type="number" id="myText5" class="swal2-input !h-[70%] !w-[100px] " placeholder="입력" value="0" min='0'>
    </div>
  `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "닫기",
    preConfirm: () => {
      const text = document.getElementById("myText").value;
      const radio = document.querySelector(
        'input[name="myRadio"]:checked'
      ).value;
      const radio2 = document.querySelector(
        'input[name="myRadio2"]:checked'
      ).value;

      const text2 = document.getElementById("myText2").value;
      const text3 = document.getElementById("myText3").value;
      const text4 = document.getElementById("myText4").value;
      const text5 = document.getElementById("myText5").value;
      if (!text || text == "") {
        Swal.showValidationMessage("근태유형명을 입력해주세요.");
        return false;
      }
      return {
        textValue: text,
        radioValue: radio,
        radioValue2: radio2,
        textValue2: text2,
        textValue3: text3,
        textValue4: text4,
        textValue5: text5,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      addrowDefault.value =
        "false," +
        result.value.textValue +
        "," +
        (result.value.radioValue == 1 ? "휴무" : "근무인정") +
        "," +
        (result.value.radioValue2 == 1 ? "고정" : "설정") +
        "," +
        result.value.textValue2 +
        "," +
        result.value.textValue4 +
        "," +
        result.value.textValue5 +
        "," +
        result.value.textValue3 +
        ", ," +
        result.value.radioValue +
        "," +
        result.value.radioValue2;

      try {
        store.state.loading = true;
        const res = await saveAttendType(
          store.state.userData.lngStoreGroup,
          result.value.textValue,
          result.value.radioValue,
          result.value.radioValue2,
          result.value.textValue2,
          result.value.textValue4,
          result.value.textValue5,
          result.value.textValue3
        );

        // console.log(res);
        store.state.loading = false;
      } catch (error) {
      } finally {
        store.state.loading = false;
      }

      //addRow4.value = !addRow4.value;
      searchButton();
    }
  });
};
// 저장부터

const editButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (changeRow.value == null || changeRow.value == -1) {
    Swal.fire({
      title: "경고",
      text: "수정할 대상을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  console.log(
    updateRow.value.filter((item, index) => index == changeRow.value)
  );

  const editname = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0].strName
  );
  const editradio = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0]
      .lngTypeCls
  );
  const editradio2 = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0]
      .lngTimeCls
  );

  const edittime = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0]
      .timSetTime
  );

  const editincludetime = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0]
      .timIncludOT
  );

  const editapprovaltime = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0]
      .timApprovalTime
  );

  const editAlias = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0]
      .strAlias
  );

  const lngCode = ref(
    updateRow.value.filter((item, index) => index == changeRow.value)[0].lngCode
  );

  Swal.fire({
    title: "근태유형 등록(신규/수정)",
    html: `
    <div class="h-[20%] !w-[70%] flex justify-start items-center text-nowrap">
      <div class="font-semibold text-base">근태 유형명</div>
    <div class="flex justify-center items-center w-[95%] ml-10"><input type="text" id="myText" class="swal2-input !h-[70%] " placeholder="입력" value="${
      editname.value
    }" ></div></div>
   <div style="display : flex ;  white-space: nowrap; align-items: center; justify-content: start ;" >
     <div style="display : flex ;  white-space: nowrap; align-items: center; justify-content: start ;" class="mt-5 font-semibold text-base">구분</div>
    <div class="ml-20 flex mt-5 space-x-4">
      <label><input type="radio" name="myRadio" value="1" ${
        editradio.value == "1" ? "checked" : ""
      }> 휴무</label><br>
      <label><input type="radio" name="myRadio" value="2" ${
        editradio.value == "2" ? "checked" : ""
      }> 근무인정</label>
    </div>
    </div>

     <div class="h-[20%] flex justify-start items-center text-nowrap" >
     <div style="display : flex ;  white-space: nowrap; align-items: center; justify-content: start ;" class="mt-5 font-semibold text-base">시간관리</div>
    <div class="ml-12 flex mt-2 space-x-4">
      <label><input type="radio" name="myRadio2" value="1" ${
        editradio2.value == "1" ? "checked" : ""
      }> 고정</label><br>
      <label><input type="radio" name="myRadio2" value="2" ${
        editradio2.value == "2" ? "checked" : ""
      }> 설정</label>
    </div>
    </div>

    <div class="flex justify-center items-center"><div class="font-semibold text-nowrap text-base">설정 시간</div>
    <input type="number" id="myText2" class="swal2-input !h-[70%] !w-[30%]" placeholder="입력" value="${
      edittime.value
    }" min='0'>
    <div class="font-semibold text-base">약칭</div>
    <input type="text" id="myText3" class="swal2-input !h-[70%] !w-[30%]" placeholder="입력" value="${
      editAlias.value
    }">
    </div>

    <div class="flex justify-center items-center space-x-4"><div class="font-semibold text-nowrap text-sm">근무 인정 시간</div>
    <input type="number" id="myText4" class="swal2-input !h-[70%] !w-[100px]" placeholder="입력"  min='0' value="${
      editapprovaltime.value
    }">
    <div class="font-semibold text-nowrap text-sm">연장근무포함시간</div>
    <input type="number" id="myText5" class="swal2-input !h-[70%] !w-[100px] " placeholder="입력"  min='0' value="${
      editincludetime.value
    }">
    </div>
  `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "닫기",
    preConfirm: () => {
      const text = document.getElementById("myText").value;
      const radio = document.querySelector(
        'input[name="myRadio"]:checked'
      ).value;
      const radio2 = document.querySelector(
        'input[name="myRadio2"]:checked'
      ).value;

      const text2 = document.getElementById("myText2").value;
      const text3 = document.getElementById("myText3").value;
      const text4 = document.getElementById("myText4").value;
      const text5 = document.getElementById("myText5").value;
      if (!text || text == "") {
        Swal.showValidationMessage("근태유형명을 입력해주세요.");
        return false;
      }
      return {
        textValue: text,
        radioValue: radio,
        radioValue2: radio2,
        textValue2: text2,
        textValue3: text3,
        textValue4: text4,
        textValue5: text5,
      };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      addrowDefault.value =
        "false," +
        result.value.textValue +
        "," +
        (result.value.radioValue == 1 ? "휴무" : "근무인정") +
        "," +
        (result.value.radioValue2 == 1 ? "고정" : "설정") +
        "," +
        result.value.textValue2 +
        "," +
        result.value.textValue4 +
        "," +
        result.value.textValue5 +
        "," +
        result.value.textValue3 +
        ", ," +
        result.value.radioValue +
        "," +
        result.value.radioValue2;

      try {
        store.state.loading = true;
        const res = await updateAttendType(
          store.state.userData.lngStoreGroup,
          lngCode.value,
          result.value.textValue,
          result.value.radioValue,
          result.value.radioValue2,
          result.value.textValue2,
          result.value.textValue4,
          result.value.textValue5,
          result.value.textValue3
        );

        console.log(res);
        store.state.loading = false;
      } catch (error) {
      } finally {
        store.state.loading = false;
      }

      //addRow4.value = !addRow4.value;
      searchButton();
    }
  });
};

const deleteButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // console.log(updateStateRow.value);
  if (updateRow.value.filter((item) => item.checkbox == true).length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상을 체크해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;

    const rankcode = updateRow.value
      .filter((item) => item.checkbox == true)
      .map((item) => item.lngCode);

    if (rankcode.length > 0) {
      const res = await deleteAttendTypeList(
        store.state.userData.lngStoreGroup,
        rankcode.join("\u200b")
      );

      //console.log(res);
      if (res.data.RESULT_CD == "99") {
        Swal.fire({
          title: "실패",
          text: "삭제에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          title: "성공",
          text: "삭제가 완료되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
      }
    }

    //console.log(res);
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};
/* 매장 컴포넌트 관련 함수 */

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  afterSearch.value = false;

  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "1";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = "";

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = "매장명 : " + e;
  //comsole.log(e);
};
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
</script>
