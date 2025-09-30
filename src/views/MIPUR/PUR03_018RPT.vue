<!-- /*--############################################################################
# Filename : PUR03_018RPT.vue                                                  
# Description : 구매관리2 > 발주 관리 > 발주메일전송현황.                      
# Date :2025-09-24                                                             
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
        <button @click="reSendButton" class="button w-auto primary">
          재발송
        </button>
        <button @click="excelButton" class="button w-auto excel">엑셀</button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-2 bg-gray-200 rounded-lg h-24 items-start z-10">
      <div class="justify-start flex">
        <Datepicker2
          :mainName="'선택기간'"
          ref="datepicker"
          :initToday="1"
          :closePopUp="closePopUp"
          @excelDate="excelDate"
          @endDate="endDate"
          @startDate="startDate"
          @dateValue="dateValue">
        </Datepicker2>
      </div>
      <div class="flex justify-start items-center"></div>
      <div class="flex ml-16 space-x-5 mt-0 items-center">
        <BusinessClient
          @SupplierId="SupplierId"
          :defaultNm="'전체'"></BusinessClient>
      </div>
      <div class="flex justify-start pl-4 items-center mt-2 space-x-5">
        <div class="font-semibold text-base">조회유형</div>
        <div class="flex space-x-3">
          <label for="cond"
            ><input
              type="radio"
              id="cond"
              name="cond"
              v-model="cond"
              value="0" />전체</label
          >
          <label for="cond"
            ><input
              type="radio"
              id="cond"
              name="cond"
              v-model="cond"
              value="1" />정상</label
          >
          <label for="cond"
            ><input
              type="radio"
              id="cond"
              name="cond"
              v-model="cond"
              value="2" />실패</label
          >
        </div>
      </div>
    </div>

    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[65vh]">
      <Realgrid
        :progname="'PUR03_018RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :selectionStyle="'block'"
        @dblclickedRowData="dblclickedRowData"
        @updatedRowData="updatedRowData"
        @buttonClicked="buttonClicked"
        @clickedButtonCol="clickedButtonCol"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'lngCheck'"
        :documentTitle="'PUR03_018RPT'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="show = false"></div>
    <div class="relative bg-white rounded-lg p-6 h-[50vh] w-[50vw] shadow-lg">
      <div class="flex justify-between">
        <h3 class="text-lg font-semibold mb-2">메일 내용</h3>
        <button @click="open = false" class="px-3 py-1 border rounded">
          닫기
        </button>
      </div>
      <textarea
        name=""
        id=""
        v-model="tempBody"
        class="h-[80%] w-[80%] border border-black"></textarea>
    </div>
  </div>

  <div v-if="open2" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50" @click="show = false"></div>
    <div class="relative bg-white rounded-lg p-6 h-[30vh] w-[30vw] shadow-lg">
      <div class="flex justify-between">
        <h3 class="text-lg font-semibold mb-2">메일 재발송</h3>
        <div>
          <button @click="reSendButton2" class="whitebutton">재발송</button>
          <button @click="open2 = false" class="whitebutton">닫기</button>
        </div>
      </div>
      <div
        class="grid grid-rows-4 grid-cols-[1fr,3fr] border border-black h-[70%] w-full">
        <div
          class="border-l border-t border-black text-base font-semibold flex justify-center items-center bg-gray-100">
          거래처
        </div>
        <div
          class="justify-center items-center border-l border-b border-black flex">
          <input
            type="text"
            v-model="scond"
            class="border border-black w-[80%] h-[80%]"
            disabled />
        </div>
        <div
          class="border-l border-t border-black text-base font-semibold flex justify-center items-center bg-gray-100">
          제목
        </div>
        <div
          class="justify-center items-center border-l border-b border-black flex">
          <input
            type="text"
            v-model="scond2"
            class="border border-black w-[80%] h-[80%]"
            disabled />
        </div>
        <div
          class="border-l border-t border-black text-base font-semibold flex justify-center items-center bg-gray-100">
          발송일자
        </div>
        <div
          class="justify-center items-center border-l border-b border-black flex">
          <input
            type="text"
            v-model="scond3"
            class="border border-black w-[80%] h-[80%]"
            disabled />
        </div>
        <div
          class="border-l border-t border-black text-base font-semibold flex justify-center items-center bg-gray-100">
          변경 메일주소
        </div>
        <div class="justify-center items-center border-l border-black flex">
          <input
            type="text"
            v-model="scond4"
            class="border border-black w-[80%] h-[80%]" />
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getOrderMailSendList, resendMail, resendMail2 } from "@/api/mipur";
import BusinessClient from "@/components/businessClient.vue";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  //   const res = await getCommonList(27);

  //   optionList.value = res.data.List.filter((item) => item.strDCode != "01");

  //   const res2 = await getCommonList(24);

  //   optionList2.value = res2.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const cond = ref("0");

const store = useStore();

const datepicker = ref(null);
const closePopUp = ref(false);
const optionList = ref([]);
const optionList2 = ref([]);
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

const sDate = ref("");
const eDate = ref("");

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};

const storeCode = ref();
const lngStoreCode = (e) => {
  initGrid();
  storeCode.value = e;
};

const supplierid = ref("");
const SupplierId = (e) => {
  supplierid.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getOrderMailSendList(
      store.state.userData.lngStoreGroup,
      supplierid.value,
      sDate.value.replaceAll("-", ""),
      eDate.value.replaceAll("-", ""),

      cond.value
    );

    rowData.value = res.data.List;
    //console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

/**
 * 그리드 초기화
 */

const disabled1 = ref(false);
const progid = ref(1);
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }

  reload.value = !reload.value;
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const exportExcel2 = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value;
  exportExcel.value = !exportExcel.value;
};

const documentSubTitle2 = ref("");

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};

const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const open = ref(false);
const tempBody = ref("");
const dblclickedRowData = (e) => {
  console.log(e);

  if (tempColId.value == "subject") {
    tempBody.value = e[10];
    open.value = true;
  }
};

const tempColId = ref("");
const clickedButtonCol = (e) => {
  //console.log(e);
  tempColId.value = e;
};

const open2 = ref(false);

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("");
const scond4 = ref("");

const tempMailItemID = ref("");
const buttonClicked = (e) => {
  console.log(e);
  tempMailItemID.value = e[1];
  scond.value = e[3];
  scond2.value = e[5];
  scond3.value = e[2];
  scond4.value = e[4];
  open2.value = true;
};

const reSendButton2 = async () => {
  try {
    const res = await resendMail(scond4.value, tempMailItemID.value);

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "메일을 재전송 하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "메일 재전송에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {}

  open2.value = false;
};

const reSendButton = async () => {
  try {
    const filtered = updatedrowdata.value
      .filter((item) => item.lngCheck == true)
      .map((item) => item.mailitem_id)
      .join("\u200b");
    const res = await resendMail2(filtered);

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "메일을 재전송 하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: "메일 재전송에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {}

  open2.value = false;
};

const updatedrowdata = ref([]);
const updatedRowData = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};
</script>
