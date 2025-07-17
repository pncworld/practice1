/*--############################################################################
# Filename : MST05_004INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 메뉴키 설정                          
# Date :2025-05-14                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="flex flex-col w-full overflow-y-hidden">
    <div class="flex justify-between w-full">
      <pageName></pageName>
      <div class="flex space-x-6 pr-12 pt-2">
        <button class="button search" @click="searchButton">조회</button
        ><button class="button save" @click="saveButton">저장</button
        ><button class="button copy" @click="copyButton">
          메뉴키&nbsp;복사
        </button>
        <button class="button copy" @click="copyButton2">
          메뉴키화면키&nbsp;복사
        </button>
      </div>
    </div>

    <div class="flex bg-gray-200 rounded-lg h-16 w-full items-center mt-5">
      <PickStore
        @areaCd="handleStoreAreaCd"
        @update:storeGroup="handleGroupCd"
        @update:storeCd="handleStoreCd"
        @posNo="handlePosNo"
        :showPosNo="true"
        :showScreenNo="true"
        @storeNm="handlestoreNm"
        @update:ischanged="handleinitAll"
        @screenNo="handleScreenNo"
        :showMakeScreen="true"
        :renew="renew"
        @changed2="changed2">
      </PickStore>
    </div>
  </div>
  <!-- 조회 조건 -->
  <!-- 팝업 및 그리드 영역 -->
  <br />
  <div class="z-50">
    <DupliPopUp
      :isVisible="showPopup2"
      @close="showPopup2 = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_004INS_VUE'"
      :dupliapiname="'dupliPos'"
      :progid="2"
      :poskiosk="'getStoreAndPosList'"
      :naming="'POS번호'">
    </DupliPopUp>
    <DupliPopUp2
      :isVisible="showSpecificMenukey"
      @close="showSpecificMenukey = false"
      :storeCd="nowStoreCd"
      :storeNm="clickedStoreNm"
      :areaCd="nowStoreAreaCd"
      :posNo="posNo"
      :progname="'MST01_004INS_VUE'"
      :progid="2"
      :dupliapiname="'dupliPos2'"
      :nowscreenNo="nowscreenNo"></DupliPopUp2>
  </div>

  <div
    v-if="changeScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면키 수정</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-full w-full"
            v-model="currentscreenKeyNm" />
        </div>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16">
        <button
          @click="confirmScreenKey()"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          확인
        </button>
        <button
          @click="exitScreenKey"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>

  <div
    v-if="showScreenNm == true"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-[25%] h-[40%]">
      <h2 class="text-lg font-bold">화면명을 입력하세요</h2>
      <div class="flex flex-col justify-start h-12">
        <div>
          <p>화면키명</p>
        </div>
        <div class="h-full w-full rounded-sm">
          <input
            type="text"
            class="border border-gray-400 pl-1 h-14 w-full rounded-sm"
            v-model="currentSelectedMenuNm" />
        </div>
      </div>
      <div class="flex justify-center space-x-3 w-full h-16 mt-28">
        <button
          @click="addScreenKeyf()"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          확인
        </button>
        <button
          @click="showScreenNm = false"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>
  <!-- 팝업 및 그리드 영역 -->
  <!-- 드래그 영역 -->
  <div
    v-show="showChangeScreenKey"
    class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-2/3 h-3/4 overflow-auto">
      <div class="border-gray-500 text-2xl">화면키 순서 변경</div>
      <div class="border-gray-500 text-xl">
        화면키를 끌어서 이동하면 순서가 변경됩니다.
      </div>
      <!-- VueDraggableNext 사용 -->
      <VueDraggableNext
        v-model="ScreenKeyOrigin"
        :group="{ name: 'subCategory', pull: 'clone', put: true }"
        class="space-y-2"
        :move="onMove2"
        @end="onEnd2">
        <div
          v-for="(item, index) in ScreenKeyOrigin"
          class="p-4 bg-gray-200 rounded-lg shadow-md cursor-move h-14"
          v-show="item && item.strScreenName !== ''">
          <p>{{ item.strScreenName }}</p>
        </div>
      </VueDraggableNext>

      <div class="flex justify-center space-x-3">
        <button
          @click="showScreenKeysOrder"
          class="mt-4 p-2 bg-blue-500 text-white rounded">
          닫기
        </button>
      </div>
    </div>
  </div>
  <span
    class="h-5 -mt-1 flex justify-between items-center w-[930px] ml-[680px] z-40">
    <h1 class="font-bold text-xl z-40">메뉴키 설정</h1>
    <span class="flex space-x-3 ml-32 pl-56 items-center"
      >순서변경 &nbsp; &nbsp;<label class="z-40"
        ><input
          type="radio"
          name="changingMode"
          @click.stop="changingMode(1)"
          checked />교체하기 </label
      ><label class="z-40"
        ><input
          type="radio"
          name="changingMode"
          @click.stop="changingMode(2)" />밀어내기</label
      ><button class="whitebutton z-40" @click.stop="deletekey">
        삭제
      </button></span
    >
  </span>
  <div class="flex h-5/6 w-full -mt-5">
    <div class="flex flex-col w-3/5 h-4/6">
      <div
        class="flex justify-between mt-0 ml-10 w-full border-b border-b-gray-300">
        <div>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == 1 }"
            @click="showMenus(1)">
            메뉴관리
          </button>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == 2 }"
            @click="showMenus(2)">
            TLU관리
          </button>
          <button
            class="contents_tab-button"
            :class="{ 'text-blue-600': currentMenu == 3 }"
            @click="showMenus(3)">
            화면관리
          </button>
        </div>
        <div class="mt-3">
          <!-- <button class="whitebutton" @click="searchMenuList3">조회</button> -->
          <button
            class="whitebutton"
            v-if="currentMenu == 1"
            @click="movePage1">
            추가
          </button>
          <button
            class="whitebutton"
            v-if="currentMenu == 2"
            @click="movePage2">
            추가
          </button>
        </div>
      </div>
      <div class="h-4/6" v-show="currentMenu == 1">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            메뉴분류
          </div>
          <div class="px-4 py-2 border border-gray-300 rounded-tr-lg flex">
            <select
              name="majorGroupCd"
              id=""
              class="flex-1"
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
              class="flex-1"
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
              v-model="searchword1" />
          </div>
        </div>
        <div class="ml-10 w-full h-[160%] flex flex-col">
          <Realgrid
            :progname="'MST05_011INS_VUE'"
            :progid="1"
            :rowData="MenuList"
            @selcetedrowData="selcetedrowData"
            @realgridname="realgridname3"
            :rowStateeditable="false"
            :searchColId="'menuCd,menuNm'"
            :searchColId3="['majorGroupCd', 'subGroupCd']"
            :searchValue="searchValue"
            :searchWord3="searchword1"></Realgrid>

          <div class="text-start font-semibold text-xl mt-2">색상선택</div>
          <div class="border border-gray-600">
            <div class="flex space-x-5">
              <button @click="changeMenuColor(16777215)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ffffff] border border-black"></div>
                <!-- 16777215  -->
              </button>
              <button @click="changeMenuColor(16773365)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFF0F5] border border-black"></div>
              </button>
              <button @click="changeMenuColor(16502449)">
                <!-- <-! 16773365 -> -->
                <div
                  class="w-[2vw] h-[4vh] bg-[#FBCEB1] border border-black"></div>
                <!-- 16502449 -->
              </button>
              <button @click="changeMenuColor(16777184)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFFFE0] border border-black"></div>
                <!-- 16777184 -->
              </button>
              <button @click="changeMenuColor(15138802)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#E6FFF2] border border-black"></div>
                <!-- 15138802 -->
              </button>
              <button @click="changeMenuColor(14150655)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#d6ebff] border border-black"></div>
                <!-- 14150655 -->
              </button>
              <button @click="changeMenuColor(15792383)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#F0E6FF] border border-black"></div>
                <!-- 15792383 -->
              </button>
            </div>
            <div class="flex space-x-5">
              <button @click="changeMenuColor(16772894)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFDDEE] border border-black"></div>
              </button>
              <!-- 16772894 -->

              <button @click="changeMenuColor(14737632)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#e0e0e0] border border-black"></div>
                <!-- 14737632 -->
              </button>
              <button @click="changeMenuColor(15761536)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#F08080] border border-black"></div>
                <!-- 15761536 -->
              </button>
              <button @click="changeMenuColor(16752762)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFA07A] border border-black"></div>
                <!-- 16752762 -->
              </button>
              <button @click="changeMenuColor(16777152)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ffffc0] border border-black"></div>
                <!-- 16777152 -->
              </button>
              <button @click="changeMenuColor(10025880)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#98FB98] border border-black"></div>
                <!-- 10025880 -->
              </button>
              <button @click="changeMenuColor(11393254)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ADD8E6] border border-black"></div>
                <!-- 11393254 -->
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="h-[65vh]" v-show="currentMenu == 2">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-1 gap-0 w-full">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            TLU명/코드
          </div>
          <div class="px-1 py-1 border border-gray-300 rounded-br-lg">
            <input
              type="text"
              class="border w-full h-full px-1 border-gray-400 rounded-lg"
              @input="searchMenuList2"
              v-model="searchword3" />
          </div>
        </div>
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="h-[22vh]"
            :progname="'MST05_011INS_VUE'"
            :progid="2"
            :rowData="TLUList"
            @selcetedrowData="selcetedrowData2"
            @clickedRowData="clickedRowData"
            @realgridname="realgridname"
            :searchColId="'lngCode,strName'"
            :searchWord3="searchword3"></Realgrid>
          <Realgrid
            class="h-[22vh] mt-5"
            :progname="'MST05_011INS_VUE'"
            :progid="3"
            :rowData="TLUSubList"
            @realgridname="realgridname2"></Realgrid>

          <div class="text-start font-semibold text-xl mt-2">색상선택</div>
          <div class="border border-gray-600">
            <div class="flex space-x-5">
              <button @click="changeMenuColor(16777215)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ffffff] border border-black"></div>
                <!-- 16777215  -->
              </button>
              <button @click="changeMenuColor(16773365)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFF0F5] border border-black"></div>
              </button>
              <button @click="changeMenuColor(16502449)">
                <!-- <-! 16773365 -> -->
                <div
                  class="w-[2vw] h-[4vh] bg-[#FBCEB1] border border-black"></div>
                <!-- 16502449 -->
              </button>
              <button @click="changeMenuColor(16777184)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFFFE0] border border-black"></div>
                <!-- 16777184 -->
              </button>
              <button @click="changeMenuColor(15138802)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#E6FFF2] border border-black"></div>
                <!-- 15138802 -->
              </button>
              <button @click="changeMenuColor(14150655)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#d6ebff] border border-black"></div>
                <!-- 14150655 -->
              </button>
              <button @click="changeMenuColor(15792383)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#F0E6FF] border border-black"></div>
                <!-- 15792383 -->
              </button>
            </div>
            <div class="flex space-x-5">
              <button @click="changeMenuColor(16772894)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFDDEE] border border-black"></div>
              </button>
              <!-- 16772894 -->

              <button @click="changeMenuColor(14737632)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#e0e0e0] border border-black"></div>
                <!-- 14737632 -->
              </button>
              <button @click="changeMenuColor(15761536)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#F08080] border border-black"></div>
                <!-- 15761536 -->
              </button>
              <button @click="changeMenuColor(16752762)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFA07A] border border-black"></div>
                <!-- 16752762 -->
              </button>
              <button @click="changeMenuColor(16777152)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ffffc0] border border-black"></div>
                <!-- 16777152 -->
              </button>
              <button @click="changeMenuColor(10025880)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#98FB98] border border-black"></div>
                <!-- 10025880 -->
              </button>
              <button @click="changeMenuColor(11393254)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ADD8E6] border border-black"></div>
                <!-- 11393254 -->
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full" v-show="currentMenu == 3">
        <div class="mt-7 ml-10 w-full h-[50vh]">
          <Realgrid
            class="h-full"
            :progname="'MST05_004INS_VUE'"
            :progid="4"
            :rowData="rowData"
            @selcetedrowData="selcetedrowData4"
            :searchColId="'menuCd,menuNm'"
            :searchColId3="['majorGroupCd', 'subGroupCd']"
            :searchValue="searchValue"
            :rowStateeditable="false"
            @realgridname="realgridname4"
            :searchWord3="searchword1"></Realgrid>

          <div class="text-start font-semibold text-xl mt-2">색상선택</div>
          <div class="border border-gray-600">
            <div class="flex space-x-5">
              <button @click="changeMenuColor(16777215)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ffffff] border border-black"></div>
                <!-- 16777215  -->
              </button>
              <button @click="changeMenuColor(16773365)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFF0F5] border border-black"></div>
              </button>
              <button @click="changeMenuColor(16502449)">
                <!-- <-! 16773365 -> -->
                <div
                  class="w-[2vw] h-[4vh] bg-[#FBCEB1] border border-black"></div>
                <!-- 16502449 -->
              </button>
              <button @click="changeMenuColor(16777184)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFFFE0] border border-black"></div>
                <!-- 16777184 -->
              </button>
              <button @click="changeMenuColor(15138802)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#E6FFF2] border border-black"></div>
                <!-- 15138802 -->
              </button>
              <button @click="changeMenuColor(14150655)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#d6ebff] border border-black"></div>
                <!-- 14150655 -->
              </button>
              <button @click="changeMenuColor(15792383)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#F0E6FF] border border-black"></div>
                <!-- 15792383 -->
              </button>
            </div>
            <div class="flex space-x-5">
              <button @click="changeMenuColor(16772894)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFDDEE] border border-black"></div>
              </button>
              <!-- 16772894 -->

              <button @click="changeMenuColor(14737632)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#e0e0e0] border border-black"></div>
                <!-- 14737632 -->
              </button>
              <button @click="changeMenuColor(15761536)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#F08080] border border-black"></div>
                <!-- 15761536 -->
              </button>
              <button @click="changeMenuColor(16752762)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#FFA07A] border border-black"></div>
                <!-- 16752762 -->
              </button>
              <button @click="changeMenuColor(16777152)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ffffc0] border border-black"></div>
                <!-- 16777152 -->
              </button>
              <button @click="changeMenuColor(10025880)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#98FB98] border border-black"></div>
                <!-- 10025880 -->
              </button>
              <button @click="changeMenuColor(11393254)">
                <div
                  class="w-[2vw] h-[4vh] bg-[#ADD8E6] border border-black"></div>
                <!-- 11393254 -->
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-rows-1 grid-cols-1 ml-10 w-full h-[65vh] z-20">
      <div class="flex h-[65vh] w-[950px] mt-10 ml-8" v-show="afterSearch">
        <VueDraggableNext
          v-model="items"
          :move="onMove"
          @end="onEnd"
          animation="200"
          class="grid grid-cols-5 grid-rows-9 gap-1 w-[950px] h-[65vh]">
          <div
            v-for="(item, index) in items"
            class="flex items-center justify-center h-[7vh] w-[9vw] rounded-2xl shadow-sm border border-gray-500"
            :class="{
              '!border-orange-500 border-4': clickedMenuKey == index,
            }"
            :style="{ backgroundColor: decimalToHexColor(item.lngKeyColor) }"
            @click="
              saveMenuKeyposition(index);
              clickedMenuKey = index;
              clickedMenukeys();
            ">
            <span class="flex flex-col">
              <span v-if="item.intKeyNo == 1"
                >(Screen. {{ item.lngKeyscrNo }} )</span
              >
              <span v-if="item.intKeyNo == 6"
                >{{ item.lngKeyscrNo }} <br />{{ item.strKeyName }}</span
              >
              <span v-if="item.intKeyNo == 7"
                >{{ item.lngKeyscrNo }} <br />{{ item.strKeyName }}</span
              >
              <span v-if="item.intKeyNo == 1">{{
                item ? formatStrKeyName(item.strKeyName).part1 : ""
              }}</span>
              <span class="ml-16" v-if="item.intKeyNo == 6">{{
                item.lngKeyscrNo
                  ? typeof item.lngPrice == "number"
                    ? item.lngPrice.toLocaleString() + "원"
                    : item.lngPrice.substring(item.lngPrice.length - 1) == "원"
                    ? item.lngPrice
                    : Number(item.lngPrice).toLocaleString() + "원"
                  : ""
              }}</span>
            </span>
          </div>
        </VueDraggableNext>
      </div>
    </div>
  </div>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    v-if="showPopUp">
    <div class="bg-white p-6 rounded-xl shadow-lg w-[40vw] h-[40vh]">
      <div class="flex justify-between">
        <h2 class="text-xl font-bold mb-4">메뉴키 추가</h2>
        <div class="col-span-2 flex justify-end space-x-5">
          <button class="whitebutton" @click="saveMenuKey">저장</button
          ><button class="whitebutton" @click="closePopUp">닫기</button>
        </div>
      </div>

      <div class="grid grid-rows-4 grid-cols-[2fr,5fr,2fr,5fr] h-[90%] w-[90%]">
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold bg-gray-100 text-blue-500">
          <span class="text-red-500">*</span>매장
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold">
          <input
            type="text"
            class="disabled:bg-gray-300 w-[80%] h-[50%] flex justify-center items-center text-center"
            disabled
            v-model="clickedStoreNm" />
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold bg-gray-100 text-blue-500">
          <span class="text-red-500">*</span>메뉴명
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold">
          <input
            type="text"
            class="w-[80%] h-[50%] border border-black"
            v-model="pcond" />
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold bg-gray-100">
          서브그룹
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold">
          <select
            name=""
            id=""
            class="w-[80%] h-[50%] border border-black"
            v-model="pcond2">
            <option :value="i.lngCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold bg-gray-100">
          판매단가
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold">
          <input
            type="number"
            class="w-[80%] h-[50%] border border-black"
            v-model="pcond3" />
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold bg-gray-100 text-blue-500">
          <span class="text-red-500">*</span>메뉴코드
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center text-base font-semibold">
          <input
            type="number"
            v-model="pcond4"
            :disabled="pcond5"
            class="w-[50%] h-[50%] border border-black ml-5" />
          <label for="auto"
            ><input type="checkbox" id="auto" v-model="pcond5" />자동</label
          >
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold bg-gray-100 text-blue-500">
          <span class="text-red-500">*</span>주방출력
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center text-base font-semibold">
          <input
            type="number"
            class="w-[40%] h-[50%] border border-black"
            v-model="pcond6" />
          <div class="text-red-500 text-nowrap">※주방미출력:99</div>
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-center items-center text-base font-semibold bg-gray-100">
          오픈단가
        </div>
        <div
          class="border-l border-t border-b border-black flex justify-start pl-5 items-center text-base font-semibold col-span-3">
          <label for="use"
            ><input type="checkbox" id="use" v-model="pcond7" />사용</label
          >
        </div>
      </div>
    </div>
  </div>
  <!-- 드래그 영역 -->
</template>

<script setup>
import {
  getMenuKeyList2,
  getMenuList,
  getScreenList2,
  getTLUList,
  saveAllMenuKey,
  saveMenuCode,
  saveMenuKey2,
  saveScreenKeys,
} from "@/api/master";
import { getSubGroup3, InsertMenu } from "@/api/mipos";

/**
 *  복사 팝업 컴포넌트
 *  */

