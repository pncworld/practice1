<template>
    <div class="flex justify-between items-center w-full overflow-y-auto">
        <div class="flex justify-start  w-full pl-12 pt-4">
            <div class="flex justify-start">
                <h1 class="font-bold text-sm md:text-2xl w-full">
                    사용자 등록.
                </h1>
            </div>

        </div>
        <div class="flex justify-center mr-9 space-x-2 pr-5">

            <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
            <button @click="saveButton" class="button save md:w-auto w-14">저장</button>
            <button @click="excelButton" class="button save w-auto excel">엑셀</button>

        </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-3 justify-between  bg-gray-200 rounded-lg h-12 items-center z-10">

        <div class="flex items-center space-x-5">
            <div class="text-base font-semibold ml-5">매장명 : </div><v-select v-model="selectedStoreCd"
                :options="storeList" :disabled="lngPositionType == 0" label="strName" :placeholder="'전체'"
                class="custom-select9 bg-white w-80 h-10 disabled:bg-gray-100 " @click="resetArea" />
        </div>
        <div class="flex justify-center items-center">
            <div class="text-base font-semibold">사용자명 : </div><input type="text" v-model="condition1"
                class="border rounded-lg pl-1 h-10 !w-36">
        </div>
        <div class="text-base font-semibold w-[90%] ml-10 z-10">사용자ID:
            <input type="text" class="border rounded-lg pl-1 h-10 !w-36 z-30" v-model="condition2">
        </div>

    </div>

    <div class="grid grid-rows-1 grid-cols-[1fr,1fr] h-[85%] w-[90%] ">
        <div>
            <div class="text-xl font-semibold flex justify-start ml-10 mt-2">사용자 정보</div>
            <Realgrid :progname="'SYS49_002INS_VUE'" :progid="1" :rowData="rowData" :documentTitle="'SYS49_002INS'"
                class="mt-2" :selectionStyle="'singleRow'" @clickedRowData="clickedRowData" :initSelect="true"
                @sendRowState="sendRowState" @selectedIndex="selectedIndex" :deleteRow2="deleteRow2" @updatedRowData="updatedRowData"
                :setStateBar="true" :checkBarInactive="'lngSupplierID'" :exporttoExcel="exceloutput" :changeNow="changeNow" :changeRow="changeRow" :changeColid="changeColid" :changeValue2="changeValue2"
                :documentSubTitle="documentSubTitle" :addRow4="addRow4" :addrowProp="addrowProp" :addrowDefault="addrowDefault">
            </Realgrid>
        </div>
        <div class="grid grid-rows-[1fr,10fr] grid-cols-1 h-[85%] w-[110%]">
            <div class="text-xl font-semibold flex justify-between ml-10 mt-2">
                <div>상세 정보</div>
                <div> 
                    <button @click="addButton" class="whitebutton md:w-auto w-14">신규</button>
                    <button @click="deleteButton" class="whitebutton md:w-auto w-14">삭제</button>
                </div>
            </div>
            <div
                class="grid grid-rows-[repeat(10,minmax(0,1fr))_6fr] grid-cols-[1fr,4fr] border border-gray-500 h-[100%] ml-10 -mt-5">
                <div class="border border-gray-500 p-2 font-semibold">매장</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="text" v-model="value1" disabled
                        class="border border-gray-500"><input type="text" disabled class="border border-gray-500 w-64"
                        v-model="value2"></div>
                <div class="border border-gray-500 p-2 font-semibold">사용자ID</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="text" v-model="value3" @input="setValue3"
                        :disabled="forupdateDisabled" class="border border-gray-500"><button class="button primary h-7"
                        @click="checkDupli">중복체크</button></div>
                <div class="border border-gray-500 p-2 font-semibold">사용자명</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="text" v-model="value4"  @input="setValue4"
                        class="border border-gray-500 w-64"></div>
                <div class="border border-gray-500 p-2 font-semibold">주민등록번호</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="number" v-model="value5" @input="setValue5"
                        class="border border-gray-500 w-32">-<input type="number" class="border border-gray-500 w-32"
                        v-model="value6" @change="setValue6">
                </div>
                <div class="border border-gray-500 p-2 font-semibold">비밀번호</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="password" v-model="value7" @input="setValue7"
                        class="border border-gray-500 w-64"></div>
                <div class="border border-gray-500 p-2 font-semibold">보안분류</div>
                <div class="border border-gray-500 p-1 flex"><select name="" id="" class="border border-gray-500 w-64"
                        v-model="value8" @change="setValue8">
                        <option :value="i.lngUserAdminID" v-for="i in secureList">{{ i.strName }}</option>
                    </select></div>
                <div class="border border-gray-500 p-2 font-semibold">언어선택</div>
                <div class="border border-gray-500 p-1 flex"><select name="" id="" class="border border-gray-500 w-64"
                        v-model="value9" @change="setValue9">
                        <option value="0">한글</option>
                        <option value="1">영문</option>
                        <option value="2">중국어</option>
                        <option value="3">에스파냐어</option>
                    </select></div>
                <div class="border border-gray-500 p-2 font-semibold">차단설정</div>
                <div class="border border-gray-500 p-1 flex"><select name="" id="" class="border border-gray-500 w-64"
                        v-model="value10" :disabled="disabledLock" @change="setValue10">
                        <option :value="i.strDCode" v-for="i in LockList">{{ i.strDName }}</option>
                    </select></div>
                <div class="border border-gray-500 p-2 font-semibold">거래처여부</div>
                <div class="border border-gray-500 p-1 flex"><input type="checkbox" v-model="value11" @change="setValue11"></div>
                <div class="border border-gray-500 p-2 font-semibold">슈퍼바이저여부</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="checkbox" v-model="value12" @change="setValue12"><select
                        name="" id="" v-model="value13" :disabled="disableSupervisor" @change="setValue13"
                        class="border border-gray-500 w-64">
                        <option :value="i.lngCode" v-for="i in superVisorList">{{ i.strName }}</option>
                    </select></div>
                <div class="border border-gray-500 p-2 font-semibold flex justify-center items-center">브랜드통합관리</div>
                <div class="border border-gray-500 p-1 flex"><input type="checkbox" v-model="value14" @change="setValue14"></div>


            </div>
        </div>
    </div>



