<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-10 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save w-auto">저장</button>
    </div>
  </div>
  <br />
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore
      @update:storeGroup="handleStoreGroup"
      @update:storeAreaCd="handleStoreAreaCd"
      @update:storeCd="handleStoreCd"
      @posNo="handlePosNo"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"></PickStore>
  </div>

  <div class="mt-5 flex justify-start ml-10">
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 1 }"
      @click="showMenus(1)">
      POS정보
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 2 }"
      @click="showMenus(2)">
      포트기본정보
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 3 }"
      @click="showMenus(3)">
      포트연결구성
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 4 }"
      @click="showMenus(4)">
      출력기본구성
    </button>
  </div>
  <div class="flex h-4/6 w-full mt-5">
    <div class="flex flex-col w-full h-4/6">
      <div
        class="flex justify-between mt-0 ml-10 w-[95%] border-b border-b-gray-300">
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 1">
          <div>POS정보 목록</div>
          <div>
            <button class="whitebutton" @click="addRow">추가</button
            ><button class="whitebutton" @click="deleteRow">삭제</button>
          </div>
        </div>
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 2">
          <div>상세정보</div>
          <div>
            <button class="whitebutton" @click="addRow2">추가</button
            ><button class="whitebutton" @click="deleteRow2">삭제</button>
          </div>
        </div>
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 3">
          <div>포트연결 목록</div>
          <div>
            <button class="whitebutton" @click="addRow3">추가</button
            ><button class="whitebutton" @click="deleteRow3">삭제</button>
          </div>
        </div>
        <div
          class="flex justify-between rounded-tl-lg text-xl -mt-1 font-bold w-full"
          v-if="currentMenu == 4">
          <div>출력기본 목록</div>
          <div class="space-x-1">
            <button class="whitebutton" @click="addRow4">추가</button>
            <button class="whitebutton" @click="dupliRow4">복사</button>
            <button class="whitebutton" @click="deleteRow4">삭제</button>
          </div>
        </div>
        <!-- <div class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold space-x-1 " v-if="currentMenu == 4"><button
              class="whitebutton" @click="initAllSection">초기화</button><button class="whitebutton"
              @click="dupliData">복사</button><button class="whitebutton" @click="dupliAllData">붙여넣기</button></div> -->
      </div>
      <div class="w-full h-full" v-if="currentMenu == 1">
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="w-[95%] h-[150%]"
            :progname="'MST44_063INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showCheckBar="false"
            :labelingColumns="'intPosNo,posEqipClCd,posEqipKndCd,instlOsClCd,posClCd,useYn,storeFg,lngPrePaid'"
            :labelsData="[
              labelsData1,
              labelsData6,
              labelsData7,
              labelsData8,
              labelsData9,
              labelsData4,
              labelsData21,
              labelsData22,
            ]"
            :valuesData="[
              valueData1,
              valueData6,
              valueData7,
              valueData8,
              valueData9,
              valueData4,
              valueData21,
              valueData22,
            ]"
            @selcetedrowData="selcetedrowData"
            @allStateRows="allStateRows"
            :addRow4="addRows"
            :addrowDefault="addrowDefault"
            :addrowProp="addrowProp"
            :deleteRow6="deleteRows"
            :changeRow="changeRow"
            :changeNow="changeNow"
            :changeColid="changeColid"
            :changeValue2="changeValue"
            @updatedRowData="updatedRowData"
            @selectedIndex="selectedIndex"
            @clickedRowData="clickedRowData"
            @realgridname="realgridname"></Realgrid>
        </div>
      </div>
      <!-- <div class="h-full mt-64" v-show="currentMenu == 1">
          <div class="flex justify-start rounded-tl-lg  text-xl -mt-1 font-bold ml-10 " v-if="currentMenu == false">POS별
            출력코너명 목록</div>
          <div class="ml-10 mt-5 w-full h-full">
            <Realgrid class="w-full h-[400%]" :progname="'MST44_062INS_VUE'" :progid="2" :rowData="rowData2"
              :showGrid="showGrid" :showCheckBar="false" @realgridname="realgridname2"></Realgrid>
          </div>
        </div> -->

      <div class="h-2/6 w-[80vw]" v-show="currentMenu == 2">
        <div
          class="grid grid-rows-3 grid-cols-[1fr,3fr,1fr,3fr,1fr,3fr] h-full w-full ml-10 mt-5 items-center gap-0">
          <div class="text-blue-500 font-semibold text-center">*POS 번호</div>
          <div>
            <select
              name=""
              id=""
              :disabled="disabled1"
              v-model="gridvalue21"
              @change="setRowValueChange1"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100">
              <option value="-1">선택</option>
              <option :value="i.lngCode" v-for="i in commonList11">
                {{ i.strName }}
              </option>
            </select>
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT 번호</div>
          <div>
            <input
              type="number"
              v-model="gridvalue22"
              :disabled="disabled1"
              @input="setRowValueChange2"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100" />
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT명</div>
          <div>
            <input
              type="text"
              v-model="gridvalue23"
              :disabled="disabled2"
              @input="setRowValueChange3"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100" />
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT설정값</div>
          <div>
            <input
              type="text"
              v-model="gridvalue24"
              :disabled="disabled2"
              @input="setRowValueChange4"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100" />
          </div>
          <div class="text-blue-500 font-semibold text-center">*PORT구분</div>
          <div>
            <select
              name=""
              id=""
              :disabled="disabled2"
              @change="setPortEqType"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100"
              v-model="selectCode1">
              <option value="-1">선택</option>
              <option :value="i.strDCode" v-for="i in commonList7">
                [{{ i.strDCode }}]{{ i.strDName }}
              </option>
            </select>
          </div>
          <div class="text-blue-500 font-semibold text-center">
            *연결장비유형
          </div>
          <div>
            <select
              name=""
              id=""
              @change="setEqType"
              :disabled="disabled2"
              v-model="selectCode2"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100">
              <option value="-1">선택</option>
              <option :value="i.strDCode" v-for="i in commonList8">
                [{{ i.strDCode }}]{{ i.strDName }}
              </option>
            </select>
          </div>
          <div class="text-blue-500 font-semibold text-center">
            *PORT오픈여부
          </div>
          <div>
            <select
              name=""
              id=""
              :disabled="disabled2"
              @change="setRowValueChange5"
              v-model="selectCode4"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100">
              <option value="-1">선택</option>
              <option :value="i.strDCode" v-for="i in commonList12">
                [{{ i.strDCode }}]{{ i.strDName }}
              </option>
            </select>
          </div>
          <div class="text-blue-500 font-semibold text-center">
            *PORT공유여부
          </div>
          <div>
            <select
              name=""
              id=""
              :disabled="disabled2"
              @change="setRowValueChange6"
              v-model="selectCode5"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100">
              <option value="-1">선택</option>
              <option :value="i.strDCode" v-for="i in commonList12">
                [{{ i.strDCode }}]{{ i.strDName }}
              </option>
            </select>
          </div>
          <div class="text-blue-500 font-semibold text-center">
            *연결장비종류
          </div>
          <div>
            <select
              name=""
              id=""
              :disabled="disabled2"
              @change="setRowValueChange7"
              v-model="selectCode3"
              class="w-full h-8 border border-gray-500 rounded-lg disabled:bg-gray-100">
              <option value="-1">선택</option>
              <option :value="i.strDCode" v-for="i in commonList9">
                [{{ i.strDCode }}]{{ i.strDName }}
              </option>
            </select>
          </div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">
          <div class="font-semibold w-full flex justify-start text-xl">
            포트기본 목록
          </div>
          <Realgrid
            class="w-[103%] h-[300%]"
            :progname="'MST44_063INS_VUE'"
            :progid="2"
            :reload="reload"
            :rowStateeditable="false"
            :rowData="rowData2"
            :showGrid="showGrid"
            :labelingColumns="'blnOpen,blnShare'"
            :labelsData="[labelsData10, labelsData10]"
            :valuesData="[valueData10, valueData10]"
            :showCheckBar="false"
            @selectedIndex2="selectedIndex2"
            :addRow4="addrow2"
            :addrowDefault="addrowDefault2"
            :addrowProp="addrowProp2"
            :deleteRow6="deleterow2"
            :changeRow="changeRow2"
            :changeNow2="changeNow3"
            :changeColid="changeColid"
            :changeValue2="changeValue2"
            @allStateRows="allStateRows2"
            @clickedRowData="clickedRowData2"
            @selcetedrowData="selcetedrowData"
            @updatedRowData="updatedRowData2"
            @sendRowState="sendRowState2"
            @realgridname="realgridname2"></Realgrid>
        </div>
      </div>

      <div class="h-full w-[95%]" v-show="currentMenu == 3">
        <div class="h-full w-full ml-10 mt-5" v-show="currentMenu == 3">
          <div class="w-full h-full">
            <Realgrid
              class="w-full h-[150%]"
              :progname="'MST44_063INS_VUE'"
              :progid="3"
              :reload="reload"
              :rowStateeditable="true"
              :selectionStyle="'cell'"
              :rowData="rowData3"
              :addRow4="addrow3"
              :addrowDefault="addrowDefault3"
              :addrowProp="addrowProp3"
              :deleteRow6="deleterow3"
              :labelingColumns="'intPosNo,lngPos'"
              :labelsData="[labelsData1, labelsData1]"
              :valuesData="[valueData1, valueData1]"
              @clickedRowData="clickedRowData3"
              @realgridname="realgridname3"
              @selectedIndex2="selectedIndex3"
              @updatedRowData="updatedRowData3"
              @allStateRows="allStateRows3"
              :changeColid="changeColid"
              :changeRow="changeRow"
              :changeNow="changeNow2"
              :changeValue2="changeValue"
              :initSelect="initSelect"></Realgrid>
          </div>
        </div>
      </div>

      <div class="w-full h-full flex" v-if="currentMenu == 4">
        <div class="ml-10 mt-5 w-[75%] h-full">
          <Realgrid
            class="w-[95%] h-[150%]"
            :progname="'MST44_063INS_VUE'"
            :progid="4"
            :mergeColumns2="true"
            :mergeColumnGroupName2="[
              '주문서',
              '영수증',
              '주방출력',
              '주방전표',
            ]"
            :mergeColumnGroupSubList2="[
              ['lngOIssueCount', 'lngOIssueType', 'lngOIssueSum'],
              ['lngRIssueCount', 'lngRIssueType'],
              ['lngKitchenOrderVoid', 'lngKitchenMenuVoid'],
              ['lngKitchenU', 'lngKitchenD'],
            ]"
            :rowData="rowData4"
            :showCheckBar="true"
            :labelingColumns="'intPosNo,lngOIssueType,lngOIssueSum,lngRIssueType,lngKitchenOrderVoid,lngKitchenMenuVoid,lngLogo'"
            :labelsData="[
              labelsData20,
              labelsData2,
              labelsData3,
              labelsData3,
              labelsData4,
              labelsData4,
              labelsData5,
            ]"
            :valuesData="[
              valueData20,
              valueData2,
              valueData3,
              valueData3,
              valueData4,
              valueData4,
              valueData5,
            ]"
            :rowStateeditable="false"
            @selcetedrowData="selcetedrowData"
            @checkedRowData="checkedRowData4"
            :addRow4="addRows4"
            :addrowDefault="addrowDefault4"
            :addrowProp="addrowProp4"
            :deleteRow6="deleterow4"
            :changeRow="changeRow4"
            :changeNow2="changeNow4"
            :changeColid="changeColid"
            :changeValue2="changeValue"
            :editableColId="'intPosNo'"
            :setReFocus="setReFocus"
            :suffixColumnheng="['lngOIssueCount', 'lngRIssueCount']"
            :suffixColumnJul="['lngKitchenU', 'lngKitchenD', 'lngFloorMax']"
            @updatedRowData="updatedRowData4"
            @allStateRows="allStateRows4"
            @selectedIndex2="selectedIndex4"
            @clickedRowData="clickedRowData4"
            @realgridname="realgridname4"></Realgrid>
        </div>
        <div class="font-semibold">
          <div class="flex justify-start -ml-9 mt-2 text-xl">상세정보</div>
          <div
            class="grid grid-rows-13 grid-cols-[1fr,2fr] h-[110%] w-full -ml-10 mt-5 items-center gap-0">
            <div
              class="bg-gray-100 rounded-tl-lg h-full w-full font-semibold items-center text-center border-t border-l border-gray-300 flex justify-center">
              주문서 발행횟수
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                :disabled="disabled3"
                name="lngOIssueCount"
                @input="setValue"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[50%] h-[80%]"
                v-model="gridvalue1" />회
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주문서 발행유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name="lngOIssueType"
                @change="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[90%] h-[80%]"
                v-model="selectCommon1">
                <option :value="-1">선택</option>
                <option :value="i.strDCode" v-for="i in commonList1">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주문서 개요유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name="lngOIssueSum"
                @change="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[90%] h-[80%]"
                v-model="selectCommon2">
                <option :value="-1">선택</option>
                <option :value="i.strDCode" v-for="i in commonList2">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *영수증 발행횟수
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                @input="setValue"
                :disabled="disabled3"
                name="lngRIssueCount"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[50%] h-[80%]"
                v-model="gridvalue2" />회
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *영수증 개요유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name="lngRIssueType"
                @change="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[90%] h-[80%]"
                v-model="selectCommon3">
                <option :value="-1">선택</option>
                <option :value="i.strDCode" v-for="i in commonList3">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div
              class="font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              주방출력 주문취소
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name="lngKitchenOrderVoid"
                @change="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[90%] h-[80%]"
                v-model="selectCommon4">
                <option :value="-1">선택</option>
                <option :value="i.strDCode" v-for="i in commonList4">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div
              class="font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              주방출력 메뉴정정
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name="lngKitchenMenuVoid"
                @change="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[90%] h-[80%]"
                v-model="selectCommon5">
                <option :value="-1">선택</option>
                <option :value="i.strDCode" v-for="i in commonList5">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주방전표 상위공백
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                name="lngKitchenU"
                @input="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[50%] h-[80%]"
                v-model="gridvalue3" />줄
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주방전표 하위공백
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                name="lngKitchenD"
                @input="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[50%] h-[80%]"
                v-model="gridvalue4" />줄
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center text-center border-t border-l border-gray-300 flex justify-center">
              *주문전표 출력
            </div>
            <div
              class="bg-white rounded-tr-lg h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <input
                type="number"
                name="lngFloorMax"
                @input="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[50%] h-[80%]"
                v-model="gridvalue5" />줄
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center flex text-center border-t border-l border-b border-gray-300 justify-center">
              *영수증로고 출력유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name="lngLogo"
                @change="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[90%] h-[80%]"
                v-model="selectCommon6">
                <option :value="-1">선택</option>
                <option :value="i.strDCode" v-for="i in commonList6">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div
              class="text-blue-500 font-semibold bg-gray-100 h-full w-full items-center flex text-center border-t border-l border-b border-gray-300 justify-center">
              *포스기 유형
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border-t border-r border-l border-gray-300 flex justify-start pl-1">
              <select
                name="POSKIOSK"
                @change="setValue"
                :disabled="disabled3"
                class="disabled:bg-gray-100 bg-white border rounded-lg w-[90%] h-[80%]"
                v-model="selectCommon7">
                <option :value="-1">선택</option>
                <option value="0">포스</option>
                <option value="1">키오스크</option>
              </select>
            </div>
            <div
              class="font-semibold bg-gray-100 h-full w-full rounded-bl-lg items-center flex text-center border-t border-l border-b border-gray-300 justify-center">
              출력옵션값
            </div>
            <div
              class="bg-white h-full w-full font-semibold items-center text-center border border-gray-300 flex justify-start pl-1 rounded-br-lg">
              <button
                class="whitebutton"
                @click="openPopUp"
                :disabled="disabled3">
                출력 옵션값 설정
              </button>
              <div
                class="absolute w-full h-full inset-0 bg-gray-500/50 top-0 left-0"
                v-show="open">
                <div
                  class="absolute top-[25%] right-[25%] bg-white w-[50%] h-[50%] opacity-100">
                  <div class="flex justify-between">
                    <div
                      class="flex justify-center items-center text-2xl ml-2 mt-2">
                      출력옵션값
                    </div>
                    <button
                      @click="disabledButton"
                      class="button primary mr-2 mt-2">
                      선택
                    </button>
                  </div>
                  <div class="flex justify-center items-center h-[80%]">
                    <div
                      class="grid grid-cols-[1fr] grid-rows-1 h-full w-[95%] border border-gray-500 rounded-lg mt-3">
                      <div
                        class="flex justify-evenly items-center flex-wrap gap-x-2">
                        <label for="1"
                          ><input
                            type="checkbox"
                            id="1"
                            value="1"
                            @change="checkOption"
                            v-model="checkedOptions" />객층/객수 출력
                          안함(할리스)</label
                        ><label for="2"
                          ><input
                            type="checkbox"
                            id="2"
                            value="2"
                            @change="checkOption"
                            v-model="checkedOptions" />영수발행시 메뉴 내역
                          제외</label
                        >
                        <label for="3"
                          ><input
                            type="checkbox"
                            id="3"
                            value="3"
                            @change="checkOption"
                            v-model="checkedOptions" />주문서 발행 여부
                          확인</label
                        >
                        <label for="4"
                          ><input
                            type="checkbox"
                            id="4"
                            value="4"
                            :disabled="checkedOptions.includes('5')"
                            @change="checkOption"
                            v-model="checkedOptions" />승인내역 분할 출력</label
                        >
                        <label for="5"
                          ><input
                            type="checkbox"
                            id="5"
                            value="5"
                            :disabled="checkedOptions.includes('4')"
                            @change="checkOption"
                            v-model="checkedOptions" />승인내역 전체 출력</label
                        >
                        <label for="6"
                          ><input
                            type="checkbox"
                            id="6"
                            value="6"
                            @change="checkOption"
                            v-model="checkedOptions" />전자서명
                          전표미발행</label
                        >
                        <label for="7"
                          ><input
                            type="checkbox"
                            id="7"
                            value="7"
                            @change="checkOption"
                            v-model="checkedOptions" />멤버쉽 포인트 적립금이
                          0일경우 출력제외</label
                        >
                        <label for="8"
                          ><input
                            type="checkbox"
                            id="8"
                            value="8"
                            @change="checkOption"
                            v-model="checkedOptions" />썬앳파주첼시점 결제내역
                          제외 출력</label
                        >
                        <label for="9"
                          ><input
                            type="checkbox"
                            id="9"
                            value="9"
                            @change="checkOption"
                            v-model="checkedOptions" />영수증번호 미표시</label
                        >
                        <label for="10"
                          ><input
                            type="checkbox"
                            id="10"
                            value="10"
                            @change="checkOption"
                            v-model="checkedOptions" />머그잔사용 출력</label
                        >
                        <label for="11"
                          ><input
                            type="checkbox"
                            id="11"
                            value="11"
                            :disabled="checkedOptions.includes('12')"
                            @change="checkOption"
                            v-model="checkedOptions" />주방빌지 폰트 세로로
                          크게</label
                        >
                        <label for="12"
                          ><input
                            type="checkbox"
                            id="12"
                            value="12"
                            @change="checkOption"
                            :disabled="checkedOptions.includes('11')"
                            v-model="checkedOptions" />주방빌지 폰트 가로세로
                          크게</label
                        >
                        <label for="13"
                          ><input
                            type="checkbox"
                            id="13"
                            value="13"
                            @change="checkOption"
                            v-model="checkedOptions" />중간결제 이력 저장</label
                        >
                        <label for="18"
                          ><input
                            type="checkbox"
                            id="18"
                            value="18"
                            @change="checkOption"
                            v-model="checkedOptions" />주문서에 선택메뉴 출력
                          안되게</label
                        >
                        <label for="23"
                          ><input
                            type="checkbox"
                            id="23"
                            value="23"
                            @change="checkOption"
                            v-model="checkedOptions" />영수증출력여부
                          팝업창</label
                        >
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end mt-2 mr-2">
                    <button @click="rollbackButton" class="whitebutton">
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getPortConnectionList,
  getPortDefaultInfo,
  getPosInfo,
  getPrintDefaultSetting,
  savePortConfig,
  savePortDefaultSetting,
  savePosInfo,
  savePrintConfig,
} from "@/api/master";
import { nextTick, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

import { getCommonList, getPosList } from "@/api/common";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import RealGrid from "realgrid";
import Swal from "sweetalert2";
import { insertPageLog } from "@/customFunc/customFunc";
import PageName from "@/components/pageName.vue";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const store = useStore();
// 더미 데이터
const labelsData1 = ref(["선택"]);
const labelsData2 = ref([]);
const labelsData3 = ref([]);
const labelsData4 = ref([]);
const labelsData5 = ref([]);

const labelsData6 = ref([]);
const labelsData7 = ref([]);
const labelsData8 = ref([]);
const labelsData9 = ref([]);
const labelsData10 = ref([]);
const labelsData20 = ref([1, 2, 3, 4, 5]);
const labelsData21 = ref([]);
const labelsData22 = ref(["선택", "선불", "후불"]);

const valueData1 = ref([""]);
const valueData2 = ref([]);
const valueData3 = ref([]);
const valueData4 = ref([]);
const valueData5 = ref([]);

const valueData6 = ref([]);
const valueData7 = ref([]);
const valueData8 = ref([]);
const valueData9 = ref([]);
const valueData10 = ref([]);
const valueData20 = ref([1, 2, 3, 4, 5]);
const valueData21 = ref([]);
const valueData22 = ref([-1, 1, 0]);

const commonList11 = ref([]);
const settingPosList = async (e1, e2) => {
  labelsData1.value = ["선택"];
  valueData1.value = [0];
  const res = await getPosList(e1, e2);

  //comsole.log(res);
  const datas = res.data.pos;
  commonList11.value = res.data.pos;
  for (let i = 0; i < datas.length; i++) {
    valueData1.value.push(datas[i].lngCode);
    labelsData1.value.push(datas[i].strName);
  }
};
const commonList1 = ref([]);
const commonList2 = ref([]);
const commonList3 = ref([]);
const commonList4 = ref([]);
const commonList5 = ref([]);
const commonList6 = ref([]);
const commonList7 = ref([]);
const commonList10 = ref([]);
const commonList12 = ref([]);

const selectCommon1 = ref(-1);
const selectCommon2 = ref(-1);
const selectCommon3 = ref(-1);
const selectCommon4 = ref(-1);
const selectCommon5 = ref(-1);
const selectCommon6 = ref(-1);
const selectCommon7 = ref(-1);

const gridvalue1 = ref(null);
const gridvalue2 = ref(null);
const gridvalue3 = ref(null);
const gridvalue4 = ref(null);
const gridvalue5 = ref(null);

const reload4 = ref(false);
const selectCode1 = ref(-1);
const selectCode2 = ref(-1);
const selectCode3 = ref(-1);
const selectCode4 = ref(-1);
const selectCode5 = ref(-1);

const gridvalue21 = ref(-1);
const gridvalue22 = ref("");
const gridvalue23 = ref("");
const gridvalue24 = ref("");

const disabled1 = ref(true);
const disabled2 = ref(true);
onMounted(async () => {
  const res = await getCommonList(106);
  const res2 = await getCommonList(402);
  const res3 = await getCommonList(407);
  const res4 = await getCommonList(401);
  commonList10.value = res3.data.List;
  const res5 = await getCommonList(403);

  const res6 = await getCommonList(404);
  const res7 = await getCommonList(405);
  const res8 = await getCommonList(406);

  const res9 = await getCommonList(408);
  const res10 = await getCommonList(399);

  const res11 = await getCommonList(432);

  valueData21.value = [
    "-1",
    ...res11.data.List.map((item) => Number(item.strDCode)),
  ];
  labelsData21.value = [
    "선택",
    ...res11.data.List.map((item) => item.strDName),
  ];
  valueData10.value = res10.data.List.map((item) => item.strDCode);
  labelsData10.value = res10.data.List.map((item) => item.strDName);
  commonList12.value = res10.data.List;
  //comsole.log(res9);
  commonList7.value = res9.data.List;
  labelsData6.value = ["선택", ...res5.data.List.map((item) => item.strDName)];
  valueData6.value = [
    "-1",
    ...res5.data.List.map((item) => Number(item.strDCode)),
  ];

  labelsData7.value = ["선택", ...res6.data.List.map((item) => item.strDName)];
  valueData7.value = [
    "-1",
    ...res6.data.List.map((item) => Number(item.strDCode)),
  ];

  labelsData8.value = ["선택", ...res7.data.List.map((item) => item.strDName)];
  valueData8.value = [
    "-1",
    ...res7.data.List.map((item) => Number(item.strDCode)),
  ];

  labelsData9.value = ["선택", ...res8.data.List.map((item) => item.strDName)];
  valueData9.value = [
    "-1",
    ...res8.data.List.map((item) => Number(item.strDCode)),
  ];
  commonList1.value = res.data.List;
  commonList2.value = res2.data.List;
  commonList3.value = res2.data.List;
  commonList4.value = res3.data.List.map((item) => ({
    ...item,
    strDCode: Number(item.strDCode),
  }));
  commonList5.value = res3.data.List.map((item) => ({
    ...item,
    strDCode: Number(item.strDCode),
  }));
  commonList6.value = res4.data.List;

  labelsData2.value = ["선택", ...res.data.List.map((item) => item.strDName)];
  valueData2.value = [
    "-1",
    ...res.data.List.map((item) => Number(item.strDCode)),
  ];

  labelsData3.value = ["선택", ...res2.data.List.map((item) => item.strDName)];
  valueData3.value = [
    "-1",
    ...res2.data.List.map((item) => Number(item.strDCode)),
  ];

  labelsData4.value = ["선택", ...res3.data.List.map((item) => item.strDName)];
  valueData4.value = [
    "-1",
    ...res3.data.List.map((item) => Number(item.strDCode)),
  ];

  labelsData5.value = ["선택", ...res4.data.List.map((item) => item.strDName)];
  valueData5.value = [
    "-1",
    ...res4.data.List.map((item) => Number(item.strDCode)),
  ];

  currentMenu.value = 1;
});

const commonList8 = ref([]);
const commonList9 = ref([]);

// watch(selectCode1, () => {
//   // if(selectCode1.value !=-1){}
//   setPortEqType2(selectCode1.value);
// });
// watch(selectCode2, () => {
//   // if(selectCode1.value !=-1){}
//   setEqType2(selectCode2.value);
// });
const setPortEqType = async (e) => {
  const value = e.target.value;
  if (value == -1) {
    selectCode2.value = -1;
    selectCode3.value = -1;

    commonList8.value = [];
    commonList9.value = [];

    changeColid.value = "lngOLEType";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;
    await nextTick();

    changeColid.value = "strPortName";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;
    await nextTick();

    changeColid.value = "lngMachineType";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachineType";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "lngMachine";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachine";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    return;
  }
  const targetValue = commonList7.value.filter(
    (item) => item.strDCode == value
  )[0]?.strSCode;
  //comsole.log(value.strSCode);
  if (targetValue == undefined) {
    return;
  }
  const res = await getCommonList(targetValue);

  changeColid.value = "lngOLEType";
  changeValue2.value = value;
  changeNow3.value = !changeNow3.value;
  await nextTick();

  const targetValue2 = commonList7.value.filter(
    (item) => item.strDCode == value
  )[0]?.strDName;
  changeColid.value = "strPortName";
  changeValue2.value = targetValue2;
  changeNow3.value = !changeNow3.value;
  await nextTick();

  commonList8.value = res.data.List;
  selectCode2.value = -1;
  selectCode3.value = -1;
  changeColid.value = "lngMachineType";
  changeValue2.value = -1;
  changeNow3.value = !changeNow3.value;

  await nextTick();

  changeColid.value = "strMachineType";
  changeValue2.value = "선택";
  changeNow3.value = !changeNow3.value;

  await nextTick();

  changeColid.value = "lngMachine";
  changeValue2.value = -1;
  changeNow3.value = !changeNow3.value;

  await nextTick();

  changeColid.value = "strMachine";
  changeValue2.value = "선택";
  changeNow3.value = !changeNow3.value;
};
const setPortEqType2 = async (e) => {
  const value = e;
  if (value == -1) {
    selectCode2.value = -1;
    selectCode3.value = -1;

    commonList8.value = [];
    commonList9.value = [];

    changeColid.value = "lngOLEType";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;
    await nextTick();

    changeColid.value = "strPortName";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;
    await nextTick();

    changeColid.value = "lngMachineType";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachineType";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "lngMachine";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachine";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    return;
  }
  const targetValue = commonList7.value.filter(
    (item) => item.strDCode == value
  )[0]?.strSCode;
  if (targetValue == undefined) {
    return;
  }
  const res = await getCommonList(targetValue);

  commonList8.value = res.data.List;
};
const setEqType = async (e) => {
  const value = e.target.value;
  if (value == -1) {
    selectCode3.value = -1;
    commonList9.value = [];

    changeColid.value = "lngMachineType";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachineType";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "lngMachine";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachine";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    await nextTick();

    return;
  }
  const targetValue = commonList8.value.filter(
    (item) => item.strDCode == value
  )[0]?.strSCode;
  if (targetValue == undefined) {
    return;
  }

  changeColid.value = "lngMachineType";
  changeValue2.value = value;
  changeNow3.value = !changeNow3.value;

  await nextTick();

  const targetValue2 = commonList8.value.filter(
    (item) => item.strDCode == value
  )[0]?.strDName;
  changeColid.value = "strMachineType";
  changeValue2.value = targetValue2;
  changeNow3.value = !changeNow3.value;

  await nextTick();

  const res = await getCommonList(targetValue);
  commonList9.value = res.data.List;
  selectCode3.value = -1;

  changeColid.value = "lngMachine";
  changeValue2.value = -1;
  changeNow3.value = !changeNow3.value;

  await nextTick();

  changeColid.value = "strMachine";
  changeValue2.value = "선택";
  changeNow3.value = !changeNow3.value;

  await nextTick();
};

const setEqType2 = async (e) => {
  const value = e;
  if (value == -1) {
    selectCode3.value = -1;
    commonList9.value = [];

    changeColid.value = "lngMachineType";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachineType";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "lngMachine";
    changeValue2.value = -1;
    changeNow3.value = !changeNow3.value;

    await nextTick();

    changeColid.value = "strMachine";
    changeValue2.value = "선택";
    changeNow3.value = !changeNow3.value;

    await nextTick();

    return;
  }

  //comsole.log(commonList8.value);
  const targetValue = commonList8.value.filter(
    (item) => item.strDCode == value
  )[0]?.strSCode;

  if (targetValue == undefined) {
    return;
  }
  const res = await getCommonList(targetValue);
  commonList9.value = res.data.List;
};

const changeRow2 = ref(-1);
const changeValue2 = ref();
const changeNow3 = ref(false);
const selectedIndex2 = (e) => {
  changeRow2.value = e;
};
const setRowValueChange1 = (e) => {
  changeColid.value = "intPosNo";
  changeValue2.value = e.target.value;

  changeNow3.value = !changeNow3.value;
};
const setRowValueChange2 = (e) => {
  changeColid.value = "lngPort";
  changeValue2.value = e.target.value;

  changeNow3.value = !changeNow3.value;
};
const setRowValueChange3 = (e) => {
  changeColid.value = "strName";
  changeValue2.value = gridvalue23.value;

  changeNow3.value = !changeNow3.value;
};
const setRowValueChange4 = (e) => {
  changeColid.value = "strSetting";
  changeValue2.value = e.target.value;

  changeNow3.value = !changeNow3.value;
};
const setRowValueChange5 = (e) => {
  changeColid.value = "blnOpen";
  changeValue2.value = e.target.value;

  changeNow3.value = !changeNow3.value;
};
const setRowValueChange6 = (e) => {
  changeColid.value = "blnShare";
  changeValue2.value = e.target.value;

  changeNow3.value = !changeNow3.value;
};

const setRowValueChange7 = async (e) => {
  changeColid.value = "lngMachine";
  changeValue2.value = e.target.value;

  changeNow3.value = !changeNow3.value;

  await nextTick();

  const targetValue2 = commonList9.value.filter(
    (item) => item.strDCode == e.target.value
  )[0]?.strDName;
  changeColid.value = "strMachine";
  changeValue2.value = targetValue2;

  changeNow3.value = !changeNow3.value;
};
const disabled = ref(true);
const disabled3 = ref(true);
const items = ref([]);
const ScreenKeyOrigin = ref([]);
const ScreenKeys = ref();
const updatedList = ref();
const updatedList2 = ref();
const forsearchMain = ref("0");
const forsearchSub = ref("0");
const ischecked = ref(false);
const rowData4 = ref([]);
const changeMode = ref(false);
const fixedColumn = ref(true);
const PrintList = ref([]);
const clickedNm = ref("");
const clickedNo = ref();
const clickedStoreNm = ref();
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const changeNow4 = ref(false);
const confirmitem = ref([]);
const setValue = (e) => {
  const name = e.target.name;
  const value = e.target.value;

  changeColid.value = name;
  changeValue.value = value;
  changeNow4.value = !changeNow4.value;
};
const posNo = ref();
const addrowDefault = ref([]);
const addrowProp = ref("lngStoreGroup,lngStoreCode,lngAreaCode");
const AllscreenKeyPage = ref(1);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const showMenus = (value) => {
  if (value == 1) {
    currentMenu.value = 1;
    hidesub.value = false;
  } else if (value == 2) {
    currentMenu.value = 2;
    hidesub.value = true;
  } else if (value == 3) {
    currentMenu.value = 3;
  } else if (value == 4) {
    currentMenu.value = 4;
  }
};

const currentMenu = ref(0);

const realgrid2Name = ref("");
const realgrid3Name = ref("");
const realgrid4Name = ref("");
const realgrid5Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};
const realgridname3 = (e) => {
  realgrid4Name.value = e;
};
const realgridname4 = (e) => {
  //comsole.log(e);
  realgrid5Name.value = e;
};

