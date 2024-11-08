import axios from 'axios';
import { ref } from 'vue';

export const commonUrl = 'http://211.238.145.43:3000';
export const commonUrl2 = 'http://www.pncoffice.com:8085';
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: commonUrl, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: commonUrl2, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});

// API 요청 메서드들
export const login = async (username, password) => {
    return api2.post('/SYSTEM/system.asmx/getLoginSession', {
      USER_ID: username,
      PASSWORD: password,
    });
};


export const get_sys_list = ( lngStoreGroup , lngUserAdminID ,strLanguage ) => {
  return api2.post('/SYSTEM/system.asmx/getSysMenuList',{
    GROUP_CD : lngStoreGroup ,
    USER_ADMIN_ID : lngUserAdminID ,
    STR_LANGUAGE : strLanguage
  })

};
export const get_store_list = (lngStoreGroup) => {
  return api2.post('/SYSTEM/sysCom.asmx/getComStoreList',{
    STORE_CD : lngStoreGroup
  })
}

export const getGridInfoList = async( P_ID , G_ID) => {
  const tabInitSetArray = ref([]); 
  const res = await api2.post("/SYSTEM/system.asmx/getGridInfoList" , 
              { PROG_ID : P_ID ,
                GRID_ID : G_ID
              });

            
              tabInitSetArray.value= res.data.gridInfo ;
             
              return tabInitSetArray.value;
} 
      
  
export const createItem = (item) => api.post('/items', item);
export const updateItem = (id, item) => api.put(`/items/${id}`, item);
export const deleteItem = (id) => api.delete(`/items/${id}`);

