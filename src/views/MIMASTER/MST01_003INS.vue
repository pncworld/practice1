/*--############################################################################
# Filename : MST01_003INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건  START-->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
  <br />
  <div
    class="absolute z-50 inset-0 bg-black bg-opacity-50 w-full h-full"
    v-if="showPopUp">
    <div
      class="fixed top-[25%] left-[25%] h-[55vh] w-[55vw] bg-white rounded-lg">
      <div
        class="grid grid-rows-[1fr,11fr,1fr] grid-cols-1 text-xl p-5 font-semibold">
        <div class="flex justify-between">
          <div>할인설정 복사</div>
          <div>
            <button class="button primary" @click="copyButton">복사</button>
          </div>
        </div>
        <div class="grid grid-rows-1 grid-cols-2 space-x-3">
          <div class="grid grid-rows-[1fr,3fr,7fr]">
            <div class="flex justify-start text-base">기준 메뉴코드</div>
            <div class="grid grid-rows-2 grid-cols-[1fr,3fr] text-sm h-20">
              <div
                class="bg-gray-100 flex justify-center items-center rounded-tl-lg border border-gray-600">
                메뉴코드
              </div>
              <div
                class="flex justify-center items-center border border-gray-600 rounded-tr-lg p-1">
                <input
                  type="text"
                  v-model="gridvalue3"
                  disabled
                  class="h-full w-full p-1" />
              </div>
              <div
                class="bg-gray-100 flex justify-center items-center rounded-bl-lg border border-gray-600">
                메뉴명
              </div>
              <div
                class="flex justify-center items-center border border-gray-600 rounded-br-lg p-1">
                <input
                  type="text"
                  v-model="gridvalue6"
                  disabled
                  class="h-full w-full p-1" />
              </div>
            </div>
            <div>
              <Realgrid
                :progname="'MST36_001INS_VUE'"
                :progid="5"
                :rowData="rowData4"
                :setStateBar="false"
                :rowStateeditable="false">
              </Realgrid>
            </div>
          </div>
          <div class="grid grid-rows-[1fr,1fr,7fr]">
            <div class="text-base flex justify-start">대상 메뉴코드 선택</div>
            <div class="grid grid-rows-1 grid-cols-[2fr,3fr] text-sm h-8">
              <div class="text-sm flex justify-center items-center">
                메뉴코드/메뉴명
              </div>
              <div class="rounded-lg border">
                <input
                  type="text"
                  v-model="searchWord5"
                  class="h-full w-full pl-1" />
              </div>
            </div>
            <div>
              <Realgrid
                :progname="'MST36_001INS_VUE'"
                :progid="4"
                :showCheckBar="true"
                :setStateBar="false"
                :rowStateeditable="false"
                :rowData="rowData5"
                :searchColId="'menuCd,menuNm'"
                :searchWord3="searchWord5"
                @checkedRowData="checkedRowData5">
              </Realgrid>
            </div>
          </div>
        </div>
        <div class="flex justify-end mt-2">
          <button @click="closePopUp" class="whitebutton">닫기</button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore
      @update:storeGroup="lngStoreGroup"
      @update:storeCd="handleStoreCd"
      @storeNm="handlestoreNm"
      :hidesub="hidesub"
      :hideAttr="hideAttr"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"></PickStore>
  </div>
  <!-- 조회조건  END-->
  <!-- 그리드영역 -->
  <div class="grid grid-rows-1 grid-cols-[3fr,5fr] h-[65vh] w-full">
    <div class="flex flex-col w-full h-[55vh]">
      <div
        class="flex justify-between mt-5 ml-10 w-full border-b border-b-gray-300">
        <div class="flex justify-start font-bold text-xl">메뉴코드 목록</div>
        <div class="mt-3 space-x-2">
          <button class="whitebutton" @click="addRow" :disabled="!afterSearch">
            추가
          </button>
          <button class="whitebutton" @click="deleteRow" :disabled="afterClick">
            삭제
          </button>
        </div>
      </div>

      <div class="mt-3 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full ml-10">
        <div class="customtableIndex border border-gray-400 rounded-tl-lg">
          메뉴분류
        </div>
        <div class="border border-gray-300 rounded-tr-lg flex p-1">
          <select
            name="lngMainGroup"
            id=""
            class="flex-1 border rounded-lg w-[80%] h-full"
            @change="setSubCd"
            v-model="forsearchMain">
            <option value="-1">전체</option>
            <option :value="i.GroupCd" v-for="i in MenuGroup">
              [{{ i.GroupCd }}]{{ i.majorGroupNm }}
            </option>
          </select>
          <select
            name="lngSubGroup"
            id=""
            class="flex-1 border rounded-lg w-full h-full"
            v-model="forsearchSub"
            @change="setSubCd">
            <option value="-1">전체</option>
            <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup">
              [{{ i.GroupCd }}]{{ i.subGroupNm }}
            </option>
          </select>
        </div>
        <div class="customtableIndex border border-gray-400 rounded-bl-lg">
          메뉴명/코드
        </div>
        <div class="px-1 py-1 border border-gray-300 rounded-br-lg">
          <input
            type="text"
            class="border w-full h-full px-1 border-gray-400 rounded-lg"
            @input="searchMenuList"
            v-model="searchWord" />
        </div>
      </div>
      <div class="ml-10 mt-1 w-full h-[55vh]">
        <Realgrid
          class="w-full h-[60vh]"
          :progname="'MST01_033INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :showGrid="showGrid"
          :showCheckBar="false"
          @clickedRowData="clickedRowData"
          :selectionStyle="'singleRow'"
          @selcetedrowData="selcetedrowData"
          @allStateRows="allStateRows"
          @sendRowState="sendRowState"
          :labelsData="labelsData"
          :valuesData="valuesData"
          :labelingColumns="labelingColumns"
          :changeNow2="changeNow"
          :changeValue2="changeValue2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          @selectedIndex="selectedIndex"
          @selectedIndex2="selectedIndex2"
          :addRow4="addRow4"
          :deleteRow6="deleteRow3"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          @updatedRowData2="updatedRowData"
          :rowStateeditable="false"
          :addField="'new'"
          :hideRow="hideRow"
          :hideNow="hideNow"
          :searchColId="'lngCode,strName'"
          :searchColId3="['lngMainGroup', 'lngSubGroup']"
          :searchValue="searchValue"
          :searchWord3="searchWord"
          :suffixColumnwon="'lngPrice'"
          :initFocus="initFocus"
          :exporttoExcel="exporttoExcel"
          :exportExcelShowColumns="['strBarCode', 'strBigo']"
          :documentTitle="'MST01_003INS'"></Realgrid>
        <!-- :searchWord="searchWord" :searchColId2="'blnInactive,payDistinct'" :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" -->
      </div>
    </div>
    <!-- 그리드영역 -->
    <!-- 탭영역 -->
    <div class="grid grid-cols-1 grid-rows-[1fr,9fr] ml-20">
      <div class="flex space-x-1 mt-10">
        <button
          class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border"
          @click="selectMenu(1)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 1 }">
          상세정보
        </button>
        <button
          class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border disabled:bg-gray-50 disabled:text-gray-200"
          @click="selectMenu(2)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 2 }"
          :disabled="discountDisabled || disableWithMenuDisc">
          할인선택
        </button>
        <button
          class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border"
          @click="selectMenu(3)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 3 }"
          :disabled="selectedMultiple">
          키오스크 이미지 설정
        </button>
      </div>
      <div>
        <hr class="w-[90%] mt-0" />
        <div v-show="selectedMenu == 1" class="mt-3 h-[46%]">
          <div class="font-bold flex justify-start text-xl">기본정보</div>
          <div
            class="grid grid-rows-7 grid-cols-[1fr,3fr,1fr,3fr] h-[70%] mt-3 w-[90%] border rounded-lg">
            <div
              class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">
              *메뉴분류
            </div>
            <div class="flex w-[236%]">
              <select
                name="lngMainGroup"
                id=""
                class="flex border rounded-lg w-[95%] h-full disabled:bg-gray-100"
                @change="
                  (e) => {
                    setSubCd4();
                    changeInfo(e);
                  }
                "
                v-model="gridvalue1"
                :disabled="afterClick">
                <option value="0">선택</option>
                <option :value="i.GroupCd" v-for="i in MenuGroup">
                  [{{ i.GroupCd }}]{{ i.majorGroupNm }}
                </option>
              </select>
              <select
                name="lngSubGroup"
                id=""
                class="flex border rounded-lg w-[130%] h-full disabled:bg-gray-100"
                v-model="gridvalue2"
                @change="changeInfo"
                :disabled="afterClick">
                <option value="0">선택</option>
                <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup2">
                  [{{ i.GroupCd }}]{{ i.subGroupNm }}
                </option>
              </select>
            </div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div
              class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">
              *메뉴코드
            </div>
            <div class="justify-start items-center border flex">
              <input
                type="number"
                name="lngCode"
                class="justify-start rounded-lg items-center h-full w-[80%] border flex disabled:bg-gray-100"
                :disabled="!isNew || isNewAutoMenuCode"
                v-model="gridvalue3"
                @input="changeInfo" />
              <label for="autoMenuCode"
                ><input
                  type="checkbox"
                  id="autoMenuCode"
                  :checked="isNewAutoMenuCode"
                  :disabled="disableMenuAuto"
                  @change="setAuto" />자동</label
              >
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">
              *유효기간
            </div>
            <div class="grid grid-rows-1 grid-cols-2">
              <div
                class="justify-center rounded-lg items-center h-full w-full border flex">
                <input
                  type="date"
                  :disabled="afterClick"
                  name="dtmFromDate"
                  class="disabled:bg-gray-100 w-full h-full rounded-lg"
                  v-model="gridvalue4"
                  @input="changeInfo" />
              </div>
              <div
                class="justify-center rounded-lg items-center h-full w-full border flex">
                <input
                  type="date"
                  :disabled="afterClick"
                  class="disabled:bg-gray-100 w-full h-full rounded-lg"
                  name="dtmToDate"
                  v-model="gridvalue5"
                  @input="changeInfo" />
              </div>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              메뉴명
            </div>
            <div class="grid grid-rows-1 grid-cols-[2.9fr,4fr] w-[236%] z-5">
              <div
                class="justify-center rounded-lg items-center h-full w-full border flex">
                <span class="text-blue-500 font-bold text-start">*국문:</span
                ><input
                  type="text"
                  class="ml-0 justify-center rounded-lg items-center h-full w-[87%] border flex disabled:bg-gray-100"
                  :disabled="afterClick"
                  v-model="gridvalue6"
                  name="strName"
                  @input="changeInfo" />
              </div>
              <div
                class="justify-center rounded-lg items-center h-full w-[100%] border flex mr-28">
                영문:
                <input
                  type="text"
                  class="justify-center rounded-lg items-center h-full w-full border flex disabled:bg-gray-100"
                  :disabled="afterClick"
                  v-model="gridvalue7"
                  name="strNameE"
                  @input="changeInfo" />
              </div>
            </div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">
              정상단가
            </div>
            <div>
              <input
                type="number"
                name="lngDCPrice"
                class="justify-center rounded-lg items-center h-full w-full border flex disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue8"
                @input="changeInfo" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              옵션그룹선택
            </div>
            <div>
              <select
                name="lngChain"
                id=""
                :disabled="afterClick"
                class="disabled:bg-gray-100 border rounded-lg w-[50%] h-full p-1"
                v-model="gridvalue9"
                @change="changeInfo">
                <option value="">선택</option>
                <option :value="i.lngCode" v-for="i in optionGroup">
                  [{{ i.lngCode }}]{{ i.strName }}
                </option>
              </select>
              <button class="whitebutton" @click="moveOptionGroupPage">
                옵션그룹 추가
              </button>
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">
              *판매가
            </div>
            <div>
              <input
                type="text"
                name="lngPrice"
                class="justify-center rounded-lg items-center h-full w-full border flex disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue10"
                @input="changeInfo" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              정상단가할인표기
            </div>
            <div class="space-x-5 flex items-center border justify-left pl-2">
              <label for="disY"
                ><input
                  type="radio"
                  name="blnDCPriceYN"
                  id="disY"
                  :disabled="afterClick"
                  v-model="gridvalue11"
                  value="1"
                  @input="changeInfo" />예</label
              >
              <label for="disN"
                ><input
                  type="radio"
                  name="blnDCPriceYN"
                  id="disN"
                  :disabled="afterClick"
                  v-model="gridvalue11"
                  value="0"
                  @input="changeInfo" />아니오</label
              >
              <select
                name=""
                id=""
                :disabled="true"
                class="border rounded-lg disabled:bg-gray-200 ml-10 h-[80%] w-[50%]">
                <option value="">선택</option>
              </select>
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">
              *과세구분
            </div>
            <div class="space-x-5 flex items-center border justify-left pl-2">
              <label for="chargeY"
                ><input
                  type="radio"
                  name="lngTax"
                  id="chargeY"
                  :disabled="afterClick"
                  value="0"
                  v-model="gridvalue12"
                  @input="changeInfo" />과세</label
              >
              <label for="chargeN"
                ><input
                  type="radio"
                  name="lngTax"
                  id="chargeN"
                  :disabled="afterClick"
                  value="2"
                  v-model="gridvalue12"
                  @input="changeInfo" />면세</label
              >
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">
              *사용여부
            </div>
            <div class="space-x-5 flex items-center border justify-left pl-2">
              <label for="useY"
                ><input
                  type="radio"
                  name="blnInactive"
                  id="useY"
                  :disabled="afterClick"
                  value="0"
                  v-model="gridvalue13"
                  @input="changeInfo" />사용</label
              >
              <label for="useN"
                ><input
                  type="radio"
                  name="blnInactive"
                  id="useN"
                  :disabled="afterClick"
                  value="1"
                  v-model="gridvalue13"
                  @input="changeInfo" />미사용</label
              >
            </div>

            <div class="justify-center items-center bg-gray-100 border flex">
              주방출력설정
            </div>
            <div class="space-x-5 flex items-center border justify-left pl-2">
              <button class="whitebutton" @click="movePage">
                주방출력설정
              </button>
            </div>
          </div>
          <div class="font-bold text-xl flex justify-start mt-5">부가정보</div>
          <div
            class="grid grid-cols-[1fr,3fr,1fr,3fr] grid-rows-13 h-[120%] mt-3 w-[90%]">
            <div
              class="justify-center items-center bg-gray-100 border flex rounded-tl-lg">
              {{ disableWithMenuDisc ? "할인허용" : "할인여부" }}
            </div>
            <div
              class="space-x-5 flex items-center border justify-left pl-2"
              v-if="!disableWithMenuDisc">
              <label for="discount1"
                ><input
                  type="radio"
                  id="discount1"
                  name="discountYN"
                  v-model="gridvalue14"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="discount2"
                ><input
                  type="radio"
                  id="discount2"
                  name="discountYN"
                  v-model="gridvalue14"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>

            <div
              class="space-x-5 flex items-center border justify-left"
              v-if="disableWithMenuDisc">
              <input
                type="text"
                id="discount1"
                name="lngDiscount"
                v-model="gridvalue40"
                @input="changeInfo"
                :disabled="afterClick"
                class="disabled:bg-gray-200 w-full" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              메뉴당객수
            </div>
            <div class="flex justify-center items-center">
              <input
                type="number"
                name="intCustCount"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-100"
                v-model="gridvalue15"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">
              *주메뉴종속
            </div>
            <div class="space-x-5 flex items-center border justify-left pl-2">
              <label for="autopay1"
                ><input
                  type="radio"
                  id="autopay1"
                  name="blnCondimentprice"
                  v-model="gridvalue100"
                  value="1"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200"
                  @click="disableKPG"
                  @input="changeInfo" />예</label
              ><label for="autopay2"
                ><input
                  type="radio"
                  id="autopay2"
                  name="blnCondimentprice"
                  v-model="gridvalue100"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200"
                  @click="disableKPG" />아니오</label
              >
              <select
                name="lngKPG"
                id=""
                class="border h-[80%] w-[60%] rounded-lg pl-1 disabled:bg-gray-200 ml-3"
                :disabled="afterClick || gridvalue100 == 0"
                v-model="gridvalue18"
                @change="
                  changeInfo($event);
                  resetKPG($event);
                ">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in MENUDEPEND">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              주문정렬순위
            </div>
            <div class="flex justify-center items-center">
              <input
                type="number"
                name="lngOrder"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-100"
                v-model="gridvalue17"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              주방출력제외
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="openmoney1"
                ><input
                  type="radio"
                  id="openmoney1"
                  name="lngKPG"
                  v-model="gridvalue18"
                  value="99"
                  @input="changeInfo"
                  :disabled="afterClick || disabledKPG"
                  class="disabled:bg-gray-200" />예</label
              ><label for="openmoney2" v-if="showKPG"
                ><input
                  type="radio"
                  id="openmoney2"
                  name="lngKPG"
                  v-model="gridvalue18"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick || disabledKPG"
                  class="disabled:bg-gray-200" />아니오</label
              ><label for="openmoney3" v-if="!showKPG"
                ><input
                  type="radio"
                  id="openmoney3"
                  checked
                  disabled />아니오</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              바코드
            </div>
            <div class="flex justify-center items-center">
              <input
                type="text"
                name="strBarCode"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-100"
                v-model="gridvalue19"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              영수증출력제외
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="receipt1"
                ><input
                  type="radio"
                  id="receipt1"
                  name="blnReceipt"
                  v-model="gridvalue20"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="receipt2"
                ><input
                  type="radio"
                  id="receipt2"
                  name="blnReceipt"
                  v-model="gridvalue20"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              메뉴주문옵션
            </div>
            <div class="flex justify-center items-center">
              <select
                name="lngMenuOption"
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue21"
                @change="changeInfo"
                :disabled="afterClick">
                <option :value="i.strDCode" v-for="i in menuOrderOption">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              주문서출력제외
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="discountfor1"
                ><input
                  type="radio"
                  id="discountfor1"
                  name="blnRedPrint"
                  v-model="gridvalue22"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />전체 선택</label
              ><label for="discountfor2"
                ><input
                  type="radio"
                  id="discountfor2"
                  name="blnRedPrint"
                  v-model="gridvalue22"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />부분 선택</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              메뉴옵션코드
            </div>
            <div class="flex justify-center items-center">
              <select
                name="strIcon"
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue23"
                @change="changeInfo"
                :disabled="afterClick">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in menuOptionCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              주방단품출력
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="allow1"
                ><input
                  type="radio"
                  id="allow1"
                  name="blnKitSingle"
                  v-model="gridvalue24"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />허용</label
              ><label for="allow2"
                ><input
                  type="radio"
                  id="allow2"
                  name="blnKitSingle"
                  v-model="gridvalue24"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />비허용</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              서브타이틀
            </div>
            <div class="flex justify-center items-center">
              <select
                name="lngSubTitle"
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                :disabled="afterClick"
                v-model="gridvalue25"
                @change="changeInfo">
                <option value="">선택</option>
                <option :value="i.lngCode" v-for="i in subTitle">
                  {{ i.strName }}
                </option>
              </select>
            </div>

            <div class="justify-center items-center bg-gray-100 border flex">
              메뉴제공완료여부
            </div>
            <div
              class="space-x-5 flex justify-left pl-2 items-center border w-[233%]">
              <label for="allow3"
                ><input
                  type="radio"
                  id="allow3"
                  name="blnServing"
                  v-model="gridvalue26"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="allow4"
                ><input
                  type="radio"
                  id="allow4"
                  name="blnServing"
                  v-model="gridvalue26"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              KDS출력
            </div>
            <div
              class="space-x-5 flex justify-left items-center border w-[100%]">
              <input
                type="text"
                v-model="gridvalue38"
                :disabled="afterClick"
                name="lngKDS"
                class="w-full rounded-lg border pl-1 h-full"
                @input="onlyNumber" />
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex rounded-bl-lg">
              시세가적용
            </div>
            <div
              class="space-x-5 flex justify-left pl-2 items-center border w-[233%]">
              <label for="allow5"
                ><input
                  type="radio"
                  id="allow5"
                  name="blnOpen"
                  v-model="gridvalue27"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="allow6"
                ><input
                  type="radio"
                  id="allow6"
                  name="blnOpen"
                  v-model="gridvalue27"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              주방출력명
            </div>
            <div
              class="space-x-5 flex justify-left items-center border w-[100%]">
              <input
                type="text"
                v-model="gridvalue39"
                :disabled="afterClick"
                name="strNameK"
                class="w-full rounded-lg border pl-1 h-full"
                @input="changeInfo" />
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex rounded-bl-lg">
              배달메뉴
            </div>
            <div
              class="space-x-5 flex justify-left pl-2 items-center border w-[233%]">
              <label for="allow7"
                ><input
                  type="radio"
                  id="allow7"
                  name="blnDeliveryYN"
                  v-model="gridvalue28"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예</label
              ><label for="allow8"
                ><input
                  type="radio"
                  id="allow8"
                  name="blnDeliveryYN"
                  v-model="gridvalue28"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">
              영양소 정보
            </div>
            <div class="flex justify-center items-center w-[233%]">
              <input
                type="text"
                name="strNutrInfo"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue29"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">
              원산지 정보
            </div>
            <div class="flex justify-center items-center w-[233%]">
              <input
                type="text"
                name="strCntryOrg"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue30"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">
              메뉴설명
            </div>
            <div class="flex justify-center items-center w-[100%] col-span-3">
              <input
                type="text"
                name="strMenuComment"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue31"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="flex justify-center items-center bg-gray-100 border-l border-b">
              판매 시간대
            </div>
            <div class="flex justify-start pl-2 items-center border-b">
              <input
                type="time"
                class="border border-black w-[40%] h-[80%]"
                v-model="gridvalue32"
                name="dtmStart"
                @change="changeInfo"
                :disabled="afterClick" />
              ~
              <input
                type="time"
                class="border border-black w-[40%] h-[80%]"
                v-model="gridvalue33"
                name="dtmEnd"
                @change="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="flex justify-center items-center bg-gray-100 border-l border-b">
              판매일 설정
            </div>
            <div
              class="flex justify-start pl-2 space-x-2 items-center border-b border-r">
              <label for="lngType1"
                ><input
                  type="checkbox"
                  name="lngType1"
                  id="lngType1"
                  v-model="gridvalue34"
                  @change="changeInfo"
                  :disabled="afterClick" />평일</label
              >
              <label for="lngType2"
                ><input
                  type="checkbox"
                  name="lngType2"
                  id="lngType2"
                  v-model="gridvalue35"
                  @change="changeInfo"
                  :disabled="afterClick" />토요일</label
              >
              <label for="lngType3"
                ><input
                  type="checkbox"
                  name="lngType3"
                  id="lngType3"
                  @change="changeInfo"
                  v-model="gridvalue36"
                  :disabled="afterClick" />일요일</label
              >
              <label for="lngType4"
                ><input
                  type="checkbox"
                  name="lngType4"
                  id="lngType4"
                  @change="changeInfo"
                  v-model="gridvalue37"
                  :disabled="afterClick" />휴일</label
              >
            </div>

            <div
              class="flex justify-center items-center bg-gray-100 border-l border-b">
              비고
            </div>
            <div class="flex justify-start items-center border-b col-span-3">
              <input
                type="text"
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue41"
                name="strBigo"
                @change="changeInfo"
                :disabled="afterClick" />
            </div>
          </div>
        </div>
        <div v-show="selectedMenu == 2" class="h-[80%] w-[90%]">
          <div class="flex justify-between mt-3 w-full">
            <div class="font-bold text-xl">할인설정</div>
            <div>
              <button class="whitebutton" @click="copyButton2">
                할인설정복사
              </button>
            </div>
          </div>
          <div class="grid grid-rows-1 grid-cols-[1fr,3fr] mt-3">
            <div class="customtableIndex border border-gray-400 rounded-l-lg">
              결제코드/명
            </div>
            <div class="px-1 py-1 border border-gray-300 rounded-r-lg">
              <input
                type="text"
                class="border w-full h-full px-1 border-gray-400 rounded-lg"
                @input="searchPayCd"
                v-model="searchWord2" />
            </div>
          </div>
          <Realgrid
            class="w-full h-full mt-5"
            @realgridname="realgridname"
            :progname="'MST01_033INS_VUE'"
            :progid="2"
            :rowData="clickrowData2"
            @checkedRowData="checkedRowData2"
            :searchColId="'lngCode,strName'"
            :searchWord3="searchWord2"
            :checkBarInactive="'lngMenu'"
            :initSelect="true"
            :ExceptionCheck="'lngMenu'"
            :hideCheckBarList="true"
            :rowStateeditable="false"
            :showTooltip="true"></Realgrid>
          <!-- :searchColId2="'majorGroupCd,subGroupCd'" :searchColId="'menuCd,menuNm'" :searchColValue2="searchColValue3" :searchWord="searchWord2" -->
        </div>
        <div v-show="selectedMenu == 3" class="h-[90%] w-full">
          <div
            class="grid grid-rows-1 grid-cols-[2fr,3fr] w-[80%] h-[40%] ml-10 mt-10 border pl-5">
            <div class="flex justify-center items-center">
              <img
                :src="`https://www.pncapi.kr/MenuImage/Image/${fileName}?v=${Date.now()}`"
                @error="`../../assets/noimage2.png`"
                class="w-[80%] h-[80%]" />
            </div>
            <div class="grid grid-rows-[1fr,5fr] grid-cols-[1fr,5fr] border">
              <div
                class="customtableIndex border border-gray-400 rounded-l-lg h-full">
                파일명
              </div>
              <div class="flex h-full w-full items-center">
                <input
                  type="text"
                  v-model="fileName2"
                  class="border rounded-lg bg-gray-100 w-full"
                  disabled /><button class="whitebutton" @click="downloadFile">
                  다운로드
                </button>
              </div>
              <div
                class="customtableIndex border border-gray-400 rounded-l-lg h-full w-full">
                파일크기
              </div>
              <div class="grid grid-rows-[1fr,5fr] grid-cols-1">
                <div class="flex">
                  <input
                    type="text"
                    v-model="fileSize"
                    class="border rounded-lg bg-gray-100 w-full h-[80%]"
                    disabled /><label for="fileInput" class="whitebutton"
                    >파일선택</label
                  >

                  <input
                    id="fileInput"
                    type="file"
                    @change="handleFileUpload"
                    style="display: none"
                    accept=".jpg,.png,.jpeg" />
                </div>
                <div class="flex flex-col justify-start ml-2">
                  <span class="flex justify-start"
                    >* 이미지 사이즈 220*160
                  </span>
                  <span class="flex justify-start"
                    >* 이미지 포맷 : PNG, JPG 등 이미지 형식</span
                  >
                  <span class="flex justify-start"
                    >* 이미지 용량 제한 : 2MB
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 탭영역 -->
</template>

<script setup>
import {
  copyMenuListByCode,
  getAmountListByMenuCode,
  getMenuCodeEnroll,
  getMenuDiscCount,
  getMenuList,
  saveMenuCode,
  uploadFile,
} from "@/api/master";
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
 * 	그리드 생성
 */

