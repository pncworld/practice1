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
  timeout: 10000, // 요청 타임아웃 설정
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

export const getPayEnroll = (groupCd) => {
  return api2.post("/MIHR/HR01_002INS.asmx/getPayEnroll", {
    GROUP_CD: groupCd,
  });
};
export const getAttType = (groupCd) => {
  return api2.post("/MIHR/HR01_003INS.asmx/getAttType", {
    GROUP_CD: groupCd,
  });
};
export const getWorkShiftList = (groupCd, storeCd) => {
  return api2.post("/MIHR/HR01_006INS.asmx/getWorkShiftList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const saveWorkShift = (groupCd, storeCd, groupNm) => {
  return api2.post("/MIHR/HR01_006INS.asmx/saveWorkShift", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    GROUP_NM: groupNm,
  });
};
export const updateWorkShift = (groupCd, storeCd, groupNm, lngcode) => {
  return api2.post("/MIHR/HR01_006INS.asmx/updateWorkShift", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    GROUP_NM: groupNm,
    LNG_CODE: lngcode,
  });
};
export const saveWorkShiftDetail = (
  groupCd,
  storeCd,
  workcode,
  stime,
  etime
) => {
  return api2.post("/MIHR/HR01_006INS.asmx/saveWorkShiftDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    WORK_CD: workcode,
    S_TIME: stime,
    E_TIME: etime,
  });
};
export const updateWorkShiftDetail = (
  groupCd,
  storeCd,
  lngcode,
  stime,
  etime
) => {
  return api2.post("/MIHR/HR01_006INS.asmx/updateWorkShiftDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LNG_CODE: lngcode,
    S_TIME: stime,
    E_TIME: etime,
  });
};
export const saveHRPay = (groupCd, strname, lngitemcls) => {
  return api2.post("/MIHR/HR01_002INS.asmx/saveHRPay", {
    GROUP_CD: groupCd,
    STRNAME: strname,
    LNGITEMCLS: lngitemcls,
  });
};
export const saveHRPay2 = (groupCd, lngcode, strname, lngitemcls) => {
  return api2.post("/MIHR/HR01_002INS.asmx/saveHRPay2", {
    GROUP_CD: groupCd,
    LNGCODE: lngcode,
    STRNAME: strname,
    LNGITEMCLS: lngitemcls,
  });
};
export const saveAttendType = (
  groupCd,
  strname,
  tylecls,
  timecls,
  settime,
  approvetime,
  inlcudeot,
  stralias
) => {
  return api2.post("/MIHR/HR01_003INS.asmx/saveAttendType", {
    GROUP_CD: groupCd,
    STRNAME: strname,
    TYPE_CLS: tylecls,
    TIME_CLS: timecls,
    SETTIME: settime,
    APPROVETIME: approvetime,
    INCLUDEOT: inlcudeot,
    ALIAS: stralias,
  });
};
export const updateAttendType = (
  groupCd,
  lngcode,
  strname,
  tylecls,
  timecls,
  settime,
  approvetime,
  inlcudeot,
  stralias
) => {
  return api2.post("/MIHR/HR01_003INS.asmx/updateAttendType", {
    GROUP_CD: groupCd,
    LNG_CODE: lngcode,
    STRNAME: strname,
    TYPE_CLS: tylecls,
    TIME_CLS: timecls,
    SETTIME: settime,
    APPROVETIME: approvetime,
    INCLUDEOT: inlcudeot,
    ALIAS: stralias,
  });
};
export const deletePayItemList = (groupCd, lngcode) => {
  return api2.post("/MIHR/HR01_002INS.asmx/deletePayItemList", {
    GROUP_CD: groupCd,
    LNGCODE: lngcode,
  });
};
export const deleteAttendTypeList = (groupCd, lngcode) => {
  return api2.post("/MIHR/HR01_003INS.asmx/deleteAttendTypeList", {
    GROUP_CD: groupCd,
    LNGCODE: lngcode,
  });
};
export const deleteWorkShifts = (groupCd, store, lngcode) => {
  return api2.post("/MIHR/HR01_006INS.asmx/deleteWorkShifts", {
    GROUP_CD: groupCd,
    STORE_CD: store,
    LNGCODE: lngcode,
  });
};
export const deleteWorkShifts2 = (groupCd, store, lngcode) => {
  return api2.post("/MIHR/HR01_006INS.asmx/deleteWorkShifts2", {
    GROUP_CD: groupCd,
    STORE_CD: store,
    LNGCODE: lngcode,
  });
};