import DupliPopUp from "@/components/dupliPopUp.vue";

/**
 *  복사 팝업 컴포넌트
 *  */

import DupliPopUp2 from "@/components/dupliPopUp2.vue";
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

import { onMounted, ref, watch } from "vue";
/*
 * 드래그 라이브러리 호출
 */

import { VueDraggableNext } from "vue-draggable-next";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";

/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

// 더미 데이터
const items = ref([]);
const selectedStoreNm = ref("");
const clickedScreenKeyIndex = ref();
const ScreenKeyOrigin = ref([]);
const clickedMenuKey = ref();
const ScreenKeys = ref();
const currentMenuorTLU = ref(false);
const forsearchMain = ref(-1);
const forsearchSub = ref(-1);
const addscreenKey = ref(false);
const searchWord = ref("");
const searchWord2 = ref("");
// 드래그 가능한 요소를 설정하는 메서드
const currentsubPage = ref(1);
const changeMode = ref(false);
const changingMode = (data) => {
  if (data == 1) {
    changeMode.value = false;
  } else {
    changeMode.value = true;
  }
};
const renew = ref(false);
const clickedStoreNm = ref();
/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};
const showPopup2 = ref(false);
const showChangeScreenKey = ref(false);

const optionList = ref([]);

const confirmitem = ref([]);

