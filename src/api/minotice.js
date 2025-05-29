import axios from "axios";
import store from "@/store";
import { commonUrl, commonUrl2 } from "./common";

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

export const getNoticeList2 = (
  groupCd,
  storeCd,
  adminid,
  index,
  searchoption,
  sv,
  lang
) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getNoticeList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ADMIN_ID: adminid,
    INDEX: index,
    SEARCHO: searchoption,
    SEARCHV: sv,
    LANG: lang,
  });
};
export const getNoticeDocCount = (groupCd, storeCd, adminid, so, sv) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getNoticeDocCount", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    ADMIN_ID: adminid,
    SEARCHO: so,
    SEARCHV: sv,
  });
};
export const getInitNoticeInfo = (groupCd) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getInitNoticeInfo", {
    GROUP_CD: groupCd,
  });
};
export const getAdminUserList = (groupCd, adminCd) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getAdminUserList", {
    GROUP_CD: groupCd,
    ADMIN_CD: adminCd,
  });
};
export const getTeamUserList = (groupCd, adminCd) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getTeamUserList", {
    GROUP_CD: groupCd,
    TEAM_CD: adminCd,
  });
};
export const getSCUserList = (groupCd, sccds) => {
  return api2.post("/MINOTICE/NOT01_001INS.asmx/getSCUserList", {
    GROUP_CD: groupCd,
    SC_CD: sccds,
  });
};
