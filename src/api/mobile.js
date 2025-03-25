
import axios from 'axios';
import { commonUrl, commonUrl2 } from './common';
import store from '@/store';

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
