
import axios from 'axios';
import { commonUrl, commonUrl2 } from './common';

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

export const getuserPageAccessLogReport = (groupCd, storeAttr, storeCds, startDate, endDate, id) => {
  return api2.post('/MISYSTEM/SYS01_003RPT.asmx/getuserPageAccessLogReport', {
      GROUP_CD   : groupCd,
      STORE_ATTR : storeAttr ,
      STORE_CDS  : storeCds,
      START_DATE : startDate,
      END_DATE   : endDate,
      USER_NM    : id
  });
};