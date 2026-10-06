<!-- /*--############################################################################
# Filename : MST36_001INS.vue                                                  
# Description : 마스터관리 > 매장 마스터 > 결제 코드 등록                      
  # Date :2025-05-14                                                           
  # Author : 권맑음                     
################################################################################*/ -->
<template>
  <div class="mst36-page box-border flex h-full max-w-full min-h-0 flex-col gap-2 overflow-hidden pb-1">
    <!-- 상단: 페이지명 + 액션 (매장정보등록과 동일) -->
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-2">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-auto">
          저장
        </button>
      </div>
    </div>

    <!-- 할인대상메뉴 복사 팝업 -->
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
    v-if="discountMenuShow">
    <div class="h-[50%] w-[50%] max-w-5xl rounded-lg bg-white shadow-lg">
      <div
        class="grid grid-rows-[1fr,11fr,1fr] grid-cols-1 text-xl p-5 font-semibold h-full">
        <div class="flex justify-between">
          <div>할인대상메뉴 복사</div>
          <div>
            <button class="button primary" @click="copyButton">복사</button>
          </div>
        </div>
        <div class="grid grid-rows-1 grid-cols-2 space-x-3 min-h-0">
          <div class="grid grid-rows-[1fr,3fr,7fr] min-h-0">
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
            <div class="min-h-0">
              <Realgrid
                :progname="'MST36_001INS_VUE'"
                :progid="4"
                :rowData="rowData4"
                :setStateBar="false"
                :rowStateeditable="false">
              </Realgrid>
            </div>
          </div>
          <div class="grid grid-rows-[1fr,1fr,7fr] min-h-0">
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
            <div class="min-h-0">
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
          <button type="button" @click="closePopUp" class="whitebutton">닫기</button>
        </div>
      </div>
    </div>
  </div>

    <!-- 조회 AREA (매장정보등록과 동일 패턴) -->
    <div class="mst36-search-panel z-10 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="mst36-search-grid min-w-0">
        <div class="mst36-cell">
          <div class="mst36-sg-label">매장명</div>
          <div class="mst36-cell-field mst36-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              main-name=""
              :compact-store-combo-max-rem="15.6"
              @update:storeGroup="lngStoreGroup"
              @update:storeCd="handleStoreCd"
              @storeNm="handlestoreNm"
              :hidesub="hidesub"
              :hideAttr="hideAttr"
              @update:ischanged="handleinitAll"
              @update:ischanged2="searchinit" />
          </div>
        </div>
      </div>
    </div>

  <!-- 본문: 좌 목록 / 우 상세 -->
  <div class="mst36-workspace grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(0,5fr)]">
    <div class="mst36-left flex min-h-0 min-w-0 flex-col">
      <div class="mst36-section-head shrink-0">
        <div class="mst36-section-title">결제코드 목록</div>
        <div class="flex gap-2">
          <button
            type="button"
            class="mst36-action-btn mst36-action-btn--add"
            @click="addRow"
            :disabled="!afterSearch">
            <font-awesome-icon :icon="['fas', 'plus']" />
            추가
          </button>
          <button
            type="button"
            class="mst36-action-btn mst36-action-btn--del"
            @click="deleteRow"
            :disabled="!afterSearch">
            <font-awesome-icon :icon="['fas', 'trash']" />
            삭제
          </button>
        </div>
      </div>

      <div class="mst36-list-filter shrink-0">
        <div class="mst36-filter-row">
          <div class="mst36-filter-label">사용여부</div>
          <select
            name="blnInactive"
            class="mst36-filter-control mst36-filter-control--sm"
            @change="searchColumn"
            v-model="searchC1">
            <option value="-1">전체</option>
            <option value="0">사용</option>
            <option value="1">미사용</option>
          </select>
          <div class="mst36-filter-label">결제구분</div>
          <select
            name="payDistinct"
            class="mst36-filter-control mst36-filter-control--sm"
            @change="searchColumn"
            v-model="searchC2">
            <option value="-1">전체</option>
            <option value="1">할인</option>
            <option value="2">지불</option>
            <option value="3">할증</option>
          </select>
        </div>
        <div class="mst36-filter-row">
          <div class="mst36-filter-label">결제코드/명</div>
          <input
            type="text"
            class="mst36-filter-control mst36-filter-control--grow"
            @input="searchword"
            v-model="searchWord" />
        </div>
      </div>
      <div class="mst36-grid-wrap min-h-0 min-w-0 flex-1">
        <Realgrid
          class="h-full w-full"
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
          @updatedRowData2="updatedRowData"
          @allStateRows="allStateRows"
          :rowStateeditable="false"
          :addField="'new'">
        </Realgrid>
        <!-- :searchWord="searchWord" :searchColId2="'blnInactive,payDistinct'" :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" -->
      </div>
    </div>
    <!-- 그리드 데이터 부분 -->
    <!-- 연동 데이터 부분 -->
    <div class="mst36-right flex min-h-0 min-w-0 flex-col">
      <div class="mst36-detail-tabs flex shrink-0 flex-wrap gap-1">
        <button
          type="button"
          class="mst36-tab"
          @click="selectMenu(1)"
          :class="{ 'mst36-tab--on': selectedMenu == 1 }">
          기본설정
        </button>
        <button
          type="button"
          class="mst36-tab"
          @click="selectMenu(2)"
          :class="{ 'mst36-tab--on': selectedMenu == 2 }"
          :disabled="selectedPayDistinct || disableWithMenuDisc">
          할인대상메뉴
        </button>
        <button
          type="button"
          class="mst36-tab"
          @click="selectMenu(3)"
          :class="{ 'mst36-tab--on': selectedMenu == 3 }"
          :disabled="selectedMultiple">
          복합결제허용
        </button>
      </div>
      <div class="mst36-detail-body min-h-0 min-w-0 flex-1">
        <div v-show="selectedMenu == 1" class="mst36-detail-pane mst36-detail-pane--form">
          <div class="mst36-section-title">기본정보</div>
          <div class="mst36-form-grid mt-2 w-full">
            <div class="mst36-form-label">결제구분</div>
            <div class="mst36-form-value">
              <select
                class="mst36-control mst36-control--wide"
                v-model="gridvalue1"
                disabled>
                <option value="0">선택</option>
                <option value="1">할인</option>
                <option value="2">지불</option>
                <option value="3">할증</option>
              </select>
            </div>
            <div class="mst36-form-label">결제유형</div>
            <div class="mst36-form-value">
              <select class="mst36-control mst36-control--wide" disabled></select>
            </div>

            <div class="mst36-form-label mst36-form-label--tall">결제코드명</div>
            <div class="mst36-form-value mst36-form-value--stack">
              <label class="mst36-inline-field mst36-inline-field--req">
                <span>*국문</span>
                <input
                  type="text"
                  name="strName"
                  class="mst36-control mst36-control--wide"
                  v-model="gridvalue3"
                  @input="changeInfo"
                  :disabled="afterClickrow" />
              </label>
              <label class="mst36-inline-field">
                <span>영문</span>
                <input
                  type="text"
                  name="strNameE"
                  class="mst36-control mst36-control--wide"
                  v-model="gridvalue4"
                  @input="changeInfo"
                  :disabled="afterClickrow" />
              </label>
            </div>
            <div class="mst36-form-label mst36-form-label--tall mst36-form-label--required">
              *결제코드<br />*사용여부
            </div>
            <div class="mst36-form-value mst36-form-value--stack">
              <input
                type="text"
                name="lngCode"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue5"
                @input="changeInfo"
                :disabled="!(isNew == true && afterClickrow == false)" />
              <div class="mst36-radio-row">
                <label for="using1">
                  <input
                    type="radio"
                    name="blnInactive"
                    id="using1"
                    v-model="gridvalue6"
                    value="0"
                    @change="changeInfo"
                    :disabled="afterClickrow" />예
                </label>
                <label for="using2">
                  <input
                    type="radio"
                    name="blnInactive"
                    id="using2"
                    v-model="gridvalue6"
                    value="1"
                    @change="changeInfo"
                    :disabled="afterClickrow" />아니오
                </label>
              </div>
            </div>

            <div class="mst36-form-label">할인그룹</div>
            <div class="mst36-form-value">
              <select
                class="mst36-control mst36-control--wide"
                v-model="gridvalue2"
                disabled>
                <option value="">선택</option>
                <option :value="i.lngValue" v-for="i in disCountGroup" :key="i.lngValue">
                  [{{ i.lngCode }}]{{ i.strName }}
                </option>
              </select>
            </div>
            <div class="mst36-form-label">유효기간</div>
            <div class="mst36-form-value mst36-form-value--inline">
              <input
                type="date"
                max="9999-12-31"
                v-model="gridvalue7"
                name="dtmFromDate"
                @input="changeInfo"
                :disabled="afterClickrow"
                class="mst36-control mst36-control--date" />
              <span>~</span>
              <input
                type="date"
                max="9999-12-31"
                v-model="gridvalue8"
                name="dtmToDate"
                @input="changeInfo"
                :disabled="afterClickrow"
                class="mst36-control mst36-control--date" />
            </div>
          </div>

          <div class="mst36-section-title mt-4">부가정보</div>
          <div class="mst36-form-grid mt-2 w-full">
            <div class="mst36-form-label">할인방법</div>
            <div class="mst36-form-value">
              <div class="mst36-radio-row">
                <label for="discount1">
                  <input
                    type="radio"
                    id="discount1"
                    name="lngRate"
                    v-model="gridvalue11"
                    value="0"
                    @input="changeInfo"
                    :disabled="afterClickrow" />금액
                </label>
                <label for="discount2">
                  <input
                    type="radio"
                    id="discount2"
                    name="lngRate"
                    v-model="gridvalue11"
                    value="1"
                    @input="changeInfo"
                    :disabled="afterClickrow" />비율
                </label>
              </div>
            </div>
            <div class="mst36-form-label">할인금액(비율)</div>
            <div class="mst36-form-value">
              <input
                type="number"
                name="lngAmt"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue12"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>

            <div class="mst36-form-label">자동계산</div>
            <div class="mst36-form-value">
              <div class="mst36-radio-row">
                <label for="autopay1">
                  <input
                    type="radio"
                    id="autopay1"
                    name="blnAuto"
                    v-model="gridvalue13"
                    value="1"
                    @input="changeInfo"
                    :disabled="afterClickrow" />예
                </label>
                <label for="autopay2">
                  <input
                    type="radio"
                    id="autopay2"
                    name="blnAuto"
                    v-model="gridvalue13"
                    value="0"
                    @input="changeInfo"
                    :disabled="afterClickrow" />아니오
                </label>
              </div>
            </div>
            <div class="mst36-form-label">할인한도금액</div>
            <div class="mst36-form-value">
              <input
                type="number"
                name="lngDiscAmtLimit"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue14"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>

            <div class="mst36-form-label">돈통오픈</div>
            <div class="mst36-form-value">
              <div class="mst36-radio-row">
                <label for="openmoney1">
                  <input
                    type="radio"
                    id="openmoney1"
                    name="blnDrawer"
                    v-model="gridvalue15"
                    value="0"
                    @input="changeInfo"
                    :disabled="afterClickrow" />예
                </label>
                <label for="openmoney2">
                  <input
                    type="radio"
                    id="openmoney2"
                    name="blnDrawer"
                    v-model="gridvalue15"
                    value="1"
                    @input="changeInfo"
                    :disabled="afterClickrow" />아니오
                </label>
              </div>
            </div>
            <div class="mst36-form-label">계산우선순위</div>
            <div class="mst36-form-value">
              <input
                type="number"
                name="lngPrior"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue16"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>

            <div class="mst36-form-label">영수증출력</div>
            <div class="mst36-form-value">
              <div class="mst36-radio-row">
                <label for="receipt1">
                  <input
                    type="radio"
                    id="receipt1"
                    name="blnReceipt"
                    v-model="gridvalue17"
                    value="0"
                    @input="changeInfo"
                    :disabled="afterClickrow" />예
                </label>
                <label for="receipt2">
                  <input
                    type="radio"
                    id="receipt2"
                    name="blnReceipt"
                    v-model="gridvalue17"
                    value="1"
                    @input="changeInfo"
                    :disabled="afterClickrow" />아니오
                </label>
              </div>
            </div>
            <div class="mst36-form-label">
              잔금반환비율
              <span class="relative group inline-flex ml-1">
                <button type="button" class="size-3 flex justify-center items-center">
                  <img src="../../assets/circle-question-regular.svg" alt="" />
                </button>
                <span
                  class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-2 py-1 rounded whitespace-nowrap z-10">
                  잔금반환비율에 대한 설명입니다.
                </span>
              </span>
            </div>
            <div class="mst36-form-value">
              <input
                type="text"
                name="lngChangeRateLimit"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue18"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>

            <div class="mst36-form-label">할인대상메뉴</div>
            <div class="mst36-form-value">
              <div class="mst36-radio-row">
                <label for="discountfor1">
                  <input
                    type="radio"
                    id="discountfor1"
                    name="lngMenu"
                    v-model="gridvalue19"
                    value="0"
                    @input="changeInfo"
                    :disabled="afterClickrow" />전체 선택
                </label>
                <label for="discountfor2">
                  <input
                    type="radio"
                    id="discountfor2"
                    name="lngMenu"
                    v-model="gridvalue19"
                    value="1"
                    @input="changeInfo"
                    :disabled="afterClickrow" />부분 선택
                </label>
              </div>
            </div>
            <div class="mst36-form-label">품목할인설정</div>
            <div class="mst36-form-value">
              <select
                name="lngDiscType"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue20"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in itemDiscount" :key="i.strDCode">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>

            <div class="mst36-form-label">중복결제</div>
            <div class="mst36-form-value">
              <div class="mst36-radio-row">
                <label for="allow1">
                  <input
                    type="radio"
                    id="allow1"
                    name="blnDuplicate"
                    v-model="gridvalue21"
                    value="1"
                    @input="changeInfo"
                    :disabled="afterClickrow" />허용
                </label>
                <label for="allow2">
                  <input
                    type="radio"
                    id="allow2"
                    name="blnDuplicate"
                    v-model="gridvalue21"
                    value="0"
                    @input="changeInfo"
                    :disabled="afterClickrow" />비허용
                </label>
              </div>
            </div>
            <div class="mst36-form-label">크롤링결제코드</div>
            <div class="mst36-form-value">
              <select class="mst36-control mst36-control--wide" disabled>
                <option value="">선택</option>
              </select>
            </div>

            <div class="mst36-form-label">단수처리방법</div>
            <div class="mst36-form-value">
              <select
                name="lngRoundType"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue22"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in rounding" :key="i.strDCode">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="mst36-form-label">단수처리자릿수</div>
            <div class="mst36-form-value">
              <input
                type="number"
                name="lngRound"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue23"
                @input="changeInfo"
                :disabled="afterClickrow" />
            </div>

            <div class="mst36-form-label">세금계산방법</div>
            <div class="mst36-form-value">
              <select
                name="lngTax"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue24"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in taxs" :key="i.strDCode">
                  [{{ i.strDCode }}]{{ i.strDName }}
                </option>
              </select>
            </div>
            <div class="mst36-form-label">결제옵션</div>
            <div class="mst36-form-value">
              <select
                name="strIcon"
                class="mst36-control mst36-control--wide"
                v-model="gridvalue25"
                @change="changeInfo"
                :disabled="afterClickrow">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in payOptions" :key="i.strDCode">
                  [{{ i.strDCode }}] {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="mst36-detail-pane mst36-detail-pane--grid" v-show="selectedMenu == 2">
          <div class="mst36-section-head shrink-0">
            <div class="mst36-section-title">메뉴 목록</div>
            <div>
              <button type="button" class="mst36-action-btn" @click="showPopUp">
                할인대상메뉴복사
              </button>
            </div>
          </div>
          <div class="mst36-list-filter shrink-0">
            <div class="mst36-filter-row">
              <div class="mst36-filter-label">메뉴분류</div>
              <select
                name="majorGroupCd"
                class="mst36-filter-control mst36-filter-control--md"
                @change="setSubCd"
                v-model="forsearchMain">
                <option value="-1">전체</option>
                <option :value="i.GroupCd" v-for="i in MenuGroup" :key="'m' + i.GroupCd">
                  [{{ i.GroupCd }}]{{ i.majorGroupNm }}
                </option>
              </select>
              <select
                name="subGroupCd"
                class="mst36-filter-control mst36-filter-control--md"
                v-model="forsearchSub"
                @change="setSubCd">
                <option value="-1">전체</option>
                <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup" :key="'s' + i.GroupCd">
                  [{{ i.GroupCd }}]{{ i.subGroupNm }}
                </option>
              </select>
            </div>
            <div class="mst36-filter-row">
              <div class="mst36-filter-label">메뉴명/코드</div>
              <input
                type="text"
                class="mst36-filter-control mst36-filter-control--grow"
                @input="searchMenuList"
                v-model="searchWord2" />
            </div>
          </div>

          <div class="mst36-grid-wrap mt-2 min-h-0 min-w-0 flex-1">
          <Realgrid
            class="w-full h-full"
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
          </div>
          <!-- :searchColId2="'majorGroupCd,subGroupCd'" :searchColId="'menuCd,menuNm'" :searchColValue2="searchColValue3" :searchWord="searchWord2" -->
        </div>
        <div v-show="selectedMenu == 3" class="mst36-detail-pane mst36-detail-pane--grid">
          <div class="mst36-list-filter shrink-0">
            <div class="mst36-filter-row">
              <div class="mst36-filter-label">결제코드/명</div>
              <input
                type="text"
                class="mst36-filter-control mst36-filter-control--grow"
                @input="searchMenuList2"
                v-model="searchWord3" />
            </div>
          </div>
          <div class="mst36-grid-wrap mt-2 min-h-0 min-w-0 flex-1">
          <Realgrid
            class="w-full h-full"
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
          </div>
          <!-- :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" :searchWord="searchWord3"  -->
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import {
  CopyDiscountMenuList,
  getMenuDiscCount,
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
  ////console.log(e);
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
  ////console.log(rowData2.value);
  rowData4.value = rowData2.value.filter((item) =>
    checkRowDataArr.includes(item.menuCd)
  );

  const res3 = await getPayCodeListbyCode(groupCd.value, gridvalue5.value);
  ////console.log(res3);
  ////console.log(rowData4.value);
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

const disableWithMenuDisc = ref(false);
const hideAttr = ref(false);
const hidesub = ref(false);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  // //console.log(store.state.userData.lngCommonMenu);

  if (store.state.userData.lngCommonMenu == "1") {
    hidesub.value = false;
    hideAttr.value = false;
    nowStoreCd.value = 0;
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
  //console.log(newvalue);
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
  ////console.log(newvalue);
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
  //console.log(rowData2.value);
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
  if (store.state.userData.lngCommonMenu == "1") {
    nowStoreCd.value = 0;
  } else {
    nowStoreCd.value = newValue;
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
    const res = await getPayCodeEnrollInfo(groupCd.value, 0);

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
    //console.log(res);
    //console.log(res2);
    // ////console.log(res2.data.menuList);
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
  // ////console.log(filtered2);
  // ////console.log(arr);
  changeValue2.value = filtered2.join(";");
  changeNow.value = !changeNow.value;

  await nextTick();
};

const forCopyArr = ref([]);
/**
 * 체크된 데이터 갱신
 */

const checkedRowData5 = (e) => {
  ////console.log(e);
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
  ////console.log(updateDeleteInsertrowIndex.value);
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
        console.log(res);

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
  console.log(newvalue);
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

<style scoped>
.mst36-page {
  position: relative;
  z-index: 1;
  min-height: 0;
}

/* 조회 AREA — MST01_002INS(매장정보등록)와 동일 */
.mst36-search-panel {
  --mst36-panel-pad-x: 2rem;
  --mst36-col-gap: 1.5rem;
  --mst36-item-gap: 0.75rem;
  --mst36-label-col: 6.5rem;
  --mst36-row-min-h: 2rem;
  --mst36-control-h: 2rem;
  --mst36-control-border: #cbd5e1;
  --mst36-control-focus-border: #3b82f6;
  --mst36-control-radius: 0.375rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
}

.mst36-search-grid {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: minmax(0, 1fr);
  max-width: 58rem;
  column-gap: var(--mst36-col-gap);
  padding-left: var(--mst36-panel-pad-x);
  padding-right: var(--mst36-panel-pad-x);
}

.mst36-cell {
  display: flex;
  min-width: 0;
  min-height: var(--mst36-row-min-h);
  align-items: center;
  gap: var(--mst36-item-gap);
}

.mst36-sg-label {
  flex: 0 0 var(--mst36-label-col);
  width: var(--mst36-label-col);
  min-height: var(--mst36-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.mst36-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst36-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  gap: 0.5rem !important;
}

.mst36-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}

.mst36-pick-slot :deep(#storeGroup) {
  width: 11.5rem !important;
  min-width: 11.5rem !important;
  max-width: 11.5rem !important;
}

.mst36-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup)) > select),
.mst36-pick-slot :deep(> .flex > div > select:not(#storeGroup)) {
  width: 11.5rem !important;
  min-width: 11.5rem !important;
  max-width: 11.5rem !important;
}

.mst36-pick-slot :deep(> .flex > div:has(.pickstore-vs-shell)),
.mst36-pick-slot :deep(> .flex > div.relative.min-w-0.flex-1) {
  flex: 0 0 15.6rem !important;
  width: 15.6rem !important;
  max-width: 15.6rem !important;
}

.mst36-pick-slot :deep(select),
.mst36-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--mst36-control-h) !important;
  min-height: var(--mst36-control-h) !important;
  max-height: var(--mst36-control-h) !important;
  border: 1px solid var(--mst36-control-border) !important;
  border-radius: var(--mst36-control-radius) !important;
}

