<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl shadow-2xl w-[30vw]" id="address">
      <div class="flex justify-end">
        <button class="button primary" @click="closePopUp">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const emit = defineEmits(["closePopUp", "zipCode", "address", "zipAndAddress"]);
const closePopUp = () => {
  emit("closePopUp", false);
};

onMounted(() => {
  //console.log(window.screen.width / 2 - width * 2);
  const element = document.getElementById("address");
  new daum.Postcode({
    onclose: closePopUp,
    oncomplete: function (data) {
      // console.log(data);
      emit("zipCode", data.zonecode);
      emit("address", data.roadAddress);
      emit("zipAndAddress", data.zonecode + "," + data.roadAddress);
    },
  }).embed(element);
});
</script>

<style></style>
