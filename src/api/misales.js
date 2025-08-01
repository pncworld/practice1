import axios from "axios";
import { commonUrl, commonUrl2 } from "./common";
import store from "@/store";

const url = commonUrl;
const url2 = commonUrl2;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 120000, // 요청 타임아웃 설정
});

api2.interceptors.request.use(
  (config) => {
    const token = store.state.StoreToken;

    config.headers["Authorization"] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api2.interceptors.response.use(
  (response) => {
    if (response.headers.authorization) {
      let newtoken = response.headers.authorization.substring(7);

      store.state.StoreToken = newtoken;
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status == 401) {
      alert("로그인 시간이 1분 이상 지났습니다. 재로그인 해주세요.");
      store.commit("clearSession");
      router.push("/");
      return new Promise(() => {});
    }
    return new Promise(() => {});
  }
);

// API 요청 메서드들
export const dailySaleReport = (
  groupCd,
  storeCd,
  startDate,
  endDate,
  strLanguage
) => {
  return api2.post("/MISALES/SLS06_004RPT.asmx/getDailySalesReport", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: "1",
    LANGUAGE: strLanguage,
  });
};

export const getReceiptDatas = (
  groupCd,
  storeCd,
  posNo,
  dtmDate,
  receiptNo,
  discountCd,
  payCd,
  strlang
) => {
  return api2.post("/MISALES/SLS02_011RPT.asmx/getReceiptDatas", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POS_NO: posNo,
    DTM_DATE: dtmDate,
    RECEIPT_NO: receiptNo,
    DISCOUNT_CD: discountCd,
    PAY_CD: payCd,
    STRLANG: strlang,
  });
};

export const getDiscountCdList = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS02_011RPT.asmx/getDiscountCdList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getpayCodeList = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS02_011RPT.asmx/getpayCodeList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getpayCodeList3 = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS02_031RPT.asmx/getpayCodeList3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getMenuCdList = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS02_031RPT.asmx/getMenuCdList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getpayCodeList2 = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS12_019RPT.asmx/getpayCodeList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getCustInfo = (groupCd, storeCd, seqId) => {
  return api2.post("/MISALES/SLS02_011RPT.asmx/getCustInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQ_ID: seqId,
  });
};
export const getOrderInfo = (groupCd, storeCd, seqId) => {
  return api2.post("/MISALES/SLS02_011RPT.asmx/getOrderInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQ_ID: seqId,
  });
};
export const getPayInfo = (groupCd, storeCd, seqId, lang) => {
  return api2.post("/MISALES/SLS02_011RPT.asmx/getPayInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEQ_ID: seqId,
    STRLANG: lang,
  });
};
export const getDailySalesReport = (
  groupCd,
  storeCds,
  startDate,
  endDate,
  reporttype,
  lang
) => {
  return api2.post("/MISALES/SLS06_004RPT.asmx/getDailySalesReport", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    LANG: lang,
  });
};

export const getDailySalesDetailReport = (
  groupCd,
  storeCds,
  startDate,
  endDate,
  reporttype,
  lang
) => {
  return api2.post("/MISALES/SLS06_004RPT.asmx/getDailySalesDetailReport", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    LANG: lang,
  });
};
export const getTimeSalesReport = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCds,
  startDate,
  endDate,
  reporttype,
  startTime,
  endTime,
  timeType,
  checkedday
) => {
  return api2.post("/MISALES/SLS06_002RPT.asmx/getTimeSalesReport", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    START_TIME: startTime,
    END_TIME: endTime,
    TIME_TYPE: timeType,
    CHECKED_DAYS: checkedday,
  });
};
export const getReceiptDataDetail = (groupCd, storeCd, startDate, endDate) => {
  return api2.post("/MISALES/SLS02_021RPT.asmx/getReceiptDataDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
  });
};
export const getRealTimeReport = (
  groupCd,
  storeCd,
  startDate,
  endDate,
  seeday,
  attr,
  team,
  supervisor
) => {
  return api2.post("/MISALES/SLS02_030RPT.asmx/getRealTimeReport", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    DAY_ON: seeday,
  });
};
export const getTableSearchCondition = (groupCd, storeCd, selectedMenuCond) => {
  return api2.post("/MISALES/SLS04_002RPT.asmx/getTableSearchCondition", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_COND: selectedMenuCond,
  });
};
export const getMenuCondition = (
  groupCd,
  storeCd,
  searchKb,
  majorCode,
  subCode
) => {
  return api2.post("/MISALES/SLS04_003RPT.asmx/getMenuCondition", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEARCH_KB: searchKb,
    MAJOR_CD: majorCode,
    SUB_CD: subCode,
  });
};
export const getSalesReportByMenu = (
  groupCd,
  storeCd,
  startDate,
  endDate,
  searchType,
  searchValue,
  reporttype,
  checkedgift,
  checklngprice,
  checkedlngprint,
  checkdays,
  checkholiday
) => {
  return api2.post("/MISALES/SLS04_002RPT.asmx/getSalesReportByMenu", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    SEARCH_TYPE: searchType,
    SEARCH_VALUE: searchValue,
    REPORT_TYPE: reporttype,
    CHECKED_GIFT: checkedgift,
    CHECKED_LNGPRICE: checklngprice,
    CHECKED_LNGPRINT: checkedlngprint,
    CHECKED_DAYS: checkdays,
    CHECKED_HOLIDAY: checkholiday,
  });
};

