import router from "@/router";
import store from "@/store";
import axios from "axios";
import { ref } from "vue";

export const commonUrl2 = "http://www.pncoffice.com:8081/"; //http://211.238.145.30:8085

const api2 = axios.create({
  baseURL: commonUrl2, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});

export const GetLClassInfo = async (cond, cond2) => {
  return api2.post("StockManagementService.asmx/GetLClassInfo", {
    GROUP_CD: cond,
    STORE_CD: cond2,
  });
};
export const GetSClassInfo = async (cond, cond2, cond3, cond4) => {
  return api2.post("StockManagementService.asmx/GetSClassInfo", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    LCLASS_CD: cond3,
    SCLASS_CD: cond4,
  });
};
export const saveStockInfo = async (
  cond,
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
  cond12
) => {
  return api2.post("StockManagementService.asmx/saveStockInfo", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    LCLASS_CD: cond3,
    SCLASS_CD: cond4,
    USE_YN: cond5,
    ALL_DATE: cond6,
    FROM_DATE: cond7,
    TO_DATE: cond8,
    SEL_DAY: cond9,
    ALL_TIME: cond10,
    FROM_TIME: cond11,
    TO_TIME: cond12,
  });
};
