<template>
    <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-auto">
      <div class="flex justify-start  w-full pl-12 pt-4">
        <div class="flex justify-start">
          <h1 class="font-bold text-sm md:text-2xl w-full">카드 매출 세부 현황.</h1>
        </div>
      </div>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
        <button @click="excelButton" class="button save w-auto excel">엑셀</button>
      </div>
    </div>
    <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-32 items-center z-10">
      <div class="grid grid-cols-1 grid-rows-3">
        <Datepicker2 @endDate="endDate" @startDate="startDate" :closePopUp="closePopUp" ref="datepicker" @excelDate="excelDate"></Datepicker2>
        <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 "> 매입사 : 
          <div class="flex ml-7 space-x-3 mt-1">
            <v-select v-model="selectCardCorp" :options="cardCorp" placeholder="전체" label="strBuyName" class="w-48 !h-8 bg-white " clearable="true"/>
          </div>
        </div>
        <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 ">조회조건 :
          <div>
            <label for="accept" class="font-thin">
              <input type="radio" id="accept" value="0" v-model="selectedRadioBox" class="ml-5"> 승인
            </label>
          </div>
          <div>
            <label for="cancel" class="font-thin">
              <input type="radio" id="cancel" value="1" v-model="selectedRadioBox" class="ml-5"> 취소
            </label>
          </div>
        </div>
      </div>
      <div class="h-[75%] ml-12">
        <!-- <PickStorePlural @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @lngStoreAttrs="lngStoreAttrs" @excelStore="excelStore" ></PickStorePlural> -->
        <PickStoreSingle2 @lngStoreCode="lngStoreCodes" @lngStoreGroup="lngStoreGroup"  @lngStoreAttrs="lngStoreAttrs" @excelStore="excelStore"></PickStoreSingle2>
      </div>
    </div>
    <div class="w-full h-[82%]">
      <!-- <Realgrid :progname="'SLS02_014RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload" 
         :setFooter="true" :setGroupFooter="setGroupFooter" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
        :setGroupColumnId="'strStore'" :setGroupSumCustomText="['소계']" :setGroupSumCustomColumnId="setGroupSumCustomColumnId"
        :setGroupSumCustomLevel="3" :setGroupSummaryCenterIds="setGroupSummaryCenterIds" :setGroupFooterExpressions="setGroupFooterExpressions" :setGroupFooterColID="setGroupFooterColID"
        :documentTitle="'SLS02_014RPT'" :documentSubTitle="documentSubTitle" :exporttoExcel="exportExcel">
      </Realgrid> -->
      <Realgrid :progname="'SLS05_002RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload" 
         :setFooter="true" :setFooterExpressions="setFooterExpressions" :setFooterColID="setFooterColID"
         :exporttoExcel="exportExcel" :documentTitle="'SLS05_002RPT'" :documentSubTitle="documentSubTitle" 
      </Realgrid>
    </div>
    </div>
  </template>
  
  <script setup>
  import { getCardCorp, getCardSalesDetailReport } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import Realgrid from '@/components/realgrid.vue';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
  
  const setFooterColID = ref(['lngAmount'])
  const setFooterExpressions = ref(['sum'])
  const progid = ref(1)
  const reload = ref(false)
  const rowData = ref([])
  const afterSearch = ref(false)
  const selectedstartDate = ref()
  const selectedendDate = ref()
  const startDate = (e) => {
    console.log(e)
    selectedstartDate.value = e
  }
  const endDate = (e) => {
    selectedendDate.value = e
  }
  const store = useStore()
  const loginedstrLang = store.state.userData.lngLanguage

  const datepicker = ref(null)
  const closePopUp = ref(false)
  const handleParentClick = (e) => {
    const datepickerEl = datepicker.value?.$el;
    if (datepickerEl && datepickerEl.contains(e.target)) {
        return;
    }
    closePopUp.value = !closePopUp.value
  }
  
  // 조회조건 라디오박스(승인, 취소)
  const selectedRadioBox = ref('0') // 기본 선택값

  /* 
   *조회 처리 함수
   */
  const searchButton = async () => {
    store.state.loading = true;
    try {
      initGrid()

      //그리드 갱신
      reload.value = !reload.value

      //매장 선택
      let selectedStorearr;
      if (selectedStores.value == undefined || selectedStores.value.length == 0 || selectedStores.value == 0) {
        selectedStorearr = 0
      } else {
        selectedStorearr = selectedStores.value
      }

      console.log(selectedStorearr)
      
      //매입사코드 선택 콤보박스
      let selectedBuyCodeValue;
      if (selectedBuyCode.value == undefined || selectedBuyCode.value.length == 0 || selectedBuyCode.value == 0) {
        selectedBuyCodeValue = 0
      } else {
        selectedBuyCodeValue = selectedBuyCode.value
      }

      console.log(selectedBuyCodeValue)

      const res = await getCardSalesDetailReport(
        selectedGroup.value, selectedStorearr, selectedstartDate.value, selectedendDate.value, 0, selectedRadioBox.value, selectedBuyCodeValue
      )
      console.log(res)
      rowData.value = res.data.cardSalesDetail
  
      afterSearch.value = true
  
    } catch (error) {
      afterSearch.value = false
      console.log(error);
    } finally {
      store.state.loading = false;
  
    }
  
  }
  
  /* 매장 컴포넌트 관련 함수 */
  const selectedGroup = ref()
  const selectedStores = ref()
  const selectedStoreAttrs = ref()
  const lngStoreGroup = (e) => {
    initGrid()
    console.log(e)
    selectedGroup.value = e
  }
  const lngStoreCodes = (e) => {
    initGrid()
    selectCardCorp.value = null
    selectedStores.value = e
    console.log(e)
  }
  const lngStoreAttrs = (e) => {
    initGrid()
    selectedStoreAttrs.value = e
    console.log(e)
  }
  
  /* 매입사 콤보박스 */
  const selectCardCorp = ref(null)
  const cardCorp = ref([])
  const selectedBuyCode = ref("")

  onMounted(async () => {
    console.log(selectedGroup.value, selectedStores.value)
    const res = await getCardCorp(selectedGroup.value, selectedStores.value, 1)
    cardCorp.value = res.data.cardCorpList
    console.log(cardCorp.value)
  })

  watch([selectedGroup, selectedStores], async () => {
      console.log(selectedGroup.value, selectedStores.value)
      const res = await getCardCorp(selectedGroup.value, selectedStores.value, 1)
      cardCorp.value = res.data.cardCorpList
      console.log(cardCorp.value)
  })
  
  watch(selectCardCorp, (newValue) => {
    selectedBuyCode.value = newValue ? newValue.strBuyCode : ""
    console.log(selectedBuyCode.value)
  })
  
  /*
  그리드 초기화
  */
  const initGrid = () => {
    if (rowData.value.length > 0) {
      rowData.value = []
    }
  }
  
  //엑셀 버튼 처리 함수
  const exportExcel = ref(false)
  const excelButton = () => {
    documentSubTitle.value = selectedExcelDate.value +'\n'+ selectedExcelStore.value
    console.log(documentSubTitle.value); // 맑음 소스 pickStorePlural.vue 소스의 excelStore 받아야 함.
    // 엑셀 기능 실행
    exportExcel.value = !exportExcel.value
  }
  
  // 엑셀 추출
  const documentSubTitle = ref('')
  const selectedExcelDate = ref('')
  const excelDate = (e)=> {
   selectedExcelDate.value = e
   console.log(e)
  }
  const selectedExcelStore = ref('')
  const excelStore = (e) =>{
    selectedExcelStore.value = e
    console.log(e)
  }
  </script>