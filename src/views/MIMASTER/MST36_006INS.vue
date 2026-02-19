/*--############################################################################
# Filename : MST36_006INS.vue                                                  
# Description : 마스터관리 > 매장 마스터 > 결제코드 그룹등록                    
    # Date :2025-05-14                                                         
    # Author : 권맑음                     
################################################################################*/
<template>
  <!-- 조회 조건 -->
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
  <div class="mt-5 flex justify-start ml-10">
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 1 }"
      @click="showMenus(1)">
      할인그룹 설정
    </button>
    <button
      class="contents_tab-button"
      :class="{ 'text-blue-600': currentMenu == 2 }"
      @click="showMenus(2)">
      할인그룹 메뉴설정
    </button>
  </div>
  <div class="flex h-[55vh] w-full mt-5">
    <div class="flex flex-col w-3/5 h-4/6">
      <div
        class="flex justify-between mt-0 ml-10 border-b border-b-gray-300"
        :class="currentMenu == 1 ? 'w-full' : 'w-[54%]'">
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == 1">
          할인그룹 정보
        </div>
        <div
          class="flex justify-start rounded-tl-lg text-xl -mt-1 font-bold"
          v-if="currentMenu == 2">
          메뉴 목록
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
      </div>
      <div class="h-4/6" v-show="currentMenu == 1">
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="w-full h-[230%]"
            :progname="'MST36_006INS_VUE'"
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

      <div class="h-4/6 w-[80vw]" v-show="currentMenu == 2">
        <div
          class="mt-3 ml-10 grid grid-cols-[1fr,3fr] grid-rows-2 gap-0 w-[35%]">
          <div class="customtableIndex border border-gray-400 rounded-tl-lg">
            메뉴분류
          </div>
          <div
            class="px-2 py-1 border border-gray-400 rounded-tr-lg flex space-x-2">
            <select
              name=""
              id=""
              class="flex-1 border border-gray-400 rounded-lg"
              @change="setSubCd"
              v-model="forsearchMain">
              <option value="-1">전체</option>
              <option :value="i.mainCode" v-for="i in MenuGroup">
                {{ i.mainName }}
              </option>
            </select>
            <select
              name=""
              id=""
              class="flex-1 border border-gray-400 rounded-lg"
              v-model="forsearchSub">
              <option value="-1">전체</option>
              <option :value="i.subCode" v-for="i in filteredSubMenuGroup">
                {{ i.subName }}
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
        <div class="ml-10 mt-5 w-full h-full">
          <Realgrid
            class="w-full h-[200%]"
            :progname="'MST36_006INS_VUE'"
            :progid="2"
            :reload="reload"
            :checkRenderEditable="true"
            :rowData="rowData3"
            :extraColumns="discountGroupColumns"
            :showGrid="showGrid"
            :showCheckBar="false"
            @selcetedrowData="selcetedrowData"
            :rowStateeditable="false"
            :activeSearchSpecial="true"
            :searchSpecialColId="searchSpecialColId"
            :searchSpecialCond="searchSpecialCond"
            :searchSpecialCond2="searchSpecialCond2"
            :searchWord3="searchword1"
            :searchColId="'lngCode,strName'"
            :searchColId3="['mainCode', 'subCode']"
            :searchValue="[forsearchMain, forsearchSub]"
            @updatedRowData="updatedRowData2"
            :mergeColumns2="true"
            :mergeColumnGroupName2="['메뉴정보']"
            :mergeColumnGroupSubList2="[
              ['mainName', 'subName', 'lngCode', 'strName', 'lngPrice'],
            ]"
            :setDynamicGrid3="true"
            :dynamicStoreCd="nowStoreCd"
            @realgridname="realgridname3"></Realgrid>
        </div>
        <!-- 그리드 영역 -->
      </div>
    </div>
    <div
      class="w-[52%] h-[20%] grid grid-rows-2 grid-cols-1 ml-28 -mt-2"
      v-if="currentMenu == 1">
      <div class="font-bold text-xl flex justify-start items-center">
        상세정보
      </div>
      <div class="w-full h-full flex justify-start items-center">
        <div class="grid grid-rows-3 grid-cols-[3fr,7fr] w-[93%] h-full">
          <div
            class="rounded-tl-lg border flex justify-center items-center bg-gray-100">
            할인그룹코드
          </div>
          <div class="rounded-tr-lg border h-full py-1 px-1 flex items-center">
            <input
              type="text"
              name="lngGroupCd"
              class="w-full border rounded-lg disabled:bg-gray-100 pl-1"
              v-model="discountGrpCd"
              @input="changeValues"
              :disabled="tempDisabled || currentRowState != 'created'" />
          </div>
          <div
            class="border flex justify-center items-center bg-gray-100">
            할인그룹명
          </div>
          <div class="border h-full py-1 px-1 flex items-center">
            <input
              type="text"
              name="lngGroupNm"
              class="w-full border rounded-lg pl-1 disabled:bg-gray-100"
              v-model="discountGrpNm"
              :disabled="tempDisabled2"
              @input="changeValues" />
          </div>
          <div
            class="rounded-bl-lg border flex justify-center items-center bg-gray-100">
            할인값
          </div>
          <div class="rounded-br-lg border h-full py-1 px-1 flex items-center">
            <input
              type="text"
              name="discountValue"
              class="w-full border rounded-lg pl-1 disabled:bg-gray-100"
              v-model="discountValue"
              :disabled="currentRowState != 'created'"
              @input="changeValues" />
          </div>
        </div>
      </div>
    </div>
    <!-- TAB2 공간 -->
    <label v-if="currentMenu == 2" class="mt-20 relative right-96 top-1 h-2">
      <input type="checkbox" v-model="ischecked" />
      미설정메뉴보기
    </label>
  </div>
