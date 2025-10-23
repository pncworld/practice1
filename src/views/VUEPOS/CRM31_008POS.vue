<template>
  <div class="h-full" @click="handleParentClick">
    <div class="bg-white flex space-x-2 justify-end">
      <button class="button search" @click="searchButton">조회</button>
      <button class="button new" @click="addButton">신규</button>
      <button class="button edit" @click="editButton">수정</button>
      <button class="button delete" @click="deleteButton">삭제</button>
      <button class="button excel" @click="excelButton">엑셀</button>
    </div>
    <div class="bg-gray-200 w-full h-20 flex items-center">
      <div class="font-semibold text-base ml-5">예약일자</div>
      <div class="ml-5">
        <select
          name=""
          id=""
          class="w-40 h-8 border border-black"
          v-model="cond">
          <option :value="i.strDCode" v-for="i in optionList">
            {{ i.strDName }}
          </option>
        </select>
      </div>

      <datepicker2
        @endDate="endDate"
        :closePopUp="closePopUp"
        ref="datepicker"
        :initToday="1"
        @startDate="startDate"
        :mainName="'기간'"></datepicker2>

      <div class="flex items-center space-x-5">
        <div class="font-semibold text-base">매장명</div>
        <select
          name=""
          id=""
          class="w-40 h-8 border border-black"
          v-model="lngStoreCode"
          disabled>
          <option :value="i.lngStoreCode" v-for="i in optionList2">
            {{ i.strName }}
          </option>
        </select>
      </div>

      <div class="flex items-center space-x-5 ml-20">
        <div class="font-semibold text-base">예약시간</div>
        <div>
          <input type="text" class="border border-black w-10" v-model="cond2" />
        </div>
        <div>~</div>
        <div>
          <input type="text" class="border border-black w-10" v-model="cond3" />
        </div>
      </div>

      <div class="flex items-center space-x-5 ml-5">
        <div class="font-semibold text-base">예약좌석</div>
        <div>
          <input type="text" class="border border-black w-10" v-model="cond4" />
        </div>
      </div>

      <div class="flex items-center space-x-5 ml-5">
        <div class="font-semibold text-base">검색어</div>
        <div>
          <input type="text" class="border border-black w-10" v-model="cond5" />
        </div>
      </div>
    </div>

    <div class="h-[80%] w-full">
      <Realgrid
        :progname="'CRM31_008POS_VUE'"
        :progid="1"
        :setStateBar="false"
        :showCheckBar="true"
        :checkRowAuto="false"
        :rowStateeditable="false"
        :exporttoExcel2="exportExcel"
        :documentTitle="'고객예약등록(POS)'"
        :documentSubTitle="documentSubTitle"
        @clickedRowData="clickedRowData"
        @dblclickedRowData="dblclickedRowData"
        @checkedRowData="checkedRowData"
        :rowData="rowData"></Realgrid>
    </div>
  </div>

  <div
    v-if="openPopUp"
    id="popup"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div
      class="bg-white p-6 rounded-2xl shadow-lg w-[40vw] h-[50vh] text-center">
      <div class="flex justify-between">
        <h2 class="text-lg font-semibold flex justify-start">
          예약등록(신규/수정)
        </h2>

        <div class="flex space-x-2">
          <button
            @click="saveButton"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg">
            저장
          </button>
          <button
            @click="openPopUp = false"
            class="px-4 py-2 bg-gray-400 text-white rounded-lg">
            닫기
          </button>
        </div>
      </div>
      <div class="flex justify-center items-center h-[80%]">
        <div
          class="h-full w-full grid grid-rows-6 grid-cols-[1fr,2fr,1fr,2fr] mt-5">
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            상태
          </div>
          <div
            class="border-black border-l border-t flex justify-center items-center font-semibold">
            <select name="" id="" class=" border border-black" v-model="scond">
              <option value="0">선택</option>
              <option :value="i.strDCode" v-for="i in optionList3">
                {{ i.strDName }}
              </option>
            </select>
          </div>
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            매장
          </div>
          <div
            class="border-black border-l border-t border-r flex justify-center items-center font-semibold">
            <select
              name=""
              id=""
              class="w-40 h-8 border border-black"
              v-model="lngStoreCode"
              disabled>
              <option :value="i.lngStoreCode" v-for="i in optionList2">
                {{ i.strName }}
              </option>
            </select>
          </div>
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            접수일자
          </div>
          <div
            class="border-black border-l border-t flex justify-center items-center font-semibold">
            <input type="date" class="border border-black" v-model="scond2">
        </div>
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            예약자명
          </div>
          <div
            class="border-black border-l border-t border-r flex justify-center items-center font-semibold">
        <input type="text" v-model="scond3" class="border border-black"></div>
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            예약일자
          </div>
          <div
            class="border-black border-l border-t flex justify-center items-center font-semibold">
           <input type="date" class="border border-black" v-model="scond4"></input></div>
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            예약자연락처
          </div>
          <div
            class="border-black border-l border-t border-r flex justify-center items-center font-semibold">
          <input type="text" v-model="scond5" class="border border-black">
        </div>
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            예약시간
          </div>
          <div
            class="border-black border-l border-t flex justify-center items-center font-semibold">
           <input type="time" v-model="scond6" class="border border-black">
        </div>
          <div
            class="border-black bg-gray-100 border-l border-t flex justify-center items-center font-semibold">
            예약인원/유아/성인
          </div>
          <div
            class="border-black border-l border-t border-r flex justify-center items-center font-semibold space-x-2">
          <input type="text" @input="onlyNumber" v-model="scond7" class="border border-black w-10">
          <input type="text" @input="onlyNumber2" v-model="scond8" class="border border-black w-10">
          <input type="text" v-model="scond9" class="border border-black w-10 disabled:bg-gray-300" disabled >
        </div>
          <div
            class="border-black bg-gray-100 border-l border-t border-r flex justify-center items-center font-semibold">
            예약좌석
          </div>
          <div
            class="border-black border-r border-t  flex justify-center items-center font-semibold col-span-3">
          <input type="text" v-model="scond10" class="border border-black h-[80%] w-[80%]">
        </div>
          <div
            class="border-black bg-gray-100 border-l border-t border-b flex justify-center items-center font-semibold">
            메모
          </div>
          <div
            class="border-black border flex justify-center items-center font-semibold col-span-3">
        <input type="text" v-model="scond11" class="border border-black h-[80%] w-[80%]"></input>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCommonList, getStoreList2 } from "@/api/common";
