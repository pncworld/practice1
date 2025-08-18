<!-- /*--############################################################################
# Filename : CRM20_011INS.vue                                                  
# Description : 마스터관리 > 매출거래처 마스터 > 선수금거래처정보                       
# Date :2025-08-18                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>

      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>

        <button @click="saveButton" class="button save md:w-auto w-14">
          <!-- 여기서부터 -->
          저장
        </button>

        <button @click="excelButton" class="button excel w-auto excel">
          엑셀
        </button>
      </div>
    </div>

    <div
      class="grid grid-cols-1 grid-rows-2 bg-gray-200 rounded-lg h-14 items-start z-10">
      <div
        class="flex justify-start mr-40 items-start text-base font-semibold space-x-10 mt-2">
        <PickCustCompany
          @excelStore="excelStore"
          @lngStoreCode="lngStoreCode"></PickCustCompany>

        <div class="flex items-center">
          <div class="text-base font-semibold">조회조건</div>
          <div class="ml-5 flex items-center">
            <select name="" id="" class="h-8 w-32" v-model="cond">
              <option value="1">거래처명</option>
              <option value="2">카드번호</option>
              <option value="3">휴대전화</option>
            </select>
          </div>
          <div class="ml-5 flex items-center">
            <input type="text" class="h-8 w-64 pl-1" v-model="cond2" />
          </div>
        </div>

        <div class="flex flex-col">
          <label for="cond"
            ><input type="checkbox" id="cond" checked @click="changeCond" />탈퇴
            거래처 제외</label
          >
          <label for="cond2"
            ><input
              type="checkbox"
              id="cond2"
              checked
              @click="changeCond2" />교체/분실 제외</label
          >
        </div>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <div class="w-full h-[24%]">
      <div class="flex justify-end space-x-5">
        <button class="whitebutton" @click="addRow">신규</button>
        <button class="whitebutton" @click="deleteRow">삭제</button>
      </div>
      <Realgrid
        :progname="'CRM20_003INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :reload="reload"
        :setStateBar="true"
        :documentTitle="'CRM20_003INS'"
        :documentSubTitle="documentSubTitle"
        :rowStateeditable="false"
        :showCheckBar="false"
        :checkRenderEditable="false"
        :addRow4="addrow"
        :addrowProp="'strSaleCompCode,strSaleCompName,strSaleCustID,strSaleCustName,strSaleCardNo,strRegistNo,strDirector,strDealType,strDealKind,strTelNo,strTelNo2,strZip,strAddress,strAddress2,strRemark,strEmail,strRegistDate,strSaleCustStatus,strSaleAccStatus,strBelongType,strBelongCustID,strBelongCustName,strCustDeptName,strCustDeptCode,dblLimitAmt,dblRecvAmt,dblSaleAmt,dblRemAmt,strTelNo1Sub1,strTelNo1Sub2,strTelNo1Sub3,strTelNo2Sub1,strTelNo2Sub2,strTelNo2Sub3'"
        :addrowDefault="addrowDefault"
        :deleteRow6="deleterow"
        :labelingColumns="'strSaleCustStatus'"
        :valuesData="[['0', '1']]"
        :labelsData="[['정상', '탈퇴']]"
        :changeNow2="changeNow"
        :changeNow3="changeNow3"
        :changeRow="changeRow"
        :changeColid="changeColid"
        :changeValue2="changeValue2"
        @clickedRowData="clickedRowData"
        @selectedIndex="selectedIndex"
        @updatedRowData="updatedRowData"
        @allStateRows="allStateRows"
        @sendRowState="sendRowState"
        :getRowChanged="getRowChanged"
        :exporttoExcel="exportExcel">
      </Realgrid>
    </div>
    <div class="mt-8">
      <div class="text-sm font-semibold">◎기본정보</div>
      <div
        class="grid grid-rows-[1fr,1fr,1fr,1fr,1fr,1fr,1fr] grid-cols-[1fr,3fr,1fr,3fr] h-[20vh]">
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          거래처코드
        </div>
        <div class="border-l border-t border-black pl-5 items-center flex">
          <input
            type="text"
            class="border border-black disabled:bg-gray-300"
            v-model="gridvalue1"
            disabled />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          <span class="text-red-500">＊</span>거래처명
        </div>
        <div class="border-l border-t border-black pl-5 items-center flex">
          <input
            type="text"
            name="strSaleCustName"
            class="border border-black"
            v-model="gridvalue2"
            @input="changeValue" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          사업자(주민)번호
        </div>
        <div class="border-l border-t border-black pl-5 items-center flex">
          <input
            type="text"
            name="strRegistNo"
            class="border border-black"
            v-model="gridvalue3"
            @input="changeValue" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          대표자명
        </div>
        <div class="border-l border-t border-black pl-5 items-center flex">
          <input
            type="text"
            name="strDirector"
            class="border border-black"
            v-model="gridvalue4"
            @input="changeValue" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          업종
        </div>
        <div class="border-l border-t border-black pl-5 items-center flex">
          <input
            type="text"
            name="strDealType"
            class="border border-black"
            v-model="gridvalue5"
            @input="changeValue" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          업태
        </div>
        <div
          class="border-l border-t border-black pl-5 items-center flex space-x-5">
          <input
            type="text"
            name="strDealKind"
            class="border border-black"
            v-model="gridvalue6"
            @input="changeValue" />
          <div
            class="border-l border-r border-black bg-gray-100 flex justify-center items-center w-44 h-full">
            최초등록일
          </div>
          <div class="border-l border-r border-black items-center flex h-full">
            <input
              type="date"
              name="strRegistDate"
              @input="changeValue"
              class=""
              v-model="gridvalue7" />
          </div>
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          <span class="text-red-500">＊</span>휴대폰번호
        </div>
        <div
          class="border-l border-t border-black pl-5 space-x-5 items-center flex">
          <input
            type="text"
            name="strTelNo1Sub1"
            @input="changeValue"
            class="border border-black w-24 h-[90%]"
            v-model="gridvalue8" />
          <span>-</span>
          <input
            type="text"
            name="strTelNo1Sub2"
            @input="changeValue"
            class="border border-black w-36 h-[90%]"
            v-model="gridvalue9" />
          <span>-</span>
          <input
            type="text"
            name="strTelNo1Sub3"
            @input="changeValue"
            class="border border-black w-36 h-[90%]"
            v-model="gridvalue10" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          <span class="text-red-500">＊</span>거래처상태
        </div>
        <div
          class="border-l border-t border-black pl-5 space-x-5 items-center flex">
          <label for="strSaleCustStatus1"
            ><input
              type="radio"
              name="strSaleCustStatus"
              id="strSaleCustStatus1"
              @input="changeValue"
              v-model="gridvalue11"
              value="0" />정상</label
          >
          <label for="strSaleCustStatus2"
            ><input
              type="radio"
              name="strSaleCustStatus"
              id="strSaleCustStatus2"
              @input="changeValue"
              v-model="gridvalue11"
              value="1" />탈퇴</label
          >
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          전화번호
        </div>
        <div
          class="border-l border-t border-black pl-5 space-x-5 items-center flex">
          <select
            name="strTelNo2Sub1"
            id=""
            @change="changeValue"
            class="border border-black w-24 h-[90%]"
            v-model="gridvalue12">
            <option value="02">02</option>
            <option value="051">051</option>
            <option value="053">053</option>
            <option value="032">032</option>
            <option value="062">062</option>
            <option value="042">042</option>
            <option value="052">052</option>
            <option value="044">044</option>
            <option value="031">031</option>
            <option value="033">033</option>
            <option value="043">043</option>
            <option value="041">041</option>
            <option value="063">063</option>
            <option value="061">061</option>
            <option value="054">054</option>
            <option value="055">055</option>
            <option value="064">064</option>
            <option value="060">060</option>
            <option value="070">070</option>
            <option value="1544">1544</option>
            <option value="1588">1588</option>
          </select>
          <span>-</span>
          <input
            type="number"
            name="strTelNo2Sub2"
            @input="changeValue"
            class="border border-black w-36"
            v-model="gridvalue13" />
          <span>-</span>
          <input
            type="number"
            name="strTelNo2Sub3"
            @input="changeValue"
            class="border border-black w-36"
            v-model="gridvalue14" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          이메일
        </div>
        <div class="border-l border-t border-black pl-5 items-center flex">
          <input
            type="text"
            name="strEmail"
            @input="changeValue"
            class="border border-black"
            v-model="gridvalue15" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          우편번호
        </div>
        <div
          class="border-l border-t border-black pl-5 flex items-center col-span-3">
          <input
            type="text"
            name="strZip"
            @input="changeValue"
            class="border border-black"
            v-model="gridvalue16" />
          <button @click="findZipCode" class="button primary !h-6 ml-5">
            우편번호 찾기
          </button>
        </div>

        <div
          class="border-l border-t border-b border-black bg-gray-100 flex justify-center items-center">
          주소
        </div>
        <div
          class="border-l border-t border-b border-black pl-5 flex items-center col-span-3 space-x-5">
          <input
            type="text"
            name="strAddress"
            @input="changeValue"
            class="border border-black w-[40%] disabled:bg-gray-300 h-[80%]"
            v-model="gridvalue17" />
          <!-- 
          <input
            type="text"
            name="strAddress2"
            @input="changeValue"
            class="border border-black w-40 h-[80%]"
            v-model="gridvalue18" /> -->
        </div>

        <!-- <div class="border-black flex justify-center items-center"></div> -->
        <!-- <div
          class="border-l border-t border-black pl-5 flex col-span-4 items-center"></div> -->
      </div>
    </div>
    <div>
      <div class="text-sm font-semibold">◎계좌정보</div>
      <div class="grid grid-rows-5 grid-cols-[1fr,3fr,1fr,3fr] h-[14vh]">
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          <span class="text-red-500">＊</span>계좌상태
        </div>
        <div
          class="flex space-x-5 border-l border-t border-black justify-start items-center pl-5 col-span-3">
          <label for="cond3"
            ><input
              type="radio"
              id="cond3"
              @change="changeValue"
              name="strSaleAccStatus"
              value="0"
              v-model="gridvalue20" />정상</label
          >
          <label for="cond4"
            ><input
              type="radio"
              id="cond4"
              @change="changeValue"
              name="strSaleAccStatus"
              value="1"
              v-model="gridvalue20" />불가</label
          >
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          <span class="text-red-500">＊</span>소속유형
        </div>
        <div
          class="flex space-x-5 border-l border-t border-black justify-start items-center pl-5">
          <label for="cond5"
            ><input
              type="radio"
              id="cond5"
              @input="changeValue"
              name="strBelongType"
              value="1"
              v-model="gridvalue21" />개인</label
          >
          <label for="cond6"
            ><input
              type="radio"
              id="cond6"
              @input="changeValue"
              name="strBelongType"
              value="2"
              v-model="gridvalue21" />단체</label
          >
          <label for="cond7"
            ><input
              type="radio"
              id="cond7"
              @input="changeValue"
              value="3"
              name="strBelongType"
              v-model="gridvalue21" />단체소속</label
          >
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center h-full">
          소속거래처명
        </div>
        <div
          class="flex space-x-5 pl-5 border-l border-t border-black items-center h-full">
          <input
            type="number"
            name="strBelongCustID"
            class="border border-black disabled:bg-gray-300 h-[80%]"
            :disabled="!currRowState"
            v-model="gridvalue22" />
          <input
            type="text"
            name="strBelongCustName"
            class="border border-black h-[80%]"
            @input="changeValue"
            v-model="gridvalue23" />
          <button
            class="button primary !h-6"
            @click="visible2 = true"
            :disabled="gridvalue21 != '3'">
            조회
          </button>
          <button class="button primary !h-6">초기화</button>
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          부서명
        </div>
        <div class="border-l border-t border-black pl-5 flex items-center">
          <input
            type="text"
            name="strCustDeptName"
            @input="changeValue"
            class="border border-black w-96 h-[80%]"
            v-model="gridvalue24" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          부서코드
        </div>
        <div class="border-l border-t border-black items-center pl-5 flex">
          <input
            type="number"
            name="strCustDeptCode"
            @input="changeValue"
            class="border border-black w-96 h-[80%]"
            v-model="gridvalue25" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          한도금액
        </div>
        <div class="border-l border-t border-black pl-5 flex items-center">
          <input
            type="text"
            name="dblLimitAmt"
            @input="changeValue"
            class="border border-black w-96 h-[80%]"
            v-model="gridvalue26" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          입금금액
        </div>
        <div class="border-l border-t border-black pl-5 flex items-center">
          <input
            type="text"
            class="border border-black w-96 disabled:bg-gray-300 h-[80%]"
            disabled
            v-model="gridvalue27" />
        </div>

        <div
          class="border-l border-t border-b border-black bg-gray-100 flex justify-center items-center">
          매출금액
        </div>
        <div
          class="border-l border-t border-b border-black pl-5 flex items-center">
          <input
            type="text"
            disabled
            class="border border-black w-96 disabled:bg-gray-300 h-[80%]"
            v-model="gridvalue28" />
        </div>

        <div
          class="border-l border-t border-b border-black bg-gray-100 flex justify-center items-center">
          잔여금액
        </div>
        <div
          class="border-l border-t border-b border-black pl-5 flex items-center">
          <input
            type="text"
            class="border border-black w-96 disabled:bg-gray-300 h-[80%]"
            disabled
            v-model="gridvalue29" />
        </div>
      </div>
    </div>
    <div class="flex justify-between w-[40%] mt-3">
      <div class="text-sm font-semibold">◎카드정보</div>
    </div>
    <div class="flex space-x-12">
      <div class="grid grid-rows-3 grid-cols-[1.9fr,5fr] w-[40vw]">
        <div
          class="text-sm bg-gray-100 flex items-center justify-center border-l border-t border-black">
          현재카드번호
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-5 border-l border-t border-black">
          <input
            type="text"
            name="strSaleCardNo"
            class="border border-black h-[80%] disabled:bg-gray-200"
            @input="changeValue3"
            disabled
            v-model="gridvalue30" />
        </div>

        <div
          class="text-sm bg-gray-100 flex items-center justify-center border-l border-t border-black">
          신규카드번호
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-5 border-l border-t border-black">
          <input
            type="text"
            name="NewstrSaleCardNo"
            class="border border-black h-[80%] disabled:bg-gray-200"
            @input="changeValue3"
            :disabled="disableGridValue31"
            v-model="gridvalue32" />
          <button class="button primary !h-5 ml-5" @click="checkDupliCard">
            중복확인
          </button>
          <div class="text-red-500 text-xs">반드시 중복검사를 받으십시오</div>
        </div>

        <div
          class="text-sm bg-gray-100 flex items-center justify-center border-l border-t border-b border-black">
          카드상태
        </div>
        <div
          class="text-base font-semibold flex items-center justify-start pl-5 space-x-5 border-l border-t border-b border-black">
          <label for="cond8"
            ><input
              type="radio"
              name="strSaleCardStatus"
              id="cond8"
              value="0"
              :disabled="currRowState"
              @change="changeValue3"
              v-model="gridvalue31" />정상</label
          >
          <label for="cond9"
            ><input
              type="radio"
              name="strSaleCardStatus"
              id="cond9"
              value="1"
              :disabled="currRowState"
              @change="changeValue3"
              v-model="gridvalue31" />교체</label
          >
          <label for="cond10"
            ><input
              type="radio"
              name="strSaleCardStatus"
              value="2"
              id="cond10"
              :disabled="currRowState"
              @change="changeValue3"
              v-model="gridvalue31" />분실</label
          >
        </div>
      </div>
    </div>
  </div>

  <GetZipCode
    v-if="visible"
    @closePopUp="closePopUp"
    @zipAndAddress="zipAndAddress"></GetZipCode>
  <!-- 탈퇴 거래처 제외
  교체/분실 제외 -->
  <div
    v-if="visible2"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 내용 -->
    <div class="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md h-[30%]">
      <div class="flex">
        <div class="text-sm font-semibold mb-4 flex justify-start items-center">
          소속거래처명
        </div>
        <div>
          <input type="text" class="border border-black" v-model="cond6" />
        </div>
        <div>
          <button class="button primary !h-6" @click="searchButton2">
            조회
          </button>
        </div>
        <div>
          <button class="button primary !h-6" @click="visible2 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="mb-4 flex justify-center flex-col items-center h-[80%]">
        <Realgrid
          :progname="'CRM20_003INS_VUE'"
          :progid="3"
          :rowData="rowData2"
          :rowStateeditable="false"
          @dblclickedRowData="dblclickedRowData">
        </Realgrid>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { deleteSpecialPrices, updateMultiPrice } from "@/api/master";
import {
  checkCardNumbyAccount,
  deleteCustomors3,
  getBelongCust,
  getCardInfo2,
  getCustomorInfo,
  saveCreditCustomer,
  saveCreditCustomer2,
  saveNewCardNo,
} from "@/api/micrm";
import GetZipCode from "@/components/getZipCode.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickCustCompany from "@/components/pickCustCompany.vue";
/**
 * 	매장 단일 선택 컴포넌트
 */
