import axios from "axios";
import { commonUrl2 } from "./common";
import store from "@/store";

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

export const getSubGroup3 = async (cond, cond2) => {
  return api2.post("/MIPOS/MST01_001POS.asmx/getSubGroup3", {
    GROUP_CD: cond,
    STORE_CD: cond2,
  });
};
export const InsertMenu = async (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6,
  cond7,
  cond8,
  cond9
) => {
  return api2.post("/MIPOS/MST01_001POS.asmx/InsertMenu", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    SUG_GROUP: cond3,
    PRICE: cond4,
    MENU_CD: cond5,
    MENU_NM: cond6,
    AUTO_CHECK: cond7,
    COOK_PRINT: cond8,
    BLNOPEN: cond9,
  });
};
