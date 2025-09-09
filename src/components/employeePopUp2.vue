<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="w-[40%] h-[50%] border border-black bg-white rounded-lg shadow-lg p-2">
      <div class="flex justify-end space-x-3">
        <button class="whitebutton" @click="searchButton">조회</button>
        <button class="whitebutton">선택</button>
        <button class="whitebutton" @click="closeButton">닫기</button>
      </div>
      <div class="flex justify-start flex-col items-start space-y-2">
        <PickStore
          :hideGroup="false"
          :hideAttr="false"
          :defaultStore="true"
          :defaultStoreNm="'전체'"
          @update:storeGroup="lngStoreGroup"
          @update:storeCd="lngStoreCode"
          class="!-ml-0"></PickStore>
        <div class="flex space-x-5">
          <div class="text-base font-semibold">사원명</div>
          <input
            type="text"
            class="border border-black ml-1 rounded-sm pl-1 w-52 h-8"
            v-model="searchText" />
        </div>
      </div>
      <div class="h-[70%] mt-2">
        <Realgrid
          :progname="'HR01_005INS_VUE'"
          :progid="4"
          :rowData="rowData"
          :setStateBar="false"
          :rowStateeditable="false"
          @dblclickedRowData="dblclickedRowData"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getEmployeesData2 } from "@/api/mihr";
import { ref, watch } from "vue";
import { useStore } from "vuex";
import PickStore from "./pickStore.vue";
import Realgrid from "./realgrid.vue";

const emit = defineEmits(["custId", "custName", "updateOpen", "empSalType"]);
const rowData = ref([]);
const searchType = ref(1);
const searchText = ref("");
const store = useStore();
const groupCd = ref(store.state.userData.lngStoreGroup);

const storeCd = ref("0");
const lngStoreCode = (e) => {
  storeCd.value = e;
};

const lngStoreGroup = (e) => {
  groupCd.value = e;
};
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
const searchButton = async () => {
  try {
    const res = await getEmployeesData2(
      groupCd.value,
      storeCd.value,
      searchText.value,
      2
    );
    console.log(res);
    rowData.value = res.data.List;
  } catch (error) {}
};
const showPopUp = ref(false);
const dblclickedRowData = (e) => {
  console.log(e);
  emit("empId", e[1]);
  emit("empName", e[2]);
  emit("empType", e[4]);
  emit("empSalType", e[5]);
  emit("groupCd", e[6]);
  emit("storeCd", e[7]);
  emit("updateOpen", false);
  //showPopUp.value = false;
};

const clickedRowData = (e) => {
  console.log(e);
};
const closeButton = (e) => {
  //console.log("여긴오냐");
  emit("updateOpen", false);
  //showPopUp.value = false;
};

// watch(
//   () => props.open,
//   () => {
//     if (props.open == false) {
//       showPopUp.value = false;
//     } else {
//       searchType.value = 1;
//       searchText.value = "";
//       if (rowData.value.length > 0) {
//         rowData.value = [];
//       }
//       showPopUp.value = true;
//     }
//   }
// );
</script>

<style></style>
