<!-- /*--############################################################################
# Filename : MST56_002INS.vue                                                  
# Description : 마스터관리 > 품절관리 > 메뉴품절관리.             #
#Date :2025-08-25                                                              #
#Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="br12 po-page">
    <div class="pd24 flex-between sub-header">
      <div class="title-page">
        <div class="f24 text">메뉴품절관리</div>
        <button class="btn-star" aria-label="즐겨찾기 추가/해제"></button>
      </div>
      <div class="page-top-btns">
        <button class="btn btn-primary" @click="searchButton">
          <i class="ic-search"></i>조회
        </button>
      </div>
    </div>

    <div class="page-scroll">
      <div
        class="flex flex-col bg-gray-200 rounded-lg items-start justify-start h-24">
        <CategorySelect
          @click.stop
          class=""
          :changeState="changeState"
          :reSearch="reSearch"
          @MAINCATEGORY="MAINCATEGORY"
          @SUBCATEGORY="SUBCATEGORY"
          @STORE_CD="STORE_CD">
        </CategorySelect>

        <div class="flex space-x-5 ml-12 mt-2">
          <div
            class="bg-gray-200 flex justify-center text-base font-semibold items-center">
            판매상태
          </div>
          <div class="flex justify-center p-1 text-lg items-center space-x-10">
            <select
              name=""
              id=""
              class="border border-black w-36 h-7"
              v-model="scond">
              <option value="9">전체</option>
              <option value="0">판매중</option>
              <option value="1">당일품절</option>
              <option value="2">계속품절</option>
            </select>
          </div>

          <div class="flex space-x-5">
            <div
              class="bg-gray-200 flex justify-center items-center text-base font-semibold">
              메뉴명
            </div>
            <div class="flex justify-start pl-2 text-lg items-center">
              <input
                type="text"
                class="border border-black w-36 h-7"
                v-model="scond2" />
            </div>
          </div>
        </div>
      </div>

      <div class="pd24 pt0 mt30 grid-area">
        <!-- grid-area: 남은 화면 높이 전체 채움 / grid-fixed: 콘텐츠 높이만큼만 출력 -->

        <div class="div-table">
          <!-- table header -->
          <div class="div-table-head">
            <div class="th">
              <label class="chk">
                <input type="checkbox" id="allcheck" class="js-menu-status-toggle-all" @click="allCheck">
                <span></span>
              </label>
            </div>
            <div class="th code">메뉴코드</div>
            <div class="th name">메뉴명</div>
            <div class="th price">단가</div>
            <div class="th status">판매상태</div>
          </div>

          <!-- table body -->
          <div class="div-table-body">
            <div
              v-for="(menu, idx) in menuList"
              :key="idx"
              class="tr">
              <div class="td">
                <label class="chk">
                  <input
                    type="checkbox"
                    class="js-menu-status-toggle"
                    :checked="ischecked(menu.MENU_CD)"
                    @change="toggleSelection(menu.MENU_CD)"
                  />
                  <span></span>
                </label>
              </div>
              <div class="td code ta-left">{{ menu.MENU_CD }}</div>
              <div class="td name ta-left">{{ menu.MENU_NAME }}</div>
              <div class="td price ta-right">{{ formatNumberWithCommas(menu.MENU_PRICE) }}</div>
              <div
                class="td status"
                :class="{
                  'selling': menu.MENU_STATUS == '0' || menu.MENU_STATUS == '',
                  'soldout': menu.MENU_STATUS == '1' || menu.MENU_STATUS == '2'
                }">
                {{
                  menu.MENU_STATUS == "1"
                    ? "당일품절"
                    : menu.MENU_STATUS == "2"
                    ? "계속품절"
                    : "판매중"
                }}
              </div>
            </div>
          </div>
        </div>

        <!-- menu status bar -->
        <div class="menu-status-bar" :class="{ show: showSave }">
          <div class="menu-status-left">
            <span class="label">선택하신 메뉴수</span>
            <strong class="count">{{ selectedLeng }}</strong>
          </div>

          <div class="menu-status-center">
            <button
              type="button"
              class="btn-menu-status"
              :class="{ active: salecond == '0' }"
              @click="salecond = '0'"
              data-value="SALE">판매중</button>
            <button
              type="button"
              class="btn-menu-status"
              :class="{ active: salecond == '1' }"
              @click="salecond = '1'"
              data-value="TODAY_SOLDOUT">당일품절</button>
            <button
              type="button"
              class="btn-menu-status"
              :class="{ active: salecond == '2' }"
              @click="salecond = '2'"
              data-value="SOLDOUT">계속품절</button>
          </div>

          <div class="menu-status-right">
            <button class="f17 btn-menu-save" @click="saveButton">저장</button>
          </div>
        </div>
      </div>
      <!-- grid-area, grid-fixed -->
    </div>
    <!-- page-scroll -->
  </div>
  <!-- po-page -->
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
import { useStore } from "vuex";
import CategorySelect from "@/components/categorySelect.vue";
import PageName from "@/components/pageName.vue";
import { showModalAlert } from "@/utils/modalAlert";

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

const GROUP_CD = (e) => {};
const STORE_CD = (e) => {
  selectGroupCd.value = e.GROUP_CD;
  selectStoreCd.value = e.STORE_CD;
  //console.log(e);
};

const mainCategory = ref("");
const subCategory = ref("");
const MAINCATEGORY = (e) => {
  mainCategory.value = e;
};

const SUBCATEGORY = (e) => {
  subCategory.value = e;
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
  //console.log(e);
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
  ////console.log(e.Length);
  if (e.length <= 19) {
    return true;
  } else {
    return false;
  }
};
const reSearch = ref(false);
const saveButton = async (e) => {
  try {
    ////console.log(tempcheckedList.value);
    const menuCdList = tempcheckedList.value.map((item) => ({
      MENU_CD: item,
      MENU_STATUS: salecond.value,
    }));

    const res = await SetMenuStkRgst(
      selectGroupCd.value,
      selectStoreCd.value,
      menuCdList
    );
    ////console.log(res);
    //showSave.value = false;
    showSave.value = false;

    if (res.data.Result == "00") {
      showModalAlert('success', '성공', '저장을 완료하였습니다.', true, false, false);
      return;
    } else {
      showModalAlert('warning', '실패', `저장에 실패하였습니다. ${res.data.ResultMessage}`, true, false, false);
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
  ////console.log("여긴왓지?");
  // ////console.log(tempcheckedList.value.length);
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
  if (showSave.value == true) {
    showModalAlert('warning', '경고', '변경하신 사항이 존재합니다. 저장하시겠습니까?', true, false, true, (action) => {
      if (action === 'confirm') {
        saveButton().then(() => {
          // 저장 후 조회 실행
          executeSearch();
        });
      }
    });
    return;
  }
  executeSearch();
};

const executeSearch = async () => {
  try {
    const res = await GetMenuStkInfo(
      selectGroupCd.value,
      selectStoreCd.value,
      mainCategory.value,
      subCategory.value,
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
    ////console.log(tempcheckedList.value);
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

// Modal Alert는 전역 함수로 사용 (App.vue에 등록됨)

onMounted(() => {});
</script>

<style scoped></style>