/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import {
  formatLocalDate,
  formatNumberWithCommas,
  insertPageLog,
} from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const rowData3 = ref([]);
const rowData4 = ref([]);
const visible = ref(false);
const visible2 = ref(false);

const closePopUp = () => {
  visible.value = false;
};

const findZipCode = () => {
  visible.value = true;
};
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const afterSearch = ref(false);
const GroupList = ref([]);
const cond = ref("1");
const cond2 = ref("");
const cond3 = ref(true);
const cond4 = ref(true);
const cond5 = ref("0");
const cond6 = ref("");
const cond7 = ref("");

const cond13 = ref("");
const cond14 = ref("0");
const cond15 = ref("0");
const cond16 = ref("2");

const changeCond = () => {
  cond3.value = !cond3.value;
};
const changeCond2 = () => {
  cond4.value = !cond4.value;
};
const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("");
const gridvalue7 = ref("");
const gridvalue8 = ref("");
const gridvalue9 = ref("");
const gridvalue10 = ref("");
const gridvalue11 = ref("");
const gridvalue12 = ref("");
const gridvalue13 = ref("");
const gridvalue14 = ref("");
const gridvalue15 = ref("");
const gridvalue16 = ref("");
const gridvalue17 = ref("");
const gridvalue18 = ref("");
const gridvalue19 = ref("");
const gridvalue20 = ref("");
const gridvalue21 = ref("");
const gridvalue22 = ref("");
const gridvalue23 = ref("");
const gridvalue24 = ref("");
const gridvalue25 = ref("");
const gridvalue26 = ref("");
const gridvalue27 = ref("");
const gridvalue28 = ref("");
const gridvalue29 = ref("");
const gridvalue30 = ref("");
const gridvalue31 = ref("0");
const gridvalue32 = ref("");

