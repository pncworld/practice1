<!-- /*--############################################################################
# Filename : MST04_001INS.vue                                                  
# Description : 마스터관리 > 자재 마스터 > 자재 마스터 등록          
# Date :2025-08-19                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <div
    class="flex h-full max-w-full min-h-0 flex-col gap-3 overflow-hidden pb-1 box-border">
    <!-- 상단: 페이지명 + 액션 -->
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-3">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
        <button type="button" @click="addButton" class="button new md:w-auto w-auto">
          신규
        </button>
        <button type="button" @click="deleteButton" class="button delete md:w-auto w-auto">
          삭제
        </button>
      </div>
    </div>

    <!-- 조회 조건: 라벨 너비 통일 · 넓은 화면에서 3열×3행 -->
    <div class="shrink-0 rounded-lg bg-gray-200 px-4 py-3">
      <div class="grid grid-cols-1 gap-x-6 gap-y-3 lg:grid-cols-12 lg:items-center">
        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >자재코드</span
          >
          <input
            type="text"
            class="h-8 min-w-0 flex-1 border border-black px-2 text-sm"
            v-model="cond" />
        </div>
        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >자재명</span
          >
          <input
            type="text"
            class="h-8 min-w-0 flex-1 border border-black px-2 text-sm"
            v-model="cond2" />
        </div>
        <div class="hidden lg:block lg:col-span-4" aria-hidden="true"></div>

        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >자재그룹</span
          >
          <select
            class="h-8 min-w-0 flex-1 max-w-full border border-black bg-white px-2 text-sm"
            v-model="cond3">
            <option value="0">선택</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >자재분류</span
          >
          <select
            class="h-8 min-w-0 flex-1 max-w-full border border-black bg-white px-2 text-sm"
            v-model="cond4">
            <option value="0">선택</option>
            <option :value="i.lngCategoryID" v-for="i in optionList2">
              {{ i.strCategoryName }}
            </option>
          </select>
        </div>
        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >자재특성</span
          >
          <select
            class="h-8 min-w-0 flex-1 max-w-full border border-black bg-white px-2 text-sm"
            v-model="cond5">
            <option value="0">선택</option>
            <option :value="i.lngGenericID" v-for="i in optionList3">
              {{ i.strGenericName }}
            </option>
          </select>
        </div>

        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >거래처</span
          >
          <select
            class="h-8 min-w-0 flex-1 max-w-full border border-black bg-white px-2 text-sm"
            v-model="cond6">
            <option value="0">선택</option>
            <option :value="i.lngSupplierID" v-for="i in optionList4">
              {{ i.strSupplierName }}
            </option>
          </select>
        </div>
        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >구분(주/부)</span
          >
          <select
            class="h-8 min-w-0 flex-1 max-w-full border border-black bg-white px-2 text-sm"
            v-model="cond7">
            <option value="0">선택</option>
            <option :value="i.strDCode" v-for="i in optionList5">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div class="flex min-w-0 items-center gap-2 lg:col-span-4">
          <span class="w-[8rem] shrink-0 text-center text-base font-semibold text-gray-900"
            >과세면세구분</span
          >
          <select
            class="h-8 min-w-0 flex-1 max-w-full border border-black bg-white px-2 text-sm"
            v-model="cond8">
            <option :value="''">선택</option>
            <option :value="i.strDCode" v-for="i in optionList6">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 그리드: 남은 높이 사용 + 가로 스크롤은 영역 안에서만 -->
    <div class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <div
        class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-sm">
        <div
          class="h-[calc(100vh-15rem)] min-h-[18rem] w-full min-w-0 overflow-auto">
          <Realgrid
            :progname="'MST04_001INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :reload="reload"
            :setStateBar="false"
            :setGroupCustomLevel="2"
            :mergeColumns2="true"
            @clickedRowData="clickedRowData6"
            @dblclickedRowData="dblclickedRowData"
            :mergeColumnGroupName2="[['단위'], ['단가']]"
            :mergeColumnGroupSubList2="[
              [
                'strOrderNCheck',
                'strDemandUOM',
                'strReturnNMoveUOM',
                'strRealNreportUOM',
                'strUseNLossUOM',
              ],
              ['curUnitPrice', 'curSalesUnitPrice'],
            ]"
            :documentTitle="'MST04_001INS'"
            :documentSubTitle="documentSubTitle"
            :exporttoExcel="exportExcel"
            :rowStateeditable="false">
          </Realgrid>
        </div>
      </div>
    </div>
  </div>

  <!-- body로 올려 .po-header(z-9)보다 위에 그리지 않으면 상단 GNB가 클릭을 가로챔 -->
  <Teleport to="body">
    <div
      v-if="addRow"
      class="fixed inset-0 z-[11000] flex justify-center overflow-y-auto bg-black/40 px-3 py-2">
    <div
      role="dialog"
      aria-modal="true"
      class="border-2 border-gray-700 bg-white shadow-2xl flex h-fit max-h-[calc(100vh-4.5rem)] w-full max-w-5xl flex-col rounded-lg">
      <div
        class="flex shrink-0 flex-wrap items-center justify-end gap-3 border-b border-gray-400 bg-gray-50 px-3 py-1.5 rounded-t-lg">
        <button type="button" :class="popupToolbarBtnClass" @click="cleanButton">
          신규
        </button>
        <button type="button" :class="popupToolbarBtnClass" @click="saveButton">
          저장
        </button>
        <button type="button" :class="popupToolbarBtnClass" @click="closePopUp2">
          닫기
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-2 py-1.5 space-y-1">
        <!-- 공통: 라벨 열 2 / 값 열 4 × 2 = 12 -->
        <div class="rounded-md border border-gray-500 overflow-hidden">
          <div
            class="grid grid-cols-12 border-b border-gray-500 bg-white last:border-b-0">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              자재코드
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-4">
              <input
                type="text"
                class="h-7 w-full rounded-sm border border-gray-700 px-2 text-sm"
                name="scond"
                @input="onlyNumber"
                v-model="scond" />
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              자재명
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-4">
              <input
                type="text"
                class="h-7 w-full rounded-sm border border-gray-700 px-2 text-sm"
                v-model="scond2" />
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              자재그룹
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center gap-1.5 border-r border-gray-400 px-2 py-1 sm:col-span-4">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond3">
                <option value="0">선택</option>
                <option :value="i.lngStockGroupID" v-for="i in optionList">
                  {{ i.strStockGroupName }}
                </option>
              </select>
              <button type="button" class="whitebutton !h-7 shrink-0 px-2" @click="showAddPopUp(1)">
                +
              </button>
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              자재분류
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center gap-2 px-2 py-1 sm:col-span-4">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond4">
                <option value="0">선택</option>
                <option :value="i.lngCategoryID" v-for="i in optionList2">
                  {{ i.strCategoryName }}
                </option>
              </select>
              <button type="button" class="whitebutton !h-7 shrink-0 px-2" @click="showAddPopUp(2)">
                +
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              자재특성
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center gap-1.5 border-r border-gray-400 px-2 py-1 sm:col-span-4">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond5">
                <option value="0">선택</option>
                <option :value="i.lngGenericID" v-for="i in optionList3">
                  {{ i.strGenericName }}
                </option>
              </select>
              <button type="button" class="whitebutton !h-7 shrink-0 px-2" @click="showAddPopUp(3)">
                +
              </button>
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              실사주기
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-4">
              <select
                class="h-7 w-full rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond6">
                <option value="0">선택</option>
                <option :value="i.strDCode" v-for="i in optionList7">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-12 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              과세면세구분
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-4">
              <select
                class="h-7 w-full rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond7">
                <option value="0">선택</option>
                <option :value="i.strDCode" v-for="i in optionList6">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              의제매입
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-4">
              <select
                class="h-7 w-full rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond8">
                <option value="0">선택</option>
                <option :value="i.strDCode" v-for="i in optionList8">
                  {{ i.strDName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div
          class="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm leading-snug text-red-600">
          ex : 1ea 에 100g 자재를 1box 매입하여 1ea 단위로 출고. 1box에 12ea가 들어있음.
          <br />
          발주매입:1box , 청구:12ea , 반품/이동:12ea , 실사/재고:1200g , 사용/손실 : 1200g
        </div>

        <div class="rounded-md border border-gray-500 overflow-hidden">
          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              규격
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center gap-1.5 px-2 py-1 sm:col-span-10">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond9">
                <option value="0">선택</option>
                <option :value="i.lngStandardID" v-for="i in optionList9">
                  {{ i.strStandardName }}
                </option>
              </select>
              <button type="button" class="whitebutton !h-7 shrink-0 px-2" @click="showAddPopUp(4)">
                +
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              발주매입단위
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center gap-1.5 px-2 py-1 sm:col-span-10">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm disabled:bg-gray-200"
                :disabled="saveNew == false"
                v-model="scond10">
                <option value="0">선택</option>
                <option :value="i.lngUnitID" v-for="i in optionList10">
                  {{ i.strUnitName }}
                </option>
              </select>
              <input
                type="text"
                @input="onlyNumber"
                :disabled="saveNew == false"
                name="scond11"
                class="h-7 w-24 shrink-0 rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond11" />
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              청구단위
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center gap-1.5 px-2 py-1 sm:col-span-10">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm disabled:bg-gray-200"
                :disabled="saveNew == false"
                v-model="scond12">
                <option value="0">선택</option>
                <option :value="i.lngUnitID" v-for="i in optionList10">
                  {{ i.strUnitName }}
                </option>
              </select>
              <input
                type="text"
                :disabled="saveNew == false"
                @input="onlyNumber"
                name="scond13"
                class="h-7 w-24 shrink-0 rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond13" />
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              반품/이동단위
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center gap-1.5 px-2 py-1 sm:col-span-10">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm disabled:bg-gray-200"
                :disabled="saveNew == false"
                v-model="scond14">
                <option value="0">선택</option>
                <option :value="i.lngUnitID" v-for="i in optionList10">
                  {{ i.strUnitName }}
                </option>
              </select>
              <input
                type="text"
                @input="onlyNumber"
                :disabled="saveNew == false"
                name="scond15"
                class="h-7 w-24 shrink-0 rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond15" />
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              실사/재고단위
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center gap-1.5 px-2 py-1 sm:col-span-10">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm disabled:bg-gray-200"
                :disabled="saveNew == false"
                @change="scond18 = scond16"
                v-model="scond16">
                <option value="0">선택</option>
                <option :value="i.lngUnitID" v-for="i in optionList10">
                  {{ i.strUnitName }}
                </option>
              </select>
              <input
                type="text"
                :disabled="saveNew == false"
                @input="handleInput"
                class="h-7 w-24 shrink-0 rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond17" />
            </div>
          </div>

          <div class="grid grid-cols-12 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              사용/손실단위
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center gap-1.5 px-2 py-1 sm:col-span-10">
              <select
                class="h-7 min-w-0 flex-1 rounded-sm border border-gray-700 bg-white px-2 text-sm disabled:bg-gray-200"
                disabled
                v-model="scond18">
                <option value="0">선택</option>
                <option :value="i.lngUnitID" v-for="i in optionList10">
                  {{ i.strUnitName }}
                </option>
              </select>
              <input
                type="text"
                disabled
                class="h-7 w-24 shrink-0 rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond19" />
            </div>
          </div>
        </div>

        <div
          class="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm leading-snug text-amber-900">
          ※매입단가 : 발주/매입 단위 금액, 판매단가 : 반품/이동 단위 금액.
        </div>

        <div class="rounded-md border border-gray-500 overflow-hidden">
          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              주거래처
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-10">
              <select
                class="h-7 w-full max-w-xl rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond20">
                <option value="0">선택</option>
                <option :value="i.lngSupplierID" v-for="i in optionList4">
                  {{ i.strSupplierName }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              부가세 구분
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-10">
              <label for="ssscond2" class="flex cursor-pointer items-center gap-2 text-base">
                <input type="checkbox" id="ssscond2" v-model="scond21" />
                포함
              </label>
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              매입단가
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-4">
              <input
                type="text"
                :disabled="disabled2"
                @input="onlyNumber"
                name="scond22"
                class="h-7 w-full max-w-xs rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond22" />
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              판매단가
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-4">
              <input
                type="text"
                :disabled="disabled2"
                @input="onlyNumber"
                name="scond23"
                class="h-7 w-full max-w-xs rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond23" />
            </div>
          </div>

          <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              매입단가(VAT포함)
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-4">
              <input
                type="text"
                :disabled="!disabled2"
                @input="onlyNumber"
                name="scond24"
                class="h-7 w-full max-w-xs rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond24" />
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              판매단가(VAT포함)
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-4">
              <input
                type="text"
                @input="onlyNumber"
                name="scond25"
                :disabled="!disabled2"
                class="h-7 w-full max-w-xs rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond25" />
            </div>
          </div>

          <div class="grid grid-cols-12 bg-white">
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              바코드
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-4">
              <input
                type="text"
                class="h-7 w-full max-w-xs rounded-sm border border-gray-700 px-2 text-sm disabled:bg-gray-200"
                v-model="scond26" />
            </div>
            <div
              class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
              사용여부
            </div>
            <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-4">
              <select
                class="h-7 w-full max-w-xs rounded-sm border border-gray-700 bg-white px-2 text-sm"
                v-model="scond27">
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="addRow2"
      class="fixed inset-0 z-[12000] flex justify-center overflow-y-auto bg-black/40 px-3 py-2">
      <div
        role="dialog"
        aria-modal="true"
        class="border-2 border-gray-700 bg-white shadow-2xl my-auto flex h-fit max-h-[calc(100vh-4.5rem)] w-full max-w-4xl flex-col rounded-lg">
        <div
          class="flex shrink-0 flex-wrap items-center justify-end gap-3 border-b border-gray-400 bg-gray-50 px-3 py-1.5 rounded-t-lg">
          <button type="button" :class="popupToolbarBtnClass" @click="cleanButton2">
            신규
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="saveButton2">
            저장
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="deleteButton2">
            삭제
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="closePopUp">
            닫기
          </button>
        </div>
        <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-2 py-2">
          <div class="shrink-0 rounded-md border border-gray-500 overflow-hidden">
            <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재그룹코드
              </div>
              <div
                class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-10">
                <input
                  type="number"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond" />
              </div>
            </div>
            <div class="grid grid-cols-12 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재그룹명
              </div>
              <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-10">
                <input
                  type="text"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond2" />
              </div>
            </div>
          </div>

          <div
            class="flex h-[50vh] min-h-[260px] w-full min-w-0 flex-col overflow-hidden rounded-md border border-gray-500 bg-white">
            <div class="box-border h-full min-h-0 w-full flex-1 overflow-hidden p-1">
              <Realgrid
                :progname="'MST04_001INS_VUE'"
                :progid="2"
                :setStateBar="false"
                :rowStateeditable="false"
                @clickedRowData="clickedRowData"
                :rowData="rowData2"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="addRow3"
      class="fixed inset-0 z-[12000] flex justify-center overflow-y-auto bg-black/40 px-3 py-2">
      <div
        role="dialog"
        aria-modal="true"
        class="border-2 border-gray-700 bg-white shadow-2xl my-auto flex h-fit max-h-[calc(100vh-4.5rem)] w-full max-w-4xl flex-col rounded-lg">
        <div
          class="flex shrink-0 flex-wrap items-center justify-end gap-3 border-b border-gray-400 bg-gray-50 px-3 py-1.5 rounded-t-lg">
          <button type="button" :class="popupToolbarBtnClass" @click="cleanButton3">
            신규
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="saveButton3">
            저장
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="deleteButton3">
            삭제
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="closePopUp">
            닫기
          </button>
        </div>
        <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-2 py-2">
          <div class="shrink-0 rounded-md border border-gray-500 overflow-hidden">
            <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재분류코드
              </div>
              <div
                class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-10">
                <input
                  type="number"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond3" />
              </div>
            </div>
            <div class="grid grid-cols-12 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재분류명
              </div>
              <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-10">
                <input
                  type="text"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond4" />
              </div>
            </div>
          </div>

          <div
            class="flex h-[50vh] min-h-[260px] w-full min-w-0 flex-col overflow-hidden rounded-md border border-gray-500 bg-white">
            <div class="box-border h-full min-h-0 w-full flex-1 overflow-hidden p-1">
              <Realgrid
                :progname="'MST04_001INS_VUE'"
                :progid="3"
                :setStateBar="false"
                :rowStateeditable="false"
                @clickedRowData="clickedRowData2"
                :rowData="rowData3"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="addRow4"
      class="fixed inset-0 z-[12000] flex justify-center overflow-y-auto bg-black/40 px-3 py-2">
      <div
        role="dialog"
        aria-modal="true"
        class="border-2 border-gray-700 bg-white shadow-2xl my-auto flex h-fit max-h-[calc(100vh-4.5rem)] w-full max-w-4xl flex-col rounded-lg">
        <div
          class="flex shrink-0 flex-wrap items-center justify-end gap-3 border-b border-gray-400 bg-gray-50 px-3 py-1.5 rounded-t-lg">
          <button type="button" :class="popupToolbarBtnClass" @click="cleanButton4">
            신규
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="saveButton4">
            저장
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="deleteButton4">
            삭제
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="closePopUp">
            닫기
          </button>
        </div>
        <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-2 py-2">
          <div class="shrink-0 rounded-md border border-gray-500 overflow-hidden">
            <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재특성코드
              </div>
              <div
                class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-10">
                <input
                  type="number"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond5" />
              </div>
            </div>
            <div class="grid grid-cols-12 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재특성명
              </div>
              <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-10">
                <input
                  type="text"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond6" />
              </div>
            </div>
          </div>

          <div
            class="flex h-[50vh] min-h-[260px] w-full min-w-0 flex-col overflow-hidden rounded-md border border-gray-500 bg-white">
            <div class="box-border h-full min-h-0 w-full flex-1 overflow-hidden p-1">
              <Realgrid
                :progname="'MST04_001INS_VUE'"
                :progid="4"
                :setStateBar="false"
                :rowStateeditable="false"
                @clickedRowData="clickedRowData3"
                :rowData="rowData4"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div
      v-if="addRow5"
      class="fixed inset-0 z-[12000] flex justify-center overflow-y-auto bg-black/40 px-3 py-2">
      <div
        role="dialog"
        aria-modal="true"
        class="border-2 border-gray-700 bg-white shadow-2xl my-auto flex h-fit max-h-[calc(100vh-4.5rem)] w-full max-w-4xl flex-col rounded-lg">
        <div
          class="flex shrink-0 flex-wrap items-center justify-end gap-3 border-b border-gray-400 bg-gray-50 px-3 py-1.5 rounded-t-lg">
          <button type="button" :class="popupToolbarBtnClass" @click="cleanButton5">
            신규
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="saveButton5">
            저장
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="deleteButton5">
            삭제
          </button>
          <button type="button" :class="popupToolbarBtnClass" @click="closePopUp">
            닫기
          </button>
        </div>
        <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden px-2 py-2">
          <div class="shrink-0 rounded-md border border-gray-500 overflow-hidden">
            <div class="grid grid-cols-12 border-b border-gray-500 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재규격코드
              </div>
              <div
                class="col-span-12 flex min-h-[34px] items-center border-r border-gray-400 px-2 py-1 sm:col-span-10">
                <input
                  type="number"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond7" />
              </div>
            </div>
            <div class="grid grid-cols-12 bg-white">
              <div
                class="col-span-12 flex min-h-[34px] items-center justify-center border-r border-gray-400 bg-[#ebe8f2] px-2 py-1 text-center text-base font-semibold leading-tight text-gray-900 sm:col-span-2">
                자재규격명
              </div>
              <div class="col-span-12 flex min-h-[34px] items-center px-2 py-1 sm:col-span-10">
                <input
                  type="text"
                  class="h-7 w-full max-w-md rounded-sm border border-gray-700 px-2 text-sm"
                  v-model="sscond8" />
              </div>
            </div>
          </div>

          <div
            class="flex h-[50vh] min-h-[260px] w-full min-w-0 flex-col overflow-hidden rounded-md border border-gray-500 bg-white">
            <div class="box-border h-full min-h-0 w-full flex-1 overflow-hidden p-1">
              <Realgrid
                :progname="'MST04_001INS_VUE'"
                :progid="5"
                :setStateBar="false"
                :rowStateeditable="false"
                @clickedRowData="clickedRowData4"
                :rowData="rowData5"></Realgrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  <!--그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import {
  deleteStockAddInfo,
  deleteStockItem,
  getMaterialDetail,
  getStandardList,
  getStockCategory,
  getStockGeneric,
  getStockGroup,
  getStockItemList,
  getSuppliers,
  getUnitList,
  saveMaterialCode,
  saveStockAddInfo,
} from "@/api/master";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
/**
 *  매장  단일 선택 컴포넌트
 *  */

