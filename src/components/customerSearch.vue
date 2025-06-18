<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <!-- 팝업 박스 -->
    <div class="bg-white rounded-xl p-6 w-[35vw] h-[30vh] shadow-lg relative">
      <h2 class="text-xl font-bold mb-4">카드번호 검색</h2>
      <div class="grid grid-rows-[1fr,7fr] grid-cols-1 items-center w-[90%]">
        <div class="grid grid-rows-1 grid-cols-[1fr,4fr,1fr]">
          <div
            class="border-l border-t flex justify-center items-center border-black">
            검색
          </div>
          <div
            class="flex border-l border-t border-black justify-center items-center space-x-2">
            <select
              name=""
              id=""
              class="flex border-black border items-center justify-center"
              v-model="cond">
              <option value="0">카드번호</option>
              <option value="1">고객명</option>
              <option value="2">휴대폰</option>
            </select>
            <input
              type="text"
              class="border border-black"
              v-model="cond2"
              @keydown.enter="searchButton" />
          </div>
          <div class="flex border-l border-t border-black space-x-2 pl-2">
            <button class="whitebutton" @click="searchButton">조회</button
            ><button class="whitebutton" @click="emit('closePopUp', false)">
              닫기
            </button>
          </div>
        </div>
        <div class="h-full w-full">
          <Realgrid
            :progname="'CRM01_008INS_VUE'"
            :progid="2"
            :rowData="rowData2"
            @dblclickedRowData="dblclickedRowData"
            :rowStateeditable="false"></Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCardChangeInfo } from "@/api/micrm";
import store from "@/store";
import { ref } from "vue";
import { watch } from "vue";
import Realgrid from "./realgrid.vue";

const props = defineProps({
  openPopUp: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "strCCardID",
  "strCustName",
  "strMobile",
  "strHomeAddr1",
  "lngVisitCnt",
  "lngActAmt",
  "lngSalePoint",
  "lngBonusPoint",
  "lngUsedPoint",
  "lngRemPoint",
  "strRemark",
  "lngStoreCode",
  "lngCustNo",
  "closePopUp",
]);

const cond2 = ref("");
const pcond = ref();
const pcond2 = ref();
const pcond3 = ref();
const pcond4 = ref(0);
const pcond5 = ref();
const pcond6 = ref();
const pcond7 = ref();
const pcond8 = ref();
const pcond9 = ref();
const pcond10 = ref();
const pcond11 = ref();
const pcond12 = ref();

const rowData2 = ref([]);
const cond = ref(0);
const afterSearch = ref(false);
const searchButton = async () => {
  try {
    store.state.loading = true;
    initGrid();
    let res;
    if (cond.value == 0) {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        null,
        cond2.value,
        null
      );
    } else if (cond.value == 1) {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        null,
        null,
        cond2.value
      );
    } else {
      res = await getCardChangeInfo(
        store.state.userData.lngStoreGroup,
        cond2.value,
        null,
        null
      );
    }
    console.log(res);

    rowData2.value = res.data.List;
    console.log(res);
    afterSearch.value = true;
  } catch (error) {
    afterSearch.value = false;
    //comsole.log(error);
  } finally {
    store.state.loading = false;
  }
};
const initGrid = () => {};
const dblclickedRowData = async (e) => {
  //console.log(e);

  emit("strCCardID", e[0]);
  emit("strCustName", e[1]);
  emit("strMobile", e[2]);
  emit("strHomeAddr1", e[3]);
  emit("lngVisitCnt", e[4]);
  emit("lngActAmt", e[5]);
  emit("lngSalePoint", e[6]);
  emit("lngBonusPoint", e[7]);
  emit("lngUsedPoint", e[8]);
  emit("lngRemPoint", e[9]);
  emit("strRemark", e[10]);
  emit("lngStoreCode", e[11]);
  emit("lngCustNo", e[12]);
  emit("closePopUp", false);
};
</script>

<style lang="scss" scoped></style>
