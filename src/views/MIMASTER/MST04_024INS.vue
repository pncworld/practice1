<!-- /*--############################################################################
# Filename : MST04_024INS.vue                                                  
# Description : 마스터관리 > 자재 마스터2 > 메뉴 레시피 등록.                
# Date :2025-08-20                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-10 space-x-2 pr-5">
        <button class="button new">신규</button>
        <button @click="saveButton" class="button save">저장</button>
      </div>
    </div>
    <div
      class="grid grid-rows-2 grid-cols-2 justify-start space-x-5 bg-gray-200 rounded-lg h-24 items-center mt-3">
      <div class="flex ml-12 space-x-5">
        <div class="text-base font-semibold">메뉴코드</div>
        <div>
          <input
            type="text"
            disabled
            v-model="cond"
            class="disabled:bg-white border border-black" />
        </div>
      </div>
      <div class="flex !ml-9 space-x-5">
        <div class="text-base font-semibold">메뉴명</div>
        <div>
          <input
            type="text"
            disabled
            v-model="cond2"
            class="disabled:bg-white border border-black" />
        </div>
      </div>
      <div class="flex !ml-12 space-x-5">
        <div class="text-base font-semibold">적용매장</div>
        <div>
          <select name="" id="" class="w-64" v-model="cond3">
            <option :value="i.lngStoreCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex space-x-5">
        <div class="text-base font-semibold">적용일자</div>
        <div class="flex space-x-5 items-center">
          <input type="date" v-model="cond4" />
          <span>~</span>
          <input type="date" v-model="cond5" />
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역 -->
    <span class="flex mt-5 space-x-5 items-center">
      <div class="ml-10 flex justify-start font-bold text-xl">메뉴</div>
      <div><input type="text" class="border border-black w-32" /></div>

      <div><button class="whitebutton">엑셀</button></div>
    </span>
    <div
      class="grid grid-rows-1 grid-cols-[1fr,2fr,3fr] h-[65vh] w-full justify-center mt-2">
      <div class="w-[110%] ml-10 h-full">
        <Realgrid
          :progname="'MST04_024INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :setStateBar="false"
          @clickedRowData="clickedRowData"
          :rowStateeditable="false">
        </Realgrid>
      </div>
      <!-- 그리드 영역 -->
      <!-- 연동 데이터 영역 -->

      <div class="w-[90%] ml-20 -mt-7 h-full">
        <div class="flex justify-start font-bold text-xl">◎ 메뉴 Master</div>
        <Realgrid
          :progname="'MST04_024INS_VUE'"
          :progid="2"
          :rowData="rowData2"
          :setStateBar="false"
          @clickedRowData="clickedRowData2"
          :rowStateeditable="false">
        </Realgrid>
      </div>

      <div class="w-[90%] ml-12 h-[70%] -mt-7">
        <div class="flex justify-between font-bold text-xl">
          <div>◎ 메뉴 Detail</div>
          <div class="flex space-x-5">
            <div>
              <button class="whitebutton" @click="addButton">신규</button>
            </div>
            <div><button class="whitebutton">저장</button></div>
            <div><button class="whitebutton">엑셀</button></div>
          </div>
        </div>
        <Realgrid
          :progname="'MST04_024INS_VUE'"
          :progid="3"
          :rowData="rowData3"
          :setStateBar="false"
          @clickedRowData="clickedRowData3"
          @buttonClicked="buttonClicked"
          :rowStateeditable="false">
        </Realgrid>
      </div>
    </div>
  </div>

  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    v-if="addRow">
    <!-- 모달 박스 -->
    <div class="bg-white rounded-lg shadow-lg w-[40vw] h-[70vh] p-6">
      <div class="flex justify-between w-full">
        <div><h2 class="text-xl font-semibold mb-4">자재목록</h2></div>
        <div class="flex space-x-5 justify-end">
          <button
            @click="addRow = false"
            class="text-gray-500 hover:text-gray-800 whitebutton">
            조회
          </button>
          <button
            @click="addRow = false"
            class="text-gray-500 hover:text-gray-800 whitebutton">
            적용
          </button>
          <button
            @click="addRow = false"
            class="text-gray-500 hover:text-gray-800 whitebutton">
            닫기
          </button>
        </div>
      </div>

      <div
        class="grid grid-rows-3 grid-cols-[1fr,2fr] w-[50%] justify-center items-center ml-16 space-x-5">
        <div class="font-semibold text-base ml-12">자재분류</div>
        <div class="flex space-x-2">
          <select name="" id="" class="border border-black w-32">
            <option value=""></option>
          </select>

          <select name="" id="" class="border border-black w-64">
            <option value=""></option>
          </select>
        </div>
        <div class="font-semibold text-base mt-2 !ml-12">조회구분</div>
        <div class="flex space-x-2 mt-2">
          <label for="scond"
            ><input type="radio" id="scond" name="scond" />자재</label
          >
          <label for="scond2"
            ><input type="radio" id="scond2" name="scond" />제품</label
          >
          <label for="scond3"
            ><input type="radio" id="scond3" name="scond" />제조</label
          >
        </div>
        <div class="font-semibold text-base mt-2 !ml-12">자재명</div>
        <div class="flex space-x-2 mt-2">
          <input type="text" class="border border-black" />
        </div>
      </div>
    </div>
    <!-- 모달 내용 -->
  </div>
  <!-- 연동 데이터 영역 -->
</template>

<script setup>
import {
  deleteMenuDetail,
  getCardInfo,
  getMenuList4,
  getMenuMasterList,
  getMenuReceipt,
  getStoreForMenuReceipt,
  saveCreditCardEnroll,
} from "@/api/master";
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

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("0");
const cond4 = ref("");
const cond5 = ref("");
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStoreForMenuReceipt(store.state.userData.lngStoreGroup);

  optionList.value = res.data.List;

  const res2 = await getMenuList4(store.state.userData.lngStoreGroup);

  rowData.value = res2.data.List;
});

const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const groupCd = ref();
const storeCd = ref(0);
const afterSearch = ref(false);
const empCode = ref();
const empName = ref();
const clickStoreCd = ref(0);
const clickStoreNm = ref();
const addNew = ref(true);
const valuesData = ref([]);
const labelsData = ref([]);
/**
 * 추가 버튼 함수
 */