</template>

<script setup>
import { checkId, deleteUserInformation, getLockTypeList, getSecureList, getStoreListforUserEnroll, getSupervisorList, getUserEnroll, saveUserEnroll } from '@/api/system';
import Realgrid from '@/components/realgrid.vue';
import Swal from 'sweetalert2';
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
const selectedDate = ref()

const selectedStoreCd = ref(null)

const receiptNo = ref()
const store = useStore();
const secureList = ref([])
const LockList = ref([])
const superVisorList = ref([])
const selectedStoreNm = ref('')
const selectedUserSequence = ref('0')
const selectedUserChargerCode = ref('')
const storeList = ref([])
const forupdateDisabled = ref(true)
// const lngStoreCode = (e) => {
//     selectedStoreCd.value = e
//     console.log(e)
// }
const deleteRow2 = ref(false)
const selectedBlnHQ = ref('0')
const addRow4 = ref(false)
watch((selectedStoreCd), () => {
    if (selectedStoreCd.value == null) {
        selectedStoreNm.value = '전체'
        selectedBlnHQ.value = '0'
    } else {
        selectedStoreNm.value = storeList.value.filter(item => item.lngStoreCode == selectedStoreCd.value.lngStoreCode)[0].strName
        selectedBlnHQ.value = storeList.value.filter(item => item.lngStoreCode == selectedStoreCd.value.lngStoreCode)[0].blnHQ
    }
    initGrid()
})
const condition1 = ref('')
const condition2 = ref('')
const disabledLock = ref(false)
const afterSearch = ref(false)
const disableSupervisor = ref(false)
const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
const value4 = ref('')
const value5 = ref('')
const value6 = ref('')
const value7 = ref('')
const value8 = ref('')
const value9 = ref('')
const value10 = ref('')
const value11 = ref(false)
const value12 = ref(false)
const value13 = ref('')
const value14 = ref(false)
const addrowDefault= ref('')
const addrowProp= ref('lngPosition,strStoreName,lngLanguage,strLockType,strChargerName,strUserID,strUserAdminID,lngSupplierID,strIdNo,strPassword,lngUserAdminID,chkSupplierID,blnSupervisor,blnCompanyAdmin,lngSuperAttrCd,lngSequence,lngChargerCode')
onMounted(async () => {
    const res = await getStoreListforUserEnroll(store.state.userData.lngStoreGroup)
    storeList.value = res.data.List

    groupCd.value = store.state.userData.lngStoreGroup
    const loginedstrLang = store.state.userData.strLanguage
    const res2 = await getSecureList(groupCd.value)
    secureList.value = res2.data.List
    console.log(secureList.value)
    const res3 = await getLockTypeList(groupCd.value, loginedstrLang)

    LockList.value = res3.data.List
    let storecd
    if (store.state.userData.blnBrandAdmin == 'True' || store.state.userData.lngPositionType == '1') {
        storecd = 0
    } else {
        storecd = store.state.userData.lngPosition
    }
    const res4 = await getSupervisorList(groupCd.value, storecd)
    superVisorList.value = res4.data.List
})
const searchButton = async () => {


    try {
        store.state.loading = true;
        initGrid()
        let storecd
        if (selectedStoreCd.value == null) {
            storecd = 0
        } else {
            storecd = selectedStoreCd.value.lngStoreCode
        }

        const res = await getUserEnroll(groupCd.value, storecd, condition1.value, condition2.value)
        console.log(res)

        rowData.value = res.data.List
        afterSearch.value = true
    } catch (error) {
        afterSearch.value = false
    } finally {
        store.state.loading = false;
        disabledLock.value = false
    }

}
const groupCd = ref()
const storeCd = ref()
const selectedExcelStore = ref()
const selectedExcelDate = ref()
const selectedStoreAreaCode = ref()
const init = ref(false)
const documentSubTitle = ref('')