export const getSalaryPolicy = (groupCd) => {
  return api2.post("/MIHR/HR01_004INS.asmx/getSalaryPolicy", {
    GROUP_CD: groupCd,
  });
};
export const saveSalaryPolicy = (
  groupcd,
  cond,
  cond1,
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
  cond18
) => {
  return api2.post("/MIHR/HR01_004INS.asmx/saveSalaryPolicy", {
    GROUPCD: groupcd,
    strStndName: cond,
    lngWorkType: cond1,
    lngOTPayRate: cond2,
    lngHWPayRate: cond3,
    lngNWPayRate: cond4,
    timNWStime: cond5,
    timNWETime: cond6,
    lngWHPayRate: cond7,
    lngPayAcntS: cond8,
    lngPayAcntE: cond9,
    lngPayDay: cond10,
    lngEPayDay: cond11,
    dtmApplyDate: cond12,
    timFixWorkHour: cond13,
    timLimitHourWeek: cond14,
    timLimitHourWeekAvg: cond15,
    timLimitHourDay: cond16,
    lngPeriod: cond17,
    lngPeriodCls: cond18,
  });
};
export const updateSalaryPolicy = (
  groupcd,
  cond,
  lngcode,
  cond1,
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
  cond18
) => {
  return api2.post("/MIHR/HR01_004INS.asmx/updateSalaryPolicy", {
    GROUPCD: groupcd,
    LNG_CODE: lngcode,
    strStndName: cond,
    lngWorkType: cond1,
    lngOTPayRate: cond2,
    lngHWPayRate: cond3,
    lngNWPayRate: cond4,
    timNWStime: cond5,
    timNWETime: cond6,
    lngWHPayRate: cond7,
    lngPayAcntS: cond8,
    lngPayAcntE: cond9,
    lngPayDay: cond10,
    lngEPayDay: cond11,
    dtmApplyDate: cond12,
    timFixWorkHour: cond13,
    timLimitHourWeek: cond14,
    timLimitHourWeekAvg: cond15,
    timLimitHourDay: cond16,
    lngPeriod: cond17,
    lngPeriodCls: cond18,
  });
};

export const deleteSalaryPolicy = (groupCd, lngcodes) => {
  return api2.post("/MIHR/HR01_004INS.asmx/deleteSalaryPolicy", {
    GROUP_CD: groupCd,
    LNG_CODE: lngcodes,
  });
};
export const getInitEmpContractInfo = (groupCd) => {
  return api2.post("/MIHR/HR01_005INS.asmx/getInitEmpContractInfo", {
    GROUP_CD: groupCd,
  });
};
export const getEmpContractList = (
  groupCd,
  storecd,
  option,
  loption,
  sdate,
  edate,
  soption,
  sword
) => {
  return api2.post("/MIHR/HR01_005INS.asmx/getEmpContractList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    PAYANDCODE: option,
    LOPTION: loption,
    FROMDATE: sdate,
    TODATE: edate,
    COND2: soption,
    CONDVALUE: sword,
  });
};

export const getWorkContractDetail = (
  groupCd,
  storecd,
  chargecd,
  paystndcd,
  date
) => {
  return api2.post("/MIHR/HR01_005INS.asmx/getWorkContractDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    CHARGER_CD: chargecd,
    PAY_STCD: paystndcd,
    DATE: date,
  });
};

export const getEmployeesData2 = (groupCd, storecd, chargerNm, workclass) => {
  return api2.post("/MIHR/HR01_005INS.asmx/getEmployeesData2", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    CHARGER_NM: chargerNm,
    WORKCLASS: workclass,
  });
};

