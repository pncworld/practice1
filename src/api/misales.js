
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
export const getRealTimeReport = (groupCd, storeCd, startDate, endDate , seeday ,attr ,team , supervisor) => {

  return api2.post('/MISALES/SLS02_030RPT.asmx/getRealTimeReport', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    DAY_ON: seeday
   
  });
};
export const getTableSearchCondition = (groupCd, storeCd, selectedMenuCond) => {

  return api2.post('/MISALES/SLS04_002RPT.asmx/getTableSearchCondition', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_COND: selectedMenuCond,
   
  });
};
export const getMenuCondition = (groupCd, storeCd, searchKb , majorCode, subCode ) => {

  return api2.post('/MISALES/SLS04_003RPT.asmx/getMenuCondition', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEARCH_KB: searchKb,
    MAJOR_CD: majorCode,
    SUB_CD: subCode,
   
  });
};
export const getSalesReportByMenu = (groupCd, storeCd, startDate, endDate, searchType, searchValue ,reporttype, checkedgift , checklngprice, checkedlngprint , checkdays , checkholiday) => {

  return api2.post('/MISALES/SLS04_002RPT.asmx/getSalesReportByMenu', {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    SEARCH_TYPE :  searchType,
    SEARCH_VALUE : searchValue,
    REPORT_TYPE : reporttype ,
    CHECKED_GIFT : checkedgift ,
    CHECKED_LNGPRICE : checklngprice ,
    CHECKED_LNGPRINT : checkedlngprint ,
    CHECKED_DAYS : checkdays ,
    CHECKED_HOLIDAY : checkholiday,
  });
};

export const getAreaIndustrySalesReport = (groupCd ,storeCds , startDate , endDate , reporttype , lang) => {
  return api2.post('/MISALES/SLS02_014RPT.asmx/getAreaIndustrySalesReport', {
    GROUP_CD: groupCd,
    STORE_CDS : storeCds ,
    START_DATE : startDate ,
    END_DATE : endDate,
    REPORT_TYPE : reporttype ,
    LANG : lang
  });
};

export const getCardSalesDetailReport = (groupCd ,storeCds , startDate , endDate , reporttype , voidFlag, strBuyCode) => {
  return api2.post('/MISALES/SLS05_002RPT.asmx/getCardSalesDetailReport', {
    GROUP_CD    : groupCd,
    STORE_CDS   : storeCds,
    START_DATE  : startDate,
    END_DATE    : endDate,
    REPORT_TYPE : reporttype,
    VOID_FLG    : voidFlag,
    BUY_CODE    : strBuyCode
  });
};

export const getCardCorp = (groupCd ,storeCds , orderBy) => {
  return api2.post('/MISALES/SLS05_002RPT.asmx/getCardCorp', {
    GROUP_CD  : groupCd,
    STORE_CDS : storeCds,
    ORDER_BY  : orderBy
  });
};

export const getCardSalesSumReport = (groupCd , storeCds, startDate, endDate, reporttype, dateType, strBuyCode) => {
  return api2.post('/MISALES/SLS05_004RPT.asmx/getCardSalesSumReport', {
    GROUP_CD    : groupCd,
    STORE_CDS   : storeCds,
    START_DATE  : startDate,
    END_DATE    : endDate,
    REPORT_TYPE : reporttype,
    DATE_TYPE   : dateType,
    BUY_CODE    : strBuyCode
  });
};

export const getSalesCloseMaxDate = (groupCd) => {
  return api2.post('/MISALES/SLS05_004RPT.asmx/getSalesCloseMaxDate', {
    GROUP_CD    : groupCd
  });
};

export const getWeedaySalesReport = (groupCd , storeCds, startDate, endDate, reporttype, weekDay) => {
  return api2.post('/MISALES/SLS06_001RPT.asmx/getWeedaySalesReport', {
    GROUP_CD    : groupCd,
    STORE_CDS   : storeCds,
    START_DATE  : startDate,
    END_DATE    : endDate,
    REPORT_TYPE : reporttype,
    WEEK_DAY    : weekDay
  });
};

export const getWeekDayList = (M_CD, LANGUAGE_CD) => {
  return api2.post('/MISALES/SLS06_001RPT.asmx/getWeekDayList', {
    M_CD        : M_CD,
    LANGUAGE_CD : LANGUAGE_CD
  });
};