</template>

<script setup>
import {
  getDiscountMenuList,
  getDiscountGroup,
  saveDiscountMenuSetting,
  saveDiscountGroup,
} from "@/api/master";

/*
 * 공통 표준  Function
 */

import { onMounted, ref, watch, nextTick } from "vue";

/**
 * 	Vuex 상태관리 및 로그인 세션 호출
 */

import { useStore } from "vuex";

/**
 * 	매장 조건 정보 컴포넌트 호출
 */

import PickStore from "@/components/pickStore.vue";

/**
 * 	그리드 컴포넌트 및 라이브러리 호출
 */

import Realgrid from "@/components/realgrid.vue";
import RealGrid from "realgrid";
/**
 * 	알림창 라이브러리 호출
 */

import Swal from "sweetalert2";

/**
 * 	페이지 로그 공통 함수 호출
 */

import { insertPageLog } from "@/customFunc/customFunc";

/**
 * 	페이지 명칭 공통 호출 컴포넌트
 */

import PageName from "@/components/pageName.vue";

/**
 * 	화면 Load시 실행 스크립트
 */

const store = useStore();

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const disabled = ref(true);
const tempDisabled = ref(true);
const tempDisabled2 = ref(true);
const afterClick = ref(true);
const updatedList = ref();
const updatedList2 = ref();
const forsearchMain = ref("-1");
const forsearchSub = ref("-1");
const ischecked = ref(false);
const discountGrpCd = ref();
const discountGrpNm = ref("");
const discountValue = ref();
const clickedGroupNm = ref();
const confirmitem = ref([]);
const rowData = ref([]);
const rowData3 = ref([]);
const addRows = ref(false);
const deleteRows = ref(false);
const rowStateeditable = ref(false);
const showGrid = ref(true);
const addrowDefault = ref();
const showMenus = (value) => {
  if (value == 1) {
    currentMenu.value = 1;
    hidesub.value = false;
  } else if (value == 2) {
    currentMenu.value = 2;
    hidesub.value = false;
  }
};

const currentMenu = ref("1");

const searchSpecialColId = ref(["lngDiscount"]);
const searchSpecialCond = ref(true); // 초기값: 필터 비활성화 (모든 메뉴 표시)
const searchSpecialCond2 = ref("(value = 0)");
watch(ischecked, () => {
  if (ischecked.value == true) {
    // 미설정메뉴보기 체크 시: lngDiscount === 0인 메뉴만 표시
    searchSpecialColId.value = ["lngDiscount"];
    searchSpecialCond.value = false; // 필터 활성화
  } else {
    // 미설정메뉴보기 해제 시: 모든 메뉴 표시 (필터 제거)
    searchSpecialColId.value = ["lngDiscount"]; // 컬럼은 유지하되
    searchSpecialCond.value = true; // 필터 비활성화하여 필터 제거
  }
});

