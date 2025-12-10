<!-- /*--############################################################################
# Filename : MST44_064INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 주방출력관리                          
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
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
      @update:storeAreaCd="handleStoreAreaCd"
      @update:storeCd="handleStoreCd"
      @storeNm="handlestoreNm"
      @GroupNm="handleGroupNm"
      @update:ischanged="handleinitAll"
      :hidesub="hidesub"
      :hideAttr="hidesub"></PickStore>
  </div>
  <!-- 조회조건 -->
  <!-- 탭1 영역\-->
  <div class="mt-5 flex justify-start ml-10">
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 1 }"
      @click="showMenus(1)">
      주방출력그룹
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 2 }"
      @click="showMenus(2)">
      주방출력 메뉴설정
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 3 }"
      @click="showMenus(3)">
      주방출력구성
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 4 }"
      @click="showMenus(4)">
      영수증 문구출력
    </button>
  </div>
  <div class="flex h-4/6 w-full mt-5">
    <div class="flex flex-col w-6/12 h-4/6">
      <div
        class="flex justify-between mt-0 ml-10 border-b border-b-gray-300"
        :class="currentMenu == 1 ? 'w-full' : 'w-full'">
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == 1">
          주방출력그룹 정보
        </div>
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == 2">
          메뉴 목록
        </div>
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == 3">
          포트주방출력 목록
        </div>
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == 4">
          영수증 출력
        </div>
         

        <div class="mt-3">
          <button
            class="whitebutton"
            :disabled="!(afterSearch == true)"
            @click="addRow"
            v-if="currentMenu == 1">
            추가
          </button>
          <button
            class="whitebutton"
            @click="deleteRow"
            :disabled="!(afterClick == true && afterSearch == true)"
            v-if="currentMenu == 1">
            삭제
          </button>
        </div>

        <div class="" v-if="currentMenu == 4">
          <button
            class="whitebutton" @click="initAllSection">초기화</button>
            <button class="whitebutton"
            @click="dupliData">복사</button><button class="whitebutton" @click="dupliAllData">붙여넣기</button></div>
      </div>

      <div class="h-[25vh]" v-show="currentMenu == 1">
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="w-full h-[230%]"
            :progname="'MST44_064INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :searchWord="searchword1"
            :searchColId="'lngCode,strName'"
            :addRow4="addRows"
            @selectedIndex2="selectedIndex2"
            :addrowProp="'strName,lngStoreGroup'"
            :addrowDefault="addrowDefault"
            @updatedRowData="updatedRowData"
            @clickedRowData="clickedRowData"
            @sendRowState="sendRowState"
            @allStateRows="allStateRows"
            :deleteRow6="deleteRows"
            :changeColid="changeColid"
            :changeRow="changeRow"
            :changeValue2="changeValue"
            :changeNow="changeNow"
            @realgridname="realgridname2"
            :rowStateeditable="rowStateeditable"></Realgrid>
        </div>
      </div>
      <!-- 탭1 영역\-->
      <!-- 탭2 영역\-->
      <div class="h-[25vh]" v-show="currentMenu == 2">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            메뉴분류
          </div>
          <div
            class="px-2 py-1 border border-gray-400 rounded-tr-lg flex space-x-2">
            <select
              name="lngMainGroup"
              id=""
              class="flex-1 border border-gray-400 rounded-lg"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in MenuGroup">
                {{ i.majorGroupNm }}
              </option>
            </select>
            <select
              name="lngSubGroup"
              id=""
              class="flex-1 border border-gray-400 rounded-lg"
              v-model="forsearchSub"
              @change="setSubCd">
              <option value="-1">전체</option>
              <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup">
                {{ i.subGroupNm }}
              </option>
            </select>
          </div>

          <div class="customtableIndex border border-gray-400 rounded-bl-lg">
            메뉴명/코드
          </div>
          <div class="px-2 py-1 border border-gray-400 rounded-br-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchMenuList"
              v-model="searchword1" />
          </div>
        </div>
        <div class="ml-10 mt-5 w-full h-[25vh]">
          <Realgrid
            class="w-full h-[200%]"
            :progname="'MST01_033INS_VUE'"
            :progid="1"
            :reload="reload"
            :rowData="rowData2"
            :showCheckBar="false"
            :searchColId="'lngCode,strName'"
            :searchColId3="['lngMainGroup', 'lngSubGroup']"
            :searchValue="searchValue"
            :searchWord3="searchword1"
            :valuesData="valuesData2"
            :labelsData="labelsData2"
            :labelingColumns="'blnInactive'"
            @clickedRowData="clickedRowData2"
            @allStateRows="allStateRows2"
            @selectedIndex2="selectedIndex3"
            :activeSearchSpecial="true"
            :changeColid="changeColid"
            :changeRow="changeRow"
            :changeValue2="changeValue"
            :changeNow="changeNow2"
            :rowStateeditable="rowStateeditable"
            @updatedRowData="updatedRowData2"
            @realgridname="realgridname"></Realgrid>
        </div>
      </div>
      <!-- 탭2 영역\-->
      <!-- 탭3 영역\-->

      <div class="ml-10 mt-5 w-full h-[25vh]" v-show="currentMenu == 3">
        <Realgrid
          class="h-[170%]"
          :progname="'MST44_064INS_VUE'"
          :progid="3"
          :rowData="rowData3"
          :valuesData="valuesData"
          :labelsData="labelsData"
          :changeColid="changeColid"
          :changeRow="changeRow"
          :changeValue2="changeValue"
          :changeNow="changeNow3"
          :labelingColumns="'lngPrintType'"
          :rowStateeditable="false"
          @selectedIndex2="selectedIndex4"
          @updatedRowData="updatedRowData3"
          @clickedRowData="clickedRowData3"
          @realgridname="realgridname3"></Realgrid>
      </div>

     <div class="h-[50vh]" v-show="currentMenu == 4">
        <div class="h-[15vh] w-[45vw] ml-10 mt-5" v-show="currentMenu == 4">
          <div class="w-full h-full ">
                  <!-- 그리드 영역 -->
            <Realgrid class="w-[100%] h-[130%] " :progname="'MST44_062INS_VUE'" :progid="3" :reload="reload" :rowStateeditable="false"
              :rowData="rowData4" @clickedRowData="clickedRowData4" @realgridname="realgridname4" @selectedIndex2="selectedIndex5"
              @updatedRowData="updatedRowData4" :changeColid="changeColid" :changeRow="changeRow" :changeNow="changeNow4"
              :changeValue2="changeValue" :initSelect="false" ></Realgrid>
          </div>
                <!-- 그리드 영역 -->
        </div>

        <div v-show="currentMenu == 4" class="mt-12 flex flex-col justify-start ml-10 h-[35vh] w-[45vw] rounded-lg ">
          <h1 class="text-xl font-bold flex justify-start">영수증 문구</h1>
          <div class="grid grid-rows-[1fr,4fr] grid-cols-[2fr,9fr] h-[70%]">
            <div class="bg-gray-100 flex justify-center items-center rounded-tl-lg border border-gray-600">
              영수증 상단 문구
            </div>
            <div
              class="justify-center items-center rounded-tr-lg border border-gray-600 grid grid-rows-2 grid-cols-1 w-full px-2 py-2 gap-1">
              <div class=" w-full h-full px-2 py-2 rounded-lg  text-red-500">
                ({{ receiptUByte }}byte)
              </div>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                v-model="receiptU" @input="handleInput" @click="caculateByte3" :disabled="!afterSearch4"
               >
              </input>
            </div>
            <div class="bg-gray-100 flex justify-center items-center rounded-bl-lg border border-gray-600">
              영수증 하단 문구
            </div>
            <div
              class="justify-center items-center rounded-br-lg border border-gray-600 grid grid-rows-6 grid-cols-1 w-full px-2 py-2 gap-1">
              <div class=" w-full h-full px-2 py-2 rounded-lg  flex justify-center text-red-500">({{ receiptDByte }}byte)
              </div>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                :value="receiptD1" name="receiptD1"  @input="handleInput2" @blur="handleBlur" @click="selecedReceiptSection(1)"
                :disabled="!afterSearch4"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                 :value="receiptD2"  name="receiptD2" @input="handleInput2" @blur="handleBlur" @click="selecedReceiptSection(2)"
                :disabled="!afterSearch4"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                 :value="receiptD3"  name="receiptD3" @input="handleInput2" @blur="handleBlur" @click="selecedReceiptSection(3)"
                :disabled="!afterSearch4"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                 :value="receiptD4"  name="receiptD4" @input="handleInput2"  @blur="handleBlur" @click="selecedReceiptSection(4)"
                :disabled="!afterSearch4"></input>
              <input class="border w-full h-full px-2 py-2 rounded-lg border-gray-600 flex justify-start "
                 :value="receiptD5" name="receiptD5"  @input="handleInput2" @blur="handleBlur" @click="selecedReceiptSection(5)"
                :disabled="!afterSearch4"></input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-[45%] h-[20%] grid grid-rows-2 grid-cols-1 ml-28 -mt-2"
      v-if="currentMenu == 1">
      <div class="font-bold text-xl flex justify-start items-center">
        상세정보
      </div>
      <div class="w-full h-full flex justify-start items-center">
        <div class="grid grid-rows-2 grid-cols-[3fr,7fr] w-[93%] h-full">
          <div
            class="rounded-tl-lg border flex justify-center items-center bg-gray-100">
            주방출력그룹코드
          </div>
          <div class="rounded-tr-lg border h-full py-1 px-1 flex items-center">
            <input
              type="text"
              name="lngGroupCd"
              class="w-full border rounded-lg disabled:bg-gray-100 pl-1"
              v-model="clickedNo"
              @input="changeValues"
              :disabled="tempDisabled" />
          </div>
          <div
            class="rounded-bl-lg border flex justify-center items-center bg-gray-100">
            주방출력그룹명
          </div>
          <div class="rounded-br-lg border h-full py-1 px-1 flex items-center">
            <input
              type="text"
              name="lngGroupNm"
              class="w-full border rounded-lg pl-1 disabled:bg-gray-100"
              v-model="clickedNm"
              :disabled="tempDisabled2"
              @input="changeValues" />
          </div>
        </div>
      </div>
    </div>
    <div class="w-[41%] h-[15%] ml-28 -mt-2" v-if="currentMenu == 2">
      <div class="font-bold text-xl flex justify-start items-center">
        상세정보
      </div>
      <div class="grid grid-rows-3 grid-cols-[3fr,7fr] h-full w-full mt-2">
        <div
          class="border rounded-tl-lg bg-gray-100 items-center justify-center flex">
          메뉴코드
        </div>
        <div class="border rounded-tr-lg">
          <input
            type="text"
            v-model="selectedmenuCode"
            disabled
            class="h-full w-full border rounded-lg pl-1" />
        </div>
        <div class="border bg-gray-100 items-center justify-center flex">
          메뉴명
        </div>
        <div class="border">
          <input
            type="text"
            v-model="selectedmenuNm"
            disabled
            class="h-full w-full border rounded-lg pl-1" />
        </div>
        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력그룹
        </div>
        <div class="border rounded-br-lg">
          <select
            name=""
            id=""
            :disabled="afterClick"
            class="h-full w-full border rounded-lg pl-1 disabled:bg-gray-100"
            v-model="selectedKitchenGroup"
            @change="setMenuKPG">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="w-[40%] h-[60%] -mt-2" v-if="currentMenu == 3">
      <div class="font-bold text-xl flex justify-start items-center ml-32">
        상세정보
      </div>
      <div class="grid grid-rows-12 grid-cols-4 h-full w-full mt-2 ml-32">
        <div
          class="border rounded-tl-lg bg-gray-100 items-center justify-center flex">
          POS번호
        </div>
        <div class="border rounded-tr-lg">
          <input
            type="text"
            v-model="gridValue1"
            disabled
            class="h-full w-full border rounded-lg pl-1" />
        </div>
        <div class="border bg-gray-100 items-center justify-center flex">
          Port연결ID
        </div>
        <div class="border">
          <input
            type="text"
            v-model="gridValue2"
            disabled
            class="h-full w-full border rounded-lg pl-1" />
        </div>
        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          출력유형
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPrintType"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue3"
            @change="changePortKitchenPrint">
            <option :value="''">선택</option>
            <option :value="i.strDCode" v-for="i in printTypeList">
              {{ i.strDName }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          출력코너명
        </div>
        <div class="border rounded-br-lg">
          <input
            type="text"
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue4"
            @input="changePortKitchen" />
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호1
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen1"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue5"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호2
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen2"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue6"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호3
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen3"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue7"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호4
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen4"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue8"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호5
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen5"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue9"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호6
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen6"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue10"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호7
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen7"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue11"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호8
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen8"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue12"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호9
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen9"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue13"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호10
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen10"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue14"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호11
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen11"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue15"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호12
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen12"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue16"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호13
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen13"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue17"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호14
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen14"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue18"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호15
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen15"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue19"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호16
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen16"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue20"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호17
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen17"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue21"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호18
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen18"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue22"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호19
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen19"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue23"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>

        <div
          class="border rounded-bl-lg bg-gray-100 items-center justify-center flex">
          주방출력번호20
        </div>
        <div class="border rounded-br-lg">
          <select
            name="lngPKitchen20"
            id=""
            :disabled="afterClick3"
            class="h-full w-full border rounded-lg pl-1"
            v-model="gridValue24"
            @change="changePortKitchenPrint">
            <option :value="0">선택</option>
            <option :value="i.lngGroupCd" v-for="i in KitchenGroup">
              {{ i.lngGroupNm }}
            </option>
          </select>
        </div>
      </div>
    </div>

     <div class="w-[52%] h-[20%] ml-10 mt-44 flex flex-col justify-center" v-if="currentMenu == 4">
      <div class="font-bold text-xl flex justify-start items-center mt-28 ml-60">영수증 예시</div>
      <div class="flex justify-start items-center h-[45vh] w-[20vw] bg-gray-100 ml-28 mt-20">
        <div class="w-full h-[130%] bg-white p-5 border shadow-lg rounded-lg">
          <!-- 상단 수정 가능 영역 -->
          <div class="text-center space-y-2">
            <input type="text" v-model="receiptU" class="flex justify-start w-full disabled:bg-white"  disabled>
            <div>{{receiptP1}}</div>
            <div>{{ receiptP3 }}</div>
            <div>{{receiptP2}}</div>
          </div>
          <hr class="my-3 border-gray-300" />

          <!-- 영수증 본문 -->
          <div class="text-sm">
            <div class="flex justify-between">
              <span>YYYY-MM-DD 00:00:00</span>
              <span>01-0001</span>
            </div>
            <div class="mt-1 flex justify-end">
              <span>T:01 Guest Type: 0 Count: 0</span>
            </div>
            <hr class="my-3 border-gray-300" />

            <!-- 메뉴 리스트 -->
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>메뉴1</span>
                <span>1</span>
                <span>0</span>
              </div>
              <div class="flex justify-between">
                <span>메뉴2</span>
                <span>2</span>
                <span>0</span>
              </div>
            </div>
            <hr class="my-3 border-gray-300" />

            <!-- 합계 -->
            <div class="flex justify-between font-semibold">
              <span>합 계</span>
              <span>0</span>
            </div>
            <div class="flex justify-between">
              <span>부가세 과세 물품 가액</span>
              <span>0</span>
            </div>
            <div class="flex justify-between">
              <span>부가세</span>
              <span>0</span>
            </div>
            <hr class="my-3 border-gray-300" />

            <!-- 하단 수정 가능 영역 -->
            <div class="flex justify-between font-semibold">
              <span>현 금</span>
              <div>0</div>
            </div>
            <div class="text-sm mt-1 flex justify-between">
              <span>IN-00:00:00</span>
              <span class="float-right">CASHIER: 점장</span>
            </div>

            <div class="flex flex-col mt-2">

              <input type="text" v-model="receiptD1" disabled class="disabled:bg-white">
              <input type="text" v-model="receiptD2"  disabled class="disabled:bg-white">
              <input type="text" v-model="receiptD3"  disabled class="disabled:bg-white">
              <input type="text" v-model="receiptD4"  disabled class="disabled:bg-white">
              <input type="text" v-model="receiptD5"  disabled class="disabled:bg-white">

            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
  <!-- 탭3 영역\-->
</template>

<script setup>
import {
  getKitchenGroupList,
  getKitchenGroupList2,
  getKitchenPortList,
  getMenuCodeEnroll,
  getMenuList,
  getMstBasic,
  getStorePosList,
  saveKitchenGroupList,
  saveMenuKPG,
  savePortKitchenConfig,
  saveReceiptData,
} from "@/api/master";
/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";

import { getCommonList } from "@/api/common";
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

const valuesData = ref([]);
const labelsData = ref([]);
const valuesData2 = ref([[0, 1]]);
const labelsData2 = ref([["사용", "미사용"]]);
const printTypeList = ref([]);
const gridValue1 = ref("");
const gridValue2 = ref("");
const gridValue3 = ref("");
const gridValue4 = ref("");
const gridValue5 = ref("");
const gridValue6 = ref("");
const gridValue7 = ref("");
const gridValue8 = ref("");
const gridValue9 = ref("");
const gridValue10 = ref("");
const gridValue11 = ref("");
const gridValue12 = ref("");
const gridValue13 = ref("");
const gridValue14 = ref("");
const gridValue15 = ref("");
const gridValue16 = ref("");
const gridValue17 = ref("");
const gridValue18 = ref("");
const gridValue19 = ref("");
const gridValue20 = ref("");
const gridValue21 = ref("");
const gridValue22 = ref("");
const gridValue23 = ref("");
const gridValue24 = ref("");
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getCommonList(402);

  //comsole.log(res);
  labelsData.value = [["", ...res.data.List.map((item) => item.strDName)]];
  valuesData.value = [["", ...res.data.List.map((item) => item.strDCode)]];

  //comsole.log(labelsData.value);
  printTypeList.value = res.data.List;
 
  //console.log(store.state.userData.lngCommonMenu)
     if (
      store.state.userData.lngCommonMenu == '1'
    ) {
    
       setTimeout(() => {
        hidesub.value = true
       },100)
      hidesub.value = false;
    } else {
         setTimeout(() => {
        hidesub.value = false
       },100)
      hidesub.value = true;
    }

});

const currentMenu = ref(1);
const realgrid2Name = ref("");
const realgrid3Name = ref("");
const realgrid4Name = ref("");
const realgrid5Name = ref("");
const selectedKitchenGroup = ref("");
const selectedmenuNm = ref("");
const selectedmenuCode = ref("");
const KitchenGroup = ref([]);
const searchValue = ref([-1, -1]);
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
  realgrid5Name.value = e;
};

const searchSpecialColId = ref([]);
const searchSpecialCond = ref(true);
watch(currentMenu, () => {
  const reagrid2 = document.getElementById(realgrid2Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid2).resetSize();
    RealGrid.getGridInstance(reagrid2).refresh(true);
  }, 100);
  const reagrid3 = document.getElementById(realgrid3Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid3).resetSize();
    RealGrid.getGridInstance(reagrid3).refresh(true);
  }, 100);
  const reagrid4 = document.getElementById(realgrid4Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid4).resetSize();
    RealGrid.getGridInstance(reagrid4).refresh(true);
  }, 100);

  const reagrid5 = document.getElementById(realgrid5Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(reagrid5).resetSize();
    RealGrid.getGridInstance(reagrid5).refresh(true);
  }, 100);
});

// 더미 데이터
const items = ref([]);
const afterClick = ref(true);
const afterClick2 = ref(true);
const afterClick3 = ref(true);
const ScreenKeyOrigin = ref([]);
const ScreenKeys = ref();
const updatedList = ref();
const updatedList2 = ref();
const updatedList3 = ref();
const forsearchMain = ref("-1");
const forsearchSub = ref("-1");
const ischecked = ref(false);
const rowStateeditable = ref(false);
const changeMode = ref(false);
const fixedColumn = ref(true);

const clickedNm = ref("");
const clickedNo = ref();
const clickedStoreNm = ref();
const clickedGroupNm = ref();
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
/**
 * 페이지 매장 그룹 이름 세팅
 */

