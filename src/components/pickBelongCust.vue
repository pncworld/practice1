<template>
  <div class="flex w-32 h-10 space-x-5 mt-2">
    <div class="text-base text-nowrap font-semibold">{{ mainName }}</div>
    <div>
      <input
        type="text"
        disabled
        class="disabled: bg-gray-100"
        v-model="lngCode" />
    </div>
    <div>
      <input type="text" v-model="strName" disabled class="disabled:bg-white" />
    </div>
    <div>
      <button class="whitebutton bg-white" @click="showPopUp">조회</button>
    </div>
    <div>
      <button class="whitebutton bg-white" @click="reset">초기화</button>
    </div>
  </div>
  <div v-if="showing">
    <div class="absolute border border-gray-500 w-96 h-48 z-50 bg-white">
      <div class="flex border justify-between">
        <div class="border">거래처명 :</div>
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
          :progname="'CRM20_005RPT_VUE'"
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
import { getBelongCust } from "@/api/micrm";

const lngCode = ref("");
const strName = ref("");
const searchword = ref("");
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
    default: "거래처",
  },
  type: {
    type: String,
    default: "1",
  },
});

const emit = defineEmits(["strSaleCustID", "strSaleCustName", "excelList"]);
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
    lngCode.value = "";
    emit("strSaleCustID", lngCode.value);
    emit("strSaleCustName", strName.value);
    //console.log(res);
    rowData.value = res.data.List;
  }
);

const searchButton = async () => {
  const res = await getBelongCust(
    currlngStoreCode.value,
    searchword.value,
    TYPE.value
  );

  rowData.value = res.data.List;
};
const closePopUp = async () => {
  searchword.value = "";

  const res = await getBelongCust(
    currlngStoreCode.value,
    searchword.value,
    TYPE.value
  );
  rowData.value = res.data.List;

  showing.value = false;
};

const dblclickedRowData = (e) => {
  //console.log(e);
  strName.value = e[1];
  lngCode.value = e[0];
  emit("strSaleCustID", lngCode.value);
  emit("strSaleCustName", strName.value);
  emit("excelList", mainName.value + ": " + strName.value);
  closePopUp();
};

const reset = () => {
  strName.value = "";
  lngCode.value = "";
  searchword.value = "";
  emit("strSaleCustID", "");
  emit("strSaleCustName", "");
  emit("excelList", mainName.value + ": ");
};
</script>

<style lang="scss" scoped></style>
