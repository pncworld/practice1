
import axios from 'axios';
import {commonUrl,commonUrl2} from './common';

const url = commonUrl;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});
export const url2 = commonUrl2;
const api2 = axios.create({
    baseURL: url2, // API 기본 URL
    timeout: 10000, // 요청 타임아웃 설정
  });


export const getChargerInfo = (groupCd, storeCd) => {
      return api2.post('/MIATTEND/ATT01_002INS.asmx/getChargerInfo', {
          GROUP_CD: groupCd,
          STORE_CD: storeCd
      });
  };