<!-- /*--############################################################################
# Filename : CRM21_004INS.vue                                                  
# Description : 고객관리 > 프로모션 관리 > 영수증 이벤트 등록         
# Date :2025-09-15                                                             
# Author : 권맑음                     
################################################################################*/ -->
<template>
  <!-- 조회조건 -->
  <div class="h-full" @click="handleParentClick">
    <div class="flex justify-between items-center w-full overflow-y-hidden">
      <PageName></PageName>
      <div class="flex justify-center mr-9 space-x-2 pr-5">
        <button @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button @click="addButton" class="button new md:w-auto w-14">
          신규
        </button>
        <button @click="saveButton" class="button save w-auto">저장</button>
      </div>
    </div>
    <div class="h-[20vh] w-full">
      <Realgrid
        :progname="'CRM21_004INS_VUE'"
        :progid="1"
        :rowData="rowData"
        @buttonClicked="buttonClicked"
        :rowStateeditable="false">
      </Realgrid>
    </div>
    <div v-if="afterClick">
      <div class="grid grid-rows-1 grid-cols-[1fr,2fr,1fr,2fr] mt-1">
        <div
          class="border-l border-t border-black flex justify-center items-center bg-gray-100">
          영수증이벤트명
        </div>
        <div class="flex border-l border-t border-black space-x-2">
          <input
            type="text"
            class="border border-black w-[15%] disabled:bg-gray-50"
            v-model="cond"
            disabled />
          <input
            type="text"
            class="border border-black w-[60%]"
            v-model="cond2" />
        </div>
        <div
          class="border-l border-t border-black flex justify-center items-center bg-gray-100">
          이벤트 기간
        </div>
        <div class="border-l border-t border-black">
          <input type="date" class="border border-black" v-model="cond3" /> ~
          <input type="date" class="border border-black" v-model="cond4" />
        </div>
      </div>

      <div
        class="w-full h-6 bg-gray-400 flex justify-center items-center text-white">
        행사 조건
      </div>
      <div class="grid grid-cols-[2.5fr,5fr,2.5fr,5fr] grid-rows-1 h-[45vh]">
        <div
          class="bg-gray-100 flex justify-center items-center border-l border-t border-black">
          출력 적용매장
        </div>
        <div class="flex flex-col border-l border-t border-black">
          <div class="flex h-full">
            <Realgrid
              :progname="'CRM10_001INS_VUE'"
              :progid="3"
              class="w-[80%] h-full"
              :rowStateeditable="false"
              :rowData="rowData2">
            </Realgrid>
            <div>
              <button class="button search" @click="openStore(1)">조회</button>
            </div>
          </div>
          <div>
            ※전체 요일 및 전체 시간대 적용 시 요일선택 및 시간대 별도 입력은
            필요하지 않습니다.
          </div>
        </div>

        <div
          class="bg-gray-100 grid grid-rows-[8fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] grid-cols-1 border-l border-t border-black">
          <div class="flex justify-center items-center border-b border-black">
            행사조건메뉴
          </div>
          <div class="flex justify-center items-center border-b border-black">
            영수금액
          </div>
          <div class="flex justify-center items-center border-b border-black">
            영수객수
          </div>
          <div class="flex justify-center items-center border-b border-black">
            주문메뉴수
          </div>
          <div class="flex justify-center items-center border-b border-black">
            출력대상선택
          </div>
          <div class="flex justify-center items-center border-b border-black">
            결제수단선택
          </div>
          <div class="flex justify-center items-center border-b border-black">
            요일선택
          </div>
          <div class="flex justify-center items-center border-b border-black">
            시간대
          </div>
        </div>
        <div
          class="grid grid-rows-[8fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr] grid-cols-1 border-l border-t border-black">
          <div class="flex flex-col border-b border-black">
            <div
              class="flex space-x-3 border border-black justify-center items-center">
              <label for="cond5"
                ><input
                  type="radio"
                  id="cond5"
                  name="cond5"
                  v-model="cond5"
                  value="true" />전체메뉴선택</label
              >
              <label for="cond6"
                ><input
                  type="radio"
                  id="cond6"
                  name="cond5"
                  v-model="cond5"
                  value="false" />특정메뉴선택</label
              >
            </div>
            <div class="h-[80%] flex justify-start">
              <Realgrid
                :progname="'CRM10_001INS_VUE'"
                :progid="2"
                class="w-[70%]"
                :rowStateeditable="false"
                :rowData="rowData3">
              </Realgrid>
              <div>
                <button
                  class="button search"
                  @click="openMenu(1)"
                  :disabled="cond5 == 'true'">
                  조회
                </button>
              </div>
            </div>
            <div class="flex space-x-2 border border-black justify-center">
              <label for="cond7"
                ><input
                  type="radio"
                  id="cond7"
                  name="cond7"
                  @change="setCond6"
                  v-model="cond6"
                  value="1" />영수증별</label
              >
              <label for="cond8"
                ><input
                  type="radio"
                  id="cond8"
                  @change="setCond6"
                  name="cond7"
                  v-model="cond6"
                  value="2" />메뉴별</label
              >
              <label for="cond9"
                ><input
                  type="radio"
                  id="cond9"
                  @change="setCond6"
                  name="cond7"
                  v-model="cond6"
                  value="3" />메뉴수량별</label
              >
            </div>
          </div>

          <div
            class="flex justify-start items-center space-x-3 border-b border-black">
            <input
              type="text"
              class="border border-black h-[90%] w-[40%]"
              v-model="cond7" />
            <label for="cond10" class="text-red-400"
              ><input
                type="radio"
                id="cond10"
                name="cond10"
                v-model="cond8"
                value="1" />(이상)</label
            >
            <label for="cond11" class="text-red-400"
              ><input
                type="radio"
                id="cond11"
                name="cond10"
                v-model="cond8"
                value="2" />(마다)</label
            >
          </div>

          <div
            class="flex justify-start items-center space-x-3 border-b border-black">
            <input
              type="text"
              class="border border-black h-[90%] w-[40%]"
              v-model="cond9" />
            <div class="text-red-400">이상</div>
          </div>

          <div
            class="flex justify-start items-center space-x-3 border-b border-black">
            <input
              type="text"
              class="border border-black h-[90%] w-[40%]"
              v-model="cond10" />
            <div class="text-red-400">이상</div>
          </div>

          <div
            class="flex justify-start items-center space-x-3 border-b border-black">
            <select
              name=""
              id=""
              class="border border-black h-[90%] w-[40%]"
              v-model="cond11">
              <option :value="i.strDCode" v-for="i in optionList4">
                {{ i.strDName }}
              </option>
            </select>
          </div>

          <div
            class="flex justify-start items-center space-x-3 border-b border-black">
            <select
              name=""
              id=""
              class="border border-black h-[90%] w-[40%]"
              v-model="cond12">
              <option value="0">전체</option>
              <option :value="i.strDCode" v-for="i in optionList5">
                {{ i.strDName }}
              </option>
            </select>
          </div>

          <div
            class="flex justify-start items-center space-x-3 border-b border-black">
            <label for=""><input type="checkbox" v-model="cond13" />월</label>
            <label for=""><input type="checkbox" v-model="cond14" />화</label>
            <label for=""><input type="checkbox" v-model="cond15" />수</label>
            <label for=""><input type="checkbox" v-model="cond16" />목</label>
            <label for=""><input type="checkbox" v-model="cond17" />금</label>
            <label for=""><input type="checkbox" v-model="cond18" />토</label>
            <label for=""><input type="checkbox" v-model="cond19" />일</label>
          </div>

          <div class="flex justify-start items-center space-x-3 pl-2">
            <input type="time" class="border border-black" v-model="cond20" />
            <div>~</div>
            <input type="time" class="border border-black" v-model="cond21" />
          </div>
        </div>
      </div>
      <div
        class="w-full h-6 bg-gray-400 flex justify-center items-center text-white">
        영수증 문구
      </div>
      <div class="grid grid-rows-1 grid-cols-[2.5fr,5fr,2.5fr,5fr]">
        <div class="bg-gray-100 grid grid-rows-[1fr,2fr,5fr,12fr,12fr]">
          <div class="flex justify-center items-center border-b border-black">
            영수증재발행
          </div>
          <div class="flex justify-center items-center border-b border-black">
            머리말
          </div>
          <div class="flex justify-center items-center border-b border-black">
            쿠폰/응모번호
          </div>
          <div class="flex justify-center items-center border-b border-black">
            본문
          </div>
          <div class="flex justify-center items-center border-b border-black">
            꼬리말
          </div>
        </div>
        <div class="grid grid-rows-[1fr,2fr,5fr,12fr,12fr]">
          <div class="border-b border-black">
            <label for=""
              ><input type="checkbox" v-model="cond22" />영수증재발행</label
            >
          </div>
          <div class="border-b border-black flex flex-col space-y-1 w-full">
            <div class="flex justify-center">
              <input
                type="text"
                class="border border-black w-[80%]"
                v-model="cond23" />
            </div>
            <div class="flex justify-center">
              <input
                type="text"
                class="border border-black w-[80%]"
                v-model="cond24" />
            </div>
          </div>

          <div
            class="border-b border-black flex flex-col space-y-5 justify-center">
            <div class="flex space-x-3">
              <label for="cond25"
                ><input
                  type="radio"
                  value="1"
                  v-model="cond25"
                  id="cond25"
                  name="cond25" />응모번호</label
              >
              <label for="cond26"
                ><input
                  type="radio"
                  value="2"
                  v-model="cond25"
                  id="cond26"
                  name="cond25" />쿠폰번호</label
              >
            </div>
            <div class="h-full">
              <select
                name=""
                id=""
                class="w-[40%] h-[80%] border border-black"
                @change="alarmCond26"
                v-model="cond26">
                <option value="1" v-if="cond25 == '1'">
                  응모번호 사용 안함
                </option>
                <option value="2" v-if="cond25 == '1'">
                  응모번호 POS 자동 생성(14자리)
                </option>
                <option value="3" v-if="cond25 == '1'">응모번호 업로드</option>

                <option value="4" v-if="cond25 == '2'">
                  쿠폰번호 사용 안함
                </option>
                <option value="5" v-if="cond25 == '2'">
                  쿠폰번호 POS 자동 생성(14자리)
                </option>
                <option value="6" v-if="cond25 == '2'">쿠폰번호 업로드</option>
              </select>
            </div>
            <div class="flex space-x-3">
              <label for="cond27"
                ><input
                  type="radio"
                  v-model="cond27"
                  value="0"
                  id="cond27"
                  name="cond27" />숫자출력</label
              >
              <label for="cond28"
                ><input
                  type="radio"
                  v-model="cond27"
                  value="1"
                  id="cond28"
                  name="cond27" />바코드출력</label
              >
            </div>
          </div>

          <div
            class="border-b border-black flex flex-col space-y-5 justify-center">
            <div class="flex space-x-3">
              ※본문 및 꼬리말 중간에 공란 줄 띄어 쓰기시에 스페이스키 입력.
            </div>
            <div class="h-full space-y-1">
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond28" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond29" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond30" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond31" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond32" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond33" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond34" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond35" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond36" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond37" />
            </div>
          </div>

          <div
            class="border-b border-black flex flex-col justify-center items-center">
            <div class="h-full space-y-1 mt-2">
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond38" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond39" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond40" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond41" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond42" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond43" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond44" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond45" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond46" />
              <input
                type="text"
                class="text border border-black w-[80%]"
                v-model="cond47" />
            </div>
          </div>
        </div>
        <div
          class="bg-gray-100 grid grid-rows-[1fr,24fr] border-l border-t border-black">
          <div
            class="flex justify-center items-center border-b border-black w-full">
            출력 방식
          </div>
          <div
            class="flex justify-center items-center border-b border-black w-full">
            영수증 출력
          </div>
        </div>
        <div class="grid grid-rows-[1fr,24fr] border-l border-t border-black">
          <div
            class="flex space-x-3 justify-center items-center border-b border-black">
            <label for=""
              ><input type="checkbox" v-model="cond48" />영수증절취</label
            >
            <label for=""
              ><input type="checkbox" v-model="cond49" />하단문구 제외
              출력</label
            >
            <label for=""
              ><input type="checkbox" v-model="cond50" />상단
              로고(Logo)출력</label
            >
          </div>

          <div
            class="grid grid-rows-none grid-cols-1 justify-center items-start">
            <div class="flex justify-center">
              <img
                src="../../assets/9185593.png"
                alt=""
                class="w-[30%] h-[40%]" />
            </div>
            <div class="flex justify-center items-center">{{ cond23 }}</div>
            <div></div>
            <div class="flex justify-center items-center">{{ cond24 }}</div>
            <div></div>

            <div></div>
            <div class="flex justify-center items-center">{{ cond28 }}</div>
            <div class="flex justify-center items-center">{{ cond29 }}</div>
            <div class="flex justify-center items-center">{{ cond30 }}</div>
            <div class="flex justify-center items-center">{{ cond31 }}</div>
            <div class="flex justify-center items-center">{{ cond32 }}</div>
            <div class="flex justify-center items-center">{{ cond33 }}</div>
            <div class="flex justify-center items-center">{{ cond34 }}</div>
            <div class="flex justify-center items-center">{{ cond35 }}</div>
            <div class="flex justify-center items-center">{{ cond36 }}</div>
            <div class="flex justify-center items-center">{{ cond37 }}</div>
            <div></div>
            <div class="flex justify-start items-center">{{ cond38 }}</div>
            <div class="flex justify-start items-center">{{ cond39 }}</div>
            <div class="flex justify-start items-center">{{ cond40 }}</div>
            <div class="flex justify-start items-center">{{ cond41 }}</div>
            <div class="flex justify-start items-center">{{ cond42 }}</div>
            <div class="flex justify-start items-center">{{ cond43 }}</div>
            <div class="flex justify-start items-center">{{ cond44 }}</div>
            <div class="flex justify-start items-center">{{ cond45 }}</div>
            <div class="flex justify-start items-center">{{ cond46 }}</div>
            <div class="flex justify-start items-center">{{ cond47 }}</div>
          </div>
        </div>
      </div>
      <div
        v-if="showCoupon"
        class="w-full h-6 bg-gray-400 flex justify-center items-center text-white">
        쿠폰 정보 등록
      </div>
      <div
        class="grid grid-rows-1 grid-cols-[2.5fr,5fr,2.5fr,5fr] h-[40vh]"
        v-if="showCoupon">
        <div
          class="w-full bg-gray-100 grid grid-rows-[1fr,1fr,1fr,1fr,6fr,6fr] border-l border-t border-black">
          <div class="border-b border-black flex justify-center items-center">
            쿠폰명
          </div>
          <div class="border-b border-black flex justify-center items-center">
            기간설정
          </div>
          <div class="border-b border-black flex justify-center items-center">
            영수증 중복사용
          </div>
          <div class="border-b border-black flex justify-center items-center">
            쿠폰유형
          </div>
          <div class="border-b border-black flex justify-center items-center">
            쿠폰 혜택매장
          </div>
          <div class="border-b border-black flex justify-center items-center">
            1+1 필수메뉴
          </div>
        </div>
        <div
          class="w-full grid grid-rows-[1fr,1fr,1fr,1fr,6fr,6fr] border-l border-t border-black">
          <div class="flex">
            <input type="text" class="border border-black" v-model="cond51" />
            <input
              type="text"
              class="border border-black"
              v-model="cond52"
              disabled />
          </div>
          <div class="flex">
            <div>발급후</div>
            <input
              type="text"
              class="border border-black disabled:bg-gray-200"
              v-model="cond53"
              :disabled="cond56 == 1" />
            <div>Day</div>
          </div>
          <div class="flex">
            <label for="cond54"
              ><input
                type="radio"
                v-model="cond54"
                value="N"
                id="cond54"
                name="cond54" />불가능</label
            >
            <label for="cond55"
              ><input
                type="radio"
                value="l"
                v-model="cond54"
                id="cond55"
                name="cond54" />가능</label
            >
          </div>
          <div class="flex">
            <select
              name=""
              id=""
              class="border border-black w-[40%]"
              v-model="cond55">
              <option :value="i.strDCode" v-for="i in optionList6">
                {{ i.strDName }}
              </option>
            </select>
          </div>

          <div class="flex">
            <Realgrid
              :progname="'CRM10_001INS_VUE'"
              :progid="3"
              class="w-[70%]"
              :rowStateeditable="false"
              :rowData="rowData4">
            </Realgrid>
            <div>
              <button class="button search" @click="openStore(2)">조회</button>
            </div>
          </div>

          <div class="flex">
            <Realgrid
              :progname="'CRM10_001INS_VUE'"
              :progid="2"
              class="w-[70%]"
              :rowStateeditable="false"
              :rowData="rowData5">
            </Realgrid>
            <div>
              <button
                class="button search"
                @click="openMenu(2)"
                :disabled="cond55 == 0">
                조회
              </button>
            </div>
          </div>
        </div>
        <div
          class="w-full bg-gray-100 grid grid-rows-[1fr,1fr,1fr,6fr,6fr] border-l border-t border-black">
          <div class="flex justify-center items-center border-b border-black">
            사용기간구분
          </div>
          <div class="flex justify-center items-center border-b border-black">
            유효기간
          </div>
          <div class="flex justify-center items-center border-b border-black">
            쿠폰분류
          </div>
          <div class="flex justify-center items-center border-b border-black">
            증정메뉴
          </div>
          <div class="flex justify-center items-center border-b border-black">
            1+1 증정메뉴
          </div>
        </div>
        <div
          class="grid grid-rows-[1fr,1fr,1fr,6fr,6fr] border-l border-t border-black">
          <div class="flex">
            <label for="cond56"
              ><input
                type="radio"
                v-model="cond56"
                value="1"
                name="cond56"
                id="cond56" />유효기간</label
            >
            <label for="cond57"
              ><input
                type="radio"
                v-model="cond56"
                name="cond56"
                value="2"
                id="cond57" />기간설정</label
            >
          </div>
          <div class="flex space-x-2">
            <input
              type="date"
              class="border border-black disabled:bg-gray-200"
              :disabled="cond56 == 2"
              v-model="cond57" />
            <div>~</div>
            <input
              type="date"
              class="border border-black disabled:bg-gray-200"
              :disabled="cond56 == 2"
              v-model="cond58" />
          </div>
          <div class="flex items-center">
            <select
              name=""
              id=""
              class="border border-black w-[40%]"
              v-model="cond59">
              <option value="0">선택</option>
              <option value="1">영수증 쿠폰</option>
            </select>
          </div>
          <div class="flex">
            <Realgrid
              :progname="'CRM10_001INS_VUE'"
              :progid="2"
              class="w-[70%]"
              :rowStateeditable="false"
              :rowData="rowData6">
            </Realgrid>
            <div>
              <button
                class="button search"
                @click="openMenu(3)"
                :disabled="cond55 == 1">
                조회
              </button>
            </div>
          </div>

          <div class="flex">
            <Realgrid
              :progname="'CRM10_001INS_VUE'"
              :progid="2"
              class="w-[70%]"
              :rowStateeditable="false"
              :rowData="rowData7">
            </Realgrid>
            <div>
              <button
                class="button search"
                @click="openMenu(4)"
                :disabled="cond55 == 0">
                조회
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showCoupon2"
        class="w-full h-6 bg-gray-400 flex justify-center items-center text-white">
        응모 / 쿠폰 번호 업로드
      </div>
      <div
        class="grid grid-rows-1 grid-cols-[1fr,1fr] h-[30vh]"
        v-if="showCoupon2">
        <div class="h-full">
          <Realgrid
            :progname="'CRM21_004INS_VUE'"
            :progid="4"
            :rowStateeditable="false"
            :rowData="rowData8"></Realgrid>
        </div>
        <div class="grid grid-rows-3 grid-cols-2 h-[50%]">
          <div
            class="bg-gray-100 text-base font-semibold flex justify-center items-center">
            자료업로드
          </div>
          <div class="flex justify-center items-center">
            <input
              type="text"
              class="border border-black h-[40%] w-[70%]"
              v-model="fileNm" /><input
              ref="inputFile"
              type="file"
              @change="handleFileChange"
              accept=".xls,.xlsx"
              hidden />
            <button @click="openFile" class="whitebutton">찾아보기</button>
          </div>
          <div
            class="bg-gray-100 text-base font-semibold flex justify-center items-center">
            시트 선택
          </div>
          <div class="flex justify-start pl-6 items-center">
            <select
              name=""
              id=""
              class="border border-black h-[40%] w-[70%]"
              @change="getExcelFiles">
              <option :value="i.lngCode" v-for="i in SheetList">
                {{ i.strName }}
              </option>
            </select>
          </div>

          <div class="col-span-2 flex justify-center items-center">
            <button class="whitebutton" @click="downloadFile">
              샘플 다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
    <br />
    <br />
    <br />

    <div
      v-if="openPopUp"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <!-- 팝업 컨텐츠 -->
      <div class="bg-white p-6 rounded-2xl shadow-lg w-[30vw] h-[30vh]">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold mb-4">매장 선택</h2>

          <div>
            <input
              type="text"
              class="w-full h-10 border border-black"
              @input="searchWord" />
          </div>
          <div class="flex space-x-3">
            <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded"
              @click="saveButton2">
              저장
            </button>
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded"
              @click="openPopUp = false">
              닫기
            </button>
          </div>
        </div>
        <div class="h-[80%] mt-3">
          <Realgrid
            :progname="'CRM10_001INS_VUE'"
            :progid="4"
            :rowData="srowData"
            :searchColId="'strName'"
            :searchWord3="searchword"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData2"
            :setStateBar="false"></Realgrid>
        </div>
      </div>
    </div>

    <div
      v-if="openPopUp2"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <!-- 팝업 컨텐츠 -->
      <div class="bg-white p-6 rounded-2xl shadow-lg w-[60vw] h-[70vh]">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold mb-4">메뉴 선택</h2>

          <div class="flex space-x-3">
            <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded"
              @click="saveButton3">
              저장
            </button>
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded"
              @click="openPopUp2 = false">
              닫기
            </button>
          </div>
        </div>
        <div class="flex flex-col space-y-3">
          <div class="flex space-x-5 items-center ml-3">
            <div class="text-base font-bold">대그룹</div>
            <select
              name=""
              id=""
              class="w-64 border border-black h-8"
              @change="setSubGroup"
              v-model="scond">
              <option value="-1">전체</option>
              <option :value="i.lngCode" v-for="i in optionList">
                {{ i.strName }}
              </option>
            </select>
          </div>
          <div class="flex space-x-5 items-center">
            <div class="text-base font-bold">서브그룹</div>
            <select
              name=""
              id=""
              class="w-64 border border-black h-8"
              @change="setMenu"
              v-model="scond2">
              <option value="-1">전체</option>
              <option :value="i.lngCode" v-for="i in filteredoptionList2">
                {{ i.strName }}
              </option>
            </select>
          </div>

          <div class="flex space-x-5 items-center ml-3">
            <div class="text-base font-bold">메뉴명</div>
            <input
              type="text"
              class="w-64 border border-black h-8"
              @input="setScond3"
              v-model="scond3" />
          </div>
        </div>
        <div class="h-full mt-2">
          <div class="flex h-[75%] space-x-3">
            <Realgrid
              :progname="'CRM10_001INS_VUE'"
              :progid="5"
              :rowData="srowData2"
              :searchColId="'strName'"
              :searchWord3="scond3"
              :searchColId3="['lngMajor', 'lngSubGroup']"
              :searchValue="searchValue"
              :rowStateeditable="false"
              :checkRenderEditable="true"
              :checkRowAuto="false"
              :checkRowAuto2="true"
              :checkRowAuto2Col="'checkbox'"
              @updatedRowData="updatedRowData3"
              :setStateBar="false"></Realgrid>

            <div class="flex space-y-5 flex-col justify-center items-center">
              <button class="whitebutton" @click="sendRight">=></button>
              <button class="whitebutton" @click="sendLeft"><=</button>
            </div>

            <Realgrid
              :progname="'CRM10_001INS_VUE'"
              :progid="5"
              :rowData="srowData3"
              :searchColId="'strName'"
              :searchWord3="searchword"
              :rowStateeditable="false"
              :checkRenderEditable="true"
              :checkRowAuto="false"
              :checkRowAuto2="true"
              :checkRowAuto2Col="'checkbox'"
              @updatedRowData="updatedRowData4"
              :setStateBar="false"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="openPopUp3"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <!-- 팝업 컨텐츠 -->
    <div class="bg-white p-6 rounded-2xl shadow-lg w-[60vw] h-[70vh]">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold mb-4">메뉴 선택</h2>

        <div class="flex space-x-3">
          <!-- <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="searchButton2">
            조회
          </button> -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="saveButton4">
            저장
          </button>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded"
            @click="openPopUp3 = false">
            닫기
          </button>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">대그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setSubGroup"
            v-model="scond">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in optionList">
              {{ i.strName }}
            </option>
          </select>
        </div>
        <div class="flex space-x-5 items-center">
          <div class="text-base font-bold">서브그룹</div>
          <select
            name=""
            id=""
            class="w-64 border border-black h-8"
            @change="setMenu"
            v-model="scond2">
            <option value="-1">전체</option>
            <option :value="i.lngCode" v-for="i in filteredoptionList2">
              {{ i.strName }}
            </option>
          </select>
        </div>

        <div class="flex space-x-5 items-center ml-3">
          <div class="text-base font-bold">메뉴명</div>
          <input
            type="text"
            class="w-64 border border-black h-8"
            @input="setScond3"
            v-model="scond3" />
        </div>
      </div>
      <div class="h-full mt-2">
        <div class="flex h-[75%] space-x-3">
          <Realgrid
            :progname="'CRM10_001INS_VUE'"
            :progid="5"
            :rowData="srowData2"
            :searchColId="'strName'"
            :searchWord3="scond3"
            :searchColId3="['lngMajor', 'lngSubGroup']"
            :searchValue="searchValue"
            :rowStateeditable="false"
            :checkRenderEditable="true"
            :checkRowAuto="false"
            :checkRowAuto2="true"
            :checkRowAuto2Col="'checkbox'"
            @updatedRowData="updatedRowData5"
            :setStateBar="false"></Realgrid>

          <div class="flex space-y-5 flex-col justify-center items-center">
            <button class="whitebutton" @click="sendRight2">=></button>
            <button class="whitebutton" @click="sendLeft2"><=</button>
          </div>

          <div class="flex flex-col h-[115%] w-[107%] -mt-20 space-y-5">
            <div
              class="grid grid-rows-2 grid-cols-[1fr,3fr] border border-black">
              <div
                class="bg-gray-100 flex justify-center items-center border-r border-b border-black">
                본사유형
              </div>
              <div class="flex space-x-3 items-center border-b border-black">
                <label for="scond4"
                  ><input
                    type="radio"
                    value="0"
                    v-model="scond4"
                    name="scond4"
                    id="scond4" />금액</label
                >
                <label for="scond5"
                  ><input
                    type="radio"
                    value="1"
                    v-model="scond4"
                    name="scond4"
                    id="scond5" />비율</label
                >
              </div>
              <div
                class="bg-gray-100 flex justify-center items-center border-r border-black">
                본사분담금
              </div>
              <div>
                <input
                  type="text"
                  name="scond5"
                  class="border border-black"
                  @input="onlyNumber"
                  v-model="scond5" />
                <button class="whitebutton" @click="setHeadShare">
                  일괄적용
                </button>
              </div>
            </div>

            <Realgrid
              :progname="'CRM21_004INS_VUE'"
              :progid="2"
              :rowData="srowData4"
              :searchColId="'strName'"
              :changeValue2="changeValue2"
              :changeColid="'lngHeadShare'"
              :changeRow="changeRow"
              :changeNow="changeNow"
              :editableColId="'lngHeadShare'"
              :inputOnlyNumberColumn="'lngHeadShare'"
              :searchWord3="searchword"
              :rowStateeditable="false"
              :checkRenderEditable="true"
              :checkRowAuto="false"
              :checkRowAuto2="true"
              :checkRowAuto2Col="'checkbox'"
              @updatedRowData="updatedRowData6"
              :setStateBar="false"></Realgrid>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 그리드 영역 -->