const addRow = ref(false);
const changeNow = ref(false);
const afterSearch3 = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();
const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref();
const gridvalue4 = ref();
const gridvalue5 = ref();
const gridvalue6 = ref();
const gridvalue7 = ref();

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (newValue) => {
  changeRow.value = newValue;
};
/**
 *  추가 버튼
 */

const addButton = () => {
  if (afterSearch3.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  addRow.value = !addRow.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = ref(false);
/**
 * 삭제 버튼
 */

const deleteButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  deleteRow.value = !deleteRow.value;
};
const disableCd = ref(false);

const tempgridValue5 = ref();
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = async (e) => {
  //console.log(e);

  cond.value = e[0];
  cond2.value = e[1];

  try {
    const res = await getMenuMasterList(
      store.state.userData.lngStoreGroup,
      0,
      cond.value
    );

    console.log(res);

    rowData2.value = res.data.List;
  } catch (error) {}
};

const clickedRowData2 = async (e) => {
  //console.log(e);

  cond.value = e[0];
  cond2.value = e[1];

  cond4.value =
    e[2].slice(0, 4) + "-" + e[2].slice(4, 6) + "-" + e[2].slice(6, 8);
  cond5.value =
    e[3].slice(0, 4) + "-" + e[3].slice(4, 6) + "-" + e[3].slice(6, 8);

  try {
    const res = await getMenuReceipt(
      store.state.userData.lngStoreGroup,
      0,
      cond.value,
      e[2],
      e[3]
    );

    console.log(res);

    rowData3.value = res.data.List;
    afterSearch3.value = true;
  } catch (error) {}
};
/**
 * 페이지 매장 그룹 세팅
 */

const buttonClicked = async (e) => {
  console.log(e);
  await Swal.fire({
    title: "확인",
    text: "정말로 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
    showCancelButton: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await deleteMenuDetail(
        store.state.userData.lngStoreGroup,
        cond.value,
        cond4.value.replaceAll("-", ""),
        cond5.value.replaceAll("-", ""),
        e[2],
        e[0]
      );

      console.log(res);
    } else {
      return;
    }
  });
  try {
  } catch (error) {
  } finally {
    const res = await getMenuReceipt(
      store.state.userData.lngStoreGroup,
      0,
      cond.value,
      cond4.value.replaceAll("-", ""),
      cond5.value.replaceAll("-", "")
    );

    console.log(res);

    rowData3.value = res.data.List;
  }
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = (newValue) => {
  rowData.value = [];
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  storeCd.value = newValue;
  clickStoreCd.value = newValue;
  //comsole.log(newValue);
};
const updateRow = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updateRow.value = newValue;
  //comsole.log(newValue);
};

