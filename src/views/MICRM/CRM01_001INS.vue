<!-- /*--############################################################################
# Filename : CRM01_001INS.vue                                                  
# Description : 고객관리 > 고객신상정보 > 고객정보                              
# Date :2025-06-13                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="flex h-full min-h-0 flex-col" @click="handleParentClick">
    <div class="flex shrink-0 justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="deleteButton" class="button leave md:w-auto w-14">
          탈퇴
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
        <button
          type="button"
          @click="resetSearchArea"
          class="button save w-auto ml-4 min-w-[4.5rem]">
          초기화
        </button>
      </div>
    </div>
    <div
      class="crm01-search-panel z-10 mt-2 w-full max-w-[min(100%,1680px)] min-w-0 shrink-0 overflow-x-auto self-center rounded-lg bg-gray-200 px-5 py-3 sm:px-8 md:px-12 lg:px-14 xl:px-16 xl:py-3.5 2xl:px-20">
      <div
        class="crm01-wire-grid min-w-0"
        :style="{
          '--crm01-control-border': crm01ControlBorder,
          '--crm01-col-gutter': crm01ColGutter,
          '--crm01-row-gap': crm01RowGap,
          '--crm01-label-col': crm01LabelCol,
        }">
        <div class="crm01-pick-span">
          <PickStoreSingle
            :key="'crm01-pss-' + crm01SearchAreaKey"
            :setDisableType="true"
            @lngStoreCode="lngStoreCode"
            @lngStoreGroup="lngStoreGroup"
            @lngSupervisor="lngSupervisor"
            @excelStore="excelStore"
            @lngStoreTeam="lngStoreTeam"></PickStoreSingle>
        </div>
        <div class="crm01-wire-cell crm01-wire-cell-stacked">
          <div class="crm01-sub-pair">
            <div class="crm01-wire-label crm01-sub-label">고객카드번호</div>
            <div class="crm01-wire-field crm01-stack-field">
              <input
                id="crm01-cond-card"
                v-model="cond"
                type="text"
                class="crm01-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span class="crm01-hint">※ '-' 없이 기입</span>
            </div>
          </div>
          <div class="crm01-sub-pair">
            <div class="crm01-wire-label crm01-sub-label">고객명</div>
            <div class="crm01-wire-field min-w-0">
              <input
                id="crm01-cond-name"
                v-model="cond2"
                type="text"
                class="crm01-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">생년월일</div>
          <div class="crm01-wire-field crm01-birth-row min-w-0">
            <select
              id="crm01-cond-month"
              v-model="cond3"
              class="crm01-sg-select h-8 w-[4.5rem] shrink-0 rounded-md border border-solid bg-white px-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0"></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </select>
            <span class="crm01-suffix shrink-0 text-sm text-gray-700">월</span>
            <select
              id="crm01-cond-day"
              v-model="cond4"
              class="crm01-sg-select h-8 w-[4.5rem] shrink-0 rounded-md border border-solid bg-white px-1 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0"></option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="30">30</option>
              <option value="31">31</option>
            </select>
            <span class="crm01-suffix shrink-0 text-sm text-gray-700">일</span>
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">직종</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-job"
              v-model="cond5"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option value="1">회사원</option>
              <option value="2">공무원</option>
              <option value="3">교직원</option>
              <option value="4">전문직</option>
              <option value="5">자영업</option>
              <option value="6">학생</option>
              <option value="7">주부</option>
            </select>
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">성별</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-gender"
              v-model="cond6"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">전체</option>
              <option value="0">여자</option>
              <option value="1">남자</option>
            </select>
          </div>
        </div>

        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">전화번호</div>
          <div class="crm01-wire-field crm01-stack-field min-w-0">
            <input
              id="crm01-cond-phone"
              v-model="cond7"
              type="text"
              class="crm01-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span class="crm01-hint">※ 010-0000-0000</span>
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">가입상태</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-join"
              v-model="cond8"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option value="1">정상</option>
              <option value="2">대기</option>
              <option value="3">탈퇴</option>
              <option value="4">삭제</option>
              <option value="5">중지</option>
              <option value="6">웹전용</option>
            </select>
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">결혼여부</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-marry"
              v-model="cond9"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">전체</option>
              <option value="0">미혼</option>
              <option value="1">기혼</option>
            </select>
          </div>
        </div>

        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">가입일</div>
          <div class="crm01-wire-field crm01-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              :key="'crm01-dt-join-' + crm01SearchAreaKey"
              :disableBox="false"
              omit-main-label
              filter-bar-align
              :removeDefault="true"
              :mainName="'가입일'"
              @endDate="endDate"
              @startDate="startDate" />
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">최초사용일</div>
          <div class="crm01-wire-field crm01-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              :key="'crm01-dt-first-' + crm01SearchAreaKey"
              :disableBox="false"
              omit-main-label
              filter-bar-align
              :removeDefault="true"
              :mainName="'최초사용일'"
              @endDate="endDate2"
              @startDate="startDate2" />
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">등급</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-level"
              v-model="cond10"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option
                :value="i.intLevel"
                v-for="i in optionList"
                :key="'lvl-' + i.intLevel + '-' + (i.strLevelName ?? '')">
                {{ i.strLevelName }}
              </option>
            </select>
          </div>
        </div>

        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">누적포인트</div>
          <div class="crm01-wire-field crm01-inline-ops min-w-0">
            <select
              id="crm01-cond-pt1op"
              v-model="cond11"
              class="crm01-sg-select crm01-op-select h-8 shrink-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1">&lt;</option>
              <option value="2">=</option>
              <option value="3">&gt;</option>
            </select>
            <input
              id="crm01-cond-pt1"
              :value="cond12"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              class="crm01-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown="onNumericAmountKeydown"
              @paste="onCond12NumericPaste"
              @input="onCond12ThousandsInput" />
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">잔여포인트</div>
          <div class="crm01-wire-field crm01-inline-ops min-w-0">
            <select
              id="crm01-cond-pt2op"
              v-model="cond13"
              class="crm01-sg-select crm01-op-select h-8 shrink-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1">&lt;</option>
              <option value="2">=</option>
              <option value="3">&gt;</option>
            </select>
            <input
              id="crm01-cond-pt2"
              :value="cond14"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              class="crm01-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown="onNumericAmountKeydown"
              @paste="onCond14NumericPaste"
              @input="onCond14ThousandsInput" />
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">최종사용일</div>
          <div class="crm01-wire-field crm01-date-slot min-w-0 overflow-hidden">
            <Datepicker2
              :key="'crm01-dt-last-' + crm01SearchAreaKey"
              :disableBox="false"
              omit-main-label
              filter-bar-align
              :removeDefault="true"
              :mainName="'최종사용일'"
              @endDate="endDate3"
              @startDate="startDate3" />
          </div>
        </div>

        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">방문횟수</div>
          <div class="crm01-wire-field crm01-inline-ops min-w-0">
            <select
              id="crm01-cond-visop"
              v-model="cond15"
              class="crm01-sg-select crm01-op-select h-8 shrink-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1">&lt;</option>
              <option value="2">=</option>
              <option value="3">&gt;</option>
            </select>
            <input
              id="crm01-cond-vis"
              v-model="cond16"
              type="number"
              class="crm01-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">SMS수신동의</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-sms"
              v-model="cond17"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="2">전체</option>
              <option value="1">동의</option>
              <option value="0">비동의</option>
            </select>
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">실매출액</div>
          <div class="crm01-wire-field crm01-inline-ops min-w-0">
            <select
              id="crm01-cond-amtop"
              v-model="cond18"
              class="crm01-sg-select crm01-op-select h-8 shrink-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1">&lt;</option>
              <option value="2">=</option>
              <option value="3">&gt;</option>
            </select>
            <input
              id="crm01-cond-amt"
              :value="cond19"
              type="text"
              inputmode="numeric"
              autocomplete="off"
              class="crm01-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              @keydown="onNumericAmountKeydown"
              @paste="onCond19NumericPaste"
              @input="onCond19ThousandsInput" />
          </div>
        </div>

        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">마케팅수신동의</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-mkt"
              v-model="cond20"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="2">전체</option>
              <option value="1">동의</option>
              <option value="0">비동의</option>
            </select>
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">휴면회원여부</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-dormant"
              v-model="cond21"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="-1">전체</option>
              <option value="0">일반</option>
              <option value="1">휴면</option>
            </select>
          </div>
        </div>
        <div class="crm01-wire-cell">
          <div class="crm01-wire-label">선호매장</div>
          <div class="crm01-wire-field min-w-0">
            <select
              id="crm01-cond-pstore"
              v-model="pstore"
              class="crm01-sg-select h-8 w-full min-w-0 rounded-md border border-solid bg-white text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="0">전체</option>
              <option :value="i.lngStoreCode" v-for="i in optionList2" :key="i.lngStoreCode">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full max-w-[min(100%,1680px)] shrink-0 self-center px-5 pt-0.5 text-xs leading-snug text-red-500 sm:px-8 sm:text-sm md:px-12 lg:px-14 xl:px-16 2xl:px-20">
      ※ 고객명을 더블클릭하시면 수정하실 수 있습니다.
    </div>
    <div class="mx-auto mt-1 flex min-h-0 min-w-0 max-w-[min(100%,1680px)] flex-1 flex-col overflow-hidden px-1 pb-0 w-full">
      <div class="relative flex min-h-0 flex-1 basis-0 min-w-0">
        <Realgrid
          :progname="'CRM01_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM01_001INS'"
          :showCheckBar="true"
          @clickedRowData="clickedRowData"
          @checkedRowIndex="checkedRowIndex"
          @dblclickedRowData="dblclickedRowData"
          @allStateRows="allStateRows"
          :deleteRow6="deleteRow"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <!-- 고객정보 신규·수정 팝업 (body teleport — TOP GNB·레이아웃 위) -->
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[11000] flex items-center justify-center bg-black/50 p-2 sm:p-3">
    <div
      class="crm01-modal-sheet flex max-h-[min(calc(100dvh-6px),920px)] w-full max-w-[min(100%,960px)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:max-w-4xl sm:rounded-2xl xl:max-w-5xl">
      <div
        class="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-4 py-2 sm:px-5 sm:py-2.5">
        <h2 class="text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl">
          {{ InsertNew ? "고객정보 신규 등록" : "고객정보 수정" }}
        </h2>
        <p class="mt-0.5 text-xs font-medium leading-tight text-slate-700 sm:text-sm">
          <span class="crm01-req-mark" aria-hidden="true">*</span> 표시는 필수 항목입니다.
        </p>
      </div>
      <div class="crm01-modal-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-hidden overscroll-contain px-3 py-1.5 sm:px-4 sm:py-2">
        <div
          class="crm01-modal-panel crm01-modal-panel-split rounded-xl px-3 py-2 sm:px-4 sm:py-2.5"
          :style="{
            '--crm01-control-border': crm01ControlBorder,
            '--crm01-col-gutter': crm01ModalColGutter,
            '--crm01-row-gap': crm01ModalRowGap,
            '--crm01-label-col': crm01ModalLabelCol,
            '--crm01-modal-row-border': crm01ModalRowBorder,
            '--crm01-modal-row-pad': crm01ModalRowPad,
          }">
          <section class="crm01-modal-area-required">
            <h3 class="crm01-modal-area-heading">필수 항목</h3>
            <div class="crm01-modal-wire-grid">
            <!-- 1행 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>고객카드번호
              </div>
              <div
                class="crm01-wire-field min-w-0 crm01-modal-field-wrap items-stretch sm:items-center">
                <input
                  id="crm01-pop-card"
                  v-model="pcond"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                  :class="{ 'max-w-md': InsertNew === true }"
                  :disabled="InsertNew === false"
                  @change="checkCard = false"
                  @input="InputPcond" />
                <button
                  v-if="InsertNew === true"
                  type="button"
                  class="crm01-modal-secondary-btn shrink-0"
                  @click="checkCardNo">
                  중복검사
                </button>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>구분
              </div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap gap-4">
                <label class="crm01-modal-choice" for="crm01-pop-div-indiv">
                  <input
                    id="crm01-pop-div-indiv"
                    type="radio"
                    name="crm01-pop-pcond2"
                    value="1"
                    v-model="pcond2" />
                  개인
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-div-corp">
                  <input
                    id="crm01-pop-div-corp"
                    type="radio"
                    name="crm01-pop-pcond2"
                    value="2"
                    v-model="pcond2" />
                  법인
                </label>
              </div>
            </div>

            <!-- 2행 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>고객명
              </div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap items-stretch sm:items-center">
                <input
                  id="crm01-pop-name-ko"
                  v-model="pcond3"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 min-w-[6rem] flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="한글"
                />
                <span class="crm01-hint shrink-0 font-medium">영문</span>
                <input
                  id="crm01-pop-name-en"
                  v-model="pcond4"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 min-w-[6rem] flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="English"
                />
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>성별
              </div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap gap-4">
                <label class="crm01-modal-choice" for="crm01-pop-sex-f">
                  <input
                    id="crm01-pop-sex-f"
                    type="radio"
                    name="pcond5"
                    value="0"
                    v-model="pcond5" />
                  여자
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-sex-m">
                  <input
                    id="crm01-pop-sex-m"
                    type="radio"
                    name="pcond5"
                    value="1"
                    v-model="pcond5" />
                  남자
                </label>
              </div>
            </div>

            <!-- 3행: 등급 | 빈칸(구분선) -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>등급
              </div>
              <div class="crm01-wire-field min-w-0">
                <select
                  id="crm01-pop-level"
                  v-model="pcond10"
                  class="crm01-sg-select h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="0">선택</option>
                  <option :value="i.intLevel" v-for="i in optionList" :key="i.intLevel">
                    {{ i.strLevelName }}
                  </option>
                </select>
              </div>
            </div>
            <div
              class="crm01-wire-cell crm01-modal-cell-row-fill"
              aria-hidden="true"></div>

            <!-- 4행: 휴대폰 + SMS + 동의일 (한 줄 전체) -->
            <div class="crm01-wire-cell crm01-modal-span-full">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>휴대폰번호
              </div>
              <div
                class="crm01-wire-field min-w-0 crm01-modal-field-wrap crm01-modal-mobile-row flex-nowrap">
                <select
                  id="crm01-pop-mobile-pre"
                  v-model="pcond6"
                  class="crm01-sg-select h-8 min-h-8 w-[4.275rem] shrink-0 rounded-md border border-solid bg-white px-1 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="010">010</option>
                </select>
                <input
                  id="crm01-pop-mobile-mid"
                  v-model="pcond7"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-[4.725rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="limitFourDigitsPcond7"
                />
                <input
                  id="crm01-pop-mobile-last"
                  v-model="pcond8"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-[4.725rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="limitFourDigitsPcond8"
                />
                <label
                  class="crm01-modal-choice crm01-modal-consent-choice shrink-0"
                  for="crm01-pop-sms-agree">
                  <input id="crm01-pop-sms-agree" type="checkbox" v-model="pcond9" />
                  SMS 수신 동의
                </label>
                <div class="crm01-modal-consent-date-inline">
                  <span class="crm01-modal-consent-date-label">{{ pcondSmsAgreeDateLabel }}</span>
                  <input
                    id="crm01-pop-sms-agree-date"
                    v-model="pcondSmsAgreeDate"
                    type="text"
                    readonly
                    disabled
                    class="crm01-sg-input crm01-modal-date crm01-modal-consent-date h-8 min-h-8 w-[9.25rem] shrink-0 cursor-not-allowed rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-600"
                  />
                </div>
              </div>
            </div>
            </div>
          </section>

          <section class="crm01-modal-area-optional">
            <h3 class="crm01-modal-area-heading">추가 정보</h3>
            <div class="crm01-modal-marketing-block">
              <div class="crm01-modal-marketing-row">
                <div class="crm01-modal-marketing-left">
                  <label
                    class="crm01-modal-choice crm01-modal-marketing-check crm01-modal-consent-choice"
                    for="crm01-pop-mkt-agree">
                    <span class="crm01-modal-marketing-title crm01-modal-consent-text">마케팅 정보 수신동의</span>
                    <input id="crm01-pop-mkt-agree" type="checkbox" v-model="pcond32" />
                  </label>
                  <button
                    v-if="mktSmsAvailable"
                    type="button"
                    class="crm01-modal-marketing-sms-btn shrink-0"
                    :disabled="!savedMktAgree"
                    @click="openMktSmsPopup">
                    <font-awesome-icon
                      icon="comment-sms"
                      class="crm01-modal-marketing-sms-btn-icon"
                      aria-hidden="true"
                    />
                    마케팅 수신동의 문자발송
                  </button>
                </div>
                <div class="crm01-modal-marketing-date-cell">
                  <span class="crm01-modal-consent-date-label">{{ pcondMktAgreeDateLabel }}</span>
                  <input
                    id="crm01-pop-mkt-agree-date"
                    v-model="pcondMktAgreeDate"
                    type="text"
                    readonly
                    disabled
                    class="crm01-sg-input crm01-modal-date crm01-modal-consent-date h-8 min-h-8 w-[9.25rem] min-w-0 shrink-0 cursor-not-allowed rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-600"
                  />
                </div>
              </div>
            </div>
            <div class="crm01-modal-wire-grid">
            <!-- 전화번호 | 가입일 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">전화번호</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap crm01-modal-tel-row flex-nowrap">
                <input
                  id="crm01-pop-tel"
                  v-model="pcond11"
                  type="text"
                  class="crm01-sg-input crm01-modal-tel-input h-8 min-h-8 shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="crm01-hint shrink-0">※ 02-111-2222</span>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">가입일</div>
              <div class="crm01-wire-field min-w-0">
                <input
                  id="crm01-pop-join-date"
                  v-model="pcond16"
                  type="date"
                  disabled
                  class="crm01-sg-input crm01-modal-date h-8 min-h-8 w-full min-w-0 cursor-not-allowed rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-600"
                />
              </div>
            </div>

            <!-- E-mail | 이메일 수신 동의 (입력 폭 = 가입매장 콤보) -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">E-mail</div>
              <div class="crm01-wire-field min-w-0">
                <input
                  id="crm01-pop-email"
                  v-model="pcond14"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="crm01-wire-cell crm01-modal-email-agree-cell">
              <div class="crm01-wire-field min-w-0 crm01-modal-email-agree-field">
                <label class="crm01-modal-choice shrink-0 whitespace-nowrap" for="crm01-pop-email-agree">
                  <input id="crm01-pop-email-agree" type="checkbox" v-model="pcond15" />
                  이메일 수신 동의
                </label>
              </div>
            </div>

            <!-- 가입매장 | 선호매장 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">가입매장</div>
              <div class="crm01-wire-field min-w-0">
                <select id="crm01-pop-store-join" v-model="pcond17" class="crm01-sg-select h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="i in optionList2" :key="i.lngStoreCode" :value="i.lngStoreCode">{{ i.strName }}</option>
                </select>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">선호매장</div>
              <div class="crm01-wire-field min-w-0">
                <select id="crm01-pop-store-pref" v-model="pcond18" class="crm01-sg-select h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="0">미선택</option>
                  <option v-for="i in optionList2" :key="'p-' + i.lngStoreCode" :value="i.lngStoreCode">{{ i.strName }}</option>
                </select>
              </div>
            </div>

            <!-- 집주소 -->
            <div class="crm01-wire-cell crm01-modal-span-full crm01-modal-row-tall">
              <div class="crm01-wire-label">집주소</div>
              <div class="crm01-wire-field min-w-0 flex-col items-stretch crm01-modal-home-value">
                <div class="crm01-modal-home-zip-row crm01-modal-field-wrap flex-wrap items-center">
                  <input
                    id="crm01-pop-zip-home"
                    v-model="pcond19"
                    type="text"
                    class="crm01-sg-input h-8 min-h-8 w-[7.25rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" class="crm01-modal-secondary-btn shrink-0" @click="showAddress">
                    조회
                  </button>
                  <input
                    id="crm01-pop-addr-home1"
                    v-model="pcond20"
                    type="text"
                    class="crm01-sg-input h-8 min-h-8 min-w-[10rem] flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    id="crm01-pop-addr-home2"
                    v-model="pcond21"
                    type="text"
                    class="crm01-sg-input h-8 min-h-8 min-w-[10rem] flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div
                  class="crm01-modal-home-mail-block crm01-modal-field-wrap gap-4"
                  aria-label="등록 우편물 수령지">
                  <span class="text-xs font-semibold text-slate-700">등록 우편물 수령지</span>
                  <label class="crm01-modal-choice" for="crm01-pop-mail-home">
                    <input
                      id="crm01-pop-mail-home"
                      type="radio"
                      name="pcond22"
                      value="0"
                      v-model="pcond22" />
                    집주소
                  </label>
                  <label class="crm01-modal-choice" for="crm01-pop-mail-office">
                    <input
                      id="crm01-pop-mail-office"
                      type="radio"
                      name="pcond22"
                      value="1"
                      v-model="pcond22" />
                    사무실주소
                  </label>
                </div>
              </div>
            </div>

            <!-- 사무실주소 -->
            <div class="crm01-wire-cell crm01-modal-span-full">
              <div class="crm01-wire-label">사무실주소</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap flex-wrap items-center">
                <input
                  id="crm01-pop-zip-office"
                  v-model="pcond24"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-[7.25rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="button" class="crm01-modal-secondary-btn shrink-0" @click="showAddress2">
                  조회
                </button>
                <input
                  id="crm01-pop-addr-office1"
                  v-model="pcond25"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 min-w-[10rem] flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  id="crm01-pop-addr-office2"
                  v-model="pcond26"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 min-w-[10rem] flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- 결혼여부 (전폭 값 영역) -->
            <div class="crm01-wire-cell crm01-modal-span-full">
              <div class="crm01-wire-label">결혼여부</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap gap-4">
                <label class="crm01-modal-choice" for="crm01-pop-marry-no">
                  <input id="crm01-pop-marry-no" type="radio" name="pcond31" value="0" v-model="pcond31" />
                  미혼
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-marry-yes">
                  <input id="crm01-pop-marry-yes" type="radio" name="pcond31" value="1" v-model="pcond31" />
                  기혼
                </label>
              </div>
            </div>

            <div class="crm01-wire-cell crm01-modal-span-full crm01-modal-join-path-cell">
              <div class="crm01-wire-label">가입경로</div>
              <div
                class="crm01-wire-field min-w-0 crm01-modal-join-path-row"
                :style="crm01JoinPathGridStyle">
                <label
                  v-for="opt in joinPathOptions"
                  :key="opt.code"
                  class="crm01-modal-choice crm01-modal-join-path-choice"
                  :for="'crm01-pop-join-path-' + opt.code">
                  <input
                    :id="'crm01-pop-join-path-' + opt.code"
                    type="checkbox"
                    :value="opt.code"
                    v-model="pcond38" />
                  {{ opt.label }}
                </label>
              </div>
            </div>

            <!-- 생년월일 | 결혼기념일 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">생년월일</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap flex-wrap items-center gap-3">
                <input
                  id="crm01-pop-birth"
                  v-model="pcond27"
                  type="date"
                  class="crm01-sg-input crm01-modal-date h-8 min-h-8 min-w-0 shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label class="crm01-modal-choice" for="crm01-pop-lunar">
                  <input id="crm01-pop-lunar" type="radio" name="pcond28" value="0" v-model="pcond28" />
                  음력
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-solar">
                  <input id="crm01-pop-solar" type="radio" name="pcond28" value="1" v-model="pcond28" />
                  양력
                </label>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">결혼기념일</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap flex-wrap items-center gap-3">
                <input
                  id="crm01-pop-wed-date"
                  v-model="pcond29"
                  type="date"
                  class="crm01-sg-input crm01-modal-date h-8 min-h-8 min-w-0 shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label class="crm01-modal-choice" for="crm01-pop-anni-birth">
                  <input id="crm01-pop-anni-birth" type="radio" name="pcond30" value="1" v-model="pcond30" />
                  생일
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-anni-wed">
                  <input id="crm01-pop-anni-wed" type="radio" name="pcond30" value="2" v-model="pcond30" />
                  결혼기념일
                </label>
              </div>
            </div>

            <!-- 직종 | 직장명 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">직종</div>
              <div class="crm01-wire-field min-w-0">
                <select
                  id="crm01-pop-job"
                  v-model="pcond33"
                  class="crm01-sg-select h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="0">전체</option>
                  <option value="1">회사원</option>
                  <option value="2">공무원</option>
                  <option value="3">교직원</option>
                  <option value="4">전문직</option>
                  <option value="5">자영업</option>
                  <option value="6">학생</option>
                  <option value="7">주부</option>
                </select>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">직장명</div>
              <div class="crm01-wire-field min-w-0">
                <input
                  id="crm01-pop-company"
                  v-model="pcond34"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- 비고 전폭 -->
            <div class="crm01-wire-cell crm01-modal-span-full crm01-modal-remark-row">
              <div class="crm01-wire-label">비고</div>
              <div class="crm01-wire-field min-w-0">
                <input
                  id="crm01-pop-remark"
                  v-model="pcond37"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          </section>
        </div>
      </div>
      <div class="shrink-0 flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-2.5 sm:px-6">
        <button
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          @click="
            visible = false;
            InsertNew = false;
            closeMktSmsPopup();
          ">
          닫기
        </button>
        <button
          type="button"
          class="rounded-lg bg-blue-600 px-5 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:px-6 sm:py-2"
          @click="saveButton">
          저장
        </button>
      </div>
    </div>
    </div>
  </Teleport>

  <!-- 마케팅 수신동의 문자발송 팝업 (body teleport — 고객 팝업·레이아웃 위 최상단) -->
  <Teleport to="body">
    <div
      v-if="mktSmsPopupVisible"
      class="fixed inset-0 z-[11100] flex items-center justify-center bg-black/50 p-3">
      <div
        class="crm01-mkt-sms-popup flex w-full max-w-lg max-h-[min(calc(100dvh-1.5rem),920px)] flex-col overflow-y-auto rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        <div class="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-5 py-3">
          <h2 class="text-base font-bold text-slate-900 sm:text-lg">마케팅 수신동의 문자발송</h2>
        </div>
        <div class="flex flex-col gap-3 px-5 py-4">
          <div class="crm01-mkt-sms-date-row flex items-center gap-3">
            <label class="crm01-mkt-sms-date-label shrink-0" for="crm01-mkt-sms-consent-date">마케팅 수신동의 일자</label>
            <input
              id="crm01-mkt-sms-consent-date"
              v-model="mktSmsConsentDate"
              type="date"
              class="crm01-sg-input crm01-modal-date h-8 min-h-8 w-[9.25rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800"
            />
          </div>
          <div
            class="crm01-mkt-sms-template w-full rounded-md border border-solid border-slate-300 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-700"
            role="textbox"
            aria-readonly="true">
            {{ mktSmsTemplateDisplay || "발송 템플릿을 불러오는 중입니다." }}
          </div>
          <p v-if="mktSmsAvailable" class="crm01-mkt-sms-template-notice">
            ※ 위 내용은 발송 미리보기입니다. 실제 전송 시 줄바꿈 위치는 수신 환경에 따라 달라질 수 있습니다.
          </p>
        </div>
        <div class="flex shrink-0 justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            @click="closeMktSmsPopup">
            닫기
          </button>
          <button
            type="button"
            class="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            @click="sendMktSms">
            전송
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <GetZipCode
    v-if="show1"
    @closePopUp="show1 = false"
    @zipAndAddress="zipAndAddress"></GetZipCode>
  <GetZipCode
    v-if="show2"
    @closePopUp="show2 = false"
    @zipAndAddress="zipAndAddress2"></GetZipCode>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  deleteCustomors,
  getCustInitData,
  getCustomerInfo,
  getCustomerInfoCount,
  getCustomerInfoExcel,
  getCrmPolicy,
  getInitDataCustPurchase,
  getCustJoinPath,
  getJoinPathMst,
  getMktConsentAlimTalkTemplate,
  insertCustomerInfo,
  sendMktConsentAlimTalk,
  setCustJoinPath,
  updateCustomerInfo,
  validCardNo,
} from "@/api/micrm";
import Datepicker2 from "@/components/Datepicker2.vue";
import GetZipCode from "@/components/getZipCode.vue";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
import PickStoreSingle from "@/components/pickStoreSingle.vue";
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

import { formatLocalDate, insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { computed, nextTick, onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);
const optionList2 = ref([]);
const policyInfo = ref([]);

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitDataCustPurchase(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;

  const res2 = await getCustInitData(store.state.userData.lngStoreGroup);
  optionList2.value = res2.data.List;

  const crmPolicy = await getCrmPolicy(store.state.userData.lngStoreGroup);
  policyInfo.value = crmPolicy.data.List;

});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();

/** 조회 AREA — PUR03_036RPT / search-area-layout 패턴 */
const crm01ControlBorder = "#cbd5e1";
const crm01ColGutter = "1.25rem";
const crm01RowGap = "0.6875rem";
const crm01LabelCol = "8rem";
/** 신규/수정 팝업 전용 간격 — 노트북 한 화면 맞춤 */
const crm01ModalColGutter = "0.75rem";
const crm01ModalRowGap = "0.4rem";
const crm01ModalLabelCol = "6.875rem";
const crm01ModalRowBorder = "#e2e8f0";
const crm01ModalRowPad = "0.25rem 0.45rem";

