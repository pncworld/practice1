<!-- /*--############################################################################
# Filename : MST36_001INS.vue                                                  
# Description : 마스터관리 > 매장 마스터 > 결제 코드 등록                      
  # Date :2025-05-14                                                           
  # Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName> </PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save w-auto">저장</button>
    </div>
  </div>
  <br />
  <div
    class="absolute z-50 inset-0 bg-black bg-opacity-50 w-full h-full"
    v-if="discountMenuShow">
    <div class="fixed top-[30%] left-[30%] h-[50%] w-[50%] bg-white rounded-lg">
      <div
        class="grid grid-rows-[1fr,11fr,1fr] grid-cols-1 text-xl p-5 font-semibold">
        <div class="flex justify-between">
          <div>할인대상메뉴 복사</div>
          <div>
            <button class="button primary" @click="copyButton">복사</button>
          </div>
        </div>
        <div class="grid grid-rows-1 grid-cols-2 space-x-3">
          <div class="grid grid-rows-[1fr,3fr,7fr]">
            <div class="flex justify-start text-base">기준 결제코드</div>
            <div class="grid grid-rows-2 grid-cols-[1fr,3fr] text-sm h-20">
              <div
                class="bg-gray-100 flex justify-center items-center rounded-tl-lg border border-gray-600">
                결제코드
              </div>
              <div
                class="flex justify-center items-center border border-gray-600 rounded-tr-lg p-1">
                <input
                  type="text"
                  v-model="gridvalue5"
                  disabled
                  class="h-full w-full p-1" />
              </div>
              <div
                class="bg-gray-100 flex justify-center items-center rounded-bl-lg border border-gray-600">
                결제코드명
              </div>
              <div
                class="flex justify-center items-center border border-gray-600 rounded-br-lg p-1">
                <input
                  type="text"
                  v-model="gridvalue3"
                  disabled
                  class="h-full w-full p-1" />
              </div>
            </div>
            <div>
              <Realgrid
                :progname="'MST36_001INS_VUE'"
                :progid="4"
                :rowData="rowData4"
                :setStateBar="false"
                :rowStateeditable="false">
              </Realgrid>
            </div>
          </div>
          <div class="grid grid-rows-[1fr,1fr,7fr]">
            <div class="text-base flex justify-start">대상 결제코드 선택</div>
            <div class="grid grid-rows-1 grid-cols-[2fr,3fr] text-sm h-8">
              <div class="text-sm flex justify-center items-center">
                결제코드/결제코드명
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
                :progid="5"
                :showCheckBar="true"
                :setStateBar="false"
                :rowStateeditable="false"
                :rowData="rowData5"
                :searchColId="'lngCode,strName'"
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
      :hidesub="false"
      :hideAttr="false"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"></PickStore>
  </div>
  <!-- 조회 조건 -->
  <!-- 그리드 데이터 부분 -->
  <div class="grid grid-rows-1 grid-cols-[4fr,5fr] h-[86%] w-full">
    <div class="flex flex-col w-full h-full">
      <div
        class="flex justify-between mt-5 ml-10 w-full border-b border-b-gray-300">
        <div class="flex justify-start font-bold text-xl">결제코드 목록</div>
        <div class="mt-3 space-x-2">
          <button class="whitebutton" @click="addRow" :disabled="!afterSearch">
            추가
          </button>
          <button
            class="whitebutton"
            @click="deleteRow"
            :disabled="!afterSearch">
            삭제
          </button>
        </div>
      </div>

      <div class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
        <div class="customtableIndex border border-gray-400 rounded-tl-lg">
          사용여부
        </div>
        <div class="grid grid-rows-1 grid-cols-3 justify-center items-center">
          <div class="border border-gray-400 h-full">
            <select
              name="blnInactive"
              id=""
              class="flex-1 border rounded-lg w-full h-full pl-1"
              @change="searchColumn"
              v-model="searchC1">
              <option value="-1">전체</option>
              <option value="0">사용</option>
              <option value="1">미사용</option>
            </select>
          </div>
          <div class="customtableIndex border border-gray-400">결제구분</div>
          <div class="border border-gray-400 h-full rounded-tr-lg">
            <select
              name="payDistinct"
              id=""
              class="flex-1 border rounded-lg w-full h-full pl-1"
              @change="searchColumn"
              v-model="searchC2">
              <option value="-1">전체</option>
              <option value="1">할인</option>
              <option value="2">지불</option>
              <option value="3">할증</option>
            </select>
          </div>
        </div>

        <div class="customtableIndex border border-gray-400 rounded-bl-lg">
          결제코드/명
        </div>
        <div class="px-1 py-1 border border-gray-300 rounded-br-lg">
          <input
            type="text"
            class="border w-full h-full px-1 border-gray-400 rounded-lg"
            @input="searchword"
            v-model="searchWord" />
        </div>
      </div>
      <div class="ml-10 mt-1 w-full h-full">
        <Realgrid
          class="w-full h-[58vh]"
          :progname="'MST36_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :showCheckBar="false"
          :searchColId="'lngCode,strName'"
          :searchColId3="['blnInactive', 'payDistinct']"
          :searchValue="searchValue"
          :searchWord3="searchWord"
          @clickedRowData="clickedRowData"
          :selectionStyle="'singleRow'"
          @selcetedrowData="selcetedrowData"
          :labelsData="labelsData"
          :valuesData="valuesData"
          :labelingColumns="labelingColumns"
          :defaultSearchAllValue="-1"
          :changeNow2="changeNow"
          :changeValue2="changeValue2"
          :changeColid="changeColid"
          :changeRow="changeRow"
          @selectedIndex="selectedIndex"
          :initSelect="true"
          :addRow4="addRow4"
          :deleteRow6="deleteRow3"
          :addrowDefault="addrowDefault"
          :addrowProp="addrowProp"
          @updatedRowData="updatedRowData"
          @allStateRows="allStateRows"
          :rowStateeditable="false"
          :addField="'new'">
        </Realgrid>
        <!-- :searchWord="searchWord" :searchColId2="'blnInactive,payDistinct'" :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" -->
      </div>
    </div>
    <!-- 그리드 데이터 부분 -->
    <!-- 연동 데이터 부분 -->
    <div class="grid grid-cols-1 grid-rows-[1fr,9fr] ml-24 w-[40vw]">
      <div class="flex space-x-1 mt-10">
        <button
          class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border"
          @click="selectMenu(1)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 1 }">
          기본설정
        </button>
        <button
          class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border disabled:bg-gray-50 disabled:text-gray-200"
          @click="selectMenu(2)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 2 }"
          :disabled="selectedPayDistinct">
          할인대상메뉴
        </button>
        <button
          class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border disabled:bg-gray-50 disabled:text-gray-200"
          @click="selectMenu(3)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 3 }"
          :disabled="selectedMultiple">
          복합결제허용
        </button>
      </div>
      <div>
        <hr class="w-[90%] mt-0" />
        <div v-show="selectedMenu == 1" class="mt-3 h-[46%]">
          <div class="font-bold flex justify-start text-xl">기본정보</div>
          <div
            class="grid grid-cols-[1fr,3fr,1fr,3fr] grid-rows-[1fr,2fr,1fr] mt-5 border rounded-lg w-[90%] h-[55%]">
            <div class="flex justify-center items-center bg-gray-100 border">
              결제구분
            </div>
            <div class="flex justify-center items-center border">
              <select
                name=""
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue1"
                disabled>
                <option value="0">선택</option>
                <option value="1">할인</option>
                <option value="2">지불</option>
                <option value="3">할증</option>
              </select>
            </div>
            <div class="flex justify-center items-center bg-gray-100 border">
              결제유형
            </div>
            <div class="flex justify-center items-center border">
              <select
                name=""
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                disabled></select>
            </div>

            <div class="justify-center items-center bg-gray-100 border grid">
              <div>결제코드명</div>
            </div>
            <div class="grid grid-cols-1 grid-rows-2 h-full border">
              <div class="flex items-center mt-1 text-blue-400 font-semibold">
                *국문<input
                  type="text"
                  name="strName"
                  id=""
                  class="h-full w-[80%] border rounded-lg pl-2 ml-2 font-semibold text-gray-700 disabled:bg-gray-200"
                  v-model="gridvalue3"
                  @input="changeInfo"
                  :disabled="afterClickrow" />
              </div>
              <div class="flex items-center mt-1 ml-1">
                영문<input
                  type="text"
                  name="strNameE"
                  id=""
                  class="h-full w-[80%] border rounded-lg pl-2 ml-3 disabled:bg-gray-200"
                  v-model="gridvalue4"
                  @input="changeInfo"
                  :disabled="afterClickrow" />
              </div>
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex flex-col">
              <div
                class="border h-full w-full flex items-center justify-center text-blue-400 font-semibold">
                *결제코드
              </div>
              <div
                class="border h-full w-full flex items-center justify-center text-blue-400 font-semibold">
                *사용여부
              </div>
            </div>
            <div class="grid grid-cols-1 grid-rows-2">
              <div>
                <input
                  type="text"
                  name="lngCode"
                  id=""
                  class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                  v-model="gridvalue5"
                  @input="changeInfo"
                  :disabled="!(isNew == true && afterClickrow == false)" />
              </div>
              <div
                class="space-x-5 border flex justify-left pl-2 items-center disabled:bg-gray-200"
                :disabled="afterClickrow">
                <label for="using1"
                  ><input
                    type="radio"
                    name="blnInactive"
                    id="using1"
                    v-model="gridvalue6"
                    value="0"
                    @change="changeInfo"
                    :disabled="afterClickrow" />예</label
                ><label for="using2"
                  ><input
                    type="radio"
                    name="blnInactive"
                    id="using2"
                    v-model="gridvalue6"
                    value="1"
                    @change="changeInfo"
                    :disabled="afterClickrow" />아니오</label
                >
              </div>
            </div>
            <div class="flex justify-center items-center bg-gray-100 border">
              할인그룹
            </div>
            <div class="flex justify-center items-center border">
              <select
                name=""
                id=""
                class="border h-full w-full rounded-lg pl-2 bg-gray-200"
                v-model="gridvalue2"
                disabled>
                <option value="">선택</option>
                <option :value="i.lngValue" v-for="i in disCountGroup">
                  [{{ i.lngCode }}]{{ i.strName }}
                </option>
              </select>
            </div>
            <!-- <div class="flex justify-center items-center bg-gray-100 border">결제그룹</div>
          <div class="flex justify-center items-center"><select name="" id="" class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" disabled>
      <option value="">선택</option>
  
    </select></div> -->

            <div class="justify-center items-center bg-gray-100 border grid">
              유효기간
            </div>
            <div class="flex justify-center items-center border">
              <input
                type="date"
                max="9999-12-31"
                v-model="gridvalue7"
                name="dtmFromDate"
                @input="changeInfo"
                :disabled="afterClickrow"
                class="disabled:bg-gray-200" />
              ~
              <input
                type="date"
                max="9999-12-31"
                v-model="gridvalue8"
                name="dtmToDate"
                @input="changeInfo"
                :disabled="afterClickrow"
                class="disabled:bg-gray-200" />
            </div>

            <!-- <div class="justify-center items-center bg-gray-100 border flex text-blue-400 font-semibold">*승인구분</div>
          <div><select name="" id="" v-model="gridvalue9" class="h-full w-full rounded-lg pl-2" @change="setSub">
            <option value="">선택</option>
            <option :value="i.strDCode1" v-for="i in approveType">[{{ i.strDCode1 }}]{{i.strDName1}}</option>
          </select></div> -->
            <!-- <div class="justify-center items-center bg-gray-100 border flex text-blue-400 font-semibold">*승인유형</div>
          <div><select name="" id="" v-model="gridvalue10" class="h-full w-full rounded-lg pl-2">
            <option value="">선택</option>
            <option :value="i.strDCode2" v-for="i in filteredapproveType">[{{ i.strDCode2 }}]{{i.strDName2}}</option>
          </select></div> -->
          </div>
          <div class="font-bold text-xl flex justify-start mt-5">부가정보</div>
          <div
            class="grid grid-cols-[1fr,3fr,1fr,3fr] grid-rows-8 h-full mt-3 w-[90%]">
            <div
              class="justify-center items-center bg-gray-100 border flex rounded-tl-lg">
              할인방법
            </div>
            <div class="space-x-5 flex items-center border justify-left pl-2">
              <label for="discount1"
                ><input
                  type="radio"
                  id="discount1"
                  name="lngRate"
                  v-model="gridvalue11"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />금액</label
              ><label for="discount2"
                ><input
                  type="radio"
                  id="discount2"
                  name="lngRate"
                  v-model="gridvalue11"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />비율</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              할인금액(비율)
            </div>
            <div class="flex justify-center items-center">
              <input
                type="number"
                name="lngAmt"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue12"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              자동계산
            </div>
            <div class="space-x-5 flex items-center border justify-left pl-2">
              <label for="autopay1"
                ><input
                  type="radio"
                  id="autopay1"
                  name="blnAuto"
                  v-model="gridvalue13"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />예</label
              ><label for="autopay2"
                ><input
                  type="radio"
                  id="autopay2"
                  name="blnAuto"
                  v-model="gridvalue13"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              할인한도금액
            </div>
            <div class="flex justify-center items-center">
              <input
                type="number"
                name="lngDiscAmtLimit"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue14"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              돈통오픈
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="openmoney1"
                ><input
                  type="radio"
                  id="openmoney1"
                  name="blnDrawer"
                  v-model="gridvalue15"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />예</label
              ><label for="openmoney2"
                ><input
                  type="radio"
                  id="openmoney2"
                  name="blnDrawer"
                  v-model="gridvalue15"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              계산우선순위
            </div>
            <div class="flex justify-center items-center">
              <input
                type="number"
                name="lngPrior"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue16"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              영수증출력
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="receipt1"
                ><input
                  type="radio"
                  id="receipt1"
                  name="blnReceipt"
                  v-model="gridvalue17"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />예</label
              ><label for="receipt2"
                ><input
                  type="radio"
                  id="receipt2"
                  name="blnReceipt"
                  v-model="gridvalue17"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />아니오</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              잔금반환비율
              <div class="relative group inline-block">
                <button class="size-3 flex justify-center items-center">
                  <img src="../../assets/circle-question-regular.svg" alt="" />
                </button>
                <div
                  class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap z-10">
                  잔금반환비율에 대한 설명입니다.
                </div>
              </div>
            </div>
            <div class="flex justify-center items-center">
              <input
                type="text"
                name="lngChangeRateLimit"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue18"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              할인대상메뉴
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="discountfor1"
                ><input
                  type="radio"
                  id="discountfor1"
                  name="lngMenu"
                  v-model="gridvalue19"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />전체 선택</label
              ><label for="discountfor2"
                ><input
                  type="radio"
                  id="discountfor2"
                  name="lngMenu"
                  v-model="gridvalue19"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />부분 선택</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              품목할인설정
            </div>
            <div class="flex justify-center items-center">
              <select
                name="lngDiscType"
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue20"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in itemDiscount">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              중복결제
            </div>
            <div class="space-x-5 flex justify-left pl-2 items-center border">
              <label for="allow1"
                ><input
                  type="radio"
                  id="allow1"
                  name="blnDuplicate"
                  v-model="gridvalue21"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />허용</label
              ><label for="allow2"
                ><input
                  type="radio"
                  id="allow2"
                  name="blnDuplicate"
                  v-model="gridvalue21"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClickrow"
                  class="disabled:bg-gray-200" />비허용</label
              >
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              크롤링결제코드
            </div>
            <div class="flex justify-center items-center">
              <select
                name=""
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                disabled>
                <option value="">선택</option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              단수처리방법
            </div>
            <div class="flex justify-center items-center">
              <select
                name="lngRoundType"
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue22"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in rounding">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              단수처리자릿수
            </div>
            <div>
              <input
                type="number"
                name="lngRound"
                id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue23"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>
            <div
              class="justify-center items-center bg-gray-100 border flex rounded-bl-lg">
              세금계산방법
            </div>
            <div class="flex justify-center items-center">
              <select
                name="lngTax"
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue24"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in taxs">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">
              결제옵션
            </div>
            <div class="flex justify-center items-center">
              <select
                name="strIcon"
                id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200"
                v-model="gridvalue25"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in payOptions">
                  [{{ i.strDCode }}] {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="h-[50vh] w-[40vw]" v-show="selectedMenu == 2">
          <div class="flex justify-between mt-3 w-full">
            <div class="font-bold text-xl">메뉴 목록</div>
            <div>
              <button class="whitebutton" @click="showPopUp">
                할인대상메뉴복사
              </button>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
            <div class="customtableIndex border border-gray-400 rounded-tl-lg">
              메뉴분류
            </div>
            <div class="border border-gray-300 rounded-tr-lg flex p-1">
              <select
                name="majorGroupCd"
                id=""
                class="flex-1 border rounded-lg w-full h-full"
                @change="setSubCd"
                v-model="forsearchMain">
                <option value="-1">전체</option>
                <option :value="i.GroupCd" v-for="i in MenuGroup">
                  [{{ i.GroupCd }}]{{ i.majorGroupNm }}
                </option>
              </select>
              <select
                name="subGroupCd"
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
                v-model="searchWord2" />
            </div>
          </div>

          <Realgrid
            class="w-full h-[50vh] mt-5"
            :progname="'MST36_001INS_VUE'"
            :progid="2"
            @realgridname="realgridname"
            :rowData="clickrowData2"
            @clickedRowData="clickedRowData2"
            :initCheckColumn="initCheckColumn"
            :initCheckValue="initCheckValue"
            :initCheckAct="initCheckAct"
            :searchColId="'menuCd,menuNm'"
            :searchWord3="searchWord2"
            :searchColId3="['majorGroupCd', 'subGroupCd']"
            :searchValue="searchValue2"
            @checkedRowData="checkedRowData"
            :initSelect="true"
            :maintaincheckColumn="'menuCd'"
            :rowStateeditable="false"
            :changeNow="changeNow2"
            :changeValue2="changeValue3"
            :changeColid="changeColid2"
            :changeRow="changeRow2"
            :showCheckBar="true"
            :hideColumnsId="['checkbox']"
            @updatedRowData="updatedRowData2"
            @selectedIndex="selectedIndex2"></Realgrid>
          <!-- :searchColId2="'majorGroupCd,subGroupCd'" :searchColId="'menuCd,menuNm'" :searchColValue2="searchColValue3" :searchWord="searchWord2" -->
        </div>
        <div v-show="selectedMenu == 3" class="h-[90%] w-[90%]">
          <div class="grid grid-rows-1 grid-cols-[1fr,4fr] mt-3">
            <div class="customtableIndex border border-gray-400 rounded-lg">
              결제코드/명
            </div>
            <div class="px-1 py-1 border border-gray-300 rounded-br-lg">
              <input
                type="text"
                class="border w-full h-full px-1 border-gray-400 rounded-lg"
                @input="searchMenuList2"
                v-model="searchWord3" />
            </div>
          </div>
          <Realgrid
            class="w-full h-[55vh] mt-5"
            :progname="'MST36_001INS_VUE'"
            :progid="3"
            :rowData="filteredrowData5"
            @realgridname="realgridname2"
            :setAllCheck2="setAllCheck2"
            :searchColId="'lngCode,strName'"
            :searchWord3="searchWord3"
            :uncheckColumn="'lngCode'"
            :uncheckValue="uncheckValue"
            :uncheckAct="uncheckAct"
            :maintaincheckColumn="'lngCode'"
            @checkedRowData="checkedRowData2"
            :showCheckBar="true"
            :hideColumnsId="['checkbox']"
            :rowStateeditable="false"
            @updatedRowData="updatedRowData3"></Realgrid>
          <!-- :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" :searchWord="searchWord3"  -->
        </div>
      </div>
    </div>
  </div>
  <!-- 연동 데이터 부분 -->
</template>

<script setup>
import {
  CopyDiscountMenuList,
  getMenuListIncludeCommon,
  getPayCodeEnrollInfo,
  getPayCodeListbyCode,
  savePayCode,
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
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
/**
 * 	그리드 생성
 */

