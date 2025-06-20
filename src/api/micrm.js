import axios from "axios";
import store from "@/store";
import { commonUrl, commonUrl2 } from "./common";

const url = commonUrl;
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: url, // API 기본 URL
  timeout: 10000, // 요청 타임아웃 설정
});
export const url2 = commonUrl2;
const api2 = axios.create({
  baseURL: url2, // API 기본 URL
  timeout: 100000, // 요청 타임아웃 설정
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

export const getCustCompany = (groupCd, storecd, positiontype) => {
  return api2.post("/MICRM/CRM20_005RPT.asmx/getCustCompany", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    LNG_POSITION: positiontype,
  });
};
export const getBelongCust = (custcode, searchword, type) => {
  return api2.post("/MICRM/CRM20_005RPT.asmx/getBelongCust", {
    CUST_CD: custcode,
    SEARCHWORD: searchword,
    TYPE: type,
  });
};
export const getBelongCustList = (custcode, custid, condvalue) => {
  return api2.post("/MICRM/CRM20_005RPT.asmx/getBelongCustList", {
    CUST_CD: custcode,
    CUST_ID: custid,
    COND_VALUE: condvalue,
  });
};
export const getBalancebyCust = (
  custcode,
  custid,
  condvalue,
  startdate,
  enddate
) => {
  return api2.post("/MICRM/CRM20_006RPT.asmx/getBalancebyCust", {
    CUST_CD: custcode,
    CUST_ID: custid,
    COND_VALUE: condvalue,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getBalancebyCustAndDate = (
  custcode,
  custid,
  startdate,
  enddate,
  cond,
  cond2
) => {
  return api2.post("/MICRM/CRM20_007RPT.asmx/getBalancebyCustAndDate", {
    CUST_CD: custcode,
    CUST_ID: custid,
    START_DATE: startdate,
    END_DATE: enddate,
    COND: cond,
    COND2: cond2,
  });
};
export const getBalancebyReceipt = (
  custcode,
  custid,
  startdate,
  enddate,
  cond,
  groupcd,
  lngattr,
  storecd
) => {
  return api2.post("/MICRM/CRM20_009RPT.asmx/getBalancebyReceipt", {
    CUST_CD: custcode,
    CUST_ID: custid,
    START_DATE: startdate,
    END_DATE: enddate,
    COND: cond,
    GROUP_CD: groupcd,
    ATTR: lngattr,
    STORE_CD: storecd,
  });
};
export const getBelongCustListbyCorner = (
  groupcd,
  storecd,
  areacd,
  custid,
  custtype,
  cond
) => {
  return api2.post("/MICRM/CRM20_010RPT.asmx/getBelongCustListbyCorner", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    AREA_CD: areacd,
    CUST_ID: custid,
    CUST_TYPE: custtype,
    COND: cond,
  });
};
export const getBalancebyAccount = (storecd, custid) => {
  return api2.post("/MICRM/CRM20_012INS.asmx/getBalancebyAccount", {
    STORE_CD: storecd,
    CUST_ID: custid,
  });
};
export const getPrePaidbyAccount = (storecd, custid, sd, ed, cond) => {
  return api2.post("/MICRM/CRM20_013RPT.asmx/getPrePaidbyAccount", {
    STORE_CD: storecd,
    CUST_ID: custid,
    START_DATE: sd,
    END_DATE: ed,
    COND: cond,
  });
};
export const getReservedChangeHistory = (
  groupcd,
  storecd,
  startdate,
  enddate,
  cond,
  cond2
) => {
  return api2.post("/MICRM/CRM10_021RPT.asmx/getReservedChangeHistory", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
    COND: cond,
    COND2: cond2,
  });
};
export const getReservedSearch = (
  groupcd,
  storecd,
  startdate,
  enddate,
  status,
  cond,
  cond2
) => {
  return api2.post("/MICRM/CRM10_022RPT.asmx/getReservedSearch", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
    STATUS: status,
    COND: cond,
    COND2: cond2,
  });
};
export const getReservedSearchByDays = (
  groupcd,
  storecd,
  startdate,
  enddate
) => {
  return api2.post("/MICRM/CRM10_023RPT.asmx/getReservedSearchByDays", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getReservedDetail = (groupcd, storecd, startdate, cond, cond2) => {
  return api2.post("/MICRM/CRM10_024RPT.asmx/getReservedDetail", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    COND: cond,
    COND2: cond2,
  });
};
export const getReservedDetail2 = (
  groupcd,
  storecd,
  startdate,
  cond,
  cond2
) => {
  return api2.post("/MICRM/CRM10_024RPT.asmx/getReservedDetail2", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    COND: cond,
    COND2: cond2,
  });
};
export const getReservedCustomorSearch = (
  groupcd,
  storecd,
  startdate,
  enddate,
  status,
  cond,
  cond2
) => {
  return api2.post("/MICRM/CRM10_025RPT.asmx/getReservedCustomorSearch", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
    STATUS: status,
    COND: cond,
    COND2: cond2,
  });
};
export const getReservedTimeTable = (groupcd, storecd) => {
  return api2.post("/MICRM/CRM10_007INS_shy.asmx/getReservedTimeTable", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
  });
};
export const getReservedNum = (groupcd, storecd) => {
  return api2.post("/MICRM/CRM10_019INS.asmx/getReservedNum", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
  });
};
export const getReserveTeamTable = (groupcd, storecd) => {
  return api2.post("/MICRM/CRM10_020INS.asmx/getReserveTeamTable", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
  });
};
export const getCustInfo2 = (groupcd, option, word) => {
  return api2.post("/MICRM/CRM02_002RPT.asmx/getCustInfo2", {
    GROUP_CD: groupcd,
    OPTION: option,
    WORD: word,
  });
};
export const getCustRecord = (
  groupcd,
  searchNum,
  sdate,
  edate,
  cond,
  cond2
) => {
  return api2.post("/MICRM/CRM02_002RPT.asmx/getCustRecord", {
    GROUP_CD: groupcd,
    SEARCHNUM: searchNum,
    START_DATE: sdate,
    END_DATE: edate,
    COND: cond,
    COND2: cond2,
  });
};
export const getCustPointInfo = (groupcd, cond) => {
  return api2.post("/MICRM/CRM02_002RPT.asmx/getCustPointInfo", {
    GROUP_CD: groupcd,
    COND: cond,
  });
};
export const getReceiptDataDetail2 = (groupcd, storecd, receiptNo) => {
  return api2.post("/MICRM/CRM02_002RPT.asmx/getReceiptDataDetail2", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    RECEIPT_NO: receiptNo,
  });
};
export const getCustBuyList = (
  groupcd,
  jointype,
  teamcode,
  supervisor,
  storecd,
  sdate,
  edate,
  pointcls
) => {
  return api2.post("/MICRM/CRM03_002INS.asmx/getCustBuyList", {
    GROUP_CD: groupcd,
    JOIN_TYPE: jointype,
    TEAM_CD: teamcode,
    SUPERVISOR: supervisor,
    STORE_CD: storecd,
    START_DATE: sdate,
    END_DATE: edate,
    POINT_CLS: pointcls,
  });
};
export const saveReserveTimeTable = (
  groupcd,
  storecd,
  holiday,
  rsvtype,
  rsvtime,
  rsvhour,
  dtmrsvtime,
  lngactive,
  update
) => {
  return api2.post("/MICRM/CRM10_007INS_shy.asmx/saveReserveTimeTable", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    COND1: holiday,
    COND2: rsvtype,
    COND3: rsvtime,
    COND4: rsvhour,
    COND5: dtmrsvtime,
    COND6: lngactive,
    UPDATE: update,
  });
};
export const saveReserveNum = (
  groupcd,
  storecd,
  holiday,
  rsvtype,
  rsvtime,
  max,
  update
) => {
  return api2.post("/MICRM/CRM10_019INS.asmx/saveReserveNum", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    COND1: holiday,
    COND2: rsvtype,
    COND3: rsvtime,
    COND4: max,
    UPDATE: update,
  });
};
export const saveReserveTeamTable = (
  groupcd,
  storecd,
  cond1,
  cond2,
  cond3,
  cond4,
  update
) => {
  return api2.post("/MICRM/CRM10_020INS.asmx/saveReserveTeamTable", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    COND1: cond1,
    COND2: cond2,
    COND3: cond3,
    COND4: cond4,
    UPDATE: update,
  });
};
export const getInitDataCustPurchase = (groupcd) => {
  return api2.post("/MICRM/CRM03_012RPT.asmx/getInitDataCustPurchase", {
    GROUP_CD: groupcd,
  });
};
export const getCustBuyAggList = (
  groupcd,
  storeCd,
  jointype,
  supervisor,
  teamCd,
  sdate,
  edate,
  level,
  reporttype
) => {
  return api2.post("/MICRM/CRM03_012RPT.asmx/getCustBuyAggList", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    JOIN_TYPE: jointype,
    SUPER: supervisor,
    TEAM: teamCd,
    SDATE: sdate,
    EDATE: edate,
    LEVEL: level,
    REPORT_TYPE: reporttype,
  });
};
export const getCustBuyDetailList = (
  groupcd,
  storeCd,
  jointype,
  supervisor,
  teamCd,
  sdate,
  edate,
  level,
  cond2
) => {
  return api2.post("/MICRM/CRM03_011RPT.asmx/getCustBuyDetailList", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    JOIN_TYPE: jointype,
    SUPER: supervisor,
    TEAM: teamCd,
    SDATE: sdate,
    EDATE: edate,
    LEVEL: level,
    COND2: cond2,
  });
};
export const getCustCardDisList = (
  groupcd,
  storeCd,
  jointype,
  teamCd,
  supervisor,
  sdate,
  edate,
  cond
) => {
  return api2.post("/MICRM/CRM03_004INS.asmx/getCustCardDisList", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    JOIN_TYPE: jointype,
    SUPER: supervisor,
    TEAM: teamCd,
    SDATE: sdate,
    EDATE: edate,
    COND: cond,
  });
};
export const getCustPointAnalyInfo = (
  groupcd,
  storeCd,
  sdate,
  edate,
  area,
  attr,
  team,
  supervisor,
  sex,
  sdate2,
  edate2,
  sdate3,
  edate3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9,
  cond3
) => {
  return api2.post("/MICRM/CRM03_008RPT.asmx/getCustPointAnalyInfo", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    AREA: area,
    JOINTYPE: attr,
    TEAM: team,
    SUPERVISOR: supervisor,
    SEX: sex,
    SDATE2: sdate2,
    EDATE2: edate2,
    SDATE3: sdate3,
    EDATE3: edate3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
    COND7: cond7,
    COND8: cond8,
    COND9: cond9,
    COND3: cond3,
  });
};

