import axios from "axios";
import { commonUrl2 } from "./common";

const api2 = axios.create({
  baseURL: commonUrl2, // API 기본 URL
  timeout: 30000, // 요청 타임아웃 설정
});

// api2.interceptors.request.use(
//   (config) => {
//     const token = store.state.StoreToken;
//     //comsole.log(token);
//     config.headers["Authorization"] = `Bearer ${token}`;

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export const getSalesInfoByCorner2 = (groupCd, type, storeCd, cornerCd) => {
  return api2.post("/VUEPOS/MST56_001INS.asmx/getSalesInfoByCorner2", {
    GROUP_CD: groupCd,
    TYPE: type,
    STORE_CD: storeCd,
    CORNER_CD: cornerCd,
  });
};

export const saveCornerInfoList2 = (
  groupCd,
  storecds,
  cornercds,
  stktypes,
  openhours,
  openmins,
  closehours,
  closemins,
  userid
) => {
  return api2.post("/VUEPOS/MST56_001INS.asmx/saveCornerInfoList2", {
    GROUP_CD: groupCd,
    STORE_CD: storecds,
    CORNER_CD: cornercds,
    STK_TYPES: stktypes,
    OPENHOURS: openhours,
    OPENMINS: openmins,
    CLOSEHOURS: closehours,
    CLOSEMINS: closemins,
    USERID: userid,
  });
};

export const saveMenuInfo2 = (groupCd, storeCd, menuCd, cond, cond2) => {
  return api2.post("/VUEPOS/MST56_001INS.asmx/saveMenuInfo2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    MENU_CD: menuCd,
    STS: cond,
    USER_ID: cond2,
  });
};

export const getMenuConList2 = (
  groupCd,
  storeCd,
  cornerCd,
  cond,
  cond2,
  cond3
) => {
  return api2.post("/VUEPOS/MST56_001INS.asmx/getMenuConList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CORNER_CD: cornerCd,
    COND: cond,
    COND2: cond2,
    COND3: cond3,
  });
};
export const getSoldMenuList2 = (groupCd, storeCd, cornerCd, cond, cond2) => {
  return api2.post("/VUEPOS/MST56_001INS.asmx/getSoldMenuList2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    CORNER_CD: cornerCd,
    COND: cond,
    COND2: cond2,
  });
};

export const getMenuStock2 = (groupCd, storecd, cond) => {
  return api2.post("/VUEPOS/MST37_071INS.asmx/getMenuStock2", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    COND: cond,
  });
};

export const saveMenuStock2 = (groupCd, storecd, cond) => {
  return api2.post("/VUEPOS/MST37_071INS.asmx/saveMenuStock", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    COND: cond,
  });
};

export const getCustomorInfo2 = (cond, cond2, cond3, cond4, cond5, cond6) => {
  return api2.post("/VUEPOS/CRM20_003INS.asmx/getCustomorInfo2", {
    COMP_CD: cond,
    COND: cond2,
    COND2: cond3,
    COND3: cond4,
    COND4: cond5,
    COND5: cond6,
  });
};

export const getBelongCust2 = (custcode, searchword, type) => {
  return api2.post("/VUEPOS/CRM20_007RPT.asmx/getBelongCust2", {
    CUST_CD: custcode,
    SEARCHWORD: searchword,
    TYPE: type,
  });
};

export const checkCardNumbyAccount2 = (cond, cond2, cond3) => {
  return api2.post("/VUEPOS/CRM20_003INS.asmx/checkCardNumbyAccount2", {
    CUST_CD: cond,
    COND: cond2,
    COND2: cond3,
  });
};
export const deleteSpecialPrices2 = (SpecialMenuCode) => {
  return api2.post("/VUEPOS/MST37_069INS.asmx/deleteSpecialPrices2", {
    MENU_CD: SpecialMenuCode,
  });
};
export const deleteCustomors32 = (custcode, custid, cond) => {
  return api2.post("/VUEPOS/CRM20_003INS.asmx/deleteCustomors32", {
    CUST_CD: custcode,
    CUST_ID: custid,
    COND: cond,
  });
};

export const saveCreditCustomer3 = (
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
  cond12,
  cond13,
  cond14,
  cond15,
  cond16,
  cond17,
  cond18,
  cond19,
  cond20,
  cond21,
  cond22,
  cond23,
  cond24,
  cond25,
  cond26
) => {
  return api2.post("/VUEPOS/CRM20_003INS.asmx/saveCreditCustomer3", {
    USER_ID: cond,
    FLAG: cond2,
    SALECOMPCD: cond3,
    CUSTID: cond4,
    CUSTNAME: cond5,
    REGISTNO: cond6,
    TELNO: cond7,
    TELNO2: cond8,
    POSTTELNO: cond9,
    EMAIL: cond10,
    STRZIP: cond11,
    ADDRESS: cond12,
    ADDRESS2: cond13,
    REMARK: cond14,
    REGISTDATE: cond15,
    CUSTSTS: cond16,
    DIRECTER: cond17,
    DEALKIND: cond18,
    DEALTYPE: cond19,
    ACCSTS: cond20,
    DEPTCD: cond21,
    DEPTNM: cond22,
    BTYPE: cond23,
    BCUSTID: cond24,
    BCUSTNM: cond25,
    LIMITAMT: cond26,
  });
};

