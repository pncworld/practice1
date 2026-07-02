/*--############################################################################
# Filename : MST01_003INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 메뉴코드등록                        
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="mst003-page box-border flex h-full max-w-full min-h-0 flex-col gap-3 overflow-hidden pb-1">
  <!-- 조회조건  START-->
  <div
    class="flex shrink-0 flex-wrap items-center justify-between gap-3 overflow-y-hidden">
    <PageName></PageName>
    <div class="flex flex-wrap items-center justify-end gap-2 pr-5 mr-9">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>
      <button @click="saveButton" class="button save w-auto">저장</button>
      <button @click="excelButton" class="button excel w-auto">엑셀</button>
    </div>
  </div>
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
          <button type="button" @click="closePopUp" class="whitebutton mst003-sub-btn">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="absolute z-50 inset-0 bg-black bg-opacity-50 w-full h-full"
    v-if="showDeliveryCopyPopUp">
    <div class="fixed top-[28%] left-[30%] w-[40vw] min-w-[32rem] bg-white rounded-lg">
      <div class="grid grid-cols-1 text-base p-5 font-semibold gap-3">
        <div class="flex items-center justify-between">
          <div class="text-xl">배달메뉴 설정 복사</div>
          <button class="button primary" @click="copyDeliveryMenuToStore">복사</button>
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            기준 메뉴코드
          </div>
          <input
            type="text"
            :value="selectedMenuCodeForDelivery || gridvalue3"
            disabled
            class="mst003-control w-full bg-gray-100" />
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            기준 메뉴명
          </div>
          <input
            type="text"
            :value="gridvalue6"
            disabled
            class="mst003-control w-full bg-gray-100" />
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            기준 매장
          </div>
          <input
            type="text"
            :value="deliveryCopyBaseStoreLabel"
            disabled
            class="mst003-control w-full bg-gray-100" />
        </div>
        <div class="grid grid-cols-[1fr,4fr] items-center gap-2 text-sm">
          <div class="bg-gray-100 flex justify-center items-center rounded-md border border-gray-300 h-8">
            대상 매장
          </div>
          <div class="mst003-vselect-slot min-w-0">
            <v-select
              v-model="deliveryCopyTargetStoreCd"
              :options="imageStoreOptions"
              label="strName"
              placeholder="매장 선택"
              class="custom-select2"
              append-to-body
              :clearable="true"
              :reduce="(item) => String(item.lngStoreCode)" />
          </div>
        </div>
        <div class="flex justify-end mt-1">
          <button type="button" @click="closeDeliveryCopyPopUp" class="whitebutton mst003-sub-btn">
            닫기
          </button>
        </div>
      </div>
    </div>
  </div>
  <div
    class="z-10 w-full min-w-0 shrink-0 overflow-x-auto rounded-lg bg-gray-200 px-12 py-4">
    <div class="mst003-search-grid min-w-0">
      <div class="mst003-cell">
        <span class="mst003-sg-label">매장명</span>
        <div class="mst003-cell-field mst003-pick-slot min-w-0">
          <PickStore
            compactSearchBar
            main-name="매장명"
            @update:storeGroup="lngStoreGroup"
            @update:storeCd="handleStoreCd"
            @storeNm="handlestoreNm"
            :hidesub="hidesub"
            :hideAttr="hideAttr"
            @update:ischanged="handleinitAll"
            @update:ischanged2="searchinit"></PickStore>
        </div>
      </div>
    </div>
  </div>
  <!-- 조회조건  END-->
  <!-- 그리드영역 -->
  <div
    class="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 px-4 pb-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6 lg:px-6">
    <div class="flex min-h-0 min-w-0 flex-col">
      <div
        class="mb-2 flex min-h-[2.75rem] flex-none items-center justify-between border-b border-gray-300 pb-2">
        <h2 class="text-lg font-bold leading-none tracking-tight text-gray-900">
          메뉴코드 목록
        </h2>
        <div class="flex gap-2">
          <button
            type="button"
            class="whitebutton mst003-sub-btn"
            @click="addRow"
            :disabled="!afterSearch">
            추가
          </button>
          <button
            type="button"
            class="whitebutton mst003-sub-btn"
            @click="deleteRow"
            :disabled="afterClick">
            삭제
          </button>
        </div>
      </div>

      <div class="mst003-filter-stack mb-2 w-full min-w-0">
        <div class="mst003-cell">
          <span class="mst003-sg-label">메뉴분류</span>
          <div class="mst003-cell-field mst003-dual-control flex min-w-0 gap-2">
            <select
              name="lngMainGroup"
              id="mst003-search-main-group"
              class="mst003-control min-w-0 flex-1"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in MenuGroup">
                [{{ i.GroupCd }}]{{ i.majorGroupNm }}
              </option>
            </select>
            <select
              name="lngSubGroup"
              id="mst003-search-sub-group"
              class="mst003-control min-w-0 flex-1"
              v-model="forsearchSub"
              @change="setSubCd">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup">
                [{{ i.GroupCd }}]{{ i.subGroupNm }}
              </option>
            </select>
          </div>
        </div>
        <div class="mst003-cell">
          <span class="mst003-sg-label">메뉴명/코드</span>
          <div class="mst003-cell-field min-w-0">
            <input
              type="text"
              id="mst003-search-menu"
              class="mst003-control w-full"
              @input="searchMenuList"
              v-model="searchWord" />
          </div>
        </div>
      </div>
      <div class="relative min-h-0 min-w-0 flex-1">
        <Realgrid
          class="h-full w-full"
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
          :exportExcelShowColumns="exportExcelShowColumnsMain"
          :exportExcelColumnHeaders="exportExcelColumnHeadersMain"
          @exportDone="onMainGridExportDone"
          :documentTitle="'MST01_003INS'"></Realgrid>
        <!-- :searchWord="searchWord" :searchColId2="'blnInactive,payDistinct'" :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" -->
      </div>
    </div>
    <!-- 그리드영역 -->
    <!-- 탭영역 -->
    <div class="flex min-h-0 min-w-0 flex-col">
      <div class="flex flex-none gap-1 border-b border-gray-300">
        <button
          class="contents_tab-button"
          @click="selectMenu(1)"
          :class="{ 'text-blue-600': selectedMenu == 1 }">
          상세정보
        </button>
        <button
          class="contents_tab-button disabled:bg-gray-50 disabled:text-gray-300"
          @click="selectMenu(2)"
          :class="{ 'text-blue-600': selectedMenu == 2 }"
          :disabled="discountDisabled || disableWithMenuDisc">
          할인선택
        </button>
        <button
          class="contents_tab-button disabled:bg-gray-50 disabled:text-gray-300"
          @click="selectMenu(3)"
          :class="{ 'text-blue-600': selectedMenu == 3 }"
          :disabled="selectedMultiple">
          이미지 설정
        </button>
        <button
          v-if="canUseDeliveryMenuTab"
          class="contents_tab-button disabled:bg-gray-50 disabled:text-gray-300"
          @click="selectMenu(4)"
          :class="{ 'text-blue-600': selectedMenu == 4 }"
          :disabled="selectedMultiple">
          배달메뉴 설정
        </button>
      </div>
      <div
        class="mst003-detail-panel min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1 pt-3">
        <div v-show="selectedMenu == 1" class="min-w-0">
          <div class="mst003-section-title">기본정보</div>
          <div class="mst003-form-grid mt-3 w-full">
            <div
              class="mst003-form-label mst003-form-label--required">
              *메뉴분류
            </div>
            <div class="mst003-field-span3 mst003-form-value flex min-w-0 gap-2">
              <select
                name="lngMainGroup"
                id=""
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
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
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                v-model="gridvalue2"
                @change="changeInfo"
                :disabled="afterClick">
                <option value="0">선택</option>
                <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup2">
                  [{{ i.GroupCd }}]{{ i.subGroupNm }}
                </option>
              </select>
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *메뉴코드
            </div>
            <div class="mst003-form-value mst003-form-value--inline gap-2">
              <input
                type="number"
                name="lngCode"
                class="mst003-control mst003-control--menu-code disabled:bg-gray-100"
                :disabled="!isNew || isNewAutoMenuCode"
                v-model="gridvalue3"
                @input="changeInfo" />
              <label class="mst003-auto-check shrink-0" for="autoMenuCode"
                ><input
                  type="checkbox"
                  id="autoMenuCode"
                  :checked="isNewAutoMenuCode"
                  :disabled="disableMenuAuto"
                  @change="setAuto" />자동</label
              >
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *유효기간
            </div>
            <div class="mst003-form-value mst003-dual-control flex min-w-0 gap-2">
              <input
                type="date"
                :disabled="afterClick"
                name="dtmFromDate"
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                v-model="gridvalue4"
                @input="changeInfo" />
              <input
                type="date"
                :disabled="afterClick"
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                name="dtmToDate"
                v-model="gridvalue5"
                @input="changeInfo" />
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *메뉴명
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue6"
                name="strName"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              메뉴명(영문)
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue7"
                name="strNameE"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              정상단가
            </div>
            <div class="mst003-form-value">
              <input
                type="number"
                name="lngDCPrice"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue8"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              옵션그룹선택
            </div>
            <div class="mst003-form-value mst003-form-value--inline gap-2">
              <select
                name="lngChain"
                id=""
                :disabled="afterClick"
                class="mst003-control min-w-0 flex-1 disabled:bg-gray-100"
                v-model="gridvalue9"
                @change="changeInfo">
                <option value="">선택</option>
                <option :value="i.lngCode" v-for="i in optionGroup">
                  [{{ i.lngCode }}]{{ i.strName }}
                </option>
              </select>
              <button
                type="button"
                class="whitebutton mst003-sub-btn shrink-0"
                @click="moveOptionGroupPage">
                옵션그룹 추가
              </button>
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *판매가
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                name="lngPrice"
                class="mst003-control w-full disabled:bg-gray-100"
                :disabled="afterClick"
                v-model="gridvalue10"
                @input="changeInfo" />
            </div>
            <div class="mst003-form-label">
              정상단가할인표기
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
                class="mst003-control ml-2 min-w-0 flex-1 disabled:bg-gray-200">
                <option value="">선택</option>
              </select>
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *과세구분
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
              class="mst003-form-label mst003-form-label--required">
              *사용여부
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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

            <div class="mst003-form-label">
              주방출력설정
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <button type="button" class="whitebutton mst003-sub-btn" @click="movePage">
                주방출력설정
              </button>
            </div>
          </div>
          <div class="mst003-section-title mt-5">부가정보</div>
          <div class="mst003-form-grid mt-3 w-full">
            <div
              class="mst003-form-label">
              {{ disableWithMenuDisc ? "할인허용" : "할인여부" }}
            </div>
            <div
              class="mst003-form-value mst003-form-value--inline"
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
              class="mst003-form-value"
              v-if="disableWithMenuDisc">
              <input
                type="text"
                id="discount1"
                name="lngDiscount"
                v-model="gridvalue40"
                @input="changeInfo"
                :disabled="afterClick"
                class="mst003-control w-full disabled:bg-gray-200" />
            </div>
            <div class="mst003-form-label">
              메뉴당객수
            </div>
            <div class="mst003-form-value">
              <input
                type="number"
                name="intCustCount"
                id=""
                class="mst003-control w-full disabled:bg-gray-100"
                v-model="gridvalue15"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="mst003-form-label mst003-form-label--required">
              *주메뉴종속
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
                class="mst003-control ml-2 min-w-0 flex-1 disabled:bg-gray-200"
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
            <div class="mst003-form-label">
              주문정렬순위
            </div>
            <div class="mst003-form-value">
              <input
                type="number"
                name="lngOrder"
                id=""
                class="mst003-control w-full disabled:bg-gray-100"
                v-model="gridvalue17"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              주방출력제외
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
            <div class="mst003-form-label">
              바코드
            </div>
            <div class="mst003-form-value">
              <input
                type="text"
                name="strBarCode"
                id=""
                class="mst003-control w-full disabled:bg-gray-100"
                v-model="gridvalue19"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              영수증출력제외
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
            <div class="mst003-form-label">
              메뉴주문옵션
            </div>
            <div class="mst003-form-value">
              <select
                name="lngMenuOption"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue21"
                @change="changeInfo"
                :disabled="afterClick">
                <option :value="i.strDCode" v-for="i in menuOrderOption">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="mst003-form-label">
              주문서출력제외
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
              <label for="discountfor1">
                <input
                  type="radio"
                  id="discountfor1"
                  name="blnFloat"
                  v-model="gridvalue22"
                  value="1"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />예
              </label>
              <label for="discountfor2">
                <input
                  type="radio"
                  id="discountfor2"
                  name="blnFloat"
                  v-model="gridvalue22"
                  value="0"
                  @input="changeInfo"
                  :disabled="afterClick"
                  class="disabled:bg-gray-200" />아니오
              </label>
            </div>
            <div class="mst003-form-label">
              메뉴옵션코드
            </div>
            <div class="mst003-form-value">
              <select
                name="strIcon"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue23"
                @change="changeInfo"
                :disabled="afterClick">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in menuOptionCode">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="mst003-form-label">
              주방단품출력
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
            <div class="mst003-form-label">
              서브타이틀
            </div>
            <div class="mst003-form-value">
              <select
                name="lngSubTitle"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                :disabled="afterClick"
                v-model="gridvalue25"
                @change="changeInfo">
                <option value="">선택</option>
                <option :value="i.lngCode" v-for="i in subTitle">
                  {{ i.strName }}
                </option>
              </select>
            </div>

            <div class="mst003-form-label">
              메뉴제공완료여부
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
            <div class="mst003-form-label">
              KDS출력
            </div>
            <div
              class="mst003-form-value mst003-form-value--inline">
              <input
                type="text"
                v-model="gridvalue38"
                :disabled="afterClick"
                name="lngKDS"
                class="mst003-control w-full"
                @input="onlyNumber" />
            </div>
            <div
              class="mst003-form-label">
              시세가적용
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
            <div class="mst003-form-label">
              주방출력명
            </div>
            <div
              class="mst003-form-value mst003-form-value--inline">
              <input
                type="text"
                v-model="gridvalue39"
                :disabled="afterClick"
                name="strNameK"
                class="mst003-control w-full"
                @input="changeInfo" />
            </div>
            <div
              class="mst003-form-label">
              배달메뉴
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
            <div class="mst003-grid-void" aria-hidden="true"></div>
            <div class="mst003-grid-void" aria-hidden="true"></div>
            <div class="mst003-form-label">
              영양소 정보
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                name="strNutrInfo"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue29"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              원산지 정보
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                name="strCntryOrg"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue30"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div class="mst003-form-label">
              메뉴설명
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                name="strMenuComment"
                id=""
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue31"
                @input="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="mst003-form-label">
              판매 시간대
            </div>
            <div class="mst003-form-value mst003-dual-control flex min-w-0 items-center gap-2">
              <input
                type="time"
                class="mst003-control min-w-0 flex-1"
                v-model="gridvalue32"
                name="dtmStart"
                @change="changeInfo"
                :disabled="afterClick" />
              <span class="shrink-0 text-sm text-gray-600">~</span>
              <input
                type="time"
                class="mst003-control min-w-0 flex-1"
                v-model="gridvalue33"
                name="dtmEnd"
                @change="changeInfo"
                :disabled="afterClick" />
            </div>
            <div
              class="mst003-form-label">
              판매일 설정
            </div>
            <div class="mst003-form-value mst003-form-value--inline">
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
              class="mst003-form-label">
              비고
            </div>
            <div class="mst003-field-span3 mst003-form-value">
              <input
                type="text"
                class="mst003-control w-full disabled:bg-gray-200"
                v-model="gridvalue41"
                name="strBigo"
                @change="changeInfo"
                :disabled="afterClick" />
            </div>
          </div>
        </div>
        <div v-show="selectedMenu == 2" class="flex min-w-0 flex-col h-full overflow-hidden">
          <div class="flex w-full items-center justify-between">
            <div class="mst003-section-title mb-0">할인설정</div>
            <div>
              <button type="button" class="whitebutton mst003-sub-btn" @click="copyButton2">
                할인설정복사
              </button>
            </div>
          </div>
          <div class="mst003-cell mt-3 w-full min-w-0">
            <span class="mst003-sg-label">결제코드/명</span>
            <div class="mst003-cell-field min-w-0">
              <input
                type="text"
                class="mst003-control w-full"
                @input="searchPayCd"
                v-model="searchWord2" />
            </div>
          </div>
          <div class="relative mt-3 min-h-[240px] flex-1">
          <Realgrid
            class="h-full w-full"
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
          </div>
          <!-- :searchColId2="'majorGroupCd,subGroupCd'" :searchColId="'menuCd,menuNm'" :searchColValue2="searchColValue3" :searchWord="searchWord2" -->
        </div>
        <div v-show="selectedMenu == 3" class="min-w-0">
          <div v-if="showImageGroupScopeControls" class="mst003-form-grid mt-3 w-full">
            <div class="mst003-form-label">공통 여부</div>
            <div class="mst003-field-span3 mst003-form-value">
              <select v-model="imageScope" class="mst003-control w-full">
                <option value="COMMON">공통(그룹)</option>
                <option value="STORE">매장별</option>
              </select>
            </div>

            <div class="mst003-form-label">저장 매장</div>
            <div class="mst003-field-span3 mst003-form-value mst003-vselect-slot">
              <v-select
                v-model="imageStoreCd"
                :options="imageStoreOptions"
                label="strName"
                placeholder="선택"
                class="custom-select2"
                append-to-body
                :clearable="true"
                :disabled="imageScope !== 'STORE'"
                :reduce="(item) => String(item.lngStoreCode)" />
            </div>
          </div>
          <div
            class="mt-6 grid w-full min-w-0 grid-cols-1 items-start gap-6 rounded-lg border border-gray-300 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div class="flex justify-center items-start w-full">
              <img
                :src="`https://www.pncapi.kr/MenuImage/Image/${currentImageFileName}?v=${Date.now()}`"
                @error="`../../assets/noimage2.png`"
                class="w-[80%] max-h-[min(40vh,320px)] object-contain" />
            </div>
            <div class="grid grid-rows-[1fr,5fr] grid-cols-[1fr,5fr] border w-full">
              <div
                class="customtableIndex border border-gray-400 rounded-l-lg h-full">
                파일명
              </div>
              <div class="flex h-full w-full items-center">
                <input
                  type="text"
                  v-model="fileName2"
                  class="border rounded-lg bg-gray-100 w-full"
                  disabled />
                <!--
                <button type="button" class="whitebutton mst003-sub-btn" @click="downloadFile">
                  다운로드
                </button>
                -->
                  <label for="fileInput" class="whitebutton mst003-sub-btn">
                    파일선택</label>
                  <input
                    id="fileInput"
                    type="file"
                    @change="handleFileUpload"
                    style="display: none"
                    accept=".jpg,.png,.jpeg" />
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
                    disabled />
                  <button
                    type="button"
                    class="whitebutton mst003-sub-btn"
                    @click="handleFileDelete">
                    파일삭제
                  </button>
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
        <div
          v-if="canUseDeliveryMenuTab"
          v-show="selectedMenu == 4"
          class="min-w-0">
          <div class="flex justify-end mb-2">
            <button
              type="button"
              class="whitebutton mst003-sub-btn"
              @click="openDeliveryCopyPopUp">
              배달메뉴복사
            </button>
          </div>
          <div class="mst003-form-grid mt-3 w-full">
            <div class="mst003-form-label">
              매장
            </div>
            <div class="mst003-field-span3 mst003-form-value mst003-vselect-slot">
              <v-select
                v-model="deliveryStoreCd"
                :options="imageStoreOptions"
                label="strName"
                placeholder="선택"
                class="custom-select2"
                append-to-body
                :clearable="true"
                :reduce="(item) => String(item.lngStoreCode)" />
            </div>

            <template v-for="deliveryRow in deliveryMenuRows" :key="deliveryRow.code">
              <div class="mst003-form-label">
                {{ deliveryRow.name }}
              </div>
              <div class="mst003-field-span3 mst003-form-value">
                <input
                  type="text"
                  v-model="deliveryRow.menuName"
                  class="mst003-control w-full"
                  placeholder="배달메뉴명 입력"
                  :disabled="!canEditDeliveryMenuRows" />
              </div>
            </template>
            <template v-if="deliveryMenuRows.length === 0">
              <div class="mst003-form-label">배달사</div>
              <div class="mst003-field-span3 mst003-form-value text-gray-500">
                배달사 정보가 없습니다.
              </div>
            </template>
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
  copyDeliveryMenuMap,
  deleteFile,
  getDeliveryMenuExcelColumn,
  getAmountListByMenuCode,
  getDeliveryMenuMap,
  getMenuCodeEnroll,
  getMenuDiscCount,
  getMenuDiscCount2,
  getMenuList,
  saveDeliveryMenuMap,
  saveMenuCode,
  saveDiscountCode,
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
import { getCommonList, getStoreList2 } from "@/api/common";
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

import { computed, nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

const hidesub = ref(true);
const hideAttr = ref(true);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  //comsole.log(store.state.userData.lngCommonMenu);

  const pageLog = await insertPageLog(store.state.activeTab2);
  ////console.log(store.state.userData.lngCommonMenu);

  let res = null;

  if (nowStoreCd.value == "0"){ 
    res = await getMenuDiscCount2(store.state.userData.lngStoreGroup);
  } else {
    res = await getMenuDiscCount(store.state.userData.lngStoreGroup, nowStoreCd.value);
  }

  if (res.data.List[0].count == "0") {
    disableWithMenuDisc.value = true;
  } else {
    disableWithMenuDisc.value = false;
  }

  const deliveryCompanyRes = await getCommonList(446);
  deliveryCompanyOptions.value = deliveryCompanyRes?.data?.List ?? [];
  await loadStoreOptions(groupCd.value);
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
  //console.log(e);
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
const deliveryMenuTabAllowedGroups = ["9999", "3048", "3287"];
const canUseDeliveryMenuTab = computed(() =>
  deliveryMenuTabAllowedGroups.includes(String(groupCd.value ?? ""))
);
const selectMenu = (newValue) => {
  if (newValue === 4 && !canUseDeliveryMenuTab.value) {
    selectedMenu.value = 1;
    return;
  }
  selectedMenu.value = newValue;
};
watch(canUseDeliveryMenuTab, (allowed) => {
  if (!allowed && selectedMenu.value === 4) {
    selectedMenu.value = 1;
  }
});
const deliveryStoreCd = ref("");
const deliveryCompany = ref("");
const deliveryMenuName = ref("");
const deliveryCompanyOptions = ref([]);
const deliveryMenuRows = ref([]);
const selectedMenuCodeForDelivery = ref("");
const canEditDeliveryMenuRows = computed(() => {
  const storeCd = normalizeDeliveryParam(deliveryStoreCd.value);
  const menuCd = normalizeDeliveryParam(
    selectedMenuCodeForDelivery.value || gridvalue3.value
  );
  return Boolean(storeCd && menuCd);
});
const resolveMenuCdFromRow = (row) => {
  if (Array.isArray(row)) {
    return normalizeDeliveryParam(row[0]);
  }
  return normalizeDeliveryParam(
    row?.lngCode ??
      row?.menuCd ??
      row?.lngMenu ??
      row?.lngMenuCode ??
      row?.LNG_CODE ??
      row?.MENU_CD ??
      row?.LNGCODE ??
      row?.MENUCODE ??
      row?.LNG_MENU ??
      row?.LNG_MENUCODE ??
      row?.lng_code ??
      row?.menu_code ??
      row?.lng_menu ??
      row?.lng_menucode
  );
};
const normalizeMenuCodeKey = (value) => {
  const raw = normalizeDeliveryParam(value);
  if (!raw) return "";
  if (/^\d+$/.test(raw)) return String(Number(raw));
  return raw.toUpperCase();
};
const normalizeDeliveryParam = (value) => {
  const strValue = value == null ? "" : String(value).trim();
  if (!strValue || strValue === "0" || strValue === "-1") return "";
  return strValue;
};
const resolveDeliveryMenuName = (response) => {
  const src = response?.data;
  const resultCd = String(src?.RESULT_CD ?? src?.result_cd ?? "");
  const list = Array.isArray(src?.List)
    ? src.List
    : Array.isArray(src?.list)
      ? src.list
      : [];

  // C# getDeliveryMenuMap 응답 스펙: RESULT_CD == "00" && List[0].strInfo1
  if (resultCd === "00" && list.length > 0) {
    const first = list[0] || {};
    return String(first?.strInfo1 ?? first?.STRINFO1 ?? first?.STR_INFO1 ?? "");
  }

  // 하위호환(기존/타 응답 포맷)
  const row = (Array.isArray(src) && src[0]) || src?.Map || src || {};
  return String(
    row?.strDeliveryMenuName ??
      row?.STR_DELIVERY_MENU_NAME ??
      row?.deliveryMenuName ??
      row?.strMenuName ??
      row?.STR_MENU_NAME ??
      row?.strInfo1 ??
      ""
  );
};
const extractResultCode = (response) =>
  String(response?.data?.RESULT_CD ?? response?.data?.result_cd ?? "");
const extractResultName = (response) =>
  String(response?.data?.RESULT_NM ?? response?.data?.result_nm ?? "");
const extractDuplicateMenuCd = (response) => {
  const data = response?.data ?? {};
  const directCd = normalizeDeliveryParam(
    data?.DUPLICATE_MENU_CD ??
      data?.duplicate_menu_cd ??
      data?.DUPLICATE_MENUCODE ??
      data?.duplicateMenuCd
  );
  if (directCd) return directCd;

  const resultName = extractResultName(response);
  const matched = resultName.match(/\b\d+\b/);
  return matched ? normalizeDeliveryParam(matched[0]) : "";
};
const extractDeliveryMapList = (response) => {
  const src = response?.data;
  if (Array.isArray(src?.List)) return src.List;
  if (Array.isArray(src?.list)) return src.list;
  return [];
};
const buildDeliveryMenuRows = () =>
  (deliveryCompanyOptions.value || [])
    .filter((item) => normalizeDeliveryParam(item?.strDCode) !== "")
    .map((item) => ({
      code: normalizeDeliveryParam(item?.strDCode),
      name: String(item?.strDName ?? item?.strDCode ?? ""),
      menuName: "",
      originalMenuName: "",
    }));
const loadDeliveryMenuName = async () => {
  const storeCd = normalizeDeliveryParam(deliveryStoreCd.value);
  const menuCd = normalizeDeliveryParam(
    selectedMenuCodeForDelivery.value || gridvalue3.value
  );
  // console.log("[MST01_003INS][DELIVERY_MAP] request params", {
  //   GROUP_CD: groupCd.value,
  //   STORE_CD: storeCd,
  //   DELIVERY_CD: deliveryCd,
  //   MENU_CD: menuCd,
  //   selectedMenuCodeForDelivery: selectedMenuCodeForDelivery.value,
  //   gridvalue3: gridvalue3.value,
  // });
  const baseRows = buildDeliveryMenuRows();
  deliveryMenuRows.value = baseRows;

  if (!storeCd || !menuCd || baseRows.length === 0) {
    deliveryMenuName.value = "";
    return;
  }
  try {
    const loadedRows = await Promise.all(
      baseRows.map(async (row) => {
        const res = await getDeliveryMenuMap(groupCd.value, storeCd, row.code, menuCd);
        const loadedName = String(resolveDeliveryMenuName(res) ?? "").trim();
        return {
          ...row,
          menuName: loadedName,
          originalMenuName: loadedName,
        };
      })
    );
    deliveryMenuRows.value = loadedRows;

    const selectedCd = normalizeDeliveryParam(deliveryCompany.value);
    const selectedRow = loadedRows.find((row) => row.code === selectedCd);
    deliveryMenuName.value = selectedRow?.menuName ?? "";
  } catch (error) {
    console.error("[MST01_003INS][DELIVERY_MAP] request failed", error);
    deliveryMenuRows.value = baseRows;
    deliveryMenuName.value = "";
  }
};

/*
 * 공통 표준  Function
 */