const currentscreenKeyNm = ref("");

const maxSubCode = ref();

const pcond = ref("");
const pcond2 = ref("");
const pcond3 = ref("");
const pcond4 = ref("");
const pcond5 = ref(false);
const pcond6 = ref("");
const pcond7 = ref(false);
/**
 * 선택한 포스 번호 호출 함수
 */

const saveMenuKey = async () => {
  if (pcond.value == undefined || pcond.value == null || pcond.value == "") {
    Swal.fire({
      title: "경고.",
      text: "메뉴명을 먼저 입력해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (
    (pcond4.value == undefined && pcond5.value == false) ||
    (pcond4.value == null && pcond5.value == false) ||
    (pcond4.value == "" && pcond5.value == false)
  ) {
    Swal.fire({
      title: "경고.",
      text: "메뉴코드를 입력해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (pcond6.value == undefined || pcond6.value == null || pcond6.value == "") {
    Swal.fire({
      title: "경고.",
      text: "주방출력을 입력해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    const res = await InsertMenu(
      groupCd.value,
      nowStoreCd.value,
      pcond2.value,
      pcond3.value,
      pcond4.value,
      pcond.value,
      pcond5.value == true ? 1 : 0,
      pcond6.value,
      pcond7.value == true ? 1 : 0
    );
    console.log(res);

    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공.",
        text: "저장 하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      Swal.fire({
        title: "실패",
        text: "저장에 실패하였습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
  } finally {
    showPopUp.value = false;

    await handleStoreCd(nowStoreCd.value);
  }
};

const closePopUp = () => {
  pcond.value = "";
  pcond2.value = "";
  pcond3.value = "";
  pcond4.value = "";
  pcond5.value = false;
  pcond6.value = "";
  pcond7.value = false;
  showPopUp.value = false;
};
function decimalToHexColor(decimal) {
  // 문자열이면 숫자로 변환

  const num = typeof decimal === "string" ? parseInt(decimal, 10) : decimal;

  if (isNaN(num) || num <= 0 || num > 16777215) {
    return "16777215"; // 또는 적절한 기본값 리턴
  }

  const hex = num.toString(16).padStart(6, "0");
  //console.log(hex.toLowerCase());
  return `#${hex.toLowerCase()}`;
}

const posNo = ref();
const changeScreenKey = ref(false);
const currmenuKeyPage = ref(1);
const AllscreenKeyPage = ref(1);
const currentSelectedMenuNm = ref("");
const showSpecificMenukey = ref(false);
/**
 *  그리드 검색어 세팅
 */

const searchword3 = ref("");
const rowData = ref([
  { strName: "화면1", add: "추가", lngCode: 1, intKeyNo: 1 },
  { strName: "화면2", add: "추가", lngCode: 2, intKeyNo: 1 },
  { strName: "화면3", add: "추가", lngCode: 3, intKeyNo: 1 },
  { strName: "화면4", add: "추가", lngCode: 4, intKeyNo: 1 },
  { strName: "화면5", add: "추가", lngCode: 5, intKeyNo: 1 },
  { strName: "화면6", add: "추가", lngCode: 6, intKeyNo: 1 },
  { strName: "화면7", add: "추가", lngCode: 7, intKeyNo: 1 },
  { strName: "화면8", add: "추가", lngCode: 8, intKeyNo: 1 },
  { strName: "화면9", add: "추가", lngCode: 9, intKeyNo: 1 },
  { strName: "화면10", add: "추가", lngCode: 10, intKeyNo: 1 },
  { strName: "화면11", add: "추가", lngCode: 11, intKeyNo: 1 },
  { strName: "화면12", add: "추가", lngCode: 12, intKeyNo: 1 },
  { strName: "화면13", add: "추가", lngCode: 13, intKeyNo: 1 },
  { strName: "화면14", add: "추가", lngCode: 14, intKeyNo: 1 },
  { strName: "화면15", add: "추가", lngCode: 15, intKeyNo: 1 },
  { strName: "화면16", add: "추가", lngCode: 16, intKeyNo: 1 },
  { strName: "화면17", add: "추가", lngCode: 17, intKeyNo: 1 },
  { strName: "화면18", add: "추가", lngCode: 18, intKeyNo: 1 },
  { strName: "화면19", add: "추가", lngCode: 19, intKeyNo: 1 },
  { strName: "화면20", add: "추가", lngCode: 20, intKeyNo: 1 },
]);

const isNew = ref(false);
const currentMenu = ref("1");
/**
 * 복사 함수
 */
const copyButton2 = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showSpecificMenukey.value = true;
};
const TLUSubList = ref([]);
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (e) => {
  TLUSubList.value = [];
  for (let i = 1; i <= 29; i++) {
    if (MenuList.value.filter((item) => item.menuCd == e[i]).length > 0) {
      TLUSubList.value.push({
        lngCode: e[i],
        strName: MenuList.value.filter((item) => item.menuCd == e[i])[0].menuNm,
      });
    }
  }
};
const showScreenNm = ref(false);
const realgrid2Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgrid3Name = ref("");
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};
const realgrid4Name = ref("");
const realgrid5Name = ref("");
const realgridname3 = (e) => {
  realgrid4Name.value = e;
};
const realgridname4 = (e) => {
  realgrid5Name.value = e;
};

watch(currentMenu, () => {
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

  const realgrid4 = document.getElementById(realgrid4Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(realgrid4).resetSize();
    RealGrid.getGridInstance(realgrid4).refresh(true);
  }, 100);

  const realgrid5 = document.getElementById(realgrid5Name.value);
  setTimeout(() => {
    RealGrid.getGridInstance(realgrid5).resetSize();
    RealGrid.getGridInstance(realgrid5).refresh(true);
  }, 100);
});
const currentSelectedMenuCode = ref();
const currentSelectedMenuPrice = ref();

/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  console.log(e);
  currentSelectedMenuNm.value = e[1];
  currentSelectedMenuCode.value = e[0];
  currentSelectedMenuPrice.value = e[2];
  addMenuKey();
};

/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData2 = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  //comsole.log(e);
  currentSelectedMenuNm.value = e[1];
  currentSelectedMenuCode.value = e[0];
  currentSelectedMenuPrice.value = "";
  addMenuKey2();
};
const selcetedrowData4 = (e) => {
  if (clickedRealIndex.value == null) {
    return;
  }
  //comsole.log(e);

  Swal.fire({
    title: "화면명을 입력하세요.",
    input: "text",
    inputPlaceholder: "여기에 입력...",
    showCancelButton: true,
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  }).then((result) => {
    if (result.isConfirmed) {
      const userInput = result.value;

      currentSelectedMenuNm.value = userInput;
      currentSelectedMenuCode.value = e[0];
      currentSelectedMenuPrice.value = "";
      addScreenKeyf();
    } else {
      //console.log("입력 취소됨");
    }
  });
};