const handleGroupNm = (newData) => {
  clickedGroupNm.value = newData;
};
const showPopup2 = ref(false);
const showPopup3 = ref(false);

const confirmitem = ref([]);
const confirmitem2 = ref([]);
const confirmitem3 = ref([]);
const reloadit = ref(true);

/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();
const addrowDefault = ref();
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);

const showMenus = async (value) => {
  if (value == 1) {
    currentMenu.value = 1;
     if (
      store.state.userData.lngCommonMenu == '1'
    ) {
      hidesub.value = false;
    } else {
      hidesub.value = true;
    }
    hidesub.value = false;
  } else if (value == 2) {
    currentMenu.value = 2;
      if (
      store.state.userData.lngCommonMenu == '1'
    ) {
      hidesub.value = false;
    } else {
      hidesub.value = true;
    }

    // const res = await getMenuCodeEnroll(groupCd.value, nowStoreCd.value);
    // //comsole.log(res);
    // rowData2.value = res.data.MENULIST;
    // updatedList2.value = JSON.parse(JSON.stringify(rowData2.value));
    // const res2 = await getMenuList(groupCd.value, nowStoreCd.value);
    // //rowData2.value = res2.data.menuList
    // SubMenuGroup.value = res2.data.submenuGroup;
    // MenuGroup.value = res2.data.menuGroup;
    // ////console.log(MenuGroup.value);
    // ////console.log(res2);
    // const res3 = await getKitchenGroupList2(groupCd.value, nowStoreCd.value);

    // KitchenGroup.value = res3.data.List;
    // afterSearch2.value = true;
  } else if (value == 3) {
    currentMenu.value = 3;
    // nowStoreCd.value = saveStoreCode.value;
    // const res3 = await getKitchenGroupList2(groupCd.value, nowStoreCd.value);

    // KitchenGroup.value = res3.data.List;
    hidesub.value = true;
  } else {
    currentMenu.value = value;
    hidesub.value = true
  }
};

