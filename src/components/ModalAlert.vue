<template>
  <div class="modal-alert" :class="{ show: isVisible }" :data-type="type">
    <div class="modal-dim" @click="handleClose"></div>
    <div class="modal-wrap">
      <div class="modal-icon">
        <img src="@/assets/images/alert_warning.svg" alt="경고">
        <img src="@/assets/images/alert_info.svg" alt="알림">
        <img src="@/assets/images/alert_success.svg" alt="성공">
        <img src="@/assets/images/alert_confirm.svg" alt="확인">
      </div>
      <div class="f30 modal-title">{{ title }}</div>
      <div class="f14 modal-message">{{ message }}</div>
      <div class="modal-btns">
        <button 
          v-if="showConfirm" 
          class="btn btn-secondary" 
          @click="handleConfirm">
          확인
        </button>
        <button 
          v-if="showSave" 
          class="btn btn-secondary" 
          @click="handleSave">
          저장
        </button>
        <button 
          v-if="showCancel" 
          class="btn btn-secondary dark" 
          @click="handleClose">
          취소
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'warning', // warning, info, success, confirm
    validator: (value) => ['warning', 'info', 'success', 'confirm'].includes(value)
  },
  title: {
    type: String,
    default: '알림'
  },
  message: {
    type: String,
    default: ''
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  showSave: {
    type: Boolean,
    default: false
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  closeOnDim: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close', 'confirm', 'save', 'cancel']);

const handleClose = () => {
  if (props.closeOnDim) {
    emit('close');
  }
};

const handleConfirm = () => {
  emit('confirm');
  emit('close');
};

const handleSave = () => {
  emit('save');
  emit('close');
};

const handleCancel = () => {
  emit('cancel');
  emit('close');
};
</script>

<style scoped>
/* CSS는 layout.css에 이미 정의되어 있음 */
</style>

