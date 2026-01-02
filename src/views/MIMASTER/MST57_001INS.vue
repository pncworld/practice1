/*--############################################################################
# Filename : MST57_001INS.vue                                                  
# Description : 마스터관리 > POS 마스터 > 메뉴 카테고리 관리                    
# Date :2025-09-04                                                             
# Author : 권맑음     
# 수정자 : 권지안                
################################################################################*/
<template>
  <!-- 조회 조건 -->
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <div class="flex justify-start pt-0">
      <PageName></PageName>
      <div class="flex justify-end space-x-2 ml-[1168px]">
        <div class="flex justify-center space-x-2 mt-2">
          <button @click="searchButton" class="button search md:w-auto w-14">
            조회
          </button>
          <button @click="saveButton" class="button save text-sm md:w-auto w-14">
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
  <br/>
  <!-- 조회 조건 -->
  <div class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore @update:storeAreaCd="handleStoreAreaCd" @update:storeCd="handleStoreCd" :showAreaCd="true"></PickStore>
  </div>
  <!-- 데이터 영역 -->
  <div class="mst57-data-area">
    <div class="inline-block md:flex w-full">
    <!-- <span class="md:hidden font-bold flex justify-center w-auto">
      클릭하시면 아래 페이지에서 다국어 정보가 나옵니다.
    </span> -->
    <div class="mst57-category-list-wrapper">
      <div class="mst57-category-list">
        <div v-for="i in Category" :key="i.MajorCode" class="mst57-category-item">
          <button 
            @click="bringCategory(i.MajorCode)" 
            class="mst57-category-main-btn"
            :class="{ 'mst57-category-active': selectedButton === i.MajorCode }">
            {{ i.MajorName }}
          </button>
          <div v-for="x in i.SubCategory" :key="x.SubCode" class="mst57-subcategory-item">
            <button 
              class="mst57-category-sub-btn" 
              @click="bringCategory(i.MajorCode)"
              :class="{ 'mst57-category-active': selectedButton === x.SubCode }">
              {{ x.SubName }}
            </button>
          </div>
        </div>
      </div>
      <div class="mst57-action-buttons-left" v-show="afterSearch && afterCategory">
        <button class="whitebutton mst57-add-category-btn" @click="addMainCategory">
          메인카테고리 추가
        </button>
        <button class="whitebutton mst57-order-btn" @click="testOrderManage">
          노출 순서 관리
        </button>
      </div>
    </div>
    <div v-show="testOrderManage2" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-4/5 h-4/5 overflow-auto">
        <!-- 상단 타이틀 영역 -->
        <div class="border-gray-500 text-2xl flex justify-between items-center mb-4">
          <span>카테고리 노출 순서 관리</span>
          <button @click="saveButtonPopup" class="button save text-sm md:w-auto w-14">
            저장
          </button>
        </div>
    <!-- 본문 영역: 2컬럼 레이아웃 -->
    <div class="grid grid-cols-2 gap-6 h-[calc(100%-6rem)]">
      <!-- 대 카테고리 -->
      <div class="border border-gray-300 rounded">
        <div class="bg-gray-100 font-bold p-2 text-center">대 카테고리</div>
        <VueDraggableNext v-model="Category" item-key="MajorCode" :group="'A'" class="space-y-2 p-2" @end="updateCategoryNumbers">
          <div v-for="i in Category" :key="i.MajorCode" class="p-3 bg-gray-200 rounded-md shadow-sm cursor-pointer flex items-center" @click="selectCategory(i)">
            <span class="mr-2">≡</span>
            <p>{{ i.MajorName }}</p>
          </div>
        </VueDraggableNext>
      </div>
      <!-- 중 카테고리 -->
      <div class="border border-gray-300 rounded">
        <div class="bg-gray-100 font-bold p-2 text-center">중 카테고리</div>
        <VueDraggableNext v-if="selectedCategory" v-model="selectedCategory.SubCategory" item-key="SubCode" :group="'B'" class="space-y-2 p-2" @end="updateCategoryNumbers">
          <div v-for="x in selectedCategory.SubCategory" :key="x.SubCode" class="p-3 bg-blue-200 rounded-md shadow-sm cursor-move flex items-center">
            <span class="mr-2">≡</span>
            <p>{{ x.SubName }}</p>
          </div>
        </VueDraggableNext>
        <p v-else class="text-gray-500 text-center p-4">
          중 카테고리 순서 변경을 원하시면<br>대 카테고리를 선택하세요.
        </p>
      </div>
    </div>
    <!-- 하단 닫기 버튼 -->
    <div class="flex justify-center mt-6">
      <button @click="testOrderManage" class="p-2 bg-blue-500 text-white rounded">
        닫기
      </button>
    </div>
  </div>
