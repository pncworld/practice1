<template>
  <div class="flex justify-between items-center w-full overflow-y-hidden">
    <PageName></PageName>
    <div class="flex justify-center mr-9 space-x-2 pr-5">
      <button @click="searchButton" class="button search md:w-auto w-14">
        조회
      </button>

      <button @click="saveButton" class="button save w-auto">저장</button>
      <!-- <button @click="excelButton" class="button excel w-auto">엑셀</button> -->
    </div>
  </div>
  <br />
  <div
    class="flex justify-start space-x-5 bg-gray-200 rounded-lg md:h-16 h-24 items-center">
    <PickStore
      @update:storeCd="handleStoreCd"
      @storeNm="handlestoreNm"
      @update:ischanged="handleinitAll"
      @update:ischanged2="searchinit"></PickStore>
  </div>
  <div class="z-50"></div>

  <div class="flex justify-center w-[80%] h-[70%] gap-5 ml-10 mt-5">
    <div class="w-full h-full">
      <div class="flex justify-end gap-2">
        <button class="whitebutton" @click="addRow">추가</button
        ><button class="whitebutton" @click="deleteRow">삭제</button>
      </div>
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'MST01_008INS_VUE'"
        :progid="1"
        :rowData="rowData"
        :showGrid="showGrid"
        :showCheckBar="false"
        :addRow="addbutton"
        @selcetedrowData="selcetedrowData"
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
    <div class="w-full h-full">
      <div class="flex justify-end gap-2">
        <button class="whitebutton" @click="addRow2">추가</button
        ><button class="whitebutton" @click="deleteRow2">삭제</button>
      </div>
      <Realgrid
        class="w-full h-full mt-2"
        :progname="'MST01_008INS_VUE'"
        :progid="2"
        :rowData="filteredRowData2"
        :showGrid="showGrid"
        :showCheckBar="false"
        :addRow2="addbutton2"
        :addrowProp="'lngCode,lngMajor'"
        :deleteRow="deleterow2"
        :addrowDefault="addrowDefault"
        @selcetedrowData="selcetedrowData"
        :changeRow="changeRow"
        :changeColid="'strName'"
        :changeValue="changeValue2"
        @updatedRowData="updatedRowData"
        @clickedRowData="clickedRowData2"
        :editableColId="'strName'"
        :exporttoExcel="exporttoExcel"
        :ExcelNm="'메뉴 분류 관리'"
        :deleteAll="deleteAll"
        :commitAll="commitAll"></Realgrid>
    </div>
  </div>
</template>

<script setup>
import { getMenuLists, saveMenuManage } from "@/api/master";
import PageName from "@/components/pageName.vue";
import PickStore from "@/components/pickStore.vue";
import Realgrid from "@/components/realgrid.vue";
import { insertPageLog } from "@/customFunc/customFunc";
import Swal from "sweetalert2";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

onMounted(async () => {
  const pageLog = await insertPageLog(store.state.activeTab2);
});

const nowStoreAreaCd = ref();
const nowStoreCd = ref();
const posNo = ref();
const deleteAll = ref(false);
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

const handleStoreCd = async (newValue) => {
  if (newValue == "0") {
    afterSearch.value = false;
  }
  nowStoreCd.value = newValue;
  searchButton();
};

const handlestoreNm = (newData) => {
  clickedStoreNm.value = newData;
};

