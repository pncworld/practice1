/*--############################################################################
# Filename : SLS16_002RPT.vue                                                  
# Description : 매출관리 > 기타 매출 현황 > 이벤트 쿠폰 세부현황.              
# Date : 2026-01-07                                                             
# Author : 권지안                     
################################################################################*/
<template>
    <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
       <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
        <button @click="excelButton" class="button save w-auto excel">엑셀</button>
      </div>
    </div>
    <!-- 조회조건 -->
    <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-36 items-start z-10">
      <div class="grid grid-cols-1 grid-rows-2">
        <Datepicker2 class="" @endDate="endDate" @startDate="startDate" :closePopUp="closePopUp" ref="datepicker" @excelDate="excelDate" />
        <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 "> 쿠폰목록 
          <div class="flex ml-5 space-x-3 ">
            <v-select 
              v-model="selectEventCoupon" 
              :options="eventCoupon" 
              placeholder="" 
              label="strName" 
              class="w-60 !h-8 bg-white " 
              clearable="true"/>
          </div>
        </div>
        <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 "> 쿠폰번호 
          <div>
            <input type="text" class="w-60 h-8 ml-5" v-model="couponNo" />
          </div>
        </div>
      </div>
      <div class="h-[75%] ">
        <pickStoreSingle 
          @lngStoreCode="lngStoreCodes" 
          @lngStoreGroup="lngStoreGroup"  
          @lngStoreAttrs="lngStoreAttrs" 
          @lngSupervisor="lngSupervisor" 
          @lngStoreTeam="lngStoreTeam"
          @excelStore="excelStore" 
        />
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[82%]">
      <Realgrid :progname="'SLS16_002RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload" :rowStateeditable="false"
         :setFooter="true" :setGroupFooter="true" :setGroupColumnId="'strName'"
         :setFooterColID="setFooterColID" :setFooterExpressions="setFooterExpressions"
         :setGroupFooterColID="setGroupFooterColID" :setGroupFooterExpressions="setGroupFooterExpressions"
         :exporttoExcel="exportExcel" :documentTitle="'SLS16_002RPT'" :documentSubTitle="documentSubTitle" />
    </div>
    <!-- 그리드 영역 -->
    </div>
  </template>
  
  <script setup>
  import { getEventCouponList, getEventCouponDetailReport } from '@/api/misales';
/**
 *  매출일자 조회 컴포넌트
 */
import Datepicker2 from '@/components/Datepicker2.vue';

/**
 *  리얼그리드 컴포넌트
 */

import Realgrid from '@/components/realgrid.vue';

/**
 *  매장 단일 호출 컴포넌트
 */

import pickStoreSingle from '@/components/pickStoreSingle.vue';

/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from 'vue';
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from 'vuex';

/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from '@/customFunc/customFunc';

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from '@/components/pageName.vue';
 
// 그리드 푸터, 그룹푸터 설정
const setFooterColID = ref(['intRegNo'])
const setFooterExpressions = ref(['count'])
const setGroupFooterColID = ref(['intRegNo'])
const setGroupFooterExpressions = ref(['count'])

const progid = ref(1)
const reload = ref(false)
const rowData = ref([])
const afterSearch = ref(false)
const selectedstartDate = ref()
const selectedendDate = ref()

/**
 * 선택한 매출 시작일자
 */

const startDate = (e) => {
    //comsole.log(e)
    selectedstartDate.value = e
  }
  /**
 * 선택한 매출 종료일자
 */

const endDate = (e) => {
    selectedendDate.value = e
  }
  const store = useStore()
  const loginedstrLang = store.state.userData.lngLanguage

  const datepicker = ref(null)
  const closePopUp = ref(false)
  /**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
    const datepickerEl = datepicker.value?.$el;
    if (datepickerEl && datepickerEl.contains(e.target)) {
        return;
    }
    closePopUp.value = !closePopUp.value
  }
  
  /**
 *  조회 함수
 */

 