/**
 * 	그리드 생성
 */

import Realgrid from "@/components/realgrid.vue";
/**
 *  페이지로그 자동 입력
 *  */

import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/** PUR03_035INS 팝업 툴바와 동일 — 신규/저장/닫기 통일 */
const popupToolbarBtnClass =
  "whitebutton !h-9 !px-5 !py-2 !text-sm !font-semibold !border-gray-500 !text-gray-700 hover:!bg-blue-50 hover:!border-blue-400 disabled:opacity-50 disabled:pointer-events-none";

const reload = ref(false);
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const afterSearch = ref(false);
const selectedstartDate = ref();
const selectedendDate = ref();
const cond = ref("");
const cond2 = ref("");
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);
const cond7 = ref(0);
const cond8 = ref("");

const scond = ref("");
const scond2 = ref("");
const scond3 = ref("0");
const scond4 = ref("0");
const scond5 = ref("0");
const scond6 = ref("0");
const scond7 = ref("0");
const scond8 = ref("0");
const scond9 = ref("0");
const scond10 = ref("0");
const scond11 = ref("");
const scond12 = ref("0");
const scond13 = ref("");
const scond14 = ref("0");
const scond15 = ref("");
const scond16 = ref("0");
const scond17 = ref("");
const scond18 = ref("0");
const scond19 = ref("");
const scond20 = ref("0");
const scond21 = ref(false);
const scond22 = ref("");
const scond23 = ref("");
const scond24 = ref("");
const scond25 = ref("");
const scond26 = ref("");
const scond27 = ref("Y");

