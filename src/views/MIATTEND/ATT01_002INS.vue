/*--############################################################################
# Filename : ATT01_002INS.vue                                                  
# Description : 인사관리 > 사원 마스터 > 사원등록.                          
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div class="att01-page box-border flex h-full max-w-full min-h-0 flex-col gap-2 overflow-hidden pb-1">
    <div class="att01-toolbar flex shrink-0 flex-wrap items-center justify-between gap-2">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">조회</button>
        <button type="button" @click="addButton" class="button new md:w-auto w-auto">신규</button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-auto">저장</button>
        <button type="button" @click="excelButton" class="button excel md:w-auto w-auto">엑셀</button>
      </div>
    </div>

    <div class="att01-search-panel z-10 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="att01-search-grid min-w-0">
        <div class="att01-cell">
          <div class="att01-sg-label">매장명</div>
          <div class="att01-cell-field att01-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              store-dropdown-fit-height
              main-name=""
              :compact-store-combo-max-rem="15.6"
              @update:storeGroup="handleGroupCd"
              @update:storeType="handleStoreType"
              @update:storeCd="handleStoreCd"
              :defaultStoreNm="'전체'"
              @storeNm="storeNm"
              @update:ischanged="handleinitAll" />
          </div>
        </div>
        <div class="att01-cell">
          <div class="att01-sg-label">검색</div>
          <div class="att01-cell-field att01-search-pair">
            <select class="att01-control att01-control--kind" v-model="searchoption">
              <option value="0">전체</option>
              <option value="1">사원명</option>
              <option value="2">사원코드</option>
            </select>
            <input
              type="text"
              v-model="searchword"
              class="att01-control att01-control--word"
              @keydown.enter.prevent="searchButton" />
          </div>
        </div>
        <div class="att01-cell">
          <div class="att01-sg-label">조회옵션</div>
          <div class="att01-cell-field att01-checks">
            <label class="att01-check" for="cond"><input type="checkbox" id="cond" v-model="cond" />재직</label>
            <label class="att01-check" for="cond2"><input type="checkbox" id="cond2" v-model="cond2" />퇴사</label>
            <label class="att01-check" for="cond3"><input type="checkbox" id="cond3" v-model="cond3" />휴직</label>
          </div>
        </div>
        <div class="att01-cell">
          <div class="att01-sg-label">직책</div>
          <div class="att01-cell-field">
            <select class="att01-control" v-model="cond4">
              <option value="0">전체</option>
              <option :value="i.lngClassCode" v-for="i in dataList2" :key="i.lngClassCode">{{ i.strClass }}</option>
            </select>
          </div>
        </div>
        <div class="att01-cell">
          <div class="att01-sg-label">직위</div>
          <div class="att01-cell-field">
            <select class="att01-control" v-model="cond5">
              <option value="0">전체</option>
              <option :value="i.lngRankCode" v-for="i in dataList3" :key="i.lngRankCode">{{ i.strRank }}</option>
            </select>
          </div>
        </div>
        <div class="att01-cell">
          <div class="att01-sg-label">근무장소</div>
          <div class="att01-cell-field">
            <select class="att01-control" v-model="cond6">
              <option value="0">전체</option>
              <option :value="i.lngAreaCode" v-for="i in dataList" :key="i.lngAreaCode">{{ i.strArea }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="att01-body min-h-0 min-w-0 flex-1">
      <div class="att01-section-title shrink-0">사원 목록</div>
      <div class="att01-grid-wrap mt-2 min-h-0 min-w-0">
        <Realgrid
          class="h-full w-full"
          :progname="'ATT01_002INS_VUE2'"
          :progid="1"
          :rowData="rowData"
          @clickedRowData="clickedRowData"
          @selcetedrowData="selcetedrowData"
          @updatedRowData="updatedRowData"
          :addRow4="addRow"
          :deleteRow2="deleteRow"
          :addrowDefault="addrowDefault"
          :addrowProp="'lngStoreGroup,lngPosition,strStoreName,lngChargerCode,strChargerName,strIdNoMask,strAreaName,strClass,strRank,curAmt,strTelNumber,strAddress,strExpireClass,strPassword,strCardNumber,dtmJoinDate,dtmExpireDate,dtmHealthExpireDate,dtmRetireDate,strBankName,strBankNumber,strEmail,lngClassCode,lngRankCode,lngAreaCode,lngPayCode,lngChangePayCode,blnLuner,blnExpireClass,lngBankCode,dtmBirthDate,strZipCode,dtmChangeDate,lngForeigner,strIdNo,lngWorkClass,lngSequence,lngUserAdminID'"
          :changeNow="changeNow"
          :changeValue2="changeValue2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          :exporttoExcel="exporttoExcel"
          :documentSubTitle="documentSubTitle"
          :documentTitle="'ATT01_002INS'"
          @selectedIndex="selectedIndex"
          :rowStateeditable="false"
          @sendRowState="sendRowState"
          @allStateRows="allStateRows"
          :addField="'new'" />
      </div>

      <div class="att01-section-title att01-section-title--form shrink-0">사원 정보</div>
      <div class="att01-form-scroll mt-2 min-h-0">
        <div class="att01-form-grid">
          <div class="att01-form-label att01-form-label--required">*매장코드</div>
          <div class="att01-form-value">
            <select name="lngPosition" :disabled="disableGrid || lockStoreCode" v-model="gridvalue1" @change="changeInfo" class="att01-control">
              <option :value="i.lngStoreCode" v-for="i in dataList4" :key="i.lngStoreCode">{{ i.strName }}</option>
            </select>
          </div>
          <div class="att01-form-label att01-form-label--required">*사원이름</div>
          <div class="att01-form-value">
            <input type="text" name="strChargerName" @input="changeInfo" :disabled="disableGrid" class="att01-control" v-model="gridvalue2" />
          </div>
          <div class="att01-form-label att01-form-label--required">*사원 코드</div>
          <div class="att01-form-value">
            <input type="text" name="lngChargerCode" @input="changeInfo" :disabled="disableGrid" class="att01-control" v-model="gridvalue3" />
          </div>

          <div class="att01-form-label">주민번호</div>
          <div class="att01-form-value">
            <input type="text" name="strIdNo" @input="changeInfo" :disabled="disableGrid" class="att01-control" v-model="gridvalue4" />
          </div>
          <div class="att01-form-label">비밀번호</div>
          <div class="att01-form-value">
            <input type="text" name="strPassword" autocomplete="off" spellcheck="false" autocapitalize="off" @input="changeInfo" :disabled="disableGrid" class="att01-control att01-secret" v-model="gridvalue5" />
          </div>
          <div class="att01-form-label">생년월일</div>
          <div class="att01-form-value att01-form-value--split">
            <input type="date" name="dtmBirthDate" @input="changeInfo" :disabled="disableGrid" v-model="gridvalue6" class="att01-control" />
            <select name="blnLuner" @change="changeInfo" v-model="gridvalue7" :disabled="disableGrid" class="att01-control att01-control--calendar">
              <option :value="true">양력</option>
              <option :value="false">음력</option>
            </select>
          </div>

          <div class="att01-form-label att01-form-label--required">*직책</div>
          <div class="att01-form-value">
            <select name="lngClassCode" @change="changeInfo" v-model="gridvalue8" :disabled="disableGrid" class="att01-control">
              <option value="0">선택</option>
              <option :value="i.lngClassCode" v-for="i in dataList2" :key="'c-' + i.lngClassCode">{{ i.strClass }}</option>
            </select>
          </div>
          <div class="att01-form-label att01-form-label--required">*직위</div>
          <div class="att01-form-value">
            <select name="lngRankCode" @change="changeInfo" v-model="gridvalue9" :disabled="disableGrid" class="att01-control">
              <option value="0">선택</option>
              <option :value="i.lngRankCode" v-for="i in dataList3" :key="'r-' + i.lngRankCode">{{ i.strRank }}</option>
            </select>
          </div>
          <div class="att01-form-label att01-form-label--required">*근무장소</div>
          <div class="att01-form-value">
            <select name="lngAreaCode" @change="changeInfo" :disabled="disableGrid" v-model="gridvalue10" class="att01-control">
              <option value="0">선택</option>
              <option :value="i.lngAreaCode" v-for="i in dataList" :key="'a-' + i.lngAreaCode">{{ i.strArea }}</option>
            </select>
          </div>

          <div class="att01-form-label">입사일자</div>
          <div class="att01-form-value">
            <input type="date" name="dtmJoinDate" :disabled="disableGrid" @input="changeInfo" v-model="gridvalue11" class="att01-control" />
          </div>
          <div class="att01-form-label">카드번호</div>
          <div class="att01-form-value">
            <input type="text" name="strCardNumber" @input="changeInfo" :disabled="disableGrid" v-model="gridvalue12" class="att01-control" />
          </div>
          <div class="att01-form-label att01-form-label--required">*재직구분</div>
          <div class="att01-form-value">
            <select name="blnExpireClass" @change="changeInfo" v-model="gridvalue13" :disabled="disableGrid" class="att01-control">
              <option value="0">재직</option>
              <option value="1">퇴직</option>
              <option value="2">휴직</option>
            </select>
          </div>

          <div class="att01-form-label">우편번호</div>
          <div class="att01-form-value att01-form-value--split">
            <input type="text" name="strZipCode" @input="changeInfo" v-model="gridvalue14" :disabled="disableGrid" class="att01-control" />
            <button type="button" class="whitebutton att01-zip-btn" @click="showZipCode" :disabled="disableGrid">우편번호 찾기</button>
          </div>
          <div class="att01-form-label">주소</div>
          <div class="att01-form-value att01-span-3">
            <input type="text" name="strAddress" @input="changeInfo" :disabled="disableGrid" v-model="gridvalue15" class="att01-control" />
          </div>

          <div class="att01-form-label">전화번호</div>
          <div class="att01-form-value">
            <input type="text" name="strTelNumber" :disabled="disableGrid" @input="changeInfo" v-model="gridvalue16" class="att01-control" />
          </div>
          <div class="att01-form-label">휴대폰번호</div>
          <div class="att01-form-value">
            <input type="text" name="strCPhone" :disabled="disableGrid" @input="changeInfo" v-model="gridvalue17" class="att01-control" />
          </div>
          <div class="att01-form-label">퇴직일자</div>
          <div class="att01-form-value">
            <input type="date" name="dtmRetireDate" :disabled="disableGrid" @input="changeInfo" v-model="gridvalue18" class="att01-control" />
          </div>

          <div class="att01-form-label">이메일</div>
          <div class="att01-form-value">
            <input type="text" :disabled="disableGrid" name="strEmail" @input="changeInfo" v-model="gridvalue19" class="att01-control" />
          </div>
          <div class="att01-form-label">계약 만기일</div>
          <div class="att01-form-value">
            <input type="date" :disabled="disableGrid" name="dtmExpireDate" @input="changeInfo" v-model="gridvalue20" class="att01-control" />
          </div>
          <div class="att01-form-label">보건증만기일</div>
          <div class="att01-form-value">
            <input type="date" :disabled="disableGrid" name="dtmHealthExpireDate" @input="changeInfo" v-model="gridvalue21" class="att01-control" />
          </div>

          <div class="att01-form-label">정규직/PT</div>
          <div class="att01-form-value">
            <select name="lngWorkClass" :disabled="disableGrid" @change="changeInfo" v-model="gridvalue22" class="att01-control">
              <option value="0">해당 사항 없음</option>
              <option value="1">정직원</option>
              <option value="2">PT</option>
            </select>
          </div>
          <div class="att01-form-label">거래은행</div>
          <div class="att01-form-value">
            <select name="lngBankCode" :disabled="disableGrid" @change="changeInfo" v-model="gridvalue23" class="att01-control">
              <option value="0">선택</option>
              <option :value="i.lngBankCode" v-for="i in dataList5" :key="i.lngBankCode">{{ i.strBankName }}</option>
            </select>
          </div>
          <div class="att01-form-label">계좌번호</div>
          <div class="att01-form-value">
            <input type="text" :disabled="disableGrid" name="strBankNumber" @input="changeInfo" v-model="gridvalue24" class="att01-control" />
          </div>
        </div>
      </div>
    </div>

    <GetZipCode
      v-if="zipCode"
      @closePopUp="closeZipCode"
      @address="address"
      @zipCode="zipCode2" />
  </div>
</template>

<script setup>
import {
  getChargerInfo,
  getChargerInfo2,
  getInitEmpInfo,
  saveEMP,
  saveEMP2,
} from "@/api/miattend";
import GetZipCode from "@/components/getZipCode.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStore from "@/components/pickStore.vue";

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { Store, useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */
const store = useStore();
const dataList = ref([]);
const dataList2 = ref([]);
const dataList3 = ref([]);
const dataList4 = ref([]);
const dataList5 = ref([]);