export const getInitCouponType = (groupcd) => {
  return api2.post("/MICRM/CRM03_009RPT.asmx/getInitCouponType", {
    GROUP_CD: groupcd,
  });
};

export const getCustCouponAnalyInfo = (
  groupcd,
  storeCd,
  sdate,
  edate,
  area,
  attr,
  team,
  supervisor,
  sex,
  sdate2,
  edate2,
  sdate3,
  edate3,
  cond4,
  cond5,
  cond6
) => {
  return api2.post("/MICRM/CRM03_009RPT.asmx/getCustCouponAnalyInfo", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    AREA: area,
    JOINTYPE: attr,
    TEAM: team,
    SUPERVISOR: supervisor,
    SEX: sex,
    SDATE2: sdate2,
    EDATE2: edate2,
    SDATE3: sdate3,
    EDATE3: edate3,
    COND4: cond4,
    COND5: cond5,
    COND6: cond6,
  });
};

export const getCustMenuAnalyInfo = (
  groupcd,
  storeCd,
  sdate,
  edate,
  area,
  attr,
  team,
  supervisor,
  sex,
  sdate2,
  edate2,
  sdate3,
  edate3,
  majorgroup,
  subgroup,
  menuname,
  cond,
  cond2,
  cond3
) => {
  return api2.post("/MICRM/CRM03_010RPT.asmx/getCustMenuAnalyInfo", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    AREA: area,
    JOINTYPE: attr,
    TEAM: team,
    SUPERVISOR: supervisor,
    SEX: sex,
    SDATE2: sdate2,
    EDATE2: edate2,
    SDATE3: sdate3,
    EDATE3: edate3,
    MAJOR_GROUP: majorgroup,
    SUB_GROUP: subgroup,
    MENUNAME: menuname,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
  });
};
export const getCustDisCountList = (groupcd, storeCd, sdate, edate, cond) => {
  return api2.post("/MICRM/CRM03_034INS.asmx/getCustDisCountList", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
    COND: cond,
  });
};

