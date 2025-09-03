import axios from "axios";

export const commonUrl2 = "https://www.pncapi.kr:8083/"; //http://www.pncoffice.com:8081/

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
export const GetMenuStkInfo = async (
  cond,
  cond2,
  cond3,
  cond4,
  cond5,
  cond6
) => {
  return api2.post("StockManagementService.asmx/GetMenuStkInfo", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    LCLASS_CD: cond3,
    SCLASS_CD: cond4,
    MENU_STS: cond5,
    MENU_NM: cond6,
  });
};
export const SetSClassStkRgst = async (
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
  return api2.post("StockManagementService.asmx/SetSClassStkRgst", {
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

export const SetMenuStkRgst = async (cond, cond2, cond3) => {
  return api2.post("StockManagementService.asmx/SetMenuStkRgst", {
    GROUP_CD: cond,
    STORE_CD: cond2,
    MenuList: cond3,
  });
};
export const setEmployeeInfo = async (cond, cond2, cond3) => {
  return api2.post("CJFWBaeminEmpSaleService.asmx/GET_EMP_CUST_LIST", {
    strCustCompCode: cond,
    strRcvID: cond2,
    REG_ID: cond3,
  });
};
export const setEmployeeInfo2 = async (cond, cond2, cond3, cond4, cond5) => {
  return api2.post("FoodistInterfaceService.asmx/GET_EMP_CUST_LIST", {
    strCustCompCode: cond,
    strRcvID: cond2,
    strRegID: cond3,
    strDate: cond4,
    strBpID: cond5,
  });
};
