<!-- /*--############################################################################
# Filename : MST04_001INS.vue                                                  
# Description : 마스터관리 > 자재 마스터 > 자재 마스터 등록          
# Date :2025-08-19                                                            
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회 조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <!-- <button @click="addButton" class="button save w-auto excel">
          신규
        </button>
        <button @click="deleteButton" class="button save w-auto excel">
          삭제
        </button> -->
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-3 justify-between bg-gray-200 rounded-lg h-32 items-start z-10">
      <div class="flex ml-12 mt-2 items-center">
        <div class="font-semibold text-base">자재코드</div>
        <input
          type="text"
          class="ml-5 h-7 border border-black"
          v-model="cond" />
      </div>
      <div class="flex ml-24 mt-2 items-center">
        <div class="font-semibold text-base">자재명</div>
        <input
          type="text"
          class="ml-5 h-7 border border-black"
          v-model="cond2" />
      </div>
      <div></div>
      <div
        class="flex justify-start items-center text-base text-nowrap font-semibold ml-12 space-x-5">
        자재그룹
        <div class="flex space-x-5 ml-5">
          <select name="" id="" class="w-48 h-8" v-model="cond3">
            <option value="0">선택</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList">
              {{ i.strStockGroupName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-20">
        <div>자재분류</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond4">
          <option value="0">선택</option>
          <option :value="i.lngCategoryID" v-for="i in optionList2">
            {{ i.strCategoryName }}
          </option>
        </select>
      </div>
      <div class="flex items-center justify-start text-base font-bold ml-24">
        <div>자재특성</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond5">
          <option value="0">선택</option>
          <option :value="i.lngGenericID" v-for="i in optionList3">
            {{ i.strGenericName }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-start text-base font-bold ml-16">
        <div>거래처</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond6">
          <option value="0">선택</option>
          <option :value="i.lngSupplierID" v-for="i in optionList4">
            {{ i.strSupplierName }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-start text-base font-bold ml-16">
        <div>구분(주/부)</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond7">
          <option value="0">선택</option>
          <option :value="i.strDCode" v-for="i in optionList5">
            {{ i.strDName }}
          </option>
        </select>
      </div>

      <div class="flex items-center justify-start text-base font-bold ml-16">
        <div>과세면세구분</div>
        <select name="" id="" class="w-48 h-8 ml-5" v-model="cond8">
          <option :value="''">선택</option>
          <option :value="i.strDCode" v-for="i in optionList6">
            {{ i.strDName }}
          </option>
        </select>
      </div>
    </div>
    <!-- 조회 조건 -->
    <!--그리드 영역 -->
    <div class="flex justify-end space-x-2">
      <div><button @click="addButton" class="whitebutton">신규</button></div>
      <div><button @click="deleteButton" class="whitebutton">삭제</button></div>
    </div>
    <div class="w-[100%] h-[70vh] grid-rows-2 grid-cols-1">
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

  <div v-if="addRow" class="fixed top-64 right-96 w-[30vw] h-[50vh]">
    <div class="bg-white border border-black w-full h-full">
      <div class="flex justify-end space-x-2">
        <div>
          <button class="whitebutton" @click="cleanButton">신규</button>
        </div>
        <div><button class="whitebutton" @click="saveButton">저장</button></div>
        <div>
          <button class="whitebutton" @click="closePopUp2">닫기</button>
        </div>
      </div>
      <div class="grid grid-rows-4 grid-cols-[1fr,2fr,1fr,2fr]">
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재코드
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-1">
          <input
            type="text"
            class="h-[80%] w-[80%] border-black border"
            name="scond"
            @input="onlyNumber"
            v-model="scond" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재명
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-1">
          <input
            type="text"
            class="h-[80%] w-[80%] border-black border"
            v-model="scond2" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재그룹
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond3">
            <option value="0">선택</option>
            <option :value="i.lngStockGroupID" v-for="i in optionList">
              {{ i.strStockGroupName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]" @click="showAddPopUp(1)">
            +
          </button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재분류
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond4">
            <option value="0">선택</option>
            <option :value="i.lngCategoryID" v-for="i in optionList2">
              {{ i.strCategoryName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]" @click="showAddPopUp(2)">
            +
          </button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          자재특성
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond5">
            <option value="0">선택</option>
            <option :value="i.lngGenericID" v-for="i in optionList3">
              {{ i.strGenericName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]" @click="showAddPopUp(3)">
            +
          </button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          실사주기
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond6">
            <option value="0">선택</option>
            <option :value="i.strDCode" v-for="i in optionList7">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          과세면세구분
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond7">
            <option value="0">선택</option>
            <option :value="i.strDCode" v-for="i in optionList6">
              {{ i.strDName }}
            </option>
          </select>
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          의제매입
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond8">
            <option value="0">선택</option>
            <option :value="i.strDCode" v-for="i in optionList8">
              {{ i.strDName }}
            </option>
          </select>
        </div>
      </div>
      <div class="flex text-red-500">
        ex : 1ea 에 100g 자재를 1box 매입하여 1ea 단위로 출고. 1box에 12ea가
        들어있음. <br />
        발주매입:1box , 청구:12ea , 반품/이동:12ea , 실사/재고:1200g , 사용/손실
        : 1200g
      </div>

      <div class="grid grid-rows-6 grid-cols-[1fr,2fr]">
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          규격
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond9">
            <option value="0">선택</option>
            <option :value="i.lngStandardID" v-for="i in optionList9">
              {{ i.strStandardName }}
            </option>
          </select>
          <button class="whitebutton !h-[80%]" @click="showAddPopUp(4)">
            +
          </button>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          발주매입단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[40%] h-[80%] border border-black disabled:bg-gray-300"
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
            class="h-[80%] w-[29%] border border-black ml-1 disabled:bg-gray-300"
            v-model="scond11" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          청구단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            :disabled="saveNew == false"
            class="w-[40%] h-[80%] border border-black disabled:bg-gray-300"
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
            class="h-[80%] w-[29%] border border-black ml-1 disabled:bg-gray-300"
            v-model="scond13" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          반품/이동단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            :disabled="saveNew == false"
            class="w-[40%] h-[80%] border border-black disabled:bg-gray-300"
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
            class="h-[80%] w-[29%] border border-black ml-1 disabled:bg-gray-300"
            v-model="scond15" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          실사/재고단위
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            :disabled="saveNew == false"
            class="w-[40%] h-[80%] border border-black disabled:bg-gray-300"
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
            class="h-[80%] w-[29%] border border-black ml-1 disabled:bg-gray-300"
            v-model="scond17" />
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          사용/손실단위
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[40%] h-[80%] border border-black disabled:bg-gray-300"
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
            class="h-[80%] w-[29%] border border-b border-black ml-1 disabled:bg-gray-300"
            v-model="scond19" />
        </div>
      </div>
      <div class="flex text-red-500">
        ※매입단가 : 발주/매입 단위 금액, 판매단가 : 반품/이동 단위 금액.
      </div>

      <div class="grid grid-rows-5 grid-cols-[3fr,4fr,3fr,4fr]">
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          주거래처
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center col-span-3">
          <select
            name=""
            id=""
            class="w-[70%] h-[80%] border border-black"
            v-model="scond20">
            <option value="0">선택</option>
            <option :value="i.lngSupplierID" v-for="i in optionList4">
              {{ i.strSupplierName }}
            </option>
          </select>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          부가세 구분
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center col-span-3">
          <label for="ssscond2"
            ><input
              type="checkbox"
              id="ssscond2"
              v-model="scond21" />포함</label
          >
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          매입단가
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            :disabled="disabled2"
            @input="onlyNumber"
            name="scond22"
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="scond22" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          판매단가
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            :disabled="disabled2"
            @input="onlyNumber"
            name="scond23"
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="scond23" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 justify-center items-center text-center">
          매입단가(VAT포함)
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            :disabled="!disabled2"
            @input="onlyNumber"
            name="scond24"
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="scond24" />
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          판매단가(VAT포함)
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            @input="onlyNumber"
            name="scond25"
            :disabled="!disabled2"
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="scond25" />
        </div>

        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          바코드
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <input
            type="text"
            class="h-[80%] w-[29%] border border-black disabled:bg-gray-300"
            v-model="scond26" />
        </div>
        <div
          class="border-l border-t border-b border-black bg-gray-100 justify-center items-center text-center">
          사용여부
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-1 items-center">
          <select
            name=""
            id=""
            class="w-[29%] h-[80%] border border-black"
            v-model="scond27">
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div v-if="addRow2" class="fixed top-64 right-12 w-[16vw] h-[50vh]">
    <div class="bg-white border border-black w-full h-full">
      <div class="flex justify-end space-x-2">
        <div>
          <button class="whitebutton" @click="cleanButton2">신규</button>
        </div>
        <div>
          <button class="whitebutton" @click="saveButton2">저장</button>
        </div>
        <div>
          <button class="whitebutton" @click="deleteButton2">삭제</button>
        </div>
        <div><button class="whitebutton" @click="closePopUp">닫기</button></div>
      </div>
      <div class="grid grid-rows-2 grid-cols-[1fr,2fr] w-full">
        <div class="border-l border-t border-black">자재그룹코드</div>
        <div class="border-l border-t border-black pl-1 flex items-center">
          <input
            type="number"
            class="border border-black h-[80%]"
            v-model="sscond" />
        </div>
        <div class="border-l border-t border-b border-black">자재그룹명</div>
        <div
          class="border-l border-t border-b border-black pl-1 flex items-center">
          <input
            type="text"
            class="border border-black h-[80%]"
            v-model="sscond2" />
        </div>
      </div>

      <div class="w-[95%] h-[80%] flex justify-center items-center ml-1 mt-1">
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

  <div v-if="addRow3" class="fixed top-64 right-12 w-[16vw] h-[50vh]">
    <div class="bg-white border border-black w-full h-full">
      <div class="flex justify-end space-x-2">
        <div>
          <button class="whitebutton" @click="cleanButton3">신규</button>
        </div>
        <div>
          <button class="whitebutton" @click="saveButton3">저장</button>
        </div>
        <div>
          <button class="whitebutton" @click="deleteButton3">삭제</button>
        </div>
        <div><button class="whitebutton" @click="closePopUp">닫기</button></div>
      </div>
      <div class="grid grid-rows-2 grid-cols-[1fr,2fr] w-full">
        <div class="border-l border-t border-black">자재분류코드</div>
        <div class="border-l border-t border-black pl-1 flex items-center">
          <input
            type="number"
            class="border border-black h-[80%]"
            v-model="sscond3" />
        </div>

        <div class="border-l border-t border-b border-black">자재분류명</div>
        <div
          class="border-l border-t border-b border-black pl-1 flex items-center">
          <input
            type="text"
            class="border border-black h-[80%]"
            v-model="sscond4" />
        </div>
      </div>

      <div class="w-[95%] h-[80%] flex justify-center items-center ml-1 mt-1">
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

  <div v-if="addRow4" class="fixed top-64 right-12 w-[16vw] h-[50vh]">
    <div class="bg-white border border-black w-full h-full">
      <div class="flex justify-end space-x-2">
        <div>
          <button class="whitebutton" @click="cleanButton4">신규</button>
        </div>
        <div>
          <button class="whitebutton" @click="saveButton4">저장</button>
        </div>
        <div>
          <button class="whitebutton" @click="deleteButton4">삭제</button>
        </div>
        <div><button class="whitebutton" @click="closePopUp">닫기</button></div>
      </div>
      <div class="grid grid-rows-2 grid-cols-[1fr,2fr] w-full">
        <div class="border-l border-t border-black">자재특성코드</div>
        <div class="border-l border-t border-black pl-1 flex items-center">
          <input
            type="number"
            class="border border-black h-[80%]"
            v-model="sscond5" />
        </div>

        <div class="border-l border-t border-b border-black">자재특성명</div>
        <div
          class="border-l border-t border-b border-black pl-1 flex items-center">
          <input
            type="text"
            class="border border-black h-[80%]"
            v-model="sscond6" />
        </div>
      </div>

      <div class="w-[95%] h-[80%] flex justify-center items-center ml-1 mt-1">
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

  <div v-if="addRow5" class="fixed top-64 right-12 w-[16vw] h-[50vh]">
    <div class="bg-white border border-black w-full h-full">
      <div class="flex justify-end space-x-2">
        <div>
          <button class="whitebutton" @click="cleanButton5">신규</button>
        </div>
        <div>
          <button class="whitebutton" @click="saveButton5">저장</button>
        </div>
        <div>
          <button class="whitebutton" @click="deleteButton5">삭제</button>
        </div>
        <div><button class="whitebutton" @click="closePopUp">닫기</button></div>
      </div>
      <div class="grid grid-rows-2 grid-cols-[1fr,2fr] w-full">
        <div class="border-l border-t border-black">자재규격코드</div>
        <div class="border-l border-t border-black pl-1 flex items-center">
          <input
            type="number"
            class="border border-black h-[80%]"
            v-model="sscond7" />
        </div>

        <div class="border-l border-t border-b border-black">자재규격명</div>
        <div
          class="border-l border-t border-b border-black pl-1 flex items-center">
          <input
            type="text"
            class="border border-black h-[80%]"
            v-model="sscond8" />
        </div>
      </div>

      <div class="w-[95%] h-[80%] flex justify-center items-center ml-1 mt-1">
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
  //console.log(e);
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

const handleInput = (e) => {
  //onlyNumber(e);
  scond17.value = e.target.value.replace(/[^0-9]/g, "");
  scond19.value = scond17.value;
};

const onlyNumber = (e) => {
  if (e.target.name == "scond") {
    scond.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond11") {
    scond11.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond13") {
    scond13.value = e.target.value.replace(/[^0-9]/g, "");
  } else if (e.target.name == "scond15") {
    scond15.value = e.target.value.replace(/[^0-9]/g, "");
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
  console.log(optionList.value);

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
  //console.log(formattedDate.value);
});

/**
 *  조회 함수
 */