/**
 *  리얼그리드 라이브러리 호출
 *  */

import RealGrid from "realgrid";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  이미지 별도 호출
 *  */
import axios from "axios";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";

/*
 * 랜덤 값 도출 라이브러리
 */

import { v4 as uuidv4 } from "uuid";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const hidesub = ref(true);
const hideAttr = ref(true);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  //comsole.log(store.state.userData.lngCommonMenu);

  const pageLog = await insertPageLog(store.state.activeTab2);
  ////console.log(store.state.userData.lngCommonMenu);
  if (store.state.userData.lngCommonMenu == "1") {
    hidesub.value = false;
    hideAttr.value = false;
  } else {
    hidesub.value = true;
    hideAttr.value = true;
  }

  const res = await getMenuDiscCount(store.state.userData.lngStoreGroup);

  if (res.data.List[0].count == "0") {
    disableWithMenuDisc.value = true;
  } else {
    disableWithMenuDisc.value = false;
  }
});
const searchWord2 = ref("");
const nowStoreCd = ref(0);
const rowData = ref([]);
const filteredrowData = ref([]);
const hideNow = ref(false);
const hideRow = ref([]);
const MENUDEPEND = ref([]);
const moveOptionGroupPage = () => {
  store.state.moveOtherTab = {
    strTitle: "선택 메뉴 그룹 등록.(U)",
    lngProgramID: "73757",
    strUrl: "MIMASTER::MST01_011INS_01.xml",
  };
  // router.push("/MIMASTER/MST01_011INS_01.xml");
};