watch(currentMenu, () => {
  if (currentMenu.value == 1) {
    const reagrid2 = document.getElementById(realgrid2Name.value);
    setTimeout(() => {
      if (reagrid2) {
        RealGrid.getGridInstance(reagrid2).resetSize();
        RealGrid.getGridInstance(reagrid2).refresh(true);
      }
    }, 100);
  } else if (currentMenu.value == 2) {
    const reagrid3 = document.getElementById(realgrid3Name.value);
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid3).resetSize();
      RealGrid.getGridInstance(reagrid3).refresh(true);
    }, 100);
  } else if (currentMenu.value == 3) {
    const reagrid4 = document.getElementById(realgrid4Name.value);
    setTimeout(() => {
      RealGrid.getGridInstance(reagrid4).resetSize();
      RealGrid.getGridInstance(reagrid4).refresh(true);
    }, 100);
  } else if (currentMenu.value == 4) {
    const reagrid5 = document.getElementById(realgrid5Name.value);
    setTimeout(() => {
      if (reagrid5) {
        RealGrid.getGridInstance(reagrid5).resetSize();
        RealGrid.getGridInstance(reagrid5).refresh(true);
      }
    }, 100);
  }
});

const hidesub = ref(false);

const nowStoreAreaCd = ref();
const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};
const updatedRowData = (newValue) => {
  updatedList.value = newValue;
  //comsole.log(updatedList.value);
};

