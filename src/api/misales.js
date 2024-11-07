
import axios from 'axios';
import {commonUrl, commonUrl2} from './common';

const url = commonUrl;
const url2 = commonUrl2;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});

// API 요청 메서드들
export const dailySaleReport = (groupCd, storeCd,startDate,endDate,strLanguage) => {

    return api2.post('/MISALES/SLS06_004RPT.asmx/getDailySalesReport', {
        GROUP_CD: groupCd,
        STORE_CD: storeCd,
        START_DATE: startDate,
        END_DATE: endDate,
        REPORT_TYPE: '1',
        LANGUAGE: strLanguage
    });
};