const makeToFixed2 = (e) => {
  //comsole.log(e.target.value);
  if (!isNaN(Number(e.target.value))) {
    gridvalue5.value = Number(e.target.value).toFixed(2);
  }
};
const isFirstInput = ref(true);

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const changeInfo = (e) => {
  const rowName = e.target.name;
  const rowValue = e.target.value;

  if (rowName == "gridvalue5") {
    gridvalue5.value = rowValue;

    changeColid.value = "lngRate";
    changeValue2.value = rowValue;
  } else if (rowName == "gridvalue2") {
    if (/^\d+$/.test(rowValue) == false) {
      gridvalue2.value = e.target.value.replace(/[^\d]/g, "");
      return;
    }
    changeValue2.value = rowValue;
    changeColid.value = "strBuyCode";
  } else if (rowName == "gridvalue3") {
    changeValue2.value = rowValue;
    changeColid.value = "strBuyName";
  } else if (rowName == "gridvalue4") {
    changeValue2.value = rowValue;
    changeColid.value = "strBuyEName";
  } else if (rowName == "gridvalue6") {
    changeValue2.value = rowValue;
    changeColid.value = "strIFCode";
  }
  changeNow.value = !changeNow.value;
};

const addrowDefault = ref("");
const storeList = ref([]);
const addrowProp = ref("lngStoreCode,strStoreName");
const store = useStore();
/**
 *  조회 함수
 */

const searchButton = async () => {
  store.state.loading = true;
  try {
    let res;

    rowData.value = res.data.CARDLIST;
    storeList.value = res.data.STOREINFO;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    //comsole.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    let newlabeldataarr = storeList.value.map((item) => item.strName);
    labelsData.value.push(newlabeldataarr);
    let newvaluedataarr = storeList.value.map((item) => item.lngStoreCode);
    valuesData.value.push(newvaluedataarr);
    store.state.loading = false;
    gridvalue1.value = "";
    gridvalue2.value = "";
    gridvalue3.value = "";
    gridvalue4.value = "";
    gridvalue5.value = "";
    gridvalue6.value = "";
    gridvalue7.value = "";
  }
};
const storeNm = (newValue) => {
  clickStoreNm.value = newValue;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  //comsole.log(updateRow.value);
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (JSON.stringify(updateRow.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow = updateRow.value.filter(
    (item) =>
      item.new == true &&
      (item.strBuyCode == "" || item.strBuyCode == undefined)
  ).length;
  if (validateRow > 0) {
    Swal.fire({
      title: "경고",
      text: "미입력된 매입사코드가 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const groupedByStoreCode = updateRow.value.reduce((acc, item) => {
    // 그룹화, 같은 lngStoreCode를 키로 사용
    if (!acc[item.lngStoreCode]) {
      acc[item.lngStoreCode] = [];
    }
    acc[item.lngStoreCode].push(item);
    return acc;
  }, {});

  // 각 그룹에서 strBuyCode 중복 체크
  const duplicateCount = Object.values(groupedByStoreCode)
    .map((group) => {
      // 각 그룹 내에서 strBuyCode 중복 체크
      const buyCodeCount = group.reduce((acc, item) => {
        acc[item.strBuyCode] = (acc[item.strBuyCode] || 0) + 1;
        return acc;
      }, {});

      // 중복된 strBuyCode 개수 세기
      return Object.values(buyCodeCount).filter((count) => count > 1).length;
    })
    .reduce((acc, count) => acc + count, 0); // 모든 그룹의 중복 개수를 합산

  //comsole.log(duplicateCount);

  if (duplicateCount > 0) {
    Swal.fire({
      title: "경고",
      text: "중복된 매입사코드가 존재합니다. 확인해주세요.",
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
        const chargeStoreCd = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngStoreCode);
        const chargeBuyCd = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strBuyCode);
        const chargeBuyNm = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strBuyName);
        const chargeBuyENm = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strBuyEName);
        const chargelngRate = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.lngRate);
        const chargestrIFCode = updateRow.value
          .filter((item) => item.deleted != true && item.new != true)
          .map((item) => item.strIFCode);

        const insertStoreCd = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngStoreCode);
        const insertBuyCd = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strBuyCode);
        const insertBuyNm = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strBuyName);
        const insertBuyENm = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strBuyEName);
        const insertlngRate = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.lngRate);
        const insertstrIFCode = updateRow.value
          .filter((item) => item.deleted != true && item.new == true)
          .map((item) => item.strIFCode);

        const deleteCode = updateRow.value
          .filter((item) => item.deleted == true)
          .map((item) => item.strBuyCode);
        const deleteStoreCd = updateRow.value
          .filter((item) => item.deleted == true)
          .map((item) => item.lngStoreCode);
        const res = await saveCreditCardEnroll(
          groupCd.value,
          storeCd.value,
          chargeStoreCd.join(","),
          chargeBuyCd.join(","),
          chargeBuyNm.join(","),
          chargeBuyENm.join(","),
          chargelngRate.join(","),
          chargestrIFCode.join(","),
          insertStoreCd.join(","),
          insertBuyCd.join(","),
          insertBuyNm.join(","),
          insertBuyENm.join(","),
          insertlngRate.join(","),
          insertstrIFCode.join(","),
          deleteStoreCd.join(","),
          deleteCode.join(",")
        );
        //comsole.log(res);
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
</script>

<style scoped></style>
