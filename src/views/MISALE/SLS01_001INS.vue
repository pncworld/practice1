<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
        <div class="flex justify-start  w-full pl-12 pt-4">
            <div class="flex justify-start">
                <h1 class="font-bold text-sm md:text-2xl w-full">
                    일별 매출 계획 등록
                </h1>
            </div>

        </div>
        <div class="flex justify-center mr-9 space-x-2 pr-5">

            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="saveButton" class="button save md:w-auto w-14">저장</button>
            <button @click="excelButton" class="button  w-auto excel">엑셀</button>

        </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-[7fr,7fr] justify-between  bg-gray-200 rounded-lg h-44 items-center z-10">
        <div class="grid grid-cols-1 grid-rows-2 mr-60">

            <Datepicker3 @startYear="startYear" @startMonth="startMonth" :hideEndDate="false" @excelDate="excelDate"
                :firstName="'날짜'" class="ml-20 -mt-10">
            </Datepicker3>


            <div class="grid grid-rows-3 grid-cols-[1fr,4fr] justify-center items-center ml-10 -mt-8">

                <div class="text-base font-semibold text-nowrap justify-center flex items-center ml-8">매출목표액 : </div>

                <div class="flex">
                    <select name="" id="" class="w-32 h-8 rounded-lg ml-2">
                        <option :value="0">전체</option>
                        <option :value="i.lngCode" v-for="i in WeekDays">{{ i.strName }}</option>
                    </select>
                    <input type="text" class="w-52 h-8 rounded-lg ml-2 pl-1">
                    <button class="button primary h-7 flex items-center ml-2 mt-1">적용</button>
                </div>
                <div class="text-base font-semibold text-nowrap justify-center flex items-center ml-3 mt-1">월매출목표액 :
                </div>
                <div class="flex">
                    <input type="text" class="w-52 h-8 rounded-lg pl-1 mt-1 ml-2">
                </div>
                <div class="text-base font-semibold text-nowrap justify-center flex items-center ml-8">파일선택 : </div>
                <div class="flex">
                    <div class="flex w-[300%]">
                        <input type="text" class="w-52 h-8 rounded-lg pl-1 mt-1 ml-2 disabled:bg-white" disabled>
                        <button class="button primary h-7 flex items-center ml-2 mt-1">파일선택</button>




                    </div>


                </div>
            </div>
        </div>

        <div class="flex flex-col">
            <PickStoreSingle @lngStoreGroup="lngStoreGroup" @lngSupervisor="lngSupervisor" @lngStoreTeam="lngStoreTeam"
                @lngStoreAttrs="lngStoreAttrs" @lngStoreCode="lngStoreCode" @excelStore="excelStore"></PickStoreSingle>
            <div class="flex mt-12 items-center -ml-20">
                <div class="text-base font-semibold text-nowrap ">sheet선택:</div>
                <select name="" id="" class="w-32 h-8 rounded-lg ml-2">
                    <option value=""></option>
                </select>
                <button class="button primary h-7 flex items-center ml-96">업로드 파일 저장</button>
            </div>
        </div>

    </div>
    <div><button @click="down"><img src="../../assets/sampleDownload.png" alt="" class="w-20">
        </button></div>
    <div class="h-[70%] mt-1">

        <FullCalendar :options='calendarOptions' class="h-full">
        </FullCalendar>


    </div>



</template>

<script setup>
import { getPlanbyDays } from '@/api/misales';
import PickStoreSingle from '@/components/pickStoreSingle.vue';
import Datepicker3 from '@/components/Datepicker3.vue';
import Swal from 'sweetalert2';
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid'
import koLocale from '@fullcalendar/core/locales/ko';
import interactionPlugin from '@fullcalendar/interaction';

const handleDateClick = (e) => {
    alert(e)
    console.log(e.dateStr)
}
onMounted(() => {

    const nextBtn = document.getElementsByClassName('fc-next-button')[0];
    const prevBtn = document.getElementsByClassName('fc-prev-button')[0];

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            console.log('다음 버튼 클릭');
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            console.log('이전 버튼 클릭');
        });
    }
})
const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: koLocale,
    dateClick: handleDateClick,
    headerToolbar: {
        left: 'prev',            // 왼쪽에 제목(날짜)
        center: 'title',               // 중앙은 비워두거나 다른 버튼 추가 가능
        right: 'today next',  // 오른쪽에 이전, 다음, 오늘 버튼
    },
  
})


const documentSubTitle = ref()
const selectedExcelDate = ref()
const selectedExcelStore = ref()
const selectedstartDate = ref()
const selectedendDate = ref()
const customFooterShowLast = ref(true)
const WeekDays = ref([{ lngCode: 0, strName: '일요일' }])
const progid = ref(1)
const startDate = (e) => {
    selectedstartDate.value = e
}
const endDate = (e) => {
    selectedendDate.value = e
}

