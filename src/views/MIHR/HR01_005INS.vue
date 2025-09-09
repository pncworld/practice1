<!-- /*--############################################################################
# Filename : HR01_005INS.vue                                                    
# Description : 인사관리 > 마스터 관리 > 근무계약 등록.                        
# Date :2025-06-11                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-[80%]">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-10 space-x-2 pr-5">
        <button @click="searchButton2" class="button search w-44">미등록 직원조회</button>
        <button @click="searchButton" class="button search">조회</button>
        <button @click="addButton" class="button new">신규</button>
        <!-- <button @click="saveButton" class="button save">저장</button> -->
        <button @click="deleteButton" class="button delete">삭제</button>
        <button @click="excelButton" class="button excel">엑셀</button>
      </div>
    </div>
    <div
      class="flex flex-col justify-start space-x-5 bg-gray-200 rounded-lg h-28 items-start pt-2">
      <div class="flex ml-12">
        <div>
          <PickStoreRenew
            @lngStoreGroup="handleGroupCd"
            @lngStoreCode="handleStoreCd"
            @lngStoreAttrs="handleStoreType"
            :defaultStoreNm="'전체'"
            @storeNm="storeNm"
            @update:ischanged="handleinitAll">
          </PickStoreRenew>
        </div>
        <div class="flex justify-center items-center ml-20">
          <div class="flex items-center justify-center space-x-5">
            <div class="text-base font-semibold">구분</div>
            <select
              name=""
              id=""
              class="w-20 h-10 ml-2 rounded-lg"
              v-model="selectedOption">
              <option value="0">전체</option>
              <option :value="i.lngCode" v-for="i in optionList">
                {{ i.strStndName }}
              </option>
            </select>
          </div>
          <div class="flex items-center justify-center space-x-3 pl-10">
            <div class="text-base font-semibold ml-10">검색</div>
            <select
              name=""
              id=""
              class="w-20 h-10 rounded-lg"
              v-model="searchoption">
              <option value="0">전체</option>
              <option value="1">사원명</option>
              <option value="2">사원코드</option>
            </select>
            <input
              type="text"
              v-model="searchword"
              class="w-72 h-10 pl-1 rounded-lg" />
          </div>
        </div>
      </div>
      <div class="flex mt-2 space-x-10 items-center !ml-12">
        <div class="text-base font-semibold">조회옵션</div>
        <div>
          <label for="cond" class="text-sm"
            ><input type="checkbox" id="cond" v-model="cond" />재직</label
          >
        </div>
        <div>
          <label for="cond2"
            ><input type="checkbox" id="cond2" v-model="cond2" />퇴사</label
          >
        </div>
        <div>
          <label for="cond3"
            ><input type="checkbox" id="cond3" v-model="cond3" />휴직</label
          >
        </div>

        <div class="flex pl-44 -mt-2 items-center">
          <input type="checkbox" v-model="disableAll" />
          <Datepicker2
            class="pl-2"
            :mainName="'기간'"
            @endDate="endDate"
            @startDate="startDate"
            :disableAll="disableAll"></Datepicker2>
        </div>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!-- 그리드 영역-->
    <div class="flex h-[70vh] w-full justify-center mt-1">
      <div class="w-full h-full">
        <Realgrid
          :progname="'HR01_005INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :setStateBar="false"
          :checkRowAuto="false"
          @clickedRowData="clickedRowData"
          @dblclickedRowData="dblclickedRowData"
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
          :documentTitle="'HR01_005INS'"
          @selectedIndex="selectedIndex"
          :rowStateeditable="false"
          :checkRenderEditable="true"
          @sendRowState="sendRowState"
          @allStateRows="allStateRows"
          :checkRowAuto2="true"
          :checkRowAuto2Col="'checkbox'"
          :addField="'new'"></Realgrid>
      </div>

      <!-- 그리드 영역-->
      <!-- 연동 데이터 영역-->
    </div>
  </div>

  <div
    v-if="open"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-[50vw] h-[80vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">근무 계약 등록(신규/수정)</h2>
        <div class="flex justify-end space-x-4">
          <button class="whitebutton" @click="addButton2">추가</button>
          <button class="whitebutton" @click="deleteButton2">삭제</button>
          <button @click="saveButton" class="whitebutton">저장</button>
          <button @click="open = false" class="whitebutton">닫기</button>
        </div>
      </div>
      <div class="w-full h-[60%]">
        <div class="grid grid-rows-5 grid-cols-[1fr,2fr,1fr,2fr] h-[20vh]">
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            사원
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
            type="text"
              @click="selectEMP"
              :disabled="disabled"
              :value="gridvalue1"
              class="border border-black w-[80%] h-[80%] disabled:bg-gray-300">
          </input>
        </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            급여기준
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <select
              name=""
              id=""
              disabled
              class="border border-black w-[80%] h-[80%] disabled:bg-gray-300"
              v-model="gridvalue2">
              <option :value="i.lngCode" v-for="i in optionList3">
                {{ i.strStndName }}
              </option>
            </select>
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            계약 시작일/종료일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="date"
              :disabled="disabled"
              class="border border-black w-[38%] h-[80%] disabled:bg-gray-300"
              v-model="gridvalue3" />
            <span class="text-3xl">/</span>
            <input
              type="date"
              class="border border-black w-[38%] h-[80%]"
              v-model="gridvalue4" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            계약일
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center">
            <input
              type="date"
              class="border border-black w-[80%] h-[80%]"
              v-model="gridvalue5" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            급여/시급
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-center items-center space-x-1">
            <input
              type="text"
              disabled
              class="border border-black w-[39%] h-[80%] disabled:bg-gray-300"
              v-model="gridvalue6" />
            <input
              type="number"
              class="border border-black w-[39%] h-[80%]"
              v-model="gridvalue7" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            주휴수당 포함여부
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-start pl-8 items-center">
            <input type="checkbox" v-model="gridvalue8" />
          </div>
          <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            소정근무시간 주/월
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-start pl-8 items-center space-x-1 col-span-3">
            <input
              type="text"
              class="border border-black w-[10%] h-[80%] disabled:bg-gray-300"
              disabled
              v-model="gridvalue9" />
            <input
              type="text"
              class="border border-black w-[10%] h-[80%] disabled:bg-gray-300"
              disabled
              v-model="gridvalue10" />
          </div>
          <!-- <div
            class="bg-gray-100 border-l border-t border-gray-600 flex justify-center items-center">
            근로계약서 첨부
          </div>
          <div
            class="border-l border-t border-gray-600 flex justify-start pl-8 items-center col-span-3">
            <input
              type="text"
              disabled
              class="border border-black h-[80%] w-[50%]"
              v-model="gridvalue47" />
            <input
              type="file"
              class="border border-black w-[70%] h-[90%]"
              hidden />
            <div class="flex space-x-2">
              <button class="whitebutton">파일선택</button>
              <button class="whitebutton">파일삭제</button>
            </div>
          </div> -->
          <div
            class="bg-gray-100 border-l border-t border-b border-gray-600 flex justify-center items-center">
            비고
          </div>
          <div
            class="border-l border-t border-b border-gray-600 flex justify-start pl-8 items-center col-span-3">
            <input
              type="text"
              class="border border-black w-[80%] h-[80%]"
              v-model="gridvalue11" />
          </div>
        </div>
        <div class="text-xl font-semibold mt-5">계약 스케쥴 등록</div>
        <div
          class="grid grid-rows-7 grid-cols-[2fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,3fr] h-[25vh] w-[95%] min-w-0">
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            요일
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            월
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            화
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            수
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            목
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            금
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            토
          </div>
          <div
            class="border-l border-t border-r border-black justify-center flex items-center">
            일
          </div>
          <div class="row-span-7 h-[164%] ml-1">
            <Realgrid
              :progname="'HR01_005INS_VUE'"
              :progid="2"
              :useAlternateRowStyle="false"
              :mergeColumns2="true"
              :setCellStyleColId="['workTime', 'workTime2']"
              :mergeColumnGroupSubList2="[['workTime', 'workTime2']]"
              :mergeColumnGroupName2="['근무여부']"
              :hideChildHeader="true"
              :setStateBar="false"
              :rowStateeditable="false"
              :setRowIndicator="false"
              :rowData="rowData2"></Realgrid>
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            근로일
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue12"
              name="gridvalue12"
              value="true" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue13"
              value="true"
              name="gridvalue13" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue14"
              value="true"
              name="gridvalue14" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue15"
              value="true"
              name="gridvalue15" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue16"
              value="true"
              name="gridvalue16" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue17"
              value="true"
              name="gridvalue17" />
          </div>
          <div
            class="border-l border-t border-r border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue18"
              value="true"
              name="gridvalue18" />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            주휴일
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue12"
              name="gridvalue12"
              value="false" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue13"
              value="false"
              name="gridvalue13" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue14"
              value="false"
              name="gridvalue14" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue15"
              value="false"
              name="gridvalue15" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue16"
              value="false"
              name="gridvalue16" />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue17"
              value="false"
              name="gridvalue17" />
          </div>
          <div
            class="border-l border-t border-r border-black justify-center flex items-center">
            <input
              type="radio"
              v-model="gridvalue18"
              value="false"
              name="gridvalue18" />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            근로시간
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue26"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue27"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue28"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue29"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue30"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue31"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-r border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue32"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            출근시간
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue33"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue34"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue35"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue36"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue37"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue38"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-r border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue39"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black bg-gray-200 justify-center flex items-center">
            퇴근시간
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue40"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue41"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue42"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue43"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue44"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue45"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>
          <div
            class="border-l border-t border-r border-black justify-center flex items-center">
            <input
              type="text"
              min="0"
              v-model="gridvalue46"
              class="w-[80%] border border-black disabled:bg-white"
              disabled />
          </div>

          <div
            class="border-l border-t border-r border-black bg-gray-200 justify-center flex items-center">
            상세보기
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton" @click="setRowData3(2)">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton" @click="setRowData3(3)">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton" @click="setRowData3(4)">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton" @click="setRowData3(5)">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton" @click="setRowData3(6)">확인</button>
          </div>
          <div
            class="border-l border-t border-black justify-center flex items-center">
            <button class="whitebutton" @click="setRowData3(7)">확인</button>
          </div>
          <div
            class="border-l border-t border-r border-black justify-center flex items-center">
            <button class="whitebutton" @click="setRowData3(1)">확인</button>
          </div>
        </div>
        <div class="w-[71%] h-[16vh]">
          <Realgrid
            :progname="'HR01_005INS_VUE'"
            :progid="3"
            :setStateBar="false"
            :setRowIndicator="false"
            :rowStateeditable="false"
            :addRow5="addRow5"
            :addrowProp="addrowProp"
            :addrowDefault="addrowDefault"
            :editableColId="'lngAtndType,strSTime,strETime'"
         
            :labelingColumns="'lngAtndType'"
            :CalculateTimeColId="'strWTime'"
            @updatedRowData="updatedRowData2"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            :valuesData="valuesData"
            :labelsData="labelsData"
            :rowData="rowData3"></Realgrid>
        </div>
      </div>
    </div>
  </div>

  <EmployeePopUp2
    v-if="openPopUp"
    @updateOpen="updateOpen"
    @empType="empType"
    @empName="empName"
    @empId="empId"
    @empSalType="empSalType"
    @storeCd="storeCd2"
    @groupCd="groupCd2"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"></EmployeePopUp2>
  <!-- 연동 데이터 영역-->


   <div v-if="openSearchPopUp" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="w-[50%] h-[70%] border border-black bg-white rounded-lg shadow-lg p-2">
      <div class="flex justify-between space-x-5">
        <div class="font-semibold text-xl">
          근무계약 미등록 고객조회
        </div>
        <div class="flex space-x-5">
        <div><button class="whitebutton" @click="searchButton3">조회</button></div>
        <div><button class="whitebutton" @click="excelButton3">엑셀</button></div>
        <div><button class="whitebutton" @click="openSearchPopUp = false">닫기</button></div>
        </div>
      </div>
      <div class="flex justify-start space-x-5 -ml-12">
        <PickStore :defaultStoreNm="'전체'" :defaultStore="true" @update:storeGroup="lngStoreGroup3" @update:storeCd="lngStoreCode3"></PickStore>
        <div class="flex space-x-5 items-center mt-2">
          <div class="text-base font-semibold">계약 시작일</div>
          <div>
            <input type="date" class="border border-black w-48 h-8" v-model="scond">
          </div>
        </div>
      </div>
      <div class="flex space-x-5 mt-3 items-center">
        <div class="text-base font-semibold">사원검색</div>
        <div><select name="" id="" class="border border-black w-30 h-8"  v-model="scond2">
          <option value="0">전체</option>
          <option value="1">사원명</option>
          <option value="2">사원코드</option>
        </select></div>
        <div>
          <input type="text" class="h-8 w-48 border border-black"  v-model="scond3">
        </div>
      </div>
      <div class="h-[80%] mt-2">
        <Realgrid :progname="'HR01_005INS_VUE'" :rowData="rowData4" :setStateBar="false" :rowStateeditable="false" :exporttoExcel="exportExcel3" :documentTitle="'HR01_005INS'" :documentSubTitle="documentSubTitle3"
            :progid="5" :mergeColumns2="true" :mergeColumnGroupName2="['최종 근무계약일']" :mergeColumnGroupSubList2="[['dtmConStartDate','dtmConEndDate']]" ></Realgrid>
      </div>
    </div>
   </div>
</template>

<script setup>
import {
  deleteEmpContract,
  getEmpContractList,
  getInitEmpContractInfo,
  getUnContractEmpList,
  getWorkContractDetail,
  saveEmpContract,
} from "@/api/mihr";
import Datepicker2 from "@/components/Datepicker2.vue";
import EmployeePopUp2 from "@/components/employeePopUp2.vue";
/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
/**
 * 매장 공통 컴포넌트
 */

