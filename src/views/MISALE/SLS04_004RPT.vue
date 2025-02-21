<template>
    <div class="h-full" @click="handleParentClick">
        <div class="flex justify-between items-center w-full overflow-y-auto">
            <div class="flex justify-start  w-full pl-12 pt-4">
                <div class="flex justify-start">
                    <h1 class="font-bold text-sm md:text-2xl w-full">
                        메뉴별/결제형태별 매출현황.
                    </h1>
                </div>

            </div>
            <div class="flex justify-center mr-9 space-x-2 pr-5">
               
                <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
                <button @click="excelButton" class="button save w-auto excel">엑셀</button>
            

            </div>
        </div>
        <div class="grid grid-cols-[10fr,10fr] grid-rows-1 justify-between  bg-gray-200 rounded-lg h-32 items-center z-10 p-5">
            <div class="grid grid-cols-1 grid-rows-3 -space-y-3 justify-start -ml-36 mt-3" >
                <div class="flex justify-start  ">
                <Datepicker2 @endDate="endDate" @startDate="startDate" :closePopUp="closePopUp" ref="datepicker"
                    @excelDate="excelDate"></Datepicker2>
              
                </div>
                <div class="justify-start flex  items-center space-x-5 w-[600px] pl-48">
                  <div class="text-base font-semibold">조건 :</div>
                  <div><label for="store"><input type="checkbox" id="store">매장별</label></div>
                  <div><label for="date"><input type="checkbox" id="date">일자별</label></div>
              
                </div>
                <div class="flex justify-start items-center text-base text-nowrap font-semibold ml-40 ">
                    메뉴구분 : <div class="flex ml-3 space-x-3 -mt-1">
                       
                        <v-select v-model="selectedMenu" 
                        :options="mainMenu" 
                        placeholder="전체"
                         label="strname"
                         class="w-44 !h-8 bg-white "
                         clearable="true" 
                          />
                

                        <v-select v-model="selectedsubMenu" 
                        :options="menuType" 
                        placeholder="전체"
                         label="strname"
                         class="w-44 !h-8 bg-white "
                         clearable="true" 
                          />

                          <v-select v-model="selectedSubSubMenu" 
                        :options="Menus" 
                        placeholder="전체"
                         label="strname"
                         class="w-44 !h-8 bg-white "
                         clearable="true" 
                          />

                          <input type="text" v-model="searchText" class="pl-2 w-44 !h-8 bg-white ">

                          <div class="flex justify-start space-x-2">객층구분 :
                            <v-select v-model="selectedSubSubMenu" 
                        :options="Menus" 
                        placeholder="전체"
                         label="strname"
                         class="w-44 !h-8 bg-white "
                         clearable="true" 
                          />
                          </div>
                    </div>
               
               


                </div>
            </div>
            <div class="ml-96">
                <PickStorePlural2 @lngStoreCodes="lngStoreCodes" @lngStoreGroup="lngStoreGroup" @lngSupervisor="lngSupervisor" @lngStoreTeam="lngStoreTeam"
                    @lngStoreAttr="lngStoreAttr" @excelStore="excelStore" :setFooterColID="setFooterColID" :setFooterExpressions="setFooterExpressions"
                    :hideColumn="'strStoreName'" :hideColumnNow="hideColumnNow">
                </PickStorePlural2>
                
            </div>
         

        </div>

        <div class="w-full h-[80%] mt-1">

            <Realgrid :progname="'SLS04_003RPT_VUE'" :progid="progid" :rowData="rowData" :reload="reload"
                :exporttoExcel="exportExcel" :documentSubTitle="documentSubTitle" :documentTitle="'SLS04_003RPT'"
                :mergeColumns2="mergeColumns2" :mergeColumnGroupSubList2="[['col1_1','col1_2','col1_3','col1'],['col2_1','col2_2','col2_3','col2'],['col3_1','col3_2','col3_3','col3'],['col4_1','col4_2','col4_3','col4'],['col5_1','col5_2','col5_3','col5'],['col6_1','col6_2','col6_3','col6']]"
                :mergeColumnGroupName2="['현금','신용카드','선수금매출','비율할인','품목할인','금액할인']"
                ></Realgrid>
        </div>
    </div>
</template>

