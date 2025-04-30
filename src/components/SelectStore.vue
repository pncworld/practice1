<template>
  <div class="w-full">
    <p class="text-lg font-semibold mb-4">선택 가능한 매장</p>
    <select
      class="w-1/4 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      v-model="selectedStore">
      <option value="">선택</option>
      <option :value="item.STORE_CD" v-for="(item, i) in selectStore" :key="i">
        {{ item.STORE_CD }} / {{ item.STORE_NM }}
      </option>
    </select>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const userData = store.state.userData[0];
const selectedStore = ref("");
const selectStore = ref([]);
const fetchData = async () => {
  try {
    const res = await axios.post("https://m.pncoffice.com/USP_AppStoreList", {
      P_GROUP_CD: userData[0].GROUP_CD,
      P_STORE_CD: userData[0].STORE_CD,
      P_USER_NO: userData[0].USER_NO,
    });

    selectStore.value = res.data.recordsets.flat();
  } catch (error) {
    //comsole.log(error.message);
  }
};

onMounted(() => {
  if (userData) {
    fetchData();
  }
});
</script>