const rowData = ref([])



const selectedPosNo = ref()


const disCountCd = ref("")
const disCountNm = ref("")

const payCd = ref("")
const selectedRowState = ref('')
const sendRowState = (e) => {
    selectedRowState.value = e
}

const clickedRowData = async (e) => {
    console.log(e)
    console.log(selectedRowState.value)
    if(selectedRowState.value == 'created'){
        forupdateDisabled.value = false
    } else {
        forupdateDisabled.value = true
    }
   
    selectedUserChargerCode.value = e[16]
    selectedUserSequence.value = e[15]
    blnCheckDupli.value = true
    value1.value = e[5]
    value2.value = e[0]
    value3.value = e[1]
    value4.value = e[2]
    if (e[6] != undefined && e[6].includes('-')) {
        let first = e[6].split('-')[0]
        let second = e[6].split('-')[1]
        value5.value = first
        value6.value = second
    } else {
        value5.value = ''
        value6.value = ''
    }
    value7.value = e[7]
    value8.value = e[8]
    value9.value = e[9]
    value10.value = e[10] //10차단설정
    value11.value = e[11] == '0' ? false : true
    value12.value = e[12] == '0' ? false : true
    value13.value = e[14]
    value14.value = e[13] == '0' ? false : true

    if (value12.value == false) {
        disableSupervisor.value = true
    } else {
        disableSupervisor.value = false
    }

}

watch((value12), () => {
    disableSupervisor.value = value12.value == false ? true : false
})

const exceloutput = ref(false)
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
    let cond = '매장명 : ' + selectedStoreNm.value
    let cond2 = '사용자명 : ' + condition1.value
    let cond3 = '사용자ID : ' + condition2.value

    documentSubTitle.value = cond + '\n' + cond2 + '\n' + cond3
    exceloutput.value = !exceloutput.value
}
const initGrid = () => {


    if (rowData.value.length != 0) {
        rowData.value = []
    }
    value1.value = ''
    value2.value = ''
    value3.value = ''
    value4.value = ''
    value5.value = ''
    value6.value = ''
    value7.value = ''
    value8.value = ''
    value9.value = ''
    value10.value = ''
    value11.value = ''
    value12.value = ''
    value13.value = ''
    value14.value = ''



}