const forSaveMenu = ref([]);
const updatedRowData2 = (newValue) => {
  updatedList2.value = newValue;
};

const updatedList3 = ref([]);
const updatedRowData3 = (newValue) => {
  updatedList3.value = newValue;
  //comsole.log(updatedList3.value);
};

const updatedList4 = ref([]);
const updatedRowData4 = (newValue) => {
  updatedList4.value = newValue;
  //comsole.log(updatedList4.value);
};
const nowStoreCd = ref();
const afterCategory = ref(false);
const handleStoreGroup = (e) => {
  groupCd.value = e;
};
const handleStoreCd = async (newValue) => {
  afterSearch.value = false;
  rowData.value = [];
  rowData2.value = [];

  SettingList.value = [];
  checked.value = [];
  printNameList.value = [];
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  ischecked.value = false;

  nowStoreCd.value = newValue;
  settingPosList(groupCd.value, nowStoreCd.value);
  //comsole.log(nowStoreCd.value);
  reload.value = !reload.value;
};

let isSwalOpen = false;
const selectIndex3 = ref();
const selectIndex4 = ref();
const changeRow4 = ref(0);

const sendRowState2 = (e) => {
  if (e == "created") {
    disabled1.value = false;
  } else {
    disabled1.value = true;
  }
};
const selectedIndex3 = (e) => {
  selectIndex3.value = e;
};
const selectedIndex4 = (e) => {
  changeRow4.value = e;
};
const addrow3 = ref(false);
const addrow2 = ref(false);
const addrowProp3 = ref(
  "strName,intPosNo,lngPosition,lngPos,lngPort,cornerNm,portIdVlu,lngStoreCode,lngAreaCode,originPort,originPos"
);
const addrowProp2 = ref(
  "StoreName,lngStoreGroup,lngStoreCode,lngAreaCode,intPosNo,lngPort,strName,strSetting,lngOLEType,blnOpen,blnShare,lngMachine,lngMachineType,strPortName,strMachine"
);
const addrowDefault2 = ref("");
const addrowDefault3 = ref("");
const addrowProp4 = ref(
  "intPosNo,lngOIssueCount,lngOIssueType,lngOIssueSum,lngRIssueCount,lngRIssueType,lngKitchenOrderVoid,lngKitchenMenuVoid,lngKitchenU,lngKitchenD,lngFloorMax,lngLogo,lngStoreGroup,lngStoreCode,lngAreaCode,POSKIOSK,lngOption"
);
const addrowDefault4 = ref(" ,' ',-1,-1,' ',-1,-1,-1,' ',' ',' ',-1");
const addRow2 = () => {
  if (afterSearch2.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addrowDefault2.value =
    clickedStoreNm.value +
    "," +
    groupCd.value +
    "," +
    nowStoreCd.value +
    "," +
    nowStoreAreaCd.value +
    ",,,,,-1,,,-1,-1,, ";
  addrow2.value = !addrow2.value;
};
const addRow3 = () => {
  if (afterSearch3.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const newMax = "";

  addrowDefault3.value =
    clickedStoreNm.value +
    "," +
    "0,,0,,," +
    newMax +
    "," +
    nowStoreCd.value +
    "," +
    nowStoreAreaCd.value +
    ",0,0";
  addrow3.value = !addrow3.value;
};

const deleterow2 = ref(false);
const deleterow3 = ref(false);
const deleterow4 = ref(false);
const allstaterow = ref([]);
const allstaterow2 = ref([]);
const allstaterow3 = ref([]);
const allStateRows = (e) => {
  //comsole.log(e);
  allstaterow.value = e;
};
const allStateRows2 = (e) => {
  //comsole.log(e);
  allstaterow2.value = e;
};
const allStateRows3 = (e) => {
  //comsole.log(e);
  allstaterow3.value = e;
};
const allstaterow4 = ref([]);
const allStateRows4 = (e) => {
  //comsole.log(e);
  allstaterow4.value = e;
};
const deleteRow2 = () => {
  if (afterSearch2.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deleterow2.value = !deleterow2.value;
};
const deleteRow3 = () => {
  if (afterSearch3.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deleterow3.value = !deleterow3.value;
};
const deleteRow4 = () => {
  if (afterSearch4.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deleterow4.value = !deleterow4.value;
};

const reload = ref(false);
const SettingList = ref();
const Category = ref([]);
const changeValue = ref("");
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);
const changeNow = ref(false);
const changeNow2 = ref(false);

const searchword1 = ref();
const searchword3 = ref();
const userData = store.state.userData;

const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const afterSearch2 = ref(false);
const afterSearch3 = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const checked = ref();
const addRows = ref(false);
const addRows4 = ref(false);
const deleteRows = ref(false);
const afterSearch4 = ref(false);

const addRow4 = () => {
  if (afterSearch4.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addrowDefault4.value =
    " ,'  ',-1,-1,'  ',-1,-1,-1,'  ','  ','  ',-1," +
    groupCd.value +
    "," +
    nowStoreCd.value +
    "," +
    nowStoreAreaCd.value +
    ",-1,0";
  addRows4.value = !addRows4.value;
};
const dupliRow4 = () => {
  if (afterSearch4.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (checkedRowDataList.value.length !== 1) {
    Swal.fire({
      title: "경고.",
      text: "한 행만 체크해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  //comsole.log(checkedRowDataList.value);
  addrowDefault4.value =
    ` ,${checkedRowDataList.value[0].lngOIssueCount},${checkedRowDataList.value[0].lngOIssueType},${checkedRowDataList.value[0].lngOIssueSum},${checkedRowDataList.value[0].lngRIssueCount},${checkedRowDataList.value[0].lngRIssueType},${checkedRowDataList.value[0].lngKitchenOrderVoid},${checkedRowDataList.value[0].lngKitchenMenuVoid},${checkedRowDataList.value[0].lngKitchenU},${checkedRowDataList.value[0].lngKitchenD},${checkedRowDataList.value[0].lngFloorMax},${checkedRowDataList.value[0].lngLogo},` +
    checkedRowDataList.value[0].lngStoreGroup +
    "," +
    checkedRowDataList.value[0].lngStoreCode +
    "," +
    checkedRowDataList.value[0].lngAreaCode +
    `,${checkedRowDataList.value[0].POSKIOSK}` +
    "," +
    checkedRowDataList.value[0].lngOption;

  //comsole.log(addrowDefault4.value);
  addRows4.value = !addRows4.value;
};
const addRow = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  addRows.value = !addRows.value;
  addrowDefault.value =
    groupCd.value + "," + nowStoreCd.value + "," + nowStoreAreaCd.value + ",";
  //comsole.log(updatedList.value);
};

const printNameList = ref([]);
const deleteRow = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deleteRows.value = !deleteRows.value;
};

const selcetedrowData = (newValue) => {
  //comsole.log(newValue);
  if (currentMenu.value == 3) {
  }
};

const checkedRowDataList = ref([]);
const checkedRowData4 = (e) => {
  checkedRowDataList.value = e;
  //comsole.log(e);
};

const initSelect = ref(false);
const searchButton = async () => {
  if (nowStoreCd.value == "0" || nowStoreCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "매장을 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }

  try {
    store.state.loading = true;
    let res;
    if (currentMenu.value == 1) {
      res = await getPosInfo(groupCd.value, nowStoreCd.value);
      //comsole.log(res);
      rowData.value = res.data.List;
      updatedList.value = JSON.parse(JSON.stringify(res.data.List));
      //comsole.log(rowData.value);
      afterSearch.value = true;
    } else if (currentMenu.value == 2) {
      res = await getPortDefaultInfo(groupCd.value, nowStoreCd.value);
      //comsole.log(res);

      rowData2.value = res.data.List;
      // rowData3.value = [...SettingList.value];
      updatedList2.value = JSON.parse(JSON.stringify(res.data.List));

      afterSearch2.value = true;
    } else if (currentMenu.value == 3) {
      res = await getPortConnectionList(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value
      );
      //comsole.log(res);
      rowData3.value = res.data.List;
      updatedList3.value = JSON.parse(JSON.stringify(res.data.List));
      afterSearch3.value = true;
    } else if (currentMenu.value == 4) {
      res = await getPrintDefaultSetting(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value
      );
      //comsole.log(res);
      rowData4.value = res.data.List;
      updatedList4.value = JSON.parse(JSON.stringify(res.data.List));
      afterSearch4.value = true;
    }
  } catch (error) {
    //comsole.log(error);
    afterSearch.value = false;
    afterSearch2.value = false;
    afterSearch3.value = false;
  } finally {
    handleinitAll();

    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    clickedNo.value = "";
    clickedNm.value = "";
    initSelect.value = !initSelect.value;
  }
};
const filteredSubMenuGroup = ref([]);
const alreadyCheckedList = ref([]);
const forSaveMenu2 = ref([]);

const saveButton = async () => {
  if (currentMenu.value == 1) {
    if (afterSearch.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 2) {
    if (afterSearch2.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 3) {
    if (afterSearch3.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  if (currentMenu.value == 1) {
    const a = allstaterow.value.deleted?.length;
    const b = allstaterow.value.created?.length;
    const c = allstaterow.value.updated?.length;
    if (a == undefined || a + b + c == 0) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 2) {
    const a = allstaterow2.value.deleted?.length;
    const b = allstaterow2.value.created?.length;
    const c = allstaterow2.value.updated?.length;
    if (a == undefined || a + b + c == 0) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 3) {
    const a = allstaterow3.value.deleted?.length;
    const b = allstaterow3.value.created?.length;
    const c = allstaterow3.value.updated?.length;
    if (a == undefined || a + b + c == 0) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 4) {
    const a = allstaterow4.value.deleted?.length;
    const b = allstaterow4.value.created?.length;
    const c = allstaterow4.value.updated?.length;
    if (a == undefined || a + b + c == 0) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  if (currentMenu.value == 1) {
    const length = new Set(updatedList.value.map((item) => item.intPosNo)).size;
    const length2 = updatedList.value.map((item) => item.intPosNo).length;
    if (length != length2) {
      Swal.fire({
        title: "경고",
        text: "포스번호가 중복되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 2) {
    const length = new Set(
      updatedList2.value.map((item) =>
        JSON.stringify({ intPosNo: item.intPosNo, lngPort: item.lngPort })
      )
    ).size;

    const length2 = updatedList2.value.length;

    if (length != length2) {
      Swal.fire({
        title: "경고",
        text: "중복된 포스번호와 포트번호가 존재합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 3) {
    const length = new Set(
      updatedList3.value.map((item) =>
        JSON.stringify({
          intPosNo: item.intPosNo,
          lngPosition: item.lngPosition,
        })
      )
    ).size;

    const length2 = updatedList3.value.length;

    if (length != length2) {
      Swal.fire({
        title: "경고",
        text: "중복된 포스번호와 Port연결ID가 존재합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 4) {
    const length = new Set(
      updatedList4.value.map((item) =>
        JSON.stringify({
          intPosNo: item.intPosNo,
        })
      )
    ).size;

    const length2 = updatedList4.value.length;

    if (length != length2) {
      Swal.fire({
        title: "경고",
        text: "중복된 포스번호가 존재합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  if (currentMenu.value == 1) {
    const validate = updatedList.value.filter(
      (item) =>
        item.intPosNo === "" ||
        item.posEqipClCd === "" ||
        item.posEqipKndCd === "" ||
        item.instlDate === "" ||
        item.storeFg === "" ||
        item.lngPrePaid === "" ||
        item.posClCd === "" ||
        item.useYn === "" ||
        item.intPosNo == undefined ||
        item.posEqipClCd == undefined ||
        item.posEqipKndCd == undefined ||
        item.instlDate == undefined ||
        item.storeFg == undefined ||
        item.lngPrePaid == undefined ||
        item.posClCd == undefined ||
        item.useYn == undefined ||
        item.intPosNo == -1 ||
        item.posEqipClCd == -1 ||
        item.posEqipKndCd == -1 ||
        item.instlOsClCd == -1 ||
        item.posClCd == -1 ||
        item.useYn == -1 ||
        item.storeFg == -1 ||
        item.lngPrePaid == -1
    );
    if (validate.length > 0) {
      Swal.fire({
        title: "경고",
        text: "필수입력값이 누락되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 2) {
    const validate = updatedList2.value.filter(
      (item) =>
        item.intPosNo == "" ||
        item.lngPort == "" ||
        item.strName == "" ||
        item.strSetting == "" ||
        item.lngOLEType == "" ||
        item.lngMachineType == "" ||
        item.lngMachine == "" ||
        item.blnOpen == "" ||
        item.blnShare == "" ||
        item.intPosNo == undefined ||
        item.lngPort == undefined ||
        item.strName == undefined ||
        item.strSetting == undefined ||
        item.lngOLEType == undefined ||
        item.lngMachineType == undefined ||
        item.lngMachine == undefined ||
        item.blnOpen == undefined ||
        item.blnShare == undefined ||
        item.intPosNo == -1 ||
        item.lngOLEType == -1 ||
        item.lngMachineType == -1 ||
        item.lngMachine == -1 ||
        item.blnOpen == -1 ||
        item.blnShare == -1
    );
    if (validate.length > 0) {
      Swal.fire({
        title: "경고",
        text: "필수입력값이 누락되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 4) {
    //comsole.log(updatedList4.value);
    const validate = updatedList4.value.filter(
      (item) =>
        item.intPosNo === "" ||
        item.intPosNo === "0" ||
        item.lngOIssueType === "" ||
        Number.isNaN(item.lngRIssueCount) ||
        item.lngRIssueType === "" ||
        Number.isNaN(item.lngKitchenU) ||
        Number.isNaN(item.lngKitchenD) ||
        Number.isNaN(item.lngFloorMax) ||
        item.lngLogo === "" ||
        item.POSKIOSK === "" ||
        item.intPosNo === undefined ||
        item.lngOIssueType === undefined ||
        item.lngOIssueSum === undefined ||
        item.lngRIssueCount === undefined ||
        item.lngRIssueType === undefined ||
        item.lngKitchenU === undefined ||
        item.lngKitchenD === undefined ||
        item.lngFloorMax === undefined ||
        item.lngLogo === undefined ||
        item.POSKIOSK === undefined ||
        item.intPosNo === "-1" ||
        item.lngOIssueType === "-1" ||
        item.lngOIssueSum === "-1" ||
        item.lngRIssueType === "-1" ||
        item.lngKitchenU === " " ||
        item.lngKitchenD === " " ||
        item.lngFloorMax === " " ||
        item.lngLogo === "-1" ||
        item.POSKIOSK === "-1"
    );

    if (validate.length > 0) {
      Swal.fire({
        title: "경고",
        text: "필수입력값이 누락되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 3) {
    //comsole.log(updatedList3.value);
    const validate = updatedList3.value.filter(
      (item) =>
        item.intPosNo == "" ||
        item.lngPosition == "" ||
        item.lngPos == "" ||
        item.lngPort == "" ||
        item.intPosNo == undefined ||
        item.lngPosition == undefined ||
        item.lngPos == undefined ||
        item.lngPort == undefined ||
        item.intPosNo == -1 ||
        item.lngPos == -1
    );

    if (validate.length > 0) {
      Swal.fire({
        title: "경고",
        text: "필수입력값이 누락되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
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
        let res;

        if (currentMenu.value == 1) {
          const deletePoss = updatedList.value
            .filter((_, index) => allstaterow.value.deleted.includes(index))
            .map((item2) => item2.intPosNo)
            .join("\u200B");

          const deleteGROUP = updatedList.value
            .filter((_, index) => allstaterow.value.deleted.includes(index))
            .map((item2) => item2.lngStoreGroup)
            .join("\u200B");

          const deleteSTORECD = updatedList.value
            .filter((_, index) => allstaterow.value.deleted.includes(index))
            .map((item2) => item2.lngStoreCode)
            .join("\u200B");

          const deleteAreaCd = updatedList.value
            .filter((_, index) => allstaterow.value.deleted.includes(index))
            .map((item2) => item2.lngAreaCode)
            .join("\u200B");

          const storeGroupCd = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200B");
          const storeCd = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200B");
          const storeAreaCd = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.lngAreaCode)
            .join("\u200B");
          const PosNo = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.intPosNo)
            .join("\u200B");
          const posEqipcl = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.posEqipClCd)
            .join("\u200B");
          const posEqipk = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.posEqipKndCd)
            .join("\u200B");

          const dates = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.instlDate)
            .join("\u200B");
          const printcnt = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.printCnt)
            .join("\u200B");
          const lanprintcnt = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.lanPrinterCnt)
            .join("\u200B");
          const kdscnt = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.kdsCnt)
            .join("\u200B");
          const didcnt = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.didCnt)
            .join("\u200B");
          const storefg = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.storeFg)
            .join("\u200B");
          const lngprepaid = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.lngPrePaid)
            .join("\u200B");
          const tablecnt = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.tableCnt)
            .join("\u200B");
          const posclcd = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.posClCd)
            .join("\u200B");
          const useyn = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.useYn)
            .join("\u200B");
          const remark = updatedList.value
            .filter((_, index) => !allstaterow.value.deleted.includes(index))
            .map((item) => item.remark)
            .join("\u200B");

          //comsole.log(deletePoss);
          res = await savePosInfo(
            storeGroupCd,
            storeCd,
            storeAreaCd,
            PosNo,
            posEqipcl,
            posEqipk,
            dates,
            printcnt,
            lanprintcnt,
            kdscnt,
            didcnt,
            storefg,
            lngprepaid,
            tablecnt,
            posclcd,
            useyn,
            remark,
            deleteGROUP,
            deleteSTORECD,
            deleteAreaCd,
            deletePoss
          );
          //comsole.log(res);
        } else if (currentMenu.value == 2) {
          const deleteRowGroup = updatedList2.value
            .filter((_, index) => allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200B");
          const deleteStoreCode = updatedList2.value
            .filter((_, index) => allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200B");

          const deletelngAreaCode = updatedList2.value
            .filter((_, index) => allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngAreaCode)
            .join("\u200B");

          const deleteintPosNo = updatedList2.value
            .filter((_, index) => allstaterow2.value.deleted.includes(index))
            .map((item) => item.intPosNo)
            .join("\u200B");

          const deletelngPort = updatedList2.value
            .filter((_, index) => allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngPort)
            .join("\u200B");

          const lngStoreGroups = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngStoreGroup)
            .join("\u200B");
          const lngStoreCodes = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngStoreCode)
            .join("\u200B");
          const lngAreaCodes = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngAreaCode)
            .join("\u200B");

          const intPosNos = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.intPosNo)
            .join("\u200B");
          const lngPorts = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngPort)
            .join("\u200B");
          const strNames = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.strName)
            .join("\u200B");

          const strSettings = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.strSetting)
            .join("\u200B");
          const lngOLETypes = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngOLEType)
            .join("\u200B");
          const lngMachineTypes = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngMachineType)
            .join("\u200B");

          const blnOpens = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.blnOpen)
            .join("\u200B");
          const blnShares = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.blnShare)
            .join("\u200B");
          const lngMachines = updatedList2.value
            .filter((_, index) => !allstaterow2.value.deleted.includes(index))
            .map((item) => item.lngMachine)
            .join("\u200B");

          const res = await savePortDefaultSetting(
            lngStoreGroups,
            lngStoreCodes,
            lngAreaCodes,
            intPosNos,
            lngPorts,
            strNames,
            strSettings,
            lngOLETypes,
            lngMachineTypes,
            blnOpens,
            blnShares,
            lngMachines,
            deleteRowGroup,
            deleteStoreCode,
            deletelngAreaCode,
            deleteintPosNo,
            deletelngPort
          );

          //comsole.log(res);
        } else if (currentMenu.value == 3) {
          const posNos = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.intPosNo);
          const lngpositions = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.lngPosition);
          const lngposs = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.lngPos);
          const lngports = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.lngPort);
          const areaCds = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.lngAreaCode);
          //const cornernms = updatedList3.value
          // .filter((_, index) => !allstaterow3.value.deleted.includes(index))
          // .map((item) => item.cornerNm);
          const counts = {};
          const portIdVlus = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item, index) => {
              const key = item.intPosNo;

              if (!counts[key]) counts[key] = 1;
              else counts[key] *= 2;

              return counts[key];
            });

          //comsole.log(portIdVlus);
          const lngstorecodes = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.lngStoreCode);

          const lngoriginPort = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.originPort);

          const lngoriginPos = updatedList3.value
            .filter((_, index) => !allstaterow3.value.deleted.includes(index))
            .map((item) => item.originPos);

          //comsole.log(allstaterow3.value);
          const deletePoss = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.intPosNo);
          const deletedStoreCodes = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.lngStoreCode);
          const deletedPosition = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.lngPosition);

          const deletedAreaCodes = updatedList3.value
            .filter((_, index) => allstaterow3.value.deleted.includes(index))
            .map((item2) => item2.lngAreaCode);

          //comsole.log(deleterow3);
          res = await savePortConfig(
            groupCd.value,
            nowStoreCd.value,
            posNos.join("\u200B"),
            lngpositions.join("\u200B"),
            lngposs.join("\u200B"),
            lngports.join("\u200B"),
            //    cornernms.join("\u200B"),
            portIdVlus.join("\u200B"),
            lngstorecodes.join("\u200B"),
            areaCds.join("\u200B"),
            lngoriginPort.join("\u200B"),
            lngoriginPos.join("\u200B"),
            deletePoss.join("\u200B"),
            deletedStoreCodes.join("\u200B"),
            deletedPosition.join("\u200B"),
            deletedAreaCodes.join("\u200B")
          );
        } else if (currentMenu.value == 4) {
          const deletedPosNos = updatedList4.value
            .filter((item, index) => allstaterow4.value.deleted.includes(index))
            .map((item2) => item2.intPosNo)
            .join("\u200B");
          const posNos = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.intPosNo)
            .join("\u200B");
          const issuecounts = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) =>
              Number.isNaN(item.lngOIssueCount) ? "" : item.lngOIssueCount
            )
            .join("\u200B");
          const issuetypes = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngOIssueType)
            .join("\u200B");
          const issuesums = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngOIssueSum)
            .join("\u200B");
          const rissuecounts = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngRIssueCount)
            .join("\u200B");
          const rissuetypes = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngRIssueType)
            .join("\u200B");
          const kitchenordervoids = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngKitchenOrderVoid)
            .join("\u200B");
          const kitchenmenuvoids = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngKitchenMenuVoid)
            .join("\u200B");
          const kitchenus = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngKitchenU)
            .join("\u200B");
          const kitchends = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngKitchenD)
            .join("\u200B");
          const floormaxs = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngFloorMax)
            .join("\u200B");
          const lnglogos = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngLogo)
            .join("\u200B");

          const lngstoregroup = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngStoreGroup)
            .join("\u200B");

          const lngstorecode = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngStoreCode)
            .join("\u200B");

          const lngareacode = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngAreaCode)
            .join("\u200B");

          const poskiosk = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.POSKIOSK)
            .join("\u200B");

          const lngOptions = updatedList4.value
            .filter(
              (item, index) => !allstaterow4.value.deleted.includes(index)
            )
            .map((item) => item.lngOption)
            .join("\u200B");

          res = await savePrintConfig(
            groupCd.value,
            nowStoreCd.value,
            posNos,
            issuecounts,
            issuetypes,
            issuesums,
            rissuecounts,
            rissuetypes,
            kitchenordervoids,
            kitchenmenuvoids,
            kitchenus,
            kitchends,
            floormaxs,
            lnglogos,
            lngstoregroup,
            lngstorecode,
            lngareacode,
            poskiosk,
            lngOptions,
            deletedPosNos
          );
        }

        //comsole.log(res);
      } catch (error) {
        //comsole.log(error);
      } finally {
        store.state.loading = false;
        changeValue.value = null;
        Swal.fire({
          title: "성공",
          text: "저장이 완료되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        searchButton();
        reload.value = !reload.value;
      }
    }
  });
};

