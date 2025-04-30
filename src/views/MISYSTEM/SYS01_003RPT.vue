<template>
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-auto">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-2 grid-rows-1 justify-between bg-gray-200 rounded-lg h-24 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2
          @startDate="startDate"
          @endDate="endDate"
          :mainName="'접속일자'"
          :closePopUp="closePopUp"
          ref="datepicker"
          :selectedGroup="selectedGroup"
          @excelDate="excelDate" />
        <div
          class="flex justify-start items-center text-base text-nowrap font-semibold ml-40">
          아이디 :
          <div>
            <label for="daily" class="font-thin">
              <input
                type="checkbox"
                id="daily"
                class="ml-5"
                @change="seeDaily" />일자별
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-5">
        <pickStoreRenew
          @lngStoreCode="selectedStoreCd"
          @lngStoreGroup="selectedGroupCd"
          @lngStoreAttrs="lngStoreAttrs"
          @excelStore="excelStore"
          @changeInit="changeInit"></pickStoreRenew>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <Realgrid
        :progname="'SYS01_003RPT_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setFooter="false"
        :documentTitle="'SYS01_003RPT'"
        :documentSubTitle="documentSubTitle"
        :exporttoExcel="exportExcel" />
    </div>
  </div>
</template>

<script setup>
import { getuserPageAccessLogReport } from "@/api/system";
import Datepicker2 from "@/components/Datepicker2.vue";
import PageName from "@/components/pageName.vue";
import pickStoreRenew from "@/components/pickStoreRenew.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const hideColumnsId = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const setRowGroupSpan = ref("");
const progId = ref("1");

const startDate = (e) => {
  //comsole.log(e);
  selectedstartDate.value = e;
};

const endDate = (e) => {
  //comsole.log(e);
  selectedendDate.value = e;
};

const store = useStore();
const loginedstrLang = store.state.userData.lngLanguage;

const datepicker = ref(null);
const closePopUp = ref(false);
const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

/*
 *조회 처리 함수
 */
const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    //그리드 갱신
    reload.value = !reload.value;

    const startDateResult = selectedstartDate.value.replace(/-/g, "");
    const endDateResult = selectedendDate.value.replace(/-/g, "");

    const res = await getuserPageAccessLogReport(
      groupCd.value,
      "0",
      storeCd.value,
      startDateResult,
      endDateResult,
      ""
    );
    //comsole.log(res);
    rowData.value = res.data.userPageAccessLog;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const groupCd = ref();
const storeCd = ref();
const selectedStoreAttr = ref();

const selectedStoreCd = (e) => {
  //comsole.log(e);
  storeCd.value = e;
};
const selectedGroupCd = (e) => {
  //comsole.log(e);
  groupCd.value = e;
};
const lngStoreAttrs = (e) => {
  initGrid();
  selectedStoreAttr.value = e;
  //comsole.log(e);
};

/*
  그리드 초기화
  */
const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
const excelButton = () => {
  documentSubTitle.value =
    selectedExcelDate.value + "\n" + selectedExcelStore.value;
  //comsole.log(documentSubTitle.value);
  // 엑셀 기능 실행
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelDate = ref("");
const excelDate = (e) => {
  selectedExcelDate.value = e;
  //comsole.log(e);
};
const selectedExcelStore = ref("");
const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const changeInit = (e) => {
  initGrid();
};
</script>