</template>

<script setup>
import { getCommonList } from "@/api/common";
import { getMenuGroupList } from "@/api/master";
import {
  getCouponList,
  getCrmMenuList,
  getOperateStoreList,
  getReceiptEventDetail,
  getReceiptEventList2,
  saveReceiptEvent,
} from "@/api/micrm";
/**
 *  매출 일자 세팅 컴포넌트
 *  */

/**
 *  페이지명 자동 입력 컴포넌트
 *  */

import PageName from "@/components/pageName.vue";
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
import { read, utils } from "xlsx-js-style";
/**
 *  경고창 호출 라이브러리
 *  */

/*
 * 공통 표준  Function
 */

import { nextTick, onMounted, ref, watch } from "vue";
/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */

import { useStore } from "vuex";
/**
 * 	화면 Load시 실행 스크립트
 */

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  const res = await getMenuGroupList(store.state.userData.lngStoreGroup, 0, 1);

  console.log(res);
  optionList.value = res.data.List;
  optionList2.value = res.data.List2;

  const res2 = await getCouponList(store.state.userData.lngStoreGroup);

  optionList3.value = res2.data.List;

  const today = new Date();
  cond3.value = formatLocalDate(today);
  cond4.value = formatLocalDate(today);

  const res3 = await getCommonList(138);

  optionList4.value = res3.data.List;

  const res4 = await getCommonList(141);

  optionList5.value = res4.data.List;

  const res5 = await getCommonList(220);

  optionList6.value = res5.data.List;

  cond55.value = optionList6.value[0].strDCode;
});