</div>
    <div class="mst57-main-category-form" v-if="afterCategory">
      <div class="mst57-form-header">
        <button class="whitebutton mst57-delete-main-btn" @click="deleteMainCategory">
          대카테고리 삭제
        </button>
      </div>
      <div class="mst57-form-grid">
        <div class="mst57-form-label mst57-label-required">
          *메인카테고리명(한국어)
        </div>
        <div class="mst57-form-field">
          <input
            type="text"
            class="mst57-input"
            v-model="languageName0"
            @input="changeMajorName"
            @keyup="afterModifed" />
        </div>
        <div class="mst57-form-label">
          메인카테고리명(영어)
        </div>
        <div class="mst57-form-field">
          <input
            type="text"
            class="mst57-input"
            v-model="languageName1"
            @input="changeMajorName1"
            @keyup="afterModifed" />
        </div>
        <div class="mst57-form-label">
          메인카테고리명(중국어)
        </div>
        <div class="mst57-form-field">
          <input
            type="text"
            class="mst57-input"
            v-model="languageName2"
            @input="changeMajorName2"
            @keyup="afterModifed" />
        </div>
        <div class="mst57-form-label">
          메인카테고리명(일본어)
        </div>
        <div class="mst57-form-field">
          <input
            type="text"
            class="mst57-input"
            v-model="languageName3"
            @input="changeMajorName3"
            @keyup="afterModifed" />
        </div>
        <!-- <div class="bg-gray-200 flex justify-start items-center pl-4">
          메인카테고리명(스페인어)
        </div>
        <div class="bg-white md:w-96 w-full">
          <input
            type="text"
            class="border border-gray-300 h-6 mt-2 w-8/12 md:w-96 flex justify-start ml-4 pl-2"
            v-model="languageName4"
            @input="changeMajorName4"
            @keyup="afterModifed" />
        </div> -->
      </div>
      <div class="mst57-subcategory-add-btn-wrapper" v-if="afterCategory">
        <button class="whitebutton mst57-add-subcategory-btn" @click="addsubCategory">
          서브카테고리 추가
        </button>
      </div>
      <div class="mst57-sub-category-form"
        v-for="i in subMultiLang"
        v-if="afterCategory"
        :key="i[0]?.categoryCode">
        <div class="mst57-sub-form-header">
          <button class="whitebutton mst57-delete-sub-btn" @click="deleteSubCategory(i[0].categoryCode)">
            삭제
          </button>
        </div>
    <div class="mst57-form-grid mst57-sub-form-grid">
      <div class="mst57-form-label mst57-label-required">
        *서브카테고리명(한국어)
      </div>
      <div class="mst57-form-field">
        <input
          type="text"
          class="mst57-input"
          :value="i[0] ? i[0].LanguageName : ''"
          @input="
            (event) => {
              changeSubName(i[0].categoryCode, event);
              subcategorynm(event);
            }
          "
          @keyup="afterModifed" />
      </div>
      <div class="mst57-form-label">
        비고
      </div>
      <div class="mst57-form-field">
        <input
          type="text"
          class="mst57-input"
          :value="i[0] ? i[0].EXTRA_NM : ''"
          @input="(event) => changeExtraNm(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
      <div class="mst57-form-label">
        서브카테고리명(영어)
      </div>
      <div class="mst57-form-field">
        <input
          type="text"
          class="mst57-input"
          :value="i[1] ? i[1].LanguageName : ''"
          @input="(event) => changeSubName1(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
      <div class="mst57-form-label">
        서브카테고리명(중국어)
      </div>
      <div class="mst57-form-field">
        <input
          type="text"
          class="mst57-input"
          :value="i[2] ? i[2].LanguageName : ''"
          @input="(event) => changeSubName2(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
      <div class="mst57-form-label">
        서브카테고리명(일본어)
      </div>
      <div class="mst57-form-field">
        <input
          type="text"
          class="mst57-input"
          :value="i[3] ? i[3].LanguageName : ''"
          @input="(event) => changeSubName3(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div>
      <div class="mst57-form-label">
          사용여부
      </div>
         <!-- USE_YN 라디오 버튼 -->
        <div class="mst57-form-field mst57-radio-group">
          <label class="flex items-center space-x-1">
            <input
              type="radio"
              :name="'useyn-' + (i[0]?.categoryCode ? i[0].categoryCode : '')"
              value="Y"
              :checked="i[0]?.USE_YN === 'Y'"
              @change="(event) => changeUseYn(i[0].categoryCode, event)"
            />
            <span>사용</span>
          </label>
          <label class="flex items-center space-x-1">
            <input
              type="radio"
              :name="'useyn-' + (i[0]?.categoryCode ? i[0].categoryCode : '')"
              value="N"
              :checked="i[0]?.USE_YN === 'N'"
              @change="(event) => changeUseYn(i[0].categoryCode, event)"
            />
            <span>미사용</span>
          </label>
        </div>
        <div class="mst57-form-label">
            사용기간
        </div>
        <div class="mst57-form-field mst57-date-time-field">
          <!-- 전체기간 + 시작일/종료일 한 줄로 배치 (수평 정렬) -->
          <div class="flex items-center space-x-4">
            <!-- 체크박스 + 라벨 -->
            <label class="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                class="h-4 w-4"
                :checked="i[0]?.ALL_DATE === '1'"
                @change="(event) => changeAllDate(i[0].categoryCode, event.target.checked)"
                @keyup="afterModifed"
              />
              <span class="text-sm">전체기간</span>
            </label>
            <!-- 시작일 -->
            <div class="flex items-center">
              <span class="w-14 text-sm flex-shrink-0">시작일 : </span>
              <input
                type="date"
                class="h-8 text-sm ml-1 w-[6vw] disabled:bg-gray-400"
                :value="i[0] ? i[0].FROM_DATE : ''"
                @input="(event) => changeFromDate(i[0].categoryCode, event)"
                :disabled="(i[0]?.ALL_DATE === '1')"
              />
            </div>
            <!-- 종료일 -->
            <div class="flex items-center">
              <span class="w-14 text-sm flex-shrink-0">종료일 : </span>
              <input
                type="date"
                class="h-8 text-sm ml-1 w-[6vw] disabled:bg-gray-400"
                :value="i[0] ? i[0].TO_DATE : ''"
                @input="(event) => changeToDate(i[0].categoryCode, event)"
                :disabled="(i[0]?.ALL_DATE === '1')"
              />
            </div>
          </div>
        </div>
        <div class="mst57-form-label">
            사용시간
        </div>
        <div class="mst57-form-field mst57-date-time-field">
        <!-- 전체기간 + 시작일/종료일 한 줄로 배치 (수평 정렬) -->
          <div class="flex items-center space-x-4">
            <!-- 체크박스 + 라벨 -->
            <label class="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                class="h-4 w-4"
                :checked="i[0]?.ALL_TIME === '1'"
                @change="(event) => changeAllTime(i[0].categoryCode, event.target.checked)"
                @keyup="afterModifed"
              />
              <span class="text-sm">전체시간</span>
            </label>
            <!-- 시작시간 -->
             <!-- 시작일 -->
            <div class="flex items-center">
              <span>시작시간 : </span>
              <select name="" id="" class="ml-1 text-lg disabled:bg-gray-400  disabled:opacity-100"
                    :value="i[0]?.FROM_TIME ? parseInt(i[0].FROM_TIME.substring(0, 2)) : 0" 
                    @change="(event) => changeFromTime(i[0].categoryCode, 'hour', event.target.value)"
                    :disabled="(i[0]?.ALL_TIME === '1')" >
                <option :value="i.lngCode" v-for="i in optionList">
                  {{ i.strName }}
                </option>
              </select>
              <span>시</span>
              <select name="" id="" class="text-lg  disabled:bg-gray-400  disabled:opacity-100"
                    :value="i[0]?.FROM_TIME ? parseInt(i[0].FROM_TIME.substring(2)) : 0"
                    @change="(event) => changeFromTime(i[0].categoryCode, 'minute', event.target.value)"
                    :disabled="(i[0]?.ALL_TIME === '1')" >
                <option :value="i.lngCode" v-for="i in optionList2">
                  {{ i.strName }}
                </option>
              </select>
              <span>분</span>
            </div>
            <!-- 종료일 -->
            <div class="flex items-center">
                <span>종료시간 : </span>
                <select name="" id="" class=" text-lg ml-1 disabled:bg-gray-400 disabled:opacity-100"
                       :value="i[0]?.TO_TIME ? parseInt(i[0].TO_TIME.substring(0, 2)) : 0"
                       @change="(event) => changeToTime(i[0].categoryCode, 'hour', event.target.value)"
                       :disabled="(i[0]?.ALL_TIME === '1')">
                  <option :value="i.lngCode" v-for="i in optionList">
                    {{ i.strName }}
                  </option>
                </select>
                <span>시</span>
                <select name="" id="" class=" text-lg disabled:bg-gray-400  disabled:opacity-100"
                      :value="i[0]?.TO_TIME ? parseInt(i[0].TO_TIME.substring(2)) : 0"
                      @change="(event) => changeToTime(i[0].categoryCode, 'minute', event.target.value)"
                      :disabled="(i[0]?.ALL_TIME === '1')">
                  <option :value="i.lngCode" v-for="i in optionList2">
                    {{ i.strName }}
                  </option>
                </select>
                <span>분</span>
            </div>
          </div>
        </div>
      <div class="mst57-form-label">
          사용요일
      </div>
      <div class="mst57-form-field mst57-date-time-field">
        <div class="flex items-center space-x-4 flex-wrap">
            <label class="inline-flex items-center space-x-2">
              <input type="checkbox" id="allcheck" class="h-4 w-4" 
                  :checked="i[0]?.SEL_DAY === '11111111'" 
                  @change="(event) => toggleAllDays(i[0].categoryCode, event.target.checked)">
                <span class="text-sm">전체체크</span>
            </label>
            <div class="flex items-center space-x-3">
              <label for="mon" class="inline-flex items-center space-x-1">
                <input type="checkbox" id="mon" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(0, 1) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 0, event.target.checked)" />
                <span>월</span>
              </label>
              <label for="tue" class="inline-flex items-center space-x-1"> 
                <input type="checkbox" id="tue" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(1, 2) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 1, event.target.checked)" />
                <span>화</span>
              </label>
              <label for="wed" class="inline-flex items-center space-x-1">    
                <input type="checkbox" id="wed" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(2, 3) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 2, event.target.checked)" />
                <span>수</span>
              </label>
              <label for="thu" class="inline-flex items-center space-x-1">
                <input type="checkbox" id="thu" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(3, 4) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 3, event.target.checked)" />
                <span>목</span>
              </label>
              <label for="fri" class="inline-flex items-center space-x-1">
                <input type="checkbox" id="fri" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(4, 5) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 4, event.target.checked)" />
                <span>금</span>
              </label>
              <label for="sat" class="inline-flex items-center space-x-1">
                <input type="checkbox" id="sat" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(5, 6) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 5, event.target.checked)" />
                <span>토</span>
              </label>
              <label for="sun" class="inline-flex items-center space-x-1">
                <input type="checkbox" id="sun" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(6, 7) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 6, event.target.checked)" />
                <span>일</span>
              </label>
              <label for="holiday" class="inline-flex items-center space-x-1">
                <input type="checkbox" id="holiday" 
                    :checked="i[0]?.SEL_DAY ? i[0].SEL_DAY.substring(7, 8) === '1' : false"
                    @change="(event) => changeDay(i[0].categoryCode, 7, event.target.checked)" />
                <span>공휴일</span>
              </label>
            </div>
        </div>
      </div>
      <!-- <div class="bg-gray-200 flex justify-start items-center pl-4">
        서브카테고리명(스페인어)
      </div>
      <div class="bg-white">
        <input
          type="text"
          class="border border-gray-300 h-6 mt-2 w-96 flex justify-start ml-4 pl-2"
          :value="i[4] ? i[4].LanguageName : ''"
          @input="(event) => changeSubName4(i[0].categoryCode, event)"
          @keyup="afterModifed" />
      </div> -->
        </div>
      </div>
      <div class="mst57-save-button-wrapper" v-show="afterCategory">
        <button class="button save mst57-save-btn" @click="saveButton">저장</button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup>