export const getCustomerInfo = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9,
  cond10,
  cond11,
  cond12,
  cond13,
  cond14,
  cond15,
  cond16,
  cond17,
  cond18,
  cond19,
  cond20,
  cond21,
  cond22,
  cond23,
  cond24,
  cond25,
  cond26,
  cond27,
  cond28,
  cond29,
  cond30,
  cond31,
  cond32,
  cond33,
  cond34,
  cond35,
  cond36,
  cond37,
  cond38
) => {
  return api2.post("/MICRM/CRM01_001INS.asmx/getCustomerInfo", {
    GROUP_CD: cond,
    JOINTYPE: cond2,
    TEAM: cond3,
    SUPER: cond4,
    STORE_CD: cond5,
    CUST_NO: cond6,
    CARD_ID: cond7,
    CUSTNAME: cond8,
    JOINSTS: cond9,
    RESINO: cond10,
    BIRTHMM: cond11,
    BIRTHDD: cond12,
    MARRIED: cond13,
    SEX: cond14,
    JOBCLS: cond15,
    MOBILE: cond16,
    HOMETEL: cond17,
    HOMEADDR: cond18,
    ETCADDR: cond19,
    JOINFROM: cond20,
    JOINTO: cond21,
    FIRSTFROM: cond22,
    FIRSTTO: cond23,
    LASTFROM: cond24,
    LASTTO: cond25,
    SPOINT: cond26,
    SALEPOINT: cond27,
    RPOINT: cond28,
    REMPOINT: cond29,
    AAMT: cond30,
    ACTAMT: cond31,
    VCNT: cond32,
    VISITCNT: cond33,
    LEVEL: cond34,
    SMS: cond35,
    PRECD: cond36,
    SLEEPSTS: cond37,
    CUSTAGREE: cond38,
  });
};