/**
 * 복사 함수
 */

const copyButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  showPopup2.value = true;
};

/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref("");
function formatStrKeyName(strKeyName) {
  // 첫 번째 파싱: '/' 기준으로 분리
  if (strKeyName == null || strKeyName == undefined) {
    return "";
  }
  const firstSplit = strKeyName.split("/");

  // 두 번째 파싱: '(' 기준으로 분리
  const secondSplit = firstSplit[1] ? firstSplit[1].split("(") : [null];

  // 결과 반환
  return {
    part1: firstSplit[0], // 첫 번째 부분 ("/" 기준)
    part2: secondSplit[0], // 두 번째 부분 ("(" 기준)
    part3: secondSplit[1] ? secondSplit[1].replace(")", "") : null, // 괄호 안 내용
  };
}
const changed2 = (newvalue) => {
  MenuKeyList.value = [];
  items.value = [];
};

const updateMenuKey = ref(false);
let dupliitems = [];

const saveButton = () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고.",
      text: "조회를 먼저 해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (
    JSON.stringify(confirmitem.value) === JSON.stringify(MenuKeyList.value) &&
    JSON.stringify(confirmitem2.value) === JSON.stringify(ScreenKeyOrigin.value)
  ) {
    Swal.fire({
      title: "경고",
      text: "변경된 사항이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  const keyseq = MenuKeyList.value.map((item) => item.intKeySeq);
  const keyname = MenuKeyList.value.map((item) => item.strKeyName);
  const keyscrno = MenuKeyList.value.map((item) => item.lngKeyscrNo);
  const keycolor = MenuKeyList.value.map((item) => item.lngKeyColor);
  const keyno = MenuKeyList.value.map((item) => item.intKeyNo);
  Swal.fire({
    title: "저장",
    text: "저장 하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "저장",
    cancelButtonText: "취소",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;
        const res = await saveMenuKey2(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          keyseq.join("\u200B"),
          keyname.join("\u200B"),
          keyscrno.join("\u200B"),
          keycolor.join("\u200B"),
          keyno.join("\u200B")
        );
        //comsole.log(res);
        if (res.data.RESULT_CD == "00") {
          Swal.fire({
            title: "저장 되었습니다.",
            confirmButtonText: "확인",
          });
        }
      } catch (error) {
      } finally {
        store.state.loading = false;
        renew.value = !renew.value;
        searchButton();
      }
    }
  });
};
const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
  //comsole.log(nowStoreAreaCd.value);
};

