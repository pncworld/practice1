<template>
  <div class="flex justify-center fixed bottom-0 w-full bg-white z-10 space-x-20 border border-gray-100">
  <button @click="showHomePage"><font-awesome-icon icon="house" class="size-8"/></button>
  <button @click="showMobileMenu"><font-awesome-icon icon="bars" class="size-8"/></button>
  <button @click="showMobilePersonal"><font-awesome-icon :icon="['far', 'user']" class="size-8"/></button>
</div>

</template>

<script setup>
import router from '@/router';
import { ref } from 'vue';

const mobileMenu = ref(false);
const personal = ref(false);
const emit = defineEmits(['showMenu','showpersonal','showHomepage']);
const showMobileMenu = () => {
     mobileMenu.value = !mobileMenu.value;
    
     emit('showMenu',mobileMenu.value);
     personal.value = false;
     emit('showpersonal',personal.value);
     emit('showHomepage',false);
}
const showMobilePersonal =() => {
    mobileMenu.value =false;
    emit('showMenu',mobileMenu.value);
    personal.value = !personal.value;
    emit('showpersonal',personal.value);
    emit('showHomepage',false);
}
const showHomePage =() => {
    mobileMenu.value = false;
    emit('showMenu',mobileMenu.value);
    personal.value = false;
    emit('showpersonal',personal.value);
    router.push('/homePage');
}
</script>

<style lang="scss" scoped>

</style>