.mst36-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
}

.mst36-workspace {
  min-height: 0;
}

.mst36-left,
.mst36-right {
  min-height: 0;
}

.mst36-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.375rem;
  min-height: 1.75rem;
}

.mst36-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4rem;
  color: #111827;
}

.mst36-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: 2rem;
  min-width: 4.25rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  color: #374151;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 10%);
}

.mst36-action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.mst36-action-btn--add:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst36-action-btn--del:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

.mst36-list-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-bottom: 0.5rem;
  padding: 0.625rem 0.75rem;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #f3f4f6;
}

.mst36-filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  min-height: 2rem;
}

.mst36-filter-label {
  flex: 0 0 auto;
  min-width: 5.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

.mst36-filter-control {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
}

.mst36-filter-control--sm {
  width: 7.5rem;
  min-width: 0;
}

.mst36-filter-control--md {
  width: 11rem;
  min-width: 0;
  flex: 1 1 10rem;
  max-width: 14rem;
}

.mst36-filter-control--grow {
  flex: 1 1 12rem;
  min-width: 0;
  width: auto;
}

.mst36-grid-wrap {
  flex: 1 1 0;
  min-height: 9rem;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.mst36-detail-tabs {
  border-bottom: 1px solid #d1d5db;
  margin-bottom: 0.5rem;
}

.mst36-tab {
  height: 2.5rem;
  padding: 0 0.875rem;
  border: 1px solid #d1d5db;
  border-bottom: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background: #f3f4f6;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
}

.mst36-tab--on {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #93c5fd;
}

.mst36-tab:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  color: #9ca3af;
  background: #f9fafb;
}

.mst36-detail-body {
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.mst36-detail-pane {
  width: 100%;
  min-width: 0;
  --mst36-label-col: 7rem;
  --mst36-control-h: 1.75rem;
  --mst36-detail-row-h: 2.25rem;
  --mst36-detail-cell-py: 0.25rem;
  --mst36-detail-font: 0.8125rem;
}

/* 기본설정: 폼이 길면 내부 스크롤 */
.mst36-detail-pane--form {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 0.75rem;
  padding-right: 0.25rem;
}

/* 할인대상메뉴 / 복합결제허용: 왼쪽 목록 그리드 하단과 맞춤 */
.mst36-detail-pane--grid {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mst36-form-grid {
  display: grid;
  grid-template-columns:
    var(--mst36-label-col) minmax(0, 1fr)
    var(--mst36-label-col) minmax(0, 1fr);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
}

.mst36-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst36-detail-row-h);
  padding: var(--mst36-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst36-detail-font);
  font-weight: 600;
  line-height: 1.25;
  text-align: center;
  word-break: keep-all;
}

.mst36-form-label--required {
  color: #2563eb;
  font-weight: 700;
}

.mst36-form-label--tall {
  min-height: 4.5rem;
}

.mst36-form-value {
  display: flex;
  align-items: center;
  min-height: var(--mst36-detail-row-h);
  min-width: 0;
  padding: var(--mst36-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.mst36-form-value--inline {
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.mst36-form-value--stack {
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  gap: 0.35rem;
  min-height: 4.5rem;
  padding-block: 0.375rem;
}

.mst36-inline-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  font-size: var(--mst36-detail-font);
  color: #374151;
}

.mst36-inline-field > span {
  flex: 0 0 2.5rem;
  text-align: right;
}

.mst36-inline-field--req > span {
  color: #2563eb;
  font-weight: 700;
}

.mst36-radio-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  font-size: var(--mst36-detail-font);
  color: #374151;
}

.mst36-radio-row label {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.mst36-control {
  box-sizing: border-box;
  height: var(--mst36-control-h);
  min-height: var(--mst36-control-h);
  max-height: var(--mst36-control-h);
  width: 70%;
  max-width: 70%;
  min-width: 0;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  background: #fff;
  padding: 0 0.5rem;
  font-size: var(--mst36-detail-font);
  line-height: 1;
}

.mst36-control--wide {
  width: 100%;
  max-width: 100%;
}

.mst36-control--date {
  width: auto;
  max-width: none;
  flex: 1 1 0;
}

.mst36-control:disabled,
.mst36-control:disabled:hover {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

@media (min-width: 1280px) {
  .mst36-search-panel {
    --mst36-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 1536px) {
  .mst36-search-panel {
    --mst36-panel-pad-x: 3rem;
  }
}
</style>