import { deleteReserveEnroll, getReservedSearch2, saveReserveEnroll } from "@/api/vuepos";
import Datepicker2 from "@/components/Datepicker2.vue";
import Realgrid from "@/components/realgrid.vue";
import { formatDateTime3, formatLocalDate, insertPageLog2 } from "@/customFunc/customFunc";
import store from "@/store";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const path = ref("");
const lngStoreGroup = ref("");
const lngStoreCode = ref("");
const lngOperator = ref("");
const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);

const rowData = ref([]);
const cond = ref("1");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("");
onMounted(async () => {
  path.value = route.path.split("/")[2];
  lngStoreGroup.value = route.query.lngStoreGroup;
  lngStoreCode.value = route.query.lngStoreCode;
  lngOperator.value = route.query.lngOperator;
  const pageLog = await insertPageLog2(
    path.value,
    lngStoreGroup.value,
    lngStoreCode.value,
    lngOperator.value
  );
  const res = await getCommonList(328);
  optionList.value = res.data.List;

  const res2 = await getStoreList2(lngStoreGroup.value);

  optionList2.value = res2.data.store;

  const res3 = await getCommonList(327);

  optionList3.value = res3.data.List;
  console.log(res2);
});

const edate = ref("");
const sdate = ref("");
const endDate = (e) => {
  edate.value = e;
};
const startDate = (e) => {
  sdate.value = e;
};

const searchButton = async () => {
  try {
    store.state.loading = true;
    const res = await getReservedSearch2(
      lngStoreGroup.value,
      lngStoreCode.value,
      cond.value,
      sdate.value,
      edate.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond5.value
    );

    store.state.loading = false;

    rowData.value = res.data.List;
  } catch (error) {}
};

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  console.log(e)
  checkedrowdata.value = e;
};

const datepicker = ref(null);
const employee = ref(null);
const button = ref(null);
const closePopUp = ref(false);

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  const employeeEl = employee.value?.$el;

  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  if (employeeEl && employeeEl.contains(e.target)) {
    return;
  }
  if (e.target.closest("button")) {
    return;
  }
  open.value = false;
  closePopUp.value = !closePopUp.value;
};

const openPopUp = ref(false);
const tempSeq = ref('')
const addButton = () => {
  openPopUp.value = true;
  scond.value = '0'
  scond2.value = formatLocalDate(new Date())
  scond3.value = ''
  scond4.value = formatLocalDate(new Date())
  scond5.value = ''
  scond7.value = ''
  scond8.value = ''
  scond9.value = ''
  scond10.value = ''
  scond11.value = ''

    tempSeq.value = ''
  scond6.value = formatDateTime3(new Date()).split(' ')[1].split('시')[0] +':' + formatDateTime3(new Date()).split(' ')[1].split('시')[1].split('분')[0] 
};