const excelDate = (e) => {
    selectedExcelDate.value = e
}
const excelStore = (e) => {
    selectedExcelStore.value = e
}
const lngstoregroup = ref()
const lngstoreattr = ref()
const lngstoreteam = ref()
const lngstoresupervisor = ref()
const lngstorecode = ref()
const maxSaleTarget = ref('')
const checked = ref(0)
const setGroupFooter = ref(false)
const hideColumnsId = ref(['strStore'])
const lngStoreGroup = (e) => {
    lngstoregroup.value = e
    console.log(e)
    initGrid()
}
const lngStoreAttrs = (e) => {
    lngstoreattr.value = e
    console.log(e)
    initGrid()
}
const lngStoreTeam = (e) => {
    lngstoreteam.value = e
    console.log(e)
    initGrid()
}
const lngSupervisor = (e) => {
    lngstoresupervisor.value = e
    console.log(e)
    initGrid()
}
const lngStoreCode = (e) => {
    lngstorecode.value = e
    console.log(e)
    initGrid()
}

const receiptNo = ref()
const initCheckBox = ref(false)
const setGroupColumnId = ref('strStore')
const store = useStore();
const reload = ref(false)
console.log(store)

const afterSearch = ref(false)
const searchButton = async () => {
    // initCheckBox.value = !initCheckBox.value
    // initSearchWord.value = !initSearchWord.value
    // if (storeCd.value == 0) {
    //     Swal.fire({
    //         title: '경고',
    //         text: '매장을 선택하세요.',
    //         icon: 'warning',
    //         confirmButtonText: '확인'
    //     })
    //     return;
    // }
    store.state.loading = true;
    try {
        initGrid()
        let barea;
        if (hideColumnsId.value.includes('strStore')) {
            barea = 0
        } else {
            barea = 1
        }
        if (hideColumnsId.value.includes('strStore')) {
            progid.value = 1
        } else {
            progid.value = 2
        }
        reload.value = !reload.value
        console.log(lngstoregroup.value)
        console.log(lngstoreattr.value)
        console.log(lngstoreteam.value)
        console.log(lngstoresupervisor.value)
        console.log(lngstorecode.value)
        console.log(selectedstartDate.value)
        console.log(selectedendDate.value)
        console.log(barea)
        console.log(checked.value)
        const res = await getPlanbyDays(lngstoregroup.value, lngstoreattr.value, lngstoreteam.value, lngstoresupervisor.value, lngstorecode.value, selectedstartDate.value, selectedendDate.value, barea, checked.value)
        console.log(res)

        rowData.value = res.data.List
        if (rowData.value.length > 0) {
            maxSaleTarget.value = rowData.value.map(i => i.lngProject)[0].toLocaleString();
        }

        afterSearch.value = true
    } catch (error) {
        afterSearch.value = false
    } finally {
        store.state.loading = false;

    }

}
const groupCd = ref()
const storeCd = ref()
const dtmDate = ref()
const init = ref(false)
const selectedStoreCd = (e) => {
    console.log(e)
    storeCd.value = e

    initGrid()
    selectedPosNo.value = '0'
    receiptNo.value = ''
    init.value = !init.value


}
const selectedGroupCd = (e) => {
    console.log(e)
    groupCd.value = e
}
const rowData = ref([])
const rowData2 = ref([])
const rowData3 = ref([])
const rowData4 = ref([])


const selectedPosNo = ref()
const posNo = (e) => {
    console.log(e)
    if (e == null) {
        selectedPosNo.value = 0
    } else {
        selectedPosNo.value = e
    }

}

const disCountCd = ref("")
const DisCountCd = (e) => {
    console.log(e)
    if (e == null) {
        disCountCd.value = 0
    } else {
        disCountCd.value = e
    }
}

const payCd = ref("")
const selectedpayCd = (e) => {


    if (e == null) {
        payCd.value = 0
    } else {
        payCd.value = e
    }
}




const exporttoExcel = ref(false)
const excelButton = () => {
    if (afterSearch.value == false) {
        Swal.fire({
            title: '경고',
            text: '조회를 먼저 진행해주세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return;
    }

    let cond = '매출목표 : ';
    if (maxSaleTarget.value != '') {
        cond += maxSaleTarget.value
    }

    let cond2 = '매출구분 : '
    if (checked.value == 0) {
        cond2 += '실매출'
    } else {
        cond2 += '순매출'
    }
    documentSubTitle.value = selectedExcelDate.value + '\n' + selectedExcelStore.value + '\n' + cond + '\n' + cond2
    exporttoExcel.value = !exporttoExcel.value
}
const initGrid = () => {

    console.log(rowData.value)
    if (rowData.value.length > 0) {
        rowData.value = []
    }



}
const updateShowStore = (e) => {
    if (e.target.checked) {
        hideColumnsId.value = []

    } else {
        hideColumnsId.value = ['strStore']

    }
}


</script>