const sscond = ref("");
const sscond2 = ref("");

const sscond3 = ref("");
const sscond4 = ref("");

const sscond5 = ref("");
const sscond6 = ref("");

const sscond7 = ref("");
const sscond8 = ref("");

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
const optionList6 = ref([]);
const optionList7 = ref([]);
const optionList8 = ref([]);
const optionList9 = ref([]);
const optionList10 = ref([]);
const setGroupColumnId = ref("");

const addRow2 = ref(false);
const addRow3 = ref(false);
const addRow4 = ref(false);
const addRow5 = ref(false);
/**
 * 선택한 매출 시작일자
 */

const showAddPopUp = (e) => {
  addRow2.value = false;
  addRow3.value = false;
  addRow4.value = false;
  addRow5.value = false;

  if (e == 1) {
    addRow2.value = true;
  } else if (e == 2) {
    addRow3.value = true;
  } else if (e == 3) {
    addRow4.value = true;
  } else if (e == 4) {
    addRow5.value = true;
  }
};

const closePopUp2 = () => {
  addRow.value = false;
  addRow2.value = false;
  addRow3.value = false;
  addRow4.value = false;
  addRow5.value = false;
};
const closePopUp = () => {
  addRow2.value = false;
  addRow3.value = false;
  addRow4.value = false;
  addRow5.value = false;
};
const store = useStore();