const CRM01_JOIN_PATH_OPTIONS_FALLBACK = [
  { code: "1", label: "온라인 광고" },
  { code: "2", label: "네이버 검색" },
  { code: "3", label: "지인추천" },
  { code: "4", label: "친구/가족추천" },
  { code: "5", label: "매장 홍보물" },
  { code: "6", label: "기타" },
];

const joinPathOptions = ref([...CRM01_JOIN_PATH_OPTIONS_FALLBACK]);

const crm01JoinPathGridStyle = computed(() => {
  const n = Math.max(joinPathOptions.value.length, 1);
  return { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` };
});

const mapJoinPathMstRow = (row) => ({
  code: String(row.lngPathCD ?? row.LNGPATHCD ?? "").trim(),
  label: String(row.strPathNM ?? row.STRPATHNM ?? "").trim(),
});

const loadJoinPathMst = async (group) => {
  const g = group ?? ccustomorGroup.value ?? groupCd.value;
  if (!g) {
    joinPathOptions.value = [...CRM01_JOIN_PATH_OPTIONS_FALLBACK];
    return;
  }
  try {
    const res = await getJoinPathMst(g);
    const list = Array.isArray(res.data?.List) ? res.data.List : [];
    const opts = list.map(mapJoinPathMstRow).filter((o) => o.code && o.label);
    joinPathOptions.value =
      opts.length > 0 ? opts : [...CRM01_JOIN_PATH_OPTIONS_FALLBACK];
  } catch {
    joinPathOptions.value = [...CRM01_JOIN_PATH_OPTIONS_FALLBACK];
  }
  const valid = new Set(joinPathOptions.value.map((o) => o.code));
  pcond38.value = (Array.isArray(pcond38.value) ? pcond38.value : [])
    .map((c) => String(c).trim())
    .filter((c) => valid.has(c));
};

const loadMktSmsTemplate = async (group) => {
  const g = group ?? ccustomorGroup.value ?? groupCd.value;
  mktSmsTemplateRaw.value = "";
  mktSmsTempCode.value = "";
  if (!g) return;
  try {
    const res = await getMktConsentAlimTalkTemplate(g);
    const list = Array.isArray(res.data?.List) ? res.data.List : [];
    const row = list[0];
    if (!row) return;
    const msg = String(
      row.KT_TEMPMSG ?? row.ktTempMsg ?? row.kt_tempmsg ?? ""
    ).trim();
    const code = String(
      row.KT_TEMPCODE ?? row.ktTempCode ?? row.kt_tempcode ?? ""
    ).trim();
    if (msg) {
      mktSmsTemplateRaw.value = msg;
      mktSmsTempCode.value = code;
    }
  } catch {
    mktSmsTemplateRaw.value = "";
    mktSmsTempCode.value = "";
  }
};

const preparePopupJoinPath = async () => {
  const group = ccustomorGroup.value ?? groupCd.value;
  await Promise.all([loadJoinPathMst(group), loadMktSmsTemplate(group)]);
  await loadCustJoinPath();
};

/** 조회 영역 UI(매장·기간)를 최초 마운트와 동일하게 다시 그릴 때 증가 */
const crm01SearchAreaKey = ref(0);

const cond = ref("");
const cond2 = ref("");
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref("");
const cond7 = ref("");
const cond8 = ref(1);
const cond9 = ref("");
const cond10 = ref(0);
const cond11 = ref(1);
const cond12 = ref("");
const cond13 = ref(1);
const cond14 = ref("");
const cond15 = ref(1);
const cond16 = ref("");
const cond17 = ref(2);
const cond18 = ref(1);
const cond19 = ref("");
const cond20 = ref(2);
const cond21 = ref(-1);

/** 누적·잔여·실매출 입력: 화면 #,###, API는 숫자 또는 null */
const parseAmountInputToNumber = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const s = String(v).replace(/,/g, "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const onThousandsAmountInput = (e, refTarget) => {
  const digits = String(e.target.value ?? "")
    .replace(/,/g, "")
    .replace(/\D/g, "");
  refTarget.value =
    digits === "" ? "" : Number(digits).toLocaleString("en-US");
};

/** 숫자만 입력 (누적·잔여·실매출 금액 필드) */
const NUMERIC_AMOUNT_NAV_KEYS = new Set([
  "Backspace",
  "Delete",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
]);

const onNumericAmountKeydown = (e) => {
  if (e.isComposing) return;
  if (NUMERIC_AMOUNT_NAV_KEYS.has(e.key)) return;
  if (e.ctrlKey || e.metaKey) return;
  if (/^\d$/.test(e.key)) return;
  e.preventDefault();
};

const digitCountBeforeDisplayIndex = (displayValue, pos) => {
  const s = String(displayValue ?? "");
  const p = Math.min(Math.max(0, pos), s.length);
  let n = 0;
  for (let i = 0; i < p; i++) {
    if (/\d/.test(s[i])) n++;
  }
  return n;
};

const onNumericAmountPaste = (e, refTarget) => {
  e.preventDefault();
  const pasteDigits = (e.clipboardData?.getData("text/plain") ?? "").replace(
    /\D/g,
    ""
  );
  const el = e.target;
  const start =
    typeof el.selectionStart === "number" ? el.selectionStart : 0;
  const end =
    typeof el.selectionEnd === "number" ? el.selectionEnd : start;
  const disp = String(refTarget.value ?? "");
  const curDigits = disp.replace(/\D/g, "");
  const sIdx = digitCountBeforeDisplayIndex(disp, start);
  const eIdx = digitCountBeforeDisplayIndex(disp, end);
  const merged = curDigits.slice(0, sIdx) + pasteDigits + curDigits.slice(eIdx);
  const digits = merged.replace(/\D/g, "");
  refTarget.value =
    digits === "" ? "" : Number(digits).toLocaleString("en-US");
};

const onCond12ThousandsInput = (e) => onThousandsAmountInput(e, cond12);
const onCond14ThousandsInput = (e) => onThousandsAmountInput(e, cond14);
const onCond19ThousandsInput = (e) => onThousandsAmountInput(e, cond19);
const onCond12NumericPaste = (e) => onNumericAmountPaste(e, cond12);
const onCond14NumericPaste = (e) => onNumericAmountPaste(e, cond14);
const onCond19NumericPaste = (e) => onNumericAmountPaste(e, cond19);

const datepicker = ref(null);
const closePopUp = ref(false);

const point1 = ref();
const point2 = ref();
const point3 = ref();
const point4 = ref();

const pcond = ref("");
const pcond2 = ref(1);
const pcond3 = ref("");
const pcond4 = ref("");
const pcond5 = ref(0);
const pcond6 = ref("010");
const pcond7 = ref("");
const pcond8 = ref("");
const pcond9 = ref(false);
const pcond10 = ref(0);
const pcond11 = ref("");
const pcond12 = ref("");
const pcond13 = ref("");
const pcond14 = ref("");
const pcond15 = ref(false);
const pcond16 = ref("");
const pcond17 = ref();
const pcond18 = ref(0);
const pcond19 = ref("");
const pcond20 = ref("");
const pcond21 = ref("");
const pcond22 = ref(0);
const pcond23 = ref(false);
const pcond24 = ref("");
const pcond25 = ref("");
const pcond26 = ref("");
const pcond27 = ref("--");
const pcond28 = ref(0);
const pcond29 = ref("--");
const pcond30 = ref(1);
const pcond31 = ref(0);
const pcond32 = ref(false);
const pcond33 = ref(0);
const pcond34 = ref("");
const pcond35 = ref("");
const pcond36 = ref("");
const pcond37 = ref("");
const pcond38 = ref([]);

const pcondSmsAgreeDate = ref("");
const pcondMktAgreeDate = ref("");
const pcondSmsAgreeDateLabel = ref("SMS 수신 미동의일");
const pcondMktAgreeDateLabel = ref("마케팅 정보 미수신 동의일");

/** DB 저장 기준 마케팅 동의 (체크박스 변경과 무관 — 조회/저장 후 갱신) */
const savedMktAgree = ref(false);
const savedMktAgreeDate = ref("");

const mktSmsPopupVisible = ref(false);
const mktSmsConsentDate = ref("");
/** API 원본 템플릿 (KT_TEMPMSG, #{비고1} 포함) */
const mktSmsTemplateRaw = ref("");
const mktSmsTempCode = ref("");

const resolveMktSmsConsentDate = () => {
  const saved = savedMktAgreeDate.value;
  if (saved != null && String(saved).trim() !== "") {
    return formatConsentDateDisplay(saved);
  }
  return formatLocalDate(new Date());
};

const openMktSmsPopup = () => {
  if (!savedMktAgree.value || !mktSmsAvailable.value) return;
  mktSmsConsentDate.value = resolveMktSmsConsentDate();
  mktSmsPopupVisible.value = true;
};

const closeMktSmsPopup = () => {
  mktSmsPopupVisible.value = false;
};

const sendMktSms = async () => {
  const dateDisplay = formatMktSmsTemplateDate(mktSmsConsentDate.value);
  if (!mktSmsConsentDate.value || !dateDisplay) {
    await Swal.fire({
      title: "경고",
      text: "마케팅 수신동의 일자를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const confirmed = await Swal.fire({
    title: "전송 확인",
    html: `설정된 마케팅 수신동의 일자(<b>${dateDisplay}</b>)가 맞습니까?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "예",
    cancelButtonText: "아니오",
  });
  if (!confirmed.isConfirmed) return;

  const group = ccustomorGroup.value ?? groupCd.value;
  const custNo = String(ccustomorNum.value ?? "").trim();
  if (!group || !custNo) {
    await Swal.fire({
      title: "경고",
      text: "고객 정보를 확인할 수 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  const consentDate = formatConsentDateDisplay(mktSmsConsentDate.value);
  if (!consentDate) {
    await Swal.fire({
      title: "경고",
      text: "마케팅 수신동의 일자 형식이 올바르지 않습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const res = await sendMktConsentAlimTalk(group, custNo, consentDate);
    if (res?.data?.RESULT_CD != null && res.data.RESULT_CD !== "00") {
      await Swal.fire({
        title: "실패",
        text: res.data.RESULT_NM || "알림톡 발송에 실패했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }
    await Swal.fire({
      title: "완료",
      text: "마케팅 수신동의 안내 알림톡 발송 요청이 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    closeMktSmsPopup();
  } catch {
    await Swal.fire({
      title: "실패",
      text: "알림톡 발송 중 오류가 발생했습니다.",
      icon: "error",
      confirmButtonText: "확인",
    });
  } finally {
    store.state.loading = false;
  }
};

const visible = ref(false);
const team = ref();
const lngStoreTeam = (e) => {
  team.value = e;
};
const supervisor = ref();
const lngSupervisor = (e) => {
  supervisor.value = e;
};
const groupCd = ref();
const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const storeCd = ref();
const lngStoreCode = (e) => {
  storeCd.value = e;
};

const zipAndAddress = (e) => {
  setTimeout(() => {
    pcond19.value = e.split(",")[0];
  }, 10);

  pcond20.value = e.split(",")[1];
  pcond21.value = "";
};
const zipAndAddress2 = (e) => {
  setTimeout(() => {
    pcond24.value = e.split(",")[0];
  }, 10);

  pcond25.value = e.split(",")[1];
  pcond26.value = "";
};

const pstore = ref(0);

// const preferStore = (e) => {
//   pstore.value = e;
// };
/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const handleParentClick = (e) => {
  const datepickerEl = datepicker.value?.$el;
  if (datepickerEl && datepickerEl.contains(e.target)) {
    return;
  }
  closePopUp.value = !closePopUp.value;
};

const Name = (e) => {
  ////console.log(e);
};
const searchNum = ref(0);
const ID = (e) => {
  searchNum.value = e;
};

const custID = ref();
const CustId = (e) => {
  custID.value = e;
};
const sDate = ref();
const eDate = ref();
const startDate = (e) => {
  sDate.value = e;
};
const endDate = (e) => {
  eDate.value = e;
};

const sDate2 = ref();
const eDate2 = ref();
const startDate2 = (e) => {
  sDate2.value = e;
};
const endDate2 = (e) => {
  eDate2.value = e;
};

const sDate3 = ref();
const eDate3 = ref();
const startDate3 = (e) => {
  sDate3.value = e;
};
const endDate3 = (e) => {
  eDate3.value = e;
};

const selectedDate = ref();
const excelDate = (e) => {
  selectedDate.value = e;
};
/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
/** 조회·건수확인·엑셀 공통 파라미터 배열 */
const buildSearchParams = () => {
  const salePointAmt = parseAmountInputToNumber(cond12.value);
  const remPointAmt  = parseAmountInputToNumber(cond14.value);
  const actAmtVal    = parseAmountInputToNumber(cond19.value);
  return [
    groupCd.value, 0, team.value, supervisor.value, storeCd.value, null,
    cond.value, cond2.value, cond8.value, null,
    cond3.value, cond4.value,
    cond9.value === "" ? null : cond9.value,
    cond6.value === "" ? null : cond6.value,
    cond5.value, cond7.value, null, null, null,
    sDate.value, eDate.value, sDate2.value, eDate2.value,
    sDate3.value, eDate3.value,
    cond11.value, salePointAmt, cond13.value, remPointAmt,
    cond18.value, actAmtVal, cond15.value, cond16.value,
    cond10.value, cond17.value, pstore.value, cond21.value, cond20.value,
  ];
};

const searchButton = async () => {
  try {
    const params = buildSearchParams();

    // 건수 먼저 확인
    store.state.loading = true;
    const cntRes = await getCustomerInfoCount(...params);
    const totalCnt = Number(cntRes.data?.Count ?? cntRes.data?.List?.[0]?.Count ?? 0);
    store.state.loading = false;

    if (totalCnt > 30000) {
      const confirmed = await Swal.fire({
        title: "조회 결과 안내",
        html: `<b>${totalCnt.toLocaleString()}</b>건의 데이터가 검색되었습니다.<br>해당 자료는 웹에서 표시가 불가능합니다.<br>해당 조건의 데이터를 엑셀로 다운로드 하시겠습니까?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예 (엑셀 다운로드)",
        cancelButtonText: "아니오",
      });
      if (!confirmed.isConfirmed) return;

      // 엑셀 다운로드
      store.state.loading = true;
      const excelRes = await getCustomerInfoExcel(...params);
      const blob = new Blob([excelRes.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      a.download = `고객조회_${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // 3만 건 이하 → 정상 조회
    store.state.loading = true;
    initGrid();
    const res = await getCustomerInfo(...params);

    rowData.value = res.data.List;
    afterSearch.value = true;

    const cnt = Array.isArray(res.data?.List) ? res.data.List.length : 0;
    await Swal.fire({
      text: `${cnt}명의 고객이 조회 되었습니다.`,
      icon: "info",
      confirmButtonText: "확인",
    });
    if (cnt > 0) {
      await nextTick();
      window.gridView?.setCurrent({ itemIndex: 0 });
    }
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

const saveButton = async () => {
  if (
    pcond.value == "" ||
    pcond2.value == undefined ||
    pcond3.value == "" ||   
    pcond5.value == undefined ||
    pcond6.value == undefined ||
    pcond7.value == "" ||
    pcond8.value == "" ||
    pcond10.value == "0"
  ) {
    Swal.fire({
      title: "경고",
      text: "필수값이 누락되었습니다. 확인해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (policyInfo.value[0].lngCardLen != 99 && 
      pcond.value.length != policyInfo.value[0].lngCardLen
    ) {
    Swal.fire({
      title: "경고",
      text: "카드번호 자리수를 확인해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  
  if (checkCard.value == false && InsertNew.value == true) {
    Swal.fire({
      title: "경고",
      text: "카드번호에 대한 중복검사를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    let res;
    if (InsertNew.value == false) {
      res = await updateCustomerInfo(
        ccustomorGroup.value,
        pcond17.value,
        ccustomorStatus.value,
        store.state.userData.lngSequence,
        ccustomorNum.value,
        pcond3.value,
        pcond4.value,
        pcond2.value,
        pcond5.value,
        pcond31.value == false ? 0 : 1,
        pcond12.value,
        pcond13.value,
        pcond9.value == false ? 0 : 1,
        pcond15.value == false ? 0 : 1,
        pcond6.value + "-" + pcond7.value + "-" + pcond8.value,
        pcond14.value,
        pcond11.value,
        pcond19.value,
        pcond20.value,
        pcond21.value,
        "",
        pcond24.value,
        pcond25.value,
        pcond26.value,
        pcond22.value,
        pcond30.value,
        pcond33.value,
        pcond34.value,
        pcond36.value,
        pcond35.value,
        pcond27.value.split("-")[0] == undefined
          ? ""
          : pcond27.value.split("-")[0],
        pcond27.value.split("-")[1] == undefined
          ? ""
          : pcond27.value.split("-")[1],
        pcond27.value.split("-")[2] == undefined
          ? ""
          : pcond27.value.split("-")[2],
        pcond28.value,
        pcond29.value.split("-")[0] == undefined
          ? ""
          : pcond29.value.split("-")[0],
        pcond29.value.split("-")[1] == undefined
          ? ""
          : pcond29.value.split("-")[1],
        pcond29.value.split("-")[2] == undefined
          ? ""
          : pcond29.value.split("-")[2],
        pcond32.value == false ? 0 : 1,
        pcond10.value,
        pcond37.value,
        "",
        null,
        pcond18.value
      );
    } else {
      res = await insertCustomerInfo(
        ccustomorGroup.value,
        pcond17.value,
        ccustomorStatus.value,
        store.state.userData.lngSequence,
        ccustomorNum.value,
        pcond3.value,
        pcond4.value,
        pcond2.value,
        pcond5.value,
        pcond31.value == false ? 0 : 1,
        pcond12.value,
        pcond13.value,
        pcond9.value == false ? 0 : 1,
        pcond15.value == false ? 0 : 1,
        pcond6.value + "-" + pcond7.value + "-" + pcond8.value,
        pcond14.value,
        pcond11.value,
        pcond19.value,
        pcond20.value,
        pcond21.value,
        "",
        pcond24.value,
        pcond25.value,
        pcond26.value,
        pcond22.value,
        pcond30.value,
        pcond33.value,
        pcond34.value,
        pcond36.value,
        pcond35.value,
        pcond27.value.split("-")[0] == undefined
          ? ""
          : pcond27.value.split("-")[0],
        pcond27.value.split("-")[1] == undefined
          ? ""
          : pcond27.value.split("-")[1],
        pcond27.value.split("-")[2] == undefined
          ? ""
          : pcond27.value.split("-")[2],
        pcond28.value,
        pcond29.value.split("-")[0] == undefined
          ? ""
          : pcond29.value.split("-")[0],
        pcond29.value.split("-")[1] == undefined
          ? ""
          : pcond29.value.split("-")[1],
        pcond29.value.split("-")[2] == undefined
          ? ""
          : pcond29.value.split("-")[2],
        pcond32.value == false ? 0 : 1,
        pcond10.value,
        pcond37.value,
        "",
        null,
        pcond18.value,
        pcond.value
      );
    }
    const saveFailed =
      res?.data?.RESULT_CD != null && res.data.RESULT_CD !== "00";
    if (saveFailed) {
      await Swal.fire({
        title: "실패",
        text: res.data.RESULT_NM
          ? `저장을 실패하였습니다. ${res.data.RESULT_NM}`
          : "저장을 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    const isNew = InsertNew.value;
    const savedCustNo = await resolveCustNoAfterSave(res, isNew);
    if (savedCustNo) {
      ccustomorNum.value = savedCustNo;
    }
    const joinPathOk = await saveCustomerJoinPath(
      ccustomorGroup.value ?? groupCd.value,
      savedCustNo
    );
    if (!joinPathOk) {
      await Swal.fire({
        title: "경고",
        text: "고객 정보는 저장되었으나 가입경로 저장에 실패했습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }

    if (isNew) {
      visible.value = false;
      InsertNew.value = false;
      closeMktSmsPopup();
      if (afterSearch.value) {
        await searchButton();
      }
    } else {
      await Swal.fire({
        text: joinPathOk
          ? "저장되었습니다."
          : "저장되었습니다. (가입경로는 확인 필요)",
        icon: "success",
        confirmButtonText: "확인",
      });
      await reloadPopupCustomerFromServer();
    }
  } catch (error) {
    ////console.log(error);
  } finally {
    store.state.loading = false;
  }
};

// const clickedRowData = async (e) => {
//   ////console.log(e);
//   // const res = await getReceiptDataDetail2(e[1], e[2], e[0]);
//   // ////console.log(res);
//   // rowData2.value = res.data.List;
//   // rowData3.value = res.data.List2;
//   // rowData4.value = res.data.List3;
// };

const ccustomorNum = ref();
const ccustomorGroup = ref();
const ccustomorStatus = ref();
const popupEditDataRow = ref(-1);

const normalizeCardId = (v) => String(v ?? "").replace(/[\[\]]/g, "").trim();

const formatCardIdForApi = (card) => {
  const raw = normalizeCardId(card);
  return raw ? `[${raw}]` : null;
};

const formatJoinPathForApi = (codes) => {
  if (!Array.isArray(codes) || codes.length === 0) return "";
  return codes.map((c) => String(c).trim()).filter(Boolean).join(",");
};

const parseJoinPathCodes = (raw) => {
  if (raw == null || raw === "") return [];
  const s = String(raw).trim();
  if (!s) return [];
  return s.split(/[,|]/).map((c) => c.trim()).filter(Boolean);
};

const resolveCustNoAfterSave = (res, isNew) => {
  if (!isNew) {
    return String(ccustomorNum.value ?? "").trim();
  }
  const fromRes =
    res?.data?.List?.[0]?.lngCustNo ??
    res?.data?.List?.[0]?.CUST_NO ??
    res?.data?.CUST_NO ??
    res?.data?.lngCustNo;
  if (fromRes != null && String(fromRes).trim() !== "") {
    return String(fromRes).trim();
  }
  return String(ccustomorNum.value ?? "").trim();
};

const loadCustJoinPath = async () => {
  const group = ccustomorGroup.value ?? groupCd.value;
  const custNo = String(ccustomorNum.value ?? "").trim();
  if (!group || !custNo) {
    pcond38.value = [];
    return;
  }
  try {
    const res = await getCustJoinPath(group, custNo);
    const raw = res?.data?.JOIN_PATH_CDS ?? "";
    pcond38.value = parseJoinPathCodes(raw);
  } catch {
    pcond38.value = [];
  }
};

const saveCustomerJoinPath = async (group, custNo) => {
  const cust = String(custNo ?? "").trim();
  if (!group || !cust) return true;
  try {
    const pathRes = await setCustJoinPath(
      group,
      cust,
      store.state.userData.lngSequence,
      formatJoinPathForApi(pcond38.value)
    );
    if (pathRes?.data?.RESULT_CD != null && pathRes.data.RESULT_CD !== "00") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const gridRowField = (row, fieldNames, indexFallback) => {
  if (row == null) return undefined;
  if (Array.isArray(row)) return row[indexFallback];
  for (const name of fieldNames) {
    if (Object.prototype.hasOwnProperty.call(row, name)) {
      return row[name];
    }
  }
  return row[indexFallback];
};

const gridRowAgreed = (row, fieldNames, indexFallback) => {
  const v = gridRowField(row, fieldNames, indexFallback);
  return v === true || v === "True" || v === 1 || v === "1";
};

const formatConsentDateDisplay = (raw) => {
  if (raw == null || raw === "") return "";
  const s = String(raw).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{8}$/.test(s)) {
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  const formatted = formatLocalDate(raw);
  return formatted && formatted !== "--" ? formatted : "";
};

const mktSmsAvailable = computed(
  () => String(mktSmsTemplateRaw.value ?? "").trim() !== ""
);

/** 템플릿 #{비고1} — 2026년 5월 28일 형식 */
const formatMktSmsTemplateDate = (raw) => {
  if (raw == null || raw === "") return "";
  let s = String(raw).trim();
  if (/^\d{8}$/.test(s)) {
    s = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) {
    return `${m[1]}년 ${Number(m[2])}월 ${Number(m[3])}일`;
  }
  const formatted = formatLocalDate(raw);
  const m2 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(formatted);
  if (m2) {
    return `${m2[1]}년 ${Number(m2[2])}월 ${Number(m2[3])}일`;
  }
  return "";
};

/** #{비고1} → 동의일자 콤보 값 (날짜 변경 시 실시간 반영) */
const mktSmsTemplateDisplay = computed(() => {
  const raw = mktSmsTemplateRaw.value ?? "";
  if (!raw) return "";
  const date = formatMktSmsTemplateDate(mktSmsConsentDate.value);
  return raw.replace(/#\{비고1\}/g, date);
});

/** crmCustConsentStat — 동의면 LastAgree, 미동의면 LastRefuse (getCustomerInfo SELECT alias) */
const pickConsentDateFromRow = (row, agreed, agreeFieldNames, refuseFieldNames) => {
  const names = agreed ? agreeFieldNames : refuseFieldNames;
  for (const name of names) {
    const raw = gridRowField(row, [name], undefined);
    if (raw != null && String(raw).trim() !== "") {
      return formatConsentDateDisplay(raw);
    }
  }
  return "";
};

const setSmsConsentFromRow = (e) => {
  const agreed = gridRowAgreed(e, ["blnSMS", "BLNSMS"], 7);
  pcondSmsAgreeDateLabel.value = agreed ? "SMS 수신 동의일" : "SMS 수신 미동의일";
  pcondSmsAgreeDate.value = pickConsentDateFromRow(e, agreed, ["dtmSmsLastAgree"], [
    "dtmSmsLastRefuse",
  ]);
};

const setMktConsentFromRow = (e) => {
  const agreed = gridRowAgreed(e, ["blnCustAgree", "CUSTAGREE", "blnMktAgree"], 58);
  savedMktAgree.value = agreed;
  savedMktAgreeDate.value = agreed
    ? pickConsentDateFromRow(e, true, ["dtmMktLastAgree"], [])
    : "";
  pcondMktAgreeDateLabel.value = agreed
    ? "마케팅 정보 수신 동의일"
    : "마케팅 정보 미수신 동의일";
  pcondMktAgreeDate.value = pickConsentDateFromRow(e, agreed, ["dtmMktLastAgree"], [
    "dtmMktLastRefuse",
  ]);
};

const resetConsentDateFields = () => {
  pcondSmsAgreeDate.value = "";
  pcondMktAgreeDate.value = "";
  pcondSmsAgreeDateLabel.value = "SMS 수신 미동의일";
  pcondMktAgreeDateLabel.value = "마케팅 정보 미수신 동의일";
  savedMktAgree.value = false;
  savedMktAgreeDate.value = "";
};

const getRowCustNo = (row) =>
  String(
    gridRowField(row, ["A01_lngCustNo", "lngCustNo", "lngCustNO"], 0) ?? ""
  ).trim();

const getRowCardId = (row) =>
  normalizeCardId(
    gridRowField(row, ["A05_strCCardID", "strCCardID", "strCardId"], 4)
  );

const matchesCustomerRow = (row, custNo, cardId) => {
  const targetNo = String(custNo ?? "").trim();
  const targetCard = normalizeCardId(cardId);
  const rowNo = getRowCustNo(row);
  const rowCard = getRowCardId(row);
  if (targetNo && rowNo && rowNo === targetNo) return true;
  if (targetCard && rowCard && rowCard === targetCard) return true;
  if (!row || typeof row !== "object") return false;
  for (const [key, val] of Object.entries(row)) {
    if (targetNo && /custno/i.test(key) && String(val ?? "").trim() === targetNo) {
      return true;
    }
    if (targetCard && /card/i.test(key) && normalizeCardId(val) === targetCard) {
      return true;
    }
  }
  return false;
};

const mergeGridRowAt = (dataRow) => {
  if (dataRow == null || dataRow < 0) return null;
  const fromParent =
    Array.isArray(rowData.value) && dataRow < rowData.value.length
      ? rowData.value[dataRow]
      : null;
  let fromProvider = null;
  try {
    const gv = window.gridView;
    const dp = gv?.getDataSource?.();
    if (dp?.getRows) fromProvider = dp.getRows()[dataRow];
    if (!fromProvider && dp?.getJsonRow) fromProvider = dp.getJsonRow(dataRow);
  } catch {
    fromProvider = null;
  }
  if (!fromParent && !fromProvider) return null;
  if (!fromParent) return fromProvider;
  if (!fromProvider) return fromParent;
  const merged = { ...(fromProvider || {}) };
  for (const k of Object.keys(fromParent)) {
    const pv = fromParent[k];
    const mv = merged[k];
    if (
      (mv === undefined || mv === null || mv === "") &&
      pv !== undefined &&
      pv !== null &&
      pv !== ""
    ) {
      merged[k] = pv;
    }
  }
  return Object.keys(merged).length > 0 ? merged : fromParent;
};

const findCustomerDataRowIndex = (custNo, cardId) => {
  const idx = rowData.value.findIndex((row) =>
    matchesCustomerRow(row, custNo, cardId)
  );
  if (idx >= 0) return idx;
  if (
    popupEditDataRow.value >= 0 &&
    popupEditDataRow.value < rowData.value.length
  ) {
    return popupEditDataRow.value;
  }
  const cur = window.gridView?.getCurrent?.();
  if (cur?.dataRow >= 0) return cur.dataRow;
  return -1;
};

const buildMinimalCustomerSearchParams = (custNo, cardId) => {
  const params = buildSearchParams();
  params[0] = groupCd.value;
  params[1] = 0;
  params[2] = null;
  params[3] = null;
  params[4] = null;
  params[5] = custNo ?? null;
  params[6] = cardId ? formatCardIdForApi(cardId) : null;
  for (let i = 7; i < params.length; i++) {
    params[i] = null;
  }
  return params;
};

const fetchCustomerRowForPopup = async () => {
  const custNo = ccustomorNum.value;
  const cardId = pcond.value;
  let res = await getCustomerInfo(
    ...buildMinimalCustomerSearchParams(custNo, null)
  );
  let list = Array.isArray(res.data?.List) ? res.data.List : [];
  let row = list.find((r) => matchesCustomerRow(r, custNo, null));
  if (row) return row;
  if (cardId) {
    res = await getCustomerInfo(
      ...buildMinimalCustomerSearchParams(null, cardId)
    );
    list = Array.isArray(res.data?.List) ? res.data.List : [];
    row = list.find((r) => matchesCustomerRow(r, custNo, cardId));
    if (row) return row;
  }
  return null;
};

const applyGridRowToPopupForm = (e) => {
  ccustomorNum.value = getRowCustNo(e);
  ccustomorGroup.value = gridRowField(e, ["lngStoreGroup"], 59);
  ccustomorStatus.value = gridRowField(e, ["intJoinSts"], 60);
  pcond.value = String(getRowCardId(e)).replace("[", "").replace("]", "");
  pcond2.value = e[49];
  pcond3.value = e[1];
  pcond4.value = e[35];
  pcond5.value = e[37] == "True" ? 1 : 0;
  const mobileParts = String(e[6] ?? "").split("-");
  pcond6.value = "010";
  pcond7.value = mobileParts[1] ?? "";
  pcond8.value = mobileParts[2] ?? "";
  pcond9.value = e[7] == "True" ? true : false;
  pcond10.value = e[36];
  pcond11.value = e[10];
  pcond12.value = e[55];
  pcond13.value = e[56];
  pcond14.value = e[8];
  pcond15.value = e[9] == "True" ? true : false;
  pcond16.value = formatLocalDate(e[20]);
  pcond17.value = e[57];
  pcond18.value = e[61];
  pcond19.value = e[11];
  pcond20.value = e[12];
  pcond21.value = e[13];
  pcond22.value = e[50];
  pcond24.value = e[14];
  pcond25.value = e[15];
  pcond26.value = e[16];
  pcond27.value = formatLocalDate(e[17]);
  pcond28.value = e[47] == "True" ? 1 : 0;
  pcond29.value = formatLocalDate(e[19]);
  pcond30.value = e[39];
  pcond31.value = e[40] == "True" ? 1 : 0;
  pcond32.value = e[58] == "True" ? true : false;
  pcond33.value = e[42];
  pcond34.value = e[43];
  pcond35.value = e[45];
  pcond36.value = e[44];
  pcond37.value = e[46];
  pcond38.value = [];
  setSmsConsentFromRow(e);
  setMktConsentFromRow(e);
  preparePopupJoinPath();
};

const applyMergedRowToPopup = (dataRow) => {
  const merged = mergeGridRowAt(dataRow);
  if (!merged) return false;
  applyGridRowToPopupForm(merged);
  popupEditDataRow.value = dataRow;
  return true;
};

const refreshCustomerGridSilently = async () => {
  if (!afterSearch.value) return;
  const res = await getCustomerInfo(...buildSearchParams());
  rowData.value = Array.isArray(res.data?.List) ? res.data.List : [];
  reload.value = !reload.value;
  await nextTick();
  const idx = findCustomerDataRowIndex(ccustomorNum.value, pcond.value);
  if (idx >= 0) {
    popupEditDataRow.value = idx;
    window.gridView?.setCurrent({ itemIndex: idx });
  }
};

const reloadPopupCustomerFromServer = async () => {
  const custNo = ccustomorNum.value;
  const cardId = pcond.value;
  if (afterSearch.value) {
    await refreshCustomerGridSilently();
    await nextTick();
    await nextTick();
  }
  const dataRow = findCustomerDataRowIndex(custNo, cardId);
  if (dataRow >= 0 && applyMergedRowToPopup(dataRow)) {
    return true;
  }
  const fetched = await fetchCustomerRowForPopup();
  if (fetched) {
    let idx = rowData.value.findIndex((row) => row === fetched);
    if (idx < 0) {
      idx = rowData.value.findIndex((row) =>
        matchesCustomerRow(row, custNo, cardId)
      );
    }
    if (idx >= 0 && applyMergedRowToPopup(idx)) {
      return true;
    }
    applyGridRowToPopupForm(fetched);
    return true;
  }
  return false;
};

const dblclickedRowData = (e) => {
  InsertNew.value = false;
  visible.value = true;
  popupEditDataRow.value =
    typeof e?.dataRow === "number"
      ? e.dataRow
      : typeof e?.index === "number"
        ? e.index
        : -1;
  applyGridRowToPopupForm(e);
};

const initVar = () => {
  pcond.value = "";
};

function resetPconds() {
  pcond.value = "";
  pcond2.value = 1;
  pcond3.value = "";
  pcond4.value = "";
  pcond5.value = 0;
  pcond6.value = "010";
  pcond7.value = "";
  pcond8.value = "";
  pcond9.value = false;
  pcond10.value = 0;
  pcond11.value = "";
  pcond12.value = "";
  pcond13.value = "";
  pcond14.value = "";
  pcond15.value = false;
  pcond16.value = "";
  pcond17.value = store.state.userData.lngPosition;
  pcond18.value = 0;
  pcond19.value = "";
  pcond20.value = "";
  pcond21.value = "";
  pcond22.value = 0;
  pcond23.value = false;
  pcond24.value = "";
  pcond25.value = "";
  pcond26.value = "";
  pcond27.value = "--";
  pcond28.value = 0;
  pcond29.value = "--";
  pcond30.value = 1;
  pcond31.value = 0;
  pcond32.value = false;
  pcond33.value = 0;
  pcond34.value = "";
  pcond35.value = "";
  pcond36.value = "";
  pcond37.value = "";
  pcond38.value = [];
  resetConsentDateFields();
}

const InsertNew = ref(false);
const addButton = (e) => {
  /*
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  */
  InsertNew.value = true;
  resetPconds();
  popupEditDataRow.value = -1;

  ccustomorNum.value = "";
  ccustomorGroup.value = groupCd.value;
  ccustomorStatus.value = 1;
  visible.value = true;
  preparePopupJoinPath();
};

const InputPcond = (e) => {
  let ppcond = e.target.value;

  ppcond = ppcond.replace(/\D/g, "");

  if (ppcond.length > 16) {
    ppcond = ppcond.slice(0, 16);
  }

  pcond.value = ppcond;
};

const limitFourDigitsPcond7 = (e) => {
  let ppcond = e.target.value;

  ppcond = ppcond.replace(/\D/g, "");

  if (ppcond.length > 4) {
    ppcond = ppcond.slice(0, 4);
  }

  pcond7.value = ppcond;
};

const limitFourDigitsPcond8 = (e) => {
  let ppcond = e.target.value;

  ppcond = ppcond.replace(/\D/g, "");

  if (ppcond.length > 4) {
    ppcond = ppcond.slice(0, 4);
  }

  pcond8.value = ppcond;
};
/**
 * 페이지 매장 코드 세팅
 */
const show1 = ref(false);
const showAddress = () => {
  show1.value = true;
};
const show2 = ref(false);
const showAddress2 = () => {
  show2.value = true;
};
/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  point1.value = "";
  point2.value = "";
  point3.value = "";
  point4.value = "";
};

/**
 * 조회 조건·기간·매장 선택을 화면 최초 로드와 동일한 상태로 되돌림 (그리드 비움)
 */
const resetSearchArea = async () => {
  cond.value = "";
  cond2.value = "";
  cond3.value = 0;
  cond4.value = 0;
  cond5.value = 0;
  cond6.value = "";
  cond7.value = "";
  cond8.value = 1;
  cond9.value = "";
  cond10.value = 0;
  cond11.value = 1;
  cond12.value = "";
  cond13.value = 1;
  cond14.value = "";
  cond15.value = 1;
  cond16.value = "";
  cond17.value = 2;
  cond18.value = 1;
  cond19.value = "";
  cond20.value = 2;
  cond21.value = -1;
  pstore.value = 0;

  sDate.value = undefined;
  eDate.value = undefined;
  sDate2.value = undefined;
  eDate2.value = undefined;
  sDate3.value = undefined;
  eDate3.value = undefined;

  documentSubTitle.value = "";
  afterSearch.value = false;
  initGrid();

  crm01SearchAreaKey.value += 1;
  await nextTick();
  reload.value = !reload.value;
};

const checkCard = ref(false);
const checkCardNo = async () => {
  /*
  if (pcond.value.length != 16) {
    Swal.fire({
      title: "경고",
      text: "카드번호 16자리를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
*/

  if (policyInfo.value[0].lngCardLen == 99 || pcond.value.length == policyInfo.value[0].lngCardLen){
     try {
      const res = await validCardNo(groupCd.value, pcond.value);

      if (res.data.List[0].lngCustNo == "") {
        Swal.fire({
          title: "확인",
          text: "사용가능한 카드번호입니다.",
          icon: "success",
          confirmButtonText: "확인",
        });
        checkCard.value = true;
        return;
      } else {
        Swal.fire({
          title: "경고",
          text: "이미 사용중인 카드번호입니다.",
          icon: "warning",
          confirmButtonText: "확인",
        });
        checkCard.value = false;
        return;
      }
    } catch (error) {}
  }
  else{
     Swal.fire({
      title: "경고",
      text: "카드번호 자리수를 확인해 주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
 
};

const clickedRow = ref(false);
const deleteRow = ref(false);
const deleteCustomor = async () => {
  if (clickedRow.value == false) {
    return;
  }
  deleteRow.value = !deleteRow.value;
};
const clickedRowData = (e) => {
  clickedRow.value = true;
};
const forDeleteRows = ref([]);
const checkedRowIndex = (e) => {
  forDeleteRows.value = e;
};

// const allStateRows = (e) => {
//   forDeleteRows.value = e.deleted;
// };

const deleteButton = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "먼저 조회를 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (forDeleteRows.value.length == 0) {
    Swal.fire({
      title: "경고",
      text: "삭제할 대상을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const groups = rowData.value
      .filter((item, index) => forDeleteRows.value.includes(index))
      .map((item) => item.lngStoreGroup);
    const custno = rowData.value
      .filter((item, index) => forDeleteRows.value.includes(index))
      .map((item) => item.A01_lngCustNo);
    const cardid = rowData.value
      .filter((item, index) => forDeleteRows.value.includes(index))
      .map((item) => item.A05_strCCardID.replace("[", "").replace("]", ""));
    const joinsts = rowData.value
      .filter((item, index) => forDeleteRows.value.includes(index))
      .map((item) => item.intJoinSts);

    const res = await deleteCustomors(
      groups.join("\u200b"),
      custno.join("\u200b"),
      cardid.join("\u200b"),
      joinsts.join("\u200b"),
      store.state.userData.lngSequence
    );

    ////console.log(res);
    Swal.fire({
      title: "성공",
      text: "탈퇴가 완료되었습니다.",
      icon: "success",
      confirmButtonText: "확인",
    });
    return;
  } catch (error) {
    ////console.log(error);
  } finally {
    store.state.loading = false;
    searchButton();
  }
};
//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedExcelStore.value;

  //documentSubTitle.value += "\n";
  exportExcel.value = !exportExcel.value;
};

// 엑셀 추출
const documentSubTitle = ref("");
const selectedExcelList = ref("");

const selectedExcelStore = ref("");
/**
 * 엑셀용 매장 세팅 함수
 */

const excelStore = (e) => {
  selectedExcelStore.value = e;
  //comsole.log(e);
};
const excelList = (e) => {
  selectedExcelList.value = e;
  //comsole.log(e);
};
</script>

<style scoped>
/* 필수 항목 별표 — 라벨보다 약간 크게·진한 적색·굵게 */
.crm01-req-mark {
  display: inline-block;
  margin-right: 0.1875rem;
  color: #b91c1c;
  font-weight: 900;
  font-size: 1.0625rem;
  line-height: 1;
  vertical-align: 0.14em;
}

.crm01-modal-panel .crm01-wire-label .crm01-req-mark {
  font-size: 1.1875rem;
  vertical-align: 0.1em;
  color: #991b1b;
}

/* 주민번호: 그리드 슬롯은 유지하고 내용만 숨김 */
.crm01-modal-hide-ssn {
  visibility: hidden;
  pointer-events: none;
  user-select: none;
}

/* 와이어: 3열; 라벨 열 통일·가운데 (search-area-layout) */
.crm01-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--crm01-col-gutter);
  row-gap: var(--crm01-row-gap);
}

.crm01-wire-cell {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.crm01-wire-label {
  flex: 0 0 var(--crm01-label-col);
  width: var(--crm01-label-col);
  min-width: 0;
  max-width: var(--crm01-label-col);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(17 24 39);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.crm01-wire-field {
  display: flex;
  min-width: 0;
  max-width: 100%;
  flex: 1 1 auto;
  align-items: center;
}

.crm01-wire-field:not(.crm01-inline-ops):not(.crm01-birth-row):not(.crm01-stack-field):not(.crm01-date-slot):not(.crm01-modal-field-wrap):not(.crm01-modal-join-path-row)
  > * {
  min-width: 0;
  width: 100%;
}

.crm01-wire-field.crm01-date-slot > * {
  min-width: 0;
  width: 100%;
}

.crm01-pick-span {
  grid-column: span 2;
  min-width: 0;
  width: 100%;
  overflow-x: hidden;
}

.crm01-wire-cell-stacked {
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
}

.crm01-sub-pair {
  display: flex;
  min-width: 0;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.crm01-sub-label {
  flex: 0 0 var(--crm01-label-col);
  width: var(--crm01-label-col);
  min-width: 0;
  max-width: var(--crm01-label-col);
}

.crm01-stack-field {
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
}

.crm01-birth-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
}

.crm01-inline-ops {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem;
}

/* 부등호 콤보: 기본 w-10(2.5rem)의 2.5배 — 입력은 flex-1로 같은 줄 폭 유지 */
.crm01-op-select {
  box-sizing: border-box;
  width: 6.25rem;
  min-width: 6.25rem;
  max-width: 6.25rem;
  flex-shrink: 0;
}

.crm01-suffix {
  line-height: 1;
}

.crm01-hint {
  font-size: 0.75rem;
  line-height: 1.25;
  color: rgb(248 113 113);
}

.crm01-sg-select {
  box-sizing: border-box;
}

.crm01-search-panel select.crm01-sg-select {
  border: 1px solid var(--crm01-control-border) !important;
}

.crm01-search-panel select.crm01-sg-select:focus {
  border-color: #3b82f6 !important;
}

.crm01-search-panel .crm01-sg-input {
  border: 1px solid var(--crm01-control-border) !important;
  box-sizing: border-box;
}

.crm01-search-panel .crm01-sg-input:focus {
  border-color: #3b82f6 !important;
}

.crm01-search-panel .crm01-date-slot :deep(input[type="date"]:focus) {
  border-color: #3b82f6 !important;
}

.crm01-search-panel .crm01-date-slot :deep(> div.flex.justify-start.items-center) {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0;
  gap: 0.25rem !important;
  margin-left: 0;
  padding-left: 0;
}

.crm01-search-panel .crm01-date-slot :deep(> div.flex > div.inline-flex.h-8) {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  gap: 0.125rem !important;
}

.crm01-search-panel .crm01-date-slot :deep(input[type="date"]) {
  border: 1px solid var(--crm01-control-border) !important;
  box-sizing: border-box;
  width: auto !important;
  flex: 1 1 0;
  min-width: 5.25rem;
  max-width: none;
  padding-left: 0.45rem;
  padding-right: 0.25rem;
}

.crm01-search-panel .crm01-date-slot :deep(div.inline-flex.h-8 > span) {
  flex-shrink: 0;
}

.crm01-search-panel .crm01-date-slot :deep(div.inline-flex.h-8 > button) {
  flex-shrink: 0;
  width: 1.65rem !important;
  height: 1.65rem !important;
  min-width: 1.65rem;
  margin-left: 0 !important;
}

/* 고객정보 생성/수정 모달 — split panel · 필수/추가 영역 */
.crm01-modal-panel-split {
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
  background: transparent;
}

.crm01-modal-area-heading {
  margin: 0 0 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1.25;
  color: rgb(51 65 85);
}

.crm01-modal-area-required {
  padding: 0.4375rem 0.5625rem 0.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(180deg, #fff8f1 0%, #ffedd8 100%);
  border: 1px solid rgb(254 215 170);
}

.crm01-modal-area-optional {
  padding: 0.3125rem 0.5rem 0.375rem;
  border-radius: 0.5rem;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid rgb(226 232 240);
}

.crm01-modal-marketing-block {
  margin-bottom: 0.25rem;
  padding: 0.3125rem 0.4375rem;
  border-radius: 0.375rem;
  background: linear-gradient(180deg, #f7fee7 0%, #ecfccb 55%, #d9f99d 100%);
  border: 1px solid rgba(101, 163, 13, 0.35);
  box-shadow: 0 1px 2px rgba(101, 163, 13, 0.08);
}

/* 마케팅 행 — wire-grid와 동일 4열(라벨|값|라벨|값) */
.crm01-modal-marketing-row {
  display: grid;
  width: 100%;
  min-width: 0;
  grid-template-columns: var(--crm01-label-col) minmax(0, 1fr) var(--crm01-label-col) minmax(0, 1fr);
  column-gap: var(--crm01-col-gutter);
  align-items: center;
}

.crm01-modal-marketing-left {
  display: flex;
  grid-column: 1 / 3;
  align-items: center;
  min-width: 0;
  gap: 0.5rem;
}

.crm01-modal-marketing-sms-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin-left: 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid rgb(101 163 13 / 0.45);
  background-color: #fff;
  padding: 0.3125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgb(77 124 15);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease, opacity 0.15s ease;
  white-space: nowrap;
}

.crm01-modal-marketing-sms-btn:hover:not(:disabled) {
  background-color: rgb(247 254 231);
}

.crm01-modal-marketing-sms-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  color: rgb(100 116 139);
  border-color: rgb(203 213 225);
}

.crm01-modal-marketing-sms-btn-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.crm01-mkt-sms-date-label {
  width: auto;
  min-width: 8.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  text-align: center;
  color: rgb(55 65 81);
}

.crm01-mkt-sms-template {
  white-space: pre-wrap;
  word-break: break-word;
  overflow: visible;
}

.crm01-mkt-sms-template-notice {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgb(185 28 28);
}

.crm01-mkt-sms-template:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 0.2);
}

.crm01-modal-marketing-title {
  width: 100%;
  max-width: var(--crm01-label-col);
  font-size: 0.8125rem;
  line-height: 1.2;
  text-align: center;
}

/* 텍스트 + 체크박스만 클릭 (오른쪽 빈 영역 제외) */
.crm01-modal-marketing-check {
  display: inline-grid;
  grid-template-columns: var(--crm01-label-col) auto;
  column-gap: 0.5rem;
  align-items: center;
  width: max-content;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  cursor: pointer;
}

.crm01-modal-marketing-date-cell {
  display: grid;
  grid-column: 3 / 5;
  grid-template-columns: auto minmax(9.25rem, 1fr);
  column-gap: 0.75rem;
  align-items: center;
  min-width: 0;
}

.crm01-modal-marketing-date-cell .crm01-modal-consent-date-label {
  padding-right: 0.375rem;
  white-space: nowrap;
}

/* 4열 마스터: [라벨1][값1][라벨2][값2] — 한 줄 두 항목 동일 폭 */
/* 4열 마스터 + 1줄 행 공통 높이(h-8 + 패딩) */
.crm01-modal-wire-grid {
  --crm01-modal-row-min-h: calc(2rem + 0.5rem);
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: stretch;
  grid-template-columns: var(--crm01-label-col) minmax(0, 1fr) var(--crm01-label-col) minmax(0, 1fr);
  column-gap: var(--crm01-col-gutter);
  row-gap: 0;
}

.crm01-modal-wire-grid > .crm01-wire-cell:not(.crm01-modal-span-full):not(.crm01-modal-cell-row-fill) {
  display: contents;
}

.crm01-modal-wire-grid > .crm01-wire-cell > .crm01-wire-label,
.crm01-modal-wire-grid > .crm01-wire-cell > .crm01-wire-field {
  display: flex;
  min-width: 0;
  min-height: var(--crm01-modal-row-min-h);
  align-items: center;
  box-sizing: border-box;
  padding: var(--crm01-modal-row-pad);
  border-bottom: 1px solid var(--crm01-modal-row-border);
}

.crm01-modal-wire-grid > .crm01-wire-cell.crm01-modal-row-tall > .crm01-wire-field {
  min-height: auto;
  align-items: flex-start;
}

/* 집주소: 구분선은 우편물 수령지 블록 하단만, 라벨 세로 가운데 */
.crm01-modal-wire-grid > .crm01-wire-cell.crm01-modal-span-full.crm01-modal-row-tall > .crm01-wire-label {
  min-height: auto;
  align-self: stretch;
  align-items: center;
}

.crm01-modal-wire-grid
  > .crm01-wire-cell.crm01-modal-span-full.crm01-modal-row-tall
  > .crm01-wire-field.crm01-modal-home-value {
  align-items: stretch;
  align-self: stretch;
  padding: 0;
  border-bottom: none;
  gap: 0.375rem;
}

/* 우편번호·우편물: 사무실주소 wire-field와 동일 패딩(inset), 구분선은 우편물 하단만 */
.crm01-modal-home-zip-row {
  box-sizing: border-box;
  width: 100%;
  min-height: var(--crm01-modal-row-min-h);
  padding: var(--crm01-modal-row-pad);
  padding-bottom: 0;
}

.crm01-modal-home-mail-block {
  box-sizing: border-box;
  width: 100%;
  padding: var(--crm01-modal-row-pad);
  padding-top: 0;
  border-bottom: 1px solid var(--crm01-modal-row-border);
}

.crm01-modal-wire-grid > .crm01-wire-cell > .crm01-wire-label {
  justify-content: center;
}

.crm01-modal-wire-grid > .crm01-wire-cell > .crm01-wire-field {
  width: 100%;
  max-width: 100%;
  justify-content: flex-start;
}

.crm01-modal-wire-grid > .crm01-wire-cell > .crm01-wire-field.crm01-modal-field-wrap {
  width: 100%;
}

.crm01-modal-wire-grid
  > .crm01-wire-cell
  > .crm01-wire-field:not(.crm01-modal-field-wrap):not(.flex-col)
  > .crm01-sg-input,
.crm01-modal-wire-grid
  > .crm01-wire-cell
  > .crm01-wire-field:not(.crm01-modal-field-wrap):not(.flex-col)
  > .crm01-sg-select {
  width: 100%;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

/* 전폭 행: 라벨=1열, 값=2~4열(사무실주소·가입경로·결혼여부와 동일 폭) */
.crm01-modal-wire-grid > .crm01-wire-cell.crm01-modal-span-full {
  display: contents;
}

.crm01-modal-wire-grid > .crm01-wire-cell.crm01-modal-span-full > .crm01-wire-label {
  grid-column: 1;
}

.crm01-modal-wire-grid > .crm01-wire-cell.crm01-modal-span-full > .crm01-wire-field {
  grid-column: 2 / 5;
  align-self: stretch;
}

.crm01-modal-panel .crm01-modal-wire-grid > .crm01-wire-cell > .crm01-wire-label {
  flex: none;
  width: 100%;
  max-width: none;
  min-width: 0;
  box-sizing: border-box;
}

.crm01-modal-wire-grid
  > .crm01-wire-cell.crm01-modal-span-full
  > .crm01-wire-field.crm01-modal-field-wrap {
  min-height: var(--crm01-modal-row-min-h);
}

.crm01-modal-wire-grid > .crm01-wire-cell.crm01-modal-cell-row-fill {
  display: block;
  grid-column: 3 / 5;
  min-width: 0;
  min-height: var(--crm01-modal-row-min-h);
  padding: var(--crm01-modal-row-pad);
  border-bottom: 1px solid var(--crm01-modal-row-border);
  pointer-events: none;
}

.crm01-modal-consent-text {
  color: #dc2626;
  font-weight: 700;
}

.crm01-modal-consent-date-inline {
  display: inline-flex;
  flex-shrink: 0;
  flex-wrap: nowrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-left: 0.375rem;
  padding-left: 0.125rem;
}

.crm01-modal-consent-date-label {
  flex: 0 0 auto;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  color: rgb(55 65 81);
  white-space: nowrap;
  padding-right: 0.375rem;
}

.crm01-modal-panel .crm01-modal-consent-date {
  margin-left: 0.125rem;
}

.crm01-modal-mobile-row,
.crm01-modal-tel-row {
  flex-wrap: nowrap;
}

/* 이메일 수신동의: 오른쪽 반쪽(3~4열)만 사용 → 입력창 바로 옆 */
.crm01-modal-email-agree-cell {
  display: contents;
}

.crm01-modal-email-agree-field {
  grid-column: 3 / 5;
  justify-content: flex-start;
  padding-left: 0.25rem;
}

.crm01-modal-tel-input {
  width: 40% !important;
  max-width: 12rem;
}

/* 가입경로: 항목 수만큼 균등 분할 — grid-template-columns는 :style 바인딩 */
.crm01-modal-wire-grid > .crm01-wire-cell.crm01-modal-join-path-cell > .crm01-wire-field.crm01-modal-join-path-row {
  display: grid;
  width: 100%;
  min-height: 2rem;
  column-gap: 0.5rem;
  align-items: center;
  justify-items: start;
}

.crm01-modal-join-path-choice {
  display: inline-flex;
  justify-content: flex-start;
  width: auto;
  max-width: 100%;
  min-width: 0;
  white-space: nowrap;
  font-size: 0.75rem;
  cursor: pointer;
}

.crm01-modal-field-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.625rem;
  align-items: center;
}

.crm01-modal-panel .crm01-modal-field-wrap {
  gap: 0.35rem 0.45rem;
}

.crm01-modal-choice {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  color: rgb(55 65 81);
}

.crm01-modal-choice input[type="radio"],
.crm01-modal-choice input[type="checkbox"] {
  flex-shrink: 0;
}

.crm01-modal-secondary-btn {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 1px solid rgb(203 213 225);
  background-color: #fff;
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(55 65 81);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease;
}

.crm01-modal-secondary-btn:hover {
  background-color: rgb(248 250 252);
}

.crm01-modal-panel select.crm01-sg-select {
  border: 1px solid var(--crm01-control-border) !important;
}

.crm01-modal-panel select.crm01-sg-select:focus {
  border-color: #3b82f6 !important;
}

.crm01-modal-panel .crm01-sg-input {
  border: 1px solid var(--crm01-control-border) !important;
  box-sizing: border-box;
}

.crm01-modal-panel .crm01-sg-input:focus {
  border-color: #3b82f6 !important;
}

.crm01-modal-panel .crm01-modal-date[type="date"] {
  border: 1px solid var(--crm01-control-border) !important;
  box-sizing: border-box;
}

.crm01-modal-panel .crm01-modal-date[type="date"]:focus {
  border-color: #3b82f6 !important;
}

/* 노트북(세로 900px 이하): 조회패널·행간 살짝 압축 → 그리드 영역 확보 */
@media (max-height: 900px) {
  .crm01-search-panel {
    padding-top: 0.5rem !important;
    padding-bottom: 0.5rem !important;
    margin-top: 0.25rem !important;
  }

  .crm01-search-panel .crm01-wire-grid {
    row-gap: 0.4375rem;
  }
}

/* 팝업: 라벨 살짝 작게 해 한 화면에 가깝게 (콤보 h-8 유지) */
.crm01-modal-panel .crm01-wire-label {
  font-size: 0.8125rem;
  line-height: 1.2;
}

.crm01-modal-panel .crm01-modal-choice {
  font-size: 0.78125rem;
  font-weight: 600;
}

.crm01-modal-panel .crm01-modal-choice.crm01-modal-consent-choice,
.crm01-modal-panel .crm01-modal-consent-text {
  color: #dc2626;
  font-weight: 700;
}

.crm01-modal-scroll {
  scrollbar-width: none;
}

.crm01-modal-scroll::-webkit-scrollbar {
  display: none;
}

</style>
