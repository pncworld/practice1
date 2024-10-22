<template>
    <div>
        <div class="flex justify-start pl-4 pt-4">
                 <div class="flex justify-start"><h1 class="font-bold text-2xl">
                  매장정보등록
                 </h1></div>
                  <div class="flex absolute right-10 justify-end space-x-2"><button @click="searchStore" class="button search">조회</button>
                  <button @click="addStore" class="button new">신규</button>
                  <button @click="updateRowData" class="button save">저장</button>
                  <button @click="deleteStore" class="button delete">삭제</button>
                  <button @click="exportToExcel" class="button primary">엑셀</button>
                </div>    
         </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>