import PickStoreRenew from "@/components/pickStoreRenew.vue";

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

const disabled = ref(true);
const selectEMP = () => {
  openPopUp.value = true;
  //console.log("왓음");
};
const openPopUp = ref(false);
const disableAll = ref(true);
const store = useStore();
const dataList = ref([]);
const dataList2 = ref([]);
const dataList3 = ref([]);
const dataList4 = ref([]);
const dataList5 = ref([]);

const gridvalue1 = ref("");
const gridvalue2 = ref("");
const gridvalue3 = ref("");
const gridvalue4 = ref("");
const gridvalue5 = ref("");
const gridvalue6 = ref("0");
const gridvalue7 = ref("0");
const gridvalue8 = ref(false);
const gridvalue9 = ref("");
const gridvalue10 = ref("");
const gridvalue11 = ref("");
const gridvalue12 = ref(true);
const gridvalue13 = ref(true);
const gridvalue14 = ref(true);
const gridvalue15 = ref(true);
const gridvalue16 = ref(true);
const gridvalue17 = ref(true);
const gridvalue18 = ref(true);
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
const gridvalue31 = ref("");
const gridvalue32 = ref("");
const gridvalue33 = ref("");
const gridvalue34 = ref("");
const gridvalue35 = ref("");
const gridvalue36 = ref("");
const gridvalue37 = ref("");
const gridvalue38 = ref("");
const gridvalue39 = ref("");
const gridvalue40 = ref("");
const gridvalue41 = ref("");
const gridvalue42 = ref("");
const gridvalue43 = ref("");
const gridvalue44 = ref("");
const gridvalue45 = ref("");
const gridvalue46 = ref("");
const gridvalue47 = ref("");

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
    changeColid.value = "strAddress";
    changeValue2.value = e;
    changeNow.value = !changeNow.value;
  }, 10);
};