const gridvalue1 = ref();
const gridvalue2 = ref();
const gridvalue3 = ref();
const gridvalue4 = ref();
const gridvalue5 = ref();
const gridvalue6 = ref();
const gridvalue7 = ref();
const gridvalue8 = ref();
const gridvalue9 = ref();
const gridvalue10 = ref(null);
const gridvalue11 = ref();
const gridvalue12 = ref();
const gridvalue13 = ref();
const gridvalue14 = ref();
const gridvalue15 = ref();
const gridvalue16 = ref();
const gridvalue17 = ref();
const gridvalue18 = ref();
const gridvalue19 = ref();
const gridvalue20 = ref();
const gridvalue21 = ref();
const gridvalue22 = ref();
const gridvalue23 = ref();
const gridvalue24 = ref();

const disableGrid = ref(true);

const resetDetailForm = () => {
  disableGrid.value = true;
  lockStoreCode.value = true;
  isNewRow.value = true;
  detailRowIndex.value = -1;
  changeRow.value = undefined;
  editedRowIndexes.value = [];
  allRowStates.value = { created: [] };
  gridvalue1.value = store.state.userData.lngPosition;
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = true;
  gridvalue8.value = "0";
  gridvalue9.value = "0";
  gridvalue10.value = "0";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "0";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
  gridvalue17.value = "";
  gridvalue18.value = "";
  gridvalue19.value = "";
  gridvalue20.value = "";
  gridvalue21.value = "";
  gridvalue22.value = "0";
  gridvalue23.value = "0";
  gridvalue24.value = "";
};
const zipCode = ref(false);
const showZipCode = () => {
  zipCode.value = true;
};
const closeZipCode = () => {
  zipCode.value = false;
};