watch(selectedMenu, () => {
  if (selectedMenu.value !== 2) return;
  const reagrid2 = document.getElementById(realgrid2Name.value);
  if (!reagrid2) return;
  setTimeout(() => {
    const instance = RealGrid.getGridInstance(reagrid2);
    if (!instance) return;
    instance.resetSize();
    instance.refresh(true);
  }, 100);
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
const storeOptions = ref([]);
const imageScope = ref("COMMON");
const imageStoreCd = ref("");
const pickedStoreCd = ref("");
/** 공통메뉴 플래그 — PickStore·저장 시 storecode 등 기존 동작 유지 */
const isStoreImageFeatureEnabled = computed(() => {
  const commonMenuFlag =
    store.state.userData.intCommonMenu ?? store.state.userData.lngCommonMenu;
  return String(commonMenuFlag) === "1";
});
/** 이미지 설정 탭 — 공통(그룹)/저장 매장 행만 허용할 매장 그룹 */
const MENU_IMAGE_SCOPE_STORE_GROUPS = [3051, 9999];
const isImageScopeStoreGroup = computed(() =>
  MENU_IMAGE_SCOPE_STORE_GROUPS.includes(Number(groupCd.value))
);
/** 공통 여부·저장 매장 UI 및 매장별 파일명 규칙 (위 두 조건 동시 만족) */
const showImageGroupScopeControls = computed(
  () => isStoreImageFeatureEnabled.value && isImageScopeStoreGroup.value
);
watch(
  isStoreImageFeatureEnabled,
  (enabled) => {
    hidesub.value = !enabled;
    hideAttr.value = !enabled;
  },
  { immediate: true }
);
watch(showImageGroupScopeControls, (ok) => {
  if (!ok && imageScope.value === "STORE") {
    imageScope.value = "COMMON";
    imageStoreCd.value = "";
  }
});
const normalizeStoreOption = (item) => {
  const lngStoreCode =
    item?.lngStoreCode ?? item?.LngStoreCode ?? item?.storeCd ?? item?.STORE_CD;
  if (lngStoreCode == null || lngStoreCode === "") {
    return null;
  }
  return {
    ...item,
    lngStoreCode,
    strName:
      item?.strName ??
      item?.strStoreName ??
      item?.StrStoreName ??
      item?.STORE_NM ??
      String(lngStoreCode),
  };
};
const normalizeStoreList = (payload) => {
  const rawList = payload?.data?.List ?? payload?.data?.store ?? payload?.data ?? [];
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeStoreOption).filter(Boolean);
};
const loadStoreOptions = async (targetGroupCd = groupCd.value) => {
  try {
    const storeRes = await getStoreList2(targetGroupCd);
    storeOptions.value = normalizeStoreList(storeRes);
  } catch (error) {
    storeOptions.value = [];
  }
};
const imageStoreOptions = computed(() => {
  if (storeOptions.value.length > 0) {
    return storeOptions.value;
  }
  return (store.state.storeCd || []).map(normalizeStoreOption).filter(Boolean);
});
const normalizeImageStoreCd = (value) => {
  const strValue = value != null ? String(value) : "";
  if (!strValue || strValue === "-1" || strValue === "0") {
    return "";
  }
  return strValue;
};
const getEffectiveImageStoreCode = () => {
  if (!showImageGroupScopeControls.value || imageScope.value !== "STORE") {
    return "";
  }
  const selected = normalizeImageStoreCd(imageStoreCd.value || pickedStoreCd.value);
  return selected && selected !== "-1" && selected !== "0" ? selected : "";
};
watch(imageScope, (newValue) => {
  if (newValue !== "STORE") {
    // 공통(그룹) 전환 시 저장 매장을 "선택" 상태로 초기화
    imageStoreCd.value = "";
  }
});
const buildImageFileName = (menuCd, fallbackFileName = "") => {
  if (!showImageGroupScopeControls.value || imageScope.value !== "STORE") {
    return fallbackFileName || "";
  }
  const effectiveStoreCd = getEffectiveImageStoreCode();
  if (!effectiveStoreCd || !menuCd) {
    return fallbackFileName || "";
  }
  return (
    String(effectiveStoreCd).padStart(10, "0") +
    "_" +
    String(menuCd).padStart(10, "0") +
    ".jpg"
  );
};
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
// 할인선택 변경 감지용
const originalDiscountData = ref({}); // { menuCode: "strAmtCodeList" } 형태로 저장
const discountChanged = ref(false); // 할인선택 변경 여부 플래그
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
watch([deliveryStoreCd, selectedMenuCodeForDelivery, gridvalue3, deliveryCompanyOptions], () => {
  loadDeliveryMenuName();
});
watch(gridvalue3, (newMenuCd) => {
  const normalized = normalizeDeliveryParam(newMenuCd);
  if (normalized && normalized !== selectedMenuCodeForDelivery.value) {
    selectedMenuCodeForDelivery.value = normalized;
  }
});
const clickedrowdata = ref([]);
const clickrowData4 = ref([]);
const filteredrowData5 = ref([]);
const afterClick = ref(true);
const fileName = ref();
const currentImageFileName = computed(() =>
  buildImageFileName(gridvalue3.value, fileName.value)
);
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
  //console.log(timeStr);
  if (!timeStr) return "";

  // "오전 12:00:00" → ["오전", "12:00:00"]

  const [no, ampm, time] = timeStr.split(" ");
  let [hour, minute, second] = time.split(":").map(Number);
  //console.log(hour);
  //console.log(minute);
  //console.log(second);
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
  const payloadMenuCd = resolveMenuCdFromRow(newvalue);
  afterClick.value = false;
  // if (newvalue[9] == 0 || newvalue[12] == 0) {
  if (newvalue[9] == 0) {
    // 판매가 
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
  selectedMenuCodeForDelivery.value =
    payloadMenuCd || normalizeDeliveryParam(gridvalue3.value);
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
  // 최초 메뉴 선택 시에도 표시 파일명을 현재 이미지 규칙과 동일하게 노출
  fileName2.value = currentImageFileName.value || "";
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
  
  // 할인선택 원본 데이터 저장 (변경 감지용)
  const currentMenuCode = newvalue[0]?.toString();
  if (currentMenuCode) {
    originalDiscountData.value[currentMenuCode] = newvalue[32] || "";
    discountChanged.value = false; // 행 클릭 시 변경 플래그 초기화
  }
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
      `https://www.pncapi.kr/MenuImage/Image/${currentImageFileName.value}?v=${Date.now()}`
    );
    await nextTick();
    //console.log(response);
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
    
    // 파일 input 리셋
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.value = "";
    }
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

