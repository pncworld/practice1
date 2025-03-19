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
                :firstName="'날짜'" class="ml-20 -mt-10" :prevMonth="prevMonth" :nextMonth="nextMonth" :initMonth="1"
                :stopLimit="true">
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
                        <input type="text" class="w-52 h-8 rounded-lg pl-1 mt-1 ml-2 disabled:bg-white" disabled v-model="excelName">
                        <label for="hiddenFile" class="button primary h-7 flex items-center ml-2 mt-1 cursor-pointer">
                            파일선택
                        </label>
                        <input type="file" class="hidden" id="hiddenFile" @change="readExcel">




                    </div>


                </div>
            </div>
        </div>
        <div class="absolute z-[100] top-80 right-56" v-show="openPopUp">monday tuesday wednesday </div>
        <div class="flex flex-col">
            <PickStoreSingle @lngStoreGroup="lngStoreGroup" @lngSupervisor="lngSupervisor" @lngStoreTeam="lngStoreTeam"
                @lngStoreAttrs="lngStoreAttrs" @lngStoreCode="lngStoreCode" @excelStore="excelStore"
                :placeholderName="'선택'"></PickStoreSingle>
            <div class="flex mt-12 items-center -ml-20">
                <div class="text-base font-semibold text-nowrap ">sheet선택:</div>
                <select name="" id="" class="w-32 h-8 rounded-lg ml-2" v-model="selectSheet">
                    <option :value="i.lngCode" v-for="i in sheetArr">{{ i.strName }}</option>
                </select>
                <button class="button primary h-7 flex items-center ml-96" @click="saveUploadFile">업로드 파일 저장</button>
            </div>
        </div>

    </div>
    <div><button @click="downloadSample"><img src="../../assets/sampleDownload.png" alt="" class="w-20">
        </button></div>
    <div class="h-[70%] mt-1">

        <FullCalendar :options='calendarOptions' class="h-full">
        </FullCalendar>


    </div>



</template>

<script setup>
import { getPlanbyDays, getProjByMonth } from '@/api/misales';
import Datepicker3 from '@/components/Datepicker3.vue';
import PickStoreSingle from '@/components/pickStoreSingle.vue';
import { excelSerialDateToJSDate } from '@/customFunc/customFunc';
import { faL } from '@fortawesome/free-solid-svg-icons';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/vue3';
import Swal from 'sweetalert2';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { read, utils, write } from 'xlsx-js-style';

const rowData = ref([])
const currentMonth = ref()
const currentYear= ref()
const startMonth = (e) => {
    currentMonth.value = e
    selectedstartDate.value = currentYear.value + '-' + String(currentMonth.value).padStart(2,'0') + '-01'
}
const startYear = (e) => {
    currentYear.value = e
    selectedstartDate.value = currentYear.value + '-' + String(currentMonth.value).padStart(2,'0') + '-01'
}
const selectSheet = ref(0)
const excelData = ref([])
const excelName = ref('')
const sheetArr = ref([])
const readExcel = (e) => {
    const file = e.target.files[0]
    excelName.value = file.name
    if(!file) return ;
    const reader = new FileReader();

    reader.readAsArrayBuffer(file)
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = read(data,{type : "array"})
        sheetArr.value = workbook.SheetNames.map((name, index) => ({ lngCode: index, strName: name }));
        excelData.value = []
        // 첫 번째 시트 가져오기

        for(let i= 0 ; i < workbook.SheetNames.length; i++) {
            const sheetName = workbook.SheetNames[i];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
            const expectedHeader = ["매장코드", "일자", "목표금액", "비고"];
            const header = jsonData[0];
            if (JSON.stringify(header) !== JSON.stringify(expectedHeader)) {
                alert("엑셀 형식이 올바르지 않습니다.");
                return;
            }
            excelData.value.push(jsonData.slice(1).map((row) => ({
                매장코드: row[0] || "",
                일자: typeof row[1] == 'string' ? row[1] : excelSerialDateToJSDate(row[1]),
                목표금액: row[2],
                비고: row[3],
            })));
        }
   

        console.log(excelData.value)
      };
    };


const saveUploadFile = () => {
   console.log(selectSheet.value)
   console.log(excelData.value[selectSheet.value])

}

