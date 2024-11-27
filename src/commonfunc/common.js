
import axios from 'axios';
import { ref } from 'vue';
import commonUrl2 from '../api/common'
import { useStore } from 'vuex';
import Swal from 'sweetalert2';

const api2 = axios.create({
    baseURL: commonUrl2, // API 기본 URL
    timeout: 10000, // 요청 타임아웃 설정
  });

  const store = useStore();
export function useSave() {
  const loading = ref(false); // 로딩 상태 관리
  const successMessage = ref('');
  const errorMessage = ref('');

  const saveData = async (apiUrl, params) => {
    store.state.loading = true;
    successMessage.value = '';
    errorMessage.value = '';
   
    
    try {
      // API 호출
      let response ;
      Swal.fire({
        title: '저장',
        text: '저장 하시겠습니까?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '저장',
        cancelButtonText: '취소'
      }).then(async(result) => {
        if(result.isConfirmed){
            response = await api2.post(apiUrl, params);
        } else {
            return ;
        }
      });
     
      
      // 성공 시 처리
      successMessage.value = '저장이 완료되었습니다.';
      return response.data;
    } catch (err) {
      // 실패 시 처리
      errorMessage.value = '저장에 실패했습니다: ' + err.message;
      throw err;
    } finally {
        store.state.loading = false; // 로딩 종료
    }
  };

  return { saveData, loading, successMessage, errorMessage };
}
