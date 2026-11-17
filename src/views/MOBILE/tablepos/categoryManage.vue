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
    <div class="mu-crumb" :class="{ 'is-guide': !FirstSearch }">
      <template v-if="!FirstSearch">
        위 조회 조건에서 카테고리를 먼저 선택해 주세요.
      </template>
      <template v-if="FirstSearch">
        {{ category }} <span class="mu-crumb-sep">›</span> {{ cond1 }}
      </template>
    </div>

    <div class="cm-form" :class="{ 'is-locked': !FirstSearch }">
      <section class="cm-card">
        <div class="cm-title">사용여부</div>
        <div class="mu-seg" role="radiogroup" aria-label="사용여부">
          <label
            for="use"
            class="mu-seg-btn cm-seg"
            :class="{ 'is-on': cond8 == 'Y' }"
            ><input
              type="radio"
              class="sr-only"
              name="cond8"
              id="use"
              :disabled="!FirstSearch"
              v-model="cond8"
              value="Y" />사용</label
          >
          <label
            for="nuse"
            class="mu-seg-btn cm-seg"
            :class="{ 'is-on': cond8 == 'N' }"
            ><input
              type="radio"
              class="sr-only"
              name="cond8"
              id="nuse"
              :disabled="!FirstSearch"
              v-model="cond8"
              value="N" />미사용</label
          >
        </div>
      </section>

      <section class="cm-card">
        <div class="cm-title-row">
          <div class="cm-title">사용기간</div>
          <label for="alldate" class="cm-check"
            ><input
              type="checkbox"
              id="alldate"
              :disabled="!FirstSearch"
              v-model="alldate"
              @click="handleDate" /><span>전체기간</span></label
          >
        </div>
        <div class="cm-pair">
          <div>
            <label class="mu-label" for="cmFromDate">시작일</label>
            <input
              type="date"
              id="cmFromDate"
              v-model="cond2"
              class="mu-field"
              :disabled="!FirstSearch || disable1" />
          </div>
           
          <div>
            <label class="mu-label" for="cmToDate">종료일</label>
            <input
              type="date"
              id="cmToDate"
              v-model="cond5"
              class="mu-field"
              :disabled="!FirstSearch || disable1" />
          </div>
        </div>
      </section>

      <section class="cm-card">
        <div class="cm-title-row">
          <div class="cm-title">사용시간</div>
          <label for="alltime" class="cm-check"
            ><input
              type="checkbox"
              id="alltime"
              :disabled="!FirstSearch"
              v-model="alltime"
              @click="handleTime" /><span>전체시간</span></label
          >
        </div>
        <div class="cm-pair">
          <div>
            <span class="mu-label">시작시간</span>
            <div class="cm-time">
              <select
                aria-label="시작 시"
                v-model="cond3"
                :disabled="!FirstSearch || disable2"
                class="mu-field">
                <option
                  :value="i.lngCode"
                  v-for="i in optionList"
                  :key="i.lngCode">
                  {{ i.strName }}
                </option>
              </select>
              <span>시</span>
              <select
                aria-label="시작 분"
                v-model="cond4"
                :disabled="!FirstSearch || disable2"
                class="mu-field">
                <option
                  :value="i.lngCode"
                  v-for="i in optionList2"
                  :key="i.lngCode">
                  {{ i.strName }}
                </option>
              </select>
              <span>분</span>
            </div>
          </div>
    
          <div>
            <span class="mu-label">종료시간</span>
            <div class="cm-time">
              <select
                aria-label="종료 시"
                v-model="cond6"
                :disabled="disable2 || !FirstSearch"
                class="mu-field">
                <option
                  :value="i.lngCode"
                  v-for="i in optionList"
                  :key="i.lngCode">
                  {{ i.strName }}
                </option>
              </select>
              <span>시</span>
              <select
                aria-label="종료 분"
                v-model="cond7"
                :disabled="disable2 || !FirstSearch"
                class="mu-field">
                <option
                  :value="i.lngCode"
                  v-for="i in optionList2"
                  :key="i.lngCode">
                  {{ i.strName }}
                </option>
              </select>
              <span>분</span>
            </div>
          </div>
        </div>
      </section>

      <section class="cm-card">
        <div class="cm-title-row">
          <div class="cm-title">사용요일</div>
          <label for="allcheck" class="cm-check"
            ><input
              @click="checkDays"
              type="checkbox"
              id="allcheck"
              v-model="allcheck"
              :disabled="!FirstSearch" /><span>전체체크</span></label
          >
        </div>
        <div class="cm-days">
          <label for="mon" class="cm-day" :class="{ 'is-on': mon }"
            ><input
              type="checkbox"
              class="sr-only"
              id="mon"
              v-model="mon"
              :disabled="!FirstSearch"
              @click="handleday" />월</label
          >
          <label for="tue" class="cm-day" :class="{ 'is-on': tue }"
            ><input
              type="checkbox"
              class="sr-only"
              id="tue"
              :disabled="!FirstSearch"
              v-model="tue"
              @click="handleday" />화</label
          >
          <label for="wed" class="cm-day" :class="{ 'is-on': wed }"
            ><input
              type="checkbox"
              class="sr-only"
              id="wed"
              :disabled="!FirstSearch"
              v-model="wed"
              @click="handleday" />수</label
          >
          <label for="thu" class="cm-day" :class="{ 'is-on': thu }"
            ><input
              type="checkbox"
              class="sr-only"
              id="thu"
              :disabled="!FirstSearch"
              v-model="thu"
              @click="handleday" />목</label
          >
          <label for="fri" class="cm-day" :class="{ 'is-on': fri }"
            ><input
              type="checkbox"
              class="sr-only"
              id="fri"
              :disabled="!FirstSearch"
              v-model="fri"
              @click="handleday" />금</label
          >
          <label for="sat" class="cm-day" :class="{ 'is-on': sat }"
            ><input
              type="checkbox"
              class="sr-only"
              id="sat"
              :disabled="!FirstSearch"
              v-model="sat"
              @click="handleday" />토</label
          >
          <label for="sun" class="cm-day" :class="{ 'is-on': sun }"
            ><input
              type="checkbox"
              class="sr-only"
              id="sun"
              :disabled="!FirstSearch"
              v-model="sun"
              @click="handleday" />일</label
          >
          <label
            for="holiday"
            class="cm-day cm-day--wide"
            :class="{ 'is-on': holiday }"
            ><input
              type="checkbox"
              class="sr-only"
              id="holiday"
              :disabled="!FirstSearch"
              v-model="holiday"
              @click="handleHoli" />공휴일</label
          >
        </div>
      </section>

      
      </div>
      
    <div class="cm-save">
      <button
        type="button"
        class="mu-btn mu-btn--block"
        @click="saveButton"
        :disabled="!FirstSearch">
        저장
      </button>
    </div>
  </div>
  <CategorySelect
    @click.stop
    class="z-[10]"
    :changeState="changeState"
    :reSearch="reSearch"
    :defaultChoice="true"
    @currState="currState"
    @FILTERDATA="FILTERDATA"
    @mainCategory="mainCategory"
    @GROUP_CD="GROUP_CD"
    @STORE_CD="STORE_CD"></CategorySelect>