const optionList = ref([]);
const optionList2 = ref([]);
const optionList3 = ref([]);
const optionList4 = ref([]);
const optionList5 = ref([]);
const optionList6 = ref([]);
const filteredoptionList2 = ref([]);
const reload = ref(false);
const rowData = ref([]);
const afterSearch = ref(false);

const rowData2 = ref([]);
const rowData3 = ref([]);
const rowData4 = ref([]);
const rowData5 = ref([]);
const rowData6 = ref([]);
const rowData7 = ref([]);
const rowData8 = ref([]);

const store = useStore();
const cond = ref("");
const cond2 = ref("");
const cond3 = ref("");
const cond4 = ref("");
const cond5 = ref("true");
const cond6 = ref("1");
const cond7 = ref("");
const cond8 = ref("");
const cond9 = ref("");
const cond10 = ref("");
const cond11 = ref("1");
const cond12 = ref("0");
const cond13 = ref("");
const cond14 = ref("");
const cond15 = ref("");
const cond16 = ref("");
const cond17 = ref("");
const cond18 = ref("");
const cond19 = ref("");
const cond20 = ref("00:00");
const cond21 = ref("00:00");
const cond22 = ref(false);
const cond23 = ref("");
const cond24 = ref("");
const cond25 = ref("1");
const cond26 = ref("1");
const cond27 = ref("0");
const cond28 = ref("");
const cond29 = ref("");
const cond30 = ref("");
const cond31 = ref("");
const cond32 = ref("");
const cond33 = ref("");
const cond34 = ref("");
const cond35 = ref("");
const cond36 = ref("");
const cond37 = ref("");
const cond38 = ref("");
const cond39 = ref("");
const cond40 = ref("");
const cond41 = ref("");
const cond42 = ref("");
const cond43 = ref("");
const cond44 = ref("");
const cond45 = ref("");
const cond46 = ref("");
const cond47 = ref("");
const cond48 = ref("");
const cond49 = ref("");
const cond50 = ref("");
const cond51 = ref("");
const cond52 = ref("");
const cond53 = ref("0");
const cond54 = ref("");
const cond55 = ref("");
const cond56 = ref("1");
const cond57 = ref("");
const cond58 = ref("");
const cond59 = ref("0");
const cond111 = ref("");
const cond171 = ref("");
const datepicker = ref(null);
const closePopUp = ref(false);

