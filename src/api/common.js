import axios from 'axios';
import { ref } from 'vue';

export const commonUrl = 'http://211.238.145.43:3000';
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: commonUrl, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});

// API 요청 메서드들
export const login = (username, password) => {
    return api.post('/USP_AppLoginForTest', {
      P_USERID: username,
      P_PASSWORD: password,
      P_PHONENO: '01012345678', // 고정 핸드폰 번호
    });
};
export const get_sys_list = ( lngStoreGroup , lngUserAdminID ,strLanguage ) => {
  return api.post('/usp_APP_SYS_MENU_GET_LIST',{
    P_GROUP_CD : lngStoreGroup ,
    P_USER_ADMIN_ID : lngUserAdminID ,
    P_STR_LANGUAGE : strLanguage
  })

};
export const get_store_list = (lngStoreGroup) => {
  return api.post('/usp_APP_COMSTORE_GET_LIST',{
    P_STORE_CD : lngStoreGroup
  })
}

export const useTabInfo = async( P_ID , G_ID) => {
  const tabInitSetArray = ref([]); 
  const res = await api.post("/usp_vueGridInfoList" , 
              { PROG_ID : P_ID ,
                GRID_ID : G_ID
              });

            
              tabInitSetArray.value= res.data.recordsets[0] ;
             
              return tabInitSetArray.value;
} 
      
  
export const createItem = (item) => api.post('/items', item);
export const updateItem = (id, item) => api.put(`/items/${id}`, item);
export const deleteItem = (id) => api.delete(`/items/${id}`);

