<template>
  <div
    class="w-screen h-screen flex flex-col justify-center items-center bg-white absolute">
    <div class="spinner"></div>
    <p class="mt-4 text-xl font-bold">로딩 중</p>
  </div>
</template>

<style scoped>
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #ccc;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