const changeCond = (e) => {
  cond.value = !cond.value;
};
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

/**
 *  조회 함수
 */
const hideColumnsId = ref([]);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();

    const res = await getReceiptEventList2(store.state.userData.lngStoreGroup);

    rowData.value = res.data.List;

    console.log(cond6.value);
    ////console.log(res);
    afterSearch.value = true;
    afterClick.value = false;
  } catch (error) {
    afterSearch.value = false;
    afterClick.value = false;
    //comsole.log(error);
  } finally {
    afterClick.value = false;
    store.state.loading = false;
  }
};

/**
 * 페이지 매장 코드 세팅
 */

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
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length > 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length > 0) {
    rowData7.value = [];
  }
  if (rowData8.value.length > 0) {
    rowData8.value = [];
  }

  cond.value = "";
  cond2.value = "";
  cond3.value = formatLocalDate(new Date());
  cond4.value = formatLocalDate(new Date());
  cond5.value = "true";
  cond6.value = "1";
  cond7.value = "";
  cond8.value = "";
  cond9.value = "";
  cond10.value = "";
  cond11.value = "1";
  cond12.value = "0";
  cond13.value = "";
  cond14.value = "";
  cond15.value = "";
  cond16.value = "";
  cond17.value = "";
  cond18.value = "";
  cond19.value = "";
  cond20.value = "00:00";
  cond21.value = "00:00";
  cond22.value = false;
  cond23.value = "";
  cond24.value = "";
  cond25.value = "1";
  cond26.value = "1";
  cond27.value = "0";
  cond28.value = "";
  cond29.value = "";
  cond30.value = "";
  cond31.value = "";
  cond32.value = "";
  cond33.value = "";
  cond34.value = "";
  cond35.value = "";
  cond36.value = "";
  cond37.value = "";
  cond38.value = "";
  cond39.value = "";
  cond40.value = "";
  cond41.value = "";
  cond42.value = "";
  cond43.value = "";
  cond44.value = "";
  cond45.value = "";
  cond46.value = "";
  cond47.value = "";
  cond48.value = "";
  cond49.value = "";
  cond50.value = "";
  cond51.value = "";
  cond52.value = "";
  cond53.value = "0";
  cond54.value = "N";
  cond55.value = "1";
  cond56.value = "1";
  cond57.value = formatLocalDate(new Date());
  cond58.value = formatLocalDate(new Date());
  cond59.value = "0";
  cond111.value = "";
  cond171.value = "";
  fileNm.value = "";
  SheetList.value = [];
};