export const getCustInitData = (groupcd) => {
  return api2.post("/MICRM/CRM01_001INS.asmx/getCustInitData", {
    GROUP_CD: groupcd,
  });
};

export const updateCustomerInfo = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9,
  cond10,
  cond11,
  cond12,
  cond13,
  cond14,
  cond15,
  cond16,
  cond17,
  cond18,
  cond19,
  cond20,
  cond21,
  cond22,
  cond23,
  cond24,
  cond25,
  cond26,
  cond27,
  cond28,
  cond29,
  cond30,
  cond31,
  cond32,
  cond33,
  cond34,
  cond35,
  cond36,
  cond37,
  cond38,
  cond39,
  cond40,
  cond41,
  cond42,
  cond43
) => {
  return api2.post("/MICRM/CRM01_001INS.asmx/updateCustomerInfo", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    JOIN_STS: cond3,
    USER_SEQ: cond4,
    CUST_NO: cond5,
    CUST_NM: cond6,
    CUST_ENM: cond7,
    CUST_CLS: cond8,
    SEX: cond9,
    MARRIED: cond10,
    RESNO1: cond11,
    RESNO2: cond12,
    BLNSMS: cond13,
    BLNEMAIL: cond14,
    STRMOBILE: cond15,
    STREMAIL: cond16,
    STRHOMETEL: cond17,
    STRHOMEZIP: cond18,
    STRHOMEADDR1: cond19,
    STRHOMEADDR2: cond20,
    STRETCTEL: cond21,
    STRETCZIP: cond22,
    STRETCADDR1: cond23,
    STRETCADDR2: cond24,
    DMRECV: cond25,
    SDAY_CLS: cond26,
    JOB_CLS: cond27,
    STRCOMPANY: cond28,
    JOBRANK: cond29,
    STRDEPART: cond30,
    STRBIRTHYY: cond31,
    STRBIRTHMM: cond32,
    STRBIRTHDD: cond33,
    BLNSOLAR: cond34,
    WEDDINGYY: cond35,
    WEDDINGMM: cond36,
    WEDDINGDD: cond37,
    CUSTAGREE: cond38,
    INTLEVEL: cond39,
    STRREMARK: cond40,
    INTSTOPRSN: cond41,
    DTMMANIA: cond42,
    LNGPR_CD: cond43,
  });
};
export const insertCustomerInfo = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9,
  cond10,
  cond11,
  cond12,
  cond13,
  cond14,
  cond15,
  cond16,
  cond17,
  cond18,
  cond19,
  cond20,
  cond21,
  cond22,
  cond23,
  cond24,
  cond25,
  cond26,
  cond27,
  cond28,
  cond29,
  cond30,
  cond31,
  cond32,
  cond33,
  cond34,
  cond35,
  cond36,
  cond37,
  cond38,
  cond39,
  cond40,
  cond41,
  cond42,
  cond43,
  cond44
) => {
  return api2.post("/MICRM/CRM01_001INS.asmx/insertCustomerInfo", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    JOIN_STS: cond3,
    USER_SEQ: cond4,
    CUST_NO: cond5,
    CUST_NM: cond6,
    CUST_ENM: cond7,
    CUST_CLS: cond8,
    SEX: cond9,
    MARRIED: cond10,
    RESNO1: cond11,
    RESNO2: cond12,
    BLNSMS: cond13,
    BLNEMAIL: cond14,
    STRMOBILE: cond15,
    STREMAIL: cond16,
    STRHOMETEL: cond17,
    STRHOMEZIP: cond18,
    STRHOMEADDR1: cond19,
    STRHOMEADDR2: cond20,
    STRETCTEL: cond21,
    STRETCZIP: cond22,
    STRETCADDR1: cond23,
    STRETCADDR2: cond24,
    DMRECV: cond25,
    SDAY_CLS: cond26,
    JOB_CLS: cond27,
    STRCOMPANY: cond28,
    JOBRANK: cond29,
    STRDEPART: cond30,
    STRBIRTHYY: cond31,
    STRBIRTHMM: cond32,
    STRBIRTHDD: cond33,
    BLNSOLAR: cond34,
    WEDDINGYY: cond35,
    WEDDINGMM: cond36,
    WEDDINGDD: cond37,
    CUSTAGREE: cond38,
    INTLEVEL: cond39,
    STRREMARK: cond40,
    INTSTOPRSN: cond41,
    DTMMANIA: cond42,
    LNGPR_CD: cond43,
    CARD_ID: cond44,
  });
};