const filteredrowData = ref([]);
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

    rowData.value = res.data.List;

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

  if (scond22.value == "" || scond22.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "매입단가를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (scond23.value == "" || scond23.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "판매단가를 입력해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
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
      scond10.value,
      scond11.value,
      scond12.value,
      scond13.value,
      scond14.value,
      scond15.value,
      scond16.value,
      scond17.value,
      scond18.value,
      scond19.value,
      scond20.value,
      tcond,
      tcond2,
      scond26.value,
      scond27.value,
      saveNew.value == true ? "I" : "U",
      store.state.userData.lngSequence
    );

    console.log(res);
    store.state.loading = false;
    cleanButton();
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
        text: "저장에 실패하였습니다.",
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

    console.log(res);
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
    console.log(res);
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

    console.log(res);
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
    console.log(res);
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

    console.log(res);
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
    console.log(res);
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

    console.log(res);
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
    console.log(res);
  } catch (error) {
  } finally {
    const res9 = await getStandardList(store.state.userData.lngStoreGroup);

    optionList9.value = res9.data.List;

    rowData5.value = res9.data.List;

    saveNew5.value = true;
  }
};

const deleteLngCode2 = ref("");
const clickedRowData6 = (e) => {
  //console.log(e);
  deleteLngCode2.value = e[0];
};

