<template>
    <div class="h-full" @click="handleParentClick">
        <div class="flex justify-between items-center w-full overflow-y-auto">
            <div class="flex justify-start  w-full pl-12 pt-4">
                <div class="flex justify-start">
                    <h1 class="font-bold text-sm md:text-2xl w-full">
                        메뉴군별 매출 현황2.
                    </h1>
                </div>

            </div>
            <div class="flex justify-center mr-9 space-x-2 pr-5">
                <button @click="chartButton" class="button primary md:w-auto w-14">차트</button>
                <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
                <button @click="excelButton" class="button save w-auto excel">엑셀</button>
                <button @click="printButton" class="button primary w-auto">인쇄</button>

            </div>
        </div>
        <div class="grid grid-cols-2 grid-rows-1 justify-between  bg-gray-200 rounded-lg h-36 items-center z-10 ">
            <div class="grid grid-cols-1 grid-rows-4 -space-y-3 mt-12">
                <Datepicker2 @endDate="endDate" @startDate="startDate" :closePopUp="closePopUp" ref="datepicker"
                    @excelDate="excelDate"></Datepicker2>
                <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 ">
                    메뉴구분 : <div class="flex ml-3 space-x-3">
                        <select name="" id="" class="border w-40 h-7 rounded-lg" v-model="selectedMenu">
                            <option :value="0">전체</option>
                            <option :value="1">대그룹</option>
                            <option :value="2">서브그룹</option>
                            <option :value="3">메뉴코드</option>

                        </select>
                        <select name="" id="" class="border w-40 h-7 rounded-lg" v-model="selectedsubMenu">

                            <option :value="i.lngCode" v-for="i in subList">{{ i.strName }}</option>
                        </select>
                    </div>
                </div>
                <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 -mt-20 h-8 -space-x-2">조회조건 :
                    <div>
                        <label for="store" class="font-thin"><input type="checkbox" id="store" class="ml-5"
                                @change="checking">매장명표시</label>
                    </div>
                    <div>
                        <label for="maingroup" class="font-thin"><input type="checkbox" id="maingroup" class="ml-5"
                                @change="checking">대그룹</label>
                    </div>
                    <div>
                        <label for="subgroup" class="font-thin"><input type="checkbox" id="subgroup" class="ml-5"
                                @change="checking">서브그룹</label>
                    </div>
                    <div>
                        <label for="day" class="font-thin"><input type="checkbox" id="day" class="ml-5"
                                @change="checking">일자별</label>
                    </div>
                    <div>
                        <label for="gift" class="font-thin"><input type="checkbox" id="gift" class="ml-5"
                                @change="checking">증정구분</label>
                    </div>
                    <div>
                        <label for="exception" class="font-thin"><input type="checkbox" id="exception" class="ml-5"
                                @change="checking">단가제외</label>
                    </div>
                    <div>
                        <label for="sum" class="font-thin"><input type="checkbox" id="sum" class="ml-5"
                                @change="checking">합계</label>
                    </div>
                    <div>
                        <label for="unite" class="font-thin"><input type="checkbox" id="unite" class="ml-5"
                                @change="checking">셀병합</label>
                    </div>

                </div>
                <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 !-mt-6 h-8">
                    요일조건 : 
                    <div>
                        <label for="mon" class="font-thin"><input type="checkbox" id="mon" class="ml-5"
                                @change="checkday" checked>월</label>
                    </div>
                    <div>
                        <label for="tue" class="font-thin"><input type="checkbox" id="tue" class="ml-5"
                                @change="checkday" checked>화</label>
                    </div>
                    <div>
                        <label for="wed" class="font-thin"><input type="checkbox" id="wed" class="ml-5"
                                @change="checkday" checked>수</label>
                    </div>
                    <div>
                        <label for="thu" class="font-thin"><input type="checkbox" id="thu" class="ml-5"
                                @change="checkday" checked>목</label>
                    </div>
                    <div>
                        <label for="fri" class="font-thin"><input type="checkbox" id="fri" class="ml-5"
                                @change="checkday" checked>금</label>
                    </div>
                    <div>
                        <label for="sat" class="font-thin"><input type="checkbox" id="sat" class="ml-5"
                                @change="checkday" checked>토</label>
                    </div>
                    <div>
                        <label for="sun" class="font-thin"><input type="checkbox" id="sun" class="ml-5"
                                @change="checkday" checked>일</label>
                    </div>

                    <div class="ml-20 -mt-2">
                        공휴일 : 
                        <select name="" id="" class="border w-16 h-7 rounded-lg" v-model="selectedHoliday">
                            <option :value="0">선택</option>
                            <option :value="1">포함</option>
                            <option :value="2">제외</option>
                        </select>
                    </div>

                </div>
            </div>
            <div class="ml-10">
                <PickStorePlural2 @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup"
                    @lngStoreAttrs="lngStoreAttrs" @excelStore="excelStore" :setFooterColID="setFooterColID" :setFooterExpressions="setFooterExpressions">
                </PickStorePlural2>
                
            </div>
            <div></div>

        </div>

        <div class="w-full h-[80%] mt-1">

            <Realgrid :progname="'SLS04_002RPT_VUE'" :progid="1" :rowData="rowData" :reload="reload"
                :exporttoExcel="exportExcel" :documentSubTitle="documentSubTitle" :documentTitle="'SLS04_002RPT'"
                :hideColumnsId="hideColumnsId" :setGroupColumnId="setGroupColumnId2" :setGroupFooter="setGroupFooter" :setFooter="true" :setGroupCustomLevel="2"
                :setFooterColID="setFooterColID" :setFooterExpressions="setFooterExpressions" :setGroupSumCustomColumnId="setGroupSumCustomColumnId" :setGroupSumCustomText="setGroupSumCustomText" :setGroupSumCustomLevel="setGroupSumCustomLevel"
                :setGroupFooterColID="setGroupFooterColID" :setGroupFooterExpressions="setGroupFooterExpressions" :setRowGroupSpan="setRowGroupSpan"></Realgrid>
        </div>
    </div>