const nowStoreCd = ref();
const afterCategory = ref(false);
/**
 * 페이지 매장 코드 세팅
 */

const handleGroupCd = (e) => {
  groupCd.value = e;
};
const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
  }

  const res = await getSubGroup3(store.state.userData.lngStoreGroup, newValue);
  //console.log(res);
  optionList.value = res.data.List;
  if (optionList.value.length > 0) {
    pcond2.value = res.data.List[0].lngCode;
  }

  nowStoreCd.value = newValue;
  const res2 = await getMenuList(groupCd.value, nowStoreCd.value);
  MenuList.value = res2.data.menuList;
  MenuGroup.value = res2.data.menuGroup;
  SubMenuGroup.value = res2.data.submenuGroup;

  MenuList.value = MenuList.value.map((item) => {
    return {
      ...item,
      add: "추가",
    };
  });
  const res5 = await getTLUList(groupCd.value, nowStoreCd.value);
  TLUList.value = res5.data.TLUList;
  TLUList.value = TLUList.value.map((item) => {
    return {
      ...item,
      add: "추가",
    };
  });
};
const selectedButton = ref();
const Category = ref([]);
const getMultiLang = ref([]);
const screenNoList = ref([]);
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);

const store = useStore();

const showMenuKeyList = ref([]);
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const modified = ref(false);
const afterSearch = ref(false);
const MenuList = ref([]);
const MenuKeyList = ref([]);
const clickedScreenOrMenu = ref(false);
const TLUList = ref([]);
const confirmitem2 = ref([]);
const clickedScreenNo = ref();
const changePage = ref(false);
const searchButton = async () => {
  changeMode.value = false;
  Category.value = [];
  items.value = [];

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
  if (posNo.value == "0" || posNo.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "포스번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  if (nowscreenNo.value == "0" || nowscreenNo.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "화면번호를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  store.state.loading = true;
  try {
    MenuKeyList.value = [];
    items.value = [];

    const res3 = await getScreenList2(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value
    );

    //comsole.log(res3);
    const res4 = await getMenuKeyList2(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value,
      posNo.value,
      nowscreenNo.value
    );

    MenuKeyList.value = res4.data.MenukeyList;

    screenNoList.value = res3.data.ScreenList;

    confirmitem.value = JSON.parse(JSON.stringify(MenuKeyList.value));
    confirmitem2.value = JSON.parse(JSON.stringify(ScreenKeyOrigin.value));
    AllscreenKeyPage.value = Math.ceil(ScreenKeyOrigin.value.length / 10);

    const filteredList = MenuKeyList.value.filter(
      (item) =>
        item.intKeySeq >= (nowscreenNo.value - 1) * 45 &&
        item.intKeySeq <= nowscreenNo.value * 45
    );
    //console.log(nowscreenNo.value);
    //console.log(items.value);
    items.value = [];
    const startIndex = (nowscreenNo.value - 1) * 45;
    const endIndex = nowscreenNo.value * 45;
    //comsole.log(items.value);
    // 중간에 비어 있는 번호 확인 및 채우기
    for (let i = startIndex; i < endIndex; i++) {
      // 해당 번호가 없는 경우 기본값 추가
      const existingItem = filteredList.find(
        (item) => item.intKeySeq === i + 1
      );
      if (existingItem) {
        items.value.push(existingItem);
      } else {
        items.value.push({
          intKeySeq: i,
          strKeyName: ``, // 기본값 또는 placeholder
        });
      }
    }
    //console.log(items.value);

    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    modified.value = false;
    afterCategory.value = false;
    //comsole.log(items.value);
    //comsole.log(MenuKeyList.value);
  }

  calculateMaxSubCode();
};
const filteredSubMenuGroup = ref([]);
const searchValue = ref([-1, -1]);
const setSubCd = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  //comsole.log(SubMenuGroup.value);
  //comsole.log(MenuGroup.value);
  if (name == "majorGroupCd") {
    filteredSubMenuGroup.value = SubMenuGroup.value.filter(
      (item) => item.sublngMajor == value
    );
    forsearchSub.value = -1;
    searchValue.value = [value, forsearchSub.value];
  } else if (name == "subGroupCd") {
    searchValue.value = [forsearchMain.value, value];
  }
};
const clickedintScreenNo = ref();
const calculateMaxSubCode = () => {
  maxSubCode.value = Math.max(
    ...Category.value
      .filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .flatMap((item) => item.SubCategory.map((sub) => Number(sub.SubCode)))
  );
};
const showMenuKey = (value) => {
  items.value = Array.from({ length: 45 }, (_, index) => ({
    intKeySeq: index + 1,
  }));
  //comsole.log(MenuKeyList.value);
  //comsole.log(nowscreenNo.value);
  const filteredList = MenuKeyList.value.filter(
    (item) =>
      item.intKeySeq >= (nowscreenNo.value - 1) * 45 + 1 &&
      item.intKeySeq <= nowscreenNo.value * 45
  );
  console.log(filteredList);
  const startIndex = (nowscreenNo.value - 1) * 45 + 1;
  const endIndex = nowscreenNo.value * 45;
  // 중간에 비어 있는 번호 확인 및 채우기
  for (let i = startIndex; i <= endIndex; i++) {
    // 해당 번호가 없는 경우 기본값 추가
    const existingItem = filteredList.find((item) => item.intKeySeq === i);
    console.log(existingItem);
    const targetIndex = items.value.findIndex(
      (item) => item.intKeySeq === i - startIndex + 1
    );

    if (targetIndex !== -1 && existingItem) {
      items.value[targetIndex] = existingItem;
    } else {
    }
  }

  //console.log(items.value);

  // if (clickedintScreenNo.value != value) {
  //   currmenuKeyPage.value = 1;
  // }
  // clickedintScreenNo.value = value;
  // items.value = Array.from({ length: 30 }, (_, index) => ({
  //   intKeySeq: index + 1,
  // }));

  // MenuKeyList.value
  //   .filter((item) => item.intPosNo == posNo.value && item.intScreenNo == value)
  //   .forEach((item) => {
  //     const position = item.intKeySeq - (currmenuKeyPage.value - 1) * 30 - 1;
  //     if (position >= 0 && position < 30) {
  //       items.value[position] = item;
  //     }
  //   });
};
watch(ScreenKeys, (newvalue) => {
  if (ScreenKeys.value.length > 10) {
    AllscreenKeyPage.value = Math.ceil(ScreenKeys.value.length / 10);
  }
});
const showScreenKeysOrder = () => {
  showChangeScreenKey.value = !showChangeScreenKey.value;
};