const store = useStore();
const MultiSubList = ref([]);
const selectedSubGroup = ref(0);
const MultiGroupList = ref([]);
const selectedMultiGroup = ref(0);

const checkedDatas = ref([]);
const forDeleteDatas = ref([]);

const updateRowData = ref([]);
const strFlags = ref(false);
const updatedRowData = (e) => {
  console.log(e);
  updateRowData.value = e;
};
const disableGridValue31 = ref(true);

const currentCompCd = ref("");
const clickedRowData = async (e) => {
  console.log(e);
  currentCompCd.value = e[0];
  gridvalue1.value = e[2];
  gridvalue2.value = e[3];
  gridvalue3.value = e[5];
  gridvalue4.value = e[6];
  gridvalue5.value = e[7];
  gridvalue6.value = e[8];
  gridvalue7.value = formatLocalDate(e[16]);
  gridvalue8.value = e[28];
  gridvalue9.value = e[29];
  gridvalue10.value = e[30];
  gridvalue11.value = e[17];
  gridvalue12.value = e[31];
  gridvalue13.value = e[32];
  gridvalue14.value = e[33];
  gridvalue15.value = e[15];
  gridvalue16.value = e[11];
  gridvalue17.value = e[12];
  gridvalue18.value = e[13];
  gridvalue19.value = e[14];
  gridvalue20.value = e[18];
  gridvalue21.value = e[19];
  gridvalue22.value = e[20];
  gridvalue23.value = e[21];
  gridvalue24.value = e[22];
  gridvalue25.value = e[23];
  gridvalue26.value = formatNumberWithCommas(e[24]);
  gridvalue27.value = formatNumberWithCommas(e[25]);
  gridvalue28.value = formatNumberWithCommas(e[26]);
  gridvalue29.value = formatNumberWithCommas(e[27]);

  getCardNo(e[0], e[2], e[9]);
};