import {
  getCategoryInfo,
  getMultiLingual,
  setMainCategoryDELETE,
  setMainCategoryINSERT,
  setMainCategoryUpdate,
  setSubCategoryDelete,
  setSubCategoryINSERT,
  setSubCategoryUPDATE,
  saveMajorCategory,
  saveSubCategory
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
 *  페이지로그 자동 입력
 *  */
import { insertPageLog } from "@/customFunc/customFunc";

/**
 *  경고창 호출 라이브러리
 *  */
import Swal from "sweetalert2";

/*
 * 공통 표준  Function
 */
import { onMounted, ref, watch } from "vue";

/**
 *  Vuex 상태관리 및 로그인세션 관련 라이브러리
 */
import { useStore } from "vuex";

/*
 * 드래그 라이브러리 호출
 */
import { VueDraggableNext } from "vue-draggable-next";

/**
 * 	화면 Load시 실행 스크립트
 */
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const searchStoreName = ref();
const selectedButton = ref();
const Category = ref([]);
// const SubCategory = ref([]);
const getMultiLang = ref([]);
const mainMultiLang = ref([]);
const subMultiLang = ref([]);
const mainCategoryInsert = ref(false);
const store = useStore();
const nowStoreCd = ref();
const afterCategory = ref(false);
const currentMajorCode = ref();
const newMainCategoryCode = ref([]);

const optionList = ref([
  { lngCode: 0, strName: '00' },
  { lngCode: 1, strName: '01' },
  { lngCode: 2, strName: '02' },
  { lngCode: 3, strName: '03' },
  { lngCode: 4, strName: '04' },
  { lngCode: 5, strName: '05' },
  { lngCode: 6, strName: '06' },
  { lngCode: 7, strName: '07' },
  { lngCode: 8, strName: '08' },
  { lngCode: 9, strName: '09' },
  { lngCode: 10, strName: 10 },
  { lngCode: 11, strName: 11 },
  { lngCode: 12, strName: 12 },
  { lngCode: 13, strName: 13 },
  { lngCode: 14, strName: 14 },
  { lngCode: 15, strName: 15 },
  { lngCode: 16, strName: 16 },
  { lngCode: 17, strName: 17 },
  { lngCode: 18, strName: 18 },
  { lngCode: 19, strName: 19 },
  { lngCode: 20, strName: 20 },
  { lngCode: 21, strName: 21 },
  { lngCode: 22, strName: 22 },
  { lngCode: 23, strName: 23 },
]);

const optionList2 = ref([
  { lngCode: 0, strName: '00' },
  { lngCode: 10, strName: 10 },
  { lngCode: 20, strName: 20 },
  { lngCode: 30, strName: 30 },
  { lngCode: 40, strName: 40 },
  { lngCode: 50, strName: 50 },
]);

// 현재 선택된 대카테고리
const selectedCategory = ref(null)

function selectCategory(category) {
  selectedCategory.value = category
}

/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = (newValue) => {
  // if (newValue == "0") {
  afterSearch.value = false;
  // }
  nowStoreCd.value = newValue;
};
const afterSearch = ref(false);
const modified = ref(false);
const afterModifed = () => {
  modified.value = true;
};
const fillsubCategory = ref(true);
const subcategorynm = (event) => {
  const value = event.target.value;
  if (value == "") {
    fillsubCategory.value = false;
  } else {
    fillsubCategory.value = true;
  }
};
watch(nowStoreCd, (newvalue, oldvalue) => {
  if (newvalue != oldvalue) {
    getMultiLang.value = [];
    mainMultiLang.value = [];
    subMultiLang.value = [];
    Category.value = [];
    languageName0.value = "";
    languageName1.value = "";
    languageName2.value = "";
    languageName3.value = "";
    languageName4.value = "";
    convertedsubMultiLang.value = [];
  }
});
const nowStoreAreaCd = ref();
/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  nowStoreAreaCd.value = newValue;
};