const deleteLngCode = ref("");
const clickedRowData = (e) => {
  deleteLngCode.value = e[0];
  sscond.value = e[0];
  sscond2.value = e[1];
  saveNew2.value = false;
};
const clickedRowData2 = (e) => {
  deleteLngCode.value = e[0];
  sscond3.value = e[0];
  sscond4.value = e[1];
  saveNew3.value = false;
};
const clickedRowData3 = (e) => {
  deleteLngCode.value = e[0];
  sscond5.value = e[0];
  sscond6.value = e[1];
  saveNew4.value = false;
};
const clickedRowData4 = (e) => {
  deleteLngCode.value = e[0];
  sscond7.value = e[0];
  sscond8.value = e[1];
  saveNew5.value = false;
};

const cleanButton = () => {
  scond.value = "";
  scond2.value = "";
  scond3.value = "0";
  scond4.value = "0";
  scond5.value = "0";
  scond6.value = "0";
  scond7.value = "0";
  scond8.value = "0";
  scond9.value = "0";
  scond10.value = "0";
  scond11.value = "";
  scond12.value = "0";
  scond13.value = "";
  scond14.value = "0";
  scond15.value = "";
  scond16.value = "0";
  scond17.value = "";
  scond18.value = "0";
  scond19.value = "";
  scond20.value = "0";
  scond21.value = false;
  scond22.value = "";
  scond23.value = "";
  scond24.value = "";
  scond25.value = "";
  scond26.value = "";
  scond27.value = "Y";

  addRow2.value = false;
  addRow3.value = false;
  addRow4.value = false;
  addRow5.value = false;
};

