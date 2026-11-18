<!-- /*--############################################################################
# Filename : categoryManage.vue                                                  
# Description : 모바일 >  카테고리 관리                        
# Date :2025-06-30                                                           
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="mu-page" @click="resetScreen">
    <div class="mu-head"></div>
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
    <div class="so-crumb" :class="{ 'is-guide': !FirstSearch }">
      <template v-if="!FirstSearch">
        위 조회 조건에서 카테고리를 먼저 선택해 주세요.
      </template>
      <template v-if="FirstSearch">
        {{ category }} <span class="so-crumb-sep">›</span> {{ cond1 }}
      </template>
    </div>

    <div class="so-filter">
      <div>
        <label class="mu-label" for="soStatus">판매상태</label>
        <select id="soStatus" class="mu-field" v-model="scond">
          <option value="9">전체</option>
          <option value="0">판매중</option>
          <option value="1">당일품절</option>
          <option value="2">계속품절</option>
        </select>
      </div>
      <div>
        <label class="mu-label" for="soName">메뉴명</label>
        <input
          id="soName"
          type="text"
          class="mu-field"
          enterkeyhint="search"
          autocomplete="off"
          placeholder="메뉴명 입력"
          v-model="scond2" />
      </div>
      <button type="button" class="mu-btn so-search" @click="searchButton">
        조회
      </button>
    </div>

    <div class="so-list-head">
      <label for="allcheck" class="so-check so-check--all"
        ><input type="checkbox" id="allcheck" @click="allCheck" /><span
          >전체선택</span
        ></label
      >
      <span class="mu-sub">메뉴를 누르면 선택됩니다</span>
    </div>

    <div v-if="menuList.length == 0" class="mu-empty">
      {{
        FirstSearch
          ? "조회된 메뉴가 없습니다. 조건을 확인한 뒤 조회를 눌러 주세요."
          : "카테고리를 선택하면 메뉴 목록이 표시됩니다."
      }}
    </div>

    <label
      v-for="(menu, idx) in menuList"
      :key="idx"
      class="so-row"
      :class="{
        'is-checked': ischecked(menu.MENU_CD),
        'is-long': wordLength(menu.MENU_NAME),
      }">
      <span class="so-check">
        <input type="checkbox" @change="toggleSelection(menu.MENU_CD)" />
      </span>
      <span class="so-main">
        <span class="so-name">{{ menu.MENU_NAME }}</span>
        <span class="mu-sub"
          >{{ menu.MENU_CD }} ·
          {{ formatNumberWithCommas(menu.MENU_PRICE) }}원</span
        >
      </span>
      <span
        class="mu-badge so-status"
        :class="{
          'is-soldout':
            menu.MENU_STATUS.includes(1) || menu.MENU_STATUS.includes(2),
        }">
        {{
          menu.MENU_STATUS == "1"
            ? "당일품절"
            : menu.MENU_STATUS == "2"
            ? "계속품절"
            : "판매중"
        }}
      </span>
    </label>
    <div class="so-bottom-space" :class="{ 'is-save': showSave }"></div>
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
  <div class="so-save" v-if="showSave">
    <div class="so-save-count">
      선택한 메뉴 <b>{{ selectedLeng }}</b
      >개를 아래 상태로 변경
    </div>
    <div class="so-save-row">
      <div class="mu-seg so-save-seg" role="radiogroup" aria-label="변경할 판매상태">
        <label
          for="sale"
          class="mu-seg-btn so-seg-label"
          :class="{ 'is-on': salecond == '0' }"
          ><input
            type="radio"
            class="sr-only"
            name="savecond"
            id="sale"
            value="0"
            v-model="salecond" />판매중</label
        >
        <label
          for="tsoldout"
          class="mu-seg-btn so-seg-label"
          :class="{ 'is-on': salecond == '1' }"
          ><input
            type="radio"
            class="sr-only"
            name="savecond"
            id="tsoldout"
            value="1"
            v-model="salecond" />당일품절</label
        >
        <label
          for="csoldout"
          class="mu-seg-btn so-seg-label"
          :class="{ 'is-on': salecond == '2' }"
          ><input
            type="radio"
            class="sr-only"
            name="savecond"
            id="csoldout"
            value="2"
            v-model="salecond" />계속품절</label
        >
      </div>
      <button type="button" class="mu-btn so-save-btn" @click="saveButton">
        저장
      </button>
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
import "../mobileUi.css";
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
onMounted(() => {});
</script>

<style scoped>
.so-crumb {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  min-height: 2.75rem;
  margin: 0.25rem 0.75rem 0.625rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--m-accent-border, #dbe7ff);
  border-radius: 0.75rem;
  background: var(--m-accent-weak, #eff4ff);
  color: var(--m-accent-strong, #1e40af);
  font-size: calc(0.9375rem * var(--m-fs, 1));
  font-weight: 700;
  word-break: keep-all;
}

.so-crumb.is-guide {
  border-color: var(--m-border, #e2e8f0);
  background: var(--m-surface, #fff);
  color: var(--m-text-3, #64748b);
  font-weight: 500;
}

.so-crumb-sep {
  padding: 0 0.25rem;
  color: var(--m-text-3, #93a8d6);
}

/* 판매상태 · 메뉴명 · 조회 버튼을 한 줄에, 아래 끝선을 맞춘다 */
.so-filter {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr) auto;
  align-items: end;
  gap: 0.5rem;
  padding: 0 0.75rem;
}