const searchButton= async () => {
    store.state.loading = true;
    try {
      initGrid()
      //그리드 갱신
      reload.value = !reload.value

      const res = await getEventCouponDetailReport(
          selectedGroup.value, selectedStoreAttrs.value, selectedStoreTeam.value, selectedSupervisor.value, selectedStores.value
        , selectedstartDate.value, selectedendDate.value, selectedCouponCode.value, couponNo.value || ""  // ← 쿠폰번호 input 값 사용
      )

      // dtmDate 필드를 YYYY-MM-DD 형식으로 포맷팅
      rowData.value = res.data.eventCouponDetail.map((item) => {
        if (item.dtmDate) {
          item.dtmDate = item.dtmDate.split(" ")[0];
        }
        return item;
      });
      
      afterSearch.value = true
  
    } catch (error) {
      afterSearch.value = false
      // console.log(error);
    } finally {
      store.state.loading = false;
  
    }
  
  }
  
  /* 매장 컴포넌트 관련 함수 */
  const selectedGroup = ref()
  const selectedStores = ref()
  const selectedStoreAttrs = ref()
  const selectedSupervisor = ref()
  const selectedStoreTeam = ref();
  /**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
    initGrid()
    //comsole.log(e)
    selectedGroup.value = e
  }
  /**
 * 페이지 매장 코드 세팅
 */

const lngStoreCodes = (e) => {
    initGrid()
    selectEventCoupon.value = null
    selectedStores.value = e
    //comsole.log(e)
  }


  

const lngStoreAttrs = (e) => {
    initGrid()
    selectedStoreAttrs.value = e
    //comsole.log(e)
  }
  /**
 * 페이지 매장 슈퍼바이저 세팅
 */

const lngSupervisor = (e) => {
    initGrid()
    selectedSupervisor.value = e
    //comsole.log(e)
  }

/**
 * 페이지 매장 팀 세팅
 */

const lngStoreTeam = (e) => {
  initGrid();
  selectedStoreTeam.value = e;
  ////console.log(e);
};
  
  
  /* 쿠폰목록 콤보박스 */
  const selectEventCoupon = ref(null)
  const eventCoupon = ref([])
  const selectedCouponCode = ref("")
  
  /* 쿠폰번호 입력 */
  const couponNo = ref("")

  /**
 * 	화면 Load시 실행 스크립트
 */
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
    const res = await getEventCouponList(selectedGroup.value)
    eventCoupon.value = res.data.eventCouponList
    
    // 첫 번째 항목이 있으면 자동 선택
    if (eventCoupon.value && eventCoupon.value.length > 0) {
      selectEventCoupon.value = eventCoupon.value[0]
    }
})
  
watch(selectEventCoupon, (newValue) => {
    // SLS16_002RPT 페이지에서만: clear(X) 버튼으로 null이 되면 첫 번째 항목 자동 선택
    if (newValue === null && eventCoupon.value && eventCoupon.value.length > 0) {
      selectEventCoupon.value = eventCoupon.value[0]
      return
    }
    
    selectedCouponCode.value = newValue ? newValue.lngType : ""
    // console.log(selectedCouponCode.value);
})
  
/**
 * 그리드 초기화
 */

const initGrid = () => {
    if (rowData.value.length > 0) {
      rowData.value = []
    }
  }
  
 //엑셀 버튼 처리 함수
 const exportExcel = ref(false)
 
  /**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
    if(selectedExcelStore.value == '매장명 : 선택'){
      documentSubTitle.value = selectedExcelDate.value +'\n'+ '매장명 : 전체'
    } else {
      documentSubTitle.value = selectedExcelDate.value +'\n'+ selectedExcelStore.value
    }
    //comsole.log(documentSubTitle.value);
    // 엑셀 기능 실행
    exportExcel.value = !exportExcel.value
  }
  
  // 엑셀 추출
  const documentSubTitle = ref('')
  const selectedExcelDate = ref('')
  
  /**
 * 엑셀용 일자 세팅 함수
 */
const excelDate = (e)=> {
   selectedExcelDate.value = e
   //comsole.log(e)
  }
  const selectedExcelStore = ref('')

  /**
 * 엑셀용 매장 세팅 함수
 */
const excelStore = (e) =>{
    selectedExcelStore.value = e
    //comsole.log(e)
  }
  </script>