const getCardNo = async (a, b, c) => {
  try {
    const res = await getCardInfo2(a, b, 2);
    console.log(res);
    rowData2.value = res.data.List;

    if (rowData2.value.length == 0) {
      gridvalue30.value = c;
      gridvalue32.value = c;
      gridvalue31.value = 0;
      disableGridValue31.value = true;
      strFlags.value = false;
    } else {
      gridvalue30.value =
        rowData2.value[rowData2.value.length - 1].strSaleCardNo;
      gridvalue32.value =
        rowData2.value[rowData2.value.length - 1].strSaleCardNo;
      gridvalue31.value =
        rowData2.value[rowData2.value.length - 1].strSaleCardStatus;
      disableGridValue31.value = gridvalue31.value == 0 ? true : false;
      strFlags.value = true;
    }

    // changeColid.value = "strSaleCardNo";
    // changeValue2.value = gridvalue30.value;
    // changeNow.value = !changeNow.value;

    // await nextTick();

    // changeColid.value = "strSaleCardStatus";
    // changeValue2.value = gridvalue31.value;
    // changeNow.value = !changeNow.value;

    // await nextTick();
  } catch (error) {}
};

const zipAndAddress = async (e) => {
  // console.log(e);
  gridvalue16.value = e.split(",")[0];
  gridvalue17.value = e.split(",")[1];

  changeColid.value = "strZip";
  changeValue2.value = gridvalue16.value;

  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strAddress";
  changeValue2.value = gridvalue17.value;

  changeNow.value = !changeNow.value;

  await nextTick();
};
const selectedIndex = (e) => {
  changeRow.value = e;
};

