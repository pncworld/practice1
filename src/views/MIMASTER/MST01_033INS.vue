<template>

  <div class="flex justify-between items-center w-full overflow-y-auto">
    <div class="flex justify-start  w-full pl-12 pt-4">
      <div class="flex justify-start">
        <h1 class="font-bold text-sm md:text-2xl w-full">
          메뉴 코드 등록.
        </h1>
      </div>

    </div>
    <div class="flex justify-center mr-9 space-x-2 pr-5">

      <button @click="searchButton" class="button search md:w-auto w-14">조회</button>
      <button @click="saveButton" class="button save w-auto">저장</button>

    </div>
  </div>
  <br>
  <div class="flex justify-start  space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore12 @update:storeCd="handleStoreCd" @storeNm="handlestoreNm" @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"></PickStore12>
  </div>
  <div class="grid grid-rows-1 grid-cols-[3fr,5fr] h-[86%] w-full">
    <div class="flex flex-col w-full h-full">
      <div class="flex justify-between mt-5 ml-10 w-full border-b border-b-gray-300">
        <div class="flex justify-start font-bold text-xl">메뉴코드 목록</div>
        <div class="mt-3 space-x-2">
          <button class="whitebutton" @click="addRow" :disabled="!afterSearch">추가</button>
          <button class="whitebutton" @click="deleteRow" :disabled="afterClick">삭제</button>
        </div>
      </div>


      <div class="mt-3  grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-full ml-10">
        <div class="customtableIndex border border-gray-400 rounded-tl-lg">메뉴분류</div>
        <div class=" border border-gray-300 rounded-tr-lg flex p-1">
          <select name="" id="" class="flex-1 border rounded-lg w-[80%] h-full " @change="setSubCd"
            v-model="forsearchMain">
            <option value="0">전체</option>
            <option :value="i.GroupCd" v-for="i in MenuGroup"> [{{ i.GroupCd }}]{{ i.majorGroupNm }}</option>
          </select>
          <select name="" id="" class="flex-1 border rounded-lg w-full h-full" v-model="forsearchSub"
            @change="setSubCd2">
            <option value="0">전체</option>
            <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup"> [{{ i.GroupCd }}]{{ i.subGroupNm }}</option>
          </select>
        </div>
        <div class="customtableIndex border border-gray-400 rounded-bl-lg">메뉴명/코드</div>
        <div class="px-1 py-1 border border-gray-300 rounded-br-lg "><input type="text"
            class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchMenuList" v-model="searchWord">
        </div>
      </div>

      <div class="ml-10 mt-1 w-full h-full">

        <Realgrid class="w-full h-full" :progname="'MST01_033INS_VUE'" :progid="1" :rowData="updateRow"
          :showGrid="showGrid" :showCheckBar="false" @clickedRowData="clickedRowData" :selectionStyle="'singleRow'"
          @selcetedrowData="selcetedrowData" :labelsData="labelsData" :valuesData="valuesData"
          :labelingColumns="labelingColumns" :changeNow="changeNow" :changeValue2="changeValue2"
          :changeColid="changeColid" :changeRow="changeRow" @selectedIndex="selectedIndex" :addRow4="addRow4"
          :deleteRow2="deleteRow3" :addrowDefault="addrowDefault" :addrowProp="addrowProp"
          @updatedRowData="updatedRowData" :rowStateeditable="false" :addField="'new'" :hideRow="hideRow"
          :hideNow="hideNow" :searchWord="searchWord" :searchColId2="'lngMainGroup,lngSubGroup'"
          :searchColId="'lngCode,strName'" :searchColValue2="searchColValue3" :initFocus="initFocus"></Realgrid>
        <!-- :searchWord="searchWord" :searchColId2="'blnInactive,payDistinct'" :searchColId="'lngCode,strName'" :searchColValue2="searchColValue2" -->
      </div>




    </div>
    <div class="grid grid-cols-1 grid-rows-[1fr,9fr] ml-20">
      <div class="flex space-x-1 mt-10">
        <button class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border" @click="selectMenu(1)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 1 }">상세정보</button>
        <button class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border disabled:bg-gray-50 disabled:text-gray-200 "
          @click="selectMenu(2)" :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 2 }"
          :disabled="discountDisabled">할인선택</button>
        <button class="bg-gray-100 h-12 rounded-t-lg font-bold p-2 border" @click="selectMenu(3)"
          :class="{ 'text-blue-400 bg-blue-100': selectedMenu == 3 }" :disabled="selectedMultiple">키오스크 이미지 설정</button>
      </div>
      <div>
        <hr class="w-[90%] mt-0">
        <div v-show="selectedMenu == 1" class="mt-3 h-[46%]">
          <div class="font-bold flex justify-start text-xl">기본정보</div>
          <div class="grid grid-rows-6 grid-cols-[1fr,3fr,1fr,3fr] h-[60%] mt-3 w-[90%] border rounded-lg">
            <div class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">*메뉴분류</div>
            <div class="flex w-[236%]">
              <select name="lngMainGroup" id="" class="flex border rounded-lg w-[95%] h-full disabled:bg-gray-100 "
                @change="(e) => { setSubCd4(); changeInfo(e); }" v-model="gridvalue1" :disabled="afterClick">
                <option value="0">전체</option>
                <option :value="i.GroupCd" v-for="i in MenuGroup"> [{{ i.GroupCd }}]{{ i.majorGroupNm }}</option>
              </select>
              <select name="lngSubGroup" id="" class="flex border rounded-lg w-[130%] h-full disabled:bg-gray-100"
                v-model="gridvalue2" @change="changeInfo" :disabled="afterClick">
                <option value="0">전체</option>
                <option :value="i.GroupCd" v-for="i in filteredSubMenuGroup2"> [{{ i.GroupCd }}]{{ i.subGroupNm }}
                </option>
              </select>
            </div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">*메뉴코드</div>
            <div class="justify-center items-center  border flex"><input type="number" name="lngCode"
                class="justify-center rounded-lg items-center h-full w-full border flex disabled:bg-gray-100 "
                :disabled="!(!afterClick && isNew)" v-model="gridvalue3" @input="changeInfo"></div>
            <div class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">*유효기간</div>
            <div class="grid grid-rows-1 grid-cols-2">
              <div class="justify-center rounded-lg items-center h-full w-full border flex"><input type="date"
                  :disabled="afterClick" name="dtmFromDate" class="disabled:bg-gray-100 w-full h-full rounded-lg"
                  v-model="gridvalue4" @input="changeInfo"></div>
              <div class="justify-center rounded-lg items-center h-full w-full border flex"><input type="date"
                  :disabled="afterClick" class="disabled:bg-gray-100 w-full h-full rounded-lg" name="dtmToDate"
                  v-model="gridvalue5" @input="changeInfo"></div>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">메뉴명</div>
            <div class="grid grid-rows-1 grid-cols-[2.9fr,4fr] w-[236%] z-5">
              <div class="justify-center rounded-lg items-center h-full w-full border flex "><span
                  class="text-blue-500 font-bold text-start">*국문:</span><input type="text"
                  class="ml-0 justify-center rounded-lg items-center h-full w-[87%] border flex disabled:bg-gray-100"
                  :disabled="afterClick" v-model="gridvalue6" name="strName" @input="changeInfo"></div>
              <div class="justify-center rounded-lg items-center h-full w-[100%] border flex mr-28">영문: <input
                  type="text"
                  class="justify-center rounded-lg items-center h-full w-full border flex disabled:bg-gray-100"
                  :disabled="afterClick" v-model="gridvalue7" name="strNameE" @input="changeInfo"> </div>
            </div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">정상단가</div>
            <div><input type="number" name="lngDCPrice"
                class="justify-center rounded-lg items-center h-full w-full border flex disabled:bg-gray-100"
                :disabled="afterClick" v-model="gridvalue8" @input="changeInfo"></div>
            <div class="justify-center items-center bg-gray-100 border flex">옵션그룹선택</div>
            <div><select name="lngChain" id="" :disabled="afterClick"
                class="disabled:bg-gray-100 border rounded-lg w-[50%] h-full p-2" v-model="gridvalue9"
                @change="changeInfo">
                <option value="0">[0]선택</option>
                <option :value="i.lngCode" v-for="i in optionGroup">[{{ i.lngCode }}]{{ i.strName }}</option>
              </select> <button class="whitebutton">옵션그룹 추가</button></div>
            <div class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">*판매가</div>
            <div><input type="number" name="lngPrice"
                class="justify-center rounded-lg items-center h-full w-full border flex disabled:bg-gray-100"
                :disabled="afterClick" v-model="gridvalue10" @input="changeInfo"></div>
            <div class="justify-center items-center bg-gray-100 border flex">정상단가할인표기</div>
            <div class="space-x-5 flex  items-center border justify-left pl-2"><label for="disY"><input type="radio"
                  name="blnDCPriceYN" id="disY" :disabled="afterClick" v-model="gridvalue11" value="1"
                  @input="changeInfo">예</label>
              <label for="disN"><input type="radio" name="blnDCPriceYN" id="disN" :disabled="afterClick"
                  v-model="gridvalue11" value="0" @input="changeInfo">아니오</label>
              <select name="" id="" :disabled="true"
                class="border rounded-lg disabled:bg-gray-200 ml-10 h-[80%] w-[50%]">
                <option value="">선택</option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">*과세구분</div>
            <div class="space-x-5 flex  items-center border justify-left pl-2"><label for="chargeY"><input type="radio"
                  name="lngTax" id="chargeY" :disabled="afterClick" value="0" v-model="gridvalue12"
                  @input="changeInfo">과세</label>
              <label for="chargeN"><input type="radio" name="lngTax" id="chargeN" :disabled="afterClick" value="2"
                  v-model="gridvalue12" @input="changeInfo">면세</label>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">*사용여부</div>
            <div class="space-x-5 flex  items-center border justify-left pl-2"><label for="useY"><input type="radio"
                  name="blnInactive" id="useY" :disabled="afterClick" value="0" v-model="gridvalue13"
                  @input="changeInfo">사용</label>
              <label for="useN"><input type="radio" name="blnInactive" id="useN" :disabled="afterClick" value="1"
                  v-model="gridvalue13" @input="changeInfo">미사용</label>
            </div>
          </div>
          <div class="font-bold text-xl flex justify-start mt-5">부가정보</div>
          <div class="grid grid-cols-[1fr,3fr,1fr,3fr] grid-rows-12 h-[120%] mt-3 w-[90%]">
            <div class="justify-center items-center bg-gray-100 border flex rounded-tl-lg">할인여부</div>
            <div class="space-x-5 flex  items-center border justify-left pl-2"><label for="discount1"><input
                  type="radio" id="discount1" name="lngDiscount" v-model="gridvalue14" value="0" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">예</label><label for="discount2"><input
                  type="radio" id="discount2" name="lngDiscount" v-model="gridvalue14" value="1" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">아니오</label> </div>
            <div class="justify-center items-center bg-gray-100 border flex">메뉴당객수</div>
            <div class="flex justify-center items-center"><input type="number" name="intCustCount" id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-100" v-model="gridvalue15"
                @input="changeInfo" :disabled="afterClick"></div>
            <div class="justify-center items-center bg-gray-100 border flex text-blue-500 font-bold">*주메뉴종속</div>
            <div class="space-x-5 flex  items-center border justify-left pl-2"><label for="autopay1"><input type="radio"
                  id="autopay1" name="blnCondimentprice" v-model="gridvalue100" value="1" :disabled="afterClick"
                  class="disabled:bg-gray-200" @click="disableKPG" @input="changeInfo">예</label><label
                for="autopay2"><input type="radio" id="autopay2" name="blnCondimentprice" v-model="gridvalue100"
                  value="0" @input="changeInfo" :disabled="afterClick" class="disabled:bg-gray-200"
                  @click="disableKPG">아니오</label>
              <select name="lngKPG" id="" class="border h-[80%] w-[60%] rounded-lg pl-1 disabled:bg-gray-200 ml-3"
                :disabled="afterClick || gridvalue100 == 0" v-model="gridvalue18"
                @change="changeInfo($event); resetKPG($event);">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in MENUDEPEND">[{{ i.strDCode }}]{{ i.strDName }}</option>
              </select>
            </div>
            <div class="justify-center items-center bg-gray-100 border flex">주문정렬순위</div>
            <div class="flex justify-center items-center"><input type="number" name="lngOrder" id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-100" v-model="gridvalue17"
                @input="changeInfo" :disabled="afterClick"></div>
            <div class="justify-center items-center bg-gray-100 border flex">주방출력제외</div>
            <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="openmoney1"><input
                  type="radio" id="openmoney1" name="lngKPG" v-model="gridvalue18" value="99" @input="changeInfo"
                  :disabled="afterClick || disabledKPG" class="disabled:bg-gray-200">예</label><label for="openmoney2"
                v-if="showKPG"><input type="radio" id="openmoney2" name="lngKPG" v-model="gridvalue18" value="1"
                  @input="changeInfo" :disabled="afterClick || disabledKPG"
                  class="disabled:bg-gray-200">아니오</label><label for="openmoney3" v-if="!showKPG"><input type="radio"
                  id="openmoney3" checked disabled>아니오</label></div>
            <div class="justify-center items-center bg-gray-100 border flex">바코드</div>
            <div class="flex justify-center items-center"><input type="number" name="strBarCode" id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-100" v-model="gridvalue19"
                @input="changeInfo" :disabled="afterClick"></div>
            <div class="justify-center items-center bg-gray-100 border flex">영수증출력제외</div>
            <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="receipt1"><input type="radio"
                  id="receipt1" name="blnReceipt" v-model="gridvalue20" value="0" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">예</label><label for="receipt2"><input type="radio"
                  id="receipt2" name="blnReceipt" v-model="gridvalue20" value="1" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">아니오</label></div>
            <div class="justify-center items-center bg-gray-100 border flex">메뉴주문옵션</div>
            <div class="flex justify-center items-center"><select name="lngMenuOption" id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" v-model="gridvalue21"
                @change="changeInfo" :disabled="afterClick">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in menuOrderOption">[{{ i.strDCode }}]{{ i.strDName }}</option>

              </select></div>
            <div class="justify-center items-center bg-gray-100 border flex">주문서출력제외</div>
            <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="discountfor1"><input
                  type="radio" id="discountfor1" name="blnRedPrint" v-model="gridvalue22" value="0" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">전체 선택</label><label for="discountfor2"><input
                  type="radio" id="discountfor2" name="blnRedPrint" v-model="gridvalue22" value="1" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">부분 선택</label></div>
            <div class="justify-center items-center bg-gray-100 border flex">메뉴옵션코드</div>
            <div class="flex justify-center items-center"><select name="strIcon" id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" v-model="gridvalue23"
                @change="changeInfo" :disabled="afterClick">
                <option value="">선택</option>
                <option :value="i.strDCode" v-for="i in menuOptionCode">{{ i.strDName }}</option>

              </select></div>
            <div class="justify-center items-center bg-gray-100 border flex">주방단품출력</div>
            <div class="space-x-5 flex justify-left pl-2 items-center border"><label for="allow1"><input type="radio"
                  id="allow1" name="blnKitSingle" v-model="gridvalue24" value="1" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">허용</label><label for="allow2"><input type="radio"
                  id="allow2" name="blnKitSingle" v-model="gridvalue24" value="0" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">비허용</label></div>
            <div class="justify-center items-center bg-gray-100 border flex">서브타이틀</div>
            <div class="flex justify-center items-center"><select name="lngSubTitle" id=""
                class="border h-full w-full rounded-lg pl-2 disabled:bg-gray-200" :disabled="afterClick"
                v-model="gridvalue25" @change="changeInfo">
                <option :value="0">선택</option>
                <option :value="i.lngCode" v-for="i in subTitle">{{ i.strName }}</option>
              </select></div>

            <div class="justify-center items-center bg-gray-100 border flex">메뉴제공완료여부</div>
            <div class="space-x-5 flex justify-left pl-2 items-center border w-[233%]"><label for="allow3"><input
                  type="radio" id="allow3" name="blnServing" v-model="gridvalue26" value="1" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">예</label><label for="allow4"><input type="radio"
                  id="allow4" name="blnServing" v-model="gridvalue26" value="0" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">아니오</label></div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex rounded-bl-lg">시세가적용</div>
            <div class="space-x-5 flex justify-left pl-2 items-center border w-[233%]"><label for="allow5"><input
                  type="radio" id="allow5" name="blnOpen" v-model="gridvalue27" value="1" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">예</label><label for="allow6"><input type="radio"
                  id="allow6" name="blnOpen" v-model="gridvalue27" value="0" @input="changeInfo" :disabled="afterClick"
                  class="disabled:bg-gray-200">아니오</label></div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex rounded-bl-lg">배달메뉴</div>
            <div class="space-x-5 flex justify-left pl-2 items-center border w-[233%]"><label for="allow7"><input
                  type="radio" id="allow7" name="blnDeliveryYN" v-model="gridvalue28" value="1" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">예</label><label for="allow8"><input type="radio"
                  id="allow8" name="blnDeliveryYN" v-model="gridvalue28" value="0" @input="changeInfo"
                  :disabled="afterClick" class="disabled:bg-gray-200">아니오</label></div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">영양소 정보</div>
            <div class="flex justify-center items-center w-[233%]"><input type="text" name="strNutrInfo" id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200" v-model="gridvalue29"
                @input="changeInfo" :disabled="afterClick"></div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">원산지 정보</div>
            <div class="flex justify-center items-center w-[233%]"><input type="text" name="strCntryOrg" id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200" v-model="gridvalue30"
                @input="changeInfo" :disabled="afterClick"></div>
            <div class="w-0"></div>
            <div class="w-0"></div>
            <div class="justify-center items-center bg-gray-100 border flex">메뉴설명</div>
            <div class="flex justify-center items-center w-[233%]"><input type="text" name="strMenuComment" id=""
                class="h-full w-full border rounded-lg pl-2 disabled:bg-gray-200" v-model="gridvalue31"
                @input="changeInfo" :disabled="afterClick"></div>
            <div class="w-0"></div>
            <div class="w-0"></div>
          </div>
        </div>
        <div v-show="selectedMenu == 2" class="h-[80%] w-[90%]">
          <div class="flex justify-between mt-3 w-full">
            <div class="font-bold text-xl"> 할인설정</div>
            <div><button class="whitebutton">할인설정복사</button></div>
          </div>
          <div class="grid grid-rows-1 grid-cols-[1fr,3fr] mt-3">
            <div class="customtableIndex border border-gray-400 rounded-l-lg">결제코드/명</div>
            <div class="px-1 py-1 border border-gray-300 rounded-r-lg "><input type="text"
                class="border w-full h-full px-1 border-gray-400 rounded-lg" @input="searchPayCd" v-model="searchWord2">
            </div>
          </div>
          <Realgrid class="w-full h-full mt-5" :progname="'MST01_033INS_VUE'" :progid="2" :rowData="clickrowData2"
            @clickedRowData="clickedRowData2" :searchColId="'lngCode,strName'" :searchWord="searchWord2"
            :checkBarInactive="'lngMenu'" :initSelect="true" :ExceptionCheck="'lngMenu'" :showTooltip="true"></Realgrid>
          <!-- :searchColId2="'majorGroupCd,subGroupCd'" :searchColId="'menuCd,menuNm'" :searchColValue2="searchColValue3" :searchWord="searchWord2" -->
        </div>
        <div v-show="selectedMenu == 3" class="h-[90%] w-full">
          <div class="grid grid-rows-1 grid-cols-[2fr,3fr] w-[80%] h-[40%] ml-10 mt-10 border pl-5">
            <div class="flex justify-center items-center"><img :src="`http://211.238.145.30:8085/Uploads/${fileName}`"
                @error="handleImageError" class="w-[80%] h-[80%]"></div>
            <div class="grid grid-rows-[1fr,5fr] grid-cols-[1fr,5fr] border ">
              <div class="customtableIndex border border-gray-400 rounded-l-lg h-full w-full">파일명</div>
              <div class="flex h-full w-full items-center"><input type="text" v-model="fileName2"
                  class="border rounded-lg bg-gray-100 w-full" disabled><button class="whitebutton"
                  @click="downloadFile">다운로드</button></div>
              <div class="customtableIndex border border-gray-400 rounded-l-lg h-full w-full">파일크기</div>
              <div class="grid grid-rows-[1fr,5fr] grid-cols-1">
                <div class="flex"><input type="text" v-model="fileSize"
                    class="border rounded-lg bg-gray-100 w-full h-[80%]" disabled><label for="fileInput"
                    class="whitebutton">파일선택</label>

                  <input id="fileInput" type="file" @change="handleFileUpload" style="display: none;"
                    accept=".jpg,.png,.jpeg" />
                </div>
                <div class="flex flex-col justify-start ml-2"><span class="flex justify-start">* 이미지 사이즈 220*160 </span>
                  <span class="flex justify-start">* 이미지 포맷 : PNG, JPG 등 이미지 형식</span>
                  <span class="flex justify-start">* 이미지 용량 제한 : 2MB </span>
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
import { getMenuCodeEnroll, getMenuList, saveMenuCode, uploadFile } from '@/api/master';
import PickStore12 from '@/components/pickStore12.vue';
import Realgrid from '@/components/realgrid.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