let targetItemIndex2;
const onMove = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  if (changeMode.value == false) {
    targetItemIndex2 = Array.from(evt.from.children).indexOf(evt.related);
    return false;
  } else {
    return true;
  }
};
let targetItemIndex3;
let dupliScreenKeyOrigin;
const onMove2 = (evt) => {
  // 예: 드래그 중 이동할 때의 조건 등을 설정할 수 있음
  targetItemIndex3 = Array.from(evt.from.children).indexOf(evt.related);
  //comsole.log(targetItemIndex3);
  dupliScreenKeyOrigin = [...ScreenKeyOrigin.value];
  return true;
};

const onEnd = (evt) => {
  // Swap을 처리할 조건
  if (targetItemIndex2 == undefined) {
    targetItemIndex2 = evt.oldIndex;
  }
  if (changeMode.value === false) {
    //comsole.log(MenuKeyList.value);
    const oldIndex = evt.oldIndex; // 드래그된 아이템의 기존 인덱스
    const swappedItems = [...items.value]; // items를 복사
    const temp = swappedItems[oldIndex];

    swappedItems[oldIndex] = swappedItems[targetItemIndex2];

    swappedItems[targetItemIndex2] = temp;

    items.value = swappedItems.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (nowscreenNo.value - 1) * 45 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
    console.log(items.value);
  } else {
    updateMenuKey.value = true;
    items.value = items.value.map((item, index) => ({
      ...item, // 기존 객체의 다른 속성 유지
      intKeySeq: index + (nowscreenNo.value - 1) * 45 + 1, // 배열 순서대로 intKeySeq 재정렬
    }));
  }
  //comsole.log(evt);
  clickedMenuKey.value =
    changeMode.value == false ? targetItemIndex2 : evt.newIndex;
  //comsole.log(items.value);
};

const onEnd2 = (evt) => {
  //comsole.log(ScreenKeyOrigin.value);
  const originScreenNo = dupliScreenKeyOrigin[evt.oldIndex].intScreenNo;
  const targetScreenNo = dupliScreenKeyOrigin[targetItemIndex3].intScreenNo;
  ScreenKeyOrigin.value.forEach((item, index) => {
    item.intScreenNo = index + 1;
  });
  MenuKeyList.value
    .filter((item) => item.intPosNo == posNo.value)
    .forEach((item, index) => {
      if (item.intScreenNo == originScreenNo) {
        item.intScreenNo = targetItemIndex3 + 1;
      } else if (item.intScreenNo == targetScreenNo) {
        item.intScreenNo = evt.oldIndex + 1;
      }
    });

  addfor10ScreenKey();

  showMenuKey(clickedintScreenNo.value);
};
watch(items, (newvalue) => {
  //comsole.log(newvalue);
  items.value.forEach((item) => {
    const index = MenuKeyList.value.findIndex(
      (m) => m.intKeySeq == item.intKeySeq
    );

    if (index !== -1) {
      MenuKeyList.value[index] = item; // 💥 여기서 items 걸로 덮어씌움
    } else {
      MenuKeyList.value.push(item); // 💥 없으면 추가
    }
  });
  //comsole.log(MenuKeyList.value);
});

