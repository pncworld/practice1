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
                class="mt-2" :selectionStyle="'singleRow'" @clickedRowData="clickedRowData" :initFocus="initFocus"
                :moveFocusbyIndex="moveFocusbyIndex" @sendRowState="sendRowState" @selectedIndex="selectedIndex"
                :deleteRow5="deleteRow2" @updatedRowData2="updatedRowData" :setStateBar="true" @deleteRows="deleteRows"
                :checkBarInactive="'lngSupplierID'" :exporttoExcel="exceloutput" :changeNow="changeNow"
                :changeRow="changeRow" :changeColid="changeColid" :changeValue2="changeValue2"
                :documentSubTitle="documentSubTitle" :addRow5="addRow4" :addrowProp="addrowProp"
                :addrowDefault="addrowDefault" @clickedRowData2="clickedRowData2">
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
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="text" v-model="value3"
                        @input="setValue3" :disabled="forupdateDisabled" class="border border-gray-500"><button
                        class="button primary h-7" @click="checkDupli">중복체크</button></div>
                <div class="border border-gray-500 p-2 font-semibold">사용자명</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="text" v-model="value4"
                        @input="setValue4" class="border border-gray-500 w-64"></div>
                <div class="border border-gray-500 p-2 font-semibold">주민등록번호</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="number" v-model="value5"
                        @input="setValue5" class="border border-gray-500 w-32">-<input type="number"
                        class="border border-gray-500 w-32" v-model="value6" @change="setValue6">
                </div>
                <div class="border border-gray-500 p-2 font-semibold">비밀번호</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="password" v-model="value7"
                        @input="setValue7" class="border border-gray-500 w-64"></div>
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
                <div class="border border-gray-500 p-1 flex"><input type="checkbox" v-model="value11"
                        @change="setValue11"></div>
                <div class="border border-gray-500 p-2 font-semibold">슈퍼바이저여부</div>
                <div class="border border-gray-500 p-1 flex space-x-3"><input type="checkbox" v-model="value12"
                        @change="setValue12"><select name="" id="" v-model="value13" :disabled="disableSupervisor"
                        @change="setValue13" class="border border-gray-500 w-64">
                        <option :value="i.lngCode" v-for="i in superVisorList">{{ i.strName }}</option>
                    </select></div>
                <div class="border border-gray-500 p-2 font-semibold flex justify-center items-center">브랜드통합관리</div>
                <div class="border border-gray-500 p-1 flex"><input type="checkbox" v-model="value14"
                        @change="setValue14"></div>


            </div>
        </div>
    </div>



</template>

