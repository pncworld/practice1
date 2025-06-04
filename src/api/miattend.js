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
