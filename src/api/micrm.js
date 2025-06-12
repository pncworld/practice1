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