export const getAreaIndustrySalesReport = (
  groupCd,
  storeCds,
  startDate,
  endDate,
  reporttype,
  lang
) => {
  return api2.post("/MISALES/SLS02_014RPT.asmx/getAreaIndustrySalesReport", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    LANG: lang,
  });
};

export const getCardSalesDetailReport = (
  groupCd,
  joinType,
  superVisor,
  storeCds,
  startDate,
  endDate,
  reporttype,
  voidFlag,
  strBuyCode
) => {
  return api2.post("/MISALES/SLS05_002RPT.asmx/getCardSalesDetailReport", {
    GROUP_CD: groupCd,
    JOIN_TYPE: joinType,
    SUPERVISOR: superVisor,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    VOID_FLG: voidFlag,
    BUY_CODE: strBuyCode,
  });
};

export const getCardCorp = (groupCd, storeCds, orderBy) => {
  return api2.post("/MISALES/SLS05_002RPT.asmx/getCardCorp", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    ORDER_BY: orderBy,
  });
};

export const getCardSalesSumReport = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCds,
  startDate,
  endDate,
  reporttype,
  dateType,
  strBuyCode
) => {
  return api2.post("/MISALES/SLS05_004RPT.asmx/getCardSalesSumReport", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    DATE_TYPE: dateType,
    BUY_CODE: strBuyCode,
  });
};

export const getSalesCloseMaxDate = (groupCd) => {
  return api2.post("/MISALES/SLS05_004RPT.asmx/getSalesCloseMaxDate", {
    GROUP_CD: groupCd,
  });
};

export const getWeedaySalesReport = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCds,
  startDate,
  endDate,
  reporttype,
  weekDay
) => {
  return api2.post("/MISALES/SLS06_001RPT.asmx/getWeedaySalesReport", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    WEEK_DAY: weekDay,
  });
};

