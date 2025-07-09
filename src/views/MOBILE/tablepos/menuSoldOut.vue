<!-- /*--############################################################################
# Filename : categoryManage.vue                                                  
# Description : 모바일 >  카테고리 관리                        
# Date :2025-06-30                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="h-full w-full" @click="resetScreen">
    <div class="h-[15vh] w-full"></div>
    <!-- <div
        class="relative h-[7vh] text-sm font-medium w-full bg-white grid grid-rows-1 grid-cols-[0.5fr,0.8fr,1.2fr,1.2fr,1fr] items-center">
        <div class="font-semibold text-nowrap">일자</div>
        <div class="font-semibold text-nowrap">객수/조수</div>
        <div class="font-semibold text-nowrap">총매출</div>
        <div class="font-semibold text-nowrap">실매출</div>
        <div class="font-semibold text-nowrap">할인액</div>
      </div> -->
    <!-- <div v-for="i in rowData" class="bg-gray-300">
        <div
          :class="i.dtmDate.includes('[') ? 'bg-gray-300 text-xs' : 'bg-blue-50'"
          class="grid grid-rows-1 grid-cols-[0.5fr,0.8fr,1.2fr,1.2fr,1fr] h-[7vh] justify-center items-center font-medium text-xs">
          <div class="flex justify-start pl-[10%]">{{ i.dtmDate }}</div>
          <div class="flex justify-center">
            {{ i.lngCustCnt }}/{{ i.lngRecCnt }}
          </div>
          <div class="flex justify-end">{{ i.lngSalAmt }}</div>
          <div class="flex justify-end">{{ i.lngActAmt }}</div>
          <div class="flex justify-end pr-[10%]">{{ i.lngDiscountAmt }}</div>
        </div>
      </div> -->
    <div class="flex justify-center items-center mt-2 w-full">
      <div
        class="grid grid-rows-2 grid-cols-[1fr,1fr,1fr,3fr] text-sm w-[95vw] h-[15vh]">
        <!-- <div
            class="bg-gray-200 flex justify-center border-l border-t border-black items-center">
            카테고리명
          </div> -->
        <div
          v-if="!FirstSearch"
          class="border-l border-t border-r border-black flex justify-center pl-2 text-lg items-center overflow-hidden col-span-4 bg-green-200">
          카테고리를 먼저 선택해주세요. ↗
        </div>
        <div
          v-if="FirstSearch"
          class="border-l border-t border-black border-r flex justify-center pl-2 text-lg items-center overflow-hidden col-span-4 bg-green-200">
          {{ category }} <span class="text-xl pl-2 pr-2">></span> {{ cond1 }}
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-b border-black items-center">
          판매상태
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-center p-1 text-lg items-center space-x-10">
          <select name="" id="" class="border border-black" v-model="scond">
            <option value="9">전체</option>
            <option value="0">판매중</option>
            <option value="1">당일품절</option>
            <option value="2">계속품절</option>
          </select>
        </div>

        <div
          class="bg-gray-200 flex justify-center border-l border-t border-b border-black items-center">
          메뉴명
        </div>
        <div
          class="border-l border-t border-b border-r border-black flex justify-start pl-2 text-lg items-center">
          <input
            type="text"
            class="border border-black w-[90%]"
            v-model="scond2" />
        </div>
      </div>
    </div>
    <div class="flex justify-between pr-2 mt-2 items-center">
      <label for="allcheck" class="pl-3"
        ><input
          type="checkbox"
          id="allcheck"
          @click="allCheck" />전체선택</label
      >
      <button class="button search" @click="searchButton">조회</button>
    </div>
    <div class="flex justify-center items-center mt-2">
      <div
        class="w-[95vw] h-10 grid grid-rows-none auto-rows-auto grid-cols-[1fr,2fr,4fr,1.6fr,1.5fr]">
        <div
          class="border-l border-t border-b bg-sky-200 border-black flex justify-center items-center h-8">
          선택
        </div>
        <div
          class="border-l border-t border-b bg-sky-200 border-black flex justify-center items-center h-8">
          메뉴코드
        </div>
        <div
          class="border-l border-t border-b bg-sky-200 border-black flex justify-center items-center h-8">
          메뉴명
        </div>
        <div
          class="border-l border-t border-b bg-sky-200 border-black flex justify-center items-center h-8">
          단가
        </div>
        <div
          class="border-l border-t border-b bg-sky-200 border-r border-black flex justify-center items-center h-8">
          판매상태
        </div>

        <template v-for="(menu, idx) in menuList" :key="idx">
          <div
            class="border-l border-t bg-sky-50 border-black flex justify-center h-auto"
            :class="{
              'border-b': idx == menuList.length - 1,
              'bg-red-300': ischecked(menu.MENU_CD),
            }">
            <input type="checkbox" @change="toggleSelection(menu.MENU_CD)" />
          </div>
          <div
            class="border-l border-t bg-sky-50 border-black h-auto flex items-center"
            :class="{
              'border-b': idx == menuList.length - 1,
              'bg-red-300': ischecked(menu.MENU_CD),
            }">
            {{ menu.MENU_CD }}
          </div>
          <div
            class="border-l border-t bg-sky-50 border-black flex h-auto whitespace-normal items-center"
            :class="{
              'border-b': idx == menuList.length - 1,
              'bg-red-300': ischecked(menu.MENU_CD),
              'items-center min-h-10': wordLength(menu.MENU_NAME),
            }">
            <div class="whitespace-normal break-words leading-snug w-full">
              {{ menu.MENU_NAME }}
            </div>
          </div>
          <div
            class="border-l border-t bg-sky-50 border-black flex h-auto justify-end items-center"
            :class="{
              'border-b': idx == menuList.length - 1,
              'bg-red-300': ischecked(menu.MENU_CD),
            }">
            {{ formatNumberWithCommas(menu.MENU_PRICE) }}
          </div>
          <div
            class="border-l border-t border-r bg-sky-50 border-black h-auto flex items-center"
            :class="{
              'border-b': idx == menuList.length - 1,
              'bg-red-300': ischecked(menu.MENU_CD),
              'text-red-500':
                menu.MENU_STATUS.includes(1) || menu.MENU_STATUS.includes(2),
            }">
            {{
              menu.MENU_STATUS == "1"
                ? "당일품절"
                : menu.MENU_STATUS == "2"
                ? "계속품절"
                : "판매중"
            }}
          </div>
        </template>
        <div class="!h-[20vh] w-full bg-gray-100"></div>
      </div>
    </div>
  </div>

  <CategorySelect
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    :reSearch="reSearch"
    @currState="currState"
    @FILTERDATA="FILTERDATA"
    @mainCategory="mainCategory"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></CategorySelect>
  <div
    class="fixed bottom-[11vh] w-full h-10 text-white font-bold"
    v-if="showSave">
    <div class="w-full h-auto pl-2 bg-red-500">
      선택하신 메뉴수 : {{ selectedLeng }}
    </div>
    <div class="grid grid-rows-1 grid-cols-[1fr,1fr,1fr,1fr] w-full h-full">
      <div
        class="flex justify-center items-center border-l border-t border-white bg-red-500">
        <label for="sale"
          ><input
            type="radio"
            name="savecond"
            id="sale"
            value="0"
            v-model="salecond" />판매중</label
        >
      </div>
      <div
        class="flex justify-center items-center border-l border-t border-white bg-red-500">
        <label for="tsoldout"
          ><input
            type="radio"
            name="savecond"
            id="tsoldout"
            value="1"
            v-model="salecond" />당일품절</label
        >
      </div>
      <div
        class="flex justify-center items-center border-l border-t border-white bg-red-500">
        <label for="csoldout"
          ><input
            type="radio"
            name="savecond"
            id="csoldout"
            value="2"
            v-model="salecond" />계속품절</label
        >
      </div>
      <div
        class="flex justify-center items-center border-l border-t border-white bg-white">
        <button class="button save" @click="saveButton">저장</button>
      </div>
    </div>
  </div>
  <!-- <div class="absolute inset-0 bg-black bg-opacity-40" v-if="openPu">
    <button
      @click="openPu = false"
      class="absolute left-2/3 top-[48vh] w-5 h-5 rounded-lg bg-white">
      X
    </button>
    <div
      class="absolute left-1/2 top-[55vh] transform -translate-x-1/2 -translate-y-1/2 bg-white p-4">
      {{ menuNm }}
    </div>
  </div> -->
  <!-- overlay -->
</template>

<script setup>
/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { GetMenuStkInfo, SetMenuStkRgst } from "@/api/etc";
import { formatNumberWithCommas } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { useStore } from "vuex";
import CategorySelect from "../component/categorySelect.vue";

const store = useStore();
const changeState = ref(true);
const resetScreen = async (e) => {
  changeState.value = false;

  // changeState.value = !changeState.value;
  store.state.inActiveBackGround = false;
};

const currState = (e) => {
  changeState.value = e;
};

const selectGroupCd = ref("");
const selectStoreCd = ref("");
/**
 * 선택한 매출 시작일자
 */