/**
 *  리얼그리드 라이브러리 호출
 *  */

import RealGrid from "realgrid";
/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const selectedMenu = ref(1);
const selectMenu = (newValue) => {
  selectedMenu.value = newValue;
};
const searchWord5 = ref("");
const searchWord2 = ref("");
const nowStoreCd = ref(0);
const rowData = ref([]);
const filteredrowData = ref([]);
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

/**
 * 페이지 매장 그룹 세팅
 */

const lngStoreGroup = (e) => {
  groupCd.value = e;
};

const lngStoreCode = (e) => {
  //console.log(e);
  nowStoreCd.value = e;
};
const initCheckColumn = ref("menuCd");
const disCountGroup = ref([]);
const approveGroup = ref([]);
const approveType = ref([]);
const filteredapproveType = ref([]);
const initCheckValue = ref("");
const initCheckAct = ref(false);
const uncheckValue = ref();
const uncheckAct = ref(false);
const labelsData = ref([
  ["할인", "지불", "할증", "적립"],
  ["사용", "미사용"],
]);
const valuesData = ref([
  ["1", "2", "3", "4"],
  ["0", "1"],
]);
const discountMenuShow = ref(false);
const rowData4 = ref([]);
const rowData5 = ref([]);
const showPopUp = async () => {
  let checkRowDataArr = clickedrowdata.value.split(",");
  //console.log(rowData2.value);
  rowData4.value = rowData2.value.filter((item) =>
    checkRowDataArr.includes(item.menuCd)
  );

  const res3 = await getPayCodeListbyCode(groupCd.value, gridvalue5.value);
  //console.log(res3);
  //console.log(rowData4.value);
  rowData5.value = res3.data.List;
  store.state.inActiveBackGround = true;
  discountMenuShow.value = true;
};