const initGrid2 = () => {
  if (rowData2.value.length > 0) {
    rowData2.value = [];
  }
  if (rowData3.value.length > 0) {
    rowData3.value = [];
  }
  if (rowData4.value.length > 0) {
    rowData4.value = [];
  }
  if (rowData5.value.length > 0) {
    rowData5.value = [];
  }
  if (rowData6.value.length > 0) {
    rowData6.value = [];
  }
  if (rowData7.value.length > 0) {
    rowData7.value = [];
  }
  if (rowData8.value.length > 0) {
    rowData8.value = [];
  }

  cond.value = "";
  cond2.value = "";
  cond3.value = formatLocalDate(new Date());
  cond4.value = formatLocalDate(new Date());
  cond5.value = "true";
  cond6.value = "1";
  cond7.value = "";
  cond8.value = "";
  cond9.value = "";
  cond10.value = "";
  cond11.value = "1";
  cond12.value = "0";
  cond13.value = "";
  cond14.value = "";
  cond15.value = "";
  cond16.value = "";
  cond17.value = "";
  cond18.value = "";
  cond19.value = "";
  cond20.value = "00:00";
  cond21.value = "00:00";
  cond22.value = false;
  cond23.value = "";
  cond24.value = "";
  cond25.value = "1";
  cond26.value = "1";
  cond27.value = "0";
  cond28.value = "";
  cond29.value = "";
  cond30.value = "";
  cond31.value = "";
  cond32.value = "";
  cond33.value = "";
  cond34.value = "";
  cond35.value = "";
  cond36.value = "";
  cond37.value = "";
  cond38.value = "";
  cond39.value = "";
  cond40.value = "";
  cond41.value = "";
  cond42.value = "";
  cond43.value = "";
  cond44.value = "";
  cond45.value = "";
  cond46.value = "";
  cond47.value = "";
  cond48.value = "";
  cond49.value = "";
  cond50.value = "";
  cond51.value = "";
  cond52.value = "";
  cond53.value = "0";
  cond54.value = "N";
  cond55.value = "1";
  cond56.value = "1";
  cond57.value = formatLocalDate(new Date());
  cond58.value = formatLocalDate(new Date());
  cond59.value = "0";
  cond111.value = "";
  cond171.value = "";
  fileNm.value = "";
  SheetList.value = [];
};

//엑셀 버튼 처리 함수
const exportExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  documentSubTitle.value = selectedDate.value + "\n" + selectedExcelStore.value;

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
const disabled = ref(true);
const disabled2 = ref(false);