const disabled2 = ref(false);
watch(scond21, () => {
  if (scond21.value == false) {
    disabled2.value = false;
  } else {
    disabled2.value = true;
  }
});

/** 환산율 등 — 숫자와 소수점 하나만 허용 (기존 정수만 허용 시 1.5 → 15 로 깨지던 문제 수정) */
const sanitizeDecimalInput = (raw) => {
  const v = String(raw ?? "").replace(/[^0-9.]/g, "");
  if (!v) return "";
  const parts = v.split(".");
  if (parts.length === 1) return parts[0];
  const intPart = parts[0] ?? "";
  const frac = parts.slice(1).join("");
  if (!frac.length) return intPart.length ? `${intPart}.` : "";
  if (!intPart.length) return `0.${frac}`;
  return `${intPart}.${frac}`;
};

const handleInput = (e) => {
  const next = sanitizeDecimalInput(e.target.value);
  scond17.value = next;
  scond19.value = next;
};

const onlyNumber = (e) => {
  if (e.target.name == "scond") {
    scond.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond11") {
    scond11.value = sanitizeDecimalInput(e.target.value);
  } else if (e.target.name == "scond13") {
    scond13.value = sanitizeDecimalInput(e.target.value);
  } else if (e.target.name == "scond15") {
    scond15.value = sanitizeDecimalInput(e.target.value);
  } else if (e.target.name == "scond22") {
    scond22.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond23") {
    scond23.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond24") {
    scond24.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond25") {
    scond25.value = e.target.value.replace(/[^0-9]/g, "");
  }
};
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getStockGroup(store.state.userData.lngStoreGroup);

  optionList.value = res.data.List;

  rowData2.value = res.data.List;
  //console.log(optionList.value);

  const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

  optionList2.value = res2.data.List;

  rowData3.value = res2.data.List;
  const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

  optionList3.value = res3.data.List;

  rowData4.value = res3.data.List;

  const res4 = await getSuppliers(store.state.userData.lngStoreGroup);

  optionList4.value = res4.data.List;

  const res5 = await getCommonList(35);

  optionList5.value = res5.data.List;

  const res6 = await getCommonList(99);

  optionList6.value = res6.data.List;

  const res7 = await getCommonList(8);

  optionList7.value = res7.data.List;

  const res8 = await getCommonList(109);

  optionList8.value = res8.data.List;

  const res9 = await getStandardList(store.state.userData.lngStoreGroup);

  optionList9.value = res9.data.List;

  rowData5.value = res9.data.List;

  const res10 = await getUnitList(store.state.userData.lngStoreGroup);

  optionList10.value = res10.data.List;

  //optionList3;
  ////console.log(formattedDate.value);
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);

/** 조회 API가 lng·dbl 접두만 줄 때도 그리드 컬럼(str…Figure)에 맞춰 채움 — 환산율 노출·getJsonRow 매핑용 */
const enrichStockGridRow = (r) => {
  if (!r || typeof r !== "object") return r;
  return {
    ...r,
    strOrderNCheckUOMFigure:
      r.strOrderNCheckUOMFigure ??
      r.lngOrderNCheckUOMFigure ??
      r.dblOrderNCheckUOMFigure ??
      "",
    strDemandUOMFigure:
      r.strDemandUOMFigure ??
      r.lngDemandUOMFigure ??
      r.dblDemandUOMFigure ??
      "",
    strReturnNMoveUOMFigure:
      r.strReturnNMoveUOMFigure ??
      r.lngReturnNMoveUOMFigure ??
      r.dblReturnNMoveUOMFigure ??
      "",
    strRealNReportUOMFigure:
      r.strRealNReportUOMFigure ??
      r.lngRealNReportUOMFigure ??
      r.dblRealNReportUOMFigure ??
      "",
    strUseNLossUOMFigure:
      r.strUseNLossUOMFigure ??
      r.lngUseNLossUOMFigure ??
      r.dblUseNLossUOMFigure ??
      "",
  };
};

const searchButton = async () => {
  store.state.loading = true;
  try {
    initGrid();

    reload.value = !reload.value;

    const res = await getStockItemList(
      store.state.userData.lngStoreGroup,
      cond.value,
      cond2.value,
      cond3.value,
      cond4.value,
      cond5.value,
      cond6.value,
      cond7.value,
      cond8.value,
      store.state.userData.strLanguage
    );
    console.log(res);

    rowData.value = (res.data.List || []).map(enrichStockGridRow);

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false;
    deleteLngCode2.value = "";
    deleteLngCode.value = "";
    addRow.value = false;
    addRow2.value = false;
    addRow3.value = false;
    addRow4.value = false;
    addRow5.value = false;
  }
};

const selectedGroup = ref();
const addRow = ref(false);
const addButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  cleanButton();
  saveNew.value = true;
  addRow.value = true;
};
/**
 * 페이지 매장 그룹 세팅
 */

/**
 * 페이지 매장 분류 세팅
 */

/**
 * 페이지 매장 슈퍼바이저 세팅
 */

/**
 * 그리드 초기화
 */