const hidesub = ref(false);

const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //   //comsole.log(nowStoreAreaCd.value);
};
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updatedList.value = newValue;
};

const forSaveMenu = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData2 = (newValue) => {
  //comsole.log(newValue);
  updatedList2.value = newValue;
};
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData3 = (newValue) => {
  //comsole.log(newValue);
  updatedList3.value = newValue;
};

const setMenuKPG = (e) => {
  changeColid.value = "lngKPG";
  changeValue.value = e.target.value;
  changeNow2.value = !changeNow2.value;
};
const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */
const saveStoreCode = ref("");
const receiptP1 = ref('')
const receiptP2 = ref('')
const receiptP3 = ref('')
const handleStoreCd = async (newValue) => {
  saveStoreCode.value = newValue;

    const res = await getMstBasic(store.state.userData.lngStoreGroup , saveStoreCode.value)
   
  if(res.data.List.length > 0){
  receiptP1.value = res.data.List[0].strName + ' ' + res.data.List[0].strTel
  receiptP2.value = res.data.List[0].strRegistNo.slice(0,3) + '-' + res.data.List[0].strRegistNo.slice(3,6) + '-' + res.data.List[0].strRegistNo.slice(6,11)
    receiptP3.value = res.data.List[0].strAddr
  } else {
    receiptP1.value = ''
    receiptP2.value = ''
    receiptP3.value = ''
  }

  ////console.log(newValue);
  // afterClick2.value = true;
  // afterClick.value = true;
  afterClick3.value = true;

  if (rowData3.value.length != 0) {
    rowData3.value = [];
    updatedList3.value = [];
  }
  if (rowData4.value.length != 0) {
    rowData4.value = [];
    updatedList4.value = [];
  }
  initGrid3();
};
const KDSList = ref();
const reload = ref(false);
const KDSSettingList = ref();
const Category = ref([]);
const changeValue = ref("");
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);
const changeNow = ref(false);
const changeNow2 = ref(false);
const changeColid = ref("");

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  changeRow.value = e;
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex3 = (e) => {
  changeRow.value = e;
};
/**
 * 수정용 데이터 행 설정
 */