export const validCardNo = (cond, cond2) => {
  return api2.post("/MICRM/CRM01_001INS.asmx/validCardNo", {
    GROUP_CD: cond,
    CARD_NO: cond2,
  });
};
export const deleteCustomors = (cond, cond2, cond3, cond4, cond5) => {
  return api2.post("/MICRM/CRM01_001INS.asmx/deleteCustomor", {
    GROUP_CDS: cond,
    CUST_NOS: cond2,
    CARD_ID: cond3,
    JOIN_STS: cond4,
    USERID: cond5,
  });
};
export const getCardChangeInfo = (cond, cond2, cond3, cond4, cond5) => {
  return api2.post("/MICRM/CRM01_008INS.asmx/getCardChangeInfo", {
    GROUP_CD: cond,
    CUST_NO: cond2,
    CARD_ID: cond3,
    CUST_NM: cond4,
    JOIN_STS: cond5,
  });
};
export const changeCardNo = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8
) => {
  return api2.post("/MICRM/CRM01_008INS.asmx/changeCardNo", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    USER_SEQ: cond3,
    CUST_NO: cond4,
    CARD_OLD: cond5,
    CARD_NEW: cond6,
    CARD_RSN: cond7,
    REASON: cond8,
  });
};
export const getCardChangeList = (cond, cond2) => {
  return api2.post("/MICRM/CRM01_008INS.asmx/getCardChangeList", {
    GROUP_CD: cond,
    CUST_NO: cond2,
  });
};

