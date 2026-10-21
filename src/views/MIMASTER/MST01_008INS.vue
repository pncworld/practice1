/*--############################################################################
# Filename : MST01_008INS.vue                                                  
# Description : 마스터관리 > 메뉴 마스터 > 대그룹코드등록                      
  # Date :2025-05-14                                                           
  # Author : 권맑음                     
################################################################################*/
<template>
  <div
    class="mst0108-page box-border flex h-full max-h-full min-h-0 flex-col overflow-hidden pl-5"
    :style="{
      '--mst0108-panel-pad-x': '7rem',
      '--mst0108-item-gap': '0.75rem',
      '--mst0108-label-col': '5.5rem',
      '--mst0108-row-min-h': '2rem',
      '--mst0108-control-h': '2rem',
      '--mst0108-control-border': '#cbd5e1',
    }">
    <!-- 상단: 페이지명 + 메인 액션 -->
    <div class="flex w-full shrink-0 items-center justify-between overflow-y-hidden">
      <PageName></PageName>
      <div class="mr-9 flex justify-center space-x-2 pr-5">
        <button type="button" @click="searchButton" class="button search md:w-auto w-14">
          조회
        </button>
        <button type="button" @click="saveButton" class="button save w-auto">
          저장
        </button>
      </div>
    </div>

    <!-- 조회 AREA -->
    <div class="mst0108-search-panel z-10 mt-3 w-full min-w-0 shrink-0 rounded-lg bg-gray-200">
      <div class="mst0108-search-grid min-w-0">
        <div class="mst0108-cell">
          <div class="mst0108-sg-label">매장명</div>
          <div class="mst0108-cell-field mst0108-pick-slot min-w-0">
            <PickStore
              compact-search-bar
              omit-main-label
              main-name=""
              @update:storeCd="handleStoreCd"
              @storeNm="handlestoreNm"
              :hidesub="hidesub"
              :hideAttr="hideAttr"
              @update:ischanged="handleinitAll"
              @update:ischanged2="searchinit"></PickStore>
          </div>
        </div>
      </div>
    </div>

    <!-- 그리드 영역 (좌: 메인 / 우: 서브) -->
    <div class="mst0108-grids mt-3 flex min-h-0 w-full flex-1 gap-4 pr-5">
      <div class="mst0108-grid-pane flex min-h-0 min-w-0 flex-1 flex-col">
        <div class="mst0108-section-head shrink-0">
          <h3 class="mst0108-section-title">메인 분류</h3>
          <div class="flex gap-2">
            <button type="button" class="pnc-sub-btn pnc-sub-btn--rose" @click="addRow">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 3v10M3 8h10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round" />
              </svg>
              추가
            </button>
            <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="deleteRow">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3.5 4.5h9M6 4.5V3.5h4v1M5.5 4.5l.5 8h4l.5-8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              삭제
            </button>
          </div>
        </div>
        <div class="mst0108-grid-host mt-2">
          <Realgrid
            class="mst0108-grid"
            :progname="'MST01_008INS_VUE'"
            :progid="1"
            :rowData="rowData"
            :showGrid="showGrid"
            :showCheckBar="false"
            :addRow="addbutton"
            @selcetedrowData="selcetedrowData"
            @allStateRows="allStateRows"
            :changeRow="changeRow"
            :deleteRow="deleterow"
            :changeColid="'lngCode'"
            :changeValue="changeValue"
            @updatedRowData="updatedRowData1"
            @clickedRowData="clickedRowData"
            :exporttoExcel="exporttoExcel"
            :ExcelNm="'메뉴 분류 관리'"
            :editableColId="'strName'"
            :commitAll="commitAll"
            :inputOnlyNumberColumn="'lngCode'">
          </Realgrid>
        </div>
      </div>

      <div class="mst0108-grid-pane flex min-h-0 min-w-0 flex-1 flex-col">
        <div class="mst0108-section-head shrink-0">
          <h3 class="mst0108-section-title">서브 분류</h3>
          <div class="flex gap-2">
            <button type="button" class="pnc-sub-btn pnc-sub-btn--rose" @click="addRow2">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M8 3v10M3 8h10"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round" />
              </svg>
              추가
            </button>
            <button type="button" class="pnc-sub-btn pnc-sub-btn--gray" @click="deleteRow2">
              <svg class="pnc-sub-btn__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path
                  d="M3.5 4.5h9M6 4.5V3.5h4v1M5.5 4.5l.5 8h4l.5-8"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              삭제
            </button>
          </div>
        </div>
        <div class="mst0108-grid-host mt-2">
          <Realgrid
            class="mst0108-grid"
            :progname="'MST01_008INS_VUE'"
            :progid="2"
            :rowData="filteredRowData2"
            :showGrid="showGrid"
            :showCheckBar="false"
            :addRow2="addbutton2"
            @allStateRows="allStateRows2"
            :addrowProp="'lngCode,lngMajor'"
            :deleteRow="deleterow2"
            :addrowDefault="addrowDefault"
            @selcetedrowData="selcetedrowData"
            :changeRow="changeRow"
            :changeColid="'strName'"
            :changeValue="changeValue2"
            :inputOnlyNumberColumn="'lngCode'"
            @updatedRowData="updatedRowData"
            @clickedRowData="clickedRowData2"
            :editableColId="'strName'"
            :exporttoExcel="exporttoExcel"
            :ExcelNm="'메뉴 분류 관리'"
            :deleteAll="deleteAll"
            :commitAll="commitAll"></Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getMenuLists, saveMenuManage } from "@/api/master";
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
 *  경고창 호출 라이브러리
 *  */