const showPopUp = ref(false);
const showPopUp2 = ref(false);
const movePage1 = () => {
  showPopUp.value = true;
};

const movePage2 = () => {
  store.state.moveOtherTab = {
    strUrl: "MIMASTER::MST01_010INS.xml",
    lngProgramID: 73712,
    strTitle: "TLU 메뉴 등록.",
  };
};
const savePosMenu = async () => {
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (JSON.stringify(confirmitem.value) === JSON.stringify(MenuList.value)) {
    Swal.fire({
      title: "경고",
      text: "변경된 항목이 없습니다.",
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  Swal.fire({
    title: "저장하시겠습니까?",
    text: "변경사항을 저장하시겠습니까?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "저장",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        store.state.loading = true;
        const screenKeyNoarr = ScreenKeyOrigin.value.map(
          (item) => item.intScreenNo
        );
        const screenKeyNamearr = ScreenKeyOrigin.value.map(
          (item) => item.strScreenName
        );
        //comsole.log(screenKeyNoarr.join(","));
        //comsole.log(screenKeyNamearr.join(","));
        const res = await saveScreenKeys(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          screenKeyNoarr.join(","),
          screenKeyNamearr.join(",")
        );

        const intKeySeqs = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.intKeySeq);
        const screenNumarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.intScreenNo);
        const lngScrarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.lngKeyscrNo);
        const menuKeyNmarr = MenuKeyList.value
          .filter((item) => item.intPosNo == posNo.value)
          .map((item) => item.strKeyName);
        //comsole.log(posNo.value);
        //comsole.log(intKeySeqs.join(","));
        //comsole.log(screenNumarr.join(","));
        //comsole.log(lngScrarr.join(","));
        //comsole.log(menuKeyNmarr.join(","));
        const res2 = await saveAllMenuKey(
          groupCd.value,
          nowStoreCd.value,
          nowStoreAreaCd.value,
          posNo.value,
          intKeySeqs.join(","),
          screenNumarr.join(","),
          lngScrarr.join(","),
          menuKeyNmarr.join(",")
        );

        //comsole.log(res);
        //comsole.log(res2);
      } catch (error) {
      } finally {
        store.state.loading = false;
        Swal.fire({
          title: "저장 성공",
          text: "변경 사항이 저장되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        searchButton();
      }
    }
  });

  // 빈공간 데이터를 넣으려고하는데 안 들어가고 조회가 안됨 // 빈 칸에 대한 것도 데이터를 불러와야 메뉴키위치를 정할 수 있음.
};

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};
// const searchMenuList3 = (e) => {
//   searchword3.value = e.target.value;
// };

const searchMenuList2 = (e) => {
  searchWord2 = e.target.value;
};

/**
 * pickStore - 포스번호 세팅
 */

const handlePosNo = (newValue) => {
  posNo.value = newValue;
  //comsole.log(posNo.value);
};
const nowscreenNo = ref();
const handleScreenNo = (newValue) => {
  nowscreenNo.value = newValue;
  //comsole.log(nowscreenNo.value);
  //showMenuKey(newValue);
  if (newValue != "0") {
    searchButton();
  }
};
watch(nowscreenNo, (newvalue) => {
  changePage.value = true;
  if (afterSearch.value) {
    // showMenuKey(newvalue);
  }
  changePage.value = false;
});
// watch(
//   () => MenuList.value,
//   () => {
//     showMenuKeys(); // MenuKeyList 값이 변경될 때마다 그리드 업데이트
//   }
// );

const editScreenKey = (value) => {
  clickedScreenNo.value = value;
  changeScreenKey.value = true;
};

const exitScreenKey = () => {
  changeScreenKey.value = false;
  addscreenKey.value = false;
};
const confirmScreenKey = () => {
  const index = ScreenKeyOrigin.value.findIndex(
    (item) => item.intScreenNo == clickedScreenNo.value
  );
  ScreenKeyOrigin.value[index].strScreenName = currentscreenKeyNm.value;
  changeScreenKey.value = false;
  //comsole.log(ScreenKeyOrigin.value);
  addfor10ScreenKey();
  currentscreenKeyNm.value = "";
  clickedScreenNo.value = "";
};

const addfor10ScreenKey = () => {
  ScreenKeys.value = [
    ...ScreenKeyOrigin.value.slice(
      10 * (currentsubPage.value - 1),
      10 * (currentsubPage.value - 1) + 10
    ),
  ];
  const length = ScreenKeys.value.length;
  if (length < 10) {
    ScreenKeys.value.push({ strScreenName: "", intScreenNo: "", new: true });
    for (var i = 0; i < 9 - length; i++) {
      ScreenKeys.value.push({ strScreenName: "", intScreenNo: "" });
    }
  }
};

const changeMenuColor = (e) => {
  if (clickedMenuKeyIndex.value == null) {
    return;
  }

  const a = items.value.find(
    (item) => item.intKeySeq == clickedMenuKeyIndex.value
  );
  if (a != undefined) {
    a.lngKeyColor = e;
  }
};

const existMenuKey = ref(false);
const clickedRealIndex = ref();
const saveMenuKeyposition = (index) => {
  clickedScreenOrMenu.value = true;
  clickedMenuKeyIndex.value = index + 1 + (nowscreenNo.value - 1) * 45;
  clickedRealIndex.value = (nowscreenNo.value - 1) * 45 + index;
};

const clickedMenuKeyIndex = ref(null);
const addMenuKey = () => {
  //comsole.log(clickedMenuKeyIndex.value);
  if (clickedMenuKeyIndex.value == null) {
    return;
  }
  const onScreenKey =
    nowscreenNo.value * 45 - clickedMenuKeyIndex.value >= 0 &&
    nowscreenNo.value * 45 - clickedMenuKeyIndex.value <= 10;
  //comsole.log(clickedMenuKeyIndex.value);
  const a = items.value.find(
    (item) => item.intKeySeq == clickedMenuKeyIndex.value
  );
  console.log(a);
  if (a !== undefined) {
    a.intKeyNo = currentMenu.value == 1 ? 6 : 1;
    a.intKeySeq = clickedMenuKeyIndex.value;
    a.intPosNo = posNo.value;
    a.lngKeyColor = "16769216";
    a.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    a.strKeyName = currentSelectedMenuNm.value;
    a.lngPrice = currentSelectedMenuPrice.value;
  }
  //console.log(a);
  //comsole.log(items.value);
  //comsole.log(posNo.value);
  //comsole.log(clickedMenuKeyIndex.value);
  //comsole.log(MenuKeyList.value);
  const b = MenuKeyList.value.find(
    (item) =>
      item.intKeySeq == clickedMenuKeyIndex.value &&
      item.intPosNo == posNo.value
  );

  //console.log(b);

  if (b !== undefined) {
    b.intKeyNo = currentMenu.value == 1 ? 6 : 1;
    b.intKeySeq = clickedMenuKeyIndex.value;
    b.intPosNo = posNo.value;
    b.lngKeyColor = "16769216";
    b.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    b.strKeyName = currentSelectedMenuNm.value;
    b.lngPrice = currentSelectedMenuPrice.value;
  } else {
    MenuKeyList.value.push({
      intKeyNo: currentMenu.value == 1 ? 6 : 1,
      intKeySeq: clickedMenuKeyIndex.value,
      intPosNo: posNo.value,
      lngKeyColor: "16769216",
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
      lngPrice: currentSelectedMenuPrice.value,
    });
  }
  // console.log(b);
  showMenuKey(nowscreenNo.value);
  //comsole.log(MenuKeyList.value);
};