const selectedIndex4 = (e) => {
  changeRow.value = e;
};
const selectedIndex5 = (e) => {
  changeRow.value = e;
};
const changeValues = (e) => {
  if (e.target.name == "lngGroupCd") {
    changeColid.value = "lngGroupCd";
    if (/[^\d-]/.test(e.target.value)) {
      clickedNo.value = e.target.value.replace(/[^\d-]/g, "");
      return;
    }
  } else {
    changeColid.value = "lngGroupNm";
  }
  changeValue.value = e.target.value;
  changeNow.value = !changeNow.value;
};
const store = useStore();
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref();
/**
 *  그리드 검색어 세팅
 */

const searchword3 = ref();
const userData = store.state.userData;

const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const afterSearch2 = ref(false);
const afterSearch3 = ref(false);
const afterSearch4 = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const checked = ref();
/**
 * 추가 버튼 함수
 */

const addRows = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRows = ref(false);
/**
 * 추가 버튼 함수
 */

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

  addrowDefault.value = clickedGroupNm.value + "," + groupCd.value;
  addRows.value = !addRows.value;
  //   addrowDefault.value = userData.strStoreGroupName;
  //   //comsole.log(updatedList.value);
  //   if (updatedList.value == undefined || updatedList.value[0] == undefined) {
  //     addrowDefault.value += "," + 1;
  //   } else {
  //     const maxKdsCornerNum = Math.max(
  //       ...updatedList.value.map((item) => item.kdsCornerNum)
  //     );
  //     //comsole.log(maxKdsCornerNum);
  //     addrowDefault.value += "," + (maxKdsCornerNum + 1);
  //     //comsole.log(addrowDefault.value);
  //   }
};
const rowData = ref([]);
const rowData2 = ref([]);
const rowData3 = ref([]);
const kdsList = ref([]);
const originRowData2 = ref([]);
const changeNow3 = ref(false);
const changePortKitchenPrint = (e) => {
  changeColid.value = e.target.name;
  changeValue.value = e.target.value;
  changeNow3.value = !changeNow3.value;
};