const languageName0 = ref("");
const languageName1 = ref("");
const languageName2 = ref("");
const languageName3 = ref("");
const languageName4 = ref("");
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);

const testOrderManage2 = ref(false);

const testOrderManage = () => {
  // 닫히는 순간(selectedCategory 초기화)
  if (testOrderManage2.value) {
    selectedCategory.value = null;
  }
  testOrderManage2.value = !testOrderManage2.value;
}

const addMainCategory = () => {
  afterCategory.value = true;
  const newMajorCode = Category.value.map((item) => {
    return Number(item.MajorCode);
  });

  const newmajorcode =
    newMajorCode.length == 0
      ? "1"
      : (newMajorCode[newMajorCode.length - 1] + 1).toString();
  newMainCategoryCode.value.push(newmajorcode);
  const newMainCategory = {
    MajorCode: newmajorcode,
    MajorName: "새 카테고리",
    SubCategory: [],
    mainMultilang: [],
    subMultilang: [],
  };
  const languagename0 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "0",
    LanguageName: "새 카테고리",
  };
  const languagename1 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "1",
    LanguageName: "",
  };
  const languagename2 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "2",
    LanguageName: "",
  };
  const languagename3 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "3",
    LanguageName: "",
  };
  const languagename4 = {
    TypeCode: "4",
    categoryCode: newmajorcode,
    LanguageID: "4",
    LanguageName: "",
  };
  getMultiLang.value.push(languagename0);
  getMultiLang.value.push(languagename1);
  getMultiLang.value.push(languagename2);
  getMultiLang.value.push(languagename3);
  getMultiLang.value.push(languagename4);
  Category.value.push(newMainCategory);
  languageName0.value = "새 카테고리";
  languageName1.value = "";
  languageName2.value = "";
  languageName3.value = "";
  languageName4.value = "";
  currentMajorCode.value = newmajorcode;
  bringCategory(newmajorcode);
  addsubCategory();
};
const changeMajorName = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "0"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
  const changingcategoryname = () => {
    Category.value.filter((item) => {
      if (item.MajorCode == currentMajorCode.value) {
        item.MajorName = inputdata;
      }
    });
  };
  changingcategoryname();
};
const changeMajorName1 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "1"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeMajorName2 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "2"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeMajorName3 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "3"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const changeMajorName4 = (event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == currentMajorCode.value &&
        item.TypeCode == "4" &&
        item.LanguageID == "4"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};