const selectedStoreAttr = ref()
const blnCheckDupli = ref(false)
const checkDupli = async () => {
    console.log(value3.value)
    const res = await checkId(value3.value)
    let cnt = res.data.List[0].cnt
    if (cnt == 1) {
        Swal.fire({
            title: '경고',
            text: '중복된 ID가 존재합니다.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    } else {
        Swal.fire({
            title: '확인',
            text: '사용하셔도 되는 아이디입니다.',
            icon: 'success',
            confirmButtonText: '확인'
        })
        blnCheckDupli.value = true
        return
    }
}

const currentAddState = ref(false)
const addButton = () => {
    if(currentAddState.value == true){
        Swal.fire({
            title: '경고',
            text: '먼저 저장을 하셔야 합니다.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    if (selectedStoreCd.value == null) {
        Swal.fire({
            title: '경고',
            text: '매장을 선택하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    //lngPosition,strStoreName,lngLanguage,strLockType,    strChargerName,strUserID,strUserAdminID,lngSupplierID,   strIdNo,strPassword,lngUserAdminID,chkSupplierID,   blnSupervisor,blnCompanyAdmin,lngSuperAttrCd,lngSequence,lngChargerCode
    addrowDefault.value = selectedStoreCd.value.lngStoreCode+','+selectedStoreCd.value.strName +',0,00,,,,0,,,,0,0,0,,0,0'
    addRow4.value = !addRow4.value
    blnCheckDupli.value = false
    forupdateDisabled.value = false
    selectedUserSequence.value = '0'
    selectedUserChargerCode.value = '0'
    value1.value = selectedStoreCd.value.lngStoreCode
    value2.value = selectedStoreNm.value
    value3.value = ''
    value4.value = ''
    value5.value = ''
    value6.value = ''
    value7.value = ''
    value8.value = ''
    value9.value = '0'
    value10.value = '00'
    value11.value = false
    value12.value = false
    value13.value = ''
    value14.value = false
    disabledLock.value = true
    currentAddState.value = true

}

const saveButton = async () => {
    if (value3.value == '') {
        Swal.fire({
            title: '경고',
            text: '사용자ID를 입력하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    if (blnCheckDupli.value == false) {
        Swal.fire({
            title: '경고',
            text: '사용자ID 중복체크는 필수입니다.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    if (value4.value == '') {
        Swal.fire({
            title: '경고',
            text: '사용자명을 입력하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    if (value7.value == '') {
        Swal.fire({
            title: '경고',
            text: '비밀번호를 입력하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    if (value7.value.length <= 5 || value7.value.length >= 21) {
        Swal.fire({
            title: '경고',
            text: '비밀번호는 6자리 이상 20자리 이하로 입력하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }

    if (value8.value === '') {
        Swal.fire({
            title: '경고',
            text: '보안분류를 선택하세요.',
            icon: 'warning',
            confirmButtonText: '확인'
        })
        return
    }
    let flag;
    if (selectedUserSequence.value == '0') {
        flag = 'N'
    } else {
        flag = 'U'
    }
    let uniteUserIdNo = value5.value + '-' + value6.value
     
    Swal.fire({
        title: '저장',
        text: '저장하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소'
    }).then(async (result) => {
        if (result.isConfirmed) {
            if(deleteRowSequences.value.length > 0){
                const res = await deleteUserInformation('D', deleteRowSequences.value.join(','))
                console.log(res)
            }
            const res = await saveUserEnroll(flag, selectedUserSequence.value, selectedUserChargerCode.value, value4.value, uniteUserIdNo, value7.value, selectedStoreCd.value.blnHQ, selectedStoreCd.value.lngStoreCode, groupCd.value, value3.value, value8.value, value9.value, value10.value, value11.value == false ? 0 : 1, value12.value == false ? 0 : 1, value13.value, value14.value == false ? 0 : 1)

            if (res.data.RESULT_CD == '00') {
                Swal.fire({
                    title: '성공',
                    text: '저장하였습니다.',
                    icon: 'success',
                    confirmButtonText: '확인'
                })
                searchButton()
                blnCheckDupli.value = false
                return
            } else {
                Swal.fire({
                    title: '실패',
                    text: '저장에 실패하였습니다.',
                    icon: 'warning',
                    confirmButtonText: '확인'
                })
                blnCheckDupli.value = false
                return
            }
        }
    })


}

// Swal.fire({
//         title: '경고',
//         text: '삭제하시겠습니까?',
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonText: '확인',
//         cancelButtonText: '취소'
//     }).then(async (result) => {
//         if (result.isConfirmed) {

//             const res = await deleteUserInformation('D', selectedUserSequence.value)
//             if (res.data.RESULT_CD == '00') {
//                 Swal.fire({
//                     title: '삭제',
//                     text: '삭제하였습니다.',
//                     icon: 'success',
//                     confirmButtonText: '확인'
//                 })
//                 searchButton()
//                 return;
//             } else {
//                 Swal.fire({
//                     title: '실패',
//                     text: '삭제에 실패하였습니다.',
//                     icon: 'warning',
//                     confirmButtonText: '확인'
//                 })
//                 return;
//             }


//         }
//     })

const deleteRowSequences = ref([])
const updatedRowData = (e) => {

    deleteRowSequences.value = e.filter(item => item.deleted == true).map(item => item.lngSequence)
  
}
const deleteButton = (e) => {
    deleteRow2.value = !deleteRow2.value
}

const selectedindex = ref('')
const selectedIndex =(e) =>{
    selectedindex.value = e
}
const changeRow=ref('')
const changeColid=ref('')
const changeValue2=ref('')
const changeNow = ref(false)
const setValue3 = (e) => {
    changeColid.value = 'strUserID'
    changeRow.value = selectedindex.value
    changeValue2.value = e.target.value

    changeNow.value = !changeNow.value
}
const setValue4 = (e) => {
    changeColid.value = 'strChargerName'
    changeRow.value = selectedindex.value
    changeValue2.value = e.target.value

    changeNow.value = !changeNow.value
}
const setValue5 = (e) => {
    changeColid.value = 'strIdNo'
    changeRow.value = selectedindex.value
    changeValue2.value = e.target.value +'-'+value6.value

    changeNow.value = !changeNow.value
}
const setValue6 = (e) => {
    changeColid.value = 'strIdNo'
    changeRow.value = selectedindex.value
    changeValue2.value = value5.value + '-'+ e.target.value

    changeNow.value = !changeNow.value
}
const setValue7 = (e) => {
    changeColid.value = 'strPassword'
    changeRow.value = selectedindex.value
    changeValue2.value = e.target.value

    changeNow.value = !changeNow.value
}
const setValue8 = (e) => {
    changeColid.value = 'lngUserAdminID'
    changeRow.value = selectedindex.value
    changeValue2.value = e.target.value

    changeNow.value = !changeNow.value
}
const setValue9 = (e) => {
    changeColid.value = 'lngLanguage'
    changeRow.value = selectedindex.value
    changeValue2.value =  e.target.value

    changeNow.value = !changeNow.value
}
const setValue10 = (e) => {
    changeColid.value = 'strLockType'
    changeRow.value = selectedindex.value
    changeValue2.value =  e.target.value

    changeNow.value = !changeNow.value
}
const setValue11 = (e) => {
    changeColid.value = 'chkSupplierID'
    changeRow.value = selectedindex.value
    changeValue2.value =  e.target.value

    changeNow.value = !changeNow.value
}
const setValue12 = (e) => {
    changeColid.value = 'blnSupervisor'
    changeRow.value = selectedindex.value
    changeValue2.value =  e.target.value

    changeNow.value = !changeNow.value
}
const setValue13 = (e) => {
    changeColid.value = 'lngSuperAttrCd'
    changeRow.value = selectedindex.value
    changeValue2.value =  e.target.value

    changeNow.value = !changeNow.value
}
const setValue14 = (e) => {
    changeColid.value = 'blnCompanyAdmin'
    changeRow.value = selectedindex.value
    changeValue2.value =  e.target.value

    changeNow.value = !changeNow.value
}

</script>