/**
 * 선택한 매출 종료일자
 */

const GROUP_CD = (e) => {
  selectGroupCd.value = e;
};
const STORE_CD = (e) => {
  selectStoreCd.value = e;
};

const menuList = ref([]);

const cond1 = ref("");
const cond2 = ref("");
const cond3 = ref("");
const alldate = ref(false);
const alltime = ref(false);
const holiday = ref(false);
const cond4 = ref("");
const cond5 = ref("");
const cond6 = ref("");
const cond7 = ref("");
const cond8 = ref("Y");

const LCLASS_CD = ref("");
const SCLASS_CD = ref("");
const FILTERDATA = (e) => {
  FirstSearch.value = true;
  console.log(e);
  tempcheckedList.value = [];

  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    cb.checked = false;
  });
  menuList.value = [];
  showSave.value = false;
  LCLASS_CD.value = e[0].LCLASS_CD;
  SCLASS_CD.value = e[0].SCLASS_CD;
  cond1.value = e[0].FULL_NM;
  // cond2.value = e[0].FROM_DATE;
  // cond3.value = parseInt(e[0].FROM_TIME.substring(0, 2));
  // cond4.value = parseInt(e[0].FROM_TIME.substring(2));

  // cond5.value = e[0].TO_DATE;
  // cond6.value = parseInt(e[0].TO_TIME.substring(0, 2));
  // cond7.value = parseInt(e[0].TO_TIME.substring(2));

  // cond8.value = e[0].USE_YN;

  // mon.value = e[0].SEL_DAY.substring(0, 1) == "1" ? true : false;
  // tue.value = e[0].SEL_DAY.substring(1, 2) == "1" ? true : false;
  // wed.value = e[0].SEL_DAY.substring(2, 3) == "1" ? true : false;
  // thu.value = e[0].SEL_DAY.substring(3, 4) == "1" ? true : false;
  // fri.value = e[0].SEL_DAY.substring(4, 5) == "1" ? true : false;
  // sat.value = e[0].SEL_DAY.substring(5, 6) == "1" ? true : false;
  // sun.value = e[0].SEL_DAY.substring(6, 7) == "1" ? true : false;

  // holiday.value = e[0].SEL_DAY.substring(7, 8) == "1" ? true : false;

  // alldate.value = e[0].ALL_DATE == "1" ? true : false;
  // alltime.value = e[0].ALL_TIME == "1" ? true : false;
  searchButton();
};