const deleteSubCategory = async (categoryCode) => {
  const result = await Swal.fire({
    title: "경고",
    text: "서브 카테고리를 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  });

  if (result.isConfirmed) {
    try {
      const res = await setSubCategoryDelete(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value,
        currentMajorCode.value,
        categoryCode
      );

      // console.log(res);

      if (res.status === 200) {
        await Swal.fire({
          title: "삭제 성공",
          text: "삭제되었습니다",
          icon: "success",
          confirmButtonText: "확인",
        });

        await searchButton();
        bringCategory(currentMajorCode.value);
      }
    } catch (error) {
      //console.error("삭제 중 오류 발생:", error);
      Swal.fire({
        title: "오류",
        text: "서브 카테고리 삭제 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  }
};

const deleteMainCategory = () => {
  Swal.fire({
    title: "경고",
    text: "메인 카테고리를 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const subMultis = subMultiLang.value
        .flatMap((innerArray) => innerArray)
        .filter(
          (items) =>
            items.LanguageID == "0" &&
            items.TypeCode == "3" 
            // currentMajorCode.value == items.categoryCode &&
        );
      const subCd = subMultis.map((item) => item.categoryCode);

      const res = await setMainCategoryDELETE(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value,
        currentMajorCode.value,
        subCd.join(",")
      );

      // console.log(res);

      if (res.status == 200) {
        Swal.fire({
          title: "삭제 성공",
          text: "삭제되었습니다",
          icon: "success",
          confirmButtonText: "확인",
        });
        searchButton();
      }

    } else {
      return;
    }
  });
};
const deleteAllsubCategory = async () => {
  Swal.fire({
    title: "경고",
    text: "서브 카테고리를 전체 삭제하시겠습니까?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "삭제",
    cancelButtonText: "취소",
    allowOutsideClick: false,
  }).then(async (result) => {
    if (result.isConfirmed) {
      const subMultis = subMultiLang.value
        .flatMap((innerArray) => innerArray)
        .filter((items) => items.LanguageID == "0");
      const subCd = subMultis.map((item) => item.categoryCode);

      const res = await setSubCategoryDelete(
        groupCd.value,
        nowStoreCd.value,
        nowStoreAreaCd.value,
        currentMajorCode.value,
        subCd.join(",")
      ).then(async (result) => {
        if (result.status == 200) {
          Swal.fire({
            title: "전체 삭제 성공",
            text: "삭제되었습니다",
            icon: "success",
            confirmButtonText: "확인",
          }).then(async () => {
            await searchButton().then(() => {
              bringCategory(currentMajorCode.value);
              // console.log(res);
            });
          });
        }
      });
    }
  });
};

/**
 *  조회 함수
 */
const searchButton = async () => {
  subMultiLang.value = [];
  Category.value = [];
  // SubCategory.value = [];
  languageName0.value = "";
  languageName1.value = "";
  languageName2.value = "";
  languageName3.value = "";
  languageName4.value = "";
  convertedsubMultiLang.value = [];
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
  if (nowStoreAreaCd.value == "0" || nowStoreAreaCd.value == undefined) {
    Swal.fire({
      title: "경고",
      text: "지역코드를 선택하세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  store.state.loading = true;
  try {
    const res = await getCategoryInfo(
      groupCd.value,
      nowStoreCd.value,
      nowStoreAreaCd.value
    );

    Category.value = res.data.MainCategory;
  
    afterSearch.value = true;
    const res1 = await getMultiLingual(groupCd.value, nowStoreCd.value);
    getMultiLang.value = res1.data.MultiLingual;
    
  } catch (error) {
    afterSearch.value = false;
  } finally {
    store.state.loading = false; // 로딩 상태 종료
    (() => {
      Category.value.filter((item) => {
        item.SubCategory = item.SubCategory.filter((sub) => sub.SubCode !== "");
        // SubCategory.value = item.SubCategory;
      });
    })();
    modified.value = false;
    afterCategory.value = false;
  }
  //comsole.log(Category.value);
};

/***
 *  저장 함수
 */
const saveButton = async () => {
  // if(newMainCategoryCode.value.includes(currentMajorCode.value) && ){

  // }
  if (afterSearch.value == false) {
    Swal.fire({
      title: "경고",
      text: "조회를 먼저 진행해주세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
  /*
  if (modified.value == false) {
    Swal.fire({
      title: "경고",
      text: "변경사항이 없습니다.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
    });
    return;
  }
    */
  if (fillsubCategory.value == false) {
    Swal.fire({
      title: "경고",
      text: "서브카테고리(한국어)를 입력해주세요.",
      icon: "warning",
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      allowOutsideClick: false,
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
      
      // const existingSubMultis = Category.value
      //   .filter(cat => cat.MajorCode == currentMajorCode.value)
      //   .flatMap(cat => cat.SubCategory.map(sub => sub.SubCode))
      //   .flatMap(code => getMultiLang.value.filter(m => m.TypeCode === "3" && m.categoryCode === code));

      // const existingSubMultis = Category.value
      //   .filter(cat => cat.MajorCode == currentMajorCode.value)
      //   // .flatMap(cat => cat.SubCategory.map(sub => sub.SubCode))
      //   .flatMap(() => subMultiLang.value.flatMap(inner => inner));

      const getExistingSubMultis = () => {
        // 1) 선택된 SubCode 집합
        const selectedSubCodes = new Set(
          Category.value
            .filter(cat => cat.MajorCode == currentMajorCode.value)
            .flatMap(cat => cat.SubCategory.map(sub => sub.SubCode))
        );
        // 2) subMultiLang에서 같은 '객체 참조'로 필터
        return subMultiLang.value
          .flatMap(inner => inner)
          .filter(m => m.TypeCode === "3" && selectedSubCodes.has(m.categoryCode));
      };
      
      const existingSubMultis = getExistingSubMultis();
      // console.log(existingSubMultis);

      const newSubMultis = subMultiLang.value.flatMap(inner => inner).filter(item => item.Insert === true);

      const keyOf = x => `${x.categoryCode}::${x.LanguageID}`;
      const map = new Map();
      existingSubMultis.forEach(e => map.set(keyOf(e), e));
      newSubMultis.forEach(n => map.set(keyOf(n), n));

      const allSubMultis = Array.from(map.values());

      const insertList = allSubMultis.filter(item => item.Insert === true);
      const updateList = allSubMultis.filter(item => !item.Insert);

      // console.log(insertList);
      // console.log(updateList);

      const subCd       = insertList.map(i => i.categoryCode);
      const subNm       = insertList.map(i => i.LanguageName);
      const languageNm  = insertList.map(i => i.LanguageID);
      const useYn       = insertList.map(i => i.USE_YN);
      const allDate     = insertList.map(i => i.ALL_DATE);
      const fromDate    = insertList.map(i => i.FROM_DATE);
      const toDate      = insertList.map(i => i.TO_DATE);
      const allTime     = insertList.map(i => i.ALL_TIME);
      const fromTime    = insertList.map(i => i.FROM_TIME);
      const toTime      = insertList.map(i => i.TO_TIME);
      const selDay      = insertList.map(i => i.SEL_DAY);
      const extraNm     = insertList.map(i => i.EXTRA_NM);
      

      const subCd2      = updateList.map(i => i.categoryCode);
      const subNm2      = updateList.map(i => i.LanguageName);
      const languageNm2 = updateList.map(i => i.LanguageID);
      const useYn2      = updateList.map(i => i.USE_YN);
      const allDate2    = updateList.map(i => i.ALL_DATE);
      const fromDate2   = updateList.map(i => i.FROM_DATE);
      const toDate2     = updateList.map(i => i.TO_DATE);
      const allTime2    = updateList.map(i => i.ALL_TIME);
      const fromTime2   = updateList.map(i => i.FROM_TIME);
      const toTime2     = updateList.map(i => i.TO_TIME);
      const selDay2     = updateList.map(i => i.SEL_DAY);
      const extraNm2    = updateList.map(i => i.EXTRA_NM);

      const majorNmBase = [
        languageName0.value,
        languageName1.value,
        languageName2.value,
        languageName3.value,
        languageName4.value,
      ];
      const makeMajorNmStr = (list) => {
        const uniqueSubCount = [...new Set(list.map(i => i.categoryCode))].length || 0;
        if (uniqueSubCount === 0) return "";
        return Array.from({ length: uniqueSubCount })
          .flatMap(() => majorNmBase)
          .join(",");
      };
      const majorNmStr = makeMajorNmStr(insertList);
      const majorNmStr2 = makeMajorNmStr(updateList);

      try {

        // console.log(majorNmStr.length);

        if (majorNmStr.length != 0){
          if (mainCategoryInsert.value){
            const res = await setMainCategoryINSERT(
              groupCd.value,
              nowStoreCd.value,
              nowStoreAreaCd.value,
              currentMajorCode.value,
              majorNmStr,
              subCd.join(","),
              subNm.join(","),
              languageNm.join(","),
              useYn.join(","),
              allDate.join(","),
              fromDate.join(","),
              toDate.join(","),
              allTime.join(","),
              fromTime.join(","),
              toTime.join(","),
              selDay.join(","),
              extraNm.join(","),
            );
        
            // console.log(res);

          } else {
            const res = await setSubCategoryINSERT(
              groupCd.value,
              nowStoreCd.value,
              nowStoreAreaCd.value,
              currentMajorCode.value,
              majorNmStr,
              subCd.join(","),
              subNm.join(","),
              languageNm.join(","),
              useYn.join(","),
              allDate.join(","),
              fromDate.join(","),
              toDate.join(","),
              allTime.join(","),
              fromTime.join(","),
              toTime.join(","),
              selDay.join(","),
              extraNm.join(","),
            );
        
          //  console.log(res);

          }
        } 
        
        // console.log(majorNmStr2.length);

        if(majorNmStr2.length != 0){

          if (!newMainCategoryCode.value.includes(currentMajorCode.value)) {
            const res = await setMainCategoryUpdate(
              groupCd.value,
              nowStoreCd.value,
              nowStoreAreaCd.value,
              currentMajorCode.value,
              majorNmStr2,
              subCd2.join(","),
              subNm2.join(","),
              languageNm2.join(","),
              useYn2.join(","),
              allDate2.join(","),
              fromDate2.join(","),
              toDate2.join(","),
              allTime2.join(","),
              fromTime2.join(","),
              toTime2.join(","),
              selDay2.join(","),
              extraNm2.join(","),
            );
        
            // console.log(res);

          } else {
            const res = await setSubCategoryUPDATE(
              groupCd.value,
              nowStoreCd.value,
              nowStoreAreaCd.value,
              currentMajorCode.value,
              majorNmStr2,
              subCd2.join(","),
              subNm2.join(","),
              languageNm2.join(","),
              useYn2.join(","),
              allDate2.join(","),
              fromDate2.join(","),
              toDate2.join(","),
              allTime2.join(","),
              fromTime2.join(","),
              toTime2.join(","),
              selDay2.join(","),
              extraNm2.join(","),
            );
        
            // console.log(res);

          }

        }

      } catch (error) {
        // 오류 처리
        Swal.fire({
          title: "저장 실패",
          text: "오류가 발생했습니다.",
          icon: "error",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          allowOutsideClick: false,
        });
      } finally {
        
        await searchButton(); // searchMenu()도 await
        bringCategory(currentMajorCode.value);

        Swal.fire({
            title: "저장 성공",
            text: "저장되었습니다.",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
        });
        newMainCategoryCode.value = [];
        modified.value = false;

      }
    } else {
      return;
    }
  });
};

const convertedsubMultiLang = ref([]);
const subCode3 = ref();
const userInputData = ref([]);
const bringCategory = (value) => {
  console.log(value)
  afterCategory.value = true;
  if (newMainCategoryCode.value.includes(value)) {
    mainCategoryInsert.value = true;
  } else {
    mainCategoryInsert.value = false;
  }

  currentMajorCode.value = value;
  // //comsole.log(getMultiLang.value);
  // //comsole.log(Category.value);
  Category.value = Category.value.map((categoryItem) => {
    // getMultiLang에서 MajorCode와 일치하는 항목을 찾아 mainMultilang으로 설정
    categoryItem.mainMultilang = getMultiLang.value.filter(
      (item) =>
        item.TypeCode === "4" && item.categoryCode === categoryItem.MajorCode
    );
    categoryItem.subMultilang = getMultiLang.value.filter((item) => {
      const matchedSubCategory = categoryItem.SubCategory.find(
        (sub) => sub.SubCode === item.categoryCode
      );
      return item.TypeCode === "3" && matchedSubCategory;
    });
    return categoryItem;
  });

  selectedButton.value = value;

  languageName0.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "0" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== ""); // 빈 값 제거

  languageName1.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "1" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== ""); // 빈 값 제거

  languageName2.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "2" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== "");

  languageName3.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "3" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== "");

  languageName4.value = Category.value
    .map((item) => {
      const result = item.mainMultilang.find(
        (item2) => item2.LanguageID === "3" && item2.categoryCode === value
      );
      return result ? result.LanguageName : "";
    })
    .filter((name) => name !== "");

  const subCodes = Category.value
    .filter((item2) => item2.MajorCode == value)
    .flatMap((item2) => {
      const subCategory = Array.isArray(item2.SubCategory) ? item2.SubCategory : [];
      return subCategory.map((item3) => item3.SubCode);
    });
 
  // subMultiLang.value = subCodes.map((code) => {
  //   // 각 code에 대해 필터링하여 해당 categoryCode와 일치하는 subMultilang 항목을 모음
  //   return Category.value
  //     .map((item) => {
  //       return item.subMultilang.filter((item2) => item2.categoryCode === code);
  //     })
  //     .flat(); // 각 배열을 평탄화하여 단일 배열로 만듭니다.
  // });

  subMultiLang.value = subCodes.map((code) => {
    return Category.value.map((item) => {
      // 해당 code와 매칭되는 SubCategory 찾기
      const sub = item.SubCategory.find((s) => s.SubCode === code);

      // subMultilang 중에서 code와 맞는 것만 가져오고 USE_YN을 같이 붙임
      return item.subMultilang
        .filter((ml) => ml.categoryCode === code)
        .map((ml) => ({
          ...ml,
          USE_YN    : sub ? sub.USE_YN : null,
          ALL_DATE  : sub ? sub.ALL_DATE : null,
          FROM_DATE : sub ? sub.FROM_DATE : null,
          TO_DATE   : sub ? sub.TO_DATE : null,
          ALL_TIME  : sub ? sub.ALL_TIME : null,
          FROM_TIME : sub ? sub.FROM_TIME : null,
          TO_TIME   : sub ? sub.TO_TIME : null,
          SEL_DAY   : sub ? sub.SEL_DAY : null,
          EXTRA_NM   : sub ? sub.EXTRA_NM : null,
        }));
    }).flat();
  });



};

const addsubCategory = () => {
  fillsubCategory.value = false;
  let maxSubCode = Math.max(
    ...Category.value
      .filter((item) => item.SubCategory && item.SubCategory.length > 0)
      .flatMap((item) => item.SubCategory.map((sub) => Number(sub.SubCode)))
  );

  if (!isFinite(maxSubCode)) {
    maxSubCode = 0; // 원하는 기본값으로 설정
  }
  maxSubCode = (Number(maxSubCode) + 1).toString();

  (() => {
    Category.value.filter((item) => {
      if (item.MajorCode === currentMajorCode.value) {
        item.SubCategory.push({ 
          SubCode: maxSubCode, 
          SubName: "",
          USE_YN: "Y",
          ALL_DATE: "1",
          FROM_DATE: new Date().toISOString().split('T')[0],
          TO_DATE: new Date().toISOString().split('T')[0],
          ALL_TIME: "1",
          FROM_TIME: "0000",
          TO_TIME: "2350",
          SEL_DAY: "11111111",
          EXTRA_NM: ""
        });
      }
    });
  })();

  const sumarray = [];

  const newsubCategory0 = {
    TypeCode      : "3",
    categoryCode  : maxSubCode,
    LanguageID    : "0",
    LanguageName  : "",
    EXTRA_NM      : "",
    USE_YN        : "Y",
    ALL_DATE      : "1",
    FROM_DATE : new Date().toISOString().split('T')[0],
    TO_DATE   : new Date().toISOString().split('T')[0],
    ALL_TIME  : "1",
    FROM_TIME : "0000",
    TO_TIME   : "2350",
    SEL_DAY   : "11111111",
    Insert: true,
  };
  const newsubCategory1 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "1",
    LanguageName: "",
    EXTRA_NM      : "",
    USE_YN: "Y",
    ALL_DATE  : "1",
    FROM_DATE : new Date().toISOString().split('T')[0],
    TO_DATE   : new Date().toISOString().split('T')[0],
    ALL_TIME  : "1",
    FROM_TIME : "0000",
    TO_TIME   : "2350",
    SEL_DAY   : "11111111",
    Insert: true,
  };
  const newsubCategory2 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "2",
    LanguageName: "",
    EXTRA_NM      : "",
    USE_YN: "Y",
    ALL_DATE  : "1",
    FROM_DATE : new Date().toISOString().split('T')[0],
    TO_DATE   : new Date().toISOString().split('T')[0],
    ALL_TIME  : "1",
    FROM_TIME : "0000",
    TO_TIME   : "2350",
    SEL_DAY   : "11111111",
    Insert: true,
  };
  const newsubCategory3 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "3",
    LanguageName: "",
    EXTRA_NM      : "",
    USE_YN: "Y",
    ALL_DATE  : "1",
    FROM_DATE : new Date().toISOString().split('T')[0],
    TO_DATE   : new Date().toISOString().split('T')[0],
    ALL_TIME  : "1",
    FROM_TIME : "0000",
    TO_TIME   : "2350",
    SEL_DAY   : "11111111",
    Insert: true,
  };
  const newsubCategory4 = {
    TypeCode: "3",
    categoryCode: maxSubCode,
    LanguageID: "4",
    LanguageName: "",
    EXTRA_NM      : "",
    USE_YN: "Y",
    ALL_DATE  : "1",
    FROM_DATE : new Date().toISOString().split('T')[0],
    TO_DATE   : new Date().toISOString().split('T')[0],
    ALL_TIME  : "1",
    FROM_TIME : "0000",
    TO_TIME   : "2350",
    SEL_DAY   : "11111111",
    Insert: true,
  };

  sumarray.push(newsubCategory0);
  sumarray.push(newsubCategory1);
  sumarray.push(newsubCategory2);
  sumarray.push(newsubCategory3);
  sumarray.push(newsubCategory4);
  getMultiLang.value.push(newsubCategory0);
  getMultiLang.value.push(newsubCategory1);
  getMultiLang.value.push(newsubCategory2);
  getMultiLang.value.push(newsubCategory3);
  getMultiLang.value.push(newsubCategory4);

  subMultiLang.value.push(sumarray);

  // console.log(getMultiLang.value)
  // console.log(subMultiLang.value)

  //bringCategory(currentMajorCode.value);
};
const changeSubName = (categorycode, event) => {
  let inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3" && item.LanguageID == "0") {
        item.LanguageName = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });
  
};

const changeExtraNm = (categorycode, event) => {
  const inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        item.EXTRA_NM = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });

};