const initGrid = () => {
  if (rowData.value.length > 0) {
    rowData.value = [];
  }
};

const exportExcel = ref(false);

//comsole.log(store.state.minorCategory);

/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value =
    "자재코드 :" +
    cond.value +
    "\n" +
    "자재명 :" +
    cond2.value +
    "\n" +
    "자재그룹 : " +
    (optionList.value.filter((item) => item.lngStockGroupID == cond3.value)[0]
      ?.strStockGroupName || "선택") +
    "\n" +
    "자재분류 : " +
    (optionList2.value.filter((item) => item.lngCategoryID == cond4.value)[0]
      ?.strCategoryName || "선택") +
    "\n" +
    "자재특성 : " +
    (optionList3.value.filter((item) => item.lngGenericID == cond5.value)[0]
      ?.strGenericName || "선택") +
    "\n" +
    "거래처 : " +
    (optionList4.value.filter((item) => item.lngSupplierID == cond6.value)[0]
      ?.strSupplierName || "선택") +
    "\n" +
    "구분(주/부) : " +
    (optionList5.value.filter((item) => item.strDCode == cond7.value)[0]
      ?.strDName || "선택") +
    "\n" +
    "과세면세구분 : " +
    (optionList6.value.filter((item) => item.strDCode == cond8.value)[0]
      ?.strDName || "선택");

  exportExcel.value = !exportExcel.value;
};

const datepicker = ref(null);

/**
 * 매출 일자 안 라디오박스 닫기 위한 외부 클릭 감지 함수
 */

const documentSubTitle = ref("");
const selectedExcelDate = ref("");