const tempPromoCode = ref("");
const afterClick = ref(false);
const buttonClicked = async (e) => {
  console.log(e);
  afterClick.value = true;
  //   tempPromoCode.value = e[0];
  currentNew.value = false;
  try {
    const res = await getReceiptEventDetail(
      store.state.userData.lngStoreGroup,
      e[0]
    );

    console.log(res);
    cond.value = res.data.List[0].lngEventCode;
    cond2.value = res.data.List[0].strEventName;
    cond3.value = res.data.List[0].dtmEventStart.split(" ")[0];
    cond4.value = res.data.List[0].dtmEventEnd.split(" ")[0];
    rowData2.value = res.data.List2;

    rowData3.value = res.data.List3;

    if (rowData3.value.length > 0) {
      cond5.value = "false";
    } else {
      cond5.value = "true";
    }
    cond6.value = res.data.List[0].lngIssueOpt;
    cond7.value = res.data.List[0].lngEventAmt;
    cond9.value = res.data.List[0].lngEventCust;
    cond10.value = res.data.List[0].lngEventCount;

    cond8.value = res.data.List[0].lngEventAmtOpt;

    let week = res.data.List[0].strEventWeekDay;

    cond13.value = week.charAt(0) == "1" ? true : false;
    cond14.value = week.charAt(1) == "1" ? true : false;
    cond15.value = week.charAt(2) == "1" ? true : false;
    cond16.value = week.charAt(3) == "1" ? true : false;
    cond17.value = week.charAt(4) == "1" ? true : false;
    cond18.value = week.charAt(5) == "1" ? true : false;
    cond19.value = week.charAt(6) == "1" ? true : false;

    cond20.value =
      res.data.List[0].strStartTime.slice(0, 2) +
      ":" +
      res.data.List[0].strStartTime.slice(2, 4);
    cond21.value =
      res.data.List[0].strEndTime.slice(0, 2) +
      ":" +
      res.data.List[0].strEndTime.slice(2, 4);

    cond22.value = res.data.List[0].blnReissue == "True" ? true : false;
    cond23.value = res.data.List[0].strHeader.split("<BR>")[0];
    cond24.value = res.data.List[0].strHeader.split("<BR>")[1];

    cond27.value = res.data.List[0].blnBarcodeYN;
    cond26.value = res.data.List[0].lngNumberType;
    if (cond26.value == "3") {
      showCoupon2.value = true;
      showCoupon.value = false;
    } else if (cond26.value == "5") {
      showCoupon2.value = false;
      showCoupon.value = true;
    } else if (cond26.value == "6") {
      showCoupon2.value = true;
      showCoupon.value = true;
    } else {
      showCoupon2.value = false;
      showCoupon.value = false;
    }
    cond25.value = res.data.List[0].lngLottoType;

    cond28.value = res.data.List[0].strBody.split("<BR>")[0];
    cond29.value = res.data.List[0].strBody.split("<BR>")[1];
    cond30.value = res.data.List[0].strBody.split("<BR>")[2];
    cond31.value = res.data.List[0].strBody.split("<BR>")[3];
    cond32.value = res.data.List[0].strBody.split("<BR>")[4];
    cond33.value = res.data.List[0].strBody.split("<BR>")[5];
    cond34.value = res.data.List[0].strBody.split("<BR>")[6];
    cond35.value = res.data.List[0].strBody.split("<BR>")[7];
    cond36.value = res.data.List[0].strBody.split("<BR>")[8];
    cond37.value = res.data.List[0].strBody.split("<BR>")[9];

    cond38.value = res.data.List[0].strFooter.split("<BR>")[0];
    cond39.value = res.data.List[0].strFooter.split("<BR>")[1];
    cond40.value = res.data.List[0].strFooter.split("<BR>")[2];
    cond41.value = res.data.List[0].strFooter.split("<BR>")[3];
    cond42.value = res.data.List[0].strFooter.split("<BR>")[4];
    cond43.value = res.data.List[0].strFooter.split("<BR>")[5];
    cond44.value = res.data.List[0].strFooter.split("<BR>")[6];
    cond45.value = res.data.List[0].strFooter.split("<BR>")[7];
    cond46.value = res.data.List[0].strFooter.split("<BR>")[8];
    cond47.value = res.data.List[0].strFooter.split("<BR>")[9];

    cond48.value = res.data.List[0].blnCutting == "True" ? true : false;
    cond49.value = res.data.List[0].lngPrintOpt == "1" ? true : false;
    cond50.value = res.data.List[0].blnLogo == "True" ? true : false;

    cond51.value = res.data.List4[0].strCouponName;
    cond52.value = res.data.List4[0].lngCouponType;
    cond53.value = res.data.List4[0].lngTerm;
    cond54.value = res.data.List4[0].strDuplicateYN;
    cond55.value = res.data.List4[0].lngServType;

    cond56.value = res.data.List4[0].lngApplyType;
    cond57.value = res.data.List4[0].dtmSDate.split(" ")[0];
    cond58.value = res.data.List4[0].dtmEdate.split(" ")[0];
    cond59.value = res.data.List4[0].lngCouponKind;

    rowData4.value = res.data.List5;
    console.log(cond54.value);
  } catch (error) {}

  //     console.log(res);

  //     if (res.data.List.length > 0) {
  //       cond.value = res.data.List[0].lngPromoCode;
  //       cond2.value = res.data.List[0].strPromoName;
  //       cond3.value = res.data.List[0].dtmStart.split(" ")[0];
  //       cond4.value = res.data.List[0].dtmEnd.split(" ")[0];
  //       cond5.value = res.data.List[0].intMembershipDiv;
  //       cond20.value = res.data.List[0].lngAppDown == "1" ? true : false;

  //       const encoder = new TextEncoder();
  //       const decoder = new TextDecoder();

  //       const byte = encoder.encode(res.data.List[0].strCampaign);

  //       const slice = byte.slice(0, 42);
  //       const slice2 = byte.slice(42, 84);
  //       const slice3 = byte.slice(84, 126);
  //       const slice4 = byte.slice(126, 168);
  //       const slice5 = byte.slice(168, 210);
  //       const slice6 = byte.slice(210, 252);
  //       const slice7 = byte.slice(252, 294);

  //       cond6.value = decoder.decode(slice);
  //       cond7.value = decoder.decode(slice2);
  //       cond8.value = decoder.decode(slice3);
  //       cond9.value = decoder.decode(slice4);
  //       cond10.value = decoder.decode(slice5);
  //       cond11.value = decoder.decode(slice6);
  //       cond111.value = decoder.decode(slice7);

  //       const byte2 = encoder.encode(res.data.List[0].strRemark);

  //       const slice21 = byte2.slice(0, 42);
  //       const slice22 = byte2.slice(42, 84);
  //       const slice32 = byte2.slice(84, 126);
  //       const slice42 = byte2.slice(126, 168);
  //       const slice52 = byte2.slice(168, 210);
  //       const slice62 = byte2.slice(210, 252);
  //       const slice72 = byte2.slice(252, 294);

  //       cond12.value = decoder.decode(slice21);
  //       cond13.value = decoder.decode(slice22);
  //       cond14.value = decoder.decode(slice32);
  //       cond15.value = decoder.decode(slice42);
  //       cond16.value = decoder.decode(slice52);
  //       cond17.value = decoder.decode(slice62);
  //       cond171.value = decoder.decode(slice72);
  //     }

  //     if (res.data.List4.length > 0) {
  //       cond18.value = res.data.List4[0].strParam1;
  //       cond19.value = res.data.List4[0].strParam2;
  //     }

  //     if (res.data.List8.length > 0) {
  //       cond22.value = res.data.List8[0].strParam1;
  //       cond23.value = res.data.List8[0].strCouponName;
  //     }

  //     if (res.data.List13.length > 0) {
  //       cond24.value = res.data.List13[0].strParam1;
  //       cond25.value = res.data.List13[0].strCouponName;
  //     }

  //     if (res.data.List7.length > 0) {
  //       cond28.value = res.data.List7[0].strParam1;
  //     }

  //     rowData2.value = res.data.List3;
  //     rowData3.value = res.data.List5;
  //     rowData4.value = res.data.List6;
  //     rowData5.value = res.data.List2;
  //     rowData6.value = res.data.List9;
  //     rowData7.value = res.data.List10;

  //     cond26.value = res.data.List11[0].strParam1;
  //     cond27.value = res.data.List11[0].strParam2;
  //   } catch (error) {
  //     console.log(error);
  //   }
};

watch(cond21, () => {
  if (cond21.value == "0") {
    disabled.value = true;
    disabled2.value = false;
  } else if (cond21.value == "1") {
    disabled.value = true;
    disabled2.value = true;
  } else {
    disabled.value = false;
    disabled2.value = true;
  }
});

const openPopUp = ref(false);
const openPopUp2 = ref(false);
const openStore = (e) => {
  openPopUp.value = true;
  searchButton2(e);
};
const tempDisableBonsa = ref(false);
const openMenu = (e) => {
  srowData3.value = [];
  tempCheckedList2.value = [];
  tempCheckedList.value = [];
  if (e == "1" || e == "2") {
    openPopUp2.value = true;
  } else {
    openPopUp3.value = true;
  }
  searchButton3(e);
};

const srowData = ref([]);
const selectedStore = ref(false);
const selectedMenu = ref(1);
const searchButton2 = async (e) => {
  if (e == "1") {
    selectedStore.value = false;
  } else {
    selectedStore.value = true;
  }
  try {
    updatedrowdata.value = [];
    const res = await getOperateStoreList(
      store.state.userData.lngStoreGroup,
      0,
      0
    );

    console.log(res);
    srowData.value = res.data.List;
  } catch (error) {}
};

const srowData2 = ref([]);
const srowData3 = ref([]);
const srowData4 = ref([]);
const searchButton3 = async (e) => {
  selectedMenu.value = e;
  try {
    updatedrowdata2.value = [];
    const res = await getCrmMenuList(store.state.userData.lngStoreGroup, 0);

    console.log(res);
    srowData2.value = res.data.List;
  } catch (error) {}
};

const searchword = ref("");
const searchWord = (e) => {
  searchword.value = e.target.value;
};

const saveButton2 = () => {
  console.log(updatedrowdata.value);
  if (selectedStore.value == false) {
    rowData2.value = updatedrowdata.value;
  } else {
    rowData4.value = updatedrowdata.value;
  }

  updatedrowdata.value = [];
  openPopUp.value = false;
};

const updatedrowdata = ref([]);
const updatedrowdata2 = ref([]);
const updatedRowData2 = (e) => {
  console.log(e);
  updatedrowdata.value = e;
};

const scond = ref("-1");
const scond2 = ref("-1");
const scond3 = ref("");
const setSubGroup = (e) => {
  const value = e.target.value;
  filteredoptionList2.value = optionList2.value.filter(
    (item) => item.lngMajor == value
  );
  scond2.value = "-1";

  scond.value = value;
  searchValue.value = [value, scond2.value];

  //console.log(searchValue.value);
};

const setMenu = (e) => {
  searchValue.value = [scond.value, e.target.value];

  //console.log(searchValue.value);
};

const searchValue = ref(["-1", "-1"]);

const setScond3 = (e) => {
  scond3.value = e.target.value;
};

const tempCheckedList = ref([]);
const tempCheckedList2 = ref([]);
const tempCheckedList3 = ref([]);
const tempCheckedList4 = ref([]);
const updatedRowData3 = (e) => {
  tempCheckedList.value = e.filter((item) => item.checkbox == true);
};