export const getWeekDayList = (M_CD, LANGUAGE_CD) => {
  return api2.post("/MISALES/SLS06_001RPT.asmx/getWeekDayList", {
    M_CD: M_CD,
    LANGUAGE_CD: LANGUAGE_CD,
  });
};
export const getSalesReportByMenuAndPayType = (
  groupCd,
  storeCds,
  startDate,
  endDate,
  reporttype,
  menu,
  submenu,
  subsubmenu
) => {
  return api2.post(
    "/MISALES/SLS04_003RPT.asmx/getSalesReportByMenuAndPayType",
    {
      GROUP_CD: groupCd,
      STORE_CDS: storeCds,
      START_DATE: startDate,
      END_DATE: endDate,
      REPORT_TYPE: reporttype,
      MENU: menu,
      SUB_MENU: submenu,
      SUB_SUB_MENU: subsubmenu,
    }
  );
};
export const getSalesDatabyTimeAndMenu = (
  groupCd,
  storeCds,
  startDate,
  endDate,
  reporttype,
  menu,
  submenu,
  subsubmenu,
  searchText,
  checkdate,
  loginlang,
  selectedguest
) => {
  return api2.post("/MISALES/SLS04_004RPT.asmx/getSalesDatabyTimeAndMenu", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    MENU: menu,
    SUB_MENU: submenu,
    SUB_SUB_MENU: subsubmenu,
    SEARCH_TEXT: searchText,
    CHECKED_DATE: checkdate,
    STR_LANG: loginlang,
    GUEST: selectedguest,
  });
};
export const getPrevYearComparison = (
  groupCd,
  attr,
  team,
  supervisor,
  storeCd,
  dtmdate1,
  dtmdate2,
  salesflag
) => {
  return api2.post("/MISALES/SLS06_005RPT.asmx/getPrevYearComparison", {
    GROUP_CD: groupCd,
    ATTR: attr,
    TEAM: team,
    SUPERVISOR: supervisor,
    STORE_CD: storeCd,
    DTM_DATE1: dtmdate1,
    DTM_DATE2: dtmdate2,
    SALES_FLAG: salesflag,
  });
};
export const getSalesDayReport = (
  groupCd,
  storeCd,
  dtmdate1,
  dtmdate2,
  bill,
  lang
) => {
  return api2.post("/MISALES/SLS02_017RPT.asmx/getSalesDayReport", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: dtmdate1,
    END_DATE: dtmdate2,
    SHOW_BILL: bill,
    LOGIN_LANG: lang,
  });
};
export const getSalesDayReportByPos = (
  groupCd,
  storeCd,
  dtmdate1,
  dtmdate2,
  bill,
  lang,
  posNo
) => {
  return api2.post("/MISALES/SLS02_028RPT.asmx/getSalesDayReportByPos", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: dtmdate1,
    END_DATE: dtmdate2,
    SHOW_BILL: bill,
    LOGIN_LANG: lang,
    POS_NO: posNo,
  });
};
export const getSalesDatabyMonth = (
  groupCd,
  storeCds,
  dtmdate1,
  dtmdate2,
  reportType
) => {
  return api2.post("/MISALES/SLS06_003RPT.asmx/getSalesDatabyMonth", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCds,
    START_DATE: dtmdate1,
    END_DATE: dtmdate2,
    REPORT_TYPE: reportType,
  });
};
export const getCauseList = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS08_001RPT.asmx/getCauseList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getCauseListbyMenu = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS08_002RPT.asmx/getCauseListbyMenu", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getSalesCancelData = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startDate,
  endDate,
  reporttype,
  cause
) => {
  return api2.post("/MISALES/SLS08_001RPT.asmx/getSalesCancelData", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    CAUSE: cause,
  });
};
export const getMenusCancelData = (
  groupCd,
  storeattr,
  storeCd,
  startDate,
  endDate,
  reporttype,
  cause
) => {
  return api2.post("/MISALES/SLS08_002RPT.asmx/getMenusCancelData", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    CAUSE: cause,
  });
};
export const getItemsCancelData = (
  groupCd,
  storeattr,
  storeCd,
  startDate,
  endDate,
  reporttype,
  cause
) => {
  return api2.post("/MISALES/SLS08_003RPT.asmx/getItemsCancelData", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    CAUSE: cause,
  });
};
export const getSalesChangeData = (
  groupCd,
  storeattr,
  storeteam,
  storeSupervisor,
  storeCd,
  startDate,
  endDate,
  reporttype,
  cause
) => {
  return api2.post("/MISALES/SLS08_004RPT.asmx/getSalesChangeData", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storeSupervisor,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    CAUSE: cause,
  });
};
export const getSalesChangeDetailData = (
  groupCd,
  storeattr,
  storeteam,
  storeSupervisor,
  storeCd,
  startDate,
  endDate,
  reporttype,
  cause
) => {
  return api2.post("/MISALES/SLS08_004RPT.asmx/getSalesChangeDetailData", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storeSupervisor,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    CAUSE: cause,
  });
};
export const getPastSalesChanges = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startDate,
  endDate,
  reporttype,
  cause
) => {
  return api2.post("/MISALES/SLS08_005RPT.asmx/getPastSalesChanges", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
    CAUSE: cause,
  });
};
export const getSalesByTimeAndSeats = (
  groupCd,
  storeattr,
  storeCd,
  startDateTime,
  endDateTime
) => {
  return api2.post("/MISALES/SLS11_006RPT.asmx/getSalesByTimeAndSeats", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_CD: storeCd,
    START_DATETIME: startDateTime,
    END_DATETIME: endDateTime,
  });
};