const realgrid2Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const updateDeleteInsertrowIndex = ref([]);
/**
 * 상태 변화된 행 세팅
 */
const isNewAutoMenuCode = ref(false);
const disableMenuAuto = ref(true);
const setAuto = () => {
  isNewAutoMenuCode.value = !isNewAutoMenuCode.value;
  if (isNewAutoMenuCode.value == true) {
    gridvalue3.value = "";
    const tagName = "lngCode";
    const value2 = "";
    //comsole.log(value2);
    changeColid.value = tagName;
    changeValue2.value = value2;
    changeNow.value = !changeNow.value;
  }
};
const allStateRows = (e) => {
  updateDeleteInsertrowIndex.value = e;
  console.log(e);
};
const sendRowState = (e) => {
  if (e == "created") {
    isNew.value = true;
    disableMenuAuto.value = false;
  } else {
    isNew.value = false;
    disableMenuAuto.value = true;
  }

  //comsole.log(e);
};

const selectedMenu = ref(1);
const selectMenu = (newValue) => {
  selectedMenu.value = newValue;
};

/*
 * 공통 표준  Function
 */

watch(selectedMenu, () => {
  const reagrid2 = document.getElementById(realgrid2Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid2).resetSize();
    RealGrid.getGridInstance(reagrid2).refresh(true);
  }, 100);

  //comsole.log(RealGrid.getGridInstance(reagrid2));
});
/**
 * 추가 버튼 함수
 */