const changeRow2 = ref("");
const selectedIndex2 = (e) => {
  changeRow2.value = e;
};
const getRowChanged = ref(false);
const updatedRows = ref([]);
const allStateRows = (e) => {
  updatedRows.value = e;
  console.log(e);
};

const currRowState = ref(false);
const sendRowState = (e) => {
  if (e == "created") {
    currRowState.value = true;
  } else {
    currRowState.value = false;
  }
};

const changeNow = ref(false);
const changeValue2 = ref("");
const changeColid = ref("");
const changeRow = ref(0);

const enddate = ref("");

const changeValue = async (e) => {
  const name = e.target.name;
  const value = e.target.value;

  if (name == "strTelNo1Sub1") {
    gridvalue8.value = e.target.value.replace(/[^0-9]/g, "");
  }
  if (name == "strTelNo1Sub2") {
    gridvalue9.value = e.target.value.replace(/[^0-9]/g, "");
  }
  if (name == "strTelNo1Sub3") {
    gridvalue10.value = e.target.value.replace(/[^0-9]/g, "");
  }
  if (name == "dblLimitAmt") {
    let temp = e.target.value.replaceAll(",", "");
    gridvalue26.value = formatNumberWithCommas(
      e.target.value.replace(/[^0-9]/g, "")
    );

    changeColid.value = name;
    changeValue2.value = temp;

    changeNow.value = !changeNow.value;

    await nextTick();
    return;
  }

  if (name == "strZip") {
    gridvalue16.value = e.target.value.replace(/[^0-9]/g, "");
  }

  // if (name == "strTelNo2Sub1") {
  //   gridvalue12.value = e.target.value.replace(/[^0-9]/g, "");
  // }
  if (name == "strTelNo2Sub2") {
    gridvalue13.value = e.target.value.replace(/[^0-9]/g, "");
  }
  if (name == "strTelNo2Sub3") {
    gridvalue14.value = e.target.value.replace(/[^0-9]/g, "");
  }

  changeColid.value = name;
  changeValue2.value = value;

  changeNow.value = !changeNow.value;

  await nextTick();

  if (name.includes("strTelNo1Sub")) {
    changeColid.value = "strTelNo";
    changeValue2.value =
      gridvalue8.value + "-" + gridvalue9.value + "-" + gridvalue10.value;

    changeNow.value = !changeNow.value;

    await nextTick();
  }

  if (name.includes("strTelNo2Sub")) {
    changeColid.value = "strTelNo2";

    changeValue2.value =
      gridvalue12.value + "-" + gridvalue13.value + "-" + gridvalue14.value;

    changeNow.value = !changeNow.value;

    await nextTick();
  }
};
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const openPopUp = ref(false);

