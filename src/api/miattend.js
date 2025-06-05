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

export const getChargerInfo = (groupCd, storeCd) => {
  return api2.post("/MIATTEND/ATT01_002INS.asmx/getChargerInfo", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};
export const getPositionList = (groupCd, order) => {
  return api2.post("/MIATTEND/ATT07_001INS.asmx/getPositionList", {
    GROUP_CD: groupCd,
    ORDER: order,
  });
};
export const saveEMP = (
  groupCd,
  storeCd,
  code,
  name,
  expire,
  mngno,
  code2,
  name2,
  expire2,
  mngno2,
  dcode
) => {
  return api2.post("/MIATTEND/ATT01_002INS.asmx/saveEMP", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    UCODE: code,
    UNAME: name,
    UEXPIRE: expire,
    UMNGNO: mngno,
    ICODE: code2,
    INAME: name2,
    IEXPIRE: expire2,
    IMNGNO: mngno2,
    DELETECODE: dcode,
  });
};

export const savePosition = (
  groupCd,
  rankcode,
  strrank,
  lngorder,
  lngdelete,
  userid,
  userip,
  settype,
  intgrade
) => {
  return api2.post("/MIATTEND/ATT07_001INS.asmx/savePosition", {
    GROUP_CD: groupCd,
    RANKCODE: rankcode,
    STRRANK: strrank,
    LNGORDER: lngorder,
    LNGDELETE: lngdelete,
    USERID: userid,
    USERIP: userip,
    SETTYPE: settype,
    INTGRADE: intgrade,
  });
};
export const saveRole = (
  groupCd,
  classcode,
  strclass,
  possetting,
  lngdelete,
  userid,
  userip,
  settype,
  intgrade
) => {
  return api2.post("/MIATTEND/ATT07_002INS.asmx/saveRole", {
    GROUP_CD: groupCd,
    CLASSCODE: classcode,
    STRCLASS: strclass,
    POS_SET: possetting,
    LNGDELETE: lngdelete,
    USERID: userid,
    USERIP: userip,
    SETTYPE: settype,
    INTGRADE: intgrade,
  });
};

export const saveWorkLocation = (
  groupCd,
  areacd,
  strarea,
  lngdelete,
  userid,
  userip,
  settype
) => {
  return api2.post("/MIATTEND/ATT07_003INS.asmx/saveWorkLocation", {
    GROUP_CD: groupCd,
    AREACODE: areacd,
    STRAREA: strarea,
    LNGDELETE: lngdelete,
    USERID: userid,
    USERIP: userip,
    SETTYPE: settype,
  });
};

export const deletePosition = (groupCd, rankcode, userid, userip) => {
  return api2.post("/MIATTEND/ATT07_001INS.asmx/deletePosition", {
    GROUP_CD: groupCd,
    RANKCODE: rankcode,

    USERID: userid,
    USERIP: userip,
  });
};
export const deleteRole = (groupCd, rankcode, userid, userip) => {
  return api2.post("/MIATTEND/ATT07_002INS.asmx/deleteRole", {
    GROUP_CD: groupCd,
    CLASSCODE: rankcode,

    USERID: userid,
    USERIP: userip,
  });
};
export const deleteWorkLocation = (groupCd, rankcode, userid, userip) => {
  return api2.post("/MIATTEND/ATT07_003INS.asmx/deleteWorkLocation", {
    GROUP_CD: groupCd,
    AREACODE: rankcode,

    USERID: userid,
    USERIP: userip,
  });
};

export const getRoleList = (groupCd, order) => {
  return api2.post("/MIATTEND/ATT07_002INS.asmx/getRoleList", {
    GROUP_CD: groupCd,
    ORDER: order,
  });
};
export const getWorkLocation = (groupCd, order) => {
  return api2.post("/MIATTEND/ATT07_003INS.asmx/getWorkLocation", {
    GROUP_CD: groupCd,
    ORDER: order,
  });
};
