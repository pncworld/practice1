<template>
    <div class="h-full" @click="handleParentClick">
        <div class="flex justify-between items-center w-full overflow-y-auto">
            <div class="flex justify-start  w-full pl-12 pt-4">
                <div class="flex justify-start">
                    <h1 class="font-bold text-sm md:text-2xl w-full">구매형태별 매출현황.</h1>
                </div>
            </div>
            <div class="flex justify-center mr-9 space-x-2 pr-5">
                <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
                <button @click="excelButton" class="button save w-auto excel">엑셀</button>
            </div>
        </div>
        <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-16 items-center z-10">
            <div class="mt-1 ">
                <Datepicker2 @startDate="startDate" @endDate="endDate" :closePopUp="closePopUp" ref="datepicker"
                    :selectedGroup="selectedGroup" @excelDate="excelDate" />
              
            </div>
            <div class="h-[75%] ml-5 mt-1">
                <pickStoreRenew @lngStoreCode="lngStoreCode" @lngStoreGroup="lngStoreGroup" @excelStore="excelStore"
                    @lngStoreAttrs="lngStoreAttrs"></pickStoreRenew>
            </div>
        </div>
        <div class="w-full h-[82%]">
            <Realgrid :progname="'SLS11_014RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload"
                 :mergeColumns2="true" :mergeColumnGroupSubList2="[['Eat_INCNT','Eat_INPrice','Eat_INRate','Eat_INSum'],['Take_OUTCNT','Take_OUTPrice','Take_OUTRate','Take_OUTSum'],['Total_Cnt','Total_Price','Total_Rate','Total_Sum']]" :mergeColumnGroupName2="['Eat-In','Take-Out','합계']"
                :documentTitle="'SLS11_014RPT'" :documentSubTitle="documentSubTitle" :exporttoExcel="exportExcel">
            </Realgrid>
        </div>
    </div>
</template>

<script setup>
import { getSalesByBuyType, getSalesByTimeAndSeats } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import pickStoreRenew from '@/components/pickStoreRenew.vue';
import Realgrid from '@/components/realgrid.vue';
import { insertPageLog } from '@/customFunc/customFunc';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
onMounted(async () => {

    const pageLog = await insertPageLog(store.state.activeTab2)

})
const setFooterColID = ref([ 'strStoreName'])
const setFooterExpressions = ref([ 'custom'])

const reload = ref(false)
const rowData = ref([])
const afterSearch = ref(false)
const selectedstartDate = ref();
const selectedendDate = ref();
const selectedStartTime = ref({ value: 0, strName: '00:00' })
const selectedEndTime = ref({ value: 23, strName: '23:00' })

const startDate = (e) => {
    console.log(e);
    selectedstartDate.value = e;
};

const endDate = (e) => {
    console.log(e);
    selectedendDate.value = e;
};



const tempSeeDaily = ref(false);
const tempSeeStore = ref(false);




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

/* 
 *조회 처리 함수
 */
const searchButton = async () => {
    store.state.loading = true;
    try {
        initGrid()

    
        const res = await getSalesByBuyType(selectedGroup.value, selectedStoreAttrs.value, selectedStores.value , selectedstartDate.value, selectedendDate.value)
        console.log(res)
        rowData.value = res.data.List

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
const lngStoreCode = (e) => {
    initGrid()
    selectedStores.value = e
    console.log(e)
}
const lngStoreAttrs = (e) => {
    initGrid()
    selectedStoreAttrs.value = e
    console.log(e)
}

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
  
    documentSubTitle.value = selectedExcelDate.value + '\n' + selectedExcelStore.value 

    exportExcel.value = !exportExcel.value
}

// 엑셀 추출
const documentSubTitle = ref('')
const selectedExcelDate = ref('')
const excelDate = (e) => {
    selectedExcelDate.value = e
    console.log(e)
}
const selectedExcelStore = ref('')
const excelStore = (e) => {
    selectedExcelStore.value = e
    console.log(e)
}
</script>