import Swal from "sweetalert2";
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

const hidesub = ref(true);
const hideAttr = ref(true);
onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);

  if (store.state.userData.lngCommonMenu == "1") {
    hidesub.value = false;
    hideAttr.value = false;
  } else {
    hidesub.value = true;
    hideAttr.value = true;
  }
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref(0);
/**
 * 선택한 포스 번호 호출 함수
 */

const posNo = ref();
const deleteAll = ref(false);
/**
 *  그리드 검색어 세팅
 */

const searchword1 = ref("");
const MenuGroup = ref("");
const SubMenuGroup = ref("");
const items = ref("");
const forsearchMain = ref("");
const forsearchSub = ref("");
const afterSearch = ref(false);
const clickedStoreNm = ref();
const addrowDefault = ref();
const commitAll = ref(false);
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const currentsubNo = ref();

/**
 * 페이지 매장 코드 세팅
 */

const handleStoreCd = async (newValue) => {
  if (newValue == "0" && store.state.userData.lngCommonMenu == "0") {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
  //searchButton();
};

/**
 * 페이지 매장명 세팅
 */

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

/**
 * 조회 상태 초기화
 */

const searchinit = (newvalue) => {
  afterSearch.value = false;
};

/**
 * 조회 초기화
 */

const handleinitAll = (newvalue) => {
  MenuGroup.value = [];
  SubMenuGroup.value = [];
  items.value = [];
  forsearchMain.value = "0";
  forsearchSub.value = "0";
  afterSearch.value = false;
  searchword1.value = "";
  afterSearch.value = false;
};
const confirmData = ref();
const confirmData2 = ref();
const rowData = ref([]);
const rowData2 = ref([]);
/**
 *  조회 함수
 */

const searchButton = async () => {
  commitAlls();
  items.value = [];
  rowData.value = [];
  rowData2.value = [];
  if (nowStoreCd.value == "0" && store.state.userData.lngCommonMenu == "0") {
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
    if (store.state.userData.lngCommonMenu == "1") {
      nowStoreCd.value = 0;
    }
    let res = await getMenuLists(groupCd.value, nowStoreCd.value);
    rowData.value = res.data.MAINMENU;
    rowData2.value = res.data.SUBMENU;

    confirmData.value = rowData.value;
    confirmData2.value = rowData2.value;
    ////console.log(res);
    //comsole.log(rowData2.value);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    forsaveRowData.value = undefined;

    store.state.loading = false; // 로딩 상태 종료
    filteredRowData2.value = "";
    afterSearch.value = true;
    clickFirst.value = false;
  }
};
const addbutton = ref(false);
/**
 * 추가 버튼 함수
 */

const addRow = () => {
  addbutton.value = !addbutton.value;
};
const addbutton2 = ref(false);
/**
 * 추가 버튼 함수
 */

const addRow2 = () => {
  if (clickFirst.value == false) {
    return;
  }
  //rowData2.value.filter((item) => item.lngMajor == selectedlngCode.value)
  if (updatedrowdata2.value.length > 0) {
    currentsubNo.value = Math.max(
      ...updatedrowdata2.value.map((item) => item.lngCode)
    );
  } else {
    currentsubNo.value = selectedlngCode.value * 100;
  }
  addbutton2.value = !addbutton2.value;
  //comsole.log(currentsubNo.value + 1);
  //comsole.log(filteredRowData2.value);
  addrowDefault.value = (currentsubNo.value + 1).toString() + ",";
  addrowDefault.value += selectedlngCode.value;
  filteredRowData2.value.push({
    lngCode: currentsubNo.value + 1,
    strName: "",
    lngMajor: selectedlngCode.value.toString(),
  });
};
const filteredRowData2 = ref([]);
const selectedlngCode = ref();
const changeRow = ref();
const changeValue = ref("0");
/**
 * 데이터셋 상세정보 셋팅
 */

const clickFirst = ref(false);
const tempMainCode = ref("");
const clickedRowData = (newValue) => {
  //console.log(newValue);
  tempMainCode.value = newValue[0];
  clickFirst.value = true;
  filteredRowData2.value = rowData2.value.filter(
    (item) => item.lngMajor == newValue[0]
  );
  updatedrowdata2.value = filteredRowData2.value;
  selectedlngCode.value = newValue[0];
  changeRow.value = newValue.index;
  //comsole.log(changeRow.value);
};
/**
 * 데이터셋 상세정보 셋팅
 */

const clickedRowData2 = (newValue) => {
  //comsole.log(newValue);
};

/**
 * 입력창 수정 데이터 갱신
 */
const allstaterows2 = ref([]);
const allStateRows2 = (e) => {
  allstaterows2.value = e;
};

const allstaterows = ref([]);
const allStateRows = (e) => {
  allstaterows.value = e;
};
const updatedrowdata2 = ref([]);
const updatedRowData = (newValue) => {
  //comsole.log(newValue);
  //comsole.log(filteredRowData2.value);
  // rowData2.value = rowData2.value.filter(
  //   (item) => Number(item.lngMajor) !== Number(selectedlngCode.value)
  // );

  // for (var i = 0; i < newValue.length; i++) {
  //   rowData2.value.push(newValue[i]);
  // }
  // console.log(newValue);
  updatedrowdata2.value = newValue;
  //comsole.log(rowData2.value);
  //comsole.log(newValue.length);
};
const forsaveRowData = ref();
/**
 * 입력창 수정 데이터 갱신
 */

const updatedRowData1 = (newValue) => {
  //comsole.log(newValue);
  const validate = newValue.map((item) => item.lngCode);
  const duplicates = validate.filter(
    (item, index) => validate.indexOf(item) !== index
  );
  //comsole.log(changeValue.value);
  if (duplicates.length > 0) {
    changeValue.value = "0";
    Swal.fire({
      title: "경고",
      text: "중복된 메인분류코드가 존재합니다.",
      icon: "warning",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        changeValue.value = "";
      }
    });
  }
  forsaveRowData.value = newValue;
  //comsole.log(forsaveRowData.value);
};
const deleterow = ref(false);
const deleterow2 = ref(false);
/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow2 = () => {
  deleterow2.value = !deleterow2.value;
};