const zipCode2 = async (e) => {
  gridvalue14.value = e;
  setTimeout(() => {
    changeColid.value = "strZipCode";
    changeValue2.value = e;
    changeNow.value = !changeNow.value;
  }, 10);
};

const selectedOption = ref(0);
const searchoption = ref(0);
const searchword = ref("");

const cond = ref(true);
const cond2 = ref(false);
const cond3 = ref(false);
const EndDate = ref("");
const StartDate = ref("");
const endDate = (e) => {
  EndDate.value = e;
};
const startDate = (e) => {
  StartDate.value = e;
};

const optionList2 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitEmpContractInfo(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;
  optionList2.value = res.data.List2;
  optionList3.value = res.data.List3;
  labelsData.value = [optionList2.value.map((item) => item.strDName)];
  valuesData.value = [optionList2.value.map((item) => item.strDCode)];

  ////console.log(res);
  const today = new Date()
  today.setDate(1)
  scond.value = formatLocalDate(today)
  rowData2.value = Array.from({ length: 17 }, (_, i) => {
    const hour = String(i + 8).padStart(2, "0"); // 08 ~ 24
    return {
      strTime: `${hour}:00`,
      workTime: "",
      workTime2: "",
    };
  });
});
const rowData = ref([]);
const labelsData = ref([]);
const valuesData = ref([]);
const groupCd = ref();
const storeCd = ref();
const afterSearch = ref(false);
const exporttoExcel = ref(false);
const documentSubTitle = ref("");
const isNewRow = ref(true);
/**
 * 추가 버튼 함수
 */
