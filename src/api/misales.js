
import axios from 'axios';
import { commonUrl, commonUrl2 } from './common';

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
export const dailySaleReport = (groupCd, storeCd, startDate, endDate, strLanguage) => {

  return api2.post('/MISALES/SLS06_004RPT.asmx/getDailySalesReport', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: '1',
    LANGUAGE: strLanguage
  });
};

export const getReceiptDatas = (groupCd, storeCd, posNo, dtmDate, receiptNo, discountCd, payCd, strlang) => {

  return api2.post('/MISALES/SLS02_011RPT.asmx/getReceiptDatas', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posNo,
    DTM_DATE: dtmDate,
    RECEIPT_NO: receiptNo,
    DISCOUNT_CD: discountCd,
    PAY_CD: payCd,
    STRLANG: strlang
  });
};
export const getDiscountCdList = (groupCd, storeCd) => {

  return api2.post('/MISALES/SLS02_011RPT.asmx/getDiscountCdList', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd
  });
};
export const getpayCodeList = (groupCd, storeCd) => {

  return api2.post('/MISALES/SLS02_011RPT.asmx/getpayCodeList', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd
  });
};
export const getCustInfo = (groupCd, storeCd, seqId) => {

  return api2.post('/MISALES/SLS02_011RPT.asmx/getCustInfo', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQ_ID: seqId
  });
};
export const getOrderInfo = (groupCd, storeCd, seqId) => {

  return api2.post('/MISALES/SLS02_011RPT.asmx/getOrderInfo', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQ_ID: seqId
  });
};
export const getPayInfo = (groupCd, storeCd, seqId, lang) => {

  return api2.post('/MISALES/SLS02_011RPT.asmx/getPayInfo', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQ_ID: seqId,
    STRLANG: lang
  });
};
export const getDailySalesReport = (groupCd, storeCds, startDate, endDate, reporttype, lang) => {

  return api2.post('/MISALES/SLS06_004RPT.asmx/getDailySalesReport', {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    LANG: lang
  });
};

export const getDailySalesDetailReport = (groupCd, storeCds, startDate, endDate, reporttype, lang) => {

  return api2.post('/MISALES/SLS06_004RPT.asmx/getDailySalesDetailReport', {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    LANG: lang
  });
};
export const getTimeSalesReport = (groupCd, storeCds, startDate, endDate, reporttype, startTime, endTime, timeType, checkedday) => {

  return api2.post('/MISALES/SLS06_002RPT.asmx/getTimeSalesReport', {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    START_TIME: startTime,
    END_TIME: endTime,
    TIME_TYPE: timeType,
    CHECKED_DAYS: checkedday
  });
};
export const getReceiptDataDetail = (groupCd, storeCd, startDate, endDate) => {

  return api2.post('/MISALES/SLS02_021RPT.asmx/getReceiptDataDetail', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
   
  });
};
export const getRealTimeReport = (groupCd, storeCd, startDate, endDate , seeday) => {

  return api2.post('/MISALES/SLS02_030RPT.asmx/getRealTimeReport', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    DAY_ON: seeday,
   
  });
};
export const getTableSearchCondition = (groupCd, storeCd, selectedMenuCond) => {

  return api2.post('/MISALES/SLS04_002RPT.asmx/getTableSearchCondition', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_COND: selectedMenuCond,
   
  });
};