const changePortKitchen = (e) => {
  changeColid.value = "strName";
  changeValue.value = e.target.value;
  changeNow3.value = !changeNow3.value;
};
/**
 * 그리드 행 삭제 버튼 함수
 */

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

/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (newValue) => {
  //comsole.log(newValue);
};
/**
 *  조회 함수
 */
const rowData4 = ref([])
const searchButton = async () => {
  changeMode.value = false;
  Category.value = [];
  items.value = [];
  ////console.log(nowStoreCd.value);
  if (currentMenu.value == 3 || currentMenu.value == 4) {
    if (saveStoreCode.value== "0" || saveStoreCode.value == undefined) {
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
  }

  try {
    store.state.loading = true;
    let res;
    
      if (store.state.userData.lngCommonMenu == "1" && currentMenu.value != '4') {
          nowStoreCd.value = 0;
      } else if (
        store.state.userData.lngCommonMenu == "0" &&
        currentMenu.value !== '4'
      ) {
        nowStoreCd.value = saveStoreCode.value
      } else {
        nowStoreCd.value = saveStoreCode.value
      }



    if (currentMenu.value == 1 || currentMenu.value == 2) {
      res = await getKitchenGroupList(groupCd.value);
      let store2 = ''
        if (store.state.userData.lngCommonMenu == "1") {
        store2 = 0
      } else {
        store2 = nowStoreCd.value
      }
      const res2 = await getMenuCodeEnroll(groupCd.value, store2);
      const res3 = await getMenuList(groupCd.value, store2);
       const res4 = await getKitchenGroupList2(groupCd.value, store2);

      KitchenGroup.value = res4.data.List;
      SubMenuGroup.value = res3.data.submenuGroup;
      MenuGroup.value = res3.data.menuGroup;

      rowData2.value = res2.data.MENULIST;
      updatedList2.value = JSON.parse(JSON.stringify(rowData2.value));
      confirmitem2.value = JSON.parse(JSON.stringify(rowData2.value));

      rowData.value = res.data.List;

      updatedList.value = rowData.value;
      confirmitem.value = JSON.parse(JSON.stringify(rowData.value));
      afterSearch.value = true;
      afterSearch2.value = true;
    }  else if (currentMenu.value == '4' || currentMenu.value == '3'){

       const res2 = await getKitchenPortList(
        groupCd.value,
        saveStoreCode.value,
        nowStoreAreaCd.value
      );
      rowData3.value = res2.data.List;
      console.log(rowData3.value)
      updatedList3.value = JSON.parse(JSON.stringify(rowData3.value));
      confirmitem3.value = JSON.parse(JSON.stringify(rowData3.value));
      afterSearch3.value = true;

      receiptD1.value = ''
      receiptD2.value = ''
      receiptD3.value = ''
      receiptD4.value = ''
      receiptD5.value = ''
      receiptU.value = ''

    
      receiptDByte.value = ''
      receiptUByte.value = ''
      rowData4.value = []
      res = await getStorePosList(groupCd.value, saveStoreCode.value)
      console.log(res)
      rowData4.value = res.data.RECEIPTLIST
      afterSearch4.value = true


    } 
  } catch (error) {
    console.log(error);
    store.state.loading = false;
  } finally {
    //comsole.log(KDSList.value);
    // nowStoreCd.value = saveStoreCode.value;
    ischecked.value = false;

    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    clickedNo.value = "";
    clickedNm.value = "";
    selectedKitchenGroup.value = "";
    selectedmenuNm.value = "";
    selectedmenuCode.value = "";
    // afterClick.value = true;
    // afterClick2.value = true;
    // afterClick3.value = true;
    tempDisabled2.value = true;
    forsearchSub.value = -1;
    forsearchMain.value = -1;
  }
};
const filteredSubMenuGroup = ref([]);
const alreadyCheckedList = ref([]);
const forSaveMenu2 = ref([]);

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

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};