const addButton = () => {
  openPopUp.value = !openPopUp.value;
};

/**
 *  조회 함수
 */

const searchButton = async () => {
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    // initGrid();

    const res = await getCustomorInfo(
      selectedStores.value,
      cond.value,
      cond2.value,
      2,
      cond3.value ? 1 : 0,
      cond4.value ? 1 : 0
    );
    //console.log(res);
    rowData.value = res.data.List;
    updateRowData.value = JSON.parse(JSON.stringify(res.data.List));
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const searchButton2 = async () => {
  if (selectedStores.value == 0) {
    Swal.fire({
      title: "경고",
      text: "매장명을 먼저 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    // initGrid();

    const res = await getBelongCust(selectedStores.value, cond6.value, 2);
    //console.log(res);
    rowData2.value = res.data.List;

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const dblclickedRowData = async (e) => {
  //console.log(e);
  gridvalue23.value = e[2];
  gridvalue22.value = e[1];

  changeColid.value = "strBelongCustID";
  changeValue2.value = gridvalue22.value;

  changeNow.value = !changeNow.value;

  await nextTick();

  changeColid.value = "strBelongCustName";
  changeValue2.value = gridvalue23.value;

  changeNow.value = !changeNow.value;

  await nextTick();

  visible2.value = false;
};
const checkCardNum = ref(false);
const checkDupliCard = async () => {
  try {
    const res = await checkCardNumbyAccount(
      selectedStores.value,
      2,
      gridvalue32.value
    );

    if (res.data.List[0].CNT == 0) {
      checkCardNum.value = true;

      Swal.fire({
        title: "성공",
        text: "사용가능한 카드번호입니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      checkCardNum.value = false;

      Swal.fire({
        title: "실패",
        text: "이미 사용중인 카드번호입니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {}
};

const changeColid2 = ref("");
const changeValue4 = ref("");
const changeNow2 = ref(false);
const changeNow3 = ref(false);
const changeValue3 = (e) => {
  const name = e.target.name;
  const value = e.target.value;

  // if (name == "strSaleCardNo") {
  //   // checkCardNum.value = false;
  //   // changeColid.value = name;
  //   // changeValue2.value = value;
  //   // changeNow3.value = !changeNow3.value;

  //   return;
  // }

  if (name == "strSaleCardStatus" && e.target.value != 0) {
    disableGridValue31.value = false;
  } else if (name == "strSaleCardStatus" && e.target.value == 0) {
    disableGridValue31.value = true;
  }

  changeColid.value = name;
  changeValue2.value = value;
  changeNow.value = !changeNow.value;
};

const saveButton = async (e) => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  console.log(updatedRows.value);
  const iulength =
    updatedRows.value.created.length +
    updatedRows.value.updated.length +
    updatedRows.value.deleted.length;
  if (iulength == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const filterMust = updateRowData.value.filter(
    (item) =>
      item.strSaleCustName === "" ||
      item.strSaleCustName === undefined ||
      item.strTelNo === "" ||
      item.strTelNo === undefined ||
      item.strTelNo1Sub1 === "" ||
      item.strTelNo1Sub1 === undefined ||
      item.strTelNo1Sub2 === "" ||
      item.strTelNo1Sub2 === undefined ||
      item.strTelNo1Sub3 === "" ||
      item.strTelNo1Sub3 === undefined ||
      item.strSaleCustStatus === "" ||
      item.strSaleCustStatus === undefined ||
      item.strSaleAccStatus === "" ||
      item.strSaleAccStatus === undefined
  );

  if (filterMust.length > 0) {
    Swal.fire({
      title: "경고",
      text: "미입력된 필수값이 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  if (checkCardNum.value == false && gridvalue32.value !== gridvalue30.value) {
    Swal.fire({
      title: "경고",
      text: "변경하시려는 신규카드번호의 중복체크를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });

    return;
  }

  try {
    store.state.loading = true;

    console.log(updateRowData.value);
    if (updatedRows.value.deleted.length > 0) {
      console.log(updatedRows.value.deleted);
      const compcodes = updateRowData.value
        .filter((item, index) => updatedRows.value.deleted.includes(index))
        .map((item) => item.strSaleCompCode)
        .join("\u200b");

      const custids = updateRowData.value
        .filter((item, index) => updatedRows.value.deleted.includes(index))
        .map((item) => item.strSaleCustID)
        .join("\u200b");

      try {
        const res = await deleteCustomors3(compcodes, custids, 2);

        console.log(res);
      } catch (error) {}
    }

    if (updatedRows.value.updated.length > 0) {
      try {
        const id = store.state.userData.lngSequence;
        const flag = "U";

        const saleCompCodes = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strSaleCompCode)
          .join("\u200b");

        const saleCustIds = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strSaleCustID)
          .join("\u200b");

        const saleCustNames = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strSaleCustName)
          .join("\u200b");

        const registNos = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strRegistNo)
          .join("\u200b");

        const telNos = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strTelNo)
          .join("\u200b");

        const telNos2 = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strTelNo2)
          .join("\u200b");

        const postTelNo = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strTelNo1Sub3)
          .join("\u200b");

        const emails = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strEmail)
          .join("\u200b");

        const strZips = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strZip)
          .join("\u200b");

        const address = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strAddress)
          .join("\u200b");

        const address2 = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strAddress2)
          .join("\u200b");

        const remarks = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strRemark)
          .join("\u200b");

        const strRegistDates = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => formatLocalDate(item.strRegistDate))
          .join("\u200b");

        const saleCustStatus = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strSaleCustStatus)
          .join("\u200b");

        const directors = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strDirector)
          .join("\u200b");

        const dealtypes = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strDealType)
          .join("\u200b");

        const dealkinds = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strDealKind)
          .join("\u200b");

        const saleAccStatus = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strSaleAccStatus)
          .join("\u200b");

        const custDeptCodes = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strCustDeptCode)
          .join("\u200b");

        const custDeptNames = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strCustDeptName)
          .join("\u200b");

        const belongTypes = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strBelongType)
          .join("\u200b");

        const belongCustids = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strBelongCustID)
          .join("\u200b");

        const belongCustNames = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.strBelongCustName)
          .join("\u200b");

        const limitAmts = updateRowData.value
          .filter((item, index) => updatedRows.value.updated.includes(index))
          .map((item) => item.dblLimitAmt)
          .join("\u200b");

        const res = await saveCreditCustomer2(
          id,
          flag,
          saleCompCodes,
          saleCustIds,
          saleCustNames,
          registNos,
          telNos,
          telNos2,
          postTelNo,
          emails,
          strZips,
          address,
          address2,
          remarks,
          strRegistDates,
          saleCustStatus,
          directors,
          dealtypes,
          dealkinds,
          saleAccStatus,
          custDeptCodes,
          custDeptNames,
          belongTypes,
          belongCustids,
          belongCustNames,
          limitAmts
        );

        console.log(res);
      } catch (error) {}
    }

    if (updatedRows.value.created.length > 0) {
      try {
        const id = store.state.userData.lngSequence;
        const flag = "N";

        const saleCompCodes = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strSaleCompCode)
          .join("\u200b");

        const saleCustIds = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strSaleCustID)
          .join("\u200b");

        const saleCustNames = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strSaleCustName)
          .join("\u200b");

        const registNos = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strRegistNo)
          .join("\u200b");

        const telNos = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strTelNo)
          .join("\u200b");

        const telNos2 = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strTelNo2)
          .join("\u200b");

        const postTelNo = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strTelNo1Sub3)
          .join("\u200b");

        const emails = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strEmail)
          .join("\u200b");

        const strZips = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strZip)
          .join("\u200b");

        const address = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strAddress)
          .join("\u200b");

        const address2 = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strAddress2)
          .join("\u200b");

        const remarks = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strRemark)
          .join("\u200b");

        const strRegistDates = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => formatLocalDate(item.strRegistDate))
          .join("\u200b");

        const saleCustStatus = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strSaleCustStatus)
          .join("\u200b");

        const directors = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strDirector)
          .join("\u200b");

        const dealtypes = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strDealType)
          .join("\u200b");

        const dealkinds = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strDealKind)
          .join("\u200b");

        const saleAccStatus = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strSaleAccStatus)
          .join("\u200b");

        const custDeptCodes = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strCustDeptCode)
          .join("\u200b");

        const custDeptNames = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strCustDeptName)
          .join("\u200b");

        const belongTypes = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strBelongType)
          .join("\u200b");

        const belongCustids = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strBelongCustID)
          .join("\u200b");

        const belongCustNames = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.strBelongCustName)
          .join("\u200b");

        const limitAmts = updateRowData.value
          .filter((item, index) => updatedRows.value.created.includes(index))
          .map((item) => item.dblLimitAmt)
          .join("\u200b");

        const res = await saveCreditCustomer2(
          id,
          flag,
          saleCompCodes,
          saleCustIds,
          saleCustNames,
          registNos,
          telNos,
          telNos2,
          postTelNo,
          emails,
          strZips,
          address,
          address2,
          remarks,
          strRegistDates,
          saleCustStatus,
          directors,
          dealtypes,
          dealkinds,
          saleAccStatus,
          custDeptCodes,
          custDeptNames,
          belongTypes,
          belongCustids,
          belongCustNames,
          limitAmts
        );

        console.log(res);
      } catch (error) {}
    }
    console.log(gridvalue31.value);
    if (gridvalue30.value !== gridvalue32.value) {
      const res = await saveNewCardNo(
        currentCompCd.value,
        gridvalue1.value,
        2,
        gridvalue32.value,
        gridvalue31.value,
        store.state.userData.lngSequence,
        "N"
      );

      console.log(res);
    } else if (gridvalue30.value == gridvalue32.value) {
      const res = await saveNewCardNo(
        currentCompCd.value,
        gridvalue1.value,
        2,
        gridvalue30.value,
        gridvalue31.value,
        store.state.userData.lngSequence,
        "U"
      );

      console.log(res);
    }

    Swal.fire({
      title: "성공",
      text: "저장하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });

    store.state.loading = false;
  } catch (error) {
    //console.log(error);
  } finally {
    store.state.loading = false;
    searchButton();
  }
};

