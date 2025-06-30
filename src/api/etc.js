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