export const saveEmpContract = (
  groupcd,
  storeCd,
  empId,
  paystndCd,
  sdate,
  edate,
  cdate,
  lngpay,
  lnghourpay,
  lngwhpay,
  weekfixworkhour,
  remark,
  dayweek1,
  workchk1,
  whchk1,
  workhour1,
  ontime1,
  offtime1,
  dayweek2,
  workchk2,
  whchk2,
  workhour2,
  ontime2,
  offtime2,
  dayweek3,
  workchk3,
  whchk3,
  workhour3,
  ontime3,
  offtime3,
  dayweek4,
  workchk4,
  whchk4,
  workhour4,
  ontime4,
  offtime4,
  dayweek5,
  workchk5,
  whchk5,
  workhour5,
  ontime5,
  offtime5,
  dayweek6,
  workchk6,
  whchk6,
  workhour6,
  ontime6,
  offtime6,
  dayweek7,
  workchk7,
  whchk7,
  workhour7,
  ontime7,
  offtime7,
  dayweeks,
  lngcodes,
  atndType,
  stimes,
  etimes,
  insert
) => {
  return api2.post("/MIHR/HR01_005INS.asmx/saveEmpContract", {
    GROUP_CD: groupcd,
    STORE_CD: storeCd,
    EMPID: empId,
    PAYSTNDCD: paystndCd,
    SDATE: sdate,
    EDATE: edate,
    CDATE: cdate,
    LNGPAY: lngpay,
    LNGHOURPAY: lnghourpay,
    LNGWHPAY: lngwhpay,
    WEEKFIXWORKHOUR: weekfixworkhour,
    REMARK: remark,
    DAYWEEK1: dayweek1,
    WORKCHK1: workchk1,
    WHCHK1: whchk1,
    WORKHOUR1: workhour1,
    ONTIME1: ontime1,
    OFFTIME1: offtime1,
    DAYWEEK2: dayweek2,
    WORKCHK2: workchk2,
    WHCHK2: whchk2,
    WORKHOUR2: workhour2,
    ONTIME2: ontime2,
    OFFTIME2: offtime2,
    DAYWEEK3: dayweek3,
    WORKCHK3: workchk3,
    WHCHK3: whchk3,
    WORKHOUR3: workhour3,
    ONTIME3: ontime3,
    OFFTIME3: offtime3,
    DAYWEEK4: dayweek4,
    WORKCHK4: workchk4,
    WHCHK4: whchk4,
    WORKHOUR4: workhour4,
    ONTIME4: ontime4,
    OFFTIME4: offtime4,
    DAYWEEK5: dayweek5,
    WORKCHK5: workchk5,
    WHCHK5: whchk5,
    WORKHOUR5: workhour5,
    ONTIME5: ontime5,
    OFFTIME5: offtime5,
    DAYWEEK6: dayweek6,
    WORKCHK6: workchk6,
    WHCHK6: whchk6,
    WORKHOUR6: workhour6,
    ONTIME6: ontime6,
    OFFTIME6: offtime6,
    DAYWEEK7: dayweek7,
    WORKCHK7: workchk7,
    WHCHK7: whchk7,
    WORKHOUR7: workhour7,
    ONTIME7: ontime7,
    OFFTIME7: offtime7,
    DAYWEEKS: dayweeks,
    LNGCODES: lngcodes,
    ATNDTYPE: atndType,
    STIMES: stimes,
    ETIMES: etimes,
    INSERT: insert,
  });
};

export const deleteEmpContract = (
  groupCd,
  storecd,
  chargercd,
  paystndCd,
  sdate
) => {
  return api2.post("/MIHR/HR01_005INS.asmx/deleteEmpContract", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    CHARGER_CD: chargercd,
    PAYSTNDCD: paystndCd,
    SDATE: sdate,
  });
};

export const getUnContractEmpList = (
  groupCd,
  attrCd,
  storecd,
  searchType,
  searchText,
  sdate,
  workclass
) => {
  return api2.post("/MIHR/HR01_005INS.asmx/getUnContractEmpList", {
    GROUP_CD: groupCd,
    ATTR_CD: attrCd,
    STORE_CD: storecd,
    SEARCH_TYPE: searchType,
    SEARCH_TEXT: searchText,
    SDATE: sdate,
    WORKCLASS: workclass,
  });
};