const addMenuKey2 = () => {
  //comsole.log(clickedMenuKeyIndex.value);
  if (clickedMenuKeyIndex.value == null) {
    return;
  }
  //comsole.log(items.value);

  //comsole.log(clickedMenuKeyIndex.value);
  const a = items.value.find(
    (item) => item.intKeySeq == clickedMenuKeyIndex.value
  );
  if (a !== undefined) {
    a.intKeyNo = 7;
    a.intKeySeq = clickedMenuKeyIndex.value;
    a.intPosNo = posNo.value;
    a.lngKeyColor = "16769216";
    a.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    a.strKeyName = currentSelectedMenuNm.value;
  }
  //comsole.log(items.value);
  //comsole.log(posNo.value);
  //comsole.log(clickedMenuKeyIndex.value);
  //comsole.log(MenuKeyList.value);
  const b = MenuKeyList.value.find(
    (item) =>
      item.intKeySeq == clickedMenuKeyIndex.value &&
      item.intPosNo == posNo.value
  );

  //comsole.log(b);

  if (b !== undefined) {
    b.intKeyNo = 7;
    b.intKeySeq = clickedMenuKeyIndex.value;
    b.intPosNo = posNo.value;
    b.lngKeyColor = "16769216";
    b.lngKeyscrNo = Number(currentSelectedMenuCode.value);
    b.strKeyName = currentSelectedMenuNm.value;
  } else {
    MenuKeyList.value.push({
      intKeyNo: 7,
      intKeySeq: clickedMenuKeyIndex.value,
      intPosNo: posNo.value,
      lngKeyColor: "16769216",
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
    });
  }

  // const foraddIndex = MenuKeyList.value.find(
  //   (item) =>
  //     item.intPosNo == posNo.value &&
  //     item.intKeySeq == clickedMenuKeyIndex.value
  // );

  // //comsole.log(foraddIndex);
  // if (foraddIndex == undefined) {
  //   MenuKeyList.value.push({
  //     intKeyNo: 6,
  //     intKeySeq: clickedRealIndex.value,
  //     intPosNo: posNo.value,
  //     lngKeyscrNo: Number(currentSelectedMenuCode.value),
  //     strKeyName: currentSelectedMenuNm.value,
  //   });
  // } else {
  //   foraddIndex.lngKeyscrNo = Number(currentSelectedMenuCode.value);
  //   foraddIndex.strKeyName = currentSelectedMenuNm.value;
  // }

  showMenuKey(nowscreenNo.value);
  //comsole.log(MenuKeyList.value);
};

const addScreenKeyf = () => {
  //comsole.log(MenuKeyList.value);
  //comsole.log(clickedRealIndex.value);
  const foraddIndex = MenuKeyList.value.findIndex(
    (item) =>
      item.intKeySeq ==
      (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1
  );
  //comsole.log(foraddIndex);
  if (foraddIndex == -1) {
    MenuKeyList.value.push({
      intKeyNo: 1,
      intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1,
      intPosNo: posNo.value,
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
      lngKeyColor: "16769216",
    });
  } else {
    MenuKeyList.value[foraddIndex] = {
      intKeyNo: 1,
      intKeySeq: (nowscreenNo.value - 1) * 45 + clickedRealIndex.value + 1,
      intPosNo: posNo.value,
      lngKeyscrNo: Number(currentSelectedMenuCode.value),
      strKeyName: currentSelectedMenuNm.value,
      lngKeyColor: "16769216",
    };
  }
  //comsole.log(MenuKeyList.value);
  showScreenNm.value = false;
  showMenuKey();
};

const addTLUKey = () => {
  //comsole.log(MenuKeyList.value);
  const foraddIndex = MenuKeyList.value.findIndex(
    (item) => item.intKeySeq == clickedRealIndex.value
  );
  //comsole.log(foraddIndex);
  if (foraddIndex == -1) {
    MenuKeyList.value.push({
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value + 1,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    });
  } else {
    MenuKeyList.value[foraddIndex] = {
      intKeyNo: 6,
      intKeySeq: clickedRealIndex.value + 1,
      intPosNo: posNo.value,
      intScreenNo: clickedintScreenNo.value,
      lngKeyscrNo: Number(clickedTLUCD.value),
      strKeyName: clickedTLUNM.value,
    };
  }
  showMenuKey(clickedintScreenNo.value);
};

const showMenus = (value) => {
  if (value == 1) {
    currentMenuorTLU.value = false;
    currentMenu.value = value;
  } else if (value == 2) {
    currentMenuorTLU.value = true;
    currentMenu.value = value;
  } else {
    currentMenu.value = value;
  }
};
/**
 * 삭제 버튼
 */

const deletekey = () => {
  if (clickedScreenOrMenu.value == true) {
    const filteredMenuKeyList = MenuKeyList.value.filter(
      (item) => item.intKeySeq != clickedRealIndex.value + 1
    );
    MenuKeyList.value = filteredMenuKeyList;
    showMenuKey();
  }
};

const clickedMenukeys = () => {
  clickedScreenOrMenu.value = true;
};
const clickedScreenKeys = () => {
  clickedScreenOrMenu.value = false;
};
/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  afterSearch.value = false;
  MenuList.value = [];
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  MenuKeyList.value = [];
  ScreenKeyOrigin.value = [];
  TLUList.value = [];
  AllscreenKeyPage.value = "1";
  MenuList.value = [];
  ScreenKeys.value = [];
  items.value = [];
  items.value = [];
  nowStoreAreaCd.value = "0";
  posNo.value = "0";
};
// watch(forsearchSub, (newvalue) => {
//   searchMenuList3();
// });
</script>

<style scoped></style>