const realgrid2Name = ref("");
const realgrid3Name = ref("");
const realgrid4Name = ref("");
const realgridname = (e) => {
  realgrid2Name.value = e;
};
const realgridname2 = (e) => {
  realgrid3Name.value = e;
};
const realgridname3 = (e) => {
  realgrid4Name.value = e;
};

watch(currentMenu, () => {
  if (currentMenu.value == 1) {
    setTimeout(() => {
      const reagrid2 = realgrid2Name.value
        ? document.getElementById(realgrid2Name.value)
        : null;
      if (reagrid2) {
        const grid2 = RealGrid.getGridInstance(reagrid2);
        if (grid2) {
          grid2.resetSize();
          grid2.refresh(true);
        }
      }
    }, 100);
    setTimeout(() => {
      const reagrid3 = realgrid3Name.value
        ? document.getElementById(realgrid3Name.value)
        : null;
      if (reagrid3) {
        const grid3 = RealGrid.getGridInstance(reagrid3);
        if (grid3) {
          grid3.resetSize();
          grid3.refresh(true);
        }
      }
    }, 100);
  } else if (currentMenu.value == 2) {
    if (realgrid4Name.value) {
      const reagrid4 = document.getElementById(realgrid4Name.value);
      if (reagrid4) {
        setTimeout(() => {
          const gridInstance = RealGrid.getGridInstance(reagrid4);
          if (gridInstance) {
            gridInstance.resetSize();
            gridInstance.refresh(true);
          }
        }, 100);
      }
    }
  }
});

const hidesub = ref(false);

/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  //comsole.log(newData)
};

/**
 * 페이지 그룹명 세팅
 */

const handleGroupNm = (newData) => {
  clickedGroupNm.value = newData;
};

/**
 *  pickStore - 지역코드 세팅
 */

const handleStoreAreaCd = (newValue) => {
  //comsole.log(newValue)
};

/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  nowStoreCd.value = newValue;
  //comsole.log(nowStoreCd.value)
};

/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData = (newValue) => {
  updatedList.value = newValue;
  //comsole.log(updatedList.value)
};

const forSaveMenu = ref([]);
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData2 = (newValue) => {
  updatedList2.value = newValue;
  //comsole.log(newValue)
};

const nowStoreCd = ref();
/**
 * 페이지 매장 코드 세팅
 */
const reload = ref(false);
const SettingList = ref();
const changeValue = ref("");
const MenuGroup = ref([]);
const SubMenuGroup = ref([]);
// 탭2(할인그룹 메뉴설정)에서 할인그룹명 기반으로 동적 체크박스 컬럼 생성
const discountGroupColumns = ref([]);
const changeNow = ref(false);
const changeValues = (e) => {
  if (e.target.name == "lngGroupCd") {
    changeColid.value = "lngCode";
    if (/[^\d-]/.test(e.target.value)) {
      discountGrpCd.value = e.target.value.replace(/[^\d-]/g, "");
      return;
    }
    changeValue.value = e.target.value;
    changeNow.value = !changeNow.value;
  } else if (e.target.name == "lngGroupNm") {
    changeColid.value = "strName";
    changeValue.value = e.target.value;
    changeNow.value = !changeNow.value;
  } else if (e.target.name == "discountValue") {
    changeColid.value = "lngValue";
    changeValue.value = e.target.value;
    changeNow.value = !changeNow.value;
  }
};

/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref();
const userData = store.state.userData;

const groupCd = ref(userData.lngStoreGroup);
const afterSearch = ref(false);
const afterSearch2 = ref(false);
const checked = ref();
const printNameList = ref([]);

/**
 * 선택한 행의 상세정보 셋팅
 */

const selcetedrowData = (newValue) => {
  //comsole.log(newValue)
};
const originRowData3 = ref([]);

/**
 *  조회 함수
 */