<script setup>
import { checkId, deleteUserInformation, getLockTypeList, getSecureList, getStoreListforUserEnroll, getSupervisorList, getUserEnroll, saveUserEnroll } from '@/api/system';
import Realgrid from '@/components/realgrid.vue';
import { RowState } from 'realgrid';
import Swal from 'sweetalert2';
import { nextTick, onMounted, ref, watch } from 'vue';

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
const moveFocusbyIndex = ref('')
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
const addrowDefault = ref('')
const addrowProp = ref('lngPosition,strStoreName,lngLanguage,strLockType,strChargerName,strUserID,strUserAdminID,lngSupplierID,strIdNo,strPassword,lngUserAdminID,chkSupplierID,blnSupervisor,blnCompanyAdmin,lngSuperAttrCd,lngSequence,lngChargerCode')
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
const rowData2 = ref([]);
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

        rowData.value = JSON.parse(JSON.stringify(res.data.List))
        updateRowData.value = res.data.List
        afterSearch.value = true
    } catch (error) {
        afterSearch.value = false
    } finally {
        store.state.loading = false;
        disabledLock.value = false
        initFocus.value = !initFocus.value
        currentAddState.value = false
        prevRowState.value = []
        prevIndex.value = []
        prevSequence.value = []
    }

}
const initFocus = ref(false)
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
    console.log(e)
}
const rollBackFoucus = () => {
    const currentIndex = selectedIndexArray.value[selectedIndexArray.value.length - 1]
    console.log(currentIndex)
    const prevIndexarr = selectedIndexArray.value.filter(item => item !== currentIndex)
    console.log(prevIndexarr)
    const realPrevIndex = prevIndexarr[prevIndexarr.length - 1]
    console.log(realPrevIndex)

    setTimeout(() => {
        moveFocusbyIndex.value = -1; // 임시 값 변경
        nextTick(() => {
            moveFocusbyIndex.value = realPrevIndex; // 변경을 감지하게 만듦
        });
    }, 10);


    selectedindex.value = realPrevIndex
}
const rollBack = () => {


    if (selectedUserSequence.value == '0') {
        return
    }
    console.log(selectedUserSequence.value)

    setTimeout(() => {
        const Value3 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].strUserID
        setTimeout(() => { setValue3(Value3) }, 10)
        value3.value = Value3
        const Value4 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].strChargerName
        setTimeout(() => { setValue4(Value4) }, 10)
        value4.value = Value4
        const Value5 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].strIdNo.split("-")[0]
        setTimeout(() => { setValue5(Value5) }, 10)
        value5.value = Value5
        const Value6 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].strIdNo.split("-")[1]
        setTimeout(() => { setValue6(Value6) }, 10)
        value6.value = Value6
        const Value7 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].strPassword
        setTimeout(() => { setValue7(Value7) }, 10)
        value7.value = Value7
        const Value8 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].lngUserAdminID
        setTimeout(() => { setValue8(Value8) }, 10)
        value8.value = Value8
        const Value9 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].lngLanguage
        setTimeout(() => { setValue9(Value9) }, 10)
        value9.value = Value9
        const Value10 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].strLockType
        setTimeout(() => { setValue10(Value10) }, 10)
        value10.value = Value10
        const Value11 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].chkSupplierID
        setTimeout(() => { setValue11(Value11) }, 10)
        value11.value = Value11
        const Value12 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].blnSupervisor
        setTimeout(() => { setValue12(Value12) }, 10)
        value12.value = Value12
        const Value13 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].lngSuperAttrCd
        setTimeout(() => { setValue13(Value13) }, 10)
        value13.value = Value13
        const Value14 = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].blnCompanyAdmin
        setTimeout(() => { setValue14(Value14) }, 10)
        value14.value = Value14
    }, 20)


}

function sortObject(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(sortObject);
    return Object.keys(obj)
        .sort((a, b) => a.localeCompare(b))
        .reduce((result, key) => {
            result[key] = sortObject(obj[key]);
            return result;
        }, {});
}
const prevRowState = ref([])
const prevIndex = ref([])
const prevSequence = ref([])