const changeSubName1 = (categorycode, event) => {
  let inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3" && item.LanguageID == "1") {
        item.LanguageName = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });

};
const changeSubName2 = (categorycode, event) => {
  let inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3" && item.LanguageID == "2") {
        item.LanguageName = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });

};
const changeSubName3 = (categorycode, event) => {
  const inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3" && item.LanguageID == "3") {
        item.LanguageName = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });

};

const changeUseYn = (categorycode, event) => {
  const inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        item.USE_YN = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });

};

const changeAllDate = (categorycode, checked) => {
  const inputdata = checked ? "1" : "0";

  subMultiLang.value.forEach(inner => {
    inner.forEach((item, idx) => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        // Vue 3 (reactive)인 경우 — 단순 대입으로 반응성 보장
        item.ALL_DATE = inputdata;
      }
    });
  });
};

const changeFromDate = (categorycode, event) => {
  const inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        item.FROM_DATE = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });

};

const changeToDate = (categorycode, event) => {
  const inputdata = event.target.value;
  
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        item.TO_DATE = inputdata; // 같은 객체 참조라면 어디서든 바로 반영됨
      }
    });
  });

};

const changeAllTime = (categorycode, checked) => {
  const inputdata = checked ? "1" : "0";

  subMultiLang.value.forEach(inner => {
    inner.forEach((item, idx) => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        // Vue 3 (reactive)인 경우 — 단순 대입으로 반응성 보장
        item.ALL_TIME = inputdata;
      }
    });
  });
};