const searchWord2 = ref('');
const nowStoreCd = ref(-1);
const rowData = ref([]);
const filteredrowData = ref([]);
const hideNow = ref(false);
const hideRow = ref([]);
const MENUDEPEND = ref([])
const hiderow = () => {
  //hideRow.value = 3
  hideNow.value = !hideNow.value
}
const addRow4 = ref(false);
const updateRow = ref([])
const deleteRow3 = ref(false);
const searchword1 = ref('');
const MenuGroup = ref('');
const SubMenuGroup = ref('');
const items = ref('');
const selectedPayDistinct = ref(true)
const selectedMultiple = ref(false)
const forsearchMain = ref(0);
const forsearchSub = ref(0);
const afterSearch = ref(false);
const clickedStoreNm = ref()
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const rowData2 = ref([])
const clickrowData2 = ref([])
const rowData3 = ref([])
const filteredrowData3 = ref([])
const itemDiscount = ref([])
const payOptions = ref([])
const rounding = ref([])
const taxs = ref([])
const isNew = ref(false)
const initCheckColumn = ref('menuCd')
const disCountGroup = ref([])
const approveGroup = ref([])
const approveType = ref([])
const filteredapproveType = ref([])
const initCheckValue = ref('')
const initCheckAct = ref(false)
const uncheckValue = ref()
const uncheckAct = ref(false)
const discountDisabled = ref(false)
const labelsData = ref([['할인', '지불', '할증'], ['사용', '미사용']])
const valuesData = ref([['1', '2', '3'], ['0', '1']])
const labelingColumns = ref('payDistinct,blnInactive')
const gridvalue1 = ref(0)
const gridvalue2 = ref("")
const gridvalue3 = ref("")
const gridvalue4 = ref("")
const gridvalue5 = ref("")
const gridvalue6 = ref("")
const gridvalue7 = ref("")
const gridvalue8 = ref("")
const gridvalue9 = ref("")
const gridvalue10 = ref("")
const gridvalue11 = ref("")
const gridvalue12 = ref("")
const gridvalue13 = ref("")
const gridvalue14 = ref("")
const gridvalue15 = ref("")
const gridvalue16 = ref("")
const gridvalue17 = ref("")
const gridvalue18 = ref("")
const gridvalue19 = ref("")
const gridvalue20 = ref("")
const gridvalue21 = ref("")
const gridvalue22 = ref("")
const gridvalue23 = ref("")
const gridvalue24 = ref("")
const gridvalue25 = ref("")
const gridvalue26 = ref("")
const gridvalue27 = ref("")
const gridvalue28 = ref("")
const gridvalue29 = ref("")
const gridvalue30 = ref("")
const gridvalue31 = ref("")
const gridvalue100 = ref("")
const clickedrowdata = ref([])
const clickrowData4 = ref([])
const filteredrowData5 = ref([])
const afterClick = ref(true)
const fileName = ref()
const rowIndex = ref()
const duplilfirstarr = ref()
const tempRowData2 = ref()
const clickedRowData = async (newvalue) => {

  if (newvalue[9] == 0 || newvalue[12] == 1) {
    rowData2.value = []
    clickrowData2.value = []
    if (selectedMenu.value == 2) {
      selectedMenu.value = 1
    }

  } else {
    rowData2.value = JSON.parse(JSON.stringify(tempRowData2.value))
    clickrowData2.value = JSON.parse(JSON.stringify(tempRowData2.value))
  }

  console.log(newvalue)
  rowIndex.value = newvalue.index
  clickrowData4.value = []
  filteredrowData5.value = []
  console.log(newvalue)
  // forsearchMain.value = 0 
  // forsearchSub.value = 0 
  searchWord2.value = ''
  searchWord3.value = ''
  clickedrowdata.value = newvalue[27]
  gridvalue1.value = newvalue[30]
  gridvalue2.value = newvalue[3]
  gridvalue3.value = newvalue[0]
  gridvalue4.value = newvalue[4]
  gridvalue5.value = newvalue[5]
  gridvalue6.value = newvalue[1]
  gridvalue7.value = newvalue[6]
  gridvalue8.value = newvalue[7]
  gridvalue9.value = newvalue[8]
  gridvalue10.value = newvalue[9]
  gridvalue11.value = newvalue[10]
  gridvalue12.value = newvalue[11]
  gridvalue13.value = newvalue[2]
  gridvalue14.value = newvalue[12]
  gridvalue15.value = newvalue[13]
  gridvalue16.value = newvalue[14]
  gridvalue17.value = newvalue[15]
  gridvalue18.value = newvalue[16]
  gridvalue19.value = newvalue[17]
  gridvalue20.value = newvalue[18]
  gridvalue21.value = newvalue[19]
  gridvalue22.value = newvalue[20]
  gridvalue23.value = newvalue[21]
  gridvalue24.value = newvalue[22]
  gridvalue25.value = newvalue[24]
  gridvalue26.value = newvalue[23]
  gridvalue27.value = newvalue[25]
  gridvalue28.value = newvalue[26]
  gridvalue29.value = newvalue[27]
  gridvalue30.value = newvalue[28]
  gridvalue31.value = newvalue[29]

  if (gridvalue16.value == 1) {
    gridvalue100.value = 1
    disabledKPG.value = true
    if (gridvalue18.value != '1' && gridvalue18.value != '99') {
      showKPG.value = false
    } else {
      showKPG.value = true
    }

  } else {
    gridvalue100.value = 0
    disabledKPG.value = false
    showKPG.value = false
  }
  discountDisabled.value = ((newvalue[9] == 0 || newvalue[12] == 1) && afterSearch.value == true && afterClick.value == false)
  fileName.value = newvalue[31]
  fileName2.value = newvalue[31] != undefined ? newvalue[31].split('_').slice(1).join('_') : ''
  try {
    const response = await axios.get(`http://211.238.145.30:8085/Uploads/${fileName.value}`, {
      responseType: 'blob',  // 응답을 Blob 형태로 받음
    });
    uploadImage.value.name = newvalue[31]
    fileSize.value = response.headers['content-length'];
  } catch (error) {
    console.log(error)
    console.log('사진없음')
    uploadImage.value = { name: "" }
    fileSize.value = ""
  }


  console.log(newvalue)
  if (newvalue[34] == true) {
    isNew.value = true
    clickaddrowSeq.value = rowData.value[newvalue.index].sequence
    console.log(clickaddrowSeq.value)
  } else {
    isNew.value = false
  }
  const firstarr = newvalue[32] != undefined ? newvalue[32].split(';') : []
  duplilfirstarr.value = firstarr
  if (rowData2.value.length > 0) {

    let dupliarr = JSON.parse(JSON.stringify(rowData2.value));
    dupliarr.sort((a, b) => {
      const aIndex = firstarr.indexOf(a.lngCode.toString());
      const bIndex = firstarr.indexOf(b.lngCode.toString());

      const rankA = (aIndex !== -1) ? 0 : (a.lngMenu === 0 ? 0 : 1);
      const rankB = (bIndex !== -1) ? 0 : (b.lngMenu === 0 ? 0 : 1);

      // 우선순위(rank)가 다르면 rank에 따라 정렬합니다.
      if (rankA !== rankB) {
        return rankA - rankB;
      }

      // 둘 다 rank 0인 경우 : firstarr에 있으므로 인덱스 순서대로 정렬
      if (rankA === 0) {
        return Number(a.lngCode) - Number(b.lngCode)
      }

      // rank가 1 혹은 2인 경우, 추가 정렬 기준이 필요하면 여기에 추가합니다.
      // 예를 들어, lngCode 오름차순으로 정렬하는 식으로 할 수도 있습니다.
      // (여기서는 별도의 추가 기준이 없으므로 0을 반환하여 순서를 그대로 유지)
      return 0;

    });


    if (firstarr.length > 0 && firstarr[0] !== '') {
      for (var i = 0; i < firstarr.length; i++) {
        const change = dupliarr.find(item => item.lngCode == firstarr[i])

        if (change) {
          change.checkbox = true
        }

      }
    }


    clickrowData2.value = JSON.parse(JSON.stringify(dupliarr))

  }

  afterClick.value = false
  setSubCd3()

}