const clickedRowData2 = (e) => {
    const curr = rowData.value[e]
        value1.value = curr.lngPosition
        value2.value = curr.strStoreName
        value3.value = curr.strUserID
        value4.value = curr.strChargerName
        if (curr.strIdNo != undefined && curr.strIdNo.includes('-')) {
            let first = curr.strIdNo.split('-')[0]
            let second = curr.strIdNo.split('-')[1]
            value5.value = first
            value6.value = second
        } else {
            value5.value = ''
            value6.value = ''
        }
        value7.value = curr.strPassword
        value8.value = curr.lngUserAdminID
        value9.value = curr.lngLanguage
        value10.value = curr.strLockType //10차단설정
        value11.value = curr.chkSupplierID == '0' ? false : true
        value12.value = curr.blnSupervisor == '0' ? false : true
        value13.value = curr.lngSuperAttrCd
        value14.value = curr.blnCompanyAdmin== '0' ? false : true

        if (value12.value == false) {
            disableSupervisor.value = true
        } else {
            disableSupervisor.value = false
        }

        selectedUserChargerCode.value = curr.lngChargerCode
        selectedUserSequence.value = curr.lngSequence
}
const clickedRowData = async (e) => {
    console.log(e)
    console.log(prevSequence.value)
    console.log(updateRowData.value)
    console.log(currentAddState.value)
    // if (currentAddState.value == true) {
       
    //     currentAddState.value = false
    //     return
    // }
    if (prevSequence.value.length > 0 && prevSequence.value[prevSequence.value.length - 1] == e[15]) {
        return
    }
    console.log(e)
    prevRowState.value.push(e.rowState)
    prevIndex.value.push(e.index)
    prevSequence.value.push(e[15])

    let newRow = updateRowData.value.filter(item => item.lngSequence == '0').length
    console.log(newRow)
    updateRowData.value = updateRowData.value.filter(item => item.lngSequence != '0')

    console.log(updateRowData.value)
    console.log(rowData.value)
    if (JSON.stringify(sortObject(rowData.value)) != JSON.stringify(sortObject(updateRowData.value)) || newRow > 0) {
        Swal.fire({
            title: '변경',
            text: '기존 내용과 수정된 내용이 존재합니다. 저장하시겠습니까? 취소하시면 원래 데이터가 복원됩니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '저장',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                saveButton()
            } else {
                rollBackFoucus()
                rollBack();

                updateRowData.value = JSON.parse(JSON.stringify(rowData.value))


            }
        })
        return;
    }

    if (selectedRowState.value == 'created') {
        forupdateDisabled.value = false
    } else {
        forupdateDisabled.value = true
    }

    selectedUserChargerCode.value = e[16]
    selectedUserSequence.value = e[15]
    blnCheckDupli.value = true
    value1.value = e[5]
    value2.value = e[0]
    value3.value = e[2]
    value4.value = e[1]
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
    if (currentAddState.value == true) {
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
    addrowDefault.value = selectedStoreCd.value.lngStoreCode + ',' + selectedStoreCd.value.strName + ',0,00,,,,0,,,,0,0,0,,0,0'
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
    let validatePassWord = ''
    if (selectedUserSequence.value != '0') {
        validatePassWord = rowData.value.filter(item => item.lngSequence == selectedUserSequence.value)[0].strPassword
    }

    if ((value7.value.length <= 5 || value7.value.length >= 21) && selectedRowState.value !== 'none' || (selectedRowState.value == 'none' && validatePassWord != value7.value)) {
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
            if (deleteRowSequences.value.length > 0) {
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
                currentAddState.value = false
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
const updateRowData = ref([])
const updatedRowData = (e) => {


    let convertArray = e.map(({ deleted, lngSupplierID, ...rest }) => ({
        ...rest,
        lngSupplierID: lngSupplierID ? "1" : "0"
    }));


    updateRowData.value = convertArray
    console.log(e)
}
const deleteRows = (e) => {
    // deleteRowSequences.value = rowData.value.filter(item => item.lngSequence == )

    deleteRowSequences.value = e.map(item => item[15])
    console.log(deleteRowSequences.value)
    updateRowData.value = updateRowData.value.filter(item => item.lngSequence != '0')
}
const deleteButton = (e) => {
    deleteRow2.value = !deleteRow2.value
    if (currentAddState.value == true) {
        currentAddState.value = false
    }
}

const selectedindex = ref('')
const selectedIndexArray = ref([])
const selectedIndex = (e) => {
    selectedindex.value = e
    console.log(e)
    selectedIndexArray.value.push(e)
}
const changeRow = ref('')
const changeColid = ref('')
const changeValue2 = ref('')
const changeNow = ref(false)
const setValue3 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'strUserID'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue4 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'strChargerName'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue5 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'strIdNo'
    changeRow.value = selectedindex.value
    changeValue2.value = value + '-' + value6.value

    changeNow.value = !changeNow.value
}
const setValue6 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'strIdNo'
    changeRow.value = selectedindex.value
    changeValue2.value = value5.value + '-' + value

    changeNow.value = !changeNow.value
}
const setValue7 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'strPassword'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue8 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'lngUserAdminID'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue9 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'lngLanguage'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue10 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'strLockType'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue11 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'chkSupplierID'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue12 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'blnSupervisor'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue13 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'lngSuperAttrCd'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}
const setValue14 = (e) => {
    if (e == undefined) {
        e = ''
    }
    const value = typeof e === "string" ? e : e.target.value;
    changeColid.value = 'blnCompanyAdmin'
    changeRow.value = selectedindex.value
    changeValue2.value = value

    changeNow.value = !changeNow.value
}

</script>