const mon = ref(false);
const tue = ref(false);
const wed = ref(false);
const thu = ref(false);
const fri = ref(false);
const sat = ref(false);
const sun = ref(false);

const wordLength = (e) => {
  console.log(e.Length);
  if (e.length <= 19) {
    return true;
  } else {
    return false;
  }
};
const reSearch = ref(false);
const saveButton = async (e) => {
  try {
    console.log(tempcheckedList.value);
    const menuCdList = tempcheckedList.value.map((item) => ({
      MENU_CD: item,
      MENU_STATUS: salecond.value,
    }));

    const res = await SetMenuStkRgst(
      selectGroupCd.value,
      selectStoreCd.value,
      menuCdList
    );
    console.log(res);
    //showSave.value = false;
    showSave.value = false;

    if (res.data.Result == "00") {
      Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: `저장에 실패하였습니다. ${res.data.ResultMessage}`,
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    //reSearch.value = !reSearch.value;
    tempcheckedList.value = [];

    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
    searchButton();
  }
};

const category = ref("");
const mainCategory = (e) => {
  category.value = e;
};
const FirstSearch = ref(false);
const selectedLeng = ref("");
const tempcheckedList = ref([]);
const toggleSelection = (e) => {
  const idx = tempcheckedList.value.indexOf(e);
  if (idx == -1) {
    tempcheckedList.value.push(e);
  } else {
    tempcheckedList.value.splice(idx, 1);
  }

  if (tempcheckedList.value.length > 0) {
    showSave.value = true;
  } else {
    showSave.value = false;
  }

  if (tempcheckedList.value.length != menuList.value.length) {
    document.getElementById("allcheck").checked = false;
  } else {
    document.getElementById("allcheck").checked = true;
  }

  selectedLeng.value = tempcheckedList.value.length;
  //console.log("여긴왓지?");
  // console.log(tempcheckedList.value.length);
};

const ischecked = (e) => {
  if (tempcheckedList.value.includes(e)) {
    return true;
  } else {
    return false;
  }
};
const showSave = ref(false);

const scond = ref(9);
const scond2 = ref("");
const salecond = ref("0");
const searchButton = async () => {
  if (FirstSearch.value == false) {
    Swal.fire({
      title: "카테고리를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (showSave.value == true) {
    await Swal.fire({
      title: "변경하신 사항이 존재합니다. 저장하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네",
      cancelButtonText: "아니요",
    }).then(async (result) => {
      if (result.isConfirmed) {
        saveButton();
      } else if (result.isDismissed) {
        return;
      }
    });
  }
  try {
    const res = await GetMenuStkInfo(
      selectGroupCd.value,
      selectStoreCd.value,
      LCLASS_CD.value,
      SCLASS_CD.value,
      scond.value,
      scond2.value
    );

    menuList.value = res.data.MenuList;
  } catch (error) {
  } finally {
    tempcheckedList.value = [];
    showSave.value = false;

    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
  }
};
// const SEARCHNOW = async (e) => {
//   try {
//     store.state.loading2 = true;
//     const res = await getMobileSalesbyDays(
//       selectGroupCd.value,
//       selectStoreCd.value,
//       selectStartDate.value,
//       selectEndDate.value
//     );

//     rowData.value = res.data.List.map((item) => ({
//       ...item,
//       lngCustCnt: item.lngCustCnt.toLocaleString(),
//       lngRecCnt: item.lngRecCnt.toLocaleString(),
//       lngSalAmt: item.lngSalAmt.toLocaleString(),
//       lngActAmt: item.lngActAmt.toLocaleString(),
//       lngDiscountAmt: item.lngDiscountAmt.toLocaleString(),
//     }));
//   } catch (error) {
//   } finally {
//     store.state.loading2 = false;
//   }

//   //comsole.log(rowData.value);
// };
/**
 * 	화면 Load시 실행 스크립트
 */
// const menuNm = ref("");
// const openPu = ref(false);
// const showMenuNm = (e) => {
//   menuNm.value = e;
//   openPu.value = true;
// };

const allCheck = (e) => {
  if (menuList.value.length == 0) {
    return;
  }
  if (e.target.checked) {
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = true;
    });

    tempcheckedList.value = menuList.value.map((item) => item.MENU_CD);
    //console.log(tempcheckedList.value);
    selectedLeng.value = tempcheckedList.value.length;
    showSave.value = true;
  } else {
    document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });

    tempcheckedList.value = [];
    selectedLeng.value = 0;
    showSave.value = false;
  }
};
onMounted(() => {});
</script>

<style scoped></style>
