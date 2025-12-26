import { ref } from 'vue';

// 전역 모달 상태
const modal = ref({
  visible: false,
  type: 'warning',
  title: '알림',
  message: '',
  showConfirm: true,
  showSave: false,
  showCancel: false,
  callback: null
});

// 전역 모달 표시 함수
export const showModalAlert = (type, title, message, showConfirm = true, showSave = false, showCancel = false, callback = null) => {
  modal.value = { 
    visible: true, 
    type, 
    title, 
    message, 
    showConfirm, 
    showSave, 
    showCancel, 
    callback 
  };
};

// 모달 닫기 함수
export const closeModalAlert = () => {
  modal.value.visible = false;
};

// 모달 상태 반환 (컴포넌트에서 사용)
export const useModalAlert = () => {
  const handleModalConfirm = () => {
    if (modal.value.callback) {
      modal.value.callback('confirm');
    }
    modal.value.visible = false;
  };

  const handleModalSave = () => {
    if (modal.value.callback) {
      modal.value.callback('save');
    }
    modal.value.visible = false;
  };

  const handleModalCancel = () => {
    modal.value.visible = false;
  };

  return {
    modal,
    handleModalConfirm,
    handleModalSave,
    handleModalCancel
  };
};

// 전역으로 사용할 수 있도록 export
export { modal };