const changeFromTime = (categorycode, type, value) => {
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        // 기존값 없으면 기본 "0000" 세팅
        let hour = item.FROM_TIME ? item.FROM_TIME.substring(0, 2) : "00";
        let minute = item.FROM_TIME ? item.FROM_TIME.substring(2, 4) : "00";

        if (type === "hour") {
          hour = value.toString().padStart(2, "0");
        } else if (type === "minute") {
          minute = value.toString().padStart(2, "0");
        }

        // 항상 4자리 "HHmm" 형태로 저장
        item.FROM_TIME = `${hour}${minute}`;

      }
    });
  });
};

const changeToTime = (categorycode, type, value) => {
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        // 기존값 없으면 기본 "0000" 세팅
        let hour = item.TO_TIME ? item.TO_TIME.substring(0, 2) : "00";
        let minute = item.TO_TIME ? item.TO_TIME.substring(2, 4) : "00";

        if (type === "hour") {
          hour = value.toString().padStart(2, "0");
        } else if (type === "minute") {
          minute = value.toString().padStart(2, "0");
        }

        // 항상 4자리 "HHmm" 형태로 저장
        item.TO_TIME = `${hour}${minute}`;

      }
    });
  });
};

const changeDay = (categorycode, dayIndex, checked) => {
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        let flag = item.SEL_DAY || "11111111"; // 기본값
        let arr  = flag.split("");
        arr[dayIndex] = checked ? "1" : "0";
        item.SEL_DAY = arr.join("");
      }
    });
  });
};

// 전체 체크/해제 처리 함수
const toggleAllDays = (categorycode, checked) => {
  subMultiLang.value.forEach(inner => {
    inner.forEach(item => {
      if (item.categoryCode === categorycode && item.TypeCode === "3") {
        item.SEL_DAY = checked ? "11111111" : "00000000";
      }
    });
  });
};

const changeSubName4 = (categorycode, event) => {
  let inputdata = event.target.value;
  const changegetMulilang = () => {
    getMultiLang.value.map((item) => {
      if (
        item.categoryCode == categorycode &&
        item.TypeCode == "3" &&
        item.LanguageID == "4"
      ) {
        item.LanguageName = inputdata;
      }
    });
  };
  changegetMulilang();
};

const updateCategoryNumbers = () => {
  // 대카테고리 새 코드 재정렬
  Category.value.forEach((c, index) => {
    c.oldMajorCode = c.MajorCode; // 기존 코드 백업
    c.newMajorCode = index + 1;   // 새 코드 부여
    c.OrderNo = index + 1;
  });

  let subCodeCounter = 1; // 전체 SubCode용 카운터

  // 중카테고리 새 코드 재정렬
  Category.value.forEach((c) => {
    if (c.SubCategory && c.SubCategory.length > 0) {
      c.SubCategory.forEach((sub, subIndex) => {
        sub.oldSubCode = sub.SubCode;       // 기존 코드 백업
        sub.newSubCode = subCodeCounter++;  // 전체에서 유일하게 증가
        sub.oldMajorCode = c.oldMajorCode;  // 기존 부모 코드 백업
        sub.newMajorCode = c.newMajorCode;  // 새 부모 코드 연결
        sub.OrderNo = subIndex + 1;
      });
    }
  });

  // console.log("대카테고리", Category.value);
  
};

/**
 *  저장 버튼 함수 - 팝업 
 */