export const getSalesByPaymentTypeReport = (
  groupCd,
  storeCd,
  startDate,
  endDate,
  reporttype
) => {
  return api2.post("/MISALES/SLS11_007RPT.asmx/getSalesByPaymentTypeReport", {
    GROUP_CD: groupCd,
    STORE_CDS: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
  });
};
export const getSalesbySeats = (
  groupCd,
  storeattr,
  storeCd,
  startDate,
  endDate,
  selectday,
  selectstore
) => {
  return api2.post("/MISALES/SLS11_013RPT.asmx/getSalesbySeats", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_CD: storeCd,
    START_DATE: startDate,
    END_DATE: endDate,
    SELECT_DAY: selectday,
    SELECT_STORE: selectstore,
  });
};
export const getCustomerList = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS11_009RPT.asmx/getCustomerList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getSalesbyCustomer = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  reporttype,
  cust
) => {
  return api2.post("/MISALES/SLS11_009RPT.asmx/getSalesbyCustomer", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: reporttype,
    CUSTOMER: cust,
  });
};
export const getSalesbyOrders = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  reporttype
) => {
  return api2.post("/MISALES/SLS11_012RPT.asmx/getSalesbyOrders", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: reporttype,
  });
};
export const getSalesByBuyType = (
  groupCd,
  storeattr,
  storeCd,
  startdate,
  enddate
) => {
  return api2.post("/MISALES/SLS11_014RPT.asmx/getSalesByBuyType", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getDiscountCodes = (groupCd, storeCd) => {
  return api2.post("/MISALES/SLS11_004RPT.asmx/getDiscountCodes", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getDiscountRecords = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  discount
) => {
  return api2.post("/MISALES/SLS11_004RPT.asmx/getDiscountRecords", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    DISCOUNT_CODE: discount,
  });
};
export const getCashReceiptDetail = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  cond,
  cond2
) => {
  return api2.post("/MISALES/SLS11_008RPT.asmx/getCashReceiptDetail", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    CONDITION: cond,
    CONDITION2: cond2,
  });
};
export const getReportybyCashReceipt = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  reporttype,
  cond2
) => {
  return api2.post("/MISALES/SLS12_011RPT.asmx/getReportybyCashReceipt", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: reporttype,
    CONDITION2: cond2,
  });
};
export const getSalesDetail = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  cond2
) => {
  return api2.post("/MISALES/SLS12_019RPT.asmx/getSalesDetail", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    CONDITION: cond2,
  });
};
export const getVATInfo = (groupCd, storeCd, startdate, enddate) => {
  return api2.post("/MISALES/SLS14_032RPT.asmx/getVATInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getPlanbyTime = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  selecedate,
  bit
) => {
  return api2.post("/MISALES/SLS01_091RPT.asmx/getPlanbyTime", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    DATE: selecedate,
    BIT: bit,
  });
};
export const getSalesbyDateAndMonth = (
  groupCd,
  storeCd,
  startdate,
  enddate,
  reporttype,
  cardno,
  empcode,
  empname,
  custdeptname,
  custcompname,
  custstatus,
  posno
) => {
  return api2.post("/MISALES/SLS02_006RPT.asmx/getSalesbyDateAndMonth", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: reporttype,
    CARD_NO: cardno,
    EMP_CODE: empcode,
    EMP_NAME: empname,
    CUST_DEPT_NAME: custdeptname,
    CUST_COMP_NAME: custcompname,
    CUST_STATUS: custstatus,
    POS_NO: posno,
  });
};
export const getSalesbyPostPay = (
  groupCd,
  storeCd,
  startdate,
  enddate,
  cond,
  cardno,
  empcode,
  empname,
  custdeptname,
  custcompname,
  custstatus,
  posno
) => {
  return api2.post("/MISALES/SLS02_022RPT.asmx/getSalesbyPostPay", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: cond,
    CARD_NO: cardno,
    EMP_CODE: empcode,
    EMP_NAME: empname,
    CUST_DEPT_NAME: custdeptname,
    CUST_COMP_NAME: custcompname,
    CUST_STATUS: custstatus,
    POS_NO: posno,
  });
};
export const getCondition4List = (groupCd, storeCd, cond) => {
  return api2.post("/MISALES/SLS02_022RPT.asmx/getCondition4List", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SEARCH_TYPE: cond,
  });
};

export const getPlanbyDays = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  cond,
  cond2
) => {
  return api2.post("/MISALES/SLS01_092RPT.asmx/getPlanbyDays", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    CONDITON: cond,
    CONDITON2: cond2,
  });
};
export const getPlanbyMonths = (
  groupCd,
  storeattr,
  storeteam,
  storesupervisor,
  storeCd,
  startdate,
  enddate,
  cond,
  cond2
) => {
  return api2.post("/MISALES/SLS01_093RPT.asmx/getPlanbyMonths", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeattr,
    STORE_TEAM: storeteam,
    STORE_SUPERVISOR: storesupervisor,
    STORE_CD: storeCd,
    START_DATE: startdate,
    END_DATE: enddate,
    CONDITON: cond,
    CONDITON2: cond2,
  });
};

