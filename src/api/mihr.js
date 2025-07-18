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