export const getStopCustList = (cond, cond2, cond3, cond4) => {
  return api2.post("/MICRM/CRM01_009RPT.asmx/getStopCustList", {
    GROUP_CD: cond,
    CUST_NO: cond2,
    S_DATE: cond3,
    E_DATE: cond4,
  });
};
export const restoreCustomor = (cond, cond2, cond3) => {
  return api2.post("/MICRM/CRM01_009RPT.asmx/restoreCustomor", {
    GROUP_CD: cond,
    CUST_NO: cond2,
    USER_ID: cond3,
  });
};
export const getRegisterCustomer = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9
) => {
  return api2.post("/MICRM/CRM01_010RPT.asmx/getRegisterCustomer", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    JOIN_TYPE: cond3,
    SUPERVISOR: cond4,
    TEAMCD: cond5,
    SDATE: cond6,
    EDATE: cond7,
    LEVEL: cond8,
    REPORT_TYPE: cond9,
  });
};
export const getMemberShipExpirePoint = (cond, cond2, cond3, cond4, cond5) => {
  return api2.post("/MICRM/CRM05_003RPT.asmx/getMemberShipExpirePoint", {
    GROUP_CD: cond,
    SDATE: cond2,
    EDATE: cond3,
    POINT: cond4,
    CUSTNO: cond5,
  });
};
export const getMemberShipExpirePoint2 = (cond, cond2, cond3, cond4, cond5) => {
  return api2.post("/MICRM/CRM05_004RPT.asmx/getMemberShipExpirePoint2", {
    GROUP_CD: cond,
    SDATE: cond2,
    EDATE: cond3,
    POINT: cond4,
    CUSTNO: cond5,
  });
};
export const getPointHistoryList = (cond, cond2, cond3) => {
  return api2.post("/MICRM/CRM05_007INS.asmx/getPointHistoryList", {
    GROUP_CD: cond,
    CUST_NO: cond2,
    CARD_ID: cond3,
  });
};
export const updateBonusPoint = (cond, cond2, cond3, cond4, cond5, cond6) => {
  return api2.post("/MICRM/CRM05_007INS.asmx/updateBonusPoint", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    CUST_NO: cond3,
    USER_ID: cond4,
    POINT: cond5,
    POINT_RSN: cond6,
  });
};
export const mergeCard = (cond, cond2, cond3, cond4, cond5, cond6, cond7) => {
  return api2.post("/MICRM/CRM05_008INS.asmx/mergeCard", {
    GROUP_CD: cond,
    CUST_NO1: cond2,
    CUST_NO2: cond3,
    CARD_NO1: cond4,
    CARD_NO2: cond5,
    USER: cond6,
    REASON: cond7,
  });
};
export const getInitGftData = (cond) => {
  return api2.post("/MICRM/CRM65_001RPT.asmx/getInitGftData", {
    GROUP_CD: cond,
  });
};
export const getGftLedgerList = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9,
  cond10
) => {
  return api2.post("/MICRM/CRM65_001RPT.asmx/getGftLedgerList", {
    GROUP_CD: cond,
    START_DATE: cond2,
    END_DATE: cond3,
    CATEGORY: cond4,
    TYPE: cond5,
    STATUS: cond6,
    CARD_NO: cond7,
    CHECK: cond8,
    START_DATE2: cond9,
    END_DATE2: cond10,
  });
};
export const getGftLedgerTradeList = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8
) => {
  return api2.post("/MICRM/CRM65_002RPT.asmx/getGftLedgerTradeList", {
    GROUP_CD: cond,
    STORE_CDS: cond2,
    COND: cond3,
    COND2: cond4,
    START_DATE: cond5,
    END_DATE: cond6,
    COND3: cond7,
    LANG: cond8,
  });
};
export const getGftLedgerTradeAggList = (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8
) => {
  return api2.post("/MICRM/CRM65_004RPT.asmx/getGftLedgerTradeAggList", {
    GROUP_CD: cond,
    STORE_CDS: cond2,
    COND: cond3,
    COND2: cond4,
    START_DATE: cond5,
    END_DATE: cond6,
    COND3: cond7,
    LANG: cond8,
  });
};