const optionList = ref([]);
const optionList3 = ref([]);
const addRow = ref(false);
const changeNow = ref(false);
const changeValue2 = ref();
const changeColid = ref();
const changeRow = ref();

const sendRowState = (e) => {
  if (e == "created") {
    isNewRow.value = false;
  } else {
    isNewRow.value = true;
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
  changeRow.value = newValue;
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
  // isNewRow.value = false;
  // const newCode =
  //   Math.max(0, ...updateRow.value.map((item) => item.lngChargerCode)) + 1;
  // const storeNm = store.state.userData.strStoreName;
  // // /////console.log(storeNm);
  // addrowDefault.value =
  //   groupCd.value +
  //   "," +
  //   store.state.userData.lngPosition +
  //   "," +
  //   storeNm +
  //   "," +
  //   newCode +
  //   ", ,,,,,,,,재직,,,, , , , , ,,0,0,0, ,0,0,0,0,,,,,,0,0,0";
  // addRow.value = !addRow.value;
  initGrid2();
  gridvalue3.value = formatLocalDate(new Date())
  gridvalue4.value = formatLocalDate(new Date())
  gridvalue5.value = formatLocalDate(new Date())
  disabled.value = false;
  updateOrInsert.value = true
  open.value = true;
};

const initGrid2 = () => {
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "0";
  gridvalue7.value = "0";
  gridvalue8.value = false;
  gridvalue9.value = "";
  gridvalue10.value = "";
  gridvalue11.value = "";
  gridvalue12.value = true;
  gridvalue13.value = true;
  gridvalue14.value = true;
  gridvalue15.value = true;
  gridvalue16.value = true;
  gridvalue17.value = true;
  gridvalue18.value = true;
  gridvalue19.value = "";
  gridvalue20.value = "";
  gridvalue21.value = "";
  gridvalue22.value = "";
  gridvalue23.value = "";
  gridvalue24.value = "";
  gridvalue25.value = "";
  gridvalue26.value = "0";
  gridvalue27.value = "0";
  gridvalue28.value = "0";
  gridvalue29.value = "0";
  gridvalue30.value = "0";
  gridvalue31.value = "0";
  gridvalue32.value = "0";
  gridvalue33.value = "00:00";
  gridvalue34.value = "00:00";
  gridvalue35.value = "00:00";
  gridvalue36.value ="00:00";
  gridvalue37.value = "00:00";
  gridvalue38.value = "00:00";
  gridvalue39.value ="00:00";
  gridvalue40.value = "00:00";
  gridvalue41.value = "00:00";
  gridvalue42.value = "00:00";
  gridvalue43.value ="00:00";
  gridvalue44.value = "00:00";
  gridvalue45.value = "00:00";
  gridvalue46.value ="00:00";
  gridvalue47.value = "";

  tempRowData3.value = []
  tempDayWeek.value = ''
  tempempId.value = ''
};
/**
 * 그리드 행 삭제 버튼 함수
 */

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  ////console.log(newValue);
  // gridvalue1.value = newValue[1];
  // gridvalue2.value = newValue[4];
  // gridvalue3.value = newValue[3];
  // gridvalue4.value = newValue[35];
  // gridvalue5.value = newValue[14];
  // gridvalue6.value = newValue[31].split(" ")[0];
  // gridvalue7.value = newValue[28] == "True" ? true : false;
  // gridvalue8.value = newValue[23];
  // gridvalue9.value = newValue[24];
  // gridvalue10.value = newValue[25];
  // gridvalue11.value = newValue[16].split(" ")[0];
  // gridvalue12.value = newValue[15];
  // gridvalue13.value = newValue[29];
  // gridvalue14.value = newValue[32];
  // gridvalue15.value = newValue[12];
  // gridvalue16.value = newValue[10];
  // gridvalue17.value = newValue[11];
  // gridvalue18.value = newValue[19].split(" ")[0];
  // gridvalue19.value = newValue[22];
  // gridvalue20.value = newValue[17].split(" ")[0];
  // gridvalue21.value = newValue[18].split(" ")[0];
  // gridvalue22.value = newValue[36];
  // gridvalue23.value = newValue[30];
  // gridvalue24.value = newValue[21];
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

const storeType = ref();
const handleStoreType = (e) => {
  storeType.value = e;
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
    setTimeout(() => {
      changeValue2.value = dataList2.value.filter(
        (item) => item.lngClassCode == rowValue
      )[0].strClass;
      changeColid.value = "strClass";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngRankCode") {
    setTimeout(() => {
      changeValue2.value = dataList3.value.filter(
        (item) => item.lngRankCode == rowValue
      )[0].strRank;
      changeColid.value = "strRank";

      changeNow.value = !changeNow.value;
    }, 10);
  }

  if (rowName == "lngAreaCode") {
    setTimeout(() => {
      changeValue2.value = dataList.value.filter(
        (item) => item.lngAreaCode == rowValue
      )[0].strArea;
      changeColid.value = "strAreaName";

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

/**
 *  조회 함수
 */

const searchButton = async () => {
  try {
    store.state.loading = true;
    let res;
    //comsole.log(groupCd.value);
    //comsole.log(storeCd.value);

    let lngoption =
      (cond.value == true ? "1" : "") +
      (cond2.value == true ? "2" : "") +
      (cond3.value == true ? "3" : "");

    let sdate = disableAll.value == true ? "1980-01-01" : StartDate.value;
    let edate = disableAll.value == true ? "9999-12-01" : EndDate.value;
    res = await getEmpContractList(
      groupCd.value,
      storeCd.value,
      selectedOption.value,
      lngoption,
      sdate,
      edate,
      searchoption.value,
      searchword.value
    );

    rowData.value = res.data.List;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    console.log(res);
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
  if (tempempId.value == '' || tempempId.value == undefined ) {
    Swal.fire({
      title: "경고",
      text: "사원조회를 먼저 진행해주세요.",
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
        //comsole.log(updateRow.value);

      
        console.log(tempRowData3.value)
        const dayweeks = tempRowData3.value.map(item => item.lngDayWeek).join('\u200b')
        const lngCodes = tempRowData3.value.map(item => item.lngCode).join('\u200b')
        const atndType = tempRowData3.value.map(item => item.lngAtndType).join('\u200b')
        const sTimes = tempRowData3.value.map(item => item.strSTime).join('\u200b')
        const eTimes = tempRowData3.value.map(item => item.strETime).join('\u200b')
        const res = await saveEmpContract(
              tempGroupCd.value ,
              tempStoreCd.value ,
              tempempId.value ,
              gridvalue2.value , 
              gridvalue3.value,
              gridvalue4.value ,
              gridvalue5.value ,
              gridvalue6.value ,
              gridvalue7.value ,
              gridvalue8.value == false ? 0 : 1 ,
              gridvalue9.value ,
              gridvalue11.value ,
              2 ,
              gridvalue12.value == true ? 1 : 0 ,
              gridvalue12.value == true ? 0 : 1 ,
              gridvalue26.value ,
              gridvalue33.value ,
              gridvalue40.value ,
               3 ,
              gridvalue13.value == true ? 1 : 0 ,
              gridvalue13.value == true ? 0 : 1 ,
              gridvalue27.value ,
              gridvalue34.value ,
              gridvalue41.value ,
              4 ,
              gridvalue14.value == true ? 1 : 0 ,
              gridvalue14.value == true ? 0 : 1 ,
              gridvalue28.value ,
              gridvalue35.value ,
              gridvalue42.value ,
              5 ,
              gridvalue15.value == true ? 1 : 0 ,
              gridvalue15.value == true ? 0 : 1 ,
              gridvalue29.value ,
              gridvalue36.value ,
              gridvalue43.value ,
              6 ,
              gridvalue16.value == true ? 1 : 0 ,
              gridvalue16.value == true ? 0 : 1 ,
              gridvalue30.value ,
              gridvalue37.value ,
              gridvalue44.value ,
              7 ,
              gridvalue16.value == true ? 1 : 0 ,
              gridvalue16.value == true ? 0 : 1 ,
              gridvalue31.value ,
              gridvalue38.value ,
              gridvalue45.value ,
              1 ,
              gridvalue17.value == true ? 1 : 0 ,
              gridvalue17.value == true ? 0 : 1 ,
              gridvalue32.value ,
              gridvalue39.value ,
              gridvalue46.value ,
              dayweeks,
              lngCodes,
              atndType,
              sTimes,
              eTimes,
              updateOrInsert.value == true ? 1 : 0

        );
        console.log(res);
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
      } catch (error) {
        Swal.fire({
          title: "저장이 실패되었습니다.",
          confirmButtonText: "확인",
        });
      } finally {
        store.state.loading = false;
        searchButton();
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

const open = ref(false);
const tempRowData3 = ref([]);
const dblclickedRowData = async (e) => {
  console.log(e);
  rowData2.value = [];
  rowData3.value = [];

     tempGroupCd.value  = e[16]
              tempStoreCd.value =e[17]
  tempempId.value = e[18]
  gridvalue1.value = e[3];
  gridvalue2.value = e[25];
  gridvalue3.value = e[5];
  gridvalue4.value = e[6];
  gridvalue5.value = e[19];
  gridvalue6.value = e[7];
  gridvalue7.value = e[8];
  gridvalue8.value = e[20] == "1" ? true : false;
  gridvalue9.value = e[10];
  gridvalue10.value = e[10] * 4;
  gridvalue47.value = e[14];
  gridvalue11.value = e[13];
  updateOrInsert.value = false
  disabled.value = true;
  try {
    const res = await getWorkContractDetail(e[16], e[17], e[18], e[25], e[19]);
    tempRowData3.value = res.data.List;
    console.log(res);
    // 12 19
    const workDate = res.data.List2.filter(
      (item) => item.lngWorkChk == "1"
    ).map((item) => item.lngDayWeek);
    const restDate = res.data.List2.filter(
      (item) => item.lngWorkChk == "0"
    ).map((item) => item.lngDayWeek);

    const workHour = res.data.List2.map((item) => item.strWorkHour);

    const goworkHour = res.data.List2.map((item) => item.strOnTime);

    const leaveworkHour = res.data.List2.map((item) => item.strOffTime);

    for (let i = 0; i < workDate.length; i++) {
      if (workDate[i] == "1") {
        gridvalue18.value = true;
        //gridvalue25.value = false;
      } else if (workDate[i] == "2") {
        gridvalue12.value = true;
       // gridvalue19.value = false;
      } else if (workDate[i] == "3") {
        gridvalue13.value = true;
       // gridvalue20.value = false;
      } else if (workDate[i] == "4") {
        gridvalue14.value = true;
      //  gridvalue21.value = false;
      } else if (workDate[i] == "5") {
        gridvalue15.value = true;
       // gridvalue22.value = false;
      } else if (workDate[i] == "6") {
        gridvalue16.value = true;
      //  gridvalue23.value = false;
      } else if (workDate[i] == "7") {
        gridvalue17.value = true;
      //  gridvalue24.value = false;
      }
    }

    for (let i = 0; i < restDate.length; i++) {
      if (restDate[i] == "1") {
      //  gridvalue25.value = true;
        gridvalue18.value = false;
      } else if (restDate[i] == "2") {
      //  gridvalue19.value = true;
        gridvalue12.value = false;
      } else if (restDate[i] == "3") {
      //  gridvalue20.value = true;
        gridvalue13.value = false;
      } else if (restDate[i] == "4") {
       // gridvalue21.value = true;
        gridvalue14.value = false;
      } else if (restDate[i] == "5") {
      //  gridvalue22.value = true;
        gridvalue15.value = false;
      } else if (restDate[i] == "6") {
      //  gridvalue23.value = true;
        gridvalue16.value = false;
      } else if (restDate[i] == "7") {
       // gridvalue24.value = true;
        gridvalue17.value = false;
      }
    }

    gridvalue32.value = workHour[0];
    gridvalue39.value = goworkHour[0];
    gridvalue46.value = leaveworkHour[0];

    gridvalue26.value = workHour[1];
    gridvalue33.value = goworkHour[1];
    gridvalue40.value = leaveworkHour[1];

    gridvalue27.value = workHour[2];
    gridvalue34.value = goworkHour[2];
    gridvalue41.value = leaveworkHour[2];

    gridvalue28.value = workHour[3];
    gridvalue35.value = goworkHour[3];
    gridvalue42.value = leaveworkHour[3];

    gridvalue29.value = workHour[4];
    gridvalue36.value = goworkHour[4];
    gridvalue43.value = leaveworkHour[4];

    gridvalue30.value = workHour[5];
    gridvalue37.value = goworkHour[5];
    gridvalue44.value = leaveworkHour[5];

    gridvalue31.value = workHour[6];
    gridvalue38.value = goworkHour[6];
    gridvalue45.value = leaveworkHour[6];
    open.value = true;
  } catch (error) {}
};

const rowData3 = ref([]);
const tempDayWeek = ref("");
const setRowData3 = (e) => {
  tempDayWeek.value = e;
  const result = tempRowData3.value.filter((item) => item.lngDayWeek == e);
  console.log(result);
  rowData3.value = result;

  rowData2.value = Array.from({ length: 17 }, (_, j) => {
    let hourC = false;
    let minute = false;

    const hour3 = String(j + 8).padStart(2, "0"); // 08 ~ 24
    for (let i = 0; i < rowData3.value.length; i++) {
      const hour = rowData3.value[i].strSTime;
      const hour2 = rowData3.value[i].strETime;

      //데이터의 시간
      const chour = parseInt(hour.split(":")[0]);
      const chour2 = parseInt(hour2.split(":")[0]);

      //데이터의 분
      const cminute = parseInt(hour.split(":")[1]);
      const cminute2 = parseInt(hour2.split(":")[1]);

      if (chour <= j + 8 && j + 8 < chour2) {
        hourC = true;

        if (cminute + 31 > 30) {
          minute = true;
          // return;
        }
      }


      if (j + 8 == chour2 && cminute2 > 0) {
        hourC = true;

        if (cminute2 >= 30) {
          minute = true;
          // return;
        }
      }
    }
    return {
      strTime: `${hour3}:00`,
      workTime: hourC == true ? "1" : "0",
      workTime2: minute == true ? "1" : "0",
    };
  });


};

const checkedRowData = (e) => {
  console.log(e)
}
const tempCheckedRowData = ref([])
const updatedRowData2 = (e) => {
  // console.log(e);
  // console.log(tempRowData3.value)
  tempCheckedRowData.value = e.filter(item => item.checkbox == true)
  //console.log(tempCheckedRowData.value)
  tempRowData3.value = tempRowData3.value.filter(item => item.lngDayWeek != tempDayWeek.value)

  for(let i=0 ; i< e.length ; i++){
    tempRowData3.value.push({
      checkbox :'0' , dtmConStartDate : gridvalue3.value , lngAtndType : e[i].lngAtndType , lngChargerCode : tempempId.value , lngCode : e[i].lngCode , lngDayWeek : tempDayWeek.value , lngPayStndCode : gridvalue2.value , lngStoreGroup: tempGroupCd.value , lngStoreCode :tempStoreCd.value , rowState: e[i].rowState , strETime : e[i].strETime , strSTime : e[i].strSTime , strWTime : e[i].strWTime
    })
  }
  const strSTime = e[0].strSTime;
  const strETime = e[e.length - 1].strETime;
  let totalWHour = 0;
  let totalWMin = 0;

  for (let i = 0; i < e.length; i++) {
    totalWHour += parseInt(String(e[i].strWTime).split(":")[0]);
    if(parseInt(String(e[i].strWTime).split(":")[1]) < 0){
      totalWHour -= 1
      totalWMin = -parseInt(String(e[i].strWTime).split(":")[1])
    } else {
  totalWMin += parseInt(String(e[i].strWTime).split(":")[1]);
    }
  
  }

  totalWHour = String(totalWHour).padStart(2, "0");
  totalWMin = String(totalWMin).padStart(2, "0");
  if (tempDayWeek.value == "1") {
    gridvalue32.value = totalWHour + ":" + totalWMin;
    gridvalue39.value = strSTime;
    gridvalue46.value = strETime;
  } else if (tempDayWeek.value == "2") {
    gridvalue26.value = totalWHour + ":" + totalWMin;
    gridvalue33.value = strSTime;
    gridvalue40.value = strETime;
  } else if (tempDayWeek.value == "3") {
    gridvalue27.value = totalWHour + ":" + totalWMin;
    gridvalue34.value = strSTime;
    gridvalue41.value = strETime;
  } else if (tempDayWeek.value == "4") {
    gridvalue28.value = totalWHour + ":" + totalWMin;
    gridvalue35.value = strSTime;
    gridvalue42.value = strETime;
  } else if (tempDayWeek.value == "5") {
    gridvalue29.value = totalWHour + ":" + totalWMin;
    gridvalue36.value = strSTime;
    gridvalue43.value = strETime;
  } else if (tempDayWeek.value == "6") {
    gridvalue30.value = totalWHour + ":" + totalWMin;
    gridvalue37.value = strSTime;
    gridvalue44.value = strETime;
  } else if (tempDayWeek.value == "7") {
    gridvalue31.value = totalWHour + ":" + totalWMin;
    gridvalue38.value = strSTime;
    gridvalue45.value = strETime;
  }
};

const rowData2 = ref([]);

const updateOpen = (e) => {
  //console.log('왓냐')
  openPopUp.value = false
}

const empType = (e) => {
  console.log(e)
 
}
const empSalType = (e) =>{
  gridvalue2.value =e
  //console.log(e)
}
const empName = (e) => {
 // console.log(e)
  gridvalue1.value = e
}
const tempempId = ref('')
const empId = (e) => {
  console.log(e)
  tempempId.value = e
}
const tempGroupCd = ref('')
const groupCd2 = (e) => {
tempGroupCd.value = e
}

const tempStoreCd = ref('')
const storeCd2 = (e) => {
tempStoreCd.value = e
}

watch(([gridvalue26 , gridvalue27, gridvalue28, gridvalue29, gridvalue30, gridvalue31, gridvalue32]) ,() => {
    const hours = (
  parseInt(gridvalue26.value.split(':')[0] || 0) +
  parseInt(gridvalue27.value.split(':')[0] || 0) +
  parseInt(gridvalue28.value.split(':')[0] || 0) +
  parseInt(gridvalue29.value.split(':')[0] || 0) +
  parseInt(gridvalue30.value.split(':')[0] || 0) +
  parseInt(gridvalue31.value.split(':')[0] || 0) +
  parseInt(gridvalue32.value.split(':')[0] || 0)
);

const minutes = (
  parseInt(gridvalue26.value.split(':')[1] || 0) +
  parseInt(gridvalue27.value.split(':')[1] || 0) +
  parseInt(gridvalue28.value.split(':')[1] || 0) +
  parseInt(gridvalue29.value.split(':')[1] || 0) +
  parseInt(gridvalue30.value.split(':')[1] || 0) +
  parseInt(gridvalue31.value.split(':')[1] || 0) +
  parseInt(gridvalue32.value.split(':')[1] || 0)
);

const total = hours + minutes / 60;
gridvalue10.value = hours * 4
gridvalue9.value = total.toFixed(2); 
})


const addRow5 = ref(false)
const addrowProp = ref('checkbox,lngAtndType,strSTime,strETime,strWTime')
const addrowDefault = ref('false,,08:00,18:00,,')
const addButton2 = () => {

  if(updateOrInsert.value == true){

  if(tempempId.value == '' || tempempId.value == undefined){
     Swal.fire({
      title: "사원조회를 먼저 해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }
    }

   if(tempDayWeek.value == '' || tempDayWeek.value == undefined){
     Swal.fire({
      title: "상세보기를 먼저 선택해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }


  tempRowData3.value.push({checkbox : false , dtmConStartDate: formatLocalDate(new Date()), lngAtndType: 0 , lngChargerCode: tempempId.value , lngCode: 0 , lngDayWeek : tempDayWeek.value , lngPayStndCode : gridvalue2.value , lngStoreCode: tempStoreCd.value , lngStoreGroup : tempGroupCd.value ,  strSTime: '00:00' ,strETime: '00:00', strWTime: ''})
  console.log(tempRowData3.value)
  setRowData3(tempDayWeek.value)
}


const deleteButton2 = () => {
  if(tempCheckedRowData.value.length == 0){
     Swal.fire({
      title: "경고",
      text: "삭제할 대상을 먼저 체크해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  for(let i=0 ; i < tempCheckedRowData.value.length ; i++){
    tempRowData3.value = tempRowData3.value.filter(item =>  !(item.strETime == tempCheckedRowData.value[i].strETime && item.strSTime == tempCheckedRowData.value[i].strSTime && item.lngAtndType == tempCheckedRowData.value[i].lngAtndType) )
  }
  setRowData3(tempDayWeek.value)

  const ctempRowData3 = tempRowData3.value.filter(item => item.lngDayWeek == tempDayWeek.value)

  console.log(ctempRowData3)

  if(ctempRowData3.length > 0){

   const strSTime = ctempRowData3[0].strSTime;
  const strETime = ctempRowData3[ctempRowData3.length - 1].strETime;
  let totalWHour = 0;
  let totalWMin = 0;

  for (let i = 0; i < ctempRowData3.length; i++) {
    totalWHour += parseInt(String(ctempRowData3[i].strWTime).split(":")[0]);
    totalWMin += parseInt(String(ctempRowData3[i].strWTime).split(":")[1]);
  }

  totalWHour = String(totalWHour).padStart(2, "0");
  totalWMin = String(totalWMin).padStart(2, "0");
  console.log(totalWHour)
  console.log(totalWMin)
  if (tempDayWeek.value == "1") {
    gridvalue32.value = totalWHour + ":" + totalWMin;
    gridvalue39.value = strSTime;
    gridvalue46.value = strETime;
  } else if (tempDayWeek.value == "2") {
    gridvalue26.value = totalWHour + ":" + totalWMin;
    gridvalue33.value = strSTime;
    gridvalue40.value = strETime;
  } else if (tempDayWeek.value == "3") {
    gridvalue27.value = totalWHour + ":" + totalWMin;
    gridvalue34.value = strSTime;
    gridvalue41.value = strETime;
  } else if (tempDayWeek.value == "4") {
    gridvalue28.value = totalWHour + ":" + totalWMin;
    gridvalue35.value = strSTime;
    gridvalue42.value = strETime;
  } else if (tempDayWeek.value == "5") {
    gridvalue29.value = totalWHour + ":" + totalWMin;
    gridvalue36.value = strSTime;
    gridvalue43.value = strETime;
  } else if (tempDayWeek.value == "6") {
    gridvalue30.value = totalWHour + ":" + totalWMin;
    gridvalue37.value = strSTime;
    gridvalue44.value = strETime;
  } else if (tempDayWeek.value == "7") {
    gridvalue31.value = totalWHour + ":" + totalWMin;
    gridvalue38.value = strSTime;
    gridvalue45.value = strETime;
  }
    } else {
      if (tempDayWeek.value == "1") {
    gridvalue32.value = '00:00'
    gridvalue39.value = '00:00'
    gridvalue46.value = '00:00'
  } else if (tempDayWeek.value == "2") {
    gridvalue26.value = '00:00'
    gridvalue33.value = '00:00'
    gridvalue40.value = '00:00'
  } else if (tempDayWeek.value == "3") {
    gridvalue27.value = '00:00'
    gridvalue34.value = '00:00'
    gridvalue41.value = '00:00'
  } else if (tempDayWeek.value == "4") {
    gridvalue28.value = '00:00'
    gridvalue35.value = '00:00'
    gridvalue42.value = '00:00'
  } else if (tempDayWeek.value == "5") {
    gridvalue29.value = '00:00'
    gridvalue36.value = '00:00'
    gridvalue43.value = '00:00'
  } else if (tempDayWeek.value == "6") {
    gridvalue30.value = '00:00'
    gridvalue37.value = '00:00'
    gridvalue44.value = '00:00'
  } else if (tempDayWeek.value == "7") {
    gridvalue31.value = '00:00'
    gridvalue38.value = '00:00'
    gridvalue45.value = '00:00'
  }
    }
}

const updateOrInsert = ref(false)


const deleteButton = async() => {
    console.log(updateRow.value)


  const groupcds = updateRow.value.filter(item => item.checkbox == true).map(item => item.lngStoreGroup).join('\u200b')
  const storecds = updateRow.value.filter(item => item.checkbox == true).map(item => item.lngStoreCode).join('\u200b')
  const chargercodes = updateRow.value.filter(item => item.checkbox == true).map(item => item.lngChargerCode).join('\u200b')
  const payndcds = updateRow.value.filter(item => item.checkbox == true).map(item => item.lngPayStndCode).join('\u200b')
  const sdates = updateRow.value.filter(item => item.checkbox == true).map(item => item.dtmConStartDate).join('\u200b')
  try {
    const res = await deleteEmpContract(groupcds,storecds,chargercodes,payndcds,sdates)

    console.log(res)

    if(res.data.RESULT_CD == '00'){
       Swal.fire({
      title: "성공",
      text: "선택하신 근무계약을 삭제하였습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    } else {
        Swal.fire({
      title: "실패",
      text: "선택하신 근무계약 삭제에 실패하였습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
    }
  } catch (error) {
    
  } finally {
    searchButton()
  }
}

const openSearchPopUp = ref(false)
const searchButton2 = async() =>{
    openSearchPopUp.value = true
}

const scond = ref('')
const scond2 = ref('0')
const scond3 = ref('')

const storecd3 = ref('')
const lngStoreCode3 = (e) => {
storecd3.value =e
}

const groupcd3 = ref('')
const lngStoreGroup3 = (e) => {
groupcd3.value =e
}

const rowData4 = ref([])
const searchButton3 = async() => {

  try {
    const res = await getUnContractEmpList(groupcd3.value , 0 , storecd3.value ,scond2.value ,scond3.value , scond.value, 0)
    console.log(res)
    rowData4.value = res.data.List
  } catch (error) {
    
  }
}

const exportExcel3 = ref(false)
const documentSubTitle3 = ref(false)
const excelButton3 = () =>{
  documentSubTitle3.value = '계약 시작일 :' +scond.value
  exportExcel3.value = !exportExcel3.value
}
</script>

<style scoped></style>
