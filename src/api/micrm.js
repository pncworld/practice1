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