const selectedIndex = (e) => {
  changeRow.value = e
}
const selectedIndex2 = (e) => {
  changeRow2.value = e

}
const handleStoreCd = async (newValue) => {
  console.log(newValue)
  if (newValue == '-1') {
    afterSearch.value = false;
    afterClick.value = true
    gridvalue3.value = ''
    initAll()
    return;
  }
  if (nowStoreCd.value != newValue) {
    afterSearch.value = false;
    afterClick.value = true
    gridvalue3.value = ''
    initAll()
  }
  nowStoreCd.value = newValue;
  searchButton()
}
const clickmappingData = ref([])
const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData
}

const searchinit = (newvalue) => {
  afterSearch.value = false
}

const handleinitAll = (newvalue) => {

  MenuGroup.value = []
  SubMenuGroup.value = []
  items.value = []
  forsearchMain.value = '0'
  forsearchSub.value = '0'
  afterSearch.value = false
  searchword1.value = ''
  afterSearch.value = false
}

const confirmData = ref([])
const optionGroup = ref([])
const subTitle = ref([])
const menuOrderOption = ref([])
const menuOptionCode = ref([])
const searchButton = async () => {
  items.value = []
  console.log(nowStoreCd.value)
  if (nowStoreCd.value == -1) {
    Swal.fire({
      title: '경고',
      text: '매장을 선택하세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }
  store.state.loading = true;
  try {
    initAll()
    clickrowData2.value = []
    rowData.value = []
    rowData3.value = []
    filteredrowData3.value = []
    rowData.value = [...rowData.value]
    filteredrowData3.value = [...filteredrowData3.value]

    const res = await getMenuCodeEnroll(groupCd.value, nowStoreCd.value)

    rowData.value = res.data.MENULIST
    updateRow.value = rowData.value
    MENUDEPEND.value = res.data.MENUDEPEND
    subTitle.value = res.data.SUBTITLE
    menuOrderOption.value = res.data.MENUORDEROPTION
    menuOptionCode.value = res.data.MENUOPTIONCODE
    confirmData.value = JSON.parse(JSON.stringify(rowData.value))
    console.log(res)
    optionGroup.value = res.data.OPTIONGROUP
    tempRowData2.value = res.data.PAYCD
    const res2 = await getMenuList(groupCd.value, nowStoreCd.value)
    //rowData2.value = res2.data.menuList
    SubMenuGroup.value = res2.data.submenuGroup
    MenuGroup.value = res2.data.menuGroup
    //  console.log(res)
    //  console.log(res2)


  } catch (error) {
    afterSearch.value = false;
  } finally {

    approveType.value = Array.from(
      new Set(
        approveGroup.value.map(item => JSON.stringify({
          strDCode1: item.strDCode1,
          strDName1: item.strDName1
        }))
      )
    ).map(item => JSON.parse(item)).sort((a, b) => a.strDCode1 - b.strDCode1); // 다시 객체로 변환

    store.state.loading = false; // 로딩 상태 종료

    afterSearch.value = true;
  }



};

const selectedMenu = ref(1)
const selectMenu = (newValue) => {
  selectedMenu.value = newValue

}

const searchWord = ref("")
const searchColValue2 = ref("")
const searchC1 = ref(-1)
const searchC2 = ref(-1)

const searchColumn = (e) => {
  const columnNm = e.target.name
  const value = e.target.value

  searchColValue2.value = searchC1.value + "," + searchC2.value

  console.log(searchColValue2.value)
}

const searchword = (e) => {
  searchWord.value = e.target.value
}

const changeInfo = (e) => {
  const tagName = e.target.name;
  const value2 = e.target.value
  console.log(value2)
  changeColid.value = tagName
  changeValue2.value = value2
  changeNow.value = !changeNow.value

}
const searchColValue3 = ref('0,0')
const filteredSubMenuGroup = ref([]);
const setSubCd = () => {

  filteredSubMenuGroup.value = SubMenuGroup.value.filter(item => item.sublngMajor == forsearchMain.value)

  forsearchSub.value = '0'

  searchColValue3.value = forsearchMain.value + ',0'


}

const setSubCd2 = () => {

  searchColValue3.value = searchColValue3.value.split(',')[0] + ',' + forsearchSub.value
}

const filteredSubMenuGroup2 = ref([])
const setSubCd3 = () => {
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(item => item.sublngMajor == gridvalue1.value)

  //gridvalue2.value = '0'

  //searchColValue3.value = gridvalue1.value+',0'
}
const setSubCd4 = () => {
  console.log(SubMenuGroup.value)
  filteredSubMenuGroup2.value = SubMenuGroup.value.filter(item => item.sublngMajor == gridvalue1.value)

  gridvalue2.value = '0'

  //searchColValue3.value = gridvalue1.value+',0'
}

const searchMenuList = (e) => {
  searchWord.value = e.target.value
  hideRow.value = e.target.value
}
const changeColid = ref('checkedMenu')
const changeValue2 = ref('')
const changeRow = ref()
const changeNow = ref(false)

const changeRow2 = ref()
const changeValue3 = ref(true)
const changeColid2 = ref('checkbox')
const changeNow2 = ref(false)
const checkedRowData = (e) => {
  console.log(e)


}
const checkedRowData2 = (e) => {

}

const setAllCheck2 = ref(false)
const searchWord3 = ref()
const searchMenuList2 = (e) => {
  searchWord3.value = e.target.value
}
const addrowProp = ref()
const addrowDefault = ref()
const addrowSeq = ref(1);
const clickaddrowSeq = ref()
const addRow = () => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-CA');
  addrowProp.value = 'lngMainGroup,lngSubGroup,dtmFromDate,dtmToDate,strName,lngPrice,lngTax,blnInactive,strAmtCodeList'
  addrowDefault.value = '0,0,' + formattedDate + ',' + '9999-12-31' + ',' + '' + ',' + '0' + ',' + '0' + ',' + '0' + ',' + ' '

  console.log(addrowProp.value)
  addRow4.value = !addRow4.value
  addrowSeq.value++;
  rowData.value.push({ new: true, sequence: 'new' + addrowSeq.value, lngStoreCode: nowStoreCd.value, strName: undefined, lngCode: undefined, blnInactive: undefined })
  clickaddrowSeq.value = 'new' + addrowSeq.value
}
const deleteRow = () => {
  deleteRow3.value = !deleteRow3.value
}



watch(gridvalue9, () => {
  const selectedCode = gridvalue9.value
  if (selectedCode == '') {
    filteredapproveType.value = []
    return;
  }
  filteredapproveType.value = approveGroup.value.filter(item => item.strDCode1 == selectedCode)
})

const saveButton = () => {
  console.log(rowData.value)
  if (afterSearch.value == false) {
    Swal.fire({
      title: '경고',
      text: '조회를 먼저 진행해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }
  if (JSON.stringify(confirmData.value) === JSON.stringify(rowData.value)) {
    Swal.fire({
      title: '경고',
      text: '변경된 사항이 없습니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }

  const validateRow = rowData.value.filter(item => item.lngCode == '' || item.lngCode == undefined || item.strName == '' || item.strName == undefined || item.lngMainGroup == undefined || item.lngMainGroup == 0 || item.lngSubGroup == undefined || item.lngSubGroup == 0 || item.dtmToDate == undefined || item.dtmFromDate == undefined || item.lngPrice == undefined || item.blnInactive == undefined || item.lngTax == undefined || item.lngKPG == '').length

  if (validateRow > 0) {
    Swal.fire({
      title: '경고',
      text: '미입력된 필수값이 존재합니다. 확인해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }

  const validateRow2 = new Set(rowData.value.map(item => item.lngCode)).size == rowData.value.map(item => item.lngCode).length

  if (validateRow2 == false) {
    Swal.fire({
      title: '경고',
      text: '중복된 메뉴코드가 존재합니다. 확인해주세요.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    return;
  }

  Swal.fire({
    title: '저장',
    text: '저장 하시겠습니까?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: '저장',
    cancelButtonText: '취소'
  }).then(async (result) => {
    if (result.isConfirmed) {
      store.state.loading = true;
      try {
        const filterAndMap = (key) => rowData.value.filter(item => item.deleted !== true).map(item => item[key]).join('\u200B');

        const deleteCd = rowData.value.filter(item => item.deleted == true).map(item => item.lngCode)



        console.log(rowData.value.length)
        console.log(nowStoreCd.value)
        console.log(filterAndMap('lngMainGroup'))
        console.log(filterAndMap('lngSubGroup'))
        console.log(filterAndMap('lngCode'))
        console.log(filterAndMap('dtmFromDate'))
        console.log(filterAndMap('dtmToDate'))
        console.log(filterAndMap('strName'))
        console.log(filterAndMap('strNameE'))
        console.log(filterAndMap('lngDCPrice'))
        console.log(filterAndMap('lngChain'))
        console.log(filterAndMap('lngPrice'))
        console.log(filterAndMap('blnDCPriceYN'))
        console.log(filterAndMap('lngTax'))
        console.log(filterAndMap('blnInactive'))
        console.log(filterAndMap('lngDiscount'))
        console.log(filterAndMap('intCustCount'))
        console.log(filterAndMap('blnCondimentprice'))
        console.log(filterAndMap('lngOrder'))
        console.log(filterAndMap('lngKPG'))
        console.log(filterAndMap('strBarCode'))
        console.log(filterAndMap('blnReceipt'))
        console.log(filterAndMap('lngMenuOption'))
        console.log(filterAndMap('blnRedPrint'))
        console.log(filterAndMap('strIcon'))
        console.log(filterAndMap('blnKitSingle'))
        console.log(filterAndMap('lngSubTitle'))
        console.log(filterAndMap('blnServing'))
        console.log(filterAndMap('blnOpen'))
        console.log(filterAndMap('strAmtCodeList'))
        console.log(filterAndMap('strUserFileName'))
        const res = await saveMenuCode(
          groupCd.value,
          nowStoreCd.value,
          filterAndMap('lngMainGroup'),
          filterAndMap('lngSubGroup'),
          filterAndMap('lngCode'),
          filterAndMap('dtmFromDate'),
          filterAndMap('dtmToDate'),
          filterAndMap('strName'),
          filterAndMap('strNameE'),
          filterAndMap('lngDCPrice'),
          filterAndMap('lngChain'),
          filterAndMap('lngPrice'),
          filterAndMap('blnDCPriceYN'),
          filterAndMap('lngTax'),
          filterAndMap('blnInactive'),
          filterAndMap('lngDiscount'),
          filterAndMap('intCustCount'),
          filterAndMap('blnCondimentprice'),
          filterAndMap('lngOrder'),
          filterAndMap('lngKPG'),
          filterAndMap('strBarCode'),
          filterAndMap('blnReceipt'),
          filterAndMap('lngMenuOption'),
          filterAndMap('blnRedPrint'),
          filterAndMap('strIcon'),
          filterAndMap('blnKitSingle'),
          filterAndMap('lngSubTitle'),
          filterAndMap('blnServing'),
          filterAndMap('blnOpen'),
          filterAndMap('blnDeliveryYN'),
          filterAndMap('strNutrInfo'),
          filterAndMap('strCntryOrg'),
          filterAndMap('strMenuComment'),
          filterAndMap('strAmtCodeList'),
          filterAndMap('strUserFileName'),
          deleteCd.join(',')
        );
        console.log(res)

        const formData = new FormData();
        uploadImages.value.forEach((file, index) => {
          const existedName = rowData.value.find(item => item.strUserFileName == file.name)
          if (existedName) {
            formData.append(`file${index}`, file);
          }

        });

        try {
          const res2 = await uploadFile(formData)
          console.log(res2)
        } catch (error) {
          console.log(error)
        }



        Swal.fire({
          title: '저장 되었습니다.',
          confirmButtonText: '확인',
        })
        store.state.loading = false
      } catch (error) {
        console.log(error)

        Swal.fire({
          title: '저장이 실패되었습니다.',
          confirmButtonText: '확인',
        })
      } finally {
        store.state.loading = false
        searchButton();
      }
    }
  })


}

const updatedRowData = (newvalue) => {

  //   newvalue.forEach((newItem) => {
  //   const targetRow = rowData.value.find(row => row.lngCode == newItem.lngCode);
  //   if (targetRow) {
  //     Object.keys(newItem).forEach(key => {
  //       targetRow[key] = newItem[key]; // 속성 업데이트

  //     });
  //   } else {
  //     const targetRow2 = rowData.value.find(row => row.sequence == clickaddrowSeq.value);
  //     console.log(targetRow2)
  //     Object.keys(newItem).forEach(key => {
  //       targetRow2[key] = newItem[key]; // 속성 업데이트

  //     });
  //   }
  // });

  // rowData를 Map으로 변환 (기존 배열의 특정 필드를 key로 사용)

  const rowDataMap = new Map(
    rowData.value.map(row => [
      row.sequence !== undefined ? row.sequence : row.lngCode.toString(),
      row
    ])
  );

  newvalue.forEach((newItem) => {
    const targetRow = rowDataMap.get(newItem.new == true ? clickaddrowSeq.value : newItem.lngCode.toString()); // Map을 통해 빠르게 찾기

    if (targetRow) {
      // targetRow가 있으면 값을 업데이트
      Object.keys(newItem).forEach(key => {
        targetRow[key] = newItem[key]; // 속성 업데이트
      });
    } else {
      // find 방식 대신 sequence로 찾기
      const targetRow2 = rowDataMap.get(clickaddrowSeq.value.toString());

      Object.keys(newItem).forEach(key => {
        targetRow2[key] = newItem[key]; // 속성 업데이트
      });
    }
  });

  rowData.value = [...rowData.value]

}
const updatedList2 = ref([])
const updatedRowData2 = (newvalue) => {
  for (var i = 0; i < newvalue.length; i++) {
    if (newvalue[i].checkbox == true) {
      const findrow = clickrowData2.value.find(item => item.menuCd == newvalue[i].menuCd)
      findrow.checkbox = true;
    } else {
      const findrow = clickrowData2.value.find(item => item.menuCd == newvalue[i].menuCd)
      findrow.checkbox = false;
    }
  }
  clickrowData2.value = [...clickrowData2.value]


  const temp = ref([])
  for (var i = 0; i < clickrowData2.value.length; i++) {
    if (clickrowData2.value[i].checkbox == true) {
      temp.value.push(clickrowData2.value[i].menuCd)
    }
  }


  const findrow = rowData.value.find(item => item.lngCode == gridvalue5.value)

  if (findrow) {
    findrow.checkedMenu = temp.value.join(',')
  }


}

const updatedRowData3 = (newvalue) => {


  for (var i = 0; i < newvalue.length; i++) {
    if (newvalue[i].checkbox == true) {
      const findrow = filteredrowData3.value.find(item => item.lngCode == newvalue[i].lngCode)
      findrow.checkbox = true;
    } else {
      const findrow = filteredrowData3.value.find(item => item.lngCode == newvalue[i].lngCode)
      findrow.checkbox = false;
    }
  }
  filteredrowData3.value = [...filteredrowData3.value]


  const temp = ref([])
  for (var i = 0; i < filteredrowData3.value.length; i++) {
    if (filteredrowData3.value[i].checkbox != true) {
      temp.value.push(filteredrowData3.value[i].lngCode)
    }
  }


  const findrow = rowData.value.find(item => item.lngCode == gridvalue5.value)

  if (findrow) {
    findrow.unchecklngCode = temp.value.join(',')
  }



}
watch((filteredrowData3), () => {
  changeColid.value = 'unchecklngCode'
  console.log(filteredrowData3.value)
  const arr = filteredrowData3.value.filter(item => item.checkbox != true).map(item => item.lngCode)
  console.log(arr)
  changeValue2.value = arr.join(';')
  if (arr.length > 0) {
    changeNow.value = !changeNow.value
  }

})
watch((clickrowData2), () => {
  // changeColid.value = 'checkedMenu'

  // const arr = clickrowData2.value.filter(item=> item.checkbox == true ).map(item => item.menuCd)
  // console.log(arr)
  // changeValue2.value = arr.join(',')
  // if(arr.length > 0){
  // changeNow.value = !changeNow.value
  // }

})

const clickedRowData2 = (e) => {

  const clickedRow = rowData.value.find(item => item.lngCode == gridvalue3.value.toString())
  if (clickedRow) {


    changeRow.value = rowIndex.value
    changeColid.value = 'strAmtCodeList'

    if (e[0] == undefined || e[0] == false) {
      clickedRow.strAmtCodeList = clickedRow.strAmtCodeList.replace(e[1], '').replace(/;;+/g, ';')
      changeValue2.value = clickedRow.strAmtCodeList.replace(e[1], '').replace(/;;+/g, ';')

    } else {
      console.log(clickedRow)
      changeValue2.value = clickedRow.strAmtCodeList.split(';').filter(item => item !== '').filter(item => {
        const finditem = rowData2.value.find(item2 => item2.lngMenu == '0' && item2.lngCode == item)
        if (finditem) {
          return false
        } else {
          return true
        }
      }).concat(e[1]).map(Number).sort((a, b) => a - b).map(String).join(';')
    }

    changeNow.value = !changeNow.value

  }
}
// watch((forsearchMain) , () => {

// if(forsearchMain.value == 0  && searchWord2.value == ''){
// clickrowData4.value = [...clickrowData2.value]

// } else if( forsearchMain.value != 0  && searchWord2.value == '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value)
// } else if( forsearchMain.value == 0  && searchWord2.value != '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// } else {
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value).filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// }
// forsearchSub.value = 0 ;

// })

// watch((searchWord2) , () => {
// if(forsearchMain.value == 0 && forsearchSub.value == 0  && searchWord2.value == ''){
// clickrowData4.value = [...clickrowData2.value]

// } else if( forsearchMain.value != 0 && forsearchSub.value == 0  && searchWord2.value == '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value)
// } else if( forsearchMain.value == 0  && forsearchSub.value == 0 && searchWord2.value != '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// } else if( forsearchMain.value == 0 && forsearchSub.value != 0  && searchWord2.value != '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.subGroupCd == forsearchSub.value ).filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// } else if ( forsearchMain.value != 0 && forsearchSub.value != 0  && searchWord2.value != '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value && item.subGroupCd == forsearchSub.value).filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// } 
// })

// watch((forsearchSub) , () => {
// if(forsearchSub.value == 0 && forsearchMain.value == 0  && searchWord2.value == ''){
// clickrowData4.value = [...clickrowData2.value]
// } else if (forsearchSub.value == 0 && forsearchMain.value != 0 && searchWord2.value == '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value)
// } else if(forsearchSub.value != 0 && forsearchMain.value != 0 && searchWord2.value == '') {
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value && item.subGroupCd == forsearchSub.value)
// } else if(forsearchSub.value == 0 && forsearchMain.value == 0  && searchWord2.value != ''){
// clickrowData4.value = clickrowData2.value.filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// } else if(forsearchSub.value == 0 && forsearchMain.value != 0 && searchWord2.value != ''){
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value).filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// } else if (forsearchSub.value != 0 && forsearchMain.value != 0 && searchWord2.value != ''){
// clickrowData4.value = clickrowData2.value.filter(item => item.majorGroupCd == forsearchMain.value && item.subGroupCd == forsearchSub.value).filter(item => item.menuCd.includes(searchWord2.value)|| item.menuNm.includes(searchWord2.value))
// }

// })

// watch((searchWord3) , () => {
// if(searchWord3.value == ''){
// filteredrowData5.value = [...filteredrowData3.value]
// } else {
// filteredrowData5.value = filteredrowData3.value.filter(item => item.lngCode.toString().includes(searchWord3.value)|| item.strName.includes(searchWord3.value))
// }
// })
// watch((searchC1) , () => {
// initAll()
// console.log(rowData.value)
// rowData.value = rowData.value.filter(item => item.lngCode !=undefined && item.lngCode != '')
// if(searchC1.value == -1){
// if(searchC2.value == -1 ){
//   updateRow.value = [...rowData.value]
// } else {
//   updateRow.value = rowData.value.filter(item => item.payDistinct == searchC2.value)
// }
// } else if (searchC1.value != -1){
// if(searchC2.value == -1 ){
//   updateRow.value = rowData.value.filter(item => item.blnInactive == searchC1.value)
// } else {
//   updateRow.value = rowData.value.filter(item => item.payDistinct == searchC2.value && item.blnInactive == searchC1.value)
// }
// } 
// })
// watch((searchC2) , () => {
// initAll()
// if(searchC1.value == -1){
// if(searchC2.value == -1 ){
//   updateRow.value = [...rowData.value]
// } else {
//   updateRow.value = rowData.value.filter(item => item.payDistinct == searchC2.value)
// }
// } else if (searchC1.value != -1){
// if(searchC2.value == -1 ){
//   updateRow.value = rowData.value.filter(item => item.blnInactive == searchC1.value)
// } else {
//   updateRow.value = rowData.value.filter(item => item.payDistinct == searchC2.value && item.blnInactive == searchC1.value)
// }
// } 
// })

// watch((searchWord) , () => {
// initAll()
// if(searchC1.value == -1){
// if(searchC2.value == -1 ){
//   updateRow.value = rowData.value.filter(item => item.lngCode?.toString().includes(searchWord.value) || item.strName?.toString().includes(searchWord.value))
// } else {
//   updateRow.value = rowData.value.filter(item => item.payDistinct == searchC2.value).filter(item => item.lngCode.toString().includes(searchWord.value) || item.strName.toString().includes(searchWord.value))
// }
// } else if (searchC1.value != -1){
// if(searchC2.value == -1 ){
//   updateRow.value = rowData.value.filter(item => item.blnInactive == searchC1.value).filter(item => item.lngCode.toString().includes(searchWord.value) || item.strName.toString().includes(searchWord.value))
// } else {
//   updateRow.value = rowData.value.filter(item => item.payDistinct == searchC2.value && item.blnInactive == searchC1.value).filter(item => item.lngCode.toString().includes(searchWord.value) || item.strName.toString().includes(searchWord.value))
// }
// } 
// })
const initFocus = ref(true)
const initAll = () => {
  selectedMenu.value = 1
  clickrowData4.value = []
  filteredrowData5.value = []
  rowData.value = []
  rowData2.value = []
  clickrowData2.value = []
  updateRow.value = []
  forsearchMain.value = 0
  forsearchSub.value = 0
  searchWord3.value = ''
  searchWord2.value = ''
  gridvalue1.value = ''
  gridvalue2.value = ''
  //gridvalue3.value = ''
  gridvalue4.value = ''
  gridvalue5.value = ''
  gridvalue6.value = ''
  gridvalue7.value = ''
  gridvalue8.value = ''
  gridvalue9.value = ''
  gridvalue10.value = ''
  gridvalue11.value = ''
  gridvalue12.value = ''
  gridvalue13.value = ''
  gridvalue14.value = ''
  gridvalue15.value = ''
  gridvalue16.value = ''
  gridvalue17.value = ''
  gridvalue18.value = ''
  gridvalue19.value = ''
  gridvalue20.value = ''
  gridvalue21.value = ''
  gridvalue22.value = ''
  gridvalue23.value = ''
  gridvalue24.value = ''
  gridvalue25.value = ''
  //initFocus.value = !initFocus.value
  fileName.value = ''
  fileSize.value = ''
  fileName2.value = ''

}

const searchPayCd = (e) => {
  const value = e.target.value;

  clickrowData2.value = rowData2.value.filter(item => item.strName.includes(value) || item.lngCode.toString().includes(value));


  duplilfirstarr.value = rowData.value.filter(item => item.lngCode == gridvalue3.value).map(item => item.strAmtCodeList)[0].split(';')

  if (clickrowData2.value.length > 0) {

    let dupliarr = JSON.parse(JSON.stringify(clickrowData2.value));
    dupliarr.sort((a, b) => {
      const aIndex = duplilfirstarr.value.indexOf(a.lngCode.toString());
      const bIndex = duplilfirstarr.value.indexOf(b.lngCode.toString());

      if (aIndex === -1 && bIndex === -1) return 0; // 둘 다 우선순위에 없음
      if (aIndex === -1) return 1; // a가 우선순위에 없음
      if (bIndex === -1) return -1; // b가 우선순위에 없음
      return aIndex - bIndex; // 우선순위 배열에 따라 정렬
    });

    if (duplilfirstarr.value.length > 0 && duplilfirstarr.value[0] !== '') {
      for (var i = 0; i < duplilfirstarr.value.length; i++) {

        const change = dupliarr.find(item => item.lngCode == duplilfirstarr.value[i])

        if (change) {
          change.checkbox = true
        }

      }
    }
    clickrowData2.value = dupliarr
  }

}
const uploadImage = ref({ name: "" })
const uploadImages = ref([])
const fileSize = ref()
const fileName2 = ref()
const fileDownloadUrl = ref()
const randomuuid = ref()
const maxSize = 2 * 1024 * 1024
const handleFileUpload = async (e) => {

  fileSize.value = e.target.files[0].size
  if (fileSize.value > maxSize) {
    Swal.fire({
      title: '경고',
      text: '파일 크기가 2MB를 초과합니다.',
      icon: 'warning',
      confirmButtonText: '확인'
    })
    e.target.value = ''
    return;
  }
  fileName2.value = e.target.files[0].name
  changeColid.value = 'strUserFileName'
  randomuuid.value = uuidv4();
  changeValue2.value = randomuuid.value + '_' + fileName2.value
  console.log(changeValue2.value)
  changeNow.value = !changeNow.value

  const file = e.target.files[0];
  uploadImage.value = new File([file], changeValue2.value, { type: file.type })
  uploadImages.value.push(uploadImage.value)
  console.log(uploadImages.value)


}

const downloadFile = async () => {

  try {
    const response = await axios.get(`http://211.238.145.30:8085/Uploads/${fileName.value}`, {
      responseType: 'blob',  // 응답을 Blob 형태로 받음
    });

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${fileName.value}`; // 다운로드 파일명 설정
    downloadLink.click();

    // 다운로드 후 Blob URL 해제
    window.URL.revokeObjectURL(url);
  } catch (error) {
    Swal.fire({
      title: '오류',
      text: '파일 다운로드 실패',
      icon: 'error',
      confirmButtonText: '확인'
    })
  }



}

const handleImageError = (e) => {
  e.target.src = 'http://211.238.145.30:8085/images/noimage2.png';
}

const disabledKPG = ref(true)
const disableKPG = (e) => {
  const kpg = e.target.value
  if (kpg == 1) {
    disabledKPG.value = true
    showKPG.value = false
  } else {
    disabledKPG.value = false
    showKPG.value = true
    gridvalue18.value = '1'
    changeColid.value = 'lngKPG'
    changeValue2.value = '1'
    changeNow.value = !changeNow.value
  }
}
const showKPG = ref(true)
const resetKPG = (e) => {
  if (e.target.value == '1' || e.target.value == '99') {
    showKPG.value = true
  } else {
    showKPG.value = false
  }
}



</script>

<style scoped></style>