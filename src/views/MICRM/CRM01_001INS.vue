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

  <!-- 고객정보 신규·수정 팝업: 조회 패널과 동일 wire 패턴 -->
  <div
    v-if="visible"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-2 sm:p-3">
    <div
      class="crm01-modal-sheet flex max-h-[min(calc(100dvh-10px),900px)] w-full max-w-[min(100%,960px)] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-900/10 sm:max-w-4xl sm:rounded-2xl xl:max-w-5xl">
      <div
        class="shrink-0 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100/80 px-4 py-2.5 sm:px-5 sm:py-3">
        <h2 class="text-lg font-bold leading-tight tracking-tight text-slate-900 sm:text-xl">
          {{ InsertNew ? "고객정보 신규 등록" : "고객정보 수정" }}
        </h2>
        <p class="mt-0.5 text-xs font-medium leading-tight text-slate-700 sm:text-sm">
          <span class="crm01-req-mark" aria-hidden="true">*</span> 표시는 필수 항목입니다.
        </p>
      </div>
      <div class="crm01-modal-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 py-2 sm:px-4 sm:py-3">
        <div
          class="crm01-modal-panel rounded-xl bg-gray-200 px-3 py-3 sm:px-4 sm:py-4"
          :style="{
            '--crm01-control-border': crm01ControlBorder,
            '--crm01-col-gutter': crm01ModalColGutter,
            '--crm01-row-gap': crm01ModalRowGap,
            '--crm01-label-col': crm01ModalLabelCol,
          }">
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

            <!-- 3행 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>휴대폰번호
              </div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap">
                <select
                  id="crm01-pop-mobile-pre"
                  v-model="pcond6"
                  class="crm01-sg-select h-8 min-h-8 w-[4.75rem] shrink-0 rounded-md border border-solid bg-white px-1 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="010">010</option>
                </select>
                <input
                  id="crm01-pop-mobile-mid"
                  v-model="pcond7"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-[5.25rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="limitFourDigitsPcond7"
                />
                <input
                  id="crm01-pop-mobile-last"
                  v-model="pcond8"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-[5.25rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @input="limitFourDigitsPcond8"
                />
                <label class="crm01-modal-choice shrink-0" for="crm01-pop-sms-agree">
                  <input id="crm01-pop-sms-agree" type="checkbox" v-model="pcond9" />
                  SMS 수신 동의
                </label>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">
                <span class="crm01-req-mark" aria-hidden="true">*</span>등급
              </div>
              <div class="crm01-wire-field min-w-0">
                <select
                  id="crm01-pop-level"
                  v-model="pcond10"
                  class="crm01-sg-select h-8 min-h-8 w-full min-w-0 max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="0">선택</option>
                  <option :value="i.intLevel" v-for="i in optionList" :key="i.intLevel">
                    {{ i.strLevelName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 4행 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">전화번호</div>
              <div class="crm01-wire-field min-w-0 crm01-stack-field">
                <input
                  id="crm01-pop-tel"
                  v-model="pcond11"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-full max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="crm01-hint">※ 02-111-2222</span>
              </div>
            </div>
            <div
              class="crm01-wire-cell crm01-modal-hide-ssn"
              aria-hidden="true">
              <div class="crm01-wire-label">주민번호</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap">
                <input
                  id="crm01-pop-ssn-front"
                  v-model="pcond12"
                  type="text"
                  maxlength="6"
                  class="crm01-sg-input h-8 min-h-8 w-[7rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="select-none font-semibold text-slate-500">—</span>
                <input
                  id="crm01-pop-ssn-back"
                  v-model="pcond13"
                  type="text"
                  maxlength="7"
                  class="crm01-sg-input h-8 min-h-8 w-[7.5rem] shrink-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- 5행 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">E-mail</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap flex-wrap items-center">
                <input
                  id="crm01-pop-email"
                  v-model="pcond14"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 min-w-0 flex-1 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:min-w-[12rem]"
                />
                <label class="crm01-modal-choice shrink-0 whitespace-nowrap" for="crm01-pop-email-agree">
                  <input id="crm01-pop-email-agree" type="checkbox" v-model="pcond15" />
                  이메일 수신 동의
                </label>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">가입일</div>
              <div class="crm01-wire-field min-w-0">
                <input
                  id="crm01-pop-join-date"
                  v-model="pcond16"
                  type="text"
                  disabled
                  class="crm01-sg-input h-8 min-h-8 w-full max-w-xs cursor-not-allowed rounded-md border border-solid bg-slate-100 px-2 text-sm text-slate-600"
                />
              </div>
            </div>

            <!-- 가입매장 | 콤보 | 선호매장 | 콤보 (한 줄·다른 항목과 동일 라벨 스타일) -->
            <div class="crm01-wire-cell crm01-modal-span-full crm01-modal-store-inline">
              <div class="crm01-wire-label shrink-0">가입매장</div>
              <div class="crm01-wire-field min-w-0 flex-1 basis-0">
                <select
                  id="crm01-pop-store-join"
                  v-model="pcond17"
                  class="crm01-sg-select h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option v-for="i in optionList2" :key="i.lngStoreCode" :value="i.lngStoreCode">
                    {{ i.strName }}
                  </option>
                </select>
              </div>
              <div class="crm01-wire-label shrink-0">선호매장</div>
              <div class="crm01-wire-field min-w-0 flex-1 basis-0">
                <select
                  id="crm01-pop-store-pref"
                  v-model="pcond18"
                  class="crm01-sg-select h-8 min-h-8 w-full min-w-0 rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="0">미선택</option>
                  <option v-for="i in optionList2" :key="'p-' + i.lngStoreCode" :value="i.lngStoreCode">
                    {{ i.strName }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 집주소 -->
            <div class="crm01-wire-cell crm01-modal-span-full">
              <div class="crm01-wire-label">집주소</div>
              <div class="crm01-wire-field min-w-0 flex-col items-stretch gap-2">
                <div class="crm01-modal-field-wrap w-full flex-wrap items-center">
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
                <div class="crm01-modal-field-wrap gap-4">
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

            <!-- 생년월일 / 기념일 -->
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
                  <input
                    id="crm01-pop-lunar"
                    type="radio"
                    name="pcond28"
                    value="0"
                    v-model="pcond28" />
                  음력
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-solar">
                  <input
                    id="crm01-pop-solar"
                    type="radio"
                    name="pcond28"
                    value="1"
                    v-model="pcond28" />
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
                  <input
                    id="crm01-pop-anni-birth"
                    type="radio"
                    name="pcond30"
                    value="1"
                    v-model="pcond30" />
                  생일
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-anni-wed">
                  <input
                    id="crm01-pop-anni-wed"
                    type="radio"
                    name="pcond30"
                    value="2"
                    v-model="pcond30" />
                  결혼기념일
                </label>
              </div>
            </div>

            <!-- 결혼여부 / 정보활용 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">결혼여부</div>
              <div class="crm01-wire-field min-w-0 crm01-modal-field-wrap gap-4">
                <label class="crm01-modal-choice" for="crm01-pop-marry-no">
                  <input
                    id="crm01-pop-marry-no"
                    type="radio"
                    name="pcond31"
                    value="0"
                    v-model="pcond31" />
                  미혼
                </label>
                <label class="crm01-modal-choice" for="crm01-pop-marry-yes">
                  <input
                    id="crm01-pop-marry-yes"
                    type="radio"
                    name="pcond31"
                    value="1"
                    v-model="pcond31" />
                  기혼
                </label>
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">정보활용동의</div>
              <div class="crm01-wire-field min-w-0">
                <label class="crm01-modal-choice" for="crm01-pop-use-agree">
                  <input id="crm01-pop-use-agree" type="checkbox" v-model="pcond32" />
                  활용 동의함
                </label>
              </div>
            </div>

            <!-- 직종 / 직장 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">직종</div>
              <div class="crm01-wire-field min-w-0">
                <select
                  id="crm01-pop-job"
                  v-model="pcond33"
                  class="crm01-sg-select h-8 min-h-8 w-full min-w-0 max-w-xs rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
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

            <!-- 부서 / 직급 -->
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">부서명</div>
              <div class="crm01-wire-field min-w-0">
                <input
                  id="crm01-pop-dept"
                  v-model="pcond35"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="crm01-wire-cell">
              <div class="crm01-wire-label">직급</div>
              <div class="crm01-wire-field min-w-0">
                <input
                  id="crm01-pop-rank"
                  v-model="pcond36"
                  type="text"
                  class="crm01-sg-input h-8 min-h-8 w-full rounded-md border border-solid bg-white px-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- 비고 전폭 -->
            <div class="crm01-wire-cell crm01-modal-span-full">
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
        </div>
      </div>
      <div class="shrink-0 flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
        <button
          type="button"
          class="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          @click="
            visible = false;
            InsertNew = false;
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
  insertCustomerInfo,
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

import { nextTick, onMounted, ref } from "vue";
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
        null,
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
        null,
        null,
        pcond18.value,
        pcond.value
      );
    }
    ////console.log(res);
    store.state.loading = false;
  } catch (error) {
    ////console.log(error);
    store.state.loading = false;
  } finally {
    store.state.loading = false;
    visible.value = false;
    searchButton();
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
const dblclickedRowData = (e) => {
  InsertNew.value = false;
  ////console.log(e);
  ccustomorNum.value = e[0];
  ccustomorGroup.value = e[59];
  ccustomorStatus.value = e[60];
  visible.value = true;
  pcond.value = e[4].replace("[", "").replace("]", "");
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

  ccustomorNum.value = "";
  ccustomorGroup.value = groupCd.value;
  ccustomorStatus.value = 1;
  visible.value = true;
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

.crm01-wire-field:not(.crm01-inline-ops):not(.crm01-birth-row):not(.crm01-stack-field):not(.crm01-date-slot):not(.crm01-modal-field-wrap)
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

/* 고객정보 생성/수정 모달 — 조회 패널과 동일 라벨·테두리 톤 */
.crm01-modal-wire-grid {
  display: grid;
  width: 100%;
  min-width: 0;
  align-items: start;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--crm01-col-gutter);
  row-gap: var(--crm01-row-gap);
}

.crm01-modal-wire-grid .crm01-wire-cell {
  align-items: stretch;
  gap: 0.375rem;
}

.crm01-modal-wire-grid .crm01-modal-span-full {
  grid-column: 1 / -1;
}

.crm01-modal-store-inline.crm01-wire-cell {
  flex-wrap: nowrap;
}

.crm01-modal-store-inline.crm01-wire-cell > .crm01-wire-field {
  flex: 1 1 0%;
  min-width: 0;
}

@media (max-width: 639px) {
  .crm01-modal-store-inline.crm01-wire-cell {
    flex-wrap: wrap;
  }

  .crm01-modal-store-inline.crm01-wire-cell > .crm01-wire-label {
    flex: 0 0 var(--crm01-label-col);
  }

  .crm01-modal-store-inline.crm01-wire-cell > .crm01-wire-field {
    flex: 1 1 calc(100% - var(--crm01-label-col) - 0.5rem);
  }
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

.crm01-modal-scroll {
  scrollbar-gutter: stable;
}

@media (prefers-reduced-motion: no-preference) {
  .crm01-modal-scroll {
    scrollbar-width: thin;
  }
}

</style>