const lngStoreGroup = async (e) => {
  groupCd.value = e;
  await loadStoreOptions(e);
};
/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  ////console.log(newValue);
  pickedStoreCd.value = String(newValue);
  if (!imageStoreCd.value || imageStoreCd.value == "-1") {
    imageStoreCd.value = normalizeImageStoreCd(newValue);
  }
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
  if (isStoreImageFeatureEnabled.value) {
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
  const newDiscountValue = e
    .filter((item) => item.lngMenu !== "0")
    .map((item2) => Number(item2.lngCode))
    .join(";");
  
  changeValue2.value = newDiscountValue;

  // 할인선택 변경 감지: 원본 데이터와 비교
  const currentMenuCode = gridvalue3.value?.toString();
  if (currentMenuCode && originalDiscountData.value[currentMenuCode] !== undefined) {
    const originalValue = originalDiscountData.value[currentMenuCode] || "";
    if (originalValue !== newDiscountValue) {
      discountChanged.value = true;
    } else {
      // 원본과 동일하면 변경 없음으로 표시
      discountChanged.value = false;
    }
  } else {
    // 원본 데이터가 없으면 변경된 것으로 간주
    discountChanged.value = true;
  }

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
      "lngMainGroup,lngSubGroup,dtmFromDate,dtmToDate,strName,lngPrice,lngTax,blnInactive,strAmtCodeList,lngDCPrice,lngChain,blnDCPriceYN,lngDiscount,intCustCount,lngOrder,lngKPG,blnReceipt,lngMenuOption,blnFloat,strIcon,blnKitSingle,lngSubTitle,blnServing,blnOpen,blnDeliveryYN";
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
      "1" + // lngKPG (주방출력제외 - 아니오)
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
    // 주방출력제외 초기값을 "아니오"(1)로 설정 (UI 반영)
    gridvalue18.value = "1";
    disabledKPG.value = false;
    showKPG.value = true;
  }
};