export const getPersonnelStatus = (
  groupCd,
  storeCd,
  chargerNo,
  startDate,
  endDate,
  reporttype
) => {
  return api2.post("/MIHR/HR04_002RPT.asmx/getPersonnelStatus", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CHARGER_NO: chargerNo,
    START_DATE: startDate,
    END_DATE: endDate,
    REPORT_TYPE: reporttype,
  });
};

export const getConfirmStatus = (
  groupCd,
  storeCd,
  startMonth,
  endMonth,
  chargerNm
) => {
  return api2.post("/MIHR/HR04_009RPT.asmx/getConfirmStatus", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    START_MONTH: startMonth,
    END_MONTH: endMonth,
    CHARGER_NM: chargerNm,
  });
};
export const getWorkEmpList = (
  groupCd,
  storecd,
  sdate,
  edate,
  cond,
  cond2,
  cond3,
  cond4,
  cond5
) => {
  return api2.post("/MIHR/HR02_002INS.asmx/getWorkEmpList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    SDATE: sdate,
    EDATE: edate,
    NAME: cond,
    ROLE: cond2,
    RANK: cond3,
    WORKPLACE: cond4,
    ORDER: cond5,
  });
};

export const getWorkTypeList = (groupCd) => {
  return api2.post("/MIHR/HR02_002INS.asmx/getWorkTypeList", {
    GROUP_CD: groupCd,
  });
};

export const saveWorkDetail = (
  groupCd,
  storecd,
  lngcode,
  dtmdate,
  lngtype,
  charger,
  atndtype,
  stime,
  etime,
  lngcode2,
  dtmdate2,
  lngcharger2
) => {
  return api2.post("/MIHR/HR02_002INS.asmx/saveWorkDetail", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    LNGCODE: lngcode,
    DTMDATE: dtmdate,
    LNGTYPE: lngtype,
    CHARGER: charger,
    ATNDTYPE: atndtype,
    STIME: stime,
    ETIME: etime,
    LNGCODE2: lngcode2,
    DTMDATE2: dtmdate2,
    CHARGER2: lngcharger2,
  });
};

export const getInitScheduleData = (groupCd, storeCd) => {
  return api2.post("/MIHR/HR02_001INS.asmx/getInitScheduleData", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const getDynamicGrid5 = (sdate, edate) => {
  return api2.post("/MIHR/HR02_001INS.asmx/getDynamicGrid5", {
    SDATE: sdate,
    EDATE: edate,
  });
};

export const getEmpScheduleList = (groupCd, storeCd, sdate, edate) => {
  return api2.post("/MIHR/HR02_001INS.asmx/getEmpScheduleList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    SDATE: sdate,
    EDATE: edate,
  });
};

export const getCommuteDeadline = async (groupCd, yearNo) => {
  return api2.post("/MIHR/HR06_002INS.asmx/getCommuteDeadline", {
    GROUP_CD : groupCd,
    YEAR_NO  : yearNo,
  });
};

export const setCommuteDeadline = async (
  groupCd,
  dtmMonths,
  strNotes,
  lngFlags,
) => {
  return api2.post("/MIHR/HR06_002INS.asmx/setCommuteDeadline", {
    GROUP_CD  : groupCd,
    DTM_MONTH : dtmMonths,
    STR_NOTE  : strNotes,
    LNG_FLAG  : lngFlags,
  });
};

export const getMonthlyMagamStatus = async (groupCd, attrCd, storeCd, yearNo, monthNo, closeStatus) => {
  return api2.post("/MIHR/HR06_002INS.asmx/getMonthlyMagamStatus", {
    GROUP_CD      : groupCd,
    ATTR_CD       : attrCd,
    STORE_CD      : storeCd,
    DTM_YEAR      : yearNo,
    DTM_MONTH     : monthNo,
    SEARCH_TYPE   : closeStatus,
  });
};