<template>
  <div class="ml-4 font-bold text-sm mt-2 flex">
    <div>
      메인카테고리: &nbsp;&nbsp;
      <select
        v-model="changed"
        @change="
          viewsubCategories($event.target.value);
          emitmaincate($event.target.value);
        "
        class="w-36 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <option value="0">선택</option>
        <option :value="i.MajorCode" v-for="i in mainCategories">
          {{ i.MajorName }}
        </option>
      </select>
    </div>
    &nbsp; &nbsp;
    <div>
      서브카테고리: &nbsp; &nbsp;
      <select
        v-model="changed2"
        @change="emitsubcate($event.target.value)"
        class="w-36 border border-gray-800 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        <option value="0">선택</option>
        <option :value="i.SubCode" v-for="i in subCategories">
          {{ i.SubName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { tablePosMenu } from "@/api/master";
import axios from "axios";
import { ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  storeCd: {
    type: String,
    required: true,
  },
  storeAreaCd: {
    type: String,
    required: true,
  },
  ischange: {
    type: Boolean,
    required: true,
  },
});
const store = useStore();
const userData = store.state.userData;
const groupCd = ref(userData.lngStoreGroup);
const currStoreCd = ref();
const currStoreAreaCd = ref();
const mainCategories = ref([]);
const AllCategories = ref([]);
const subCategories = ref([]);
const changed = ref("0");
const changed2 = ref("0");
watch(
  () => props.ischange,
  (newValue) => {
    changed.value = "0";
    changed2.value = "0";
    emitsubcate("0");
    emitmaincate("0");
  }
);
watch(
  () => props.storeCd,
  (newValue) => {
    currStoreCd.value = newValue;
    currStoreAreaCd.value = props.storeAreaCd;
  }
);
watch(
  () => props.storeAreaCd,
  (newValue) => {
    currStoreAreaCd.value = newValue;
  }
);
watch(
  () => props.storeAreaCd,
  async () => {
    if (props.storeAreaCd == "0") {
      mainCategories.value = [];
      subCategories.value = [];
      changed.value = "0";
      changed2.value = "0";
      return;
    }
    const res = await axios.post(
      "/api/MIMASTER/MST57_001INS.asmx/getCategoryInfo",
      {
        GROUP_CD: groupCd.value,
        STORE_CD: currStoreCd.value,
        AREA_CD: currStoreAreaCd.value,
      }
    );
    mainCategories.value = res.data.MainCategory.map((item) => ({
      MajorCode: item.MajorCode,
      MajorName: item.MajorName,
    }));
    AllCategories.value = res.data.MainCategory;
  }
);
const viewsubCategories = (newValue) => {
  subCategories.value =
    newValue != "0"
      ? AllCategories.value.filter((item) => item.MajorCode == newValue)[0]
          .SubCategory
      : "0";
  changed2.value = "0";
  emitsubcate("0");
};
const emit = defineEmits(["emitmain", "emitsub"]);
const emitmaincate = (value) => {
  //comsole.log(value);
  emit("emitmain", value);
};
const emitsubcate = (value) => {
  emit("emitsub", value);
};
</script>

<style lang="scss" scoped></style>