const dblclickedRowData = async (e) => {
  console.log(e);

  try {
    const res = await getMaterialDetail(
      store.state.userData.lngStoreGroup,
      e[0],
      store.state.userData.strLanguage,
      0
    );

    console.log(res);

    scond.value = res.data.List[0].lngStockID;
    scond2.value = res.data.List[0].strStockName;
    scond3.value = res.data.List[0].lngGroupID;
    scond4.value = res.data.List[0].lngCategoryID;
    scond5.value = res.data.List[0].lngGenericID;
    scond6.value = res.data.List[0].lngTakeCycle;
    scond7.value = res.data.List[0].lngTaxType;
    scond8.value = res.data.List[0].blnImiReceive;
    scond9.value = res.data.List[0].lngStandardID;
    scond10.value = res.data.List[0].lngDemandUOM;
    scond12.value = res.data.List[0].lngOrderNCheckUOM;
    scond14.value = res.data.List[0].lngReturnNMoveUOM;
    scond16.value = res.data.List[0].lngRealNReportUOM;
    scond18.value = res.data.List[0].lngUseNLossUOM;
    scond20.value = res.data.List[0].lngSupplierID;
    scond22.value = parseInt(res.data.List[0].curUnitPrice);
    scond23.value = parseInt(res.data.List[0].curSalesPrice);
    scond26.value = res.data.List[0].strBarCode;
    scond27.value = res.data.List[0].lngActive;

    addRow.value = true;
    saveNew.value = false;
  } catch (error) {}
};

const deleteButton = async () => {
  console.log(deleteLngCode2.value);
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

    console.log(res);
  } catch (error) {
  } finally {
    searchButton();
  }
};
</script>

<style></style>