/**
 * 그리드 행 삭제 버튼 함수
 */

const deleteRow = () => {
  deleterow.value = !deleterow.value;
  deleteAlls();
};

/**
 *  저장 버튼 함수
 */

const toPlainForLog = (v) => {
  try {
    return JSON.parse(JSON.stringify(v));
  } catch (e) {
    return { _toPlainError: String(e) };
  }
};

const fieldDebugStr = (val) => ({
  typeof: typeof val,
  raw: val,
  asString: val === undefined || val === null ? val : String(val),
  length: typeof val === "string" ? val.length : undefined,
  isEmptyString: val === "",
  isUndefined: val === undefined,
  isNull: val === null,
  trimIsEmpty: typeof val === "string" && val.trim() === "",
});

const fieldDebugCode = (val) => ({
  ...fieldDebugStr(val),
  numberParsed: Number(val),
  numberIsNaN: isNaN(Number(val)),
});

const saveValidationLogPayload = ({
  commitResult,
  invalidMainDiagnostics,
  invalidSubDiagnostics,
}) => ({
  at: new Date().toISOString(),
  screen: "MST01_008INS",
  commitAllsResult: toPlainForLog(commitResult),
  context: {
    afterSearch: afterSearch.value,
    nowStoreCd: nowStoreCd.value,
    groupCd: groupCd.value,
    selectedlngCode: selectedlngCode.value,
    mainRowCount: forsaveRowData.value?.length ?? null,
    subRowCountAll: rowData2.value?.length ?? null,
    subRowCountFiltered: Array.isArray(filteredRowData2.value)
      ? filteredRowData2.value.length
      : null,
    updatedrowdata2Count: updatedrowdata2.value?.length ?? null,
    subValidationScope:
      "updatedrowdata2 + 삭제행 제외 (saveMenuManage 서브 인자와 동일)",
    subRowsValidatedCount: (updatedrowdata2.value || []).filter(
      (_, index) => !(allstaterows2.value?.deleted ?? []).includes(index)
    ).length,
  },
  invalidMainRows: invalidMainDiagnostics,
  invalidSubRows: invalidSubDiagnostics,
});