<script setup>
import { getDailySalesDetailReport, getDailySalesReport, getMenuCondition, getRealTimeReport, getSalesReportByMenu, getSalesReportByMenuAndPayType, getTableSearchCondition } from '@/api/misales';
import Datepicker2 from '@/components/Datepicker2.vue';
import PickStorePlural from '@/components/pickStorePlural.vue';
import PickStorePlural2 from '@/components/pickStorePlural2.vue';
import Realgrid from '@/components/realgrid.vue';
import { formatTime, insertPageLog } from '@/customFunc/customFunc';
import Swal from 'sweetalert2';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';

const setGroupFooter = ref(false)
const mergeColumns2 = ref(false)
const setFooterColID = ref(['strStore','lngCode','strMajor','strSub','strMenu','dtmDate','lngPrice','dtmDate','lngNMenuCnt','lngGMenuCnt','lngMenuCnt','lngSalAmt','lngGAmount','lngDCAmt','lngActAmt','lngVAT','lngNetAmt','dblDistRate','lngSalCnt','dblPreWeek','dblPreYear' ])

const setFooterExpressions = ref(['custom','custom','custom','custom','custom','custom','custom' ,'sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum' ])
const setGroupFooterColID = ref(['strStore','strMajor','strSub','dtmDate','lngPrice','dtmDate','lngNMenuCnt','lngGMenuCnt','lngMenuCnt','lngSalAmt','lngGAmount','lngDCAmt','lngActAmt','lngVAT','lngNetAmt','dblDistRate','lngSalCnt','dblPreWeek','dblPreYear' ])
const setGroupFooterExpressions = ref(['custom','custom','custom','custom','sum' ,'sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum','sum' ])
const setGroupSumCustomColumnId = ref(['strStore','strMajor','strSub'])
const setGroupSumCustomText = ref(['매장 소계','',''])
const setGroupSumCustomLevel = ref(1)
const setGroupColumnId = ref([''])
const setGroupColumnId2 = ref('')
const setGroupSumCustomLevel2 = ref(1)
const progid = ref(4)
const reload = ref(false)
const rowData = ref([])
const afterSearch = ref(false)
const selectedstartDate = ref()
const selectedendDate = ref()
const searchText = ref('')
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
const hideColumnNow = ref(true)
const store = useStore()
const loginedstrLang = store.state.userData.lngLanguage
const searchButton = async () => {
    store.state.loading = true;
    try {
        initGrid()
        const reportType = selectedSearchType.value | selectedDetail.value
        if(reportType ==4) {
            progid.value = 1
        } else if(reportType ==1){
            progid.value = 2
        } else if(reportType ==2){
            progid.value = 3
        }else if(reportType ==9){
            progid.value = 4
        }
        else if(reportType ==10){
            progid.value = 5
        }else if(reportType ==12){
            progid.value = 6
        }

        if(temptmergeColumns2.value == false){
            mergeColumns2.value = false
        } else {
            mergeColumns2.value = true
        }
        reload.value = !reload.value
       
        // const reportType = [...checkedReportTypes]
        // const checkdays = [...checkedDays]

        // console.log(checkdays)
        let first ;
        let second ;
        let third ;
        
        if(selectedsubMenu.value == null ||selectedsubMenu.value == undefined ){
            second = 0
        } else {
            second= selectedsubMenu.value.lngcode
        }
        if(selectedMenu.value == null ||selectedMenu.value == undefined ){
            first = 0
        } else {
            console.log(selectedMenu.value)
            first= selectedMenu.value.lngcode
        }

        if(selectedSubSubMenu.value == null || selectedSubSubMenu.value == undefined ){
            third = 0
        } else {
            third= selectedSubSubMenu.value.lngcode
        }
       
        console.log(selectedstartDate.value)
        console.log(selectedendDate.value)
        console.log(first)
        console.log(second)
        console.log(third)
    
        const res = await getSalesReportByMenuAndPayType(selectedGroup.value, selectedStores.value , selectedstartDate.value, selectedendDate.value, reportType , first , second , third )
        console.log(res)
        rowData.value = res.data.List.filter(item => item.lngCode !='')




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
const selectedsubMenu = ref(null)
const lngStoreGroup = (e) => {
    initGrid()
    console.log(e)
    selectedGroup.value = e
}
const lngStoreCodes = (e) => {
    initGrid()
    selectedStores.value = e
    console.log(e)
}
const lngStoreAttr = (e) => {
    initGrid()
    selectedStoreAttrs.value = e
    console.log(e)
}
const lngStoreTeam = (e) => {
    initGrid()
}
const lngSupervisor = (e) => {
    initGrid()
}


const initGrid = () => {
    if (rowData.value.length > 0) {
        rowData.value = []
    }
}

const exportExcel = ref(false)
const selectedSearchType = ref(4)
const documentSubTitle = ref('')
const menuDistinct = ref(['전체','대그룹','서브그룹','메뉴구분'])
const searchCondition = ref(['매장명표시','대그룹','서브그룹','일자별','증정구분','단가제외','합계','셀병합'])
const dayCondition = ref(['일','월','화','수','목','금','토'])
const ConditionSet = new Set([])
const excelButton = () => {
    let menu ; 
    if(selectedMenu.value == null ){
        menu = '전체'
    } else {
        menu = menuDistinct.value[selectedMenu.value]
    }
   
    let submenu;
    console.log(selectedsubMenu.value)
    console.log(subList.value)
    if(selectedsubMenu.value == null || menuType.value.length == 0 ){
        submenu = '전체'
    } else {
        submenu = menuType.value.find(item => item.lngcode == selectedsubMenu.value.lngcode).strname
    }
    const newCondarr = [...ConditionSet].sort()
    let searchcond ='';
    for(let i=0 ; i< newCondarr.length ; i++ ){
        searchcond+=searchCondition.value[newCondarr[i]]+','
    }
  
    let thirdcond = ''
    const newCondarr2 = [...checkedDays].sort()
    for(let i=0 ; i < newCondarr2.length ; i++){
        thirdcond+= dayCondition.value[newCondarr2[i]-1]+','
    }
    let first 
    let second 
    let third 
    if(selectedMenu.value == null  ){
        first = '전체'
    } else {
        console.log(mainMenu.value.filter(item => item.lngcode == selectedMenu.value ))
        first = mainMenu.value.filter(item => item.lngcode == selectedMenu.value.lngcode  )[0].strname
    }

    if(selectedsubMenu.value == null || menuType.value.length == 0 ){
        second = '전체'
    } else {
        second = menuType.value.filter(item => item.lngcode == selectedsubMenu.value.lngcode )[0].strname
    }

    if(selectedSubSubMenu.value == null || Menus.value.length == 0){
        third = '전체'
    } else {
        third = Menus.value.filter(item => item.lngcode == selectedSubSubMenu.value.lngcode  )[0].strname
    }
    
    documentSubTitle.value = selectedExcelDate.value + '\n' + selectedExcelStore.value +'\n'+'메뉴구분 :' + first +',' +second+','+third
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
const selectedMenu = ref(null)

const subList = ref([])
const menuType = ref([])
const Menus = ref([])
const mainMenu = ref([{lngcode : 0 , strname : '전체'},{lngcode : 1 , strname : '대그룹'},{lngcode : 2 , strname : '서브그룹'},{lngcode : 3 , strname : '메뉴코드'}])
watch(selectedMenu, async () => {
    if(selectedMenu.value == null){
        selectedMenu.value = 0
    }
    const res = await getMenuCondition(selectedGroup.value, selectedStores.value,2, selectedMenu.value == 0 ? 0 : selectedMenu.value.lngcode ,0)
    menuType.value = res.data.List
    selectedsubMenu.value = null
    console.log(menuType.value)
})
const selectedSubSubMenu = ref(null)
watch(selectedsubMenu, async () => {
    if(selectedsubMenu.value == null){
        selectedsubMenu.value = 0
    }

    const res = await getMenuCondition(selectedGroup.value, selectedStores.value,3, selectedMenu.value == 0 ? 0 : selectedMenu.value.lngcode ,selectedsubMenu.value == 0 ? 0 : selectedsubMenu.value.lngcode)
    Menus.value = res.data.List
    selectedSubSubMenu.value = null
  

})

onMounted(async () => {

    const pageLog = insertPageLog(store.state.activeTab2)

    const res = await getMenuCondition(selectedGroup.value, selectedStores.value ,1 , 0, 0)

    mainMenu.value = res.data.List
   
  
})
const hideColumnsId = ref(['strStore','strMajor','strSub','dtmDate','lngNMenuCnt','lngGMenuCnt'])
const checkedReportTypes = new Set([0])
const checkedGift = ref(0)
const checkedlngPrice = ref(0)
const checkedlngPrint = ref(0)
const selectedDetail = ref(0)
const temptmergeColumns2= ref(false)
const detailView = (e)=>{
    if(e.target.checked){
        selectedDetail.value = 8
        temptmergeColumns2.value = true
    } else {
        selectedDetail.value = 0
        temptmergeColumns2.value = false
    }
}
const customOrder = ['strStore','strMajor','strSub','dtmDate']
const checking = (e) => {
    
    if(e.target.id =='store'){
        if(e.target.checked){
            checkedReportTypes.add(2)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'strStore');
            setGroupColumnId.value.push('strStore')
            ConditionSet.add(0)
        } else {
            checkedReportTypes.delete(2)
            hideColumnsId.value.push('strStore')
            setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'strStore');
            ConditionSet.delete(0)
        }
    }
    else if(e.target.id =='maingroup'){
        if(e.target.checked){
            checkedReportTypes.add(3)
            ConditionSet.add(1)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'strMajor');
            setGroupColumnId.value.push('strMajor')
        } else {
            checkedReportTypes.delete(3)
            ConditionSet.delete(1)
            hideColumnsId.value.push('strMajor')
            setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'strMajor');
        }
    }
    else if(e.target.id =='subgroup'){
        if(e.target.checked){
            checkedReportTypes.add(4)
            ConditionSet.add(2)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'strSub');
            setGroupColumnId.value.push('strSub')
        } else {
            checkedReportTypes.delete(4)
            ConditionSet.delete(2)
            hideColumnsId.value.push('strSub')
            setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'strSub');
        }
    }
    else if(e.target.id =='day'){
        if(e.target.checked){
            checkedReportTypes.add(1)
            ConditionSet.add(3)
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'dtmDate');
            setGroupColumnId.value.push('dtmDate')
            //setGroupColumnId.value.push('lngCode')
            
        } else {
            checkedReportTypes.delete(1)
            ConditionSet.delete(3)
            hideColumnsId.value.push('dtmDate')
            setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'dtmDate');
            //setGroupColumnId.value = setGroupColumnId.value.filter(item => item !== 'lngCode');
        }
    }
    else if(e.target.id =='gift'){
        if(e.target.checked){
            checkedGift.value = 1
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'lngNMenuCnt' && item !='lngGMenuCnt');
            ConditionSet.add(4)
        } else {
            checkedGift.value = 0
            hideColumnsId.value.push('lngNMenuCnt')
            hideColumnsId.value.push('lngGMenuCnt')
            ConditionSet.delete(4)
        }
    }
    else if(e.target.id =='exception'){
        if(e.target.checked){
            checkedlngPrice.value = 1
            hideColumnsId.value.push('lngPrice')
            ConditionSet.add(5)
        } else {
            ConditionSet.delete(5)
            checkedlngPrice.value = 0
            hideColumnsId.value = hideColumnsId.value.filter(item => item !== 'lngPrice' );
        }
    }
    else if(e.target.id =='sum'){
        if(e.target.checked){
            checkedlngPrint.value = 1
            setGroupFooter.value = true
            setGroupSumCustomLevel.value = 2
            ConditionSet.add(6)
        } else {
            ConditionSet.delete(6)
            checkedlngPrint.value = 0
            setGroupFooter.value = false
            setGroupSumCustomLevel.value = 1
        }
    }
    else if(e.target.id =='unite'){
        if(e.target.checked){
            ConditionSet.add(7)
            setRowGroupSpan.value = 'strStore,strMajor,strSub'
            setGroupSumCustomLevel.value = 2
        } else {
            ConditionSet.delete(7)
            setRowGroupSpan.value = ''
            setGroupSumCustomLevel.value = 1
        }
       
        reload.value =!reload.value
    }
    setGroupColumnId.value.sort((a, b) => {
  // customOrder 배열에서 각 요소의 인덱스를 비교
        const indexA = customOrder.indexOf(a);
        const indexB = customOrder.indexOf(b);

        // 만약 배열에 없는 값이 있다면 -1이 반환되므로, 이를 처리해줍니다.
            if (indexA === -1 && indexB === -1) return 0; // 둘 다 없으면 순서 유지
            if (indexA === -1) return 1; // a가 없으면 뒤로 보냄
            if (indexB === -1) return -1; // b가 없으면 뒤로 보냄

         return indexA - indexB;
});

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