const saveNew = ref(true);
const saveButton = async () => {
  if (scond.value == "" || scond.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond2.value == "" || scond2.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재명을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond3.value == "0" || scond3.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재그룹을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond4.value == "0" || scond4.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재분류를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond5.value == "0" || scond5.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재특성을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond6.value == "0" || scond6.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "실사주기를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond7.value == "0" || scond7.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "과세면세구분을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond8.value == "0" || scond8.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "의제매입을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond9.value == "0" || scond9.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "규격을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond10.value == "0" || scond10.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "발주매입단위를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond11.value == "" || scond11.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "발주매입단위 수량을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond12.value == "0" || scond12.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "청구단위를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond13.value == "" || scond13.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "청구단위수량을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond14.value == "0" || scond14.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "반품/이동단위를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond15.value == "" || scond15.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "반품/이동단위 수량을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond16.value == "0" || scond16.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "실사/재고단위를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond17.value == "" || scond17.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "실사/재고단위 수량을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond20.value == "0" || scond20.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "주거래처를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  /* 부가세 포함 미체크: 공급가 매입·판매단가 필수 / 포함 체크: VAT포함 금액 필수 */
  if (scond21.value == false) {
    if (scond22.value === "" || scond22.value == undefined) {
      Swal.fire({
        title: "경고",
        text: "매입단가를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    if (scond23.value === "" || scond23.value == undefined) {
      Swal.fire({
        title: "경고",
        text: "판매단가를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else {
    if (scond24.value === "" || scond24.value == undefined) {
      Swal.fire({
        title: "경고",
        text: "매입단가(VAT포함)를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    if (scond25.value === "" || scond25.value == undefined) {
      Swal.fire({
        title: "경고",
        text: "판매단가(VAT포함)를 입력해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  }

  try {
    let tcond;
    let tcond2;

    if (scond21.value == false) {
      tcond = scond22.value;
      tcond2 = scond23.value;
    } else {
      tcond = scond24.value;
      tcond2 = scond25.value;
    }
    store.state.loading = true;
    /**
     * COND10·11 … COND18·19 짝: 서버 기준 Figure=환산율, UOM=단위(콤보) 코드.
     * 화면 순서는 [단위 콤보, 환산율] 이므로 전달은 [Figure, UOM] = [scond11, scond10] 형태.
     */
    const res = await saveMaterialCode(
      store.state.userData.lngStoreGroup,
      scond.value,
      scond2.value,
      scond3.value,
      scond4.value,
      scond5.value,
      scond6.value,
      scond7.value,
      scond8.value,
      scond9.value,
      scond11.value,
      scond10.value,
      scond13.value,
      scond12.value,
      scond15.value,
      scond14.value,
      scond17.value,
      scond16.value,
      scond19.value,
      scond18.value,
      scond20.value,
      tcond,
      tcond2,
      scond26.value,
      scond27.value,
      saveNew.value == true ? "I" : "U",
      store.state.userData.lngSequence
    );

    //console.log(res);
    store.state.loading = false;
    cleanButton();
    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });

      addRow.value = false;
      searchButton();
      return;
    } else {
      await Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다. 중복되지 않은 자재코드를 입력해주세요",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
    store.state.loading = false;
  } finally {
    store.state.loading = false;
    cleanButton();
  }
};

const saveNew2 = ref(true);
const cleanButton2 = () => {
  sscond.value = "";
  sscond2.value = "";
  saveNew2.value = true;
};

const saveButton2 = async () => {
  if (sscond.value == "" || sscond.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재그룹코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (sscond2.value == "" || sscond2.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재그룹명을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await saveStockAddInfo(
      store.state.userData.lngStoreGroup,
      0,
      sscond.value,
      sscond2.value,
      saveNew2.value == true ? "I" : "U"
    );

    //console.log(res);

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다. 중복되지 않은 자재그룹코드를 입력해주세요",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    const res = await getStockGroup(store.state.userData.lngStoreGroup);

    optionList.value = res.data.List;

    rowData2.value = res.data.List;
  }
};

const deleteButton2 = async () => {
  if (saveNew2.value == true) {
    Swal.fire({
      title: "경고",
      text: "삭제할 자재그룹을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await deleteStockAddInfo(
      store.state.userData.lngStoreGroup,
      0,
      deleteLngCode.value
    );
    //console.log(res);
  } catch (error) {
  } finally {
    const res = await getStockGroup(store.state.userData.lngStoreGroup);

    optionList.value = res.data.List;

    rowData2.value = res.data.List;

    saveNew2.value = true;
  }
};

const saveNew3 = ref(true);
const cleanButton3 = () => {
  sscond3.value = "";
  sscond4.value = "";
  saveNew3.value = true;
};

const saveButton3 = async () => {
  if (sscond3.value == "" || sscond3.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재분류코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (sscond4.value == "" || sscond4.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재분류명을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await saveStockAddInfo(
      store.state.userData.lngStoreGroup,
      1,
      sscond3.value,
      sscond4.value,
      saveNew3.value == true ? "I" : "U"
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다. 중복되지 않은 자재분류코드를 입력해주세요",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

    optionList2.value = res2.data.List;

    rowData3.value = res2.data.List;
  }
};

const deleteButton3 = async () => {
  if (saveNew3.value == true) {
    Swal.fire({
      title: "경고",
      text: "삭제할 자재분류를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await deleteStockAddInfo(
      store.state.userData.lngStoreGroup,
      1,
      deleteLngCode.value
    );
    //console.log(res);
  } catch (error) {
  } finally {
    const res2 = await getStockCategory(store.state.userData.lngStoreGroup);

    optionList2.value = res2.data.List;

    rowData3.value = res2.data.List;

    saveNew3.value = true;
  }
};

const saveNew4 = ref(true);
const cleanButton4 = () => {
  sscond5.value = "";
  sscond6.value = "";
  saveNew4.value = true;
};

const saveButton4 = async () => {
  if (sscond5.value == "" || sscond5.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재특성코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (sscond6.value == "" || sscond6.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재특성명을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await saveStockAddInfo(
      store.state.userData.lngStoreGroup,
      2,
      sscond5.value,
      sscond6.value,
      saveNew4.value == true ? "I" : "U"
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다. 중복되지 않은 자재특성코드를 입력해주세요",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

    optionList3.value = res3.data.List;

    rowData4.value = res3.data.List;
  }
};

const deleteButton4 = async () => {
  if (saveNew4.value == true) {
    Swal.fire({
      title: "경고",
      text: "삭제할 자재특성을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await deleteStockAddInfo(
      store.state.userData.lngStoreGroup,
      2,
      deleteLngCode.value
    );
    //console.log(res);
  } catch (error) {
  } finally {
    const res3 = await getStockGeneric(store.state.userData.lngStoreGroup);

    optionList3.value = res3.data.List;

    rowData4.value = res3.data.List;

    saveNew4.value = true;
  }
};

const saveNew5 = ref(true);
const cleanButton5 = () => {
  sscond7.value = "";
  sscond8.value = "";
  saveNew5.value = true;
};

const saveButton5 = async () => {
  if (sscond7.value == "" || sscond7.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "규격코드를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (sscond8.value == "" || sscond8.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "자재규격명을 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await saveStockAddInfo(
      store.state.userData.lngStoreGroup,
      3,
      sscond7.value,
      sscond8.value,
      saveNew5.value == true ? "I" : "U"
    );

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "저장에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다. 중복되지 않은 자재규격코드를 입력해주세요",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    //console.log(res);
  } catch (error) {
  } finally {
    const res9 = await getStandardList(store.state.userData.lngStoreGroup);

    optionList9.value = res9.data.List;

    rowData5.value = res9.data.List;
  }
};

const deleteButton5 = async () => {
  if (saveNew5.value == true) {
    Swal.fire({
      title: "경고",
      text: "삭제할 규격을 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await deleteStockAddInfo(
      store.state.userData.lngStoreGroup,
      3,
      deleteLngCode.value
    );
    //console.log(res);
  } catch (error) {
  } finally {
    const res9 = await getStandardList(store.state.userData.lngStoreGroup);

    optionList9.value = res9.data.List;

    rowData5.value = res9.data.List;

    saveNew5.value = true;
  }
};

const deleteLngCode2 = ref("");

/** 조회 그리드 행 컬럼명이 DB·버전별로 다를 때 대비 */
const rowPickStr = (row, keys, fallback = "") => {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return fallback;
};

/** `<option :value="i.lngStockGroupID">` 처럼 숫자 value 와 select v-model 일치 */
const numId = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** 공통코드 option 은 strDCode 문자열 */
const strDVal = (v, fallback = "0") => {
  if (v === undefined || v === null || v === "") return fallback;
  return String(v);
};

const figureFromDetail = (d, keys) => {
  for (const k of keys) {
    const v = d[k];
    if (v !== undefined && v !== null && v !== "") return String(v);
  }
  return "";
};

/** 상세 응답에 환산율 없으면 조회 그리드 행(동일 자재)에서 보완 */
const figureDetailOrGrid = (d, gridRow, detailKeys, gridKeys) => {
  const fromDet = figureFromDetail(d, detailKeys);
  if (fromDet !== "") return fromDet;
  return rowPickStr(gridRow || {}, gridKeys);
};

const clickedRowData6 = (e) => {
  if (!Array.isArray(e)) return;
  deleteLngCode2.value = String(e[0] ?? "");
  const gridRow = rowData.value?.find(
    (r) => String(r.lngStockID) === String(e[0])
  );
  if (!gridRow) return;
  scond11.value = rowPickStr(gridRow, [
    "strOrderNCheckUOMFigure",
    "lngOrderNCheckUOMFigure",
    "dblOrderNCheckUOMFigure",
  ]);
  scond13.value = rowPickStr(gridRow, [
    "strDemandUOMFigure",
    "lngDemandUOMFigure",
    "dblDemandUOMFigure",
  ]);
  scond15.value = rowPickStr(gridRow, [
    "strReturnNMoveUOMFigure",
    "lngReturnNMoveUOMFigure",
    "dblReturnNMoveUOMFigure",
  ]);
  scond17.value = rowPickStr(gridRow, [
    "strRealNReportUOMFigure",
    "lngRealNReportUOMFigure",
    "dblRealNReportUOMFigure",
  ]);
  scond19.value = rowPickStr(gridRow, [
    "strUseNLossUOMFigure",
    "lngUseNLossUOMFigure",
    "dblUseNLossUOMFigure",
  ]);
};

/**
 * 조회 그리드 더블클릭 — 그리드 getJsonRow 는 병합/표시 컬럼만 있어 ID·환산율이 빠진 경우가 많음.
 * 자재코드로 getMaterialDetail 로 완전 바인딩 + 콤보는 option :value(숫자)와 타입 일치(numId).
 */
const dblclickedRowData = async (row) => {
  if (!row || typeof row !== "object") return;

  const stockId = rowPickStr(row, [
    "lngStockID",
    "LNG_STOCK_ID",
    "lngstockid",
  ]);
  if (!stockId) return;

  deleteLngCode2.value = stockId;
  const gridRow =
    rowData.value?.find((r) => String(r.lngStockID) === String(stockId)) ??
    row;

  try {
    store.state.loading = true;
    const res = await getMaterialDetail(
      store.state.userData.lngStoreGroup,
      stockId,
      store.state.userData.strLanguage,
      0
    );
    const d = res.data.List?.[0];
    if (!d) return;

    scond.value = String(d.lngStockID ?? "");
    scond2.value = String(d.strStockName ?? "");

    scond3.value = numId(d.lngGroupID, 0);
    scond4.value = numId(d.lngCategoryID, 0);
    scond5.value = numId(d.lngGenericID, 0);
    scond6.value = strDVal(d.lngTakeCycle);
    scond7.value = strDVal(d.lngTaxType);
    scond8.value = strDVal(d.blnImiReceive);
    scond9.value = numId(d.lngStandardID, 0);

    scond10.value = numId(d.lngOrderNCheckUOM, 0);
    scond11.value = figureDetailOrGrid(
      d,
      gridRow,
      [
        "lngOrderNCheckUOMFigure",
        "dblOrderNCheckUOMFigure",
        "strOrderNCheckUOMFigure",
      ],
      [
        "strOrderNCheckUOMFigure",
        "lngOrderNCheckUOMFigure",
        "dblOrderNCheckUOMFigure",
      ]
    );
    scond12.value = numId(d.lngDemandUOM, 0);
    scond13.value = figureDetailOrGrid(
      d,
      gridRow,
      ["lngDemandUOMFigure", "dblDemandUOMFigure", "strDemandUOMFigure"],
      ["strDemandUOMFigure", "lngDemandUOMFigure", "dblDemandUOMFigure"]
    );
    scond14.value = numId(d.lngReturnNMoveUOM, 0);
    scond15.value = figureDetailOrGrid(
      d,
      gridRow,
      [
        "lngReturnNMoveUOMFigure",
        "dblReturnNMoveUOMFigure",
        "strReturnNMoveUOMFigure",
      ],
      [
        "strReturnNMoveUOMFigure",
        "lngReturnNMoveUOMFigure",
        "dblReturnNMoveUOMFigure",
      ]
    );
    scond16.value = numId(d.lngRealNReportUOM, 0);
    scond17.value = figureDetailOrGrid(
      d,
      gridRow,
      [
        "lngRealNReportUOMFigure",
        "dblRealNReportUOMFigure",
        "strRealNReportUOMFigure",
      ],
      [
        "strRealNReportUOMFigure",
        "lngRealNReportUOMFigure",
        "dblRealNReportUOMFigure",
      ]
    );
    scond18.value = numId(d.lngUseNLossUOM, 0);
    scond19.value = figureDetailOrGrid(
      d,
      gridRow,
      ["lngUseNLossUOMFigure", "dblUseNLossUOMFigure", "strUseNLossUOMFigure"],
      ["strUseNLossUOMFigure", "lngUseNLossUOMFigure", "dblUseNLossUOMFigure"]
    );

    scond20.value = numId(d.lngSupplierID, 0);

    const cup = d.curUnitPrice;
    const csp = d.curSalesUnitPrice ?? d.curSalesPrice;
    const nCup = parseInt(String(cup ?? "").replace(/[^0-9.-]/g, ""), 10);
    const nCsp = parseInt(String(csp ?? "").replace(/[^0-9.-]/g, ""), 10);
    scond22.value =
      cup !== undefined && cup !== null && cup !== "" && !Number.isNaN(nCup)
        ? String(nCup)
        : "";
    scond23.value =
      csp !== undefined && csp !== null && csp !== "" && !Number.isNaN(nCsp)
        ? String(nCsp)
        : "";

    if (typeof d.blnPriceIncludeVAT === "boolean") {
      scond21.value = d.blnPriceIncludeVAT;
    } else if (typeof d.blnVatIncluded === "boolean") {
      scond21.value = d.blnVatIncluded;
    } else if (d.lngPriceIncludeVAT != null) {
      scond21.value = Number(d.lngPriceIncludeVAT) !== 0;
    } else {
      scond21.value = false;
    }

    const vatIn = d.curUnitPriceVat ?? d.curUnitPriceVAT;
    const vatOut = d.curSalesUnitPriceVat ?? d.curSalesUnitPriceVAT;
    const nVi = parseInt(String(vatIn ?? "").replace(/[^0-9.-]/g, ""), 10);
    const nVo = parseInt(String(vatOut ?? "").replace(/[^0-9.-]/g, ""), 10);
    scond24.value =
      vatIn !== undefined &&
      vatIn !== null &&
      vatIn !== "" &&
      !Number.isNaN(nVi)
        ? String(nVi)
        : "";
    scond25.value =
      vatOut !== undefined &&
      vatOut !== null &&
      vatOut !== "" &&
      !Number.isNaN(nVo)
        ? String(nVo)
        : "";

    scond26.value = String(d.strBarCode ?? "");
    scond27.value =
      d.lngActive !== undefined && d.lngActive !== null && d.lngActive !== ""
        ? String(d.lngActive)
        : "Y";

    addRow.value = true;
    saveNew.value = false;
  } catch (error) {
    /* ignore */
  } finally {
    store.state.loading = false;
  }
};

const deleteButton = async () => {
  //console.log(deleteLngCode2.value);
  if (deleteLngCode2.value == "" || deleteLngCode2.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "삭제할 자재코드를 선택해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await deleteStockItem(
      store.state.userData.lngStoreGroup,
      deleteLngCode2.value,
      store.state.userData.lngSequence
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: "삭제에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      await Swal.fire({
        title: "실패",
        text: "출고 또는 매입이력이 있을경우 삭제가 불가능합니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>

<style></style>
