/*--############################################################################
# Filename : CRM01_001INS.vue                                                  
# Description : 고객관리 > 고객신상정보 > 고객정보                              
# Date :2025-06-13                                                             
# Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="searchButton" class="button save md:w-auto w-14">
          저장
        </button>
        <button @click="excelButton" class="button save w-auto excel">
          엑셀
        </button>
      </div>
    </div>
    <div
      class="grid grid-cols-3 grid-rows-7 bg-gray-200 rounded-lg h-80 items-center z-10 space-x-5 pt-4">
      <div class="justify-start ml-16 flex col-span-2">
        <PickStoreSingle
          :setDisableType="true"
          @lngStoreCode="lngStoreCode"
          @lngStoreGroup="lngStoreGroup"
          @lngSupervisor="lngSupervisor"
          @lngStoreTeam="lngStoreTeam"></PickStoreSingle>
      </div>
      <div
        class="h-full !-ml-52 mt-1 justify-center items-center flex flex-col space-y-3">
        <div class="flex justify-start items-center">
          <div class="text-center font-semibold text-sm">고객카드번호 :</div>
          <div class="ml-5">
            <input type="text" class="h-6 w-32" v-model="cond" />
          </div>
          <span class="text-red-400">※ '-'없이 기입</span>
        </div>
        <div class="flex justify-start items-center mr-10">
          <div class="text-center font-semibold text-sm">고객명 :</div>
          <div class="ml-5">
            <input type="text" class="h-6 w-32" v-model="cond2" />
          </div>
        </div>
      </div>
      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">생년월일</div>
        <div class="flex w-20">
          <select name="" id="" class="w-12 h-7" v-model="cond3">
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
          월
        </div>

        <div>
          <select name="" id="" class="w-12 h-7" v-model="cond4">
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
          일자
        </div>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">직종</div>
        <select name="" id="" class="w-32 h-7" v-model="cond5">
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

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">성별</div>
        <select name="" id="" class="w-32 h-7" v-model="cond6">
          <option value="0">전체</option>
          <option value="1">여자</option>
          <option value="2">남자</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">전화번호</div>
        <div class="flex w-20 h-7">
          <input type="text" v-model="cond7" />
          <span class="text-nowrap">※010-0000-0000</span>
        </div>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-14">
        <div class="text-center font-semibold text-sm">가입상태</div>
        <select name="" id="" class="w-32 h-7" v-model="cond8">
          <option value="0">전체</option>
          <option value="1">정상</option>
          <option value="2">대기</option>
          <option value="3">탈퇴</option>
          <option value="4">삭제</option>
          <option value="5">중지</option>
          <option value="6">웹전용</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-14">
        <div class="text-center font-semibold text-sm">결혼여부</div>
        <select name="" id="" class="w-32 h-7" v-model="cond9">
          <option value="0">전체</option>
          <option value="1">미혼</option>
          <option value="2">기혼</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pr-20">
        <Datepicker2
          :disableBox="false"
          class="!-ml-10"
          @endDate="endDate"
          @startDate="startDate"
          :removeDefault="true"
          :mainName="'가입일'"></Datepicker2>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pr-20">
        <Datepicker2
          :disableBox="false"
          class="!-ml-20"
          @endDate="endDate2"
          @startDate="startDate2"
          :removeDefault="true"
          :mainName="'최초사용일'"></Datepicker2>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !ml-20">
        <div class="text-center font-semibold text-sm">등급</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond10">
          <option value="0">전체</option>
          <option :value="i.intLevel" v-for="i in optionList">
            {{ i.strLevelName }}
          </option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pl-12">
        <div class="text-center font-semibold text-sm">누적포인트</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond11">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond12" />
      </div>

      <div class="flex justify-start space-x-5 mt-6 !pl-5">
        <div class="text-center font-semibold text-sm">잔여포인트</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond13">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond14" />
      </div>

      <div class="flex justify-start space-x-5 mt-6">
        <Datepicker2
          :disableBox="false"
          class="!-ml-20"
          @endDate="endDate3"
          @startDate="startDate3"
          :removeDefault="true"
          :mainName="'최종사용일'"></Datepicker2>
      </div>

      <div class="flex justify-start space-x-5 mt-3 !pl-12">
        <div class="text-center font-semibold text-sm">방문횟수</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond15">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond16" />
      </div>

      <div class="flex justify-start space-x-5 mt-3 !pl-5">
        <div class="text-center font-semibold text-sm">SMS수신동의</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond17">
          <option value="2">전체</option>
          <option value="0">동의</option>
          <option value="1">비동의</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-3 !ml-12">
        <div class="text-center font-semibold text-sm">실매출액</div>
        <select name="" id="" class="border w-10 h-7 ml-2" v-model="cond18">
          <option value="1"><</option>
          <option value="2">=</option>
          <option value="3">></option>
        </select>
        <input type="number" class="w-32" v-model="cond19" />
      </div>

      <div class="flex justify-start space-x-5 mt-0 !pl-12">
        <div class="text-center font-semibold text-sm">마케팅수신동의</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond20">
          <option value="2">전체</option>
          <option value="0">동의</option>
          <option value="1">비동의</option>
        </select>
      </div>

      <div class="flex justify-start space-x-5 mt-0 !pl-5">
        <div class="text-center font-semibold text-sm">휴면회원여부</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="cond21">
          <option value="-1">전체</option>
          <option value="1">일반</option>
          <option value="2">휴면</option>
        </select>
      </div>

      <div class="flex justify-start items-center space-x-5 mt-0 !ml-12">
        <div class="text-center font-semibold text-sm">선호매장</div>
        <select name="" id="" class="border w-32 h-7 ml-2" v-model="pstore">
          <option value="0">전체</option>
          <option :value="i.lngStoreCode" v-for="i in optionList2">
            {{ i.strName }}
          </option>
        </select>
      </div>
    </div>
    <!-- 조회조건 -->
    <!-- 그리드 영역 -->
    <span class="text-red-500"
      >※더블클릭하시면 고객 정보를 수정하실수 있습니다.</span
    >
    <div class="grid grid-rows-1 grid-cols-1 w-full h-[40vh]">
      <div class="w-full h-full">
        <Realgrid
          :progname="'CRM01_001INS_VUE'"
          :progid="1"
          :rowData="rowData"
          :reload="reload"
          :documentTitle="'CRM01_001INS'"
          @clickedRowData="clickedRowData"
          @dblclickedRowData="dblclickedRowData"
          :documentSubTitle="documentSubTitle"
          :rowStateeditable="false"
          :exporttoExcel="exportExcel">
        </Realgrid>
      </div>
    </div>
  </div>

  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div
      class="bg-white p-6 rounded-2xl shadow-xl w-[60vw] h-[70vh] text-center">
      <div
        class="grid grid-rows-[1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_4fr] grid-cols-[1fr,4fr,1fr,4fr] h-[95%]">
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          고객카드번호
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input
            type="text"
            class="border w-[80%] h-[80%] border-black"
            v-model="pcond" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          구분
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5 space-x-3">
          <label for="cond"
            ><input
              type="radio"
              id="cond"
              v-model="pcond2"
              value="0" />개인</label
          ><label for="cond2"
            ><input
              type="radio"
              id="cond2"
              v-model="pcond2"
              value="1" />법인</label
          >
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          고객명
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input
            type="text"
            class="border w-[35%] h-[80%] border-black"
            v-model="pcond3" />
          <span class="text-red-400">(영문)</span
          ><input
            type="text"
            class="border w-[35%] h-[80%] border-black"
            v-model="pcond4" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          성별
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5 space-x-3">
          <label for="cond"
            ><input
              type="radio"
              id="cond"
              name="pcond5"
              v-model="pcond5" />여자</label
          ><label for="cond2"
            ><input
              type="radio"
              id="cond2"
              name="pcond5"
              v-model="pcond5" />남자</label
          >
          <label for="cond3"
            ><input
              type="radio"
              id="cond3"
              name="pcond5"
              v-model="pcond5" />외국인</label
          >
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          휴대폰번호
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5 space-x-2">
          <select
            name=""
            id=""
            class="border w-14 border-black"
            v-model="pcond6">
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="016">016</option>
            <option value="017">017</option>
            <option value="018">018</option>
          </select>
          <input
            type="text"
            class="border w-24 border-black"
            v-model="pcond7" />
          <input
            type="text"
            class="border w-24 border-black"
            v-model="pcond8" />
          <label for="cond4"
            ><input type="checkbox" id="cond4" v-model="pcond9" />SMS 수신
            동의</label
          >
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          등급
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <select name="" id="" class="border w-32 h-7 ml-2" v-model="pcond10">
            <option value="0">전체</option>
            <option :value="i.intLevel" v-for="i in optionList">
              {{ i.strLevelName }}
            </option>
          </select>
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          전화번호
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input
            type="text"
            class="border w-44 border-black"
            v-model="pcond11" />
          <span class="text-red-400">※02-111-2222</span>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          주민번호
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5 space-x-2">
          <input
            type="text"
            maxlength="6"
            class="border border-black w-24"
            v-model="pcond12" />

          <input
            type="text"
            maxlength="7"
            class="border border-black w-24"
            v-model="pcond13" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          E-mail
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input
            type="text"
            class="border w-48 border-black"
            v-model="pcond14" />
          <label for="cond5"
            ><input type="checkbox" id="cond5" v-model="pcond15" />이메일 수신
            동의</label
          >
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          가입일
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input type="text" disabled class="border" v-model="pcond16" />
        </div>

        <div class="border-l border-t border-black bg-gray-100"></div>
        <div class="border-l border-t border-black"></div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          가입매장
        </div>
        <div class="border-l border-t border-black">
          <div class="grid grid-rows-1 grid-cols-3 w-full h-full">
            <div class="flex justify-start items-center pl-5">
              <select
                name=""
                id=""
                class="w-[90%] border border-black"
                v-model="pcond17">
                <option :value="i.lngStoreCode" v-for="i in optionList2">
                  {{ i.strName }}
                </option>
              </select>
            </div>
            <div class="bg-gray-100 h-full flex justify-center items-center">
              선호매장
            </div>
            <div class="flex justify-start items-center pl-5">
              <select
                name=""
                id=""
                class="w-[90%] border border-black"
                v-model="pcond18">
                <option value="0">미선택</option>
                <option :value="i.lngStoreCode" v-for="i in optionList2">
                  {{ i.strName }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          집주소
        </div>
        <div class="border-l border-t border-black col-span-3 pl-5">
          <div class="flex justify-start items-center space-x-3 mt-1">
            <input
              type="text"
              class="border w-36 border-black"
              v-model="pcond19" />
            <button class="whitebutton" @click="showAddress">조회</button>
            <input
              type="text"
              class="w-56 border border-black"
              v-model="pcond20" />
            <input
              type="text"
              class="w-56 border border-black"
              v-model="pcond21" />
            <label for="cond6"
              ><input
                type="checkbox"
                id="cond6"
                v-model="pcond22" />집주소</label
            >
            <label for="cond7"
              ><input
                type="checkbox"
                id="cond7"
                v-model="pcond23" />사무실주소</label
            >
          </div>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          사무실주소
        </div>
        <div class="border-l border-t border-black col-span-3 pl-5">
          <div class="flex justify-start items-center space-x-3 mt-1">
            <input
              type="text"
              class="border w-36 border-black"
              v-model="pcond24" />
            <button class="whitebutton" @click="showAddress2">조회</button>
            <input
              type="text"
              class="w-56 border border-black"
              v-model="pcond25" />
            <input
              type="text"
              class="w-56 border border-black"
              v-model="pcond26" />
          </div>
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          생년월일
        </div>
        <div class="border-l border-t border-black">
          <div class="flex justify-start items-center pl-5 space-x-3 mt-1">
            <input type="date" class="border border-black" v-model="pcond27" />
            <label for="cond8"
              ><input
                type="radio"
                id="cond8"
                name="cond8"
                v-model="pcond28" />음력</label
            >
            <label for="cond9"
              ><input
                type="radio"
                id="cond9"
                name="cond8"
                v-model="pcond28" />양력</label
            >
          </div>
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          결혼기념일
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <div class="flex justify-start items-center space-x-3">
            <input type="date" class="border border-black" v-model="pcond29" />
            <label for="cond10"
              ><input
                type="radio"
                id="cond10"
                name="cond10"
                v-model="pcond30" />생일</label
            >
            <label for="cond11"
              ><input
                type="radio"
                id="cond11"
                name="cond10"
                v-model="pcond30" />결혼기념일</label
            >
          </div>
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          결혼여부
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5 space-x-2">
          <label for="cond8"
            ><input
              type="radio"
              id="cond8"
              name="cond8"
              v-model="pcond31" />미혼</label
          >
          <label for="cond9"
            ><input
              type="radio"
              id="cond9"
              name="cond8"
              v-model="pcond31" />기혼</label
          >
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          정보활용동의
        </div>
        <div
          class="border-l border-t border-black flex justify-start pl-5 items-center">
          <label for="cond11"
            ><input
              type="checkbox"
              class="border"
              id="cond11"
              v-model="pcond32" />활용 동의함</label
          >
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          직종
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <select
            name=""
            id=""
            class="w-32 h-7 border border-black"
            v-model="pcond33">
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
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          직장명
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input
            type="text"
            class="border w-48 border-black"
            v-model="pcond34" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          부서명
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input
            type="text"
            class="border border-black w-48"
            v-model="pcond35" />
        </div>
        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          직급
        </div>
        <div
          class="border-l border-t border-black flex justify-start items-center pl-5">
          <input type="text" class="border border-black" v-model="pcond36" />
        </div>

        <div
          class="border-l border-t border-black bg-gray-100 flex justify-center items-center">
          비고
        </div>
        <div class="border-l border-t border-black col-span-3">
          <input type="text" class="border h-full w-full" v-model="pcond37" />
        </div>
      </div>
      <div class="flex justify-end space-x-3 mt-5">
        <button
          @click="visible = false"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          저장
        </button>
        <button
          @click="visible = false"
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          닫기
        </button>
      </div>
    </div>
  </div>
  <GetZipCode v-if="show1" @closePopUp="show1 = false"></GetZipCode>
  <GetZipCode v-if="show2" @closePopUp="show2 = false"></GetZipCode>
  <!-- 그리드 영역 -->
</template>

<script setup>
import {
  getCustInitData,
  getCustomerInfo,
  getCustPointInfo,
  getCustRecord,
  getInitDataCustPurchase,
  getReceiptDataDetail2,
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
import PickStore from "@/components/pickStore.vue";
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

import { insertPageLog } from "@/customFunc/customFunc";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { onMounted, ref } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

const optionList = ref([]);
const optionList2 = ref([]);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getInitDataCustPurchase(store.state.userData.lngStoreGroup);
  optionList.value = res.data.List;

  const res2 = await getCustInitData(store.state.userData.lngStoreGroup);
  optionList2.value = res2.data.List;
});

const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const condValue = ref(0);
const store = useStore();
const cond = ref("");
const cond2 = ref("");
const cond3 = ref(0);
const cond4 = ref(0);
const cond5 = ref(0);
const cond6 = ref(0);
const cond7 = ref("");
const cond8 = ref(0);
const cond9 = ref(0);
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
const datepicker = ref(null);
const closePopUp = ref(false);

const point1 = ref();
const point2 = ref();
const point3 = ref();
const point4 = ref();

const pcond = ref();
const pcond2 = ref();
const pcond3 = ref();
const pcond4 = ref();
const pcond5 = ref();
const pcond6 = ref();
const pcond7 = ref();
const pcond8 = ref();
const pcond9 = ref();
const pcond10 = ref();
const pcond11 = ref();
const pcond12 = ref();
const pcond13 = ref();
const pcond14 = ref();
const pcond15 = ref();
const pcond16 = ref();
const pcond17 = ref();
const pcond18 = ref();
const pcond19 = ref("");
const pcond20 = ref("");
const pcond21 = ref("");
const pcond22 = ref(false);
const pcond23 = ref(false);
const pcond24 = ref("");
const pcond25 = ref("");
const pcond26 = ref("");
const pcond27 = ref();
const pcond28 = ref(0);
const pcond29 = ref();
const pcond30 = ref(0);
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
  console.log(e);
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
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    console.log(
      groupCd.value,
      0,
      team.value,
      supervisor.value,
      storeCd.value,
      null,
      cond.value,
      cond2.value,
      cond8.value,
      null,
      cond3.value,
      cond4.value,
      cond9.value,
      cond6.value,
      cond5.value,
      cond7.value,
      null,
      null,
      null,
      sDate.value,
      eDate.value,
      sDate2.value,
      eDate2.value,
      sDate3.value,
      eDate3.value,
      cond11.value,
      cond12.value,
      cond13.value,
      cond14.value,
      cond18.value,
      cond19.value,
      cond15.value,
      cond16.value,
      cond10.value,
      cond17.value,
      pstore.value,
      cond21.value,
      cond20.value
    );
    if (cond19.value == "") {
      cond19.value = null;
    }
    if (cond14.value == "") {
      cond14.value = null;
    }
    if (cond12.value == "") {
      cond12.value = null;
    }
    const res = await getCustomerInfo(
      groupCd.value,
      0,
      team.value,
      supervisor.value,
      storeCd.value,
      null,
      cond.value,
      cond2.value,
      cond8.value,
      null,
      cond3.value,
      cond4.value,
      cond9.value,
      cond6.value,
      cond5.value,
      cond7.value,
      null,
      null,
      null,
      sDate.value,
      eDate.value,
      sDate2.value,
      eDate2.value,
      sDate3.value,
      eDate3.value,
      cond11.value,
      cond12.value,
      cond13.value,
      cond14.value,
      cond18.value,
      cond19.value,
      cond15.value,
      cond16.value,
      cond10.value,
      cond17.value,
      pstore.value,
      cond21.value,
      cond20.value
    );

    rowData.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};

// const clickedRowData = async (e) => {
//   console.log(e);
//   // const res = await getReceiptDataDetail2(e[1], e[2], e[0]);
//   // console.log(res);
//   // rowData2.value = res.data.List;
//   // rowData3.value = res.data.List2;
//   // rowData4.value = res.data.List3;
// };

const dblclickedRowData = (e) => {
  console.log(e);
  visible.value = true;
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

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelList.value;

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
