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
export const deletePayItemList = (groupCd, lngcode) => {
  return api2.post("/MIHR/HR01_002INS.asmx/deletePayItemList", {
    GROUP_CD: groupCd,
    LNGCODE: lngcode,
  });
};