const closePopUp = () => {
  discountMenuShow.value = false;
};
const realgrid2Name = ref("");
const realgrid3Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  console.log(store.state.userData.lngCommonMenu);

  if (store.state.userData.lngCommonMenu == "1") {
    nowStoreCd.value = 0;
  }
});
// onActivated(() => {
//   const reagrid2 = document.getElementById(realgrid2Name.value);
//   setTimeout(() => {
//     RealGrid.getGridInstance(reagrid2).resetSize();
//     RealGrid.getGridInstance(reagrid2).refresh(true);
//   }, 100);

//   const realgrid3 = document.getElementById(realgrid3Name.value);
//   setTimeout(() => {
//     RealGrid.getGridInstance(realgrid3).resetSize();
//     RealGrid.getGridInstance(realgrid3).refresh(true);
//   }, 100);
// });

watch(selectedMenu, () => {
  const reagrid2 = document.getElementById(realgrid2Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid2).resetSize();
    RealGrid.getGridInstance(reagrid2).refresh(true);
  }, 100);

  const realgrid3 = document.getElementById(realgrid3Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(realgrid3).resetSize();
    RealGrid.getGridInstance(realgrid3).refresh(true);
  }, 100);
});
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
const clickedrowdata = ref([]);
const clickrowData4 = ref([]);
const filteredrowData5 = ref([]);
const afterClickrow = ref(true);
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newvalue) => {
  clickrowData4.value = [];
  filteredrowData5.value = [];

  forsearchMain.value = -1;
  forsearchSub.value = -1;
  searchWord2.value = "";
  searchWord3.value = "";
  if (!(newvalue[4] == "1" && newvalue[6] == "0")) {
    if (selectedMenu.value == 3) {
      selectedMenu.value = 1;
    }
  }

  if (newvalue[4] == "1") {
    if (newvalue[21] != "0") {
    } else {
      if ((selectedMenu.value = 2)) {
        selectedMenu.value = 1;
      }
    }
  } else {
    if (
      newvalue[2] == undefined ? false : newvalue[2].toString().startsWith("24")
    ) {
    } else {
      if ((selectedMenu.value = 2)) {
        selectedMenu.value = 1;
      }
    }
  }
  //console.log(newvalue);
  clickedrowdata.value = newvalue[27];
  gridvalue1.value = newvalue[4];
  gridvalue2.value = newvalue[21];
  gridvalue3.value = newvalue[3];
  gridvalue4.value = newvalue[8];
  gridvalue5.value = newvalue[2];
  gridvalue6.value = newvalue[6];
  gridvalue7.value = newvalue[9];
  gridvalue8.value = newvalue[10];
  gridvalue9.value = newvalue[18];
  gridvalue10.value = newvalue[19];
  gridvalue11.value = newvalue[11];
  gridvalue12.value =
    newvalue[5] != undefined
      ? Number(
          newvalue[5].substring(0, newvalue[5].length - 1).replace(/,/g, "")
        )
      : "";
  gridvalue13.value = newvalue[12];
  gridvalue14.value = newvalue[13];
  gridvalue15.value = newvalue[14];
  gridvalue16.value = newvalue[15];
  gridvalue17.value = newvalue[16];
  gridvalue18.value = newvalue[20];
  gridvalue19.value = newvalue[21];
  gridvalue20.value = newvalue[22];
  gridvalue21.value = newvalue[23];
  gridvalue22.value = newvalue[24];
  gridvalue23.value = newvalue[25];
  gridvalue24.value = newvalue[17];
  gridvalue25.value = newvalue[26];

  if (newvalue[2] == undefined || newvalue[2] == null) {
    selectedPayDistinct.value = true;
  } else if (
    (newvalue[2].toString().startsWith("24") ||
      newvalue[2].toString().startsWith("1")) &&
    newvalue[4] == "1" &&
    newvalue[21] == "1"
  ) {
    selectedPayDistinct.value = false;
  } else {
    selectedPayDistinct.value = true;
  }

  if (newvalue[4] == "1" && newvalue[6] == "0") {
    selectedMultiple.value = false;
  } else {
    selectedMultiple.value = true;
  }

  if (newvalue[30] == true) {
    isNew.value = true;
    clickaddrowSeq.value = rowData.value[newvalue.index].sequence;
  } else {
    isNew.value = false;
  }

  rowData2.value = [...rowData2.value];
  const firstarr = newvalue[27] != undefined ? newvalue[27].split(",") : [];
  if (rowData2.value.length > 0) {
    let dupliarr = JSON.parse(JSON.stringify(rowData2.value));
    dupliarr.sort((a, b) => {
      const aIndex = firstarr.indexOf(a.menuCd);
      const bIndex = firstarr.indexOf(b.menuCd);

      if (aIndex === -1 && bIndex === -1)
        return Number(a.menuCd) - Number(b.menuCd); // 둘 다 우선순위에 없음
      if (aIndex === -1) return 1; // a가 우선순위에 없음
      if (bIndex === -1) return -1; // b가 우선순위에 없음
      return Number(a.menuCd) - Number(b.menuCd); // 우선순위 배열에 따라 정렬
    });
    if (firstarr.length > 0 && firstarr[0] !== "") {
      for (var i = 0; i < firstarr.length; i++) {
        const change = dupliarr.find((item) => item.menuCd == firstarr[i]);
        if (change) {
          change.checkbox = true;
        }
      }
    }

    clickrowData2.value = JSON.parse(JSON.stringify(dupliarr));
    clickrowData4.value = JSON.parse(JSON.stringify(dupliarr));
  }

  if (rowData3.value.length > 0) {
    let multiplearr = rowData3.value
      .filter((item) => item.lngCode != gridvalue5.value)
      .map((item) => ({
        ...item,
        checkbox: true,
      }));
    let secondarr = newvalue[28] != undefined ? newvalue[28].split(";") : [];

    multiplearr.sort((a, b) => {
      const aIndex = secondarr.indexOf(a.lngCode.toString());
      const bIndex = secondarr.indexOf(b.lngCode.toString());

      // 둘 다 secondarr에 포함되지 않으면 순서 유지
      if (aIndex === -1 && bIndex === -1) return 0;

      // a가 secondarr에 없고 b가 있을 경우, a를 뒤로 보냄
      if (aIndex === -1) return -1;

      // b가 secondarr에 없고 a가 있을 경우, b를 뒤로 보냄
      if (bIndex === -1) return 1;

      // 둘 다 secondarr에 있으면, secondarr에 나타나는 순서대로 정렬
      return aIndex - bIndex;
    });
    if (secondarr.length > 0 && secondarr[0] != "") {
      for (var i = 0; i < secondarr.length; i++) {
        const change = multiplearr.find(
          (item) => item.lngCode.toString() == secondarr[i].toString()
        );

        if (change) {
          change.checkbox = false;
        }
      }
    }

    //filteredrowData3.value = [...multiplearr]

    filteredrowData5.value = JSON.parse(JSON.stringify(multiplearr));
    filteredrowData3.value = JSON.parse(JSON.stringify(multiplearr));
  }

  afterClickrow.value = false;
};

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (e) => {
  changeRow.value = e;
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  changeRow2.value = e;
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  //comsole.log(newValue);
  if (newValue == "-1") {
    afterSearch.value = false;
    initAll();
    rowData.value = [];
    rowData2.value = [];
    rowData3.value = [];
    updateRow.value = [];
    filteredrowData5.value = [];
    clickrowData4.value = [];
    afterClickrow.value = true;
    return;
  }
  // nowStoreCd.value = newValue;
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
/**
 *  조회 함수
 */

const searchButton = async () => {
  items.value = [];

  store.state.loading = true;
  try {
    initAll();
    clickrowData2.value = [];
    rowData.value = [];
    rowData3.value = [];
    filteredrowData3.value = [];
    rowData.value = [...rowData.value];
    filteredrowData3.value = [...filteredrowData3.value];
    const res = await getPayCodeEnrollInfo(groupCd.value, nowStoreCd.value);

    rowData.value = res.data.PAYCODE;
    updateRow.value = JSON.parse(JSON.stringify(rowData.value));
    confirmData.value = JSON.parse(JSON.stringify(rowData.value));
    itemDiscount.value = res.data.ITEMDIS;
    payOptions.value = res.data.PAYOPTION;
    clickmappingData.value = res.data.MAPPINGCODE;
    rowData3.value = res.data.MULTIPLE;
    rounding.value = res.data.ROUND;
    taxs.value = res.data.TAX;
    disCountGroup.value = res.data.DISGROUP;
    approveGroup.value = res.data.APPROVE;
    const res2 = await getMenuListIncludeCommon(
      groupCd.value,
      nowStoreCd.value
    );
    console.log(res);
    console.log(res2);
    // //console.log(res2.data.menuList);
    rowData2.value = res2.data.menuList;
    SubMenuGroup.value = res2.data.submenuGroup;
    MenuGroup.value = res2.data.menuGroup;
    //comsole.log(res);
    //comsole.log(res2);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    afterClickrow.value = true;
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
    isNew.value = false;
    forsearchMain.value = "-1";
    forsearchSub.value = "-1";
    searchC1.value = -1;
    searchC2.value = -1;
  }
};

// watch(selectedMenu, () => {
//   const reagrid2 = document.getElementById(realgrid2Name.value);
//   RealGrid.getGridInstance(reagrid2).resetSize();
//   RealGrid.getGridInstance(reagrid2).refresh(true);
//   //comsole.log(RealGrid.getGridInstance(reagrid2));
// });

const searchWord = ref("");
const searchValue = ref([-1, -1]);
const searchC1 = ref(-1);
const searchC2 = ref(-1);

const searchColumn = (e) => {
  const columnNm = e.target.name;
  const value = e.target.value;

  if (columnNm == "blnInactive") {
    searchValue.value = [value, searchC2.value];
  } else {
    searchValue.value = [searchC1.value, value];
  }
};

/**
 *  그리드 검색어 세팅
 */

const searchword = (e) => {
  searchWord.value = e.target.value;
};

/**
 * INPUT , SELECT 수정 데이터 갱신
 */

const changeInfo = (e) => {
  const tagName = e.target.name;
  let value2 = e.target.value;
  //comsole.log(tagName);
  //comsole.log(value2);
  if (tagName == "lngCode") {
    const convert = value2.replace(/[^0-9]/g, "");
    //comsole.log(convert);
    gridvalue5.value = convert;
    value2 = convert;

    changeValue2.value = value2;
    changeColid.value = tagName;
    changeNow.value = !changeNow.value;
    return;
  }
  if (tagName == "lngAmt") {
    if (gridvalue11.value == 0) {
      changeValue2.value = value2 + "원";
      changeColid.value = tagName;
    } else if (gridvalue11.value == 1) {
      changeValue2.value = value2 + "%";
      changeColid.value = tagName;
    }
    changeNow.value = !changeNow.value;
    return;
  }

  changeValue2.value = value2;
  changeColid.value = tagName;
  changeNow.value = !changeNow.value;
  //        const findrow = rowData.value.find(item => item.lngCode == gridvalue5.value)

  //        const findrowlength = rowData.value.filter(item => item.lngCode == gridvalue5.value).length
  //      if(findrow !== undefined && findrowlength ==1){
  //       findrow[tagName] = value2
  //      }  else {
  //       const findrow2 = rowData.value.find(item => item.sequence == clickaddrowSeq.value)

  //       findrow2[tagName] = value2
  //      }
  //        return ;
  //      }

  //      const findrow = rowData.value.find(item => item.lngCode == gridvalue5.value)
  //      //comsole.log(findrow)
  // const findrowlength = rowData.value.filter(item => item.lngCode == gridvalue5.value).length

  // if(findrow !== undefined && findrowlength ==1){
  // findrow[tagName] = value2
  // }  else {

  // const findrow2 = rowData.value.find(item => item.sequence == clickaddrowSeq.value)
  // //comsole.log(changeValue2.value)
  // //comsole.log(changeColid.value)
  // findrow2[tagName] = value2
  // }
  //      changeValue2.value = value2
  //      changeColid.value = tagName
  //      changeNow.value = !changeNow.value
};
const searchColValue3 = ref("0,0");
const filteredSubMenuGroup = ref([]);
const searchValue2 = ref([]);
const setSubCd = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  if (name == "majorGroupCd") {
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(
      (item) => item.sublngMajor == forsearchMain.value
    );
    forsearchSub.value = "-1";
    forsearchMain.value = value;
    searchValue2.value = [value, forsearchSub.value];
  } else {
    forsearchSub.value = value;
    searchValue2.value = [forsearchMain.value, value];
  }

  // filteredSubMenuGroup.value = SubMenuGroup.value.filter(
  //   (item) => item.sublngMajor == forsearchMain.value
  // );

  // forsearchSub.value = "0";

  // searchColValue3.value = forsearchMain.value + ",0";

  // //comsole.log(searchColValue3.value);

  // clickrowData2.value = rowData2.value.filter( item => {
  //   if(forsearchMain.value =='0' ){
  //         return item ;
  //       } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
  //         return  item.majorGroupCd == forsearchMain.value && item.subGroupCd == forsearchSub.value ;
  //       } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
  //         return  item.majorGroupCd == forsearchMain.value
  //       } else {

  //       }

  //   })
};