const openPopUp = ref(false)
const tempDate = ref('')
const handleDateClick = (e) => {

    

   if(afterSearch.value) {
     openPopUp.value = !openPopUp.value
   } 

   tempDate.value = e.dateStr
      

  
   
}
onMounted(() => {

    const nextBtn = document.getElementsByClassName('fc-next-button')[0];
    const prevBtn = document.getElementsByClassName('fc-prev-button')[0];

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextMonth.value = !nextMonth.value
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevMonth.value = !prevMonth.value
        });
    }
})
const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: koLocale,
    events : rowData.value,
    eventContent: function(arg) {
        return { html: arg.event.title.replace(/\n/g, '<br>') }; // 개행 처리
    },
    dateClick: function(info) {
        // 클릭된 날짜의 DOM 엘리먼트에 클래스 추가
        const clickedDate = info.dayEl;
        
        // 기존 배경색을 리셋 후 클릭한 날짜에 배경색 추가
        document.querySelectorAll('.fc-day').forEach((day) => {
            day.classList.remove('clicked-day');
        });
        clickedDate.classList.add('clicked-day');
        handleDateClick(info)
    },
    headerToolbar: {
        left: 'prev',            // 왼쪽에 제목(날짜)
        center: 'title',               // 중앙은 비워두거나 다른 버튼 추가 가능
        right: 'next',  // 오른쪽에 이전, 다음, 오늘 버튼
    },

})

watch(rowData, (newEvents) => {
    calendarOptions.value.events = [...rowData.value]; // ✅ 변경된 데이터 적용
}, { deep: true });


const documentSubTitle = ref()
const selectedExcelDate = ref()
const selectedExcelStore = ref()
const selectedstartDate = ref()
const selectedendDate = ref()

const WeekDays = ref([{ lngCode: 0, strName: '일요일' }])

const prevMonth = ref(false)
const nextMonth = ref(false)


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


const store = useStore();

console.log(store)

const afterSearch = ref(false)
const searchButton = async () => {
    // initCheckBox.value = !initCheckBox.value
    // initSearchWord.value = !initSearchWord.value
    if (lngstorecode.value == 0) {
        Swal.fire({
            title: '경고',
            text: '매장을 선택하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return;
    }
    store.state.loading = true;
    try {
      


     
        const res = await getProjByMonth(lngstoregroup.value, lngstorecode.value, selectedstartDate.value)
        console.log(res)
        afterSearch.value = true
    
       
        rowData.value = res.data.List.map((item) => ({
   
                title: item.lngProjAmt.toLocaleString() +'\n'+ item.strComment,
                start: item.dtmDate,
           
         
        }))
       
        // if (rowData.value.length > 0) {
        //     maxSaleTarget.value = rowData.value.map(i => i.lngProject)[0].toLocaleString();
        // }

     
    } catch (error) {
        afterSearch.value = false
    } finally {
        store.state.loading = false;
      
    }

}




const downloadSample = () => {
    if (lngstorecode.value == 0) {
        Swal.fire({
            title: '경고',
            text: '매장을 선택하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    const data = [
        ['매장코드', '일자', '목표금액', '비고'],
        [lngstorecode.value, '2025-03-01', '1,400,000', '샘플코드 작성시 삭제 후 업로드'],
        [lngstorecode.value, '2025-03-02', '2,000,000', '매장코드는 상단 괄호안 코드 참고']
    ]

    const worksheet = utils.aoa_to_sheet(data)

    // Object.keys(worksheet).forEach(cell => {
    // if (cell.startsWith("B") && cell !== "B1") { 
    //     console.log(cell)
    //     worksheet[cell].z = "yyyy-mm-dd"; // 날짜 형식 적용
    // }
    // });
    worksheet['!cols'] = [
        { wch: 20 }, // 매장코드
        { wch: 20 }, // 일자
        { wch: 20 }, // 목표금액
        { wch: 60 }  // 비고
    ];

  
    // 헤더에 스타일 적용 예시 (Pro 버전 사용 시)
    const headerStyle = {
        fill: { fgColor: { rgb: "FF87CEFA" } },
        font: { bold: true, size: 16 }
    };

    const dataStyle = {
        border: { top: 'thin', left: 'thin', bottom: 'thin', right: 'thin' },
        font: { size: 16 }
    };

    ['A1', 'B1', 'C1', 'D1'].forEach(cell => {
        if (worksheet[cell]) {
            worksheet[cell].s = headerStyle;
        }
    });

    ['A2', 'B2', 'C2', 'D2', 'A3', 'B3', 'C3', 'D3'].forEach(cell => {
        if (worksheet[cell]) {
            worksheet[cell].s = dataStyle;
        }
    });

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");


    const workbookOut = write(workbook, { bookType: 'xlsx', type: 'binary' });

    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) {
            view[i] = s.charCodeAt(i) & 0xFF;
        }
        return buf;
    }

    const blob = new Blob([s2ab(workbookOut)], { type: "application/octet-stream" });

    // Blob을 가리키는 URL 생성
    const url = window.URL.createObjectURL(blob);

    // 임시 링크를 만들어 클릭 이벤트로 다운로드 실행
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample.xlsx"; // 저장될 파일명
    document.body.appendChild(a);
    a.click();


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


    if (rowData.value.length > 0) {
        rowData.value = []
    }



}



</script>
<style>
.fc-event, .fc-event-dot{
    font-size: 16px !important;
}

.fc-day.clicked-day {
    background-color: skyblue !important; /* 원하는 배경색으로 설정 */

}


</style>