</template>

<script setup>
import { getDailySalesDetailReport, getDailySalesReport, getRealTimeReport, getSalesReportByMenu, getTableSearchCondition } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStorePlural from '@/components/pickStorePlural.vue';
import PickStorePlural2 from '@/components/pickStorePlural2.vue';
import Realgrid from '@/components/realgrid.vue';
import { formatTime } from '@/customFunc/customFunc';
import Swal from 'sweetalert2';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

const setGroupFooter = ref(false)
const setFooterColID = ref(['strStore','lngCode','strMajor','strSub','strMenu','dtmDate','lngPrice','dtmDate','lngNMenuCnt','lngGMenuCnt','lngMenuCnt','lngSalAmt','lngGAmount','lngDCAmt','lngActAmt','lngVAT','lngNetAmt','dblDistRate','lngSalCnt','dblPreWeek','dblPreYear' ])

const setFooterExpressions = ref(['custom','custom','custom','custom','custom','custom','custom' ,'sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum' ])
const setGroupFooterColID = ref(['lngCode','strMajor','strSub','strMenu','dtmDate','lngPrice','dtmDate','lngNMenuCnt','lngGMenuCnt','lngMenuCnt','lngSalAmt','lngGAmount','lngDCAmt','lngActAmt','lngVAT','lngNetAmt','dblDistRate','lngSalCnt','dblPreWeek','dblPreYear' ])
const setGroupFooterExpressions = ref(['custom','custom','custom','custom','custom','custom' ,'sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum' ])
const setGroupSumCustomColumnId = ref(['strStore','strMajor','strSub'])
const setGroupSumCustomText = ref(['매장 소계','',''])
const setGroupSumCustomLevel = ref(1)
const setGroupColumnId = ref(['lngCode'])
const setGroupColumnId2 = ref('')
const progid = ref(2)
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
const setRowGroupSpan = ref('')
const tempSeeDay = ref(0)
const seeDays = (e) => {

    if (e.target.checked) {
        tempSeeDay.value = 1
    } else {
        tempSeeDay.value = 0

    }
}
const store = useStore()
const loginedstrLang = store.state.userData.lngLanguage
const searchButton = async () => {
    store.state.loading = true;
    try {
        initGrid()
       
        reload.value = !reload.value
       
        const reportType = [...checkedReportTypes]
        const checkdays = [...checkedDays]

        console.log(checkdays)
        const res = await getSalesReportByMenu(selectedGroup.value, selectedStores.value , selectedstartDate.value, selectedendDate.value, selectedMenu.value,selectedsubMenu.value,reportType.join(''), checkedGift.value , checkedlngPrice.value ,checkedlngPrint.value ,checkdays.join(','), selectedHoliday.value)
        console.log(res)
        rowData.value = res.data.MENUS




        afterSearch.value = true
    } catch (error) {
        afterSearch.value = false
    } finally {
        store.state.loading = false;

    }

}
const currentTime = ref(formatTime(new Date()))
const selectedGroup = ref()
const selectedStores = ref()
const selectedStoreAttrs = ref()
const selectedHoliday = ref(0)
const selectedsubMenu = ref(0)
const lngStoreGroup = (e) => {
    console.log(e)
    selectedGroup.value = e
}
const lngStoreCodes = (e) => {
    selectedStores.value = e
    console.log(e)
}
const lngStoreAttrs = (e) => {
    selectedStoreAttrs.value = e
    console.log(e)
}

const initGrid = () => {
    if (rowData.value.length > 0) {
        rowData.value = []
    }
}

const exportExcel = ref(false)
const documentSubTitle = ref('')
const excelButton = () => {
    documentSubTitle.value = selectedExcelDate.value + '\n' + selectedExcelStore.value
    exportExcel.value = !exportExcel.value
}