/* 매장 컴포넌트 관련 함수 */
const selectedGroup = ref();
const selectedStores = ref();
const selectedStore = ref(0);
const selectedStoreAttrs = ref();

/**
 * 페이지 매장 코드 세팅
 */

const lngStoreCode = async (e) => {
  initGrid();
  selectedStores.value = e;
  console.log(e);
};
const lngStoreGroup = async (e) => {
  //initGrid();
  selectedGroup.value = e;
  //console.log(e);
};

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  cond.value = 1;
};

watch([selectedSubGroup, selectedMultiGroup, selectedStore], () => {
  initGrid();
});

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    selectedExcelStore.value +
    "\n" +
    "조회조건 : " +
    (cond.value == 1 ? "거래처명" : cond.value == 2 ? "카드번호" : "휴대전화") +
    " / ";
  cond2.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");
const selectedExcelDate = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};

const addrow = ref(false);

const addrowDefault = ref("");
const addRow = () => {
  addrowDefault.value =
    selectedStores.value +
    ",,XXXXXX,,,,,,,,,,,,,," +
    formatLocalDate(new Date()) +
    ",0,0,1,,,,,0,0,0,0,,,,,,";
  addrow.value = !addrow.value;
};

const deleterow = ref(false);
const deleteRow = () => {
  deleterow.value = !deleterow.value;
};

// watch(selectedStores, async () => {
//   //const userGroup = store.state.storeGroup[0].lngStoreGroup;
//   const res4 = await getSubGroup2(selectedGroup.value, selectedStores.value);

//   MultiSubList.value = res4.data.List;
// });
</script>