const addRow4 = ref(false);
const updateRow = ref([]);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow3 = ref(false);
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref("");
const MenuGroup = ref("");
const SubMenuGroup = ref("");
const items = ref("");
const selectedPayDistinct = ref(true);
const selectedMultiple = ref(false);
const forsearchMain = ref(-1);
const forsearchSub = ref(-1);
const afterSearch = ref(false);
const clickedStoreNm = ref();
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const rowData2 = ref([]);
const clickrowData2 = ref([]);
const rowData3 = ref([]);
const filteredrowData3 = ref([]);
const itemDiscount = ref([]);
const payOptions = ref([]);
const rounding = ref([]);
const taxs = ref([]);
const isNew = ref(false);
const initCheckColumn = ref("menuCd");
const disCountGroup = ref([]);
const approveGroup = ref([]);
const approveType = ref([]);
const filteredapproveType = ref([]);
const initCheckValue = ref("");
const initCheckAct = ref(false);
const uncheckValue = ref();
const initSelect = ref(false);
const discountDisabled = ref(true);
const disableWithMenuDisc = ref(true);
const labelsData = ref([
  ["할인", "지불", "할증"],
  ["사용", "미사용"],
]);
const valuesData = ref([
  ["1", "2", "3"],
  ["0", "1"],
]);
const labelingColumns = ref("payDistinct,blnInactive");
const gridvalue1 = ref(0);
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
const gridvalue31 = ref("");
const gridvalue32 = ref("");
const gridvalue33 = ref("");
const gridvalue34 = ref(false);
const gridvalue35 = ref(false);
const gridvalue36 = ref(false);
const gridvalue37 = ref(false);
const gridvalue38 = ref("");
const gridvalue39 = ref("");
const gridvalue40 = ref("");
const gridvalue41 = ref("");
const gridvalue100 = ref("");
const clickedrowdata = ref([]);
const clickrowData4 = ref([]);
const filteredrowData5 = ref([]);
const afterClick = ref(true);
const fileName = ref();
const rowIndex = ref();
const duplilfirstarr = ref();
const tempRowData2 = ref();