export const saveNewCardNo2 = (
  compcd,
  custid,
  type,
  cardNo,
  cardSts,
  userid,
  flag
) => {
  return api2.post("/VUEPOS/CRM20_003INS.asmx/saveNewCardNo2", {
    COMP_CD: compcd,
    CUST_ID: custid,
    TYPE: type,
    CARD_NO: cardNo,
    CARD_STS: cardSts,
    USER_ID: userid,
    FLAG: flag,
  });
};

export const getCardInfo22 = (cond, cond2, cond3) => {
  return api2.post("/VUEPOS/CRM20_003INS.asmx/getCardInfo22", {
    CUST_CD: cond,
    COND: cond2,
    COND2: cond3,
  });
};

export const getCustCompany4 = (groupCd, storecd, positiontype) => {
  return api2.post("/VUEPOS/CRM20_003INS.asmx/getCustCompany4", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    LNG_POSITION: positiontype,
  });
};

export const getBalancebyCustAndDate2 = (
  custcode,
  custid,
  startdate,
  enddate,
  cond,
  cond2
) => {
  return api2.post("/VUEPOS/CRM20_007RPT.asmx/getBalancebyCustAndDate2", {
    CUST_CD: custcode,
    CUST_ID: custid,
    START_DATE: startdate,
    END_DATE: enddate,
    COND: cond,
    COND2: cond2,
  });
};

export const saveCreditCustomer4 = (
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
  cond12,
  cond13,
  cond14,
  cond15,
  cond16,
  cond17,
  cond18,
  cond19,
  cond20,
  cond21,
  cond22,
  cond23,
  cond24,
  cond25,
  cond26
) => {
  return api2.post("/VUEPOS/CRM20_011INS.asmx/saveCreditCustomer4", {
    USER_ID: cond,
    FLAG: cond2,
    SALECOMPCD: cond3,
    CUSTID: cond4,
    CUSTNAME: cond5,
    REGISTNO: cond6,
    TELNO: cond7,
    TELNO2: cond8,
    POSTTELNO: cond9,
    EMAIL: cond10,
    STRZIP: cond11,
    ADDRESS: cond12,
    ADDRESS2: cond13,
    REMARK: cond14,
    REGISTDATE: cond15,
    CUSTSTS: cond16,
    DIRECTER: cond17,
    DEALKIND: cond18,
    DEALTYPE: cond19,
    ACCSTS: cond20,
    DEPTCD: cond21,
    DEPTNM: cond22,
    BTYPE: cond23,
    BCUSTID: cond24,
    BCUSTNM: cond25,
    LIMITAMT: cond26,
  });
};

export const getDemandStoreList2 = (groupCd, attr) => {
  return api2.post("/VUEPOS/STK01_011INS.asmx/getDemandStoreList2", {
    GROUP_CD: groupCd,
    ATTR: attr,
  });
};

export const getDemCloseTime2 = (groupCd, storeCd) => {
  return api2.post("/VUEPOS/STK01_011INS.asmx/getDemCloseTime2", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
  });
};

export const updateDemandMaster2 = (
  groupCd,
  storecd,
  date,
  demandno,
  comment
) => {
  return api2.post("/VUEPOS/STK01_011INS.asmx/updateDemandMaster2", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DATE: date,
    DEMANDNO: demandno,
    COMMENT: comment,
  });
};

export const InsertDemandMasterDetail2 = (
  groupCd,
  storecd,
  date,
  comments,
  classtype,
  ddate,
  edate,
  stockids,
  qtys,
  userid,
  specialyn,
  char,
  comments2
) => {
  return api2.post("/VUEPOS/STK01_011INS.asmx/InsertDemandMasterDetail2", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DATE: date,
    COMMENT: comments,
    CLASSTYPE: classtype,
    DDATE: ddate,
    EDATE: edate,
    STOCKIDS: stockids,
    QTYS: qtys,
    USERID: userid,
    SPECIAL: specialyn,
    CHAR: char,
    COMMENTS: comments2,
  });
};

export const getStockDemandList22 = (groupCd, storeCd, lang, sdate, edate) => {
  return api2.post("/VUEPOS/STK01_011INS.asmx/getStockDemandList22", {
    GROUP_CD: groupCd,
    STORE_CD: storeCd,
    LANG: lang,
    SDATE: sdate,
    EDATE: edate,
  });
};

export const getStockDetail22 = (
  groupCd,
  storecd,
  lang,
  demandno,
  demanddate
) => {
  return api2.post("/VUEPOS/STK01_011INS.asmx/getStockDetail22", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    LANG: lang,
    DEMANDNO: demandno,
    DEMANDDATE: demanddate,
  });
};

export const deleteDemandMaster2 = (
  groupCd,
  storecd,
  demandno,
  date,
  userid
) => {
  return api2.post("/VUEPOS/STK01_011INS.asmx/deleteDemandMaster2", {
    GROUP_CD: groupCd,
    STORE_CD: storecd,
    DEMANDNO: demandno,
    DATE: date,
    USERID: userid,
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
