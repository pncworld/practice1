<template>
    <input type="date" v-model="selectedDate">
</template>

<script setup>

const selectedDate = ref()
watch((selectedDate) => {
   console.log(selectedDate)
})
</script>