const onlyNumber = (e) => {
  gridvalue38.value = e.target.value.replace(/[^0-9]/g, "");

  const tagName = e.target.name;

  changeColid.value = tagName;
  changeValue2.value = gridvalue38.value;
  changeNow.value = !changeNow.value;
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  rowIndex.value = e;
};

/**
 * 데이터셋 상세정보 셋팅
 */

function convertTo24Hour(timeStr) {
  console.log(timeStr);
  if (!timeStr) return "";

  // "오전 12:00:00" → ["오전", "12:00:00"]

  const [no, ampm, time] = timeStr.split(" ");
  let [hour, minute, second] = time.split(":").map(Number);
  console.log(hour);
  console.log(minute);
  console.log(second);
  if (ampm === "오전") {
    // 오전 12시는 0시로 변환
    if (hour === 12) hour = 0;
  } else if (ampm === "오후") {
    // 오후인데 12시는 그대로, 나머지는 12 더함
    if (hour !== 12) hour += 12;
  }

  // 항상 두 자리로 표시
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  const ss = String(second).padStart(2, "0");

  return `${hh}:${mm}`;
}

const clickedRowData = async (newvalue) => {
  console.log(newvalue);
  afterClick.value = false;
  if (newvalue[9] == 0 || newvalue[12] == 0) {
    // 판매가 할인여부
    rowData2.value = [];
    clickrowData2.value = [];
    if (selectedMenu.value == 2) {
      selectedMenu.value = 1;
    }
  } else {
    rowData2.value = JSON.parse(JSON.stringify(tempRowData2.value));
    clickrowData2.value = JSON.parse(JSON.stringify(tempRowData2.value));
  }

  //comsole.log(SubMenuGroup.value);
  //comsole.log(newvalue[30]);
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == newvalue[30]
  );

  //comsole.log(filteredSubMenuGroup2.value);
  //rowIndex.value = newvalue.index;
  clickrowData4.value = [];
  filteredrowData5.value = [];

  searchWord2.value = "";
  searchWord3.value = "";
  clickedrowdata.value = newvalue[27];
  gridvalue1.value = newvalue[30];
  gridvalue2.value = newvalue[3];
  gridvalue3.value = newvalue[0];
  gridvalue4.value = newvalue[4];
  gridvalue5.value = newvalue[5];
  gridvalue6.value = newvalue[1];
  gridvalue7.value = newvalue[6];
  gridvalue8.value = newvalue[7];
  gridvalue9.value = newvalue[8];
  gridvalue10.value = String(newvalue[9]).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  gridvalue11.value = newvalue[10];
  gridvalue12.value = newvalue[11];
  gridvalue13.value = newvalue[2];
  gridvalue14.value = newvalue[39];
  gridvalue15.value = newvalue[13];
  gridvalue16.value = newvalue[14];
  gridvalue17.value = newvalue[15];
  gridvalue18.value = newvalue[16];
  gridvalue19.value = newvalue[17];
  gridvalue20.value = newvalue[18];
  gridvalue21.value = newvalue[19];
  gridvalue22.value = newvalue[20];
  gridvalue23.value = newvalue[21];
  gridvalue24.value = newvalue[22];
  gridvalue25.value = newvalue[24];
  gridvalue26.value = newvalue[23];
  gridvalue27.value = newvalue[25];
  gridvalue28.value = newvalue[26];
  gridvalue29.value = newvalue[27];
  gridvalue30.value = newvalue[28];
  gridvalue31.value = newvalue[29];

  gridvalue32.value = newvalue[35];
  gridvalue33.value = newvalue[36];
  gridvalue40.value = newvalue[12];
  gridvalue41.value = newvalue[40];

  gridvalue34.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 1) !== 0 : false;
  gridvalue35.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 2) !== 0 : false;
  gridvalue36.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 4) !== 0 : false;
  gridvalue37.value =
    newvalue[34] != "" ? (Number(newvalue[34]) & 8) !== 0 : false;

  gridvalue38.value = newvalue[37];
  gridvalue39.value = newvalue[38];

  if (gridvalue16.value == 1) {
    gridvalue100.value = 1;
    disabledKPG.value = true;
    if (gridvalue18.value != "1" && gridvalue18.value != "99") {
      showKPG.value = false;
    } else {
      showKPG.value = true;
    }
  } else {
    gridvalue100.value = 0;
    disabledKPG.value = false;
    showKPG.value = true;
  }
  discountDisabled.value =
    (newvalue[9] == 0 || newvalue[39] == 0) &&
    afterSearch.value == true &&
    afterClick.value == false;
  fileName.value = newvalue[33];
  fileName2.value = newvalue[31];
  //comsole.log(newvalue);
  if (newvalue[34] == true) {
    //isNew.value = true;
    clickaddrowSeq.value = rowData.value[newvalue.index].sequence;
    //comsole.log(clickaddrowSeq.value);
  } else {
    //isNew.value = false;
  }

  const firstarr = newvalue[32] != undefined ? newvalue[32].split(";") : [];
  duplilfirstarr.value = firstarr;
  if (rowData2.value.length > 0) {
    let dupliarr = JSON.parse(JSON.stringify(rowData2.value));
    dupliarr.sort((a, b) => {
      const aIndex = firstarr.indexOf(a.lngCode.toString());
      const bIndex = firstarr.indexOf(b.lngCode.toString());

      const rankA = aIndex !== -1 ? 0 : a.lngMenu === 0 ? 0 : 1;
      const rankB = bIndex !== -1 ? 0 : b.lngMenu === 0 ? 0 : 1;

      // 우선순위(rank)가 다르면 rank에 따라 정렬합니다.
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // 둘 다 rank 0인 경우 : firstarr에 있으므로 인덱스 순서대로 정렬
      if (rankA === 0) {
        return Number(a.lngCode) - Number(b.lngCode);
      }

      // rank가 1 혹은 2인 경우, 추가 정렬 기준이 필요하면 여기에 추가합니다.
      // 예를 들어, lngCode 오름차순으로 정렬하는 식으로 할 수도 있습니다.
      // (여기서는 별도의 추가 기준이 없으므로 0을 반환하여 순서를 그대로 유지)
      return 0;
    });

    if (firstarr.length > 0 && firstarr[0] !== "") {
      for (var i = 0; i < firstarr.length; i++) {
        const change = dupliarr.find((item) => item.lngCode == firstarr[i]);
        //comsole.log(dupliarr);
        if (change) {
          change.checkbox = true;
        }
      }
    }

    clickrowData2.value = JSON.parse(JSON.stringify(dupliarr));
  }
  try {
    const response = await axios.get(
      `https://www.pncapi.kr/MenuImage/Image/${fileName.value}?v=${Date.now()}`
    );
    await nextTick();
    console.log(response);
    uploadImage.value.name = newvalue[31];
    fileSize.value = response.headers["content-length"];

    afterClick.value = false;
    setSubCd3();
  } catch (error) {
    //comsole.log("사진없음");
    uploadImage.value = { name: "" };
    fileSize.value = "";
  } finally {
    afterClick.value = false;
  }
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (e) => {
  changeRow.value = e;
};
/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  groupCd.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  ////console.log(newValue);
  if (newValue == "-1") {
    afterSearch.value = false;
    afterClick.value = true;
    gridvalue3.value = "";
    initAll();
    return;
  }
  if (nowStoreCd.value != newValue) {
    afterSearch.value = false;
    afterClick.value = true;
    gridvalue3.value = "";
    initAll();
  }
  if (store.state.userData.lngCommonMenu == "1") {
    nowStoreCd.value = 0;
  } else {
    nowStoreCd.value = newValue;
  }

  searchButton();
};
const clickmappingData = ref([]);
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
/**
 * 조회 상태 초기화
 */