const scond = ref('0')
const scond2 = ref(formatLocalDate(new Date()))
const scond3 = ref('')
const scond4 = ref(formatLocalDate(new Date()))
const scond5 = ref('')
const scond6 = ref(formatDateTime3(new Date()).split(' ')[1].split('시')[0] +':' + formatDateTime3(new Date()).split(' ')[1].split('시')[1].split('분')[0] )
const scond7 = ref('')
const scond8 = ref('')
const scond9 = ref('')
const scond10 = ref('')
const scond11 = ref('')


const onlyNumber = (e) => {
    scond7.value = e.target.value.replace(/[^0-9]/g,'')

    scond9.value = scond7.value - scond8.value
}
const onlyNumber2 = (e) => {
    scond8.value = e.target.value.replace(/[^0-9]/g,'')
    scond9.value = scond7.value - scond8.value
}


const saveButton = async() => {

    try {
        store.state.loading = true

        if(tempSeq.value == ''){
            const res = await saveReserveEnroll(lngStoreGroup.value , lngStoreCode.value ,tempSeq.value , scond2.value , scond4.value , scond6.value , scond.value, scond3.value , scond5.value , scond7.value ,scond8.value, scond10.value , scond11.value,0)
          store.state.loading = false
        if(res.data.RESULT_CD == '00'){
          Swal.fire({
          title: "성공",
          text: "신규 예약정보를 저장하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        } else {
            Swal.fire({
          title: "실패",
          text: "신규 예약정보 저장에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
        } else {
                 const res = await saveReserveEnroll(lngStoreGroup.value , lngStoreCode.value ,tempSeq.value , scond2.value , scond4.value , scond6.value , scond.value, scond3.value , scond5.value , scond7.value ,scond8.value, scond10.value , scond11.value,1)
          store.state.loading = false
        if(res.data.RESULT_CD == '00'){
          Swal.fire({
          title: "성공",
          text: "예약정보를 수정하였습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        } else {
            Swal.fire({
          title: "실패",
          text: "예약정보 수정에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        }
      
    }
    openPopUp.value = false

    } catch (error) {
       store.state.loading = true
        console.log(error)
    } finally { 
      store.state.loading = true
      searchButton()
    }
}

const clickedrowdata = ref('')
const clickedRow = ref(false)
const clickedRowData = (e) => {
  clickedRow.value = true
  clickedrowdata.value = e
}
const editButton = async() => {
  if(clickedRow.value == false){
      await Swal.fire({
          title: "경고",
          text: "수정하실 행을 먼저 선택해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
        });
    return
  }

  tempSeq.value = clickedrowdata.value[13]

  scond.value = clickedrowdata.value[12]
  scond2.value = clickedrowdata.value[1]
  scond3.value = clickedrowdata.value[6]
  scond4.value = clickedrowdata.value[2]
  scond5.value = clickedrowdata.value[7]
  scond6.value = clickedrowdata.value[3]
  scond7.value = clickedrowdata.value[8]
  scond8.value = clickedrowdata.value[9]
  scond9.value = clickedrowdata.value[10]
  scond10.value = clickedrowdata.value[4]
  scond11.value = clickedrowdata.value[11]

  openPopUp.value = true


}

const deleteButton = async() => {
  if(checkedrowdata.value.length == 0){
         await Swal.fire({
          title: "경고",
          text: "삭제하실 행을 먼저 선택해주세요.",
          icon: "warning",
          confirmButtonText: "확인",
        });
    return
  }

  try {
    store.state.loading= true
    const seqarr = checkedrowdata.value.map(item => item.lngRsrvSEQ).join('\u200b')
    const res = await deleteReserveEnroll(lngStoreGroup.value , lngStoreCode.value ,seqarr)
    
    store.state.loading= false
    if(res.data.RESULT_CD == '00'){
          Swal.fire({
          title: "성공",
          text: "선택하신 예약정보를 삭제하였습니다",
          icon: "success",
          confirmButtonText: "확인",
        });
        } else {
            Swal.fire({
          title: "실패",
          text: "선택하신 예약정보 삭제에 실패하였습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        }
  } catch (error) {
    
  } finally {
    searchButton()
  }

}

const exportExcel = ref(false)
const documentSubTitle = ref('')
const excelButton = () => {
  documentSubTitle.value =
    '매장명 :' + optionList2.value.filter(item => item.lngStoreCode == lngStoreCode.value)[0].strName + "\n" + sdate.value + '~' + edate.value;
  //comsole.log(documentSubTitle.value);
  exportExcel.value = !exportExcel.value;
};

const dblclickedRowData = (e) => {
    tempSeq.value = e[13]

  scond.value = e[12]
  scond2.value = e[1]
  scond3.value = e[6]
  scond4.value = e[2]
  scond5.value = e[7]
  scond6.value = e[3]
  scond7.value = e[8]
  scond8.value = e[9]
  scond9.value = e[10]
  scond10.value = e[4]
  scond11.value = e[11]

  openPopUp.value = true
}
</script>

<style scoped></style>
