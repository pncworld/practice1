<template>
  <div
    class="fixed flex top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 justify-center items-center">
    <div class="bg-white w-[30%] h-[80%] shadow-lg rounded-lg flex flex-col">
      <div class="w-[90%] h-[90%] ml-10 mt-5">
        <div class="flex justify-between items-start">
          <div class="text-2xl font-semibold">매장 유형간 복사</div>
          <div class="flex items-center space-x-2">
            <button class="button copy" @click="copyButton">복사</button>
            <button class="button primary" @click="closePopUp">닫기</button>
          </div>
        </div>
        <div class="flex items-center mt-2 space-x-5">
          <div class="text-xl font-semibold">원본매장유형</div>
          <div>
            <select
              name=""
              id=""
              v-model="cond"
              class="border border-black w-32">
              <option :value="i.lngSubLease" v-for="i in optionList">
                {{ i.strName }}
              </option>
            </select>
          </div>
        </div>
        <div class="h-[80%] w-full mt-5">
          <Realgrid
            :progid="2"
            :setStateBar="false"
            :checkRowAuto="false"
            :checkRenderEditable="true"
            :rowStateeditable="false"
            :selectionStyle="'block'"
            @updatedRowData="checkedRowData"
            :progname="'MST04_016INS_VUE'"
            :rowData="rowData"></Realgrid>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import Realgrid from "./realgrid.vue";
import store from "@/store";
import { ref } from "vue";
import { copyStockDemand, getSubLeaseList } from "@/api/master";
import Swal from "sweetalert2";

const emit = defineEmits(["close"]);

const closePopUp = (e) => {
  emit("close", false);
};

const cond = ref("");
const optionList = ref([]);

const rowData = ref([]);
onMounted(async () => {
  optionList.value = store.state.storeSubLease;

  cond.value = store.state.userData.lngSubLease;

  const res = await getSubLeaseList(store.state.userData.lngStoreGroup, "");

  rowData.value = res.data.List;
});

const checkedrowdata = ref([]);
const checkedRowData = (e) => {
  //console.log(e);

  checkedrowdata.value = e.filter((item) => item.Selected == true);
};

const copyButton = async () => {
  //console.log(checkedrowdata.value);
  if (checkedrowdata.value.length == 0) {
    Swal.fire({
      title: "복사할 매장유형을 선택해주세요.",
      confirmButtonText: "확인",
    });
    return;
  }

  try {
    store.state.loading = true;
    const checksublease = checkedrowdata.value
      .map((item) => item.lngSubLease)
      .join("\u200b");
    const res = await copyStockDemand(
      store.state.userData.lngStoreGroup,
      cond.value,
      checksublease
    );

    // ///console.log(res);
    store.state.loading = false;
    if (res.data.RESULT_CD == "00") {
      Swal.fire({
        title: "성공",
        text: "복사에 성공하였습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      return;
    } else {
      Swal.fire({
        title: "실패",
        text: "복사에 실패하였습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  } catch (error) {
    //console.log(error);
  }
};
</script>

<style></style>