const searchMenuList = (e) => {
  searchWord2.value = e.target.value;
};
const changeColid = ref("checkedMenu");
const changeValue2 = ref("");
const changeRow = ref();
const changeNow = ref(false);

const changeRow2 = ref();
const changeValue3 = ref(true);
const changeColid2 = ref("checkbox");
const changeNow2 = ref(false);
/**
 * 체크된 데이터 갱신
 */

const checkedRowData = async (e) => {
  const temp = e.map((item) => item.menuCd);
  changeColid.value = "checkedMenu";
  changeValue2.value = temp.join(",");
  changeNow.value = !changeNow.value;

  await nextTick();
};
/**
 * 체크된 데이터 갱신
 */

const checkedRowData2 = async (e) => {
  changeColid.value = "unchecklngCode";
  const arr = e.map((item) => Number(item.lngCode));
  //comsole.log(arr);
  const filtered2 = rowData3.value
    .filter((item) => item.lngCode != gridvalue5.value)
    .filter((item) => !arr.includes(Number(item.lngCode)))
    .map((item) => item.lngCode);
  // //console.log(filtered2);
  // //console.log(arr);
  changeValue2.value = filtered2.join(";");
  changeNow.value = !changeNow.value;

  await nextTick();
};

const forCopyArr = ref([]);
/**
 * 체크된 데이터 갱신
 */

