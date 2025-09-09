<template>
  <div class="flex w-32 items-center">
    <div class="text-base text-nowrap font-semibold">{{ mainName }}</div>
    <div>
      <input
        type="text"
        disabled
        class="disabled: bg-gray-100 ml-5"
        v-model="lngCode" />
    </div>
    <div>
      <input
        type="text"
        v-model="strName"
        disabled
        class="disabled:bg-white ml-5" />
    </div>
    <div>
      <button class="whitebutton bg-white ml-5" @click="showPopUp">조회</button>
    </div>
    <div>
      <button class="whitebutton bg-white" @click="reset">초기화</button>
    </div>
  </div>
  <div v-if="showing">
    <div class="absolute border border-gray-500 w-[25vw] h-48 z-50 bg-white">
      <div class="flex border justify-between">
        <div class="border">매장명 :</div>
        <div>
          <select
            name=""
            id=""
            class="border border-black"
            v-model="searchOption">
            <option value="0">카드번호</option>
            <option value="1">고객명</option>
            <option value="2">휴대폰</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            class="pl-1 border border-black"
            @keydown.enter="searchButton"
            v-model="searchword" />
        </div>
        <div>
          <button class="whitebutton" @click="searchButton">조회</button>
        </div>
        <div><button class="whitebutton" @click="closePopUp">닫기</button></div>
      </div>
      <div class="h-[16vh] w-full">
        <Realgrid
          :progname="'CRM02_002RPT_VUE'"
          :progid="2"
          :rowData="rowData"
          :row-stateeditable="false"
          @dblclickedRowData="dblclickedRowData"
          :setStateBar="false"></Realgrid>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import Realgrid from "./realgrid.vue";
import store from "@/store";
import { getBelongCust, getCustInfo2 } from "@/api/micrm";

const lngCode = ref("");
const strName = ref("");
const searchword = ref("");
const searchOption = ref(0);
const showing = ref(false);
const showPopUp = () => {
  showing.value = !showing.value;
};

const mainName = ref("");
const props = defineProps({
  lngStoreCode: {
    type: String,
    default: "",
  },
  mainName: {
    type: String,
    default: "고객명",
  },
  type: {
    type: String,
    default: "1",
  },
});

const emit = defineEmits(["ID", "Name", "excelList", "CustId"]);
const rowData = ref([]);
const currlngStoreCode = ref("");
const TYPE = ref("");
onMounted(() => {
  currlngStoreCode.value = store.state.lngPosition;

  mainName.value = props.mainName;
  emit("excelList", mainName.value + ":   ");
  TYPE.value = props.type;
});
watch(
  () => props.lngStoreCode,
  async () => {
    currlngStoreCode.value = props.lngStoreCode;
    const res = await getBelongCust(
      currlngStoreCode.value,
      searchword.value,
      TYPE.value
    );

    strName.value = "";
    lngCode.value = 0;
    emit("ID", lngCode.value);
    emit("CustId", "");
    emit("Name", strName.value);
    ////console.log(res);
    rowData.value = res.data.List;
  }
);

const searchButton = async () => {
  const res = await getCustInfo2(
    store.state.userData.lngStoreGroup,
    searchOption.value,
    searchword.value
  );
  ////console.log(res);
  rowData.value = res.data.List;
};
const closePopUp = async () => {
  searchword.value = "";

  // const res = await getBelongCust(
  //   currlngStoreCode.value,
  //   searchword.value,
  //   TYPE.value
  // );
  // rowData.value = res.data.List;

  showing.value = false;
};

const dblclickedRowData = (e) => {
  strName.value = e[1];
  lngCode.value = e[0];
  emit("ID", lngCode.value);
  emit("Name", strName.value);
  emit("CustId", e[4]);
  emit("excelList", mainName.value + ": " + strName.value);
  closePopUp();
};

const reset = () => {
  strName.value = "";
  lngCode.value = "";
  searchword.value = "";
  emit("ID", 0);
  emit("Name", "");
  emit("CustId", "");
  emit("excelList", mainName.value + ": ");
};
</script>

<style lang="scss" scoped></style>