const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeRow = ref();
const clickedRowData = (newValue) => {
  disabled.value = false;
  clickedNo.value = newValue[2];
  clickedNm.value = newValue[3];

  //changeRow.value = newValue.index
  changeColid.value = "cornerNm";
};
const clickedRowData2 = async (newValue) => {
  //comsole.log(newValue);
  disabled2.value = false;
  gridvalue21.value = newValue[0];
  gridvalue22.value = newValue[1];
  gridvalue23.value = newValue[2];
  gridvalue24.value = newValue[3];
  selectCode1.value = newValue[9];
  await setPortEqType2(selectCode1.value);
  //comsole.log(selectCode1.value);
  await nextTick();
  selectCode2.value = newValue[10];
  //comsole.log(selectCode2.value);
  setEqType2(selectCode2.value);

  selectCode4.value = newValue[6];
  selectCode5.value = newValue[7];
  selectCode3.value = newValue[11];
};

const changeColid = ref("");

const clickedRowData3 = (newValue) => {
  //comsole.log(newValue);
};
const clickedRowData4 = (e) => {
  //comsole.log(e);
  disabled3.value = false;
  gridvalue1.value = e[1];
  selectCommon1.value = e[2];
  selectCommon2.value = e[3];
  gridvalue2.value = e[4];
  selectCommon3.value = e[5];
  selectCommon4.value = e[6];
  selectCommon5.value = e[7];
  gridvalue3.value = e[8];
  gridvalue4.value = e[9];
  gridvalue5.value = e[10];
  selectCommon6.value = e[11];
  selectCommon7.value = e[15];
  rollbackOption.value = e[16];
  // //8 16 => 24

  // 24/2  = 0
  // 12 /2 = 0
  // 6/2 = 0
  // 3 /2 = 1
  // 1
  checkedOptions.value = [];
  let option = Number(e[16]);
  let count = 1;
  while (true) {
    if (option == 0) {
      break;
    }
    if (option % 2 == 1) {
      checkedOptions.value.push(count.toString());
    }
    option = Math.floor(option / 2);
    count++;
  }
};

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
  if (nowStoreAreaCd.value != undefined || posNo.value != undefined) {
    searchButton();
  }
};