/**
 * 조회 상태 초기화
 */

const searchinit = (newvalue) => {
  afterSearch.value = false;
};
/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  items.value = [];
  forsearchMain.value = "-1";
  forsearchSub.value = "-1";
  afterSearch.value = false;
  searchword1.value = "";
  afterSearch.value = false;
};

const confirmData = ref([]);
const optionGroup = ref([]);
const subTitle = ref([]);
const menuOrderOption = ref([]);
const menuOptionCode = ref([]);

/**
 * 	조회버튼  처리 함수 (그리드 데이터 조회)
 */
/**
 *  조회 함수
 */

const searchButton = async () => {
  items.value = [];
  //comsole.log(nowStoreCd.value);
  if (nowStoreCd.value == -1) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  //comsole.log(groupCd.value, nowStoreCd.value);
  store.state.loading = true;
  try {
    initAll();
    clickrowData2.value = [];
    rowData.value = [];
    rowData3.value = [];
    filteredrowData3.value = [];
    rowData.value = [...rowData.value];
    filteredrowData3.value = [...filteredrowData3.value];

    const res = await getMenuCodeEnroll(groupCd.value, nowStoreCd.value);

    rowData.value = res.data.MENULIST;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    MENUDEPEND.value = res.data.MENUDEPEND;
    subTitle.value = res.data.SUBTITLE;
    menuOrderOption.value = res.data.MENUORDEROPTION;
    menuOptionCode.value = res.data.MENUOPTIONCODE;
    confirmData.value = JSON.parse(JSON.stringify(rowData.value));

    optionGroup.value = res.data.OPTIONGROUP;
    tempRowData2.value = res.data.PAYCD;
    ////console.log(nowStoreCd.value);
    const res2 = await getMenuList(groupCd.value, nowStoreCd.value);
    //rowData2.value = res2.data.menuList
    SubMenuGroup.value = res2.data.submenuGroup;
    MenuGroup.value = res2.data.menuGroup;
    //  //comsole.log(res)
    ////console.log(res2);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    approveType.value = Array.from(
      new Set(
        approveGroup.value.map((item) =>
          JSON.stringify({
            strDCode1: item.strDCode1,
            strDName1: item.strDName1,
          })
        )
      )
    )
      .map((item) => JSON.parse(item))
      .sort((a, b) => a.strDCode1 - b.strDCode1); // 다시 객체로 변환

    store.state.loading = false; // 로딩 상태 종료

    afterSearch.value = true;
    initFocus.value = !initFocus.value;
    initSelect.value = !initSelect.value;

    afterClick.value = true;
    uploadImages.value = [];
    uploadImagesCd.value = [];
  }
};

const searchWord = ref("");
const searchColValue2 = ref("");
const searchC1 = ref(-1);
const searchC2 = ref(-1);

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const changeInfo = (e) => {
  const tagName = e.target.name;
  let value2 = e.target.value;
  if (tagName.includes("lngPrice")) {
    let val = value2.replace(/[^0-9]/g, "");
    value2 = val;

    gridvalue10.value = value2.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (tagName.includes("lngDiscount")) {
    let val = value2.replace(/[^0-9]/g, "");
    value2 = val;

    gridvalue14.value = val;
  }

  if (tagName.includes("lngType")) {
    changeColid.value = "lngType";
    changeValue2.value = 0;
    changeValue2.value += gridvalue34.value == true ? 1 : 0;
    changeValue2.value += gridvalue35.value == true ? 2 : 0;
    changeValue2.value += gridvalue36.value == true ? 4 : 0;
    changeValue2.value += gridvalue37.value == true ? 8 : 0;

    changeNow.value = !changeNow.value;
    return;
  }
  changeColid.value = tagName;
  changeValue2.value = value2;
  changeNow.value = !changeNow.value;
};
const searchColValue3 = ref("0,0");
const filteredSubMenuGroup = ref([]);
const searchValue = ref([-1, -1]);
/**
 * 조회 조건 설정
 */
const setSubCd = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  if (name == "lngMainGroup") {
    //comsole.log(SubMenuGroup.value);
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(
      (item) => item.sublngMajor == forsearchMain.value
    );
    forsearchSub.value = "-1";
    forsearchMain.value = value;
    searchValue.value = [value, forsearchSub.value];
  } else {
    forsearchSub.value = value;
    searchValue.value = [forsearchMain.value, value];
  }
};

const filteredSubMenuGroup2 = ref([]);
const setSubCd3 = () => {
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == gridvalue1.value
  );

  //gridvalue2.value = '0'

  //searchColValue3.value = gridvalue1.value+',0'
};
const setSubCd4 = () => {
  //comsole.log(SubMenuGroup.value);
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(
    (item) => item.sublngMajor == gridvalue1.value
  );

  gridvalue2.value = "0";

  //searchColValue3.value = gridvalue1.value+',0'
};

const searchMenuList = (e) => {
  searchWord.value = e.target.value;
  hideRow.value = e.target.value;
  isNew.value = false;
  afterClick.value = true;
};
const changeColid = ref("checkedMenu");
const changeValue2 = ref("");
const changeRow = ref();
const changeNow = ref(false);

/**
 * 체크된 데이터 갱신
 */

/**
 * 체크된 값 데이터 세팅
 */
/**
 * 체크된 데이터 갱신
 */

const checkedRowData2 = (e) => {
  changeColid.value = "strAmtCodeList";
  //comsole.log(updateRow.value);
  //comsole.log(e);
  changeValue2.value = e
    .filter((item) => item.lngMenu !== "0")
    .map((item2) => Number(item2.lngCode))
    .join(";");

  //changeValue2.value = e.changeRow.value = rowIndex.value;
  changeNow.value = !changeNow.value;
  //comsole.log(e);
};

const searchWord3 = ref();

const addrowProp = ref();
const addrowDefault = ref();
const addrowSeq = ref(1);
const clickaddrowSeq = ref();
/**
 * 그리드 행 추가 버튼 함수
 */
/**
 * 추가 버튼 함수
 */

const addRow = () => {
  const length = updateDeleteInsertrowIndex.value.created.length;
  if (length == 0) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-CA");
    addrowProp.value =
      "lngMainGroup,lngSubGroup,dtmFromDate,dtmToDate,strName,lngPrice,lngTax,blnInactive,strAmtCodeList,lngDCPrice,lngChain,blnDCPriceYN,lngDiscount,intCustCount,lngOrder,blnReceipt,lngMenuOption,blnRedPrint,strIcon,blnKitSingle,lngSubTitle,blnServing,blnOpen,blnDeliveryYN";
    addrowDefault.value =
      "0,0," +
      formattedDate +
      "," +
      "9999-12-31" +
      "," +
      "" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "" + // lngChain
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "" +
      "," +
      "0" +
      "," +
      "" +
      "," +
      "0" +
      "," +
      "0" +
      "," +
      "0";

    //comsole.log(addrowProp.value);
    addRow4.value = !addRow4.value;
    addrowSeq.value++;
    rowData.value.push({
      new: true,
      sequence: "new" + addrowSeq.value,
      lngStoreCode: nowStoreCd.value,
      strName: undefined,
      lngCode: undefined,
      blnInactive: undefined,
    });
    clickaddrowSeq.value = "new" + addrowSeq.value;
  }
};
/**
 * 그리드 행 삭제 버튼 함수
 */
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = () => {
  deleteRow3.value = !deleteRow3.value;
};

watch(gridvalue9, () => {
  const selectedCode = gridvalue9.value;
  if (selectedCode == "") {
    filteredapproveType.value = [];
    return;
  }
  filteredapproveType.value = approveGroup.value.filter(
    (item) => item.strDCode1 == selectedCode
  );
});

/**
 *  저장 버튼 함수
 */