const searchinit = (newvalue) => {
  afterSearch.value = false;
};

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
const searchButton = async () => {
  commitAlls();
  items.value = [];
  rowData.value = [];
  rowData2.value = [];
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
  //   if(nowStoreAreaCd.value == '0' || nowStoreAreaCd.value == undefined) {
  //       Swal.fire({
  //           title: '경고',
  //           text: 'POS번호를 선택하세요.',
  //           icon: 'warning',
  //           showCancelButton: false,
  //           confirmButtonColor: '#3085d6',
  //           allowOutsideClick: false
  //       })
  //       return;
  //   }
  store.state.loading = true;
  try {
    console.log(groupCd.value);
    console.log(nowStoreCd.value);
    console.log(clickedStoreNm.value);

    let res = await getMenuLists(groupCd.value, nowStoreCd.value);
    rowData.value = res.data.MAINMENU;
    rowData2.value = res.data.SUBMENU;

    confirmData.value = rowData.value;
    confirmData2.value = rowData2.value;
    console.log(res);
    console.log(rowData2.value);
  } catch (error) {
    afterSearch.value = false;
  } finally {
    forsaveRowData.value = undefined;

    store.state.loading = false; // 로딩 상태 종료
    filteredRowData2.value = "";
    afterSearch.value = true;
  }
};
const addbutton = ref(false);
const addRow = () => {
  addbutton.value = !addbutton.value;
};
const addbutton2 = ref(false);
const addRow2 = () => {
  if (
    rowData2.value.filter((item) => item.lngMajor == selectedlngCode.value)
      .length > 0
  ) {
    currentsubNo.value = Math.max(
      ...rowData2.value
        .filter((item) => item.lngMajor == selectedlngCode.value)
        .map((item) => item.lngCode)
    );
  } else {
    currentsubNo.value = selectedlngCode.value * 100;
  }
  addbutton2.value = !addbutton2.value;
  console.log(currentsubNo.value + 1);
  console.log(filteredRowData2.value);
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
const clickedRowData = (newValue) => {
  console.log(newValue);
  filteredRowData2.value = rowData2.value.filter(
    (item) => item.lngMajor == newValue[0]
  );
  selectedlngCode.value = newValue[0];
  changeRow.value = newValue.index;
  console.log(changeRow.value);
};
const clickedRowData2 = (newValue) => {
  console.log(newValue);
};

const updatedRowData = (newValue) => {
  console.log(newValue);
  console.log(filteredRowData2.value);
  rowData2.value = rowData2.value.filter(
    (item) => Number(item.lngMajor) !== Number(selectedlngCode.value)
  );

  for (var i = 0; i < newValue.length; i++) {
    rowData2.value.push(newValue[i]);
  }
  console.log(rowData2.value);
  console.log(newValue.length);
};
const forsaveRowData = ref();
const updatedRowData1 = (newValue) => {
  console.log(newValue);
  const validate = newValue.map((item) => item.lngCode);
  const duplicates = validate.filter(
    (item, index) => validate.indexOf(item) !== index
  );
  console.log(changeValue.value);
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
  console.log(forsaveRowData.value);
};
const deleterow = ref(false);
const deleterow2 = ref(false);
const deleteRow2 = () => {
  deleterow2.value = !deleterow2.value;
};
const deleteRow = () => {
  deleterow.value = !deleterow.value;
  deleteAlls();
};

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
    console.log(rowData2.value);
    const length =
      (forsaveRowData.value?.filter(
        (item) =>
          item.strName == "" ||
          item.strName == undefined ||
          item.lngCode == undefined ||
          item.lngCode == "" ||
          isNaN(Number(item.lngCode))
      ).length || 0) +
      (rowData2.value?.filter(
        (item) => item.strName == "" || item.strName == undefined
      ).length || 0);
    if (length > 0) {
      Swal.fire({
        title: "경고",
        text: "입력되지 않은 칸이나 잘못된 값이 포함되어 있습니다.",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    if (
      JSON.stringify(confirmData2.value) === JSON.stringify(rowData2.value) &&
      forsaveRowData.value == undefined
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
          console.log(rowData2.value);
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
          console.log(forsaveRowData.value);
          console.log(mainMenulngCode);
          console.log(mainMenuNm);

          console.log(deletedmainMenuCd);
          if (deletedmainMenuCd != undefined) {
            rowData2.value = rowData2.value.filter(
              (item) => !deletedmainMenuCd.includes(Number(item.lngMajor))
            );
          }

          console.log(rowData2.value);
          const subMenulngCode = rowData2.value
            .filter((item) => item.deleted !== true)
            .map((item) => item.lngCode);
          const subMenuNm = rowData2.value
            .filter((item) => item.deleted !== true)
            .map((item) => item.strName);
          const subMenuMajorCode = rowData2.value
            .filter((item) => item.deleted !== true)
            .map((item) => item.lngMajor);
          let res = await saveMenuManage(
            groupCd.value,
            nowStoreCd.value,
            mainMenulngCode.join(","),
            mainMenuNm.join(","),
            subMenulngCode.join(","),
            subMenuNm.join(","),
            subMenuMajorCode.join(",")
          );
          console.log(res);
        } catch (error) {
          console.log(error);
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

<style></style>
