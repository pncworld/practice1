
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
export const getSalesReportByMenuAndPayType = (groupCd ,storeCds , startDate , endDate , reporttype , menu, submenu , subsubmenu) => {
  return api2.post('/MISALES/SLS04_003RPT.asmx/getSalesReportByMenuAndPayType', {
    GROUP_CD    : groupCd,
    STORE_CDS   : storeCds,
    START_DATE  : startDate,
    END_DATE    : endDate,
    REPORT_TYPE : reporttype,
    MENU        : menu ,
    SUB_MENU    : submenu ,
    SUB_SUB_MENU: subsubmenu ,
  });
};
export const getSalesDatabyTimeAndMenu = (groupCd ,storeCds , startDate , endDate , reporttype , menu, submenu , subsubmenu ,searchText ,checkdate , loginlang , selectedguest) => {
  return api2.post('/MISALES/SLS04_004RPT.asmx/getSalesDatabyTimeAndMenu', {
    GROUP_CD    : groupCd,
    STORE_CDS   : storeCds,
    START_DATE  : startDate,
    END_DATE    : endDate,
    REPORT_TYPE : reporttype,
    MENU        : menu ,
    SUB_MENU    : submenu ,
    SUB_SUB_MENU: subsubmenu ,
    SEARCH_TEXT : searchText , 
    CHECKED_DATE :  checkdate,
    STR_LANG  :loginlang ,
    GUEST : selectedguest

  });
};
export const getPrevYearComparison = (groupCd , attr, team , supervisor , storeCd , dtmdate1 , dtmdate2 , salesflag ) => {
  return api2.post('/MISALES/SLS06_005RPT.asmx/getPrevYearComparison', {
    GROUP_CD    : groupCd,
    ATTR       : attr,
    TEAM       : team,
    SUPERVISOR : supervisor,
    STORE_CD   : storeCd,
    DTM_DATE1  : dtmdate1,
    DTM_DATE2  : dtmdate2,
    SALES_FLAG : salesflag,

  });
};
export const getSalesDayReport = (groupCd ,storeCd , dtmdate1 , dtmdate2 , bill , lang ) => {
  return api2.post('/MISALES/SLS02_017RPT.asmx/getSalesDayReport', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd,
    START_DATE  : dtmdate1,
    END_DATE  : dtmdate2,
    SHOW_BILL : bill,
    LOGIN_LANG : lang

  });
};
export const getSalesDayReportByPos = (groupCd ,storeCd , dtmdate1 , dtmdate2 , bill , lang ,posNo ) => {
  return api2.post('/MISALES/SLS02_028RPT.asmx/getSalesDayReportByPos', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd,
    START_DATE  : dtmdate1,
    END_DATE  : dtmdate2,
    SHOW_BILL : bill,
    LOGIN_LANG : lang ,
    POS_NO : posNo

  });
};
export const getSalesDatabyMonth = (groupCd ,storeCds , dtmdate1 , dtmdate2 , reportType  ) => {
  return api2.post('/MISALES/SLS06_003RPT.asmx/getSalesDatabyMonth', {
    GROUP_CD    : groupCd,
    STORE_CDS    : storeCds,
    START_DATE  : dtmdate1,
    END_DATE  : dtmdate2,
    REPORT_TYPE : reportType

  });
};
export const getCauseList = (groupCd ,storeCd  ) => {
  return api2.post('/MISALES/SLS08_001RPT.asmx/getCauseList', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd


  });
};
export const getCauseListbyMenu = (groupCd ,storeCd  ) => {
  return api2.post('/MISALES/SLS08_002RPT.asmx/getCauseListbyMenu', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd


  });
};
export const getSalesCancelData = (groupCd ,storeCd , startDate, endDate , reporttype , cause  ) => {
  return api2.post('/MISALES/SLS08_001RPT.asmx/getSalesCancelData', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd ,
    START_DATE :  startDate,
    END_DATE : endDate  ,
    REPORT_TYPE :  reporttype ,
    CAUSE : cause,


  });
};
export const getMenusCancelData = (groupCd ,storeCd , startDate, endDate , reporttype , cause  ) => {
  return api2.post('/MISALES/SLS08_002RPT.asmx/getMenusCancelData', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd ,
    START_DATE :  startDate,
    END_DATE : endDate  ,
    REPORT_TYPE :  reporttype ,
    CAUSE : cause,


  });
};
export const getItemsCancelData = (groupCd ,storeCd , startDate, endDate , reporttype , cause  ) => {
  return api2.post('/MISALES/SLS08_003RPT.asmx/getItemsCancelData', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd ,
    START_DATE :  startDate,
    END_DATE : endDate  ,
    REPORT_TYPE :  reporttype ,
    CAUSE : cause,


  });
};
export const getSalesChangeData = (groupCd ,storeCd , startDate, endDate , reporttype , cause  ) => {
  return api2.post('/MISALES/SLS08_004RPT.asmx/getSalesChangeData', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd ,
    START_DATE :  startDate,
    END_DATE : endDate  ,
    REPORT_TYPE :  reporttype ,
    CAUSE : cause,


  });
};
export const getSalesChangeDetailData = (groupCd ,storeCd , startDate, endDate , reporttype , cause  ) => {
  return api2.post('/MISALES/SLS08_004RPT.asmx/getSalesChangeDetailData', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd ,
    START_DATE :  startDate,
    END_DATE : endDate  ,
    REPORT_TYPE :  reporttype ,
    CAUSE : cause,


  });
};
export const getPastSalesChanges = (groupCd ,storeCd , startDate, endDate , reporttype , cause  ) => {
  return api2.post('/MISALES/SLS08_005RPT.asmx/getPastSalesChanges', {
    GROUP_CD    : groupCd,
    STORE_CD   : storeCd ,
    START_DATE :  startDate,
    END_DATE : endDate  ,
    REPORT_TYPE :  reporttype ,
    CAUSE : cause,


  });
};