const saveButton = () => {
  //comsole.log(updateRow.value);
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (
    updateDeleteInsertrowIndex.value.deleted.length +
      updateDeleteInsertrowIndex.value.created.length +
      updateDeleteInsertrowIndex.value.updated.length ==
    0
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  console.log(updateRow.value);
  const validateRow = updateRow.value.filter(
    (item) =>
      (item.lngCode === "" && isNewAutoMenuCode.value == false) ||
      item.lngCode === undefined ||
      item.strName === "" ||
      item.strName === undefined ||
      item.lngMainGroup === undefined ||
      item.lngMainGroup == 0 ||
      item.lngSubGroup === undefined ||
      item.lngSubGroup == 0 ||
      item.dtmToDate === undefined ||
      item.dtmFromDate === undefined ||
      item.lngPrice === undefined ||
      item.blnInactive === undefined ||
      item.lngTax === undefined ||
      item.lngKPG === ""
  ).length;

  if (validateRow > 0) {
    Swal.fire({
      title: "경고",
      text: "미입력된 필수값이 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const validateRow2 =
    new Set(updateRow.value.map((item) => item.lngCode)).size ==
    updateRow.value.map((item) => item.lngCode).length;

  if (validateRow2 == false) {
    Swal.fire({
      title: "경고",
      text: "중복된 메뉴코드가 존재합니다. 확인해주세요.",
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
        const deletedRow = updateRow.value.filter((_, index) =>
          updateDeleteInsertrowIndex.value.deleted.includes(index)
        );
        const updatedAndInsertRow = updateRow.value.filter(
          (_, index) =>
            updateDeleteInsertrowIndex.value.updated.includes(index) ||
            updateDeleteInsertrowIndex.value.created.includes(index)
        );

        //console.log(updatedAndInsertRow);
        //comsole.log(updateDeleteInsertrowIndex.value);
        //comsole.log(updatedAndInsertRow);
        const filterAndMap = (key) =>
          updatedAndInsertRow.map((item) => item[key]).join("\u200B");

        const deleteCd = deletedRow.map((item) => item.lngCode);

        //comsole.log(updatedAndInsertRow);
        //comsole.log(deleteCd.join(","));
        //comsole.log(filterAndMap("lngMainGroup"));

        const res = await saveMenuCode(
          groupCd.value,
          nowStoreCd.value,
          filterAndMap("lngMainGroup"),
          filterAndMap("lngSubGroup"),
          filterAndMap("lngCode"),
          filterAndMap("dtmFromDate"),
          filterAndMap("dtmToDate"),
          filterAndMap("strName"),
          filterAndMap("strNameE"),
          filterAndMap("lngDCPrice"),
          filterAndMap("lngChain"),
          filterAndMap("lngPrice"),
          filterAndMap("blnDCPriceYN"),
          filterAndMap("lngTax"),
          filterAndMap("blnInactive"),
          filterAndMap("lngDiscount"),
          filterAndMap("intCustCount"),
          filterAndMap("blnCondimentprice"),
          filterAndMap("lngOrder"),
          filterAndMap("lngKPG"),
          filterAndMap("strBarCode"),
          filterAndMap("blnReceipt"),
          filterAndMap("lngMenuOption"),
          filterAndMap("blnRedPrint"),
          filterAndMap("strIcon"),
          filterAndMap("blnKitSingle"),
          filterAndMap("lngSubTitle"),
          filterAndMap("blnServing"),
          filterAndMap("blnOpen"),
          filterAndMap("blnDeliveryYN"),
          filterAndMap("strNutrInfo"),
          filterAndMap("strCntryOrg"),
          filterAndMap("strMenuComment"),
          filterAndMap("strAmtCodeList"),
          filterAndMap("strUserFileName"),
          filterAndMap("lngType"),
          filterAndMap("dtmStart"),
          filterAndMap("dtmEnd"),
          filterAndMap("lngKDS"),
          filterAndMap("strNameK"),
          filterAndMap("discountYN"),
          filterAndMap("strBigo"),
          isNewAutoMenuCode.value == true ? 1 : 0,
          deleteCd.join(",")
        );
        console.log(res);
        //console.log(res);

        //comsole.log(updatedAndInsertRow);

        //comsole.log(uploadImages.value);
        //comsole.log(updateRow.value);

        const formData = new FormData();

        let storecode = nowStoreCd.value;
        if (store.state.userData.lngCommonMenu == "1") {
          storecode = groupCd.value;
        }

        if (groupCd.value == "1989" || groupCd.value == "1750") {
          storecode = groupCd.value;
        }
        uploadImages.value.forEach((file, index) => {
          const existedName = uploadImagesCd.value[index];

          let newFileName =
            String(storecode).padStart(10, 0) +
            "_" +
            String(existedName).padStart(10, 0) +
            ".jpg";

          console.log(newFileName);
          const newFile = new File([file], newFileName, { type: file.type });
          formData.append(`file${index}`, newFile);
        });

        if (uploadImages.value.length >= 1) {
          try {
            // //console.log(formData);
            const res2 = await uploadFile(formData);
            //comsole.log(res2);
          } catch (error) {
            store.state.loading = false;
          } finally {
            store.state.loading = false;
          }
        }

        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });
        store.state.loading = false;
      } catch (error) {
        //comsole.log(error);

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

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newvalue) => {
  console.log(newvalue);
  updateRow.value = newvalue;
};
const updatedList2 = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData2 = (newvalue) => {
  for (var i = 0; i < newvalue.length; i++) {
    if (newvalue[i].checkbox == true) {
      const findrow = clickrowData2.value.find(
        (item) => item.menuCd == newvalue[i].menuCd
      );
      findrow.checkbox = true;
    } else {
      const findrow = clickrowData2.value.find(
        (item) => item.menuCd == newvalue[i].menuCd
      );
      findrow.checkbox = false;
    }
  }
  clickrowData2.value = [...clickrowData2.value];

  const temp = ref([]);
  for (var i = 0; i < clickrowData2.value.length; i++) {
    if (clickrowData2.value[i].checkbox == true) {
      temp.value.push(clickrowData2.value[i].menuCd);
    }
  }

  const findrow = rowData.value.find(
    (item) => item.lngCode == gridvalue5.value
  );

  if (findrow) {
    findrow.checkedMenu = temp.value.join(",");
  }
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData3 = (newvalue) => {
  for (var i = 0; i < newvalue.length; i++) {
    if (newvalue[i].checkbox == true) {
      const findrow = filteredrowData3.value.find(
        (item) => item.lngCode == newvalue[i].lngCode
      );
      findrow.checkbox = true;
    } else {
      const findrow = filteredrowData3.value.find(
        (item) => item.lngCode == newvalue[i].lngCode
      );
      findrow.checkbox = false;
    }
  }
  filteredrowData3.value = [...filteredrowData3.value];

  const temp = ref([]);
  for (var i = 0; i < filteredrowData3.value.length; i++) {
    if (filteredrowData3.value[i].checkbox != true) {
      temp.value.push(filteredrowData3.value[i].lngCode);
    }
  }

  const findrow = rowData.value.find(
    (item) => item.lngCode == gridvalue5.value
  );

  if (findrow) {
    findrow.unchecklngCode = temp.value.join(",");
  }
};
watch(filteredrowData3, () => {
  changeColid.value = "unchecklngCode";
  //comsole.log(filteredrowData3.value);
  const arr = filteredrowData3.value
    .filter((item) => item.checkbox != true)
    .map((item) => item.lngCode);
  //comsole.log(arr);
  changeValue2.value = arr.join(";");
  if (arr.length > 0) {
    changeNow.value = !changeNow.value;
  }
});
watch(clickrowData2, () => {
  // changeColid.value = 'checkedMenu'
  // const arr = clickrowData2.value.filter(item=> item.checkbox == true ).map(item => item.menuCd)
  // //comsole.log(arr)
  // changeValue2.value = arr.join(',')
  // if(arr.length > 0){
  // changeNow.value = !changeNow.value
  // }
});

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData2 = (e) => {
  const clickedRow = rowData.value.find(
    (item) => item.lngCode == gridvalue3.value.toString()
  );
  if (clickedRow) {
    changeRow.value = rowIndex.value;
    changeColid.value = "strAmtCodeList";

    if (e[0] == undefined || e[0] == false) {
      clickedRow.strAmtCodeList = clickedRow.strAmtCodeList
        .replace(e[1], "")
        .replace(/;;+/g, ";");
      changeValue2.value = clickedRow.strAmtCodeList
        .replace(e[1], "")
        .replace(/;;+/g, ";");
    } else {
      //comsole.log(clickedRow);
      changeValue2.value = clickedRow.strAmtCodeList
        .split(";")
        .filter((item) => item !== "")
        .filter((item) => {
          const finditem = rowData2.value.find(
            (item2) => item2.lngMenu == "0" && item2.lngCode == item
          );
          if (finditem) {
            return false;
          } else {
            return true;
          }
        })
        .concat(e[1])
        .map(Number)
        .sort((a, b) => a - b)
        .map(String)
        .join(";");
    }

    changeNow.value = !changeNow.value;
  }
};

const initFocus = ref(true);

/**
 * 페이지 로딩 시 초기화 (롤백)
 */
/**
 * 페이지 초기화
 */

const initAll = () => {
  selectedMenu.value = 1;
  clickrowData4.value = [];
  filteredrowData5.value = [];
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }

  clickrowData2.value = [];
  updateRow.value = [];
  forsearchMain.value = -1;
  forsearchSub.value = -1;
  searchWord3.value = "";
  searchWord2.value = "";
  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";
  gridvalue6.value = "";
  gridvalue7.value = "";
  gridvalue8.value = "";
  gridvalue9.value = "";
  gridvalue10.value = "";
  gridvalue11.value = "";
  gridvalue12.value = "";
  gridvalue13.value = "";
  gridvalue14.value = "";
  gridvalue15.value = "";
  gridvalue16.value = "";
  gridvalue17.value = "";
  gridvalue18.value = "";
  gridvalue19.value = "";
  gridvalue20.value = "";
  gridvalue21.value = "";
  gridvalue22.value = "";
  gridvalue23.value = "";
  gridvalue24.value = "";
  gridvalue25.value = "";
  gridvalue32.value = "";
  gridvalue33.value = "";

  gridvalue34.value = false;
  gridvalue35.value = false;
  gridvalue36.value = false;
  gridvalue37.value = false;

  gridvalue38.value = "";
  gridvalue39.value = "";
  gridvalue100.value = "";
  gridvalue40.value = "";
  gridvalue41.value = "";
  //initFocus.value = !initFocus.value
  fileName.value = "";
  fileSize.value = "";
  fileName2.value = "";

  isNewAutoMenuCode.value = false;
  isNew.value = false;
  disableMenuAuto.value = true;
  uploadImages.value = [];
  uploadImagesCd.value = [];
};

const searchPayCd = (e) => {
  const value = e.target.value;
  searchWord2.value = value;
};
const uploadImage = ref({ name: "" });
const uploadImages = ref([]);
const uploadImagesCd = ref([]);
const fileSize = ref();
const fileName2 = ref();
const fileDownloadUrl = ref();
const randomuuid = ref();
const maxSize = 2 * 1024 * 1024;
const handleFileUpload = async (e) => {
  if (e.target.files.length == 0) {
    return;
  }
  fileSize.value = e.target.files[0].size;
  if (fileSize.value > maxSize) {
    Swal.fire({
      title: "경고",
      text: "파일 크기가 2MB를 초과합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    e.target.value = "";
    return;
  }
  fileName2.value = e.target.files[0].name;
  console.log(fileName2.value);
  changeColid.value = "strUserFileName";
  changeValue2.value = fileName2.value;
  //comsole.log(changeValue2.value);
  changeNow.value = !changeNow.value;

  const file = e.target.files[0];
  uploadImage.value = new File([file], changeValue2.value, { type: file.type });
  uploadImages.value.push(uploadImage.value);
  uploadImagesCd.value.push(gridvalue3.value);
  //comsole.log(uploadImages.value);
};

const downloadFile = async () => {
  ////console.log(store.state.StoreToken);
  try {
    const response = await axios.get(
      `https://www.pncapi.kr/MenuImage/Image/${fileName.value}`,
      {
        responseType: "blob", // 응답을 Blob 형태로 받음
      }
    );

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${fileName.value}`; // 다운로드 파일명 설정
    downloadLink.click();

    // 다운로드 후 Blob URL 해제
    window.URL.revokeObjectURL(url);
  } catch (error) {
    ////console.log(error);
    Swal.fire({
      title: "오류",
      text: "파일 다운로드 실패",
      icon: "error",
      confirmButtonText: "확인",
    });
  }
};

// const handleImageError = (e) => {
//   e.target.src = "http://211.238.145.30:8085/images/noimage2.png";
// };

const disabledKPG = ref(true);
const disableKPG = (e) => {
  const kpg = e.target.value;
  if (kpg == 1) {
    disabledKPG.value = true;
    showKPG.value = true;
  } else {
    disabledKPG.value = false;
    showKPG.value = true;
    gridvalue18.value = "1";
    changeColid.value = "lngKPG";
    changeValue2.value = "1";
    changeNow.value = !changeNow.value;
  }
};
const showKPG = ref(true);
const resetKPG = (e) => {
  if (e.target.value == "1" || e.target.value == "99") {
    showKPG.value = true;
  } else {
    showKPG.value = false;
  }
};

const showPopUp = ref(false);
const rowData4 = ref([]);
const rowData5 = ref([]);
/**
 * 할인설정복사 팝업
 */

const copyButton2 = async () => {
  const res = await getAmountListByMenuCode(groupCd.value, gridvalue3.value);
  rowData4.value = res.data.List;
  rowData5.value = res.data.List2;
  showPopUp.value = true;
};
/**
 * 할인설정복사 팝업 - 복사 함수
 */

const copyButton = async () => {
  if (selectedMenuCd.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "복사할 메뉴코드를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await copyMenuListByCode(
      groupCd.value,
      gridvalue3.value,
      selectedMenuCd.value.join("\u200b")
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "복사를 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: `복사에 실패하였습니다. ${res.data.RESULT_NM}`,
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const closePopUp = () => {
  showPopUp.value = false;
};

const searchWord5 = ref("");

const selectedMenuCd = ref([]);
/**
 * 체크된 데이터 갱신
 */

const checkedRowData5 = (e) => {
  selectedMenuCd.value = e.map((item) => item.menuCd);
};

const movePage = () => {
  if (
    store.state.minorCategory.filter((item) =>
      item.strUrl.includes("MIMASTER::MST44_064INS.xml")
    ).length +
      store.state.minorCategory.filter((item) =>
        item.strUrl.includes("MIMASTER::MST44_062INS.xml")
      ).length ==
    2
  ) {
    return;
  }
  if (
    store.state.minorCategory.filter((item) =>
      item.strUrl.includes("MIMASTER::MST44_064INS.xml")
    ).length > 0
  ) {
    store.state.moveOtherTab = {
      strUrl: "MIMASTER::MST44_064INS.xml",
      lngProgramID: 744064,
      strTitle: "주방출력관리",
    };
  } else if (
    store.state.minorCategory.filter((item) =>
      item.strUrl.includes("MIMASTER::MST44_062INS.xml")
    ).length > 0
  ) {
    store.state.moveOtherTab = {
      strUrl: "MIMASTER::MST44_062INS.xml",
      lngProgramID: 744062,
      strTitle: "출력관리",
    };
  }
  // store.state.moveOtherTab = {
  //   strUrl: "MIMASTER::MST01_033INS.xml",
  //   lngProgramID: 73762,
  //   strTitle: "메뉴 코드 등록.",
  // };
};

const exporttoExcel = ref(false);
const documentTitle = ref("");
const excelButton = () => {
  documentTitle.value = "메뉴코드";
  exporttoExcel.value = !exporttoExcel.value;
};
</script>

<style scoped></style>