const updatedRowData4 = (e) => {
  console.log(e);
  tempCheckedList2.value = e;
};

const updatedRowData5 = (e) => {
  tempCheckedList3.value = e.filter((item) => item.checkbox == true);
};

const updatedRowData6 = (e) => {
  console.log(e);
  tempCheckedList4.value = e;
};

const sendLeft = () => {
  // srowData3.value = srowData3.value.filter(item => item.checkbox)

  srowData3.value = tempCheckedList2.value.filter(
    (item) => item.checkbox == false
  );
};

const sendLeft2 = () => {
  // srowData3.value = srowData3.value.filter(item => item.checkbox)

  srowData4.value = tempCheckedList4.value.filter(
    (item) => item.checkbox == false
  );

  tempCheckedList4.value = srowData4.value;
};
const sendRight = () => {
  console.log(tempCheckedList.value);
  srowData3.value = tempCheckedList.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
  tempCheckedList2.value = tempCheckedList.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
};
const sendRight2 = () => {
  console.log(tempCheckedList3.value);
  srowData4.value = tempCheckedList3.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
  tempCheckedList4.value = tempCheckedList3.value.map((item) => ({
    ...item,
    checkbox: false,
  }));
};

const saveButton3 = () => {
  console.log(tempCheckedList2.value);
  if (selectedMenu.value == "1") {
    rowData3.value = tempCheckedList2.value;
  } else if (selectedMenu.value == "2") {
    rowData5.value = tempCheckedList2.value;
  } else if (selectedMenu.value == "3") {
    rowData5.value = tempCheckedList2.value;
  } else if (selectedMenu.value == "4") {
    rowData7.value = tempCheckedList2.value;
  }

  openPopUp2.value = false;
};

const setCouponMain = ref(1);

const openPopUp3 = ref(false);
const searchButton4 = (e) => {
  setCouponMain.value = e;

  openPopUp3.value = true;
};

const dblclickedRowData = (e) => {
  // console.log(e);
  if (setCouponMain.value == "1") {
    cond22.value = e[0];
    cond23.value = e[1];
  } else {
    cond24.value = e[0];
    cond25.value = e[1];
  }
  openPopUp3.value = false;
};

const currentNew = ref(false);
const addButton = () => {
  currentNew.value = true;
  afterClick.value = true;
  initGrid2();
};