</template>

<script setup>
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
import "../mobileUi.css";
import CategorySelect from "../component/categorySelect.vue";
import Swal from "sweetalert2";
import { SetSClassStkRgst } from "@/api/etc";

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
const selectStartDate = ref("");
const selectEndDate = ref("");
const selectGroupCd = ref("");
const selectStoreCd = ref("");
/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
  selectStartDate.value = e;
};
/**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
  selectEndDate.value = e;
};
const GROUP_CD = (e) => {
  selectGroupCd.value = e;
};
const STORE_CD = (e) => {
  selectStoreCd.value = e;
};

const rowData = ref([]);

const optionList = ref([
  { lngCode: 0, strName: '00' },
  { lngCode: 1, strName: '01' },
  { lngCode: 2, strName: '02' },
  { lngCode: 3, strName: '03' },
  { lngCode: 4, strName: '04' },
  { lngCode: 5, strName: '05' },
  { lngCode: 6, strName: '06' },
  { lngCode: 7, strName: '07' },
  { lngCode: 8, strName: '08' },
  { lngCode: 9, strName: '09' },
  { lngCode: 10, strName: 10 },
  { lngCode: 11, strName: 11 },
  { lngCode: 12, strName: 12 },
  { lngCode: 13, strName: 13 },
  { lngCode: 14, strName: 14 },
  { lngCode: 15, strName: 15 },
  { lngCode: 16, strName: 16 },
  { lngCode: 17, strName: 17 },
  { lngCode: 18, strName: 18 },
  { lngCode: 19, strName: 19 },
  { lngCode: 20, strName: 20 },
  { lngCode: 21, strName: 21 },
  { lngCode: 22, strName: 22 },
  { lngCode: 23, strName: 23 },
]);

const optionList2 = ref([
  { lngCode: 0, strName: '00' },
  { lngCode: 10, strName: 10 },
  { lngCode: 20, strName: 20 },
  { lngCode: 30, strName: 30 },
  { lngCode: 40, strName: 40 },
  { lngCode: 50, strName: 50 },
]);

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

const handleDate = (e) => {
  alldate.value = !alldate.value;

};
const handleTime = (e) => {
  alltime.value = !alltime.value;
};

const handleHoli = (e) => {
  holiday.value = !holiday.value;
};

const LCLASS_CD = ref('')
const SCLASS_CD = ref('')
const FILTERDATA = (e) => {
  FirstSearch.value = true
  ////console.log(e);
  LCLASS_CD.value = e[0].LCLASS_CD;
  SCLASS_CD.value = e[0].SCLASS_CD;
  cond1.value = e[0].FULL_NM;
  cond2.value = e[0].FROM_DATE;
  cond3.value = parseInt(e[0].FROM_TIME.substring(0, 2));
  cond4.value = parseInt(e[0].FROM_TIME.substring(2));

  cond5.value = e[0].TO_DATE;
  cond6.value = parseInt(e[0].TO_TIME.substring(0, 2));
  cond7.value = parseInt(e[0].TO_TIME.substring(2));

  cond8.value = e[0].USE_YN;

  mon.value = e[0].SEL_DAY.substring(0, 1) == "1" ? true : false;
  tue.value = e[0].SEL_DAY.substring(1, 2) == "1" ? true : false;
  wed.value = e[0].SEL_DAY.substring(2, 3) == "1" ? true : false;
  thu.value = e[0].SEL_DAY.substring(3, 4) == "1" ? true : false;
  fri.value = e[0].SEL_DAY.substring(4, 5) == "1" ? true : false;
  sat.value = e[0].SEL_DAY.substring(5, 6) == "1" ? true : false;
  sun.value = e[0].SEL_DAY.substring(6, 7) == "1" ? true : false;

  holiday.value = e[0].SEL_DAY.substring(7, 8) == "1" ? true : false;

  alldate.value = e[0].ALL_DATE == "1" ? true : false;
  alltime.value = e[0].ALL_TIME == "1" ? true : false;
};

const mon = ref(false);
const tue = ref(false);
const wed = ref(false);
const thu = ref(false);
const fri = ref(false);
const sat = ref(false);
const sun = ref(false);

const disable1 = ref(false)
const disable2 = ref(false)
const handleday = (e) => {
  const id = e.target.id;
  const val = e.target.value;

  if (id == "mon") {
    mon.value = !mon.value;
  } else if (id == "tue") {
    tue.value = !tue.value;
  } else if (id == "wed") {
    wed.value = !wed.value;
  } else if (id == "thu") {
    thu.value = !thu.value;
  } else if (id == "fri") {
    fri.value = !fri.value;
  } else if (id == "sat") {
    sat.value = !sat.value;
  } else if (id == "sun") {
    sun.value = !sun.value;
  }
};

const allcheck = ref(false)
const checkDays = (e) => {

  allcheck.value = e.target.checked
  if(e.target.checked){
  holiday.value = true;
    mon.value = true;
    tue.value = true;
    wed.value = true;
    thu.value = true;
    fri.value = true;
    sat.value = true;
    sun.value = true;
  } else {
    holiday.value = false;
    mon.value = false;
    tue.value = false;
    wed.value = false;
    thu.value = false;
    fri.value = false;
    sat.value = false;
    sun.value = false;
  }
}

watch(([mon,tue,wed,thu,fri,sat,sun,holiday]) ,() => {
  if(mon.value == false || tue.value == false|| wed.value == false|| thu.value == false|| fri.value == false|| sat.value == false|| sun.value == false|| holiday.value == false){
    allcheck.value = false
  } else {
    allcheck.value = true
  }
})

watch((alldate) ,() => {
  if(alldate.value == true){
    disable1.value =true
  } else {
    disable1.value =false
  }

})

watch((alltime) ,() => {
  if(alltime.value == true){
    disable2.value =true
  } else {
    disable2.value =false
  }

})

const reSearch = ref(false)
const saveButton = async (e) => {
  // ////console.log(alldate.value)
  // ////console.log(cond2.value == undefined)

  if(alldate.value == true){
    cond2.value = new Date().toISOString().split('T')[0]
    cond5.value = new Date().toISOString().split('T')[0]
  }

  if(alldate.value == false && cond2.value ==''){
    Swal.fire({
        title: "경고",
        text: "사용시작날짜를 정확히 지정해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }
  if(alldate.value == false && cond5.value ==''){
    Swal.fire({
        title: "경고",
        text: "사용종료날짜를 정확히 지정해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }

  if(alldate.value == false && (new Date(cond2.value) > new Date(cond5.value))){
    Swal.fire({
        title: "경고",
        text: "종료날짜가 시작날짜보다 앞섭니다. 수정을 해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }
  if(LCLASS_CD.value ==''){
    Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }

  // ////console.log(cond2.value)
  // ////console.log(cond5.value)
  if(cond3.value == cond6.value && cond4.value == cond7.value){
    Swal.fire({
        title: "경고",
        text: "같은 시간을 선택하셨습니다. 다른 시간으로 변경해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
  }
  try {

    let seeday = ''

    if(mon.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(tue.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(wed.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(thu.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(fri.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }
    if(sat.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }

    if(sun.value == true) {
      seeday += '1'
    } else {
seeday += '0'
    }
    if(holiday.value == true) {
      seeday += '1'
    } else {
    seeday += '0'
    }

    let ftime = String(cond3.value).padStart(2, '0') +String(cond4.value).padStart(2, '0')
    let etime = String(cond6.value).padStart(2, '0') +String(cond7.value).padStart(2, '0')
    const res = await SetSClassStkRgst(selectGroupCd.value , selectStoreCd.value , LCLASS_CD.value , SCLASS_CD.value , cond8.value , alldate.value == true ? 1 : 0 , cond2.value , cond5.value , seeday , alltime.value == true ? 1 : 0 , ftime, etime )
     ////console.log(res)

    if(res.data.Result =='00'){
      Swal.fire({
        title: "성공",
        text: "저장을 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: `저장에 실패하였습니다. ${res.data.Result}`,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    
  } finally {
    reSearch.value = !reSearch.value
  }
};

const category = ref('')
const mainCategory = (e) =>{
  category.value =e
}
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
const FirstSearch = ref(false)
onMounted(() => {});
</script>

<style scoped>
.cm-form {
  display: grid;
  gap: 0.625rem;
  padding: 0 0.75rem;
  -webkit-tap-highlight-color: transparent;
}

.cm-card {
  padding: 0.875rem 1rem 1rem;
  border: 1px solid var(--m-border, #e2e8f0);
  border-radius: 1rem;
  background: var(--m-surface, #fff);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
}

.cm-title {
  color: var(--m-text, #0f172a);
  font-size: 0.9375rem;
  font-weight: 700;
}

.cm-card > .cm-title {
  margin-bottom: 0.625rem;
}

.cm-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 2.75rem;
  margin: -0.375rem 0 0.375rem;
}

/* 체크 항목: 글자까지 포함해 44px 높이로 누를 수 있게 */
.cm-check {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding-left: 0.75rem;
  color: var(--m-text-2, #334155);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  touch-action: manipulation;
}

.cm-check input {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #2563eb;
}

.cm-pair {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.5rem;
}

.cm-time {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.25rem;
  color: var(--m-text-3, #64748b);
  font-size: 0.8125rem;
}

.cm-time select.mu-field {
  padding-left: 0.5rem;
  padding-right: 1.5rem;
  background-position: right 0.25rem center;
}

.cm-seg {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cm-days {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.5rem;
}

.cm-day {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  border: 1px solid var(--m-border-strong, #cbd5e1);
  border-radius: 0.75rem;
  background: var(--m-surface, #fff);
  color: var(--m-text-2, #475569);
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  transition: background-color 0.15s ease, border-color 0.15s ease,
    color 0.15s ease;
}

.cm-day--wide {
  grid-column: span 2;
}

.cm-day:active {
  background: var(--m-surface-2, #f1f5f9);
}

.cm-day.is-on {
  border-color: #2563eb;
  background: #2563eb;
  color: #fff;
}

/* 카테고리 선택 전: 모든 입력이 비활성임을 한눈에 보이게 */
.cm-form.is-locked .cm-day,
.cm-form.is-locked .cm-seg,
.cm-form.is-locked .cm-check {
  color: var(--m-text-4, #94a3b8);
  cursor: default;
}

.cm-form.is-locked .cm-day {
  border-color: var(--m-border, #e2e8f0);
  background: var(--m-surface-2, #f1f5f9);
}

.cm-form.is-locked .cm-seg.is-on {
  background: transparent;
  box-shadow: none;
}

.cm-save {
  padding: 0.875rem 0.75rem 0;
}

.cm-save .mu-btn {
  min-height: 3rem;
  font-size: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  .cm-day {
    transition: none;
  }
}

</style>
