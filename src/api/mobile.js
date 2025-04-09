import axios from "axios";
import { commonUrl, commonUrl2 } from "./common";
import store from "@/store";
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
export const mobileLogin = (userid, password) => {
  return api2.post("/MOBILE/LOGIN_ANDROID.asmx/mobileLogin", {
    USER_ID: userid,
    PASSWORD: password,
  });
};
export const getMobileProgList = (groupcd, storecd, userno) => {
  return api2.post("/MOBILE/MOBILE_PROGLIST.asmx/getMobileProgList", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    USER_NO: userno,
  });
};
export const getMobileDashBoard = (groupcd, storecd, userno) => {
  return api2.post("/MOBILE/MAINSALE_REPORT.asmx/getMobileDashBoard", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    USER_NO: userno,
  });
};
export const getAppStoreList = (groupcd, storecd, userno) => {
  return api2.post("/MOBILE/STORE_LIST.asmx/getAppStoreList", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    USER_NO: userno,
  });
};
export const getMobileDetailSales = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TOTAL_DETAIL_SALE.asmx/getMobileDetailSales", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileGroupSales = (groupcd, storecd, startdate, enddate) => {
  return api2.post(
    "/MOBILE/TOTAL_MENUGROUP_DETAIL_SALE.asmx/getMobileGroupSales",
    {
      GROUP_CD: groupcd,
      STORE_CD: storecd,
      START_DATE: startdate,
      END_DATE: enddate,
    }
  );
};
export const getMobileSalesByMenu = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TOTAL_MENU_SALES.asmx/getMobileSalesByMenu", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getSalesByCreditCard = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TOTAL_CREDIT_SALES.asmx/getSalesByCreditCard", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileSalesByTime = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TOTAL_TIME_SALES.asmx/getMobileSalesByTime", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileSalesByStore = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TOTAL_STORE_SALES.asmx/getMobileSalesByStore", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileSalesByRealTime = (
  groupcd,
  storecd,
  startdate,
  enddate
) => {
  return api2.post("/MOBILE/REAL_TIME_SALES.asmx/getMobileSalesByRealTime", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileSalesbyDays = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TOTAL_DAILY_SALES.asmx/getMobileSalesbyDays", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileVoidReport = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TOTAL_VOID_REPORT.asmx/getMobileVoidReport", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileOpenCloseReport = (
  groupcd,
  storecd,
  startdate,
  enddate
) => {
  return api2.post("/MOBILE/CLOSE_OPEN_REPORT.asmx/getMobileOpenCloseReport", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileTaxReport = (groupcd, storecd, startdate, enddate) => {
  return api2.post("/MOBILE/TAX_REPORT.asmx/getMobileTaxReport", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    START_DATE: startdate,
    END_DATE: enddate,
  });
};
export const getMobileSeatInfo = (groupcd, storecd, userno, seat) => {
  return api2.post("/MOBILE/TABLE_USE_INFO.asmx/getMobileSeatInfo", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    USER_NO: userno,
    SEAT_SET: seat,
  });
};
export const getNoticeList = (
  groupcd,
  storecd,
  userno,
  idnex,
  block,
  searchtype,
  search
) => {
  return api2.post("/MOBILE/NOTICE_DOC_LIST.asmx/getNoticeList", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    USER_NO: userno,
    INDEX: idnex,
    BLOCK: block,
    SEARCH_TYPE: searchtype,
    SEARCH: search,
  });
};

export const getNoticeDetail = (groupcd, storecd, userno, noticeid) => {
  return api2.post("/MOBILE/NOTICE_DOC_LIST.asmx/getNoticeDetail", {
    GROUP_CD: groupcd,
    STORE_CD: storecd,
    USER_NO: userno,
    NOITICE_ID: noticeid,
  });
};
