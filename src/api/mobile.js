
import axios from 'axios';
import { commonUrl, commonUrl2 } from './common';
import store from '@/store';
import router from '@/router';

const url = commonUrl;
const url2 = commonUrl2;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});

api2.interceptors.request.use((config) => {
  const token = store.state.StoreToken

  config.headers['Authorization'] = `Bearer ${token}`

  return config 
}, (error) => {
  return Promise.reject(error)
})

api2.interceptors.response.use((response) => {
  if(response.headers.authorization){
    let newtoken = response.headers.authorization.substring(7);

    store.state.StoreToken = newtoken
  }
  return response;
} ,(error) => {
  if(error.response && error.response.status == 401){
    alert('로그인 시간이 1분 이상 지났습니다. 재로그인 해주세요.')
    store.commit('clearSession')
    router.push('/');
    
  }
})
export const mobileLogin = (userid , password) => {
  return api2.post('/MOBILE/LOGIN_ANDROID.asmx/mobileLogin', {
      USER_ID   : userid,
      PASSWORD :  password

  });
};
export const getMobileProgList = (groupcd , storecd,  userno) => {
  return api2.post('/MOBILE/MOBILE_PROGLIST.asmx/getMobileProgList', {
      GROUP_CD   : groupcd,
      STORE_CD : storecd ,
      USER_NO : userno

  });
};
export const getMobileDashBoard = (groupcd , storecd,  userno) => {
  return api2.post('/MOBILE/MAINSALE_REPORT.asmx/getMobileDashBoard', {
      GROUP_CD   : groupcd,
      STORE_CD : storecd ,
      USER_NO : userno

  });
};
export const getAppStoreList = (groupcd , storecd,  userno) => {
  return api2.post('/MOBILE/STORE_LIST.asmx/getAppStoreList', {
      GROUP_CD   : groupcd,
      STORE_CD : storecd ,
      USER_NO : userno

  });
};
export const getMobileDetailSales = (groupcd , storecd,  startdate, enddate) => {
  return api2.post('/MOBILE/TOTAL_DETAIL_SALE.asmx/getMobileDetailSales', {
      GROUP_CD   : groupcd,
      STORE_CD : storecd ,
      START_DATE : startdate ,
      END_DATE :  enddate

  });
};
