import router from "@/router";
import store from "@/store";
import axios from "axios";
import { ref } from "vue";

export const commonUrl = "http://211.238.145.43:3000";
export const commonUrl2 = "http://211.238.145.30:8085"; //http://211.238.145.30:8085
// Axios 인스턴스 생성 (기본 설정)
const api = axios.create({
  baseURL: commonUrl, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});
const api2 = axios.create({
  baseURL: commonUrl2, // API 기본 URL
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
// API 요청 메서드들
export const login = async (username, password) => {
  return api2.post("/SYSTEM/system.asmx/getLoginSession", {
    USER_ID: username,
    PASSWORD: password,
  });
};

export const get_sys_list = (lngStoreGroup, lngUserAdminID, strLanguage) => {
  return api2.post("/SYSTEM/system.asmx/getSysMenuList", {
    GROUP_CD: lngStoreGroup,
    USER_ADMIN_ID: lngUserAdminID,
    STR_LANGUAGE: strLanguage,
  });
};
export const get_store_list = (
  lngStoreGroup,
  lngpositiontype,
  blnbrandadmin,
  lngposition,
  lngjointype,
  lngTeamCode,
  lngSupervisor
) => {
  return api2.post("/SYSTEM/sysCom.asmx/getComStoreList", {
    STORE_CD: lngStoreGroup,
    LNG_POSITION_TYPE: lngpositiontype,
    BLN_BRAND_ADMIN: blnbrandadmin,
    LNG_POSITION: lngposition,
    LNG_JOINTYPE: lngjointype,
    LNG_TEAMCODE: lngTeamCode,
    LNG_SUPERVISOR: lngSupervisor,
  });
};
export const getStoreList = (lngStoreGroup, lngStoreCode) => {
  return api2.post("/SYSTEM/sysCom.asmx/getStoreList2", {
    GROUP_CD: lngStoreGroup,
    STORE_CD: lngStoreCode,
  });
};

export const getGridInfoList = async (P_ID, G_ID) => {
  const tabInitSetArray = ref([]);
  const res = await api2.post("/SYSTEM/system.asmx/getGridInfoList", {
    PROG_ID: P_ID,
    GRID_ID: G_ID,
  });

  tabInitSetArray.value = res.data.gridInfo;

  return tabInitSetArray.value;
};
export const getRenderingData = async (P_ID) => {
  const tabInitSetArray = ref([]);
  const res = await api2.post("/SYSTEM/system.asmx/getRenderData", {
    PROG_ID: P_ID,
  });

  tabInitSetArray.value = res.data.renderInfo;

  return tabInitSetArray.value;
};

export const getPosList = async (groupCd, storeCd) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/getPosList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
  return res;
};
export const getPosList2 = async (groupCd, storeCd) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/getPosList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
  return res;
};
export const getKioskList = async (groupCd, storeCd) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/getKioskList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
  return res;
};
export const getStoreAndPosList = async (groupCd, storeCd, posNo) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/getStoreAndPosList", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POSNO: posNo,
  });
  return res;
};
export const getStoreAndPosList2 = async (groupCd, storeCd, posNo) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/getStoreAndPosList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    POSNO: posNo,
  });
  return res;
};
export const getStoreDistinctList = async (groupCd, storeCd, areaCd, posNo) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/getStoreDistinctList", {
    GROUP_CD: groupCd,
  });
  return res;
};

export const getStoreAndPosList3 = async (groupCd, storeCd, areaCd, posNo) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/getStoreAndPosList3", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    AREA_CD: areaCd,
    POSNO: posNo,
  });
  return res;
};
export const savePageLog = async (
  time,
  group,
  store,
  userid,
  userip,
  progname,
  progid,
  bln
) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/savePageLog", {
    TIME: time,
    GROUP: group,
    STORE: store,
    USERID: userid,
    USERIP: userip,
    PROGNAME: progname,
    PROGID: progid,
    BLN: bln,
  });
  return res;
};

export const saveLoginLog = async (
  time,
  group,
  store,
  id,
  pw,
  ip,
  type,
  bln
) => {
  const res = await api2.post("/SYSTEM/sysCom.asmx/saveLoginLog", {
    TIME: time,
    GROUP: group,
    STORE: store,
    USERID: id,
    USERPW: pw,
    USERIP: ip,
    TYPE: type,
    BLN: bln,
  });
  return res;
};
export const alreadyLogined = (token) => {
  return api2.post("/SYSTEM/VERIFYLOGIN.asmx/alreadyLogined", {
    TOKEN: token,
  });
};
export const alreadyMobileLogined = (token) => {
  return api2.post("/SYSTEM/VERIFYLOGIN.asmx/alreadyMobileLogined", {
    TOKEN: token,
  });
};

export const getFavoriteList = (userid) => {
  return api2.post("/SYSTEM/system.asmx/getFavoriteList", {
    USER_ID: userid,
  });
};
export const addFavorite = (progid, userid) => {
  return api2.post("/SYSTEM/system.asmx/addFavorite", {
    PROG_ID: progid,
    USER_ID: userid,
  });
};
export const deleteFavorite = (progid, userid) => {
  return api2.post("/SYSTEM/system.asmx/deleteFavorite", {
    PROG_ID: progid,
    USER_ID: userid,
  });
};

export const createItem = (item) => api.post("/items", item);
export const updateItem = (id, item) => api.put(`/items/${id}`, item);
export const deleteItem = (id) => api.delete(`/items/${id}`);

export const getCommonList = (code) => {
  return api2.post("/SYSTEM/sysCom.asmx/getCommonCode", {
    CODE: code,
  });
};

export const MainDashBoard = (groupcd, storecd, sublease, sequence, lang) => {
  return api2.post("/SYSTEM/sysCom.asmx/getYesterdayClose", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    SUBLEASE: sublease,
    SEQUENCE: sequence,
    LANGUAGE: lang,
  });
};
export const MainDashBoard2 = (groupcd, storecd, sequence) => {
  return api2.post("/SYSTEM/sysCom.asmx/MainDashBoard2", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    SEQUENCE: sequence,
  });
};
export const MainDashBoard3 = (groupcd, storecd) => {
  return api2.post("/SYSTEM/sysCom.asmx/MainDashBoard3", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
  });
};