const saveButton = () => {
  commitAlls().then((newvalue) => {
    if (afterSearch.value == false) {
      Swal.fire({
        title: "경고",
        text: "조회를 먼저 진행해주세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }
    //comsole.log(rowData2.value);
    const invalidMainRows =
      forsaveRowData.value?.filter(
        (item) =>
          item.strName == "" ||
          item.strName == undefined ||
          item.lngCode == undefined ||
          item.lngCode == "" ||
          isNaN(Number(item.lngCode))
      ) || [];
    const deletedSubIndices = allstaterows2.value?.deleted ?? [];
    const invalidSubRows =
      (updatedrowdata2.value || []).filter(
        (item, index) =>
          !deletedSubIndices.includes(index) &&
          (item.strName == "" || item.strName == undefined)
      ) || [];
    const invalidMainDiagnostics =
      forsaveRowData.value
        ?.map((item, index) => {
          const reasons = [];
          if (item.strName == "" || item.strName == undefined) {
            reasons.push("strName 누락");
          }
          if (item.lngCode == undefined || item.lngCode == "") {
            reasons.push("lngCode 누락");
          } else if (isNaN(Number(item.lngCode))) {
            reasons.push("lngCode 숫자 아님");
          }
          if (reasons.length === 0) return null;
          return {
            grid: "main(메인)",
            index,
            reasons,
            strName: fieldDebugStr(item.strName),
            lngCode: fieldDebugCode(item.lngCode),
            rowPlain: toPlainForLog(item),
          };
        })
        .filter(Boolean) || [];
    const invalidSubDiagnostics =
      (updatedrowdata2.value || [])
        .map((item, gridIndex) => {
          if (deletedSubIndices.includes(gridIndex)) return null;
          if (item.strName == "" || item.strName == undefined) {
            return {
              grid: "sub(우측 updatedrowdata2, 저장 API와 동일·삭제 제외)",
              gridIndex,
              selectedlngCode: selectedlngCode.value,
              reason: "strName 누락 (빈 문자열 또는 undefined)",
              strName: fieldDebugStr(item.strName),
              lngCode: fieldDebugCode(item.lngCode),
              lngMajor: item.lngMajor,
              rowPlain: toPlainForLog(item),
            };
          }
          return null;
        })
        .filter(Boolean) || [];
    const length = invalidMainRows.length + invalidSubRows.length;
    if (length > 0) {
      const payload = saveValidationLogPayload({
        commitResult: newvalue,
        invalidMainDiagnostics,
        invalidSubDiagnostics,
      });
      console.warn("[MST01_008INS] 저장 유효성 실패 (객체)", payload);
      console.warn(
        "[MST01_008INS] 저장 유효성 실패 (복사용 JSON)\n" +
          JSON.stringify(payload, null, 2)
      );
      Swal.fire({
        title: "경고",
        text: "입력되지 않은 칸이나 잘못된 값이 포함되어 있습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (
      allstaterows2.value.deleted.length == 0 &&
      allstaterows2.value.updated.length == 0 &&
      allstaterows2.value.created.length == 0 &&
      allstaterows.value.deleted.length == 0 &&
      allstaterows.value.updated.length == 0 &&
      allstaterows.value.created.length == 0
    ) {
      Swal.fire({
        title: "경고",
        text: "변경된 사항이 없습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
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
          //comsole.log(rowData2.value);
          let mainMenulngCode;
          let mainMenuNm;
          let deletedmainMenuCd;
          if (forsaveRowData.value == undefined) {
            mainMenulngCode = rowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.lngCode);
            mainMenuNm = rowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.strName);
          } else {
            mainMenulngCode = forsaveRowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.lngCode);
            mainMenuNm = forsaveRowData.value
              .filter((item) => item.deleted !== true)
              .map((item) => item.strName);
            deletedmainMenuCd = forsaveRowData.value
              .filter((item) => item.deleted == true)
              .map((item) => Number(item.lngCode));
          }
          //comsole.log(forsaveRowData.value);
          //comsole.log(mainMenulngCode);
          //comsole.log(mainMenuNm);

          //comsole.log(deletedmainMenuCd);
          if (deletedmainMenuCd != undefined) {
            rowData2.value = rowData2.value.filter(
              (item) => !deletedmainMenuCd.includes(Number(item.lngMajor))
            );
          }

          // console.log(updatedrowdata2.value);
          const subMenulngCode = updatedrowdata2.value
            .filter(
              (item, index) => !allstaterows2.value.deleted.includes(index)
            )
            .map((item) => item.lngCode);
          const subMenuNm = updatedrowdata2.value
            .filter(
              (item, index) => !allstaterows2.value.deleted.includes(index)
            )
            .map((item) => item.strName);
          const subMenuMajorCode = updatedrowdata2.value
            .filter(
              (item, index) => !allstaterows2.value.deleted.includes(index)
            )
            .map((item) => item.lngMajor);
          let res = await saveMenuManage(
            groupCd.value,
            nowStoreCd.value,
            mainMenulngCode.join(","),
            mainMenuNm.join(","),
            subMenulngCode.join(","),
            subMenuNm.join(","),
            subMenuMajorCode.join(","),
            tempMainCode.value
          );
          // console.log(res);
          //comsole.log(res);
        } catch (error) {
          //comsole.log(error);
        } finally {
          store.state.loading = false;
          Swal.fire({
            title: "저장 되었습니다.",
            confirmButtonText: "확인",
          });

          searchButton();
        }
      }
    });
  });
};
const exporttoExcel = ref(false);
/**
 * 엑셀 내보내기 함수
 */

const excelButton = () => {
  exporttoExcel.value = !exporttoExcel.value;
};

const deleteAlls = () => {
  deleteAll.value = !deleteAll.value;
};

const commitAlls = () => {
  return new Promise((resolve, reject) => {
    try {
      commitAll.value = !commitAll.value; // 기존 작업
      resolve(commitAll.value); // 성공적으로 토글된 값 반환
    } catch (error) {
      reject(error); // 오류 발생 시 오류 반환
    }
  });
};
</script>

<style scoped>
.mst0108-search-panel {
  box-sizing: border-box;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 0;
  padding-right: 0;
}

.mst0108-search-grid {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding-left: var(--mst0108-panel-pad-x);
  padding-right: var(--mst0108-panel-pad-x);
}

.mst0108-cell {
  display: flex;
  min-width: 0;
  min-height: var(--mst0108-row-min-h);
  align-items: center;
  gap: var(--mst0108-item-gap);
}

.mst0108-sg-label {
  flex: 0 0 var(--mst0108-label-col);
  width: var(--mst0108-label-col);
  min-height: var(--mst0108-row-min-h);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
  white-space: nowrap;
}

.mst0108-cell-field {
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  width: 100%;
}

.mst0108-pick-slot :deep(> .flex) {
  width: 100%;
  min-width: 0;
  margin-left: 0 !important;
  margin-top: 0 !important;
  gap: 0.5rem !important;
  justify-content: flex-start !important;
}

.mst0108-pick-slot :deep(select),
.mst0108-pick-slot :deep(.pickstore-vs-shell) {
  box-sizing: border-box;
  height: var(--mst0108-control-h) !important;
  min-height: var(--mst0108-control-h) !important;
  max-height: var(--mst0108-control-h) !important;
  border: 1px solid var(--mst0108-control-border) !important;
  border-radius: 0.375rem !important;
}

.mst0108-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 2rem;
}

.mst0108-section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 1.2;
  color: #1a3c70;
  white-space: nowrap;
}

.mst0108-section-title::before {
  content: "";
  display: inline-block;
  flex-shrink: 0;
  width: 0.25rem;
  height: 0.9em;
  border-radius: 999px;
  background: #2563eb;
}

.mst0108-grids {
  overflow: hidden;
}

.mst0108-grid-host {
  position: relative;
  flex: 1 1 0;
  min-height: 0;
  width: 100%;
}

.mst0108-grid-host :deep(.realgrid),
.mst0108-grid-host :deep(.mst0108-grid) {
  position: absolute !important;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  max-height: 100% !important;
}
</style>
