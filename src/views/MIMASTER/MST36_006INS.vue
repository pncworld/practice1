/*--############################################################################
# Filename : MST36_006INS.vue                                                  
# Description : 마스터관리 > 매장 마스터 > 결제코드 그룹등록                    
    # Date :2025-05-14                                                         
    # Author : 권맑음                     
################################################################################*/
<template>
  <div class="mst3606-page box-border flex h-full max-w-full min-h-0 flex-col gap-2 overflow-hidden pb-1">
    <!-- 상단: 페이지명 + 액션 -->
    <div class="flex shrink-0 flex-wrap items-center justify-between gap-2">
      <PageName />
      <div class="flex flex-wrap items-center justify-end gap-2">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="saveButton" class="button save md:w-auto w-auto">
          저장
        </button>
      </div>
    </div>

    <!-- 조회 AREA -->
    <div class="mst3606-search-panel z-10 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="mst3606-search-grid min-w-0">
        <div class="mst3606-cell">
          <div class="mst3606-sg-label">매장명</div>
          <div class="mst3606-cell-field mst3606-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              main-name=""
              :compact-store-combo-max-rem="15.6"
              @update:storeAreaCd="handleStoreAreaCd"
              @update:storeGroup="handleStoreGroup"
              @update:storeCd="handleStoreCd"
              @storeNm="handlestoreNm"
              @GroupNm="handleGroupNm"
              @update:ischanged="handleinitAll"
              :hidesub="hidesub"
              :hideAttr="hidesub" />
          </div>
        </div>
      </div>
    </div>

    <!-- 탭 -->
    <div class="mst3606-content-tabs flex shrink-0 flex-wrap gap-1">
      <button
        type="button"
        class="mst3606-tab"
        :class="{ 'mst3606-tab--on': currentMenu == 1 }"
        @click="showMenus(1)">
        할인그룹 설정
      </button>
      <button
        type="button"
        class="mst3606-tab"
        :class="{ 'mst3606-tab--on': currentMenu == 2 }"
        @click="showMenus(2)">
        할인그룹 메뉴설정
      </button>
    </div>

    <!-- 본문 -->
    <div class="mst3606-workspace min-h-0 min-w-0 flex-1">
      <!-- 탭1: 할인그룹 설정 -->
      <div
        v-show="currentMenu == 1"
        class="mst3606-pane mst3606-pane--split">
        <div class="mst3606-left flex min-h-0 min-w-0 flex-col">
          <div class="mst3606-section-head shrink-0">
            <div class="mst3606-section-title">할인그룹 정보</div>
            <div class="flex gap-2">
              <button
                type="button"
                class="mst3606-action-btn mst3606-action-btn--add"
                :disabled="!(afterSearch == true)"
                @click="addRow">
                <font-awesome-icon :icon="['fas', 'plus']" />
                추가
              </button>
              <button
                type="button"
                class="mst3606-action-btn mst3606-action-btn--del"
                @click="deleteRow"
                :disabled="!(afterClick == true && afterSearch == true)">
                <font-awesome-icon :icon="['fas', 'trash']" />
                삭제
              </button>
            </div>
          </div>
          <div class="mst3606-grid-wrap min-h-0 min-w-0 flex-1">
            <Realgrid
              class="h-full w-full"
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
              :rowStateeditable="rowStateeditable" />
          </div>
        </div>

        <div class="mst3606-right flex min-h-0 min-w-0 flex-col">
          <div class="mst3606-section-title shrink-0">상세정보</div>
          <div class="mst3606-form-grid mt-2 w-full">
            <div class="mst3606-form-label">할인그룹코드</div>
            <div class="mst3606-form-value">
              <input
                type="text"
                name="lngGroupCd"
                class="mst3606-control mst3606-control--wide"
                v-model="discountGrpCd"
                @input="changeValues"
                :disabled="tempDisabled || currentRowState != 'created'" />
            </div>
            <div class="mst3606-form-label">할인그룹명</div>
            <div class="mst3606-form-value">
              <input
                type="text"
                name="lngGroupNm"
                class="mst3606-control mst3606-control--wide"
                v-model="discountGrpNm"
                :disabled="tempDisabled2"
                @input="changeValues" />
            </div>
            <div class="mst3606-form-label">할인값</div>
            <div class="mst3606-form-value">
              <input
                type="text"
                name="discountValue"
                class="mst3606-control mst3606-control--wide"
                v-model="discountValue"
                :disabled="currentRowState != 'created'"
                @input="changeValues" />
            </div>
          </div>
        </div>
      </div>

      <!-- 탭2: 할인그룹 메뉴설정 -->
      <div
        v-show="currentMenu == 2"
        class="mst3606-pane mst3606-pane--grid">
        <div class="mst3606-section-head shrink-0">
          <div class="mst3606-section-title">메뉴 목록</div>
        </div>
        <div class="mst3606-filter-bar shrink-0">
          <div class="mst3606-list-filter">
            <div class="mst3606-filter-row">
              <div class="mst3606-filter-label">메뉴분류</div>
              <select
                class="mst3606-filter-control mst3606-filter-control--md"
                @change="setSubCd"
                v-model="forsearchMain">
                <option value="-1">전체</option>
                <option :value="i.mainCode" v-for="i in MenuGroup" :key="'m' + i.mainCode">
                  {{ i.mainName }}
                </option>
              </select>
              <select
                class="mst3606-filter-control mst3606-filter-control--md"
                v-model="forsearchSub">
                <option value="-1">전체</option>
                <option :value="i.subCode" v-for="i in filteredSubMenuGroup" :key="'s' + i.subCode">
                  {{ i.subName }}
                </option>
              </select>
            </div>
            <div class="mst3606-filter-row">
              <div class="mst3606-filter-label">메뉴명/코드</div>
              <input
                type="text"
                class="mst3606-filter-control mst3606-filter-control--grow"
                @input="searchMenuList"
                v-model="searchword1" />
            </div>
          </div>
          <label class="mst3606-check-label mst3606-check-label--grid-end">
            <input type="checkbox" v-model="ischecked" />
            미설정 메뉴보기
          </label>
        </div>
        <div class="mst3606-grid-wrap mst3606-grid-wrap--tab2 min-h-0 min-w-0 flex-1">
          <Realgrid
            class="h-full w-full"
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
            :searchValue="menuSearchValue"
            @updatedRowData="updatedRowData2"
            :mergeColumns2="true"
            :mergeColumnGroupName2="['메뉴정보']"
            :mergeColumnGroupSubList2="[
              ['mainName', 'subName', 'lngCode', 'strName', 'lngPrice'],
            ]"
            @realgridname="realgridname3" />
        </div>
      </div>
    </div>
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

