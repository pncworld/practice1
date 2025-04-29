<template>
  <div class="flex justify-center">
    <div class="p-4 w-1/4 rounded-lg shadow-md">
      <p class="text-lg font-semibold mb-2">사용 가능한 프로그램</p>
      <select
        v-model="selectedPrograms"
        class="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="" class="text-gray-500">선택</option>
        <option
          :value="item.PROGRAM_ID"
          v-for="(item, index) in selectPrograms"
          :key="index"
          class="p-2">
          {{ item.CATEGORY_NM }} // {{ item.PROGRAM_NM }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const userData = store.state.userData[0];
const selectPrograms = ref([]);
const selectedPrograms = ref("");
const fetchData = async () => {
  try {
    const response = await axios.post(
      "https://m.pncoffice.com/USP_AppGetProgramList",
      {
        P_GROUP_CD: userData[0].GROUP_CD,
        P_STORE_CD: userData[0].STORE_CD,
        P_USER_NO: userData[0].USER_NO,
      }
    );

    selectPrograms.value = response.data.recordsets.flat();
  } catch (error) {
    //console.log(error.message);
  }
};
onMounted(() => {
  if (userData) {
    fetchData();
  }
});
</script>