const searchButton = async () => {

  if (groupCd.value == "0" || groupCd.value == undefined) {
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

  store.state.loading = true;
  try {
    let res;
    if (currentMenu.value == 1) {
      res = await getDiscountGroup(groupCd.value, 0);
      rowData.value = res.data.discountGroup;

      afterSearch.value = true;
    } else if (currentMenu.value == 2) {
      
      res = await getDiscountMenuList(
        groupCd.value, 
        0, 
        store.state.userData.lngCommonMenu
      );

      // console.log(res);

      SettingList.value = [...res.data.discountSetting];
      MenuGroup.value = res.data.MAINGROUP;
      SubMenuGroup.value = res.data.SUBGROUP;

      // (요청대로) getDiscountMenuList 응답의 discountGroup 기준으로 컬럼 생성
      printNameList.value = res.data.discountGroup;
      const dgList = printNameList.value ?? [];

      // 할인그룹명 기반 checkbox 컬럼 정의 생성 (checkbox1..N)
      discountGroupColumns.value = dgList.map((g, idx) => {
        const headerText = g?.strName ?? g?.lngCode ?? `할인그룹${idx + 1}`;
        return {
          strColID: `checkbox${idx + 1}`,
          strHdText: String(headerText),
          intHdWidth: 90,
          strColType: "text",
          strDisplay: "checkbox",
          strAlign: "center",
          strMask: "",
          strSubSumtext: "",
        };
      });

      // lngDiscount(비트마스크) 기준으로 체크박스 값 세팅
      // - lngDiscount: 메뉴별 할인그룹 설정 비트마스크
      // - discountGroup[].lngValue: 각 할인그룹의 비트값(2^n 형태)
      if (Array.isArray(SettingList.value) && Array.isArray(dgList) && dgList.length > 0) {
        for (let r = 0; r < SettingList.value.length; r++) {
          const mask = Number(SettingList.value[r]?.lngDiscount ?? 0);
          for (let i = 0; i < dgList.length; i++) {
            const bit = Number(dgList[i]?.lngValue ?? 0);
            const key = `checkbox${i + 1}`;
            // bit 값이 0/NaN이면 체크 불가로 false 처리
            SettingList.value[r][key] = bit > 0 ? (mask & bit) !== 0 : false;
          }
        }
      } else if (Array.isArray(SettingList.value) && discountGroupColumns.value.length > 0) {
        // fallback: 필드만 존재하도록 false 초기화
        for (let r = 0; r < SettingList.value.length; r++) {
          for (let c = 0; c < discountGroupColumns.value.length; c++) {
            const key = discountGroupColumns.value[c].strColID;
            if (SettingList.value[r][key] === undefined || SettingList.value[r][key] === null) {
              SettingList.value[r][key] = false;
            }
          }
        }
      }
      
      originRowData3.value = [...SettingList.value];
      rowData3.value = [...SettingList.value];
      updatedList2.value = [...SettingList.value];
      confirmitem.value = JSON.parse(JSON.stringify(SettingList.value));
      afterSearch2.value = true;
    }
  } catch (error) {
    //comsole.log(error)
    afterSearch.value = false;
    afterSearch2.value = false;
  } finally {
    ischecked.value = false;

    forsearchMain.value = "-1";

    forsearchSub.value = "-1";

    store.state.loading = false; // 로딩 상태 종료
    discountGrpCd.value = "";
    discountGrpNm.value = "";
    discountValue.value = "";
    tempDisabled.value = true;
    tempDisabled2.value = true;
    afterClick.value = false;
  }
};
const filteredSubMenuGroup = ref([]);

const setSubCd = () => {
  forsearchSub.value = "-1";
  filteredSubMenuGroup.value = SubMenuGroup.value.filter(
    (item) => item.mainCode == forsearchMain.value
  );
  searchword1.value = "";
};

const searchMenuList = (e) => {
  searchword1.value = e.target.value;
};

/**
 *  저장 버튼 함수
 */

const saveButton = async () => {
  //comsole.log(updatedList2.value)
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
  }

  if (currentMenu.value == 1) {
    if (
      JSON.stringify(confirmitem.value) === JSON.stringify(updatedList.value)
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
      JSON.stringify(confirmitem.value) === JSON.stringify(updatedList2.value)
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
          const lngCode = updatedList.value
            .filter((item, index) => !allStateRowArr.value.deleted.includes(index))
            .map((item) => item.lngCode);
          const strName = updatedList.value
            .filter((item, index) => !allStateRowArr.value.deleted.includes(index))
            .map((item) => item.strName);
          const lngValue = updatedList.value
            .filter((item, index) => !allStateRowArr.value.deleted.includes(index))
            .map((item) => item.lngValue);
          const deleteNo = updatedList.value
            .filter((item, index) => allStateRowArr.value.deleted.includes(index))
            .map((item) => item.lngCode);

          res = await saveDiscountGroup(
            groupCd.value, 
            0,
            lngCode.join(","),
            strName.join(","),
            lngValue.join(","),
            deleteNo.join(",")
          );
          // console.log(res);
          
        } else if (currentMenu.value == 2) {
          // 할인그룹 목록 가져오기 (각 그룹의 lngValue가 비트값)
          const discountGroupList = printNameList.value ?? [];
          
          // 모든 메뉴 행에 대해 체크박스 상태를 비트 연산으로 변환하여 lngDiscount 계산
          const menuDiscountList = [];
          
          for (let j = 0; j < updatedList2.value.length; j++) {
            const menuRow = updatedList2.value[j];
            let lngDiscount = 0;
            
            // 체크된 체크박스에 해당하는 할인그룹의 lngValue를 합산
            for (let i = 0; i < discountGroupList.length; i++) {
              const checkboxKey = `checkbox${i + 1}`;
              if (menuRow[checkboxKey] === true) {
                const bitValue = Number(discountGroupList[i]?.lngValue ?? 0);
                if (bitValue > 0) {
                  lngDiscount += bitValue;
                }
              }
            }
            
            // 메뉴 코드와 계산된 lngDiscount 값 저장
            menuDiscountList.push({
              lngCode: menuRow.lngCode,
              lngDiscount: lngDiscount
            });
          }
          
          // 저장할 데이터 준비 (메뉴 코드와 lngDiscount 매핑)
          const menuCodes = menuDiscountList.map(item => item.lngCode);
          const discountValues = menuDiscountList.map(item => item.lngDiscount);
          
          // console.log("저장할 메뉴 할인그룹 설정:", menuDiscountList);
          
          //닷넷 API 호출
          res = await saveDiscountMenuSetting(
            groupCd.value,
            0,
            menuCodes.join(","),
            discountValues.join(",")
          );

          // console.log(res)

        }
      } catch (error) {

      } finally {
        store.state.loading = false;
        changeValue.value = null;
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

/**
 * 수정용 데이터 행 설정
 */

const selectedIndex = (e) => {
  changeRow.value = e;
};
const changeRow = ref();
const currentRowState = ref("none");
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData = (newValue) => {
  if (newValue == undefined) {
    return;
  }
  afterClick.value = true;
  //comsole.log(newValue);
  discountGrpCd.value = newValue[0];
  discountGrpNm.value = newValue[1];
  discountValue.value = newValue[2];
  if (newValue.index !== undefined) {
    changeRow.value = newValue.index;
  }
  //comsole.log(changeRow.value);
  tempDisabled2.value = false; // 할인그룹명만 수정 가능
};
const changeColid = ref("");

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

  addrowDefault.value = "," + groupCd.value;
  addRows.value = !addRows.value;
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
 * 수정용 데이터 행 설정
 */

const selectedIndex2 = (e) => {
  changeRow.value = e;
};

/**
 * 상태 변화된 행 세팅
 */

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
 * 전체 상태 변화된 행 세팅
 */

const allStateRowArr = ref({ updated: [], deleted: [], created: [] });
const allStateRows = (newValue) => {
  allStateRowArr.value = newValue;
  //comsole.log(newValue)
};


/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  filteredSubMenuGroup.value = [];
  discountGroupColumns.value = [];
  forsearchMain.value = "-1";
  forsearchSub.value = "-1";
  searchword1.value = "";
  afterSearch.value = false;
};
</script>

<style scoped></style>