const address = async (e) => {
  gridvalue15.value = e;

  setTimeout(() => {
    markEditedRow();
    changeColid.value = "strAddress";
    changeValue2.value = e;
    changeNow.value = !changeNow.value;
  }, 10);
};

const zipCode2 = async (e) => {
  gridvalue14.value = e;
  setTimeout(() => {
    markEditedRow();
    changeColid.value = "strZipCode";
    changeValue2.value = e;
    changeNow.value = !changeNow.value;
  }, 10);
};

const searchoption = ref(0);
const searchword = ref("");

const cond = ref(true);
const cond2 = ref(true);
const cond3 = ref(true);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitEmpInfo(store.state.userData.lngStoreGroup);
  dataList.value = res.data.List;
  dataList2.value = res.data.List2;
  dataList3.value = res.data.List3;
  dataList4.value = res.data.List4;
  dataList5.value = res.data.List5;

  gridvalue1.value = store.state.userData.lngPosition;
  ////console.log(res);
});
const rowData = ref([]);
const groupCd = ref();
const storeCd = ref();
const storeType = ref(0);
const afterSearch = ref(false);
const exporttoExcel = ref(false);
const documentSubTitle = ref("");
const isNewRow = ref(true);
/**
 * 추가 버튼 함수
 */

const addRow = ref(false);
const changeNow = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();
const detailRowIndex = ref(-1);
const editedRowIndexes = ref([]);