/**
 *  저장 버튼 함수
 */

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
  } else if (currentMenu.value == '4'){
     if (afterSearch4.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else {
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
    if (
      JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value) &&
      forDeleteRows.value.length == 0
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 2) {
    if (
      JSON.stringify(confirmitem2.value) === JSON.stringify(updatedList2.value)
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 3) {
    if (
      JSON.stringify(confirmitem3.value) === JSON.stringify(updatedList3.value)
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
  } else if (currentMenu.value == 4) {
    if (
      JSON.stringify(rowData4.value) === JSON.stringify(updatedList4.value)
    ) {
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
    const allAreNumbers = updatedList.value
      .map((item) => item.lngGroupCd)
      .every((val) => !isNaN(val) && val !== "");

    if (allAreNumbers == false) {
      Swal.fire({
        title: "경고",
        text: "숫자가 아닌 값이 입력되었습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    const set = new Set(updatedList.value.map((item) => item.lngGroupCd));

    if (set.size !== updatedList.value.length) {
      Swal.fire({
        title: "경고",
        text: "중복된 그룹번호가 입력되었습니다.",
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
          const dgroupcd = updatedList.value
            .filter((_, index) => forDeleteRows.value.includes(index))
            .map((item2) => item2.lngStoreGroup);
          const dgroupcd2 = updatedList.value
            .filter((_, index) => forDeleteRows.value.includes(index))
            .map((item2) => item2.lngGroupCd);

          /**
           * 페이지 매장 그룹 세팅
           */

          const lngStoreGroups = updatedList.value
            .filter((_, index) => !forDeleteRows.value.includes(index))
            .map((item) => item.lngStoreGroup);
          const groupCds = updatedList.value
            .filter((_, index) => !forDeleteRows.value.includes(index))
            .map((item) => item.lngGroupCd);

          const groupNms = updatedList.value
            .filter((_, index) => !forDeleteRows.value.includes(index))
            .map((item) => item.lngGroupNm);

          res = await saveKitchenGroupList(
            dgroupcd.join("\u200B"),
            dgroupcd2.join("\u200B"),
            lngStoreGroups.join("\u200B"),
            groupCds.join("\u200B"),
            groupNms.join("\u200B"),
            store.state.userData.loginID
          );
        } else if (currentMenu.value == 2) {
          //comsole.log(forSaveMenu.value);
          const filteredSave = updatedList2.value.filter((_, index) =>
            forSaveMenu.value.includes(index)
          );
          res = await saveMenuKPG(
            groupCd.value,
            nowStoreCd.value,
            filteredSave.map((item) => item.lngCode).join("\u200B"),
            filteredSave.map((item) => item.lngKPG).join("\u200B")
          );
          ////console.log(res);
        } else if (currentMenu.value == 3) {
          updatedList3.value;

          /**
           * 페이지 매장 그룹 세팅
           */

          const lngStoreGroups = updatedList3.value
            .map((item) => item.lngStoreGroup)
            .join("\u200B");
          /**
           * 페이지 매장 코드 세팅
           */

          const lngStoreCodes = updatedList3.value
            .map((item) => item.lngStoreCode)
            .join("\u200B");
          const lngAreaCodes = updatedList3.value
            .map((item) => item.lngAreaCode)
            .join("\u200B");
          const intPosNos = updatedList3.value
            .map((item) => item.intPosNo)
            .join("\u200B");
          const lngPositions = updatedList3.value
            .map((item) => item.lngPosition)
            .join("\u200B");
          const lngPrintTypes = updatedList3.value
            .map((item) => item.lngPrintType)
            .join("\u200B");
          const lngPKitchen1s = updatedList3.value
            .map((item) => item.lngPKitchen1)
            .join("\u200B");
          const lngPKitchen2s = updatedList3.value
            .map((item) => item.lngPKitchen2)
            .join("\u200B");
          const lngPKitchen3s = updatedList3.value
            .map((item) => item.lngPKitchen3)
            .join("\u200B");
          const lngPKitchen4s = updatedList3.value
            .map((item) => item.lngPKitchen4)
            .join("\u200B");
          const lngPKitchen5s = updatedList3.value
            .map((item) => item.lngPKitchen5)
            .join("\u200B");
          const lngPKitchen6s = updatedList3.value
            .map((item) => item.lngPKitchen6)
            .join("\u200B");
          const lngPKitchen7s = updatedList3.value
            .map((item) => item.lngPKitchen7)
            .join("\u200B");
          const lngPKitchen8s = updatedList3.value
            .map((item) => item.lngPKitchen8)
            .join("\u200B");
          const lngPKitchen9s = updatedList3.value
            .map((item) => item.lngPKitchen9)
            .join("\u200B");
          const lngPKitchen10s = updatedList3.value
            .map((item) => item.lngPKitchen10)
            .join("\u200B");
          const lngPKitchen11s = updatedList3.value
            .map((item) => item.lngPKitchen11)
            .join("\u200B");
          const lngPKitchen12s = updatedList3.value
            .map((item) => item.lngPKitchen12)
            .join("\u200B");
          const lngPKitchen13s = updatedList3.value
            .map((item) => item.lngPKitchen13)
            .join("\u200B");
          const lngPKitchen14s = updatedList3.value
            .map((item) => item.lngPKitchen14)
            .join("\u200B");
          const lngPKitchen15s = updatedList3.value
            .map((item) => item.lngPKitchen15)
            .join("\u200B");
          const lngPKitchen16s = updatedList3.value
            .map((item) => item.lngPKitchen16)
            .join("\u200B");
          const lngPKitchen17s = updatedList3.value
            .map((item) => item.lngPKitchen17)
            .join("\u200B");
          const lngPKitchen18s = updatedList3.value
            .map((item) => item.lngPKitchen18)
            .join("\u200B");
          const lngPKitchen19s = updatedList3.value
            .map((item) => item.lngPKitchen19)
            .join("\u200B");
          const lngPKitchen20s = updatedList3.value
            .map((item) => item.lngPKitchen20)
            .join("\u200B");

          const strNames = updatedList3.value
            .map((item) => item.strName)
            .join("\u200B");

          res = await savePortKitchenConfig(
            lngStoreGroups,
            lngStoreCodes,
            lngAreaCodes,
            intPosNos,
            lngPositions,
            lngPrintTypes,
            lngPKitchen1s,
            lngPKitchen2s,
            lngPKitchen3s,
            lngPKitchen4s,
            lngPKitchen5s,
            lngPKitchen6s,
            lngPKitchen7s,
            lngPKitchen8s,
            lngPKitchen9s,
            lngPKitchen10s,
            lngPKitchen11s,
            lngPKitchen12s,
            lngPKitchen13s,
            lngPKitchen14s,
            lngPKitchen15s,
            lngPKitchen16s,
            lngPKitchen17s,
            lngPKitchen18s,
            lngPKitchen19s,
            lngPKitchen20s,
            strNames
          );
        } else if ( currentMenu.value == '4'){
          const posNos = updatedList4.value.map(item => item.intPosNo)
          const areaCodes = updatedList4.value.map(item => item.lngAreaCode)
          const strreceipts = updatedList4.value.map(item => item.strReceiptU)
          const strreceipts2 = updatedList4.value.map(item => item.strReceiptD)

          res = await saveReceiptData(groupCd.value, saveStoreCode.value, posNos.join(','), areaCodes.join(','), strreceipts.join(','), strreceipts2.join(','))
          console.log(res)
        }

        //comsole.log(res);
      } catch (error) {
      } finally {
        store.state.loading = false;
        Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });

        searchButton();
        reload.value = !reload.value;
      }
    }
  });
};

const changeRow = ref();
const currentRowState = ref("none");
const tempDisabled = ref(true);
const tempDisabled2 = ref(true);
const forDeleteRows = ref([]);
/**
 * 상태 변화된 행 세팅
 */

const allStateRows = (e) => {
  forDeleteRows.value = e.deleted;
  //comsole.log(forDeleteRows.value);
};
/**
 * 상태 변화된 행 세팅
 */

const allStateRows2 = (e) => {
  forSaveMenu.value = e.updated;
  //comsole.log(e);
};
const sendRowState = (e) => {
  //comsole.log(e);
  currentRowState.value = e;

  if (e == "created") {
    tempDisabled.value = false;
  } else {
    tempDisabled.value = true;
  }
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  if (newValue == undefined) {
    return;
  }
  afterClick.value = true;
  //comsole.log(newValue);
  clickedNo.value = newValue[1];
  clickedNm.value = newValue[2];
  //changeRow.value = newValue.index;
  //comsole.log(changeRow.value);
  tempDisabled2.value = false;
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData2 = (newValue) => {
  if (newValue == undefined) {
    return;
  }
  afterClick.value = false;
  //   //comsole.log(newValue[16]);
  //comsole.log(newValue);
  selectedmenuCode.value = newValue[0];
  selectedmenuNm.value = newValue[1];
  selectedKitchenGroup.value = newValue[16];
  //   clickedNo.value = newValue[1];
  //   clickedNm.value = newValue[2];
  //   //changeRow.value = newValue.index;
  //   //comsole.log(changeRow.value);
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData3 = (newValue) => {
  if (newValue == undefined) {
    return;
  }
  afterClick3.value = false;
  //comsole.log(newValue);
  gridValue1.value = newValue[3];
  gridValue2.value = newValue[4];
  gridValue3.value = newValue[5];
  gridValue4.value = newValue[26];

  gridValue5.value = newValue[6];
  gridValue6.value = newValue[7];
  gridValue7.value = newValue[8];
  gridValue8.value = newValue[9];
  gridValue9.value = newValue[10];
  gridValue10.value = newValue[11];
  gridValue11.value = newValue[12];
  gridValue12.value = newValue[13];
  gridValue13.value = newValue[14];
  gridValue14.value = newValue[15];
  gridValue15.value = newValue[16];
  gridValue16.value = newValue[17];
  gridValue17.value = newValue[18];
  gridValue18.value = newValue[19];
  gridValue19.value = newValue[20];
  gridValue20.value = newValue[21];
  gridValue21.value = newValue[22];
  gridValue22.value = newValue[23];
  gridValue23.value = newValue[24];
  gridValue24.value = newValue[25];
};

/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  MenuKeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  MenuList.value = [];
  ScreenKeys.value = [];
  items.value = [];
  forsearchMain.value = "0";
  forsearchSub.value = "0";
  filteredSubMenuGroup.value = [];
  searchword1.value = "";
  searchword3.value = "";

};

/**
 * 그리드 초기화
 */

const initGrid3 = () => {
  gridValue1.value = "";
  gridValue2.value = "";
  gridValue3.value = "";
  gridValue4.value = "";
  gridValue5.value = "";
  gridValue6.value = "";
  gridValue7.value = "";
  gridValue8.value = "";
  gridValue9.value = "";
  gridValue10.value = "";
  gridValue11.value = "";
  gridValue12.value = "";
  gridValue13.value = "";
  gridValue14.value = "";
  gridValue15.value = "";
  gridValue16.value = "";
  gridValue17.value = "";
  gridValue18.value = "";
  gridValue19.value = "";
  gridValue20.value = "";
  gridValue21.value = "";
  gridValue22.value = "";
  gridValue23.value = "";
  gridValue24.value = "";
};


const changeNow4 = ref(false)
const receiptU = ref('')
const receiptD1 = ref('')
const receiptD2 = ref('')
const receiptD3 = ref('')
const receiptD4 = ref('')
const receiptD5 = ref('')
function getByteLength2(str) {
  let byteLen = 0;
 
  if(str !=undefined){
     for (let i = 0; i < str.length; i++) {
    byteLen += str.charCodeAt(i) > 127 ? 2 : 1;
  }
  return byteLen;
  } else {
    return 0
  }
 
}
function splitStringByByteLength(str, maxByteLength) {

  let chunks = [];
  let currentByteLength = 0;
  let currentChunk = "";
 
  for (const char of str) {
    const byte = getByteLength2(char)

    if (currentByteLength + byte > maxByteLength) {
      chunks.push(currentChunk); // 현재 청크를 추가
      currentChunk = ""; // 청크 초기화
      currentByteLength = 0; // 바이트 길이 초기화
    }

    currentChunk += char
    currentByteLength += byte;
  }

  // 마지막 청크 추가
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

const clickedRowData4 = (newValue) => {
  
  receiptU.value = newValue[2]
   const result = splitStringByByteLength(newValue[3], 42)

  receiptD1.value = result[0]
  receiptD2.value = result[1]
  receiptD3.value = result[2]
  receiptD4.value = result[3]
  receiptD5.value = result[4]
}

const updatedList4 = ref([])
const updatedRowData4 = (e) => {

  updatedList4.value = e
  console.log(e)
}

const handleInput = (e) => {
  changeColid.value = 'strReceiptU'
  changeValue.value = e.target.value

  changeNow4.value = !changeNow4.value

}
let isSwalOpen = false;
const handleInput2 = (e) => {
  const isValid = calculateByte2(e);
  changeColid.value = 'strReceiptD';
  if (!isValid) return;

  const name = e.target.name;
  const value = e.target.value;
  if(value == undefined) value = '';
  if (name === 'receiptD1') receiptD1.value = value;
  else if (name === 'receiptD2') receiptD2.value = value;
  else if (name === 'receiptD3') receiptD3.value = value;
  else if (name === 'receiptD4') receiptD4.value = value;
  else if (name === 'receiptD5') receiptD5.value = value;
};

const calculateByte2 = async(e) => {

let inputValue = e.target.value
//comsole.log(inputValue)
receiptDByte.value = getByteLength2(inputValue)
if (receiptDByte.value >= 43) {
  //comsole.log(inputValue)
  isSwalOpen = true ; 
    const result = await Swal.fire({
    title: '경고',
    text: '43바이트 이상 입력할 수 없습니다.',
    icon: 'warning',
    confirmButtonText: '확인'
  }).then((result) => {
    
    if (result.isConfirmed) {

      isSwalOpen = false
      while (receiptDByte.value >= 43) {
        inputValue = inputValue.slice(0, inputValue.length - 1)

      
  
        receiptDByte.value = getByteLength2(inputValue)
      }
      if (e.target.name == 'receiptD1') {
        receiptD1.value = inputValue
      } else if (e.target.name == 'receiptD2') {
        receiptD2.value = inputValue
      } else if (e.target.name == 'receiptD3') {
        receiptD3.value = inputValue
      } else if (e.target.name == 'receiptD4') {
        receiptD4.value = inputValue
      } else if (e.target.name == 'receiptD5') {
        receiptD5.value = inputValue
      }

    
    }


  }
  )


  return false;
} else {
  return true
}


}
const receiptUByte = ref('0')
const receiptDByte = ref('0')

const caculateByte3 = (e) => {
  changeColid.value = 'strReceiptU'
 
  let inputValue = e.target.value
  receiptUByte.value = getByteLength2(inputValue)
  changeValue.value = e.target.value

  changeNow4.value = !changeNow4.value
}
const selecedSection = ref()
const selecedReceiptSection = (value) => {
  changeColid.value = 'strReceiptD'
  selecedSection.value = value

  if (value == 1) {
    receiptDByte.value = getByteLength2(receiptD1.value)

  } else if (value == 2) {
    receiptDByte.value = getByteLength2(receiptD2.value)

  } else if (value == 3) {
    receiptDByte.value = getByteLength2(receiptD3.value)
  } else if (value == 4) {
    receiptDByte.value = getByteLength2(receiptD4.value)
  } else if (value == 5) {
    receiptDByte.value = getByteLength2(receiptD5.value)
  }
}

const addSpace42Text = (value) => {
  let prechangeValue = value
  
  let byteLength = getByteLength2(prechangeValue)

  while (byteLength < 42) {
    prechangeValue += ' ';  // 공백을 추가
    byteLength = getByteLength2(prechangeValue) // 바이트 길이를 다시 계산
  }
  return prechangeValue
}

const handleBlur = (e) => {
  if(isSwalOpen == true){
    return
  }

  receiptD1.value = receiptD1.value == undefined ? '' : receiptD1.value
  receiptD2.value =receiptD2.value == undefined ? '' : receiptD2.value
  receiptD3.value =receiptD3.value == undefined ? '' : receiptD3.value
  receiptD4.value = receiptD4.value == undefined ? '' : receiptD4.value
  receiptD5.value = receiptD5.value == undefined ? '' : receiptD5.value
  if(e.target.name == 'receiptD1'){
    changeValue.value = addSpace42Text(e.target.value) + addSpace42Text(receiptD2.value) + addSpace42Text(receiptD3.value) + addSpace42Text( receiptD4.value) + addSpace42Text(receiptD5.value) 
  } else if(e.target.name == 'receiptD2'){
    changeValue.value = addSpace42Text( receiptD1.value)+ addSpace42Text(e.target.value) + addSpace42Text(receiptD3.value) + addSpace42Text(receiptD4.value) + addSpace42Text(receiptD5.value) 
  } else if(e.target.name == 'receiptD3'){
    changeValue.value =addSpace42Text(receiptD1.value)+ addSpace42Text(receiptD2.value) + addSpace42Text(e.target.value)  + addSpace42Text(receiptD4.value) + addSpace42Text(receiptD5.value) 
  } else if(e.target.name == 'receiptD4'){
    changeValue.value = addSpace42Text(receiptD1.value) + addSpace42Text(receiptD2.value) +addSpace42Text(receiptD3.value)+ addSpace42Text(e.target.value) + addSpace42Text(receiptD5.value)
  } else if(e.target.name == 'receiptD5'){
    changeValue.value = addSpace42Text(receiptD1.value) + addSpace42Text(receiptD2.value) + addSpace42Text(receiptD3.value)+ addSpace42Text(receiptD4.value) + addSpace42Text(e.target.value)
  }
  

  changeNow4.value = !changeNow4.value
}
const initAllSection = async () => {
  receiptU.value = ''
  receiptD1.value = ''
  receiptD2.value = ''
  receiptD3.value = ''
  receiptD4.value = ''
  receiptD5.value = ''
  changeColid.value = 'strReceiptU'
  changeValue.value = ''
  changeNow4.value = !changeNow4.value

  await nextTick() // DOM 업데이트 기다림

  changeColid.value = 'strReceiptD'
  changeValue.value = ''
  changeNow4.value = !changeNow4.value
}

let changedupliindex = ''
let savedreceiptU = ''
let savedreceiptD1 = ''
let savedreceiptD2 = ''
let savedreceiptD3 = ''
let savedreceiptD4 = ''
let savedreceiptD5 = ''

const dupliData = () => {
  changedupliindex = changeRow.value
  savedreceiptU = receiptU.value
  savedreceiptD1 = receiptD1.value
  savedreceiptD2 = receiptD2.value
  savedreceiptD3 = receiptD3.value
  savedreceiptD4 = receiptD4.value
  savedreceiptD5 = receiptD5.value

  Swal.fire({
      title: '완료',
      text: '복사 완료',
      icon: 'success',
      confirmButtonText: '확인'
    })
    return ;
}

const dupliAllData = async() => {
  receiptU.value = savedreceiptU
  //comsole.log(savedreceiptU)
  //comsole.log(changeNow2.value)
  changeColid.value = 'strReceiptU'
  changeValue.value = savedreceiptU
  changeNow4.value = !changeNow4.value


  await nextTick()
 
  receiptD1.value = savedreceiptD1
  receiptD2.value = savedreceiptD2
  receiptD3.value = savedreceiptD3
  receiptD4.value = savedreceiptD4
  receiptD5.value = savedreceiptD5
   changeColid.value = 'strReceiptD'
   changeValue.value = savedreceiptD1 + savedreceiptD2 + savedreceiptD3 + savedreceiptD4 + savedreceiptD5

   //comsole.log(changeValue.value)
   //comsole.log(changeNow2.value)
   changeNow4.value = !changeNow4.value

}
</script>

<style scoped></style>