const handleinitAll = () => {
  disabled1.value = true;
  disabled2.value = true;
  disabled3.value = true;
  gridvalue21.value = "";
  gridvalue22.value = "";
  gridvalue23.value = "";
  gridvalue24.value = "";

  selectCode1.value = -1;
  selectCode2.value = -1;
  selectCode3.value = -1;
  selectCode4.value = -1;
  selectCode5.value = -1;

  gridvalue1.value = "";
  gridvalue2.value = "";
  gridvalue3.value = "";
  gridvalue4.value = "";
  gridvalue5.value = "";

  selectCommon1.value = -1;
  selectCommon2.value = -1;
  selectCommon3.value = -1;
  selectCommon4.value = -1;
  selectCommon5.value = -1;
  selectCommon6.value = -1;
  selectCommon7.value = -1;
};

const open = ref(false);
const openPopUp = () => {
  open.value = true;
};
const disabledButton = () => {
  open.value = false;
  setReFocus.value = !setReFocus.value;
};

const checkedOptions = ref([]);
// const check2 = ref(false);
// const check3 = ref(false);
// const check4 = ref(false);
// const check5 = ref(false);
// const check6 = ref(false);
// const check7 = ref(false);
// const check8 = ref(false);
// const check9 = ref(false);
// const check10 = ref(false);
// const check11 = ref(false);
// const check12 = ref(false);
// const check13 = ref(false);
// const check18 = ref(false);
// const check23 = ref(false);
const rollbackOption = ref();
const checkOption = (e) => {
  let newValue;
  //comsole.log(checkedOptions.value);
  if (checkedOptions.value.length == 0) {
    newValue = 0;
  } else {
    newValue = checkedOptions.value.reduce((acc, val) => {
      return Number(acc) + Math.pow(2, Number(val) - 1);
    }, 0);
  }
  //comsole.log(newValue);
  changeValue.value = newValue;
  changeColid.value = "lngOption";
  changeNow4.value = !changeNow4.value;
};

const setReFocus = ref(false);
const rollbackButton = () => {
  changeValue.value = rollbackOption.value;
  changeColid.value = "lngOption";
  changeNow4.value = !changeNow4.value;

  //rollbackOption.value = 0;
  open.value = false;
  setReFocus.value = !setReFocus.value;
};
</script>

<style scoped></style>