/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = () => {
  // 현재 선택된 행이 신규행인지 확인
  if (rowIndex.value === undefined || rowIndex.value === null) {
    Swal.fire({
      title: "경고",
      text: "삭제할 행을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // 신규행 확인 방법 1: created 배열에 포함되어 있는지 확인
  const isNewRowInCreated = updateDeleteInsertrowIndex.value.created?.includes(rowIndex.value) || false;
  
  // 신규행 확인 방법 2: rowData의 new 속성 또는 sequence 확인
  const currentRow = rowData.value[rowIndex.value];
  const isNewRowByProperty = currentRow?.new === true || currentRow?.sequence?.toString().startsWith('new') || false;

  // 신규행이 아닌 경우 경고 메시지 표시
  if (!isNewRowInCreated && !isNewRowByProperty) {
    Swal.fire({
      title: "경고",
      text: "신규로 추가된 행만 삭제할 수 있습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  // 신규행인 경우에만 삭제 실행
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

const saveDeliveryMenuTab = async () => {
  const targetStoreCd = normalizeDeliveryParam(deliveryStoreCd.value);
  const targetMenuCd = normalizeDeliveryParam(
    selectedMenuCodeForDelivery.value || gridvalue3.value
  );
  const targetMenuName = String(gridvalue6.value ?? "").trim();

  const rowsToSave = (deliveryMenuRows.value || [])
    .map((row) => ({
      code: normalizeDeliveryParam(row?.code),
      menuName: String(row?.menuName ?? "").trim(),
      originalMenuName: String(row?.originalMenuName ?? "").trim(),
    }))
    .filter((row) => row.code && row.menuName !== row.originalMenuName);

  if (rowsToSave.length === 0) {
    Swal.fire({
      title: "경고",
      text: "변경된 배달메뉴명이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (!targetStoreCd || !targetMenuCd) {
    Swal.fire({
      title: "경고",
      text: "매장, 메뉴코드를 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  Swal.fire({
    title: "저장",
    text: "배달메뉴 설정을 저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    store.state.loading = true;
    try {
      for (const row of rowsToSave) {
        const targetDeliveryCd = row.code;
        const targetDeliveryMenuName = row.menuName;
        const savePayloadBase = {
          GROUP_CD: groupCd.value,
          STORE_CD: targetStoreCd,
          MENU_CD: targetMenuCd,
          DELIVERY_CD: targetDeliveryCd,
          STR_NAME: targetMenuName,
          STR_INFO1: targetDeliveryMenuName,
        };
        let saveRes = await saveDeliveryMenuMap({
          ...savePayloadBase,
          OVERWRITE_YN: "N",
        });

        if (extractResultCode(saveRes) === "97") {
          let duplicateMenuCdForMsg = extractDuplicateMenuCd(saveRes);
          try {
            if (!duplicateMenuCdForMsg) {
              const duplicateCheckRes = await getDeliveryMenuMap(
                groupCd.value,
                targetStoreCd,
                targetDeliveryCd,
                ""
              );
              const targetInfo1 = targetDeliveryMenuName.trim().toLowerCase();
              const duplicateRow = extractDeliveryMapList(duplicateCheckRes).find((item) => {
                const rowInfo1 = String(
                  item?.strInfo1 ?? item?.STR_INFO1 ?? item?.STRINFO1 ?? ""
                )
                  .trim()
                  .toLowerCase();
                const rowMenuCd = normalizeDeliveryParam(
                  item?.lngCode ?? item?.MENU_CD ?? item?.lngcode ?? item?.menuCd
                );
                return rowInfo1 === targetInfo1 && rowMenuCd !== targetMenuCd;
              });
              duplicateMenuCdForMsg = normalizeDeliveryParam(
                duplicateRow?.lngCode ??
                  duplicateRow?.MENU_CD ??
                  duplicateRow?.lngcode ??
                  duplicateRow?.menuCd
              );
            }
          } catch (_) {}

          const duplicateConfirm = await Swal.fire({
            title: "중복 배달메뉴명",
            text: duplicateMenuCdForMsg
              ? `${duplicateMenuCdForMsg} 메뉴코드가 이미 해당 배달메뉴명을 사용 중입니다. 그래도 저장하시겠습니까?`
              : "다른 메뉴코드에 중복된 배달메뉴명이 있습니다. 그래도 저장하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오",
          });

          if (!duplicateConfirm.isConfirmed) {
            return;
          }

          saveRes = await saveDeliveryMenuMap({
            ...savePayloadBase,
            OVERWRITE_YN: "Y",
          });
        }

        if (extractResultCode(saveRes) !== "00") {
          Swal.fire({
            title: "저장이 실패되었습니다.",
            text: extractResultName(saveRes) || "저장 중 오류가 발생했습니다.",
            confirmButtonText: "확인",
          });
          return;
        }
      }

      Swal.fire({
        title: "저장 되었습니다.",
        confirmButtonText: "확인",
      });
      await loadDeliveryMenuName();
    } catch (error) {
      Swal.fire({
        title: "저장이 실패되었습니다.",
        confirmButtonText: "확인",
      });
    } finally {
      store.state.loading = false;
    }
  });
};

/**
 *  저장 버튼 함수
 */

const saveButton = () => {
  if (selectedMenu.value === 4) {
    saveDeliveryMenuTab();
    return;
  }
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
  const changedRowCount =
    updateDeleteInsertrowIndex.value.deleted.length +
    updateDeleteInsertrowIndex.value.created.length +
    updateDeleteInsertrowIndex.value.updated.length;
  const hasFileUploadChange = uploadImages.value.length > 0;

  if (changedRowCount === 0 && !hasFileUploadChange) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  //console.log(updateRow.value);
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
      if (
        showImageGroupScopeControls.value &&
        imageScope.value === "STORE" &&
        uploadImages.value.length > 0 &&
        !getEffectiveImageStoreCode()
      ) {
        Swal.fire({
          title: "경고",
          text: "매장별 이미지 저장 시 저장 매장을 선택하세요.",
          icon: "warning",
          confirmButtonText: "확인",
        });
        return;
      }
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
          filterAndMap("blnFloat"),
          filterAndMap("strIcon"),
          filterAndMap("blnKitSingle"),
          filterAndMap("lngSubTitle"),
          filterAndMap("blnServing"),
          filterAndMap("blnOpen"),
          filterAndMap("blnDeliveryYN"),
          filterAndMap("strNutrInfo"),
          filterAndMap("strCntryOrg"),
          filterAndMap("strMenuComment"),
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
        //console.log(res);
        //console.log(res);

        //comsole.log(updatedAndInsertRow);

        //comsole.log(uploadImages.value);
        //comsole.log(updateRow.value);

        const formData = new FormData();

        let storecode = nowStoreCd.value;
        if (
          showImageGroupScopeControls.value &&
          imageScope.value === "STORE"
        ) {
          storecode = getEffectiveImageStoreCode();
        } else if (isStoreImageFeatureEnabled.value) {
          storecode = groupCd.value;
        }

        if (groupCd.value == "1989" || groupCd.value == "1750") {
          storecode = groupCd.value;
        }

        formData.append("groupCd", groupCd.value);

        uploadImages.value.forEach((file, index) => {
          const existedName = uploadImagesCd.value[index];

          let newFileName =
            String(storecode).padStart(10, 0) +
            "_" +
            String(existedName).padStart(10, 0) +
            ".jpg";

          //console.log(newFileName);
          const newFile = new File([file], newFileName, { type: file.type });
          formData.append(`file${index}`, newFile);
        });

        if (uploadImages.value.length >= 1) {
          try {
            const res2 = await uploadFile(formData);
            // console.log(res2);
          } catch (error) {
            store.state.loading = false;
          } finally {
            store.state.loading = false;
          }
        }

        // 할인선택 변경이 있을 때만 저장
        if (discountChanged.value) {
          try {
            const res3 = await saveDiscountCode(
              groupCd.value,
              nowStoreCd.value,
              filterAndMap("lngCode"),
              filterAndMap("strAmtCodeList"),
              filterAndMap("lngPrice"),
              filterAndMap("discountYN"),
              isNewAutoMenuCode.value == true ? 1 : 0
            );
            
            // console.log(res3);
            
            // 저장 후 원본 데이터 업데이트 및 플래그 초기화
            updatedAndInsertRow.forEach((item) => {
              const menuCode = item.lngCode?.toString();
              if (menuCode) {
                originalDiscountData.value[menuCode] = item.strAmtCodeList || "";
              }
            });
            discountChanged.value = false;
          } catch (error) {
            // console.error("할인선택 저장 실패:", error);
            // 에러 발생 시에도 계속 진행
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

        // 파일 input 리셋
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.value = "";
        }

        searchButton();
      }
    }
  });
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newvalue) => {
  //console.log(newvalue);
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
  selectedMenuCodeForDelivery.value = "";
  //initFocus.value = !initFocus.value
  fileName.value = "";
  fileSize.value = "";
  fileName2.value = "";
  imageScope.value = "COMMON";
  imageStoreCd.value = normalizeImageStoreCd(pickedStoreCd.value);

  isNewAutoMenuCode.value = false;
  isNew.value = false;
  disableMenuAuto.value = true;
  uploadImages.value = [];
  uploadImagesCd.value = [];
  // 할인선택 관련 초기화
  originalDiscountData.value = {};
  discountChanged.value = false;
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
  //console.log(fileName2.value);
  changeColid.value = "strUserFileName";
  changeValue2.value = fileName2.value;
  //comsole.log(changeValue2.value);
  changeNow.value = !changeNow.value;

  const file = e.target.files[0];
  uploadImage.value = new File([file], changeValue2.value, { type: file.type });
  
  // 같은 메뉴코드에 대한 기존 파일 제거
  const existingIndex = uploadImagesCd.value.findIndex(cd => cd === gridvalue3.value);
  if (existingIndex !== -1) {
    uploadImages.value.splice(existingIndex, 1);
    uploadImagesCd.value.splice(existingIndex, 1);
  }
  
  // 새 파일 추가
  uploadImages.value.push(uploadImage.value);
  uploadImagesCd.value.push(gridvalue3.value);
  
  // 파일 input 리셋 (같은 파일을 다시 선택할 수 있도록)
  e.target.value = "";
  //comsole.log(uploadImages.value);
};

const handleFileDelete = async () => {
  if (!showImageGroupScopeControls.value || imageScope.value !== "STORE") {
    Swal.fire({
      title: "경고",
      text: "공통 여부가 '매장별'일 때만 파일 삭제가 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!getEffectiveImageStoreCode()) {
    Swal.fire({
      title: "경고",
      text: "저장 매장을 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (!gridvalue3.value) {
    Swal.fire({
      title: "경고",
      text: "메뉴를 선택하세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const result = await Swal.fire({
    title: "확인",
    text: "정말 삭제하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
  });
  if (!result.isConfirmed) {
    return;
  }


  if (currentImageFileName.value) {
    try {
      const deleteFormData = new FormData();
      deleteFormData.append("groupCd", groupCd.value);
      deleteFormData.append("fileName", currentImageFileName.value);
      await deleteFile(deleteFormData);
      Swal.fire({
        title: "이미지 파일을 삭제 하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } catch (error) {
      Swal.fire({
        title: "오류",
        text: "파일 삭제에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      store.state.loading = false;
      return;
    } finally {
      store.state.loading = false;
    }
  }

  changeColid.value = "strUserFileName";
  changeValue2.value = "";
  changeNow.value = !changeNow.value;

  fileName.value = "";
  fileName2.value = "";
  fileSize.value = "";
  uploadImage.value = { name: "" };

  const existingIndex = uploadImagesCd.value.findIndex(
    (cd) => cd === gridvalue3.value
  );
  if (existingIndex !== -1) {
    uploadImages.value.splice(existingIndex, 1);
    uploadImagesCd.value.splice(existingIndex, 1);
  }

  const fileInput = document.getElementById("fileInput");
  if (fileInput) {
    fileInput.value = "";
  }
};

const refreshImageMeta = async () => {
  if (!gridvalue3.value || !currentImageFileName.value) {
    fileSize.value = "";
    return;
  }
  try {
    const response = await axios.get(
      `https://www.pncapi.kr/MenuImage/Image/${currentImageFileName.value}?v=${Date.now()}`
    );
    fileSize.value = response.headers["content-length"];
  } catch (error) {
    fileSize.value = "";
  }
};

watch([imageScope, imageStoreCd], async () => {
  if (!showImageGroupScopeControls.value) {
    return;
  }
  if (selectedMenu.value !== 3) {
    return;
  }
  // 이미지 대상/저장 매장 변경 시 파일명 표시도 현재 규칙에 맞춰 동기화
  fileName2.value = currentImageFileName.value || "";
  await refreshImageMeta();
});

const downloadFile = async () => {
  ////console.log(store.state.StoreToken);
  try {
    const response = await axios.get(
      `https://www.pncapi.kr/MenuImage/Image/${currentImageFileName.value}`,
      {
        responseType: "blob", // 응답을 Blob 형태로 받음
      }
    );

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${currentImageFileName.value}`; // 다운로드 파일명 설정
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
const showDeliveryCopyPopUp = ref(false);
const deliveryCopyTargetStoreCd = ref("");
const deliveryCopyBaseStoreLabel = computed(() => {
  const baseStoreCd = normalizeDeliveryParam(deliveryStoreCd.value);
  if (!baseStoreCd) return "미선택";
  const hit = (imageStoreOptions.value || []).find(
    (item) => String(item.lngStoreCode) === baseStoreCd
  );
  if (!hit) return `[${baseStoreCd}]`;
  return `[${hit.lngStoreCode}] ${hit.strName}`;
});
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
const openDeliveryCopyPopUp = () => {
  if (!normalizeDeliveryParam(deliveryStoreCd.value)) {
    Swal.fire({
      title: "경고",
      text: "기준 매장을 선택해야 배달메뉴복사가 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!normalizeDeliveryParam(selectedMenuCodeForDelivery.value || gridvalue3.value)) {
    Swal.fire({
      title: "경고",
      text: "복사할 기준 메뉴를 먼저 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  deliveryCopyTargetStoreCd.value = "";
  showDeliveryCopyPopUp.value = true;
};
const closeDeliveryCopyPopUp = () => {
  showDeliveryCopyPopUp.value = false;
};
const copyDeliveryMenuToStore = async () => {
  const baseStoreCd = normalizeDeliveryParam(deliveryStoreCd.value);
  const targetStoreCd = normalizeDeliveryParam(deliveryCopyTargetStoreCd.value);
  const menuCd = normalizeDeliveryParam(selectedMenuCodeForDelivery.value || gridvalue3.value);
  const menuNm = String(gridvalue6.value ?? "").trim();

  if (!baseStoreCd) {
    Swal.fire({
      title: "경고",
      text: "기준 매장을 선택해야 배달메뉴복사가 가능합니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!targetStoreCd) {
    Swal.fire({
      title: "경고",
      text: "복사할 대상 매장을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (!menuCd) {
    Swal.fire({
      title: "경고",
      text: "기준 메뉴코드를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (baseStoreCd === targetStoreCd) {
    Swal.fire({
      title: "경고",
      text: "기준 매장과 대상 매장이 같습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const confirm = await Swal.fire({
    title: "복사",
    text: "기준 매장의 해당 메뉴에 대한 모든 배달사 설정을 대상 매장으로 복사하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "복사",
    cancelButtonText: "취소",
  });
  if (!confirm.isConfirmed) return;

  try {
    store.state.loading = true;
    const res = await copyDeliveryMenuMap({
      GROUP_CD: groupCd.value,
      BASE_STORE_CD: baseStoreCd,
      TARGET_STORE_CD: targetStoreCd,
      MENU_CD: menuCd,
      STR_NAME: menuNm,
    });

    if (res?.data?.RESULT_CD === "00") {
      Swal.fire({
        title: "성공",
        text: "복사를 완료하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      showDeliveryCopyPopUp.value = false;
      if (targetStoreCd === normalizeDeliveryParam(deliveryStoreCd.value)) {
        await loadDeliveryMenuName();
      }
      return;
    }

    Swal.fire({
      title: "실패",
      text: `복사에 실패하였습니다. ${res?.data?.RESULT_NM ?? ""}`,
      icon: "error",
      confirmButtonText: "확인",
    });
  } catch (error) {
    Swal.fire({
      title: "실패",
      text: "복사 처리 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
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
const defaultExportShowColumns = ["strBarCode", "strBigo"];
const exportExcelShowColumnsMain = ref([...defaultExportShowColumns]);
const exportExcelColumnHeadersMain = ref({});
const exportRestoreBackupMap = ref(null);
const exportRestoreTimer = ref(null);
const restoreExcelExportRows = () => {
  const backup = exportRestoreBackupMap.value;
  if (!backup) return;
  for (const [row, prevValues] of backup.entries()) {
    if (!row || !prevValues) continue;
    for (const [fieldName, oldValue] of Object.entries(prevValues)) {
      if (oldValue === undefined) delete row[fieldName];
      else row[fieldName] = oldValue;
    }
  }
  rowData.value = [...rowData.value];
  exportRestoreBackupMap.value = null;
  exportExcelShowColumnsMain.value = [...defaultExportShowColumns];
  exportExcelColumnHeadersMain.value = {};
  if (exportRestoreTimer.value) {
    clearTimeout(exportRestoreTimer.value);
    exportRestoreTimer.value = null;
  }
};
const onMainGridExportDone = () => {
  restoreExcelExportRows();
  store.state.loading = false;
};
const pulseGridExcelExport = async () => {
  exporttoExcel.value = false;
  await nextTick();
  exporttoExcel.value = true;
};
const resolveDeliveryMenuNameFromMapRow = (row) =>
  String(
    row?.strInfo1 ??
      row?.STRINFO1 ??
      row?.STR_INFO1 ??
      row?.strDeliveryMenuName ??
      row?.STR_DELIVERY_MENU_NAME ??
      ""
  ).trim();
const excelButton = async () => {
  try {
    // console.log("[MST01_003INS][EXCEL] click", {
    //   selectedMenu: selectedMenu.value,
    //   rowCount: Array.isArray(rowData.value) ? rowData.value.length : 0,
    //   exporttoExcelBefore: exporttoExcel.value,
    // });
    if (exportRestoreTimer.value) {
      clearTimeout(exportRestoreTimer.value);
      exportRestoreTimer.value = null;
    }

    documentTitle.value = "메뉴코드";
    exportExcelShowColumnsMain.value = [...defaultExportShowColumns];
    exportExcelColumnHeadersMain.value = {};

    // [임시 비활성화] 배달메뉴설정 탭(selectedMenu === 4) 엑셀 확장 로직
    // 검수/배포 안정화를 위해 아래 로직 전체를 막고, 초기 공통 엑셀 추출만 수행합니다.
    // if (selectedMenu.value === 4) {
    //   const exportStoreCd = normalizeDeliveryParam(deliveryStoreCd.value || nowStoreCd.value);
    //   ... 배달사별 동적 컬럼 생성/매핑/원복 로직 ...
    // }
    await pulseGridExcelExport();

    // console.log("[MST01_003INS][EXCEL] trigger sent", {
    //   exporttoExcelAfter: exporttoExcel.value,
    //   documentTitle: documentTitle.value,
    // });
  } catch (e) {
    // console.error("[MST01_003INS][EXCEL] failed", e);
    Swal.fire({
      title: "실패",
      text: "엑셀 추출 처리 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  }
};
</script>

<style scoped>
.mst003-page {
  --mst003-label-col: 7rem;
  --mst003-item-gap: 0.75rem;
  --mst003-control-border: #cbd5e1;
  --mst003-control-focus-border: #3b82f6;
  --mst003-control-h: 1.75rem;
  --mst003-control-radius: 0.375rem;
  --mst003-cell-py: 0.125rem;
}

.mst003-search-grid {
  width: 100%;
  min-width: 0;
  --mst003-control-h: 2rem;
}

.mst003-search-grid .mst003-cell {
  max-width: 52rem;
}

.mst003-filter-stack {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--mst003-item-gap);
}

/* 메뉴분류 select — 메뉴명/코드 input과 동일 높이·체감 */
.mst003-filter-stack input.mst003-control {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  box-sizing: border-box;
  padding: 0 0.5rem !important;
  font-size: 0.875rem !important;
  line-height: calc(var(--mst003-control-h) - 2px) !important;
}

.mst003-filter-stack select.mst003-control {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  box-sizing: border-box;
  padding: 0 1.75rem 0 0.5rem !important;
  font-size: 0.875rem !important;
  line-height: calc(var(--mst003-control-h) - 2px) !important;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M3 4.5 6 7.5 9 4.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.75rem;
}

.mst003-filter-stack .mst003-dual-control {
  align-items: stretch;
  min-height: var(--mst003-control-h);
}

.mst003-filter-stack .mst003-dual-control select.mst003-control {
  align-self: stretch;
}

.mst003-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--mst003-item-gap);
}

.mst003-sg-label {
  flex: 0 0 var(--mst003-label-col);
  width: var(--mst003-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
}

.mst003-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst003-cell-field:not(.mst003-dual-control):not(.mst003-vselect-slot) > * {
  min-width: 0;
  width: 100%;
}

.mst003-control {
  box-sizing: border-box;
  height: var(--mst003-control-h);
  min-height: var(--mst003-control-h);
  max-height: var(--mst003-control-h);
  width: 100%;
  min-width: 0;
  border-radius: var(--mst003-control-radius);
  border: 1px solid var(--mst003-control-border);
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  line-height: 1;
}

.mst003-page select.mst003-control,
.mst003-page input.mst003-control {
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
}

.mst003-control:focus,
.mst003-control:focus-visible {
  border-color: var(--mst003-control-focus-border) !important;
  outline: none;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.25);
}

.mst003-control:disabled {
  background: #f3f4f6;
}

.mst003-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem !important;
}

.mst003-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}

/* 상단 매장명: 그룹·속성·매장 = 3:4:5 */
.mst003-pick-slot :deep(> .flex > div:has(#storeGroup)) {
  flex: 3 1 0 !important;
  min-width: 0;
  width: auto !important;
}

.mst003-pick-slot :deep(#storeGroup) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.mst003-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup))) {
  flex: 4 1 0 !important;
  min-width: 0;
  width: auto !important;
}

.mst003-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup)) > select) {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
}

.mst003-pick-slot :deep(> .flex > div:has(.pickstore-vs-shell)) {
  flex: 5 1 0 !important;
  min-width: 0;
  max-width: none !important;
  width: auto !important;
}

.mst003-pick-slot :deep(select) {
  box-sizing: border-box;
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
  font-size: 0.875rem;
  line-height: 1;
}

.mst003-pick-slot :deep(select:focus) {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-pick-slot :deep(.pickstore-vs-shell:focus-within) {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-pick-slot :deep(.custom-select),
.mst003-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
  margin-left: 0 !important;
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  border-radius: var(--mst003-control-radius) !important;
  overflow: hidden;
  border: 1px solid var(--mst003-control-border) !important;
  box-sizing: border-box;
}

.mst003-pick-slot :deep(.custom-select .vs__dropdown-toggle),
.mst003-pick-slot :deep(.pickstore-vs-shell .vs__dropdown-toggle) {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  padding: 0 0.375rem !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}

.mst003-pick-slot :deep(.pickstore-vs-shell .vs__dropdown-toggle:focus-within) {
  box-shadow: none !important;
}

.mst003-pick-slot :deep(.vs__selected-options) {
  min-height: 0 !important;
  padding: 0 !important;
}

.mst003-pick-slot :deep(.vs__selected) {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
}

.mst003-pick-slot :deep(.vs__search) {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
}

.mst003-vselect-slot :deep(.custom-select2) {
  width: 100% !important;
  min-width: 0 !important;
  border-radius: var(--mst003-control-radius) !important;
  overflow: hidden;
}

.mst003-vselect-slot :deep(.vs__dropdown-toggle) {
  height: var(--mst003-control-h) !important;
  min-height: var(--mst003-control-h) !important;
  max-height: var(--mst003-control-h) !important;
  padding: 0 0.375rem !important;
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
}

.mst003-vselect-slot :deep(.vs__dropdown-toggle:focus-within) {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-vselect-slot :deep(.vs__selected-options),
.mst003-vselect-slot :deep(.vs__selected),
.mst003-vselect-slot :deep(.vs__search) {
  min-height: 0 !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
}

.mst003-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.25rem;
  color: #111827;
}

.mst003-detail-panel {
  /* 상세 탭 전용 — 기본 대비 약 7% 축소 */
  --mst003-detail-control-h: 1.625rem;
  --mst003-detail-font: 0.8125rem;
  --mst003-detail-row-h: 2.5rem;
  --mst003-detail-cell-py: 0.4375rem;
  --mst003-detail-scrollbar-thumb: #1e40af;
  --mst003-detail-scrollbar-thumb-hover: #1e3a8a;
  --mst003-detail-scrollbar-track: #e8eef7;
  scrollbar-width: auto;
  scrollbar-color: var(--mst003-detail-scrollbar-thumb) var(--mst003-detail-scrollbar-track);
}

.mst003-detail-panel::-webkit-scrollbar {
  width: 0.75rem;
}

.mst003-detail-panel::-webkit-scrollbar-track {
  background: var(--mst003-detail-scrollbar-track);
  border-radius: 0.375rem;
}

.mst003-detail-panel::-webkit-scrollbar-thumb {
  background: var(--mst003-detail-scrollbar-thumb);
  border-radius: 0.375rem;
  border: 2px solid var(--mst003-detail-scrollbar-track);
}

.mst003-detail-panel::-webkit-scrollbar-thumb:hover {
  background: var(--mst003-detail-scrollbar-thumb-hover);
}

.mst003-form-grid {
  display: grid;
  grid-template-columns: var(--mst003-label-col) minmax(0, 1fr) var(--mst003-label-col) minmax(
      0,
      1fr
    );
  grid-auto-rows: var(--mst003-detail-row-h, 2.5rem);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst003-detail-panel .mst003-form-grid > * {
  box-sizing: border-box;
  min-height: var(--mst003-detail-row-h);
  align-self: stretch;
}

.mst003-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst003-detail-row-h, 2rem);
  padding: var(--mst003-detail-cell-py, 0.1875rem) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst003-detail-font, 0.8125rem);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  overflow: visible;
  word-break: keep-all;
}

.mst003-form-label--required {
  color: #2563eb;
  font-weight: 700;
}

.mst003-form-value {
  display: flex;
  align-items: center;
  min-height: var(--mst003-detail-row-h, 2rem);
  min-width: 0;
  padding: var(--mst003-detail-cell-py, 0.1875rem) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
  overflow: visible;
}

.mst003-form-value--inline {
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem 0.875rem;
}

.mst003-detail-panel .mst003-form-value--inline label {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--mst003-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
  flex-shrink: 0;
}

.mst003-detail-panel .mst003-form-value--inline input[type="radio"],
.mst003-detail-panel .mst003-form-value--inline input[type="checkbox"] {
  width: 0.875rem;
  height: 0.875rem;
  min-height: 0;
  max-height: none;
  margin: 0;
  flex-shrink: 0;
}

.mst003-detail-panel .mst003-form-value--inline label:has(input[type="checkbox"]) {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--mst003-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
  flex-shrink: 0;
}

.mst003-grid-void {
  min-height: var(--mst003-detail-row-h, 2.5rem) !important;
  padding: 0 !important;
  margin: 0;
  border: none !important;
  background: transparent;
  visibility: hidden;
  pointer-events: none;
  overflow: hidden;
}

.mst003-field-span3 {
  grid-column: 2 / -1;
  min-width: 0;
}

.mst003-inline-field {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.375rem;
}

.mst003-inline-field__label {
  flex: 0 0 auto;
  font-size: var(--mst003-detail-font, 0.8125rem);
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.mst003-detail-panel .mst003-form-grid .mst003-control--menu-code {
  width: 7.8rem;
  max-width: 7.8rem;
  flex: 0 0 7.8rem;
  min-width: 0;
}

.mst003-detail-panel .mst003-form-grid .mst003-auto-check {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: var(--mst003-detail-font);
  line-height: 1.25;
  white-space: nowrap;
  color: #374151;
}

.mst003-detail-panel .mst003-form-grid .mst003-auto-check input[type="checkbox"] {
  width: 0.875rem;
  height: 0.875rem;
  min-height: 0;
  max-height: none;
  margin: 0;
  flex-shrink: 0;
}

.mst003-detail-panel .mst003-form-grid select.mst003-control,
.mst003-detail-panel .mst003-form-grid .mst003-control,
.mst003-detail-panel .mst003-form-grid input[type="date"].mst003-control,
.mst003-detail-panel .mst003-form-grid input[type="time"].mst003-control {
  border: 1px solid var(--mst003-control-border) !important;
  border-radius: var(--mst003-control-radius) !important;
}

.mst003-detail-panel .mst003-form-grid .mst003-control:focus,
.mst003-detail-panel .mst003-form-grid .mst003-control:focus-visible,
.mst003-detail-panel .mst003-form-grid select.mst003-control:focus {
  border-color: var(--mst003-control-focus-border) !important;
}

.mst003-detail-panel .mst003-form-grid .mst003-control,
.mst003-detail-panel .mst003-form-grid .mst003-form-value select:not(.mst003-control),
.mst003-detail-panel
  .mst003-form-grid
  .mst003-form-value
  input:not([type="radio"]):not([type="checkbox"]):not(.mst003-control),
.mst003-detail-panel .mst003-form-grid .mst003-field-span3 .mst003-control,
.mst003-detail-panel .mst003-form-grid .mst003-field-span3 select:not(.mst003-control) {
  height: var(--mst003-detail-control-h);
  min-height: var(--mst003-detail-control-h);
  max-height: var(--mst003-detail-control-h);
  font-size: var(--mst003-detail-font);
  line-height: 1.2;
}

.mst003-detail-panel .mst003-form-grid input[type="date"],
.mst003-detail-panel .mst003-form-grid input[type="time"] {
  height: var(--mst003-detail-control-h);
  min-height: var(--mst003-detail-control-h);
  max-height: var(--mst003-detail-control-h);
  font-size: var(--mst003-detail-font);
  line-height: 1.2;
}

/* 보조버튼 스타일 — 상단 button search/save/excel(메인)과 구분되는 화면 내 보조 액션 */
.mst003-sub-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  padding: 0 0.875rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  color: #374151;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  background: #fff;
}

.mst003-sub-btn:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst003-sub-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mst003-detail-panel .mst003-form-grid .mst003-sub-btn {
  font-size: var(--mst003-detail-font);
}
</style>