export const getStoreCorner = (groupCd, position, storeCd, areacd) => {
  return api2.post("/MISALES/SLS01_055RPT.asmx/getStoreCorner", {
    GROUP_CD: groupCd,
    POSITION: position,
    STORE_CD: storeCd,
    AREA_CD: areacd,
  });
};
export const getSalesByCorner = (
  groupCd,
  storeCd,
  areacd,
  startdate,
  enddate,
  reporttype
) => {
  return api2.post("/MISALES/SLS01_055RPT.asmx/getSalesByCorner", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areacd,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: reporttype,
  });
};
export const getSalesByCornerPayType = (
  groupCd,
  storeCd,
  areacd,
  startdate,
  enddate,
  reporttype
) => {
  return api2.post("/MISALES/SLS01_056RPT.asmx/getSalesByCornerPayType", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areacd,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: reporttype,
  });
};
export const getReceiptbyCorner = (
  groupCd,
  storeCd,
  areaCd,
  posNo,
  date,
  receiptno,
  discountcd,
  paycd,
  loggined
) => {
  return api2.post("/MISALES/SLS01_057RPT.asmx/getReceiptbyCorner", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POS_NO: posNo,
    DATE: date,
    RECEIPT_NO: receiptno,
    DISCOUNT_CD: discountcd,
    PAY_CD: paycd,
    LOGIN_LANG: loggined,
  });
};
export const getDynamicGrid = (groupCd, count) => {
  return api2.post("/MISALES/SLS02_023RPT.asmx/getDynamicGrid", {
    GROUP_CD: groupCd,
    COUNT: count,
  });
};

export const getJoinType = (groupCd, count) => {
  return api2.post("/MISALES/SLS02_023RPT.asmx/getJoinType", {
    GROUP_CD: groupCd,
    CODE: count,
  });
};
export const getStoreArea = (groupCd, count) => {
  return api2.post("/MISALES/SLS02_023RPT.asmx/getStoreArea", {
    GROUP_CD: groupCd,
    CODE: count,
  });
};
export const getSubLease = (groupCd, count) => {
  return api2.post("/MISALES/SLS02_023RPT.asmx/getSubLease", {
    GROUP_CD: groupCd,
    CODE: count,
  });
};
export const isDynamicGrid = (groupCd) => {
  return api2.post("/MISALES/SLS02_023RPT.asmx/isDynamicGrid", {
    GROUP_CD: groupCd,
  });
};
export const getDaySalesReport2 = (
  groupCd,
  storeCd,
  reportday,
  compday,
  compday2,
  reportday_1,
  compday_1,
  compday2_1
) => {
  return api2.post("/MISALES/SLS07_006INS.asmx/getDaySalesReport2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    REPORT_DAY: reportday,
    COMP_DAY: compday,
    COMP_DAY2: compday2,
    REPORT_DAY_1: reportday_1,
    COMP_DAY_1: compday_1,
    COMP_DAY2_1: compday2_1,
  });
};
export const getSalesByPaymentType2Report = (
  groupCd,
  storecds,
  startdate,
  enddate,
  reporttype,
  gridtype,
  reporttype2,
  itemvalue,
  lngcnt
) => {
  return api2.post("/MISALES/SLS02_023RPT.asmx/getSalesByPaymentType2Report", {
    GROUP_CD: groupCd,
    STORE_CDS: storecds,
    START_DATE: startdate,
    END_DATE: enddate,
    REPORT_TYPE: reporttype,
    GRID_TYPE: gridtype,
    REPORT_TYPE2: reporttype2,
    ITEM_VALUE: itemvalue,
    LNG_CNT: lngcnt,
  });
};

export const getProjByMonth = (groupCd, storecd, startdate) => {
  return api2.post("/MISALES/SLS01_001INS.asmx/getProjByMonth", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DTM_DATE: startdate,
  });
};