const saveButton = async () => {
  if (
    currentNew.value == true &&
    (cond2.value == "" || cond2.value == undefined)
  ) {
    Swal.fire({
      title: "경고",
      text: `이벤트명을 입력해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (
    cond55.value == "1" &&
    rowData5.value.length == 0 &&
    currentNew.value == false
  ) {
    Swal.fire({
      title: "경고",
      text: `1+1 필수메뉴를 등록해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (
    cond55.value == "1" &&
    rowData7.value.length == 0 &&
    currentNew.value == false
  ) {
    Swal.fire({
      title: "경고",
      text: `1+1 증정메뉴를 등록해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (
    cond55.value == "0" &&
    rowData6.value.length == 0 &&
    currentNew.value == false
  ) {
    Swal.fire({
      title: "경고",
      text: `증정메뉴를 등록해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  if (cond59.value == 0 && currentNew.value == false) {
    Swal.fire({
      title: "경고",
      text: `쿠폰 분류를 선택해주세요.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    let ccond23 = "";
    if (cond24.value == "" || cond24.value == undefined) {
      ccond23 = cond23.value;
    } else {
      ccond23 = cond23.value + "<BR>" + cond24.value;
    }

    let strbody = cond28.value;

    if (cond29.value == "" || cond29.value == undefined) {
    } else {
      strbody += "<BR>" + cond29.value;
    }
    if (cond30.value == "" || cond30.value == undefined) {
    } else {
      strbody += "<BR>" + cond30.value;
    }
    if (cond31.value == "" || cond31.value == undefined) {
    } else {
      strbody += "<BR>" + cond31.value;
    }
    if (cond32.value == "" || cond32.value == undefined) {
    } else {
      strbody += "<BR>" + cond32.value;
    }
    if (cond33.value == "" || cond33.value == undefined) {
    } else {
      strbody += "<BR>" + cond33.value;
    }
    if (cond34.value == "" || cond34.value == undefined) {
    } else {
      strbody += "<BR>" + cond34.value;
    }
    if (cond35.value == "" || cond35.value == undefined) {
    } else {
      strbody += "<BR>" + cond35.value;
    }
    if (cond36.value == "" || cond36.value == undefined) {
    } else {
      strbody += "<BR>" + cond36.value;
    }
    if (cond37.value == "" || cond37.value == undefined) {
    } else {
      strbody += "<BR>" + cond37.value;
    }

    let strfooter = cond38.value;

    if (cond39.value == "" || cond39.value == undefined) {
    } else {
      strfooter += "<BR>" + cond39.value;
    }
    if (cond40.value == "" || cond40.value == undefined) {
    } else {
      strfooter += "<BR>" + cond40.value;
    }
    if (cond41.value == "" || cond41.value == undefined) {
    } else {
      strfooter += "<BR>" + cond41.value;
    }
    if (cond42.value == "" || cond42.value == undefined) {
    } else {
      strfooter += "<BR>" + cond42.value;
    }
    if (cond43.value == "" || cond43.value == undefined) {
    } else {
      strfooter += "<BR>" + cond43.value;
    }
    if (cond44.value == "" || cond44.value == undefined) {
    } else {
      strfooter += "<BR>" + cond44.value;
    }
    if (cond45.value == "" || cond45.value == undefined) {
    } else {
      strfooter += "<BR>" + cond45.value;
    }
    if (cond46.value == "" || cond46.value == undefined) {
    } else {
      strfooter += "<BR>" + cond46.value;
    }
    if (cond47.value == "" || cond47.value == undefined) {
    } else {
      strfooter += "<BR>" + cond47.value;
    }

    let weekday = "";
    if (cond13.value == true) {
      weekday += "1";
    } else {
      weekday += "0";
    }
    if (cond14.value == true) {
      weekday += "1";
    } else {
      weekday += "0";
    }
    if (cond15.value == true) {
      weekday += "1";
    } else {
      weekday += "0";
    }
    if (cond16.value == true) {
      weekday += "1";
    } else {
      weekday += "0";
    }
    if (cond17.value == true) {
      weekday += "1";
    } else {
      weekday += "0";
    }
    if (cond18.value == true) {
      weekday += "1";
    } else {
      weekday += "0";
    }
    if (cond19.value == true) {
      weekday += "1";
    } else {
      weekday += "0";
    }
    const res = await saveReceiptEvent(
      store.state.userData.lngStoreGroup,
      currentNew.value == false ? cond.value : 0,
      cond2.value,
      cond3.value,
      cond4.value,
      cond7.value == "" ? 0 : cond7.value,
      cond9.value == "" ? 0 : cond9.value,
      cond10.value == "" ? 0 : cond10.value,
      cond48.value == true ? 1 : 0,
      cond50.value == true ? 1 : 0,
      cond22.value == true ? 1 : 0,
      ccond23,
      strbody,
      strfooter,
      cond26.value,
      store.state.userData.lngSequence,
      rowData3.value.length > 0
        ? rowData3.value.map((item) => item.lngCode).join(";")
        : "",
      rowData2.value.length > 0
        ? rowData2.value
            .map((item) => item.lngStoreGroup + "+" + item.lngStoreCode)
            .join("|")
        : "",
      cond5.value == true ? 0 : 1,
      cond6.value,
      cond8.value == "" ? 0 : cond8.value,
      cond11.value,
      cond12.value,
      weekday,
      cond20.value,
      cond21.value,
      cond27.value,
      cond49.value == true ? 1 : 0,
      cond25.value,
      currentNew.value == false ? cond52.value : 0,
      cond51.value,
      cond56.value,
      cond53.value,
      cond57.value,
      cond58.value,
      0,
      rowData6.value.map((item) => item.lngCode).join(";"),
      cond26.value == "5" || cond26.value == "6"
        ? rowData4.value
            .map((item) => item.lngStoreGroup + "+" + item.lngStoreCode)
            .join("|")
        : "",
      cond26.value == "3" || cond26.value == "6"
        ? rowData8.value.map((item) => item.strCode).join(";")
        : "",
      cond54.value == "N" ? "N" : "Y",
      cond59.value,
      1,
      100,
      cond55.value,
      cond26.value == "5" || cond26.value == "6"
        ? rowData5.value.map((item) => item.lngCode).join(";")
        : "",
      cond26.value == "5" || cond26.value == "6"
        ? rowData7.value.map((item) => item.lngCode).join(";")
        : ""
    );

    if (res.data.RESULT_CD == "00") {
      await Swal.fire({
        title: "성공",
        text: `저장에 성공하였습니다.`,
        icon: "success",
        confirmButtonText: "확인",
      });
    } else {
      await Swal.fire({
        title: "실패",
        text: `저장에 실패하였습니다.`,
        icon: "error",
        confirmButtonText: "확인",
      });
    }

    console.log(res);
  } catch (error) {
  } finally {
    searchButton();
  }
};

const currentbyteleng = ref("0");
const currentbyteleng2 = ref("0");
const set42byte = (e) => {
  let value = e.target.value;
  let bytelen = getByteLength(value);

  while (bytelen > 42) {
    value = value.slice(0, -1);
    bytelen = getByteLength(value);
  }
  currentbyteleng.value = bytelen;
  if (e.target.name == "cond6") {
    cond6.value = value;
  } else if (e.target.name == "cond7") {
    cond7.value = value;
  } else if (e.target.name == "cond8") {
    cond8.value = value;
  } else if (e.target.name == "cond9") {
    cond9.value = value;
  } else if (e.target.name == "cond10") {
    cond10.value = value;
  } else if (e.target.name == "cond11") {
    cond11.value = value;
  } else if (e.target.name == "cond111") {
    cond111.value = value;
  }
  // e.target.value = value;
};

const set42byte2 = (e) => {
  let value = e.target.value;
  let bytelen = getByteLength(value);

  while (bytelen > 42) {
    value = value.slice(0, -1);
    bytelen = getByteLength(value);
  }
  currentbyteleng2.value = bytelen;
  if (e.target.name == "cond12") {
    cond12.value = value;
  } else if (e.target.name == "cond13") {
    cond13.value = value;
  } else if (e.target.name == "cond14") {
    cond14.value = value;
  } else if (e.target.name == "cond15") {
    cond15.value = value;
  } else if (e.target.name == "cond16") {
    cond16.value = value;
  } else if (e.target.name == "cond17") {
    cond17.value = value;
  } else if (e.target.name == "cond171") {
    cond171.value = value;
  }
  // e.target.value = value;
};
function getByteLength(str) {
  let byte = 0;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code <= 0x007f) byte += 1; // 영문, 숫자, 특수문자
    else if (code <= 0x07ff) byte += 2; // 일부 확장
    else byte += 3; // 한글, 한자 등
  }
  return byte;
}

const onlyNumber = (e) => {
  const value = e.target.value.replace(/[^0-9]/g, "");

  if (e.target.name == "scond5") {
    scond5.value = value;
  }
};

const scond4 = ref("0");
const scond5 = ref("0");

const changeValue2 = ref("");
const changeRow = ref("0");
const changeNow = ref(false);
const setHeadShare = async () => {
  if (scond4.value == "0") {
    changeValue2.value = scond5.value;
    for (let i = 0; i < srowData4.value.length; i++) {
      console.log(i);
      changeRow.value = i;
      changeNow.value = !changeNow.value;

      await nextTick();
    }
  } else {
    // for (let i = 0; i <script  i++) {
    //   //console.log(i);
    //   changeValue2.value = (scond5.value / 100) * srowData4.value[i].lngPrice;
    //   changeRow.value = i;
    //   changeNow.value = !changeNow.value;
    //   await nextTick();
    // }

    for (let i = 0; i < srowData4.value.length; i++) {
      changeValue2.value = (scond5.value / 100) * srowData4.value[i].lngPrice;
      changeRow.value = i;
      changeNow.value = !changeNow.value;

      await nextTick();
    }
  }
};

const saveButton4 = () => {
  console.log(tempCheckedList4.value);

  const filtered = tempCheckedList4.value.filter(
    (item) => item.lngHeadShare == "" || item.lngHeadShare == undefined
  );

  if (filtered.length > 0) {
    Swal.fire({
      title: "경고",
      text: `본사 분담금을 입력해주세요`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    return;
  }
  if (selectedMenu.value == "3") {
    rowData6.value = tempCheckedList4.value;
  } else {
    rowData7.value = tempCheckedList4.value;
  }

  srowData4.value = [];
  scond5.value = "0";
  scond4.value = "0";
  openPopUp3.value = false;
};

const setCond6 = (e) => {
  if (cond8.value == "2") {
    Swal.fire({
      title: "경고",
      text: `영수금액 마다 선택시 영수증별만 선택가능합니다.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
    cond6.value = "1";
    return;
  }
};

const showCoupon2 = ref(false);
const showCoupon = ref(false);
const alarmCond26 = (e) => {
  if (e.target.value == "3") {
    Swal.fire({
      title: "알림",
      text: `아래 응모/쿠폰번호 업로드에서 응모번호를 업로드해주세요.`,
      icon: "info",
      confirmButtonText: "확인",
    });
    showCoupon2.value = true;
  } else if (e.target.value == "5") {
    Swal.fire({
      title: "알림",
      text: `아래 쿠폰정보등록에 쿠폰 정보를 등록해주세요.`,
      icon: "info",
      confirmButtonText: "확인",
    });
    //showCoupon2.value = false
    showCoupon.value = true;
  } else if (e.target.value == "6") {
    Swal.fire({
      title: "알림",
      text: `아래 쿠폰정보등록에 쿠폰 정보와 응모/쿠폰번호 업로드에 쿠폰번호를 업로드 해주세요.`,
      icon: "info",
      confirmButtonText: "확인",
    });
    showCoupon2.value = true;
    showCoupon.value = true;
  } else {
    showCoupon2.value = false;
    showCoupon.value = false;
  }
};

const inputFile = ref(null);

const openFile = (e) => {
  inputFile.value.value = null;
  inputFile.value.click();
};

const currentFile = ref(null);
const SheetList = ref([]);
const fileNm = ref("");
const excelcond = ref("1");
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  fileNm.value = file.name;
  console.log(file);
  currentFile.value = file;
  excelcond.value = 1;
  SheetList.value = [];
  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    // XLSX 라이브러리에서 arrayBuffer 사용 가능
    const workbook = read(arrayBuffer, { type: "array" });

    const sheetLength = workbook.SheetNames.length;

    for (let i = 0; i < sheetLength; i++) {
      SheetList.value.push({ lngCode: i + 1, strName: workbook.SheetNames[i] });
    }

    const result = await readFileWithArrayBuffer(file);
    console.log(result);
  }
  e.target.value = "";
};

async function readFileWithArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer();
  // XLSX 라이브러리에서 arrayBuffer 사용 가능
  const workbook = read(arrayBuffer, { type: "array" });

  const sheetName = workbook.SheetNames[excelcond.value - 1];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = utils.sheet_to_json(sheet, { header: 1 }); // 컬럼명 지칭할 헤더row 위치

  const header = ["ID", "strCode"];

  console.log(jsonData);
  const rows = jsonData.slice(1); // 실제 데이터 시작행
  console.log(rows);
  rowData8.value = rows.map((row) => {
    const obj = {};
    header.forEach((key, i) => {
      const value = row[i];
      obj[key] = value[Object.keys(value)[0]];
    });
    return obj;
  });

  // console.log(rowData8.value);
  updatedrowdata.value = JSON.parse(JSON.stringify(rowData8.value));

  return jsonData;
}

const getExcelFiles = () => {
  if (currentFile.value == null || currentFile.value == undefined) {
    return;
  }
  readFileWithArrayBuffer(currentFile.value);
};

const downloadFile = () => {
  const link = document.createElement("a");
  link.href = "/ReceiptEvent.xlsx"; // public 폴더 또는 정적 자원 경로
  link.download = "ReceiptEvent.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