const saveButtonPopup = async () => {

  // if (ulength == 0) {
  //   Swal.fire({
  //     title: "경고",
  //     text: "변경된 사항이 없습니다.",
  //     icon: "warning",
  //     confirmButtonText: "확인",
  //   });
  //   return;
  // }

  await Swal.fire({
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

        // 대카테고리 매핑 (기존 → 새)
        const largeCate = Category.value.map((c) => ({
          oldMajorCode: c.oldMajorCode,
          newMajorCode: c.newMajorCode
        }));

        // 통합 배열
        const mapping = [...largeCate];

        // 최종 API 호출
        const oldMajorCodes = mapping.map((item) => item.oldMajorCode);
        const newMajorCodes = mapping.map((item) => item.newMajorCode);

        const res = await saveMajorCategory(
          store.state.userData.lngStoreGroup,
          nowStoreCd.value,
          oldMajorCodes.join(","),
          newMajorCodes.join(",")
        );

        // console.log(res);

        // 중카테고리 매핑 (기존 → 새, 부모 연결 포함)
        const middleCate = Category.value.flatMap((c) =>
          c.SubCategory.map((sub) => ({
            oldSubCode: sub.oldSubCode,
            newSubCode: sub.newSubCode,
            oldMajorCode: sub.oldMajorCode,
            newMajorCode: sub.newMajorCode
          }))
        );

        // 통합 배열
        const mapping2 = [...middleCate];

        // 최종 API 호출
        const newMajorCodes2  = mapping2.map((item) => item.newMajorCode);
        const oldSubCodes     = mapping2.map((item) => item.oldSubCode);
        const newSubCodes     = mapping2.map((item) => item.newSubCode);

        // console.log(newMajorCodes2, oldSubCodes, newSubCodes)

        const res2 = await saveSubCategory(
          store.state.userData.lngStoreGroup,
          nowStoreCd.value,
          newMajorCodes2.join(","),
          oldSubCodes.join(","),
          newSubCodes.join(",")
        );

        // console.log(res2);

        // 이제 res2를 사용하여 상태 확인 가능
        if (res.status === 200 && res2.status === 200) {
          Swal.fire({
            title: "저장 성공",
            text: "저장되었습니다.",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
          });
        }

        store.state.loading = false;
      } catch (error) {
        Swal.fire({
          title: "저장이 실패되었습니다.",
          confirmButtonText: "확인",
        });
      } finally {
        testOrderManage();
        searchButton();
      }
    }
  });
};

</script>

<style scoped>
/* MST57_001INS 페이지 전용 스타일 - 전역 CSS와 충돌 방지 */

/* 데이터 영역 - 스크롤 가능 */
.mst57-data-area {
  height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 20px;
}

/* 메인 레이아웃 */
.inline-block.md\:flex {
  display: flex;
  gap: 20px;
  margin-top: 0;
}

/* 왼쪽 카테고리 목록 래퍼 */
.mst57-category-list-wrapper {
  width: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

/* 왼쪽 카테고리 목록 */
.mst57-category-list {
  width: 100%;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 4px;
  padding: 10px 0;
  max-height: calc(100vh - 350px);
  overflow-y: auto;
  flex: 1;
}

.mst57-category-item {
  margin-bottom: 4px;
}

.mst57-category-main-btn,
.mst57-category-sub-btn {
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  font-size: 14px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: #333;
}

.mst57-category-main-btn {
  font-weight: 600;
}

.mst57-category-sub-btn {
  font-weight: 400;
  padding-left: 40px;
  font-size: 13px;
}

.mst57-category-main-btn:hover,
.mst57-category-sub-btn:hover {
  background: #f5f5f5;
}

.mst57-category-active {
  background: #C10000 !important;
  color: #fff !important;
}

.mst57-category-active:hover {
  background: #a00000 !important;
}

.mst57-subcategory-item {
  margin-top: 2px;
}

/* 대카테고리 폼 */
.mst57-main-category-form {
  flex: 1;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 20px;
  margin-top: 0;
  position: relative;
}

.mst57-form-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
}

.mst57-delete-main-btn {
  background: #666;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mst57-delete-main-btn:hover {
  background: #555;
}

/* 폼 그리드 */
.mst57-form-grid {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 0;
  border: 1px solid #e5e5e5;
}

.mst57-form-label {
  background: #f5f5f5;
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid #e5e5e5;
  border-right: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.mst57-form-label:last-child {
  border-bottom: none;
}

.mst57-label-required {
  color: #5782ff;
  font-weight: 700;
}

.mst57-form-field {
  background: #fff;
  padding: 8px 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
}

.mst57-form-field:last-child {
  border-bottom: none;
}

.mst57-input {
  width: 100%;
  max-width: 400px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 14px;
}

.mst57-input:focus {
  outline: none;
  border-color: #5782ff;
}

/* 왼쪽 액션 버튼들 */
.mst57-action-buttons-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  width: 100%;
}

.mst57-action-buttons-left .mst57-add-category-btn,
.mst57-action-buttons-left .mst57-order-btn {
  width: 100%;
  justify-content: center;
}

/* 오른쪽 액션 버튼들 (사용 안 함) */
.mst57-action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  margin-left: 0;
}

.mst57-add-category-btn {
  background: #C10000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mst57-add-category-btn:hover {
  background: #a00000;
}

.mst57-order-btn {
  background: #666;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mst57-order-btn:hover {
  background: #555;
}

/* 중카테고리 추가 버튼 */
.mst57-subcategory-add-btn-wrapper {
  margin-top: 10px;
  margin-left: 0;
}

.mst57-add-subcategory-btn {
  background: #C10000;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mst57-add-subcategory-btn:hover {
  background: #a00000;
}

/* 중카테고리 폼 */
.mst57-sub-category-form {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin-top: 20px;
  position: relative;
  width: 100%;
}

.mst57-sub-form-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
  margin-top: 0;
}

.mst57-delete-sub-btn {
  background: #666;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.mst57-delete-sub-btn:hover {
  background: #555;
}

.mst57-sub-form-grid {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 0;
  border: 1px solid #e5e5e5;
}

/* 라디오 버튼 그룹 */
.mst57-radio-group {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
}

.mst57-radio-group label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
}

.mst57-radio-group input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 날짜/시간 필드 */
.mst57-date-time-field {
  flex-direction: column;
  align-items: flex-start;
  padding: 12px 16px;
  gap: 8px;
}

.mst57-date-time-field > div {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mst57-date-time-field label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  cursor: pointer;
}

.mst57-date-time-field input[type="date"],
.mst57-date-time-field input[type="checkbox"] {
  cursor: pointer;
}

.mst57-date-time-field select {
  height: 28px;
  padding: 0 8px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 13px;
}

/* 저장 버튼 */
.mst57-save-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  margin-right: 0;
}

.mst57-save-btn {
  padding: 10px 30px;
  font-size: 14px;
}

/* 반응형 조정 */
@media (max-width: 1440px) {
  .mst57-category-list {
    width: 200px;
  }
  
  .mst57-action-buttons,
  .mst57-subcategory-add-btn-wrapper {
    margin-left: 220px;
  }
}

@media (max-width: 1024px) {
  .inline-block.md\:flex {
    flex-direction: column;
  }
  
  .mst57-category-list {
    width: 100%;
    max-height: 300px;
  }
  
  .mst57-action-buttons,
  .mst57-subcategory-add-btn-wrapper {
    margin-left: 0;
  }
}
</style>