.so-search {
  min-width: 4rem;
}

.so-list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding: 0 1rem 0 0.25rem;
  border-top: 1px solid var(--m-border, #e2e8f0);
  border-bottom: 1px solid var(--m-border, #e2e8f0);
  background: var(--m-surface, #fff);
}

.so-check {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  min-height: 2.75rem;
}

.so-check--all {
  width: auto;
  gap: 0.125rem;
  padding-right: 0.5rem;
  color: var(--m-text-2, #334155);
  font-size: calc(0.875rem * var(--m-fs, 1));
  font-weight: 600;
}

.so-check--all input {
  margin: 0 0.75rem;
}

.so-check input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #2563eb;
}

.so-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-height: 3.5rem;
  padding: 0.5rem 1rem 0.5rem 0.25rem;
  border-bottom: 1px solid var(--m-border, #f1f5f9);
  background: var(--m-surface, #fff);
  touch-action: manipulation;
  transition: background-color 0.15s ease;
}

.so-row:active {
  background: var(--m-surface-2, #f1f5f9);
}

.so-row.is-checked {
  background: var(--m-accent-weak, #eff4ff);
}

.so-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  gap: 0.125rem;
}

.so-name {
  font-size: calc(0.9375rem * var(--m-fs, 1));
  font-weight: 600;
  line-height: 1.3;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.so-status {
  flex-shrink: 0;
  min-width: 3.75rem;
}

.so-status.is-soldout {
  background: var(--m-danger-weak, #fee2e2);
  color: var(--m-danger, #dc2626);
}

/* 저장 영역이 떠 있을 때 마지막 메뉴가 가려지지 않도록 */
.so-bottom-space.is-save {
  height: 7.5rem;
}

.so-save {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(3.6rem + env(safe-area-inset-bottom, 0px));
  z-index: 25;
  padding: 0.625rem 0.75rem 0.75rem;
  border-top: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem 1rem 0 0;
  background: var(--m-surface, #fff);
  box-shadow: 0 -8px 20px rgba(15, 23, 42, 0.08);
  text-align: left;
  -webkit-tap-highlight-color: transparent;
}

.so-save-count {
  margin-bottom: 0.5rem;
  color: var(--m-text-2, #475569);
  font-size: calc(0.8125rem * var(--m-fs, 1));
}

.so-save-count b {
  color: var(--m-accent, #2563eb);
  font-size: calc(0.9375rem * var(--m-fs, 1));
}

.so-save-row {
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
}

.so-save-seg {
  flex: 1;
  min-width: 0;
}

.so-seg-label {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
}

.so-save-btn {
  min-width: 4.5rem;
  min-height: 3rem;
}

@media (prefers-reduced-motion: reduce) {
  .so-row {
    transition: none;
  }
}
</style>