const datepicker = ref(null)
const closePopUp = ref(false)
const handleParentClick = (e) => {
    const datepickerEl = datepicker.value?.$el;

    if (datepickerEl && datepickerEl.contains(e.target)) {
        return;
    }
    closePopUp.value = !closePopUp.value

}
const selectedExcelDate = ref('')
const selectedExcelStore = ref('')
const excelDate = (e) => {
    selectedExcelDate.value = e
}
const excelStore = (e) => {
    selectedExcelStore.value = e
}
const printButton = () => {
    window.print()
}
const selectedMenu = ref(0)
const subList = ref([])
watch(selectedMenu, async () => {

    const res = await getTableSearchCondition(selectedGroup.value, selectedStores.value, selectedMenu.value)
    subList.value = res.data.SUBLIST

})

onMounted(async () => {
    const res = await getTableSearchCondition(selectedGroup.value, selectedStores.value, selectedMenu.value)
    subList.value = res.data.SUBLIST

})
const hideColumnsId = ref(['strStore','strMajor','strSub','dtmDate','lngNMenuCnt','lngGMenuCnt'])
const checkedReportTypes = new Set([0])
const checkedGift = ref(0)
const checkedlngPrice = ref(0)
const checkedlngPrint = ref(0)
const checking = (e) => {
    
    if(e.target.id =='store'){
        if(e.target.checked){
            checkedReportTypes.add(2)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'strStore');
            //setGroupColumnId.value.push('strStore')
        } else {
            checkedReportTypes.delete(2)
            hideColumnsId.value.push('strStore')
            //setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'strStore');
        }
    }
    else if(e.target.id =='maingroup'){
        if(e.target.checked){
            checkedReportTypes.add(3)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'strMajor');
            setGroupColumnId.value.push('strMajor')
        } else {
            checkedReportTypes.delete(3)
            hideColumnsId.value.push('strMajor')
            setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'strMajor');
        }
    }
    else if(e.target.id =='subgroup'){
        if(e.target.checked){
            checkedReportTypes.add(4)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'strSub');
            setGroupColumnId.value.push('strSub')
        } else {
            checkedReportTypes.delete(4)
            hideColumnsId.value.push('strSub')
            setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'strSub');
        }
    }
    else if(e.target.id =='day'){
        if(e.target.checked){
            checkedReportTypes.add(1)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'dtmDate');
            setGroupColumnId.value.push('dtmDate')
            
        } else {
            checkedReportTypes.delete(1)
            hideColumnsId.value.push('dtmDate')
            setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'dtmDate');
        }
    }
    else if(e.target.id =='gift'){
        if(e.target.checked){
            checkedGift.value = 1
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'lngNMenuCnt' && item !='lngGMenuCnt');
            
        } else {
            checkedGift.value = 0
            hideColumnsId.value.push('lngNMenuCnt')
            hideColumnsId.value.push('lngGMenuCnt')
        }
    }
    else if(e.target.id =='exception'){
        if(e.target.checked){
            checkedlngPrice.value = 1
            hideColumnsId.value.push('lngPrice')
        } else {
            checkedlngPrice.value = 0
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'lngPrice' );
        }
    }
    else if(e.target.id =='sum'){
        if(e.target.checked){
            checkedlngPrint.value = 1
            setGroupFooter.value = true
        } else {
            checkedlngPrint.value = 0
            setGroupFooter.value = false
        }
    }
    else if(e.target.id =='unite'){
        if(e.target.checked){
            setRowGroupSpan.value = 'strStore,strMajor,strSub'
        } else {
            setRowGroupSpan.value = ''
        }
       
        reload.value =!reload.value
    }
    setGroupColumnId2.value = setGroupColumnId.value.join(',')
}
const checkedDays = new Set([1,2,3,4,5,6,7])
const checkday = (e) => {
    if(e.target.id =='mon'){
        if(e.target.checked){
            checkedDays.add(2)
        } else {
            checkedDays.delete(2)
          
        }
    }
    else if(e.target.id =='tue'){
        if(e.target.checked){
            checkedDays.add(3)
        } else {
            checkedDays.delete(3)
        }
    }
    else if(e.target.id =='wed'){
        if(e.target.checked){
            checkedDays.add(4)
        } else {
            checkedDays.delete(4)
        }
    }
    else if(e.target.id =='thu'){
        if(e.target.checked){
            checkedDays.add(5)
        } else {
            checkedDays.delete(5)
        }
    }
    else if(e.target.id =='fri'){
        if(e.target.checked){
            checkedDays.add(6)
        } else {
            checkedDays.delete(6)
        }
    }
    else if(e.target.id =='sat'){
        if(e.target.checked){
            checkedDays.add(7)
        } else {
            checkedDays.delete(7)
        }
    }
    else if(e.target.id =='sun'){
        if(e.target.checked){
            checkedDays.add(1)
        } else {
            checkedDays.delete(1)
        }
    }
}

</script>

<style></style>