const lockStoreCode = ref(true);
const sendRowState = (e) => {
  if (e == "created") {
    isNewRow.value = false;
    lockStoreCode.value = false;
  } else {
    isNewRow.value = true;
    lockStoreCode.value = true;
  }
};

const allRowStates = ref([]);
const allStateRows = (e) => {
  allRowStates.value = e;
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (newValue) => {
  const created = allRowStates.value?.created ?? [];
  if (created.length === 1 && Number(newValue) !== Number(created[0])) {
    changeRow.value = created[0];
    return;
  }
  changeRow.value = newValue;
};

const markEditedRow = () => {
  const created = allRowStates.value?.created ?? [];
  if (created.length === 1) {
    changeRow.value = created[0];
    detailRowIndex.value = created[0];
  } else if (detailRowIndex.value >= 0) {
    changeRow.value = detailRowIndex.value;
  }
  const idx = Number(changeRow.value);
  if (Number.isNaN(idx) || idx < 0) {
    return;
  }
  if (editedRowIndexes.value.includes(idx)) {
    return;
  }
  const next = [...editedRowIndexes.value, idx];
  setTimeout(() => {
    if (!editedRowIndexes.value.includes(idx)) {
      editedRowIndexes.value = next;
    }
  }, 0);
};
/**
 *  추가 버튼
 */

const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
  const unsavedCreated = allRowStates.value?.created ?? [];
  if (unsavedCreated.length > 0) {
    Swal.fire({
      title: "경고",
      text: "사원 신규 등록을 완료 후 추가 등록해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  // isNewRow.value = false;
  const newCode =
    Math.max(0, ...updateRow.value.map((item) => item.lngChargerCode)) + 1;
  const storeNm = store.state.userData.strStoreName;
  // /////console.log(storeNm);
  addrowDefault.value =
    groupCd.value +
    "," +
    store.state.userData.lngPosition +
    "," +
    storeNm +
    "," +
    newCode +
    ",,,,,,,,,재직,,,, , , , , ,,0,0,0, ,0,0,0,0,,,,,,0,0,0";
  addRow.value = !addRow.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  // console.log(newValue);
  if (
    newValue != null &&
    typeof newValue.index === "number" &&
    newValue.index >= 0
  ) {
    const created = allRowStates.value?.created ?? [];
    if (created.length !== 1 || Number(newValue.index) === Number(created[0])) {
      detailRowIndex.value = newValue.index;
      changeRow.value = newValue.index;
    }
  }
  disableGrid.value = false;
  gridvalue1.value = newValue[1];
  gridvalue2.value = newValue[4];
  gridvalue3.value = newValue[3];
  gridvalue4.value = newValue[35];
  gridvalue5.value = newValue[14];
  gridvalue6.value = newValue[31].split(" ")[0];
  gridvalue7.value = newValue[28] == "True" ? true : false;
  gridvalue8.value = newValue[23];
  gridvalue9.value = newValue[24];
  gridvalue10.value =
    newValue[25] == null || newValue[25] === "" || isNaN(newValue[25])
      ? "0"
      : newValue[25];
  gridvalue11.value = newValue[16].split(" ")[0];
  gridvalue12.value = newValue[15];
  gridvalue13.value = newValue[29];
  gridvalue14.value = newValue[32];
  gridvalue15.value = newValue[12];
  gridvalue16.value = newValue[10];
  gridvalue17.value = newValue[11];
  gridvalue18.value = newValue[19].split(" ")[0];
  gridvalue19.value = newValue[22];
  gridvalue20.value = newValue[17].split(" ")[0];
  gridvalue21.value = newValue[18].split(" ")[0];
  gridvalue22.value = newValue[36];
  gridvalue23.value = newValue[30];
  gridvalue24.value = newValue[21];
};
/**
 * 페이지 매장 그룹 세팅
 */

const handleGroupCd = (newValue) => {
  groupCd.value = newValue;
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = (newValue) => {
  storeCd.value = newValue;
};

const handleStoreType = (newValue) => {
  storeType.value = newValue;
};
const updateRow = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updateRow.value = newValue;
  //comsole.log(newValue);
};

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const changeInfo = (e) => {
  markEditedRow();
  const rowName = e.target.name;
  const rowValue = e.target.value;

  if (rowName == "lngPosition") {
    setTimeout(() => {
      changeValue2.value = dataList4.value.filter(
        (item) => item.lngStoreCode == rowValue
      )[0].strName;
      changeColid.value = "strStoreName";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngClassCode") {
    const classItem = dataList2.value.find(
      (item) => String(item.lngClassCode) === String(rowValue)
    );
    if (classItem) {
      gridvalue8.value = classItem.lngClassCode;
    }
    setTimeout(() => {
      if (!classItem) {
        return;
      }
      changeValue2.value = classItem.strClass;
      changeColid.value = "strClass";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngRankCode") {
    const rankItem = dataList3.value.find(
      (item) => String(item.lngRankCode) === String(rowValue)
    );
    if (rankItem) {
      gridvalue9.value = rankItem.lngRankCode;
    }
    setTimeout(() => {
      if (!rankItem) {
        return;
      }
      changeValue2.value = rankItem.strRank;
      changeColid.value = "strRank";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngAreaCode") {
    const areaItem = dataList.value.find(
      (item) => String(item.lngAreaCode) === String(rowValue)
    );
    if (areaItem) {
      gridvalue10.value = areaItem.lngAreaCode;
    }
    setTimeout(() => {
      // console.log(rowValue);
      if (rowValue == null || rowValue == "null" || rowValue == "0") {
        changeValue2.value = "선택";
        changeColid.value = "strAreaName";

        changeNow.value = !changeNow.value;
      } else if (areaItem) {
        changeValue2.value = areaItem.strArea;
        changeColid.value = "strAreaName";

        changeNow.value = !changeNow.value;
      }
    }, 10);

    setTimeout(() => {
      changeValue2.value = rowValue;
      changeColid.value = "lngAreaCode";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "blnExpireClass") {
    setTimeout(() => {
      changeValue2.value =
        rowValue == 0 ? "재직" : rowValue == 1 ? "퇴직" : "휴직";
      changeColid.value = "strExpireClass";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngBankCode") {
    setTimeout(() => {
      changeValue2.value = dataList5.value.filter(
        (item) => item.lngBankCode == rowValue
      )[0].strBankName;
      changeColid.value = "strBankName";

      changeNow.value = !changeNow.value;
    }, 10);
  }
  changeColid.value = rowName;
  changeValue2.value = rowValue;

  changeNow.value = !changeNow.value;
};

const addrowDefault = ref("");

/**
 *  조회 함수
 */

const searchButton = async () => {
  // if (storeCd.value == "0" || storeCd.value == undefined) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "매장을 선택하세요.",
  //     icon: "warning",
  //     showCancelButton: false,
  //     confirmButtonColor: "#3085d6",
  //     allowOutsideClick: false,
  //   });
  //   return;
  // }

  try {
    store.state.loading = true;
    let res;
    //comsole.log(groupCd.value);
    //comsole.log(storeCd.value);

    let lngoption =
      (cond.value == true ? "1" : "") +
      (cond2.value == true ? "2" : "") +
      (cond3.value == true ? "3" : "");
    res = await getChargerInfo2(
      groupCd.value,
      storeCd.value,
      storeType.value,
      searchoption.value,
      searchword.value,
      cond4.value,
      cond5.value,
      cond6.value,
      lngoption
    );

    // console.log(res);

    rowData.value = res.data.List;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    allRowStates.value = { created: [] };
    editedRowIndexes.value = [];
    detailRowIndex.value = -1;
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
  }
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (JSON.stringify(updateRow.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const states = allRowStates.value || {};
  const dirtyIndex = [
    ...new Set([
      ...(states.created || []),
      ...(states.updated || []),
      ...editedRowIndexes.value,
    ]),
  ];
  let rowsToSave = dirtyIndex
    .map((index) => updateRow.value[index])
    .filter((row) => row != null);
  if (rowsToSave.length === 0 && updateRow.value.length > rowData.value.length) {
    rowsToSave = updateRow.value.slice(rowData.value.length);
  }
  if (rowsToSave.length === 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow1 = rowsToSave.filter(
    (item) =>
      item.lngPosition == null ||
      item.lngPosition === "" ||
      item.lngPosition == "0" ||
      item.lngPosition == 0
  ).length;
  if (validateRow1 > 0) {
    Swal.fire({
      title: "경고",
      text: "매장코드를 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow2 = rowsToSave.filter(
    (item) =>
      item.strChargerName == null || String(item.strChargerName).trim() === ""
  ).length;
  if (validateRow2 > 0) {
    Swal.fire({
      title: "경고",
      text: "사원이름을 입력해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow3 = rowsToSave.filter(
    (item) =>
      item.lngChargerCode == null || String(item.lngChargerCode).trim() === ""
  ).length;
  if (validateRow3 > 0) {
    Swal.fire({
      title: "경고",
      text: "사원 코드를 입력해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow4 = rowsToSave.filter(
    (item) =>
      item.lngClassCode == null ||
      item.lngClassCode === "" ||
      item.lngClassCode == "0" ||
      item.lngClassCode == 0
  ).length;
  if (validateRow4 > 0) {
    Swal.fire({
      title: "경고",
      text: "직책을 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow5 = rowsToSave.filter(
    (item) =>
      item.lngRankCode == null ||
      item.lngRankCode === "" ||
      item.lngRankCode == "0" ||
      item.lngRankCode == 0
  ).length;
  if (validateRow5 > 0) {
    Swal.fire({
      title: "경고",
      text: "직위를 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow6 = rowsToSave.filter(
    (item) =>
      item.lngAreaCode == null ||
      item.lngAreaCode === "" ||
      item.lngAreaCode == "0" ||
      item.lngAreaCode == 0 ||
      isNaN(item.lngAreaCode)
  ).length;
  if (validateRow6 > 0) {
    Swal.fire({
      title: "경고",
      text: "근무장소를 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow7 = rowsToSave.filter(
    (item) =>
      item.blnExpireClass == null ||
      item.blnExpireClass === "" ||
      item.blnExpireClass == undefined
  ).length;
  if (validateRow7 > 0) {
    Swal.fire({
      title: "경고",
      text: "재직구분을 선택해 주십시오.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        //comsole.log(rowsToSave);

        const chargerCode = rowsToSave.map((item) => item.lngChargerCode);
        const chargerName = rowsToSave.map((item) => item.strChargerName);

        const dateHead = (value) =>
          value == null || value === "" ? "" : String(value).split(" ")[0];
        const strIdNo = rowsToSave.map((item) => item.strIdNo);
        const lngClassCode = rowsToSave.map((item) => item.lngClassCode);
        const lngRankCode = rowsToSave.map((item) => item.lngRankCode);
        const lngAreaCode = rowsToSave.map((item) => item.lngAreaCode);
        const dtmJoinDate = rowsToSave.map((item) => dateHead(item.dtmJoinDate));
        const dtmExpireDate = rowsToSave.map((item) =>
          dateHead(item.dtmExpireDate)
        );
        const dtmHealthExpireDate = rowsToSave.map((item) =>
          dateHead(item.dtmHealthExpireDate)
        );
        const dtmBirthDate = rowsToSave.map((item) =>
          dateHead(item.dtmBirthDate)
        );
        const strTelNumber = rowsToSave.map((item) => item.strTelNumber);
        const strZipCode = rowsToSave.map((item) => item.strZipCode);
        const strAddress = rowsToSave.map((item) => item.strAddress);
        const strPassword = rowsToSave.map((item) => item.strPassword);
        const lngBankCode = rowsToSave.map((item) => item.lngBankCode);
        const strBankNumber = rowsToSave.map((item) => item.strBankNumber);
        const blnExpireClass = rowsToSave.map((item) => item.blnExpireClass);
        const strCardNumber = rowsToSave.map((item) => item.strCardNumber);
        const strEmail = rowsToSave.map((item) => item.strEmail);
        const strCPhone = rowsToSave.map((item) => item.strCPhone);
        const blnLuner = rowsToSave.map((item) =>
          item.blnLuner == "True" ? 1 : item.blnLuner == true ? 1 : 0
        );

        const lngPayCode = rowsToSave.map((item) => item.lngPayCode);
        const dtmChangeDate = rowsToSave.map((item) =>
          dateHead(item.dtmChangeDate)
        );
        const lngUserAdminID = rowsToSave.map((item) => item.lngUserAdminID);
        const dtmRetireDate = rowsToSave.map((item) =>
          dateHead(item.dtmRetireDate)
        );
        const lngChangePayCode = rowsToSave.map(
          (item) => item.lngChangePayCode
        );
        const lngStoreGroup = rowsToSave.map((item) => item.lngStoreGroup);
        const lngSequence = rowsToSave.map((item) => item.lngSequence);
        const lngPosition = rowsToSave.map((item) => item.lngPosition);

        const lngWorkClass = rowsToSave.map((item) => item.lngWorkClass);

        const res = await saveEMP2(
          chargerCode.join("\u200b"),
          chargerName.join("\u200b"),
          strIdNo.join("\u200b"),
          lngClassCode.join("\u200b"),
          lngRankCode.join("\u200b"),
          lngAreaCode.join("\u200b"),
          dtmJoinDate.join("\u200b"),
          dtmExpireDate.join("\u200b"),
          dtmHealthExpireDate.join("\u200b"),
          dtmBirthDate.join("\u200b"),
          strTelNumber.join("\u200b"),
          strZipCode.join("\u200b"),
          strAddress.join("\u200b"),
          strPassword.join("\u200b"),
          lngBankCode.join("\u200b"),
          strBankNumber.join("\u200b"),
          blnExpireClass.join("\u200b"),
          strCardNumber.join("\u200b"),
          strEmail.join("\u200b"),
          strCPhone.join("\u200b"),
          lngPosition.join("\u200b"),
          blnLuner.join("\u200b"),
          lngPayCode.join("\u200b"),
          dtmChangeDate.join("\u200b"),
          lngUserAdminID.join("\u200b"),
          dtmRetireDate.join("\u200b"),
          lngChangePayCode.join("\u200b"),
          lngStoreGroup.join("\u200b"),
          lngSequence.join("\u200b"),
          lngWorkClass.join("\u200b")
        );
        ////console.log(res);
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
        await searchButton();
        resetDetailForm();
      } catch (error) {
        Swal.fire({
          title: "저장이 실패되었습니다.",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;
      }
    }
  });
};

const excelNm = ref("");
const storeNm = (e) => {
  excelNm.value = e;
};
const excelButton = () => {
  const a =
    searchoption.value == 0
      ? "전체"
      : searchoption.value == 1
      ? "사원명"
      : "사원번호";
  const b = searchword.value;

  const c =
    "조회옵션 직책 :" +
    (cond.value == true ? "재직" : "") +
    "," +
    (cond2.value == true ? "퇴사" : "") +
    "," +
    (cond3.value == true ? "휴직" : "");
  documentSubTitle.value =
    "매장명 : " + excelNm.value + "\n" + (a + ":" + b) + "\n" + c;
  exporttoExcel.value = !exporttoExcel.value;
};
</script>

<style scoped>
.att01-page {
  position: relative;
  z-index: 1;
  min-height: 0;
  padding-left: 1.25rem;
  padding-right: 0.75rem;
  box-sizing: border-box;
}
.att01-toolbar {
  min-height: 2.5rem;
}
.att01-search-panel {
  --att01-pad-x: 2rem;
  --att01-control-h: 2rem;
  --att01-row-min-h: 2rem;
  --att01-col-gap: 1.5rem;
  --att01-item-gap: 0.75rem;
  --att01-label-col: 6.5rem;
  --att01-control-border: #cbd5e1;
  --att01-control-radius: 0.375rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
}
.att01-search-grid {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--att01-col-gap);
  row-gap: 0.5rem;
  padding-left: var(--att01-pad-x);
  padding-right: var(--att01-pad-x);
}
.att01-cell {
  display: flex;
  align-items: center;
  gap: var(--att01-item-gap);
  min-height: var(--att01-row-min-h);
  min-width: 0;
}
.att01-sg-label {
  flex: 0 0 var(--att01-label-col);
  width: var(--att01-label-col);
  min-height: var(--att01-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: rgb(17 24 39);
}
.att01-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
}
.att01-search-panel .att01-control {
  box-sizing: border-box;
  height: var(--att01-control-h);
  min-height: var(--att01-control-h);
  max-height: var(--att01-control-h);
  width: 100%;
  min-width: 0;
  border: 1px solid var(--att01-control-border);
  border-radius: var(--att01-control-radius);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: #111827;
}
.att01-search-panel .att01-control--kind {
  flex: 0 0 7.5rem;
  width: 7.5rem;
}
.att01-search-panel .att01-control--word {
  flex: 1 1 auto;
  width: auto;
}
.att01-checks {
  gap: 1rem;
}
.att01-check {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: var(--att01-row-min-h);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25rem;
  color: rgb(17 24 39);
  white-space: nowrap;
}
.att01-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  gap: 0.5rem !important;
  align-items: center;
}
.att01-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}
.att01-pick-slot :deep(> .flex > div:has(#storeGroup)),
.att01-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup))) {
  flex: 1 1 0 !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
}
.att01-pick-slot :deep(#storeGroup),
.att01-pick-slot :deep(> .flex > div > select:not(#storeGroup)) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
}
.att01-pick-slot :deep(> .flex > div:has(.pickstore-vs-shell)),
.att01-pick-slot :deep(> .flex > div.relative.min-w-0.flex-1) {
  flex: 1.35 1 0 !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
}
.att01-pick-slot :deep(select),
.att01-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--att01-control-h) !important;
  min-height: var(--att01-control-h) !important;
  max-height: var(--att01-control-h) !important;
  border: 1px solid var(--att01-control-border) !important;
  border-radius: var(--att01-control-radius) !important;
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  box-shadow: none !important;
}
.att01-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
}
.att01-pick-slot :deep(.style-chooser .vs__dropdown-toggle) {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  color: #111827 !important;
}
.att01-pick-slot :deep(.style-chooser .vs__selected),
.att01-pick-slot :deep(.style-chooser .vs__search),
.att01-pick-slot :deep(.style-chooser .vs__search::placeholder) {
  font-size: 0.875rem !important;
  font-weight: 400 !important;
  color: #111827 !important;
}
.att01-pick-slot :deep(.style-chooser .vs__open-indicator) {
  fill: #6b7280 !important;
  transform: scale(0.72) !important;
}
.att01-pick-slot :deep(.style-chooser.vs--open .vs__open-indicator) {
  fill: #6b7280 !important;
  transform: scale(0.72) rotate(180deg) !important;
}
.att01-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #fff;
  border-radius: 0.75rem 0.75rem 0 0;
  box-shadow: 0 2px 8px rgb(15 23 42 / 8%);
  padding: 0.5rem 1rem 0.5rem;
  overflow: hidden;
}
.att01-section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}
.att01-section-title--form {
  margin-top: 0.35rem;
}
.att01-section-title::before {
  content: "";
  flex: 0 0 0.25rem;
  width: 0.25rem;
  height: 1.05em;
  border-radius: 999px;
  background: #2563eb;
}
.att01-grid-wrap {
  position: relative;
  flex: 1 1 0;
  min-height: 7rem;
  overflow: hidden;
  width: 100%;
}
.att01-form-scroll {
  flex: 0 0 auto;
  overflow: visible;
  min-width: 0;
}
.att01-form-grid {
  --att01-label-col: 6.25rem;
  --att01-control-h: 1.375rem;
  --att01-row-h: 1.625rem;
  --att01-font: 0.8125rem;
  display: grid;
  grid-template-columns: repeat(3, var(--att01-label-col) minmax(0, 1fr));
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}
.att01-form-label {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--att01-row-h);
  padding: 0.25rem 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--att01-font);
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}
.att01-form-label--required {
  color: #2563eb;
  font-weight: 700;
}
.att01-form-value {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-height: var(--att01-row-h);
  min-width: 0;
  padding: 0.25rem 0.5rem;
  border: 1px solid #e5e7eb;
  background: #fff;
  gap: 0.35rem;
}
.att01-form-value--split .att01-control {
  flex: 1 1 auto;
}
.att01-control--calendar {
  flex: 0 0 4.5rem;
  width: 4.5rem;
}
.att01-span-3 {
  grid-column: span 3;
}
.att01-control {
  box-sizing: border-box;
  height: var(--att01-control-h);
  min-height: var(--att01-control-h);
  max-height: var(--att01-control-h);
  width: 100%;
  min-width: 0;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  background: #fff;
  padding: 0 0.5rem;
  font-size: var(--att01-font);
}
.att01-control:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}
.att01-secret {
  -webkit-text-security: disc;
}
.att01-control:disabled {
  background: #f3f4f6;
  color: #374151;
}
.att01-zip-btn {
  flex: 0 0 auto;
  height: var(--att01-control-h);
  white-space: nowrap;
}
@media (max-width: 1100px) {
  .att01-form-grid {
    grid-template-columns: var(--att01-label-col) minmax(0, 1fr);
  }
  .att01-span-3 {
    grid-column: span 1;
  }
}
</style>
