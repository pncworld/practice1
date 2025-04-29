<template>
  <div
    class="w-[500px] h-[300px] border border-black bg-gray-200"
    v-if="showPopUp">
    <div class="flex h-8 items-center">
      <div class="font-semibold">검색 :</div>
      <div>
        <select
          name=""
          id=""
          class="border border-black rounded-sm ml-1"
          v-model="searchType">
          <option :value="1">사원번호</option>
          <option :value="2">사원명</option>
          <option :value="3">부서명</option>
          <option :value="4">소속사명</option>
        </select>
        <input
          type="text"
          class="border border-black ml-1 rounded-sm pl-1 w-32"
          v-model="searchText" />
      </div>
      <div class="ml-3">
        <button
          class="button primary h-7 w-12 text-center flex justify-center"
          @click="searchButton">
          조회
        </button>
      </div>
      <div class="ml-1">
        <button
          class="button primary h-7 w-12 text-center flex justify-center"
          @click="closeButton">
          닫기
        </button>
      </div>
    </div>
    <Realgrid
      :progname="'ACT09_001RPT_VUE'"
      :progid="1"
      :rowData="rowData"
      :setStateBar="false"
      @dblclickedRowData="dblclickedRowData"></Realgrid>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Realgrid from "./realgrid.vue";
import { useStore } from "vuex";
import { getEmployeesData } from "@/api/account";

const emit = defineEmits(["custId", "custName", "updateOpen"]);
const rowData = ref([]);
const searchType = ref(1);
const searchText = ref("");
const store = useStore();
const groupCd = ref(store.state.userData.lngStoreGroup);
const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});
const searchButton = async () => {
  try {
    const res = await getEmployeesData(
      groupCd.value,
      searchType.value,
      searchText.value
    );
    //console.log(res);
    rowData.value = res.data.List;
  } catch (error) {}
};
const showPopUp = ref(false);
const dblclickedRowData = (e) => {
  emit("custId", e[0]);
  emit("custName", e[1]);
  emit("updateOpen", false);
  showPopUp.value = false;
};
const closeButton = (e) => {
  emit("updateOpen", false);
  showPopUp.value = false;
};

watch(
  () => props.open,
  () => {
    if (props.open == false) {
      showPopUp.value = false;
    } else {
      searchType.value = 1;
      searchText.value = "";
      if (rowData.value.length > 0) {
        rowData.value = [];
      }
      showPopUp.value = true;
    }
  }
);
</script>

<style></style>