import { onMounted, ref, watch, nextTick, computed } from "vue";

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
const confirmitem2 = ref([]);
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

const currentMenu = ref(1);

const searchSpecialColId = ref(["lngDiscount"]);
const searchSpecialCond = ref(true); // 초기값: 필터 비활성화 (모든 메뉴 표시)
const searchSpecialCond2 = ref("(value = 0)");
const menuSearchValue = computed(() => [forsearchMain.value, forsearchSub.value]);
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

const resizeGridById = (gridId) => {
  if (!gridId) return;
  const el = document.getElementById(gridId);
  if (!el) return;
  const grid = RealGrid.getGridInstance(el);
  if (!grid) return;
  grid.resetSize();
  grid.refresh(true);
};

watch(currentMenu, async () => {
  await nextTick();
  setTimeout(() => {
    if (currentMenu.value == 1) {
      resizeGridById(realgrid3Name.value);
    } else if (currentMenu.value == 2) {
      resizeGridById(realgrid4Name.value);
    }
  }, 50);
  setTimeout(() => {
    if (currentMenu.value == 1) {
      resizeGridById(realgrid3Name.value);
    } else if (currentMenu.value == 2) {
      resizeGridById(realgrid4Name.value);
    }
  }, 200);
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
 * pickStore - 매장그룹 세팅
 */
const handleStoreGroup = (newValue) => {
  if (newValue !== undefined && newValue !== null && newValue !== "") {
    groupCd.value = newValue;
  }
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
 * 탭2(할인그룹 메뉴설정) 응답 → 동적 체크박스 컬럼 + 행 데이터
 */
const applyDiscountMenuList = (resData) => {
  SettingList.value = [...(resData?.discountSetting ?? [])];
  MenuGroup.value = Array.isArray(resData?.MAINGROUP) ? resData.MAINGROUP : [];
  SubMenuGroup.value = Array.isArray(resData?.SUBGROUP) ? resData.SUBGROUP : [];
  filteredSubMenuGroup.value = [];

  printNameList.value = resData?.discountGroup ?? [];
  const dgList = printNameList.value ?? [];

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
  if (Array.isArray(SettingList.value) && Array.isArray(dgList) && dgList.length > 0) {
    for (let r = 0; r < SettingList.value.length; r++) {
      const mask = Number(SettingList.value[r]?.lngDiscount ?? 0);
      for (let i = 0; i < dgList.length; i++) {
        const bit = Number(dgList[i]?.lngValue ?? 0);
        const key = `checkbox${i + 1}`;
        SettingList.value[r][key] = bit > 0 ? (mask & bit) !== 0 : false;
      }
    }
  } else if (Array.isArray(SettingList.value) && discountGroupColumns.value.length > 0) {
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
  confirmitem2.value = JSON.parse(JSON.stringify(SettingList.value));
  afterSearch2.value = true;
};

/**
 *  조회 함수 — 탭과 무관하게 할인그룹(탭1) + 메뉴설정(탭2) 동시 조회
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
    const [resGroup, resMenu] = await Promise.all([
      getDiscountGroup(groupCd.value, 0),
      getDiscountMenuList(groupCd.value, 0, store.state.userData.lngCommonMenu),
    ]);

    rowData.value = resGroup.data?.discountGroup ?? [];
    updatedList.value = [...rowData.value];
    confirmitem.value = JSON.parse(JSON.stringify(rowData.value));
    afterSearch.value = true;

    applyDiscountMenuList(resMenu.data);

    await nextTick();
    reload.value = !reload.value;
    setTimeout(() => {
      resizeGridById(realgrid3Name.value);
      resizeGridById(realgrid4Name.value);
    }, 50);
    setTimeout(() => {
      resizeGridById(realgrid3Name.value);
      resizeGridById(realgrid4Name.value);
    }, 200);
  } catch (error) {
    //comsole.log(error)
    afterSearch.value = false;
    afterSearch2.value = false;
  } finally {
    ischecked.value = false;
    forsearchMain.value = "-1";
    forsearchSub.value = "-1";
    store.state.loading = false;
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
          // 할인그룹 목록 (각 그룹의 lngValue가 비트값)
          const discountGroupList = printNameList.value ?? [];

          // 체크박스 truthy 판정 (true / 1 / "1" / "true" 모두 허용)
          const isChecked = (v) =>
            v === true ||
            v === 1 ||
            v === "1" ||
            String(v).toLowerCase() === "true";

          // 변경된 메뉴 행만 추출하여 lngDiscount(비트마스크) 재계산
          const originMap = new Map(
            (originRowData3.value ?? []).map((row) => [row.lngCode, row])
          );

          const menuDiscountList = [];
          for (let j = 0; j < updatedList2.value.length; j++) {
            const menuRow = updatedList2.value[j];
            let lngDiscount = 0;

            // 체크된 체크박스에 해당하는 할인그룹의 lngValue를 합산
            for (let i = 0; i < discountGroupList.length; i++) {
              const checkboxKey = `checkbox${i + 1}`;
              if (isChecked(menuRow[checkboxKey])) {
                const bitValue = Number(discountGroupList[i]?.lngValue ?? 0);
                if (bitValue > 0) {
                  lngDiscount += bitValue;
                }
              }
            }

            // 변경된 행만 저장 대상에 포함
            const origin = originMap.get(menuRow.lngCode);
            const originDiscount = Number(origin?.lngDiscount ?? 0);
            if (origin === undefined || originDiscount !== lngDiscount) {
              menuDiscountList.push({
                lngCode: menuRow.lngCode,
                lngDiscount,
              });
            }
          }

          if (menuDiscountList.length === 0) {
            Swal.fire({
              title: "경고",
              text: "변경된 사항이 없습니다.",
              icon: "warning",
              confirmButtonText: "확인",
            });
            store.state.loading = false;
            return;
          }

          const menuCodes = menuDiscountList.map((item) => item.lngCode);
          const discountValues = menuDiscountList.map(
            (item) => item.lngDiscount
          );

          res = await saveDiscountMenuSetting(
            groupCd.value,
            0,
            menuCodes.join(","),
            discountValues.join(",")
          );
        }

        store.state.loading = false;
        changeValue.value = null;

        await Swal.fire({
          title: "저장 되었습니다.",
          confirmButtonText: "확인",
        });

        searchButton();
        reload.value = !reload.value;
      } catch (error) {
        store.state.loading = false;
        // console.error("[MST36_006INS] saveButton error", error);
        Swal.fire({
          title: "오류",
          text: "저장 중 오류가 발생했습니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
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
  rowData.value = [];
  rowData3.value = [];
  SettingList.value = [];
  updatedList.value = [];
  updatedList2.value = [];
  confirmitem.value = [];
  confirmitem2.value = [];
  printNameList.value = [];
  forsearchMain.value = "-1";
  forsearchSub.value = "-1";
  searchword1.value = "";
  afterSearch.value = false;
  afterSearch2.value = false;
};
</script>

<style scoped>
.mst3606-page {
  position: relative;
  z-index: 1;
  min-height: 0;
}

.mst3606-search-panel {
  --mst3606-panel-pad-x: 2rem;
  --mst3606-item-gap: 0.75rem;
  --mst3606-label-col: 6.5rem;
  --mst3606-row-min-h: 2rem;
  --mst3606-control-h: 2rem;
  --mst3606-control-border: #cbd5e1;
  --mst3606-control-radius: 0.375rem;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 0;
  padding-block: 0.75rem;
}

.mst3606-search-grid {
  display: grid;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  align-items: center;
  grid-template-columns: minmax(0, 1fr);
  max-width: 58rem;
  padding-left: var(--mst3606-panel-pad-x);
  padding-right: var(--mst3606-panel-pad-x);
}

.mst3606-cell {
  display: flex;
  min-width: 0;
  min-height: var(--mst3606-row-min-h);
  align-items: center;
  gap: var(--mst3606-item-gap);
}

.mst3606-sg-label {
  flex: 0 0 var(--mst3606-label-col);
  width: var(--mst3606-label-col);
  min-height: var(--mst3606-row-min-h);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

.mst3606-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst3606-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  gap: 0.5rem !important;
}

.mst3606-pick-slot :deep(> .flex > div.shrink-0.font-semibold) {
  display: none !important;
}

.mst3606-pick-slot :deep(#storeGroup) {
  width: 11.5rem !important;
  min-width: 11.5rem !important;
  max-width: 11.5rem !important;
}

.mst3606-pick-slot :deep(> .flex > div:has(> select:not(#storeGroup)) > select),
.mst3606-pick-slot :deep(> .flex > div > select:not(#storeGroup)) {
  width: 11.5rem !important;
  min-width: 11.5rem !important;
  max-width: 11.5rem !important;
}

.mst3606-pick-slot :deep(> .flex > div:has(.pickstore-vs-shell)),
.mst3606-pick-slot :deep(> .flex > div.relative.min-w-0.flex-1) {
  flex: 0 0 15.6rem !important;
  width: 15.6rem !important;
  max-width: 15.6rem !important;
}

.mst3606-pick-slot :deep(select),
.mst3606-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--mst3606-control-h) !important;
  min-height: var(--mst3606-control-h) !important;
  max-height: var(--mst3606-control-h) !important;
  border: 1px solid var(--mst3606-control-border) !important;
  border-radius: var(--mst3606-control-radius) !important;
}

.mst3606-pick-slot :deep(.pickstore-vs-shell) {
  width: 100% !important;
  max-width: 100% !important;
}

.mst3606-content-tabs {
  border-bottom: 1px solid #d1d5db;
}

.mst3606-tab {
  height: 2.5rem;
  padding: 0 0.875rem;
  border: 1px solid #d1d5db;
  border-bottom: none;
  border-radius: 0.5rem 0.5rem 0 0;
  background: #f3f4f6;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
}

.mst3606-tab--on {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #93c5fd;
}

.mst3606-workspace {
  position: relative;
  min-height: 0;
  flex: 1 1 0%;
  overflow: hidden;
}

.mst3606-pane {
  position: absolute;
  inset: 0;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.mst3606-pane--split {
  display: grid;
  height: 100%;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 1rem;
}

@media (min-width: 1024px) {
  .mst3606-pane--split {
    grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
  }
}

.mst3606-pane--grid {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mst3606-left,
.mst3606-right {
  min-height: 0;
  height: 100%;
}

.mst3606-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.375rem;
  min-height: 1.75rem;
}

.mst3606-section-title {
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.4rem;
  color: #111827;
}

.mst3606-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  height: 2rem;
  min-width: 4.25rem;
  padding: 0 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  border: 1px solid #6b7280;
  border-radius: 0.375rem;
  color: #374151;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 1px 2px rgb(15 23 42 / 10%);
}

.mst3606-action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.mst3606-action-btn--add:hover:not(:disabled) {
  background: #eff6ff;
  border-color: #60a5fa;
  color: #1d4ed8;
}

.mst3606-action-btn--del:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

.mst3606-check-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.25;
  color: #374151;
  white-space: nowrap;
  cursor: pointer;
}

.mst3606-check-label input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  min-width: 1.25rem;
  min-height: 1.25rem;
  margin: 0;
  cursor: pointer;
  accent-color: #2563eb;
}

.mst3606-filter-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  width: 100%;
  margin-bottom: 0.375rem;
}

.mst3606-check-label--grid-end {
  flex: 0 0 auto;
  margin-left: auto;
  padding-bottom: 0.125rem;
}

.mst3606-list-filter {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
  max-width: 42rem;
  flex: 1 1 auto;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: #f3f4f6;
}

.mst3606-grid-wrap--tab2 {
  margin-top: 0;
}

.mst3606-filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  min-height: 2rem;
}

.mst3606-filter-label {
  flex: 0 0 auto;
  min-width: 5.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

.mst3606-filter-control {
  box-sizing: border-box;
  height: 2rem;
  min-height: 2rem;
  max-height: 2rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  background: #fff;
  padding: 0 0.5rem;
  font-size: 0.875rem;
}

.mst3606-filter-control--md {
  width: 11rem;
  min-width: 0;
  flex: 1 1 10rem;
  max-width: 14rem;
}

.mst3606-filter-control--grow {
  flex: 1 1 12rem;
  min-width: 0;
  width: auto;
}

.mst3606-grid-wrap {
  flex: 1 1 0;
  min-height: 9rem;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.mst3606-form-grid {
  --mst3606-label-col: 7.5rem;
  --mst3606-control-h: 1.75rem;
  --mst3606-detail-row-h: 2.25rem;
  --mst3606-detail-cell-py: 0.25rem;
  --mst3606-detail-font: 0.8125rem;
  display: grid;
  grid-template-columns: var(--mst3606-label-col) minmax(0, 1fr);
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #fff;
  max-width: 36.4rem;
}

.mst3606-form-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--mst3606-detail-row-h);
  padding: var(--mst3606-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #edf2f7;
  color: #5c5c5c;
  font-size: var(--mst3606-detail-font);
  font-weight: 600;
  text-align: center;
  word-break: keep-all;
}

.mst3606-form-value {
  display: flex;
  align-items: center;
  min-height: var(--mst3606-detail-row-h);
  min-width: 0;
  padding: var(--mst3606-detail-cell-py) 0.375rem;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.mst3606-control {
  box-sizing: border-box;
  height: var(--mst3606-control-h);
  min-height: var(--mst3606-control-h);
  max-height: var(--mst3606-control-h);
  width: 100%;
  max-width: 100%;
  min-width: 0;
  border-radius: 0.375rem;
  border: 1px solid #cbd5e1;
  background: #fff;
  padding: 0 0.5rem;
  font-size: var(--mst3606-detail-font);
  line-height: 1;
}

.mst3606-control--wide {
  width: 100%;
  max-width: 100%;
}

.mst3606-control:disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

@media (min-width: 1280px) {
  .mst3606-search-panel {
    --mst3606-panel-pad-x: 2.5rem;
  }
}

@media (min-width: 1536px) {
  .mst3606-search-panel {
    --mst3606-panel-pad-x: 3rem;
  }
}
</style>