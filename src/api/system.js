import axios from "axios";
import store from "@/store";
import { commonUrl, commonUrl2 } from "./common";
import router from "@/router";

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

api2.interceptors.request.use(
  (config) => {
    const token = store.state.StoreToken;
    //comsole.log(token);
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

export const getuserPageAccessLogReport = (
  groupCd,
  storeAttr,
  storeCds,
  startDate,
  endDate,
  id
) => {
  return api2.post("/MISYSTEM/SYS01_003RPT.asmx/getuserPageAccessLogReport", {
    GROUP_CD: groupCd,
    STORE_ATTR: storeAttr,
    STORE_CDS: storeCds,
    START_DATE: startDate,
    END_DATE: endDate,
    USER_NM: id,
  });
};
export const getUserEnroll = (groupCd, storeCd, cond, cond2) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/getUserEnroll", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CONDITION: cond,
    CONDITION2: cond2,
  });
};
export const getSecureList = (groupCd) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/getSecureList", {
    GROUP_CD: groupCd,
  });
};
export const getLockTypeList = (groupCd, lang) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/getLockTypeList", {
    GROUP_CD: groupCd,
    LANG: lang,
  });
};
export const getSupervisorList = (groupCd, storecd) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/getSupervisorList", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
  });
};
export const checkId = (strName) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/checkId", {
    USER_ID: strName,
  });
};

export const getStoreListforUserEnroll = (groupcd) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/getStoreListforUserEnroll", {
    GROUP_CD: groupcd,
  });
};
export const deleteUserInformation = (flag, sequence) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/deleteUserInformation", {
    FLAG: flag,
    SEQUENCE: sequence,
  });
};
export const saveUserEnroll = (
  flag,
  sequence,
  chargercode,
  chargername,
  strIdNo,
  password,
  lngPositoinType,
  lngposition,
  groupcd,
  userid,
  useradminId,
  lang,
  lockType,
  supplierID,
  blnsupervisor,
  lngsuperattrcd,
  blncompanyamdin
) => {
  return api2.post("/MISYSTEM/SYS49_002INS.asmx/saveUserEnroll", {
    FLAG: flag,
    SEQUENCE: sequence,
    CHARGERCODE: chargercode,
    CHARGERNAME: chargername,
    USER_REGISTER_NO: strIdNo,
    PASSWORD: password,
    POSITION_TYPE: lngPositoinType,
    POSITION: lngposition,
    GROUP_CD: groupcd,
    USER_ID: userid,
    USER_ADMIN_ID: useradminId,
    LANG: lang,
    LOCK_TYPE: lockType,
    SUPPLIER_ID: supplierID,
    BLN_SUPERVISOR: blnsupervisor,
    SUPERVISOR_ATTRCD: lngsuperattrcd,
    BLN_SUPERVISOR_ADMIN: blncompanyamdin,
  });
};
export const getUserPassWordEnroll = (groupCd, storeCd, cond, cond2) => {
  return api2.post("/MISYSTEM/SYS49_003INS.asmx/getUserPassWordEnroll", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CONDITION: cond,
    CONDITION2: cond2,
  });
};
export const saveUserPassWordEnroll = (sequence, password) => {
  return api2.post("/MISYSTEM/SYS49_003INS.asmx/saveUserPassWordEnroll", {
    SEQUENCE: sequence,
    PASSWORD: password,
  });
};
export const validatePassWord = (sequence, password) => {
  return api2.post("/MISYSTEM/SYS49_016INS.asmx/validatePassWord", {
    SEQUENCE: sequence,
    PASSWORD: password,
  });
};
export const savePassWord = (groupcd, sequence, password) => {
  return api2.post("/MISYSTEM/SYS49_016INS.asmx/savePassWord", {
    GROUP_CD: groupcd,
    SEQUENCE: sequence,
    PASSWORD: password,
  });
};