export const getDynamicGrid4 = (groupCd, count) => {
  return api2.post("/MICRM/CRM65_005RPT.asmx/getDynamicGrid4", {
    GROUP_CD: groupCd,
    COUNT: count,
  });
};
export const getGftList = (groupCd) => {
  return api2.post("/MICRM/CRM65_005RPT.asmx/getGftList", {
    GROUP_CD: groupCd,
  });
};
export const getGftCardStockList = (groupCd, cond, cond2, cond3, cond4) => {
  return api2.post("/MICRM/CRM65_005RPT.asmx/getGftCardStockList", {
    GROUP_CD: groupCd,
    STORE_CD: cond,
    START_DATE: cond2,
    END_DATE: cond3,
    COND: cond4,
  });
};
export const getGftLedgerCreateList = (groupCd, cond, cond2, cond3, cond4) => {
  return api2.post("/MICRM/CRM60_004INS.asmx/getGftLedgerCreateList", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    SDATE: cond3,
    EDATE: cond4,
  });
};
export const getGftLedgerSaleList = (groupCd, cond, cond2, cond3, cond4) => {
  return api2.post("/MICRM/CRM60_006INS.asmx/getGftLedgerSaleList", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    SDATE: cond3,
    EDATE: cond4,
  });
};
export const getCreditCompanyList = (groupCd, cond) => {
  return api2.post("/MICRM/CRM60_006INS.asmx/getCreditCompanyList", {
    GROUP_CD: groupCd,
    STORE_CD: cond,
  });
};
export const saveNewGftCard = (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6
) => {
  return api2.post("/MICRM/CRM60_004INS.asmx/saveNewGftCard", {
    GROUP_CD: groupCd,
    COND: cond,
    COND2: cond2,
    DESIGN: cond3,
    CNT: cond4,
    DATE: cond5,
    EMP_CNT: cond6,
  });
};

export const saveGftCardSaleEnroll = (
  groupCd,
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9
) => {
  return api2.post("/MICRM/CRM60_006INS.asmx/saveGftCardSaleEnroll", {
    GROUP_CD: groupCd,
    STORE_CD: cond,
    DATE: cond2,
    CARD_NO: cond3,
    CARD_NO_E: cond4,
    CCARD: cond5,
    BUYCODE: cond6,
    EMPSALE: cond7,
    STRCARD_NO: cond8,
    CARD_APPROVE_NO: cond9,
  });
};