export const saveExcelDataPlan = (groupCd, storecd, date, proj, comment) => {
  return api2.post("/MISALES/SLS01_001INS.asmx/saveExcelDataPlan", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DTM_DATE: date,
    PROJ: proj,
    COMMENT: comment,
  });
};
export const getReceiptDetailStatus = (
  groupCd,
  storecd,
  paycd,
  menucd,
  selectedstartDate,
  selectedendDate
) => {
  return api2.post("/MISALES/SLS02_031RPT.asmx/getReceiptDetailStatus", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    PAY_CD: paycd,
    MENU_CD: menucd,
    START_DATE: selectedstartDate,
    END_DATE: selectedendDate,
  });
};
export const saveDailyReportComments = (
  groupCd,
  storecd,
  reportday,
  comment
) => {
  return api2.post("/MISALES/SLS07_006INS.asmx/saveDailyReportComments", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    REPORT_DAY: reportday,
    COMMENT: comment,
  });
};
export const sendSMS = (
  groupCd,
  storecd,
  strtitle,
  comment,
  smstype,
  strfile,
  strreserve,
  strrevdate,
  strrevtime,
  strsender,
  strrecv,
  userid,
  userip
) => {
  return api2.post("/MISALES/SLS07_006INS.asmx/sendSMS", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    STRTITLE: strtitle,
    COMMENT: comment,
    SMSTYPE: smstype,
    STRFILE: strfile,
    STRRESERVE: strreserve,
    STRREVDATE: strrevdate,
    STRREVTIME: strrevtime,
    STRSENDER: strsender,
    STRRECV: strrecv,
    USER_ID: userid,
    USER_IP: userip,
  });
};

export const getSalesReportbyAmount = (
  groupCd,
  jointype,
  team,
  supervisor,
  storecd,
  sdate,
  edate,
  reporttype,
  amountNum
) => {
  return api2.post("/MISALES/SLS11_010RPT.asmx/getSalesReportbyAmount", {
    GROUP_CD: groupCd,
    JOIN_TYPE: jointype,
    TEAM: team,
    SUPERVISOR: supervisor,
    STORE_CD: storecd,
    SDATE: sdate,
    EDATE: edate,
    REPORT_TYPE: reporttype,
    AMOUNTNUM: amountNum,
  });
};
export const getSalesReportbyManager = (
  groupCd,
  jointype,
  team,
  supervisor,
  storecd,
  sdate,
  edate,
  reporttype,
  oper
) => {
  return api2.post("/MISALES/SLS11_011RPT.asmx/getSalesReportbyManager", {
    GROUP_CD: groupCd,
    JOIN_TYPE: jointype,
    TEAM: team,
    SUPERVISOR: supervisor,
    STORE_CD: storecd,
    SDATE: sdate,
    EDATE: edate,
    REPORT_TYPE: reporttype,
    OPERATOR: oper,
  });
};

export const getReceiptbyCorner2 = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4
) => {
  return api2.post("/MISALES/SLS02_032RPT.asmx/getReceiptbyCorner2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: cond,
    DATE: cond2,
    POS_NO: cond3,
    RECEIPT_NO: cond4,
  });
};
export const getSalesByCornerMenu = (
  groupCd,
  storeCd,
  cond,
  cond2,
  cond3,
  cond4
) => {
  return api2.post("/MISALES/SLS04_027RPT.asmx/getSalesByCornerMenu", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: cond,
    SDATE: cond2,
    EDATE: cond3,
    REPORT_TYPE: cond4,
  });
};
export const getSalesByCornerMenu2 = (groupCd, cond, storeCd, cond2) => {
  return api2.post("/MISALES/SLS04_027RPT.asmx/getSalesByCornerMenu2", {
    GROUP_CD: groupCd,
    TYPE: cond,
    STORE_CD: storeCd,
    CORNER_CD: cond2,
  });
};
export const getOrderStatus = (groupCd, storeCd, sdate, edate, cond) => {
  return api2.post("/MISALES/SLS11_024RPT.asmx/getOrderStatus", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    COND: cond,
  });
};

export const getMenuDistinct = (groupCd, storeCd, cond) => {
  return api2.post("/MISALES/SLS04_023RPT.asmx/getMenuDistinct", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    COND: cond,
  });
};
export const getMenuEngineer = (
  groupCd,
  sdate,
  edate,
  cond,
  cond2,
  cond3,
  cond4
) => {
  return api2.post("/MISALES/SLS04_023RPT.asmx/getMenuEngineer", {
    GROUP_CD: groupCd,
    SDATE: sdate,
    EDATE: edate,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
  });
};
