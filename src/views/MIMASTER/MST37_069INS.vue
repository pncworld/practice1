/*--############################################################################
# Filename : MST37_069INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 특별단가 등록                       
# Date :2025-05-26                                                             
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
          <!-- 여기서부터 -->
          신규
        </button>
        <button @click="deleteButton" class="button delete md:w-auto w-14">
          <!-- 여기서부터 -->
          삭제
        </button>
        <button @click="saveButton" class="button save md:w-auto w-14">
          <!-- 여기서부터 -->
          저장
        </button>

        <button @click="excelButton" class="button excel w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="grid grid-cols-1 grid-rows-2 bg-gray-200 rounded-lg h-24 items-center z-10">
      <div
        class="flex justify-start mr-40 items-center text-base font-semibold space-x-10">
        <Datepicker2
          :mainName="'적용일'"
          :initToday="1"
          @startDate="startDate"
          :disableAll="disableAll"
          @endDate="endDate"
          @excelDate="excelDate"></Datepicker2>
        <div>
          <label for="cond" class="text-nowrap"
            ><input type="checkbox" id="cond" v-model="cond20" />적용일
            제외하기</label
          >
        </div>

        <div class="flex justify-center items-center">
          <div>메뉴서브그룹</div>
          <div>
            <select
              name=""
              id=""
              class="w-40 h-8 ml-5"
              v-model="selectedSubGroup">
              <option value="0">전체</option>
              <option :value="i.lngCode" v-for="i in MultiSubList">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <div>메뉴명</div>
          <div><input type="text" class="w-40 h-8 ml-5" v-model="cond2" /></div>
        </div>
      </div>

      <div class="flex justify-start items-center ml-12">
        <PickStoreRenew
          :hideit="false"
          :hideit2="false"
          :disableStore="disableStore"
          @lngStoreGroup="lngStoreGroup"
          @lngStoreCode="lngStoreCode"></PickStoreRenew>
        <div class="flex flex-col justify-start items-start -pl-10">
          <label for="cond3"
            ><input
              type="radio"
              id="cond3"
              v-model="cond3"
              value="0" />전체</label
          >
          <label for="cond4"
            ><input type="radio" id="cond4" v-model="cond3" value="1" />전
            매장이 적용된 특별단가</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[77%]">
      <div class="text-base font-semibold text-red-500">
        ※[특별 단가] 클릭 후 수정가능
      </div>
      <Realgrid
        :progname="'MST37_069INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="false"
        :documentTitle="'MST37_069INS'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :showCheckBar="false"
        :checkRenderEditable="true"
        :checkRowAuto="false"
        :checkRowAuto2="true"
        :checkRowAuto2Col="'checkbox'"
        :editableColId="'lngSpecialPrice,dtmDateTo'"
        :changeNow3="changeNow"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeValue2="changeValue2"
        :selectionStyle="'block'"
        @checkedRowIndex="checkedRowIndex"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        :getRowChanged="getRowChanged"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
  </div>
  <div
    v-if="openPopUp"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white rounded-lg shadow-lg w-[30vw] h-[40vh] pt-6 pr-10 grid grid-rows-6 gap-2">
      <div class="flex justify-end space-x-2">
        <div>
          <button class="whitebutton" @click="addNewSpecial">저장</button>
        </div>
        <div>
          <button @click="closePopUp2" class="whitebutton">닫기</button>
        </div>
      </div>
      <div>
        <Datepicker2
          :mainName="'적용일'"
          class="!pr-40"
          :initToday="1"
          @endDate="endDate2"
          @startDate="startDate2"></Datepicker2>
      </div>
      <div class="flex pl-7 items-center -mt-10">
        <div class="text-base font-semibold text-nowrap">적용매장 :</div>
        <div class="pl-5 flex">
          <select
            name=""
            id=""
            class="border w-32 h-10 rounded-lg"
            v-model="selectedType"
            :disabled="disableStoreSection">
            <option value="0">매장별 메뉴</option>
            <option value="1">공통 메뉴</option>
          </select>
        </div>
        <div class="flex space-x-3 ml-2">
          <input
            type="text"
            :disabled="disableStoreSection"
            class="border disabled:bg-white w-28 rounded-lg h-10"
            v-model="cond6" />
          <input
            type="text"
            class="border disabled:bg-white w-28 rounded-lg h-10"
            v-model="cond7"
            :disabled="disableStoreSection" />
        </div>
        <div class="w-10 h-8 z-50">
          <button
            class="border bg-slate-300 w-full h-full rounded-lg shadow-lg"
            @click="openStore"
            :disabled="disableStoreSection">
            ...
          </button>
        </div>
      </div>
      <div class="flex pl-14 items-center -mt-14 w-8">
        <div class="text-base font-semibold text-nowrap">메뉴 :</div>
        <div class="flex space-x-3 ml-2 pl-3">
          <input
            type="text"
            disabled
            class="border disabled:bg-white w-28 rounded-lg h-10"
            v-model="cond11" />
          <input
            type="text"
            class="border disabled:bg-white w-28 rounded-lg h-10"
            v-model="cond12"
            disabled />
        </div>
        <div class="w-32 h-8 z-50">
          <button
            class="border bg-slate-300 w-10 h-full rounded-lg shadow-lg"
            @click="openMenu">
            ...
          </button>
        </div>
      </div>
      <div class="-mt-5 flex pl-6">
        <div class="text-base font-semibold text-nowrap">특별단가 :</div>
        <div class="flex flex-col ml-5 space-y-3">
          <div class="flex items-center">
            <label for="cond5">
              <input
                type="radio"
                id="cond5"
                v-model="cond5"
                value="0" />
            </label>
              <input
                type="number"
                class="border h-8 ml-2"
                :disabled="cond5 == '1'"
                v-model="cond13" />
          </div>
          <div class="flex items-center">
            <label for="cond6">
              <input type="radio" id="cond6" v-model="cond5" value="1"/>
            </label>
            <div class="flex justify-center items-center">
              <div>기준단가 :</div>
              <input
                type="number"
                class="border w-20 h-8"
                v-model="cond14"
                :disabled="cond5 == '0'" />
              %
              <input
                type="number"
                class="border w-20 h-8"
                v-model="cond15"
                :disabled="cond5 == '0'" />
              자리에서
              <select
                name=""
                id=""
                class="border w-16 h-8"
                v-model="cond16"
                :disabled="cond5 == '0'">
                <option value="1">절사</option>
                <option value="2">반올림</option>
                <option value="3">올림</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="confirmPopUp"
    class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
    <div
      class="bg-white rounded-lg shadow-lg w-[35vw] h-[60vh] p-4 text-center justify-center items-center">
      <div class="flex justify-between p-4">
        <div class="ml-5">
          <label for="cond9"
            ><input type="checkbox" id="cond9" v-model="cond9" />선택매장
            보기</label
          >
        </div>
        <div class="space-x-3">
          <button class="whitebutton" @click="setStore">확인</button>
          <button class="whitebutton" @click="confirmPopUp = false">
            닫기
          </button>
        </div>
      </div>
      <div>
        매장검색 :
        <input
          type="text"
          class="border pl-1"
          @input="searchStore"
          v-model="cond8" />
      </div>
      <div class="w-[30vw] h-[40vh] flex justify-center ml-7 mt-5">
        <Realgrid
          :progname="'MST37_069INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :searchWord3="cond8"
          :searchColId="'lngStoreCode,strName'"
          :activeSearchSpecial="true"
          :excludeCheck="excludeCheck"
          :showCheckBar="true"
          :setStateBar="false"
          :checkRenderEditable="false"
          :hideColumnsId="['checkbox']"
          @checkedRowData="checkedRowData2"
          :searchSpecialCond="searchSpecialCond"
          :searchSpecialCond2="`(value = '1')`"
          :searchSpecialColId="['checkbox']">
        </Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="confirmPopUp2"
    class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
    <div
      class="bg-white rounded-lg shadow-lg w-[35vw] h-[60vh] p-4 text-center justify-center items-center">
      <div class="flex justify-between p-4">
        <div class="ml-5">
          <label for="cond10"
            ><input type="checkbox" v-model="cond10" id="cond10" />선택메뉴
            보기</label
          >
        </div>
        <div class="space-x-3">
          <button class="whitebutton" @click="setMenu">확인</button>
          <button class="whitebutton" @click="confirmPopUp2 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="flex ml-10 space-x-2">
        <!-- <div class="text-nowrap">
          메뉴그룹
          <select name="" id="" class="w-32 border">
            <option value="" v-for="i in MenuGroupList"></option>
          </select>
        </div> -->
        <div>
          메뉴검색 :
          <input
            type="text"
            class="border pl-1"
            v-model="searchWord3"
            @input="setSearchWord" />
        </div>
      </div>
      <div class="w-[32vw] h-[40vh] flex justify-center ml-5 mt-5">
        <Realgrid
          :progname="'MST37_069INS_VUE'"
          :progid="3"
          :rowData="rowData3"
          :hideColumnsId="['checkbox']"
          :showCheckBar="true"
          :searchWord3="searchWord3"
          :searchColId="'lngCode,strName'"
          :setStateBar="false"
          @checkedRowData="checkedRowData3"
          :activeSearchSpecial="true"
          :searchSpecialCond="!cond10"
          :searchSpecialCond2="`(value = '1')`"
          :searchSpecialColId="['checkbox']">
        </Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="openPopUp2"
    class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70]">
    <div
      class="bg-white rounded-lg shadow-lg w-[70vw] h-[60vh] p-4 text-center justify-center items-center">
      <div class="flex justify-end p-4">
        <div class="space-x-3">
          <button class="whitebutton" @click="saveButton2">적용</button>
          <button class="whitebutton" @click="openPopUp2 = false">닫기</button>
        </div>
      </div>

      <div class="w-[65vw] h-[40vh] flex justify-center ml-5 mt-5">
        <Realgrid
          :progname="'MST37_069INS_VUE'"
          :progid="4"
          :rowData="rowData4"
          :selectionStyle="'block'"
          :hideColumnsId="['checkbox']"
          :setStateBar="false"
          :checkRenderEditable="true"
          :rowStateeditable="false"
          :checkonlyone="true"
          @updatedRowData="updatedRowData2"
          @checkedRowData="checkedRowData4">
        </Realgrid>
      </div>
    </div>
  </div>

  <!-- 그리드 영역 -->
</template>

<script setup>
import { getStoreList } from "@/api/common";
import {
  deleteSpecialPrices,
  getMenuList2,
  getMenuStoreList,
  getSpecialPriceList,
  getSubGroup2,
  overLapCheck,
  saveExceptionSpecialPrice,
  updateMultiPrice,
} from "@/api/master";
import Datepicker2 from "@/components/Datepicker2.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreRenew from "@/components/pickStoreRenew.vue";
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const rowData3 = ref([]);
const rowData4 = ref([]);
const MenuGroupList = ref([]);
const cond10 = ref(false);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const userGroup = store.state.storeGroup[0].lngStoreGroup;
  const res = await getMenuStoreList(userGroup);
  GroupList.value = res.data.List;
  reload.value = !reload.value;

  const res2 = await getStoreList(userGroup, 0);
  ////console.log(res2);

  rowData2.value = res2.data.store.map((item) => ({
    ...item,
    checkbox: false,
  }));

  const res3 = await getMenuList2(userGroup, selectedStores.value);
  ////console.log(res3);
  rowData3.value = res3.data.List;

  // const res4 = await getMenuGroupList(userGroup, 0, 0);
  // ////console.log(res4);
  // MenuGroupList.value = res4.data.List;
  // const res2 = await getMultiGroup(userGroup);

  // MultiGroupList.value = res2.data.List;
  const res4 = await getSubGroup2(userGroup, selectedStores.value);

  MultiSubList.value = res4.data.List;
});

const cond8 = ref("");
const searchWord3 = ref("");
const cond9 = ref(false);
const cond12 = ref("");
const cond11 = ref("");

const setSearchWord = (e) => {
  searchWord3.value = e.target.value;
};
const excludeCheck = ref(true);
watch(cond9, () => {
  searchSpecialCond.value = !cond9.value;
});
const searchStore = (e) => {
  cond8.value = e.target.value;
};
const selectedType = ref(0);

watch(selectedType, () => {
  if (selectedType.value == 0) {
    excludeCheck.value = true;
  } else {
    excludeCheck.value = false;
  }
});
const disableStore = ref(false);
const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const GroupList = ref([]);
const cond = ref(false);
const cond2 = ref("");
const cond3 = ref("0");
const cond4 = ref("0");
const cond5 = ref("0");
const cond6 = ref("");
const cond7 = ref("");

const cond13 = ref("");
const cond14 = ref("0");
const cond15 = ref("0");
const cond16 = ref("2");
const cond20 = ref(false);

const disableAll = ref(false);
watch(cond20, () => {
  disableAll.value = cond20.value;
  ////console.log(cond20.value);
});
const store = useStore();
const MultiSubList = ref([]);
const selectedSubGroup = ref(0);
const MultiGroupList = ref([]);
const selectedMultiGroup = ref(0);
const datepicker = ref(null);
const closePopUp = ref(false);
const searchType = ref("0");
const confirmPopUp = ref(false);
const confirmPopUp2 = ref(false);
const selectedSubCode = ref(0);

const searchSpecialCond = ref(false);
const openStore = (e) => {
  confirmPopUp.value = true;
};
const openMenu = (e) => {
  confirmPopUp2.value = true;
};
const subCode = (e) => {
  selectedSubCode.value = e;
};
const selectedMainCode = ref(0);
const mainCode = (e) => {
  selectedMainCode.value = e;
};

const checkedDatas = ref([]);
const forDeleteDatas = ref([]);
// const checkedRowData = (e) => {
//   ////console.log(e);
//   checkedDatas.value = e.map((item) => item.lngMenuPrice);
//   ////console.log(checkedDatas.value);

//   forDeleteDatas.value = e.map((item) => item.lngMenuSpecialPriceCode);
// };

const checkedDatas2 = ref([]);
const checkedRowData2 = (e) => {
  checkedDatas2.value = e;
  ////console.log(e);
};
const checkedDatas3 = ref([]);
const checkedRowData3 = (e) => {
  checkedDatas3.value = e;
};
const checkedRowData4 = (e) => {
  //checkedDatas3.value = e;
  ////console.log(e);
};
const checkedIndexs = ref([]);
const checkedRowIndex = (e) => {
  checkedIndexs.value = e;
  // ////console.log(e);
};

const updateRowData = ref([]);
const updateRowData2 = ref([]);
const updatedRowData = (e) => {
  ////console.log(e);
  updateRowData.value = e;

  forDeleteDatas.value = e
    .filter((item) => item.checkbox == true)
    .map((item) => item.lngMenuSpecialPriceCode);
};
const updatedRowData2 = (e) => {
  updateRowData2.value = e;
};

const getRowChanged = ref(false);
const updatedRows = ref([]);
const allStateRows = (e) => {
  updatedRows.value = e.updated;
};

const changeNow = ref(false);
const changeValue2 = ref("");
const changeColid = ref("lngMultiPrice");
const changeRow = ref(0);

const setMenu = (e) => {
  if (checkedDatas3.value.length == 0) {
    cond11.value = "";
    cond12.value = "";
  } else {
    cond11.value = checkedDatas3.value[checkedDatas3.value.length - 1].lngCode;
    cond12.value =
      checkedDatas3.value[checkedDatas3.value.length - 1].strName +
      "외" +
      (checkedDatas3.value.length - 1) +
      "건";
  }

  confirmPopUp2.value = false;
};

const addNewSpecial = async (e) => {
  ////console.log(checkedDatas3.value);
  ////console.log(checkedDatas2.value);

  if (cond6.value == "") {
    Swal.fire({
      title: "경고",
      text: "매장을 선택해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (cond11.value == "") {
    Swal.fire({
      title: "경고",
      text: "메뉴를 선택해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (cond5.value == "0" && (cond13.value === "" || cond13.value == null || cond13.value === undefined)) {
    Swal.fire({
      title: "경고",
      text: "특별단가를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  let menucodes = "";
  for (let i = 0; i < checkedDatas2.value.length; i++) {
    for (let j = 0; j < checkedDatas3.value.length; j++) {
      menucodes += checkedDatas3.value[j].lngCode + ",";
    }
  }
  menucodes = menucodes.slice(0, menucodes.length - 1);
  let storecodes = "";

  if (checkedDatas2.value.length == 1) {
    for (let i = 0; i < checkedDatas3.value.length; i++) {
      storecodes += checkedDatas2.value[0].lngStoreCode + ",";
    }
    storecodes = storecodes.slice(0, storecodes.length - 1);
  } else {
    for (let i = 0; i < checkedDatas2.value.length; i++) {
      for (let j = 0; j < checkedDatas3.value.length; j++) {
        storecodes += checkedDatas2.value[i].lngStoreCode + ",";
      }
    }
    storecodes = storecodes.slice(0, storecodes.length - 1);
  }

  const res = await overLapCheck(
    selectedGroup.value,
    menucodes,
    storecodes,
    startdate2.value,
    enddate2.value
  );
  ////console.log(res);
  const dupliarr = res.data.List;
  if (dupliarr.length > 0) {
    Swal.fire({
      title: "경고",
      text: "중복된 특별단가 목록이 존재합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    rowData4.value = dupliarr;
    openPopUp2.value = true;
    return;
  } else {
    let specialPrice = [];

    if (cond5.value == 0) {
      for (let i = 0; i < checkedDatas2.value.length; i++) {
        for (let j = 0; j < checkedDatas3.value.length; j++) {
          specialPrice.push(cond13.value);
        }
      }
    } else if (cond5.value == 1) {
      for (let j = 0; j < checkedDatas2.value.length; j++) {
        for (let i = 0; i < checkedDatas3.value.length; i++) {
          let initPrice = rowData3.value.filter(
            (item) => item.lngCode == checkedDatas3.value[i]
          )[0].lngPrice;
          initPrice =
            cond16.value == "1"
              ? Math.round(initPrice * (cond14.value / 100), cond15.value)
              : cond16.value == "0"
              ? Math.floor(initPrice * (cond14.value / 100), cond15.value)
              : Math.ceil(initPrice * (cond14.value / 100), cond15.value);
          specialPrice.push(initPrice);
        }
      }
    }

    try {
      store.state.loading = true;
      const res = await saveExceptionSpecialPrice(
        selectedGroup.value,
        storecodes,
        menucodes,
        specialPrice.join(","),
        startdate2.value,
        enddate2.value,
        "",
        ""
      );
      console.log(res);
      Swal.fire({
        title: "완료",
        text: "저장이 완료되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });

      store.state.loading = false;
      return;
    } catch (error) {
    } finally {
      openPopUp.value = false;
      confirmPopUp.value = false;
      confirmPopUp2.value = false;
      openPopUp2.value = false;
      store.state.loading = false;

      selectedType.value = "0";
      cond6.value = "";
      cond7.value = "";
      cond11.value = "";
      cond12.value = "";
      cond5.value = "0";
      cond14.value = "0";
      cond15.value = "";
      cond16.value = "";
      searchButton();
    }
  }
  //const res = await saveAddSpecialPrice();
};

const startdate = ref("");
const enddate = ref("");
const startdate2 = ref("");
const enddate2 = ref("");
const endDate = (e) => {
  enddate.value = e;
};
const startDate = (e) => {
  startdate.value = e;
};
const endDate2 = (e) => {
  enddate2.value = e;
};
const startDate2 = (e) => {
  startdate2.value = e;
};

const setStore = (e) => {
  if (checkedDatas2.value.length == 0) {
    cond6.value = "";
    cond7.value = "";
  } else {
    cond6.value =
      checkedDatas2.value[checkedDatas2.value.length - 1].lngStoreCode;
    cond7.value =
      checkedDatas2.value[checkedDatas2.value.length - 1].strName +
      "외" +
      (checkedDatas2.value.length - 1) +
      "건";
  }
  confirmPopUp.value = false;
};
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

watch(cond3, () => {
  if (cond3.value == "0") {
    disableStore.value = false;
  } else {
    disableStore.value = true;
  }
  //disableStore.value = cond3.value;
});

const openPopUp = ref(false);
const openPopUp2 = ref(false);
const disableStoreSection = ref(false);
const addButton = () => {
  initPopUp();
  
  // store.state.userData.lngPositionType이 '0'일 때 처리
  if (store.state.userData.lngPositionType === '0') {
    selectedType.value = "0";
    // 실제 매장코드와 매장명 사용
    const storeCode = store.state.userData.lngPosition;
    const storeName = store.state.userData.strStoreName;
    cond6.value = storeCode;
    cond7.value = storeName + " 등 1건";
    disableStoreSection.value = true;
  } else {
    disableStoreSection.value = false;
  }
  
  openPopUp.value = !openPopUp.value;
};

const initPopUp = () => {
  selectedType.value = "0";
  cond7.value = "";
  cond6.value = "";
  cond11.value = "";
  cond12.value = "";
  cond13.value = "";
  cond15.value = "0";
  cond14.value = "0";
  cond5.value = "0";
  cond16.value = "2";
  disableStoreSection.value = false;
};
const closePopUp2 = () => {
  openPopUp.value = false;
};
/**
 *  조회 함수
 */