const checkedRowData5 = (e) => {
  //console.log(e);
  forCopyArr.value = e.map((item) => item.lngCode);
};

/**
 * 복사 팝업 - 복사 함수
 */
const copyButton = async () => {
  if (forCopyArr.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "복사할 결제코드가 없습니다.",
    });
    return;
  }
  try {
    store.state.loading = true;
    const res = await CopyDiscountMenuList(
      groupCd.value,
      gridvalue5.value,
      forCopyArr.value.join("\u200B")
    );

    Swal.fire({
      title: "성공",
      text: "복사가 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
  } catch (error) {
  } finally {
    store.state.loading = false;
  }
};

const setAllCheck2 = ref(false);
const searchWord3 = ref();
const searchMenuList2 = (e) => {
  searchWord3.value = e.target.value;
};
const addrowProp = ref();
const addrowDefault = ref();
const addrowSeq = ref(1);
const clickaddrowSeq = ref();

/**
 * 추가 버튼 함수
 */

const addRow = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-CA");
  if (nowStoreCd.value == "0") {
    clickedStoreNm.value = "COMMON";
  }
  addrowDefault.value =
    nowStoreCd.value +
    "," +
    clickedStoreNm.value +
    "," +
    formattedDate +
    "," +
    "9999-12-31" +
    "," +
    "" +
    "," +
    "" +
    "," +
    "" +
    "," +
    "" +
    "," +
    "0";
  addrowProp.value =
    "lngStoreCode,storeName,dtmFromDate,dtmToDate,lngDiscType,lngRoundType,lngTax,strIcon,blnInactive";
  //comsole.log(addrowProp.value);
  addRow4.value = !addRow4.value;
  addrowSeq.value++;
  rowData.value.push({
    new: true,
    sequence: "new" + addrowSeq.value,
    lngStoreCode: nowStoreCd.value,
    strName: undefined,
    lngCode: undefined,
    blnInactive: 0,
  });
  clickaddrowSeq.value = "new" + addrowSeq.value;
};
const deleteOn = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = () => {
  deleteRow3.value = !deleteRow3.value;
  deleteOn.value = true;
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
  //console.log(updateDeleteInsertrowIndex.value);
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (updateDeleteInsertrowIndex.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
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

  const validateRow = updateRow.value
    .filter((item) => item.deleted != true)
    .filter(
      (item) =>
        item.lngCode == "" ||
        item.lngCode == undefined ||
        item.strName == "" ||
        item.strName == undefined ||
        (item.blnInactive != 0 && item.blnInactive != 1)
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
  //comsole.log(rowData.value);
  if (validateRow2 == false) {
    Swal.fire({
      title: "경고",
      text: "중복된 계정코드가 존재합니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  updateRow.value = updateRow.value.map((item) => {
    if (item.payDistinct != "1") {
      item.checkedMenu = ""; // checkedMenu 값을 빈 문자열로 설정
    }
    return item; // 수정된 item을 반환
  });
  const deletedRow = updateRow.value.filter((_, index) =>
    updateDeleteInsertrowIndex.value.deleted.includes(index)
  );
  const updatedAndInsertRow = updateRow.value.filter(
    (_, index) =>
      updateDeleteInsertrowIndex.value.updated.includes(index) ||
      updateDeleteInsertrowIndex.value.created.includes(index)
  );

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
        const lngStoreCodearr = updatedAndInsertRow.map(
          (item) => item.lngStoreCode
        );
        const strNamearr = updatedAndInsertRow.map((item) => item.strName);
        const strNameEarr = updatedAndInsertRow.map((item) => item.strNameE);
        const lngCodearr = updatedAndInsertRow.map((item) => item.lngCode);
        const blnInactivearr = updatedAndInsertRow.map(
          (item) => item.blnInactive
        );
        const dtmFromDatearr = updatedAndInsertRow.map(
          (item) => item.dtmFromDate
        );
        const dtmToDatearr = updatedAndInsertRow.map((item) => item.dtmToDate);
        const lngRatearr = updatedAndInsertRow.map((item) => item.lngRate);
        const lngAmtarr = updatedAndInsertRow.map((item) =>
          item.lngAmt != undefined
            ? item.lngAmt.substring(0, item.lngAmt.length - 1)
            : 0
        );
        const blnAutoarr = updatedAndInsertRow.map((item) => item.blnAuto);
        const lngDiscAmtLimitarr = updatedAndInsertRow.map(
          (item) => item.lngDiscAmtLimit
        );
        const blnDrawerarr = updatedAndInsertRow.map((item) => item.blnDrawer);
        const lngPriorarr = updatedAndInsertRow.map((item) => item.lngPrior);
        const blnReceiptarr = updatedAndInsertRow.map(
          (item) => item.blnReceipt
        );
        const lngChangeRateLimitarr = updatedAndInsertRow.map(
          (item) => item.lngChangeRateLimit
        );
        const lngMenuarr = updatedAndInsertRow.map((item) => item.lngMenu);
        const lngDiscTypearr = updatedAndInsertRow.map(
          (item) => item.lngDiscType
        );
        const blnDuplicatearr = updatedAndInsertRow.map(
          (item) => item.blnDuplicate
        );
        const lngRoundTypearr = updatedAndInsertRow.map(
          (item) => item.lngRoundType
        );
        const lngRoundarr = updatedAndInsertRow.map((item) => item.lngRound);
        const lngTaxarr = updatedAndInsertRow.map((item) => item.lngTax);
        const strIconarr = updatedAndInsertRow.map((item) => item.strIcon);
        const checkedMenus = updatedAndInsertRow.map(
          (item) => item.checkedMenu
        );
        const unchecklngCodes = updatedAndInsertRow.map(
          (item) => item.unchecklngCode
        );
        const deleteCd = deletedRow.map((item) => item.lngCode);

        const res = await savePayCode(
          groupCd.value,
          nowStoreCd.value,
          lngStoreCodearr.join(","),
          strNamearr.join(","),
          strNameEarr.join(","),
          lngCodearr.join(","),
          blnInactivearr.join(","),
          dtmFromDatearr.join(","),
          dtmToDatearr.join(","),
          lngRatearr.join(","),
          lngAmtarr.join(","),
          blnAutoarr.join(","),
          lngDiscAmtLimitarr.join(","),
          blnDrawerarr.join(","),
          lngPriorarr.join(","),
          blnReceiptarr.join(","),
          lngChangeRateLimitarr.join(","),
          lngMenuarr.join(","),
          lngDiscTypearr.join(","),
          blnDuplicatearr.join(","),
          lngRoundTypearr.join(","),
          lngRoundarr.join(","),
          lngTaxarr.join(","),
          strIconarr.join(","),
          checkedMenus.join(";"),
          unchecklngCodes.join(","),
          deleteCd.join(",")
        );
        //comsole.log(res);
        //console.log(res);

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

const updateDeleteInsertrowIndex = ref([]);

/**
 * 상태 변화된 행 세팅
 */

const allStateRows = (e) => {
  updateDeleteInsertrowIndex.value = e;
  //comsole.log(e);
};
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newvalue) => {
  //comsole.log(newvalue);
  updateRow.value = newvalue;
  // rowData.value = newvalue;
  // //comsole.log(newvalue);
  // const temp = newvalue
  //   .filter((item) => item.deleted == true)
  //   .map((item) => item.lngCode);
  // if (temp.length > 0) {
  //   for (var i = 0; i < temp.length; i++) {
  //     const findrow = rowData.value.find((item) => item.lngCode == temp[i]);
  //     if (findrow) {
  //       findrow.deleted = true;
  //     }
  //   }

  //   if (isNew.value == false) {
  //     rowData.value = [...rowData.value];
  //   }
  // }
};
const updatedList2 = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData2 = (newvalue) => {
  //  for(var i = 0 ; i < newvalue.length ; i++){
  //     if(newvalue[i].checkbox == true){
  //       const findrow = clickrowData2.value.find(item => item.menuCd == newvalue[i].menuCd)
  //       findrow.checkbox = true ;
  //     } else {
  //       const findrow = clickrowData2.value.find(item => item.menuCd == newvalue[i].menuCd)
  //       findrow.checkbox = false ;
  //     }
  //  }
  //  clickrowData2.value = [...clickrowData2.value]
  //    const temp = ref([])
  //    temp.value = clickrowData2.value.filter(item => item.checkbox === true).map(item => item.menuCd);
  //    //const findrow = rowData.value.find(item => item.lngCode == gridvalue5.value)
  //    const rowDataMap = new Map(rowData.value.map(row => [row.lngCode.toString(), row]));
  //   //  if(findrow){
  //   //   findrow.checkedMenu = temp.value.join(',')
  //   //  }
  //   const targetRow = rowDataMap.get(gridvalue5.value.toString()); // Map을 통해 빠르게 찾기
  //   //comsole.log(targetRow)
  //   if (targetRow) {
  //     // targetRow가 있으면 값을 업데이트
  //     targetRow.checkedMenu = temp.value.join(',')
  //   } else {
  //     // find 방식 대신 sequence로 찾기
  //     const targetRow2 = rowDataMap.get(clickaddrowSeq.value.toString());
  //      // targetRow가 있으면 값을 업데이트
  //      targetRow2.checkedMenu = temp.value.join(',')
  //   }
  // rowData.value = [...rowData.value]
  // //comsole.log(rowData.value)
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
    findrow.unchecklngCode = temp.value.join(";");
  }
};

// watch(clickrowData2, () => {
//   changeColid.value = "checkedMenu";
//   const arr = clickrowData2.value
//     .filter((item) => item.checkbox == true)
//     .map((item) => item.menuCd);
//   //comsole.log(arr);
//   changeValue2.value = arr.join(",");
//   if (arr.length > 0 && deleteOn.value == false) {
//     changeNow.value = !changeNow.value;
//   }
//   deleteOn.value = true;
// });

/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData2 = (e) => {
  // ////comsole.log(e)
  // const clickedRow = clickrowData2.value.find(item => item.menuCd == e[3])
  // ////comsole.log(clickedRow.checkbox == undefined)
  // if(clickedRow.checkbox == undefined|| clickedRow.checkbox == false){
  //   clickedRow.checkbox = true
  // } else {
  //   clickedRow.checkbox = false
  // }
  // clickrowData2.value = [...clickrowData2.value]
  // changeColid.value = 'checkedMenu'
  // //comsole.log(clickrowData2.value)
  // const arr = clickrowData2.value.filter(item => item.checkbox == true).map(item => item.menuCd)
  // changeValue2.value = arr.join(',')
  // changeNow.value = !changeNow.value
  // ////comsole.log(updateRow.value)
  // clickrowData2.value = rowData2.value.filter( item => {
  //       if(forsearchMain.value =='0' ){
  //         return item ;
  //       } else if ( forsearchMain.value !='0' && forsearchSub.value !='0' )  {
  //         return  item.majorGroupCd == forsearchMain.value && item.subGroupCd == forsearchSub.value ;
  //       } else if (  forsearchMain.value !='0' && forsearchSub.value =='0') {
  //         return  item.majorGroupCd == forsearchMain.value
  //       }
  //     })
  //     const firstarr = clickedrowdata.value != undefined ? clickedrowdata.value.split(',') : []
  //    if(rowData2.value.length > 0){
  //     let dupliarr = JSON.parse(JSON.stringify(clickrowData2.value));
  //     if(dupliarr){
  //     //comsole.log(dupliarr)
  //     dupliarr.sort((a, b) => {
  //       const aIndex = firstarr.indexOf(a.menuCd);
  //       const bIndex =  firstarr.indexOf(b.menuCd);
  //   if (aIndex === -1 && bIndex === -1) return 0; // 둘 다 우선순위에 없음
  //   if (aIndex === -1) return 1; // a가 우선순위에 없음
  //   if (bIndex === -1) return -1; // b가 우선순위에 없음
  //   return aIndex - bIndex; // 우선순위 배열에 따라 정렬
  // });
  //    if(firstarr.length > 0 && firstarr[0] !==''){
  //     for(var i=0 ; i < firstarr.length ; i ++){
  //       const change =  dupliarr.find(item => item.menuCd == firstarr[i])
  //       change.checkbox = true
  //     }
  //    }
  //     clickrowData2.value = [...dupliarr]
  //   }
  // }
};
/**
 * 페이지 초기화
 */

const initAll = () => {
  selectedMenu.value = 1;
  clickrowData4.value = [];
  filteredrowData5.value = [];
  forsearchMain.value = 0;
  forsearchSub.value = 0;
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
};
</script>

<style scoped></style>