const searchButton = async () => {
  //   if (selectedStore.value == 0) {
  //     Swal.fire({
  //       title: "경고",
  //       text: "매장명을 먼저 선택하세요.",
  //       icon: "warning",
  //       confirmButtonText: "확인",
  //     });
  //     return;
  //   }
  try {
    store.state.loading = true;
    // initGrid();
    reload.value = !reload.value;
    let sd = "";
    let ed = "";
    if (disableAll.value == false) {
      sd = startdate.value;
      ed = enddate.value;
    }

    let sst = 0;
    if (cond3.value == 1) {
      sst = -1;
    } else {
      sst = selectedStores.value;
    }
    const res = await getSpecialPriceList(
      store.state.userData.lngStoreGroup,
      sd,
      ed,
      selectedSubGroup.value,
      cond2.value,
      sst
    );
    ////console.log(res);
    rowData.value = res.data.List;
    updateRowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const deleteButton = async () => {
  if (forDeleteDatas.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상이 존재하지 않습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await deleteSpecialPrices(forDeleteDatas.value.join(","));

    ////console.log(res);

    Swal.fire({
      title: "성공",
      text: "삭제에 성공하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const saveButton = async (e) => {
  try {
    store.state.loading = true;
    //const updateRowData.value
    updatedRows.value;

    let menucodes = [];
    let prices = [];
    for (let i = 0; i < updatedRows.value.length; i++) {
      menucodes.push(
        updateRowData.value[updatedRows.value[i]].lngMenuSpecialPriceCode
      );
    }

    for (let i = 0; i < updatedRows.value.length; i++) {
      prices.push(updateRowData.value[updatedRows.value[i]].lngSpecialPrice);
    }
    const res = await updateMultiPrice(
      menucodes.join(","),
      prices.join(","),
      updateRowData.value
        .filter((item, index) => updatedRows.value.includes(index))
        .map((item) => formatLocalDate(item.dtmDateTo))
        .join("\u200b")
    );

    console.log(res);

    Swal.fire({
      title: "성공",
      text: "저장하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    store.state.loading = false;
  } catch (error) {
    ////console.log(error);
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

const saveButton2 = async () => {
  const filtered = updateRowData2.value.filter(
    (item) => item.checkbox1 == true
  ).length;
  const filtered2 = updateRowData2.value.filter(
    (item) => item.checkbox2 == true
  ).length;

  ////console.log(checkedDatas2.value, checkedDatas3.value);
  if (filtered + filtered2 !== updateRowData2.value.length) {
    Swal.fire({
      title: "경고",
      text: "예외처리 되지 않은 중복내용이 있어서 적용할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    
    // 신규 입력한 매장/메뉴/가격 조합을 생성 (addNewSpecial과 동일한 로직)
    let stores = "";
    let menuCodes = [];
    let specialPrice = [];
    
    // 매장코드와 메뉴코드 조합 생성
    if (checkedDatas2.value.length == 1) {
      for (let i = 0; i < checkedDatas3.value.length; i++) {
        stores += checkedDatas2.value[0].lngStoreCode + ",";
        menuCodes.push(checkedDatas3.value[i].lngCode);
      }
      stores = stores.slice(0, stores.length - 1);
    } else {
      for (let i = 0; i < checkedDatas2.value.length; i++) {
        for (let j = 0; j < checkedDatas3.value.length; j++) {
          stores += checkedDatas2.value[i].lngStoreCode + ",";
          menuCodes.push(checkedDatas3.value[j].lngCode);
        }
      }
      stores = stores.slice(0, stores.length - 1);
    }
    
    // 특별단가 계산 (addNewSpecial과 동일한 로직)
    if (cond5.value == 0) {
      for (let i = 0; i < checkedDatas2.value.length; i++) {
        for (let j = 0; j < checkedDatas3.value.length; j++) {
          specialPrice.push(cond13.value);
        }
      }
    } else if (cond5.value == 1) {
      for (let j = 0; j < checkedDatas2.value.length; j++) {
        for (let i = 0; i < checkedDatas3.value.length; i++) {
          let initPrice = rowData3.value.filter(
            (item) => item.lngCode == checkedDatas3.value[i]
          )[0].lngPrice;
          initPrice =
            cond16.value == "1"
              ? Math.round(initPrice * (cond14.value / 100), cond15.value)
              : cond16.value == "0"
              ? Math.floor(initPrice * (cond14.value / 100), cond15.value)
              : Math.ceil(initPrice * (cond14.value / 100), cond15.value);
          specialPrice.push(initPrice);
        }
      }
    }

    // 매장코드 배열 생성 (필터링을 위해)
    let storeArray = [];
    if (checkedDatas2.value.length == 1) {
      for (let i = 0; i < checkedDatas3.value.length; i++) {
        storeArray.push(checkedDatas2.value[0].lngStoreCode);
      }
    } else {
      for (let i = 0; i < checkedDatas2.value.length; i++) {
        for (let j = 0; j < checkedDatas3.value.length; j++) {
          storeArray.push(checkedDatas2.value[i].lngStoreCode);
        }
      }
    }

    // IGNORE(checkbox2)에 포함된 항목 추출 (기존 로직 유지)
    const ignoreApply = updateRowData2.value
      .filter((item) => item.checkbox2 == true)
      .map((item) => item.lngStoreCode);
    const ignoreApply2 = updateRowData2.value
      .filter((item) => item.checkbox2 == true)
      .map((item) => item.MenuCode);

    // APPLY(checkbox1)에 포함된 항목 추출
    const editApply = updateRowData2.value
      .filter((item) => item.checkbox1 == true)
      .map((item) => item.lngStoreCode);
    const editApply2 = updateRowData2.value
      .filter((item) => item.checkbox1 == true)
      .map((item) => item.MenuCode);

    // IGNORE에 포함된 매장코드/메뉴코드 조합을 Set으로 생성 (기존 로직 유지)
    const ignoreSet = new Set();
    for (let i = 0; i < ignoreApply.length; i++) {
      ignoreSet.add(String(ignoreApply[i]) + "," + String(ignoreApply2[i]));
    }

    // APPLY에 포함된 매장코드/메뉴코드 조합을 Set으로 생성
    const applySet = new Set();
    for (let i = 0; i < editApply.length; i++) {
      applySet.add(String(editApply[i]) + "," + String(editApply2[i]));
    }

    // 신규 입력 데이터에서 IGNORE 또는 APPLY에 포함된 항목 제외
    const filteredStores = [];
    const filteredMenuCodes = [];
    const filteredSpecialPrice = [];
    
    // 필터링: IGNORE 또는 APPLY에 포함되지 않은 항목만 유지
    for (let i = 0; i < menuCodes.length; i++) {
      const key = String(storeArray[i]) + "," + String(menuCodes[i]);
      // IGNORE 또는 APPLY에 포함되지 않은 항목만 포함
      if (!ignoreSet.has(key) && !applySet.has(key)) {
        filteredStores.push(storeArray[i]);
        filteredMenuCodes.push(menuCodes[i]);
        filteredSpecialPrice.push(specialPrice[i]);
      }
    }

    // 필터링된 데이터를 문자열로 변환
    const finalStores = filteredStores.join(",");
    const finalMenuCodes = filteredMenuCodes.join(",");
    const finalSpecialPrice = filteredSpecialPrice.join(",");

    console.log("filtered stores:", finalStores);
    console.log("filtered menuCodes:", finalMenuCodes);
    console.log("filtered specialPrice:", finalSpecialPrice);

    let cond1 = [];
    let Cond2 = [];

    for (let i = 0; i < ignoreApply.length; i++) {
      Cond2.push(ignoreApply[i] + "," + ignoreApply2[i] + "|");
    }
    for (let i = 0; i < editApply.length; i++) {
      cond1.push(editApply[i] + "," + editApply2[i] + "|");
    }

    const res = await saveExceptionSpecialPrice(
      selectedGroup.value,
      finalStores,
      finalMenuCodes,
      finalSpecialPrice,
      startdate2.value,
      enddate2.value,
      cond1.join(","),
      Cond2.join(",")
    );

    console.log(res);

    Swal.fire({
      title: "성공",
      text: "저장이 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
  } finally {
    openPopUp.value = false;
    confirmPopUp.value = false;
    confirmPopUp2.value = false;
    openPopUp2.value = false;

    store.state.loading = false;
    searchButton();
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStore = ref(0);
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  // ////console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  ////console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  cond.value = "";
};

watch([selectedSubGroup, selectedMultiGroup, selectedStore], () => {
  initGrid();
});

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  let storeNm;
  if (selectedStore.value == 0) {
    storeNm = "선택";
  } else {
    storeNm = GroupList.value.filter(
      (item) => item.lngStoreCode == selectedStore.value
    )[0].strStoreName;
  }

  let storeGroup;
  if (selectedStore.value == 0) {
    storeGroup = "전체";
  } else {
    storeGroup = MultiGroupList.value.filter(
      (item) => item.lngCode == selectedMultiGroup.value
    )[0].strName;
  }

  let menuSubGroup;
  if (selectedStore.value == 0) {
    menuSubGroup = "전체";
  } else {
    menuSubGroup = MultiSubList.value.filter(
      (item) => item.lngCode == selectedSubGroup.value
    )[0].strName;
  }

  documentSubTitle.value =
    selectedExcelDate.value +
    "\n" +
    "매장명 : " +
    storeNm +
    "\n" +
    "멀티단가그룹 : " +
    storeGroup +
    "\n" +
    "메뉴서브그룹 : " +
    menuSubGroup;

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

watch(selectedStores, async () => {
  //const userGroup = store.state.storeGroup[0].lngStoreGroup;
  const res4 = await getSubGroup2(selectedGroup.value, selectedStores.value);

  MultiSubList.value = res4.data.List;
});
</script>
